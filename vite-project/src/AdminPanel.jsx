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

  // RuachAgent Production Mastering Dashboard - "Slate & Steel Obsidian" Theme Tokens
  const styles = {
    container: {
      minHeight: '100vh',
      background: '#090d16', // Deep, professional midnight blue-black
      color: '#f1f5f9', // Clean slate white
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      paddingBottom: '40px',
      transition: 'opacity 0.2s ease',
    },
    header: {
      display: 'flex',
      justify: 'space-between',
      alignItems: 'center',
      padding: '16px 40px',
      background: '#0f172a', // Solid dark slate background
      borderBottom: '1px solid #1e293b', // Razor-sharp border instead of a blurry shadow
    },
    flatCard: {
      background: '#0f172a',
      borderRadius: '12px', // Tighter, cleaner corners
      padding: '24px',
      border: '1px solid #1e293b', // Crisp containment line
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.25)', // Elegant drop shadow
    },
    concaveCard: {
      background: '#1e293b', // Flat secondary surface
      borderRadius: '8px',
      padding: '16px',
      border: '1px solid #334155',
    },
    input: {
      width: '100%',
      boxSizing: 'border-box',
      padding: '12px 14px',
      background: '#1e293b',
      border: '1px solid #334155',
      borderRadius: '8px',
      color: '#ffffff',
      fontSize: '14px',
      outline: 'none',
      transition: 'border-color 0.2s',
    },
    button: {
      width: '100%',
      background: '#2563eb', // Solid, high-converting royal blueprint blue
      color: '#ffffff',
      border: 'none',
      padding: '12px 16px',
      borderRadius: '8px',
      fontWeight: '600',
      fontSize: '14px',
      cursor: 'pointer',
      transition: 'background-color 0.2s, transform 0.1s',
    },
    modalOverlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(2, 6, 23, 0.8)', // Deep slate overlay
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justify: 'center',
      zIndex: 1000,
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

  async function fetchLiveAnalytics(userId) {
    try {
      const { data: biz } = await supabase.from('business_settings').select('id').eq('owner_id', userId).maybeSingle();
      if (biz) {
        const { data: receipts } = await supabase
          .from('receipts')
          .select('total_amount, created_at')
          .eq('business_id', biz.id)
          .order('created_at', { ascending: true });

        if (receipts && receipts.length > 0) {
          const totalVol = receipts.reduce((sum, rx) => sum + (rx.total_amount || 0), 0);
          setTxCount(receipts.length);
          setTxVolume(totalVol);

          const maxTx = Math.max(...receipts.map(r => r.total_amount || 1));

          const historicalPrices = receipts.map(rx => {
            const rawAmount = rx.total_amount || 0;
            return Math.max(15, Math.min(90, (rawAmount / maxTx) * 90));
          });

          const paddedData = Array(28).fill(0).concat(historicalPrices).slice(-28);
          setGraphData(paddedData);
        }
      }
    } catch (err) {
      console.error("Analytics stream catch handled:", err.message);
    }
  }

