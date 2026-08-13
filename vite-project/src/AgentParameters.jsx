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
        minHeight: '100vh',
        width: '100%',
        background: '#05070a',
        color: '#ffffff',
        position: 'relative',
        overflowX: 'hidden',
        fontFamily:
          'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      }}
    >
      {/* =========================================================
        TESLA ATMOSPHERIC LIGHTING
    ========================================================= */}

      <div
        style={{
          position: 'fixed',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 0,
          background:
            'radial-gradient(circle at 72% 8%, rgba(0,122,255,0.075), transparent 25%), radial-gradient(circle at 20% 80%, rgba(0,80,255,0.045), transparent 30%), linear-gradient(180deg, #05070a 0%, #070a0f 100%)',
        }}
      />

      <div
        style={{
          position: 'fixed',
          top: '-180px',
          right: '-140px',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(0,132,255,0.11), rgba(0,132,255,0.025) 38%, transparent 72%)',
          filter: 'blur(10px)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      <div
        style={{
          position: 'fixed',
          bottom: '-220px',
          left: '-160px',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(0,85,255,0.07), transparent 68%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* =========================================================
        MAIN APP SHELL
        Sidebar + Header remain visually persistent
    ========================================================= */}

      <div
        style={{
          position: 'relative',
          zIndex: 1,
          minHeight: '100vh',
          display: 'flex',
        }}
      >

        {/* =======================================================
          LEFT SIDEBAR
          Keep your existing sidebar navigation here.
          Replace ONLY the onClick destinations if your existing
          AdminPanel navigation uses different handlers.
      ======================================================= */}

        <aside
          style={{
            width: '238px',
            minWidth: '238px',
            minHeight: '100vh',
            background:
              'linear-gradient(180deg, rgba(7,10,14,0.98), rgba(4,6,9,0.99))',
            borderRight: '1px solid rgba(70,95,120,0.20)',
            boxShadow:
              '18px 0 60px rgba(0,0,0,0.30), inset -1px 0 0 rgba(255,255,255,0.025)',
            padding: '24px 14px',
            position: 'sticky',
            top: 0,
            height: '100vh',
            boxSizing: 'border-box',
            overflowY: 'auto',
          }}
        >
          {/* BRAND */}
          <div
            style={{
              padding: '4px 10px 28px',
              borderBottom: '1px solid rgba(255,255,255,0.045)',
              marginBottom: '22px',
            }}
          >
            <div
              style={{
                fontSize: '15px',
                fontWeight: '700',
                letterSpacing: '1.5px',
                color: '#ffffff',
              }}
            >
              RUACH<span style={{ color: '#2f9cff' }}>AGENT</span>
            </div>

            <div
              style={{
                marginTop: '5px',
                fontSize: '8px',
                color: '#56616d',
                letterSpacing: '1.8px',
                textTransform: 'uppercase',
              }}
            >
              Autonomous Commerce Intelligence
            </div>
          </div>

          {/* SIDEBAR SECTION */}
          <div
            style={{
              padding: '0 10px',
              marginBottom: '9px',
              fontSize: '8px',
              fontWeight: '700',
              color: '#3e4852',
              letterSpacing: '1.5px',
              textTransform: 'uppercase',
            }}
          >
            Workspace
          </div>

          {/* DASHBOARD */}
          <button
            type="button"
            onClick={() => {
              if (typeof onNavigate === 'function') {
                onNavigate('dashboard');
              }
            }}
            style={{
              width: '100%',
              border: 'none',
              background: 'transparent',
              color: '#68737f',
              padding: '11px 12px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '11px',
              cursor: 'pointer',
              textAlign: 'left',
              fontSize: '11px',
            }}
          >
            <span style={{ fontSize: '13px' }}>⌂</span>
            Dashboard
          </button>

          {/* SAVED DESIGNS */}
          <button
            type="button"
            onClick={() => {
              if (typeof onNavigate === 'function') {
                onNavigate('saved-designs');
              }
            }}
            style={{
              width: '100%',
              border: 'none',
              background: 'transparent',
              color: '#68737f',
              padding: '11px 12px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '11px',
              cursor: 'pointer',
              textAlign: 'left',
              fontSize: '11px',
            }}
          >
            <span style={{ fontSize: '13px' }}>◇</span>
            Saved Designs
          </button>

          {/* CONNECTED STORES */}
          <button
            type="button"
            onClick={() => {
              if (typeof onNavigate === 'function') {
                onNavigate('connected-stores');
              }
            }}
            style={{
              width: '100%',
              border: 'none',
              background: 'transparent',
              color: '#68737f',
              padding: '11px 12px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '11px',
              cursor: 'pointer',
              textAlign: 'left',
              fontSize: '11px',
            }}
          >
            <span style={{ fontSize: '13px' }}>⇄</span>
            Connected Stores
          </button>

          {/* TILL SLIPS SENT */}
          <button
            type="button"
            onClick={() => {
              if (typeof onNavigate === 'function') {
                onNavigate('till-slips-sent');
              }
            }}
            style={{
              width: '100%',
              border: 'none',
              background: 'transparent',
              color: '#68737f',
              padding: '11px 12px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '11px',
              cursor: 'pointer',
              textAlign: 'left',
              fontSize: '11px',
            }}
          >
            <span style={{ fontSize: '13px' }}>▤</span>
            Till Slips Sent
          </button>

          {/* ACTIVE PARAMETERS */}
          <button
            type="button"
            style={{
              width: '100%',
              border: '1px solid rgba(0,145,255,0.25)',
              background:
                'linear-gradient(90deg, rgba(0,120,255,0.13), rgba(0,80,160,0.035))',
              color: '#ffffff',
              padding: '11px 12px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '11px',
              cursor: 'default',
              textAlign: 'left',
              fontSize: '11px',
              boxShadow:
                '0 0 20px rgba(0,110,255,0.07), inset 0 0 18px rgba(0,120,255,0.025)',
            }}
          >
            <span
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: '#249cff',
                boxShadow: '0 0 10px rgba(36,156,255,0.9)',
              }}
            />
            Agent Parameters
          </button>

          <div
            style={{
              margin: '24px 10px 10px',
              height: '1px',
              background: 'rgba(255,255,255,0.045)',
            }}
          />

          <div
            style={{
              padding: '0 10px',
              marginBottom: '9px',
              fontSize: '8px',
              fontWeight: '700',
              color: '#3e4852',
              letterSpacing: '1.5px',
              textTransform: 'uppercase',
            }}
          >
            System
          </div>

          <button
            type="button"
            onClick={() => {
              if (typeof onNavigate === 'function') {
                onNavigate('settings');
              }
            }}
            style={{
              width: '100%',
              border: 'none',
              background: 'transparent',
              color: '#68737f',
              padding: '11px 12px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '11px',
              cursor: 'pointer',
              textAlign: 'left',
              fontSize: '11px',
            }}
          >
            <span style={{ fontSize: '13px' }}>⚙</span>
            Settings
          </button>

          {/* SIDEBAR SYSTEM FOOTER */}
          <div
            style={{
              marginTop: 'auto',
              padding: '18px 10px 0',
            }}
          >
            <div
              style={{
                border: '1px solid rgba(60,78,95,0.22)',
                borderRadius: '9px',
                padding: '12px',
                background: 'rgba(255,255,255,0.015)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '7px',
                  fontSize: '8px',
                  color: '#77828d',
                  letterSpacing: '1px',
                  textTransform: 'uppercase',
                }}
              >
                <span
                  style={{
                    width: '5px',
                    height: '5px',
                    borderRadius: '50%',
                    background: '#29d391',
                    boxShadow: '0 0 9px rgba(41,211,145,0.8)',
                  }}
                />
                Agent Core Online
              </div>

              <div
                style={{
                  marginTop: '8px',
                  fontSize: '8px',
                  color: '#3f4a54',
                  lineHeight: '1.5',
                }}
              >
                Configuration changes are synchronized through your
                existing business settings backend.
              </div>
            </div>
          </div>
        </aside>

        {/* =======================================================
          RIGHT APPLICATION AREA
      ======================================================= */}

        <main
          style={{
            flex: 1,
            minWidth: 0,
            minHeight: '100vh',
            position: 'relative',
          }}
        >

          {/* =====================================================
            PREMIUM HEADER
        ===================================================== */}

          <header
            style={{
              height: '76px',
              padding: '0 34px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '1px solid rgba(70,95,120,0.16)',
              background: 'rgba(5,7,10,0.72)',
              backdropFilter: 'blur(22px)',
              WebkitBackdropFilter: 'blur(22px)',
              position: 'sticky',
              top: 0,
              zIndex: 20,
            }}
          >
            <div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                }}
              >
                <div
                  style={{
                    width: '3px',
                    height: '22px',
                    borderRadius: '5px',
                    background: '#239cff',
                    boxShadow: '0 0 15px rgba(35,156,255,0.85)',
                  }}
                />

                <h1
                  style={{
                    margin: 0,
                    fontSize: '19px',
                    fontWeight: '500',
                    letterSpacing: '-0.3px',
                    color: '#f5f7fa',
                  }}
                >
                  Agent Parameters
                </h1>
              </div>

              <div
                style={{
                  marginLeft: '13px',
                  marginTop: '4px',
                  color: '#58636e',
                  fontSize: '9px',
                  letterSpacing: '0.7px',
                }}
              >
                Configure your RuachAgent commerce intelligence environment
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
              }}
            >
              <div
                style={{
                  padding: '7px 10px',
                  border: '1px solid rgba(41,211,145,0.18)',
                  borderRadius: '6px',
                  background: 'rgba(41,211,145,0.035)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '7px',
                }}
              >
                <span
                  style={{
                    width: '5px',
                    height: '5px',
                    borderRadius: '50%',
                    background: '#29d391',
                    boxShadow: '0 0 9px rgba(41,211,145,0.9)',
                  }}
                />

                <span
                  style={{
                    fontSize: '8px',
                    color: '#8d9a9f',
                    letterSpacing: '1px',
                    textTransform: 'uppercase',
                  }}
                >
                  System Ready
                </span>
              </div>

              <div
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '50%',
                  border: '1px solid rgba(100,120,140,0.22)',
                  background:
                    'linear-gradient(145deg, rgba(255,255,255,0.08), rgba(255,255,255,0.015))',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#8b98a5',
                  fontSize: '12px',
                }}
              >
                RA
              </div>
            </div>
          </header>

          {/* =====================================================
            PAGE CONTENT
        ===================================================== */}

          <div
            style={{
              maxWidth: '1480px',
              margin: '0 auto',
              padding: '30px 34px 60px',
            }}
          >

            {/* ===================================================
              PAGE INTRO
          =================================================== */}

            <section
              style={{
                marginBottom: '24px',
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'space-between',
                gap: '20px',
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: '8px',
                    color: '#258fff',
                    letterSpacing: '1.8px',
                    textTransform: 'uppercase',
                    marginBottom: '8px',
                    fontWeight: '700',
                  }}
                >
                  CONTROL CENTER / AGENT CONFIGURATION
                </div>

                <h2
                  style={{
                    margin: 0,
                    fontSize: '27px',
                    lineHeight: 1.15,
                    fontWeight: '500',
                    letterSpacing: '-0.8px',
                    color: '#f2f5f8',
                  }}
                >
                  Configure your intelligent commerce agent.
                </h2>

                <p
                  style={{
                    margin: '9px 0 0',
                    maxWidth: '650px',
                    color: '#64717d',
                    fontSize: '11px',
                    lineHeight: 1.6,
                  }}
                >
                  Manage your business identity, webhook infrastructure,
                  transaction rules and AI-powered voucher behavior from
                  one centralized control surface.
                </p>
              </div>

              <div
                style={{
                  minWidth: '180px',
                  padding: '12px 14px',
                  borderRadius: '9px',
                  border: '1px solid rgba(60,90,120,0.20)',
                  background:
                    'linear-gradient(145deg, rgba(255,255,255,0.035), rgba(255,255,255,0.008))',
                }}
              >
                <div
                  style={{
                    fontSize: '7px',
                    color: '#4d5965',
                    letterSpacing: '1.2px',
                    textTransform: 'uppercase',
                  }}
                >
                  Configuration Mode
                </div>

                <div
                  style={{
                    marginTop: '5px',
                    fontSize: '11px',
                    color: '#b9c4ce',
                    fontFamily: 'monospace',
                  }}
                >
                  LIVE / SYNCHRONIZED
                </div>
              </div>
            </section>

            {/* ===================================================
              METRICS ROW
          =================================================== */}

            <section
              style={{
                display: 'grid',
                gridTemplateColumns:
                  'repeat(4, minmax(0, 1fr))',
                gap: '12px',
                marginBottom: '18px',
              }}
            >
              {[
                {
                  label: 'AGENT STATUS',
                  value: 'ONLINE',
                  sub: 'Core operational',
                  icon: '◉',
                },
                {
                  label: 'CURRENCY',
                  value: settings?.currency || 'ZAR',
                  sub: 'Operational currency',
                  icon: '¤',
                },
                {
                  label: 'DISCOUNT ENGINE',
                  value: `${settings?.discount_percentage ?? 10}%`,
                  sub: 'AI compiler value',
                  icon: '%',
                },
                {
                  label: 'VOUCHER LIFE',
                  value: `${settings?.voucher_expiration_days ?? 30} DAYS`,
                  sub: 'Expiration policy',
                  icon: '◷',
                },
              ].map((metric) => (
                <div
                  key={metric.label}
                  style={{
                    position: 'relative',
                    minHeight: '94px',
                    padding: '16px',
                    borderRadius: '10px',
                    border: '1px solid rgba(66,88,110,0.22)',
                    background:
                      'linear-gradient(145deg, rgba(18,23,29,0.92), rgba(7,10,14,0.94))',
                    boxShadow:
                      'inset 0 1px 0 rgba(255,255,255,0.025), 0 15px 35px rgba(0,0,0,0.16)',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '1px',
                      background:
                        'linear-gradient(90deg, transparent, rgba(35,156,255,0.5), transparent)',
                    }}
                  />

                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '7px',
                        color: '#596571',
                        letterSpacing: '1.2px',
                        fontWeight: '700',
                      }}
                    >
                      {metric.label}
                    </span>

                    <span
                      style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '6px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#299cff',
                        background: 'rgba(20,130,255,0.06)',
                        border: '1px solid rgba(35,156,255,0.12)',
                        fontSize: '11px',
                      }}
                    >
                      {metric.icon}
                    </span>
                  </div>

                  <div
                    style={{
                      marginTop: '10px',
                      fontSize: '16px',
                      color: '#eef4f8',
                      fontWeight: '500',
                      fontFamily: 'monospace',
                      letterSpacing: '0.2px',
                    }}
                  >
                    {metric.value}
                  </div>

                  <div
                    style={{
                      marginTop: '4px',
                      fontSize: '8px',
                      color: '#46515c',
                    }}
                  >
                    {metric.sub}
                  </div>
                </div>
              ))}
            </section>

            {/* ===================================================
              MAIN DASHBOARD GRID
          =================================================== */}

            <section
              style={{
                display: 'grid',
                gridTemplateColumns:
                  'minmax(0, 1.05fr) minmax(0, 0.95fr)',
                gap: '16px',
                alignItems: 'start',
              }}
            >

              {/* =================================================
                BUSINESS IDENTITY CARD
            ================================================= */}

              <div
                style={{
                  position: 'relative',
                  borderRadius: '13px',
                  border: '1px solid rgba(65,88,112,0.25)',
                  background:
                    'linear-gradient(145deg, rgba(13,18,24,0.97), rgba(6,9,13,0.98))',
                  boxShadow:
                    '0 25px 70px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.025)',
                  overflow: 'hidden',
                }}
              >
                {/* BLUE TOP LIGHT */}
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: '8%',
                    right: '8%',
                    height: '1px',
                    background:
                      'linear-gradient(90deg, transparent, rgba(35,156,255,0.65), transparent)',
                    boxShadow: '0 0 18px rgba(35,156,255,0.3)',
                  }}
                />

                {/* CARD HEADER */}
                <div
                  style={{
                    padding: '20px 22px 17px',
                    borderBottom: '1px solid rgba(255,255,255,0.045)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: '7px',
                        color: '#258fff',
                        letterSpacing: '1.5px',
                        fontWeight: '700',
                      }}
                    >
                      MODULE 01
                    </div>

                    <h3
                      style={{
                        margin: '5px 0 0',
                        fontSize: '15px',
                        fontWeight: '500',
                        color: '#f1f4f7',
                        letterSpacing: '-0.2px',
                      }}
                    >
                      Business Identity
                    </h3>

                    <div
                      style={{
                        marginTop: '4px',
                        fontSize: '8px',
                        color: '#586570',
                      }}
                    >
                      Brand identity and commerce endpoint configuration
                    </div>
                  </div>

                  <div
                    style={{
                      padding: '6px 9px',
                      borderRadius: '5px',
                      border: '1px solid rgba(41,211,145,0.16)',
                      background: 'rgba(41,211,145,0.035)',
                      color: '#5fae8d',
                      fontSize: '7px',
                      letterSpacing: '0.8px',
                    }}
                  >
                    IDENTITY ACTIVE
                  </div>
                </div>

                <div
                  style={{
                    padding: '22px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '18px',
                  }}
                >

                  {/* LOGO UPLOAD */}
                  <div>
                    <div
                      style={{
                        fontSize: '7px',
                        color: '#68747f',
                        letterSpacing: '1.1px',
                        fontWeight: '700',
                        marginBottom: '9px',
                      }}
                    >
                      BRAND LOGO / RECEIPT PRINT ASSET
                    </div>

                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '105px minmax(0, 1fr)',
                        gap: '14px',
                      }}
                    >
                      {/* LOGO PREVIEW */}
                      <div
                        style={{
                          height: '105px',
                          borderRadius: '10px',
                          border: '1px solid rgba(65,90,115,0.30)',
                          background:
                            'linear-gradient(145deg, #10151b, #07090c)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          overflow: 'hidden',
                          position: 'relative',
                          boxShadow:
                            'inset 0 0 25px rgba(0,0,0,0.45)',
                        }}
                      >
                        <div
                          style={{
                            position: 'absolute',
                            inset: 0,
                            background:
                              'linear-gradient(135deg, rgba(35,156,255,0.05), transparent 50%)',
                            pointerEvents: 'none',
                          }}
                        />

                        {settings?.logo_url ? (
                          <img
                            src={settings.logo_url}
                            alt="Business Logo Preview"
                            style={{
                              width: '82%',
                              height: '82%',
                              objectFit: 'contain',
                              position: 'relative',
                              zIndex: 1,
                            }}
                          />
                        ) : (
                          <div
                            style={{
                              textAlign: 'center',
                              color: '#303b46',
                              fontSize: '25px',
                            }}
                          >
                            ◇
                            <div
                              style={{
                                marginTop: '4px',
                                fontSize: '6px',
                                letterSpacing: '1px',
                                color: '#424d58',
                              }}
                            >
                              NO LOGO
                            </div>
                          </div>
                        )}
                      </div>

                      {/* UPLOAD CONTROL */}
                      <div
                        style={{
                          border: '1px dashed rgba(70,105,135,0.32)',
                          borderRadius: '10px',
                          padding: '16px',
                          background:
                            'linear-gradient(145deg, rgba(255,255,255,0.018), rgba(255,255,255,0.005))',
                        }}
                      >
                        <div
                          style={{
                            fontSize: '10px',
                            color: '#d8e0e7',
                            fontWeight: '500',
                          }}
                        >
                          Receipt brand asset
                        </div>

                        <div
                          style={{
                            marginTop: '5px',
                            fontSize: '8px',
                            color: '#586571',
                            lineHeight: 1.5,
                          }}
                        >
                          Upload the logo that RuachAgent should use
                          when generating printable till slips.
                        </div>

                        <label
                          htmlFor="logo-upload"
                          style={{
                            marginTop: '14px',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '7px',
                            padding: '9px 13px',
                            borderRadius: '6px',
                            border: '1px solid rgba(35,156,255,0.38)',
                            background:
                              'linear-gradient(180deg, rgba(25,135,255,0.12), rgba(10,60,120,0.06))',
                            color: '#b9dfff',
                            fontSize: '8px',
                            letterSpacing: '0.7px',
                            cursor: 'pointer',
                            boxShadow:
                              '0 0 18px rgba(35,156,255,0.06)',
                          }}
                        >
                          + CHOOSE IMAGE

                          {/* EXISTING UPLOAD LOGIC PRESERVED */}
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

                        {settings?.logo_url && (
                          <div
                            style={{
                              marginTop: '10px',
                              fontSize: '7px',
                              color: '#4eaa84',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '5px',
                            }}
                          >
                            <span>●</span>
                            Logo asset loaded
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* BUSINESS NAME */}
                  <div>
                    <label
                      htmlFor="business-name"
                      style={{
                        display: 'block',
                        fontSize: '7px',
                        color: '#68747f',
                        letterSpacing: '1.1px',
                        fontWeight: '700',
                        marginBottom: '8px',
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
                        const val = e.target.value;

                        setSettings(prev => ({
                          ...prev,
                          business_name: val,
                        }));
                      }}
                      placeholder="Enter your business name"
                      style={{
                        ...styles.input,
                        width: '100%',
                        boxSizing: 'border-box',
                        padding: '13px 14px',
                        borderRadius: '7px',
                        fontSize: '10px',
                        fontFamily: 'monospace',
                        letterSpacing: '0.4px',
                        background: '#080c10',
                        border: '1px solid rgba(70,95,120,0.28)',
                        color: '#e8eef3',
                        outline: 'none',
                      }}
                    />
                  </div>

                  {/* STORE ADDRESS */}
                  <div>
                    <label
                      htmlFor="store-address"
                      style={{
                        display: 'block',
                        fontSize: '7px',
                        color: '#68747f',
                        letterSpacing: '1.1px',
                        fontWeight: '700',
                        marginBottom: '8px',
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
                        const val = e.target.value;

                        setSettings(prev => ({
                          ...prev,
                          store_address: val,
                        }));
                      }}
                      placeholder="Enter physical outlet address"
                      style={{
                        ...styles.input,
                        width: '100%',
                        boxSizing: 'border-box',
                        minHeight: '76px',
                        resize: 'vertical',
                        padding: '13px 14px',
                        borderRadius: '7px',
                        fontSize: '10px',
                        fontFamily: 'monospace',
                        letterSpacing: '0.35px',
                        lineHeight: 1.5,
                        background: '#080c10',
                        border: '1px solid rgba(70,95,120,0.28)',
                        color: '#e8eef3',
                        outline: 'none',
                      }}
                    />
                  </div>

                  {/* WEBHOOK */}
                  <div>
                    <label
                      htmlFor="webhook-slug"
                      style={{
                        display: 'block',
                        fontSize: '7px',
                        color: '#68747f',
                        letterSpacing: '1.1px',
                        fontWeight: '700',
                        marginBottom: '8px',
                      }}
                    >
                      LIVE WEBHOOK SLUG
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
                        width: '100%',
                        boxSizing: 'border-box',
                        padding: '13px 14px',
                        borderRadius: '7px',
                        fontSize: '10px',
                        fontFamily: 'monospace',
                        letterSpacing: '0.5px',
                        background: '#080c10',
                        border: '1px solid rgba(35,156,255,0.24)',
                        color: '#a9d8ff',
                        outline: 'none',
                      }}
                    />

                    {/* REQUIRED WEBHOOK BACKEND URL */}
                    <div
                      style={{
                        marginTop: '9px',
                        padding: '11px 12px',
                        borderRadius: '7px',
                        background: 'rgba(0,105,210,0.035)',
                        border:
                          '1px solid rgba(35,156,255,0.13)',
                      }}
                    >
                      <div
                        style={{
                          fontSize: '6px',
                          color: '#4e667b',
                          letterSpacing: '1px',
                          textTransform: 'uppercase',
                          marginBottom: '6px',
                        }}
                      >
                        LIVE RECEIPT AGENT ENDPOINT
                      </div>

                      <div
                        style={{
                          fontFamily: 'monospace',
                          fontSize: '8px',
                          lineHeight: 1.5,
                          color: settings?.webhook_slug
                            ? '#78bfff'
                            : '#46525e',
                          wordBreak: 'break-all',
                        }}
                      >
                        {settings?.webhook_slug
                          ? `https://agadjdvhqguunowplbak.functions.supabase.co/receipt-agent?slug=${settings.webhook_slug}`
                          : 'Define a unique webhook slug first...'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* =================================================
                AI CONFIGURATION CARD
            ================================================= */}

              <div
                style={{
                  position: 'relative',
                  borderRadius: '13px',
                  border: '1px solid rgba(65,88,112,0.25)',
                  background:
                    'linear-gradient(145deg, rgba(13,18,24,0.97), rgba(6,9,13,0.98))',
                  boxShadow:
                    '0 25px 70px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.025)',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: '8%',
                    right: '8%',
                    height: '1px',
                    background:
                      'linear-gradient(90deg, transparent, rgba(35,156,255,0.65), transparent)',
                    boxShadow: '0 0 18px rgba(35,156,255,0.3)',
                  }}
                />

                {/* AI HEADER */}
                <div
                  style={{
                    padding: '20px 22px 17px',
                    borderBottom: '1px solid rgba(255,255,255,0.045)',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontSize: '7px',
                          color: '#258fff',
                          letterSpacing: '1.5px',
                          fontWeight: '700',
                        }}
                      >
                        MODULE 02
                      </div>

                      <h3
                        style={{
                          margin: '5px 0 0',
                          fontSize: '15px',
                          fontWeight: '500',
                          color: '#f1f4f7',
                        }}
                      >
                        AI Configuration
                      </h3>

                      <div
                        style={{
                          marginTop: '4px',
                          fontSize: '8px',
                          color: '#586570',
                        }}
                      >
                        Commerce intelligence parameters
                      </div>
                    </div>

                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '7px',
                        padding: '7px 9px',
                        borderRadius: '6px',
                        border:
                          '1px solid rgba(35,156,255,0.17)',
                        background: 'rgba(35,156,255,0.035)',
                      }}
                    >
                      <span
                        style={{
                          width: '5px',
                          height: '5px',
                          borderRadius: '50%',
                          background: '#269eff',
                          boxShadow:
                            '0 0 10px rgba(38,158,255,0.95)',
                        }}
                      />

                      <span
                        style={{
                          fontSize: '7px',
                          color: '#75bfff',
                          letterSpacing: '0.7px',
                        }}
                      >
                        GENAI CORE
                      </span>
                    </div>
                  </div>

                  {/* AI STATUS BANNER */}
                  <div
                    style={{
                      marginTop: '15px',
                      padding: '11px 12px',
                      borderRadius: '8px',
                      border:
                        '1px solid rgba(35,156,255,0.16)',
                      background:
                        'linear-gradient(90deg, rgba(20,120,255,0.06), rgba(20,120,255,0.015))',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                    }}
                  >
                    <div
                      style={{
                        width: '27px',
                        height: '27px',
                        borderRadius: '7px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'rgba(35,156,255,0.08)',
                        border:
                          '1px solid rgba(35,156,255,0.16)',
                        color: '#48aaff',
                        fontSize: '12px',
                      }}
                    >
                      AI
                    </div>

                    <div>
                      <div
                        style={{
                          fontSize: '8px',
                          color: '#d8e7f5',
                          fontWeight: '600',
                        }}
                      >
                        RuachAgent AI Intelligence Active
                      </div>

                      <div
                        style={{
                          marginTop: '3px',
                          fontSize: '7px',
                          color: '#596875',
                          lineHeight: 1.4,
                        }}
                      >
                        Google GenAI configuration layer connected to
                        the agent's existing intelligence pipeline.
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    padding: '22px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '18px',
                  }}
                >

                  {/* CURRENCY */}
                  <div>
                    <label
                      htmlFor="currency"
                      style={{
                        display: 'block',
                        fontSize: '7px',
                        color: '#68747f',
                        letterSpacing: '1.1px',
                        fontWeight: '700',
                        marginBottom: '8px',
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
                          const val = e.target.value;

                          setSettings(prev => ({
                            ...prev,
                            currency: val,
                          }));
                        }}
                        style={{
                          ...styles.input,
                          width: '100%',
                          boxSizing: 'border-box',
                          padding: '13px 38px 13px 14px',
                          borderRadius: '7px',
                          fontSize: '10px',
                          fontFamily: 'monospace',
                          letterSpacing: '0.4px',
                          appearance: 'none',
                          cursor: 'pointer',
                          background: '#080c10',
                          border:
                            '1px solid rgba(70,95,120,0.28)',
                          color: '#dbe6ef',
                          outline: 'none',
                        }}
                      >
                        {CURRENCY_OPTIONS.map((curr) => (
                          <option
                            key={curr.code}
                            value={curr.code}
                            style={{
                              background: '#0b1118',
                              color: '#ffffff',
                              fontFamily: 'monospace',
                            }}
                          >
                            {curr.name} ({curr.symbol})
                          </option>
                        ))}
                      </select>

                      <span
                        style={{
                          position: 'absolute',
                          right: '14px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          color: '#3c9eff',
                          fontSize: '8px',
                          pointerEvents: 'none',
                        }}
                      >
                        ▼
                      </span>
                    </div>
                  </div>

                  {/* DISCOUNT */}
                  <div>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '8px',
                      }}
                    >
                      <label
                        htmlFor="discount-percentage"
                        style={{
                          fontSize: '7px',
                          color: '#68747f',
                          letterSpacing: '1.1px',
                          fontWeight: '700',
                        }}
                      >
                        AI DISCOUNT COMPILER
                      </label>

                      <span
                        style={{
                          fontFamily: 'monospace',
                          color: '#2f9cff',
                          fontSize: '11px',
                        }}
                      >
                        {settings?.discount_percentage ?? 10}%
                      </span>
                    </div>

                    <input
                      id="discount-percentage"
                      name="discount_percentage"
                      type="number"
                      autoComplete="off"
                      min="0"
                      max="100"
                      value={settings?.discount_percentage ?? 10}
                      onChange={(e) => {
                        const val =
                          parseInt(e.target.value) || 0;

                        setSettings(prev => ({
                          ...prev,
                          discount_percentage: val,
                        }));
                      }}
                      style={{
                        ...styles.input,
                        width: '100%',
                        boxSizing: 'border-box',
                        padding: '13px 14px',
                        borderRadius: '7px',
                        fontSize: '10px',
                        fontFamily: 'monospace',
                        letterSpacing: '0.4px',
                        background: '#080c10',
                        border:
                          '1px solid rgba(70,95,120,0.28)',
                        color: '#e8eef3',
                        outline: 'none',
                      }}
                    />

                    {/* RANGE VISUAL */}
                    <div
                      style={{
                        marginTop: '9px',
                        height: '3px',
                        borderRadius: '10px',
                        background:
                          'linear-gradient(90deg, #167fff 0%, #167fff ' +
                          `${Math.min(
                            100,
                            Math.max(
                              0,
                              settings?.discount_percentage ?? 10
                            )
                          )}%` +
                          ', rgba(255,255,255,0.06) ' +
                          `${Math.min(
                            100,
                            Math.max(
                              0,
                              settings?.discount_percentage ?? 10
                            )
                          )}%, rgba(255,255,255,0.06) 100%)`,
                        boxShadow:
                          '0 0 10px rgba(22,127,255,0.16)',
                      }}
                    />
                  </div>

                  {/* VOUCHER */}
                  <div>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '8px',
                      }}
                    >
                      <label
                        htmlFor="voucher-expiry-days"
                        style={{
                          fontSize: '7px',
                          color: '#68747f',
                          letterSpacing: '1.1px',
                          fontWeight: '700',
                        }}
                      >
                        VOUCHER EXPIRATION POLICY
                      </label>

                      <span
                        style={{
                          fontFamily: 'monospace',
                          color: '#84909b',
                          fontSize: '8px',
                        }}
                      >
                        DAYS
                      </span>
                    </div>

                    <input
                      id="voucher-expiry-days"
                      name="voucher_expiration_days"
                      type="number"
                      autoComplete="off"
                      placeholder="e.g. 30"
                      min="1"
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
                      style={{
                        ...styles.input,
                        width: '100%',
                        boxSizing: 'border-box',
                        padding: '13px 14px',
                        borderRadius: '7px',
                        fontSize: '10px',
                        fontFamily: 'monospace',
                        letterSpacing: '0.4px',
                        background: '#080c10',
                        border:
                          '1px solid rgba(70,95,120,0.28)',
                        color: '#e8eef3',
                        outline: 'none',
                      }}
                    />
                  </div>

                  {/* AI RECOMMENDATION PANEL */}
                  <div
                    style={{
                      padding: '15px',
                      borderRadius: '9px',
                      border:
                        '1px solid rgba(35,156,255,0.14)',
                      background:
                        'linear-gradient(145deg, rgba(20,120,255,0.045), rgba(255,255,255,0.008))',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                      }}
                    >
                      <span
                        style={{
                          color: '#299cff',
                          fontSize: '10px',
                        }}
                      >
                        ✦
                      </span>

                      <span
                        style={{
                          fontSize: '8px',
                          color: '#a9cfff',
                          fontWeight: '600',
                          letterSpacing: '0.6px',
                        }}
                      >
                        AI CONFIGURATION INSIGHT
                      </span>
                    </div>

                    <p
                      style={{
                        margin: '9px 0 0',
                        fontSize: '8px',
                        color: '#5f6d79',
                        lineHeight: 1.55,
                      }}
                    >
                      Your current agent configuration is prepared
                      for{' '}
                      <span style={{ color: '#9bb6ca' }}>
                        {settings?.currency || 'ZAR'}
                      </span>{' '}
                      transactions, with a{' '}
                      <span style={{ color: '#9bb6ca' }}>
                        {settings?.discount_percentage ?? 10}%
                      </span>{' '}
                      AI discount rule and{' '}
                      <span style={{ color: '#9bb6ca' }}>
                        {settings?.voucher_expiration_days ?? 30}
                      </span>{' '}
                      day voucher lifecycle.
                    </p>
                  </div>

                  {/* CONFIG SUMMARY */}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '8px',
                    }}
                  >
                    <div
                      style={{
                        padding: '10px',
                        borderRadius: '7px',
                        background: 'rgba(255,255,255,0.018)',
                        border:
                          '1px solid rgba(255,255,255,0.045)',
                      }}
                    >
                      <div
                        style={{
                          fontSize: '6px',
                          color: '#4d5965',
                          letterSpacing: '0.8px',
                        }}
                      >
                        CURRENCY
                      </div>

                      <div
                        style={{
                          marginTop: '5px',
                          fontFamily: 'monospace',
                          fontSize: '9px',
                          color: '#a9cfff',
                        }}
                      >
                        {settings?.currency || 'ZAR'}
                      </div>
                    </div>

                    <div
                      style={{
                        padding: '10px',
                        borderRadius: '7px',
                        background: 'rgba(255,255,255,0.018)',
                        border:
                          '1px solid rgba(255,255,255,0.045)',
                      }}
                    >
                      <div
                        style={{
                          fontSize: '6px',
                          color: '#4d5965',
                          letterSpacing: '0.8px',
                        }}
                      >
                        DISCOUNT
                      </div>

                      <div
                        style={{
                          marginTop: '5px',
                          fontFamily: 'monospace',
                          fontSize: '9px',
                          color: '#a9cfff',
                        }}
                      >
                        {settings?.discount_percentage ?? 10}%
                      </div>
                    </div>

                    <div
                      style={{
                        padding: '10px',
                        borderRadius: '7px',
                        background: 'rgba(255,255,255,0.018)',
                        border:
                          '1px solid rgba(255,255,255,0.045)',
                      }}
                    >
                      <div
                        style={{
                          fontSize: '6px',
                          color: '#4d5965',
                          letterSpacing: '0.8px',
                        }}
                      >
                        VOUCHER LIFE
                      </div>

                      <div
                        style={{
                          marginTop: '5px',
                          fontFamily: 'monospace',
                          fontSize: '9px',
                          color: '#a9cfff',
                        }}
                      >
                        {settings?.voucher_expiration_days ?? 30}D
                      </div>
                    </div>

                    <div
                      style={{
                        padding: '10px',
                        borderRadius: '7px',
                        background: 'rgba(255,255,255,0.018)',
                        border:
                          '1px solid rgba(255,255,255,0.045)',
                      }}
                    >
                      <div
                        style={{
                          fontSize: '6px',
                          color: '#4d5965',
                          letterSpacing: '0.8px',
                        }}
                      >
                        AI ENGINE
                      </div>

                      <div
                        style={{
                          marginTop: '5px',
                          fontFamily: 'monospace',
                          fontSize: '9px',
                          color: '#58b0ff',
                        }}
                      >
                        GENAI
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* ===================================================
              TILL SLIP PREVIEW
          =================================================== */}

            <section
              style={{
                marginTop: '16px',
                borderRadius: '13px',
                border: '1px solid rgba(65,88,112,0.25)',
                background:
                  'linear-gradient(145deg, rgba(13,18,24,0.97), rgba(6,9,13,0.98))',
                boxShadow:
                  '0 25px 70px rgba(0,0,0,0.25)',
                overflow: 'hidden',
                position: 'relative',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: '8%',
                  right: '8%',
                  height: '1px',
                  background:
                    'linear-gradient(90deg, transparent, rgba(35,156,255,0.65), transparent)',
                }}
              />

              <div
                style={{
                  padding: '19px 22px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderBottom:
                    '1px solid rgba(255,255,255,0.045)',
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: '7px',
                      color: '#258fff',
                      letterSpacing: '1.5px',
                      fontWeight: '700',
                    }}
                  >
                    MODULE 03
                  </div>

                  <h3
                    style={{
                      margin: '5px 0 0',
                      fontSize: '15px',
                      fontWeight: '500',
                      color: '#f1f4f7',
                    }}
                  >
                    Till Slip Preview
                  </h3>
                </div>

                <div
                  style={{
                    fontSize: '7px',
                    color: '#4f5d68',
                    letterSpacing: '1px',
                  }}
                >
                  LIVE VISUAL MIRROR
                </div>
              </div>

              <div
                style={{
                  minHeight: '470px',
                  padding: '30px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'flex-start',
                  background:
                    'radial-gradient(circle at 50% 30%, rgba(35,156,255,0.035), transparent 45%)',
                }}
              >
                {/* BLACK & WHITE PAPER PLACEHOLDER */}
                <div
                  style={{
                    width: '330px',
                    minHeight: '430px',
                    background: '#ffffff',
                    color: '#111111',
                    boxShadow:
                      '0 25px 80px rgba(0,0,0,0.60), 0 0 0 1px rgba(255,255,255,0.08)',
                    padding: '28px 25px',
                    boxSizing: 'border-box',
                    position: 'relative',
                    fontFamily: 'monospace',
                  }}
                >
                  <div
                    style={{
                      textAlign: 'center',
                      fontSize: '13px',
                      fontWeight: '700',
                      letterSpacing: '1px',
                    }}
                  >
                    {settings?.business_name ||
                      'YOUR BUSINESS'}
                  </div>

                  <div
                    style={{
                      marginTop: '7px',
                      textAlign: 'center',
                      fontSize: '8px',
                      color: '#555',
                    }}
                  >
                    {settings?.store_address ||
                      'Business Address'}
                  </div>

                  <div
                    style={{
                      margin: '20px 0',
                      borderTop: '1px dashed #222',
                    }}
                  />

                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontSize: '8px',
                    }}
                  >
                    <span>ITEM</span>
                    <span>AMOUNT</span>
                  </div>

                  <div
                    style={{
                      marginTop: '10px',
                      borderTop: '1px solid #ddd',
                    }}
                  />

                  {[
                    ['Product / Service', 'R 250.00'],
                    ['AI Voucher', '-R 25.00'],
                    ['Tax / Fees', 'R 0.00'],
                  ].map(([name, amount]) => (
                    <div
                      key={name}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        padding: '9px 0',
                        fontSize: '8px',
                      }}
                    >
                      <span>{name}</span>
                      <span>{amount}</span>
                    </div>
                  ))}

                  <div
                    style={{
                      borderTop: '1px dashed #222',
                      marginTop: '10px',
                      paddingTop: '13px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontWeight: '700',
                      fontSize: '10px',
                    }}
                  >
                    <span>TOTAL</span>
                    <span>
                      {settings?.currency === 'ZAR'
                        ? 'R 225.00'
                        : '225.00'}
                    </span>
                  </div>

                  <div
                    style={{
                      marginTop: '28px',
                      textAlign: 'center',
                      fontSize: '7px',
                      color: '#555',
                      lineHeight: 1.6,
                    }}
                  >
                    Thank you for your purchase.
                    <br />
                    Powered by RuachAgent AI.
                  </div>

                  <div
                    style={{
                      position: 'absolute',
                      bottom: '17px',
                      left: '25px',
                      right: '25px',
                      height: '25px',
                      background:
                        'repeating-linear-gradient(90deg, #111 0px, #111 2px, transparent 2px, transparent 4px)',
                      opacity: 0.75,
                    }}
                  />
                </div>
              </div>
            </section>

            {/* ===================================================
              SAVE & SYNC FOOTER
              EXISTING handleSave / isSaveSyncing PRESERVED
          =================================================== */}

            <section
              style={{
                marginTop: '16px',
                padding: '18px',
                borderRadius: '12px',
                border:
                  '1px solid rgba(35,156,255,0.20)',
                background:
                  'linear-gradient(90deg, rgba(20,100,200,0.055), rgba(255,255,255,0.012))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '20px',
                boxShadow:
                  'inset 0 1px 0 rgba(255,255,255,0.025), 0 15px 40px rgba(0,0,0,0.18)',
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
                        ? '#66717c'
                        : '#299cff',
                      boxShadow: isSaveSyncing
                        ? 'none'
                        : '0 0 12px rgba(41,156,255,0.8)',
                    }}
                  />

                  <span
                    style={{
                      fontSize: '9px',
                      color: '#b9c6d1',
                      fontWeight: '600',
                      letterSpacing: '0.5px',
                    }}
                  >
                    {isSaveSyncing
                      ? 'SYNCHRONIZING CONFIGURATION'
                      : 'CONFIGURATION READY'}
                  </span>
                </div>

                <div
                  style={{
                    marginTop: '5px',
                    fontSize: '7px',
                    color: '#505d68',
                  }}
                >
                  Save your business parameters and synchronize the
                  live agent profile.
                </div>
              </div>

              {/* EXISTING SAVE LOGIC UNCHANGED */}
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
                  padding: '13px 18px',
                  borderRadius: '7px',
                  fontSize: '9px',
                  letterSpacing: '0.9px',
                  textTransform: 'uppercase',
                  background: isSaveSyncing
                    ? '#10151b'
                    : 'linear-gradient(180deg, #32a8ff, #1476c7)',
                  color: isSaveSyncing
                    ? '#66717c'
                    : '#031019',
                  border: isSaveSyncing
                    ? '1px solid rgba(255,255,255,0.06)'
                    : '1px solid rgba(80,180,255,0.35)',
                  boxShadow: isSaveSyncing
                    ? 'none'
                    : '0 0 25px rgba(30,145,255,0.16)',
                  cursor: isSaveSyncing
                    ? 'not-allowed'
                    : 'pointer',
                  fontWeight: '700',
                }}
              >
                {isSaveSyncing
                  ? 'SYNCING PROFILE...'
                  : 'SAVE & SYNC LIVE PROFILE'}
              </button>
            </section>
          </div>
        </main>

        {/* =======================================================
          RESPONSIVE CSS
          Kept inside JSX so AgentParameters remains standalone.
      ======================================================= */}

        <style>
          {`
          @media (max-width: 1100px) {
            aside {
              width: 205px !important;
              min-width: 205px !important;
            }

            main header {
              padding-left: 24px !important;
              padding-right: 24px !important;
            }

            main > div {
              padding-left: 24px !important;
              padding-right: 24px !important;
            }
          }

          @media (max-width: 900px) {
            aside {
              width: 72px !important;
              min-width: 72px !important;
              padding-left: 8px !important;
              padding-right: 8px !important;
            }

            aside > div:first-child {
              padding-left: 4px !important;
              padding-right: 4px !important;
            }

            aside button {
              justify-content: center !important;
              font-size: 0 !important;
            }

            aside button span {
              font-size: 14px !important;
            }

            aside button span:first-child {
              margin: 0 !important;
            }

            aside > div:not(:first-child) {
              display: none !important;
            }

            main section[style*="repeat(4"] {
              grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
            }

            main section[style*="1.05fr"] {
              grid-template-columns: 1fr !important;
            }
          }

          @media (max-width: 650px) {
            aside {
              display: none !important;
            }

            main header {
              padding-left: 18px !important;
              padding-right: 18px !important;
              height: 68px !important;
            }

            main header > div:last-child > div:first-child {
              display: none !important;
            }

            main > div {
              padding: 22px 16px 45px !important;
            }

            main section[style*="repeat(4"] {
              grid-template-columns: 1fr 1fr !important;
            }

            main section[style*="1.05fr"] {
              grid-template-columns: 1fr !important;
            }

            main section[style*="1.05fr"] > div {
              min-width: 0 !important;
            }

            section[style*="gridTemplateColumns: '105px"] {
              grid-template-columns: 1fr !important;
            }

            section[style*="gridTemplateColumns: '105px"] > div:first-child {
              max-width: 140px !important;
            }

            section[style*="justifyContent: 'space-between'"] {
              flex-wrap: wrap !important;
            }

            button[style*="minWidth: '205px'"] {
              width: 100% !important;
            }
          }
        `}
        </style>
      </div>
    </div>
  );

}