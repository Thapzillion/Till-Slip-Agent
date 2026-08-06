import { useState, useEffect } from "react";

import { supabase } from '../supabaseClient';


// Static reference data available instantly globally

const CURRENCY_OPTIONS = [

    { code: 'ZAR', symbol: 'R', name: 'South African Rand' },

    { code: 'USD', symbol: '$', name: 'US Dollar' },

    { code: 'GBP', symbol: '£', name: 'British Pound' },

    { code: 'EUR', symbol: '€', name: 'Euro' },

    { code: 'NGN', symbol: '₦', name: 'Nigerian Naira' }

];

export function useBusiness() {

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

    // ---------- AUTH MODES ----------
    const [authMode, setAuthMode] = useState("signin");

    // signin
    const [rememberMe, setRememberMe] = useState(false);

    // signup
    const [businessName, setBusinessName] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [agreeTerms, setAgreeTerms] = useState(false);

    // reset password
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");

    // loading
    const [isSendingReset, setIsSendingReset] = useState(false);
    const [isResendingVerification, setIsResendingVerification] = useState(false);
    const [isSavingPassword, setIsSavingPassword] = useState(false);

    // messages
    const [authError, setAuthError] = useState("");
    const [authSuccess, setAuthSuccess] = useState("");


    // --- COMPONENT RENDER-STATE ALIGNMENT LAYER ---
    const activeInboxesCount = user ? 1 : 0; // Tracks the primary active synchronized node
    const totalParsedCount = txCount;       // Maps your optimized total count directly to your UI
    const inboxGraphData = graphData;       // Routes your 28-day database matrix cleanly to the graph bars
    const selectedDateRangeLabel = "PAST_28_DAYS"; // Synced to our server-side SQL aggregation constraint limit


    const [showTrialWelcomeModal, setShowTrialWelcomeModal] = useState(false);
    const [trialDaysRemaining, setTrialDaysRemaining] = useState(0);
    const [trialExpiryDate, setTrialExpiryDate] = useState(null);

    const [signupSuccessMessage, setSignupSuccessMessage] = useState("");

    // Additional shared UI state expected by AdminPanel and other consumers
    const [subscriptionRecord, setSubscriptionRecord] = useState(null);
    const [analytics, setAnalytics] = useState(null);
    const [loadingAnalytics, setLoadingAnalytics] = useState(false);
    const [receipts, setReceipts] = useState([]);
    const [receiptTemplates, setReceiptTemplates] = useState([]);
    const [prompts, setPrompts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

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

    //Business table state
    const [settings, setSettings] = useState({
        business_name: "",
        store_address: "",
        discount_percentage: 10,
        webhook_slug: "",
        currency: "ZAR",
        logo_url: "",
        voucher_expiration_days: 30
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

    // Simple prompt builder helper used by AdminPanel
    const handlePromptChange = (updater) => {
        if (typeof updater === 'function') {
            setPrompts(prev => updater(prev));
        } else {
            setPrompts(updater);
        }
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
            setLoadingAnalytics(true);
            if (!userId) {
                console.warn("Analytics blocked: No authenticated user.");
                setAnalytics(null);
                setLoadingAnalytics(false);
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
                setAnalytics(stats);
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
                setAnalytics(null);
            }
        } catch (err) {
            console.error("Analytics stream catch handled:", err.message);
        } finally {
            setLoadingAnalytics(false);
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

            // Cache subscription record for UI consumers
            try {
                setSubscriptionRecord(data);
            } catch (e) {
                console.warn('Failed to cache subscription record', e);
            }

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
    async function checkSupabaseReachability() {
        try {
            const { data, error } = await supabase.from('business_settings').select('count');
            console.log('Supabase reachability check:', data, error);
        } catch (e) {
            console.error('Reachability network check failed:', e);
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

                // ---------------------------------------
                // GET AUTHENTICATED USER
                // ---------------------------------------

                const {
                    data: userData,
                    error: userError
                } = await supabase.auth.getUser();

                if (userError) {
                    alert(userError.message);
                    return;
                }

                const activeUser = userData?.user;

                if (!activeUser) {
                    alert("Authentication succeeded but no authenticated user was returned.");
                    return;
                }

                setUser(activeUser);

                console.log("Authenticated User:", activeUser.id);

                // ---------------------------------------
                // LOAD USER PIPELINE
                // ---------------------------------------

                await checkSubscription(activeUser.id);

                // Next steps
                // await loadBusinessSettings(activeUser.id);
                // await fetchLiveAnalytics(activeUser.id);
                // await loadRemainingUserData(activeUser.id);

            } // ==========================================
            // REGISTER
            // ==========================================

            if (password !== confirmPassword) {
                alert("Passwords do not match.");
                return;
            }

            if (!agreeTerms) {
                alert("Please accept the Terms & Conditions.");
                return;
            }

            const authResponse = await supabase.auth.signUp({
                email,
                password,
                options: {
                    emailRedirectTo: `${window.location.origin}/admin`
                }
            });

            if (authResponse.error) {
                alert(authResponse.error.message);
                return;
            }

            const newUser = authResponse.data.user;

            if (!newUser) {
                setSignupSuccessMessage(
                    "Check your email to verify your account."
                );
                return;
            }

            // Create business record

            const { error: businessError } = await supabase
                .from("business_settings")
                .upsert({
                    user_id: newUser.id,
                    business_name: businessName
                });

            if (businessError) {
                console.error(businessError);
            }

            // Create subscription record

            const trialEnds = new Date();
            trialEnds.setDate(trialEnds.getDate() + 3);

            const { error: subscriptionError } = await supabase
                .from("subscriptions")
                .upsert({
                    user_id: newUser.id,
                    subscription_status: "trial",
                    trial_ends_at: trialEnds.toISOString(),
                    trial_welcome_seen: false
                });

            if (subscriptionError) {
                console.error(subscriptionError);
            }

            setSignupSuccessMessage(
                "Account created successfully. Please verify your email."
            );

            setAuthMode("verify");

            setBusinessName("");
            setEmail("");
            setPassword("");
            setConfirmPassword("");

            if (authResponse.error) {
                alert(authResponse.error.message);
                return;
            }

            setSignupSuccessMessage(
                "Sign up request successful. Check your email to verify your account."
            );

            setEmail("");
            setPassword("");
        } catch (err) {
            console.error("Authentication crash:", err);
            alert(err.message || "Authentication failed.");
        } finally {
            setIsAuthSyncing(false);
        }
    }

    async function handleForgotPassword() {

        if (!email) {
            alert("Enter your email.");
            return;
        }

        const { error } = await supabase.auth.resetPasswordForEmail(
            email,
            {
                redirectTo: `${window.location.origin}/admin`
            }
        );

        if (error) {
            alert(error.message);
            return;
        }

        alert("Password reset email sent.");

    }

    async function handleResetPassword() {

        if (newPassword !== confirmNewPassword) {
            alert("Passwords do not match.");
            return;
        }

        const { error } = await supabase.auth.updateUser({
            password: newPassword
        });

        if (error) {
            alert(error.message);
            return;
        }

        alert("Password updated.");

        setAuthMode("signin");

    }

    async function handleResendVerification() {

        if (!email) {
            alert("Enter your email.");
            return;
        }

        const { error } = await supabase.functions.invoke(
            "resend-verification",
            {
                body: {
                    email
                }
            }
        );

        if (error) {
            alert(error.message);
            return;
        }

        alert("Verification email sent.");

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



    return {

        // ---------------- AUTH ----------------
        user,
        setUser,
        email,
        setEmail,
        password,
        setPassword,

        authMode,
        setAuthMode,

        rememberMe,
        setRememberMe,

        businessName,
        setBusinessName,

        confirmPassword,
        setConfirmPassword,

        agreeTerms,
        setAgreeTerms,

        newPassword,
        setNewPassword,

        confirmNewPassword,
        setConfirmNewPassword,

        signupSuccessMessage,

        authError,
        authSuccess,

        isAuthSyncing,

        // ---------------- SETTINGS ----------------
        settings,
        setSettings,

        pendingLogoFile,
        setPendingLogoFile,

        isSaveSyncing,
        isCheckingSession,
        // backward-compatible aliases
        saveSettings: handleSave,
        uploadLogo: uploadBusinessLogo,
        // shared UI state
        subscription: subscriptionRecord,
        analytics,
        loadingAnalytics,
        receipts,
        receiptTemplates,
        prompts,
        setPrompts,
        handlePromptChange,
        loading,
        error,
        successMessage,

        // ---------------- SUBSCRIPTION ----------------
        showSubscriptionModal,
        setShowSubscriptionModal,

        subscriptionLoading,

        showTrialWelcomeModal,
        setShowTrialWelcomeModal,

        trialDaysRemaining,
        trialExpiryDate,

        // ---------------- ANALYTICS ----------------
        txCount,
        txVolume,
        graphData,

        activeInboxesCount,
        totalParsedCount,
        inboxGraphData,
        selectedDateRangeLabel,

        // ---------------- AI ----------------
        inputPrompt,
        setInputPrompt,

        messages,
        setMessages,

        isLoading,

        handleSendPrompt,
        handleClear,

        receiptData,
        setReceiptData,

        receipt,
        setReceipt,

        // ---------------- BACKEND ----------------
        getActiveUser,
        fetchLiveAnalytics,
        checkSubscription,

        fetchMerchantSettings,

        uploadBusinessLogo,

        checkSupabaseReachability,

        handleAuth,

        handleForgotPassword,

        handleResetPassword,

        handleResendVerification,

        handleSave

    };

}