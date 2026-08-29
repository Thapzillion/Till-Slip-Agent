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
    <div style={styles.page}>

      {/* =========================================================
        AMBIENT TESLA BACKGROUND
    ========================================================= */}

      <div style={styles.pageBackground} />
      <div style={styles.gridOverlay} />

      <div
        style={{
          position: 'absolute',
          top: '-180px',
          left: '-180px',
          width: '520px',
          height: '520px',
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(0,125,255,0.13), transparent 68%)',
          pointerEvents: 'none',
          filter: 'blur(4px)',
        }}
      />

      <div
        style={{
          position: 'absolute',
          top: '28%',
          right: '-300px',
          width: '620px',
          height: '620px',
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(0,90,255,0.08), transparent 68%)',
          pointerEvents: 'none',
        }}
      />

      {/* =========================================================
        PAGE CONTENT
    ========================================================= */}

      <div style={styles.content}>

        {/* =======================================================
          PREMIUM AGENT PARAMETERS HEADER
      ======================================================= */}

        <header style={styles.header}>

          <div style={styles.headerLeft}>

            <div style={styles.headerOrb}>
              <div style={styles.headerOrbCore} />
            </div>

            <div style={{ minWidth: 0 }}>

              <div style={styles.eyebrow}>
                RUACHAGENT / MERCHANT CONTROL
              </div>

              <h1 style={styles.pageTitle}>
                Agent Parameters
              </h1>

              <p style={styles.pageSubtitle}>
                Configure your merchant identity, AI commerce rules,
                webhook infrastructure and live receipt behaviour.
              </p>

            </div>

          </div>

          <div style={styles.headerRight}>

            <div style={styles.statusPill}>
              <span style={styles.statusDot} />

              {isLoadingSettings
                ? 'LOADING PROFILE'
                : isSaveSyncing
                  ? 'SYNCING PROFILE'
                  : 'AGENT ONLINE'}
            </div>

            <div
              style={{
                padding: '8px 11px',
                borderRadius: '999px',
                border: '1px solid rgba(75,139,198,0.20)',
                background: 'rgba(6,11,17,0.78)',
                color: '#6d8298',
                fontSize: '8px',
                fontWeight: '700',
                letterSpacing: '1px',
              }}
            >
              GOOGLE GENAI
            </div>

          </div>

        </header>


        {/* =======================================================
          METRICS ROW
      ======================================================= */}

        <section style={styles.metricsGrid}>

          <div style={styles.metricCard}>

            <div style={styles.metricGlow} />

            <div style={styles.metricLabel}>
              AGENT STATUS
            </div>

            <div style={styles.metricValue}>
              ONLINE
            </div>

            <div style={styles.metricMeta}>
              <span style={styles.metricAccent}>●</span>
              Configuration engine ready
            </div>

          </div>


          <div style={styles.metricCard}>

            <div style={styles.metricGlow} />

            <div style={styles.metricLabel}>
              CURRENCY
            </div>

            <div style={styles.metricValue}>
              {settings?.currency || 'ZAR'}
            </div>

            <div style={styles.metricMeta}>
              Operational settlement currency
            </div>

          </div>


          <div style={styles.metricCard}>

            <div style={styles.metricGlow} />

            <div style={styles.metricLabel}>
              AI DISCOUNT
            </div>

            <div style={styles.metricValue}>
              {settings?.discount_percentage ?? 10}%
            </div>

            <div style={styles.metricMeta}>
              Automated voucher compiler
            </div>

          </div>


          <div style={styles.metricCard}>

            <div style={styles.metricGlow} />

            <div style={styles.metricLabel}>
              VOUCHER LIFETIME
            </div>

            <div style={styles.metricValue}>
              {settings?.voucher_expiration_days ?? 30}
              <span
                style={{
                  fontSize: '10px',
                  marginLeft: '5px',
                  color: '#66798b',
                }}
              >
                DAYS
              </span>
            </div>

            <div style={styles.metricMeta}>
              Current voucher policy
            </div>

          </div>

        </section>


        {/* =======================================================
          MAIN DASHBOARD GRID
      ======================================================= */}

        <div style={styles.dashboardGrid}>

          {/* =====================================================
            LEFT COLUMN
        ===================================================== */}

          <div style={styles.leftColumn}>


            {/* ===================================================
              BUSINESS IDENTITY
          =================================================== */}

            <section style={styles.card}>

              <div style={styles.cardHeader}>

                <div style={styles.cardHeaderLeft}>

                  <div style={styles.cardIcon}>
                    ◈
                  </div>

                  <div>

                    <h2 style={styles.cardTitle}>
                      Business Identity
                    </h2>

                    <p style={styles.cardDescription}>
                      Merchant information used across your
                      receipts, vouchers and commerce integrations.
                    </p>

                  </div>

                </div>

                <div
                  style={{
                    fontSize: '7px',
                    color: '#4c83b5',
                    letterSpacing: '1px',
                    fontWeight: '700',
                  }}
                >
                  BUSINESS_SETTINGS
                </div>

              </div>


              <div style={styles.cardBody}>

                {/* ===============================================
                  LOGO AREA
              =============================================== */}

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 155px',
                    gap: '16px',
                    marginBottom: '18px',
                  }}
                  className="agent-parameters-logo-grid"
                >

                  <label
                    htmlFor="logo-upload"
                    style={{
                      ...styles.uploadZone,
                      cursor: 'pointer',
                    }}
                  >

                    <div style={styles.uploadContent}>

                      <div style={styles.uploadIcon}>
                        {settings?.logo_url ? '✓' : '↑'}
                      </div>

                      <div style={styles.uploadTitle}>
                        {settings?.logo_url
                          ? 'REPLACE BUSINESS LOGO'
                          : 'UPLOAD BUSINESS LOGO'}
                      </div>

                      <div style={styles.uploadHint}>
                        PNG / JPG / WEBP • Receipt-ready branding
                      </div>

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
                            logo_url: localUrl,
                          }));

                          setPendingLogoFile(file);
                        }
                      }}
                      style={{ display: 'none' }}
                    />

                  </label>


                  <div style={styles.logoPreview}>

                    {settings?.logo_url ? (

                      <img
                        src={settings.logo_url}
                        alt="Business logo preview"
                        style={styles.logoImage}
                      />

                    ) : (

                      <div
                        style={{
                          textAlign: 'center',
                          color: '#435466',
                        }}
                      >
                        <div
                          style={{
                            fontSize: '24px',
                            marginBottom: '7px',
                          }}
                        >
                          ◇
                        </div>

                        <div
                          style={{
                            fontSize: '7px',
                            letterSpacing: '1px',
                            fontWeight: '700',
                          }}
                        >
                          LOGO PREVIEW
                        </div>
                      </div>

                    )}

                  </div>

                </div>


                {/* ===============================================
                  BUSINESS INFORMATION
              =============================================== */}

                <div style={styles.fieldGrid}>

                  <div style={styles.field}>

                    <label
                      htmlFor="business-name"
                      style={styles.label}
                    >
                      <span>
                        BUSINESS BRAND NAME
                      </span>

                      <span style={styles.labelHint}>
                        Required
                      </span>
                    </label>

                    <input
                      id="business-name"
                      name="business_name"
                      type="text"
                      autoComplete="organization"
                      value={settings?.business_name || ''}
                      onChange={(e) => {
                        const val = e.target.value;

                        setSettings(prev => ({
                          ...prev,
                          business_name: val,
                        }));
                      }}
                      placeholder="Your business name"
                      style={styles.input}
                    />

                  </div>


                  <div style={styles.field}>

                    <label
                      htmlFor="webhook-slug"
                      style={styles.label}
                    >
                      <span>
                        LIVE WEBHOOK SLUG
                      </span>

                      <span style={styles.labelHint}>
                        Unique endpoint ID
                      </span>
                    </label>

                    <input
                      id="webhook-slug"
                      name="webhook_slug"
                      type="text"
                      autoComplete="off"
                      placeholder="e.g. eddienetwork"
                      value={settings?.webhook_slug || ''}
                      onChange={(e) => {

                        const cleanValue =
                          e.target.value
                            .toLowerCase()
                            .replace(/[^a-z0-9-_]/g, '');

                        setSettings(prev => ({
                          ...prev,
                          webhook_slug: cleanValue,
                        }));

                      }}
                      style={{
                        ...styles.input,
                        fontFamily: 'monospace',
                      }}
                    />

                  </div>


                  <div
                    style={{
                      ...styles.field,
                      ...styles.fieldFull,
                    }}
                  >

                    <label
                      htmlFor="store-address"
                      style={styles.label}
                    >
                      <span>
                        PHYSICAL OUTLET ADDRESS
                      </span>

                      <span style={styles.labelHint}>
                        Printed on receipts
                      </span>
                    </label>

                    <textarea
                      id="store-address"
                      name="store_address"
                      autoComplete="street-address"
                      value={settings?.store_address || ''}
                      onChange={(e) => {
                        setSettings(prev => ({
                          ...prev,
                          store_address: e.target.value,
                        }));
                      }}
                      placeholder="Physical business address"
                      style={styles.textarea}
                    />

                  </div>

                </div>

              </div>

            </section>


            {/* ===================================================
              WEBHOOK INFRASTRUCTURE
          =================================================== */}

            <section style={styles.card}>

              <div style={styles.cardHeader}>

                <div style={styles.cardHeaderLeft}>

                  <div style={styles.cardIcon}>
                    ↗
                  </div>

                  <div>

                    <h2 style={styles.cardTitle}>
                      Live Webhook Infrastructure
                    </h2>

                    <p style={styles.cardDescription}>
                      Endpoint used by your store to communicate
                      with the RuachAgent receipt engine.
                    </p>

                  </div>

                </div>

                <div style={styles.statusPill}>
                  <span style={styles.statusDot} />
                  {settings?.webhook_slug
                    ? 'READY'
                    : 'CONFIGURATION REQUIRED'}
                </div>

              </div>


              <div style={styles.cardBody}>

                <div style={styles.webhookPanel}>

                  <div style={styles.webhookPreview}>

                    <div style={styles.webhookLabel}>
                      LIVE RECEIPT AGENT ENDPOINT
                    </div>

                    <div style={styles.webhookUrl}>

                      {settings?.webhook_slug
                        ? `https://agadjdvhqguunowplbak.functions.supabase.co/receipt-agent?slug=${settings.webhook_slug}`
                        : 'Enter a webhook slug above to generate your live endpoint.'}

                    </div>

                  </div>


                  <div style={styles.webhookActions}>

                    <button
                      type="button"
                      style={styles.secondaryButton}
                      onClick={async () => {

                        if (!settings?.webhook_slug) {
                          alert('Define a webhook slug first.');
                          return;
                        }

                        const endpoint =
                          `https://agadjdvhqguunowplbak.functions.supabase.co/receipt-agent?slug=${settings.webhook_slug}`;

                        try {

                          await navigator.clipboard.writeText(endpoint);

                          alert('Webhook endpoint copied.');

                        } catch (error) {

                          console.error(
                            'Unable to copy webhook:',
                            error
                          );

                          alert(
                            'Unable to copy endpoint automatically.'
                          );

                        }

                      }}
                    >
                      COPY ENDPOINT
                    </button>


                    <button
                      type="button"
                      style={styles.secondaryButton}
                      onClick={() => {
                        alert(
                          'Connection testing will be connected to the receipt-agent health check.'
                        );
                      }}
                    >
                      TEST CONNECTION
                    </button>

                  </div>


                  <div
                    style={{
                      padding: '12px 13px',
                      borderRadius: '10px',
                      border:
                        '1px solid rgba(70,110,150,0.18)',
                      background:
                        'rgba(3,8,13,0.68)',
                      display: 'flex',
                      gap: '10px',
                      alignItems: 'flex-start',
                    }}
                  >

                    <div
                      style={{
                        width: '6px',
                        height: '6px',
                        marginTop: '4px',
                        borderRadius: '50%',
                        background: settings?.webhook_slug
                          ? '#55b5ff'
                          : '#566473',
                        boxShadow: settings?.webhook_slug
                          ? '0 0 10px rgba(85,181,255,0.8)'
                          : 'none',
                      }}
                    />

                    <div>

                      <div
                        style={{
                          fontSize: '8px',
                          fontWeight: '700',
                          color: '#9cb3c9',
                          letterSpacing: '0.8px',
                          textTransform: 'uppercase',
                        }}
                      >
                        CONNECTION STATUS
                      </div>

                      <div
                        style={{
                          marginTop: '4px',
                          fontSize: '8px',
                          lineHeight: 1.5,
                          color: '#566a7d',
                        }}
                      >
                        {settings?.webhook_slug
                          ? 'A merchant-specific receipt endpoint has been generated from the current webhook slug.'
                          : 'Your endpoint becomes available immediately after a valid webhook slug is defined.'}
                      </div>

                    </div>

                  </div>

                </div>

              </div>

            </section>


            {/* ===================================================
              AI CONFIGURATION
          =================================================== */}

            <section style={styles.card}>

              <div style={styles.cardHeader}>

                <div style={styles.cardHeaderLeft}>

                  <div style={styles.cardIcon}>
                    AI
                  </div>

                  <div>

                    <h2 style={styles.cardTitle}>
                      AI Commerce Configuration
                    </h2>

                    <p style={styles.cardDescription}>
                      Configure the commerce rules used by
                      RuachAgent's Google GenAI-powered engine.
                    </p>

                  </div>

                </div>

                <div style={styles.statusPill}>
                  <span style={styles.statusDot} />
                  GOOGLE GENAI
                </div>

              </div>


              <div style={styles.cardBody}>

                <div style={styles.aiBanner}>

                  <div style={styles.aiPulse} />

                  <div>

                    <div style={styles.aiBannerTitle}>
                      RuachAgent AI Engine Connected
                    </div>

                    <div style={styles.aiBannerText}>
                      Merchant configuration is exposed to the
                      agent through the existing business settings
                      synchronization pipeline.
                    </div>

                  </div>

                </div>


                <div style={styles.fieldGrid}>

                  {/* CURRENCY */}

                  <div style={styles.field}>

                    <label
                      htmlFor="currency"
                      style={styles.label}
                    >
                      <span>
                        OPERATIONAL CURRENCY
                      </span>

                      <span style={styles.labelHint}>
                        Settlement
                      </span>
                    </label>

                    <div style={{ position: 'relative' }}>

                      <select
                        id="currency"
                        name="currency"
                        value={settings?.currency || 'ZAR'}
                        onChange={(e) => {

                          const val = e.target.value;

                          setSettings(prev => ({
                            ...prev,
                            currency: val,
                          }));

                        }}
                        style={styles.select}
                      >

                        {CURRENCY_OPTIONS.map((curr) => (

                          <option
                            key={curr.code}
                            value={curr.code}
                            style={{
                              background: '#070b10',
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
                          right: '13px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          color: '#4e6b85',
                          fontSize: '8px',
                          pointerEvents: 'none',
                        }}
                      >
                        ▼
                      </span>

                    </div>

                  </div>


                  {/* DISCOUNT */}

                  <div style={styles.field}>

                    <label
                      htmlFor="discount-percentage"
                      style={styles.label}
                    >
                      <span>
                        AI DISCOUNT COMPILER
                      </span>

                      <span style={styles.rangeValue}>
                        {settings?.discount_percentage ?? 10}%
                      </span>
                    </label>

                    <input
                      id="discount-percentage"
                      name="discount_percentage"
                      type="number"
                      min="0"
                      max="100"
                      autoComplete="off"
                      value={settings?.discount_percentage ?? 10}
                      onChange={(e) => {

                        const val =
                          parseInt(e.target.value) || 0;

                        setSettings(prev => ({
                          ...prev,
                          discount_percentage: val,
                        }));

                      }}
                      style={styles.input}
                    />

                  </div>


                  {/* VOUCHER */}

                  <div
                    style={{
                      ...styles.field,
                      ...styles.fieldFull,
                    }}
                  >

                    <label
                      htmlFor="voucher-expiry-days"
                      style={styles.label}
                    >
                      <span>
                        VOUCHER EXPIRATION POLICY
                      </span>

                      <span style={styles.labelHint}>
                        Days
                      </span>
                    </label>

                    <input
                      id="voucher-expiry-days"
                      name="voucher_expiration_days"
                      type="number"
                      min="1"
                      autoComplete="off"
                      placeholder="30"
                      value={
                        settings?.voucher_expiration_days ?? 30
                      }
                      onChange={(e) => {

                        const val =
                          parseInt(e.target.value) || 0;

                        setSettings(prev => ({
                          ...prev,
                          voucher_expiration_days: val,
                        }));

                      }}
                      style={styles.input}
                    />

                  </div>

                </div>


                {/* ===============================================
                  AI RECOMMENDATIONS
              =============================================== */}

                <div style={styles.recommendationPanel}>

                  <div style={styles.recommendationHeader}>

                    <div style={styles.recommendationTitle}>
                      AI CONFIGURATION RECOMMENDATIONS
                    </div>

                    <div
                      style={{
                        fontSize: '7px',
                        color: '#477aa7',
                        fontFamily: 'monospace',
                      }}
                    >
                      LIVE ANALYSIS
                    </div>

                  </div>


                  <div style={styles.recommendationList}>

                    <div style={styles.recommendationItem}>

                      <span style={styles.recommendationBullet} />

                      <span>
                        A {settings?.discount_percentage ?? 10}%
                        discount policy is currently configured
                        for the AI voucher compiler.
                      </span>

                    </div>


                    <div style={styles.recommendationItem}>

                      <span style={styles.recommendationBullet} />

                      <span>
                        Vouchers remain valid for{' '}
                        {settings?.voucher_expiration_days ?? 30}
                        {' '}days before expiration.
                      </span>

                    </div>


                    <div style={styles.recommendationItem}>

                      <span style={styles.recommendationBullet} />

                      <span>
                        {settings?.webhook_slug
                          ? 'Your webhook identity is configured and ready to generate the merchant-specific receipt endpoint.'
                          : 'Define a unique webhook slug so your merchant can receive receipt-agent requests.'}
                      </span>

                    </div>

                  </div>

                </div>


                {/* ===============================================
                  LIVE CONFIGURATION SUMMARY
              =============================================== */}

                <div
                  style={{
                    marginTop: '12px',
                    display: 'grid',
                    gridTemplateColumns:
                      'repeat(3, minmax(0, 1fr))',
                    gap: '9px',
                  }}
                  className="agent-parameters-insight-grid"
                >

                  <div style={styles.insight}>

                    <div style={styles.insightLabel}>
                      CURRENCY
                    </div>

                    <div style={styles.insightValue}>
                      {settings?.currency || 'ZAR'}
                    </div>

                  </div>


                  <div style={styles.insight}>

                    <div style={styles.insightLabel}>
                      DISCOUNT
                    </div>

                    <div style={styles.insightValue}>
                      {settings?.discount_percentage ?? 10}%
                    </div>

                  </div>


                  <div style={styles.insight}>

                    <div style={styles.insightLabel}>
                      EXPIRATION
                    </div>

                    <div style={styles.insightValue}>
                      {settings?.voucher_expiration_days ?? 30} DAYS
                    </div>

                  </div>

                </div>

              </div>

            </section>


            {/* ===================================================
              SAVE & SYNC FOOTER
          =================================================== */}

            <section style={styles.saveFooter}>

              <div style={styles.saveInfo}>

                <div style={styles.saveTitle}>

                  <span
                    style={{
                      display: 'inline-block',
                      width: '7px',
                      height: '7px',
                      marginRight: '8px',
                      borderRadius: '50%',
                      background: isSaveSyncing
                        ? '#66717d'
                        : '#35cfff',
                      boxShadow: isSaveSyncing
                        ? 'none'
                        : '0 0 12px rgba(50,205,255,0.8)',
                    }}
                  />

                  {isSaveSyncing
                    ? 'SYNCHRONIZING MERCHANT PROFILE'
                    : 'AGENT CONFIGURATION READY'}

                </div>

                <div style={styles.saveDescription}>
                  Changes are persisted to your merchant
                  business settings profile.
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
                  ...styles.primaryButton,
                  minWidth: '205px',
                  background: isSaveSyncing
                    ? '#11171e'
                    : styles.primaryButton.background,
                  color: isSaveSyncing
                    ? '#606b77'
                    : styles.primaryButton.color,
                  border: isSaveSyncing
                    ? '1px solid rgba(255,255,255,0.05)'
                    : styles.primaryButton.border,
                  boxShadow: isSaveSyncing
                    ? 'none'
                    : styles.primaryButton.boxShadow,
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


          {/* =====================================================
            RIGHT COLUMN
        ===================================================== */}

          <div style={styles.rightColumn}>

            {/* ===================================================
              TILL SLIP PREVIEW
          =================================================== */}

            <section style={styles.previewCard}>

              <div style={styles.previewHeader}>

                <div>

                  <div style={styles.previewTitle}>
                    LIVE TILL SLIP PREVIEW
                  </div>

                  <div
                    style={{
                      marginTop: '4px',
                      fontSize: '7px',
                      color: '#4f6070',
                      letterSpacing: '0.7px',
                    }}
                  >
                    MERCHANT RECEIPT SIMULATION
                  </div>

                </div>

                <div style={styles.previewStatus}>
                  LIVE
                </div>

              </div>


              <div style={styles.paperStage}>

                <div style={styles.paper}>

                  <div style={styles.paperHeader}>

                    <div style={styles.paperLogoPlaceholder}>

                      {settings?.logo_url ? (

                        <img
                          src={settings.logo_url}
                          alt="Receipt logo"
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'contain',
                          }}
                        />

                      ) : (
                        'LOGO'
                      )}

                    </div>


                    <div style={styles.paperBusinessName}>

                      {settings?.business_name ||
                        'YOUR BUSINESS'}

                    </div>


                    <div style={styles.paperText}>

                      {settings?.store_address ||
                        'Physical outlet address'}

                    </div>

                  </div>


                  <div style={styles.paperText}>

                    RECEIPT #RA-000001
                    <br />
                    29 AUG 2026
                    <br />
                    CUSTOMER COPY

                  </div>


                  <div style={styles.paperDivider} />


                  <div style={styles.paperLine}>

                    <span>
                      SAMPLE PRODUCT
                    </span>

                    <span>
                      {activeCurrencySymbol} 100.00
                    </span>

                  </div>


                  <div style={styles.paperLine}>

                    <span>
                      AI VOUCHER
                    </span>

                    <span>
                      -{settings?.discount_percentage ?? 10}%
                    </span>

                  </div>


                  <div style={styles.paperDivider} />


                  <div style={styles.paperTotal}>

                    <span>
                      TOTAL
                    </span>

                    <span>
                      {activeCurrencySymbol}{' '}
                      {(
                        100 -
                        (100 *
                          (settings?.discount_percentage ?? 10)) /
                        100
                      ).toFixed(2)}
                    </span>

                  </div>


                  <div
                    style={{
                      marginTop: '25px',
                      textAlign: 'center',
                      fontSize: '7px',
                      lineHeight: 1.6,
                    }}
                  >

                    Voucher valid for{' '}
                    {settings?.voucher_expiration_days ?? 30}
                    {' '}days.

                    <br />

                    Powered by RuachAgent AI

                  </div>


                  <div style={styles.paperQr} />

                </div>

              </div>


              {/* PREVIEW INFORMATION */}

              <div
                style={{
                  marginTop: '12px',
                  display: 'grid',
                  gridTemplateColumns:
                    'repeat(2, minmax(0, 1fr))',
                  gap: '9px',
                }}
              >

                <div style={styles.insight}>

                  <div style={styles.insightLabel}>
                    TEMPLATE
                  </div>

                  <div style={styles.insightValue}>
                    {settings?.receipt_template ||
                      'matrix-grid'}
                  </div>

                </div>


                <div style={styles.insight}>

                  <div style={styles.insightLabel}>
                    AGENT
                  </div>

                  <div style={styles.insightValue}>
                    GOOGLE GENAI
                  </div>

                </div>

              </div>

            </section>


            {/* ===================================================
              BUSINESS INTELLIGENCE
          =================================================== */}

            <section style={styles.card}>

              <div style={styles.cardHeader}>

                <div style={styles.cardHeaderLeft}>

                  <div style={styles.cardIcon}>
                    ∿
                  </div>

                  <div>

                    <h2 style={styles.cardTitle}>
                      Commerce Intelligence
                    </h2>

                    <p style={styles.cardDescription}>
                      Live configuration indicators for your
                      merchant environment.
                    </p>

                  </div>

                </div>

              </div>


              <div style={styles.cardBody}>

                <div style={styles.insightGrid}>

                  <div style={styles.insight}>

                    <div style={styles.insightLabel}>
                      BUSINESS
                    </div>

                    <div
                      style={{
                        ...styles.insightValue,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {settings?.business_name ||
                        'Not configured'}
                    </div>

                  </div>


                  <div style={styles.insight}>

                    <div style={styles.insightLabel}>
                      WEBHOOK
                    </div>

                    <div style={styles.insightValue}>
                      {settings?.webhook_slug
                        ? 'ACTIVE'
                        : 'PENDING'}
                    </div>

                  </div>


                  <div style={styles.insight}>

                    <div style={styles.insightLabel}>
                      LOGO
                    </div>

                    <div style={styles.insightValue}>
                      {settings?.logo_url
                        ? 'CONFIGURED'
                        : 'MISSING'}
                    </div>

                  </div>

                </div>


                <div
                  style={{
                    marginTop: '12px',
                    padding: '12px',
                    borderRadius: '10px',
                    border:
                      '1px solid rgba(66,105,140,0.18)',
                    background:
                      'rgba(4,8,13,0.62)',
                  }}
                >

                  <div
                    style={{
                      fontSize: '7px',
                      fontWeight: '700',
                      color: '#4d78a0',
                      letterSpacing: '1.2px',
                      textTransform: 'uppercase',
                      marginBottom: '6px',
                    }}
                  >
                    SYSTEM NOTE
                  </div>

                  <div
                    style={{
                      fontSize: '8px',
                      lineHeight: 1.6,
                      color: '#596d80',
                    }}
                  >
                    This page edits the merchant configuration
                    represented by the existing business settings
                    state. Saving the profile sends the current
                    configuration through your existing Supabase
                    synchronization pipeline.
                  </div>

                </div>

              </div>

            </section>

          </div>

        </div>

      </div>


      {/* =========================================================
        RESPONSIVE OVERRIDES
    ========================================================= */}

      <style>
        {`

        @media (max-width: 1100px) {

          .agent-parameters-logo-grid {
            grid-template-columns: 1fr !important;
          }

        }

        @media (max-width: 900px) {

          .agent-parameters-insight-grid {
            grid-template-columns: 1fr 1fr !important;
          }

        }

        @media (max-width: 760px) {

          .agent-parameters-responsive-grid {
            grid-template-columns: 1fr !important;
          }

          .agent-parameters-logo-grid {
            grid-template-columns: 1fr !important;
          }

          .agent-parameters-insight-grid {
            grid-template-columns: 1fr !important;
          }

          .agent-parameters-page-padding {
            padding: 18px 14px 40px !important;
          }

        }

      `}
      </style>

    </div>
  );
}
