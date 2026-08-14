import React, { useEffect, useRef, useState } from "react";

import "./AdminPanel.css";
import { supabase } from './supabaseClient';

import { useBusiness } from "./backend/businessService";

import { useNavigate } from "react-router-dom";

import RuachAgentReceiptStudioSystemA from "./RuachAgent_ReceiptStudio_System_A";

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
  ArrowUpRight,
  ChevronDown,
  QrCode,
  Type,
  Layers,
  Move,
  Wand2,
  Eye,
  Zap
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

  // Snapshot the persisted design so AI changes can be discarded locally.
  // This never changes the JSX receipt template or transaction data.
  const originalDesignConfigRef = useRef(null);
  const [hasDesignChanges, setHasDesignChanges] = useState(false);

  // Receipt Editing Studio state. All controls modify designConfig only.
  const [activeStudioObject, setActiveStudioObject] = useState("logo");
  const [openStudioPanel, setOpenStudioPanel] = useState("layout");
  const [selectedTextTarget, setSelectedTextTarget] = useState("heading");

  // Shared selection state for the Receipt Studio.
  // Systems B, C and D all operate on the same selected receipt element.
  const [selectedStudioElement, setSelectedStudioElement] = useState("receipt");

  const handleStudioElementSelect = (elementId) => {
    if (!elementId) return;
    setSelectedStudioElement(elementId);
  };

  const cloneConfig = (value) =>
    JSON.parse(JSON.stringify(value ?? {}));

  const getNestedValue = (object, path, fallback = "") => {
    return path.reduce((current, key) => {
      if (current === null || current === undefined) return fallback;
      return current[key] === undefined ? fallback : current[key];
    }, object);
  };

  const setNestedValue = (object, path, value) => {
    const next = cloneConfig(object);
    let cursor = next;

    path.forEach((key, index) => {
      if (index === path.length - 1) {
        cursor[key] = value;
        return;
      }

      if (!cursor[key] || typeof cursor[key] !== "object" || Array.isArray(cursor[key])) {
        cursor[key] = {};
      }

      cursor = cursor[key];
    });

    return next;
  };

  const updateDesignConfig = (path, value) => {
    setReceiptData((current) => ({
      ...current,
      design_config: setNestedValue(
        current?.design_config || {},
        path,
        value
      )
    }));

    setHasDesignChanges(true);
  };

  const toggleDesignEffect = (path, enabled) => {
    updateDesignConfig(path, enabled);
  };

  const designConfig = receiptData?.design_config || {};

  /*
   * ================================================================
   * SHARED DESIGN CONFIGURATION BRIDGE
   * ================================================================
   *
   * Systems B, C and E are independent UI modules, but they must
   * operate on ONE shared configuration object. System D consumes
   * this same object to render the live receipt.
   *
   * Supported forms:
   *   setDesignConfig(nextObject)
   *   setDesignConfig(current => nextObject)
   *
   * This never edits the receipt JSX.
   */
  const setDesignConfig = (nextConfigOrUpdater) => {
    setReceiptData((current) => {
      const currentConfig = current?.design_config || {};

      const nextConfig =
        typeof nextConfigOrUpdater === "function"
          ? nextConfigOrUpdater(currentConfig)
          : nextConfigOrUpdater;

      return {
        ...current,
        design_config: cloneConfig(nextConfig || {})
      };
    });

    setHasDesignChanges(true);
  };

  const textTargetPath = {
    heading: ["text", "heading"],
    body: ["text", "body"],
    total: ["text", "total"]
  }[selectedTextTarget];

  const textTarget = getNestedValue(
    designConfig,
    textTargetPath || ["text", "heading"],
    {}
  );

  const studioObjects = [
    { id: "logo", label: "Logo", icon: <Layers size={18} /> },
    { id: "qr", label: "QR Code", icon: <QrCode size={18} /> },
    { id: "text", label: "Text", icon: <Type size={18} /> },
    { id: "theme", label: "Theme", icon: <Palette size={18} /> }
  ];

  const toggleStudioPanel = (panel) => {
    setOpenStudioPanel((current) => (current === panel ? "" : panel));
  };


  useEffect(() => {
    if (!receiptData || !selectedTemplateId) return;

    const incomingConfig = receiptData?.design_config || {};

    if (
      originalDesignConfigRef.current === null ||
      originalDesignConfigRef.current.templateId !== selectedTemplateId
    ) {
      originalDesignConfigRef.current = {
        templateId: selectedTemplateId,
        config: JSON.parse(JSON.stringify(incomingConfig))
      };
      setHasDesignChanges(false);
    }
  }, [receiptData, selectedTemplateId]);

  const handlePromptWithDesignTracking = async () => {
    if (!inputPrompt?.trim() || isLoading) return;
    setHasDesignChanges(true);
    return handleSendPrompt();
  };

  const handleRevertToOriginal = () => {
    const snapshot = originalDesignConfigRef.current;

    if (!snapshot || !receiptData) return;

    setReceiptData((current) => ({
      ...current,
      design_config: JSON.parse(JSON.stringify(snapshot.config))
    }));

    setHasDesignChanges(false);

    setMessages((current) => [
      ...current,
      {
        role: "assistant",
        text: "Reverted the till slip to its original saved design."
      }
    ]);
  };

  useEffect(() => {
    const handleTemplateSelected = (event) => {
      const templateId =
        event?.detail ||
        localStorage.getItem("ruachagent:selectedTillSlipDesign") ||
        "matrix-grid";

      setSelectedTemplateId(templateId);
    };

    handleTemplateSelected();

    window.addEventListener(
      "ruachagent:tillSlipDesignSelected",
      handleTemplateSelected
    );

    return () => {
      window.removeEventListener(
        "ruachagent:tillSlipDesignSelected",
        handleTemplateSelected
      );
    };
  }, []);

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
    },

    /* ============================================================
       RUACHAGENT RECEIPT EDITING STUDIO
       Tesla Black / Graphite / Blue Neon
       All studio styling lives in this const styles object.
    ============================================================ */

    editingStudioPanel: {
      minWidth: 0,
      height: '100%',
      background: 'transparent',
      border: 'none',
      boxSizing: 'border-box'
    },

    editingStudio: {
      width: '100%',
      minHeight: 'calc(100vh - 128px)',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      padding: '14px',
      background: 'radial-gradient(circle at 50% 0%, rgba(0,168,255,0.10), transparent 34%), linear-gradient(180deg, #090d12 0%, #05070a 55%, #030405 100%)',
      border: '1px solid rgba(71,151,197,0.22)',
      borderRadius: '18px',
      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04), 0 18px 50px rgba(0,0,0,0.45), 0 0 35px rgba(0,136,255,0.06)',
      boxSizing: 'border-box',
      overflow: 'hidden'
    },

    studioTopbar: {
      minHeight: '70px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '16px',
      padding: '14px 16px',
      background: 'linear-gradient(180deg, rgba(18,25,33,0.98), rgba(9,13,18,0.98))',
      border: '1px solid rgba(89,154,190,0.20)',
      borderRadius: '13px',
      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.035)'
    },

    studioTitleBlock: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      minWidth: 0
    },

    studioBrandMark: {
      width: '38px',
      height: '38px',
      flex: '0 0 38px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#63d8ff',
      background: 'linear-gradient(145deg, rgba(0,184,255,0.22), rgba(0,67,111,0.35))',
      border: '1px solid rgba(35,191,255,0.55)',
      borderRadius: '10px',
      boxShadow: '0 0 22px rgba(0,174,255,0.18), inset 0 0 14px rgba(0,174,255,0.08)'
    },

    studioKicker: {
      marginBottom: '3px',
      color: '#4cc9ff',
      fontSize: '9px',
      fontWeight: 800,
      letterSpacing: '1.3px',
      textTransform: 'uppercase'
    },

    studioTitle: {
      margin: 0,
      color: '#f4f8fb',
      fontSize: '17px',
      lineHeight: 1.15,
      fontWeight: 800,
      letterSpacing: '-0.2px'
    },

    studioSubtitle: {
      margin: '4px 0 0',
      color: '#708292',
      fontSize: '10px',
      lineHeight: 1.35
    },

    studioLiveIndicator: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '7px',
      flex: '0 0 auto',
      padding: '7px 10px',
      color: '#9fe7ff',
      background: 'rgba(0,151,255,0.07)',
      border: '1px solid rgba(0,174,255,0.28)',
      borderRadius: '999px',
      fontSize: '9px',
      fontWeight: 800,
      letterSpacing: '1px'
    },

    studioLiveDot: {
      width: '6px',
      height: '6px',
      borderRadius: '50%',
      background: '#26c8ff',
      boxShadow: '0 0 10px rgba(38,200,255,0.95)'
    },

    studioCommandBar: {
      minHeight: '46px',
      display: 'flex',
      alignItems: 'center',
      gap: '9px',
      padding: '5px',
      background: '#070a0e',
      border: '1px solid rgba(0,172,255,0.28)',
      borderRadius: '12px',
      boxShadow: '0 0 24px rgba(0,144,255,0.07), inset 0 0 16px rgba(0,0,0,0.4)'
    },

    studioCommandIcon: {
      width: '34px',
      height: '34px',
      flex: '0 0 34px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#48cfff',
      background: 'rgba(0,154,255,0.09)',
      borderRadius: '8px'
    },

    studioCommandInput: {
      flex: 1,
      minWidth: 0,
      height: '34px',
      border: 'none',
      outline: 'none',
      background: 'transparent',
      color: '#e9f7ff',
      fontSize: '12px',
      padding: '0 4px',
      boxSizing: 'border-box'
    },

    studioCommandButton: {
      width: '36px',
      height: '36px',
      flex: '0 0 36px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      border: '1px solid rgba(45,193,255,0.35)',
      borderRadius: '9px',
      background: 'linear-gradient(145deg, #0aa9ec, #0871a5)',
      color: '#ffffff',
      cursor: 'pointer',
      boxShadow: '0 0 16px rgba(0,169,255,0.18)'
    },

    studioStatusStrip: {
      minHeight: '32px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '10px',
      padding: '0 3px',
      color: '#6e8495',
      fontSize: '9px'
    },

    studioStatusLeft: {
      display: 'flex',
      alignItems: 'center',
      gap: '7px',
      minWidth: 0
    },

    studioConfigState: {
      flex: '0 0 auto',
      color: '#62d8ff',
      fontSize: '8px',
      fontWeight: 900,
      letterSpacing: '1px',
      padding: '5px 8px',
      border: '1px solid rgba(0,174,255,0.22)',
      borderRadius: '999px',
      background: 'rgba(0,128,255,0.06)'
    },

    studioWorkspace: {
      flex: '1 1 auto',
      minHeight: '390px',
      display: 'grid',
      gridTemplateColumns: '116px minmax(0, 1fr)',
      gap: '10px',
      overflow: 'hidden'
    },

    studioObjectRail: {
      minWidth: 0,
      display: 'flex',
      flexDirection: 'column',
      gap: '6px',
      padding: '10px 8px',
      background: 'linear-gradient(180deg, #0c1117, #070a0e)',
      border: '1px solid rgba(91,135,161,0.18)',
      borderRadius: '12px',
      boxSizing: 'border-box'
    },

    studioRailLabel: {
      padding: '2px 6px 7px',
      color: '#506878',
      fontSize: '8px',
      fontWeight: 900,
      letterSpacing: '1.2px'
    },

    studioObjectButton: {
      width: '100%',
      minHeight: '48px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '7px',
      border: '1px solid transparent',
      borderRadius: '9px',
      background: 'transparent',
      color: '#718697',
      cursor: 'pointer',
      textAlign: 'left',
      transition: 'all 160ms ease',
      boxSizing: 'border-box'
    },

    studioObjectButtonActive: {
      width: '100%',
      minHeight: '48px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '7px',
      border: '1px solid rgba(0,181,255,0.42)',
      borderRadius: '9px',
      background: 'linear-gradient(135deg, rgba(0,165,255,0.15), rgba(0,65,105,0.18))',
      color: '#eaf9ff',
      cursor: 'pointer',
      textAlign: 'left',
      boxShadow: '0 0 18px rgba(0,155,255,0.10), inset 0 0 12px rgba(0,155,255,0.04)',
      boxSizing: 'border-box'
    },

    studioObjectIcon: {
      width: '29px',
      height: '29px',
      flex: '0 0 29px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#52cfff',
      background: 'rgba(0,157,255,0.07)',
      borderRadius: '7px'
    },

    studioObjectLabel: {
      minWidth: 0,
      fontSize: '9px',
      fontWeight: 700,
      lineHeight: 1.15
    },

    studioRailDivider: {
      height: '1px',
      margin: '7px 2px',
      background: 'linear-gradient(90deg, transparent, rgba(102,142,166,0.20), transparent)'
    },

    studioRailMini: {
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      padding: '6px',
      color: '#4c6575',
      fontSize: '8px'
    },

    studioControls: {
      minWidth: 0,
      overflowY: 'auto',
      overflowX: 'hidden',
      padding: '4px 4px 18px 2px',
      scrollbarWidth: 'thin',
      scrollbarColor: '#174766 transparent'
    },

    studioObjectHeading: {
      minHeight: '50px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '12px',
      marginBottom: '9px',
      padding: '4px 3px 9px',
      borderBottom: '1px solid rgba(83,126,149,0.14)',
      color: '#51d1ff'
    },

    studioSection: {
      marginBottom: '8px',
      border: '1px solid rgba(82,122,145,0.16)',
      borderRadius: '10px',
      background: 'linear-gradient(180deg, rgba(13,18,24,0.88), rgba(8,11,15,0.92))',
      overflow: 'hidden'
    },

    studioSectionHeader: {
      width: '100%',
      minHeight: '40px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '10px',
      padding: '0 11px',
      border: 'none',
      background: 'transparent',
      color: '#b6c9d6',
      cursor: 'pointer',
      fontSize: '10px',
      fontWeight: 800,
      textAlign: 'left',
      boxSizing: 'border-box'
    },

    studioSectionBody: {
      display: 'flex',
      flexDirection: 'column',
      gap: '9px',
      padding: '10px',
      borderTop: '1px solid rgba(75,115,138,0.12)',
      background: 'rgba(2,5,8,0.35)'
    },

    studioField: {
      display: 'flex',
      flexDirection: 'column',
      gap: '6px',
      minWidth: 0,
      color: '#78909f',
      fontSize: '9px',
      fontWeight: 700
    },

    studioFieldRow: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
      gap: '9px',
      minWidth: 0
    },

    studioControl: {
      width: '100%',
      minHeight: '34px',
      padding: '7px 9px',
      border: '1px solid rgba(76,121,147,0.24)',
      borderRadius: '7px',
      outline: 'none',
      background: '#070b10',
      color: '#dff5ff',
      fontSize: '10px',
      boxSizing: 'border-box'
    },

    studioSelect: {
      width: '100%',
      minHeight: '34px',
      padding: '6px 28px 6px 9px',
      border: '1px solid rgba(76,121,147,0.24)',
      borderRadius: '7px',
      outline: 'none',
      background: '#070b10',
      color: '#dff5ff',
      fontSize: '10px',
      boxSizing: 'border-box',
      cursor: 'pointer'
    },

    studioRange: {
      width: '100%',
      height: '4px',
      accentColor: '#11aef4',
      cursor: 'pointer'
    },

    studioColorField: {
      minHeight: '38px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '10px',
      padding: '7px 8px',
      border: '1px solid rgba(76,121,147,0.18)',
      borderRadius: '7px',
      background: 'rgba(5,9,13,0.75)',
      color: '#8da2b0',
      fontSize: '9px',
      fontWeight: 700,
      boxSizing: 'border-box'
    },

    studioColorInput: {
      width: '42px',
      height: '25px',
      padding: '2px',
      border: '1px solid rgba(66,190,242,0.35)',
      borderRadius: '5px',
      background: '#05070a',
      cursor: 'pointer',
      boxSizing: 'border-box'
    },

    studioSwitchRow: {
      minHeight: '43px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '12px',
      padding: '7px 8px',
      border: '1px solid rgba(76,121,147,0.16)',
      borderRadius: '8px',
      background: 'rgba(5,9,13,0.66)',
      color: '#d8e7ef',
      boxSizing: 'border-box'
    },

    studioSwitchText: {
      display: 'flex',
      flexDirection: 'column',
      gap: '3px',
      minWidth: 0
    },

    studioSwitchLabel: {
      color: '#c8dce7',
      fontSize: '9px',
      fontWeight: 800
    },

    studioSwitchDescription: {
      color: '#536b7a',
      fontSize: '8px',
      fontWeight: 500
    },

    studioCheckbox: {
      width: '16px',
      height: '16px',
      flex: '0 0 auto',
      accentColor: '#0daaf1',
      cursor: 'pointer'
    },

    studioActivity: {
      flex: '0 0 auto',
      padding: '11px 13px',
      border: '1px solid rgba(69,114,140,0.16)',
      borderRadius: '11px',
      background: 'linear-gradient(180deg, rgba(10,15,21,0.9), rgba(5,8,11,0.95))',
      boxSizing: 'border-box'
    },

    studioActivityHeader: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '10px',
      paddingBottom: '8px',
      marginBottom: '8px',
      borderBottom: '1px solid rgba(76,121,147,0.12)'
    },

    studioActivityList: {
      display: 'flex',
      flexDirection: 'column',
      gap: '7px',
      maxHeight: '110px',
      overflowY: 'auto'
    },

    studioActivityItem: {
      display: 'grid',
      gridTemplateColumns: '28px minmax(0, 1fr)',
      gap: '8px',
      alignItems: 'start',
      padding: '6px 0',
      color: '#8aa1af',
      fontSize: '9px',
      lineHeight: 1.4
    },

    studioActivityItemUser: {
      color: '#bfeaff'
    },

    studioActivityItemAgent: {
      color: '#8aa1af'
    },

    studioFooter: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '12px',
      padding: '3px 2px 0',
      color: '#405463',
      fontSize: '8px',
      lineHeight: 1.35
    },

    studioResponsiveNarrow: {
      gridTemplateColumns: '92px minmax(0, 1fr)'
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
                  onClick={() => navigate("/till-slips-collection")}
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
                    <div
                      onClick={() => setShowAccountMenu(prev => !prev)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "14px",
                        padding: "14px",
                        borderRadius: "14px",
                        cursor: "pointer",
                        transition: "all .25s ease",
                        border: "1px solid rgba(0,180,255,.18)",
                        background: "rgba(15,18,24,.92)"
                      }}
                    >
                      <div
                        style={{
                          width: "44px",
                          height: "44px",
                          borderRadius: "50%",
                          background: "linear-gradient(135deg,#00C6FF,#0084FF)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#fff",
                          fontWeight: 700,
                          fontSize: "17px"
                        }}
                      >
                        {(settings?.business_name || user?.email || "R")
                          .charAt(0)
                          .toUpperCase()}
                      </div>

                      <div style={{ flex: 1 }}>
                        <div
                          style={{
                            color: "#fff",
                            fontWeight: 600,
                            fontSize: "14px"
                          }}
                        >
                          {settings?.business_name || "RuachAgent AI"}
                        </div>

                        <div
                          style={{
                            color: "#7d8a99",
                            fontSize: "12px"
                          }}
                        >
                          {user?.email}
                        </div>
                      </div>

                      <div
                        style={{
                          color: "#00C6FF",
                          fontSize: "18px"
                        }}
                      >
                        ⚙
                      </div>
                    </div>
                    {showAccountMenu && (
                      <div className="account-menu">

                        <div className="account-header">

                          <h3>{settings?.business_name || "Business"}</h3>

                          <p>{user?.email}</p>

                        </div>

                        <button onClick={() => navigate("/agent-parameters")}>
                          Account Settings
                        </button>

                        <button onClick={() => navigate("/billing")}>
                          Billing
                        </button>

                        <button onClick={() => navigate("/security")}>
                          Security
                        </button>

                        <button
                          onClick={async () => {

                            await supabase.auth.signOut();

                            navigate("/");

                          }}
                        >
                          Log Out
                        </button>

                      </div>
                    )}

                  </div>
                </div>
              </div>
            </aside>
            <main
              className="main-content"
              style={{
                padding: 0,
                minWidth: 0,
                minHeight: 0,
                overflow: "hidden"
              }}
            >
              {/* ==========================================================
                  RUACHAGENT RECEIPT STUDIO

                  AdminPanel is the host and persistence owner.
                  System A is the outer Studio Shell and internally mounts:
                    • System B — Properties
                    • System C — Receipt Canvas
                    • System D — Color Grading

                  The three systems therefore share this SAME live document:
                    receiptData.design_config

                  AdminPanel continues to own Save/Revert/Supabase.
                 ========================================================== */}
              <RuachAgentReceiptStudioSystemA
                documentName={
                  settings?.business_name
                    ? `${settings.business_name} — Receipt Studio`
                    : "Matrix Neon Receipt"
                }

                /* Backend / persistence */
                onSave={handleSave}
                onRevert={handleRevertToOriginal}
                onAIAssist={handlePromptWithDesignTracking}
                isSaveSyncing={isSaveSyncing}
                isLoading={isLoading}

                /* Live receipt document */
                receiptData={receiptData}
                settings={settings}
                user={user}
                designConfig={designConfig}
                selectedTemplateId={selectedTemplateId}

                /* Shared designConfig bridge */
                onDesignConfigChange={setDesignConfig}

                /* Shared element selection bridge */
                selectedObjectId={selectedStudioElement}
                selectedElementId={selectedStudioElement}
                onSelectObject={handleStudioElementSelect}
                onSelectElement={handleStudioElementSelect}
              />
            </main>

            {/* Close the authenticated admin workspace branch. */}
          </div>
        )}

        {/* Close the persistent outer content <main>. */}
      </main>
    </div>
  );
}
// The sidebar and topbar should be visually compatible with AdminPanel.jsx(the chat section and till slip preview should be persistent), while Analysis, Connected Stores, Agent Parameters and Till Slips Collection themselves get their own content area.