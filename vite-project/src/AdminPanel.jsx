import React, { useEffect, useState } from "react";

import "./AdminPanel.css";

import { supabase } from './supabaseClient';

import { useBusiness } from "./backend/businessService";

import { useNavigate } from "react-router-dom";

import {
  LayoutDashboard,
  Receipt,
  Store,
  SlidersHorizontal,
  FileText,
  Plug,
  HelpCircle,
  Bell,
  UserCircle2,
  Sparkles,
  Palette,
  Cpu,
  Send,
  ArrowUpRight
} from "lucide-react";

export default function AdminPanel() {

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

    receiptData,
    setReceiptData,

    receipt,
    setReceipt,

    // Misc
    loading,
    error,
    isCheckingSession,
    successMessage

  } = useBusiness();

  const styles = {
    container: {
      minHeight: '100vh',
      width: '100%',
      background: '#050608',
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
      padding: '24px'
    },
    flatCard: {
      padding: '28px',
      border: '1px solid rgba(38,216,255,0.2)',
      borderRadius: '18px',
      background: 'rgba(17,21,27,0.96)',
      boxShadow: '0 22px 60px rgba(0,0,0,0.45)',
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
      padding: '12px 24px',
      boxSizing: 'border-box',
      background: 'rgba(9,11,15,0.82)',
      borderBottom: '1px solid #1c2430'
    },
    input: {
      width: '100%',
      minHeight: '44px',
      padding: '10px 12px',
      border: '1px solid #1c2430',
      borderRadius: '10px',
      background: '#0b0d11',
      color: '#ffffff',
      boxSizing: 'border-box'
    }
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

      {/* ======================= TESLA AUTHENTICATION MODAL ======================= */}

      <header style={{ ...styles.header, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}></header>

      <input style={{ display: 'none' }} type="password" autoComplete="on" />

      <main style={{ padding: '24px 12px', maxWidth: '1500px', margin: '0 auto' }}>
        {!user ? (
          <section style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '85vh' }}>
            <div style={{
              width: '100%',
              maxWidth: '470px',
              background: 'linear-gradient(180deg,#111,#080808)',
              border: '1px solid rgba(0,180,255,.35)',
              borderRadius: '24px',
              padding: '34px',
              boxShadow: '0 0 40px rgba(0,180,255,.12),0 0 120px rgba(0,0,0,.7)',
              position: 'relative',
              overflow: 'hidden'
            }}>

              <div style={{
                position: 'absolute',
                top: -120,
                right: -120,
                width: 250,
                height: 250,
                background: 'rgba(0,170,255,.08)',
                filter: 'blur(80px)',
                borderRadius: '50%'
              }} />

              <div style={{
                position: 'absolute',
                bottom: -120,
                left: -120,
                width: 250,
                height: 250,
                background: 'rgba(0,120,255,.08)',
                filter: 'blur(90px)',
                borderRadius: '50%'
              }} />

              <div style={{ position: 'relative', zIndex: 2 }}>

                <div style={{ textAlign: 'center', marginBottom: 30 }}>
                  <div style={{
                    width: 68,
                    height: 68,
                    margin: '0 auto 18px',
                    borderRadius: '18px',
                    background: 'linear-gradient(135deg,#0b0b0b,#171717)',
                    border: '1px solid #00BFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 28,
                    boxShadow: '0 0 25px rgba(0,180,255,.35)'
                  }}>
                    ⚡
                  </div>

                  <h2 style={{
                    margin: 0,
                    color: '#fff',
                    fontWeight: 700,
                    fontSize: '28px',
                    letterSpacing: '1px'
                  }}>
                    RUACH AGENT
                  </h2>

                  <p style={{
                    marginTop: 8,
                    fontSize: 13,
                    color: '#8d99a6'
                  }}>
                    Secure Business Authentication
                  </p>
                </div>

                <div style={{
                  display: 'flex',
                  background: '#0d0d0d',
                  border: '1px solid #1d3d52',
                  borderRadius: 14,
                  padding: 4,
                  marginBottom: 24
                }}>

                  <button
                    onClick={() => setAuthMode('signin')}
                    style={{
                      flex: 1,
                      padding: '12px',
                      border: 'none',
                      cursor: 'pointer',
                      borderRadius: 10,
                      background: authMode === 'signin' ? 'linear-gradient(90deg,#008CFF,#00D4FF)' : 'transparent',
                      color: '#fff',
                      fontWeight: 600
                    }}>
                    Sign In
                  </button>

                  <button
                    onClick={() => setAuthMode('signup')}
                    style={{
                      flex: 1,
                      padding: '12px',
                      border: 'none',
                      cursor: 'pointer',
                      borderRadius: 10,
                      background: authMode === 'signup' ? 'linear-gradient(90deg,#008CFF,#00D4FF)' : 'transparent',
                      color: '#fff',
                      fontWeight: 600
                    }}>
                    Sign Up
                  </button>

                </div>

                {signupSuccessMessage && (
                  <div style={{
                    background: 'rgba(0,255,180,.08)',
                    border: '1px solid rgba(0,255,180,.25)',
                    color: '#7CFFE7',
                    padding: 14,
                    borderRadius: 12,
                    marginBottom: 18,
                    fontSize: 13,
                    textAlign: 'center'
                  }}>
                    ✅ {signupSuccessMessage}
                  </div>
                )}

                {/* ---------------- SIGN IN ---------------- */}

                {authMode === 'signin' && (
                  <>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

                      <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        style={{
                          ...styles.input,
                          background: '#090909',
                          border: '1px solid #1d3d52',
                          color: '#fff'
                        }}
                      />

                      <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        style={{
                          ...styles.input,
                          background: '#090909',
                          border: '1px solid #1d3d52',
                          color: '#fff'
                        }}
                      />

                      <label style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                        color: '#9da9b6',
                        fontSize: 14
                      }}>
                        <input
                          type="checkbox"
                          checked={rememberMe}
                          onChange={e => setRememberMe(e.target.checked)}
                        />
                        Remember Me
                      </label>

                      <button
                        onClick={() => handleAuth('login')}
                        disabled={isAuthSyncing}
                        style={{
                          padding: '14px',
                          border: 'none',
                          borderRadius: 12,
                          fontWeight: 700,
                          fontSize: 15,
                          cursor: 'pointer',
                          color: '#fff',
                          background: 'linear-gradient(90deg,#008CFF,#00D4FF)',
                          boxShadow: '0 0 18px rgba(0,180,255,.4)'
                        }}>
                        {isAuthSyncing ? 'Signing In...' : 'Sign In'}
                      </button>

                      <button
                        onClick={() => setAuthMode('forgot')}
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          color: '#59C8FF'
                        }}>
                        Forgot Password?
                      </button>

                      <button
                        onClick={handleResendVerification}
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          color: '#59C8FF'
                        }}>
                        Resend Verification Email
                      </button>

                      <div style={{
                        textAlign: 'center',
                        color: '#888',
                        fontSize: 14
                      }}>
                        Don't have an account?{' '}
                        <span
                          onClick={() => setAuthMode('signup')}
                          style={{
                            color: '#00C8FF',
                            cursor: 'pointer',
                            fontWeight: 600
                          }}>
                          Sign Up
                        </span>
                      </div>

                    </div>
                  </>
                )}

                {/* ---------------- SIGN UP ---------------- */}

                {authMode === 'signup' && (
                  <>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

                      <input
                        placeholder="Business Name"
                        value={businessName}
                        onChange={e => setBusinessName(e.target.value)}
                        style={{
                          ...styles.input,
                          background: '#090909',
                          border: '1px solid #1d3d52',
                          color: '#fff'
                        }}
                      />

                      <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        style={{
                          ...styles.input,
                          background: '#090909',
                          border: '1px solid #1d3d52',
                          color: '#fff'
                        }}
                      />

                      <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        style={{
                          ...styles.input,
                          background: '#090909',
                          border: '1px solid #1d3d52',
                          color: '#fff'
                        }}
                      />

                      <input
                        type="password"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                        style={{
                          ...styles.input,
                          background: '#090909',
                          border: '1px solid #1d3d52',
                          color: '#fff'
                        }}
                      />

                      <label style={{
                        display: 'flex',
                        gap: 10,
                        alignItems: 'center',
                        color: '#9da9b6',
                        fontSize: 14
                      }}>
                        <input
                          type="checkbox"
                          checked={agreeTerms}
                          onChange={e => setAgreeTerms(e.target.checked)}
                        />
                        I agree to the Terms & Conditions
                      </label>

                      <button
                        onClick={() => handleAuth('register')}
                        disabled={isAuthSyncing}
                        style={{
                          padding: '14px',
                          border: 'none',
                          borderRadius: 12,
                          cursor: 'pointer',
                          fontWeight: 700,
                          color: '#fff',
                          background: 'linear-gradient(90deg,#008CFF,#00D4FF)'
                        }}>
                        {isAuthSyncing ? 'Creating Account...' : 'Create Account'}
                      </button>

                      <div style={{
                        textAlign: 'center',
                        color: '#888',
                        fontSize: 14
                      }}>
                        Already have an account?{' '}
                        <span
                          onClick={() => setAuthMode('signin')}
                          style={{
                            cursor: 'pointer',
                            fontWeight: 600,
                            color: '#00C8FF'
                          }}>
                          Sign In
                        </span>
                      </div>

                    </div>
                  </>
                )}

                {/* ---------------- FORGOT PASSWORD ---------------- */}

                {authMode === 'forgot' && (
                  <>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

                      <h3 style={{ color: '#fff', margin: 0 }}>Forgot Password</h3>

                      <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        style={{
                          ...styles.input,
                          background: '#090909',
                          border: '1px solid #1d3d52',
                          color: '#fff'
                        }}
                      />

                      <button
                        onClick={handleForgotPassword}
                        style={{
                          padding: '14px',
                          border: 'none',
                          borderRadius: 12,
                          background: 'linear-gradient(90deg,#008CFF,#00D4FF)',
                          color: '#fff',
                          fontWeight: 700
                        }}>
                        Send Reset Email
                      </button>

                      <button
                        onClick={() => setAuthMode('signin')}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#59C8FF',
                          cursor: 'pointer'
                        }}>
                        ← Back to Sign In
                      </button>

                    </div>
                  </>
                )}

                {/* ---------------- VERIFY EMAIL ---------------- */}

                {authMode === 'verify' && (
                  <>
                    <div style={{ textAlign: 'center' }}>

                      <h3 style={{ color: '#fff' }}>Verify Your Email</h3>

                      <p style={{ color: '#98a7b7', lineHeight: 1.6 }}>
                        We've sent you a verification email.
                        <br />
                        Please verify your account before signing in.
                      </p>

                      <button
                        onClick={handleResendVerification}
                        style={{
                          width: '100%',
                          padding: '14px',
                          marginTop: 20,
                          border: 'none',
                          borderRadius: 12,
                          fontWeight: 700,
                          background: 'linear-gradient(90deg,#008CFF,#00D4FF)',
                          color: '#fff'
                        }}>
                        Resend Verification Email
                      </button>

                      <button
                        onClick={() => setAuthMode('signin')}
                        style={{
                          marginTop: 12,
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          color: '#59C8FF'
                        }}>
                        Back to Sign In
                      </button>

                    </div>
                  </>
                )}

                {/* ---------------- RESET PASSWORD ---------------- */}

                {authMode === 'reset' && (
                  <>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

                      <h3 style={{ color: '#fff', margin: 0 }}>
                        Reset Password
                      </h3>

                      <input
                        type="password"
                        placeholder="New Password"
                        value={newPassword}
                        onChange={e => setNewPassword(e.target.value)}
                        style={{
                          ...styles.input,
                          background: '#090909',
                          border: '1px solid #1d3d52',
                          color: '#fff'
                        }}
                      />

                      <input
                        type="password"
                        placeholder="Confirm Password"
                        value={confirmNewPassword}
                        onChange={e => setConfirmNewPassword(e.target.value)}
                        style={{
                          ...styles.input,
                          background: '#090909',
                          border: '1px solid #1d3d52',
                          color: '#fff'
                        }}
                      />

                      <button
                        onClick={handleResetPassword}
                        style={{
                          padding: '14px',
                          border: 'none',
                          borderRadius: 12,
                          background: 'linear-gradient(90deg,#008CFF,#00D4FF)',
                          fontWeight: 700,
                          color: '#fff'
                        }}>
                        Save Password
                      </button>

                    </div>
                  </>
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

              <div className="sidebar-logo">
                <div className="logo-icon">R</div>

                <div>
                  <h2>RuachAgent AI</h2>
                  <span>Intelligent Till Slip Assistant</span>
                </div>
              </div>

              {/* PREVIEWS */}

              <div className="sidebar-section">
                <p className="sidebar-title">PREVIEWS</p>

                <button className="sidebar-item active"
                  onClick={() => navigate("/analysis")}
                >
                  <LayoutDashboard size={18} />

                  <span>Analysis</span>
                </button>

                <button className="sidebar-item"
                  onClick={() => navigate("/connected-stores")}
                >
                  <Store size={18} />

                  <span>Connected Stores</span>
                </button>
              </div>

              {/* SETTINGS */}

              <div className="sidebar-section">
                <p className="sidebar-title">SETTINGS</p>

                <button className="sidebar-item"
                  onClick={() => navigate("/agent-parameters")}
                >
                  <SlidersHorizontal size={18} />
                  <span>Agent Parameters</span>
                </button>

                <button className="sidebar-item"
                  onClick={() => navigate("/till-slips-collwction")}
                >
                  <FileText size={18} />

                  <span>Till Slips Collection</span>
                </button>
              </div>

              {/* Bottom Card */}

              <div className="sidebar-bottom">
                <div className="bottom-profile">
                  <div className="bottom-logo">R</div>

                  <div>
                    <h4>RuachAgent AI</h4>

                    <p>Version 1.0.0</p>
                  </div>
                </div>
              </div>
            </aside>

            {/* ==============================
            MAIN CONTENT
      =============================== */}

            <main className="main-content">
              {/* ==========================
              TOP NAVIGATION
        =========================== */}

              <header className="topbar">
                <div className="topbar-center">
                  <h1>RuachAgent AI</h1>

                  <p>Your intelligent till slip assistant</p>
                </div>

                <div className="topbar-actions">
                  <button className="icon-button">
                    <HelpCircle size={20} />
                  </button>

                  <button className="icon-button">
                    <Bell size={20} />
                  </button>

                  <button className="icon-button">
                    <UserCircle2 size={24} />
                  </button>
                </div>
              </header>

              {/* ==========================
              CONTENT AREA
        =========================== */}

              <div className="content-layout">
                {/* ======================
                 CHAT PANEL
          ======================= */}

                <section className="chat-panel">
                  <div className="chat-window">
                    <div className="hero">
                      <div className="hero-badge">
                        <Sparkles size={16} />
                        <span>RuachAgent AI</span>
                      </div>

                      <h1>
                        Welcome to
                        <span> RuachAgent AI</span>
                      </h1>

                      <p>
                        Your AI assistant for creating, managing and delivering
                        intelligent digital till slips.
                      </p>
                    </div>

                    <div className="feature-grid">
                      <div className="feature-card">
                        <div className="feature-icon">
                          <Palette size={24} />
                        </div>
                        <h3>AI-Powered Design</h3>
                        <p>
                          Instantly generate beautiful till slips using AI while
                          maintaining your brand identity.
                        </p>
                      </div>

                      <div className="feature-card">
                        <div className="feature-icon">
                          <Cpu size={24} />
                        </div>
                        <h3>Smart Parameters</h3>
                        <p>
                          Fine tune receipt formatting, tax rules, merchant details
                          and branding with AI.
                        </p>
                      </div>

                      <div className="feature-card">
                        <div className="feature-icon">
                          <Store size={24} />
                        </div>
                        <h3>Store Integration</h3>
                        <p>
                          Connect POS systems and automatically synchronize digital
                          till slips.
                        </p>
                      </div>

                      <div className="feature-card">
                        <div className="feature-icon">
                          <ArrowUpRight size={24} />
                        </div>
                        <h3>Instant Delivery</h3>
                        <p>
                          Deliver digital receipts through SMS, WhatsApp or Email
                          within seconds.
                        </p>
                      </div>
                    </div>

                    {/* CONVERSATION AREA */}
                    <div className="conversation">
                      {messages.length === 0 ? (
                        <div className="conversation-center">
                          <div className="conversation-icon">
                            <Sparkles size={42} />
                          </div>
                          <h2>Start a conversation</h2>
                          <p>
                            Ask RuachAgent AI to generate, redesign or analyse your
                            till slips.
                          </p>
                        </div>
                      ) : (
                        <div className="messages-thread">
                          {messages.map((msg, index) => (
                            <div
                              key={index}
                              className={`chat-bubble ${msg.role === "user" ? "user-bubble" : "agent-bubble"
                                }`}
                            >
                              <p>{msg.text}</p>
                            </div>
                          ))}
                          {isLoading && (
                            <div className="chat-bubble agent-bubble loading">
                              <p>RuachAgent AI is updating your till slip design...</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* PROMPT SECTION */}
                    <div className="prompt-section">
                      <div className="prompt-box">
                        <input
                          type="text"
                          placeholder="Ask RuachAgent AI anything..."
                          value={inputPrompt}
                          onChange={(e) => setInputPrompt(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && handleSendPrompt()}
                        />
                        <button onClick={handleSendPrompt} disabled={isLoading}>
                          <Send size={18} />
                        </button>
                      </div>

                      <div className="prompt-footer">
                        <span>
                          AI can make mistakes. Verify important information.
                        </span>
                        <span>Powered by RuachAgent AI</span>
                      </div>
                    </div>
                  </div>
                </section>

                {/* ======================
              TILL SLIP PREVIEW
          ======================= */}

                <aside className="preview-panel">
                  <div className="preview-card">
                    {/* Header */}

                    <div className="preview-header">
                      <div>
                        <h2>Till Slip Preview</h2>

                        <p>AI Generated Receipt</p>
                      </div>

                      <div className="status-badge">
                        <div className="status-dot"></div>

                        <span>{isLoading ? "Generating..." : "AI Connected"}</span>
                      </div>
                    </div>

                    {/* Receipt Paper (Connected to Dynamic State) */}

                    <div
                      className="receipt-paper"
                      style={{
                        borderColor: receiptData.themeColor || "#00f0ff"
                      }}
                    >
                      <div className="ai-preview-badge">✨ AI Live Preview</div>

                      <div className="receipt-merchant">
                        <h2>{receiptData.merchantName}</h2>

                        <p>{receiptData.location}</p>
                      </div>

                      <div className="receipt-divider"></div>

                      <div className="receipt-items">
                        {receiptData.items.map((item, idx) => (
                          <div key={idx} className="receipt-row">
                            <span>{item.name}</span>

                            <span>{item.price}</span>
                          </div>
                        ))}
                      </div>

                      <div className="receipt-total">
                        <div className="receipt-total-row">
                          <span>VAT</span>

                          <span>{receiptData.vat}</span>
                        </div>

                        <div className="receipt-total-row receipt-grand-total">
                          <span>Total</span>

                          <span>{receiptData.total}</span>
                        </div>
                      </div>

                      <div className="receipt-qr"></div>

                      <div className="receipt-footer">Powered by RuachAgent AI</div>
                    </div>

                    {/* Statistics */}

                    <div className="preview-stats">
                      <div className="stat-card">
                        <span className="stat-value">0</span>

                        <span className="stat-label">Receipts</span>
                      </div>

                      <div className="stat-card">
                        <span className="stat-value">0</span>

                        <span className="stat-label">Connected</span>
                      </div>
                    </div>

                    {/* AI Status */}

                    <div className="ai-card">
                      <div className="ai-icon">
                        <Cpu size={20} />
                      </div>

                      <div>
                        <h4>RuachAgent AI Engine</h4>

                        <p>
                          {messages.length > 0
                            ? "AI engine actively engaged and rendering receipt changes."
                            : "Waiting for your first request to generate a digital till slip."}
                        </p>
                      </div>
                    </div>

                    {/* Actions */}

                    <div className="preview-actions">
                      <button className="primary-action" onClick={handleSendPrompt}>
                        Generate Preview
                      </button>

                      <button className="secondary-action" onClick={handleClear}>
                        Clear
                      </button>
                    </div>

                    {/* Export */}

                    <div className="export-card">
                      <h3>Export</h3>

                      <p>Download or share your generated receipt.</p>

                      <button className="export-button">Export Receipt</button>
                    </div>
                  </div>
                </aside>
              </div>
            </main>
          </div>
        )}
      </main>
    </div>
  );
}