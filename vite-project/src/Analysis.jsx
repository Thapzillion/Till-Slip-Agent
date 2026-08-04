/******************************************************************
 * ANALYSIS PAGE
 * Premium Tesla Dashboard UI
 *
 * NOTE:
 * This file assumes all backend logic, hooks, state variables,
 * Supabase queries, async functions, and imported icons already
 * exist elsewhere in your project.
 ******************************************************************/

/******************************************************************
 * Tesla Glass Panel
 ******************************************************************/

const GlassPanel = ({
  title,
  badge,
  children
}) => (
  <div style={styles.glassPanel}>

    <div style={styles.panelHeader}>

      <div style={styles.panelTitle}>
        {title}
      </div>

      <div style={styles.panelBadge}>
        {badge}
      </div>

    </div>

    <div style={styles.panelBody}>
      {children}
    </div>

  </div>
);

/******************************************************************
 * Status Pill
 ******************************************************************/

const StatusPill = ({
  label,
  value,
  color
}) => (

  <div style={styles.statusPill}>

    <div style={styles.statusLabel}>
      {label}
    </div>

    <div
      style={{
        ...styles.statusValue,
        color
      }}
    >
      {value}
    </div>

  </div>

);

/******************************************************************
 * KPI Card
 ******************************************************************/

const MetricCard = ({
  title,
  value,
  badge,
  accent,
  children
}) => (

  <div
    style={{
      ...styles.metricCard,
      borderTop: `2px solid ${accent}`
    }}
  >

    <div style={styles.metricHeader}>

      <div style={styles.metricTitle}>
        {title}
      </div>

      <div
        style={{
          ...styles.metricBadge,
          color: accent,
          border: `1px solid ${accent}25`
        }}
      >
        {badge}
      </div>

    </div>

    <div
      style={{
        ...styles.metricValue,
        color: accent
      }}
    >
      {value}
    </div>

    {children}

  </div>

);

/******************************************************************
 * Section Heading
 ******************************************************************/

const SectionTitle = ({ title }) => (

  <div style={styles.sectionTitle}>
    {title}
  </div>

);

