import React from "react";

export default function AgentParameters({
  settings,
  setSettings,
  handleSave,
  isSaveSyncing,
  pendingLogoFile,
  setPendingLogoFile,
  CURRENCY_OPTIONS,
}) {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#050505",
        color: "#ffffff",
        padding: "34px",
        fontFamily:
          'Inter, "SF Pro Display", "Segoe UI", sans-serif',
      }}
    >
      {/* Background Glow */}
      <div
        style={{
          position: "fixed",
          top: -220,
          right: -180,
          width: 520,
          height: 520,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(255,255,255,0.05), transparent 70%)",
          pointerEvents: "none",
          filter: "blur(40px)",
        }}
      />

      <div
        style={{
          position: "fixed",
          bottom: -200,
          left: -150,
          width: 450,
          height: 450,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(255,255,255,0.03), transparent 70%)",
          pointerEvents: "none",
          filter: "blur(60px)",
        }}
      />

      {/* Main Container */}
      <div
        style={{
          maxWidth: 1650,
          margin: "0 auto",
          position: "relative",
          zIndex: 2,
        }}
      >
        {/* Top Navigation */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 34,
          }}
        >
          <div>
            <div
              style={{
                fontSize: 13,
                color: "#7d7d7d",
                letterSpacing: 2,
                textTransform: "uppercase",
                fontWeight: 600,
                marginBottom: 8,
              }}
            >
              RuachAgent AI
            </div>

            <h1
              style={{
                margin: 0,
                fontSize: 38,
                fontWeight: 700,
                letterSpacing: "-1px",
              }}
            >
              Agent Parameters
            </h1>

            <p
              style={{
                marginTop: 12,
                marginBottom: 0,
                color: "#8d8d8d",
                fontSize: 15,
                maxWidth: 700,
                lineHeight: 1.8,
              }}
            >
              Configure your business identity, AI behaviour,
              receipt branding and intelligent automation from
              one centralized dashboard.
            </p>
          </div>

          {/* Status Badge */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              background: "#0e0e0e",
              border: "1px solid #232323",
              borderRadius: 18,
              padding: "14px 18px",
              boxShadow:
                "0 12px 35px rgba(0,0,0,.45)",
            }}
          >
            <div
              style={{
                width: 11,
                height: 11,
                borderRadius: "50%",
                background: "#2fd66b",
                boxShadow:
                  "0 0 15px rgba(47,214,107,.55)",
              }}
            />

            <div>
              <div
                style={{
                  fontSize: 12,
                  color: "#888",
                  marginBottom: 2,
                }}
              >
                System Status
              </div>

              <div
                style={{
                  fontSize: 15,
                  fontWeight: 600,
                }}
              >
                Online & Synced
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Section */}
        <div
          style={{
            background: "#090909",
            border: "1px solid #181818",
            borderRadius: 26,
            padding: 34,
            boxShadow:
              "0 25px 70px rgba(0,0,0,.45)",
          }}
        >
          {/* Dashboard Header */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 30,
              borderBottom: "1px solid #191919",
              paddingBottom: 24,
            }}
          >
            <div>
              <h2
                style={{
                  margin: 0,
                  fontSize: 24,
                  fontWeight: 600,
                }}
              >
                Business Configuration
              </h2>

              <div
                style={{
                  marginTop: 8,
                  color: "#777",
                  fontSize: 14,
                }}
              >
                Manage your business identity and AI settings.
              </div>
            </div>

            <div
              style={{
                display: "flex",
                gap: 12,
              }}
            >
              <button
                style={{
                  background: "#131313",
                  color: "#fff",
                  border: "1px solid #262626",
                  borderRadius: 14,
                  padding: "12px 20px",
                  cursor: "pointer",
                  fontWeight: 600,
                }}
              >
                Restore Defaults
              </button>

              <button
                style={{
                  background: "#ffffff",
                  color: "#000",
                  border: "none",
                  borderRadius: 14,
                  padding: "12px 22px",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                Save Changes
              </button>
            </div>
          </div>

          {/* ======================================================
    TESLA METRICS ROW
====================================================== */}

<div
  style={{
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "20px",
    marginBottom: "34px",
  }}
>

  {/* Currency */}

  <div
    style={{
      background: "linear-gradient(180deg,#121212,#0a0a0a)",
      border: "1px solid #222",
      borderRadius: "20px",
      padding: "22px",
      position: "relative",
      overflow: "hidden",
      transition: ".25s",
      cursor: "default",
    }}
  >

    <div
      style={{
        position: "absolute",
        top: -40,
        right: -40,
        width: 120,
        height: 120,
        borderRadius: "50%",
        background:
          "radial-gradient(circle,rgba(255,255,255,.05),transparent 70%)",
      }}
    />

    <div
      style={{
        fontSize: 11,
        color: "#7c7c7c",
        textTransform: "uppercase",
        letterSpacing: "2px",
        marginBottom: 14,
      }}
    >
      Operational Currency
    </div>

    <div
      style={{
        fontSize: 34,
        fontWeight: 700,
        letterSpacing: "-1px",
      }}
    >
      {settings?.currency || "ZAR"}
    </div>

    <div
      style={{
        marginTop: 16,
        color: "#30d158",
        fontSize: 13,
        fontWeight: 600,
      }}
    >
      ✓ Active
    </div>

  </div>

  {/* Discount */}

  <div
    style={{
      background: "linear-gradient(180deg,#121212,#0a0a0a)",
      border: "1px solid #222",
      borderRadius: "20px",
      padding: "22px",
      position: "relative",
      overflow: "hidden",
    }}
  >

    <div
      style={{
        position: "absolute",
        top: -40,
        right: -40,
        width: 120,
        height: 120,
        borderRadius: "50%",
        background:
          "radial-gradient(circle,rgba(255,255,255,.05),transparent 70%)",
      }}
    />

    <div
      style={{
        fontSize: 11,
        color: "#7c7c7c",
        textTransform: "uppercase",
        letterSpacing: "2px",
        marginBottom: 14,
      }}
    >
      AI Discount
    </div>

    <div
      style={{
        fontSize: 34,
        fontWeight: 700,
      }}
    >
      {settings?.discount_percentage ?? 10}%
    </div>

    <div
      style={{
        marginTop: 16,
        color: "#ffffff",
        opacity: .55,
        fontSize: 13,
      }}
    >
      Automatic Rewards
    </div>

  </div>

  {/* Voucher */}

  <div
    style={{
      background: "linear-gradient(180deg,#121212,#0a0a0a)",
      border: "1px solid #222",
      borderRadius: "20px",
      padding: "22px",
      position: "relative",
      overflow: "hidden",
    }}
  >

    <div
      style={{
        position: "absolute",
        top: -40,
        right: -40,
        width: 120,
        height: 120,
        borderRadius: "50%",
        background:
          "radial-gradient(circle,rgba(255,255,255,.05),transparent 70%)",
      }}
    />

    <div
      style={{
        fontSize: 11,
        color: "#7c7c7c",
        textTransform: "uppercase",
        letterSpacing: "2px",
        marginBottom: 14,
      }}
    >
      Voucher Expiry
    </div>

    <div
      style={{
        fontSize: 34,
        fontWeight: 700,
      }}
    >
      {settings?.voucher_expiration_days ?? 30}
    </div>

    <div
      style={{
        marginTop: 16,
        color: "#ffffff",
        opacity: .55,
        fontSize: 13,
      }}
    >
      Days Until Expiration
    </div>

  </div>

  {/* Webhook */}

  <div
    style={{
      background: "linear-gradient(180deg,#121212,#0a0a0a)",
      border: "1px solid #222",
      borderRadius: "20px",
      padding: "22px",
      position: "relative",
      overflow: "hidden",
    }}
  >

    <div
      style={{
        position: "absolute",
        top: -40,
        right: -40,
        width: 120,
        height: 120,
        borderRadius: "50%",
        background:
          "radial-gradient(circle,rgba(255,255,255,.05),transparent 70%)",
      }}
    />

    <div
      style={{
        fontSize: 11,
        color: "#7c7c7c",
        textTransform: "uppercase",
        letterSpacing: "2px",
        marginBottom: 14,
      }}
    >
      Webhook Status
    </div>

    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
      }}
    >
      <div
        style={{
          width: 12,
          height: 12,
          borderRadius: "50%",
          background:
            settings?.webhook_slug
              ? "#30d158"
              : "#ff453a",
          boxShadow:
            settings?.webhook_slug
              ? "0 0 12px #30d158"
              : "0 0 12px #ff453a",
        }}
      />

      <div
        style={{
          fontSize: 28,
          fontWeight: 700,
        }}
      >
        {settings?.webhook_slug
          ? "Connected"
          : "Offline"}
      </div>
    </div>

    <div
      style={{
        marginTop: 16,
        color: "#8b8b8b",
        fontSize: 13,
        overflow: "hidden",
        whiteSpace: "nowrap",
        textOverflow: "ellipsis",
      }}
    >
      {settings?.webhook_slug
        ? `/api/${settings.webhook_slug}`
        : "No webhook configured"}
    </div>

  </div>

</div>

{/* ======================================================
    MAIN DASHBOARD GRID
====================================================== */}

<div
  style={{
    display: "grid",
    gridTemplateColumns: "1.45fr 0.95fr",
    gap: "28px",
    alignItems: "start",
  }}
