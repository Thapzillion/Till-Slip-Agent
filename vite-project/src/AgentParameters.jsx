import React, { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";

import { useBusiness } from "./backend/businessService";

// --------------------
// Static data
// --------------------
const CURRENCY_OPTIONS = [
  { code: "ZAR", symbol: "R", name: "South African Rand" },
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "GBP", symbol: "£", name: "British Pound" },
  { code: "EUR", symbol: "€", name: "Euro" },
  { code: "NGN", symbol: "₦", name: "Nigerian Naira" }
];

export default function AgentParameters() {
  const {
    user,
    settings,
    setSettings,
    pendingLogoFile,
    setPendingLogoFile,
    isLoadingSettings,
    isSaveSyncing,
    saveSettings,
    uploadBusinessLogo
  } = useBusiness();


  const liveWebhookUrl =
    settings.webhook_slug
      ? `https://agadjdvhqguunowplbak.functions.supabase.co/receipt-agent?slug=${settings.webhook_slug}`
      : "";

  /* =========================================================
   TESLA / FUTURISTIC SAAS DESIGN SYSTEM
   ========================================================= */

  const styles = {
    /* ---------------------------------------------------------
       PAGE SHELL
       --------------------------------------------------------- */
    page: {
      minHeight: '100%',
      width: '100%',
      background: '#05070a',
      color: '#ffffff',
      position: 'relative',
      overflow: 'hidden',
      fontFamily:
        'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    },

    pageBackground: {
      position: 'absolute',
      inset: 0,
      pointerEvents: 'none',
      overflow: 'hidden',
      background: `
      radial-gradient(
        circle at 12% 8%,
        rgba(0, 140, 255, 0.09),
        transparent 28%
      ),
      radial-gradient(
        circle at 88% 18%,
        rgba(0, 80, 255, 0.06),
        transparent 30%
      ),
      linear-gradient(
        180deg,
        #05070a 0%,
        #070a0f 48%,
        #040609 100%
      )
    `,
    },

    gridOverlay: {
      position: 'absolute',
      inset: 0,
      pointerEvents: 'none',
      opacity: 0.18,
      backgroundImage: `
      linear-gradient(
        rgba(80, 150, 255, 0.035) 1px,
        transparent 1px
      ),
      linear-gradient(
        90deg,
        rgba(80, 150, 255, 0.035) 1px,
        transparent 1px
      )
    `,
      backgroundSize: '42px 42px',
      maskImage:
        'linear-gradient(to bottom, black 0%, transparent 90%)',
      WebkitMaskImage:
        'linear-gradient(to bottom, black 0%, transparent 90%)',
    },

    content: {
      position: 'relative',
      zIndex: 2,
      width: '100%',
      maxWidth: '1680px',
      margin: '0 auto',
      padding: '28px 32px 60px',
      boxSizing: 'border-box',
    },

    /* ---------------------------------------------------------
       PREMIUM HEADER
       --------------------------------------------------------- */

    header: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '24px',
      marginBottom: '26px',
      flexWrap: 'wrap',
    },

    headerLeft: {
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      minWidth: 0,
    },

    headerOrb: {
      width: '46px',
      height: '46px',
      minWidth: '46px',
      borderRadius: '14px',
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: `
      radial-gradient(
        circle at 35% 30%,
        rgba(120, 200, 255, 0.25),
        transparent 45%
      ),
      linear-gradient(
        145deg,
        #101722,
        #070a0f
      )
    `,
      border: '1px solid rgba(45, 145, 255, 0.45)',
      boxShadow: `
      inset 0 1px 0 rgba(255,255,255,0.07),
      0 0 25px rgba(0,100,255,0.10)
    `,
    },

    headerOrbCore: {
      width: '12px',
      height: '12px',
      borderRadius: '50%',
      background: '#65b8ff',
      boxShadow: `
      0 0 8px rgba(70,170,255,0.95),
      0 0 22px rgba(0,120,255,0.75),
      0 0 42px rgba(0,100,255,0.35)
    `,
    },

    eyebrow: {
      fontSize: '9px',
      fontWeight: '700',
      letterSpacing: '2.2px',
      color: '#5c6b7c',
      textTransform: 'uppercase',
      marginBottom: '5px',
    },

    pageTitle: {
      margin: 0,
      fontSize: '25px',
      lineHeight: 1.15,
      fontWeight: '600',
      letterSpacing: '-0.7px',
      color: '#f5f8fc',
    },

    pageSubtitle: {
      margin: '6px 0 0',
      color: '#6f7b89',
      fontSize: '11px',
      lineHeight: 1.5,
      maxWidth: '650px',
    },

    headerRight: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      flexWrap: 'wrap',
    },

    statusPill: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      padding: '8px 12px',
      borderRadius: '999px',
      border: '1px solid rgba(45, 145, 255, 0.24)',
      background: 'rgba(8, 15, 24, 0.72)',
      color: '#9eb0c3',
      fontSize: '9px',
      fontWeight: '600',
      letterSpacing: '1px',
      textTransform: 'uppercase',
      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04)',
    },

    statusDot: {
      width: '6px',
      height: '6px',
      borderRadius: '50%',
      background: '#48aaff',
      boxShadow: '0 0 10px rgba(72,170,255,0.9)',
    },

    /* ---------------------------------------------------------
       METRICS
       --------------------------------------------------------- */

    metricsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
      gap: '12px',
      marginBottom: '18px',
    },

    metricCard: {
      position: 'relative',
      overflow: 'hidden',
      minHeight: '105px',
      padding: '17px',
      borderRadius: '14px',
      background: `
      linear-gradient(
        145deg,
        rgba(15, 21, 29, 0.98),
        rgba(7, 10, 15, 0.98)
      )
    `,
      border: '1px solid rgba(66, 102, 138, 0.24)',
      boxShadow: `
      inset 0 1px 0 rgba(255,255,255,0.045),
      0 14px 40px rgba(0,0,0,0.22)
    `,
    },

    metricGlow: {
      position: 'absolute',
      width: '100px',
      height: '100px',
      right: '-40px',
      top: '-45px',
      borderRadius: '50%',
      background:
        'radial-gradient(circle, rgba(0,120,255,0.16), transparent 70%)',
      pointerEvents: 'none',
    },

    metricLabel: {
      fontSize: '8px',
      fontWeight: '700',
      color: '#5e6c7b',
      letterSpacing: '1.5px',
      textTransform: 'uppercase',
      marginBottom: '10px',
    },

    metricValue: {
      fontSize: '22px',
      lineHeight: 1,
      fontWeight: '600',
      color: '#f5f8fc',
      letterSpacing: '-0.5px',
      fontFamily:
        'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    },

    metricMeta: {
      marginTop: '9px',
      fontSize: '9px',
      color: '#647283',
    },

    metricAccent: {
      color: '#64b8ff',
    },

    /* ---------------------------------------------------------
       MAIN DASHBOARD GRID
       --------------------------------------------------------- */

    dashboardGrid: {
      display: 'grid',
      gridTemplateColumns: 'minmax(0, 1.35fr) minmax(360px, 0.65fr)',
      gap: '16px',
      alignItems: 'start',
    },

    leftColumn: {
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
      minWidth: 0,
    },

    rightColumn: {
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
      minWidth: 0,
    },

    /* ---------------------------------------------------------
       UNIVERSAL SAAS CARD
       --------------------------------------------------------- */

    card: {
      position: 'relative',
      overflow: 'hidden',
      borderRadius: '16px',
      background: `
      linear-gradient(
        145deg,
        rgba(13, 18, 25, 0.98),
        rgba(6, 9, 14, 0.99)
      )
    `,
      border: '1px solid rgba(69, 103, 137, 0.23)',
      boxShadow: `
      inset 0 1px 0 rgba(255,255,255,0.045),
      0 18px 55px rgba(0,0,0,0.28)
    `,
    },

    cardHeader: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '15px',
      padding: '19px 20px',
      borderBottom: '1px solid rgba(255,255,255,0.055)',
    },

    cardHeaderLeft: {
      display: 'flex',
      alignItems: 'center',
      gap: '11px',
      minWidth: 0,
    },

    cardIcon: {
      width: '32px',
      height: '32px',
      borderRadius: '9px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'rgba(25, 55, 88, 0.28)',
      border: '1px solid rgba(62, 150, 255, 0.24)',
      color: '#68b8ff',
      fontSize: '12px',
      boxShadow: '0 0 18px rgba(0,100,255,0.08)',
    },

    cardTitle: {
      margin: 0,
      fontSize: '12px',
      fontWeight: '650',
      color: '#edf3f9',
      letterSpacing: '0.15px',
    },

    cardDescription: {
      margin: '3px 0 0',
      fontSize: '9px',
      color: '#697686',
      lineHeight: 1.45,
    },

    cardBody: {
      padding: '20px',
    },

    /* ---------------------------------------------------------
       FORM SYSTEM
       --------------------------------------------------------- */

    fieldGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
      gap: '15px',
    },

    field: {
      minWidth: 0,
    },

    fieldFull: {
      gridColumn: '1 / -1',
    },

    label: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '8px',
      marginBottom: '7px',
      fontSize: '8px',
      fontWeight: '700',
      color: '#718092',
      letterSpacing: '1.15px',
      textTransform: 'uppercase',
    },

    labelHint: {
      color: '#3f5368',
      fontSize: '8px',
      letterSpacing: '0',
      textTransform: 'none',
      fontWeight: '500',
    },

    input: {
      width: '100%',
      boxSizing: 'border-box',
      minHeight: '42px',
      padding: '11px 13px',
      borderRadius: '9px',
      outline: 'none',
      border: '1px solid rgba(73, 103, 134, 0.28)',
      background: 'rgba(4, 7, 11, 0.92)',
      color: '#eaf1f8',
      fontSize: '11px',
      fontFamily:
        'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      transition: 'all 160ms ease',
      boxShadow: `
      inset 0 1px 4px rgba(0,0,0,0.32),
      0 1px 0 rgba(255,255,255,0.02)
    `,
    },

    textarea: {
      width: '100%',
      boxSizing: 'border-box',
      minHeight: '90px',
      padding: '11px 13px',
      borderRadius: '9px',
      outline: 'none',
      resize: 'vertical',
      border: '1px solid rgba(73, 103, 134, 0.28)',
      background: 'rgba(4, 7, 11, 0.92)',
      color: '#eaf1f8',
      fontSize: '11px',
      lineHeight: 1.55,
      fontFamily:
        'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    },

    select: {
      width: '100%',
      minHeight: '42px',
      boxSizing: 'border-box',
      padding: '0 38px 0 13px',
      borderRadius: '9px',
      outline: 'none',
      border: '1px solid rgba(73, 103, 134, 0.28)',
      background: '#070b10',
      color: '#eaf1f8',
      fontSize: '11px',
      fontFamily: 'monospace',
      appearance: 'none',
      cursor: 'pointer',
    },

    /* ---------------------------------------------------------
       LOGO UPLOAD
       --------------------------------------------------------- */

    uploadPanel: {
      display: 'grid',
      gridTemplateColumns: '1fr 150px',
      gap: '16px',
      alignItems: 'stretch',
    },

    uploadZone: {
      position: 'relative',
      minHeight: '145px',
      borderRadius: '13px',
      border: '1px dashed rgba(64, 155, 255, 0.34)',
      background: `
      radial-gradient(
        circle at 50% 0%,
        rgba(0, 120, 255, 0.08),
        transparent 58%
      ),
      rgba(4, 8, 13, 0.76)
    `,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      cursor: 'pointer',
      overflow: 'hidden',
    },

    uploadContent: {
      position: 'relative',
      zIndex: 2,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '7px',
    },

    uploadIcon: {
      width: '42px',
      height: '42px',
      borderRadius: '12px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#65b7ff',
      background: 'rgba(35, 102, 165, 0.15)',
      border: '1px solid rgba(68, 158, 255, 0.25)',
      fontSize: '17px',
    },

    uploadTitle: {
      color: '#dbe7f3',
      fontSize: '11px',
      fontWeight: '600',
    },

    uploadHint: {
      color: '#596979',
      fontSize: '8px',
    },

    logoPreview: {
      minHeight: '145px',
      borderRadius: '13px',
      border: '1px solid rgba(72, 101, 132, 0.24)',
      background: `
      radial-gradient(
        circle,
        rgba(255,255,255,0.035),
        transparent 65%
      ),
      #06090d
    `,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
    },

    logoImage: {
      width: '100%',
      height: '100%',
      maxHeight: '145px',
      objectFit: 'contain',
      padding: '15px',
      boxSizing: 'border-box',
    },

    /* ---------------------------------------------------------
       WEBHOOK
       --------------------------------------------------------- */

    webhookPanel: {
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
    },

    webhookPreview: {
      position: 'relative',
      padding: '14px',
      borderRadius: '11px',
      border: '1px solid rgba(55, 137, 235, 0.28)',
      background: `
      linear-gradient(
        135deg,
        rgba(7, 21, 37, 0.72),
        rgba(4, 9, 15, 0.95)
      )
    `,
      overflow: 'hidden',
    },

    webhookLabel: {
      fontSize: '7px',
      fontWeight: '700',
      letterSpacing: '1.4px',
      color: '#4e759b',
      textTransform: 'uppercase',
      marginBottom: '8px',
    },

    webhookUrl: {
      display: 'block',
      width: '100%',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      color: '#75bcff',
      fontFamily: 'monospace',
      fontSize: '10px',
      lineHeight: 1.5,
    },

    webhookActions: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '9px',
    },

    /* ---------------------------------------------------------
       AI CONFIGURATION
       --------------------------------------------------------- */

    aiBanner: {
      display: 'flex',
      alignItems: 'center',
      gap: '11px',
      padding: '12px 14px',
      marginBottom: '18px',
      borderRadius: '10px',
      border: '1px solid rgba(67, 145, 225, 0.24)',
      background: `
      linear-gradient(
        90deg,
        rgba(14, 47, 78, 0.34),
        rgba(8, 16, 25, 0.65)
      )
    `,
    },

    aiPulse: {
      width: '8px',
      height: '8px',
      minWidth: '8px',
      borderRadius: '50%',
      background: '#55b5ff',
      boxShadow: `
      0 0 8px rgba(85,181,255,0.9),
      0 0 22px rgba(35,130,255,0.55)
    `,
    },

    aiBannerTitle: {
      fontSize: '9px',
      fontWeight: '700',
      color: '#b9dcfa',
      letterSpacing: '0.7px',
      textTransform: 'uppercase',
    },

    aiBannerText: {
      marginTop: '2px',
      fontSize: '8px',
      color: '#61768a',
    },

    rangeValue: {
      color: '#65b8ff',
      fontFamily: 'monospace',
      fontWeight: '700',
    },

    /* ---------------------------------------------------------
       AI RECOMMENDATIONS
       --------------------------------------------------------- */

    recommendationPanel: {
      marginTop: '18px',
      padding: '15px',
      borderRadius: '11px',
      border: '1px solid rgba(55, 102, 144, 0.24)',
      background: 'rgba(5, 10, 16, 0.72)',
    },

    recommendationHeader: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '12px',
    },

    recommendationTitle: {
      fontSize: '8px',
      fontWeight: '700',
      letterSpacing: '1.2px',
      color: '#8093a7',
      textTransform: 'uppercase',
    },

    recommendationList: {
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
    },

    recommendationItem: {
      display: 'flex',
      gap: '9px',
      alignItems: 'flex-start',
      fontSize: '9px',
      lineHeight: 1.45,
      color: '#6f7f90',
    },

    recommendationBullet: {
      width: '5px',
      height: '5px',
      minWidth: '5px',
      marginTop: '4px',
      borderRadius: '50%',
      background: '#579fe0',
      boxShadow: '0 0 8px rgba(87,159,224,0.7)',
    },

    /* ---------------------------------------------------------
       BUSINESS INSIGHTS
       --------------------------------------------------------- */

    insightGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
      gap: '10px',
    },

    insight: {
      padding: '13px',
      borderRadius: '10px',
      background: 'rgba(4, 8, 13, 0.75)',
      border: '1px solid rgba(66, 96, 126, 0.2)',
    },

    insightLabel: {
      fontSize: '7px',
      color: '#556575',
      letterSpacing: '1px',
      fontWeight: '700',
      textTransform: 'uppercase',
      marginBottom: '7px',
    },

    insightValue: {
      color: '#dbe7f2',
      fontSize: '12px',
      fontWeight: '600',
    },

    /* ---------------------------------------------------------
       TILL SLIP PREVIEW
       --------------------------------------------------------- */

    previewCard: {
      position: 'sticky',
      top: '20px',
      borderRadius: '16px',
      padding: '18px',
      background: `
      linear-gradient(
        145deg,
        rgba(12, 17, 23, 0.98),
        rgba(5, 8, 12, 0.99)
      )
    `,
      border: '1px solid rgba(74, 108, 141, 0.24)',
      boxShadow: `
      inset 0 1px 0 rgba(255,255,255,0.045),
      0 22px 65px rgba(0,0,0,0.32)
    `,
    },

    previewHeader: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '16px',
    },

    previewTitle: {
      fontSize: '11px',
      fontWeight: '650',
      color: '#e9f1f8',
    },

    previewStatus: {
      fontSize: '7px',
      fontWeight: '700',
      color: '#69b8ff',
      letterSpacing: '1px',
      textTransform: 'uppercase',
    },

    paperStage: {
      minHeight: '500px',
      borderRadius: '12px',
      padding: '22px',
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'center',
      background: `
      radial-gradient(
        circle at 50% 15%,
        rgba(45, 120, 210, 0.08),
        transparent 38%
      ),
      #030507
    `,
      border: '1px solid rgba(255,255,255,0.035)',
      overflow: 'hidden',
    },

    paper: {
      width: 'min(100%, 285px)',
      minHeight: '440px',
      background: '#f7f7f5',
      color: '#111111',
      boxShadow: `
      0 22px 50px rgba(0,0,0,0.55),
      0 0 0 1px rgba(255,255,255,0.08)
    `,
      padding: '22px 18px',
      boxSizing: 'border-box',
      fontFamily: 'monospace',
    },

    paperHeader: {
      textAlign: 'center',
      borderBottom: '1px dashed #777',
      paddingBottom: '13px',
      marginBottom: '14px',
    },

    paperLogoPlaceholder: {
      width: '48px',
      height: '48px',
      margin: '0 auto 9px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      border: '1px solid #999',
      color: '#777',
      fontSize: '8px',
    },

    paperBusinessName: {
      fontSize: '12px',
      fontWeight: '700',
      marginBottom: '4px',
    },

    paperText: {
      fontSize: '7px',
      color: '#555',
      lineHeight: 1.55,
    },

    paperLine: {
      display: 'flex',
      justifyContent: 'space-between',
      gap: '12px',
      fontSize: '8px',
      marginBottom: '7px',
    },

    paperDivider: {
      borderTop: '1px dashed #888',
      margin: '13px 0',
    },

    paperTotal: {
      display: 'flex',
      justifyContent: 'space-between',
      fontSize: '11px',
      fontWeight: '700',
    },

    paperQr: {
      width: '72px',
      height: '72px',
      margin: '22px auto 0',
      border: '5px solid #111',
      background: `
      repeating-linear-gradient(
        45deg,
        #111 0,
        #111 3px,
        #fff 3px,
        #fff 6px
      )
    `,
    },

    /* ---------------------------------------------------------
       BUTTON SYSTEM
       --------------------------------------------------------- */

    button: {
      minHeight: '40px',
      padding: '0 14px',
      borderRadius: '9px',
      border: '1px solid rgba(75, 139, 198, 0.28)',
      background: `
      linear-gradient(
        180deg,
        rgba(24, 37, 51, 0.98),
        rgba(11, 17, 24, 0.98)
      )
    `,
      color: '#dceaf6',
      fontSize: '9px',
      fontWeight: '700',
      letterSpacing: '0.65px',
      textTransform: 'uppercase',
      cursor: 'pointer',
      boxShadow: `
      inset 0 1px 0 rgba(255,255,255,0.06),
      0 8px 22px rgba(0,0,0,0.18)
    `,
      transition: 'all 160ms ease',
    },

    primaryButton: {
      minHeight: '44px',
      padding: '0 18px',
      borderRadius: '10px',
      border: '1px solid rgba(84, 177, 255, 0.72)',
      background: `
      linear-gradient(
        180deg,
        #8fd1ff 0%,
        #3e9de8 45%,
        #2475b5 100%
      )
    `,
      color: '#03101a',
      fontSize: '9px',
      fontWeight: '800',
      letterSpacing: '0.8px',
      textTransform: 'uppercase',
      cursor: 'pointer',
      boxShadow: `
      0 0 18px rgba(43, 150, 255, 0.20),
      inset 0 1px 0 rgba(255,255,255,0.55)
    `,
    },

    secondaryButton: {
      minHeight: '40px',
      padding: '0 13px',
      borderRadius: '9px',
      border: '1px solid rgba(74, 115, 151, 0.28)',
      background: 'rgba(7, 12, 18, 0.92)',
      color: '#8fa3b7',
      fontSize: '8px',
      fontWeight: '700',
      letterSpacing: '0.65px',
      textTransform: 'uppercase',
      cursor: 'pointer',
    },

    /* ---------------------------------------------------------
       SAVE FOOTER
       --------------------------------------------------------- */

    saveFooter: {
      marginTop: '16px',
      padding: '15px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '15px',
      borderRadius: '13px',
      border: '1px solid rgba(59, 104, 143, 0.23)',
      background: `
      linear-gradient(
        90deg,
        rgba(8, 16, 25, 0.95),
        rgba(5, 9, 14, 0.98)
      )
    `,
    },

    saveInfo: {
      minWidth: 0,
    },

    saveTitle: {
      color: '#dbe8f3',
      fontSize: '9px',
      fontWeight: '700',
      letterSpacing: '0.7px',
      textTransform: 'uppercase',
    },

    saveDescription: {
      marginTop: '4px',
      color: '#5f7081',
      fontSize: '8px',
    },

    /* ---------------------------------------------------------
       RESPONSIVE
       --------------------------------------------------------- */

    mobileStack: {
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
    },

    /* ---------------------------------------------------------
       LEGACY COMPATIBILITY
       
       These preserve the style names used by your original
       JSX so existing backend-connected JSX can continue to
       reference styles.input, styles.button, etc.
       --------------------------------------------------------- */

    concaveCard: {
      position: 'relative',
      background: `
      linear-gradient(
        145deg,
        rgba(11, 16, 22, 0.98),
        rgba(5, 8, 12, 0.98)
      )
    `,
      border: '1px solid rgba(67, 101, 134, 0.24)',
      borderRadius: '10px',
      boxShadow: `
      inset 0 1px 0 rgba(255,255,255,0.035),
      inset 0 -8px 20px rgba(0,0,0,0.14)
    `,
    },
  };
  const SAFE_CURRENCY_OPTIONS = CURRENCY_OPTIONS;

  const activeCurrencySymbol =
    SAFE_CURRENCY_OPTIONS.find(
      c => c.code === settings.currency
    )?.symbol || "R";

  // ===========================
  // Initial Load
  // ===========================

  useEffect(() => {

    async function initializePage() {

      setIsLoadingSettings(true);

      try {

        // Connectivity check
        await checkSupabaseReachability();

        // Current authenticated user
        const activeUser = await getActiveUser();

        if (!activeUser) {
          setUser(null);
          return;
        }

        setUser(activeUser);

        // Merchant settings
        const merchantSettings =
          await fetchMerchantSettings(activeUser.id);

        if (merchantSettings) {
          setSettings(merchantSettings);
        }

      } catch (error) {

        console.error(
          "Agent Parameters initialization failed:",
          error
        );

      } finally {

        setIsLoadingSettings(false);

      }

    }

    initializePage();

  }, []);

  // ===========================
  // Save Settings
  // ===========================

  async function handleSave(e) {

    if (e) e.preventDefault();

    if (isSaveSyncing) return;

    setIsSaveSyncing(true);

    try {

      const activeUser = user || await getActiveUser();

      if (!activeUser?.id) {
        alert("Active session required.");
        return;
      }

      let logoUrl = settings.logo_url;

      if (
        logoUrl.startsWith("blob:") &&
        pendingLogoFile
      ) {

        const uploadedUrl =
          await uploadBusinessLogo(
            pendingLogoFile,
            settings.webhook_slug
          );

        if (uploadedUrl) {
          logoUrl = uploadedUrl;
          setPendingLogoFile(null);
        }
      }

      const payload = {

        owner_id: activeUser.id,

        business_name: settings.business_name,

        store_address: settings.store_address,

        discount_percentage:
          Number(settings.discount_percentage),

        webhook_slug: settings.webhook_slug,

        currency: settings.currency,

        logo_url: logoUrl,

        voucher_expiration_days:
          Number(settings.voucher_expiration_days)

      };

      if (settings.id) {
        payload.id = settings.id;
      }

      const { data, error } =
        await supabase
          .from("business_settings")
          .upsert(payload, {
            onConflict: "owner_id"
          })
          .select()
          .single();

      if (error) throw error;

      setSettings(data);

      alert("Settings saved successfully.");

    } catch (error) {

      console.error(error);

      alert(error.message);

    } finally {

      setIsSaveSyncing(false);

    }

  }

  return (
    <div
      style={{
        width: '100%',
        minHeight: '100%',
        background:
          'radial-gradient(circle at 15% 0%, rgba(0,122,255,0.08), transparent 28%), radial-gradient(circle at 90% 20%, rgba(0,180,255,0.045), transparent 25%), #05070a',
        color: '#ffffff',
        fontFamily:
          'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        position: 'relative',
        overflow: 'hidden',
      }}
    >

      {/* =========================================================
        AMBIENT TESLA LIGHTING
    ========================================================= */}

      <div
        style={{
          position: 'absolute',
          top: '-220px',
          left: '-180px',
          width: '520px',
          height: '520px',
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(0,130,255,0.09), transparent 68%)',
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          position: 'absolute',
          top: '35%',
          right: '-280px',
          width: '620px',
          height: '620px',
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(0,180,255,0.045), transparent 68%)',
          pointerEvents: 'none',
        }}
      />

      {/* =========================================================
        PAGE WRAPPER
    ========================================================= */}

      <div
        style={{
          width: '100%',
          maxWidth: '1700px',
          margin: '0 auto',
          padding: '30px 34px 60px',
          position: 'relative',
          zIndex: 2,
          boxSizing: 'border-box',
        }}
      >

        {/* =======================================================
          PREMIUM PAGE HEADER
      ======================================================= */}

        <section
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            gap: '25px',
            marginBottom: '26px',
            paddingBottom: '22px',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
          }}
        >

          <div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '9px',
                marginBottom: '9px',
              }}
            >

              <div
                style={{
                  width: '7px',
                  height: '7px',
                  borderRadius: '50%',
                  background: '#00aaff',
                  boxShadow:
                    '0 0 8px rgba(0,170,255,0.95), 0 0 20px rgba(0,120,255,0.5)',
                }}
              />

              <span
                style={{
                  fontSize: '9px',
                  fontWeight: '700',
                  letterSpacing: '1.8px',
                  color: '#4daeff',
                  textTransform: 'uppercase',
                }}
              >
                RUACHAGENT / CONTROL CENTER
              </span>

            </div>

            <h1
              style={{
                margin: 0,
                fontSize: '30px',
                lineHeight: 1.1,
                fontWeight: '600',
                letterSpacing: '-0.8px',
                color: '#ffffff',
              }}
            >
              Agent Parameters
            </h1>

            <p
              style={{
                margin: '9px 0 0',
                color: '#6d7785',
                fontSize: '12px',
                lineHeight: 1.6,
                maxWidth: '650px',
              }}
            >
              Configure the identity, transaction intelligence, webhook
              infrastructure and voucher behavior powering your RuachAgent
              merchant agent.
            </p>

          </div>

          {/* HEADER STATUS */}

          <div
            style={{
              minWidth: '220px',
              padding: '13px 15px',
              borderRadius: '12px',
              background:
                'linear-gradient(145deg, rgba(12,17,24,0.96), rgba(5,8,12,0.96))',
              border: '1px solid rgba(0,142,255,0.20)',
              boxShadow:
                'inset 0 1px 0 rgba(255,255,255,0.035), 0 15px 45px rgba(0,0,0,0.25)',
            }}
          >

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >

              <span
                style={{
                  fontSize: '9px',
                  color: '#65707d',
                  letterSpacing: '1px',
                  textTransform: 'uppercase',
                }}
              >
                AGENT STATUS
              </span>

              <span
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '9px',
                  color: '#55d8ff',
                  fontWeight: '700',
                }}
              >
                <span
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: '#28cfff',
                    boxShadow: '0 0 10px rgba(40,207,255,0.8)',
                  }}
                />
                ONLINE
              </span>

            </div>

            <div
              style={{
                marginTop: '10px',
                fontFamily: 'monospace',
                fontSize: '10px',
                color: '#9ba8b8',
              }}
            >
              {user?.email || 'Authenticated merchant'}
            </div>

          </div>

        </section>


        {/* =======================================================
          EXECUTIVE METRICS
      ======================================================= */}

        <div
          style={{
            display: 'grid',
            gridTemplateColumns:
              'repeat(auto-fit, minmax(190px, 1fr))',
            gap: '12px',
            marginBottom: '18px',
          }}
        >

          {/* CONFIGURATION HEALTH */}

          <div
            style={{
              padding: '17px',
              borderRadius: '14px',
              background:
                'linear-gradient(145deg, rgba(13,18,25,0.96), rgba(7,10,14,0.96))',
              border: '1px solid rgba(0,135,255,0.18)',
              boxShadow:
                'inset 0 1px 0 rgba(255,255,255,0.035), 0 14px 35px rgba(0,0,0,0.25)',
            }}
          >

            <div
              style={{
                color: '#697687',
                fontSize: '9px',
                letterSpacing: '1.1px',
                textTransform: 'uppercase',
              }}
            >
              Configuration Health
            </div>

            <div
              style={{
                marginTop: '9px',
                fontSize: '25px',
                fontWeight: '600',
                color: '#ffffff',
              }}
            >
              {settings?.business_name &&
                settings?.webhook_slug
                ? '100%'
                : '72%'}
            </div>

            <div
              style={{
                marginTop: '5px',
                color: '#4dbdff',
                fontSize: '9px',
              }}
            >
              PARAMETERS READY
            </div>

          </div>


          {/* CURRENCY */}

          <div
            style={{
              padding: '17px',
              borderRadius: '14px',
              background:
                'linear-gradient(145deg, rgba(13,18,25,0.96), rgba(7,10,14,0.96))',
              border: '1px solid rgba(0,135,255,0.18)',
              boxShadow:
                'inset 0 1px 0 rgba(255,255,255,0.035), 0 14px 35px rgba(0,0,0,0.25)',
            }}
          >

            <div
              style={{
                color: '#697687',
                fontSize: '9px',
                letterSpacing: '1.1px',
                textTransform: 'uppercase',
              }}
            >
              Operational Currency
            </div>

            <div
              style={{
                marginTop: '9px',
                fontSize: '25px',
                fontWeight: '600',
              }}
            >
              {settings?.currency || 'ZAR'}
            </div>

            <div
              style={{
                marginTop: '5px',
                color: '#697687',
                fontSize: '9px',
              }}
            >
              TRANSACTION ENGINE
            </div>

          </div>


          {/* DISCOUNT */}

          <div
            style={{
              padding: '17px',
              borderRadius: '14px',
              background:
                'linear-gradient(145deg, rgba(13,18,25,0.96), rgba(7,10,14,0.96))',
              border: '1px solid rgba(0,135,255,0.18)',
              boxShadow:
                'inset 0 1px 0 rgba(255,255,255,0.035), 0 14px 35px rgba(0,0,0,0.25)',
            }}
          >

            <div
              style={{
                color: '#697687',
                fontSize: '9px',
                letterSpacing: '1.1px',
                textTransform: 'uppercase',
              }}
            >
              AI Discount Compiler
            </div>

            <div
              style={{
                marginTop: '9px',
                fontSize: '25px',
                fontWeight: '600',
              }}
            >
              {settings?.discount_percentage ?? 10}%
            </div>

            <div
              style={{
                marginTop: '5px',
                color: '#697687',
                fontSize: '9px',
              }}
            >
              ACTIVE POLICY
            </div>

          </div>


          {/* VOUCHER */}

          <div
            style={{
              padding: '17px',
              borderRadius: '14px',
              background:
                'linear-gradient(145deg, rgba(13,18,25,0.96), rgba(7,10,14,0.96))',
              border: '1px solid rgba(0,135,255,0.18)',
              boxShadow:
                'inset 0 1px 0 rgba(255,255,255,0.035), 0 14px 35px rgba(0,0,0,0.25)',
            }}
          >

            <div
              style={{
                color: '#697687',
                fontSize: '9px',
                letterSpacing: '1.1px',
                textTransform: 'uppercase',
              }}
            >
              Voucher Lifetime
            </div>

            <div
              style={{
                marginTop: '9px',
                fontSize: '25px',
                fontWeight: '600',
              }}
            >
              {settings?.voucher_expiration_days ?? 30}
              <span
                style={{
                  fontSize: '11px',
                  color: '#6b7685',
                  marginLeft: '5px',
                }}
              >
                DAYS
              </span>
            </div>

            <div
              style={{
                marginTop: '5px',
                color: '#697687',
                fontSize: '9px',
              }}
            >
              EXPIRATION POLICY
            </div>

          </div>

        </div>


        {/* =======================================================
          MAIN DASHBOARD GRID
      ======================================================= */}

        <div
          style={{
            display: 'grid',
            gridTemplateColumns:
              'minmax(0, 1.15fr) minmax(340px, 0.85fr)',
            gap: '18px',
            alignItems: 'start',
          }}
        >


          {/* =====================================================
            LEFT COLUMN
        ===================================================== */}

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '18px',
              minWidth: 0,
            }}
          >


            {/* ===================================================
              BUSINESS IDENTITY
          =================================================== */}

            <section
              style={{
                position: 'relative',
                overflow: 'hidden',
                borderRadius: '18px',
                padding: '22px',
                background:
                  'linear-gradient(145deg, rgba(12,17,24,0.98), rgba(5,8,12,0.98))',
                border: '1px solid rgba(0,142,255,0.22)',
                boxShadow:
                  'inset 0 1px 0 rgba(255,255,255,0.035), 0 20px 60px rgba(0,0,0,0.32)',
              }}
            >

              {/* BLUE EDGE LIGHT */}

              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: '7%',
                  right: '7%',
                  height: '1px',
                  background:
                    'linear-gradient(90deg, transparent, rgba(0,157,255,0.75), transparent)',
                  boxShadow: '0 0 18px rgba(0,130,255,0.4)',
                }}
              />

              {/* HEADER */}

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '22px',
                }}
              >

                <div>

                  <div
                    style={{
                      fontSize: '9px',
                      color: '#389eff',
                      letterSpacing: '1.5px',
                      fontWeight: '700',
                    }}
                  >
                    01 / BUSINESS IDENTITY
                  </div>

                  <h2
                    style={{
                      margin: '7px 0 0',
                      fontSize: '18px',
                      fontWeight: '600',
                      letterSpacing: '-0.2px',
                    }}
                  >
                    Merchant Profile
                  </h2>

                  <p
                    style={{
                      margin: '6px 0 0',
                      color: '#687482',
                      fontSize: '10px',
                    }}
                  >
                    The identity printed across your intelligent till slips.
                  </p>

                </div>

                <div
                  style={{
                    padding: '6px 9px',
                    borderRadius: '7px',
                    border: '1px solid rgba(0,145,255,0.18)',
                    background: 'rgba(0,110,255,0.04)',
                    color: '#4eaeff',
                    fontSize: '8px',
                    letterSpacing: '1px',
                  }}
                >
                  MERCHANT CORE
                </div>

              </div>


              {/* LOGO AREA */}

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns:
                    'minmax(190px, 0.8fr) minmax(0, 1.2fr)',
                  gap: '18px',
                  marginBottom: '20px',
                }}
              >

                {/* LOGO UPLOADER */}

                <label
                  htmlFor="logo-upload"
                  style={{
                    position: 'relative',
                    minHeight: '190px',
                    borderRadius: '15px',
                    border:
                      '1px dashed rgba(0,150,255,0.35)',
                    background:
                      'radial-gradient(circle at center, rgba(0,110,255,0.07), transparent 65%), #070b10',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    overflow: 'hidden',
                    boxSizing: 'border-box',
                  }}
                >

                  <div
                    style={{
                      position: 'absolute',
                      inset: '10px',
                      border:
                        '1px solid rgba(255,255,255,0.035)',
                      borderRadius: '11px',
                      pointerEvents: 'none',
                    }}
                  />

                  {settings?.logo_url ? (

                    <img
                      src={settings.logo_url}
                      alt="Business Logo"
                      style={{
                        width: '110px',
                        height: '110px',
                        objectFit: 'contain',
                        borderRadius: '12px',
                        position: 'relative',
                        zIndex: 2,
                      }}
                    />

                  ) : (

                    <div
                      style={{
                        width: '78px',
                        height: '78px',
                        borderRadius: '18px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '30px',
                        color: '#27303a',
                        background:
                          'linear-gradient(145deg, #111820, #06090d)',
                        border:
                          '1px solid rgba(0,140,255,0.18)',
                        boxShadow:
                          'inset 0 1px 0 rgba(255,255,255,0.04)',
                      }}
                    >
                      ◇
                    </div>

                  )}

                  <div
                    style={{
                      marginTop: '13px',
                      color: '#ffffff',
                      fontSize: '10px',
                      fontWeight: '600',
                      letterSpacing: '0.5px',
                    }}
                  >
                    {settings?.logo_url
                      ? 'REPLACE BRAND LOGO'
                      : 'UPLOAD BRAND LOGO'}
                  </div>

                  <div
                    style={{
                      marginTop: '5px',
                      color: '#5f6b78',
                      fontSize: '8px',
                    }}
                  >
                    PNG / JPG / WEBP
                  </div>

                  <input
                    id="logo-upload"
                    name="logo_url"
                    type="file"
                    accept="image/*"
                    autoComplete="off"
                    onChange={(e) => {
                      const file = e.target.files[0];

                      if (file) {
                        const localUrl =
                          URL.createObjectURL(file);

                        setSettings(prev => ({
                          ...prev,
                          logo_url: localUrl
                        }));

                        setPendingLogoFile(file);
                      }
                    }}
                    style={{ display: 'none' }}
                  />

                </label>


                {/* BUSINESS INFORMATION */}

                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '13px',
                  }}
                >

                  <div>

                    <label
                      htmlFor="business-name"
                      style={{
                        display: 'block',
                        marginBottom: '7px',
                        color: '#66717e',
                        fontSize: '8px',
                        letterSpacing: '1.1px',
                        fontWeight: '700',
                      }}
                    >
                      BUSINESS BRAND NAME
                    </label>

                    <input
                      id="business-name"
                      name="business_name"
                      type="text"
                      autoComplete="organization"
                      value={settings?.business_name || ''}
                      onChange={(e) => {
                        setSettings(prev => ({
                          ...prev,
                          business_name: e.target.value
                        }));
                      }}
                      placeholder="Your business name"
                      style={{
                        ...styles.input,
                        width: '100%',
                        boxSizing: 'border-box',
                        padding: '13px 14px',
                        fontSize: '11px',
                        fontFamily: 'monospace',
                        background: '#070b10',
                        border:
                          '1px solid rgba(0,130,255,0.18)',
                        borderRadius: '9px',
                      }}
                    />

                  </div>


                  <div>

                    <label
                      htmlFor="store-address"
                      style={{
                        display: 'block',
                        marginBottom: '7px',
                        color: '#66717e',
                        fontSize: '8px',
                        letterSpacing: '1.1px',
                        fontWeight: '700',
                      }}
                    >
                      PHYSICAL OUTLET ADDRESS
                    </label>

                    <textarea
                      id="store-address"
                      name="store_address"
                      autoComplete="street-address"
                      value={settings?.store_address || ''}
                      onChange={(e) => {
                        setSettings(prev => ({
                          ...prev,
                          store_address: e.target.value
                        }));
                      }}
                      placeholder="Business address"
                      style={{
                        ...styles.input,
                        width: '100%',
                        minHeight: '78px',
                        boxSizing: 'border-box',
                        padding: '13px 14px',
                        resize: 'none',
                        fontSize: '10px',
                        fontFamily: 'monospace',
                        lineHeight: 1.5,
                        background: '#070b10',
                        border:
                          '1px solid rgba(0,130,255,0.18)',
                        borderRadius: '9px',
                      }}
                    />

                  </div>

                </div>

              </div>


              {/* WEBHOOK SECTION */}

              <div
                style={{
                  borderRadius: '13px',
                  padding: '16px',
                  background:
                    'linear-gradient(145deg, rgba(0,80,150,0.06), rgba(0,0,0,0.12))',
                  border:
                    '1px solid rgba(0,142,255,0.15)',
                }}
              >

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '11px',
                  }}
                >

                  <div>

                    <div
                      style={{
                        color: '#4baeff',
                        fontSize: '8px',
                        fontWeight: '700',
                        letterSpacing: '1.2px',
                      }}
                    >
                      LIVE RECEIPT PIPELINE
                    </div>

                    <div
                      style={{
                        marginTop: '4px',
                        color: '#ffffff',
                        fontSize: '11px',
                        fontWeight: '600',
                      }}
                    >
                      Webhook Endpoint
                    </div>

                  </div>

                  <span
                    style={{
                      padding: '5px 8px',
                      borderRadius: '6px',
                      background:
                        settings?.webhook_slug
                          ? 'rgba(0,190,255,0.08)'
                          : 'rgba(255,180,0,0.06)',
                      color:
                        settings?.webhook_slug
                          ? '#48cfff'
                          : '#b8954c',
                      fontSize: '8px',
                      fontWeight: '700',
                      letterSpacing: '0.6px',
                    }}
                  >
                    {settings?.webhook_slug
                      ? 'READY'
                      : 'ACTION REQUIRED'}
                  </span>

                </div>


                <div
                  style={{
                    display: 'flex',
                    gap: '8px',
                    alignItems: 'stretch',
                  }}
                >

                  <input
                    readOnly
                    value={
                      settings?.webhook_slug
                        ? `https://agadjdvhqguunowplbak.functions.supabase.co/receipt-agent?slug=${settings.webhook_slug}`
                        : 'Define a unique webhook slug first...'
                    }
                    style={{
                      ...styles.input,
                      flex: 1,
                      minWidth: 0,
                      padding: '12px',
                      fontSize: '9px',
                      fontFamily: 'monospace',
                      color: settings?.webhook_slug
                        ? '#7fcfff'
                        : '#4f5965',
                      background: '#05080c',
                      border:
                        '1px solid rgba(0,130,255,0.16)',
                      borderRadius: '8px',
                    }}
                  />

                  <button
                    type="button"
                    onClick={async () => {
                      if (!settings?.webhook_slug) return;

                      const endpoint =
                        `https://agadjdvhqguunowplbak.functions.supabase.co/receipt-agent?slug=${settings.webhook_slug}`;

                      try {
                        await navigator.clipboard.writeText(endpoint);
                        alert('Webhook endpoint copied.');
                      } catch (error) {
                        console.error(
                          'Webhook copy failed:',
                          error
                        );
                      }
                    }}
                    style={{
                      ...styles.button,
                      minWidth: '92px',
                      padding: '0 13px',
                      fontSize: '9px',
                      borderRadius: '8px',
                      background:
                        'linear-gradient(145deg, #0d151d, #070b10)',
                      color: '#ffffff',
                      border:
                        '1px solid rgba(0,150,255,0.28)',
                      boxShadow:
                        '0 0 20px rgba(0,110,255,0.06)',
                    }}
                  >
                    COPY WEBHOOK
                  </button>

                </div>

              </div>

            </section>


            {/* ===================================================
              AI CONFIGURATION
          =================================================== */}

            <section
              style={{
                position: 'relative',
                overflow: 'hidden',
                borderRadius: '18px',
                padding: '22px',
                background:
                  'linear-gradient(145deg, rgba(12,17,24,0.98), rgba(5,8,12,0.98))',
                border: '1px solid rgba(0,142,255,0.22)',
                boxShadow:
                  'inset 0 1px 0 rgba(255,255,255,0.035), 0 20px 60px rgba(0,0,0,0.30)',
              }}
            >

              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  right: '8%',
                  width: '150px',
                  height: '1px',
                  background:
                    'linear-gradient(90deg, transparent, rgba(0,170,255,0.75))',
                  boxShadow: '0 0 18px rgba(0,150,255,0.4)',
                }}
              />

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '22px',
                }}
              >

                <div>

                  <div
                    style={{
                      fontSize: '9px',
                      color: '#389eff',
                      letterSpacing: '1.5px',
                      fontWeight: '700',
                    }}
                  >
                    02 / AI CONFIGURATION
                  </div>

                  <h2
                    style={{
                      margin: '7px 0 0',
                      fontSize: '18px',
                      fontWeight: '600',
                    }}
                  >
                    RuachAgent Intelligence
                  </h2>

                  <p
                    style={{
                      margin: '6px 0 0',
                      color: '#687482',
                      fontSize: '10px',
                    }}
                  >
                    Transaction rules interpreted by your AI agent.
                  </p>

                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '7px',
                    color: '#46caff',
                    fontSize: '8px',
                    fontWeight: '700',
                    letterSpacing: '0.8px',
                  }}
                >
                  <span
                    style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      background: '#2dcfff',
                      boxShadow: '0 0 10px #2dcfff',
                    }}
                  />
                  GOOGLE GENAI CORE
                </div>

              </div>


              {/* CONFIGURATION CONTROLS */}

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns:
                    'repeat(auto-fit, minmax(190px, 1fr))',
                  gap: '13px',
                }}
              >

                {/* CURRENCY */}

                <div
                  style={{
                    padding: '16px',
                    borderRadius: '11px',
                    background: '#080c11',
                    border:
                      '1px solid rgba(0,130,255,0.13)',
                  }}
                >

                  <label
                    htmlFor="currency"
                    style={{
                      display: 'block',
                      marginBottom: '8px',
                      color: '#697584',
                      fontSize: '8px',
                      letterSpacing: '1px',
                      fontWeight: '700',
                    }}
                  >
                    OPERATIONAL CURRENCY
                  </label>

                  <div
                    style={{
                      position: 'relative',
                    }}
                  >

                    <select
                      id="currency"
                      name="currency"
                      value={settings?.currency || 'ZAR'}
                      onChange={(e) => {
                        setSettings(prev => ({
                          ...prev,
                          currency: e.target.value
                        }));
                      }}
                      style={{
                        ...styles.input,
                        width: '100%',
                        boxSizing: 'border-box',
                        padding: '12px 32px 12px 12px',
                        fontSize: '10px',
                        fontFamily: 'monospace',
                        appearance: 'none',
                        cursor: 'pointer',
                        background: '#05080c',
                        border:
                          '1px solid rgba(0,130,255,0.16)',
                        borderRadius: '8px',
                      }}
                    >

                      {CURRENCY_OPTIONS.map(curr => (
                        <option
                          key={curr.code}
                          value={curr.code}
                          style={{
                            background: '#080c11',
                            color: '#ffffff',
                          }}
                        >
                          {curr.name} ({curr.symbol})
                        </option>
                      ))}

                    </select>

                    <span
                      style={{
                        position: 'absolute',
                        right: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: '#3dafff',
                        fontSize: '8px',
                        pointerEvents: 'none',
                      }}
                    >
                      ▼
                    </span>

                  </div>

                </div>


                {/* DISCOUNT */}

                <div
                  style={{
                    padding: '16px',
                    borderRadius: '11px',
                    background: '#080c11',
                    border:
                      '1px solid rgba(0,130,255,0.13)',
                  }}
                >

                  <label
                    htmlFor="discount-percentage"
                    style={{
                      display: 'block',
                      marginBottom: '8px',
                      color: '#697584',
                      fontSize: '8px',
                      letterSpacing: '1px',
                      fontWeight: '700',
                    }}
                  >
                    AI DISCOUNT COMPILER
                  </label>

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >

                    <input
                      id="discount-percentage"
                      name="discount_percentage"
                      type="number"
                      min="0"
                      max="100"
                      value={settings?.discount_percentage ?? 10}
                      onChange={(e) => {
                        const val =
                          parseInt(e.target.value) || 0;

                        setSettings(prev => ({
                          ...prev,
                          discount_percentage: val
                        }));
                      }}
                      style={{
                        ...styles.input,
                        width: '100%',
                        padding: '12px',
                        fontSize: '12px',
                        fontFamily: 'monospace',
                        background: '#05080c',
                        border:
                          '1px solid rgba(0,130,255,0.16)',
                        borderRadius: '8px',
                      }}
                    />

                    <span
                      style={{
                        color: '#3caeff',
                        fontSize: '14px',
                        fontFamily: 'monospace',
                      }}
                    >
                      %
                    </span>

                  </div>

                </div>


                {/* VOUCHER */}

                <div
                  style={{
                    padding: '16px',
                    borderRadius: '11px',
                    background: '#080c11',
                    border:
                      '1px solid rgba(0,130,255,0.13)',
                  }}
                >

                  <label
                    htmlFor="voucher-expiry-days"
                    style={{
                      display: 'block',
                      marginBottom: '8px',
                      color: '#697584',
                      fontSize: '8px',
                      letterSpacing: '1px',
                      fontWeight: '700',
                    }}
                  >
                    VOUCHER EXPIRATION
                  </label>

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >

                    <input
                      id="voucher-expiry-days"
                      name="voucher_expiration_days"
                      type="number"
                      min="1"
                      value={
                        settings?.voucher_expiration_days ?? 30
                      }
                      onChange={(e) => {
                        const val =
                          parseInt(e.target.value) || 0;

                        setSettings(prev => ({
                          ...prev,
                          voucher_expiration_days: val
                        }));
                      }}
                      style={{
                        ...styles.input,
                        width: '100%',
                        padding: '12px',
                        fontSize: '12px',
                        fontFamily: 'monospace',
                        background: '#05080c',
                        border:
                          '1px solid rgba(0,130,255,0.16)',
                        borderRadius: '8px',
                      }}
                    />

                    <span
                      style={{
                        color: '#687482',
                        fontSize: '9px',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      DAYS
                    </span>

                  </div>

                </div>

              </div>


              {/* AI INSIGHT */}

              <div
                style={{
                  marginTop: '15px',
                  padding: '14px 15px',
                  borderRadius: '10px',
                  background:
                    'linear-gradient(90deg, rgba(0,120,255,0.07), rgba(0,0,0,0))',
                  borderLeft:
                    '2px solid rgba(0,155,255,0.65)',
                }}
              >

                <div
                  style={{
                    color: '#55baff',
                    fontSize: '8px',
                    letterSpacing: '1px',
                    fontWeight: '700',
                    marginBottom: '6px',
                  }}
                >
                  RUACHAGENT AI RECOMMENDATION
                </div>

                <div
                  style={{
                    color: '#8793a1',
                    fontSize: '10px',
                    lineHeight: 1.6,
                  }}
                >
                  {settings?.discount_percentage > 25
                    ? 'Your discount compiler is configured aggressively. Consider reviewing margin impact before deploying this policy.'
                    : 'Your current discount configuration is within a conservative operating range. RuachAgent can use this value when generating eligible voucher recommendations.'}
                </div>

              </div>

            </section>

          </div>


          {/* =====================================================
            RIGHT COLUMN
        ===================================================== */}

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '18px',
              minWidth: 0,
            }}
          >


            {/* ===================================================
              TILL SLIP PREVIEW
          =================================================== */}

            <section
              style={{
                position: 'relative',
                minHeight: '540px',
                borderRadius: '18px',
                overflow: 'hidden',
                background:
                  'linear-gradient(145deg, #0c1117, #05070a)',
                border:
                  '1px solid rgba(0,142,255,0.22)',
                boxShadow:
                  'inset 0 1px 0 rgba(255,255,255,0.035), 0 20px 60px rgba(0,0,0,0.32)',
                display: 'flex',
                flexDirection: 'column',
              }}
            >

              {/* HEADER */}

              <div
                style={{
                  padding: '20px 21px',
                  borderBottom:
                    '1px solid rgba(255,255,255,0.055)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >

                <div>

                  <div
                    style={{
                      color: '#389eff',
                      fontSize: '8px',
                      fontWeight: '700',
                      letterSpacing: '1.5px',
                    }}
                  >
                    03 / LIVE OUTPUT
                  </div>

                  <h2
                    style={{
                      margin: '6px 0 0',
                      fontSize: '17px',
                      fontWeight: '600',
                    }}
                  >
                    Till Slip Preview
                  </h2>

                </div>

                <div
                  style={{
                    padding: '6px 9px',
                    borderRadius: '6px',
                    border:
                      '1px solid rgba(0,145,255,0.16)',
                    color: '#6d7886',
                    fontSize: '8px',
                    letterSpacing: '0.8px',
                  }}
                >
                  LIVE MIRROR
                </div>

              </div>


              {/* PREVIEW STAGE */}

              <div
                style={{
                  flex: 1,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  padding: '28px',
                  position: 'relative',
                  background:
                    'radial-gradient(circle at center, rgba(0,110,255,0.05), transparent 60%)',
                }}
              >

                {/* GRID */}

                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    opacity: 0.22,
                    backgroundImage:
                      'linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)',
                    backgroundSize: '25px 25px',
                    pointerEvents: 'none',
                  }}
                />


                {/* BLACK / WHITE PAPER */}

                <div
                  style={{
                    position: 'relative',
                    width: '245px',
                    minHeight: '405px',
                    background: '#ffffff',
                    color: '#080808',
                    boxShadow:
                      '0 30px 70px rgba(0,0,0,0.65), 0 0 35px rgba(0,130,255,0.07)',
                    padding: '26px 21px',
                    boxSizing: 'border-box',
                    fontFamily: 'monospace',
                  }}
                >

                  {/* PAPER HEADER */}

                  <div
                    style={{
                      textAlign: 'center',
                      borderBottom:
                        '1px dashed #999',
                      paddingBottom: '13px',
                    }}
                  >

                    <div
                      style={{
                        width: '44px',
                        height: '44px',
                        border:
                          '1px solid #111',
                        margin: '0 auto 10px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '18px',
                      }}
                    >
                      {settings?.logo_url ? (
                        <img
                          src={settings.logo_url}
                          alt=""
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'contain',
                          }}
                        />
                      ) : (
                        '◇'
                      )}
                    </div>

                    <div
                      style={{
                        fontWeight: '700',
                        fontSize: '12px',
                      }}
                    >
                      {settings?.business_name ||
                        'YOUR BUSINESS'}
                    </div>

                    <div
                      style={{
                        marginTop: '4px',
                        fontSize: '7px',
                      }}
                    >
                      TILL SLIP / AGENT PREVIEW
                    </div>

                  </div>


                  {/* PAPER ITEMS */}

                  <div
                    style={{
                      marginTop: '17px',
                      fontSize: '8px',
                    }}
                  >

                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginBottom: '8px',
                      }}
                    >
                      <span>ITEM / SERVICE</span>
                      <span>AMOUNT</span>
                    </div>

                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginBottom: '7px',
                      }}
                    >
                      <span>Sample Product</span>
                      <span>
                        {activeCurrencySymbol} 100.00
                      </span>
                    </div>

                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginBottom: '7px',
                      }}
                    >
                      <span>AI Voucher</span>
                      <span>
                        -{settings?.discount_percentage ?? 10}%
                      </span>
                    </div>

                    <div
                      style={{
                        borderTop:
                          '1px dashed #999',
                        marginTop: '13px',
                        paddingTop: '12px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        fontWeight: '700',
                      }}
                    >
                      <span>TOTAL</span>
                      <span>
                        {activeCurrencySymbol} 90.00
                      </span>
                    </div>

                  </div>


                  <div
                    style={{
                      marginTop: '34px',
                      paddingTop: '13px',
                      borderTop:
                        '1px dashed #999',
                      textAlign: 'center',
                      fontSize: '7px',
                      lineHeight: 1.6,
                    }}
                  >

                    {settings?.store_address ||
                      'Physical outlet address'}

                    <br />

                    Powered by RuachAgent AI

                  </div>

                </div>

              </div>

            </section>


            {/* ===================================================
              BUSINESS INTELLIGENCE PANEL
          =================================================== */}

            <section
              style={{
                padding: '20px',
                borderRadius: '18px',
                background:
                  'linear-gradient(145deg, rgba(12,17,24,0.98), rgba(5,8,12,0.98))',
                border:
                  '1px solid rgba(0,142,255,0.20)',
                boxShadow:
                  'inset 0 1px 0 rgba(255,255,255,0.035), 0 18px 50px rgba(0,0,0,0.25)',
              }}
            >

              <div
                style={{
                  color: '#389eff',
                  fontSize: '8px',
                  letterSpacing: '1.4px',
                  fontWeight: '700',
                }}
              >
                BUSINESS INTELLIGENCE
              </div>

              <h3
                style={{
                  margin: '7px 0 15px',
                  fontSize: '15px',
                  fontWeight: '600',
                }}
              >
                Agent Readiness
              </h3>


              {/* READINESS BARS */}

              {[
                [
                  'Business Identity',
                  settings?.business_name ? 100 : 35
                ],
                [
                  'Webhook Infrastructure',
                  settings?.webhook_slug ? 100 : 20
                ],
                [
                  'AI Configuration',
                  settings?.currency &&
                    settings?.discount_percentage != null &&
                    settings?.voucher_expiration_days != null
                    ? 100
                    : 60
                ],
              ].map(([label, value]) => (

                <div
                  key={label}
                  style={{
                    marginBottom: '14px',
                  }}
                >

                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginBottom: '6px',
                    }}
                  >

                    <span
                      style={{
                        color: '#7c8794',
                        fontSize: '9px',
                      }}
                    >
                      {label}
                    </span>

                    <span
                      style={{
                        color: '#4cb8ff',
                        fontSize: '9px',
                        fontFamily: 'monospace',
                      }}
                    >
                      {value}%
                    </span>

                  </div>

                  <div
                    style={{
                      height: '4px',
                      background: '#10151b',
                      borderRadius: '10px',
                      overflow: 'hidden',
                    }}
                  >

                    <div
                      style={{
                        width: `${value}%`,
                        height: '100%',
                        background:
                          'linear-gradient(90deg, #006cff, #38cfff)',
                        boxShadow:
                          '0 0 10px rgba(0,150,255,0.45)',
                      }}
                    />

                  </div>

                </div>

              ))}


              {/* SECURITY */}

              <div
                style={{
                  marginTop: '17px',
                  paddingTop: '15px',
                  borderTop:
                    '1px solid rgba(255,255,255,0.05)',
                  display: 'grid',
                  gridTemplateColumns:
                    'repeat(2, minmax(0, 1fr))',
                  gap: '9px',
                }}
              >

                <div
                  style={{
                    padding: '11px',
                    borderRadius: '8px',
                    background: '#080c11',
                    border:
                      '1px solid rgba(255,255,255,0.045)',
                  }}
                >

                  <div
                    style={{
                      color: '#56616e',
                      fontSize: '7px',
                      letterSpacing: '0.8px',
                    }}
                  >
                    AUTHENTICATION
                  </div>

                  <div
                    style={{
                      marginTop: '5px',
                      color: '#51c9ff',
                      fontSize: '9px',
                      fontWeight: '700',
                    }}
                  >
                    ● SECURE
                  </div>

                </div>

                <div
                  style={{
                    padding: '11px',
                    borderRadius: '8px',
                    background: '#080c11',
                    border:
                      '1px solid rgba(255,255,255,0.045)',
                  }}
                >

                  <div
                    style={{
                      color: '#56616e',
                      fontSize: '7px',
                      letterSpacing: '0.8px',
                    }}
                  >
                    WEBHOOK
                  </div>

                  <div
                    style={{
                      marginTop: '5px',
                      color: settings?.webhook_slug
                        ? '#51c9ff'
                        : '#8d6e3e',
                      fontSize: '9px',
                      fontWeight: '700',
                    }}
                  >
                    {settings?.webhook_slug
                      ? '● READY'
                      : '● PENDING'}
                  </div>

                </div>

              </div>

            </section>

          </div>

        </div>


        {/* =======================================================
          SAVE / SYNC COMMAND FOOTER
      ======================================================= */}

        <section
          style={{
            marginTop: '18px',
            padding: '17px 19px',
            borderRadius: '15px',
            background:
              'linear-gradient(90deg, rgba(0,70,140,0.09), rgba(8,12,17,0.96))',
            border:
              '1px solid rgba(0,142,255,0.20)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '18px',
            flexWrap: 'wrap',
          }}
        >

          <div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >

              <span
                style={{
                  width: '7px',
                  height: '7px',
                  borderRadius: '50%',
                  background: isSaveSyncing
                    ? '#66717d'
                    : '#35cfff',
                  boxShadow: isSaveSyncing
                    ? 'none'
                    : '0 0 12px rgba(50,205,255,0.8)',
                }}
              />

              <span
                style={{
                  fontSize: '9px',
                  fontWeight: '700',
                  letterSpacing: '1px',
                  color: '#ffffff',
                }}
              >
                {isSaveSyncing
                  ? 'SYNCHRONIZING MERCHANT PROFILE'
                  : 'AGENT CONFIGURATION READY'}
              </span>

            </div>

            <div
              style={{
                marginTop: '5px',
                color: '#626e7b',
                fontSize: '9px',
              }}
            >
              Changes are persisted through your existing business settings
              synchronization pipeline.
            </div>

          </div>


          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();

              if (!isSaveSyncing) {
                handleSave(e);
              }
            }}
            disabled={isSaveSyncing}
            style={{
              ...styles.button,
              minWidth: '205px',
              padding: '13px 19px',
              borderRadius: '9px',
              fontSize: '9px',
              fontWeight: '700',
              letterSpacing: '1px',
              textTransform: 'uppercase',
              background: isSaveSyncing
                ? '#11171e'
                : 'linear-gradient(135deg, #19bfff, #0874ff)',
              color: isSaveSyncing
                ? '#606b77'
                : '#021018',
              border: isSaveSyncing
                ? '1px solid rgba(255,255,255,0.05)'
                : '1px solid rgba(92,210,255,0.6)',
              boxShadow: isSaveSyncing
                ? 'none'
                : '0 0 25px rgba(0,140,255,0.18)',
              cursor: isSaveSyncing
                ? 'not-allowed'
                : 'pointer',
            }}
          >
            {isSaveSyncing
              ? 'SYNCING PROFILE...'
              : 'SAVE & SYNC LIVE PROFILE'}
          </button>

        </section>

      </div>


      {/* =========================================================
        RESPONSIVE CSS
        Uses a scoped style tag so the page remains responsive
        without changing your existing AdminPanel CSS.
    ========================================================= */}

      <style>
        {`
        @media (max-width: 1100px) {
          .agent-parameters-responsive-grid {
            grid-template-columns: 1fr !important;
          }
        }

        @media (max-width: 760px) {
          .agent-parameters-logo-grid {
            grid-template-columns: 1fr !important;
          }

          .agent-parameters-page-padding {
            padding: 20px 15px 40px !important;
          }
        }
      `}
      </style>

    </div>
  );

}