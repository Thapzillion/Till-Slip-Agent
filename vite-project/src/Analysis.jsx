import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Receipt,
  Store,
  SlidersHorizontal,
  FileText,
  HelpCircle,
  Bell,
  UserCircle2,
  Activity,
  TrendingUp,
  DollarSign,
  Database,
  RefreshCw,
  ChevronRight
} from "lucide-react";

import { supabase } from "./supabaseClient";
import { useBusiness } from "./backend/businessService";

import "./AdminPanel.css";


export default function Analysis() {

  const {
    user,
    settings,

    // Existing analytics state owned by business.js
    txCount,
    txVolume,
    graphData,

    // Existing inbox / receipt values
    activeInboxesCount,
    totalParsedCount,
    selectedDateRangeLabel,
    inboxGraphData,

    // Existing analytics loading state, if exposed
    loadingAnalytics,

    // Existing backend analytics function, if exposed
    fetchLiveAnalytics

  } = useBusiness();


  const navigate = useNavigate();

  const [showAccountMenu, setShowAccountMenu] = useState(false);


  // =========================================================
  // ANALYSIS-SPECIFIC SAFE VALUES
  // =========================================================

  const safeTxCount =
    Number(txCount) || 0;

  const safeTxVolume =
    Number(txVolume) || 0;

  const safeInboxCount =
    typeof activeInboxesCount !== "undefined"
      ? Number(activeInboxesCount) || 0
      : 0;

  const safeParsedCount =
    typeof totalParsedCount !== "undefined"
      ? Number(totalParsedCount) || 0
      : safeTxCount;


  const averageTransaction =
    safeTxCount > 0
      ? safeTxVolume / safeTxCount
      : 0;


  const formattedVolume =
    safeTxVolume.toLocaleString("en-ZA", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });


  const formattedAverage =
    averageTransaction.toLocaleString("en-ZA", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });


  // =========================================================
  // GRAPH DATA SAFETY
  // =========================================================

  const safeGraphData = useMemo(() => {

    if (
      Array.isArray(graphData) &&
      graphData.length > 0
    ) {
      return graphData;
    }

    return Array(28).fill(0);

  }, [graphData]);


  // =========================================================
  // OPTIONAL ANALYTICS REFRESH
  //
  // Backend remains in business.js.
  // We only invoke the already-existing function.
  // =========================================================

  useEffect(() => {

    if (
      user?.id &&
      typeof fetchLiveAnalytics === "function"
    ) {
      fetchLiveAnalytics(user.id);
    }

  }, [
    user?.id,
    fetchLiveAnalytics
  ]);


  // =========================================================
  // RUACHAGENT ANALYSIS STYLES
  //
  // These deliberately follow AdminPanel.jsx.
  // =========================================================

  const styles = {

    // -----------------------------------------------------
    // ROOT
    // -----------------------------------------------------

    container: {
      minHeight: "100vh",
      width: "100%",
      background: "#050608",
      color: "#ffffff",
      boxSizing: "border-box",
      fontFamily:
        "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    },


    // -----------------------------------------------------
    // MAIN ANALYSIS CONTENT
    // -----------------------------------------------------

    analysisPage: {
      width: "100%",
      minHeight: "100%",
      boxSizing: "border-box",
      padding: "28px",
      background:
        "radial-gradient(circle at 70% 0%, rgba(0,198,255,0.035), transparent 35%), #050608"
    },


    // -----------------------------------------------------
    // PAGE HEADER
    // -----------------------------------------------------

    pageHeader: {
      display: "flex",
      alignItems: "flex-start",
      justifyContent: "space-between",
      gap: "20px",
      marginBottom: "26px"
    },


    eyebrow: {
      color: "#00C6FF",
      fontSize: "10px",
      fontWeight: 800,
      letterSpacing: "1.8px",
      textTransform: "uppercase",
      fontFamily: "monospace",
      marginBottom: "7px"
    },


    pageTitle: {
      margin: 0,
      fontSize: "28px",
      lineHeight: 1.1,
      fontWeight: 800,
      letterSpacing: "-0.6px",
      color: "#ffffff"
    },


    pageDescription: {
      margin: "8px 0 0",
      color: "#7d8a99",
      fontSize: "13px",
      lineHeight: 1.6,
      maxWidth: "620px"
    },


    // -----------------------------------------------------
    // LIVE STATUS
    // -----------------------------------------------------

    liveStatus: {
      display: "inline-flex",
      alignItems: "center",
      gap: "9px",
      padding: "9px 13px",
      borderRadius: "10px",
      border: "1px solid rgba(0,198,255,0.18)",
      background: "rgba(9,15,21,0.82)",
      color: "#9aa8b8",
      fontSize: "10px",
      fontWeight: 800,
      letterSpacing: "0.8px",
      fontFamily: "monospace",
      whiteSpace: "nowrap"
    },


    liveDot: {
      width: "7px",
      height: "7px",
      borderRadius: "50%",
      background: "#00F5A0",
      boxShadow:
        "0 0 10px rgba(0,245,160,0.8)"
    },


    // -----------------------------------------------------
    // KPI GRID
    // -----------------------------------------------------

    kpiGrid: {
      display: "grid",
      gridTemplateColumns:
        "repeat(4, minmax(0, 1fr))",
      gap: "14px",
      marginBottom: "22px"
    },


    // -----------------------------------------------------
    // KPI CARD
    // -----------------------------------------------------

    kpiCard: {
      position: "relative",
      overflow: "hidden",
      minHeight: "142px",
      padding: "18px",
      borderRadius: "16px",
      border: "1px solid rgba(38,216,255,0.12)",
      background:
        "linear-gradient(145deg, rgba(17,21,27,0.98), rgba(10,13,18,0.98))",
      boxShadow:
        "0 16px 40px rgba(0,0,0,0.28)",
      boxSizing: "border-box"
    },


    kpiGlow: {
      position: "absolute",
      right: "-35px",
      top: "-35px",
      width: "100px",
      height: "100px",
      borderRadius: "50%",
      pointerEvents: "none"
    },


    kpiTop: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: "10px"
    },


    kpiLabel: {
      color: "#7d8a99",
      fontSize: "9px",
      fontWeight: 800,
      letterSpacing: "1.2px",
      textTransform: "uppercase",
      fontFamily: "monospace"
    },


    kpiIcon: {
      width: "30px",
      height: "30px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: "9px",
      flexShrink: 0
    },


    kpiValue: {
      marginTop: "17px",
      color: "#ffffff",
      fontSize: "25px",
      lineHeight: 1,
      fontWeight: 900,
      letterSpacing: "-0.5px",
      fontFamily: "monospace"
    },


    kpiMeta: {
      marginTop: "10px",
      color: "#536172",
      fontSize: "10px",
      lineHeight: 1.4
    },


    // -----------------------------------------------------
    // SECONDARY STATUS STRIP
    // -----------------------------------------------------

    systemStrip: {
      display: "grid",
      gridTemplateColumns:
        "repeat(3, minmax(0, 1fr))",
      gap: "12px",
      marginBottom: "22px"
    },


    systemItem: {
      display: "flex",
      alignItems: "center",
      gap: "12px",
      minHeight: "64px",
      padding: "12px 14px",
      borderRadius: "12px",
      border: "1px solid rgba(255,255,255,0.045)",
      background: "rgba(11,14,19,0.88)",
      boxSizing: "border-box"
    },


    systemIcon: {
      width: "34px",
      height: "34px",
      borderRadius: "9px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "rgba(0,198,255,0.07)",
      color: "#00C6FF"
    },


    systemLabel: {
      color: "#647284",
      fontSize: "9px",
      textTransform: "uppercase",
      letterSpacing: "0.9px",
      fontWeight: 800,
      fontFamily: "monospace"
    },


    systemValue: {
      color: "#d9e1e8",
      fontSize: "11px",
      marginTop: "3px",
      fontWeight: 700
    },


    // -----------------------------------------------------
    // PLACEHOLDER CONTENT PANEL
    //
    // Part 1B will replace/extend this area.
    // -----------------------------------------------------

    previewPanel: {
      border: "1px solid rgba(38,216,255,0.12)",
      borderRadius: "16px",
      background:
        "linear-gradient(145deg, rgba(17,21,27,0.97), rgba(8,11,15,0.98))",
      padding: "20px",
      minHeight: "180px",
      boxSizing: "border-box"
    },


    previewHeader: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: "18px"
    },


    previewTitle: {
      display: "flex",
      alignItems: "center",
      gap: "9px",
      color: "#dce5ec",
      fontSize: "11px",
      fontWeight: 800,
      letterSpacing: "1px",
      textTransform: "uppercase",
      fontFamily: "monospace"
    },


    previewLine: {
      height: "1px",
      width: "100%",
      background:
        "linear-gradient(90deg, rgba(38,216,255,0.18), transparent)"
    }
  };


  // =========================================================
  // KPI CARD COMPONENT
  // =========================================================

  const KpiCard = ({
    label,
    value,
    description,
    icon,
    accent,
    glow
  }) => {

    return (
      <div
        style={{
          ...styles.kpiCard,
          transition:
            "transform .2s ease, border-color .2s ease, box-shadow .2s ease"
        }}
        onMouseEnter={(event) => {

          event.currentTarget.style.transform =
            "translateY(-2px)";

          event.currentTarget.style.borderColor =
            "rgba(38,216,255,0.25)";

          event.currentTarget.style.boxShadow =
            "0 20px 45px rgba(0,0,0,0.36)";

        }}
        onMouseLeave={(event) => {

          event.currentTarget.style.transform =
            "translateY(0)";

          event.currentTarget.style.borderColor =
            "rgba(38,216,255,0.12)";

          event.currentTarget.style.boxShadow =
            "0 16px 40px rgba(0,0,0,0.28)";

        }}
      >

        <div
          style={{
            ...styles.kpiGlow,
            background: glow
          }}
        />

        <div style={styles.kpiTop}>

          <div style={styles.kpiLabel}>
            {label}
          </div>

          <div
            style={{
              ...styles.kpiIcon,
              background: `${accent}12`,
              color: accent,
              border:
                `1px solid ${accent}22`
            }}
          >
            {icon}
          </div>

        </div>

        <div
          style={{
            ...styles.kpiValue,
            color: "#ffffff"
          }}
        >
          {value}
        </div>

        <div style={styles.kpiMeta}>
          {description}
        </div>

      </div>
    );
  };


  // =========================================================
  // PAGE
  // =========================================================

  return (

    <div style={styles.container}>

      <div className="admin-page">

        {/* =================================================
                        SIDEBAR
                ================================================= */}

        <aside className="sidebar">

          {/* LOGO */}

          <div className="sidebar-logo">

            <div className="logo-icon">
              R
            </div>

            <div>
              <h2>
                RuachAgent AI
              </h2>

              <span>
                Intelligent Till Slip Assistant
              </span>
            </div>

          </div>


          {/* PREVIEWS */}

          <div className="sidebar-section">

            <p className="sidebar-title">
              PREVIEWS
            </p>

            <button
              className="sidebar-item active"
              onClick={() =>
                navigate("/analysis")
              }
            >
              <LayoutDashboard size={18} />

              <span>
                Analysis
              </span>
            </button>


            <button
              className="sidebar-item"
              onClick={() =>
                navigate("/connected-stores")
              }
            >
              <Store size={18} />

              <span>
                Connected Stores
              </span>
            </button>

          </div>


          {/* SETTINGS */}

          <div className="sidebar-section">

            <p className="sidebar-title">
              SETTINGS
            </p>

            <button
              className="sidebar-item"
              onClick={() =>
                navigate("/agent-parameters")
              }
            >
              <SlidersHorizontal size={18} />

              <span>
                Agent Parameters
              </span>
            </button>


            <button
              className="sidebar-item"
              onClick={() =>
                navigate("/till-slips-collwction")
              }
            >
              <FileText size={18} />

              <span>
                Till Slips Collection
              </span>
            </button>

          </div>


          {/* ACCOUNT */}

          <div className="sidebar-bottom">

            <div className="bottom-profile">

              <div
                style={{
                  position: "relative"
                }}
              >

                <div
                  onClick={() =>
                    setShowAccountMenu(
                      previous =>
                        !previous
                    )
                  }
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "12px",
                    borderRadius: "14px",
                    cursor: "pointer",
                    border:
                      "1px solid rgba(0,180,255,.18)",
                    background:
                      "rgba(15,18,24,.92)"
                  }}
                >

                  <div
                    style={{
                      width: "42px",
                      height: "42px",
                      borderRadius: "50%",
                      background:
                        "linear-gradient(135deg,#00C6FF,#0084FF)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#fff",
                      fontWeight: 800,
                      fontSize: "16px"
                    }}
                  >
                    {(
                      settings?.business_name ||
                      user?.email ||
                      "R"
                    )
                      .charAt(0)
                      .toUpperCase()}
                  </div>


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
                        fontSize: "13px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap"
                      }}
                    >
                      {settings?.business_name ||
                        "RuachAgent AI"}
                    </div>

                    <div
                      style={{
                        color: "#7d8a99",
                        fontSize: "11px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap"
                      }}
                    >
                      {user?.email || ""}
                    </div>

                  </div>

                  <ChevronRight
                    size={17}
                    color="#00C6FF"
                  />

                </div>


                {showAccountMenu && (

                  <div className="account-menu">

                    <div className="account-header">

                      <h3>
                        {settings?.business_name ||
                          "Business"}
                      </h3>

                      <p>
                        {user?.email}
                      </p>

                    </div>


                    <button
                      onClick={() =>
                        navigate(
                          "/agent-parameters"
                        )
                      }
                    >
                      Account Settings
                    </button>


                    <button
                      onClick={() =>
                        navigate("/billing")
                      }
                    >
                      Billing
                    </button>


                    <button
                      onClick={() =>
                        navigate("/security")
                      }
                    >
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


        {/* =================================================
                        MAIN CONTENT
                ================================================= */}

        <main className="main-content">

          {/* =================================================
                            TOPBAR
                    ================================================= */}

          <header className="topbar">

            <div className="topbar-center">

              <h1>
                RuachAgent AI
              </h1>

              <p>
                Your intelligent till slip assistant
              </p>

            </div>


            <div className="topbar-actions">

              <button
                className="icon-button"
                title="Help"
              >
                <HelpCircle size={20} />
              </button>


              <button
                className="icon-button"
                title="Notifications"
              >
                <Bell size={20} />
              </button>


              <button
                className="icon-button"
                title="Account"
                onClick={() =>
                  setShowAccountMenu(
                    previous =>
                      !previous
                  )
                }
              >
                <UserCircle2 size={24} />
              </button>

            </div>

          </header>


          {/* =================================================
                            ANALYSIS CONTENT
                    ================================================= */}

          <div style={styles.analysisPage}>

            {/* PAGE HEADER */}

            <div style={styles.pageHeader}>

              <div>

                <div style={styles.eyebrow}>
                  MERCHANT INTELLIGENCE / ANALYSIS
                </div>

                <h1 style={styles.pageTitle}>
                  Analysis
                </h1>

                <p style={styles.pageDescription}>
                  Monitor till slips sent, sales
                  volume, connected inboxes and
                  real-time receipt activity from
                  your RuachAgent network.
                </p>

              </div>


              <div style={styles.liveStatus}>

                <span
                  style={{
                    ...styles.liveDot,
                    animation:
                      "analysisLivePulse 1.8s infinite"
                  }}
                />

                {loadingAnalytics
                  ? "SYNCING"
                  : "LIVE ANALYTICS"}

              </div>

            </div>


            {/* =================================================
                                KPI CARDS
                        ================================================= */}

            <div style={styles.kpiGrid}>

              <KpiCard
                label="Till Slips Sent"
                value={safeTxCount.toLocaleString()}
                description="Total processed till slips"
                accent="#00C6FF"
                glow="rgba(0,198,255,0.16)"
                icon={
                  <Receipt size={16} />
                }
              />


              <KpiCard
                label="Sales Volume"
                value={`R ${formattedVolume}`}
                description="Total transaction volume"
                accent="#00F5A0"
                glow="rgba(0,245,160,0.14)"
                icon={
                  <DollarSign size={16} />
                }
              />


              <KpiCard
                label="Average Transaction"
                value={`R ${formattedAverage}`}
                description={
                  safeTxCount > 0
                    ? "Calculated from live transaction data"
                    : "Waiting for transaction data"
                }
                accent="#7C8CFF"
                glow="rgba(124,140,255,0.13)"
                icon={
                  <TrendingUp size={16} />
                }
              />


              <KpiCard
                label="Inboxes Synchronized"
                value={safeInboxCount.toLocaleString()}
                description="Active connected inbox nodes"
                accent="#26D8FF"
                glow="rgba(38,216,255,0.14)"
                icon={
                  <Database size={16} />
                }
              />

            </div>


            {/* =================================================
                                SYSTEM STATUS
                        ================================================= */}

            <div style={styles.systemStrip}>

              <div style={styles.systemItem}>

                <div style={styles.systemIcon}>
                  <Activity size={17} />
                </div>

                <div>

                  <div style={styles.systemLabel}>
                    Analytics Stream
                  </div>

                  <div style={styles.systemValue}>
                    {loadingAnalytics
                      ? "Synchronizing..."
                      : "Operational"}
                  </div>

                </div>

              </div>


              <div style={styles.systemItem}>

                <div
                  style={{
                    ...styles.systemIcon,
                    color: "#00F5A0",
                    background:
                      "rgba(0,245,160,0.07)"
                  }}
                >
                  <Receipt size={17} />
                </div>

                <div>

                  <div style={styles.systemLabel}>
                    Till Slip Pipeline
                  </div>

                  <div style={styles.systemValue}>
                    {safeParsedCount.toLocaleString()}{" "}
                    documents
                  </div>

                </div>

              </div>


              <div style={styles.systemItem}>

                <div
                  style={{
                    ...styles.systemIcon,
                    color: "#7C8CFF",
                    background:
                      "rgba(124,140,255,0.07)"
                  }}
                >
                  <RefreshCw size={17} />
                </div>

                <div>

                  <div style={styles.systemLabel}>
                    Analysis Range
                  </div>

                  <div style={styles.systemValue}>
                    {selectedDateRangeLabel ||
                      "Past 30 Days"}
                  </div>

                </div>

              </div>

            </div>


            {/* =================================================
                                PART 1B ENTRY PANEL
                        ================================================= */}

            {/* =========================================================
        PART 1B — ANALYTICS GRAPH + REVENUE OVERVIEW
========================================================= */}

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "minmax(0, 1.65fr) minmax(280px, 0.75fr)",
                gap: "16px",
                marginTop: "16px"
              }}
              className="analysis-revenue-layout"
            >

              {/* =====================================================
            28-PERIOD ANALYTICS GRAPH
    ===================================================== */}

              <div
                style={{
                  ...styles.previewPanel,
                  minHeight: "380px",
                  padding: "22px"
                }}
              >

                {/* GRAPH HEADER */}

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    gap: "20px",
                    marginBottom: "20px"
                  }}
                >

                  <div>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        color: "#dce5ec",
                        fontSize: "11px",
                        fontWeight: 800,
                        letterSpacing: "1px",
                        textTransform: "uppercase",
                        fontFamily: "monospace"
                      }}
                    >

                      <span
                        style={{
                          width: "7px",
                          height: "7px",
                          borderRadius: "50%",
                          background: "#00F5A0",
                          boxShadow:
                            "0 0 10px rgba(0,245,160,.65)"
                        }}
                      />

                      Revenue Activity

                    </div>

                    <div
                      style={{
                        color: "#536172",
                        fontSize: "10px",
                        marginTop: "7px"
                      }}
                    >
                      Transaction activity across the latest
                      28 reporting periods.
                    </div>

                  </div>


                  {/* RANGE */}

                  <div
                    style={{
                      padding: "7px 10px",
                      borderRadius: "8px",
                      border:
                        "1px solid rgba(38,216,255,.10)",
                      background:
                        "rgba(38,216,255,.035)",
                      color: "#00C6FF",
                      fontFamily: "monospace",
                      fontSize: "8px",
                      fontWeight: 800,
                      letterSpacing: ".8px",
                      whiteSpace: "nowrap"
                    }}
                  >
                    {selectedDateRangeLabel ||
                      "PAST 30 DAYS"}
                  </div>

                </div>


                {/* =================================================
                GRAPH CONTAINER
        ================================================= */}

                <div
                  style={{
                    position: "relative",
                    height: "245px",
                    borderRadius: "12px",
                    border:
                      "1px solid rgba(255,255,255,.035)",
                    background:
                      "linear-gradient(180deg, rgba(255,255,255,.018), rgba(0,0,0,.08))",
                    overflow: "hidden"
                  }}
                >

                  {/* HORIZONTAL GRID LINES */}

                  {[0, 1, 2, 3, 4].map((line) => (

                    <div
                      key={line}
                      style={{
                        position: "absolute",
                        left: "0",
                        right: "0",
                        top:
                          `${line * 25}%`,
                        height: "1px",
                        background:
                          "rgba(255,255,255,.035)",
                        pointerEvents: "none"
                      }}
                    />

                  ))}


                  {/* Y AXIS LABELS */}

                  <div
                    style={{
                      position: "absolute",
                      top: "10px",
                      right: "10px",
                      color: "#3d4a59",
                      fontSize: "8px",
                      fontFamily: "monospace"
                    }}
                  >
                    HIGH
                  </div>

                  <div
                    style={{
                      position: "absolute",
                      bottom: "10px",
                      right: "10px",
                      color: "#3d4a59",
                      fontSize: "8px",
                      fontFamily: "monospace"
                    }}
                  >
                    LOW
                  </div>


                  {/* =================================================
                    GRAPH BARS
            ================================================= */}

                  <div
                    style={{
                      position: "absolute",
                      inset: "16px 18px 20px 18px",
                      display: "flex",
                      alignItems: "flex-end",
                      gap: "5px"
                    }}
                  >

                    {safeGraphData.map(
                      (heightValue, index) => {

                        const numericHeight =
                          Number(heightValue) || 0;

                        const hasData =
                          numericHeight > 0;

                        const isLatest =
                          index ===
                          safeGraphData.length - 1;


                        return (

                          <div
                            key={`graph-${index}`}
                            title={
                              hasData
                                ? `Period ${index + 1}: ${numericHeight.toFixed(1)}% activity`
                                : `Period ${index + 1}: No activity`
                            }
                            style={{
                              flex: 1,
                              minWidth: "3px",
                              height: hasData
                                ? `${Math.max(
                                  4,
                                  Math.min(
                                    numericHeight,
                                    100
                                  )
                                )}%`
                                : "3px",

                              borderRadius:
                                "4px 4px 2px 2px",

                              background:
                                !hasData
                                  ? "rgba(61,84,118,.20)"
                                  : isLatest
                                    ? "linear-gradient(180deg,#67e8f9 0%,#00C6FF 45%,#0084FF 100%)"
                                    : "linear-gradient(180deg,rgba(38,216,255,.55),rgba(0,198,255,.12))",

                              borderTop:
                                hasData
                                  ? `1px solid ${isLatest
                                    ? "#67e8f9"
                                    : "rgba(38,216,255,.45)"
                                  }`
                                  : "none",

                              opacity:
                                hasData
                                  ? isLatest
                                    ? 1
                                    : .72
                                  : .5,

                              boxShadow:
                                isLatest && hasData
                                  ? "0 0 14px rgba(0,198,255,.20)"
                                  : "none",

                              transition:
                                "height .45s cubic-bezier(.4,0,.2,1), opacity .2s ease, filter .2s ease",

                              animation:
                                "analysisBarReveal .65s ease both",

                              animationDelay:
                                `${index * 18}ms`,

                              cursor: "default"
                            }}

                            onMouseEnter={(event) => {

                              if (hasData) {

                                event.currentTarget.style.opacity =
                                  "1";

                                event.currentTarget.style.filter =
                                  "brightness(1.35)";

                              }

                            }}

                            onMouseLeave={(event) => {

                              event.currentTarget.style.opacity =
                                hasData
                                  ? isLatest
                                    ? "1"
                                    : ".72"
                                  : ".5";

                              event.currentTarget.style.filter =
                                "none";

                            }}
                          />

                        );

                      }
                    )}

                  </div>


                  {/* GRAPH BASELINE */}

                  <div
                    style={{
                      position: "absolute",
                      left: "18px",
                      right: "18px",
                      bottom: "19px",
                      height: "1px",
                      background:
                        "rgba(38,216,255,.12)"
                    }}
                  />

                </div>


                {/* GRAPH FOOTER */}

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginTop: "12px",
                    color: "#465365",
                    fontSize: "8px",
                    fontFamily: "monospace",
                    letterSpacing: ".5px"
                  }}
                >

                  <span>
                    PERIOD 01
                  </span>

                  <span>
                    28 PERIODS
                  </span>

                  <span>
                    LATEST
                  </span>

                </div>

              </div>


              {/* =====================================================
            REVENUE OVERVIEW
    ===================================================== */}

              <section
                style={{
                  ...styles.previewPanel,
                  minHeight: "380px",
                  padding: "22px",
                  display: "flex",
                  flexDirection: "column"
                }}
              >

                {/* HEADER */}

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "24px"
                  }}
                >

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      color: "#dce5ec",
                      fontSize: "11px",
                      fontWeight: 800,
                      letterSpacing: "1px",
                      textTransform: "uppercase",
                      fontFamily: "monospace"
                    }}
                  >

                    <DollarSign
                      size={15}
                      color="#00F5A0"
                    />

                    Revenue Overview

                  </div>

                  <TrendingUp
                    size={15}
                    color="#00C6FF"
                  />

                </div>


                {/* TOTAL REVENUE */}

                <div>

                  <div
                    style={{
                      color: "#586677",
                      fontSize: "9px",
                      fontWeight: 800,
                      letterSpacing: "1px",
                      textTransform: "uppercase",
                      fontFamily: "monospace"
                    }}
                  >
                    Total Sales Volume
                  </div>


                  <div
                    style={{
                      marginTop: "8px",
                      fontSize: "28px",
                      lineHeight: 1,
                      fontWeight: 900,
                      letterSpacing: "-1px",
                      color: "#ffffff",
                      fontFamily: "monospace"
                    }}
                  >

                    R {formattedVolume}

                  </div>


                  <div
                    style={{
                      marginTop: "8px",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      color: "#00F5A0",
                      fontSize: "9px",
                      fontFamily: "monospace",
                      fontWeight: 700
                    }}
                  >

                    <Activity size={11} />

                    LIVE DATABASE VALUE

                  </div>

                </div>


                {/* DIVIDER */}

                <div
                  style={{
                    height: "1px",
                    background:
                      "rgba(255,255,255,.05)",
                    margin:
                      "22px 0"
                  }}
                />


                {/* REVENUE METRICS */}

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "17px"
                  }}
                >

                  {/* TRANSACTIONS */}

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: "12px"
                    }}
                  >

                    <div>

                      <div
                        style={{
                          color: "#647284",
                          fontSize: "9px",
                          textTransform: "uppercase",
                          letterSpacing: ".8px",
                          fontFamily: "monospace"
                        }}
                      >
                        Till Slips Sent
                      </div>

                      <div
                        style={{
                          marginTop: "5px",
                          color: "#dce5ec",
                          fontSize: "15px",
                          fontWeight: 800,
                          fontFamily: "monospace"
                        }}
                      >
                        {safeTxCount.toLocaleString()}
                      </div>

                    </div>


                    <div
                      style={{
                        width: "32px",
                        height: "32px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: "9px",
                        background:
                          "rgba(0,198,255,.07)",
                        border:
                          "1px solid rgba(0,198,255,.10)",
                        color: "#00C6FF"
                      }}
                    >
                      <Receipt size={15} />
                    </div>

                  </div>


                  {/* AVERAGE SALE */}

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: "12px"
                    }}
                  >

                    <div>

                      <div
                        style={{
                          color: "#647284",
                          fontSize: "9px",
                          textTransform: "uppercase",
                          letterSpacing: ".8px",
                          fontFamily: "monospace"
                        }}
                      >
                        Average Sale
                      </div>

                      <div
                        style={{
                          marginTop: "5px",
                          color: "#dce5ec",
                          fontSize: "15px",
                          fontWeight: 800,
                          fontFamily: "monospace"
                        }}
                      >
                        R {formattedAverage}
                      </div>

                    </div>


                    <div
                      style={{
                        width: "32px",
                        height: "32px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: "9px",
                        background:
                          "rgba(0,245,160,.06)",
                        border:
                          "1px solid rgba(0,245,160,.10)",
                        color: "#00F5A0"
                      }}
                    >
                      <TrendingUp size={15} />
                    </div>

                  </div>


                  {/* INBOXES */}

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: "12px"
                    }}
                  >

                    <div>

                      <div
                        style={{
                          color: "#647284",
                          fontSize: "9px",
                          textTransform: "uppercase",
                          letterSpacing: ".8px",
                          fontFamily: "monospace"
                        }}
                      >
                        Active Inboxes
                      </div>

                      <div
                        style={{
                          marginTop: "5px",
                          color: "#dce5ec",
                          fontSize: "15px",
                          fontWeight: 800,
                          fontFamily: "monospace"
                        }}
                      >
                        {safeInboxCount.toLocaleString()}
                      </div>

                    </div>


                    <div
                      style={{
                        width: "32px",
                        height: "32px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: "9px",
                        background:
                          "rgba(124,140,255,.06)",
                        border:
                          "1px solid rgba(124,140,255,.10)",
                        color: "#7C8CFF"
                      }}
                    >
                      <Database size={15} />
                    </div>

                  </div>

                </div>


                {/* BOTTOM STATUS */}

                <div
                  style={{
                    marginTop: "auto",
                    paddingTop: "18px"
                  }}
                >

                  <div
                    style={{
                      padding: "11px 12px",
                      borderRadius: "9px",
                      border:
                        "1px solid rgba(0,245,160,.09)",
                      background:
                        "rgba(0,245,160,.035)",
                      display: "flex",
                      alignItems: "center",
                      gap: "9px"
                    }}
                  >

                    <span
                      style={{
                        width: "6px",
                        height: "6px",
                        borderRadius: "50%",
                        background: "#00F5A0",
                        boxShadow:
                          "0 0 8px rgba(0,245,160,.7)"
                      }}
                    />

                    <span
                      style={{
                        color: "#789083",
                        fontSize: "9px",
                        fontFamily: "monospace",
                        letterSpacing: ".4px"
                      }}
                    >
                      ANALYTICS ENGINE OPERATIONAL
                    </span>

                  </div>

                </div>

              </section>

            </div>


            {/* =========================================================
        PART 1B RESPONSIVE + GRAPH ANIMATION
========================================================= */}

            <style>
              {`

        @keyframes analysisBarReveal {

            from {
                opacity: 0;
                transform: scaleY(0);
                transform-origin: bottom;
            }

            to {
                opacity: 1;
                transform: scaleY(1);
                transform-origin: bottom;
            }

        }


        @media (max-width: 1050px) {

            .analysis-revenue-layout {

                grid-template-columns:
                    1fr !important;

            }

        }


        @media (max-width: 650px) {

            .analysis-revenue-layout {

                gap: 12px !important;

            }

        }

    `}
            </style>

            {/* =========================================================
        PART 2 — BUSINESS INTELLIGENCE
========================================================= */}

            <section
              style={{
                marginTop: "18px"
              }}
            >

              {/* =====================================================
            SECTION HEADER
    ===================================================== */}

              <div
                style={{
                  display: "flex",
                  alignItems: "flex-end",
                  justifyContent: "space-between",
                  gap: "20px",
                  marginBottom: "14px"
                }}
              >

                <div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      color: "#dce5ec",
                      fontSize: "11px",
                      fontWeight: 800,
                      letterSpacing: "1px",
                      textTransform: "uppercase",
                      fontFamily: "monospace"
                    }}
                  >

                    <Activity
                      size={15}
                      color="#00C6FF"
                    />

                    Business Intelligence

                  </div>

                  <div
                    style={{
                      marginTop: "6px",
                      color: "#526173",
                      fontSize: "10px"
                    }}
                  >
                    Operational intelligence generated from your
                    connected till-slip network.
                  </div>

                </div>


                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "7px",
                    color: "#5e7182",
                    fontSize: "8px",
                    fontFamily: "monospace",
                    letterSpacing: ".7px"
                  }}
                >

                  <span
                    style={{
                      width: "6px",
                      height: "6px",
                      borderRadius: "50%",
                      background: "#00F5A0",
                      boxShadow:
                        "0 0 8px rgba(0,245,160,.65)"
                    }}
                  />

                  LIVE SYSTEM INTELLIGENCE

                </div>

              </div>


              {/* =====================================================
            INTELLIGENCE GRID
    ===================================================== */}

              <div
                className="analysis-intelligence-grid"
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(3, minmax(0, 1fr))",
                  gap: "14px"
                }}
              >


                {/* =================================================
                1. DISCOUNTS USED
        ================================================= */}

                <div
                  style={{
                    ...styles.previewPanel,
                    minHeight: "175px",
                    padding: "18px",
                    position: "relative",
                    overflow: "hidden",
                    transition:
                      "transform .2s ease, border-color .2s ease"
                  }}

                  onMouseEnter={(event) => {

                    event.currentTarget.style.transform =
                      "translateY(-2px)";

                    event.currentTarget.style.borderColor =
                      "rgba(0,245,160,.24)";

                  }}

                  onMouseLeave={(event) => {

                    event.currentTarget.style.transform =
                      "translateY(0)";

                    event.currentTarget.style.borderColor =
                      "rgba(38,216,255,.12)";

                  }}
                >

                  {/* GLOW */}

                  <div
                    style={{
                      position: "absolute",
                      right: "-30px",
                      top: "-35px",
                      width: "105px",
                      height: "105px",
                      borderRadius: "50%",
                      background:
                        "rgba(0,245,160,.055)",
                      pointerEvents: "none"
                    }}
                  />


                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between"
                    }}
                  >

                    <div
                      style={{
                        color: "#647284",
                        fontSize: "9px",
                        fontWeight: 800,
                        letterSpacing: "1px",
                        textTransform: "uppercase",
                        fontFamily: "monospace"
                      }}
                    >
                      Discounts Used
                    </div>


                    <div
                      style={{
                        width: "30px",
                        height: "30px",
                        borderRadius: "9px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background:
                          "rgba(0,245,160,.06)",
                        border:
                          "1px solid rgba(0,245,160,.12)",
                        color: "#00F5A0",
                        fontSize: "13px",
                        fontWeight: 900
                      }}
                    >
                      %
                    </div>

                  </div>


                  <div
                    style={{
                      marginTop: "22px",
                      display: "flex",
                      alignItems: "baseline",
                      gap: "8px"
                    }}
                  >

                    <span
                      style={{
                        color: "#ffffff",
                        fontSize: "25px",
                        lineHeight: 1,
                        fontWeight: 900,
                        fontFamily: "monospace"
                      }}
                    >
                      {typeof discountsUsedCount !== "undefined"
                        ? Number(discountsUsedCount || 0).toLocaleString()
                        : "0"}
                    </span>

                    <span
                      style={{
                        color: "#566678",
                        fontSize: "9px",
                        fontFamily: "monospace"
                      }}
                    >
                      SALES
                    </span>

                  </div>


                  <div
                    style={{
                      marginTop: "12px",
                      color: "#526173",
                      fontSize: "9px",
                      lineHeight: 1.5
                    }}
                  >
                    Transactions where a discount
                    or promotion was applied.
                  </div>


                  <div
                    style={{
                      position: "absolute",
                      left: "18px",
                      right: "18px",
                      bottom: "16px",
                      height: "3px",
                      borderRadius: "999px",
                      background:
                        "rgba(255,255,255,.035)",
                      overflow: "hidden"
                    }}
                  >

                    <div
                      style={{
                        height: "100%",
                        width:
                          safeTxCount > 0 &&
                            typeof discountsUsedCount !== "undefined"
                            ? `${Math.min(
                              100,
                              (Number(discountsUsedCount || 0) /
                                safeTxCount) *
                              100
                            )}%`
                            : "0%",
                        borderRadius: "999px",
                        background:
                          "linear-gradient(90deg,#00F5A0,#67e8b7)",
                        transition:
                          "width .6s ease"
                      }}
                    />

                  </div>

                </div>


                {/* =================================================
                2. DISCOUNTS NOT USED
        ================================================= */}

                <div
                  style={{
                    ...styles.previewPanel,
                    minHeight: "175px",
                    padding: "18px",
                    position: "relative",
                    overflow: "hidden",
                    transition:
                      "transform .2s ease, border-color .2s ease"
                  }}

                  onMouseEnter={(event) => {

                    event.currentTarget.style.transform =
                      "translateY(-2px)";

                    event.currentTarget.style.borderColor =
                      "rgba(124,140,255,.24)";

                  }}

                  onMouseLeave={(event) => {

                    event.currentTarget.style.transform =
                      "translateY(0)";

                    event.currentTarget.style.borderColor =
                      "rgba(38,216,255,.12)";

                  }}
                >

                  <div
                    style={{
                      position: "absolute",
                      right: "-30px",
                      top: "-35px",
                      width: "105px",
                      height: "105px",
                      borderRadius: "50%",
                      background:
                        "rgba(124,140,255,.055)",
                      pointerEvents: "none"
                    }}
                  />


                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between"
                    }}
                  >

                    <div
                      style={{
                        color: "#647284",
                        fontSize: "9px",
                        fontWeight: 800,
                        letterSpacing: "1px",
                        textTransform: "uppercase",
                        fontFamily: "monospace"
                      }}
                    >
                      Discounts Not Used
                    </div>


                    <div
                      style={{
                        width: "30px",
                        height: "30px",
                        borderRadius: "9px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background:
                          "rgba(124,140,255,.06)",
                        border:
                          "1px solid rgba(124,140,255,.12)",
                        color: "#7C8CFF"
                      }}
                    >
                      <Receipt size={14} />
                    </div>

                  </div>


                  <div
                    style={{
                      marginTop: "22px",
                      display: "flex",
                      alignItems: "baseline",
                      gap: "8px"
                    }}
                  >

                    <span
                      style={{
                        color: "#ffffff",
                        fontSize: "25px",
                        lineHeight: 1,
                        fontWeight: 900,
                        fontFamily: "monospace"
                      }}
                    >
                      {typeof discountsNotUsedCount !== "undefined"
                        ? Number(discountsNotUsedCount || 0).toLocaleString()
                        : "0"}
                    </span>

                    <span
                      style={{
                        color: "#566678",
                        fontSize: "9px",
                        fontFamily: "monospace"
                      }}
                    >
                      SALES
                    </span>

                  </div>


                  <div
                    style={{
                      marginTop: "12px",
                      color: "#526173",
                      fontSize: "9px",
                      lineHeight: 1.5
                    }}
                  >
                    Transactions completed without
                    applying an available discount.
                  </div>


                  <div
                    style={{
                      position: "absolute",
                      left: "18px",
                      right: "18px",
                      bottom: "16px",
                      height: "3px",
                      borderRadius: "999px",
                      background:
                        "rgba(255,255,255,.035)",
                      overflow: "hidden"
                    }}
                  >

                    <div
                      style={{
                        height: "100%",
                        width:
                          safeTxCount > 0 &&
                            typeof discountsNotUsedCount !== "undefined"
                            ? `${Math.min(
                              100,
                              (Number(discountsNotUsedCount || 0) /
                                safeTxCount) *
                              100
                            )}%`
                            : "0%",
                        borderRadius: "999px",
                        background:
                          "linear-gradient(90deg,#7C8CFF,#9da9ff)",
                        transition:
                          "width .6s ease"
                      }}
                    />

                  </div>

                </div>


                {/* =================================================
                3. AVERAGE SALE
        ================================================= */}

                <div
                  style={{
                    ...styles.previewPanel,
                    minHeight: "175px",
                    padding: "18px",
                    position: "relative",
                    overflow: "hidden"
                  }}
                >

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between"
                    }}
                  >

                    <div
                      style={{
                        color: "#647284",
                        fontSize: "9px",
                        fontWeight: 800,
                        letterSpacing: "1px",
                        textTransform: "uppercase",
                        fontFamily: "monospace"
                      }}
                    >
                      Average Sale
                    </div>


                    <div
                      style={{
                        width: "30px",
                        height: "30px",
                        borderRadius: "9px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background:
                          "rgba(0,198,255,.06)",
                        border:
                          "1px solid rgba(0,198,255,.12)",
                        color: "#00C6FF"
                      }}
                    >
                      <TrendingUp size={14} />
                    </div>

                  </div>


                  <div
                    style={{
                      marginTop: "22px",
                      color: "#ffffff",
                      fontSize: "25px",
                      lineHeight: 1,
                      fontWeight: 900,
                      fontFamily: "monospace"
                    }}
                  >
                    R {formattedAverage}
                  </div>


                  <div
                    style={{
                      marginTop: "13px",
                      color: "#526173",
                      fontSize: "9px",
                      lineHeight: 1.5
                    }}
                  >
                    Average transaction value across
                    all till slips currently recorded.
                  </div>


                  <div
                    style={{
                      position: "absolute",
                      left: "18px",
                      right: "18px",
                      bottom: "16px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between"
                    }}
                  >

                    <span
                      style={{
                        color: "#00C6FF",
                        fontSize: "8px",
                        fontWeight: 800,
                        fontFamily: "monospace"
                      }}
                    >
                      {safeTxCount > 0
                        ? "CALCULATED"
                        : "AWAITING DATA"}
                    </span>


                    <span
                      style={{
                        color: "#3f4c5a",
                        fontSize: "8px",
                        fontFamily: "monospace"
                      }}
                    >
                      TX / COUNT
                    </span>

                  </div>

                </div>


                {/* =================================================
                4. TILL SLIPS SENT
        ================================================= */}

                <div
                  style={{
                    ...styles.previewPanel,
                    minHeight: "175px",
                    padding: "18px",
                    position: "relative",
                    overflow: "hidden"
                  }}
                >

                  <div
                    style={{
                      position: "absolute",
                      right: "-30px",
                      bottom: "-45px",
                      width: "120px",
                      height: "120px",
                      borderRadius: "50%",
                      background:
                        "rgba(0,198,255,.045)"
                    }}
                  />


                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between"
                    }}
                  >

                    <div
                      style={{
                        color: "#647284",
                        fontSize: "9px",
                        fontWeight: 800,
                        letterSpacing: "1px",
                        textTransform: "uppercase",
                        fontFamily: "monospace"
                      }}
                    >
                      Till Slips Sent
                    </div>


                    <div
                      style={{
                        width: "30px",
                        height: "30px",
                        borderRadius: "9px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background:
                          "rgba(0,198,255,.06)",
                        border:
                          "1px solid rgba(0,198,255,.12)",
                        color: "#00C6FF"
                      }}
                    >
                      <Receipt size={14} />
                    </div>

                  </div>


                  <div
                    style={{
                      marginTop: "22px",
                      color: "#ffffff",
                      fontSize: "25px",
                      lineHeight: 1,
                      fontWeight: 900,
                      fontFamily: "monospace"
                    }}
                  >
                    {safeTxCount.toLocaleString()}
                  </div>


                  <div
                    style={{
                      marginTop: "13px",
                      color: "#526173",
                      fontSize: "9px",
                      lineHeight: 1.5
                    }}
                  >
                    Total transaction documents
                    processed through RuachAgent.
                  </div>


                  <div
                    style={{
                      position: "absolute",
                      left: "18px",
                      right: "18px",
                      bottom: "16px",
                      display: "flex",
                      alignItems: "center",
                      gap: "7px"
                    }}
                  >

                    <span
                      style={{
                        width: "6px",
                        height: "6px",
                        borderRadius: "50%",
                        background: "#00C6FF",
                        boxShadow:
                          "0 0 8px rgba(0,198,255,.7)"
                      }}
                    />

                    <span
                      style={{
                        color: "#00C6FF",
                        fontSize: "8px",
                        fontWeight: 800,
                        fontFamily: "monospace"
                      }}
                    >
                      PROCESSING PIPELINE
                    </span>

                  </div>

                </div>


                {/* =================================================
                5. PROCESSING HEALTH
        ================================================= */}

                <div
                  style={{
                    ...styles.previewPanel,
                    minHeight: "175px",
                    padding: "18px",
                    position: "relative",
                    overflow: "hidden"
                  }}
                >

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between"
                    }}
                  >

                    <div
                      style={{
                        color: "#647284",
                        fontSize: "9px",
                        fontWeight: 800,
                        letterSpacing: "1px",
                        textTransform: "uppercase",
                        fontFamily: "monospace"
                      }}
                    >
                      Processing Health
                    </div>


                    <div
                      style={{
                        width: "30px",
                        height: "30px",
                        borderRadius: "9px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background:
                          "rgba(0,245,160,.06)",
                        border:
                          "1px solid rgba(0,245,160,.12)",
                        color: "#00F5A0"
                      }}
                    >
                      <Activity size={14} />
                    </div>

                  </div>


                  {/* HEALTH STATUS */}

                  <div
                    style={{
                      marginTop: "22px",
                      display: "flex",
                      alignItems: "center",
                      gap: "10px"
                    }}
                  >

                    <span
                      style={{
                        width: "10px",
                        height: "10px",
                        borderRadius: "50%",
                        background: loadingAnalytics
                          ? "#FBBF24"
                          : "#00F5A0",
                        boxShadow: loadingAnalytics
                          ? "0 0 12px rgba(251,191,36,.55)"
                          : "0 0 12px rgba(0,245,160,.65)",
                        animation:
                          "analysisHealthPulse 2s infinite"
                      }}
                    />

                    <span
                      style={{
                        color: "#ffffff",
                        fontSize: "18px",
                        fontWeight: 900,
                        fontFamily: "monospace"
                      }}
                    >
                      {loadingAnalytics
                        ? "SYNCING"
                        : "HEALTHY"}
                    </span>

                  </div>


                  <div
                    style={{
                      marginTop: "13px",
                      color: "#526173",
                      fontSize: "9px",
                      lineHeight: 1.5
                    }}
                  >
                    {loadingAnalytics
                      ? "Analytics engine is synchronizing with Supabase."
                      : "Analytics stream is responding normally."}
                  </div>


                  {/* HEALTH INDICATORS */}

                  <div
                    style={{
                      position: "absolute",
                      left: "18px",
                      right: "18px",
                      bottom: "16px",
                      display: "flex",
                      gap: "4px"
                    }}
                  >

                    {Array.from({
                      length: 18
                    }).map((_, index) => (

                      <div
                        key={index}
                        style={{
                          flex: 1,
                          height: "3px",
                          borderRadius: "999px",
                          background:
                            loadingAnalytics
                              ? index % 3 === 0
                                ? "rgba(251,191,36,.7)"
                                : "rgba(255,255,255,.05)"
                              : "rgba(0,245,160,.55)"
                        }}
                      />

                    ))}

                  </div>

                </div>


                {/* =================================================
                6. AI STATUS
        ================================================= */}

                <div
                  style={{
                    ...styles.previewPanel,
                    minHeight: "175px",
                    padding: "18px",
                    position: "relative",
                    overflow: "hidden",
                    border:
                      "1px solid rgba(124,140,255,.15)"
                  }}
                >

                  {/* AI AMBIENT GLOW */}

                  <div
                    style={{
                      position: "absolute",
                      right: "-45px",
                      top: "-45px",
                      width: "130px",
                      height: "130px",
                      borderRadius: "50%",
                      background:
                        "radial-gradient(circle, rgba(124,140,255,.11), transparent 68%)",
                      pointerEvents: "none"
                    }}
                  />


                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between"
                    }}
                  >

                    <div
                      style={{
                        color: "#647284",
                        fontSize: "9px",
                        fontWeight: 800,
                        letterSpacing: "1px",
                        textTransform: "uppercase",
                        fontFamily: "monospace"
                      }}
                    >
                      AI Status
                    </div>


                    <div
                      style={{
                        width: "30px",
                        height: "30px",
                        borderRadius: "9px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background:
                          "rgba(124,140,255,.08)",
                        border:
                          "1px solid rgba(124,140,255,.16)",
                        color: "#9da9ff",
                        fontSize: "10px",
                        fontWeight: 900,
                        fontFamily: "monospace"
                      }}
                    >
                      AI
                    </div>

                  </div>


                  <div
                    style={{
                      marginTop: "22px",
                      display: "flex",
                      alignItems: "center",
                      gap: "10px"
                    }}
                  >

                    <span
                      style={{
                        width: "9px",
                        height: "9px",
                        borderRadius: "50%",
                        background: "#9da9ff",
                        boxShadow:
                          "0 0 12px rgba(124,140,255,.7)",
                        animation:
                          "analysisAiPulse 2.4s infinite"
                      }}
                    />

                    <span
                      style={{
                        color: "#ffffff",
                        fontSize: "18px",
                        fontWeight: 900,
                        fontFamily: "monospace"
                      }}
                    >
                      ONLINE
                    </span>

                  </div>


                  <div
                    style={{
                      marginTop: "13px",
                      color: "#526173",
                      fontSize: "9px",
                      lineHeight: 1.5
                    }}
                  >
                    RuachAgent intelligence layer is
                    ready to analyze merchant activity.
                  </div>


                  {/* AI CAPABILITIES */}

                  <div
                    style={{
                      position: "absolute",
                      left: "18px",
                      right: "18px",
                      bottom: "16px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between"
                    }}
                  >

                    <span
                      style={{
                        color: "#7984c5",
                        fontSize: "7px",
                        fontWeight: 800,
                        fontFamily: "monospace",
                        letterSpacing: ".6px"
                      }}
                    >
                      ANALYSIS
                    </span>

                    <span
                      style={{
                        color: "#7984c5",
                        fontSize: "7px",
                        fontWeight: 800,
                        fontFamily: "monospace",
                        letterSpacing: ".6px"
                      }}
                    >
                      INSIGHTS
                    </span>

                    <span
                      style={{
                        color: "#7984c5",
                        fontSize: "7px",
                        fontWeight: 800,
                        fontFamily: "monospace",
                        letterSpacing: ".6px"
                      }}
                    >
                      AUTOMATION
                    </span>

                  </div>

                </div>

              </div>

            </section>


            {/* =========================================================
        PART 2 — RESPONSIVE + ANIMATION
========================================================= */}

            <style>
              {`

        @keyframes analysisHealthPulse {

            0% {
                opacity: 1;
                transform: scale(1);
            }

            50% {
                opacity: .55;
                transform: scale(.82);
            }

            100% {
                opacity: 1;
                transform: scale(1);
            }

        }


        @keyframes analysisAiPulse {

            0% {
                opacity: 1;
                transform: scale(1);
                box-shadow:
                    0 0 10px rgba(124,140,255,.65);
            }

            50% {
                opacity: .55;
                transform: scale(.8);
                box-shadow:
                    0 0 18px rgba(124,140,255,.2);
            }

            100% {
                opacity: 1;
                transform: scale(1);
                box-shadow:
                    0 0 10px rgba(124,140,255,.65);
            }

        }


        @media (max-width: 1050px) {

            .analysis-intelligence-grid {
                grid-template-columns:
                    repeat(2, minmax(0, 1fr)) !important;
            }

        }


        @media (max-width: 650px) {

            .analysis-intelligence-grid {
                grid-template-columns:
                    1fr !important;
            }

        }

    `}
            </style>

          </div>

        </main>

      </div>


      {/* =========================================================
                    ANALYSIS-SPECIFIC ANIMATION
            ========================================================= */}

      <style>
        {`

                    @keyframes analysisLivePulse {

                        0% {
                            transform: scale(1);
                            opacity: 1;
                            box-shadow:
                                0 0 0 0 rgba(0,245,160,0.45);
                        }

                        70% {
                            transform: scale(1.08);
                            opacity: 0.82;
                            box-shadow:
                                0 0 0 7px rgba(0,245,160,0);
                        }

                        100% {
                            transform: scale(1);
                            opacity: 1;
                            box-shadow:
                                0 0 0 0 rgba(0,245,160,0);
                        }

                    }


                    @media (max-width: 1200px) {

                        .analysis-kpi-grid {
                            grid-template-columns:
                                repeat(2, minmax(0, 1fr));
                        }

                    }


                    @media (max-width: 850px) {

                        .analysis-system-grid {
                            grid-template-columns:
                                1fr;
                        }

                    }


                    @media (max-width: 650px) {

                        .analysis-kpi-grid {
                            grid-template-columns:
                                1fr;
                        }

                    }

                `}
      </style>
      {/* PART 3 - RESPONSIVE / INTERACTION / SYSTEM POLISH */}

      {/* ANALYSIS PAGE INTERACTION LAYER */}

      <section
        style={{
          marginTop: "18px",
          display: "grid",
          gridTemplateColumns: "1fr",
          gap: "14px"
        }}
        className="analysis-system-footer"
      >

        {/* =====================================================
        SYSTEM STATUS STRIP
    ===================================================== */}

        <div
          style={{
            ...styles.previewPanel,
            minHeight: "58px",
            padding: "0 16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "18px",
            position: "relative",
            overflow: "hidden"
          }}
        >

          {/* CYAN AMBIENT LINE */}

          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              bottom: 0,
              width: "2px",
              background:
                "linear-gradient(180deg, transparent, #00C6FF, transparent)",
              opacity: .8
            }}
          />

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "9px",
              minWidth: 0
            }}
          >

            <span
              style={{
                width: "7px",
                height: "7px",
                flexShrink: 0,
                borderRadius: "50%",
                background: loadingAnalytics
                  ? "#FBBF24"
                  : "#00F5A0",
                boxShadow: loadingAnalytics
                  ? "0 0 10px rgba(251,191,36,.6)"
                  : "0 0 10px rgba(0,245,160,.65)",
                animation:
                  "analysisStatusPulse 2s infinite"
              }}
            />

            <span
              style={{
                color: "#778596",
                fontSize: "8px",
                fontFamily: "monospace",
                fontWeight: 700,
                letterSpacing: ".7px",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis"
              }}
            >
              {loadingAnalytics
                ? "ANALYTICS ENGINE SYNCHRONIZING"
                : "ANALYTICS ENGINE OPERATIONAL"}
            </span>

          </div>


          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "14px",
              flexShrink: 0
            }}
          >

            <span
              style={{
                color: "#465566",
                fontSize: "7px",
                fontFamily: "monospace",
                letterSpacing: ".5px"
              }}
            >
              SUPABASE
            </span>

            <span
              style={{
                width: "5px",
                height: "5px",
                borderRadius: "50%",
                background: "#00F5A0",
                boxShadow:
                  "0 0 7px rgba(0,245,160,.5)"
              }}
            />

          </div>

        </div>


        {/* =====================================================
        EMPTY STATE
    ===================================================== */}

        {safeTxCount === 0 && !loadingAnalytics && (
          <section
            style={{
              ...styles.previewPanel,
              minHeight: "270px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              padding: "35px 20px",
              position: "relative",
              overflow: "hidden"
            }}
          >

            {/* EMPTY STATE RADIAL */}

            <div
              style={{
                position: "absolute",
                width: "280px",
                height: "280px",
                borderRadius: "50%",
                background:
                  "radial-gradient(circle, rgba(0,198,255,.055), transparent 68%)",
                pointerEvents: "none"
              }}
            />


            <div
              style={{
                position: "relative",
                zIndex: 2,
                maxWidth: "460px"
              }}
            >

              {/* ICON */}

              <div
                style={{
                  width: "58px",
                  height: "58px",
                  margin: "0 auto 18px",
                  borderRadius: "16px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background:
                    "linear-gradient(145deg, rgba(0,198,255,.09), rgba(0,245,160,.045))",
                  border:
                    "1px solid rgba(0,198,255,.15)",
                  color: "#00C6FF",
                  boxShadow:
                    "0 0 30px rgba(0,198,255,.06)"
                }}
              >
                <BarChart3 size={24} />
              </div>


              <div
                style={{
                  color: "#dce5ec",
                  fontSize: "14px",
                  fontWeight: 900,
                  fontFamily: "monospace",
                  letterSpacing: ".5px"
                }}
              >
                Analytics Awaiting Activity
              </div>


              <div
                style={{
                  marginTop: "9px",
                  color: "#596879",
                  fontSize: "10px",
                  lineHeight: 1.7
                }}
              >
                Once your connected inboxes begin receiving
                till slips, RuachAgent will populate this
                dashboard with transaction volume, revenue
                activity and business intelligence.
              </div>


              {/* EMPTY STATE SIGNAL */}

              <div
                style={{
                  marginTop: "18px",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "7px",
                  padding: "7px 11px",
                  borderRadius: "8px",
                  background:
                    "rgba(0,198,255,.035)",
                  border:
                    "1px solid rgba(0,198,255,.08)",
                  color: "#5c788b",
                  fontSize: "7px",
                  fontFamily: "monospace",
                  letterSpacing: ".6px"
                }}
              >

                <span
                  style={{
                    width: "5px",
                    height: "5px",
                    borderRadius: "50%",
                    background: "#00C6FF"
                  }}
                />

                WAITING FOR FIRST TRANSACTION

              </div>

            </div>

          </section>
        )}


        {/* =====================================================
        LOADING STATE
    ===================================================== */}

        {loadingAnalytics && (
          <section
            style={{
              ...styles.previewPanel,
              minHeight: "270px",
              padding: "28px",
              position: "relative",
              overflow: "hidden"
            }}
          >

            {/* SCANNING LINE */}

            <div
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                top: "0",
                height: "1px",
                background:
                  "linear-gradient(90deg, transparent, #00C6FF, transparent)",
                animation:
                  "analysisScanLine 2.2s linear infinite"
              }}
            />


            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
                minHeight: "210px"
              }}
            >

              {/* LOADER */}

              <div
                style={{
                  width: "46px",
                  height: "46px",
                  borderRadius: "50%",
                  border:
                    "1px solid rgba(0,198,255,.12)",
                  borderTopColor:
                    "#00C6FF",
                  borderRightColor:
                    "#00F5A0",
                  animation:
                    "analysisLoaderSpin 1s linear infinite",
                  boxShadow:
                    "0 0 25px rgba(0,198,255,.06)"
                }}
              />


              <div
                style={{
                  marginTop: "18px",
                  color: "#dce5ec",
                  fontSize: "10px",
                  fontWeight: 800,
                  fontFamily: "monospace",
                  letterSpacing: "1px"
                }}
              >
                SYNCHRONIZING ANALYTICS
              </div>


              <div
                style={{
                  marginTop: "7px",
                  color: "#4f6072",
                  fontSize: "8px",
                  fontFamily: "monospace"
                }}
              >
                Reading merchant intelligence matrix...
              </div>


              {/* LOADING BLOCKS */}

              <div
                style={{
                  marginTop: "20px",
                  display: "flex",
                  gap: "5px"
                }}
              >

                {Array.from({
                  length: 5
                }).map((_, index) => (

                  <div
                    key={index}
                    style={{
                      width: "24px",
                      height: "3px",
                      borderRadius: "999px",
                      background:
                        index === 0
                          ? "#00C6FF"
                          : "rgba(255,255,255,.06)",
                      animation:
                        "analysisLoadingBlock 1.2s infinite",
                      animationDelay:
                        `${index * .12}s`
                    }}
                  />

                ))}

              </div>

            </div>

          </section>
        )}


        {/* =====================================================
        ACTIVE ANALYTICS SIGNAL
    ===================================================== */}

        {safeTxCount > 0 && !loadingAnalytics && (
          <section
            style={{
              ...styles.previewPanel,
              padding: "14px 16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "15px",
              minHeight: "48px"
            }}
          >

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "9px"
              }}
            >

              <div
                style={{
                  position: "relative",
                  width: "8px",
                  height: "8px"
                }}
              >

                <span
                  style={{
                    position: "absolute",
                    inset: 0,
                    borderRadius: "50%",
                    background: "#00F5A0",
                    boxShadow:
                      "0 0 9px rgba(0,245,160,.7)"
                  }}
                />

                <span
                  style={{
                    position: "absolute",
                    inset: "-4px",
                    borderRadius: "50%",
                    border:
                      "1px solid rgba(0,245,160,.18)",
                    animation:
                      "analysisRipple 2s infinite"
                  }}
                />

              </div>


              <span
                style={{
                  color: "#718091",
                  fontSize: "8px",
                  fontFamily: "monospace",
                  letterSpacing: ".6px"
                }}
              >
                LIVE MERCHANT ACTIVITY DETECTED
              </span>

            </div>


            <span
              style={{
                color: "#3f5365",
                fontSize: "7px",
                fontFamily: "monospace",
                whiteSpace: "nowrap"
              }}
            >
              {safeTxCount.toLocaleString()} TRANSACTIONS
            </span>

          </section>
        )}

      </section>


      {/* =========================================================
    PART 3 — PAGE-LEVEL RESPONSIVE / ANIMATION CSS
========================================================= */}

      <style>
        {`

        /* =====================================================
           GLOBAL ANALYSIS MOTION
        ===================================================== */

        @keyframes analysisStatusPulse {

            0% {
                opacity: 1;
                transform: scale(1);
            }

            50% {
                opacity: .45;
                transform: scale(.75);
            }

            100% {
                opacity: 1;
                transform: scale(1);
            }

        }


        @keyframes analysisLoaderSpin {

            from {
                transform: rotate(0deg);
            }

            to {
                transform: rotate(360deg);
            }

        }


        @keyframes analysisScanLine {

            0% {
                transform: translateY(0);
                opacity: 0;
            }

            15% {
                opacity: 1;
            }

            85% {
                opacity: 1;
            }

            100% {
                transform: translateY(270px);
                opacity: 0;
            }

        }


        @keyframes analysisLoadingBlock {

            0% {
                opacity: .25;
                transform: scaleX(.7);
            }

            50% {
                opacity: 1;
                transform: scaleX(1);
            }

            100% {
                opacity: .25;
                transform: scaleX(.7);
            }

        }


        @keyframes analysisRipple {

            0% {
                transform: scale(.65);
                opacity: .8;
            }

            100% {
                transform: scale(1.8);
                opacity: 0;
            }

        }


        /* =====================================================
           DESKTOP CARD HOVER
        ===================================================== */

        .analysis-intelligence-grid > div,
        .analysis-revenue-layout > section,
        .analysis-system-footer > section {

            will-change: transform;

        }


        .analysis-intelligence-grid > div:hover {

            box-shadow:
                0 12px 35px rgba(0,0,0,.22),
                0 0 24px rgba(0,198,255,.025);

        }


        /* =====================================================
           TABLET
        ===================================================== */

        @media (max-width: 1050px) {

            .analysis-revenue-layout {

                grid-template-columns:
                    1fr !important;

            }


            .analysis-intelligence-grid {

                grid-template-columns:
                    repeat(2, minmax(0, 1fr)) !important;

            }

        }


        /* =====================================================
           MOBILE
        ===================================================== */

        @media (max-width: 720px) {

            .analysis-revenue-layout {

                grid-template-columns:
                    1fr !important;

                gap: 12px !important;

            }


            .analysis-intelligence-grid {

                grid-template-columns:
                    1fr !important;

                gap: 12px !important;

            }


            .analysis-system-footer {

                gap: 12px !important;

            }

        }


        @media (max-width: 520px) {

            .analysis-revenue-layout section {

                padding: 16px !important;

            }


            .analysis-intelligence-grid > div {

                min-height: 160px !important;

                padding: 16px !important;

            }


            .analysis-system-footer > section {

                padding-left: 13px !important;

                padding-right: 13px !important;

            }


            .analysis-system-footer
            > section:first-child {

                min-height: 52px !important;

            }


            /* GRAPH */

            .analysis-revenue-layout
            section:first-child {

                overflow: hidden;

            }


            .analysis-revenue-layout
            section:first-child
            > div:nth-child(2) {

                height: 205px !important;

            }


            /* REVENUE VALUE */

            .analysis-revenue-layout
            section:nth-child(2) {

                min-height: auto !important;

            }

        }


        /* =====================================================
           VERY SMALL DEVICES
        ===================================================== */

        @media (max-width: 380px) {

            .analysis-system-footer
            span {

                font-size: 7px !important;

            }


            .analysis-revenue-layout
            section:first-child {

                padding: 14px !important;

            }


            .analysis-intelligence-grid > div {

                padding: 14px !important;

            }

        }


        /* =====================================================
           REDUCED MOTION
        ===================================================== */

        @media (prefers-reduced-motion: reduce) {

            *,
            *::before,
            *::after {

                animation-duration:
                    0.01ms !important;

                animation-iteration-count:
                    1 !important;

                transition-duration:
                    0.01ms !important;

            }

        }

    `}
      </style>

    </div >
  );
}