>

  {/* ======================================================
      LEFT SIDE
      Business Identity + AI Configuration
  ====================================================== */}

  <div
    style={{
      display: "flex",
      flexDirection: "column",
      gap: "24px",
      minWidth: 0,
    }}
  >

    {/* ======================================================
        BUSINESS IDENTITY CARD
    ====================================================== */}

    <div
      style={{
        position: "relative",
        background: "linear-gradient(180deg,#111111,#090909)",
        border: "1px solid #222",
        borderRadius: "24px",
        padding: "28px",
        overflow: "hidden",
        boxShadow: "0 20px 50px rgba(0,0,0,.28)",
      }}
    >

      {/* Soft Tesla Glow */}

      <div
        style={{
          position: "absolute",
          top: -90,
          right: -90,
          width: 220,
          height: 220,
          borderRadius: "50%",
          background:
            "radial-gradient(circle,rgba(255,255,255,.04),transparent 72%)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "28px",
        }}
      >

        <div>

          <div
            style={{
              fontSize: 12,
              letterSpacing: "2px",
              color: "#7c7c7c",
              textTransform: "uppercase",
              marginBottom: 8,
            }}
          >
            Business Identity
          </div>

          <div
            style={{
              fontSize: 24,
              fontWeight: 700,
              color: "#fff",
            }}
          >
            Company Information
          </div>

          <div
            style={{
              marginTop: 8,
              color: "#8d8d8d",
              fontSize: 14,
              lineHeight: 1.7,
            }}
          >
            Configure how your business appears on every
            AI-generated digital till slip.
          </div>

        </div>

        <div
          style={{
            width: 54,
            height: 54,
            borderRadius: 18,
            background: "#151515",
            border: "1px solid #2b2b2b",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 22,
          }}
        >
          🏢
        </div>

      </div>

      {/* ======================================================
          BUSINESS IDENTITY FORM
          (Part 1B goes here)
      ====================================================== */}

    </div>



    {/* ======================================================
        AI CONFIGURATION CARD
    ====================================================== */}

    <div
      style={{
        position: "relative",
        background: "linear-gradient(180deg,#111111,#090909)",
        border: "1px solid #222",
        borderRadius: "24px",
        padding: "28px",
        overflow: "hidden",
        boxShadow: "0 20px 50px rgba(0,0,0,.28)",
      }}
    >

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "28px",
        }}
      >

        <div>

          <div
            style={{
              fontSize: 12,
              letterSpacing: "2px",
              color: "#7c7c7c",
              textTransform: "uppercase",
              marginBottom: 8,
            }}
          >
            AI Configuration
          </div>

          <div
            style={{
              fontSize: 24,
              fontWeight: 700,
            }}
          >
            Intelligence Engine
          </div>

          <div
            style={{
              marginTop: 8,
              color: "#8d8d8d",
              fontSize: 14,
              lineHeight: 1.7,
            }}
          >
            Customize how RuachAgent rewards customers
            and generates intelligent receipts.
          </div>

        </div>

        <div
          style={{
            width: 54,
            height: 54,
            borderRadius: 18,
            background: "#151515",
            border: "1px solid #2b2b2b",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 22,
          }}
        >
          🤖
        </div>

      </div>

      {/* ======================================================
          AI SETTINGS FORM
          (Part 1C goes here)
      ====================================================== */}

    </div>

  </div>



  {/* ======================================================
      RIGHT SIDE
      TILL SLIP PREVIEW
  ====================================================== */}

  <div
    style={{
      position: "sticky",
      top: "28px",
      alignSelf: "start",
    }}
  >

    <div
      style={{
        position: "relative",
        background: "linear-gradient(180deg,#101010,#080808)",
        border: "1px solid #222",
        borderRadius: "26px",
        overflow: "hidden",
        boxShadow: "0 20px 60px rgba(0,0,0,.35)",
      }}
    >

      {/* Header */}

      <div
        style={{
          padding: "24px 26px",
          borderBottom: "1px solid #1f1f1f",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >

        <div>

          <div
            style={{
              fontSize: 11,
              color: "#777",
              letterSpacing: "2px",
              textTransform: "uppercase",
              marginBottom: 6,
            }}
          >
            Live Preview
          </div>

          <div
            style={{
              fontSize: 22,
              fontWeight: 700,
            }}
          >
            Till Slip
          </div>

        </div>

        <div
          style={{
            padding: "8px 14px",
            borderRadius: 999,
            background: "#141414",
            border: "1px solid #292929",
            color: "#bdbdbd",
            fontSize: 12,
            fontWeight: 600,
          }}
        >
          Real-Time
        </div>

      </div>

      {/* ======================================================
          PART 1A.2
          RECEIPT PREVIEW GOES HERE
      ====================================================== */}

    </div>

  </div>

</div>

{/* ===========================================================
    BUSINESS IDENTITY HEADER
=========================================================== */}

<div
  style={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "30px",
    paddingBottom: "24px",
    borderBottom: "1px solid #1b1b1b",
  }}
>
  <div>

    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "8px",
        padding: "6px 12px",
        borderRadius: "999px",
        background: "#121212",
        border: "1px solid #242424",
        marginBottom: "16px",
      }}
    >
      <div
        style={{
          width: "8px",
          height: "8px",
          borderRadius: "50%",
          background: "#ffffff",
        }}
      />

      <span
        style={{
          fontSize: "11px",
          fontWeight: 600,
          color: "#bdbdbd",
          letterSpacing: "1px",
          textTransform: "uppercase",
        }}
      >
        Business Identity
      </span>
    </div>

    <h2
      style={{
        margin: 0,
        fontSize: "28px",
        fontWeight: 700,
        letterSpacing: "-0.6px",
        color: "#ffffff",
      }}
    >
      Company Branding
    </h2>

    <p
      style={{
        marginTop: "12px",
        maxWidth: "560px",
        color: "#8d8d8d",
        fontSize: "14px",
        lineHeight: "1.8",
      }}
    >
      Upload your official business logo. This branding will
      automatically appear on AI-generated digital till slips,
      customer vouchers and receipts across every connected
      store.
    </p>

  </div>

  <div
    style={{
      width: "58px",
      height: "58px",
      borderRadius: "18px",
      background: "#111111",
      border: "1px solid #232323",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "24px",
      boxShadow: "0 12px 30px rgba(0,0,0,.35)",
    }}
  >
    🏢
  </div>
</div>

{/* ===========================================================
    PREMIUM LOGO UPLOAD SECTION
=========================================================== */}

<div
  style={{
    display: "grid",
    gridTemplateColumns: "1.25fr 0.75fr",
    gap: "24px",
    alignItems: "stretch",
  }}
>

  {/* LEFT SIDE */}

  <div
    style={{
      background: "#0b0b0b",
      border: "1px solid #1f1f1f",
      borderRadius: "22px",
      padding: "28px",
      position: "relative",
      overflow: "hidden",
    }}
  >

    {/* Soft Glow */}

    <div
      style={{
        position: "absolute",
        top: "-80px",
        right: "-80px",
        width: "220px",
        height: "220px",
        borderRadius: "50%",
        background:
          "radial-gradient(circle, rgba(255,255,255,.04), transparent 72%)",
      }}
    />

    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "14px",
        marginBottom: "22px",
      }}
    >

      <div
        style={{
          width: "46px",
          height: "46px",
          borderRadius: "14px",
          background: "#171717",
          border: "1px solid #292929",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: "18px",
        }}
      >
        🖼️
      </div>

      <div>

        <div
          style={{
            fontSize: "18px",
            fontWeight: 600,
            color: "#ffffff",
          }}
        >
          Brand Logo
        </div>

        <div
          style={{
            marginTop: "4px",
            color: "#8b8b8b",
            fontSize: "13px",
          }}
        >
          PNG • JPG • WEBP • SVG
        </div>

      </div>

    </div>

    <label
      htmlFor="logo-upload"
      style={{
        display: "block",
        cursor: "pointer",
      }}
    >

      <div
        style={{
          minHeight: "210px",
          border: "2px dashed #2d2d2d",
          borderRadius: "20px",
          background:
            "linear-gradient(180deg,#111111,#0c0c0c)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          transition: ".25s",
        }}
      >

        <div
          style={{
            width: "82px",
            height: "82px",
            borderRadius: "22px",
            background: "#171717",
            border: "1px solid #2d2d2d",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "34px",
            marginBottom: "20px",
          }}
        >
          ⬆️
        </div>

        <div
          style={{
            fontSize: "18px",
            fontWeight: 600,
            color: "#ffffff",
          }}
        >
          Upload Business Logo
        </div>

        <div
          style={{
            marginTop: "10px",
            color: "#7f7f7f",
            fontSize: "14px",
            textAlign: "center",
            maxWidth: "340px",
            lineHeight: "1.7",
          }}
        >
          Click anywhere inside this area to select your
          company logo from your computer.
        </div>

      </div>

    </label>

    {/* Hidden Input
       (Keep your existing onChange logic in Part 1B.1.1b)
    */}

    <input
      id="logo-upload"
      name="logo_url"
      type="file"
      accept="image/*"
      autoComplete="off"
      style={{ display: "none" }}
    />

  </div>

  {/* ===========================================================
    RIGHT SIDE
    Upload Status / Logo Information
=========================================================== */}

<div
  style={{
    display: "flex",
    flexDirection: "column",
    gap: "18px",
  }}
>

  {/* ==========================================
      LIVE LOGO PREVIEW
  ========================================== */}

  <div
    style={{
      background: "#0c0c0c",
      border: "1px solid #202020",
      borderRadius: "22px",
      padding: "24px",
      boxShadow: "0 18px 45px rgba(0,0,0,.28)",
    }}
  >

    <div
      style={{
        fontSize: "11px",
        color: "#7f7f7f",
        textTransform: "uppercase",
        letterSpacing: "2px",
        marginBottom: "16px",
      }}
    >
      Live Preview
    </div>

    <div
      style={{
        height: "210px",
        borderRadius: "18px",
        background: "#ffffff",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
      }}
    >

      {settings?.logo_url ? (

        <img
          src={settings.logo_url}
          alt="Business Logo"
          style={{
            maxWidth: "85%",
            maxHeight: "85%",
            objectFit: "contain",
          }}
        />

      ) : (

        <div
          style={{
            textAlign: "center",
          }}
        >

          <div
            style={{
              fontSize: "46px",
              marginBottom: "16px",
            }}
          >
            🖼️
          </div>

          <div
            style={{
              color: "#444",
              fontWeight: 600,
              fontSize: "15px",
            }}
          >
            Logo Preview
          </div>

        </div>

      )}

    </div>

  </div>



  {/* ==========================================
      UPLOAD STATUS
  ========================================== */}

  <div
    style={{
      background: "#0f0f0f",
      border: "1px solid #202020",
      borderRadius: "18px",
      padding: "20px",
    }}
  >

    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >

      <span
        style={{
          color: "#9a9a9a",
          fontSize: "13px",
        }}
      >
        Upload Status
      </span>

      <span
        style={{
          padding: "5px 12px",
          borderRadius: "999px",
          background: settings?.logo_url
            ? "#16361d"
            : "#242424",
          color: settings?.logo_url
            ? "#3ddc84"
            : "#b0b0b0",
          fontSize: "12px",
          fontWeight: 600,
        }}
      >
        {settings?.logo_url ? "Uploaded" : "Waiting"}
      </span>

    </div>

  </div>



  {/* ==========================================
      LOGO DETAILS
  ========================================== */}

  <div
    style={{
      background: "#0f0f0f",
      border: "1px solid #202020",
      borderRadius: "18px",
      padding: "20px",
    }}
  >

    <div
      style={{
        fontSize: "11px",
        color: "#7f7f7f",
        textTransform: "uppercase",
        letterSpacing: "2px",
        marginBottom: "18px",
      }}
    >
      Branding Checklist
    </div>

    {[
      "High-resolution image",
      "Transparent PNG recommended",
      "Square logo preferred",
      "Printed on every receipt",
      "Used in AI branding",
    ].map((item) => (

      <div
        key={item}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          marginBottom: "12px",
        }}
      >

        <div
          style={{
            width: "9px",
            height: "9px",
            borderRadius: "50%",
            background: settings?.logo_url
              ? "#31d158"
              : "#555",
          }}
        />

        <span
          style={{
            color: "#cfcfcf",
            fontSize: "13px",
          }}
        >
          {item}
        </span>

      </div>

    ))}

  </div>



  {/* ==========================================
      AI HELPER
  ========================================== */}

  <div
    style={{
      background: "linear-gradient(180deg,#111111,#090909)",
      border: "1px solid #232323",
      borderRadius: "18px",
      padding: "22px",
      position: "relative",
      overflow: "hidden",
    }}
  >

    <div
      style={{
        position: "absolute",
        top: "-70px",
        right: "-70px",
        width: "180px",
        height: "180px",
        borderRadius: "50%",
        background:
          "radial-gradient(circle, rgba(255,255,255,.05), transparent 72%)",
      }}
    />

    <div
      style={{
        display: "flex",
        gap: "14px",
        alignItems: "flex-start",
      }}
    >

      <div
        style={{
          width: "44px",
          height: "44px",
          borderRadius: "14px",
          background: "#171717",
          border: "1px solid #2b2b2b",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: "20px",
        }}
      >
        🤖
      </div>

      <div>

        <div
          style={{
            fontWeight: 600,
            fontSize: "15px",
            color: "#ffffff",
            marginBottom: "8px",
          }}
        >
          AI Recommendation
        </div>

        <div
          style={{
            color: "#8d8d8d",
            fontSize: "13px",
            lineHeight: "1.8",
          }}
        >
          For the highest quality digital receipts,
          upload a transparent PNG with at least
          1000 × 1000 resolution.
        </div>

      </div>

    </div>

  </div>

