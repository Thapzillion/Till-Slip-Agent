import React, { useEffect, useRef, useState } from "react";

import "./AdminPanel.css";
import { supabase } from './supabaseClient';

import { useBusiness } from "./backend/businessService";

import { useNavigate } from "react-router-dom";

import Analysis from "./Analysis";
import ConnectedStores from "./ConnectedStores";
import AgentParameters from "./AgentParameters";
import TillSlipsCollection from "./TillSlipsCollection";

import {
  LayoutDashboard,
  Store,
  SlidersHorizontal,
  FileText,
  Eye, EyeOff, ShieldCheck, ArrowLeft, CheckCircle2, Sparkles
} from "lucide-react";

export default function AdminPanel() {

  const [activeTab, setActiveTab] = useState("agent-parameters");

  // -----------------------------
  // BACKEND
  // -----------------------------

  const {
    // Authentication
    user,
    email,
    password,
    rememberMe,
    businessName,
    confirmPassword,
    agreeTerms,
    authMode,
    newPassword,
    confirmNewPassword,

    setEmail,
    setPassword,
    setRememberMe,
    setBusinessName,
    setConfirmPassword,
    setAgreeTerms,
    setAuthMode,
    setNewPassword,
    setConfirmNewPassword,

    handleAuth,
    handleForgotPassword,
    handleResetPassword,
    handleResendVerification,

    isAuthSyncing,
    signupSuccessMessage,

    // Business
    settings,
    setSettings,
    saveSettings,
    uploadLogo,

    // Subscription
    showTrialWelcomeModal,
    setShowTrialWelcomeModal,
    subscription,
    subscriptionLoading,
    trialDaysRemaining,
    trialExpiryDate,
    showSubscriptionModal,
    setShowSubscriptionModal,

    // Analytics
    analytics,
    loadingAnalytics,

    // Receipts
    receipts,
    receiptTemplates,

    // Prompt Builder
    inputPrompt,
    setInputPrompt,

    messages,
    setMessages,

    isLoading,

    handleSendPrompt,
    handleClear,
    handleSave,
    isSaveSyncing,

    receiptData,
    setReceiptData,

    receipt,
    setReceipt,

    selectedTemplateId,
    setSelectedTemplateId,

    // Misc
    loading,
    error,
    isCheckingSession,
    successMessage

  } = useBusiness();

  const navigate = useNavigate();

  const [showAccountMenu, setShowAccountMenu] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

  // ------------------------------------------------------------
  // PAGE / DATABASE SYNCHRONIZATION
  // Every sidebar navigation request first reads the relevant
  // Supabase data. The RuachAgent loader remains visible until
  // those database reads have completed.
  // ------------------------------------------------------------
  const [isPageLoading, setIsPageLoading] = useState(false);
  const [pageLoadingProgress, setPageLoadingProgress] = useState(0);
  const [pageLoadingMessage, setPageLoadingMessage] = useState(
    "Preparing RuachAgent workspace..."
  );
  const [databaseRefreshKey, setDatabaseRefreshKey] = useState(0);

  const pageLabels = {
    analysis: "Analysis",
    "connected-stores": "Connected Stores",
    "agent-parameters": "Agent Parameters",
    "till-slips-collection": "Till Slips Collection"
  };

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const loadPageFromSupabase = async (nextTab) => {
    if (!user?.id) {
      setActiveTab(nextTab);
      return;
    }

    setShowAccountMenu(false);
    setIsPageLoading(true);
    setPageLoadingProgress(8);
    setPageLoadingMessage(`Connecting to Supabase...`);

    try {
      // STEP 1 — business_settings is the central merchant record.
      setPageLoadingProgress(24);
      setPageLoadingMessage("Reading business settings...");

      const { data: businessSettings, error: settingsError } = await supabase
        .from("business_settings")
        .select("*")
        .eq("owner_id", user.id)
        .maybeSingle();

      if (settingsError) {
        throw settingsError;
      }

      // Push the freshly-read database row into the existing AdminPanel
      // state so Agent Parameters and any consumers of settings receive
      // the actual persisted Supabase values.
      if (businessSettings && typeof setSettings === "function") {
        setSettings(businessSettings);
      }

      setPageLoadingProgress(46);

      const businessId = businessSettings?.id || settings?.id || null;

      // STEP 2 — read the tables relevant to the destination page.
      // The loader does not complete until these Supabase reads resolve.
      if (nextTab === "connected-stores") {
        setPageLoadingMessage("Synchronizing connected stores...");

        if (!businessId) {
          throw new Error("No business profile was returned from business_settings.");
        }

        const { error: storesError } = await supabase
          .from("connected_stores")
          .select("*")
          .eq("business_id", businessId);

        if (storesError) throw storesError;
      }

      if (nextTab === "analysis") {
        setPageLoadingMessage("Synchronizing merchant activity...");

        if (!businessId) {
          throw new Error("No business profile was returned from business_settings.");
        }

        const [receiptsResult, vouchersResult] = await Promise.all([
          supabase
            .from("receipts")
            .select("*")
            .eq("business_id", businessId),
          supabase
            .from("loyalty_vouchers")
            .select("*")
            .eq("business_id", businessId)
        ]);

        if (receiptsResult.error) throw receiptsResult.error;
        if (vouchersResult.error) throw vouchersResult.error;
      }

      if (nextTab === "till-slips-collection") {
        setPageLoadingMessage("Synchronizing saved receipt designs...");

        // receipt_design_config is stored on business_settings, so the
        // business_settings read above is the authoritative database
        // synchronization for this page.
        if (!businessSettings?.id) {
          throw new Error("No business settings record is available.");
        }

        await sleep(180);
      }

      if (nextTab === "agent-parameters") {
        setPageLoadingMessage("Loading saved agent parameters...");
        await sleep(180);
      }

      // STEP 3 — the database synchronization has completed.
      setPageLoadingProgress(78);
      setPageLoadingMessage(`Applying ${pageLabels[nextTab]} data...`);

      // Give React one render cycle to apply the newly retrieved state.
      await sleep(220);

      setDatabaseRefreshKey((value) => value + 1);
      setPageLoadingProgress(100);
      setPageLoadingMessage(`${pageLabels[nextTab]} ready.`);

      // Keep the finished logo state visible very briefly so the transition
      // feels intentional rather than flashing between two screens.
      await sleep(360);

      setActiveTab(nextTab);
    } catch (syncError) {
      console.error("RuachAgent page synchronization failed:", syncError);
      setPageLoadingProgress(100);
      setPageLoadingMessage(
        "Database synchronization failed. Please try again."
      );
      await sleep(900);
    } finally {
      setIsPageLoading(false);
    }
  };

  const styles = {
    container: {
      zoom: 0.70,
      minHeight: 'calc(100vh / 0.70)',
      width: '100%',
      background: '#000000',
      color: '#ffffff',
      boxSizing: 'border-box'
    },
    modalOverlay: {
      position: 'fixed',
      inset: 0,
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '44px'
    },
    flatCard: {
      padding: '48px',
      border: '1px solid rgba(0, 217, 255, 0)',
      borderRadius: '18px',
      background: 'rgba(1, 4, 6, 0.96)',
      boxShadow: '0 22px 60px rgba(3, 102, 141, 0.45)',
      boxSizing: 'border-box'
    },
    button: {
      minHeight: '44px',
      padding: '10px 16px',
      borderRadius: '10px',
      border: '1px solid rgba(38,216,255,0.3)',
      background: 'linear-gradient(135deg, #26d8ff, #1299b8)',
      color: '#ffffff',
      fontWeight: 600,
      cursor: 'pointer'
    },
    header: {
      width: '100%',
      minHeight: '82px',
      padding: '22px 44px',
      boxSizing: 'border-box',
      background: 'rgba(9,11,15,0.82)',
      borderBottom: '1px solid #000000'
    },
    input: {
      width: '100%',
      minHeight: '44px',
      padding: '20px 22px',
      border: '1px solid #000000',
      borderRadius: '10px',
      background: '#0b0d11',
      color: '#ffffff',
      boxSizing: 'border-box'
    },
  };

  const authAnimations = `
  @keyframes ruachGlassFloat {
    0%, 100% {
      transform: translate3d(0, 0, 0) scale(1);
    }
    50% {
      transform: translate3d(0, -18px, 0) scale(1.04);
    }
  }

  @keyframes ruachGlassFloatReverse {
    0%, 100% {
      transform: translate3d(0, 0, 0) scale(1);
    }
    50% {
      transform: translate3d(16px, 14px, 0) scale(1.06);
    }
  }

  @keyframes ruachGlassPulse {
    0%, 100% {
      opacity: .35;
      transform: scale(.96);
    }
    50% {
      opacity: .75;
      transform: scale(1.04);
    }
  }

  @keyframes ruachGlassShimmer {
    0% {
      transform: translateX(-130%);
    }
    100% {
      transform: translateX(130%);
    }
  }

  @keyframes ruachAuthAppear {
    from {
      opacity: 0;
      transform: translateY(22px) scale(.97);
      filter: blur(8px);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
      filter: blur(0);
    }
  }

  @keyframes ruachModeIn {
    from {
      opacity: 0;
      transform: translateY(8px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes ruachBorderGlow {
    0%, 100% {
      box-shadow:
        0 0 0 1px rgba(255,255,255,.14) inset,
        0 0 35px rgba(80,190,255,.08);
    }
    50% {
      box-shadow:
        0 0 0 1px rgba(255,255,255,.22) inset,
        0 0 55px rgba(80,190,255,.17);
    }
  }

  @keyframes ruachIconFloat {
    0%, 100% {
      transform: translateY(0) rotate(0deg);
    }
    50% {
      transform: translateY(-4px) rotate(2deg);
    }
  }

  .ruach-auth-card {
    animation:
      ruachAuthAppear .65s cubic-bezier(.16,1,.3,1),
      ruachBorderGlow 4s ease-in-out infinite;
  }

  .ruach-auth-mode {
    animation: ruachModeIn .35s cubic-bezier(.16,1,.3,1);
  }

  .ruach-glass-orb-one {
    animation: ruachGlassFloat 8s ease-in-out infinite;
  }

  .ruach-glass-orb-two {
    animation: ruachGlassFloatReverse 10s ease-in-out infinite;
  }

  .ruach-glass-orb-three {
    animation: ruachGlassPulse 6s ease-in-out infinite;
  }

  .ruach-auth-icon {
    animation: ruachIconFloat 4s ease-in-out infinite;
  }

  .ruach-glass-button {
    position: relative;
    overflow: hidden;
    transition:
      transform .2s ease,
      box-shadow .2s ease,
      background .2s ease;
  }

  .ruach-glass-button:hover {
    transform: translateY(-2px);
    box-shadow:
      0 12px 30px rgba(0,160,255,.20),
      0 0 25px rgba(0,190,255,.16);
  }

  .ruach-glass-button:active {
    transform: translateY(0) scale(.985);
  }

  .ruach-glass-button::after {
    content: "";
    position: absolute;
    top: 0;
    left: -120%;
    width: 55%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255,255,255,.38),
      transparent
    );
    transform: skewX(-18deg);
    transition: none;
  }

  .ruach-glass-button:hover::after {
    animation: ruachGlassShimmer .75s ease;
  }

  .ruach-glass-input {
    transition:
      border-color .2s ease,
      box-shadow .2s ease,
      background .2s ease,
      transform .2s ease;
  }

  .ruach-glass-input:focus {
    outline: none;
    border-color: rgba(80,190,255,.78) !important;
    background: rgba(255,255,255,.18) !important;
    box-shadow:
      0 0 0 3px rgba(80,190,255,.10),
      0 0 24px rgba(80,190,255,.12);
    transform: translateY(-1px);
  }

  .ruach-glass-input::placeholder {
    color: rgba(0,0,0,.43);
  }

  .ruach-password-wrap {
    position: relative;
  }

  .ruach-password-wrap input {
    padding-right: 52px !important;
  }

  .ruach-eye-button {
    position: absolute;
    right: 7px;
    top: 50%;
    transform: translateY(-50%);
    width: 38px;
    height: 38px;
    border: none;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255,255,255,.42);
    color: #111;
    cursor: pointer;
    transition:
      background .2s ease,
      color .2s ease,
      transform .2s ease;
  }

  .ruach-eye-button:hover {
    background: rgba(100,200,255,.20);
    color: #008ed6;
    transform: translateY(-50%) scale(1.05);
  }

  @media (max-width: 560px) {
    .ruach-auth-card {
      padding: 26px !important;
      border-radius: 28px !important;
    }
  }
`;

  const accountMenuButtonStyle = {
    width: "100%",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "11px 12px",
    border: "none",
    borderRadius: "10px",
    background: "transparent",
    color: "#dce7f2",
    fontSize: "9px",
    fontWeight: 500,
    cursor: "pointer",
    textAlign: "left",
    transition: "all .2s ease"
  };


  // --- CRITICAL PERSISTENT GATE CONDITIONAL RENDER ---
  if (isCheckingSession) {
    return (
      <div style={{
        ...styles.container,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: '#0a0a0a',
        color: '#ffffff',
        fontFamily: 'monospace',
        fontSize: '13px',
        letterSpacing: '1px'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ marginBottom: '12px', fontSize: '24px', animation: 'pulse 1.5s infinite' }}>⚡</div>
          SYNCHRONIZING SECURE NODE IDENTITY...
        </div>
      </div>
    );
  }

  return (
    <div style={{ ...styles.container, opacity: isAuthSyncing ? 0.6 : 1 }}>

      {/* GLOBAL MODAL 3: Premium Payment Negotiation */}
      {showSubscriptionModal && (
        <div
          style={{
            ...styles.modalOverlay,
            background:
              "radial-gradient(circle at top, rgba(0,255,170,0.08), rgba(0,0,0,0.94) 45%, #000000 100%)",
            backdropFilter: "blur(12px)",
          }}
        >
          <div
            style={{
              ...styles.flatCard,
              maxWidth: "460px",
              width: "90%",
              textAlign: "center",
              position: "relative",
              overflow: "hidden",
              border: "1px solid rgba(0,255,170,0.25)",
              borderRadius: "24px",
              background:
                "linear-gradient(145deg, #050505 0%, #071822 55%, #02110d 100%)",
              boxShadow:
                "0 0 20px rgba(0,255,170,0.18), 0 0 45px rgba(0,198,255,0.12)",
            }}
          >
            {/* Neon Background Glow */}
            <div
              style={{
                position: "absolute",
                top: "-90px",
                left: "50%",
                transform: "translateX(-50%)",
                width: "260px",
                height: "260px",
                borderRadius: "50%",
                background:
                  "radial-gradient(circle, rgba(0,255,170,0.28) 0%, rgba(0,198,255,0.12) 45%, transparent 75%)",
                filter: "blur(30px)",
                pointerEvents: "none",
              }}
            />

            {/* Lock Icon */}
            <div
              style={{
                width: "82px",
                height: "82px",
                margin: "0 auto 22px",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "40px",
                background:
                  "linear-gradient(135deg, #00F5A0, #00C6FF)",
                boxShadow:
                  "0 0 20px rgba(0,255,170,0.45), 0 0 45px rgba(0,198,255,0.35)",
              }}
            >
              🔒
            </div>

            <div
              style={{
                color: "#00F5A0",
                fontSize: "12px",
                fontWeight: 700,
                letterSpacing: "3px",
                marginBottom: "12px",
              }}
            >
              PREMIUM MEMBERSHIP REQUIRED
            </div>

            <h2
              style={{
                color: "#ffffff",
                marginBottom: "14px",
                fontSize: "28px",
                fontWeight: 700,
                textShadow: "0 0 12px rgba(0,198,255,0.35)",
              }}
            >
              Your Free Trial Has Expired
            </h2>

            <p
              style={{
                color: "#b9c7cf",
                fontSize: "15px",
                lineHeight: "1.8",
                marginBottom: "28px",
              }}
            >
              To continue using <strong style={{ color: "#00F5A0" }}>RuachAgent</strong>
              {" "}Premium features and maintain uninterrupted access to your merchant
              dashboard, please upgrade your subscription.
            </p>

            {/* Plan Details Card */}
            <div
              style={{
                background:
                  "linear-gradient(145deg, rgba(0,198,255,0.08), rgba(0,255,170,0.06))",
                borderRadius: "18px",
                padding: "22px",
                marginBottom: "28px",
                border: "1px solid rgba(0,255,170,0.25)",
                boxShadow:
                  "0 0 20px rgba(0,198,255,0.08)",
              }}
            >
              <div
                style={{
                  color: "#ffffff",
                  fontWeight: "700",
                  fontSize: "18px",
                  marginBottom: "8px",
                }}
              >
                Merchant Pro Plan
              </div>

              <div
                style={{
                  color: "#00F5A0",
                  fontSize: "34px",
                  fontWeight: "800",
                  textShadow: "0 0 15px rgba(0,255,170,.45)",
                }}
              >
                $6.99 [R129.00]
                <span
                  style={{
                    fontSize: "14px",
                    color: "#9ca3af",
                    fontWeight: "500",
                  }}
                >
                  {" "}
                  / month
                </span>
              </div>

              <div
                style={{
                  marginTop: "14px",
                  color: "#8fdcff",
                  fontSize: "13px",
                }}
              >
                ✓ Unlimited premium access
                <br />
                ✓ Merchant dashboard
                <br />
                ✓ Future premium updates included
              </div>
            </div>

            <button
              onClick={() => {
                if (!window.PaystackPop) {
                  alert("Paystack SDK failed to load. Please check your network connection.");
                  return;
                }

                const handler = window.PaystackPop.setup({
                  key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || "pk_live_870272ce5b082f6522a2f9d130c368284664c7f4",
                  email: user?.email,
                  amount: 12900,
                  currency: "ZAR",
                  ref: "RUACH_" + Math.floor(Math.random() * 1000000000 + 1),
                  metadata: {
                    custom_fields: [
                      {
                        display_name: "User ID",
                        variable_name: "user_id",
                        value: user?.id,
                      },
                      {
                        display_name: "Plan",
                        variable_name: "plan_type",
                        value: "pro_monthly",
                      },
                    ],
                    user_id: user?.id,
                    plan_type: "pro_monthly",
                  },
                  onClose: () => {
                    console.log("Paystack modal closed by user.");
                  },
                  callback: function (response) {
                    console.log("Paystack Payment Successful:", response.reference);

                    alert("Payment successful! Updating your workspace access...");

                    checkSubscription(user.id)
                      .then(() => {
                        setShowSubscriptionModal(false);
                      })
                      .catch(console.error);
                  },
                });

                handler.openIframe();
              }}
              style={{
                ...styles.button,
                width: "100%",
                padding: "16px",
                fontSize: "16px",
                fontWeight: "700",
                border: "none",
                borderRadius: "14px",
                cursor: "pointer",
                color: "#ffffff",
                background:
                  "linear-gradient(90deg, #00F5A0 0%, #00C6FF 100%)",
                boxShadow:
                  "0 0 18px rgba(0,255,170,0.35), 0 0 30px rgba(0,198,255,0.25)",
                transition: "all .25s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow =
                  "0 0 28px rgba(0,255,170,.55),0 0 45px rgba(0,198,255,.4)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "0 0 18px rgba(0,255,170,.35),0 0 30px rgba(0,198,255,.25)";
              }}
            >
              Upgrade Now with Paystack →
            </button>
          </div>
        </div>
      )}

      {/* GLOBAL MODAL 2: 3-DAY PREMIUM TRIAL WELCOME */}
      {showTrialWelcomeModal && (
        <div
          style={{
            ...styles.modalOverlay,
            background:
              "radial-gradient(circle at top, rgba(0,255,170,0.08), rgba(0,0,0,0.94) 45%, #000000 100%)",
            backdropFilter: "blur(12px)"
          }}
        >
          <div
            style={{
              ...styles.flatCard,
              maxWidth: "460px",
              width: "90%",
              textAlign: "center",
              position: "relative",
              overflow: "hidden",
              border: "1px solid rgba(0,255,170,0.25)",
              borderRadius: "24px",
              background:
                "linear-gradient(145deg, #050505 0%, #071822 55%, #02110d 100%)",
              boxShadow:
                "0 0 20px rgba(0,255,170,0.18), 0 0 45px rgba(0,180,255,0.12)"
            }}
          >
            {/* Decorative Glow */}
            <div
              style={{
                position: "absolute",
                top: "-90px",
                left: "50%",
                transform: "translateX(-50%)",
                width: "260px",
                height: "260px",
                borderRadius: "50%",
                background:
                  "radial-gradient(circle, rgba(0,255,170,0.28) 0%, rgba(0,180,255,0.12) 45%, transparent 75%)",
                filter: "blur(30px)",
                pointerEvents: "none"
              }}
            />

            {/* Neon Badge */}
            <div
              style={{
                width: "82px",
                height: "82px",
                margin: "0 auto 22px",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "42px",
                background:
                  "linear-gradient(135deg, #00F5A0, #00C6FF)",
                boxShadow:
                  "0 0 20px rgba(0,255,170,0.45), 0 0 45px rgba(0,198,255,0.35)"
              }}
            >
              🎉
            </div>

            <div
              style={{
                color: "#00F5A0",
                fontSize: "12px",
                letterSpacing: "3px",
                fontWeight: 700,
                marginBottom: "12px"
              }}
            >
              PREMIUM ACCESS ACTIVATED
            </div>

            <h2
              style={{
                color: "#ffffff",
                marginBottom: "16px",
                fontSize: "30px",
                fontWeight: 700,
                textShadow: "0 0 12px rgba(0,198,255,0.35)"
              }}
            >
              Welcome to Your Premium Trial
            </h2>

            <p
              style={{
                color: "#b9c7cf",
                lineHeight: "1.9",
                marginBottom: "28px",
                fontSize: "15px"
              }}
            >
              Your email has been successfully verified and your merchant
              workspace is now online.
              <br />
              <br />
              You now have unrestricted access to every Premium feature for the
              next
              <strong
                style={{
                  color: "#00F5A0",
                  textShadow: "0 0 10px rgba(0,255,170,0.55)"
                }}
              >
                {" "}
                {trialDaysRemaining} day
                {trialDaysRemaining !== 1 ? "s" : ""}
              </strong>
              .
            </p>

            <button
              onClick={async () => {
                if (user?.id) {
                  await supabase
                    .from("subscriptions")
                    .update({
                      trial_welcome_seen: true
                    })
                    .eq("user_id", user.id);
                }

                setShowTrialWelcomeModal(false);
              }}
              style={{
                ...styles.button,
                width: "100%",
                padding: "16px",
                fontSize: "16px",
                fontWeight: 700,
                border: "none",
                borderRadius: "14px",
                cursor: "pointer",
                color: "#ffffff",
                background:
                  "linear-gradient(90deg, #00F5A0 0%, #00C6FF 100%)",
                boxShadow:
                  "0 0 18px rgba(0,255,170,0.35), 0 0 30px rgba(0,198,255,0.25)",
                transition: "all .25s ease"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow =
                  "0 0 28px rgba(0,255,170,.55),0 0 45px rgba(0,198,255,.4)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "0 0 18px rgba(0,255,170,.35),0 0 30px rgba(0,198,255,.25)";
              }}
            >
              Enter Workspace →
            </button>
          </div>
        </div>
      )}

      {/* ======================= APPLE GLASS UI AUTHENTICATION MODAL ======================= */}
      <style>{authAnimations}</style>

      <input
        style={{ display: 'none' }}
        type="password"
        autoComplete="on"
      />

      <main
        style={{
          width: '100%',
          height: user ? 'calc(100dvh / 0.70)' : 'auto',
          minHeight: user ? 'calc(100dvh / 0.70)' : undefined,
          padding: user ? 0 : '24px 12px',
          maxWidth: user ? 'none' : '1500px',
          margin: user ? 0 : '0 auto',
          boxSizing: 'border-box',
          display: user ? 'flex' : undefined,
          flexDirection: user ? 'column' : undefined
        }}
      >
        {!user ? (
          <section
            style={{
              position: 'relative',
              minHeight: '85vh',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              overflow: 'hidden',
              padding: '30px 12px',
              boxSizing: 'border-box'
            }}
          >

            {/* =========================================================
          AMBIENT GLASS LIGHT
      ========================================================= */}

            <div
              className="ruach-glass-orb-one"
              style={{
                position: 'absolute',
                top: '7%',
                left: '12%',
                width: 280,
                height: 280,
                borderRadius: '50%',
                background: 'rgba(75,190,255,.13)',
                filter: 'blur(75px)',
                pointerEvents: 'none'
              }}
            />

            <div
              className="ruach-glass-orb-two"
              style={{
                position: 'absolute',
                bottom: '5%',
                right: '10%',
                width: 330,
                height: 330,
                borderRadius: '50%',
                background: 'rgba(90,200,255,.11)',
                filter: 'blur(90px)',
                pointerEvents: 'none'
              }}
            />

            <div
              className="ruach-glass-orb-three"
              style={{
                position: 'absolute',
                top: '42%',
                right: '22%',
                width: 120,
                height: 120,
                borderRadius: '50%',
                background: 'rgba(255,255,255,.28)',
                filter: 'blur(50px)',
                pointerEvents: 'none'
              }}
            />

            {/* =========================================================
          MAIN APPLE GLASS CARD
      ========================================================= */}

            <div
              className="ruach-auth-card"
              style={{
                position: 'relative',
                zIndex: 5,
                width: '100%',
                maxWidth: '470px',
                boxSizing: 'border-box',
                padding: '38px',
                borderRadius: '32px',

                background:
                  'linear-gradient(145deg, rgba(255,255,255,.78), rgba(255,255,255,.48))',

                border:
                  '1px solid rgba(255,255,255,.78)',

                boxShadow:
                  '0 35px 100px rgba(0,0,0,.30), 0 0 70px rgba(80,190,255,.12)',

                backdropFilter: 'blur(35px) saturate(145%)',
                WebkitBackdropFilter: 'blur(35px) saturate(145%)',

                overflow: 'hidden'
              }}
            >

              {/* Inner glass highlight */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  borderRadius: 'inherit',
                  pointerEvents: 'none',
                  background:
                    'linear-gradient(135deg, rgba(255,255,255,.42), transparent 38%, rgba(100,200,255,.06))'
                }}
              />

              {/* Top glass shine */}
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: '12%',
                  right: '12%',
                  height: 1,
                  background: 'rgba(255,255,255,.95)',
                  opacity: .75
                }}
              />

              <div
                style={{
                  position: 'relative',
                  zIndex: 2
                }}
              >

                {/* =====================================================
              BRAND
          ===================================================== */}

                <div
                  style={{
                    textAlign: 'center',
                    marginBottom: 30
                  }}
                >

                  <div
                    className="ruach-auth-icon"
                    style={{
                      width: 70,
                      height: 70,
                      margin: '0 auto 18px',
                      borderRadius: 22,

                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',

                      background:
                        'rgba(255,255,255,.58)',

                      border:
                        '1px solid rgba(255,255,255,.9)',

                      boxShadow:
                        '0 15px 35px rgba(0,0,0,.13), 0 0 35px rgba(70,190,255,.15)',

                      backdropFilter: 'blur(18px)',
                      WebkitBackdropFilter: 'blur(18px)',

                      color: '#0b0b0b'
                    }}
                  >
                    <Sparkles
                      size={29}
                      strokeWidth={1.8}
                    />
                  </div>

                  <h2
                    style={{
                      margin: 0,
                      color: '#050505',
                      fontWeight: 800,
                      fontSize: 27,
                      letterSpacing: '-.8px'
                    }}
                  >
                    RUACH AGENT
                  </h2>

                  <p
                    style={{
                      margin: '8px 0 0',
                      fontSize: 13,
                      color: 'rgba(0,0,0,.52)',
                      letterSpacing: '.15px'
                    }}
                  >
                    Intelligent business authentication
                  </p>

                </div>

                {/* =====================================================
              AUTH MODE SWITCHER
          ===================================================== */}

                <div
                  style={{
                    display: 'flex',
                    gap: 4,
                    padding: 5,
                    marginBottom: 24,

                    background: 'rgba(0,0,0,.075)',
                    border: '1px solid rgba(0,0,0,.07)',
                    borderRadius: 16,

                    boxShadow:
                      'inset 0 1px 2px rgba(0,0,0,.08)'
                  }}
                >

                  <button
                    onClick={() => setAuthMode('signin')}
                    style={{
                      flex: 1,
                      padding: '11px 10px',
                      border: 'none',
                      borderRadius: 12,
                      cursor: 'pointer',

                      background:
                        authMode === 'signin'
                          ? 'rgba(255,255,255,.90)'
                          : 'transparent',

                      color:
                        authMode === 'signin'
                          ? '#050505'
                          : 'rgba(0,0,0,.48)',

                      fontWeight: 700,

                      boxShadow:
                        authMode === 'signin'
                          ? '0 5px 15px rgba(0,0,0,.10)'
                          : 'none',

                      transition: 'all .25s ease'
                    }}
                  >
                    Sign In
                  </button>

                  <button
                    onClick={() => setAuthMode('signup')}
                    style={{
                      flex: 1,
                      padding: '11px 10px',
                      border: 'none',
                      borderRadius: 12,
                      cursor: 'pointer',

                      background:
                        authMode === 'signup'
                          ? 'rgba(255,255,255,.90)'
                          : 'transparent',

                      color:
                        authMode === 'signup'
                          ? '#050505'
                          : 'rgba(0,0,0,.48)',

                      fontWeight: 700,

                      boxShadow:
                        authMode === 'signup'
                          ? '0 5px 15px rgba(0,0,0,.10)'
                          : 'none',

                      transition: 'all .25s ease'
                    }}
                  >
                    Sign Up
                  </button>

                </div>

                {/* =====================================================
              SUCCESS MESSAGE
          ===================================================== */}

                {signupSuccessMessage && (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      background: 'rgba(255,255,255,.62)',
                      border: '1px solid rgba(80,190,255,.32)',
                      color: '#111',
                      padding: 14,
                      borderRadius: 15,
                      marginBottom: 18,
                      fontSize: 13,
                      boxShadow: '0 8px 25px rgba(0,0,0,.07)'
                    }}
                  >
                    <CheckCircle2
                      size={18}
                      color="#009FE3"
                    />

                    <span>{signupSuccessMessage}</span>
                  </div>
                )}

                {/* =====================================================
              SIGN IN
          ===================================================== */}

                {authMode === 'signin' && (
                  <div
                    key="signin"
                    className="ruach-auth-mode"
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 15
                    }}
                  >

                    <input
                      type="email"
                      placeholder="Email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="ruach-glass-input"
                      style={{
                        ...styles.input,
                        width: '100%',
                        boxSizing: 'border-box',
                        background: 'rgba(255,255,255,.54)',
                        border: '1px solid rgba(0,0,0,.10)',
                        color: '#080808',
                        borderRadius: 15,
                        padding: '14px 15px',
                        boxShadow: 'inset 0 1px 2px rgba(0,0,0,.04)'
                      }}
                    />

                    {/* Password */}
                    <div className="ruach-password-wrap">

                      <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        className="ruach-glass-input"
                        style={{
                          ...styles.input,
                          width: '100%',
                          boxSizing: 'border-box',
                          background: 'rgba(255,255,255,.54)',
                          border: '1px solid rgba(0,0,0,.10)',
                          color: '#080808',
                          borderRadius: 15,
                          padding: '14px 15px',
                          boxShadow: 'inset 0 1px 2px rgba(0,0,0,.04)'
                        }}
                      />

                      <button
                        type="button"
                        className="ruach-eye-button"
                        onClick={() => setShowPassword(prev => !prev)}
                        aria-label={
                          showPassword
                            ? 'Hide password'
                            : 'Show password'
                        }
                      >
                        {showPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>

                    </div>

                    <label
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                        color: 'rgba(0,0,0,.57)',
                        fontSize: 13,
                        cursor: 'pointer'
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={e => setRememberMe(e.target.checked)}
                        style={{
                          accentColor: '#009FE3'
                        }}
                      />

                      Remember Me
                    </label>

                    <button
                      onClick={() => handleAuth('login')}
                      disabled={isAuthSyncing}
                      className="ruach-glass-button"
                      style={{
                        marginTop: 3,
                        padding: '14px',
                        border: '1px solid rgba(255,255,255,.65)',
                        borderRadius: 15,
                        fontWeight: 750,
                        fontSize: 14,
                        cursor: isAuthSyncing ? 'wait' : 'pointer',
                        color: '#fff',
                        background:
                          'linear-gradient(135deg, #050505, #171717)',
                        boxShadow:
                          '0 12px 28px rgba(0,0,0,.20), 0 0 25px rgba(60,190,255,.10)'
                      }}
                    >
                      {isAuthSyncing
                        ? 'Signing In...'
                        : 'Sign In'}
                    </button>

                    <button
                      onClick={() => setAuthMode('forgot')}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        color: '#008ED0',
                        fontWeight: 600,
                        fontSize: 13
                      }}
                    >
                      Forgot Password?
                    </button>

                    <button
                      onClick={handleResendVerification}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        color: '#008ED0',
                        fontWeight: 600,
                        fontSize: 13
                      }}
                    >
                      Resend Verification Email
                    </button>

                    <div
                      style={{
                        textAlign: 'center',
                        color: 'rgba(0,0,0,.48)',
                        fontSize: 13,
                        marginTop: 3
                      }}
                    >
                      Don't have an account?{' '}

                      <span
                        onClick={() => setAuthMode('signup')}
                        style={{
                          color: '#008ED0',
                          cursor: 'pointer',
                          fontWeight: 700
                        }}
                      >
                        Sign Up
                      </span>
                    </div>

                  </div>
                )}

                {/* =====================================================
              SIGN UP
          ===================================================== */}

                {authMode === 'signup' && (
                  <div
                    key="signup"
                    className="ruach-auth-mode"
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 15
                    }}
                  >

                    <div
                      style={{
                        marginBottom: 2
                      }}
                    >
                      <h3
                        style={{
                          margin: 0,
                          color: '#050505',
                          fontSize: 21,
                          fontWeight: 750,
                          letterSpacing: '-.4px'
                        }}
                      >
                        Create your account
                      </h3>

                      <p
                        style={{
                          margin: '5px 0 0',
                          color: 'rgba(0,0,0,.46)',
                          fontSize: 12.5
                        }}
                      >
                        Start building your intelligent business workspace.
                      </p>
                    </div>

                    <input
                      placeholder="Business Name"
                      value={businessName}
                      onChange={e => setBusinessName(e.target.value)}
                      className="ruach-glass-input"
                      style={{
                        ...styles.input,
                        width: '100%',
                        boxSizing: 'border-box',
                        background: 'rgba(255,255,255,.54)',
                        border: '1px solid rgba(0,0,0,.10)',
                        color: '#080808',
                        borderRadius: 15,
                        padding: '14px 15px',
                        boxShadow: 'inset 0 1px 2px rgba(0,0,0,.04)'
                      }}
                    />

                    <input
                      type="email"
                      placeholder="Email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="ruach-glass-input"
                      style={{
                        ...styles.input,
                        width: '100%',
                        boxSizing: 'border-box',
                        background: 'rgba(255,255,255,.54)',
                        border: '1px solid rgba(0,0,0,.10)',
                        color: '#080808',
                        borderRadius: 15,
                        padding: '14px 15px',
                        boxShadow: 'inset 0 1px 2px rgba(0,0,0,.04)'
                      }}
                    />

                    {/* Password */}
                    <div className="ruach-password-wrap">

                      <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        className="ruach-glass-input"
                        style={{
                          ...styles.input,
                          width: '100%',
                          boxSizing: 'border-box',
                          background: 'rgba(255,255,255,.54)',
                          border: '1px solid rgba(0,0,0,.10)',
                          color: '#080808',
                          borderRadius: 15,
                          padding: '14px 15px',
                          boxShadow: 'inset 0 1px 2px rgba(0,0,0,.04)'
                        }}
                      />

                      <button
                        type="button"
                        className="ruach-eye-button"
                        onClick={() => setShowPassword(prev => !prev)}
                        aria-label={
                          showPassword
                            ? 'Hide password'
                            : 'Show password'
                        }
                      >
                        {showPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>

                    </div>

                    {/* Confirm Password */}
                    <div className="ruach-password-wrap">

                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                        className="ruach-glass-input"
                        style={{
                          ...styles.input,
                          width: '100%',
                          boxSizing: 'border-box',
                          background: 'rgba(255,255,255,.54)',
                          border: '1px solid rgba(0,0,0,.10)',
                          color: '#080808',
                          borderRadius: 15,
                          padding: '14px 15px',
                          boxShadow: 'inset 0 1px 2px rgba(0,0,0,.04)'
                        }}
                      />

                      <button
                        type="button"
                        className="ruach-eye-button"
                        onClick={() =>
                          setShowConfirmPassword(prev => !prev)
                        }
                        aria-label={
                          showConfirmPassword
                            ? 'Hide confirm password'
                            : 'Show confirm password'
                        }
                      >
                        {showConfirmPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>

                    </div>

                    <label
                      style={{
                        display: 'flex',
                        gap: 10,
                        alignItems: 'flex-start',
                        color: 'rgba(0,0,0,.55)',
                        fontSize: 13,
                        lineHeight: 1.45,
                        cursor: 'pointer'
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={agreeTerms}
                        onChange={e => setAgreeTerms(e.target.checked)}
                        style={{
                          marginTop: 2,
                          accentColor: '#009FE3'
                        }}
                      />

                      <span>
                        I agree to the Terms & Conditions
                      </span>
                    </label>

                    <button
                      onClick={() => handleAuth('register')}
                      disabled={isAuthSyncing}
                      className="ruach-glass-button"
                      style={{
                        padding: '15px',
                        border: '1px solid rgba(255,255,255,.75)',
                        borderRadius: 15,
                        cursor: isAuthSyncing ? 'wait' : 'pointer',
                        fontWeight: 750,
                        color: '#fff',
                        background:
                          'linear-gradient(135deg, #050505, #171717)',
                        boxShadow:
                          '0 12px 28px rgba(0,0,0,.20), 0 0 25px rgba(60,190,255,.12)'
                      }}
                    >
                      {isAuthSyncing
                        ? 'Creating Account...'
                        : 'Create Account'}
                    </button>

                    <div
                      style={{
                        textAlign: 'center',
                        color: 'rgba(0,0,0,.48)',
                        fontSize: 13,
                        marginTop: 2
                      }}
                    >
                      Already have an account?{' '}

                      <span
                        onClick={() => setAuthMode('signin')}
                        style={{
                          cursor: 'pointer',
                          fontWeight: 700,
                          color: '#008ED0'
                        }}
                      >
                        Sign In
                      </span>
                    </div>

                  </div>
                )}

                {/* =====================================================
              FORGOT PASSWORD
          ===================================================== */}

                {authMode === 'forgot' && (
                  <div
                    key="forgot"
                    className="ruach-auth-mode"
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 15
                    }}
                  >

                    <div>
                      <h3
                        style={{
                          color: '#050505',
                          margin: 0,
                          fontSize: 22,
                          fontWeight: 750
                        }}
                      >
                        Forgot Password
                      </h3>

                      <p
                        style={{
                          color: 'rgba(0,0,0,.48)',
                          fontSize: 13,
                          lineHeight: 1.5,
                          margin: '6px 0 0'
                        }}
                      >
                        Enter your email and we'll send you a secure
                        password reset link.
                      </p>
                    </div>

                    <input
                      type="email"
                      placeholder="Email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="ruach-glass-input"
                      style={{
                        ...styles.input,
                        width: '100%',
                        boxSizing: 'border-box',
                        background: 'rgba(255,255,255,.54)',
                        border: '1px solid rgba(0,0,0,.10)',
                        color: '#080808',
                        borderRadius: 15,
                        padding: '14px 15px'
                      }}
                    />

                    <button
                      onClick={handleForgotPassword}
                      className="ruach-glass-button"
                      style={{
                        padding: '14px',
                        border: '1px solid rgba(255,255,255,.75)',
                        borderRadius: 15,
                        background:
                          'linear-gradient(135deg, #050505, #171717)',
                        color: '#fff',
                        fontWeight: 750,
                        cursor: 'pointer'
                      }}
                    >
                      Send Reset Email
                    </button>

                    <button
                      onClick={() => setAuthMode('signin')}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 7,
                        background: 'transparent',
                        border: 'none',
                        color: '#008ED0',
                        cursor: 'pointer',
                        fontWeight: 650,
                        fontSize: 13
                      }}
                    >
                      <ArrowLeft size={15} />
                      Back to Sign In
                    </button>

                  </div>
                )}

                {/* =====================================================
              VERIFY EMAIL
          ===================================================== */}

                {authMode === 'verify' && (
                  <div
                    key="verify"
                    className="ruach-auth-mode"
                    style={{
                      textAlign: 'center'
                    }}
                  >

                    <div
                      style={{
                        width: 62,
                        height: 62,
                        margin: '0 auto 18px',
                        borderRadius: 20,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'rgba(255,255,255,.60)',
                        border: '1px solid rgba(255,255,255,.85)',
                        boxShadow: '0 12px 30px rgba(0,0,0,.10)'
                      }}
                    >
                      <ShieldCheck
                        size={29}
                        color="#008ED0"
                        strokeWidth={1.8}
                      />
                    </div>

                    <h3
                      style={{
                        color: '#050505',
                        margin: 0,
                        fontSize: 22,
                        fontWeight: 750
                      }}
                    >
                      Verify Your Email
                    </h3>

                    <p
                      style={{
                        color: 'rgba(0,0,0,.50)',
                        lineHeight: 1.65,
                        fontSize: 13,
                        marginTop: 10
                      }}
                    >
                      We've sent you a verification email.
                      <br />
                      Please verify your account before signing in.
                    </p>

                    <button
                      onClick={handleResendVerification}
                      className="ruach-glass-button"
                      style={{
                        width: '100%',
                        padding: '14px',
                        marginTop: 18,
                        border: '1px solid rgba(255,255,255,.75)',
                        borderRadius: 15,
                        fontWeight: 750,
                        background:
                          'linear-gradient(135deg, #050505, #171717)',
                        color: '#fff',
                        cursor: 'pointer'
                      }}
                    >
                      Resend Verification Email
                    </button>

                    <button
                      onClick={() => setAuthMode('signin')}
                      style={{
                        marginTop: 12,
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        color: '#008ED0',
                        fontWeight: 650,
                        fontSize: 13
                      }}
                    >
                      Back to Sign In
                    </button>

                  </div>
                )}

                {/* =====================================================
              RESET PASSWORD
          ===================================================== */}

                {authMode === 'reset' && (
                  <div
                    key="reset"
                    className="ruach-auth-mode"
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 15
                    }}
                  >

                    <div>
                      <h3
                        style={{
                          color: '#050505',
                          margin: 0,
                          fontSize: 22,
                          fontWeight: 750
                        }}
                      >
                        Reset Password
                      </h3>

                      <p
                        style={{
                          color: 'rgba(0,0,0,.48)',
                          fontSize: 13,
                          marginTop: 6
                        }}
                      >
                        Create a new secure password for your account.
                      </p>
                    </div>

                    {/* New Password */}
                    <div className="ruach-password-wrap">

                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        placeholder="New Password"
                        value={newPassword}
                        onChange={e => setNewPassword(e.target.value)}
                        className="ruach-glass-input"
                        style={{
                          ...styles.input,
                          width: '100%',
                          boxSizing: 'border-box',
                          background: 'rgba(255,255,255,.54)',
                          border: '1px solid rgba(0,0,0,.10)',
                          color: '#080808',
                          borderRadius: 15,
                          padding: '14px 15px'
                        }}
                      />

                      <button
                        type="button"
                        className="ruach-eye-button"
                        onClick={() =>
                          setShowNewPassword(prev => !prev)
                        }
                        aria-label={
                          showNewPassword
                            ? 'Hide new password'
                            : 'Show new password'
                        }
                      >
                        {showNewPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>

                    </div>

                    {/* Confirm New Password */}
                    <div className="ruach-password-wrap">

                      <input
                        type={
                          showConfirmNewPassword
                            ? 'text'
                            : 'password'
                        }
                        placeholder="Confirm Password"
                        value={confirmNewPassword}
                        onChange={e =>
                          setConfirmNewPassword(e.target.value)
                        }
                        className="ruach-glass-input"
                        style={{
                          ...styles.input,
                          width: '100%',
                          boxSizing: 'border-box',
                          background: 'rgba(255,255,255,.54)',
                          border: '1px solid rgba(0,0,0,.10)',
                          color: '#080808',
                          borderRadius: 15,
                          padding: '14px 15px'
                        }}
                      />

                      <button
                        type="button"
                        className="ruach-eye-button"
                        onClick={() =>
                          setShowConfirmNewPassword(prev => !prev)
                        }
                        aria-label={
                          showConfirmNewPassword
                            ? 'Hide confirm password'
                            : 'Show confirm password'
                        }
                      >
                        {showConfirmNewPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>

                    </div>

                    <button
                      onClick={handleResetPassword}
                      className="ruach-glass-button"
                      style={{
                        padding: '14px',
                        border: '1px solid rgba(255,255,255,.75)',
                        borderRadius: 15,
                        background:
                          'linear-gradient(135deg, #050505, #171717)',
                        fontWeight: 750,
                        color: '#fff',
                        cursor: 'pointer'
                      }}
                    >
                      Save Password
                    </button>

                  </div>
                )}

              </div>
            </div>
          </section>

        ) : (
          <div className="admin-page">
            {/* ==============================
            LEFT SIDEBAR
      =============================== */}

            <aside className="sidebar">
              {/* Logo */}
              <div
                className="sidebar-logo"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px"
                }}
              >
                <img
                  src="/RuachAgentLogo.png"
                  alt="RuachAgent"
                  style={{
                    width: "52px",
                    height: "52px",
                    objectFit: "contain",
                    display: "block",
                    flexShrink: 0
                  }}
                />

                <div>
                  <h2
                    style={{
                      margin: 0,
                      color: "#ffffff",
                      fontSize: "18px",
                      fontWeight: 700,
                      letterSpacing: "-0.3px"
                    }}
                  >
                    RuachAgent
                  </h2>

                  <span
                    style={{
                      display: "block",
                      marginTop: "3px",
                      color: "#7d8a99",
                      fontSize: "11px",
                      letterSpacing: "0.2px"
                    }}
                  >
                    Till Slip Platform
                  </span>
                </div>
              </div>

              {/* SETTINGS */}

              <div className="sidebar-section">
                <p className="sidebar-title">SETTINGS</p>

                <button className={`sidebar-item ${activeTab === "agent-parameters" ? "active" : ""}`}
                  onClick={() => loadPageFromSupabase("agent-parameters")}
                >
                  <SlidersHorizontal size={18} />
                  <span>Agent Parameters</span>
                </button>

                <button className={`sidebar-item ${activeTab === "till-slips-collection" ? "active" : ""}`}
                  onClick={() => loadPageFromSupabase("till-slips-collection")}
                >
                  <FileText size={18} />

                  <span>Till Slips Collection</span>
                </button>
              </div>

              {/* PREVIEWS */}

              <div className="sidebar-section">
                <p className="sidebar-title">PREVIEWS</p>

                <button className={`sidebar-item ${activeTab === "analysis" ? "active" : ""}`}
                  onClick={() => loadPageFromSupabase("analysis")}
                >
                  <LayoutDashboard size={18} />

                  <span>Analysis</span>
                </button>

                <button className={`sidebar-item ${activeTab === "connected-stores" ? "active" : ""}`}
                  onClick={() => loadPageFromSupabase("connected-stores")}
                >
                  <Store size={18} />

                  <span>Connected Stores</span>
                </button>
              </div>

              {/* Bottom Card */}
              <div className="sidebar-bottom" style={{ position: "relative" }}>
                <div className="bottom-profile">

                  {/* Account Button */}
                  <button
                    type="button"
                    onClick={() => setShowAccountMenu(prev => !prev)}
                    aria-expanded={showAccountMenu}
                    aria-haspopup="menu"
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      gap: "14px",
                      padding: "14px",
                      borderRadius: "14px",
                      cursor: "pointer",
                      transition: "all .25s ease",
                      border: "1px solid rgba(0,180,255,.18)",
                      background: "rgba(15,18,24,.92)",
                      textAlign: "left",
                      color: "#fff"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.border =
                        "1px solid rgba(0,198,255,.45)";
                      e.currentTarget.style.background =
                        "rgba(20,25,32,.98)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.border =
                        "1px solid rgba(0,180,255,.18)";
                      e.currentTarget.style.background =
                        "rgba(15,18,24,.92)";
                    }}
                  >
                    {/* Avatar */}
                    <div
                      style={{
                        width: "32px",
                        height: "32px",
                        minWidth: "32px",
                        borderRadius: "50%",
                        background:
                          "linear-gradient(135deg,#00C6FF,#0084FF)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#fff",
                        fontWeight: 700,
                        fontSize: "10px",
                        boxShadow: "0 0 18px rgba(0,198,255,.22)"
                      }}
                    >
                      {(settings?.business_name || user?.email || "R")
                        .charAt(0)
                        .toUpperCase()}
                    </div>

                    {/* Account Information */}
                    <div
                      style={{
                        flex: 1,
                        minWidth: 0
                      }}
                    >
                      <div
                        style={{
                          color: "#fff",
                          fontWeight: 600,
                          fontSize: "9px",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis"
                        }}
                      >
                        {settings?.business_name || "RuachAgent AI"}
                      </div>

                      <div
                        style={{
                          color: "#7d8a99",
                          fontSize: "8px",
                          marginTop: "3px",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis"
                        }}
                      >
                        {user?.email}
                      </div>
                    </div>

                    {/* Menu Indicator */}
                    <div
                      style={{
                        color: "#00C6FF",
                        fontSize: "10px",
                        transform: showAccountMenu
                          ? "rotate(180deg)"
                          : "rotate(0deg)",
                        transition: "transform .25s ease"
                      }}
                    >
                      ▾
                    </div>
                  </button>

                  {/* Account Popup */}
                  {showAccountMenu && (
                    <div
                      className="account-menu"
                      role="menu"
                      style={{
                        position: "absolute",
                        left: "0",
                        right: "0",
                        bottom: "calc(100% + 10px)",
                        zIndex: 1000,
                        padding: "8px",
                        borderRadius: "16px",
                        border: "1px solid rgba(0,198,255,.22)",
                        background:
                          "linear-gradient(180deg, rgba(17,22,29,.98), rgba(8,11,15,.98))",
                        boxShadow:
                          "0 18px 50px rgba(0,0,0,.55), 0 0 25px rgba(0,160,255,.08)",
                        backdropFilter: "blur(18px)"
                      }}
                    >

                      {/* Popup Header */}
                      <div
                        style={{
                          padding: "10px 12px 12px",
                          borderBottom:
                            "1px solid rgba(255,255,255,.07)",
                          marginBottom: "6px"
                        }}
                      >
                        <div
                          style={{
                            color: "#fff",
                            fontWeight: 600,
                            fontSize: "9px"
                          }}
                        >
                          {settings?.business_name || "RuachAgent AI"}
                        </div>

                        <div
                          style={{
                            color: "#6f7d8d",
                            fontSize: "8px",
                            marginTop: "3px"
                          }}
                        >
                          {user?.email}
                        </div>
                      </div>

                      {/* Profile */}
                      <button
                        type="button"
                        role="menuitem"
                        onClick={() => {
                          setShowAccountMenu(false);
                          navigate("/profile");
                        }}
                        style={accountMenuButtonStyle}
                      >
                        <span>👤</span>
                        <span>Profile</span>
                      </button>

                      {/* Plan */}
                      <button
                        type="button"
                        role="menuitem"
                        onClick={() => {
                          setShowAccountMenu(false);
                          navigate("/billing");
                        }}
                        style={accountMenuButtonStyle}
                      >
                        <span>◈</span>
                        <span>Plan</span>
                      </button>

                      {/* Help */}
                      <button
                        type="button"
                        role="menuitem"
                        onClick={() => {
                          setShowAccountMenu(false);
                          navigate("/help");
                        }}
                        style={accountMenuButtonStyle}
                      >
                        <span>?</span>
                        <span>Help</span>
                      </button>

                      {/* Divider */}
                      <div
                        style={{
                          height: "1px",
                          background: "rgba(255,255,255,.07)",
                          margin: "6px 4px"
                        }}
                      />

                      {/* Log Out */}
                      <button
                        type="button"
                        role="menuitem"
                        onClick={async () => {
                          setShowAccountMenu(false);

                          await supabase.auth.signOut();

                          navigate("/");
                        }}
                        style={{
                          ...accountMenuButtonStyle,
                          color: "#ff6b6b"
                        }}
                      >
                        <span>↪</span>
                        <span>Log Out</span>
                      </button>

                    </div>
                  )}

                </div>
              </div>
            </aside>

            <main
              className="main-content"
              style={{
                position: "relative",
                padding: "24px",
                minWidth: 0,
                minHeight: 0,
                overflowY: "auto"
              }}
            >
              {isPageLoading ? (
                <div
                  className="ruach-page-loader"
                  role="status"
                  aria-live="polite"
                  style={{
                    position: "absolute",
                    inset: 0,
                    zIndex: 50,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                    background:
                      "radial-gradient(circle at center, rgba(8, 8, 8, 0.09), rgba(0,0,0,.97) 52%, #000 100%)",
                    backdropFilter: "blur(10px)"
                  }}
                >
                  <style>{`
                    @keyframes ruachLoaderPulse {
                      0%, 100% { transform: scale(.94); opacity: .72; }
                      50% { transform: scale(1.03); opacity: 1; }
                    }
                    @keyframes ruachLoaderSpin {
                      to { transform: rotate(360deg); }
                    }
                    @keyframes ruachLoaderSweep {
                      0% { transform: translateX(-120%); }
                      100% { transform: translateX(320%); }
                    }
                    @keyframes ruachLoaderScan {
                      0% { top: 0%; opacity: 0; }
                      15% { opacity: 1; }
                      85% { opacity: 1; }
                      100% { top: 100%; opacity: 0; }
                    }
                  `}</style>

                  <div
                    style={{
                      width: "min(420px, 82%)",
                      padding: "38px 34px",
                      textAlign: "center",
                      border: "1px solid rgba(0,198,255,.24)",
                      borderRadius: "24px",
                      background:
                        "linear-gradient(180deg, rgba(10,17,24,.97), rgba(2,5,9,.98))",
                      boxShadow:
                        "0 0 40px rgba(0,177,255,.10), 0 25px 80px rgba(0,0,0,.7)",
                      position: "relative",
                      overflow: "hidden"
                    }}
                  >
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        pointerEvents: "none",
                        background:
                          "linear-gradient(90deg, transparent, rgba(0,198,255,.12), transparent)",
                        animation: "ruachLoaderSweep 2.2s linear infinite"
                      }}
                    />

                    <div
                      style={{
                        position: "relative",
                        width: "132px",
                        height: "132px",
                        margin: "0 auto 24px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                      }}
                    >
                      <div
                        style={{
                          position: "absolute",
                          inset: 0,
                          borderRadius: "50%",
                          border: "1px solid rgba(0,198,255,.22)",
                          borderTopColor: "#00d9ff",
                          borderRightColor: "#008cff",
                          animation: "ruachLoaderSpin 1.4s linear infinite",
                          boxShadow: "0 0 24px rgba(0,198,255,.18)"
                        }}
                      />

                      <div
                        style={{
                          position: "absolute",
                          inset: "9px",
                          borderRadius: "50%",
                          border: "1px solid rgba(0, 200, 255, 0.16)",
                          borderBottomColor: "#00c6ff",
                          animation: "ruachLoaderSpin 2.1s linear infinite reverse"
                        }}
                      />

                      <img
                        src="/RuachAgentLogo.png"
                        alt="RuachAgent"
                        style={{
                          position: "relative",
                          width: "88px",
                          height: "88px",
                          objectFit: "contain",
                          animation: "ruachLoaderPulse 1.8s ease-in-out infinite",
                          filter:
                            "drop-shadow(0 0 12px rgba(0, 208, 255, 0.81))"
                        }}
                      />
                    </div>

                    <div
                      style={{
                        color: "#5cdbff",
                        fontSize: "10px",
                        fontWeight: 800,
                        letterSpacing: "3px",
                        textTransform: "uppercase",
                        marginBottom: "10px"
                      }}
                    >
                      SUPABASE DATA LINK
                    </div>

                    <div
                      style={{
                        color: "#ffffff",
                        fontSize: "18px",
                        fontWeight: 700,
                        marginBottom: "8px"
                      }}
                    >
                      Synchronizing Workspace
                    </div>

                    <div
                      style={{
                        color: "#718696",
                        fontSize: "12px",
                        minHeight: "18px",
                        marginBottom: "20px"
                      }}
                    >
                      {pageLoadingMessage}
                    </div>

                    <div
                      style={{
                        width: "100%",
                        height: "4px",
                        overflow: "hidden",
                        borderRadius: "999px",
                        background: "rgb(0, 0, 0)",
                        marginBottom: "9px"
                      }}
                    >
                      <div
                        style={{
                          width: `${pageLoadingProgress}%`,
                          height: "100%",
                          borderRadius: "999px",
                          background:
                            "linear-gradient(90deg, #007cff, #00d9ff)",
                          boxShadow: "0 0 14px rgba(0, 200, 255, 0.91)",
                          transition: "width .3s ease"
                        }}
                      />
                    </div>

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        color: "#526a79",
                        fontSize: "9px",
                        letterSpacing: "1px"
                      }}
                    >
                      <span>DATABASE CONNECTED</span>
                      <span>{pageLoadingProgress}%</span>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  {activeTab === "analysis" && (
                    <Analysis key={`analysis-${databaseRefreshKey}`} />
                  )}

                  {activeTab === "connected-stores" && (
                    <ConnectedStores key={`stores-${databaseRefreshKey}`} />
                  )}

                  {activeTab === "agent-parameters" && (
                    <AgentParameters
                      key={`parameters-${databaseRefreshKey}`}
                      selectedTemplateId={selectedTemplateId}
                      setSelectedTemplateId={setSelectedTemplateId}
                      receipt={receipt}
                      setReceipt={setReceipt}
                    />
                  )}

                  {activeTab === "till-slips-collection" && (
                    <TillSlipsCollection
                      key={`collection-${databaseRefreshKey}`}
                      selectedTemplateId={selectedTemplateId}
                      setSelectedTemplateId={setSelectedTemplateId}
                      receipt={receipt}
                      setReceipt={setReceipt}
                    />
                  )}
                </>
              )}
            </main>
          </div>
        )}
      </main>
    </div>
  );
}