async function handleAuth(type) {
    // Validation pre-check before disabling the UI
    if (!email || !password) {
      alert("Please fill in all authorization fields.");
      return;
    }

    try {
      if (type === 'login') {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
          alert(error.message);
          return;
        }
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) {
          alert(error.message);
          return;
        } else {
          setShowVerifyModal(true);
        }
      }
      // Only set loading/syncing states IF the operation passes initial structural checks
      setIsSyncing(true);
    } catch (err) {
      alert(err.message);
    } finally {
      // Short delay ensures processing registers safely across your browser layout
      setTimeout(() => {
        setIsSyncing(false);
      }, 400);
    }
  }

  async function handleSave() {
    if (!user?.id) {
      alert("Sync Blocked: Active authentication session required.");
      return;
    }

    const cleanBusinessName = settings.business_name?.trim();
    const cleanWebhookSlug = settings.webhook_slug?.trim();

    if (!cleanBusinessName || !cleanWebhookSlug) {
      alert("Validation Failed: Required parameter fields cannot be left blank.");
      return;
    }

    // Let the payload build completely BEFORE changing component loading layouts
    const payload = {
      owner_id: user.id,
      business_name: cleanBusinessName,
      store_address: settings.store_address?.trim() || '',
      discount_percentage: Number(settings.discount_percentage ?? 10),
      webhook_slug: cleanWebhookSlug,
      currency: settings.currency || 'ZAR',
      logo_url: settings.logo_url || ''
    };

    if (settings.id) {
      payload.id = settings.id;
    }

    setIsSyncing(true);
    
    try {
      const { data, error } = await supabase
        .from('business_settings')
        .upsert(payload, { onConflict: 'owner_id' })
        .select();

      if (error) throw error;

      alert('Live Agent Settings Synced Successfully!');
      if (data && data[0]) {
        setSettings(data[0]); 
      }
    } catch (error) {
      console.error("Profile synchronization failed:", error);
      alert('Error syncing live profile: ' + (error.message || 'Unknown error'));
    } finally {
      setIsSyncing(false);
    }
  }

  const activeCurrencySymbol = CURRENCY_OPTIONS.find(c => c.code === (settings?.currency || 'ZAR'))?.symbol || 'R';

  return (
    <div style={{ ...styles.container, opacity: isSyncing ? 0.6 : 1 }}>
      {/* GLOBAL MODAL 1: AWAITING VERIFICATION LINK */}
      {showVerifyModal && (
        <div style={styles.modalOverlay}>
          <div style={{ ...styles.flatCard, maxWidth: '400px', width: '90%', textAlign: 'center' }}>
            <div style={{ fontSize: '40px', marginBottom: '16px' }}>✉️</div>
            <h3 style={{ margin: '0 0 10px 0', fontSize: '18px', color: '#fff' }}>Verification Link Dispatched</h3>
            <p style={{ fontSize: '13px', color: '#a3b1c6', lineHeight: '1.5', margin: '0 0 20px 0' }}>
              We have sent a confirmation email to <strong style={{ color: '#fff' }}>{email}</strong>. Please check your inbox and click the activation link to configure your system node.
            </p>
            <button onClick={() => setShowVerifyModal(false)} style={{ ...styles.button, padding: '12px 24px', fontSize: '13px', width: 'auto' }}>
              Acknowledge
            </button>
          </div>
        </div>
      )}

      {/* GLOBAL MODAL 2: EMAIL CONFIRMED SUCCESS POP-UP */}
      {showSuccessModal && (
        <div style={styles.modalOverlay}>
          <div style={{ ...styles.flatCard, maxWidth: '400px', width: '90%', textAlign: 'center', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
            <div style={{ fontSize: '40px', marginBottom: '16px', color: '#10b981' }}>⚡</div>
            <h3 style={{ margin: '0 0 10px 0', fontSize: '19px', color: '#10b981', fontWeight: '800', letterSpacing: '0.5px' }}>Email Confirmed Successfully!</h3>
            <p style={{ fontSize: '13px', color: '#a3b1c6', lineHeight: '1.5', margin: '0 0 24px 0' }}>
              Your merchant node identity has been verified by the authentication gateway. Welcome to RuachAgent.
            </p>
            <button 
              onClick={() => setShowSuccessModal(false)} 
              style={{ 
                ...styles.button, 
                padding: '12px 30px', 
                fontSize: '13px', 
                width: 'auto',
                color: '#fff',
                boxShadow: '6px 6px 12px rgba(0, 0, 0, 0.6), -6px -6px 12px rgba(16, 185, 129, 0.15)' 
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
          <span style={{ fontWeight: '900', fontSize: '20px', letterSpacing: '2px', color: '#fff' }}>RUACHAGENT</span>
          <span style={{ fontSize: '10px', boxShadow: 'inset 2px 2px 5px #151a22, inset -2px -2px 5px #27303e', color: '#3b82f6', padding: '4px 10px', borderRadius: '20px', fontWeight: 'bold' }}>NEUMORPHIC NODE</span>
        </div>
        {user && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <span style={{ fontSize: '13px', color: '#9ca3af', fontFamily: 'monospace' }}>{user.email}</span>
            <button onClick={() => supabase.auth.signOut()} style={{ background: '#0a0b0d', border: 'none', color: '#ef4444', padding: '8px 16px', borderRadius: '8px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '3px 3px 6px #000, -3px -3px 6px rgba(255,255,255,0.05)' }}>Disconnect</button>
          </div>
        )}
      </header>

      <input style={{ display: 'none' }} type="password" autoComplete="on" />

      <main style={{ padding: '40px 20px', maxWidth: '1000px', margin: '0 auto' }}>
        {!user ? (
          /* NEUMORPHIC AUTH SECTION */
          <section style={{ maxWidth: '400px', margin: '60px auto 0 auto' }}>
            <div style={styles.flatCard}>
              <h2 style={{ textAlign: 'center', fontSize: '22px', fontWeight: '800', margin: '0 0 25px 0' }}>Master Portal Login</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <input type="email" placeholder="Merchant Email" value={email} onChange={e => setEmail(e.target.value)} style={styles.input} />
                <input type="password" placeholder="Access Password" value={password} onChange={e => setPassword(e.target.value)} style={styles.input} />
                <button onClick={() => handleAuth('login')} style={styles.button} disabled={isSyncing}>
                  {isSyncing ? 'Verifying Node...' : 'Authenticate Identity'}
                </button>
                <button onClick={() => handleAuth('register')} style={{ ...styles.button, color: '#a3b1c6' }} disabled={isSyncing}>Register New Node</button>
              </div>
            </div>
          </section>
        ) : (
          /* NEUMORPHIC WORKSPACE SECTION */
          <section style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', alignItems: 'start' }}>
            {/* COLUMN 1: AGENT PARAMETERS CONTROL BLOCK */}
            <div style={styles.flatCard}>
              <h3 style={{ margin: '0 0 20px 0', fontSize: '15px', fontWeight: '800', color: '#3b82f6', letterSpacing: '0.8px', textTransform: 'uppercase' }}>
                Agent Parameters
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {/* BRAND LOGO */}
                <div>
                  <label style={{ fontSize: '10px', color: '#a3b1c6', fontWeight: '700', display: 'block', marginBottom: '8px', letterSpacing: '0.5px' }}>
                    BUSINESS BRAND LOGO (PICTURE PRINT)
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <label style={{ ...styles.button, display: 'inline-block', padding: '12px 20px', fontSize: '12px', color: '#3b82f6', cursor: 'pointer', textAlign: 'center', flex: 1 }}>
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
                    <div style={{ ...styles.concaveCard, padding: '5px', width: '50px', height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', borderRadius: '12px' }}>
                      {settings?.logo_url ? (
                        <img src={settings.logo_url} alt="Logo Mirror" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }} />
                      ) : (
                        <span style={{ fontSize: '18px', color: '#4b5563' }}>🖼️</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* LIVE WEBHOOK SLUG */}
                <div>
                  <label style={{ fontSize: '10px', color: '#a3b1c6', fontWeight: '700', display: 'block', marginBottom: '8px', letterSpacing: '0.5px' }}>
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
                    style={{ ...styles.input, fontSize: '12px', fontFamily: 'monospace', letterSpacing: '0.5px', color: '#fff' }} 
                  />
                </div>

                {/* DYNAMIC CURRENCY SELECT SYSTEM */}
                <div>
                  <label style={{ fontSize: '10px', color: '#a3b1c6', fontWeight: '700', display: 'block', marginBottom: '8px', letterSpacing: '0.5px' }}>
                    OPERATIONAL CURRENCY
                  </label>
                  <div style={{ position: 'relative' }}>
                    <select 
                      value={settings?.currency || 'ZAR'} 
                      onChange={(e) => {
                        const val = e.target.value;
                        setSettings(prev => ({ ...prev, currency: val }));
                      }} 
                      style={{ ...styles.input, fontSize: '12px', fontFamily: 'monospace', letterSpacing: '0.5px', color: '#fff', appearance: 'none', cursor: 'pointer', paddingRight: '30px' }}
                    >
                      {CURRENCY_OPTIONS.map((curr) => (
                        <option key={curr.code} value={curr.code} style={{ background: '#0a0b0d', color: '#fff', fontFamily: 'monospace' }}>
                          {curr.name} ({curr.symbol})
                        </option>
                      ))}
                    </select>
                    <span style={{ position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)', fontSize: '10px', color: '#3b82f6', pointerEvents: 'none', fontFamily: 'monospace' }}>▼</span>
                  </div>
                </div>

                {/* BUSINESS BRAND NAME */}
                <div>
                  <label style={{ fontSize: '10px', color: '#a3b1c6', fontWeight: '700', display: 'block', marginBottom: '8px', letterSpacing: '0.5px' }}>
                    BUSINESS BRAND NAME
                  </label>
                  <input 
                    type="text" 
                    value={settings?.business_name || ''} 
                    onChange={(e) => {
                      const val = e.target.value;
                      setSettings(prev => ({ ...prev, business_name: val }));
                    }} 
                    style={{ ...styles.input, fontSize: '12px', fontFamily: 'monospace', letterSpacing: '0.5px', color: '#fff' }} 
                  />
                </div>

                {/* PHYSICAL OUTLET ADDRESS */}
                <div>
                  <label style={{ fontSize: '10px', color: '#a3b1c6', fontWeight: '700', display: 'block', marginBottom: '8px', letterSpacing: '0.5px' }}>
                    PHYSICAL OUTLET ADDRESS
                  </label>
                  <textarea 
                    value={settings?.store_address || ''} 
                    onChange={(e) => {
                      const val = e.target.value;
                      setSettings(prev => ({ ...prev, store_address: val }));
                    }} 
                    style={{ ...styles.input, minHeight: '70px', resize: 'none', fontSize: '12px', fontFamily: 'monospace', letterSpacing: '0.5px', color: '#fff', lineHeight: '1.6' }} 
                  />
                </div>

                {/* AI DISCOUNT COMPILER VALUE (%) */}
                <div>
                  <label style={{ fontSize: '10px', color: '#a3b1c6', fontWeight: '700', display: 'block', marginBottom: '8px', letterSpacing: '0.5px' }}>
                    AI DISCOUNT COMPILER VALUE (%)
                  </label>
                  <input 
                    type="number" 
                    value={settings?.discount_percentage ?? 10} 
                    onChange={(e) => {
                      const val = parseInt(e.target.value) || 0;
                      setSettings(prev => ({ ...prev, discount_percentage: val }));
                    }} 
                    style={{ ...styles.input, fontSize: '12px', fontFamily: 'monospace', letterSpacing: '0.5px', color: '#fff' }} 
                  />
                </div>

                {/* TRIGGER LIVE HANDSHAKE SYNC */}
                <button 
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleSave();
                  }} 
                  style={{ ...styles.button, color: '#10b981', marginTop: '10px', fontSize: '13px', letterSpacing: '0.5px', textTransform: 'uppercase', cursor: 'pointer' }}
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

  {/* NEW FLAT GRID FOCUSING ON REVENUE VOLUME & LEASE SUBSCRIPTION STATUS */}
  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
    <div style={{ ...styles.concaveCard, padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
      <div style={{ fontSize: '9px', color: '#8a99ad', fontWeight: '700', letterSpacing: '0.8px', textTransform: 'uppercase' }}>
        Processed Volume
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '3px' }}>
        <span style={{ fontSize: '13px', fontWeight: '600', color: '#3b82f6', fontFamily: 'monospace' }}>{activeCurrencySymbol}</span>
        <span style={{ fontSize: '20px', fontWeight: '900', color: '#fff', fontFamily: 'monospace', letterSpacing: '-0.3px' }}>
          {txVolume.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </span>
      </div>
    </div>

    <div style={{ ...styles.concaveCard, padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
      <div style={{ fontSize: '9px', color: '#8a99ad', fontWeight: '700', letterSpacing: '0.8px', textTransform: 'uppercase' }}>
        Agent Lease Cost
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '3px' }}>
        <span style={{ fontSize: '13px', fontWeight: '600', color: '#10b981', fontFamily: 'monospace' }}>$</span>
        <span style={{ fontSize: '20px', fontWeight: '900', color: '#10b981', fontFamily: 'monospace', letterSpacing: '-0.3px' }}>
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
                <h3 style={{ margin: '0 0 12px 0', fontSize: '16px', fontWeight: '800' }}>Integration Endpoint Target</h3>
                <div style={{ ...styles.concaveCard, fontFamily: 'monospace', fontSize: '12px', color: '#3b82f6', wordBreak: 'break-all', padding: '15px', marginBottom: '14px' }}>
                  {settings?.webhook_slug ? `https://agadjdvhqguunowplbak.functions.supabase.co/receipt-agent?slug=${settings.webhook_slug}` : 'Define a unique webhook slug first...'}
                </div>
                <div style={{ fontSize: '11px', color: '#8a99ad', lineHeight: '1.5', paddingLeft: '2px', fontFamily: 'system-ui, sans-serif' }}>
                  💡 <span style={{ fontWeight: '600' }}>Deployment Action:</span> Paste this generated webhook link into your <strong style={{ color: '#fff' }}>[Inbound Email Webhook Configuration or POS Webhook Portal]</strong> to begin routing automated transaction slip payloads directly to your AI agent node.
                </div>
              </div>

              {/* LIVE INBOX EMAIL TILL SLIP MIRROR */}
              <div style={{ ...styles.flatCard, border: '1px solid rgba(59, 130, 246, 0.1)' }}>
                <h3 style={{ margin: '0 0 15px 0', fontSize: '13px', fontWeight: '800', color: '#3b82f6', letterSpacing: '1px', textTransform: 'uppercase' }}>
                  Live Inbox Email Till Slip Mirror
                </h3>
                
                {/* ADVANCED THERMAL RECEIPT CONTAINER */}
                <div style={{ 
                  background: '#fcfdfd',
                  backgroundImage: 'linear-gradient(rgba(0,0,0,0.01) 1px, transparent 1px)',
                  backgroundSize: '100% 4px',
                  color: '#11161d', 
                  borderRadius: '16px', 
                  padding: '30px 24px', 
                  boxShadow: '0 15px 35px rgba(0,0,0,0.5)', 
                  fontFamily: 'Courier New, Courier, monospace',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  
                  {/* CENTRAL BIG LOGO WATERMARK */}
                  {settings?.logo_url && (
                    <div style={{
                      position: 'absolute',
                      top: '55%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      width: '260px',
                      height: '260px',
                      backgroundImage: `url(${settings.logo_url})`,
                      backgroundSize: 'contain',
                      backgroundPosition: 'center',
                      backgroundRepeat: 'no-repeat',
                      opacity: 0.06,
                      pointerEvents: 'none',
                      zIndex: 1
                    }} />
                  )}

                  {/* RECEIPT CONTENT WRAPPER */}
                  <div style={{ position: 'relative', zIndex: 2 }}>
                    
                    {/* TOP METADATA ROW */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', fontSize: '10px', color: '#555', marginBottom: '15px' }}>
                      <span>&nbsp;</span>
                      <div style={{ textAlign: 'right', lineHeight: '1.4' }}>
                        <div><strong>Transaction</strong></div>
                        <div>21. Jan 21 19:43:36</div>
                      </div>
                    </div>

                    {/* TOP MINI LOGO */}
                    <div style={{ textAlign: 'center', marginBottom: '15px' }}>
                      {settings?.logo_url ? (
                        <img src={settings.logo_url} alt="Merchant Logo" style={{ maxHeight: '50px', maxWidth: '160px', objectFit: 'contain' }} />
                      ) : (
                        <div style={{ border: '1px dashed #94a3b8', padding: '6px', color: '#64748b', fontSize: '10px', fontWeight: 'bold' }}>[ NO LOGO RECORDED ]</div>
                      )}
                    </div>

                    {/* BRAND DETAILS */}
                    <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                      <strong style={{ fontSize: '18px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.2px', display: 'block', color: '#000' }}>
                        {settings?.business_name || 'MY BUSINESS BRAND'}
                      </strong>
                      <div style={{ fontSize: '11px', color: '#222', marginTop: '6px', whiteSpace: 'pre-wrap', lineHeight: '1.4', fontWeight: '600' }}>
                        {settings?.store_address || 'Outlet Physical Address Street\nKrugersdorp, South Africa'}
                      </div>
                      <div style={{ fontSize: '11px', color: '#444', marginTop: '4px', fontFamily: 'sans-serif' }}>
                        {user?.email || 'info@merchantnode.com'}
                      </div>
                    </div>

                    {/* LINE SEPARATOR */}
                    <div style={{ borderBottom: '1px dashed #444', marginBottom: '15px' }}></div>

                    {/* ITEMIZATION */}
                    <div style={{ fontSize: '11px', lineHeight: '1.8', marginBottom: '12px', fontWeight: '600' }}>
                      <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px', color: '#444' }}>Items purchased:</div>
                      
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <span style={{ maxWidth: '75%' }}>1x Premium Sample Merchandise Item</span>
                        <span>{activeCurrencySymbol}120.00</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span style={{ maxWidth: '75%' }}>1x Standard Agent Automation Node Addon</span>
                        <span>{activeCurrencySymbol}80.00</span>
                      </div>
                      
                      {/* TOTAL DUE ROW (TAX IGNORED) */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #111', marginTop: '8px', paddingTop: '8px', fontWeight: '900', fontSize: '13px', color: '#000' }}>
                        <span>TOTAL DUE</span>
                        <span>{activeCurrencySymbol}200.00</span>
                      </div>
                    </div>

                    {/* VOUCHER SECTION BOX */}
                    <div style={{ background: 'rgba(240, 244, 248, 0.85)', border: '1px solid #dbe2e9', borderRadius: '12px', padding: '16px 12px', textAlign: 'center', marginTop: '20px' }}>
                      <span style={{ fontSize: '9px', color: '#111', fontWeight: '900', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', marginBottom: '10px', letterSpacing: '0.5px' }}>
                        ⚡ NEXT VISIT VOUCHER CODE INSIDE
                      </span>
                      
                      <div style={{ display: 'inline-block', padding: '6px', background: '#fff', borderRadius: '10px', border: '1px solid #cbd5e1', boxShadow: '0 2px 8px rgba(0,0,0,0.03)', marginBottom: '4px' }}>
                        <img 
                          src={`https://api.qrserver.com/v1/create-qr-code/?size=115x115&data=${encodeURIComponent(
                            `https://ruachagent.net/redeem?token=${settings?.webhook_slug || 'node'}_preview`
                          )}&color=11161d`} 
                          alt="Voucher Token QR" 
                          style={{ width: '115px', height: '115px', display: 'block' }}
                        />
                      </div>
                      
                      <div style={{ fontSize: '8px', color: '#444', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 'bold', marginBottom: '6px' }}>
                        Claim Discount
                      </div>

                      <div style={{ fontSize: '11px', color: '#333', lineHeight: '1.4', fontFamily: 'sans-serif', padding: '0 4px' }}>
                        Scan to instantly claim your <strong style={{ color: '#16a34a', fontWeight: '700' }}>{settings?.discount_percentage ?? 10}% discount</strong> balance.
                      </div>
                    </div>

                    {/* ACTIONS BUTTON */}
                    <div style={{ marginTop: '24px', textAlign: 'center' }}>
                      <a href="#download" onClick={(e) => e.preventDefault()} style={{ display: 'block', background: '#3b82f6', color: '#ffffff', textDecoration: 'none', padding: '14px', borderRadius: '8px', fontSize: '12px', fontWeight: 'bold', fontFamily: 'system-ui, sans-serif', boxShadow: '0 4px 14px rgba(59,130,246,0.4)', transition: 'all 0.2s' }}>
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