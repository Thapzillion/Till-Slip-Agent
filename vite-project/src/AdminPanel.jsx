import { useState, useEffect } from 'react';

import { supabase } from './supabaseClient';



// Static reference data available instantly globally

const CURRENCY_OPTIONS = [

  { code: 'ZAR', symbol: 'R', name: 'South African Rand' },

  { code: 'USD', symbol: '$', name: 'US Dollar' },

  { code: 'GBP', symbol: '£', name: 'British Pound' },

  { code: 'EUR', symbol: '€', name: 'Euro' },

  { code: 'NGN', symbol: '₦', name: 'Nigerian Naira' }

];



export default function AdminPanel() {

  const [user, setUser] = useState(null);

  const [isSyncing, setIsSyncing] = useState(false);

  const [email, setEmail] = useState('');

  const [password, setPassword] = useState('');

  const [showVerifyModal, setShowVerifyModal] = useState(false);

  const [showSuccessModal, setShowSuccessModal] = useState(false); // New state for confirmation feedback

  const [txCount, setTxCount] = useState(0);

  const [txVolume, setTxVolume] = useState(0);

  const [graphData, setGraphData] = useState(Array.from({ length: 28 }).map(() => 0));

 

  const [settings, setSettings] = useState({

    business_name: '',

    store_address: '',

    discount_percentage: 10,

    webhook_slug: '',

    currency: 'ZAR',

    logo_url: ''

  });



  // RuachAgent Responsive Cyber Neon Theme System



const isMobile = window.innerWidth <= 768;

const isTablet = window.innerWidth > 768 && window.innerWidth <= 1200;

const isDesktop = window.innerWidth > 1200;



const styles = {



  /* =========================

     APP CONTAINER

  ========================= */



  container: {



    minHeight: '100vh',



    background: `

      radial-gradient(circle at top left, rgba(0,255,200,0.08), transparent 30%),

      radial-gradient(circle at bottom right, rgba(0,255,255,0.05), transparent 35%),

      linear-gradient(135deg, #05070a 0%, #0b1118 40%, #07131a 100%)

    `,



    color: '#e8ffff',



    fontFamily: `

      -apple-system,

      BlinkMacSystemFont,

      "SF Pro Display",

      "Segoe UI",

      Roboto,

      sans-serif

    `,



    paddingBottom: isMobile ? '90px' : '32px',



    paddingLeft: isDesktop ? '24px' : '14px',



    paddingRight: isDesktop ? '24px' : '14px',



    transition: 'all 0.25s ease',



    position: 'relative',



    overflowX: 'hidden',



  },



  /* =========================

     MAIN APP SHELL

  ========================= */



  appShell: {



    display: 'grid',



    gridTemplateColumns: isDesktop

      ? '280px 1fr'

      : '1fr',



    gap: '22px',



    width: '100%',



    maxWidth: '1800px',



    margin: '0 auto',



    alignItems: 'start',



  },



  /* =========================

     SIDEBAR

  ========================= */



  sidebar: {



    position: isDesktop ? 'sticky' : 'relative',



    top: isDesktop ? '18px' : '0',



    height: isDesktop ? 'calc(100vh - 36px)' : 'auto',



    overflowY: 'auto',



    borderRadius: '24px',



    background: `

      linear-gradient(

        180deg,

        rgba(10,18,24,0.96),

        rgba(6,12,16,0.98)

      )

    `,



    border: '1px solid rgba(0,255,200,0.12)',



    padding: isMobile ? '16px' : '22px',



    backdropFilter: 'blur(18px)',



    boxShadow: `

      0 12px 40px rgba(0,0,0,0.45),

      0 0 25px rgba(0,255,200,0.05)

    `,



  },



  /* =========================

     CONTENT AREA

  ========================= */



  content: {



    width: '100%',



    display: 'flex',



    flexDirection: 'column',



    gap: '20px',



  },



  /* =========================

     HEADER

  ========================= */



  header: {



    display: 'flex',



    flexDirection: isMobile ? 'column' : 'row',



    justifyContent: 'space-between',



    alignItems: isMobile ? 'flex-start' : 'center',



    gap: isMobile ? '14px' : '0',



    padding: isMobile ? '16px' : '20px 24px',



    background: 'rgba(10, 18, 24, 0.72)',



    backdropFilter: 'blur(18px)',



    border: '1px solid rgba(0,255,200,0.10)',



    borderRadius: '22px',



    position: 'sticky',



    top: '12px',



    zIndex: 100,



    boxShadow: `

      0 10px 35px rgba(0,0,0,0.35)

    `,



  },



  /* =========================

     GRID SYSTEM

  ========================= */



  dashboardGrid: {



    display: 'grid',



    gridTemplateColumns:

      isDesktop

        ? 'repeat(3, 1fr)'

        : isTablet

          ? 'repeat(2, 1fr)'

          : '1fr',



    gap: '20px',



    width: '100%',



  },



  /* =========================

     CARDS

  ========================= */



  flatCard: {



    background: `

      linear-gradient(

        180deg,

        rgba(12, 20, 26, 0.96),

        rgba(8, 14, 18, 0.98)

      )

    `,



    borderRadius: isMobile ? '18px' : '24px',



    padding: isMobile ? '18px' : '24px',



    border: '1px solid rgba(0,255,200,0.14)',



    boxShadow: `

      0 0 0 1px rgba(255,255,255,0.02),

      0 12px 40px rgba(0,0,0,0.55),

      0 0 25px rgba(0,255,200,0.08)

    `,



    backdropFilter: 'blur(18px)',



    position: 'relative',



    overflow: 'hidden',



    transition: 'all 0.25s ease',



  },



  /* =========================

     MINI CARD

  ========================= */



  concaveCard: {



    background: `

      linear-gradient(

        145deg,

        rgba(10, 20, 26, 0.92),

        rgba(6, 12, 16, 0.98)

      )

    `,



    borderRadius: '18px',



    padding: isMobile ? '14px' : '16px',



    border: '1px solid rgba(0,255,200,0.10)',



    boxShadow: `

      inset 0 1px 1px rgba(255,255,255,0.04),

      inset 0 -8px 12px rgba(0,0,0,0.35)

    `,



  },



  /* =========================

     INPUTS

  ========================= */



  input: {



    width: '100%',



    boxSizing: 'border-box',



    padding: isMobile ? '13px 14px' : '15px 16px',



    background: 'rgba(255,255,255,0.03)',



    border: '1px solid rgba(0,255,200,0.12)',



    borderRadius: '16px',



    color: '#ffffff',



    fontSize: isMobile ? '13px' : '14px',



    outline: 'none',



    transition: 'all 0.2s ease',



    backdropFilter: 'blur(10px)',



    boxShadow: 'inset 0 0 12px rgba(0,0,0,0.3)',



  },



  /* =========================

     BUTTONS

  ========================= */



  button: {



    width: '100%',



    background: `

      linear-gradient(

        90deg,

        #00e0b8 0%,

        #00f5d4 50%,

        #00ffd5 100%

      )

    `,



    color: '#041014',



    border: 'none',



    padding: isMobile ? '13px 14px' : '15px 18px',



    borderRadius: '16px',



    fontWeight: '700',



    fontSize: isMobile ? '13px' : '14px',



    letterSpacing: '0.5px',



    cursor: 'pointer',



    transition: 'all 0.2s ease',



    boxShadow: `

      0 0 18px rgba(0,255,200,0.35),

      0 8px 24px rgba(0,255,200,0.18)

    `,



    textTransform: 'uppercase',



  },



  /* =========================

     RESPONSIVE TITLES

  ========================= */



  title: {



    fontSize: isMobile ? '21px' : isTablet ? '25px' : '30px',



    fontWeight: '700',



    letterSpacing: '1px',



    color: '#ffffff',



    textShadow: '0 0 12px rgba(0,255,200,0.28)',



    lineHeight: '1.1',



  },



  subtitle: {



    fontSize: isMobile ? '11px' : '13px',



    color: 'rgba(220, 255, 250, 0.71)',



    letterSpacing: '1.2px',



    textTransform: 'uppercase',



  },



  /* =========================

     STATUS BADGES

  ========================= */



  statusBadge: {



    display: 'inline-flex',



    alignItems: 'center',



    gap: '8px',



    padding: isMobile ? '7px 12px' : '8px 14px',



    borderRadius: '999px',



    background: 'rgba(0, 255, 200, 0)',



    border: '1px solid rgba(0,255,200,0.18)',



    color: '#00ffd5',



    fontSize: isMobile ? '11px' : '12px',



    fontWeight: '600',



    letterSpacing: '0.5px',



  },



  /* =========================

     RESPONSIVE DIVIDER

  ========================= */



  divider: {



    width: '100%',



    height: '1px',



    background: `

      linear-gradient(

        90deg,

        transparent,

        rgba(0,255,200,0.18),

        transparent

      )

    `,



    margin: isMobile ? '14px 0' : '18px 0',



  },



  /* =========================

     MOBILE FLOATING ACTION BAR

  ========================= */



  mobileDock: {



    position: 'fixed',



    bottom: '18px',



    left: '50%',



    transform: 'translateX(-50%)',



    width: 'calc(100% - 28px)',



    maxWidth: '420px',



    display: isMobile ? 'flex' : 'none',



    justifyContent: 'space-around',



    alignItems: 'center',



    padding: '14px',



    borderRadius: '22px',



    background: 'rgba(8,18,24,0.88)',



    backdropFilter: 'blur(18px)',



    border: '1px solid rgba(0,255,200,0.14)',



    zIndex: 500,



    boxShadow: `

      0 10px 35px rgba(0,0,0,0.45),

      0 0 25px rgba(0,255,200,0.08)

    `,



  },



  /* =========================

     MODAL

  ========================= */



  modalOverlay: {



    position: 'fixed',



    top: 0,



    left: 0,



    right: 0,



    bottom: 0,



    background: 'rgba(2, 8, 12, 0.82)',



    backdropFilter: 'blur(12px)',



    display: 'flex',



    alignItems: 'center',



    justifyContent: 'center',



    zIndex: 1000,



    padding: isMobile ? '14px' : '22px',



  },



  /* =========================

     RESPONSIVE NEON CIRCLE

  ========================= */



  neonCircle: {



    width: isMobile ? '140px' : '180px',



    height: isMobile ? '140px' : '180px',



    borderRadius: '50%',



    border: '2px solid rgba(0,255,200,0.14)',



    display: 'flex',



    alignItems: 'center',



    justifyContent: 'center',



    margin: '0 auto',



    boxShadow: `

      0 0 30px rgba(0,255,200,0.15),

      inset 0 0 24px rgba(0,255,200,0.08)

    `,



    background: `

      radial-gradient(

        circle,

        rgba(0,255,200,0.06),

        transparent

      )

    `,



  }



};


 useEffect(() => {
    let isMounted = true;

    // Detect if user landed via an email confirmation redirection link
    const hash = window.location.hash;
    if (hash && (hash.includes('access_token=') || hash.includes('type=signup'))) {
      setShowSuccessModal(true);
      // Clean the URL fragments up so it looks professional and tidy
      window.history.replaceState(null, null, window.location.pathname);
    }

    async function initializePortal() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!isMounted) return;

        if (session?.user) {
          setUser(session.user);
          await Promise.all([
            fetchMerchantSettings(session.user.id),
            fetchLiveAnalytics(session.user.id)
          ]);
        }
      } catch (error) {
        console.error("Initialization loop error caught:", error);
      }
    }

    initializePortal();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!isMounted) return;

      if (session?.user) {
        setUser(session.user);
        setShowVerifyModal(false);
        await Promise.all([
          fetchMerchantSettings(session.user.id),
          fetchLiveAnalytics(session.user.id)
        ]);
      } else {
        setUser(null);
        setSettings({ business_name: '', store_address: '', discount_percentage: 10, webhook_slug: '', currency: 'ZAR', logo_url: '' });
        setTxCount(0);
        setTxVolume(0);
        setGraphData(Array.from({ length: 28 }).map(() => 0));
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  async function fetchMerchantSettings(userId) {
    if (!userId) return;
    try {
      const { data, error } = await supabase
        .from('business_settings')
        .select('*')
        .eq('owner_id', userId)
        .maybeSingle();
        
      if (error) throw error;
      if (data) {
        setSettings({
          id: data.id,
          owner_id: data.owner_id,
          business_name: data.business_name || '',
          store_address: data.store_address || '',
          discount_percentage: data.discount_percentage ?? 10,
          webhook_slug: data.webhook_slug || '',
          currency: data.currency || 'ZAR',
          logo_url: data.logo_url || ''
        });
      }
    } catch (error) {
      console.error("Profile load failure:", error.message);
    }
  }

async function getActiveUser() {
  try {
    const {
      data: { session },
      error
    } = await supabase.auth.getSession();

    if (error) {
      console.error("Session retrieval failed:", error.message);
      return null;
    }

    return session?.user || null;
  } catch (err) {
    console.error("Auth session crash:", err.message);
    return null;
  }
}

async function fetchLiveAnalytics() {
  try {
    // ALWAYS fetch live authenticated user directly from Supabase
    const activeUser = await getActiveUser();

    if (!activeUser?.id) {
      console.warn("Analytics blocked: No authenticated user.");
      return;
    }

    const { data: biz, error: bizError } = await supabase
      .from('business_settings')
      .select('id')
      .eq('owner_id', activeUser.id)
      .maybeSingle();

    if (bizError) throw bizError;

    if (!biz?.id) {
      console.warn("No business profile found.");
      return;
    }

    const { data: receipts, error: receiptsError } = await supabase
      .from('receipts')
      .select('total_amount, created_at')
      .eq('business_id', biz.id)
      .order('created_at', { ascending: true });

    if (receiptsError) throw receiptsError;

    if (receipts && receipts.length > 0) {
      const totalVol = receipts.reduce(
        (sum, rx) => sum + (Number(rx.total_amount) || 0),
        0
      );

      setTxCount(receipts.length);
      setTxVolume(totalVol);

      const maxTx = Math.max(
        ...receipts.map(r => Number(r.total_amount) || 1),
        1
      );

      const historicalPrices = receipts.map(rx => {
        const rawAmount = Number(rx.total_amount) || 0;

        return Math.max(
          15,
          Math.min(90, (rawAmount / maxTx) * 90)
        );
      });

      const paddedData = Array(28)
        .fill(0)
        .concat(historicalPrices)
        .slice(-28);

      setGraphData(paddedData);
    }
  } catch (err) {
    console.error("Analytics stream catch handled:", err.message);
  }
}

async function handleAuth(type) {
  if (!email || !password) {
    alert("Please fill in all authorization fields.");
    return;
  }

  if (isSyncing) return;

  setIsSyncing(true);

  try {
    let authResponse;

    if (type === 'login') {
      authResponse = await supabase.auth.signInWithPassword({
        email,
        password
      });
    } else {
      authResponse = await supabase.auth.signUp({
        email,
        password
      });
    }

    if (authResponse.error) {
      alert(authResponse.error.message);
      return;
    }

    // Wait briefly for auth state hydration
    let activeUser = null;

    for (let i = 0; i < 5; i++) {
      activeUser = await getActiveUser();

      if (activeUser?.id) break;

      await new Promise(resolve => setTimeout(resolve, 300));
    }

    if (!activeUser?.id) {
      alert("Authentication succeeded, but session is still initializing. Please wait a moment.");
      return;
    }

    console.log("Authenticated User:", activeUser.id);

    if (type !== 'login') {
      setShowVerifyModal(true);
    }

  } catch (err) {
    console.error("Authentication crash:", err);
    alert(err.message || "Authentication failed.");
  } finally {
    setIsSyncing(false);
  }
}

// Unified, stabilized database sync function
async function handleSave(e) {
  if (e && typeof e.preventDefault === 'function') {
    e.preventDefault();
  }

  if (isSyncing) {
    console.warn("Sync blocked: already syncing.");
    return;
  }

  setIsSyncing(true);

  try {
    // ALWAYS fetch latest authenticated user directly
    const activeUser = await getActiveUser();

    if (!activeUser?.id) {
      alert("Sync Blocked: Active authentication session required.");
      return;
    }

    const cleanBusinessName =
      settings?.business_name?.trim() || '';

    const cleanWebhookSlug =
      settings?.webhook_slug?.trim() || '';

    if (!cleanBusinessName || !cleanWebhookSlug) {
      alert("Validation Failed: Required parameter fields cannot be left blank.");
      return;
    }

    const payload = {
      owner_id: activeUser.id,
      business_name: cleanBusinessName,
      store_address: settings?.store_address?.trim() || '',
      discount_percentage: Number(settings?.discount_percentage ?? 10),
      webhook_slug: cleanWebhookSlug,
      currency: settings?.currency || 'ZAR',
      logo_url: settings?.logo_url || ''
    };

    if (settings?.id) {
      payload.id = settings.id;
    }

    const { data, error } = await supabase
      .from('business_settings')
      .upsert(payload, {
        onConflict: 'owner_id'
      })
      .select();

    if (error) {
      throw error;
    }

    console.log("Business profile synced successfully.");

    alert('Live Agent Settings Synced Successfully!');

    if (data && data[0]) {
      setSettings(data[0]);
    }

  } catch (error) {
    console.error("Profile synchronization failed:", error);

    alert(
      'Error syncing live profile: ' +
      (error.message || 'Unknown error')
    );
  } finally {
    setIsSyncing(false);
  }
}

const activeCurrencySymbol =
  CURRENCY_OPTIONS.find(
    c => c.code === (settings?.currency || 'ZAR')
  )?.symbol || 'R';


  return (
    <div style={{ ...styles.container, opacity: isSyncing ? 0.6 : 1 }}>
      {/* GLOBAL MODAL 1: AWAITING VERIFICATION LINK */}
      {showVerifyModal && (
        <div style={styles.modalOverlay}>
          <div style={{ ...styles.flatCard, maxWidth: '400px', width: '90%', textAlign: 'center' }}>
            <div style={{ fontSize: '32px', marginBottom: '16px' }}>✉️</div>
            <h3 style={{ margin: '0 0 10px 0', fontSize: '16px', color: '#ffffff', letterSpacing: '0.3px', fontWeight: '500' }}>Verification Link Dispatched</h3>
            <p style={{ fontSize: '13px', color: '#a3a3a3', lineHeight: '1.6', margin: '0 0 20px 0' }}>
              We have sent a confirmation email to <strong style={{ color: '#ffffff', fontWeight: '500' }}>{email}</strong>. Please check your inbox and click the activation link to configure your system node.
            </p>
            <button onClick={() => setShowVerifyModal(false)} style={{ ...styles.button, padding: '10px 20px', fontSize: '12px', width: 'auto', display: 'inline-block', margin: '0 auto' }}>
              Acknowledge
            </button>
          </div>
        </div>
      )}

      {/* GLOBAL MODAL 2: EMAIL CONFIRMED SUCCESS POP-UP */}
      {showSuccessModal && (
        <div style={styles.modalOverlay}>
          <div style={{ ...styles.flatCard, maxWidth: '400px', width: '90%', textAlign: 'center', borderColor: '#262626' }}>
            <div style={{ fontSize: '32px', marginBottom: '16px' }}>⚡</div>
            <h3 style={{ margin: '0 0 10px 0', fontSize: '17px', color: '#ffffff', fontWeight: '500', letterSpacing: '0.3px' }}>Email Confirmed Successfully!</h3>
            <p style={{ fontSize: '13px', color: '#a3a3a3', lineHeight: '1.6', margin: '0 0 24px 0' }}>
              Your merchant node identity has been verified by the authentication gateway. Welcome to RuachAgent.
            </p>
            <button 
              onClick={() => setShowSuccessModal(false)} 
              style={{ 
                ...styles.button, 
                padding: '10px 24px', 
                fontSize: '12px', 
                width: 'auto',
                display: 'inline-block',
                margin: '0 auto'
              }}
            >
              Enter Workspace
            </button>
          </div>
        </div>
      )}

            {/* HEADER NAVIGATION */}
      <header style={styles.header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontWeight: '700', fontSize: '16px', letterSpacing: '1.5px', color: '#ffffff' }}>RUACHAGENT</span>
          <span style={{ fontSize: '9px', border: '1px solid #262626', color: '#a3a3a3', padding: '3px 8px', borderRadius: '4px', fontWeight: '500', letterSpacing: '0.5px' }}>PRODUCTION NODE</span>
        </div>
        {user && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ fontSize: '12px', color: '#737373', fontFamily: 'monospace' }}>{user.email}</span>
            <button 
              onClick={() => supabase.auth.signOut()} 
              style={{ 
                background: 'transparent', 
                border: '1px solid #262626', 
                color: '#ef4444', 
                padding: '6px 12px', 
                borderRadius: '6px', 
                fontSize: '11px', 
                fontWeight: '500', 
                cursor: 'pointer',
                transition: 'border-color 0.15s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = '#ef4444'}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = '#262626'}
            >
              Disconnect
            </button>
          </div>
        )}
      </header>

      <input style={{ display: 'none' }} type="password" autoComplete="on" />

      <main style={{ padding: '32px 16px', maxWidth: '1000px', margin: '0 auto' }}>
        {!user ? (
          <section style={{ maxWidth: '360px', margin: '60px auto 0 auto' }}>
            <div style={styles.flatCard}>
              <h2 style={{ textAlign: 'center', fontSize: '18px', fontWeight: '500', margin: '0 0 24px 0', color: '#ffffff', letterSpacing: '0.3px' }}>Master Portal Login</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <input type="email" placeholder="Merchant Email" value={email} onChange={e => setEmail(e.target.value)} style={styles.input} />
                <input type="password" placeholder="Access Password" value={password} onChange={e => setPassword(e.target.value)} style={styles.input} />
                <button onClick={() => handleAuth('login')} style={styles.button} disabled={isSyncing}>
                  {isSyncing ? 'Verifying Node...' : 'Authenticate Identity'}
                </button>
                <button 
                  onClick={() => handleAuth('register')} 
                  style={{ 
                    ...styles.button, 
                    background: 'transparent', 
                    color: '#a3a3a3', 
                    border: '1px solid #262626',
                    marginTop: '4px'
                  }} 
                  disabled={isSyncing}
                >
                  Register New Node
                </button>
              </div>
            </div>
          </section>

        ) : (
          <section style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', alignItems: 'start' }}>
            {/* COLUMN 1: AGENT PARAMETERS CONTROL BLOCK */}
            <div style={styles.flatCard}>
              <h3 style={{ margin: '0 0 20px 0', fontSize: '13px', fontWeight: '500', color: '#ffffff', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                Agent Parameters
              </h3>              
          {/* Block 1 CORNER LIGHT */}
    <div style={{
      position: 'absolute',
      top: '-80px',
      left: '-80px',
      width: '180px',
      height: '180px',
      background: 'radial-gradient(circle, rgba(0,255,200,0.08), transparent 70%)',
      borderRadius: '50%'
    }} />

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {/* BRAND LOGO */}
                <div>
                  <label style={{ fontSize: '10px', color: '#737373', fontWeight: '500', display: 'block', marginBottom: '8px', letterSpacing: '0.5px' }}>
                    BUSINESS BRAND LOGO (PICTURE PRINT)
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <label style={{ ...styles.button, display: 'inline-block', padding: '10px 14px', fontSize: '12px', background: 'transparent', border: '1px solid #262626', color: '#ffffff', cursor: 'pointer', textAlign: 'center', flex: 1, boxShadow: 'none', textTransform: 'none' }}>
                      Choose Image File
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            const localUrl = URL.createObjectURL(file);
                            setSettings(prev => ({ ...prev, logo_url: localUrl }));
                          }
                        }} 
                        style={{ display: 'none' }} 
                      />
                    </label>
                    <div style={{ ...styles.concaveCard, padding: '2px', width: '42px', height: '42px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', borderRadius: '4px' }}>
                      {settings?.logo_url ? (
                        <img src={settings.logo_url} alt="Logo Mirror" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '3px' }} />
                      ) : (
                        <span style={{ fontSize: '14px', color: '#404040' }}>🖼️</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* LIVE WEBHOOK SLUG */}
                <div>
                  <label style={{ fontSize: '10px', color: '#737373', fontWeight: '500', display: 'block', marginBottom: '8px', letterSpacing: '0.5px' }}>
                    LIVE WEBHOOK SLUG
                  </label>
                  <input 
                    type="text" 
                    placeholder="e.g., eddienetwork" 
                    value={settings?.webhook_slug || ''} 
                    onChange={(e) => {
                      const cleanValue = e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, '');
                      setSettings(prev => ({ ...prev, webhook_slug: cleanValue }));
                    }} 
                    style={{ ...styles.input, fontSize: '12px', fontFamily: 'monospace', letterSpacing: '0.5px' }} 
                  />
                </div>

                {/* DYNAMIC CURRENCY SELECT SYSTEM */}
                <div>
                  <label style={{ fontSize: '10px', color: '#737373', fontWeight: '500', display: 'block', marginBottom: '8px', letterSpacing: '0.5px' }}>
                    OPERATIONAL CURRENCY
                  </label>
                  <div style={{ position: 'relative' }}>
                    <select 
                      value={settings?.currency || 'ZAR'} 
                      onChange={(e) => {
                        const val = e.target.value;
                        setSettings(prev => ({ ...prev, currency: val }));
                      }} 
                      style={{ ...styles.input, fontSize: '12px', fontFamily: 'monospace', letterSpacing: '0.5px', appearance: 'none', cursor: 'pointer', paddingRight: '30px' }}
                    >
                      {CURRENCY_OPTIONS.map((curr) => (
                        <option key={curr.code} value={curr.code} style={{ background: '#0b1118', color: '#ffffff', fontFamily: 'monospace' }}>
                          {curr.name} ({curr.symbol})
                        </option>
                      ))}
                    </select>
                    <span style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', fontSize: '9px', color: '#737373', pointerEvents: 'none', fontFamily: 'monospace' }}>▼</span>
                  </div>
                </div>

                {/* BUSINESS BRAND NAME */}
                <div>
                  <label style={{ fontSize: '10px', color: '#737373', fontWeight: '500', display: 'block', marginBottom: '8px', letterSpacing: '0.5px' }}>
                    BUSINESS BRAND NAME
                  </label>
                  <input 
                    type="text" 
                    value={settings?.business_name || ''} 
                    onChange={(e) => {
                      const val = e.target.value;
                      setSettings(prev => ({ ...prev, business_name: val }));
                    }} 
                    style={{ ...styles.input, fontSize: '12px', fontFamily: 'monospace', letterSpacing: '0.5px' }} 
                  />
                </div>

                {/* PHYSICAL OUTLET ADDRESS */}
                <div>
                  <label style={{ fontSize: '10px', color: '#737373', fontWeight: '500', display: 'block', marginBottom: '8px', letterSpacing: '0.5px' }}>
                    PHYSICAL OUTLET ADDRESS
                  </label>
                  <textarea 
                    value={settings?.store_address || ''} 
                    onChange={(e) => {
                      const val = e.target.value;
                      setSettings(prev => ({ ...prev, store_address: val }));
                    }} 
                    style={{ ...styles.input, minHeight: '64px', resize: 'none', fontSize: '12px', fontFamily: 'monospace', letterSpacing: '0.5px', lineHeight: '1.6' }} 
                  />
                </div>

                {/* AI DISCOUNT COMPILER VALUE (%) */}
                <div>
                  <label style={{ fontSize: '10px', color: '#737373', fontWeight: '500', display: 'block', marginBottom: '8px', letterSpacing: '0.5px' }}>
                    AI DISCOUNT COMPILER VALUE (%)
                  </label>
                  <input 
                    type="number" 
                    value={settings?.discount_percentage ?? 10} 
                    onChange={(e) => {
                      const val = parseInt(e.target.value) || 0;
                      setSettings(prev => ({ ...prev, discount_percentage: val }));
                    }} 
                    style={{ ...styles.input, fontSize: '12px', fontFamily: 'monospace', letterSpacing: '0.5px' }} 
                  />
                </div>

                {/* TRIGGER LIVE HANDSHAKE SYNC */}
                <button 
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (!isSyncing) handleSave(e);
                  }} 
                  style={{ 
                    ...styles.button, 
                    background: isSyncing ? '#111827' : styles.button.background, // Fixed background override logic
                    color: isSyncing ? '#6b7280' : '#041014', 
                    border: isSyncing ? '1px solid rgba(255,255,255,0.05)' : 'none',
                    boxShadow: isSyncing ? 'none' : styles.button.boxShadow,
                    marginTop: '10px', 
                    fontSize: '13px', 
                    letterSpacing: '0.5px', 
                    textTransform: 'uppercase', 
                    cursor: isSyncing ? 'not-allowed' : 'pointer'
                  }}
                  disabled={isSyncing}
                >
                  {isSyncing ? 'Syncing Profile...' : 'Save & Sync Live Profile'}
                </button>
              </div>
            </div>

           {/* COLUMN 2: ANALYTICS & HUB BLOCK */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                    {/* PERFORMANCE METRICS CARD */}
<div style={{ ...styles.flatCard, border: '1px solid rgba(255, 255, 255, 0.02)' }}>
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
    <h3 style={{ margin: 0, fontSize: '13px', fontWeight: '800', color: '#a3b1c6', letterSpacing: '1px', textTransform: 'uppercase' }}>
      Performance Node Analytics
    </h3>
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#0a0b0d', padding: '5px 12px', borderRadius: '20px', boxShadow: 'inset 2px 2px 5px #000, inset -2px -2px 5px rgba(255,255,255,0.02)' }}>
      <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px #10b981', display: 'inline-block' }}></span>
      <span style={{ fontSize: '9px', fontWeight: '800', color: '#10b981', letterSpacing: '0.5px', fontFamily: 'monospace' }}>
        NODE_STATUS: ACTIVE
      </span>
    </div>
  </div>

{/* Block 2 CORNER LIGHT */}
    <div style={{
      position: 'absolute',
      top: '-80px',
      left: '-80px',
      width: '180px',
      height: '180px',
      background: 'radial-gradient(circle, rgba(0,255,200,0.08), transparent 70%)',
      borderRadius: '50%'
    }} />

  {/* NEW FLAT GRID FOCUSING ON REVENUE VOLUME & LEASE SUBSCRIPTION STATUS */}
  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
    <div style={{ ...styles.concaveCard, padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
      <div style={{ fontSize: '9px', color: '#8a99ad', fontWeight: '700', letterSpacing: '0.8px', textTransform: 'uppercase' }}>
        Processed Volume
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '3px' }}>
        <span style={{ fontSize: '12px', fontWeight: '600', color: '#3b82f6', fontFamily: 'monospace' }}>{activeCurrencySymbol}</span>
        <span style={{ fontSize: '12px', fontWeight: '900', color: '#fff', fontFamily: 'monospace', letterSpacing: '-0.3px' }}>
          {txVolume.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </span>
      </div>
    </div>

    <div style={{ ...styles.concaveCard, padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
      <div style={{ fontSize: '9px', color: '#8a99ad', fontWeight: '700', letterSpacing: '0.8px', textTransform: 'uppercase' }}>
        Agent Lease Cost
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '3px' }}>
        <span style={{ fontSize: '12px', fontWeight: '600', color: '#10b981', fontFamily: 'monospace' }}>$</span>
        <span style={{ fontSize: '12px', fontWeight: '900', color: '#10b981', fontFamily: 'monospace', letterSpacing: '-0.3px' }}>
          5.00<span style={{ fontSize: '11px', color: '#6ee7b7', fontWeight: '500' }}>/mo</span>
        </span>
      </div>
    </div>
  </div>

  {/* REAL-TIME MICRO-GRAPH */}
  <div style={{ marginTop: '24px', marginBottom: '5px' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', fontSize: '9px', fontWeight: '700', color: '#8a99ad', letterSpacing: '0.5px', fontFamily: 'monospace' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <span style={{ color: txCount > 0 ? '#10b981' : '#3b82f6', transition: 'all 0.3s' }}>●</span>
        <span>REAL-TIME TRANSACTION STREAM</span>
      </div>
      <span style={{ color: '#3b82f6' }}>
        FREQUENCY: {txCount > 0 ? `TICK_FLOW_${txCount}X` : 'WAITING_FOR_FIRST_SALE'}
      </span>
    </div>
    
    <div style={{ background: '#0a0b0d', height: '65px', borderRadius: '12px', boxShadow: 'inset 3px 3px 6px #000, inset -3px -3px 6px rgba(255,255,255,0.02)', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'flex-end', padding: '0 12px', gap: '5px' }}>
      {graphData.map((heightValue, idx) => {
        const hasData = heightValue > 0;
        const isLatestSale = idx === 27;
        return (
          <div 
            key={idx} 
            style={{ 
              flex: 1, 
              height: hasData ? `${heightValue}%` : '2px', 
              background: !hasData 
                ? 'rgba(255, 255, 255, 0.03)' 
                : isLatestSale 
                  ? 'linear-gradient(to top, #10b981, #6ee7b7)' 
                  : 'linear-gradient(to top, rgba(59, 130, 246, 0.05), #3b82f6)', 
              borderTopLeftRadius: '2px', 
              borderTopRightRadius: '2px',
              opacity: hasData ? (isLatestSale ? 1 : 0.6) : 0.3,
              transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
          ></div>
        );
      })}
      <div style={{ position: 'absolute', width: '100%', height: '1px', background: 'rgba(255,255,255,0.02)', top: '20px', left: 0 }}></div>
      <div style={{ position: 'absolute', width: '100%', height: '1px', background: 'rgba(255,255,255,0.02)', top: '45px', left: 0 }}></div>
    </div>
  </div>

  {/* Footer Metadata Diagnostics */}
  <div style={{ marginTop: '20px', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.03)', fontSize: '10px', color: '#8a99ad', display: 'flex', justifyContent: 'space-between', fontWeight: '600', fontFamily: 'monospace' }}>
    <div style={{ display: 'flex', gap: '14px' }}>
      <span>RECEIPT_COUNT: <strong style={{ color: '#fff' }}>{txCount}</strong></span>
      <span>DELTA_VOL: <strong style={{ color: '#3b82f6' }}>+{(txVolume * 0.0004).toFixed(2)}%</strong></span>
    </div>
    <span style={{ color: '#6b7d96' }}>SYS_REF_N90X</span>
  </div>
</div>

            {/* INTEGRATION ENDPOINT TARGET BLOCK */}
              <div style={styles.flatCard}>
                <h3 style={{ margin: '0 0 12px 0', fontSize: '13px', fontWeight: '800' }}>Integration Endpoint Target</h3>
                <div style={{ ...styles.concaveCard, fontFamily: 'monospace', fontSize: '12px', color: '#3b82f6', wordBreak: 'break-all', padding: '15px', marginBottom: '14px' }}>
                  {settings?.webhook_slug ? `https://agadjdvhqguunowplbak.functions.supabase.co/receipt-agent?slug=${settings.webhook_slug}` : 'Define a unique webhook slug first...'}
                </div>
                <div style={{ fontSize: '11px', color: '#8a99ad', lineHeight: '1.5', paddingLeft: '2px', fontFamily: 'system-ui, sans-serif' }}>
                  💡 <span style={{ fontWeight: '600' }}>Deployment Action:</span> Paste this generated webhook link into your <strong style={{ color: '#fff' }}>[Inbound Email Webhook Configuration or POS Webhook Portal]</strong> to begin routing automated transaction slip payloads directly to your AI agent node.
                </div>
              </div>

          {/* LIVE INBOX EMAIL TILL SLIP MIRROR */}
<div style={{
  ...styles.flatCard,
  border: '1px solid rgba(0,255,200,0.12)',
  background: 'linear-gradient(180deg, rgba(8,18,24,0.95), rgba(4,10,14,0.98))',
  boxShadow: '0 0 35px rgba(0,255,200,0.08)',
  position: 'relative',
  overflow: 'hidden'
}}>

  {/* TOP GLOW EFFECT */}
  <div style={{
    position: 'absolute',
    top: '-120px',
    right: '-120px',
    width: '240px',
    height: '240px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(0,255,200,0.18), transparent 70%)',
    filter: 'blur(10px)',
    pointerEvents: 'none'
  }} />

  <h3 style={{
    margin: '0 0 18px 0',
    fontSize: '12px',
    fontWeight: '800',
    color: '#00ffd5',
    letterSpacing: '2px',
    textTransform: 'uppercase',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    position: 'relative',
    zIndex: 2
  }}>
    ⚡ Live Inbox Email Till Slip Mirror
  </h3>

  {/* ADVANCED DIGITAL RECEIPT CONTAINER */}
  <div style={{
    background: 'linear-gradient(180deg, rgba(12, 22, 31, 0.85), rgba(8, 15, 22, 0.95))',
    backgroundImage: `
      linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.012) 1px, transparent 1px)
    `,
    backgroundSize: '100% 5px, 5px 100%',
    color: '#ffffff',
    borderRadius: '26px',
    padding: '32px 24px',
    boxShadow: `
      0 25px 50px rgba(0,0,0,0.45),
      0 0 40px rgba(0,255,200,0.08)
    `,
    fontFamily: '"Courier New", monospace',
    position: 'relative',
    overflow: 'hidden',
    border: '1px solid rgba(0, 255, 200, 0.15)'
  }}>

    {/* RECEIPT CORNER LIGHT */}
    <div style={{
      position: 'absolute',
      top: '-80px',
      left: '-80px',
      width: '180px',
      height: '180px',
      background: 'radial-gradient(circle, rgba(0,255,200,0.08), transparent 70%)',
      borderRadius: '50%'
    }} />

    {/* CENTRAL BIG LOGO WATERMARK */}
    {settings?.logo_url && (
      <div style={{
        position: 'absolute',
        top: '52%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '280px',
        height: '280px',
        backgroundImage: `url(${settings.logo_url})`,
        backgroundSize: 'contain',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        opacity: 0.035,
        pointerEvents: 'none',
        zIndex: 1
      }} />
    )}

    {/* RECEIPT CONTENT WRAPPER */}
    <div style={{ position: 'relative', zIndex: 2 }}>

      {/* TOP METADATA ROW */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        fontSize: '10px',
        color: '#64748b',
        marginBottom: '18px'
      }}>
        <div style={{
          padding: '4px 10px',
          borderRadius: '999px',
          background: 'rgba(0,255,200,0.08)',
          border: '1px solid rgba(0,255,200,0.15)',
          color: '#089981',
          fontWeight: '800',
          letterSpacing: '0.5px'
        }}>
          VERIFIED NODE
        </div>

        <div style={{
          textAlign: 'right',
          lineHeight: '1.5'
        }}>
          <div style={{
            fontWeight: '900',
            color: '#c5ccda',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            Transaction
          </div>

          <div>21. Jan 21 19:43:36</div>
        </div>
      </div>

      {/* TOP MINI LOGO */}
      <div style={{
        textAlign: 'center',
        marginBottom: '18px'
      }}>
        {settings?.logo_url ? (
          <div style={{
            display: 'inline-flex',
            padding: '10px 18px',
            borderRadius: '18px',
            background: 'rgba(15, 23, 42, 0.06)',
            border: '1px solid rgba(15,23,42,0.06)',
            boxShadow: '0 10px 24px rgba(0,0,0,0.08)'
          }}>
            <img
              src={settings.logo_url}
              alt="Merchant Logo"
              style={{
                maxHeight: '52px',
                maxWidth: '170px',
                objectFit: 'contain'
              }}
            />
          </div>
        ) : (
          <div style={{
            border: '1px dashed #94a3b8',
            padding: '10px',
            color: '#64748b',
            fontSize: '10px',
            fontWeight: 'bold',
            borderRadius: '12px'
          }}>
            [ NO LOGO RECORDED ]
          </div>
        )}
      </div>

      {/* BRAND DETAILS */}
      <div style={{
        textAlign: 'center',
        marginBottom: '22px'
      }}>
        <strong style={{
          fontSize: '20px',
          fontWeight: '900',
          textTransform: 'uppercase',
          letterSpacing: '1px',
          display: 'block',
          color: '#ffffff',
          textShadow: '0 0 10px rgba(0,255,200,0.15)'
        }}>
          {settings?.business_name || 'MY BUSINESS BRAND'}
        </strong>

        <div style={{
          width: '70px',
          height: '2px',
          margin: '10px auto',
          borderRadius: '999px',
          background: 'linear-gradient(90deg, #00ffd5, #00b8ff)'
        }} />

        <div style={{
          fontSize: '11px',
          color: 'rgba(255,255,255,0.85)',
          marginTop: '6px',
          whiteSpace: 'pre-wrap',
          lineHeight: '1.6',
          fontWeight: '700'
        }}>
          {settings?.store_address || 'Outlet Physical Address Street\nKrugersdorp, South Africa'}
        </div>

        <div style={{
          fontSize: '11px',
          color: 'rgba(220,255,250,0.5)',
          marginTop: '6px',
          fontFamily: 'system-ui, sans-serif'
        }}>
          {user?.email || 'info@merchantnode.com'}
        </div>
      </div>

      {/* PREMIUM SEPARATOR */}
      <div style={{
        height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(0,255,200,0.2), transparent)',
        marginBottom: '18px'
      }} />

      {/* ITEMIZATION */}
      <div style={{
        fontSize: '11px',
        lineHeight: '1.9',
        marginBottom: '12px',
        fontWeight: '700'
      }}>

        <div style={{
          fontSize: '10px',
          textTransform: 'uppercase',
          letterSpacing: '1px',
          marginBottom: '12px',
          color: 'rgba(0,255,200,0.6)',
          fontWeight: '900'
        }}>
          Items Purchased
        </div>

        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '8px',
          padding: '8px 0',
          borderBottom: '1px dashed rgba(15,23,42,0.12)'
        }}>
          <span style={{ maxWidth: '75%' }}>
            1x Premium Sample Merchandise Item
          </span>

          <span style={{
            fontWeight: '900',
            color: '#bfc1c8'
          }}>
            {activeCurrencySymbol}120.00
          </span>
        </div>

        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '12px',
          padding: '8px 0',
          borderBottom: '1px dashed rgba(15,23,42,0.12)'
        }}>
          <span style={{ maxWidth: '75%' }}>
            1x Standard Agent Automation Node Addon
          </span>

          <span style={{
            fontWeight: '900',
            color: '#aeb4c3'
          }}>
            {activeCurrencySymbol}80.00
          </span>
        </div>

         {/* TOTAL DUE ROW */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: '14px',
          padding: '16px',
          borderRadius: '16px',
          background: 'linear-gradient(90deg, rgba(0,255,200,0.08), rgba(0,184,255,0.08))',
          border: '1px solid rgba(0,255,200,0.15)',
          fontWeight: '900',
          fontSize: '14px',
          color: '#b1b5c6',
          boxShadow: '0 6px 20px rgba(0,255,200,0.08)'
        }}>
          <span>TOTAL DUE</span>

          <span style={{
            color: '#00a884',
            textShadow: '0 0 10px rgba(0,255,200,0.15)'
          }}>
            {activeCurrencySymbol}200.00
          </span>
        </div>
      </div>

      {/* VOUCHER SECTION BOX */}
      <div style={{
        background: 'rgba(10, 20, 28, 0.6)',
        border: '1px solid rgba(0,255,200,0.15)',
        borderRadius: '22px',
        padding: '22px 16px',
        textAlign: 'center',
        marginTop: '24px',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 12px 30px rgba(0,0,0,0.25)'
      }}>

        {/* INNER GLOW */}
        <div style={{
          position: 'absolute',
          top: '-40px',
          right: '-40px',
          width: '120px',
          height: '120px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0,255,200,0.12), transparent 70%)'
        }} />

        <span style={{
          fontSize: '9px',
          color: '#00ffd5',
          fontWeight: '900',
          display: 'flex',
          alignItems: 'center',
          justify: 'center',
          gap: '6px',
          marginBottom: '12px',
          letterSpacing: '1px',
          textTransform: 'uppercase'
        }}>
          ⚡ Next Visit Voucher Code Inside
        </span>

        <div style={{
          display: 'inline-block',
          padding: '12px',
          background: '#ffffff',
          borderRadius: '18px',
          border: '1px solid rgba(0,255,200,0.15)',
          boxShadow: `
            0 12px 25px rgba(0,0,0,0.35),
            0 0 20px rgba(0,255,200,0.15)
          `,
          marginBottom: '10px'
        }}>
          <img
            src={`https://api.qrserver.com/v1/create-qr-code/?size=115x115&data=${encodeURIComponent(
              `https://ruachagent.net/redeem?token=${settings?.webhook_slug || 'node'}_preview`
            )}&color=11161d`}
            alt="Voucher Token QR"
            style={{
              width: '115px',
              height: '115px',
              display: 'block'
            }}
          />
        </div>

        <div style={{
          fontSize: '9px',
          color: 'rgba(255,255,255,0.9)',
          textTransform: 'uppercase',
          letterSpacing: '1px',
          fontWeight: '900',
          marginBottom: '8px'
        }}>
          Claim Discount
        </div>

        <div style={{
          fontSize: '11px',
          color: 'rgba(220,255,250,0.7)',
          lineHeight: '1.6',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          padding: '0 6px'
        }}>
          Scan to instantly claim your{' '}
          <strong style={{ color: '#00ffd5', fontWeight: '900' }}>
            {settings?.discount_percentage ?? 10}% discount
          </strong>{' '}
          balance.
        </div>
      </div>

      {/* ACTION BUTTON */}
      <div style={{
        marginTop: '28px',
        textAlign: 'center'
      }}>
        <a
          href="#download"
          onClick={(e) => e.preventDefault()}
          style={{
            display: 'block',
            background: 'linear-gradient(90deg, #00e0b8 0%, #00ffd5 50%, #00b8ff 100%)',
            color: '#041014',
            textDecoration: 'none',
            padding: '16px',
            borderRadius: '16px',
            fontSize: '12px',
            fontWeight: '900',
            fontFamily: 'system-ui, sans-serif',
            letterSpacing: '0.8px',
            textTransform: 'uppercase',
            boxShadow: `
              0 12px 30px rgba(0,255,200,0.25),
              0 0 24px rgba(0,255,200,0.15)
            `,
            transition: 'all 0.25s ease'
          }}
        >
          Download Official Invoice PDF
        </a>
      </div>
    </div>
  </div>
</div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}