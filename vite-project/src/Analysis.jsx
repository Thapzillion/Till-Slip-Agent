import React, { useEffect, useMemo } from "react";
import {
  Activity,
  Database,
  Receipt,
  RefreshCw,
  Sparkles,
  TicketPercent,
  Zap
} from "lucide-react";

import { useBusiness } from "./backend/businessService";
import "./AdminPanel.css";


export default function Analysis() {
  const {
    user,
    settings,

    // Existing analytics state owned by business.js.
    txCount,

    // Existing inbox / receipt values.
    activeInboxesCount,
    totalParsedCount,
    selectedDateRangeLabel,
    inboxGraphData,

    // Existing analytics loading state, if exposed.
    loadingAnalytics,

    // Existing backend analytics function.
    fetchLiveAnalytics
  } = useBusiness();


  // =========================================================
  // EXISTING BACKEND VALUES — NO NEW BACKEND LOGIC
  // =========================================================

  const safeTxCount = Number(txCount) || 0;

  const safeInboxCount =
    typeof activeInboxesCount !== "undefined"
      ? Number(activeInboxesCount) || 0
      : 0;

  const safeParsedCount =
    typeof totalParsedCount !== "undefined"
      ? Number(totalParsedCount) || 0
      : safeTxCount;

  // The existing Analysis page exposes no backend discount count.
  // Preserve that existing behavior rather than inventing a database field.
  const discountsUsedCount = 0;

  const discountsNotUsedCount = Math.max(
    safeTxCount - discountsUsedCount,
    0
  );


  // =========================================================
  // LIVE ANALYTICS REFRESH — EXISTING BUSINESS SERVICE ONLY
  // =========================================================

  useEffect(() => {
    if (
      user?.id &&
      typeof fetchLiveAnalytics === "function"
    ) {
      fetchLiveAnalytics(user.id);
    }
  }, [user?.id, fetchLiveAnalytics]);


  // =========================================================
  // SAFE VISUAL DATA
  //
  // These values are only used to animate the existing backend
  // values. No additional backend calculations are introduced.
  // =========================================================

  const safeInboxGraphData = useMemo(() => {
    if (Array.isArray(inboxGraphData) && inboxGraphData.length > 0) {
      return inboxGraphData;
    }

    return [];
  }, [inboxGraphData]);

  const sentActivityData = useMemo(() => {
    if (safeInboxGraphData.length > 0) {
      return safeInboxGraphData;
    }

    return Array.from({ length: 24 }, () => 0);
  }, [safeInboxGraphData]);

  const maxActivity = useMemo(() => {
    const values = sentActivityData.map((value) => Number(value) || 0);
    return Math.max(...values, 1);
  }, [sentActivityData]);

  const discountUsageRate =
    safeTxCount > 0
      ? Math.min(100, (discountsUsedCount / safeTxCount) * 100)
      : 0;

  const discountNotUsedRate =
    safeTxCount > 0
      ? Math.min(100, (discountsNotUsedCount / safeTxCount) * 100)
      : 0;


  // =========================================================
  // CONNECTED STORES THEME
  //
  // Values intentionally mirror ConnectedStores.jsx:
  // black background, Inter, #26d8ff cyan, dark gradients,
  // subtle white borders and restrained secondary colors.
  // =========================================================

  const styles = {
    page: {
      zoom: 0.90,
      minHeight: "100vh",
      background: "#000000",
      color: "#ffffff",
      padding: "28px 32px 60px",
      fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      boxSizing: "border-box"
    },

    shell: {
      maxWidth: "1500px",
      margin: "0 auto",
      width: "100%"
    },

    header: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: "24px",
      paddingBottom: "26px",
      borderBottom: "1px solid rgba(255,255,255,0.07)"
    },

    headerLeft: {
      display: "flex",
      alignItems: "center",
      gap: "16px",
      minWidth: 0
    },

    headerIcon: {
      width: "52px",
      height: "52px",
      borderRadius: "15px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "linear-gradient(145deg, #161b20, #090b0d)",
      border: "1px solid rgba(38,216,255,0.22)",
      boxShadow: "0 0 25px rgba(38,216,255,0.08)",
      color: "#26d8ff",
      flexShrink: 0
    },

    eyebrow: {
      fontSize: "11px",
      fontWeight: 700,
      letterSpacing: "1.8px",
      textTransform: "uppercase",
      color: "#26d8ff",
      marginBottom: "5px"
    },

    title: {
      margin: 0,
      fontSize: "30px",
      lineHeight: 1.15,
      fontWeight: 750,
      letterSpacing: "-0.7px"
    },

    subtitle: {
      margin: "7px 0 0",
      color: "#7e8792",
      fontSize: "13px",
      lineHeight: 1.5,
      maxWidth: "680px"
    },

    headerStatus: {
      display: "inline-flex",
      alignItems: "center",
      gap: "9px",
      padding: "10px 13px",
      borderRadius: "11px",
      border: "1px solid rgba(38,216,255,0.13)",
      background: "rgba(255,255,255,0.025)",
      color: "#7e8792",
      fontSize: "10px",
      fontWeight: 700,
      letterSpacing: "1px",
      whiteSpace: "nowrap",
      flexShrink: 0
    },

    statusDot: {
      width: "7px",
      height: "7px",
      borderRadius: "50%",
      background: "#31dc7e",
      boxShadow: "0 0 10px rgba(49,220,126,.7)"
    },

    metrics: {
      display: "grid",
      gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
      gap: "14px",
      marginTop: "24px"
    },

    metricCard: {
      position: "relative",
      overflow: "hidden",
      background: "linear-gradient(145deg, rgba(18,22,27,0.98), rgba(9,11,14,0.98))",
      border: "1px solid rgba(255,255,255,0.075)",
      borderRadius: "17px",
      padding: "20px",
      minHeight: "126px",
      boxSizing: "border-box",
      transition: "transform .2s ease, border-color .2s ease, box-shadow .2s ease"
    },

    metricGlow: {
      position: "absolute",
      right: "-35px",
      top: "-35px",
      width: "100px",
      height: "100px",
      borderRadius: "50%",
      background: "rgba(38,216,255,0.07)",
      filter: "blur(30px)",
      pointerEvents: "none"
    },

    metricTop: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      position: "relative",
      zIndex: 1
    },

    metricLabel: {
      color: "#7f8994",
      fontSize: "12px",
      fontWeight: 600
    },

    metricIndicator: {
      width: "7px",
      height: "7px",
      borderRadius: "50%",
      background: "#26d8ff",
      boxShadow: "0 0 10px rgba(38,216,255,0.7)"
    },

    metricValue: {
      marginTop: "14px",
      fontSize: "29px",
      lineHeight: 1,
      fontWeight: 750,
      letterSpacing: "-0.7px",
      position: "relative",
      zIndex: 1
    },

    metricDescription: {
      marginTop: "10px",
      color: "#59636d",
      fontSize: "11px",
      position: "relative",
      zIndex: 1
    },

    content: {
      marginTop: "24px"
    },

    controlPanel: {
      background: "linear-gradient(145deg, rgba(17,21,27,.98), rgba(8,10,13,.98))",
      border: "1px solid rgba(255,255,255,.075)",
      borderRadius: "18px",
      padding: "20px"
    },

    controlHeader: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: "20px",
      marginBottom: "18px"
    },

    sectionTitle: {
      margin: 0,
      fontSize: "16px",
      fontWeight: 700,
      letterSpacing: "-.2px"
    },

    sectionDescription: {
      margin: "5px 0 0",
      color: "#69737e",
      fontSize: "12px",
      lineHeight: 1.5
    },

    rangeBadge: {
      color: "#59636d",
      fontSize: "11px",
      whiteSpace: "nowrap"
    },

    scanner: {
      position: "relative",
      overflow: "hidden",
      minHeight: "180px",
      borderRadius: "14px",
      border: "1px solid rgba(38,216,255,.08)",
      background: "#070a0d",
      padding: "18px",
      boxSizing: "border-box"
    },

    scannerGrid: {
      position: "absolute",
      inset: 0,
      backgroundImage: "linear-gradient(rgba(38,216,255,.045) 1px, transparent 1px), linear-gradient(90deg, rgba(38,216,255,.045) 1px, transparent 1px)",
      backgroundSize: "28px 28px",
      maskImage: "linear-gradient(to bottom, black, transparent 90%)",
      pointerEvents: "none"
    },

    scannerBeam: {
      position: "absolute",
      left: "0",
      right: "0",
      height: "2px",
      background: "linear-gradient(90deg, transparent, rgba(38,216,255,.1), #26d8ff, rgba(38,216,255,.1), transparent)",
      boxShadow: "0 0 20px rgba(38,216,255,.6)",
      animation: "ruachAnalysisScan 3.2s linear infinite",
      pointerEvents: "none"
    },

    scannerCore: {
      position: "relative",
      zIndex: 2,
      display: "grid",
      gridTemplateColumns: "auto 1fr auto",
      alignItems: "center",
      gap: "16px",
      minHeight: "142px"
    },

    coreIcon: {
      width: "54px",
      height: "54px",
      borderRadius: "16px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "rgba(38,216,255,.055)",
      border: "1px solid rgba(38,216,255,.18)",
      color: "#26d8ff",
      boxShadow: "0 0 30px rgba(38,216,255,.07)",
      animation: "ruachAnalysisFloat 2.8s ease-in-out infinite"
    },

    coreTitle: {
      color: "#e3e7ea",
      fontSize: "13px",
      fontWeight: 750
    },

    coreText: {
      marginTop: "6px",
      color: "#68727d",
      fontSize: "11px",
      lineHeight: 1.55,
      maxWidth: "560px"
    },

    coreReadout: {
      minWidth: "100px",
      textAlign: "right"
    },

    readoutLabel: {
      color: "#59636d",
      fontSize: "9px",
      fontWeight: 700,
      letterSpacing: "1px",
      textTransform: "uppercase"
    },

    readoutValue: {
      marginTop: "5px",
      color: "#26d8ff",
      fontSize: "18px",
      fontWeight: 800,
      fontFamily: "monospace",
      textShadow: "0 0 14px rgba(38,216,255,.35)"
    },

    analysisGrid: {
      display: "grid",
      gridTemplateColumns: "minmax(0, 1.35fr) minmax(300px, .65fr)",
      gap: "14px",
      marginTop: "14px"
    },

    activityPanel: {
      background: "linear-gradient(145deg, rgba(17,21,27,.98), rgba(8,10,13,.98))",
      border: "1px solid rgba(255,255,255,.075)",
      borderRadius: "18px",
      padding: "20px",
      minHeight: "320px",
      boxSizing: "border-box"
    },

    activityHeader: {
      display: "flex",
      alignItems: "flex-end",
      justifyContent: "space-between",
      gap: "16px",
      marginBottom: "18px"
    },

    activityTitle: {
      margin: 0,
      color: "#dce2e7",
      fontSize: "16px",
      fontWeight: 700
    },

    activitySubtitle: {
      margin: "5px 0 0",
      color: "#68727d",
      fontSize: "11px",
      lineHeight: 1.5
    },

    bars: {
      height: "215px",
      display: "flex",
      alignItems: "flex-end",
      gap: "5px",
      padding: "18px 8px 0",
      borderBottom: "1px solid rgba(255,255,255,.06)",
      overflow: "hidden"
    },

    bar: {
      flex: "1 1 0",
      minWidth: "4px",
      maxWidth: "18px",
      borderRadius: "4px 4px 0 0",
      background: "linear-gradient(180deg, #26d8ff, rgba(38,216,255,.12))",
      boxShadow: "0 0 12px rgba(38,216,255,.12)",
      transformOrigin: "bottom",
      animation: "ruachAnalysisBar 1.8s ease-in-out infinite alternate"
    },

    barLegend: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: "12px",
      marginTop: "10px",
      color: "#59636d",
      fontSize: "10px"
    },

    insightStack: {
      display: "grid",
      gap: "14px"
    },

    insightCard: {
      background: "linear-gradient(145deg, rgba(17,21,27,.98), rgba(8,10,13,.98))",
      border: "1px solid rgba(255,255,255,.075)",
      borderRadius: "17px",
      padding: "18px",
      minHeight: "148px",
      boxSizing: "border-box"
    },

    insightTop: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: "12px"
    },

    insightIdentity: {
      display: "flex",
      alignItems: "center",
      gap: "10px",
      minWidth: 0
    },

    insightIcon: {
      width: "40px",
      height: "40px",
      borderRadius: "12px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "#090c0f",
      border: "1px solid rgba(38,216,255,.12)",
      color: "#26d8ff",
      flexShrink: 0
    },

    insightLabel: {
      color: "#69737e",
      fontSize: "9px",
      fontWeight: 700,
      letterSpacing: "1px",
      textTransform: "uppercase"
    },

    insightValue: {
      marginTop: "3px",
      color: "#e7eaed",
      fontSize: "22px",
      fontWeight: 750
    },

    insightText: {
      marginTop: "14px",
      color: "#59636d",
      fontSize: "10px",
      lineHeight: 1.5
    },

    progressTrack: {
      height: "5px",
      marginTop: "12px",
      borderRadius: "999px",
      overflow: "hidden",
      background: "rgba(255,255,255,.05)"
    },

    progressFill: {
      height: "100%",
      borderRadius: "999px",
      background: "linear-gradient(90deg, #26d8ff, #1299b8)",
      boxShadow: "0 0 12px rgba(38,216,255,.25)",
      transition: "width .8s ease"
    },

    discountGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
      gap: "12px",
      marginTop: "14px"
    },

    discountCard: {
      position: "relative",
      overflow: "hidden",
      background: "linear-gradient(145deg, rgba(17,21,27,.98), rgba(8,10,13,.98))",
      border: "1px solid rgba(255,255,255,.075)",
      borderRadius: "17px",
      padding: "18px",
      boxSizing: "border-box"
    },

    discountGlow: {
      position: "absolute",
      width: "110px",
      height: "110px",
      right: "-45px",
      bottom: "-45px",
      borderRadius: "50%",
      background: "rgba(38,216,255,.055)",
      filter: "blur(28px)",
      pointerEvents: "none"
    },

    footerStrip: {
      marginTop: "14px",
      padding: "13px 15px",
      borderRadius: "12px",
      border: "1px solid rgba(255,255,255,.055)",
      background: "rgba(255,255,255,.02)",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: "15px",
      color: "#59636d",
      fontSize: "10px"
    }
  };


  const MetricCard = ({ label, value, description, icon, glow }) => (
    <div
      style={styles.metricCard}
      onMouseEnter={(event) => {
        event.currentTarget.style.transform = "translateY(-2px)";
        event.currentTarget.style.borderColor = "rgba(38,216,255,.22)";
        event.currentTarget.style.boxShadow = "0 20px 45px rgba(0,0,0,.28)";
      }}
      onMouseLeave={(event) => {
        event.currentTarget.style.transform = "translateY(0)";
        event.currentTarget.style.borderColor = "rgba(255,255,255,.075)";
        event.currentTarget.style.boxShadow = "none";
      }}
    >
      <div style={{ ...styles.metricGlow, background: glow }} />

      <div style={styles.metricTop}>
        <span style={styles.metricLabel}>{label}</span>
        <span style={styles.metricIndicator} />
      </div>

      <div style={styles.metricValue}>{value}</div>
      <div style={styles.metricDescription}>{description}</div>
    </div>
  );


  return (
    <>
      <style>{`
        @keyframes ruachAnalysisScan {
          0% { top: -2px; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: calc(100% - 2px); opacity: 0; }
        }

        @keyframes ruachAnalysisFloat {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-4px) scale(1.025); }
        }

        @keyframes ruachAnalysisBar {
          0% { transform: scaleY(.72); opacity: .55; }
          100% { transform: scaleY(1); opacity: 1; }
        }

        @keyframes ruachAnalysisPulse {
          0%, 100% { opacity: .45; transform: scale(.88); }
          50% { opacity: 1; transform: scale(1); }
        }

        @media (max-width: 1050px) {
          .ruach-analysis-metrics { grid-template-columns: repeat(3, minmax(0, 1fr)) !important; }
          .ruach-analysis-main { grid-template-columns: 1fr !important; }
        }

        @media (max-width: 760px) {
          .ruach-analysis-header { align-items: flex-start !important; flex-direction: column !important; }
          .ruach-analysis-metrics { grid-template-columns: 1fr !important; }
          .ruach-analysis-discounts { grid-template-columns: 1fr !important; }
          .ruach-analysis-scanner-core { grid-template-columns: auto 1fr !important; }
          .ruach-analysis-readout { display: none !important; }
        }
      `}</style>

      <div style={styles.page}>
        <div style={styles.shell}>

          {/* =====================================================
              PAGE HEADER — MATCHES CONNECTED STORES
          ====================================================== */}
          <header
            style={styles.header}
            className="ruach-analysis-header"
          >
            <div style={styles.headerLeft}>
              <div style={styles.headerIcon}>
                <Activity size={23} strokeWidth={1.8} />
              </div>

              <div>
                <div style={styles.eyebrow}>
                  RuachAgent / Intelligence
                </div>

                <h1 style={styles.title}>
                  Analysis
                </h1>

                <p style={styles.subtitle}>
                  A live operational view of inboxes made, till slips sent and discount activity across your RuachAgent network.
                </p>
              </div>
            </div>

            <div style={styles.headerStatus}>
              <span
                style={{
                  ...styles.statusDot,
                  animation: "ruachAnalysisPulse 1.8s ease-in-out infinite"
                }}
              />
              {loadingAnalytics ? "SYNCHRONIZING" : "LIVE ANALYSIS"}
            </div>
          </header>


          {/* =====================================================
              PRIMARY OPERATIONAL METRICS
          ====================================================== */}
          <section
            style={styles.metrics}
            className="ruach-analysis-metrics"
          >
            <MetricCard
              label="INBOXES MADE"
              value={safeInboxCount.toLocaleString()}
              description="Active inbox nodes available to RuachAgent"
              glow="rgba(38,216,255,.08)"
            />

            <MetricCard
              label="TILL SLIPS SENT"
              value={safeParsedCount.toLocaleString()}
              description="Till slips recorded through the existing pipeline"
              glow="rgba(49,220,126,.06)"
            />

            <MetricCard
              label="DISCOUNTS USED"
              value={discountsUsedCount.toLocaleString()}
              description="Discount usage available from the current analytics state"
              glow="rgba(38,216,255,.07)"
            />
          </section>


          <main style={styles.content}>
            {/* =====================================================
                ANALYSIS ENGINE / FUTURISTIC SCANNER
            ====================================================== */}
            <section style={styles.controlPanel}>
              <div style={styles.controlHeader}>
                <div>
                  <h2 style={styles.sectionTitle}>
                    Ruach Analysis Engine
                  </h2>
                  <p style={styles.sectionDescription}>
                    Continuously reading only the operational signals already supplied by the business analytics service.
                  </p>
                </div>

                <div style={styles.rangeBadge}>
                  {selectedDateRangeLabel || "Current reporting range"}
                </div>
              </div>

              <div style={styles.scanner}>
                <div style={styles.scannerGrid} />
                <div style={styles.scannerBeam} />

                <div
                  style={styles.scannerCore}
                  className="ruach-analysis-scanner-core"
                >
                  <div style={styles.coreIcon}>
                    <Zap size={24} strokeWidth={1.8} />
                  </div>

                  <div>
                    <div style={styles.coreTitle}>
                      {loadingAnalytics
                        ? "Synchronizing operational signals..."
                        : "Operational signal analysis active"}
                    </div>

                    <div style={styles.coreText}>
                      RuachAgent is observing inbox availability, till slips sent and the existing discount counters only.
                    </div>
                  </div>

                  <div
                    style={styles.coreReadout}
                    className="ruach-analysis-readout"
                  >
                    <div style={styles.readoutLabel}>Signals</div>
                    <div style={styles.readoutValue}>03 / 03</div>
                  </div>
                </div>
              </div>
            </section>


            {/* =====================================================
                SENT ACTIVITY + LIVE INSIGHTS
            ====================================================== */}
            <section
              style={styles.analysisGrid}
              className="ruach-analysis-main"
            >
              <div style={styles.activityPanel}>
                <div style={styles.activityHeader}>
                  <div>
                    <h2 style={styles.activityTitle}>
                      Till Slip Send Activity
                    </h2>
                    <p style={styles.activitySubtitle}>
                      Visualized from the existing analytics arrays only. The animation is presentation-only.
                    </p>
                  </div>

                  <div style={styles.rangeBadge}>
                    {safeParsedCount.toLocaleString()} sent
                  </div>
                </div>

                <div style={styles.bars}>
                  {sentActivityData.map((value, index) => {
                    const numericValue = Number(value) || 0;
                    const normalized =
                      numericValue > 0
                        ? Math.max(8, (numericValue / maxActivity) * 100)
                        : 5;

                    return (
                      <div
                        key={`sent-activity-${index}`}
                        title={`Activity ${index + 1}: ${numericValue}`}
                        style={{
                          ...styles.bar,
                          height: `${normalized}%`,
                          animationDelay: `${(index % 9) * 0.08}s`
                        }}
                      />
                    );
                  })}
                </div>

                <div style={styles.barLegend}>
                  <span>EARLIEST SIGNAL</span>
                  <span>LIVE PIPELINE</span>
                  <span>LATEST SIGNAL</span>
                </div>
              </div>


              <div style={styles.insightStack}>
                <div style={styles.insightCard}>
                  <div style={styles.insightTop}>
                    <div style={styles.insightIdentity}>
                      <div style={styles.insightIcon}>
                        <Database size={17} />
                      </div>
                      <div>
                        <div style={styles.insightLabel}>Inboxes</div>
                        <div style={styles.insightValue}>
                          {safeInboxCount.toLocaleString()}
                        </div>
                      </div>
                    </div>

                    <Activity
                      size={15}
                      color="#26d8ff"
                      style={{ animation: "ruachAnalysisPulse 1.6s infinite" }}
                    />
                  </div>

                  <div style={styles.insightText}>
                    Active inbox nodes currently exposed by the existing backend analytics state.
                  </div>
                </div>

                <div style={styles.insightCard}>
                  <div style={styles.insightTop}>
                    <div style={styles.insightIdentity}>
                      <div style={styles.insightIcon}>
                        <Receipt size={17} />
                      </div>
                      <div>
                        <div style={styles.insightLabel}>Till Slips Sent</div>
                        <div style={styles.insightValue}>
                          {safeParsedCount.toLocaleString()}
                        </div>
                      </div>
                    </div>

                    <Sparkles
                      size={15}
                      color="#26d8ff"
                      style={{ animation: "ruachAnalysisPulse 1.9s infinite" }}
                    />
                  </div>

                  <div style={styles.insightText}>
                    Current sent-slip count, using the existing parsed-count value while presenting it as a customer-facing sent count.
                  </div>
                </div>
              </div>
            </section>


            {/* =====================================================
                DISCOUNT ANALYSIS
            ====================================================== */}
            <section style={{ marginTop: "14px" }}>
              <div style={styles.controlPanel}>
                <div style={styles.controlHeader}>
                  <div>
                    <h2 style={styles.sectionTitle}>
                      Discount Analysis
                    </h2>
                    <p style={styles.sectionDescription}>
                      Discount activity is shown only from the values currently available to this page.
                    </p>
                  </div>

                  <TicketPercent size={18} color="#26d8ff" />
                </div>

                <div
                  style={styles.discountGrid}
                  className="ruach-analysis-discounts"
                >
                  <div style={styles.discountCard}>
                    <div style={styles.discountGlow} />
                    <div style={styles.insightLabel}>DISCOUNTS USED</div>
                    <div style={{ ...styles.insightValue, marginTop: "7px" }}>
                      {discountsUsedCount.toLocaleString()}
                    </div>
                    <div style={styles.insightText}>
                      Existing discount-used value. No new discount calculation is introduced.
                    </div>
                    <div style={styles.progressTrack}>
                      <div
                        style={{
                          ...styles.progressFill,
                          width: `${discountUsageRate}%`
                        }}
                      />
                    </div>
                  </div>

                  <div style={styles.discountCard}>
                    <div style={styles.discountGlow} />
                    <div style={styles.insightLabel}>DISCOUNTS NOT USED</div>
                    <div style={{ ...styles.insightValue, marginTop: "7px" }}>
                      {discountsNotUsedCount.toLocaleString()}
                    </div>
                    <div style={styles.insightText}>
                      Derived only from the existing till-slip count minus the existing discounts-used value.
                    </div>
                    <div style={styles.progressTrack}>
                      <div
                        style={{
                          ...styles.progressFill,
                          width: `${discountNotUsedRate}%`
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </section>


            {/* =====================================================
                SYSTEM FOOTER
            ====================================================== */}
            <div style={styles.footerStrip}>
              <span>
                Analytics stream: {loadingAnalytics ? "Synchronizing" : "Operational"}
              </span>

              <span>
                {settings?.business_name || "RuachAgent merchant"}
              </span>

              <span>
                <RefreshCw size={11} style={{ verticalAlign: "-2px", marginRight: "5px" }} />
                {selectedDateRangeLabel || "Current range"}
              </span>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