</div>

{/* ===========================================================
    BUSINESS BRAND NAME
=========================================================== */}

<div
  style={{
    marginTop: "28px",
    background: "linear-gradient(180deg,#101010,#0b0b0b)",
    border: "1px solid #1f1f1f",
    borderRadius: "22px",
    padding: "26px",
    position: "relative",
    overflow: "hidden",
  }}
>

  {/* Tesla Accent Glow */}

  <div
    style={{
      position: "absolute",
      top: "-80px",
      right: "-80px",
      width: "220px",
      height: "220px",
      borderRadius: "50%",
      background:
        "radial-gradient(circle, rgba(255,255,255,.035), transparent 72%)",
      pointerEvents: "none",
    }}
  />

  {/* Card Header */}

  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: "22px",
    }}
  >

    <div>

      <div
        style={{
          fontSize: "11px",
          color: "#7b7b7b",
          letterSpacing: "2px",
          textTransform: "uppercase",
          marginBottom: "8px",
        }}
      >
        Business Profile
      </div>

      <div
        style={{
          fontSize: "22px",
          fontWeight: 700,
          color: "#ffffff",
        }}
      >
        Business Brand Name
      </div>

      <div
        style={{
          marginTop: "8px",
          fontSize: "14px",
          color: "#8d8d8d",
          lineHeight: "1.7",
          maxWidth: "520px",
        }}
      >
        This name will appear throughout your AI-generated
        digital receipts, customer vouchers and transaction
        history.
      </div>

    </div>

    <div
      style={{
        width: "52px",
        height: "52px",
        borderRadius: "16px",
        background: "#151515",
        border: "1px solid #282828",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "22px",
      }}
    >
      🏷️
    </div>

  </div>

  {/* Premium Input */}

  <div>

    <label
      htmlFor="business-name"
      style={{
        display: "block",
        marginBottom: "10px",
        fontSize: "11px",
        color: "#8a8a8a",
        textTransform: "uppercase",
        letterSpacing: "2px",
      }}
    >
      Company Name
    </label>

    <input
      id="business-name"
      name="business_name"
      type="text"
      autoComplete="organization"
      value={settings?.business_name || ""}
      onChange={(e) => {
        const val = e.target.value;
        setSettings((prev) => ({
          ...prev,
          business_name: val,
        }));
      }}
      placeholder="Enter your registered business name"
      style={{
        width: "100%",
        background: "#151515",
        border: "1px solid #2a2a2a",
        borderRadius: "16px",
        padding: "18px 20px",
        color: "#ffffff",
        fontSize: "15px",
        outline: "none",
        transition: ".25s",
        boxSizing: "border-box",
      }}
    />

  </div>

  {/* Information Row */}

  <div
    style={{
      marginTop: "20px",
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))",
      gap: "16px",
    }}
  >

    <div
      style={{
        background: "#121212",
        border: "1px solid #202020",
        borderRadius: "14px",
        padding: "16px",
      }}
    >

      <div
        style={{
          fontSize: "11px",
          color: "#7a7a7a",
          textTransform: "uppercase",
          letterSpacing: "1px",
        }}
      >
        Characters
      </div>

      <div
        style={{
          marginTop: "8px",
          fontSize: "24px",
          fontWeight: 700,
          color: "#ffffff",
        }}
      >
        {settings?.business_name?.length || 0}
      </div>

    </div>

    <div
      style={{
        background: "#121212",
        border: "1px solid #202020",
        borderRadius: "14px",
        padding: "16px",
      }}
    >

      <div
        style={{
          fontSize: "11px",
          color: "#7a7a7a",
          textTransform: "uppercase",
          letterSpacing: "1px",
        }}
      >
        Receipt Status
      </div>

      <div
        style={{
          marginTop: "8px",
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}
      >

        <div
          style={{
            width: "10px",
            height: "10px",
            borderRadius: "50%",
            background:
              settings?.business_name?.trim()
                ? "#33d17a"
                : "#666666",
            boxShadow:
              settings?.business_name?.trim()
                ? "0 0 12px #33d17a"
                : "none",
          }}
        />

        <span
          style={{
            fontSize: "14px",
            fontWeight: 600,
            color: "#ffffff",
          }}
        >
          {settings?.business_name?.trim()
            ? "Ready"
            : "Incomplete"}
        </span>

      </div>

    </div>

  </div>

  {/* Tesla Hint */}

  <div
    style={{
      marginTop: "22px",
      padding: "16px 18px",
      borderRadius: "14px",
      background: "#131313",
      border: "1px solid #232323",
      display: "flex",
      gap: "14px",
      alignItems: "flex-start",
    }}
  >

    <div style={{ fontSize: "18px" }}>💡</div>

    <div>

      <div
        style={{
          color: "#ffffff",
          fontSize: "14px",
          fontWeight: 600,
          marginBottom: "6px",
        }}
      >
        AI Recommendation
      </div>

      <div
        style={{
          color: "#8c8c8c",
          fontSize: "13px",
          lineHeight: "1.7",
        }}
      >
        Use the official customer-facing business name.
        This improves receipt recognition, AI branding,
        voucher generation and customer trust.
      </div>

    </div>

  </div>

</div>

{/* ===========================================================
    TESLA WEBHOOK CONFIGURATION
    Part 1B.2.2a
=========================================================== */}

<div
  style={{
    marginTop: "28px",
    background: "linear-gradient(180deg,#101010,#090909)",
    border: "1px solid #202020",
    borderRadius: "22px",
    overflow: "hidden",
    position: "relative",
    boxShadow: "0 18px 45px rgba(0,0,0,.30)",
  }}
>

  {/* Ambient Glow */}

  <div
    style={{
      position: "absolute",
      top: "-90px",
      right: "-90px",
      width: "240px",
      height: "240px",
      borderRadius: "50%",
      background:
        "radial-gradient(circle, rgba(255,255,255,.035), transparent 72%)",
      pointerEvents: "none",
    }}
  />

  {/* ==========================================
      Header
  ========================================== */}

  <div
    style={{
      padding: "26px 28px",
      borderBottom: "1px solid #1d1d1d",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
    }}
  >

    <div>

      <div
        style={{
          fontSize: "11px",
          color: "#777",
          letterSpacing: "2px",
          textTransform: "uppercase",
          marginBottom: "8px",
        }}
      >
        API Configuration
      </div>

      <h3
        style={{
          margin: 0,
          color: "#fff",
          fontSize: "24px",
          fontWeight: 700,
        }}
      >
        Live Webhook Endpoint
      </h3>

      <p
        style={{
          marginTop: "10px",
          color: "#8b8b8b",
          fontSize: "14px",
          lineHeight: "1.8",
          maxWidth: "560px",
        }}
      >
        Configure the unique webhook slug used by POS systems,
        Shopify, WooCommerce and other integrations to send
        receipts directly to RuachAgent AI.
      </p>

    </div>

    <div
      style={{
        width: "58px",
        height: "58px",
        borderRadius: "18px",
        background: "#141414",
        border: "1px solid #292929",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "24px",
      }}
    >
      🔗
    </div>

  </div>



  {/* ==========================================
      Input Area
  ========================================== */}

  <div
    style={{
      padding: "28px",
    }}
  >

    <label
      htmlFor="webhook-slug"
      style={{
        display: "block",
        marginBottom: "12px",
        fontSize: "11px",
        color: "#888",
        letterSpacing: "2px",
        textTransform: "uppercase",
      }}
    >
      Webhook Slug
    </label>

    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "14px",
      }}
    >

      {/* URL Prefix */}

      <div
        style={{
          background: "#141414",
          border: "1px solid #2a2a2a",
          borderRadius: "16px",
          padding: "18px",
          color: "#727272",
          fontSize: "13px",
          whiteSpace: "nowrap",
          fontFamily: "monospace",
        }}
      >
        /api/
      </div>

      {/* Existing Backend Logic */}

      <input
        id="webhook-slug"
        name="webhook_slug"
        type="text"
        autoComplete="off"
        placeholder="your-business"

        value={settings?.webhook_slug || ""}

        onChange={(e) => {

          const cleanValue = e.target.value
            .toLowerCase()
            .replace(/[^a-z0-9-_]/g, "");

          setSettings(prev => ({
            ...prev,
            webhook_slug: cleanValue,
          }));

        }}

        style={{
          flex: 1,
          background: "#151515",
          border: "1px solid #2c2c2c",
          borderRadius: "16px",
          padding: "18px 20px",
          color: "#ffffff",
          fontSize: "15px",
          fontFamily: "monospace",
          outline: "none",
          transition: ".25s",
          boxSizing: "border-box",
        }}
      />

    </div>



    {/* ==========================================
        Slug Guidelines
    ========================================== */}

    <div
      style={{
        marginTop: "18px",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit,minmax(170px,1fr))",
        gap: "14px",
      }}
    >

      <div
        style={{
          background: "#121212",
          border: "1px solid #202020",
          borderRadius: "14px",
          padding: "14px",
        }}
      >

        <div
          style={{
            color: "#7b7b7b",
            fontSize: "11px",
            textTransform: "uppercase",
            letterSpacing: "1px",
            marginBottom: "8px",
          }}
        >
          Allowed
        </div>

        <div
          style={{
            color: "#d4d4d4",
            fontSize: "13px",
            lineHeight: "1.7",
          }}
        >
          a-z, 0-9, hyphen (-) and underscore (_)
        </div>

      </div>



      <div
        style={{
          background: "#121212",
          border: "1px solid #202020",
          borderRadius: "14px",
          padding: "14px",
        }}
      >

        <div
          style={{
            color: "#7b7b7b",
            fontSize: "11px",
            textTransform: "uppercase",
            letterSpacing: "1px",
            marginBottom: "8px",
          }}
        >
          Live Characters
        </div>

        <div
          style={{
            color: "#ffffff",
            fontSize: "24px",
            fontWeight: 700,
          }}
        >
          {settings?.webhook_slug?.length || 0}
        </div>

      </div>



      <div
        style={{
          background: "#121212",
          border: "1px solid #202020",
          borderRadius: "14px",
          padding: "14px",
        }}
      >

        <div
          style={{
            color: "#7b7b7b",
            fontSize: "11px",
            textTransform: "uppercase",
            letterSpacing: "1px",
            marginBottom: "8px",
          }}
        >
          Status
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >

          <div
            style={{
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              background:
                settings?.webhook_slug
                  ? "#30d158"
                  : "#666",

              boxShadow:
                settings?.webhook_slug
                  ? "0 0 10px #30d158"
                  : "none",
            }}
          />

          <span
            style={{
              color: "#fff",
              fontWeight: 600,
            }}
          >
            {settings?.webhook_slug
              ? "Configured"
              : "Waiting"}
          </span>

        </div>

      </div>

    </div>

  </div>

