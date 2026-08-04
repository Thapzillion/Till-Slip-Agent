import React, { useEffect, useState } from "react";

import "./AdminPanel.css";

import { supabase } from './supabaseClient';

import { useNavigate } from "react-router-dom";

import {
  LayoutDashboard,
  Receipt,
  Store,
  SlidersHorizontal,
  FileText,
  Plug,
  HelpCircle,
  Bell,
  UserCircle2,
  Sparkles,
  Palette,
  Cpu,
  Send,
  ArrowUpRight
} from "lucide-react";

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


  // --- COMPONENT RENDER-STATE ALIGNMENT LAYER ---
  const activeInboxesCount = user ? 1 : 0; // Tracks the primary active synchronized node
  const totalParsedCount = txCount;       // Maps your optimized total count directly to your UI
  const inboxGraphData = graphData;       // Routes your 28-day database matrix cleanly to the graph bars
  const selectedDateRangeLabel = "PAST_28_DAYS"; // Synced to our server-side SQL aggregation constraint limit


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

  // ==============================
  //       DYNAMIC STATE ENGINE
  // ==============================
  const [inputPrompt, setInputPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([]);

  // Default receipt state initialized with original hardcoded values
  const [receiptData, setReceiptData] = useState({
    merchantName: "RUACH STORE",
    location: "Johannesburg, South Africa",
    items: [
      { name: "Milk", price: "R32.00" },
      { name: "Bread", price: "R18.50" },
      { name: "Eggs", price: "R41.00" }
    ],
    vat: "R13.80",
    total: "R105.30",
    themeColor: "#00f0ff"
  });

  // Action Handler to call the backend API handler
  const handleSendPrompt = async () => {
    if (!inputPrompt.trim() || isLoading) return;

    const userQuery = inputPrompt;
    setInputPrompt("");

    // Push user question to live conversation state
    setMessages((prev) => [...prev, { role: "user", text: userQuery }]);
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: userQuery })
      });

      const data = await response.json();

      if (data.chatResponse) {
        setMessages((prev) => [
          ...prev,
          { role: "agent", text: data.chatResponse }
        ]);
      }

      if (data.receiptData) {
        setReceiptData(data.receiptData);
      }
    } catch (error) {
      console.error("Failed to fetch AI response:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "agent",
          text: "Unable to connect to RuachAgent AI engine. Please check your API route."
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setMessages([]);
  };

  // ASYNC FUNCTIONS
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

  async function fetchLiveAnalytics(userId) {
    try {
      if (!userId) {
        console.warn("Analytics blocked: No authenticated user.");
        return;
      }

      // 1. Fetch the lightweight business ID link
      const { data: biz, error: bizError } = await supabase
        .from('business_settings')
        .select('id')
        .eq('owner_id', userId)
        .maybeSingle();

      if (bizError) throw bizError;

      if (!biz?.id) {
        console.warn("No business profile found — resetting analytics to zero.");
        setTxCount(0);
        setTxVolume(0);
        setGraphData(Array.from({ length: 28 }).map(() => 0));
        return;
      }

      // 2. Execute server-side aggregation matrix via RPC
      const { data: analytics, error: rpcError } = await supabase
        .rpc('get_merchant_analytics', { target_business_id: biz.id });

      if (rpcError) throw rpcError;

      if (analytics && analytics.length > 0) {
        const stats = analytics[0];
        const count = Number(stats.total_count) || 0;
        const volume = Number(stats.total_volume) || 0;
        const rawPoints = stats.graph_points || [];

        setTxCount(count);
        setTxVolume(volume);

        // 3. Scale and clean the graph points array securely for your layout viewport
        if (rawPoints.length > 0) {
          // Reverse because SQL gathered them via DESC order for the LIMIT constraint
          const chronologicalPoints = [...rawPoints].reverse();
          const maxTx = Math.max(...chronologicalPoints.map(v => Number(v) || 1), 1);

          const historicalPrices = chronologicalPoints.map(val => {
            const rawAmount = Number(val) || 0;
            return Math.max(15, Math.min(90, (rawAmount / maxTx) * 90));
          });

          // Maintain strict 28-point layout bounds padding
          const paddedData = Array(28)
            .fill(0)
            .concat(historicalPrices)
            .slice(-28);

          setGraphData(paddedData);
        } else {
          setGraphData(Array.from({ length: 28 }).map(() => 0));
        }
      } else {
        setTxCount(0);
        setTxVolume(0);
        setGraphData(Array.from({ length: 28 }).map(() => 0));
      }
    } catch (err) {
      console.error("Analytics stream catch handled:", err.message);
    }
  }

  async function fetchMerchantSettings(userId) {
    if (!userId) return;

    // ─── ABORT CONTROLLER SETUP ───
    // Instantiates native signal with a 10-second timeout threshold
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    try {
      // ─── DIAGNOSTIC DRILLDOWN LOGS ───
      console.log("FETCH SETTINGS START");
      console.log("userId:", userId);
      console.log("QUERY START");

      const query = supabase
        .from('business_settings')
        .select('*')
        .eq('owner_id', userId)
        .maybeSingle()
        .abortSignal(controller.signal); // Attaches signal to physically cancel hanging HTTP network request

      const { data, error } = await query;

      console.log("QUERY END");
      console.log("SETTINGS DATA:", data);
      console.log("SETTINGS ERROR:", error);

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
          logo_url: data.logo_url || '',
          voucher_expiration_days: data.voucher_expiration_days ?? 30 // Synced database value downstream
        });
      } else {
        setSettings({
          business_name: '',
          store_address: '',
          discount_percentage: 10,
          webhook_slug: '',
          currency: 'ZAR',
          logo_url: '',
          voucher_expiration_days: 30 // Default standard fallback configuration slot
        });
      }
    } catch (error) {
      if (error.name === 'AbortError') {
        console.warn("fetchMerchantSettings query aborted due to 10s timeout threshold.");
      } else {
        console.error("Profile load failure:", error.message);
      }

      // If a timeout or error happens, clear settings to standard defaults so the form still works
      setSettings({
        business_name: '',
        store_address: '',
        discount_percentage: 10,
        webhook_slug: '',
        currency: 'ZAR',
        logo_url: '',
        voucher_expiration_days: 30 // Clear condition alignment sync
      });
    } finally {
      clearTimeout(timeoutId); // Guarantees timer handle is cleared when complete
    }
  }

  async function checkSubscription(userId) {
    setSubscriptionLoading(true);

    try {
      let { data, error } = await supabase
        .from("subscriptions")
        .select(`
        subscription_status,
        trial_ends_at,
        trial_welcome_seen
      `)
        .eq("user_id", userId)
        .maybeSingle();

      if (error) {
        throw error;
      }

      // ---------------------------------------
      // NO SUBSCRIPTION RECORD FOUND
      // Auto-create 3-Day Trial and welcome user directly
      // ---------------------------------------
      if (!data) {
        const trialEnds = new Date();
        trialEnds.setDate(trialEnds.getDate() + 3);

        const { data: newSub, error: insertError } = await supabase
          .from("subscriptions")
          .upsert({
            user_id: userId,
            subscription_status: "trial",
            trial_ends_at: trialEnds.toISOString(),
            trial_welcome_seen: false
          })
          .select(`
          subscription_status,
          trial_ends_at,
          trial_welcome_seen
        `)
          .single();

        if (insertError) {
          throw insertError;
        }

        data = newSub;
      }

      // ---------------------------------------
      // CALCULATE DATES & EXPIRATION
      // ---------------------------------------
      const now = new Date();
      const expiry = new Date(data.trial_ends_at);
      const msRemaining = expiry.getTime() - now.getTime();

      const daysRemaining = Math.max(
        0,
        Math.ceil(msRemaining / (1000 * 60 * 60 * 24))
      );

      setTrialDaysRemaining(daysRemaining);
      setTrialExpiryDate(expiry);

      const expired = msRemaining <= 0;

      // ---------------------------------------
      // ACTIVE PREMIUM TRIAL WELCOME
      // ---------------------------------------
      if (
        data.subscription_status === "trial" &&
        !expired &&
        !data.trial_welcome_seen
      ) {
        setShowTrialWelcomeModal(true);
      }

      // ---------------------------------------
      // TRIAL EXPIRED
      // ---------------------------------------
      if (
        expired &&
        data.subscription_status !== "active"
      ) {
        setShowSubscriptionModal(true);
      }

    } catch (err) {
      console.error("Subscription check failed:", err);
    } finally {
      setSubscriptionLoading(false);
    }
  }

  useEffect(() => {
    let isMounted = true;

    // ─── FAILSAFE SAFETY TIMEOUT ───
    // Guarantees the loading gate MUST drop after 4 seconds maximum, no matter what happens.
    const loadingFailsafe = setTimeout(() => {
      if (isMounted) {
        console.warn("Session check exceeded safety threshold — forcing workspace entry.");
        setIsCheckingSession(false);
      }
    }, 4000);

    // ─── 1. BOOTSTRAP INITIAL SESSION ───
    async function bootstrapSession() {
      try {
        setIsCheckingSession(true);
        const {
          data: { session }
        } = await supabase.auth.getSession();

        if (session?.user && isMounted) {
          setUser(session.user);
        }
      } catch (err) {
        console.error("Critical bootstrap session failure:", err);
      } finally {
        if (isMounted) {
          setIsCheckingSession(false);
          clearTimeout(loadingFailsafe); // Clear timer if session resolves quickly
        }
      }
    }

    bootstrapSession();

    // Clean up email confirmation redirection hash parameters from the URL
    const hash = window.location.hash;
    if (hash && (hash.includes('access_token=') || hash.includes('type=signup'))) {
      window.history.replaceState(null, null, window.location.pathname);
    }

    // Temporary connectivity diagnostics check
    async function checkSupabaseReachability() {
      try {
        const { data, error } = await supabase.from('business_settings').select('count');
        console.log('Supabase reachability check:', data, error);
      } catch (e) {
        console.error('Reachability network check failed:', e);
      }
    }
    checkSupabaseReachability();

    // Unified Single-Source Auth Listener Engine
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!isMounted) return;

      console.log(`Supabase Auth Event Triggered: [${event}]`);

      try {
        if (session?.user) {
          setUser(session.user);

          // Check subscription status (Triggers Trial / Expiry Modals)
          await checkSubscription(session.user.id);

          // Show admin panel immediately & stream data in background
          setIsCheckingSession(false);
          clearTimeout(loadingFailsafe);

          fetchMerchantSettings(session.user.id).catch(err =>
            console.error("Asynchronous settings load background failure:", err)
          );

          fetchLiveAnalytics(session.user.id).catch(err =>
            console.error("Asynchronous analytics load background failure:", err)
          );

        } else {
          // Teardown when signed out
          setUser(null);
          setSettings({
            business_name: '',
            store_address: '',
            discount_percentage: 10,
            webhook_slug: '',
            currency: 'ZAR',
            logo_url: '',
            voucher_expiration_days: 30
          });
          setTxCount(0);
          setTxVolume(0);
          setGraphData(Array.from({ length: 28 }).map(() => 0));
          setIsCheckingSession(false);
          clearTimeout(loadingFailsafe);
        }
      } catch (err) {
        console.error("Auth state mutation engine caught failure:", err);
        if (isMounted) {
          setIsCheckingSession(false);
          clearTimeout(loadingFailsafe);
        }
      }
    });

    return () => {
      isMounted = false;
      clearTimeout(loadingFailsafe);
      subscription.unsubscribe();
    };
  }, []);

  async function handleAuth(type, event = null) {
    if (event && typeof event.preventDefault === 'function') {
      event.preventDefault();
    }

    if (!email || !password) {
      alert("Please fill in all authorization fields.");
      return;
    }

    if (isAuthSyncing) return;

    setIsAuthSyncing(true);

    try {
      if (type === 'login') {
        // ==========================================
        // 1. THE LOGIN PATH (Unchanged flow)
        // ==========================================
        const authResponse = await supabase.auth.signInWithPassword({ email, password });

        if (authResponse.error) {
          alert(authResponse.error.message);
          return;
        }

        const activeUser = authResponse.data?.user;

        if (!activeUser?.id) {
          alert("Authentication succeeded, but session is still initializing. Please wait a moment.");
          return;
        }

        await checkSubscription(activeUser.id);
        console.log("Authenticated User:", activeUser.id);

      } else {
        // ==========================================
        // 2. THE REGISTER PATH (Clean Separation)
        // ==========================================
        const authResponse = await supabase.auth.signUp({
          email,
          password,
          options: {
            // Redirects the user right back to the site origin upon verification confirmation
            emailRedirectTo: `${window.location.origin}/admin`
          }
        });

        if (authResponse.error) {
          alert(authResponse.error.message);
          return;
        }

        setSignupSuccessMessage(
          "Sign up request successful. Check your email to verify your account."
        );

        setEmail("");
        setPassword("");
      }

    } catch (err) {
      console.error("Authentication crash:", err);
      alert(err.message || "Authentication failed.");
    } finally {
      setIsAuthSyncing(false);
    }
  }

  async function uploadBusinessLogo(file, webhookSlug) {
    try {
      console.log('--- uploadBusinessLogo fired ---');
      const fileExtension = file.name.split('.').pop();
      const fileName = `public/${webhookSlug}_${Date.now()}.${fileExtension}`;

      const { data: bucketTest, error: bucketError } = await supabase.storage.from('logos').list();
      const { data: storageData, error: storageError } = await supabase
        .storage
        .from('logos')
        .upload(fileName, file, { upsert: true });

      if (storageError) throw storageError;

      const { data: publicUrlData } = supabase
        .storage
        .from('logos')
        .getPublicUrl(storageData.path);

      const permanentUrl = publicUrlData.publicUrl;

      // Database write successfully removed from here to eliminate the race condition.
      return permanentUrl;
    } catch (error) {
      console.error('uploadBusinessLogo caught error:', error.message);
      return null;
    }
  }

  async function handleSave(e) {
    if (e && typeof e.preventDefault === 'function') {
      e.preventDefault();
    }

    if (isSaveSyncing) return;
    setIsSaveSyncing(true);

    try {
      const activeUser = user || await getActiveUser();

      if (!activeUser?.id) {
        alert("Sync Blocked: Active authentication session required.");
        return;
      }

      const cleanBusinessName = settings?.business_name?.trim() || '';
      const cleanWebhookSlug = settings?.webhook_slug?.trim() || '';

      if (!cleanBusinessName || !cleanWebhookSlug) {
        alert("Validation Failed: Required parameter fields cannot be left blank.");
        return;
      }

      let resolvedLogoUrl = settings?.logo_url || '';

      if (resolvedLogoUrl.startsWith('blob:') && pendingLogoFile) {
        const uploadedUrl = await uploadBusinessLogo(pendingLogoFile, cleanWebhookSlug);
        if (uploadedUrl) {
          resolvedLogoUrl = uploadedUrl;
          setPendingLogoFile(null);
        } else {
          resolvedLogoUrl = settings?.logo_url?.startsWith('blob:') ? '' : (settings?.logo_url || '');
        }
      }

      const payload = {
        owner_id: activeUser.id,
        business_name: cleanBusinessName,
        store_address: settings?.store_address?.trim() || '',
        discount_percentage: Number(settings?.discount_percentage ?? 10),
        webhook_slug: cleanWebhookSlug,
        currency: settings?.currency || 'ZAR',
        logo_url: resolvedLogoUrl,
        voucher_expiration_days: Number(settings?.voucher_expiration_days ?? 30) // Appended database column value to save payload
      };

      if (settings?.id) {
        payload.id = settings.id;
      }

      // ─── ATOMIC UPSERT INTEGRATION ───
      // This saves all changes simultaneously, writing the fresh logo_url alongside everything else safely
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
      setIsSaveSyncing(false);
    }
  }

  const SAFE_CURRENCY_OPTIONS = typeof CURRENCY_OPTIONS !== 'undefined' ? CURRENCY_OPTIONS : [
    { code: 'ZAR', symbol: 'R' },
    { code: 'USD', symbol: '$' },
    { code: 'EUR', symbol: '€' },
    { code: 'GBP', symbol: '£' }
  ];

  const activeCurrencySymbol =
    SAFE_CURRENCY_OPTIONS.find(
      c => c.code === (settings?.currency || 'ZAR')
    )?.symbol || 'R';

  const styles = {
    container: {
      minHeight: '100vh',
      width: '100%',
      background: '#050608',
      color: '#ffffff',
      boxSizing: 'border-box'
    },
    modalOverlay: {
      position: 'fixed',
      inset: 0,
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px'
    },
    flatCard: {
      padding: '28px',
      border: '1px solid rgba(38,216,255,0.2)',
      borderRadius: '18px',
      background: 'rgba(17,21,27,0.96)',
      boxShadow: '0 22px 60px rgba(0,0,0,0.45)',
      boxSizing: 'border-box'
    },
    button: {
      minHeight: '44px',
      padding: '10px 16px',
      borderRadius: '10px',
      border: '1px solid rgba(38,216,255,0.3)',
      background: 'linear-gradient(135deg, #26d8ff, #1299b8)',
      color: '#ffffff',
      fontWeight: 600,
      cursor: 'pointer'
    },
    header: {
      width: '100%',
      minHeight: '82px',
      padding: '12px 24px',
      boxSizing: 'border-box',
      background: 'rgba(9,11,15,0.82)',
      borderBottom: '1px solid #1c2430'
    },
    input: {
      width: '100%',
      minHeight: '44px',
      padding: '10px 12px',
      border: '1px solid #1c2430',
      borderRadius: '10px',
      background: '#0b0d11',
      color: '#ffffff',
      boxSizing: 'border-box'
    }
  };

  // --- CRITICAL PERSISTENT GATE CONDITIONAL RENDER ---
  if (isCheckingSession) {
    return (
      <div style={{
        ...styles.container,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: '#0a0a0a',
        color: '#ffffff',
        fontFamily: 'monospace',
        fontSize: '13px',
        letterSpacing: '1px'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ marginBottom: '12px', fontSize: '24px', animation: 'pulse 1.5s infinite' }}>⚡</div>
          SYNCHRONIZING SECURE NODE IDENTITY...
        </div>
      </div>
    );
  }

  return (
    <div style={{ ...styles.container, opacity: isAuthSyncing ? 0.6 : 1 }}>

      {/* GLOBAL MODAL 3: Premium Payment Negotiation */}
      {showSubscriptionModal && (
        <div
          style={{
            ...styles.modalOverlay,
            background:
              "radial-gradient(circle at top, rgba(0,255,170,0.08), rgba(0,0,0,0.94) 45%, #000000 100%)",
            backdropFilter: "blur(12px)",
          }}
        >
          <div
            style={{
              ...styles.flatCard,
              maxWidth: "460px",
              width: "90%",
              textAlign: "center",
              position: "relative",
              overflow: "hidden",
              border: "1px solid rgba(0,255,170,0.25)",
              borderRadius: "24px",
              background:
                "linear-gradient(145deg, #050505 0%, #071822 55%, #02110d 100%)",
              boxShadow:
                "0 0 20px rgba(0,255,170,0.18), 0 0 45px rgba(0,198,255,0.12)",
            }}
          >
            {/* Neon Background Glow */}
            <div
              style={{
                position: "absolute",
                top: "-90px",
                left: "50%",
                transform: "translateX(-50%)",
                width: "260px",
                height: "260px",
                borderRadius: "50%",
                background:
                  "radial-gradient(circle, rgba(0,255,170,0.28) 0%, rgba(0,198,255,0.12) 45%, transparent 75%)",
                filter: "blur(30px)",
                pointerEvents: "none",
              }}
            />

            {/* Lock Icon */}
            <div
              style={{
                width: "82px",
                height: "82px",
                margin: "0 auto 22px",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "40px",
                background:
                  "linear-gradient(135deg, #00F5A0, #00C6FF)",
                boxShadow:
                  "0 0 20px rgba(0,255,170,0.45), 0 0 45px rgba(0,198,255,0.35)",
              }}
            >
              🔒
            </div>

            <div
              style={{
                color: "#00F5A0",
                fontSize: "12px",
                fontWeight: 700,
                letterSpacing: "3px",
                marginBottom: "12px",
              }}
            >
              PREMIUM MEMBERSHIP REQUIRED
            </div>

            <h2
              style={{
                color: "#ffffff",
                marginBottom: "14px",
                fontSize: "28px",
                fontWeight: 700,
                textShadow: "0 0 12px rgba(0,198,255,0.35)",
              }}
            >
              Your Free Trial Has Expired
            </h2>

            <p
              style={{
                color: "#b9c7cf",
                fontSize: "15px",
                lineHeight: "1.8",
                marginBottom: "28px",
              }}
            >
              To continue using <strong style={{ color: "#00F5A0" }}>RuachAgent</strong>
              {" "}Premium features and maintain uninterrupted access to your merchant
              dashboard, please upgrade your subscription.
            </p>

            {/* Plan Details Card */}
            <div
              style={{
                background:
                  "linear-gradient(145deg, rgba(0,198,255,0.08), rgba(0,255,170,0.06))",
                borderRadius: "18px",
                padding: "22px",
                marginBottom: "28px",
                border: "1px solid rgba(0,255,170,0.25)",
                boxShadow:
                  "0 0 20px rgba(0,198,255,0.08)",
              }}
            >
              <div
                style={{
                  color: "#ffffff",
                  fontWeight: "700",
                  fontSize: "18px",
                  marginBottom: "8px",
                }}
              >
                Merchant Pro Plan
              </div>

              <div
                style={{
                  color: "#00F5A0",
                  fontSize: "34px",
                  fontWeight: "800",
                  textShadow: "0 0 15px rgba(0,255,170,.45)",
                }}
              >
                $6.99 [R129.00]
                <span
                  style={{
                    fontSize: "14px",
                    color: "#9ca3af",
                    fontWeight: "500",
                  }}
                >
                  {" "}
                  / month
                </span>
              </div>

              <div
                style={{
                  marginTop: "14px",
                  color: "#8fdcff",
                  fontSize: "13px",
                }}
              >
                ✓ Unlimited premium access
                <br />
                ✓ Merchant dashboard
                <br />
                ✓ Future premium updates included
              </div>
            </div>

            <button
              onClick={() => {
                if (!window.PaystackPop) {
                  alert("Paystack SDK failed to load. Please check your network connection.");
                  return;
                }

                const handler = window.PaystackPop.setup({
                  key: process.env.REACT_APP_PAYSTACK_PUBLIC_KEY || "pk_live_870272ce5b082f6522a2f9d130c368284664c7f4",
                  email: user?.email,
                  amount: 12900,
                  currency: "ZAR",
                  ref: "RUACH_" + Math.floor(Math.random() * 1000000000 + 1),
                  metadata: {
                    custom_fields: [
                      {
                        display_name: "User ID",
                        variable_name: "user_id",
                        value: user?.id,
                      },
                      {
                        display_name: "Plan",
                        variable_name: "plan_type",
                        value: "pro_monthly",
                      },
                    ],
                    user_id: user?.id,
                    plan_type: "pro_monthly",
                  },
                  onClose: () => {
                    console.log("Paystack modal closed by user.");
                  },
                  callback: async (response) => {
                    console.log("Paystack Payment Successful, Reference:", response.reference);
                    alert("Payment successful! Updating your workspace access...");

                    setTimeout(async () => {
                      await checkSubscription(user.id);
                      setShowSubscriptionModal(false);
                    }, 2000);
                  },
                });

                handler.openIframe();
              }}
              style={{
                ...styles.button,
                width: "100%",
                padding: "16px",
                fontSize: "16px",
                fontWeight: "700",
                border: "none",
                borderRadius: "14px",
                cursor: "pointer",
                color: "#ffffff",
                background:
                  "linear-gradient(90deg, #00F5A0 0%, #00C6FF 100%)",
                boxShadow:
                  "0 0 18px rgba(0,255,170,0.35), 0 0 30px rgba(0,198,255,0.25)",
                transition: "all .25s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow =
                  "0 0 28px rgba(0,255,170,.55),0 0 45px rgba(0,198,255,.4)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "0 0 18px rgba(0,255,170,.35),0 0 30px rgba(0,198,255,.25)";
              }}
            >
              Upgrade Now with Paystack →
            </button>
          </div>
        </div>
      )}

      {/* GLOBAL MODAL 2: 3-DAY PREMIUM TRIAL WELCOME */}
      {showTrialWelcomeModal && (
        <div
          style={{
            ...styles.modalOverlay,
            background:
              "radial-gradient(circle at top, rgba(0,255,170,0.08), rgba(0,0,0,0.94) 45%, #000000 100%)",
            backdropFilter: "blur(12px)"
          }}
        >
          <div
            style={{
              ...styles.flatCard,
              maxWidth: "460px",
              width: "90%",
              textAlign: "center",
              position: "relative",
              overflow: "hidden",
              border: "1px solid rgba(0,255,170,0.25)",
              borderRadius: "24px",
              background:
                "linear-gradient(145deg, #050505 0%, #071822 55%, #02110d 100%)",
              boxShadow:
                "0 0 20px rgba(0,255,170,0.18), 0 0 45px rgba(0,180,255,0.12)"
            }}
          >
            {/* Decorative Glow */}
            <div
              style={{
                position: "absolute",
                top: "-90px",
                left: "50%",
                transform: "translateX(-50%)",
                width: "260px",
                height: "260px",
                borderRadius: "50%",
                background:
                  "radial-gradient(circle, rgba(0,255,170,0.28) 0%, rgba(0,180,255,0.12) 45%, transparent 75%)",
                filter: "blur(30px)",
                pointerEvents: "none"
              }}
            />

            {/* Neon Badge */}
            <div
              style={{
                width: "82px",
                height: "82px",
                margin: "0 auto 22px",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "42px",
                background:
                  "linear-gradient(135deg, #00F5A0, #00C6FF)",
                boxShadow:
                  "0 0 20px rgba(0,255,170,0.45), 0 0 45px rgba(0,198,255,0.35)"
              }}
            >
              🎉
            </div>

            <div
              style={{
                color: "#00F5A0",
                fontSize: "12px",
                letterSpacing: "3px",
                fontWeight: 700,
                marginBottom: "12px"
              }}
            >
              PREMIUM ACCESS ACTIVATED
            </div>

            <h2
              style={{
                color: "#ffffff",
                marginBottom: "16px",
                fontSize: "30px",
                fontWeight: 700,
                textShadow: "0 0 12px rgba(0,198,255,0.35)"
              }}
            >
              Welcome to Your Premium Trial
            </h2>

            <p
              style={{
                color: "#b9c7cf",
                lineHeight: "1.9",
                marginBottom: "28px",
                fontSize: "15px"
              }}
            >
              Your email has been successfully verified and your merchant
              workspace is now online.
              <br />
              <br />
              You now have unrestricted access to every Premium feature for the
              next
              <strong
                style={{
                  color: "#00F5A0",
                  textShadow: "0 0 10px rgba(0,255,170,0.55)"
                }}
              >
                {" "}
                {trialDaysRemaining} day
                {trialDaysRemaining !== 1 ? "s" : ""}
              </strong>
              .
            </p>

            <button
              onClick={async () => {
                if (user?.id) {
                  await supabase
                    .from("subscriptions")
                    .update({
                      trial_welcome_seen: true
                    })
                    .eq("user_id", user.id);
                }

                setShowTrialWelcomeModal(false);
              }}
              style={{
                ...styles.button,
                width: "100%",
                padding: "16px",
                fontSize: "16px",
                fontWeight: 700,
                border: "none",
                borderRadius: "14px",
                cursor: "pointer",
                color: "#ffffff",
                background:
                  "linear-gradient(90deg, #00F5A0 0%, #00C6FF 100%)",
                boxShadow:
                  "0 0 18px rgba(0,255,170,0.35), 0 0 30px rgba(0,198,255,0.25)",
                transition: "all .25s ease"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow =
                  "0 0 28px rgba(0,255,170,.55),0 0 45px rgba(0,198,255,.4)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "0 0 18px rgba(0,255,170,.35),0 0 30px rgba(0,198,255,.25)";
              }}
            >
              Enter Workspace →
            </button>
          </div>
        </div>
      )}

      {/* GLOBAL MODAL 1: EMAIL CONFIRMED SUCCESS POP-UP */}

      <header style={{
        ...styles.header,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px'
      }}>
      </header>

      <input style={{ display: 'none' }} type="password" autoComplete="on" />

      <main style={{ padding: '24px 12px', maxWidth: '1500px', margin: '0 auto' }}>
        {!user ? (
          <section style={{ maxWidth: '360px', margin: '60px auto 0 auto' }}>
            <div style={styles.flatCard}>
              <h2 style={{ textAlign: 'center', fontSize: '18px', fontWeight: '500', margin: '0 0 24px 0', color: '#ffffff', letterSpacing: '0.3px' }}>Master Portal Login</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {signupSuccessMessage && (
                  <div
                    style={{
                      background: "#06281d",
                      color: "#00FFD5",
                      border: "1px solid rgba(0,255,210,.25)",
                      padding: "12px",
                      borderRadius: "10px",
                      marginBottom: "16px",
                      textAlign: "center",
                      fontSize: "13px"
                    }}
                  >
                    ✅ {signupSuccessMessage}
                  </div>
                )}
                <input type="email" placeholder="Merchant Email" value={email} onChange={e => setEmail(e.target.value)} style={styles.input} />
                <input type="password" placeholder="Access Password" value={password} onChange={e => setPassword(e.target.value)} style={styles.input} />
                <button onClick={() => handleAuth('login')} style={styles.button} disabled={isAuthSyncing}>
                  {isAuthSyncing ? 'Verifying Node...' : 'Login'}
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
                  disabled={isAuthSyncing}
                >
                  Sign Up
                </button>
              </div>
            </div>
          </section>
        ) : (
          <div className="admin-page">
            {/* ==============================
            LEFT SIDEBAR
      =============================== */}

            <aside className="sidebar">
              {/* Logo */}

              <div className="sidebar-logo">
                <div className="logo-icon">R</div>

                <div>
                  <h2>RuachAgent AI</h2>
                  <span>Intelligent Till Slip Assistant</span>
                </div>
              </div>

              {/* PREVIEWS */}

              <div className="sidebar-section">
                <p className="sidebar-title">PREVIEWS</p>

                <button className="sidebar-item active">
                  <LayoutDashboard size={18} />

                  <span>Analysis</span>
                </button>

                <button className="sidebar-item">
                  <Receipt size={18} />

                  <span>Till Slips Sent</span>
                </button>

                <button className="sidebar-item">
                  <Store size={18} />

                  <span>Connected Stores</span>
                </button>
              </div>

              {/* SETTINGS */}

              <div className="sidebar-section">
                <p className="sidebar-title">SETTINGS</p>

                <button className="sidebar-item"
                  onClick={() => navigate("/agent-parameters")}
                >
                  <SlidersHorizontal size={18} />
                  <span>Agent Parameters</span>
                </button>

                <button className="sidebar-item"
                  onClick={() => navigate("/till-slips-collwction")}
                >
                  <FileText size={18} />

                  <span>Till Slips Collection</span>
                </button>

                <button className="sidebar-item"
                  onClick={() => navigate("/integrations")}
                >
                  <Plug size={18} />

                  <span>Integrations</span>
                </button>
              </div>

              {/* Bottom Card */}

              <div className="sidebar-bottom">
                <div className="bottom-profile">
                  <div className="bottom-logo">R</div>

                  <div>
                    <h4>RuachAgent AI</h4>

                    <p>Version 1.0.0</p>
                  </div>
                </div>
              </div>
            </aside>

            {/* ==============================
            MAIN CONTENT
      =============================== */}

            <main className="main-content">
              {/* ==========================
              TOP NAVIGATION
        =========================== */}

              <header className="topbar">
                <div className="topbar-center">
                  <h1>RuachAgent AI</h1>

                  <p>Your intelligent till slip assistant</p>
                </div>

                <div className="topbar-actions">
                  <button className="icon-button">
                    <HelpCircle size={20} />
                  </button>

                  <button className="icon-button">
                    <Bell size={20} />
                  </button>

                  <button className="icon-button">
                    <UserCircle2 size={24} />
                  </button>
                </div>
              </header>

              {/* ==========================
              CONTENT AREA
        =========================== */}

              <div className="content-layout">
                {/* ======================
                 CHAT PANEL
          ======================= */}

                <section className="chat-panel">
                  <div className="chat-window">
                    <div className="hero">
                      <div className="hero-badge">
                        <Sparkles size={16} />
                        <span>RuachAgent AI</span>
                      </div>

                      <h1>
                        Welcome to
                        <span> RuachAgent AI</span>
                      </h1>

                      <p>
                        Your AI assistant for creating, managing and delivering
                        intelligent digital till slips.
                      </p>
                    </div>

                    <div className="feature-grid">
                      <div className="feature-card">
                        <div className="feature-icon">
                          <Palette size={24} />
                        </div>
                        <h3>AI-Powered Design</h3>
                        <p>
                          Instantly generate beautiful till slips using AI while
                          maintaining your brand identity.
                        </p>
                      </div>

                      <div className="feature-card">
                        <div className="feature-icon">
                          <Cpu size={24} />
                        </div>
                        <h3>Smart Parameters</h3>
                        <p>
                          Fine tune receipt formatting, tax rules, merchant details
                          and branding with AI.
                        </p>
                      </div>

                      <div className="feature-card">
                        <div className="feature-icon">
                          <Store size={24} />
                        </div>
                        <h3>Store Integration</h3>
                        <p>
                          Connect POS systems and automatically synchronize digital
                          till slips.
                        </p>
                      </div>

                      <div className="feature-card">
                        <div className="feature-icon">
                          <ArrowUpRight size={24} />
                        </div>
                        <h3>Instant Delivery</h3>
                        <p>
                          Deliver digital receipts through SMS, WhatsApp or Email
                          within seconds.
                        </p>
                      </div>
                    </div>

                    {/* CONVERSATION AREA */}
                    <div className="conversation">
                      {messages.length === 0 ? (
                        <div className="conversation-center">
                          <div className="conversation-icon">
                            <Sparkles size={42} />
                          </div>
                          <h2>Start a conversation</h2>
                          <p>
                            Ask RuachAgent AI to generate, redesign or analyse your
                            till slips.
                          </p>
                        </div>
                      ) : (
                        <div className="messages-thread">
                          {messages.map((msg, index) => (
                            <div
                              key={index}
                              className={`chat-bubble ${msg.role === "user" ? "user-bubble" : "agent-bubble"
                                }`}
                            >
                              <p>{msg.text}</p>
                            </div>
                          ))}
                          {isLoading && (
                            <div className="chat-bubble agent-bubble loading">
                              <p>RuachAgent AI is updating your till slip design...</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* PROMPT SECTION */}
                    <div className="prompt-section">
                      <div className="prompt-box">
                        <input
                          type="text"
                          placeholder="Ask RuachAgent AI anything..."
                          value={inputPrompt}
                          onChange={(e) => setInputPrompt(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && handleSendPrompt()}
                        />
                        <button onClick={handleSendPrompt} disabled={isLoading}>
                          <Send size={18} />
                        </button>
                      </div>

                      <div className="prompt-footer">
                        <span>
                          AI can make mistakes. Verify important information.
                        </span>
                        <span>Powered by RuachAgent AI</span>
                      </div>
                    </div>
                  </div>
                </section>

                {/* ======================
              TILL SLIP PREVIEW
          ======================= */}

                <aside className="preview-panel">
                  <div className="preview-card">
                    {/* Header */}

                    <div className="preview-header">
                      <div>
                        <h2>Till Slip Preview</h2>

                        <p>AI Generated Receipt</p>
                      </div>

                      <div className="status-badge">
                        <div className="status-dot"></div>

                        <span>{isLoading ? "Generating..." : "AI Connected"}</span>
                      </div>
                    </div>

                    {/* Receipt Paper (Connected to Dynamic State) */}

                    <div
                      className="receipt-paper"
                      style={{
                        borderColor: receiptData.themeColor || "#00f0ff"
                      }}
                    >
                      <div className="ai-preview-badge">✨ AI Live Preview</div>

                      <div className="receipt-merchant">
                        <h2>{receiptData.merchantName}</h2>

                        <p>{receiptData.location}</p>
                      </div>

                      <div className="receipt-divider"></div>

                      <div className="receipt-items">
                        {receiptData.items.map((item, idx) => (
                          <div key={idx} className="receipt-row">
                            <span>{item.name}</span>

                            <span>{item.price}</span>
                          </div>
                        ))}
                      </div>

                      <div className="receipt-total">
                        <div className="receipt-total-row">
                          <span>VAT</span>

                          <span>{receiptData.vat}</span>
                        </div>

                        <div className="receipt-total-row receipt-grand-total">
                          <span>Total</span>

                          <span>{receiptData.total}</span>
                        </div>
                      </div>

                      <div className="receipt-qr"></div>

                      <div className="receipt-footer">Powered by RuachAgent AI</div>
                    </div>

                    {/* Statistics */}

                    <div className="preview-stats">
                      <div className="stat-card">
                        <span className="stat-value">0</span>

                        <span className="stat-label">Receipts</span>
                      </div>

                      <div className="stat-card">
                        <span className="stat-value">0</span>

                        <span className="stat-label">Connected</span>
                      </div>
                    </div>

                    {/* AI Status */}

                    <div className="ai-card">
                      <div className="ai-icon">
                        <Cpu size={20} />
                      </div>

                      <div>
                        <h4>RuachAgent AI Engine</h4>

                        <p>
                          {messages.length > 0
                            ? "AI engine actively engaged and rendering receipt changes."
                            : "Waiting for your first request to generate a digital till slip."}
                        </p>
                      </div>
                    </div>

                    {/* Actions */}

                    <div className="preview-actions">
                      <button className="primary-action" onClick={handleSendPrompt}>
                        Generate Preview
                      </button>

                      <button className="secondary-action" onClick={handleClear}>
                        Clear
                      </button>
                    </div>

                    {/* Export */}

                    <div className="export-card">
                      <h3>Export</h3>

                      <p>Download or share your generated receipt.</p>

                      <button className="export-button">Export Receipt</button>
                    </div>
                  </div>
                </aside>
              </div>
            </main>
          </div>
        )}
      </main>
    </div>
  );
}