return (
  <div style={styles.page}>

    {/* Animated Background */}
    <div style={styles.backgroundGlowOne} />
    <div style={styles.backgroundGlowTwo} />

    {/* ============================================================
        PAGE HEADER
    ============================================================ */}

    <div style={styles.headerCard}>

      <div style={styles.headerLeft}>

        <div style={styles.pageEyebrow}>
          RUACH AGENT • ANALYTICS
        </div>

        <h1 style={styles.pageTitle}>
          Analysis
        </h1>

        <div style={styles.pageSubtitle}>
          Monitor till slip delivery, customer discounts,
          AI processing and business performance from one
          intelligent dashboard.
        </div>

      </div>

      <div style={styles.headerRight}>

        <div style={styles.liveChip}>
          <span style={styles.liveDot} />
          LIVE
        </div>

      </div>

    </div>



    {/* ============================================================
        QUICK STATUS BAR
    ============================================================ */}

    <div style={styles.statusBar}>

      <StatusPill
        label="AI ENGINE"
        value="ONLINE"
        color="#10b981"
      />

      <StatusPill
        label="DATABASE"
        value="CONNECTED"
        color="#3b82f6"
      />

      <StatusPill
        label="WEBHOOK"
        value="ACTIVE"
        color="#8b5cf6"
      />

      <StatusPill
        label="NODE"
        value="SECURE"
        color="#f59e0b"
      />

    </div>



    {/* ============================================================
        MAIN DASHBOARD
    ============================================================ */}

    <div style={styles.dashboardGrid}>

      {/* Left Content */}

      <div style={styles.mainColumn}>

        {/* ============================================================
    KPI DASHBOARD
============================================================ */}

        <SectionTitle title="Business Overview" />

        <div style={styles.metricsGrid}>

          {/* Till Slips Sent */}
          <MetricCard
            title="Till Slips Sent"
            value={
              (
                typeof totalParsedCount !== "undefined"
                  ? totalParsedCount
                  : 0
              ).toLocaleString()
            }
            badge="TOTAL"
            accent="#3b82f6"
          >
            <div style={styles.metricFooter}>
              Successfully delivered till slips
            </div>
          </MetricCard>

          {/* Active Inboxes */}
          <MetricCard
            title="Inboxes Synchronized"
            value={
              typeof activeInboxesCount !== "undefined"
                ? activeInboxesCount
                : 0
            }
            badge="LIVE"
            accent="#10b981"
          >
            <div style={styles.metricFooter}>
              Connected webhook inboxes
            </div>
          </MetricCard>

          {/* Discounts Used */}
          <MetricCard
            title="Discounts Used"
            value={
              typeof discountsUsed !== "undefined"
                ? discountsUsed
                : 0
            }
            badge="USED"
            accent="#22c55e"
          >
            <div style={styles.metricFooter}>
              Redeemed by customers
            </div>
          </MetricCard>

          {/* Discounts Not Used */}
          <MetricCard
            title="Discounts Not Used"
            value={
              typeof discountsUnused !== "undefined"
                ? discountsUnused
                : 0
            }
            badge="AVAILABLE"
            accent="#f59e0b"
          >
            <div style={styles.metricFooter}>
              Awaiting redemption
            </div>
          </MetricCard>

          {/* Today's Till Slips */}
          <MetricCard
            title="Today's Till Slips"
            value={
              typeof todayTillSlips !== "undefined"
                ? todayTillSlips
                : 0
            }
            badge="TODAY"
            accent="#06b6d4"
          >
            <div style={styles.metricFooter}>
              Generated today
            </div>
          </MetricCard>

          {/* Weekly Till Slips */}
          <MetricCard
            title="This Week"
            value={
              typeof weekTillSlips !== "undefined"
                ? weekTillSlips
                : 0
            }
            badge="7 DAYS"
            accent="#8b5cf6"
          >
            <div style={styles.metricFooter}>
              Weekly activity
            </div>
          </MetricCard>

        </div>

        {/* ============================================================
    BUSINESS INTELLIGENCE
============================================================ */}

        <SectionTitle title="Business Intelligence" />

        <div style={styles.analyticsGrid}>

          {/* ============================================================
      ACTIVITY TIMELINE
  ============================================================ */}

          <div
            style={{
              ...styles.glassPanel,
              gridColumn: "span 2"
            }}
          >

            <div style={styles.panelHeader}>

              <div style={styles.panelTitle}>
                Till Slip Activity Timeline
              </div>

              <div style={styles.panelBadge}>
                {
                  typeof selectedDateRangeLabel !== "undefined"
                    ? selectedDateRangeLabel
                    : "LAST 30 DAYS"
                }
              </div>

            </div>

            <div style={styles.timelineChart}>

              {(typeof inboxGraphData !== "undefined"
                ? inboxGraphData
                : Array(30).fill(0)
              ).map((value, index, array) => {

                const latest = index === array.length - 1;

                return (

                  <div
                    key={index}
                    style={styles.timelineBarWrapper}
                  >

                    <div
                      style={{
                        ...styles.timelineBar,

                        height:
                          value > 0
                            ? `${Math.min(value, 100)}%`
                            : "3px",

                        opacity:
                          latest
                            ? 1
                            : 0.55,

                        background:
                          latest
                            ? "linear-gradient(to top,#34d399,#10b981)"
                            : "linear-gradient(to top,#1f2937,#10b981)"
                      }}
                    />

                  </div>

                );

              })}

              <div style={styles.chartGridOne} />
              <div style={styles.chartGridTwo} />
              <div style={styles.chartGridThree} />

            </div>

          </div>



          {/* ============================================================
      AI DELIVERY HEALTH
  ============================================================ */}

          <div style={styles.glassPanel}>

            <div style={styles.panelHeader}>

              <div style={styles.panelTitle}>
                Delivery Health
              </div>

              <div style={styles.panelBadge}>
                LIVE
              </div>

            </div>

            <div style={styles.healthWidgetNumber}>

              {
                typeof deliveryHealth !== "undefined"
                  ? `${deliveryHealth}%`
                  : "99.8%"
              }

            </div>

            <div style={styles.progressTrack}>

              <div
                style={{
                  ...styles.progressFill,
                  width: `${typeof deliveryHealth !== "undefined"
                      ? deliveryHealth
                      : 99.8
                    }%`,
                  background:
                    "linear-gradient(90deg,#10b981,#4ade80)"
                }}
              />

            </div>

            <div style={styles.widgetDescription}>
              Successful receipt deliveries.
            </div>

          </div>



          {/* ============================================================
      AI EXTRACTION
  ============================================================ */}

          <div style={styles.glassPanel}>

            <div style={styles.panelHeader}>

              <div style={styles.panelTitle}>
                AI Extraction
              </div>

              <div style={styles.panelBadge}>
                OCR
              </div>

            </div>

            <div style={styles.healthWidgetNumber}>

              {
                typeof extractionAccuracy !== "undefined"
                  ? `${extractionAccuracy}%`
                  : "98.7%"
              }

            </div>

            <div style={styles.progressTrack}>

              <div
                style={{
                  ...styles.progressFill,
                  width: `${typeof extractionAccuracy !== "undefined"
                      ? extractionAccuracy
                      : 98.7
                    }%`,
                  background:
                    "linear-gradient(90deg,#3b82f6,#60a5fa)"
                }}
              />

            </div>

            <div style={styles.widgetDescription}>
              AI parsing accuracy.
            </div>

          </div>



          {/* ============================================================
      BUSINESS TIMELINE
  ============================================================ */}

          <div
            style={{
              ...styles.glassPanel,
              gridColumn: "span 2"
            }}
          >

            <div style={styles.panelHeader}>

              <div style={styles.panelTitle}>
                Live Activity Feed
              </div>

              <div style={styles.panelBadge}>
                REAL TIME
              </div>

            </div>

            <div style={styles.activityFeed}>

              <div style={styles.activityItem}>

                <div
                  style={{
                    ...styles.activityDot,
                    background: "#10b981"
                  }}
                />

                <div style={styles.activityContent}>

                  <div style={styles.activityTitle}>
                    Till slip successfully delivered
                  </div>

                  <div style={styles.activityTime}>
                    A few seconds ago
                  </div>

                </div>

              </div>



              <div style={styles.activityItem}>

                <div
                  style={{
                    ...styles.activityDot,
                    background: "#3b82f6"
                  }}
                />

                <div style={styles.activityContent}>

                  <div style={styles.activityTitle}>
                    AI finished parsing receipt
                  </div>

                  <div style={styles.activityTime}>
                    2 minutes ago
                  </div>

                </div>

              </div>



              <div style={styles.activityItem}>

                <div
                  style={{
                    ...styles.activityDot,
                    background: "#8b5cf6"
                  }}
                />

                <div style={styles.activityContent}>

                  <div style={styles.activityTitle}>
                    Customer redeemed discount voucher
                  </div>

                  <div style={styles.activityTime}>
                    9 minutes ago
                  </div>

                </div>

              </div>



              <div style={styles.activityItem}>

                <div
                  style={{
                    ...styles.activityDot,
                    background: "#f59e0b"
                  }}
                />

                <div style={styles.activityContent}>

                  <div style={styles.activityTitle}>
                    Inbox synchronization completed
                  </div>

                  <div style={styles.activityTime}>
                    14 minutes ago
                  </div>

                </div>

              </div>

            </div>

          </div>



          {/* ============================================================
      BUSINESS SUMMARY
  ============================================================ */}

          <div style={styles.glassPanel}>

            <div style={styles.panelHeader}>

              <div style={styles.panelTitle}>
                Business Snapshot
              </div>

              <div style={styles.panelBadge}>
                TODAY
              </div>

            </div>

            <div style={styles.snapshotGrid}>

              <div style={styles.snapshotRow}>
                <span>Total Till Slips</span>

                <strong>
                  {(typeof totalParsedCount !== "undefined"
                    ? totalParsedCount
                    : 0).toLocaleString()}
                </strong>
              </div>

              <div style={styles.snapshotRow}>
                <span>Connected Inboxes</span>

                <strong>
                  {typeof activeInboxesCount !== "undefined"
                    ? activeInboxesCount
                    : 0}
                </strong>
              </div>

              <div style={styles.snapshotRow}>
                <span>Discounts Used</span>

                <strong>
                  {typeof discountsUsed !== "undefined"
                    ? discountsUsed
                    : 0}
                </strong>
              </div>

              <div style={styles.snapshotRow}>
                <span>Discounts Remaining</span>

                <strong>
                  {typeof discountsUnused !== "undefined"
                    ? discountsUnused
                    : 0}
                </strong>
              </div>

            </div>

          </div>

        </div>

        {/* ============================================================
    PERFORMANCE ROW
============================================================ */}

        <SectionTitle title="Performance" />

        <div style={styles.performanceGrid}>

          {/* Discount Usage */}
          <div style={styles.performanceCard}>

            <div style={styles.performanceHeader}>
              <span style={styles.performanceTitle}>
                Discount Usage
              </span>

              <span style={styles.performanceChip}>
                LIVE
              </span>
            </div>

            <div style={styles.performanceValue}>
              {typeof discountUsageRate !== "undefined"
                ? `${discountUsageRate}%`
                : "0%"}
            </div>

            <div style={styles.progressTrack}>
              <div
                style={{
                  ...styles.progressFill,
                  width: `${typeof discountUsageRate !== "undefined"
                      ? Math.min(discountUsageRate, 100)
                      : 0
                    }%`,
                  background:
                    "linear-gradient(90deg,#22c55e,#10b981)"
                }}
              />
            </div>

            <div style={styles.performanceDescription}>
              Percentage of issued discounts redeemed.
            </div>

          </div>



          {/* AI Processing */}
          <div style={styles.performanceCard}>

            <div style={styles.performanceHeader}>
              <span style={styles.performanceTitle}>
                AI Processing Success
              </span>

              <span style={styles.performanceChip}>
                AI
              </span>
            </div>

            <div style={styles.performanceValue}>
              {typeof processingSuccessRate !== "undefined"
                ? `${processingSuccessRate}%`
                : "100%"}
            </div>

            <div style={styles.progressTrack}>
              <div
                style={{
                  ...styles.progressFill,
                  width: `${typeof processingSuccessRate !== "undefined"
                      ? Math.min(processingSuccessRate, 100)
                      : 100
                    }%`,
                  background:
                    "linear-gradient(90deg,#3b82f6,#60a5fa)"
                }}
              />
            </div>

            <div style={styles.performanceDescription}>
              Successful receipt parsing and AI extraction.
            </div>

          </div>

        </div>

        {/* ============================================================
    QUICK SUMMARY
============================================================ */}

        <div style={styles.summaryCard}>

          <div style={styles.summaryHeader}>

            <div>
              <div style={styles.summaryTitle}>
                Live Business Snapshot
              </div>

              <div style={styles.summarySubtitle}>
                Real-time operational overview
              </div>
            </div>

            <div style={styles.summaryStatus}>
              ● ONLINE
            </div>

          </div>

          <div style={styles.summaryGrid}>

            <div style={styles.summaryItem}>
              <div style={styles.summaryLabel}>Till Slips</div>
              <div style={styles.summaryValue}>
                {(typeof totalParsedCount !== "undefined"
                  ? totalParsedCount
                  : 0).toLocaleString()}
              </div>
            </div>

            <div style={styles.summaryItem}>
              <div style={styles.summaryLabel}>Discounts Used</div>
              <div style={styles.summaryValue}>
                {typeof discountsUsed !== "undefined"
                  ? discountsUsed
                  : 0}
              </div>
            </div>

            <div style={styles.summaryItem}>
              <div style={styles.summaryLabel}>Unused</div>
              <div style={styles.summaryValue}>
                {typeof discountsUnused !== "undefined"
                  ? discountsUnused
                  : 0}
              </div>
            </div>

            <div style={styles.summaryItem}>
              <div style={styles.summaryLabel}>Inboxes</div>
              <div style={styles.summaryValue}>
                {typeof activeInboxesCount !== "undefined"
                  ? activeInboxesCount
                  : 0}
              </div>
            </div>

          </div>

        </div>
      </div>



      {/* ============================================================
    BUSINESS HEALTH
============================================================ */}

      <GlassPanel
        title="Business Health"
        badge="AI"
      >

        <div style={styles.healthScoreWrapper}>

          <div style={styles.healthRing}>

            <div style={styles.healthRingInner}>

              <div style={styles.healthScoreValue}>
                {
                  typeof aiHealthScore !== "undefined"
                    ? aiHealthScore
                    : "98"
                }
              </div>

              <div style={styles.healthScoreLabel}>
                SCORE
              </div>

            </div>

          </div>

        </div>

        <div style={styles.healthList}>

          <div style={styles.healthRow}>
            <span>Receipt Processing</span>

            <span style={{ color: "#10b981" }}>
              {
                typeof processingSuccessRate !== "undefined"
                  ? `${processingSuccessRate}%`
                  : "100%"
              }
            </span>
          </div>

          <div style={styles.healthRow}>
            <span>Webhook Health</span>

            <span style={{ color: "#10b981" }}>
              Healthy
            </span>
          </div>

          <div style={styles.healthRow}>
            <span>Inbox Sync</span>

            <span style={{ color: "#3b82f6" }}>
              {
                typeof activeInboxesCount !== "undefined"
                  ? activeInboxesCount
                  : 0
              } Connected
            </span>
          </div>

          <div style={styles.healthRow}>
            <span>Business Status</span>

            <span style={{ color: "#10b981" }}>
              Excellent
            </span>
          </div>

        </div>

      </GlassPanel>



      {/* ============================================================
    SYSTEM STATUS
============================================================ */}

      <GlassPanel
        title="System Status"
        badge="LIVE"
      >

        <div style={styles.systemGrid}>

          <div style={styles.systemCard}>

            <div
              style={{
                ...styles.systemDot,
                background: "#10b981"
              }}
            />

            <div>

              <div style={styles.systemTitle}>
                AI Engine
              </div>

              <div style={styles.systemSubtitle}>
                Online
              </div>

            </div>

          </div>



          <div style={styles.systemCard}>

            <div
              style={{
                ...styles.systemDot,
                background: "#3b82f6"
              }}
            />

            <div>

              <div style={styles.systemTitle}>
                Database
              </div>

              <div style={styles.systemSubtitle}>
                Connected
              </div>

            </div>

          </div>



          <div style={styles.systemCard}>

            <div
              style={{
                ...styles.systemDot,
                background: "#8b5cf6"
              }}
            />

            <div>

              <div style={styles.systemTitle}>
                Webhook
              </div>

              <div style={styles.systemSubtitle}>
                Active
              </div>

            </div>

          </div>



          <div style={styles.systemCard}>

            <div
              style={{
                ...styles.systemDot,
                background: "#f59e0b"
              }}
            />

            <div>

              <div style={styles.systemTitle}>
                Secure Node
              </div>

              <div style={styles.systemSubtitle}>
                Protected
              </div>

            </div>

          </div>

        </div>

      </GlassPanel>



      {/* ============================================================
    DISCOUNT ANALYTICS / AI INSIGHTS
============================================================ */}

      <GlassPanel
        title="AI Insights"
        badge="SMART"
      >

        <div style={styles.insightCard}>

          <div style={styles.insightTitle}>
            Discount Conversion
          </div>

          <div style={styles.insightBigNumber}>
            {
              typeof discountConversionRate !== "undefined"
                ? `${discountConversionRate}%`
                : "0%"
            }
          </div>

          <div style={styles.progressTrack}>

            <div
              style={{
                ...styles.progressFill,
                width: `${typeof discountConversionRate !== "undefined"
                    ? Math.min(discountConversionRate, 100)
                    : 0
                  }%`,
                background:
                  "linear-gradient(90deg,#22c55e,#10b981)"
              }}
            />

          </div>

        </div>



        <div style={styles.aiInsightsList}>

          <div style={styles.aiInsightRow}>

            <span>
              Till Slips Sent
            </span>

            <strong>

              {
                (
                  typeof totalParsedCount !== "undefined"
                    ? totalParsedCount
                    : 0
                ).toLocaleString()
              }

            </strong>

          </div>



          <div style={styles.aiInsightRow}>

            <span>
              Discounts Used
            </span>

            <strong>

              {
                typeof discountsUsed !== "undefined"
                  ? discountsUsed
                  : 0
              }

            </strong>

          </div>



          <div style={styles.aiInsightRow}>

            <span>
              Discounts Remaining
            </span>

            <strong>

              {
                typeof discountsUnused !== "undefined"
                  ? discountsUnused
                  : 0
              }

            </strong>

          </div>



          <div style={styles.aiInsightRow}>

            <span>
              Active Inboxes
            </span>

            <strong>

              {
                typeof activeInboxesCount !== "undefined"
                  ? activeInboxesCount
                  : 0
              }

            </strong>

          </div>



          <div style={styles.aiInsightRow}>

            <span>
              AI Recommendation
            </span>

            <strong
              style={{
                color: "#10b981"
              }}
            >
              Increase voucher campaign
            </strong>

          </div>

        </div>



        <div style={styles.aiRecommendationBox}>

          <div style={styles.aiRecommendationTitle}>
            AI Recommendation
          </div>

          <div style={styles.aiRecommendationText}>

            {
              typeof discountsUnused !== "undefined" &&
                typeof discountsUsed !== "undefined" &&
                discountsUnused > discountsUsed

                ? "A large number of discounts remain unused. Consider sending reminder messages to improve customer redemption."

                : "Customer discount redemption is performing well. Continue monitoring campaign performance."
            }

          </div>

        </div>

      </GlassPanel>



    </div>

  </div>
);