</div>

{/* ===========================================================
    PART 1B.2.2b.1
    LIVE WEBHOOK URL PREVIEW
=========================================================== */}

<div
  style={{
    marginTop: "24px",
    display: "grid",
    gridTemplateColumns: "1.3fr 0.7fr",
    gap: "22px",
  }}
>

  {/* =======================================================
      LIVE ENDPOINT PREVIEW
  ======================================================= */}

  <div
    style={{
      background: "linear-gradient(180deg,#101010,#090909)",
      border: "1px solid #1f1f1f",
      borderRadius: "22px",
      overflow: "hidden",
      position: "relative",
    }}
  >

    {/* Ambient Glow */}

    <div
      style={{
        position: "absolute",
        top: "-90px",
        left: "-90px",
        width: "220px",
        height: "220px",
        borderRadius: "50%",
        background:
          "radial-gradient(circle,rgba(255,255,255,.035),transparent 72%)",
      }}
    />

    {/* Header */}

    <div
      style={{
        padding: "22px 24px",
        borderBottom: "1px solid #1c1c1c",
      }}
    >

      <div
        style={{
          fontSize: "11px",
          color: "#7d7d7d",
          textTransform: "uppercase",
          letterSpacing: "2px",
          marginBottom: "8px",
        }}
      >
        Live Endpoint
      </div>

      <div
        style={{
          color: "#ffffff",
          fontWeight: 700,
          fontSize: "20px",
        }}
      >
        Webhook URL Preview
      </div>

    </div>

    {/* URL */}

    <div
      style={{
        padding: "24px",
      }}
    >

      <div
        style={{
          background: "#131313",
          border: "1px solid #262626",
          borderRadius: "16px",
          padding: "18px",
          overflowX: "auto",
        }}
      >

        <div
          style={{
            color: "#9d9d9d",
            fontSize: "12px",
            marginBottom: "10px",
            textTransform: "uppercase",
            letterSpacing: "1px",
          }}
        >
          Endpoint
        </div>

        <code
          style={{
            color: "#ffffff",
            fontSize: "14px",
            fontFamily: "monospace",
            whiteSpace: "nowrap",
            wordBreak: "keep-all",
          }}
        >
          {settings?.webhook_slug
            ? `https://your-domain.com/api/${settings.webhook_slug}`
            : "https://your-domain.com/api/your-business"}
        </code>

      </div>

      <div
        style={{
          marginTop: "18px",
          display: "flex",
          alignItems: "center",
          gap: "12px",
          color: "#8d8d8d",
          fontSize: "13px",
          lineHeight: "1.7",
        }}
      >

        <span style={{ fontSize: "18px" }}>ℹ️</span>

        <span>
          This endpoint is what Shopify, WooCommerce,
          POS systems and third-party applications
          will send receipt data to.
        </span>

      </div>

    </div>

  </div>



  {/* =======================================================
      CONNECTION STATUS
  ======================================================= */}

  <div
    style={{
      background: "linear-gradient(180deg,#101010,#090909)",
      border: "1px solid #1f1f1f",
      borderRadius: "22px",
      overflow: "hidden",
    }}
  >

    <div
      style={{
        padding: "22px",
        borderBottom: "1px solid #1c1c1c",
      }}
    >

      <div
        style={{
          fontSize: "11px",
          color: "#7c7c7c",
          letterSpacing: "2px",
          textTransform: "uppercase",
          marginBottom: "8px",
        }}
      >
        Live Status
      </div>

      <div
        style={{
          fontSize: "20px",
          color: "#ffffff",
          fontWeight: 700,
        }}
      >
        Connection
      </div>

    </div>

    <div
      style={{
        padding: "28px 22px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >

      <div
        style={{
          width: "74px",
          height: "74px",
          borderRadius: "50%",
          background: settings?.webhook_slug
            ? "#16361d"
            : "#2a2a2a",

          display: "flex",
          justifyContent: "center",
          alignItems: "center",

          fontSize: "34px",

          marginBottom: "18px",

          boxShadow: settings?.webhook_slug
            ? "0 0 25px rgba(48,209,88,.25)"
            : "none",
        }}
      >
        {settings?.webhook_slug ? "✓" : "!"}
      </div>

      <div
        style={{
          color: "#ffffff",
          fontWeight: 700,
          fontSize: "20px",
        }}
      >
        {settings?.webhook_slug
          ? "Ready"
          : "Awaiting Setup"}
      </div>

      <div
        style={{
          marginTop: "10px",
          color: "#8b8b8b",
          textAlign: "center",
          fontSize: "13px",
          lineHeight: "1.7",
        }}
      >
        {settings?.webhook_slug
          ? "Your webhook endpoint has been configured and is ready for integrations."
          : "Create a unique webhook slug before connecting external platforms."}
      </div>

      <div
        style={{
          marginTop: "24px",
          width: "100%",
          background: "#131313",
          border: "1px solid #242424",
          borderRadius: "14px",
          padding: "14px",
        }}
      >

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "12px",
          }}
        >
          <span
            style={{
              color: "#7d7d7d",
              fontSize: "12px",
            }}
          >
            Endpoint Status
          </span>

          <span
            style={{
              color: settings?.webhook_slug
                ? "#30d158"
                : "#8a8a8a",
              fontWeight: 600,
              fontSize: "12px",
            }}
          >
            {settings?.webhook_slug
              ? "Configured"
              : "Waiting"}
          </span>
        </div>

        <div
          style={{
            height: "6px",
            background: "#202020",
            borderRadius: "999px",
            overflow: "hidden",
          }}
        >

          <div
            style={{
              width: settings?.webhook_slug
                ? "100%"
                : "20%",

              height: "100%",
              borderRadius: "999px",
              background: settings?.webhook_slug
                ? "#30d158"
                : "#666666",

              transition: ".35s",
            }}
          />

        </div>

      </div>

    </div>

  </div>

</div>

{/* ===========================================================
    PART 1B.2.2b.2a
    TESLA INTEGRATION HELPER
=========================================================== */}

<div
  style={{
    marginTop: "26px",
    background: "linear-gradient(180deg,#101010,#090909)",
    border: "1px solid #202020",
    borderRadius: "22px",
    overflow: "hidden",
    position: "relative",
    boxShadow: "0 18px 45px rgba(0,0,0,.28)",
  }}
