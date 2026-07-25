import { useState, useEffect, useRef } from 'react';
import { supabase } from './supabaseClient';
import { useNavigate } from "react-router-dom";

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
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [txCount, setTxCount] = useState(0);
  const [txVolume, setTxVolume] = useState(0);
  const [graphData, setGraphData] = useState(Array.from({ length: 28 }).map(() => 0));
  const [isSaveSyncing, setIsSaveSyncing] = useState(false);
  const [isAuthSyncing, setIsAuthSyncing] = useState(false);
  const [pendingLogoFile, setPendingLogoFile] = useState(null);
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [receipt, setReceipt] = useState(null);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [subscriptionLoading, setSubscriptionLoading] = useState(true);
  const [showTrialWelcomeModal, setShowTrialWelcomeModal] = useState(false);
  const [trialDaysRemaining, setTrialDaysRemaining] = useState(0);
  const [trialExpiryDate, setTrialExpiryDate] = useState(null);
  const [signupSuccessMessage, setSignupSuccessMessage] = useState("");
  const navigate = useNavigate();
  const [settings, setSettings] = useState({
    business_name: '',
    store_address: '',
    discount_percentage: 10,
    webhook_slug: '',
    currency: 'ZAR',
    logo_url: ''
  });

  // --- CHAT UI STATE ---
  const [activeTab, setActiveTab] = useState('ai-prompts');
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text: "Hello! 👋 I'm your RuachAgent AI assistant. I can help you configure webhooks, customize till slips, interpret analytics, and automate your receipt workflows. Ask me anything about your merchant workspace.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [isChatTyping, setIsChatTyping] = useState(false);
  const [rightPanelOpen, setRightPanelOpen] = useState(true);
  const [activeBlockModal, setActiveBlockModal] = useState(null); // NEW: tracks which block modal is open
  const chatEndRef = useRef(null);

  const activeInboxesCount = user ? 1 : 0;
  const totalParsedCount = txCount;
  const inboxGraphData = graphData;
  const selectedDateRangeLabel = "PAST_28_DAYS";

  // --- RESPONSIVE BREAKPOINTS ---
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  const isMobile = windowWidth <= 768;
  const isTablet = windowWidth > 768 && windowWidth <= 1200;
  const isDesktop = windowWidth > 1200;

  // --- THEME SYSTEM ---
  const theme = {
    bg: '#0a0e17',
    bgSecondary: '#0d1320',
    bgTertiary: '#111827',
    bgCard: 'rgba(13, 19, 32, 0.85)',
    bgCardHover: 'rgba(20, 28, 45, 0.95)',
    border: 'rgba(0, 227, 216, 0.15)',
    borderActive: 'rgba(0, 227, 216, 0.4)',
    cyan: '#00e3d8',
    cyanGlow: 'rgba(0, 227, 216, 0.3)',
    purple: '#a855f7',
    purpleGlow: 'rgba(168, 85, 247, 0.3)',
    green: '#10b981',
    red: '#ef4444',
    text: '#e2e8f0',
    textMuted: '#64748b',
    textDim: '#475569',
    white: '#ffffff',
  };

  const styles = {
    container: {
      minHeight: '100vh',
      background: `radial-gradient(ellipse at top left, rgba(0,227,216,0.04), transparent 50%), radial-gradient(ellipse at bottom right, rgba(168,85,247,0.03), transparent 50%), ${theme.bg}`,
      color: theme.text,
      fontFamily: `-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif`,
      overflow: 'hidden',
      boxSizing: 'border-box',
    },
    appLayout: {
      display: 'grid',
      gridTemplateColumns: isDesktop ? '78px 1fr 380px' : isTablet ? '70px 1fr' : '1fr',
      height: '100vh',
      gap: 0,
    },
    // --- THIN LEFT SIDEBAR ---
    sidebar: {
      background: 'linear-gradient(180deg, #0a0f1a 0%, #0d1320 100%)',
      borderRight: `1px solid ${theme.border}`,
      display: 'flex',
      flexDirection: 'column',
      padding: '16px 10px',
      overflowY: 'auto',
      alignItems: 'center',
      gap: '6px',
    },
    sidebarLogo: {
      width: '44px',
      height: '44px',
      background: 'linear-gradient(135deg, #00e3d8, #00b4d8)',
      borderRadius: '12px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: '900',
      fontSize: '15px',
      color: '#0a0e17',
      boxShadow: `0 0 18px ${theme.cyanGlow}`,
      marginBottom: '18px',
      flexShrink: 0,
    },
    thinNavItem: {
      width: '56px',
      padding: '10px 6px',
      borderRadius: '12px',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '4px',
      border: '1px solid transparent',
      position: 'relative',
    },
    thinNavItemActive: {
      background: 'rgba(0, 227, 216, 0.10)',
      border: `1px solid ${theme.borderActive}`,
    },
    thinNavIcon: {
      fontSize: '18px',
      lineHeight: 1,
    },
    thinNavLabel: {
      fontSize: '8px',
      fontWeight: '700',
      color: theme.textMuted,
      letterSpacing: '0.3px',
      textTransform: 'uppercase',
      textAlign: 'center',
      lineHeight: '1.1',
    },
    thinNavLabelActive: {
      color: theme.cyan,
    },
    sidebarDivider: {
      width: '36px',
      height: '1px',
      background: theme.border,
      margin: '8px 0',
    },
    sidebarBottomAvatar: {
      marginTop: 'auto',
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      background: 'linear-gradient(135deg, #a855f7, #7c3aed)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: '800',
      fontSize: '14px',
      color: '#fff',
      cursor: 'pointer',
      boxShadow: `0 0 12px ${theme.purpleGlow}`,
    },

    // --- MAIN CHAT AREA ---
    mainArea: {
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      overflow: 'hidden',
      borderRight: isDesktop ? `1px solid ${theme.border}` : 'none',
    },
    chatHeader: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '14px 22px',
      borderBottom: `1px solid ${theme.border}`,
      background: 'rgba(10, 14, 23, 0.8)',
      backdropFilter: 'blur(12px)',
      flexShrink: 0,
    },
    chatTitle: {
      fontSize: '13px',
      fontWeight: '800',
      color: theme.white,
      letterSpacing: '1.5px',
      textTransform: 'uppercase',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
    },
    onlineDot: {
      width: '8px',
      height: '8px',
      borderRadius: '50%',
      background: theme.green,
      boxShadow: `0 0 8px ${theme.green}`,
    },

    // --- TOP GRAPHIC BLOCKS (disguised clickable graphics) ---
    topBlocksRow: {
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr 1fr',
      gap: '12px',
      padding: '16px 22px 12px',
      flexShrink: 0,
    },
    graphicCard: {
      position: 'relative',
      borderRadius: '18px',
      padding: '16px',
      cursor: 'pointer',
      overflow: 'hidden',
      border: '1px solid transparent',
      transition: 'all 0.25s ease',
      minHeight: '110px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
    },
    graphicCardTop: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
    },
    graphicIconWrap: {
      width: '40px',
      height: '40px',
      borderRadius: '12px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '18px',
      backdropFilter: 'blur(8px)',
    },
    graphicBadge: {
      fontSize: '9px',
      fontWeight: '700',
      padding: '3px 8px',
      borderRadius: '20px',
      letterSpacing: '0.5px',
      textTransform: 'uppercase',
    },
    graphicTitle: {
      fontSize: '11px',
      fontWeight: '800',
      letterSpacing: '1.2px',
      textTransform: 'uppercase',
      marginBottom: '2px',
    },
    graphicSub: {
      fontSize: '10px',
      opacity: 0.75,
      lineHeight: '1.4',
    },
    graphicMetric: {
      fontSize: '20px',
      fontWeight: '900',
      fontFamily: 'monospace',
      letterSpacing: '0.5px',
    },
    graphicMiniGraph: {
      display: 'flex',
      alignItems: 'flex-end',
      gap: '2px',
      height: '28px',
      marginTop: '6px',
    },
    graphicMiniBar: {
      flex: 1,
      borderRadius: '2px',
      minWidth: '3px',
    },

    // --- CHAT MESSAGES ---
    chatMessages: {
      flex: 1,
      overflowY: 'auto',
      padding: '18px 22px',
      display: 'flex',
      flexDirection: 'column',
      gap: '18px',
    },
    messageRow: {
      display: 'flex',
      gap: '12px',
      alignItems: 'flex-start',
    },
    messageRowUser: {
      flexDirection: 'row-reverse',
    },
    avatar: {
      width: '36px',
      height: '36px',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '13px',
      fontWeight: '700',
      flexShrink: 0,
    },
    messageBubble: {
      maxWidth: '75%',
      padding: '13px 17px',
      borderRadius: '16px',
      fontSize: '13px',
      lineHeight: '1.6',
    },
    messageBubbleAI: {
      background: theme.bgCard,
      border: `1px solid ${theme.border}`,
      color: theme.text,
      borderTopLeftRadius: '4px',
    },
    messageBubbleUser: {
      background: 'linear-gradient(135deg, rgba(0,227,216,0.15), rgba(0,180,216,0.1))',
      border: `1px solid ${theme.borderActive}`,
      color: theme.white,
      borderTopRightRadius: '4px',
    },

    // --- WIDE AI INPUT ---
    chatInputArea: {
      padding: '14px 22px 18px',
      borderTop: `1px solid ${theme.border}`,
      background: 'rgba(10, 14, 23, 0.92)',
      backdropFilter: 'blur(10px)',
      flexShrink: 0,
    },
    quickPrompts: {
      display: 'flex',
      gap: '8px',
      overflowX: 'auto',
      marginBottom: '10px',
      paddingBottom: '4px',
    },
    quickPromptChip: {
      padding: '7px 12px',
      background: 'rgba(0, 227, 216, 0.06)',
      border: `1px solid ${theme.border}`,
      borderRadius: '20px',
      color: theme.cyan,
      fontSize: '11px',
      fontWeight: '600',
      cursor: 'pointer',
      whiteSpace: 'nowrap',
      transition: 'all 0.2s ease',
      flexShrink: 0,
    },
    chatInputWrap: {
      display: 'flex',
      gap: '10px',
      alignItems: 'center',
      background: theme.bgTertiary,
      border: `1px solid ${theme.border}`,
      borderRadius: '16px',
      padding: '6px 6px 6px 16px',
    },
    chatInputBox: {
      flex: 1,
      background: 'transparent',
      border: 'none',
      color: theme.white,
      fontSize: '13px',
      outline: 'none',
      padding: '10px 0',
    },
    sendBtn: {
      padding: '10px 18px',
      background: 'linear-gradient(135deg, #a855f7, #7c3aed)',
      border: 'none',
      borderRadius: '12px',
      color: theme.white,
      fontSize: '14px',
      cursor: 'pointer',
      boxShadow: `0 0 15px ${theme.purpleGlow}`,
      fontWeight: '700',
    },
    chatFooter: {
      fontSize: '10px',
      color: theme.textDim,
      marginTop: '8px',
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      justifyContent: 'center',
    },

    // --- RIGHT PANEL (Receipt) ---
    rightPanel: {
      background: 'linear-gradient(180deg, #0a0f1a 0%, #0d1320 100%)',
      overflowY: 'auto',
      padding: '20px 16px',
    },
    receiptCard: {
      background: 'linear-gradient(180deg, rgba(13,19,32,0.95), rgba(10,14,23,0.98))',
      border: `2px solid ${theme.cyan}`,
      borderRadius: '20px',
      padding: '20px',
      boxShadow: `0 0 20px ${theme.cyanGlow}, 0 0 40px rgba(0,227,216,0.1)`,
      position: 'relative',
      overflow: 'hidden',
    },
    receiptHeader: { textAlign: 'center', marginBottom: '16px' },
    receiptLogoCircle: {
      width: '80px', height: '80px', borderRadius: '50%',
      border: `2px solid ${theme.purple}`, margin: '0 auto 12px',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      overflow: 'hidden', boxShadow: `0 0 15px ${theme.purpleGlow}`,
    },
    receiptMeta: {
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      marginBottom: '16px', padding: '8px 12px',
      background: 'rgba(168,85,247,0.06)', borderRadius: '10px',
      border: `1px solid rgba(168,85,247,0.2)`,
    },
    receiptItem: {
      display: 'flex', alignItems: 'center', gap: '12px', padding: '12px',
      background: 'rgba(168,85,247,0.04)', borderRadius: '12px',
      border: `1px solid rgba(168,85,247,0.12)`, marginBottom: '8px',
    },
    receiptTotal: {
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '14px 16px',
      background: 'linear-gradient(135deg, rgba(168,85,247,0.12), rgba(168,85,247,0.06))',
      borderRadius: '12px', border: `2px solid ${theme.purple}`,
      marginTop: '12px', marginBottom: '16px',
    },
    voucherBox: {
      background: 'rgba(10, 20, 28, 0.7)', border: `2px solid ${theme.cyan}`,
      borderRadius: '16px', padding: '16px', textAlign: 'center',
      marginBottom: '12px', boxShadow: `0 0 12px ${theme.cyanGlow}`,
    },
    qrBox: {
      display: 'inline-block', padding: '10px', background: theme.white,
      borderRadius: '12px', marginBottom: '10px',
    },
    promoBanner: {
      background: 'linear-gradient(135deg, rgba(239,68,68,0.15), rgba(239,68,68,0.05))',
      border: `1px solid rgba(239,68,68,0.3)`, borderRadius: '10px',
      padding: '10px 14px', textAlign: 'center', fontSize: '11px',
      fontWeight: '700', color: '#fca5a5', marginBottom: '12px',
    },
    downloadBtn: {
      width: '100%', padding: '12px',
      background: 'linear-gradient(135deg, rgba(0,227,216,0.12), rgba(0,227,216,0.06))',
      border: `1px solid ${theme.borderActive}`, borderRadius: '12px',
      color: theme.cyan, fontSize: '12px', fontWeight: '700',
      cursor: 'pointer', display: 'flex', alignItems: 'center',
      justifyContent: 'center', gap: '8px',
    },

    // --- BLOCK DETAIL MODAL ---
    blockModalOverlay: {
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(2, 8, 12, 0.85)', backdropFilter: 'blur(12px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 1000, padding: isMobile ? '14px' : '22px', boxSizing: 'border-box',
    },
    blockModalCard: {
      maxWidth: '520px', width: '92%',
      position: 'relative', overflow: 'hidden',
      border: `1px solid ${theme.borderActive}`,
      borderRadius: '22px',
      background: 'linear-gradient(145deg, #050a14 0%, #0a1220 55%, #050a14 100%)',
      boxShadow: `0 0 30px ${theme.cyanGlow}, 0 0 60px rgba(168,85,247,0.12)`,
      padding: '28px 24px',
    },
    blockModalClose: {
      position: 'absolute', top: '14px', right: '14px',
      width: '32px', height: '32px', borderRadius: '50%',
      background: 'rgba(255,255,255,0.06)', border: `1px solid ${theme.border}`,
      color: theme.textMuted, cursor: 'pointer',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: '14px', fontWeight: '700',
    },
    blockModalHeader: {
      display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px',
    },
    blockModalIcon: {
      width: '52px', height: '52px', borderRadius: '14px',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: '24px',
    },
    blockModalRow: {
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '12px 14px', background: 'rgba(0,227,216,0.04)',
      border: `1px solid ${theme.border}`, borderRadius: '10px',
      marginBottom: '8px',
    },

    // --- GLOBAL MODAL (preserved) ---
    modalOverlay: {
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(2, 8, 12, 0.85)', backdropFilter: 'blur(12px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 1000, padding: isMobile ? '14px' : '22px', boxSizing: 'border-box',
    },
    modalCard: {
      maxWidth: '460px', width: '90%', textAlign: 'center', position: 'relative',
      overflow: 'hidden', border: '1px solid rgba(0,255,170,0.25)',
      borderRadius: '24px',
      background: 'linear-gradient(145deg, #050505 0%, #071822 55%, #02110d 100%)',
      boxShadow: '0 0 20px rgba(0,255,170,0.18), 0 0 45px rgba(0,198,255,0.12)',
      padding: '32px 24px',
    },
    primaryBtn: {
      width: '100%', padding: '16px', fontSize: '14px', fontWeight: '700',
      border: 'none', borderRadius: '14px', cursor: 'pointer', color: '#ffffff',
      background: 'linear-gradient(90deg, #00F5A0 0%, #00C6FF 100%)',
      boxShadow: '0 0 18px rgba(0,255,170,0.35), 0 0 30px rgba(0,198,255,0.25)',
      transition: 'all .25s ease', textTransform: 'uppercase', letterSpacing: '0.5px',
    },
  };

  // ============================================================
  // BACKEND FUNCTIONS (PRESERVED)
  // ============================================================
  async function getActiveUser() {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) { console.error("Session retrieval failed:", error.message); return null; }
      return session?.user || null;
    } catch (err) { console.error("Auth session crash:", err.message); return null; }
  }

  async function fetchLiveAnalytics(userId) {
    try {
      if (!userId) { console.warn("Analytics blocked: No authenticated user."); return; }
      const { data: biz, error: bizError } = await supabase
        .from('business_settings').select('id').eq('owner_id', userId).maybeSingle();
      if (bizError) throw bizError;
      if (!biz?.id) {
        setTxCount(0); setTxVolume(0);
        setGraphData(Array.from({ length: 28 }).map(() => 0));
        return;
      }
      const { data: analytics, error: rpcError } = await supabase
        .rpc('get_merchant_analytics', { target_business_id: biz.id });
      if (rpcError) throw rpcError;
      if (analytics && analytics.length > 0) {
        const stats = analytics[0];
        setTxCount(Number(stats.total_count) || 0);
        setTxVolume(Number(stats.total_volume) || 0);
        const rawPoints = stats.graph_points || [];
        if (rawPoints.length > 0) {
          const chronologicalPoints = [...rawPoints].reverse();
          const maxTx = Math.max(...chronologicalPoints.map(v => Number(v) || 1), 1);
          const historicalPrices = chronologicalPoints.map(val => {
            const rawAmount = Number(val) || 0;
            return Math.max(15, Math.min(90, (rawAmount / maxTx) * 90));
          });
          const paddedData = Array(28).fill(0).concat(historicalPrices).slice(-28);
          setGraphData(paddedData);
        } else {
          setGraphData(Array.from({ length: 28 }).map(() => 0));
        }
      } else {
        setTxCount(0); setTxVolume(0);
        setGraphData(Array.from({ length: 28 }).map(() => 0));
      }
    } catch (err) { console.error("Analytics stream catch handled:", err.message); }
  }

  async function fetchMerchantSettings(userId) {
    if (!userId) return;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);
    try {
      const query = supabase.from('business_settings').select('*')
        .eq('owner_id', userId).maybeSingle().abortSignal(controller.signal);
      const { data, error } = await query;
      if (error) throw error;
      if (data) {
        setSettings({
          id: data.id, owner_id: data.owner_id,
          business_name: data.business_name || '',
          store_address: data.store_address || '',
          discount_percentage: data.discount_percentage ?? 10,
          webhook_slug: data.webhook_slug || '',
          currency: data.currency || 'ZAR',
          logo_url: data.logo_url || '',
          voucher_expiration_days: data.voucher_expiration_days ?? 30
        });
      } else {
        setSettings({
          business_name: '', store_address: '',
          discount_percentage: 10, webhook_slug: '',
          currency: 'ZAR', logo_url: '', voucher_expiration_days: 30
        });
      }
    } catch (error) {
      if (error.name === 'AbortError') {
        console.warn("fetchMerchantSettings query aborted due to 10s timeout.");
      } else { console.error("Profile load failure:", error.message); }
      setSettings({
        business_name: '', store_address: '',
        discount_percentage: 10, webhook_slug: '',
        currency: 'ZAR', logo_url: '', voucher_expiration_days: 30
      });
    } finally { clearTimeout(timeoutId); }
  }

  async function checkSubscription(userId) {
    setSubscriptionLoading(true);
    try {
      let { data, error } = await supabase.from("subscriptions")
        .select(`subscription_status, trial_ends_at, trial_welcome_seen`)
        .eq("user_id", userId).maybeSingle();
      if (error) throw error;
      if (!data) {
        const trialEnds = new Date();
        trialEnds.setDate(trialEnds.getDate() + 3);
        const { data: newSub, error: insertError } = await supabase
          .from("subscriptions").upsert({
            user_id: userId, subscription_status: "trial",
            trial_ends_at: trialEnds.toISOString(), trial_welcome_seen: false
          }).select(`subscription_status, trial_ends_at, trial_welcome_seen`).single();
        if (insertError) throw insertError;
        data = newSub;
      }
      const now = new Date();
      const expiry = new Date(data.trial_ends_at);
      const msRemaining = expiry.getTime() - now.getTime();
      const daysRemaining = Math.max(0, Math.ceil(msRemaining / (1000 * 60 * 60 * 24)));
      setTrialDaysRemaining(daysRemaining);
      setTrialExpiryDate(expiry);
      const expired = msRemaining <= 0;
      if (data.subscription_status === "trial" && !expired && !data.trial_welcome_seen) {
        setShowTrialWelcomeModal(true);
      }
      if (expired && data.subscription_status !== "active") {
        setShowSubscriptionModal(true);
      }
    } catch (err) { console.error("Subscription check failed:", err); }
    finally { setSubscriptionLoading(false); }
  }

  useEffect(() => {
    let isMounted = true;
    const loadingFailsafe = setTimeout(() => {
      if (isMounted) { console.warn("Session check exceeded safety threshold."); setIsCheckingSession(false); }
    }, 4000);
    async function bootstrapSession() {
      try {
        setIsCheckingSession(true);
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user && isMounted) setUser(session.user);
      } catch (err) { console.error("Critical bootstrap session failure:", err); }
      finally { if (isMounted) { setIsCheckingSession(false); clearTimeout(loadingFailsafe); } }
    }
    bootstrapSession();
    const hash = window.location.hash;
    if (hash && (hash.includes('access_token=') || hash.includes('type=signup'))) {
      window.history.replaceState(null, null, window.location.pathname);
    }
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!isMounted) return;
      try {
        if (session?.user) {
          setUser(session.user);
          await checkSubscription(session.user.id);
          setIsCheckingSession(false);
          clearTimeout(loadingFailsafe);
          fetchMerchantSettings(session.user.id).catch(err => console.error("Settings load failure:", err));
          fetchLiveAnalytics(session.user.id).catch(err => console.error("Analytics load failure:", err));
        } else {
          setUser(null);
          setSettings({ business_name: '', store_address: '', discount_percentage: 10, webhook_slug: '', currency: 'ZAR', logo_url: '', voucher_expiration_days: 30 });
          setTxCount(0); setTxVolume(0);
          setGraphData(Array.from({ length: 28 }).map(() => 0));
          setIsCheckingSession(false);
          clearTimeout(loadingFailsafe);
        }
      } catch (err) {
        console.error("Auth state mutation engine caught failure:", err);
        if (isMounted) { setIsCheckingSession(false); clearTimeout(loadingFailsafe); }
      }
    });
    return () => { isMounted = false; clearTimeout(loadingFailsafe); subscription.unsubscribe(); };
  }, []);

  async function handleAuth(type, event = null) {
    if (event && typeof event.preventDefault === 'function') event.preventDefault();
    if (!email || !password) { alert("Please fill in all authorization fields."); return; }
    if (isAuthSyncing) return;
    setIsAuthSyncing(true);
    try {
      if (type === 'login') {
        const authResponse = await supabase.auth.signInWithPassword({ email, password });
        if (authResponse.error) { alert(authResponse.error.message); return; }
        const activeUser = authResponse.data?.user;
        if (!activeUser?.id) { alert("Authentication succeeded, but session is still initializing."); return; }
        await checkSubscription(activeUser.id);
      } else {
        const authResponse = await supabase.auth.signUp({
          email, password,
          options: { emailRedirectTo: `${window.location.origin}/admin` }
        });
        if (authResponse.error) { alert(authResponse.error.message); return; }
        setSignupSuccessMessage("Sign up request successful. Check your email to verify your account.");
        setEmail(""); setPassword("");
      }
    } catch (err) { console.error("Authentication crash:", err); alert(err.message || "Authentication failed."); }
    finally { setIsAuthSyncing(false); }
  }

  async function uploadBusinessLogo(file, webhookSlug) {
    try {
      const fileExtension = file.name.split('.').pop();
      const fileName = `public/${webhookSlug}_${Date.now()}.${fileExtension}`;
      const { data: storageData, error: storageError } = await supabase.storage.from('logos').upload(fileName, file, { upsert: true });
      if (storageError) throw storageError;
      const { data: publicUrlData } = supabase.storage.from('logos').getPublicUrl(storageData.path);
      return publicUrlData.publicUrl;
    } catch (error) { console.error('uploadBusinessLogo caught error:', error.message); return null; }
  }

  async function handleSave(e) {
    if (e && typeof e.preventDefault === 'function') e.preventDefault();
    if (isSaveSyncing) return;
    setIsSaveSyncing(true);
    try {
      const activeUser = user || await getActiveUser();
      if (!activeUser?.id) { alert("Sync Blocked: Active authentication session required."); return; }
      const cleanBusinessName = settings?.business_name?.trim() || '';
      const cleanWebhookSlug = settings?.webhook_slug?.trim() || '';
      if (!cleanBusinessName || !cleanWebhookSlug) { alert("Validation Failed: Required fields cannot be left blank."); return; }
      let resolvedLogoUrl = settings?.logo_url || '';
      if (resolvedLogoUrl.startsWith('blob:') && pendingLogoFile) {
        const uploadedUrl = await uploadBusinessLogo(pendingLogoFile, cleanWebhookSlug);
        if (uploadedUrl) { resolvedLogoUrl = uploadedUrl; setPendingLogoFile(null); }
        else { resolvedLogoUrl = settings?.logo_url?.startsWith('blob:') ? '' : (settings?.logo_url || ''); }
      }
      const payload = {
        owner_id: activeUser.id, business_name: cleanBusinessName,
        store_address: settings?.store_address?.trim() || '',
        discount_percentage: Number(settings?.discount_percentage ?? 10),
        webhook_slug: cleanWebhookSlug, currency: settings?.currency || 'ZAR',
        logo_url: resolvedLogoUrl,
        voucher_expiration_days: Number(settings?.voucher_expiration_days ?? 30)
      };
      if (settings?.id) payload.id = settings.id;
      const { data, error } = await supabase.from('business_settings').upsert(payload, { onConflict: 'owner_id' }).select();
      if (error) throw error;
      alert('Live Agent Settings Synced Successfully!');
      if (data && data[0]) setSettings(data[0]);
    } catch (error) { console.error("Profile synchronization failed:", error); alert('Error syncing live profile: ' + (error.message || 'Unknown error')); }
    finally { setIsSaveSyncing(false); }
  }

  // --- ENHANCED AI CHAT HANDLER ---
  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;
    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: chatInput,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setChatMessages(prev => [...prev, userMsg]);
    const currentInput = chatInput;
    setChatInput('');
    setIsChatTyping(true);

    setTimeout(() => {
      const lower = currentInput.toLowerCase();
      let aiText = "";

      // Webhook guidance
      if (lower.includes('webhook') || lower.includes('endpoint') || lower.includes('integration')) {
        const slug = settings.webhook_slug;
        if (!slug) {
          aiText = `🔗 **Webhook Setup Guide**\n\nYour integration endpoint isn't configured yet. Here's how to set it up:\n\n1. Go to **Settings** in the sidebar\n2. Enter a unique **Webhook Slug** (e.g., "brandie-karate-01")\n3. Save your settings\n4. Your webhook URL will be generated automatically\n\nThe webhook receives incoming till slip data from your POS system and triggers automatic receipt generation. Need me to walk you through a specific integration?`;
        } else {
          aiText = `🔗 **Your Webhook is Live**\n\n• **URL:** \`https://agadjdvhqguunowplbak.functions.supabase.co/receipt-agent?slug=${slug}\`\n• **Status:** ✅ Active\n• **Method:** POST (JSON payload)\n\nSend till slip data to this endpoint and RuachAgent will auto-generate branded digital receipts. The payload should include items, totals, and customer info. Want me to show you a sample payload?`;
        }
      }
      // Settings / personalization
      else if (lower.includes('setting') || lower.includes('business name') || lower.includes('logo') || lower.includes('brand')) {
        aiText = `⚙️ **Settings & Personalization**\n\nYou can customize these in the Settings panel:\n\n• **Business Name** — appears on every till slip\n• **Store Address** — shown in receipt header\n• **Logo** — upload via Settings (PNG/JPG)\n• **Currency** — ${settings.currency} currently\n• **Discount %** — ${settings.discount_percentage}% voucher default\n• **Webhook Slug** — your integration key\n• **Voucher Expiry** — ${settings.voucher_expiration_days} days\n\nClick **Settings** in the left sidebar to edit. All changes reflect instantly on the till slip preview →`;
      }
      // Analytics / transactions
      else if (lower.includes('analytic') || lower.includes('transaction') || lower.includes('volume') || lower.includes('report') || lower.includes('stat')) {
        aiText = `📊 **Analytics Overview**\n\n• **Total Transactions:** ${txCount.toLocaleString()}\n• **Total Volume:** ${settings.currency === 'ZAR' ? 'R' : '$'}${txVolume.toLocaleString()}\n• **Active Inboxes:** ${activeInboxesCount}\n• **Parsed Slips:** ${totalParsedCount.toLocaleString()}\n\nClick the **Analytics** card at the top to see the 28-day density graph. Data refreshes automatically from your merchant account.`;
      }
      // Till slip / receipt design
      else if (lower.includes('till slip') || lower.includes('receipt') || lower.includes('design') || lower.includes('color') || lower.includes('template')) {
        aiText = `🎨 **Till Slip Design**\n\nYour live preview is on the right →. You can customize:\n\n• **Colors** — "change primary color to blue"\n• **Logo** — upload via Settings\n• **Items** — auto-parsed from webhook payload\n• **Voucher code** — auto-generated per transaction\n• **Promo banner** — edit in Settings\n• **QR code** — links to your redemption page\n\nTry telling me something like *"add a summer promo banner"* or *"make the header purple"* and I'll guide you.`;
      }
      // Stores connected
      else if (lower.includes('store') || lower.includes('connect') || lower.includes('pos')) {
        aiText = `🏪 **Connected Stores**\n\nEach store connects via its unique webhook slug. Currently you have **${activeInboxesCount}** active inbox.\n\nTo add a new store:\n1. Generate a new webhook slug in Settings\n2. Point your POS system to that webhook URL\n3. Incoming slips auto-route to the correct store\n\nEach store keeps its own branding, currency, and voucher settings.`;
      }
      // Greeting
      else if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey')) {
        aiText = `Hello${settings.business_name ? ` — welcome back to ${settings.business_name}'s workspace` : ''}! 👋\n\nI can help you with:\n• 🔗 Setting up webhooks & integrations\n• 🎨 Customizing till slip designs\n• 📊 Reading your analytics\n• ⚙️ Configuring business settings\n• 🏪 Managing connected stores\n\nWhat would you like to work on?`;
      }
      // Save / sync
      else if (lower.includes('save') || lower.includes('sync')) {
        handleSave();
        aiText = `✅ **Syncing your settings...**\n\nI'm pushing your latest configuration to the live agent. You'll see changes reflected on the till slip preview momentarily.`;
      }
      // Subscription / pricing
      else if (lower.includes('price') || lower.includes('plan') || lower.includes('subscription') || lower.includes('upgrade')) {
        aiText = `💎 **Merchant Pro Plan**\n\n• **$6.99 / R129.00 per month**\n• Unlimited till slips\n• Advanced analytics\n• Multi-store support\n• Priority webhook processing\n• Custom branding\n\nYour trial has **${trialDaysRemaining} day${trialDaysRemaining !== 1 ? 's' : ''}** remaining. Click your avatar in the sidebar to upgrade.`;
      }
      // Default helpful response
      else {
        aiText = `I've noted your request. Here's what I can help with in your workspace:\n\n• Say **"webhook"** — setup & endpoint info\n• Say **"settings"** — configure business details\n• Say **"analytics"** — view transaction data\n• Say **"design"** — customize till slips\n• Say **"stores"** — manage connected POS\n\nOr click any of the 3 graphic cards at the top to explore detailed views.`;
      }

      const aiMsg = {
        id: Date.now() + 1,
        sender: 'ai',
        text: aiText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setChatMessages(prev => [...prev, aiMsg]);
      setIsChatTyping(false);
    }, 900);
  };

  // --- BLOCK CLICK → opens modal ---
  const handleBlockClick = (blockName) => {
    setActiveBlockModal(blockName);
  };

  const getBlockModalContent = (blockName) => {
    switch (blockName) {
      case 'Agent Parameters':
        return {
          icon: '⚙️',
          color: theme.cyan,
          title: 'Agent Parameters',
          subtitle: 'Your AI Till Slip Agent configuration',
          rows: [
            { label: 'Business Name', value: settings.business_name || 'Not set' },
            { label: 'Currency', value: settings.currency },
            { label: 'Discount', value: `${settings.discount_percentage}%` },
            { label: 'Webhook Slug', value: settings.webhook_slug || 'Not configured' },
            { label: 'Voucher Expiry', value: `${settings.voucher_expiration_days} days` },
          ],
          footer: 'Modify these in Settings →'
        };
      case 'Integration Endpoint':
        return {
          icon: '🔗',
          color: theme.purple,
          title: 'Integration Endpoint',
          subtitle: 'Your webhook configuration',
          rows: [
            { label: 'Webhook URL', value: settings.webhook_slug ? `https://...?slug=${settings.webhook_slug}` : 'Configure webhook slug first', mono: true },
            { label: 'Status', value: settings.webhook_slug ? '✅ Active' : '⏳ Pending' },
            { label: 'Method', value: 'POST (JSON)' },
            { label: 'Auth', value: 'Slug-based (header-free)' },
          ],
          footer: 'Send till slip payloads to this URL to trigger auto-receipts.'
        };
      case 'Inbox Slip Density':
        return {
          icon: '📊',
          color: theme.green,
          title: 'Inbox Slip Density',
          subtitle: 'Last 28 days analytics',
          rows: [
            { label: 'Total Transactions', value: txCount.toLocaleString() },
            { label: 'Total Volume', value: `${settings.currency === 'ZAR' ? 'R' : '$'}${txVolume.toLocaleString()}` },
            { label: 'Active Inboxes', value: activeInboxesCount },
            { label: 'Parsed Slips', value: totalParsedCount.toLocaleString() },
          ],
          footer: 'Data refreshes automatically from your merchant account.'
        };
      default:
        return null;
    }
  };

  const SAFE_CURRENCY_OPTIONS = typeof CURRENCY_OPTIONS !== 'undefined' ? CURRENCY_OPTIONS : [
    { code: 'ZAR', symbol: 'R' }, { code: 'USD', symbol: '$' },
    { code: 'EUR', symbol: '€' }, { code: 'GBP', symbol: '£' }
  ];
  const activeCurrencySymbol = SAFE_CURRENCY_OPTIONS.find(c => c.code === (settings?.currency || 'ZAR'))?.symbol || 'R';

  // --- LOADING GATE ---
  if (isCheckingSession) {
    return (
      <div style={{ ...styles.container, display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ marginBottom: '12px', fontSize: '32px', animation: 'pulse 1.5s infinite' }}>⚡</div>
          <div style={{ color: theme.cyan, fontSize: '13px', letterSpacing: '2px', fontWeight: '700' }}>SYNCHRONIZING SECURE NODE IDENTITY...</div>
        </div>
      </div>
    );
  }

  // --- LOGIN VIEW ---
  if (!user) {
    return (
      <div style={{ ...styles.container, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <div style={{ maxWidth: '380px', width: '90%', padding: '32px', background: theme.bgCard, border: `1px solid ${theme.border}`, borderRadius: '20px', boxShadow: `0 0 30px ${theme.cyanGlow}` }}>
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <div style={{ ...styles.sidebarLogo, width: '56px', height: '56px', fontSize: '22px', margin: '0 auto 12px' }}>RA</div>
            <div style={{ fontSize: '20px', fontWeight: '800', color: theme.white, letterSpacing: '1px' }}>RUACH AGENT</div>
            <div style={{ fontSize: '10px', color: theme.textMuted, letterSpacing: '2px', marginTop: '4px' }}>MASTER PORTAL</div>
          </div>
          {signupSuccessMessage && (
            <div style={{ background: 'rgba(16,185,129,0.1)', color: theme.green, border: `1px solid rgba(16,185,129,0.3)`, padding: '12px', borderRadius: '10px', marginBottom: '16px', textAlign: 'center', fontSize: '12px' }}>
              ✅ {signupSuccessMessage}
            </div>
          )}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <input type="email" placeholder="Merchant Email" value={email} onChange={e => setEmail(e.target.value)} style={{ ...styles.chatInputBox, background: theme.bgTertiary, border: `1px solid ${theme.border}`, borderRadius: '12px', padding: '14px 16px', marginBottom: 0 }} />
            <input type="password" placeholder="Access Password" value={password} onChange={e => setPassword(e.target.value)} style={{ ...styles.chatInputBox, background: theme.bgTertiary, border: `1px solid ${theme.border}`, borderRadius: '12px', padding: '14px 16px', marginBottom: 0 }} />
            <button onClick={() => handleAuth('login')} style={{ ...styles.primaryBtn, background: 'linear-gradient(90deg, #00e3d8, #00b4d8)' }} disabled={isAuthSyncing}>
              {isAuthSyncing ? 'Verifying Node...' : 'Login'}
            </button>
            <button onClick={() => handleAuth('register')} style={{ ...styles.primaryBtn, background: 'transparent', border: `1px solid ${theme.border}`, color: theme.textMuted }} disabled={isAuthSyncing}>
              Sign Up
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- BUILD GRAPHIC CARDS DATA ---
  const graphicCards = [
    {
      name: 'Agent Parameters',
      icon: '⚙️',
      gradient: 'linear-gradient(135deg, rgba(0,227,216,0.18), rgba(0,180,216,0.05))',
      borderColor: 'rgba(0,227,216,0.35)',
      iconBg: 'rgba(0,227,216,0.15)',
      color: theme.cyan,
      badge: 'CONFIG',
      badgeBg: 'rgba(0,227,216,0.18)',
      badgeColor: theme.cyan,
      metric: settings.business_name ? settings.business_name.slice(0, 14) : 'NOT SET',
      sub: settings.currency + ' • ' + settings.discount_percentage + '% discount',
    },
    {
      name: 'Integration Endpoint',
      icon: '🔗',
      gradient: 'linear-gradient(135deg, rgba(168,85,247,0.18), rgba(124,58,237,0.05))',
      borderColor: 'rgba(168,85,247,0.35)',
      iconBg: 'rgba(168,85,247,0.15)',
      color: theme.purple,
      badge: settings.webhook_slug ? 'LIVE' : 'SETUP',
      badgeBg: settings.webhook_slug ? 'rgba(16,185,129,0.18)' : 'rgba(239,68,68,0.18)',
      badgeColor: settings.webhook_slug ? theme.green : theme.red,
      metric: settings.webhook_slug ? settings.webhook_slug.slice(0, 16) : 'NO SLUG',
      sub: 'Webhook endpoint',
    },
    {
      name: 'Inbox Slip Density',
      icon: '📊',
      gradient: 'linear-gradient(135deg, rgba(16,185,129,0.18), rgba(5,150,105,0.05))',
      borderColor: 'rgba(16,185,129,0.35)',
      iconBg: 'rgba(16,185,129,0.15)',
      color: theme.green,
      badge: '28 DAYS',
      badgeBg: 'rgba(16,185,129,0.18)',
      badgeColor: theme.green,
      metric: txCount.toLocaleString(),
      sub: 'transactions • ' + activeCurrencySymbol + txVolume.toLocaleString(),
      showMiniGraph: true,
    },
  ];

  const blockModalData = activeBlockModal ? getBlockModalContent(activeBlockModal) : null;

  // --- MAIN APP ---
  return (
    <div style={styles.container}>
      {/* GLOBAL MODAL: Subscription */}
      {showSubscriptionModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalCard}>
            <div style={{ width: '72px', height: '72px', margin: '0 auto 20px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', background: 'linear-gradient(135deg, #00F5A0, #00C6FF)', boxShadow: '0 0 20px rgba(0,255,170,0.45)' }}>🔒</div>
            <div style={{ color: '#00F5A0', fontSize: '11px', fontWeight: 700, letterSpacing: '3px', marginBottom: '12px' }}>PREMIUM MEMBERSHIP REQUIRED</div>
            <h2 style={{ color: '#ffffff', marginBottom: '14px', fontSize: '24px', fontWeight: 700 }}>Your Free Trial Has Expired</h2>
            <p style={{ color: '#b9c7cf', fontSize: '14px', lineHeight: '1.7', marginBottom: '24px' }}>
              To continue using <strong style={{ color: '#00F5A0' }}>RuachAgent</strong> Premium features, please upgrade your subscription.
            </p>
            <div style={{ background: 'linear-gradient(145deg, rgba(0,198,255,0.08), rgba(0,255,170,0.06))', borderRadius: '16px', padding: '20px', marginBottom: '24px', border: '1px solid rgba(0,255,170,0.25)' }}>
              <div style={{ color: '#ffffff', fontWeight: '700', fontSize: '16px', marginBottom: '8px' }}>Merchant Pro Plan</div>
              <div style={{ color: '#00F5A0', fontSize: '30px', fontWeight: '800' }}>$6.99 [R129.00] <span style={{ fontSize: '13px', color: '#9ca3af', fontWeight: '500' }}> / month</span></div>
            </div>
            <button onClick={() => {
              if (!window.PaystackPop) { alert("Paystack SDK failed to load."); return; }
              const handler = window.PaystackPop.setup({
                key: process.env.REACT_APP_PAYSTACK_PUBLIC_KEY || "pk_live_870272ce5b082f6522a2f9d130c368284664c7f4",
                email: user?.email, amount: 12900, currency: "ZAR",
                ref: "RUACH_" + Math.floor(Math.random() * 1000000000 + 1),
                metadata: { custom_fields: [{ display_name: "User ID", variable_name: "user_id", value: user?.id }, { display_name: "Plan", variable_name: "plan_type", value: "pro_monthly" }], user_id: user?.id, plan_type: "pro_monthly" },
                onClose: () => console.log("Paystack modal closed."),
                callback: async (response) => {
                  console.log("Paystack Payment Successful:", response.reference);
                  alert("Payment successful! Updating workspace access...");
                  setTimeout(async () => { await checkSubscription(user.id); setShowSubscriptionModal(false); }, 2000);
                },
              });
              handler.openIframe();
            }} style={styles.primaryBtn}>Upgrade Now with Paystack →</button>
          </div>
        </div>
      )}

      {/* GLOBAL MODAL: Trial Welcome */}
      {showTrialWelcomeModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalCard}>
            <div style={{ width: '72px', height: '72px', margin: '0 auto 20px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '36px', background: 'linear-gradient(135deg, #00F5A0, #00C6FF)', boxShadow: '0 0 20px rgba(0,255,170,0.45)' }}>🎉</div>
            <div style={{ color: '#00F5A0', fontSize: '11px', letterSpacing: '3px', fontWeight: 700, marginBottom: '12px' }}>PREMIUM ACCESS ACTIVATED</div>
            <h2 style={{ color: '#ffffff', marginBottom: '14px', fontSize: '26px', fontWeight: 700 }}>Welcome to Your Premium Trial</h2>
            <p style={{ color: '#b9c7cf', lineHeight: '1.8', marginBottom: '24px', fontSize: '14px' }}>
              Your merchant workspace is now online. You have unrestricted access for the next <strong style={{ color: '#00F5A0' }}>{trialDaysRemaining} day{trialDaysRemaining !== 1 ? 's' : ''}</strong>.
            </p>
            <button onClick={async () => {
              if (user?.id) await supabase.from("subscriptions").update({ trial_welcome_seen: true }).eq("user_id", user.id);
              setShowTrialWelcomeModal(false);
            }} style={styles.primaryBtn}>Enter Workspace →</button>
          </div>
        </div>
      )}

      {/* BLOCK DETAIL MODAL */}
      {blockModalData && (
        <div style={styles.blockModalOverlay} onClick={() => setActiveBlockModal(null)}>
          <div style={styles.blockModalCard} onClick={e => e.stopPropagation()}>
            <button style={styles.blockModalClose} onClick={() => setActiveBlockModal(null)}>✕</button>
            <div style={styles.blockModalHeader}>
              <div style={{ ...styles.blockModalIcon, background: `${blockModalData.color}20`, color: blockModalData.color, border: `1px solid ${blockModalData.color}40` }}>
                {blockModalData.icon}
              </div>
              <div>
                <div style={{ fontSize: '16px', fontWeight: '800', color: theme.white, letterSpacing: '0.5px' }}>{blockModalData.title}</div>
                <div style={{ fontSize: '11px', color: theme.textMuted, marginTop: '2px' }}>{blockModalData.subtitle}</div>
              </div>
            </div>
            <div>
              {blockModalData.rows.map((row, i) => (
                <div key={i} style={styles.blockModalRow}>
                  <span style={{ fontSize: '11px', color: theme.textMuted, fontWeight: '600', letterSpacing: '0.5px', textTransform: 'uppercase' }}>{row.label}</span>
                  <span style={{ fontSize: '13px', color: theme.white, fontWeight: '700', fontFamily: row.mono ? 'monospace' : 'inherit', maxWidth: '60%', textAlign: 'right', wordBreak: 'break-all' }}>{row.value}</span>
                </div>
              ))}
            </div>
            {blockModalData.name === 'Inbox Slip Density' && (
              <div style={{ marginTop: '14px', padding: '12px', background: 'rgba(16,185,129,0.06)', border: `1px solid rgba(16,185,129,0.2)`, borderRadius: '12px' }}>
                <div style={{ fontSize: '10px', color: theme.green, fontWeight: '700', letterSpacing: '1px', marginBottom: '8px', textTransform: 'uppercase' }}>28-Day Density Graph</div>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: '2px', height: '60px' }}>
                  {graphData.slice(-28).map((val, i) => (
                    <div key={i} style={{ flex: 1, background: `linear-gradient(180deg, ${theme.green}, rgba(16,185,129,0.3))`, height: `${Math.max(4, val)}%`, borderRadius: '2px', minHeight: '2px' }} />
                  ))}
                </div>
              </div>
            )}
            <div style={{ marginTop: '16px', padding: '10px 12px', background: 'rgba(0,227,216,0.05)', border: `1px solid ${theme.border}`, borderRadius: '10px', fontSize: '11px', color: theme.textMuted, lineHeight: '1.5' }}>
              💡 {blockModalData.footer}
            </div>
          </div>
        </div>
      )}

      {/* APP LAYOUT */}
      <div style={styles.appLayout}>
        {/* THIN LEFT SIDEBAR */}
        <aside style={styles.sidebar}>
          <div style={styles.sidebarLogo} title="RuachAgent">RA</div>

          {[
            { id: 'till-slips', icon: '📤', label: 'Slips' },
            { id: 'stores', icon: '🔗', label: 'Stores' },
            { id: 'settings', icon: '⚙️', label: 'Settings' },
          ].map(item => (
            <div
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{
                ...styles.thinNavItem,
                ...(activeTab === item.id ? styles.thinNavItemActive : {}),
              }}
              title={item.label}
              onMouseEnter={e => { if (activeTab !== item.id) e.currentTarget.style.background = 'rgba(0,227,216,0.04)'; }}
              onMouseLeave={e => { if (activeTab !== item.id) e.currentTarget.style.background = 'transparent'; }}
            >
              <div style={styles.thinNavIcon}>{item.icon}</div>
              <div style={{ ...styles.thinNavLabel, ...(activeTab === item.id ? styles.thinNavLabelActive : {}) }}>{item.label}</div>
            </div>
          ))}

          <div style={styles.sidebarDivider} />

          <div
            onClick={() => setActiveTab('ai-prompts')}
            style={{
              ...styles.thinNavItem,
              ...(activeTab === 'ai-prompts' ? styles.thinNavItemActive : {}),
              background: activeTab === 'ai-prompts' ? 'linear-gradient(135deg, rgba(168,85,247,0.15), rgba(0,227,216,0.08))' : undefined,
            }}
            title="AI Prompts"
          >
            <div style={{ ...styles.thinNavIcon, fontSize: '20px' }}>✨</div>
            <div style={{ ...styles.thinNavLabel, ...(activeTab === 'ai-prompts' ? styles.thinNavLabelActive : {}), color: activeTab === 'ai-prompts' ? theme.purple : undefined }}>AI</div>
          </div>

          <div style={styles.sidebarBottomAvatar} title={user?.email || 'Account'} onClick={() => supabase.auth.signOut()}>
            {user?.email?.charAt(0).toUpperCase() || 'U'}
          </div>
        </aside>

        {/* MAIN CHAT AREA */}
        <main style={styles.mainArea}>
          {/* Chat Header */}
          <div style={styles.chatHeader}>
            <div style={styles.chatTitle}>
              RUACH AGENT AI
              <span style={styles.onlineDot}></span>
              <span style={{ fontSize: '11px', color: theme.green, fontWeight: '600' }}>ONLINE</span>
            </div>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <button onClick={() => setRightPanelOpen(!rightPanelOpen)} style={{ padding: '7px 12px', background: 'rgba(0, 227, 216, 0.08)', border: `1px solid ${theme.border}`, borderRadius: '10px', color: theme.cyan, fontSize: '10px', fontWeight: '600', cursor: 'pointer' }}>
                {rightPanelOpen ? '◀ Hide Preview' : 'Show Preview ▶'}
              </button>
            </div>
          </div>

          {/* TOP GRAPHIC BLOCKS (disguised clickable graphics) */}
          <div style={styles.topBlocksRow}>
            {graphicCards.map(card => (
              <div
                key={card.name}
                onClick={() => handleBlockClick(card.name)}
                style={{
                  ...styles.graphicCard,
                  background: card.gradient,
                  border: `1px solid ${card.borderColor}`,
                  boxShadow: `0 4px 20px ${card.borderColor.replace('0.35', '0.15')}`,
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = `0 8px 28px ${card.borderColor.replace('0.35', '0.3')}`;
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = `0 4px 20px ${card.borderColor.replace('0.35', '0.15')}`;
                }}
              >
                <div style={styles.graphicCardTop}>
                  <div style={{ ...styles.graphicIconWrap, background: card.iconBg, color: card.color }}>
                    {card.icon}
                  </div>
                  <div style={{ ...styles.graphicBadge, background: card.badgeBg, color: card.badgeColor, border: `1px solid ${card.badgeColor}40` }}>
                    {card.badge}
                  </div>
                </div>
                <div>
                  <div style={{ ...styles.graphicTitle, color: card.color }}>{card.name}</div>
                  <div style={styles.graphicMetric}>{card.metric}</div>
                  <div style={styles.graphicSub}>{card.sub}</div>
                  {card.showMiniGraph && (
                    <div style={styles.graphicMiniGraph}>
                      {graphData.slice(-14).map((val, i) => (
                        <div key={i} style={{ ...styles.graphicMiniBar, background: `linear-gradient(180deg, ${card.color}, ${card.color}40)`, height: `${Math.max(10, val)}%` }} />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Chat Messages */}
          <div style={styles.chatMessages}>
            {chatMessages.map(msg => (
              <div key={msg.id} style={{ ...styles.messageRow, ...(msg.sender === 'user' ? styles.messageRowUser : {}) }}>
                <div style={{
                  ...styles.avatar,
                  background: msg.sender === 'ai' ? 'linear-gradient(135deg, #00e3d8, #00b4d8)' : 'linear-gradient(135deg, #a855f7, #7c3aed)',
                  color: '#0a0e17',
                  fontWeight: '800',
                  fontSize: '12px',
                }}>
                  {msg.sender === 'ai' ? 'RA' : user?.email?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div style={{ maxWidth: '75%' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span style={{ fontSize: '11px', fontWeight: '700', color: msg.sender === 'ai' ? theme.cyan : theme.purple }}>
                      {msg.sender === 'ai' ? 'RuachAgent AI' : 'You'}
                    </span>
                    {msg.sender === 'ai' && <span style={{ fontSize: '9px', padding: '2px 6px', background: 'rgba(0,227,216,0.15)', borderRadius: '6px', color: theme.cyan, fontWeight: '600' }}>AI</span>}
                    <span style={{ fontSize: '10px', color: theme.textMuted }}>{msg.timestamp}</span>
                  </div>
                  <div style={{
                    ...styles.messageBubble,
                    ...(msg.sender === 'ai' ? styles.messageBubbleAI : styles.messageBubbleUser),
                    whiteSpace: 'pre-wrap',
                  }}>
                    {msg.text}
                  </div>
                </div>
              </div>
            ))}
            {isChatTyping && (
              <div style={{ ...styles.messageRow }}>
                <div style={{ ...styles.avatar, background: 'linear-gradient(135deg, #00e3d8, #00b4d8)', color: '#0a0e17', fontWeight: '800', fontSize: '12px' }}>RA</div>
                <div>
                  <div style={{ fontSize: '11px', fontWeight: '700', color: theme.cyan, marginBottom: '4px' }}>RuachAgent AI <span style={{ fontSize: '9px', padding: '2px 6px', background: 'rgba(0,227,216,0.15)', borderRadius: '6px', color: theme.cyan, fontWeight: '600' }}>AI</span></div>
                  <div style={{ ...styles.messageBubble, ...styles.messageBubbleAI, padding: '14px 20px' }}>
                    <span style={{ display: 'inline-flex', gap: '4px' }}>
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: theme.cyan, animation: 'bounce 1.4s infinite', animationDelay: '0s' }}></span>
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: theme.cyan, animation: 'bounce 1.4s infinite', animationDelay: '0.2s' }}></span>
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: theme.cyan, animation: 'bounce 1.4s infinite', animationDelay: '0.4s' }}></span>
                    </span>
                  </div>
                </div>
              </div>
            )}
            <div ref={chatEndRef}></div>
          </div>

          {/* WIDE AI INPUT */}
          <div style={styles.chatInputArea}>
            <div style={styles.quickPrompts}>
              {['How do I set up a webhook?', 'Show my analytics', 'Customize my till slip', 'Connect a new store', 'Change business logo'].map(prompt => (
                <div
                  key={prompt}
                  style={styles.quickPromptChip}
                  onClick={() => { setChatInput(prompt); }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(0,227,216,0.15)'; e.currentTarget.style.borderColor = theme.borderActive; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(0,227,216,0.06)'; e.currentTarget.style.borderColor = theme.border; }}
                >
                  {prompt}
                </div>
              ))}
            </div>
            <div style={styles.chatInputWrap}>
              <input
                type="text"
                placeholder="Ask RuachAgent anything — webhooks, design, analytics, settings..."
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') handleSendMessage(); }}
                style={styles.chatInputBox}
              />
              <button
                onClick={handleSendMessage}
                style={styles.sendBtn}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = `0 0 20px ${theme.purpleGlow}`; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = `0 0 15px ${theme.purpleGlow}`; }}
              >
                Send ➤
              </button>
            </div>
            <div style={styles.chatFooter}>
              <span>⚡</span> RuachAgent AI can configure webhooks, design till slips, and interpret analytics in real-time.
            </div>
          </div>
        </main>

        {/* RIGHT PANEL - RECEIPT MIRROR */}
        {rightPanelOpen && isDesktop && (
          <aside style={styles.rightPanel}>
            <div style={{ fontSize: '11px', fontWeight: '800', color: theme.purple, letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '16px', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              <span>📧</span> LIVE INBOX TILL SLIP MIRROR
            </div>
            <div style={styles.receiptCard}>
              <div style={styles.receiptHeader}>
                <div style={styles.receiptLogoCircle}>
                  {settings?.logo_url ? (
                    <img src={settings.logo_url} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <span style={{ fontSize: '28px' }}>🥋</span>
                  )}
                </div>
                <div style={{ fontSize: '20px', fontWeight: '900', color: theme.white, letterSpacing: '1px' }}>
                  {settings?.business_name || 'BRANDIE\'S'}
                </div>
                <div style={{ fontSize: '11px', color: theme.purple, letterSpacing: '2px', marginTop: '4px' }}>KARATE CLUB</div>
              </div>
              <div style={styles.receiptMeta}>
                <span style={{ fontSize: '10px', fontWeight: '700', color: theme.cyan, padding: '4px 10px', background: 'rgba(0,227,216,0.1)', borderRadius: '8px', border: `1px solid ${theme.borderActive}` }}>
                  VERIFIED MODE
                </span>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '9px', color: theme.textMuted, textTransform: 'uppercase', letterSpacing: '1px' }}>Transaction</div>
                  <div style={{ fontSize: '10px', color: theme.text, fontFamily: 'monospace' }}>
                    {new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: '2-digit' })} {new Date().toLocaleTimeString('en-GB', { hour12: false })}
                  </div>
                </div>
              </div>
              <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                <div style={{ fontSize: '14px', fontWeight: '800', color: theme.purple, marginBottom: '4px' }}>
                  {settings?.business_name || 'BRANDIE\'S KARATE CLUB'}
                </div>
                <div style={{ fontSize: '11px', color: theme.textMuted, marginBottom: '2px' }}>
                  {settings?.store_address || '76, Beverly Hills, Los Angeles'}
                </div>
                <div style={{ fontSize: '10px', color: theme.textDim }}>
                  {user?.email || 'info@merchant.com'}
                </div>
              </div>
              <div style={{ fontSize: '10px', fontWeight: '800', color: theme.purple, letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '10px', textAlign: 'center' }}>
                ITEMS PURCHASED
              </div>
              {[
                { name: '1x Premium Simple Merchandise Item', price: `$120.00`, icon: '👕' },
                { name: '1x Standard Agent Automation Mode Addon', price: `$80.00`, icon: '🤖' },
                { name: '1x Digital Support & Setup Guide', price: `$0.00`, icon: '📦' },
              ].map((item, i) => (
                <div key={i} style={styles.receiptItem}>
                  <div style={{ fontSize: '28px', flexShrink: 0 }}>{item.icon}</div>
                  <div style={{ flex: 1, fontSize: '11px', color: theme.text, lineHeight: '1.4' }}>{item.name}</div>
                  <div style={{ fontSize: '13px', fontWeight: '800', color: theme.purple, fontFamily: 'monospace' }}>{item.price}</div>
                </div>
              ))}
              <div style={styles.receiptTotal}>
                <span style={{ fontSize: '13px', fontWeight: '800', color: theme.white, letterSpacing: '1px' }}>TOTAL DUE</span>
                <span style={{ fontSize: '22px', fontWeight: '900', color: theme.purple, fontFamily: 'monospace', textShadow: `0 0 10px ${theme.purpleGlow}` }}>$200.00</span>
              </div>
              <div style={styles.voucherBox}>
                <div style={{ fontSize: '10px', fontWeight: '800', color: theme.cyan, letterSpacing: '1px', marginBottom: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                  <span>🎟️</span> NEXT TIER! VOUCHER CODE INSIDE
                </div>
                <div style={styles.qrBox}>
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(`https://ruachagent.net/redeem?token=${settings?.webhook_slug || 'node'}_preview`)}&color=11161d`}
                    alt="QR"
                    style={{ width: '80px', height: '80px', display: 'block' }}
                  />
                </div>
                <div style={{ fontSize: '10px', fontWeight: '700', color: theme.white, marginBottom: '4px' }}>CLAIM DISCOUNT</div>
                <div style={{ fontSize: '10px', color: theme.textMuted, lineHeight: '1.5', marginBottom: '8px' }}>
                  Scan to instantly claim your <strong style={{ color: theme.cyan }}>{settings?.discount_percentage ?? 10}%</strong> discount balance.
                </div>
                <div style={{ fontSize: '10px', color: theme.textDim }}>
                  EXPIRES IN: <strong style={{ color: theme.red }}>{settings?.voucher_expiration_days ?? 30} DAYS</strong> FROM NOW!
                </div>
              </div>
              <div style={styles.promoBanner}>
                🔥 REFER A FRIEND & GET 10% OFF YOUR NEXT BILL!
              </div>
              <button style={styles.downloadBtn}>
                <span>📄</span> DOWNLOAD OFFICIAL INVOICE PDF
              </button>
            </div>
          </aside>
        )}
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0); opacity: 0.5; }
          40% { transform: scale(1); opacity: 1; }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(0,227,216,0.2); border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(0,227,216,0.4); }
        input::placeholder { color: #475569; }
      `}</style>
    </div>
  );
}