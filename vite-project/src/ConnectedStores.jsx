import { useState, useEffect, useCallback } from "react";
import { supabase } from "./supabaseClient";

export default function ConnectedStores() {

    // ============================
    // States
    // ============================

    const [business, setBusiness] = useState(null);

    const [stores, setStores] = useState([]);

    const [loading, setLoading] = useState(true);

    const [saving, setSaving] = useState(false);

    const [error, setError] = useState("");

    const [selectedStore, setSelectedStore] = useState(null);

    const [form, setForm] = useState({
        provider: "",
        store_name: "",
        store_identifier: "",
        webhook_url: "",
        webhook_secret: "",
        api_key_encrypted: "",
        access_token_encrypted: "",
        refresh_token_encrypted: "",
        status: "connected"
    });

    // ============================
    // Get Current Business
    // ============================

    const getBusiness = useCallback(async () => {

        const {
            data: { user },
            error: authError,
        } = await supabase.auth.getUser();

        if (authError || !user) {
            setError("Unable to authenticate.");
            return null;
        }

        const { data, error } = await supabase
            .from("business_settings")
            .select("*")
            .eq("owner_id", user.id)
            .single();

        if (error) {
            setError(error.message);
            return null;
        }

        setBusiness(data);

        return data;

    }, []);

    // ============================
    // Fetch Stores
    // ============================

    const fetchStores = useCallback(async (businessId) => {

        if (!businessId) return;

        setLoading(true);

        const { data, error } = await supabase
            .from("connected_stores")
            .select("*")
            .eq("business_id", businessId)
            .order("created_at", { ascending: false });

        if (error) {
            setError(error.message);
            setStores([]);
        } else {
            setStores(data || []);
        }

        setLoading(false);

    }, []);

    // ============================
    // Create Store
    // ============================

    const createStore = async () => {

        if (!business) return;

        setSaving(true);

        const { error } = await supabase
            .from("connected_stores")
            .insert({
                business_id: business.id,
                ...form
            });

        if (error) {
            setError(error.message);
        } else {
            await fetchStores(business.id);
            resetForm();
        }

        setSaving(false);

    };

    // ============================
    // Update Store
    // ============================

    const updateStore = async () => {

        if (!selectedStore) return;

        setSaving(true);

        const { error } = await supabase
            .from("connected_stores")
            .update({
                ...form,
                last_sync_at: new Date().toISOString()
            })
            .eq("id", selectedStore.id);

        if (error) {
            setError(error.message);
        } else {
            await fetchStores(business.id);
            resetForm();
        }

        setSaving(false);

    };

    // ============================
    // Delete Store
    // ============================

    const deleteStore = async (id) => {

        const confirmed = window.confirm(
            "Disconnect this store?"
        );

        if (!confirmed) return;

        const { error } = await supabase
            .from("connected_stores")
            .delete()
            .eq("id", id);

        if (error) {
            setError(error.message);
        } else {
            await fetchStores(business.id);
        }

    };

    // ============================
    // Toggle Status
    // ============================

    const toggleStatus = async (store) => {

        const nextStatus =
            store.status === "connected"
                ? "disconnected"
                : "connected";

        const { error } = await supabase
            .from("connected_stores")
            .update({
                status: nextStatus
            })
            .eq("id", store.id);

        if (!error) {
            fetchStores(business.id);
        }

    };

    // ============================
    // Begin Editing
    // ============================

    const editStore = (store) => {

        setSelectedStore(store);

        setForm({
            provider: store.provider || "",
            store_name: store.store_name || "",
            store_identifier: store.store_identifier || "",
            webhook_url: store.webhook_url || "",
            webhook_secret: store.webhook_secret || "",
            api_key_encrypted: store.api_key_encrypted || "",
            access_token_encrypted: store.access_token_encrypted || "",
            refresh_token_encrypted: store.refresh_token_encrypted || "",
            status: store.status || "connected"
        });

    };

    // ============================
    // Reset Form
    // ============================

    const resetForm = () => {

        setSelectedStore(null);

        setForm({
            provider: "",
            store_name: "",
            store_identifier: "",
            webhook_url: "",
            webhook_secret: "",
            api_key_encrypted: "",
            access_token_encrypted: "",
            refresh_token_encrypted: "",
            status: "connected"
        });

    };

    // ============================
    // Handle Inputs
    // ============================

    const handleInput = (e) => {

        const { name, value } = e.target;

        setForm(prev => ({
            ...prev,
            [name]: value
        }));

    };

    // ============================
    // Initial Load
    // ============================

    useEffect(() => {

        async function load() {

            const business = await getBusiness();

            if (business) {
                fetchStores(business.id);
            }

        }

        load();

    }, [getBusiness, fetchStores]);

    // ============================
    // Return JSX Below
    // ============================ 

    const styles = {

        container: {
            minHeight: "100vh",
            background: "#050608",
            color: "#fff",
            padding: "28px 32px",
            display: "flex",
            flexDirection: "column",
            gap: "24px",
            overflowY: "auto"
        },

        pageHeader: {
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            paddingBottom: "18px",
            borderBottom: "1px solid rgba(38,216,255,.12)"
        },

        titleSection: {
            display: "flex",
            flexDirection: "column",
            gap: "6px"
        },

        title: {
            fontSize: "32px",
            fontWeight: 800,
            letterSpacing: "-0.5px"
        },

        subtitle: {
            color: "#8d98a5",
            fontSize: "14px"
        },

        primaryButton: {
            background: "linear-gradient(135deg,#26d8ff,#00b7ff)",
            color: "#000",
            border: "none",
            borderRadius: "14px",
            padding: "12px 22px",
            fontWeight: 700,
            cursor: "pointer",
            boxShadow: "0 0 25px rgba(38,216,255,.25)"
        }

    };

    return (

        <div style={styles.container}>

            <div style={styles.pageHeader}>

                <div style={styles.titleSection}>

                    <div style={styles.title}>
                        Connected Stores
                    </div>

                    <div style={styles.subtitle}>
                        Manage Shopify, WooCommerce and POS integrations.
                    </div>

                </div>

                <button
                    style={styles.primaryButton}
                    onClick={resetForm}
                >
                    + Connect Store
                </button>

            </div>

            {/* ================================================= */}
            {/* Top Navigation */}
            {/* ================================================= */}

            <header className="sticky top-0 z-40 border-b border-white/10 backdrop-blur-xl bg-black/45">

                <div className="max-w-7xl mx-auto px-8">

                    <div className="h-20 flex items-center justify-between">

                        {/* Left */}

                        <div className="flex items-center gap-4">

                            <div className="w-12 h-12 rounded-2xl bg-white text-black flex items-center justify-center font-black text-lg shadow-xl">

                                RA

                            </div>

                            <div>

                                <h1 className="font-semibold tracking-wide text-lg">

                                    Connected Stores

                                </h1>

                                <p className="text-xs text-zinc-400">

                                    Connect Shopify, WooCommerce, POS systems and custom webhooks

                                </p>

                            </div>

                        </div>

                        {/* Right */}

                        <div className="flex items-center gap-4">

                            <button
                                onClick={() => fetchStores(business?.id)}
                                className="px-5 py-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition"
                            >

                                Refresh

                            </button>

                            <button

                                onClick={resetForm}

                                className="px-6 py-2 rounded-xl bg-white text-black font-semibold hover:scale-105 transition"

                            >

                                + Connect Store

                            </button>

                        </div>

                    </div>

                </div>

            </header>

            {/* ================================================= */}
            {/* Hero */}
            {/* ================================================= */}

            <section className="max-w-7xl mx-auto px-8 pt-10">

                <div className="rounded-[32px] overflow-hidden border border-white/10 bg-gradient-to-br from-zinc-900 via-black to-zinc-900">

                    <div className="px-10 py-12">

                        <div className="max-w-3xl">

                            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-4 py-1 text-cyan-300 text-sm">

                                ● Live Integrations

                            </div>

                            <h2 className="mt-5 text-5xl font-black leading-tight">

                                Connect every

                                <span className="text-white">

                                    {" "}store{" "}

                                </span>

                                to RuachAgent

                            </h2>

                            <p className="mt-5 text-zinc-400 text-lg leading-8">

                                Manage Shopify stores, WooCommerce websites,

                                Square terminals, Clover POS systems and custom

                                webhook integrations from one intelligent

                                dashboard.

                            </p>

                            <div className="mt-8 flex flex-wrap gap-4">

                                <button

                                    className="px-7 py-3 rounded-2xl bg-white text-black font-semibold"

                                >

                                    Connect New Store

                                </button>

                                <button

                                    className="px-7 py-3 rounded-2xl border border-white/10 hover:bg-white/5"

                                >

                                    View Documentation

                                </button>

                            </div>

                        </div>

                    </div>

                </div>

            </section>

            {/* ================================================ */}
            {/* KPI Cards */}
            {/* ================================================ */}

            <section className="max-w-7xl mx-auto px-8 mt-8">

                <div className="grid xl:grid-cols-4 lg:grid-cols-2 gap-6">

                    {/* Total Stores */}

                    <div className="rounded-3xl border border-white/10 bg-zinc-950/70 p-7">

                        <div className="text-sm text-zinc-500">

                            Connected Stores

                        </div>

                        <div className="mt-4 text-5xl font-black">

                            {stores.length}

                        </div>

                        <div className="mt-3 text-sm text-green-400">

                            Active integrations

                        </div>

                    </div>

                    {/* Connected */}

                    <div className="rounded-3xl border border-white/10 bg-zinc-950/70 p-7">

                        <div className="text-sm text-zinc-500">

                            Online

                        </div>

                        <div className="mt-4 text-5xl font-black">

                            {

                                stores.filter(

                                    s => s.status === "connected"

                                ).length

                            }

                        </div>

                        <div className="mt-3 text-sm text-cyan-400">

                            Currently connected

                        </div>

                    </div>

                    {/* Offline */}

                    <div className="rounded-3xl border border-white/10 bg-zinc-950/70 p-7">

                        <div className="text-sm text-zinc-500">

                            Offline

                        </div>

                        <div className="mt-4 text-5xl font-black">

                            {

                                stores.filter(

                                    s => s.status === "disconnected"

                                ).length

                            }

                        </div>

                        <div className="mt-3 text-sm text-orange-400">

                            Require attention

                        </div>

                    </div>

                    {/* Business */}

                    <div className="rounded-3xl border border-white/10 bg-zinc-950/70 p-7">

                        <div className="text-sm text-zinc-500">

                            Business

                        </div>

                        <div className="mt-4 text-2xl font-bold truncate">

                            {

                                business?.business_name ||

                                "Loading..."

                            }

                        </div>

                        <div className="mt-3 text-sm text-zinc-500">

                            Merchant Account

                        </div>

                    </div>

                </div>

            </section>

            {/* Search + Toolbar */}
            <section className="max-w-7xl mx-auto px-8 mt-8">
                <div className="rounded-3xl border border-white/10 bg-zinc-950/70 p-6">
                    <div className="flex flex-col xl:flex-row gap-5 xl:items-center xl:justify-between">

                        <div className="flex-1">
                            <div className="relative">
                                <svg className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <circle cx="11" cy="11" r="7" />
                                    <path d="M20 20l-3.5-3.5" />
                                </svg>

                                <input
                                    type="text"
                                    placeholder="Search connected stores..."
                                    className="w-full pl-14 pr-5 py-4 rounded-2xl bg-black border border-white/10 focus:border-cyan-400 focus:outline-none transition"
                                />
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-3">

                            <select className="px-5 py-4 rounded-2xl bg-black border border-white/10">
                                <option>All Providers</option>
                                <option>Shopify</option>
                                <option>WooCommerce</option>
                                <option>Square</option>
                                <option>Clover</option>
                                <option>Lightspeed</option>
                                <option>Custom POS</option>
                            </select>

                            <select className="px-5 py-4 rounded-2xl bg-black border border-white/10">
                                <option>All Statuses</option>
                                <option>Connected</option>
                                <option>Disconnected</option>
                            </select>

                            <button
                                onClick={() => fetchStores(business?.id)}
                                className="px-6 py-4 rounded-2xl bg-zinc-900 border border-white/10 hover:bg-zinc-800 transition"
                            >
                                Refresh
                            </button>

                        </div>

                    </div>
                </div>
            </section>

            {/* Quick Integration Cards */}
            <section className="max-w-7xl mx-auto px-8 mt-8">
                <div className="grid xl:grid-cols-3 md:grid-cols-2 gap-6">

                    <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-[#0f0f0f] to-black p-7 hover:border-cyan-500/40 transition">
                        <div className="flex items-center justify-between">
                            <div className="w-14 h-14 rounded-2xl bg-green-500/15 flex items-center justify-center text-2xl">🛍️</div>
                            <span className="text-xs text-zinc-500">Popular</span>
                        </div>

                        <h3 className="mt-6 text-xl font-bold">Shopify</h3>

                        <p className="mt-3 text-sm leading-7 text-zinc-400">
                            Connect Shopify stores and automatically deliver digital till
                            slips after every completed order.
                        </p>

                        <button
                            onClick={resetForm}
                            className="mt-8 w-full py-3 rounded-xl bg-white text-black font-semibold hover:scale-[1.02] transition"
                        >
                            Connect Shopify
                        </button>
                    </div>

                    <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-[#0f0f0f] to-black p-7 hover:border-cyan-500/40 transition">
                        <div className="flex items-center justify-between">
                            <div className="w-14 h-14 rounded-2xl bg-purple-500/15 flex items-center justify-center text-2xl">🛒</div>
                            <span className="text-xs text-zinc-500">eCommerce</span>
                        </div>

                        <h3 className="mt-6 text-xl font-bold">WooCommerce</h3>

                        <p className="mt-3 text-sm leading-7 text-zinc-400">
                            Receive webhook events from WooCommerce and send customers their
                            receipts instantly.
                        </p>

                        <button
                            onClick={resetForm}
                            className="mt-8 w-full py-3 rounded-xl bg-white text-black font-semibold hover:scale-[1.02] transition"
                        >
                            Connect WooCommerce
                        </button>
                    </div>

                    <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-[#0f0f0f] to-black p-7 hover:border-cyan-500/40 transition">
                        <div className="flex items-center justify-between">
                            <div className="w-14 h-14 rounded-2xl bg-cyan-500/15 flex items-center justify-center text-2xl">⚡</div>
                            <span className="text-xs text-zinc-500">Webhook</span>
                        </div>

                        <h3 className="mt-6 text-xl font-bold">Custom POS</h3>

                        <p className="mt-3 text-sm leading-7 text-zinc-400">
                            Connect any POS or ERP platform using your secure RuachAgent
                            webhook endpoint.
                        </p>

                        <button
                            onClick={resetForm}
                            className="mt-8 w-full py-3 rounded-xl bg-white text-black font-semibold hover:scale-[1.02] transition"
                        >
                            Create Webhook
                        </button>
                    </div>

                </div>
            </section>

            {/* Connected Stores Header */}
            <section className="max-w-7xl mx-auto px-8 mt-10">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div>
                        <h2 className="text-3xl font-bold">Connected Stores</h2>
                        <p className="text-zinc-500 mt-2">
                            Manage every connected store, POS and webhook integration from one place.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <span className="px-4 py-2 rounded-full bg-cyan-500/10 text-cyan-300 text-sm border border-cyan-500/20">
                            {stores.length} Total
                        </span>

                        <span className="px-4 py-2 rounded-full bg-green-500/10 text-green-400 text-sm border border-green-500/20">
                            {stores.filter(s => s.status === "connected").length} Active
                        </span>
                    </div>
                </div>
            </section>

            {/* Connected Stores Grid */}
            <section className="max-w-7xl mx-auto px-8 py-8">

                {loading ? (

                    <div className="grid xl:grid-cols-3 lg:grid-cols-2 gap-6">

                        {[...Array(6)].map((_, i) => (
                            <div
                                key={i}
                                className="rounded-3xl border border-white/10 bg-zinc-950/70 p-7 animate-pulse"
                            >
                                <div className="h-14 w-14 rounded-2xl bg-zinc-800"></div>
                                <div className="mt-6 h-6 w-40 rounded bg-zinc-800"></div>
                                <div className="mt-3 h-4 w-56 rounded bg-zinc-900"></div>
                                <div className="mt-8 h-12 rounded-2xl bg-zinc-900"></div>
                            </div>
                        ))}

                    </div>

                ) : stores.length === 0 ? (

                    <div className="rounded-[36px] border border-dashed border-white/10 bg-zinc-950/60 py-24 text-center">

                        <div className="text-7xl">🏪</div>

                        <h2 className="mt-6 text-3xl font-bold">
                            No Connected Stores
                        </h2>

                        <p className="mt-4 max-w-xl mx-auto text-zinc-500 leading-7">
                            Connect Shopify, WooCommerce, Square, Clover or any POS
                            system using secure webhook integrations.
                        </p>

                        <button
                            onClick={resetForm}
                            className="mt-10 px-8 py-4 rounded-2xl bg-white text-black font-semibold hover:scale-105 transition"
                        >
                            Connect Your First Store
                        </button>

                    </div>

                ) : (

                    <div className="grid xl:grid-cols-3 lg:grid-cols-2 gap-7">

                        {stores.map(store => {

                            const providerColor = {
                                Shopify: "bg-green-500/15 text-green-400",
                                WooCommerce: "bg-purple-500/15 text-purple-400",
                                Square: "bg-cyan-500/15 text-cyan-400",
                                Clover: "bg-emerald-500/15 text-emerald-400",
                                Lightspeed: "bg-orange-500/15 text-orange-400"
                            }[store.provider] || "bg-white/10 text-white";

                            const providerIcon = {
                                Shopify: "🛍️",
                                WooCommerce: "🛒",
                                Square: "⬜",
                                Clover: "🍀",
                                Lightspeed: "⚡"
                            }[store.provider] || "🏪";

                            return (

                                <div
                                    key={store.id}
                                    className="group rounded-[30px] border border-white/10 bg-gradient-to-br from-zinc-950 via-black to-zinc-900 hover:border-cyan-400/40 transition-all duration-300 overflow-hidden"
                                >

                                    <div className="h-1 bg-gradient-to-r from-cyan-400 via-white to-cyan-400 opacity-0 group-hover:opacity-100 transition" />

                                    <div className="p-7">

                                        <div className="flex items-start justify-between">

                                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl ${providerColor}`}>
                                                {providerIcon}
                                            </div>

                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-semibold ${store.status === "connected"
                                                    ? "bg-green-500/10 text-green-400 border border-green-500/20"
                                                    : "bg-red-500/10 text-red-400 border border-red-500/20"
                                                    }`}
                                            >
                                                {store.status}
                                            </span>

                                        </div>

                                        <h3 className="mt-6 text-2xl font-bold">
                                            {store.store_name}
                                        </h3>

                                        <div className="mt-2 text-zinc-400">
                                            {store.provider}
                                        </div>

                                        <div className="mt-6 space-y-4">

                                            <div className="flex justify-between">

                                                <span className="text-zinc-500">
                                                    Identifier
                                                </span>

                                                <span className="text-sm text-white">
                                                    {store.store_identifier || "--"}
                                                </span>

                                            </div>

                                            <div className="flex justify-between">

                                                <span className="text-zinc-500">
                                                    Business
                                                </span>

                                                <span className="text-sm">
                                                    {business?.business_name}
                                                </span>

                                            </div>

                                            <div className="flex justify-between">

                                                <span className="text-zinc-500">
                                                    Last Sync
                                                </span>

                                                <span className="text-sm">

                                                    {store.last_sync_at
                                                        ? new Date(
                                                            store.last_sync_at
                                                        ).toLocaleString()
                                                        : "Never"}

                                                </span>

                                            </div>

                                        </div>

                                        <div className="mt-7 rounded-2xl border border-white/10 bg-black/50 p-4">

                                            <div className="text-xs uppercase tracking-widest text-zinc-500">

                                                Webhook URL

                                            </div>

                                            <div className="mt-3 break-all text-sm text-cyan-300">

                                                {store.webhook_url ||
                                                    "No webhook configured"}

                                            </div>

                                        </div>

                                        <div className="grid grid-cols-3 gap-3 mt-7">

                                            <button
                                                onClick={() => editStore(store)}
                                                className="rounded-xl border border-white/10 py-3 hover:bg-white/5 transition"
                                            >
                                                Edit
                                            </button>

                                            <button
                                                onClick={() => toggleStatus(store)}
                                                className={`rounded-xl py-3 font-semibold transition ${store.status === "connected"
                                                    ? "bg-orange-500/15 text-orange-400"
                                                    : "bg-green-500/15 text-green-400"
                                                    }`}
                                            >
                                                {store.status === "connected"
                                                    ? "Disable"
                                                    : "Enable"}
                                            </button>

                                            <button
                                                onClick={() => deleteStore(store.id)}
                                                className="rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition"
                                            >
                                                Delete
                                            </button>

                                        </div>

                                    </div>

                                </div>

                            );

                        })}

                    </div>

                )}

            </section>

            {/* ================================================= */}
            {/* Add / Edit Store Modal */}
            {/* ================================================= */}

            {(selectedStore || !selectedStore) && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">

                    <div className="w-full max-w-3xl rounded-[32px] border border-white/10 bg-[#090909] shadow-2xl overflow-hidden">

                        {/* Header */}

                        <div className="flex items-center justify-between border-b border-white/10 px-8 py-6">

                            <div>

                                <h2 className="text-2xl font-bold">
                                    {selectedStore ? "Edit Connected Store" : "Connect New Store"}
                                </h2>

                                <p className="text-sm text-zinc-500 mt-1">
                                    Configure webhook integrations for your online store or POS.
                                </p>

                            </div>

                            <button
                                onClick={resetForm}
                                className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 transition"
                            >
                                ✕
                            </button>

                        </div>

                        {/* Body */}

                        <div className="p-8 space-y-6">

                            {/* Provider */}

                            <div>

                                <label className="block mb-2 text-sm text-zinc-400">
                                    Provider
                                </label>

                                <select
                                    name="provider"
                                    value={form.provider}
                                    onChange={handleInput}
                                    className="w-full rounded-2xl border border-white/10 bg-black px-5 py-4 focus:border-cyan-400 outline-none"
                                >
                                    <option value="">Choose Provider</option>
                                    <option>Shopify</option>
                                    <option>WooCommerce</option>
                                    <option>Square</option>
                                    <option>Clover</option>
                                    <option>Lightspeed</option>
                                    <option>Custom POS</option>
                                </select>

                            </div>

                            {/* Store Name */}

                            <div>

                                <label className="block mb-2 text-sm text-zinc-400">
                                    Store Name
                                </label>

                                <input
                                    name="store_name"
                                    value={form.store_name}
                                    onChange={handleInput}
                                    placeholder="Example Electronics"
                                    className="w-full rounded-2xl border border-white/10 bg-black px-5 py-4 outline-none focus:border-cyan-400"
                                />

                            </div>

                            {/* Store Identifier */}

                            <div>

                                <label className="block mb-2 text-sm text-zinc-400">
                                    Store Identifier
                                </label>

                                <input
                                    name="store_identifier"
                                    value={form.store_identifier}
                                    onChange={handleInput}
                                    placeholder="shop_12345"
                                    className="w-full rounded-2xl border border-white/10 bg-black px-5 py-4 outline-none focus:border-cyan-400"
                                />

                            </div>

                            {/* Webhook URL */}

                            <div>

                                <label className="block mb-2 text-sm text-zinc-400">
                                    Webhook URL
                                </label>

                                <input
                                    name="webhook_url"
                                    value={form.webhook_url}
                                    onChange={handleInput}
                                    placeholder="https://..."
                                    className="w-full rounded-2xl border border-white/10 bg-black px-5 py-4 outline-none focus:border-cyan-400"
                                />

                            </div>

                            {/* Webhook Secret */}

                            <div>

                                <label className="block mb-2 text-sm text-zinc-400">
                                    Webhook Secret
                                </label>

                                <input
                                    name="webhook_secret"
                                    value={form.webhook_secret}
                                    onChange={handleInput}
                                    placeholder="**************"
                                    className="w-full rounded-2xl border border-white/10 bg-black px-5 py-4 outline-none focus:border-cyan-400"
                                />

                            </div>

                            {/* Status */}

                            <div>

                                <label className="block mb-2 text-sm text-zinc-400">
                                    Status
                                </label>

                                <select
                                    name="status"
                                    value={form.status}
                                    onChange={handleInput}
                                    className="w-full rounded-2xl border border-white/10 bg-black px-5 py-4 outline-none focus:border-cyan-400"
                                >
                                    <option value="connected">Connected</option>
                                    <option value="disconnected">Disconnected</option>
                                </select>

                            </div>

                            {/* Business Info */}

                            <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-5">

                                <div className="text-sm text-cyan-300 font-semibold">
                                    Connected Business
                                </div>

                                <div className="mt-2 text-lg font-bold">
                                    {business?.business_name}
                                </div>

                                <div className="mt-2 text-sm text-zinc-400 break-all">
                                    {business?.webhook_slug
                                        ? `https://YOUR_PROJECT.functions.supabase.co/receipt-agent?slug=${business.webhook_slug}`
                                        : "Webhook slug not configured"}
                                </div>

                            </div>

                        </div>

                        {/* Footer */}

                        <div className="flex justify-end gap-4 border-t border-white/10 px-8 py-6">

                            <button
                                onClick={resetForm}
                                className="px-6 py-3 rounded-xl border border-white/10 hover:bg-white/5 transition"
                            >
                                Cancel
                            </button>

                            <button
                                disabled={saving}
                                onClick={selectedStore ? updateStore : createStore}
                                className="px-8 py-3 rounded-xl bg-white text-black font-semibold hover:scale-105 transition disabled:opacity-50"
                            >
                                {saving
                                    ? "Saving..."
                                    : selectedStore
                                        ? "Update Store"
                                        : "Connect Store"}
                            </button>

                        </div>

                    </div>

                </div>
            )}

        </div>
        </div >
    );
} 