>

  {/* Ambient Tesla Glow */}

  <div
    style={{
      position: "absolute",
      top: "-120px",
      right: "-120px",
      width: "260px",
      height: "260px",
      borderRadius: "50%",
      background:
        "radial-gradient(circle, rgba(255,255,255,.04), transparent 72%)",
      pointerEvents: "none",
    }}
  />

  {/* ===========================================
      HEADER
  =========================================== */}

  <div
    style={{
      padding: "24px 28px",
      borderBottom: "1px solid #1d1d1d",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    }}
  >

    <div>

      <div
        style={{
          fontSize: "11px",
          letterSpacing: "2px",
          color: "#777",
          textTransform: "uppercase",
          marginBottom: "8px",
        }}
      >
        AI Integration Assistant
      </div>

      <h3
        style={{
          margin: 0,
          color: "#ffffff",
          fontSize: "22px",
          fontWeight: 700,
        }}
      >
        Integration Helper
      </h3>

    </div>

    <div
      style={{
        width: "58px",
        height: "58px",
        borderRadius: "18px",
        background: "#151515",
        border: "1px solid #292929",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontSize: "24px",
      }}
    >
      🤖
    </div>

  </div>



  {/* ===========================================
      AI RECOMMENDATIONS
  =========================================== */}

  <div style={{ padding: "28px" }}>

    <div
      style={{
        fontSize: "11px",
        color: "#8b8b8b",
        letterSpacing: "2px",
        textTransform: "uppercase",
        marginBottom: "18px",
      }}
    >
      AI Recommendations
    </div>

    {[
      {
        icon: "✓",
        title: "Use a memorable webhook slug",
        text: "Choose a short and recognizable endpoint such as your company or brand name.",
      },
      {
        icon: "⚡",
        title: "Keep integrations synchronized",
        text: "Save your profile after changing settings so connected stores receive the latest configuration.",
      },
      {
        icon: "🧾",
        title: "Verify receipt delivery",
        text: "Run a test transaction after connecting a POS or eCommerce platform.",
      },
    ].map((item) => (

      <div
        key={item.title}
        style={{
          display: "flex",
          gap: "18px",
          marginBottom: "18px",
          padding: "18px",
          borderRadius: "16px",
          background: "#131313",
          border: "1px solid #242424",
        }}
      >

        <div
          style={{
            width: "42px",
            height: "42px",
            borderRadius: "14px",
            background: "#1b1b1b",
            border: "1px solid #2e2e2e",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            color: "#ffffff",
            fontWeight: 700,
          }}
        >
          {item.icon}
        </div>

        <div>

          <div
            style={{
              color: "#ffffff",
              fontWeight: 600,
              marginBottom: "6px",
            }}
          >
            {item.title}
          </div>

          <div
            style={{
              color: "#8c8c8c",
              fontSize: "13px",
              lineHeight: "1.7",
            }}
          >
            {item.text}
          </div>

        </div>

      </div>

    ))}

  </div>



  {/* ===========================================
      SECURITY CHECKLIST
  =========================================== */}

  <div
    style={{
      padding: "0 28px 28px",
    }}
  >

    <div
      style={{
        fontSize: "11px",
        color: "#8b8b8b",
        letterSpacing: "2px",
        textTransform: "uppercase",
        marginBottom: "18px",
      }}
    >
      Security Checklist
    </div>

    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
        gap: "16px",
      }}
    >

      {[
        "Use HTTPS for production",
        "Keep webhook slug private",
        "Restrict server access",
        "Monitor failed webhook requests",
      ].map((item) => (

        <div
          key={item}
          style={{
            background: "#121212",
            border: "1px solid #202020",
            borderRadius: "14px",
            padding: "16px",
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >

          <div
            style={{
              width: "12px",
              height: "12px",
              borderRadius: "50%",
              background: "#30d158",
              boxShadow: "0 0 10px rgba(48,209,88,.45)",
            }}
          />

          <span
            style={{
              color: "#d5d5d5",
              fontSize: "13px",
            }}
          >
            {item}
          </span>

        </div>

      ))}

    </div>

  </div>



  {/* ===========================================
      INTEGRATION TIPS
  =========================================== */}

  <div
    style={{
      margin: "0 28px 28px",
      background: "linear-gradient(180deg,#141414,#101010)",
      border: "1px solid #242424",
      borderRadius: "18px",
      padding: "22px",
    }}
  >

    <div
      style={{
        display: "flex",
        gap: "18px",
        alignItems: "flex-start",
      }}
    >

      <div
        style={{
          width: "52px",
          height: "52px",
          borderRadius: "16px",
          background: "#181818",
          border: "1px solid #2d2d2d",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: "24px",
        }}
      >
        💡
      </div>

      <div>

        <div
          style={{
            color: "#ffffff",
            fontWeight: 700,
            fontSize: "17px",
            marginBottom: "10px",
          }}
        >
          Integration Tip
        </div>

        <div
          style={{
            color: "#8d8d8d",
            lineHeight: "1.8",
            fontSize: "14px",
          }}
        >
          RuachAgent AI works best when every connected sales
          channel shares the same business profile, webhook
          endpoint and branding. This ensures that every
          generated digital receipt looks identical regardless
          of whether it originated from your POS, Shopify,
          WooCommerce or a custom integration.
        </div>

      </div>

    </div>

  </div>

</div>

{/* ===========================================================
    PART 1B.2.2b.2b
    PREMIUM ACTION CENTER
    (Tesla Black SaaS)
=========================================================== */}

<div
  style={{
    marginTop: "28px",
    background: "linear-gradient(180deg,#101010,#090909)",
    border: "1px solid #1f1f1f",
    borderRadius: "22px",
    overflow: "hidden",
    position: "relative",
    boxShadow: "0 18px 45px rgba(0,0,0,.30)",
  }}
>

  {/* Ambient Glow */}

  <div
    style={{
      position: "absolute",
      bottom: "-120px",
      right: "-120px",
      width: "260px",
      height: "260px",
      borderRadius: "50%",
      background:
        "radial-gradient(circle,rgba(255,255,255,.035),transparent 72%)",
      pointerEvents: "none",
    }}
  />

  {/* Header */}

  <div
    style={{
      padding: "24px 28px",
      borderBottom: "1px solid #1b1b1b",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    }}
  >

    <div>

      <div
        style={{
          fontSize: "11px",
          color: "#7a7a7a",
          letterSpacing: "2px",
          textTransform: "uppercase",
          marginBottom: "8px",
        }}
      >
        Developer Tools
      </div>

      <h3
        style={{
          margin: 0,
          color: "#ffffff",
          fontSize: "22px",
          fontWeight: 700,
        }}
      >
        Quick Actions
      </h3>

    </div>

    <div
      style={{
        width: "56px",
        height: "56px",
        borderRadius: "16px",
        background: "#151515",
        border: "1px solid #2b2b2b",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontSize: "24px",
      }}
    >
      ⚙️
    </div>

  </div>

  {/* Buttons */}

  <div
    style={{
      padding: "28px",
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
      gap: "18px",
    }}
  >

    {/* ====================================== */}
    {/* COPY ENDPOINT */}
    {/* ====================================== */}

    <button
      type="button"
      onClick={() => {
        navigator.clipboard.writeText(
          settings?.webhook_slug
            ? `https://your-domain.com/api/${settings.webhook_slug}`
            : "https://your-domain.com/api/your-business"
        );
      }}
      style={{
        background: "#171717",
        border: "1px solid #2b2b2b",
        borderRadius: "18px",
        padding: "22px",
        color: "#ffffff",
        cursor: "pointer",
        transition: ".25s",
        textAlign: "left",
      }}
    >

      <div
        style={{
          fontSize: "28px",
          marginBottom: "16px",
        }}
      >
        📋
      </div>

      <div
        style={{
          fontWeight: 700,
          fontSize: "16px",
          marginBottom: "8px",
        }}
      >
        Copy Endpoint
      </div>

      <div
        style={{
          color: "#8d8d8d",
          fontSize: "13px",
          lineHeight: "1.7",
        }}
      >
        Copy the complete webhook URL to your clipboard for use
        inside Shopify, WooCommerce or your POS software.
      </div>

    </button>



    {/* ====================================== */}
    {/* TEST CONNECTION */}
    {/* ====================================== */}

    <button
      type="button"
      onClick={() => {

        // Placeholder
        alert("Connection testing will be available soon.");

      }}
      style={{
        background: "#171717",
        border: "1px solid #2b2b2b",
        borderRadius: "18px",
        padding: "22px",
        color: "#ffffff",
        cursor: "pointer",
        transition: ".25s",
        textAlign: "left",
      }}
    >

      <div
        style={{
          fontSize: "28px",
          marginBottom: "16px",
        }}
      >
        ⚡
      </div>

      <div
        style={{
          fontWeight: 700,
          fontSize: "16px",
          marginBottom: "8px",
        }}
      >
        Test Connection
      </div>

      <div
        style={{
          color: "#8d8d8d",
          fontSize: "13px",
          lineHeight: "1.7",
        }}
      >
        Send a sample webhook request to verify your endpoint
        before connecting external systems.
      </div>

    </button>



    {/* ====================================== */}
    {/* DOCUMENTATION */}
    {/* ====================================== */}

    <button
      type="button"
      onClick={() => {

        // Placeholder
        alert("Developer documentation coming soon.");

      }}
      style={{
        background: "#171717",
        border: "1px solid #2b2b2b",
        borderRadius: "18px",
        padding: "22px",
        color: "#ffffff",
        cursor: "pointer",
        transition: ".25s",
        textAlign: "left",
      }}
    >

      <div
        style={{
          fontSize: "28px",
          marginBottom: "16px",
        }}
      >
        📖
      </div>

      <div
        style={{
          fontWeight: 700,
          fontSize: "16px",
          marginBottom: "8px",
        }}
      >
        Documentation
      </div>

      <div
        style={{
          color: "#8d8d8d",
          fontSize: "13px",
          lineHeight: "1.7",
        }}
      >
        View integration guides, API examples and webhook
        documentation for every supported platform.
      </div>

    </button>

  </div>

  {/* Footer */}

  <div
    style={{
      padding: "18px 28px",
      borderTop: "1px solid #1b1b1b",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      flexWrap: "wrap",
      gap: "14px",
    }}
  >

    <div
      style={{
        color: "#7f7f7f",
        fontSize: "13px",
      }}
    >
      AI Integration Center • RuachAgent Developer Suite
    </div>

    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
      }}
    >

      <div
        style={{
          width: "9px",
          height: "9px",
          borderRadius: "50%",
          background: settings?.webhook_slug
            ? "#30d158"
            : "#666666",
          boxShadow: settings?.webhook_slug
            ? "0 0 10px rgba(48,209,88,.45)"
            : "none",
        }}
      />

      <span
        style={{
          color: "#bdbdbd",
          fontSize: "13px",
          fontWeight: 600,
        }}
      >
        {settings?.webhook_slug
          ? "Endpoint Ready"
          : "Configuration Required"}
      </span>

    </div>

  </div>

</div>

{/* ==========================================================
    PART 1C.1
    TESLA AI CONFIGURATION CARD
    Google GenAI Header + AI Status Banner
========================================================== */}

<div
  style={{
    background: "linear-gradient(180deg,#0f0f10 0%,#090909 100%)",
    border: "1px solid rgba(255,255,255,.08)",
    borderRadius: "24px",
    overflow: "hidden",
    position: "relative",
    boxShadow: "0 20px 50px rgba(0,0,0,.45)",
  }}
>

  {/* Ambient Tesla Glow */}

  <div
    style={{
      position: "absolute",
      top: "-120px",
      right: "-120px",
      width: "260px",
      height: "260px",
      borderRadius: "50%",
      background:
        "radial-gradient(circle, rgba(255,255,255,.045), transparent 72%)",
      pointerEvents: "none",
    }}
  />

  {/* =======================================================
      CARD HEADER
  ======================================================= */}

  <div
    style={{
      padding: "28px 30px",
      borderBottom: "1px solid rgba(255,255,255,.06)",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    }}
  >

    {/* Left */}

    <div>

      <div
        style={{
          fontSize: "11px",
          letterSpacing: "2px",
          textTransform: "uppercase",
          color: "#7c7c7c",
          marginBottom: "8px",
        }}
      >
        Artificial Intelligence
      </div>

      <h2
        style={{
          margin: 0,
          color: "#ffffff",
          fontSize: "24px",
          fontWeight: 700,
        }}
      >
        AI Configuration
      </h2>

      <div
        style={{
          marginTop: "8px",
          color: "#888",
          fontSize: "14px",
          lineHeight: "1.7",
          maxWidth: "520px",
        }}
      >
        Configure how RuachAgent AI generates intelligent
        digital receipts, voucher behaviour and automated
        customer engagement.
      </div>

    </div>

    {/* Right */}

    <div
      style={{
        width: "74px",
        height: "74px",
        borderRadius: "22px",
        background: "linear-gradient(180deg,#171717,#111111)",
        border: "1px solid rgba(255,255,255,.08)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontSize: "34px",
      }}
    >
      🧠
    </div>

  </div>



  {/* =======================================================
      GOOGLE GENAI STATUS
  ======================================================= */}

  <div
    style={{
      padding: "28px 30px",
    }}
  >

    <div
      style={{
        background:
          "linear-gradient(135deg,#171717,#111111)",
        border: "1px solid rgba(255,255,255,.08)",
        borderRadius: "22px",
        padding: "24px",
      }}
    >

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "24px",
          flexWrap: "wrap",
        }}
      >

        {/* LEFT */}

        <div
          style={{
            display: "flex",
            gap: "18px",
            alignItems: "center",
          }}
        >

          <div
            style={{
              width: "62px",
              height: "62px",
              borderRadius: "18px",
              background: "#151515",
              border: "1px solid rgba(255,255,255,.08)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: "30px",
            }}
          >
            ✨
          </div>

          <div>

            <div
              style={{
                color: "#ffffff",
                fontSize: "18px",
                fontWeight: 700,
                marginBottom: "6px",
              }}
            >
              Google GenAI Engine
            </div>

            <div
              style={{
                color: "#8c8c8c",
                fontSize: "14px",
                lineHeight: "1.7",
                maxWidth: "520px",
              }}
            >
              RuachAgent AI is powered by{" "}
              <strong style={{ color: "#ffffff" }}>
                @google/genai
              </strong>{" "}
              for intelligent receipt generation,
              recommendations, promotional content,
              voucher optimization and customer engagement.
            </div>

          </div>

        </div>



        {/* STATUS */}

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "14px",
            padding: "14px 18px",
            borderRadius: "16px",
            background: "#101010",
            border: "1px solid rgba(255,255,255,.06)",
          }}
        >

          <div
            style={{
              width: "12px",
              height: "12px",
              borderRadius: "50%",
              background: "#2ee66b",
              boxShadow:
                "0 0 18px rgba(46,230,107,.55)",
            }}
          />

          <div>

            <div
              style={{
                color: "#ffffff",
                fontWeight: 700,
                fontSize: "14px",
              }}
            >
              AI Engine Online
            </div>

            <div
              style={{
                color: "#8a8a8a",
                fontSize: "12px",
              }}
            >
              Ready to process requests
            </div>

          </div>

        </div>

      </div>



      {/* ===========================================
          FEATURE TAGS
      =========================================== */}

      <div
        style={{
          marginTop: "28px",
          display: "flex",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >

        {[
          "Receipt Intelligence",
          "Voucher AI",
          "Smart Discounts",
          "Customer Insights",
          "Product Recommendations",
          "Receipt Personalisation",
          "Marketing AI",
        ].map((feature) => (

          <div
            key={feature}
            style={{
              padding: "10px 16px",
              borderRadius: "999px",
              background: "#151515",
              border: "1px solid rgba(255,255,255,.06)",
              color: "#d6d6d6",
              fontSize: "13px",
              fontWeight: 500,
            }}
          >
            {feature}
          </div>

        ))}

      </div>



      {/* ===========================================
          AI INFORMATION STRIP
      =========================================== */}

      <div
        style={{
          marginTop: "28px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "18px",
          paddingTop: "24px",
          borderTop: "1px solid rgba(255,255,255,.05)",
        }}
      >

        <div>

          <div
            style={{
              color: "#6f6f6f",
              fontSize: "11px",
              letterSpacing: "2px",
              textTransform: "uppercase",
            }}
          >
            Active AI Provider
          </div>

          <div
            style={{
              marginTop: "6px",
              color: "#ffffff",
              fontWeight: 700,
              fontSize: "18px",
            }}
          >
            Google GenAI
          </div>

        </div>

        <div>

          <div
            style={{
              color: "#6f6f6f",
              fontSize: "11px",
              letterSpacing: "2px",
              textTransform: "uppercase",
            }}
          >
            Configuration
          </div>

          <div
            style={{
              marginTop: "6px",
              color: "#ffffff",
              fontWeight: 700,
              fontSize: "18px",
            }}
          >
            Merchant Profile Driven
          </div>

        </div>

        <div>

          <div
            style={{
              color: "#6f6f6f",
              fontSize: "11px",
              letterSpacing: "2px",
              textTransform: "uppercase",
            }}
          >
            Current Status
          </div>

          <div
            style={{
              marginTop: "6px",
              color: "#2ee66b",
              fontWeight: 700,
              fontSize: "18px",
            }}
          >
            Operational
          </div>

        </div>

      </div>

    </div>

  </div>

</div>

{/* ==========================================================
    PART 1C.2
    OPERATIONAL CURRENCY
    (Existing settings.currency logic preserved)
========================================================== */}

<div
  style={{
    marginTop: "28px",
    background: "linear-gradient(180deg,#131313,#0d0d0d)",
    border: "1px solid rgba(255,255,255,.06)",
    borderRadius: "22px",
    overflow: "hidden",
  }}
>

  {/* Card Header */}

  <div
    style={{
      padding: "22px 26px",
      borderBottom: "1px solid rgba(255,255,255,.06)",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    }}
  >

    <div>

      <div
        style={{
          fontSize: "11px",
          letterSpacing: "2px",
          color: "#7b7b7b",
          textTransform: "uppercase",
          marginBottom: "8px",
        }}
      >
        Financial Configuration
      </div>

      <div
        style={{
          color: "#ffffff",
          fontSize: "20px",
          fontWeight: 700,
        }}
      >
        Operational Currency
      </div>

    </div>

    <div
      style={{
        width: "58px",
        height: "58px",
        borderRadius: "18px",
        background: "#171717",
        border: "1px solid rgba(255,255,255,.08)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontSize: "28px",
      }}
    >
      💳
    </div>

  </div>



  {/* Content */}

  <div
    style={{
      padding: "28px",
    }}
  >

    {/* Description */}

    <div
      style={{
        color: "#8b8b8b",
        fontSize: "14px",
        lineHeight: "1.8",
        marginBottom: "24px",
      }}
    >
      Select the primary currency used throughout your business.
      RuachAgent AI will automatically use this currency when
      generating digital receipts, vouchers, customer rewards,
      promotions and future AI insights.
    </div>



    {/* Currency Selector */}

    <div>

      <label
        htmlFor="currency"
        style={{
          display: "block",
          marginBottom: "10px",
          color: "#d5d5d5",
          fontSize: "13px",
          fontWeight: 600,
        }}
      >
        Business Currency
      </label>

      <div
        style={{
          position: "relative",
        }}
      >

        {/* ==================================================
            EXISTING BACKEND LOGIC PRESERVED
        =================================================== */}

        <select
          id="currency"
          name="currency"
          value={settings?.currency || "ZAR"}
          onChange={(e) => {
            const val = e.target.value;
            setSettings(prev => ({
              ...prev,
              currency: val,
            }));
          }}
          style={{
            width: "100%",
            padding: "16px 52px 16px 18px",
            background: "#151515",
            border: "1px solid #2a2a2a",
            borderRadius: "16px",
            color: "#ffffff",
            fontSize: "15px",
            outline: "none",
            appearance: "none",
            cursor: "pointer",
            fontFamily: "inherit",
            transition: ".25s",
          }}
        >
          {CURRENCY_OPTIONS.map((curr) => (
            <option
              key={curr.code}
              value={curr.code}
              style={{
                background: "#101010",
                color: "#ffffff",
              }}
            >
              {curr.name} ({curr.symbol})
            </option>
          ))}
        </select>

        {/* Dropdown Icon */}

        <div
          style={{
            position: "absolute",
            right: "18px",
            top: "50%",
            transform: "translateY(-50%)",
            color: "#8b8b8b",
            pointerEvents: "none",
            fontSize: "13px",
          }}
        >
          ▼
        </div>

      </div>

    </div>



    {/* Live AI Summary */}

    <div
      style={{
        marginTop: "24px",
        background: "#151515",
        border: "1px solid rgba(255,255,255,.06)",
        borderRadius: "16px",
        padding: "18px 20px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "18px",
      }}
    >

      <div>

        <div
          style={{
            color: "#707070",
            fontSize: "11px",
            textTransform: "uppercase",
            letterSpacing: "2px",
            marginBottom: "6px",
          }}
        >
          Active Currency
        </div>

        <div
          style={{
            color: "#ffffff",
            fontWeight: 700,
            fontSize: "18px",
          }}
        >
          {settings?.currency || "ZAR"}
        </div>

      </div>

      <div>

        <div
          style={{
            color: "#707070",
            fontSize: "11px",
            textTransform: "uppercase",
            letterSpacing: "2px",
            marginBottom: "6px",
          }}
        >
          AI Receipt Engine
        </div>

        <div
          style={{
            color: "#2ee66b",
            fontWeight: 700,
            fontSize: "16px",
          }}
        >
          Uses Selected Currency
        </div>

      </div>

    </div>



    {/* Tesla Helper Panel */}

    <div
      style={{
        marginTop: "22px",
        display: "flex",
        gap: "18px",
        alignItems: "flex-start",
        background: "#111111",
        border: "1px solid rgba(255,255,255,.05)",
        borderRadius: "16px",
        padding: "18px",
      }}
    >

      <div
        style={{
          width: "48px",
          height: "48px",
          borderRadius: "14px",
          background: "#191919",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: "22px",
        }}
      >
        🤖
      </div>

      <div>

        <div
          style={{
            color: "#ffffff",
            fontWeight: 600,
            marginBottom: "8px",
          }}
        >
          RuachAgent AI Recommendation
        </div>

        <div
          style={{
            color: "#8b8b8b",
            lineHeight: "1.8",
            fontSize: "14px",
          }}
        >
          Configure the currency that your customers see most
          often. This ensures AI-generated receipts, promotional
          vouchers, loyalty rewards and future analytics remain
          consistent across every connected sales channel.
        </div>

      </div>

    </div>

  </div>

</div>

{/* ==========================================================
    PART 1C.3
    AI DISCOUNT COMPILER
    (Existing settings.discount_percentage logic preserved)
========================================================== */}

<div
  style={{
    marginTop: "28px",
    background: "linear-gradient(180deg,#131313,#0d0d0d)",
    border: "1px solid rgba(255,255,255,.06)",
    borderRadius: "22px",
    overflow: "hidden",
  }}
>

  {/* =======================================================
      HEADER
  ======================================================= */}

  <div
    style={{
      padding: "22px 26px",
      borderBottom: "1px solid rgba(255,255,255,.06)",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    }}
  >

    <div>

      <div
        style={{
          fontSize: "11px",
          letterSpacing: "2px",
          color: "#7b7b7b",
          textTransform: "uppercase",
          marginBottom: "8px",
        }}
      >
        AI Pricing Engine
      </div>

      <div
        style={{
          color: "#ffffff",
          fontSize: "20px",
          fontWeight: 700,
        }}
      >
        AI Discount Compiler
      </div>

    </div>

    <div
      style={{
        width: "58px",
        height: "58px",
        borderRadius: "18px",
        background: "#171717",
        border: "1px solid rgba(255,255,255,.08)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontSize: "28px",
      }}
    >
      🏷️
    </div>

  </div>



  {/* =======================================================
      CONTENT
  ======================================================= */}

  <div
    style={{
      padding: "28px",
    }}
  >

    <div
      style={{
        color: "#8b8b8b",
        fontSize: "14px",
        lineHeight: "1.8",
        marginBottom: "24px",
      }}
    >
      Configure the default discount percentage used by
      RuachAgent AI when generating promotional vouchers,
      loyalty campaigns and intelligent customer incentives.
    </div>

    {/* =======================================================
        INPUT
    ======================================================= */}

    <div>

      <label
        htmlFor="discount-percentage"
        style={{
          display: "block",
          marginBottom: "10px",
          color: "#d5d5d5",
          fontWeight: 600,
          fontSize: "13px",
        }}
      >
        Default AI Discount Percentage
      </label>

      <div
        style={{
          position: "relative",
        }}
      >

        {/* ===== EXISTING BACKEND LOGIC (UNCHANGED) ===== */}

        <input
          id="discount-percentage"
          name="discount_percentage"
          type="number"
          min="0"
          max="100"
          value={settings?.discount_percentage ?? 10}
          onChange={(e) => {
            const val = parseInt(e.target.value) || 0;

            setSettings(prev => ({
              ...prev,
              discount_percentage: val,
            }));
          }}
          style={{
            width: "100%",
            padding: "16px 60px 16px 18px",
            background: "#151515",
            border: "1px solid #2b2b2b",
            borderRadius: "16px",
            color: "#ffffff",
            fontSize: "16px",
            outline: "none",
          }}
        />

        <div
          style={{
            position: "absolute",
            right: "18px",
            top: "50%",
            transform: "translateY(-50%)",
            color: "#7d7d7d",
            fontWeight: 700,
            fontSize: "16px",
          }}
        >
          %
        </div>

      </div>

    </div>



    {/* =======================================================
        LIVE VALUE
    ======================================================= */}

    <div
      style={{
        marginTop: "22px",
        display: "grid",
        gridTemplateColumns: "1fr auto",
        gap: "20px",
        alignItems: "center",
        background: "#151515",
        border: "1px solid rgba(255,255,255,.06)",
        borderRadius: "18px",
        padding: "22px",
      }}
    >

      <div>

        <div
          style={{
            color: "#6e6e6e",
            fontSize: "11px",
            textTransform: "uppercase",
            letterSpacing: "2px",
            marginBottom: "8px",
          }}
        >
          Current AI Discount
        </div>

        <div
          style={{
            color: "#ffffff",
            fontSize: "30px",
            fontWeight: 700,
          }}
        >
          {settings?.discount_percentage ?? 10}%
        </div>

      </div>

      <div
        style={{
          width: "70px",
          height: "70px",
          borderRadius: "20px",
          background: "#1b1b1b",
          border: "1px solid rgba(255,255,255,.06)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: "34px",
        }}
      >
        💰
      </div>

    </div>



    {/* =======================================================
        AI ANALYSIS PANEL
    ======================================================= */}

    <div
      style={{
        marginTop: "24px",
        background: "#111111",
        border: "1px solid rgba(255,255,255,.05)",
        borderRadius: "18px",
        padding: "22px",
      }}
    >

      <div
        style={{
          color: "#ffffff",
          fontWeight: 600,
          marginBottom: "14px",
        }}
      >
        🤖 Google GenAI Recommendation
      </div>

      <div
        style={{
          color: "#8d8d8d",
          lineHeight: "1.8",
          fontSize: "14px",
        }}
      >
        RuachAgent AI uses this percentage as the default starting
        point when generating personalised promotions. The AI may
        recommend different discounts in future based on customer
        behaviour, purchase history, seasonal trends and loyalty
        performance.
      </div>

    </div>



    {/* =======================================================
        QUICK PRESETS
    ======================================================= */}

    <div
      style={{
        marginTop: "24px",
      }}
    >

      <div
        style={{
          color: "#6f6f6f",
          fontSize: "11px",
          letterSpacing: "2px",
          textTransform: "uppercase",
          marginBottom: "14px",
        }}
      >
        Suggested Presets
      </div>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >

        {[5, 10, 15, 20, 25].map((value) => (

          <button
            key={value}
            type="button"
            onClick={() =>
              setSettings(prev => ({
                ...prev,
                discount_percentage: value,
              }))
            }
            style={{
              padding: "11px 18px",
              borderRadius: "999px",
              background:
                settings?.discount_percentage === value
                  ? "#ffffff"
                  : "#191919",
              color:
                settings?.discount_percentage === value
                  ? "#000"
                  : "#d0d0d0",
              border: "1px solid rgba(255,255,255,.08)",
              cursor: "pointer",
              transition: ".25s",
              fontWeight: 600,
            }}
          >
            {value}%
          </button>

        ))}

      </div>

    </div>

  </div>

</div>

{/* ==========================================================
    PART 1C.4
    TESLA VOUCHER EXPIRATION POLICY
    Existing backend logic preserved unchanged
========================================================== */}

<div
  style={{
    marginTop: "28px",
    background: "linear-gradient(180deg,#131313 0%,#0d0d0d 100%)",
    border: "1px solid rgba(255,255,255,.06)",
    borderRadius: "22px",
    overflow: "hidden",
    boxShadow: "0 16px 40px rgba(0,0,0,.35)",
  }}
>

  {/* =======================================================
      HEADER
  ======================================================= */}

  <div
    style={{
      padding: "24px 28px",
      borderBottom: "1px solid rgba(255,255,255,.06)",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    }}
  >

    <div>

      <div
        style={{
          fontSize: "11px",
          color: "#7d7d7d",
          letterSpacing: "2px",
          textTransform: "uppercase",
          marginBottom: "8px",
        }}
      >
        Customer Rewards
      </div>

      <div
        style={{
          color: "#ffffff",
          fontWeight: 700,
          fontSize: "20px",
        }}
      >
        Voucher Expiration Policy
      </div>

    </div>

    <div
      style={{
        width: "58px",
        height: "58px",
        borderRadius: "18px",
        background: "#171717",
        border: "1px solid rgba(255,255,255,.08)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontSize: "28px",
      }}
    >
      🎟️
    </div>

  </div>



  {/* =======================================================
      CONTENT
  ======================================================= */}

  <div
    style={{
      padding: "28px",
    }}
  >

    <div
      style={{
        color: "#8c8c8c",
        fontSize: "14px",
        lineHeight: "1.8",
        marginBottom: "24px",
      }}
    >
      Configure how many days customer vouchers remain valid after
      being generated. RuachAgent AI uses this setting when creating
      promotional rewards and loyalty campaigns.
    </div>

    {/* =======================================================
        INPUT
    ======================================================= */}

    <div>

      <label
        htmlFor="voucher-expiry-days"
        style={{
          display: "block",
          marginBottom: "10px",
          color: "#dadada",
          fontSize: "13px",
          fontWeight: 600,
        }}
      >
        Voucher Expiration Period
      </label>

      <div
        style={{
          position: "relative",
        }}
      >

        {/* ========= EXISTING BACKEND LOGIC (UNCHANGED) ========= */}

        <input
          id="voucher-expiry-days"
          name="voucher_expiration_days"
          type="number"
          min="1"
          placeholder="e.g. 30"
          value={settings?.voucher_expiration_days ?? 30}
          onChange={(e) => {
            const val = parseInt(e.target.value) || 0;

            setSettings(prev => ({
              ...prev,
              voucher_expiration_days: val,
            }));
          }}
          style={{
            width: "100%",
            padding: "16px 90px 16px 18px",
            background: "#151515",
            border: "1px solid #2b2b2b",
            borderRadius: "16px",
            color: "#ffffff",
            fontSize: "16px",
            outline: "none",
          }}
        />

        <div
          style={{
            position: "absolute",
            right: "18px",
            top: "50%",
            transform: "translateY(-50%)",
            color: "#7b7b7b",
            fontWeight: 600,
            fontSize: "14px",
          }}
        >
          DAYS
        </div>

      </div>

    </div>



    {/* =======================================================
        LIVE POLICY SUMMARY
    ======================================================= */}

    <div
      style={{
        marginTop: "24px",
        background: "#151515",
        border: "1px solid rgba(255,255,255,.06)",
        borderRadius: "18px",
        padding: "22px",
        display: "grid",
        gridTemplateColumns: "1fr auto",
        alignItems: "center",
        gap: "20px",
      }}
    >

      <div>

        <div
          style={{
            color: "#6d6d6d",
            fontSize: "11px",
            letterSpacing: "2px",
            textTransform: "uppercase",
            marginBottom: "8px",
          }}
        >
          Current Expiration
        </div>

        <div
          style={{
            color: "#ffffff",
            fontWeight: 700,
            fontSize: "30px",
          }}
        >
          {settings?.voucher_expiration_days ?? 30} Days
        </div>

      </div>

      <div
        style={{
          width: "70px",
          height: "70px",
          borderRadius: "20px",
          background: "#1b1b1b",
          border: "1px solid rgba(255,255,255,.06)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: "34px",
        }}
      >
        ⏳
      </div>

    </div>



    {/* =======================================================
        GOOGLE GENAI INSIGHT
    ======================================================= */}

    <div
      style={{
        marginTop: "24px",
        background: "#111111",
        border: "1px solid rgba(255,255,255,.05)",
        borderRadius: "18px",
        padding: "22px",
      }}
    >

      <div
        style={{
          color: "#ffffff",
          fontWeight: 600,
          marginBottom: "14px",
        }}
      >
        🤖 Google GenAI Insight
      </div>

      <div
        style={{
          color: "#8d8d8d",
          fontSize: "14px",
          lineHeight: "1.8",
        }}
      >
        Voucher expiry directly influences redemption rates.
        Shorter periods encourage urgency, while longer periods
        typically increase customer satisfaction and repeat visits.
        Future versions of RuachAgent AI can automatically optimise
        this value based on redemption analytics.
      </div>

    </div>



    {/* =======================================================
        QUICK PRESETS
    ======================================================= */}

    <div
      style={{
        marginTop: "26px",
      }}
    >

      <div
        style={{
          color: "#6f6f6f",
          fontSize: "11px",
          letterSpacing: "2px",
          textTransform: "uppercase",
          marginBottom: "14px",
        }}
      >
        Quick Presets
      </div>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >

        {[7, 14, 30, 60, 90].map((days) => (

          <button
            key={days}
            type="button"
            onClick={() =>
              setSettings(prev => ({
                ...prev,
                voucher_expiration_days: days,
              }))
            }
            style={{
              padding: "11px 18px",
              borderRadius: "999px",
              border: "1px solid rgba(255,255,255,.08)",
              background:
                settings?.voucher_expiration_days === days
                  ? "#ffffff"
                  : "#191919",
              color:
                settings?.voucher_expiration_days === days
                  ? "#000000"
                  : "#d7d7d7",
              cursor: "pointer",
              fontWeight: 600,
              transition: ".25s",
            }}
          >
            {days} Days
          </button>

        ))}

      </div>

    </div>



    {/* =======================================================
        TESLA AI RECOMMENDATION BAR
    ======================================================= */}

    <div
      style={{
        marginTop: "26px",
        padding: "18px 20px",
        borderRadius: "16px",
        background:
          "linear-gradient(90deg,#111111,#161616)",
        border: "1px solid rgba(255,255,255,.05)",
        display: "flex",
        alignItems: "center",
        gap: "16px",
      }}
    >

      <div
        style={{
          width: "44px",
          height: "44px",
          borderRadius: "14px",
          background: "#1b1b1b",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: "22px",
        }}
      >
        💡
      </div>

      <div>

        <div
          style={{
            color: "#ffffff",
            fontWeight: 600,
            marginBottom: "5px",
          }}
        >
          AI Recommendation
        </div>

        <div
          style={{
            color: "#8b8b8b",
            fontSize: "13px",
            lineHeight: "1.7",
          }}
        >
          A 30-day expiration provides an excellent balance between
          urgency and customer convenience for most retail businesses.
        </div>

      </div>

    </div>

  </div>

</div>

{/* ==========================================================
    PART 1C.5
    TESLA AI RECOMMENDATIONS
    Live Configuration Summary
========================================================== */}

<div
  style={{
    marginTop: "30px",
    display: "grid",
    gridTemplateColumns: "2fr 1fr",
    gap: "24px",
    alignItems: "stretch",
  }}
>

  {/* =======================================================
      GOOGLE GENAI RECOMMENDATIONS PANEL
  ======================================================= */}

  <div
    style={{
      background: "linear-gradient(180deg,#111111,#0b0b0b)",
      border: "1px solid rgba(255,255,255,.06)",
      borderRadius: "22px",
      overflow: "hidden",
    }}
  >

    {/* Header */}

    <div
      style={{
        padding: "24px 28px",
        borderBottom: "1px solid rgba(255,255,255,.06)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >

      <div>

        <div
          style={{
            fontSize: "11px",
            color: "#6f6f6f",
            letterSpacing: "2px",
            textTransform: "uppercase",
            marginBottom: "8px",
          }}
        >
          Artificial Intelligence
        </div>

        <div
          style={{
            color: "#ffffff",
            fontWeight: 700,
            fontSize: "22px",
          }}
        >
          Google GenAI Recommendations
        </div>

      </div>

      <div
        style={{
          width: "60px",
          height: "60px",
          borderRadius: "18px",
          background: "#171717",
          border: "1px solid rgba(255,255,255,.06)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: "30px",
        }}
      >
        🧠
      </div>

    </div>



    {/* AI Cards */}

    <div
      style={{
        padding: "24px",
        display: "grid",
        gap: "18px",
      }}
    >

      {[
        {
          icon: "💰",
          title: "Discount Strategy",
          body:
            "Your current discount configuration is ideal for everyday promotional campaigns.",
        },
        {
          icon: "🎟️",
          title: "Voucher Lifetime",
          body:
            "Current expiration period offers a healthy balance between urgency and customer convenience.",
        },
        {
          icon: "🌍",
          title: "Regional Compatibility",
          body:
            "Your selected currency will automatically be used across receipts, AI promotions and loyalty vouchers.",
        },
        {
          icon: "📈",
          title: "Future Learning",
          body:
            "As RuachAgent AI gathers transaction history, recommendations will become increasingly personalized.",
        },
      ].map((item) => (

        <div
          key={item.title}
          style={{
            display: "flex",
            gap: "18px",
            alignItems: "flex-start",
            padding: "18px",
            borderRadius: "18px",
            background: "#151515",
            border: "1px solid rgba(255,255,255,.05)",
          }}
        >

          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "14px",
              background: "#1d1d1d",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: "22px",
            }}
          >
            {item.icon}
          </div>

          <div>

            <div
              style={{
                color: "#ffffff",
                fontWeight: 600,
                marginBottom: "8px",
              }}
            >
              {item.title}
            </div>

            <div
              style={{
                color: "#8d8d8d",
                fontSize: "14px",
                lineHeight: "1.8",
              }}
            >
              {item.body}
            </div>

          </div>

        </div>

      ))}

    </div>

  </div>



  {/* =======================================================
      LIVE CONFIGURATION SUMMARY
  ======================================================= */}

  <div
    style={{
      background: "linear-gradient(180deg,#111111,#090909)",
      border: "1px solid rgba(255,255,255,.06)",
      borderRadius: "22px",
      overflow: "hidden",
    }}
  >

    {/* Header */}

    <div
      style={{
        padding: "22px 24px",
        borderBottom: "1px solid rgba(255,255,255,.06)",
      }}
    >

      <div
        style={{
          fontSize: "11px",
          color: "#6d6d6d",
          letterSpacing: "2px",
          textTransform: "uppercase",
          marginBottom: "8px",
        }}
      >
        Live Summary
      </div>

      <div
        style={{
          color: "#ffffff",
          fontSize: "21px",
          fontWeight: 700,
        }}
      >
        Configuration
      </div>

    </div>



    {/* Summary Body */}

    <div
      style={{
        padding: "24px",
        display: "grid",
        gap: "18px",
      }}
    >

      {/* Currency */}

      <div
        style={{
          background: "#151515",
          borderRadius: "18px",
          padding: "18px",
          border: "1px solid rgba(255,255,255,.05)",
        }}
      >
        <div
          style={{
            color: "#6d6d6d",
            fontSize: "11px",
            letterSpacing: "2px",
            textTransform: "uppercase",
            marginBottom: "8px",
          }}
        >
          Currency
        </div>

        <div
          style={{
            color: "#ffffff",
            fontWeight: 700,
            fontSize: "18px",
          }}
        >
          {settings?.currency || "ZAR"}
        </div>
      </div>



      {/* Discount */}

      <div
        style={{
          background: "#151515",
          borderRadius: "18px",
          padding: "18px",
          border: "1px solid rgba(255,255,255,.05)",
        }}
      >
        <div
          style={{
            color: "#6d6d6d",
            fontSize: "11px",
            letterSpacing: "2px",
            textTransform: "uppercase",
            marginBottom: "8px",
          }}
        >
          AI Discount
        </div>

        <div
          style={{
            color: "#ffffff",
            fontWeight: 700,
            fontSize: "18px",
          }}
        >
          {settings?.discount_percentage ?? 10}%
        </div>
      </div>



      {/* Voucher */}

      <div
        style={{
          background: "#151515",
          borderRadius: "18px",
          padding: "18px",
          border: "1px solid rgba(255,255,255,.05)",
        }}
      >
        <div
          style={{
            color: "#6d6d6d",
            fontSize: "11px",
            letterSpacing: "2px",
            textTransform: "uppercase",
            marginBottom: "8px",
          }}
        >
          Voucher Expiry
        </div>

        <div
          style={{
            color: "#ffffff",
            fontWeight: 700,
            fontSize: "18px",
          }}
        >
          {settings?.voucher_expiration_days ?? 30} Days
        </div>
      </div>



      {/* AI Status */}

      <div
        style={{
          marginTop: "10px",
          padding: "18px",
          borderRadius: "18px",
          background:
            "linear-gradient(180deg,#151515,#111111)",
          border: "1px solid rgba(255,255,255,.05)",
        }}
      >

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "12px",
          }}
        >

          <div
            style={{
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              background: "#32e46e",
              boxShadow:
                "0 0 12px rgba(50,228,110,.6)",
            }}
          />

          <div
            style={{
              color: "#32e46e",
              fontWeight: 700,
            }}
          >
            AI Ready
          </div>

        </div>

        <div
          style={{
            color: "#8a8a8a",
            fontSize: "13px",
            lineHeight: "1.8",
          }}
        >
          Google GenAI has everything required to generate
          intelligent receipts, personalized vouchers and
          customer recommendations.
        </div>

      </div>

    </div>

  </div>

</div>

{/* ==========================================================
    PART 1C.6
    TESLA SAVE & SYNC FOOTER
    Existing handleSave() logic preserved
========================================================== */}

<div
  style={{
    marginTop: "36px",
    background: "linear-gradient(180deg,#111111,#090909)",
    border: "1px solid rgba(255,255,255,.06)",
    borderRadius: "24px",
    overflow: "hidden",
    boxShadow: "0 20px 60px rgba(0,0,0,.35)",
  }}
>

  {/* ==========================================================
      Header
  ========================================================== */}

  <div
    style={{
      padding: "24px 30px",
      borderBottom: "1px solid rgba(255,255,255,.06)",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      flexWrap: "wrap",
      gap: "18px",
    }}
  >

    <div>

      <div
        style={{
          fontSize: "11px",
          color: "#707070",
          letterSpacing: "2px",
          textTransform: "uppercase",
          marginBottom: "8px",
        }}
      >
        Deployment Center
      </div>

      <div
        style={{
          color: "#ffffff",
          fontSize: "24px",
          fontWeight: 700,
        }}
      >
        Save & Sync Agent Configuration
      </div>

      <div
        style={{
          color: "#8a8a8a",
          marginTop: "8px",
          fontSize: "14px",
          lineHeight: "1.8",
          maxWidth: "720px",
        }}
      >
        Save your Business Identity, Google GenAI configuration,
        webhook information and AI parameters. Changes are synchronized
        with your RuachAgent workspace immediately.
      </div>

    </div>

    <div
      style={{
        padding: "10px 18px",
        borderRadius: "999px",
        background: "#171717",
        border: "1px solid rgba(255,255,255,.06)",
        color: "#42e37d",
        fontWeight: 600,
        display: "flex",
        alignItems: "center",
        gap: "10px",
      }}
    >

      <div
        style={{
          width: "10px",
          height: "10px",
          borderRadius: "50%",
          background: "#42e37d",
          boxShadow: "0 0 12px rgba(66,227,125,.6)",
        }}
      />

      Configuration Ready

    </div>

  </div>



  {/* ==========================================================
      Summary Cards
  ========================================================== */}

  <div
    style={{
      padding: "28px 30px",
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))",
      gap: "18px",
    }}
  >

    {[
      {
        title: "Business",
        value: settings?.business_name || "Not configured",
        icon: "🏢",
      },
      {
        title: "Currency",
        value: settings?.currency || "ZAR",
        icon: "💱",
      },
      {
        title: "Discount",
        value: `${settings?.discount_percentage ?? 10}%`,
        icon: "🎯",
      },
      {
        title: "Voucher",
        value: `${settings?.voucher_expiration_days ?? 30} Days`,
        icon: "🎟️",
      },
    ].map((item) => (

      <div
        key={item.title}
        style={{
          background: "#151515",
          border: "1px solid rgba(255,255,255,.05)",
          borderRadius: "18px",
          padding: "20px",
        }}
      >

        <div
          style={{
            fontSize: "28px",
            marginBottom: "14px",
          }}
        >
          {item.icon}
        </div>

        <div
          style={{
            color: "#727272",
            fontSize: "11px",
            letterSpacing: "2px",
            textTransform: "uppercase",
            marginBottom: "8px",
          }}
        >
          {item.title}
        </div>

        <div
          style={{
            color: "#ffffff",
            fontWeight: 600,
            fontSize: "17px",
            wordBreak: "break-word",
          }}
        >
          {item.value}
        </div>

      </div>

    ))}

  </div>



  {/* ==========================================================
      Footer Actions
  ========================================================== */}

  <div
    style={{
      padding: "28px 30px",
      borderTop: "1px solid rgba(255,255,255,.06)",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      flexWrap: "wrap",
      gap: "20px",
    }}
  >

    {/* Left */}

    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "18px",
      }}
    >

      <div
        style={{
          width: "54px",
          height: "54px",
          borderRadius: "16px",
          background: "#171717",
          border: "1px solid rgba(255,255,255,.06)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: "24px",
        }}
      >
        🤖
      </div>

      <div>

        <div
          style={{
            color: "#ffffff",
            fontWeight: 600,
            marginBottom: "6px",
          }}
        >
          Ready to Synchronize
        </div>

        <div
          style={{
            color: "#818181",
            fontSize: "13px",
            lineHeight: "1.7",
          }}
        >
          Your changes will become immediately available
          across receipts, vouchers, AI promotions and
          connected stores.
        </div>

      </div>

    </div>



    {/* Right */}

    <div
      style={{
        display: "flex",
        gap: "14px",
        flexWrap: "wrap",
      }}
    >

      {/* Placeholder */}

      <button
        type="button"
        style={{
          background: "#171717",
          border: "1px solid rgba(255,255,255,.08)",
          color: "#bfbfbf",
          padding: "15px 22px",
          borderRadius: "14px",
          cursor: "pointer",
          fontWeight: 600,
          transition: ".25s",
        }}
      >
        Preview Changes
      </button>



      {/* Existing Save Logic */}

      <button
        type="button"
        disabled={isSaveSyncing}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();

          if (!isSaveSyncing) {
            handleSave(e);
          }
        }}
        style={{
          background: isSaveSyncing
            ? "#1a1a1a"
            : "#ffffff",

          color: isSaveSyncing
            ? "#666666"
            : "#000000",

          border: "none",

          borderRadius: "14px",

          padding: "16px 34px",

          fontSize: "15px",

          fontWeight: 700,

          letterSpacing: ".5px",

          cursor: isSaveSyncing
            ? "not-allowed"
            : "pointer",

          transition: ".25s",

          minWidth: "250px",

          boxShadow: isSaveSyncing
            ? "none"
            : "0 12px 35px rgba(255,255,255,.12)",
        }}
      >

        {isSaveSyncing ? (
          <span
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "12px",
            }}
          >

            <span
              style={{
                width: "16px",
                height: "16px",
                border: "2px solid #555",
                borderTopColor: "#fff",
                borderRadius: "50%",
                animation: "spin 1s linear infinite",
              }}
            />

            Synchronizing Agent...

          </span>
        ) : (
          "Save & Sync Live Profile"
        )}

      </button>

    </div>

  </div>

</div>

{/* Spinner Animation */}

<style>
{`
@keyframes spin{
    from{
        transform:rotate(0deg);
    }
    to{
        transform:rotate(360deg);
    }
}
`}
</style>

// The rest can go here.

</div>

        </div>
      </div>
    </div>
  );
}
