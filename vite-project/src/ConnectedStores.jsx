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

    const [drawerOpen, setDrawerOpen] = useState(false);

    const [searchQuery, setSearchQuery] = useState("");

    const [providerFilter, setProviderFilter] = useState("all");

    const [statusFilter, setStatusFilter] = useState("all");

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
            setDrawerOpen(false);
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
            setDrawerOpen(false);
        }

        setSaving(false);

    };

    // ============================
    // Delete Store
    // ============================

    const deleteStore = async (id) => {
        if (!business) return;

        const confirmed = window.confirm(
            "Disconnect this store?\n\nThis will remove the integration from RuachAgent."
        );

        if (!confirmed) return;

        setError("");

        const { error } = await supabase
            .from("connected_stores")
            .delete()
            .eq("id", id)
            .eq("business_id", business.id);

        if (error) {
            setError(error.message);
            return;
        }

        await fetchStores(business.id);
    };

    // ============================
    // Toggle Status
    // ============================

    const toggleStatus = async (store) => {
        if (!business || !store) return;

        setError("");

        const nextStatus =
            store.status === "connected"
                ? "disconnected"
                : "connected";

        const { error } = await supabase
            .from("connected_stores")
            .update({
                status: nextStatus,
                last_sync_at: new Date().toISOString()
            })
            .eq("id", store.id)
            .eq("business_id", business.id);

        if (error) {
            setError(error.message);
            return;
        }

        await fetchStores(business.id);
    };

    // ============================
    // Begin Editing
    // ============================

    const editStore = (store) => {
        if (!store) return;

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

        setDrawerOpen(true);
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

    const closeDrawer = () => {
        setDrawerOpen(false);
        resetForm();
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

    const startIntegration = (provider) => {
        setSelectedStore(null);
        setForm({
            provider,
            store_name: "",
            store_identifier: "",
            webhook_url: "",
            webhook_secret: "",
            api_key_encrypted: "",
            access_token_encrypted: "",
            refresh_token_encrypted: "",
            status: "connected"
        });
        setDrawerOpen(true);
    };

    // Placed before the return just after useEffect.

    const filteredStores = stores.filter((store) => {
        const query = searchQuery.trim().toLowerCase();

        const matchesSearch =
            !query ||
            (store.store_name || "").toLowerCase().includes(query) ||
            (store.provider || "").toLowerCase().includes(query) ||
            (store.store_identifier || "").toLowerCase().includes(query);

        const matchesProvider =
            providerFilter === "all" ||
            store.provider === providerFilter;

        const matchesStatus =
            statusFilter === "all" ||
            store.status === statusFilter;

        return matchesSearch && matchesProvider && matchesStatus;
    });

    // ============================
    // Return JSX Below
    // ============================ 

    // ============================
    // Tesla SaaS Styles
    // ============================

    const styles = {
        page: {
            minHeight: "100vh",
            background: "#050608",
            color: "#ffffff",
            padding: "28px 32px 60px",
            fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
            boxSizing: "border-box"
        },

        shell: {
            maxWidth: "1500px",
            margin: "0 auto",
            width: "100%"
        },

        header: {
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "24px",
            paddingBottom: "26px",
            borderBottom: "1px solid rgba(255,255,255,0.07)"
        },

        headerLeft: {
            display: "flex",
            alignItems: "center",
            gap: "16px"
        },

        headerIcon: {
            width: "52px",
            height: "52px",
            borderRadius: "15px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "linear-gradient(145deg, #161b20, #090b0d)",
            border: "1px solid rgba(38,216,255,0.22)",
            boxShadow: "0 0 25px rgba(38,216,255,0.08)",
            color: "#26d8ff",
            fontSize: "22px",
            fontWeight: 800
        },

        eyebrow: {
            fontSize: "11px",
            fontWeight: 700,
            letterSpacing: "1.8px",
            textTransform: "uppercase",
            color: "#26d8ff",
            marginBottom: "5px"
        },

        title: {
            margin: 0,
            fontSize: "30px",
            lineHeight: 1.15,
            fontWeight: 750,
            letterSpacing: "-0.7px"
        },

        subtitle: {
            margin: "7px 0 0",
            color: "#7e8792",
            fontSize: "13px",
            lineHeight: 1.5
        },

        headerActions: {
            display: "flex",
            alignItems: "center",
            gap: "10px"
        },

        secondaryButton: {
            border: "1px solid rgba(255,255,255,0.10)",
            background: "rgba(255,255,255,0.035)",
            color: "#dce2e7",
            borderRadius: "11px",
            padding: "11px 16px",
            fontSize: "13px",
            fontWeight: 650,
            cursor: "pointer"
        },

        primaryButton: {
            border: "1px solid rgba(38,216,255,0.45)",
            background: "linear-gradient(135deg, #26d8ff, #1299b8)",
            color: "#020507",
            borderRadius: "11px",
            padding: "11px 18px",
            fontSize: "13px",
            fontWeight: 750,
            cursor: "pointer",
            boxShadow: "0 0 22px rgba(38,216,255,0.16)"
        },

        metrics: {
            display: "grid",
            gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
            gap: "14px",
            marginTop: "24px"
        },

        metricCard: {
            position: "relative",
            overflow: "hidden",
            background: "linear-gradient(145deg, rgba(18,22,27,0.98), rgba(9,11,14,0.98))",
            border: "1px solid rgba(255,255,255,0.075)",
            borderRadius: "17px",
            padding: "20px",
            minHeight: "126px",
            boxSizing: "border-box"
        },

        metricGlow: {
            position: "absolute",
            right: "-35px",
            top: "-35px",
            width: "100px",
            height: "100px",
            borderRadius: "50%",
            background: "rgba(38,216,255,0.07)",
            filter: "blur(30px)",
            pointerEvents: "none"
        },

        metricTop: {
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            position: "relative",
            zIndex: 1
        },

        metricLabel: {
            color: "#7f8994",
            fontSize: "12px",
            fontWeight: 600
        },

        metricIndicator: {
            width: "7px",
            height: "7px",
            borderRadius: "50%",
            background: "#26d8ff",
            boxShadow: "0 0 10px rgba(38,216,255,0.7)"
        },

        metricValue: {
            marginTop: "14px",
            fontSize: "29px",
            lineHeight: 1,
            fontWeight: 750,
            letterSpacing: "-0.7px",
            position: "relative",
            zIndex: 1
        },

        metricDescription: {
            marginTop: "10px",
            color: "#59636d",
            fontSize: "11px",
            position: "relative",
            zIndex: 1
        },

        content: {
            marginTop: "24px"
        },

        // Added underneath the other styles section
        controlPanel: {
            background: "linear-gradient(145deg, rgba(17,21,27,.98), rgba(8,10,13,.98))",
            border: "1px solid rgba(255,255,255,.075)",
            borderRadius: "18px",
            padding: "20px"
        },
        controlHeader: {
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "20px",
            marginBottom: "18px"
        },
        sectionTitle: {
            margin: 0,
            fontSize: "16px",
            fontWeight: 700,
            letterSpacing: "-.2px"
        },
        sectionDescription: {
            margin: "5px 0 0",
            color: "#69737e",
            fontSize: "12px"
        },
        controls: {
            display: "grid",
            gridTemplateColumns: "minmax(220px, 1fr) 180px 180px auto",
            gap: "10px",
            alignItems: "center"
        },
        searchWrapper: {
            position: "relative"
        },
        searchIcon: {
            position: "absolute",
            left: "14px",
            top: "50%",
            transform: "translateY(-50%)",
            color: "#59636d",
            fontSize: "15px",
            pointerEvents: "none"
        },
        input: {
            width: "100%",
            boxSizing: "border-box",
            background: "#07090b",
            border: "1px solid rgba(255,255,255,.09)",
            borderRadius: "11px",
            color: "#fff",
            padding: "12px 14px",
            fontSize: "13px",
            outline: "none"
        },
        searchInput: {
            paddingLeft: "40px"
        },
        select: {
            width: "100%",
            boxSizing: "border-box",
            background: "#07090b",
            border: "1px solid rgba(255,255,255,.09)",
            borderRadius: "11px",
            color: "#cbd2d8",
            padding: "12px 14px",
            fontSize: "13px",
            outline: "none",
            cursor: "pointer"
        },
        clearButton: {
            border: "1px solid rgba(255,255,255,.08)",
            background: "rgba(255,255,255,.035)",
            color: "#8b959f",
            borderRadius: "11px",
            padding: "11px 15px",
            fontSize: "12px",
            fontWeight: 650,
            cursor: "pointer",
            whiteSpace: "nowrap"
        },
        connectionStrip: {
            marginTop: "18px",
            paddingTop: "17px",
            borderTop: "1px solid rgba(255,255,255,.055)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "15px"
        },
        connectionInfo: {
            display: "flex",
            alignItems: "center",
            gap: "10px",
            minWidth: 0
        },
        connectionDot: {
            width: "8px",
            height: "8px",
            borderRadius: "50%",
            background: "#31dc7e",
            boxShadow: "0 0 10px rgba(49,220,126,.65)",
            flexShrink: 0
        },
        connectionText: {
            color: "#727d88",
            fontSize: "11px",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap"
        },
        connectionValue: {
            color: "#d6dce1",
            fontWeight: 650
        },

        // Added to the existing styles object.
        storesSection: {
            marginTop: "18px"
        },
        storesHeader: {
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "12px"
        },
        storesHeaderTitle: {
            fontSize: "14px",
            fontWeight: 700,
            color: "#dce2e7"
        },
        storesHeaderCount: {
            fontSize: "11px",
            color: "#59636d"
        },
        storeGrid: {
            display: "grid",
            gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
            gap: "14px"
        },
        storeCard: {
            position: "relative",
            overflow: "hidden",
            background: "linear-gradient(145deg, rgba(17,21,27,.98), rgba(8,10,13,.98))",
            border: "1px solid rgba(255,255,255,.075)",
            borderRadius: "17px",
            padding: "20px"
        },
        storeCardTop: {
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: "14px"
        },
        providerIcon: {
            width: "44px",
            height: "44px",
            borderRadius: "13px",
            background: "#0a0d10",
            border: "1px solid rgba(38,216,255,.16)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#26d8ff",
            fontSize: "14px",
            fontWeight: 800,
            flexShrink: 0
        },
        storeIdentity: {
            display: "flex",
            alignItems: "center",
            gap: "12px",
            minWidth: 0
        },
        providerName: {
            color: "#69737e",
            fontSize: "10px",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "1.2px",
            marginBottom: "4px"
        },
        storeName: {
            color: "#f3f5f7",
            fontSize: "15px",
            fontWeight: 700,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap"
        },
        statusBadge: {
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            padding: "6px 9px",
            borderRadius: "999px",
            fontSize: "10px",
            fontWeight: 700,
            flexShrink: 0
        },
        statusDot: {
            width: "6px",
            height: "6px",
            borderRadius: "50%"
        },
        storeDetails: {
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "10px",
            marginTop: "20px"
        },
        detailBox: {
            background: "rgba(255,255,255,.025)",
            border: "1px solid rgba(255,255,255,.045)",
            borderRadius: "10px",
            padding: "11px 12px",
            minWidth: 0
        },
        detailLabel: {
            color: "#59636d",
            fontSize: "9px",
            fontWeight: 700,
            letterSpacing: "1px",
            textTransform: "uppercase",
            marginBottom: "5px"
        },
        detailValue: {
            color: "#bfc7ce",
            fontSize: "11px",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap"
        },
        webhookRow: {
            marginTop: "10px",
            background: "rgba(38,216,255,.025)",
            border: "1px solid rgba(38,216,255,.07)",
            borderRadius: "10px",
            padding: "11px 12px"
        },
        storeFooter: {
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "12px",
            marginTop: "16px",
            paddingTop: "15px",
            borderTop: "1px solid rgba(255,255,255,.055)"
        },
        syncText: {
            color: "#59636d",
            fontSize: "10px"
        },
        actionGroup: {
            display: "flex",
            alignItems: "center",
            gap: "7px"
        },
        actionButton: {
            border: "1px solid rgba(255,255,255,.08)",
            background: "rgba(255,255,255,.035)",
            color: "#aeb7bf",
            borderRadius: "9px",
            padding: "8px 11px",
            fontSize: "10px",
            fontWeight: 650,
            cursor: "pointer"
        },
        dangerButton: {
            border: "1px solid rgba(255,82,82,.15)",
            background: "rgba(255,82,82,.035)",
            color: "#ff7777",
            borderRadius: "9px",
            padding: "8px 11px",
            fontSize: "10px",
            fontWeight: 650,
            cursor: "pointer"
        },
        emptyState: {
            background: "linear-gradient(145deg, rgba(17,21,27,.98), rgba(8,10,13,.98))",
            border: "1px dashed rgba(255,255,255,.10)",
            borderRadius: "17px",
            padding: "55px 25px",
            textAlign: "center"
        },
        emptyIcon: {
            width: "52px",
            height: "52px",
            margin: "0 auto 14px",
            borderRadius: "15px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(38,216,255,.05)",
            border: "1px solid rgba(38,216,255,.12)",
            color: "#26d8ff",
            fontSize: "20px"
        },
        emptyTitle: {
            color: "#dce2e7",
            fontSize: "15px",
            fontWeight: 700
        },
        emptyDescription: {
            maxWidth: "430px",
            margin: "7px auto 18px",
            color: "#626c76",
            fontSize: "12px",
            lineHeight: 1.6
        },

        // Added to the styles object.
        marketplaceSection: {
            marginTop: "28px"
        },
        marketplaceHeader: {
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            gap: "20px",
            marginBottom: "14px"
        },
        marketplaceTitle: {
            margin: 0,
            fontSize: "18px",
            fontWeight: 750,
            letterSpacing: "-.3px"
        },
        marketplaceDescription: {
            margin: "6px 0 0",
            color: "#68727d",
            fontSize: "12px",
            lineHeight: 1.5
        },
        marketplaceCount: {
            color: "#59636d",
            fontSize: "11px",
            whiteSpace: "nowrap"
        },
        integrationGrid: {
            display: "grid",
            gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
            gap: "12px"
        },
        integrationCard: {
            position: "relative",
            overflow: "hidden",
            background: "linear-gradient(145deg, rgba(16,20,25,.98), rgba(8,10,13,.98))",
            border: "1px solid rgba(255,255,255,.065)",
            borderRadius: "16px",
            padding: "18px",
            transition: "border-color .2s ease, transform .2s ease"
        },
        integrationTop: {
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "12px"
        },
        integrationIdentity: {
            display: "flex",
            alignItems: "center",
            gap: "11px",
            minWidth: 0
        },
        integrationIcon: {
            width: "42px",
            height: "42px",
            borderRadius: "12px",
            background: "#090c0f",
            border: "1px solid rgba(38,216,255,.12)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#26d8ff",
            fontSize: "12px",
            fontWeight: 800,
            flexShrink: 0
        },
        integrationName: {
            color: "#e3e7ea",
            fontSize: "13px",
            fontWeight: 700
        },
        integrationType: {
            color: "#59636d",
            fontSize: "10px",
            marginTop: "3px"
        },
        availableBadge: {
            color: "#68727d",
            border: "1px solid rgba(255,255,255,.07)",
            background: "rgba(255,255,255,.025)",
            borderRadius: "999px",
            padding: "5px 8px",
            fontSize: "9px",
            fontWeight: 700
        },
        integrationDescription: {
            color: "#68727d",
            fontSize: "11px",
            lineHeight: 1.55,
            margin: "14px 0 16px",
            minHeight: "34px"
        },
        integrationButton: {
            width: "100%",
            border: "1px solid rgba(38,216,255,.14)",
            background: "rgba(38,216,255,.035)",
            color: "#26d8ff",
            borderRadius: "9px",
            padding: "9px 12px",
            fontSize: "11px",
            fontWeight: 700,
            cursor: "pointer"
        },
        customIntegration: {
            border: "1px dashed rgba(38,216,255,.18)",
            background: "linear-gradient(145deg, rgba(13,24,29,.7), rgba(8,11,13,.98))"
        },

        drawerOverlay: {
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,.62)",
            backdropFilter: "blur(7px)",
            WebkitBackdropFilter: "blur(7px)",
            zIndex: 999,
            display: "flex",
            justifyContent: "flex-end"
        },
        drawer: {
            width: "min(480px, 92vw)",
            height: "100vh",
            background: "linear-gradient(160deg, #11151a 0%, #07090c 100%)",
            borderLeft: "1px solid rgba(38,216,255,.14)",
            boxShadow: "-20px 0 70px rgba(0,0,0,.55)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden"
        },
        drawerHeader: {
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: "15px",
            padding: "25px 25px 20px",
            borderBottom: "1px solid rgba(255,255,255,.07)"
        },
        drawerEyebrow: {
            color: "#26d8ff",
            fontSize: "9px",
            fontWeight: 750,
            letterSpacing: "1.5px",
            textTransform: "uppercase",
            marginBottom: "6px"
        },
        drawerTitle: {
            margin: 0,
            color: "#f2f5f7",
            fontSize: "20px",
            fontWeight: 750,
            letterSpacing: "-.4px"
        },
        drawerSubtitle: {
            margin: "6px 0 0",
            color: "#68727d",
            fontSize: "11px",
            lineHeight: 1.5
        },
        closeButton: {
            width: "34px",
            height: "34px",
            borderRadius: "10px",
            border: "1px solid rgba(255,255,255,.08)",
            background: "rgba(255,255,255,.035)",
            color: "#89939d",
            cursor: "pointer",
            fontSize: "17px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0
        },
        drawerBody: {
            flex: 1,
            overflowY: "auto",
            padding: "22px 25px"
        },
        formSection: {
            marginBottom: "22px"
        },
        formSectionTitle: {
            color: "#aeb7bf",
            fontSize: "10px",
            fontWeight: 750,
            letterSpacing: "1.1px",
            textTransform: "uppercase",
            marginBottom: "12px"
        },
        formGroup: {
            marginBottom: "13px"
        },
        formLabel: {
            display: "block",
            color: "#77818b",
            fontSize: "10px",
            fontWeight: 650,
            marginBottom: "6px"
        },
        formInput: {
            width: "100%",
            boxSizing: "border-box",
            background: "#06080a",
            border: "1px solid rgba(255,255,255,.09)",
            borderRadius: "10px",
            color: "#e5e9ec",
            padding: "11px 12px",
            fontSize: "12px",
            outline: "none"
        },
        formSelect: {
            width: "100%",
            boxSizing: "border-box",
            background: "#06080a",
            border: "1px solid rgba(255,255,255,.09)",
            borderRadius: "10px",
            color: "#e5e9ec",
            padding: "11px 12px",
            fontSize: "12px",
            outline: "none",
            cursor: "pointer"
        },
        formHint: {
            marginTop: "5px",
            color: "#4f5963",
            fontSize: "9px",
            lineHeight: 1.45
        },
        drawerFooter: {
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            gap: "9px",
            padding: "17px 25px",
            borderTop: "1px solid rgba(255,255,255,.07)",
            background: "rgba(5,7,9,.75)"
        },
        drawerCancel: {
            border: "1px solid rgba(255,255,255,.09)",
            background: "rgba(255,255,255,.035)",
            color: "#9ba4ad",
            borderRadius: "10px",
            padding: "10px 16px",
            fontSize: "11px",
            fontWeight: 650,
            cursor: "pointer"
        },
        drawerSave: {
            border: "1px solid rgba(38,216,255,.35)",
            background: "linear-gradient(135deg,#26d8ff,#1299b8)",
            color: "#020507",
            borderRadius: "10px",
            padding: "10px 18px",
            fontSize: "11px",
            fontWeight: 750,
            cursor: "pointer",
            boxShadow: "0 0 20px rgba(38,216,255,.12)"
        },
        providerPreview: {
            display: "flex",
            alignItems: "center",
            gap: "11px",
            padding: "13px",
            background: "rgba(38,216,255,.035)",
            border: "1px solid rgba(38,216,255,.09)",
            borderRadius: "12px",
            marginBottom: "20px"
        },
        providerPreviewIcon: {
            width: "38px",
            height: "38px",
            borderRadius: "10px",
            background: "#080b0e",
            border: "1px solid rgba(38,216,255,.14)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#26d8ff",
            fontSize: "11px",
            fontWeight: 800
        },
        providerPreviewName: {
            color: "#dce2e7",
            fontSize: "12px",
            fontWeight: 700
        },
        providerPreviewStatus: {
            color: "#5f6a74",
            fontSize: "9px",
            marginTop: "3px"
        },

        actionPanel: {
            marginTop: "16px",
            paddingTop: "15px",
            borderTop: "1px solid rgba(255,255,255,.055)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "12px"
        },
        actionInfo: {
            minWidth: 0
        },
        actionSync: {
            color: "#59636d",
            fontSize: "10px",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis"
        },
        actionButtons: {
            display: "flex",
            alignItems: "center",
            gap: "7px",
            flexShrink: 0
        },
        editAction: {
            border: "1px solid rgba(255,255,255,.09)",
            background: "rgba(255,255,255,.035)",
            color: "#c5ccd2",
            borderRadius: "9px",
            padding: "8px 12px",
            fontSize: "10px",
            fontWeight: 700,
            cursor: "pointer"
        },
        toggleAction: {
            border: "1px solid rgba(38,216,255,.13)",
            background: "rgba(38,216,255,.035)",
            color: "#26d8ff",
            borderRadius: "9px",
            padding: "8px 12px",
            fontSize: "10px",
            fontWeight: 700,
            cursor: "pointer"
        },
        deleteAction: {
            border: "1px solid rgba(255,82,82,.13)",
            background: "rgba(255,82,82,.035)",
            color: "#ff7777",
            borderRadius: "9px",
            padding: "8px 12px",
            fontSize: "10px",
            fontWeight: 700,
            cursor: "pointer"
        },
        disabledAction: {
            opacity: .45,
            cursor: "not-allowed"
        },

        skeletonGrid: {
            display: "grid",
            gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
            gap: "14px"
        },
        skeletonCard: {
            background: "linear-gradient(145deg, rgba(17,21,27,.98), rgba(8,10,13,.98))",
            border: "1px solid rgba(255,255,255,.055)",
            borderRadius: "17px",
            padding: "20px",
            minHeight: "190px",
            overflow: "hidden"
        },
        skeletonLine: {
            height: "10px",
            borderRadius: "6px",
            background: "rgba(255,255,255,.055)"
        },
        skeletonIcon: {
            width: "44px",
            height: "44px",
            borderRadius: "13px",
            background: "rgba(255,255,255,.045)"
        },
        skeletonRow: {
            display: "flex",
            alignItems: "center",
            gap: "12px"
        },
        errorBanner: {
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "15px",
            marginBottom: "18px",
            padding: "12px 15px",
            background: "rgba(255,75,75,.055)",
            border: "1px solid rgba(255,75,75,.15)",
            borderRadius: "11px"
        },
        errorContent: {
            display: "flex",
            alignItems: "center",
            gap: "10px",
            minWidth: 0
        },
        errorIcon: {
            width: "24px",
            height: "24px",
            borderRadius: "7px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(255,75,75,.09)",
            color: "#ff7777",
            fontSize: "11px",
            fontWeight: 800,
            flexShrink: 0
        },
        errorText: {
            color: "#ff9a9a",
            fontSize: "11px",
            lineHeight: 1.45
        },
        dismissError: {
            border: "none",
            background: "transparent",
            color: "#8f5d5d",
            fontSize: "16px",
            cursor: "pointer",
            padding: "3px 6px",
            flexShrink: 0
        },
        premiumEmptyState: {
            position: "relative",
            overflow: "hidden",
            textAlign: "center",
            padding: "65px 30px",
            borderRadius: "19px",
            background: "radial-gradient(circle at 50% 0%, rgba(38,216,255,.075), transparent 42%), linear-gradient(145deg, rgba(17,21,27,.99), rgba(7,9,12,.99))",
            border: "1px solid rgba(38,216,255,.09)",
            boxShadow: "inset 0 1px rgba(255,255,255,.025)"
        },
        emptyGlow: {
            position: "absolute",
            width: "180px",
            height: "180px",
            borderRadius: "50%",
            background: "rgba(38,216,255,.045)",
            filter: "blur(50px)",
            top: "-100px",
            left: "50%",
            transform: "translateX(-50%)",
            pointerEvents: "none"
        },
        emptyOrb: {
            position: "relative",
            width: "64px",
            height: "64px",
            margin: "0 auto 18px",
            borderRadius: "18px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "linear-gradient(145deg, #10171b, #070a0d)",
            border: "1px solid rgba(38,216,255,.18)",
            color: "#26d8ff",
            fontSize: "24px",
            boxShadow: "0 0 35px rgba(38,216,255,.07)"
        },
        emptyHeading: {
            margin: 0,
            color: "#edf1f4",
            fontSize: "18px",
            fontWeight: 750,
            letterSpacing: "-.3px"
        },
        emptyText: {
            maxWidth: "470px",
            margin: "9px auto 22px",
            color: "#626d77",
            fontSize: "12px",
            lineHeight: 1.65
        },
        emptyFeatures: {
            display: "flex",
            justifyContent: "center",
            flexWrap: "wrap",
            gap: "7px",
            marginBottom: "24px"
        },
        emptyFeature: {
            padding: "6px 9px",
            borderRadius: "999px",
            background: "rgba(255,255,255,.025)",
            border: "1px solid rgba(255,255,255,.055)",
            color: "#737e88",
            fontSize: "9px",
            fontWeight: 650
        },
        primaryButton: {
            border: "1px solid rgba(38,216,255,.32)",
            background: "linear-gradient(135deg, #26d8ff, #119ab9)",
            color: "#020608",
            borderRadius: "10px",
            padding: "11px 18px",
            fontSize: "11px",
            fontWeight: 800,
            cursor: "pointer",
            boxShadow: "0 0 25px rgba(38,216,255,.10)"
        }
    };
    // ============================
    // Main Page
    // ============================

    return (
        <div style={styles.page}>
            <div style={styles.shell}>

                {/* ========================================= */}
                {/* Page Header */}
                {/* ========================================= */}

                <header style={styles.header}>
                    <div style={styles.headerLeft}>

                        <div style={styles.headerIcon}>
                            ⇄
                        </div>

                        <div>
                            <div style={styles.eyebrow}>
                                RuachAgent / Integrations
                            </div>

                            <h1 style={styles.title}>
                                Connected Stores
                            </h1>

                            <p style={styles.subtitle}>
                                Connect and manage the stores and POS systems that
                                power your RuachAgent receipt automation.
                            </p>
                        </div>

                    </div>

                    <div style={styles.headerActions}>

                        <button
                            type="button"
                            style={styles.secondaryButton}
                            onClick={() => business && fetchStores(business.id)}
                            disabled={loading}
                        >
                            {loading ? "Syncing..." : "↻ Refresh"}
                        </button>

                        <button
                            type="button"
                            style={styles.primaryButton}
                            onClick={resetForm}
                        >
                            + Connect Store
                        </button>

                    </div>
                </header>

                {/* ========================================= */}
                {/* KPI Metrics */}
                {/* ========================================= */}

                <section style={styles.metrics}>

                    <div style={styles.metricCard}>
                        <div style={styles.metricGlow} />

                        <div style={styles.metricTop}>
                            <span style={styles.metricLabel}>
                                CONNECTED STORES
                            </span>
                            <span style={styles.metricIndicator} />
                        </div>

                        <div style={styles.metricValue}>
                            {stores.length}
                        </div>

                        <div style={styles.metricDescription}>
                            Total store integrations
                        </div>
                    </div>

                    <div style={styles.metricCard}>
                        <div
                            style={{
                                ...styles.metricGlow,
                                background: "rgba(49,220,126,0.07)"
                            }}
                        />

                        <div style={styles.metricTop}>
                            <span style={styles.metricLabel}>
                                ACTIVE
                            </span>

                            <span
                                style={{
                                    ...styles.metricIndicator,
                                    background: "#31dc7e",
                                    boxShadow: "0 0 10px rgba(49,220,126,0.7)"
                                }}
                            />
                        </div>

                        <div style={styles.metricValue}>
                            {
                                stores.filter(
                                    store => store.status === "connected"
                                ).length
                            }
                        </div>

                        <div style={styles.metricDescription}>
                            Currently receiving transactions
                        </div>
                    </div>

                    <div style={styles.metricCard}>
                        <div
                            style={{
                                ...styles.metricGlow,
                                background: "rgba(255,166,61,0.07)"
                            }}
                        />

                        <div style={styles.metricTop}>
                            <span style={styles.metricLabel}>
                                ATTENTION
                            </span>

                            <span
                                style={{
                                    ...styles.metricIndicator,
                                    background: "#ffa63d",
                                    boxShadow: "0 0 10px rgba(255,166,61,0.65)"
                                }}
                            />
                        </div>

                        <div style={styles.metricValue}>
                            {
                                stores.filter(
                                    store => store.status !== "connected"
                                ).length
                            }
                        </div>

                        <div style={styles.metricDescription}>
                            Stores requiring attention
                        </div>
                    </div>

                    <div style={styles.metricCard}>
                        <div
                            style={{
                                ...styles.metricGlow,
                                background: "rgba(151,103,255,0.07)"
                            }}
                        />

                        <div style={styles.metricTop}>
                            <span style={styles.metricLabel}>
                                BUSINESS
                            </span>

                            <span
                                style={{
                                    ...styles.metricIndicator,
                                    background: "#9b72ff",
                                    boxShadow: "0 0 10px rgba(155,114,255,0.65)"
                                }}
                            />
                        </div>

                        <div
                            style={{
                                ...styles.metricValue,
                                fontSize: "20px",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap"
                            }}
                            title={business?.business_name || ""}
                        >
                            {business?.business_name || "Loading..."}
                        </div>

                        <div style={styles.metricDescription}>
                            Connected merchant account
                        </div>
                    </div>

                </section>

                {/* ========================================= */}
                {/* Content continues in Part 2 */}
                {/* ========================================= */}

                <main style={styles.content}>
                    {/* ========================================= */}
                    {/* Store Control Center */}
                    {/* ========================================= */}
                    {error && (
                        <div style={styles.errorBanner}>
                            <div style={styles.errorContent}>
                                <div style={styles.errorIcon}>
                                    !
                                </div>

                                <div style={styles.errorText}>
                                    {error}
                                </div>
                            </div>

                            <button
                                type="button"
                                style={styles.dismissError}
                                onClick={() => setError("")}
                                aria-label="Dismiss error"
                            >
                                ×
                            </button>
                        </div>
                    )}

                    <section style={styles.controlPanel}>
                        <div style={styles.controlHeader}>
                            <div>
                                <h2 style={styles.sectionTitle}>
                                    Store Infrastructure
                                </h2>
                                <p style={styles.sectionDescription}>
                                    Search, filter and manage your merchant integrations.
                                </p>
                            </div>
                            <div style={{ color: "#59636d", fontSize: "12px" }}>
                                {stores.length} integration{stores.length === 1 ? "" : "s"}
                            </div>
                        </div>

                        <div style={styles.controls}>
                            <div style={styles.searchWrapper}>
                                <span style={styles.searchIcon}>⌕</span>
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search stores, providers or identifiers..."
                                    style={{ ...styles.input, ...styles.searchInput }}
                                />
                            </div>

                            <select
                                value={providerFilter}
                                onChange={(e) => setProviderFilter(e.target.value)}
                                style={styles.select}
                            >
                                <option value="all">All Providers</option>
                                <option value="Shopify">Shopify</option>
                                <option value="WooCommerce">WooCommerce</option>
                                <option value="Square">Square</option>
                                <option value="Clover">Clover</option>
                                <option value="Lightspeed">Lightspeed</option>
                                <option value="Custom POS">Custom POS</option>
                            </select>

                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                style={styles.select}
                            >
                                <option value="all">All Statuses</option>
                                <option value="connected">Connected</option>
                                <option value="disconnected">Disconnected</option>
                            </select>

                            <button
                                type="button"
                                style={styles.clearButton}
                                onClick={() => {
                                    setSearchQuery("");
                                    setProviderFilter("all");
                                    setStatusFilter("all");
                                }}
                            >
                                Clear Filters
                            </button>
                        </div>

                        <div style={styles.connectionStrip}>
                            <div style={styles.connectionInfo}>
                                <span style={styles.connectionDot} />
                                <span style={styles.connectionText}>
                                    Business connection:
                                    {" "}
                                    <span style={styles.connectionValue}>
                                        {business?.business_name || "Loading business..."}
                                    </span>
                                </span>
                            </div>

                            <div style={styles.connectionText}>
                                Webhook:
                                {" "}
                                <span style={styles.connectionValue}>
                                    {business?.webhook_slug
                                        ? "Configured"
                                        : "Not configured"}
                                </span>
                            </div>
                        </div>
                    </section>

                    {/* ========================================= */}
                    {/* Connected Store Nodes */}
                    {/* ========================================= */}

                    <section style={styles.storesSection}>
                        <div style={styles.storesHeader}>
                            <div style={styles.storesHeaderTitle}>
                                Connected Integrations
                            </div>
                            <div style={styles.storesHeaderCount}>
                                {filteredStores.length} shown
                            </div>
                        </div>

                        {loading ? (
                            <div style={styles.skeletonGrid}>
                                {[1, 2, 3, 4].map((item) => (
                                    <div key={item} style={styles.skeletonCard}>
                                        <div style={styles.skeletonRow}>
                                            <div style={styles.skeletonIcon} />
                                            <div style={{ flex: 1 }}>
                                                <div style={{
                                                    ...styles.skeletonLine,
                                                    width: "65%",
                                                    marginBottom: "8px"
                                                }} />
                                                <div style={{
                                                    ...styles.skeletonLine,
                                                    width: "42%",
                                                    height: "7px"
                                                }} />
                                            </div>
                                        </div>

                                        <div style={{
                                            ...styles.skeletonLine,
                                            width: "85%",
                                            marginTop: "25px"
                                        }} />

                                        <div style={{
                                            ...styles.skeletonLine,
                                            width: "55%",
                                            marginTop: "9px"
                                        }} />

                                        <div style={{
                                            ...styles.skeletonLine,
                                            width: "100%",
                                            height: "38px",
                                            marginTop: "18px",
                                            borderRadius: "10px"
                                        }} />

                                        <div style={{
                                            ...styles.skeletonLine,
                                            width: "45%",
                                            height: "7px",
                                            marginTop: "16px"
                                        }} />
                                    </div>
                                ))}
                            </div>
                        ) : filteredStores.length === 0 ? (
                            <div style={styles.premiumEmptyState}>
                                <div style={styles.emptyGlow} />

                                <div style={styles.emptyOrb}>
                                    ⇄
                                </div>

                                <h3 style={styles.emptyHeading}>
                                    {stores.length === 0
                                        ? "Your store network is ready"
                                        : "No integrations match your filters"}
                                </h3>

                                <p style={styles.emptyText}>
                                    {stores.length === 0
                                        ? "Connect your online store or point-of-sale system to RuachAgent and begin routing transaction data into your digital till slip workflow."
                                        : "We couldn't find a connected store matching your current search and filter settings. Adjust your filters or clear them to see your integrations."}
                                </p>

                                {stores.length === 0 ? (
                                    <>
                                        <div style={styles.emptyFeatures}>
                                            <span style={styles.emptyFeature}>
                                                WEBHOOK READY
                                            </span>
                                            <span style={styles.emptyFeature}>
                                                POS COMPATIBLE
                                            </span>
                                            <span style={styles.emptyFeature}>
                                                REAL-TIME SYNC
                                            </span>
                                            <span style={styles.emptyFeature}>
                                                DIGITAL RECEIPTS
                                            </span>
                                        </div>

                                        <button
                                            type="button"
                                            style={styles.primaryButton}
                                            onClick={() => startIntegration("Custom POS")}
                                        >
                                            + Connect Your First Store
                                        </button>
                                    </>
                                ) : (
                                    <button
                                        type="button"
                                        style={styles.primaryButton}
                                        onClick={() => {
                                            setSearchQuery("");
                                            setProviderFilter("all");
                                            setStatusFilter("all");
                                        }}
                                    >
                                        Clear Filters
                                    </button>
                                )}
                            </div>

                        ) : (
                            <div style={styles.storeGrid}>
                                {filteredStores.map((store) => {
                                    const isConnected =
                                        store.status === "connected";

                                    const providerInitials =
                                        (store.provider || "POS")
                                            .slice(0, 3)
                                            .toUpperCase();

                                    const lastSync = store.last_sync_at
                                        ? new Date(
                                            store.last_sync_at
                                        ).toLocaleString([], {
                                            dateStyle: "medium",
                                            timeStyle: "short"
                                        })
                                        : "Never synchronized";

                                    return (
                                        <article
                                            key={store.id}
                                            style={styles.storeCard}
                                        >
                                            {/* Store Header */}
                                            <div style={styles.storeCardTop}>
                                                <div style={styles.storeIdentity}>
                                                    <div style={styles.providerIcon}>
                                                        {providerInitials}
                                                    </div>

                                                    <div style={{ minWidth: 0 }}>
                                                        <div style={styles.providerName}>
                                                            {store.provider || "Custom POS"}
                                                        </div>

                                                        <div style={styles.storeName}>
                                                            {store.store_name}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div
                                                    style={{
                                                        ...styles.statusBadge,
                                                        background: isConnected
                                                            ? "rgba(49,220,126,.07)"
                                                            : "rgba(255,82,82,.07)",
                                                        border: isConnected
                                                            ? "1px solid rgba(49,220,126,.14)"
                                                            : "1px solid rgba(255,82,82,.14)",
                                                        color: isConnected
                                                            ? "#55e493"
                                                            : "#ff7777"
                                                    }}
                                                >
                                                    <span
                                                        style={{
                                                            ...styles.statusDot,
                                                            background: isConnected
                                                                ? "#31dc7e"
                                                                : "#ff5555",
                                                            boxShadow: isConnected
                                                                ? "0 0 8px rgba(49,220,126,.7)"
                                                                : "0 0 8px rgba(255,82,82,.6)"
                                                        }}
                                                    />
                                                    {isConnected
                                                        ? "Connected"
                                                        : "Disconnected"}
                                                </div>
                                            </div>

                                            {/* Store Details */}
                                            <div style={styles.storeDetails}>
                                                <div style={styles.detailBox}>
                                                    <div style={styles.detailLabel}>
                                                        Store Identifier
                                                    </div>
                                                    <div style={styles.detailValue}>
                                                        {store.store_identifier ||
                                                            "Not specified"}
                                                    </div>
                                                </div>

                                                <div style={styles.detailBox}>
                                                    <div style={styles.detailLabel}>
                                                        Integration Status
                                                    </div>
                                                    <div style={styles.detailValue}>
                                                        {isConnected
                                                            ? "Receiving transactions"
                                                            : "Connection paused"}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Webhook */}
                                            <div style={styles.webhookRow}>
                                                <div style={styles.detailLabel}>
                                                    Webhook Endpoint
                                                </div>

                                                <div
                                                    style={{
                                                        ...styles.detailValue,
                                                        color: store.webhook_url
                                                            ? "#26d8ff"
                                                            : "#59636d"
                                                    }}
                                                    title={store.webhook_url || ""}
                                                >
                                                    {store.webhook_url ||
                                                        "No webhook endpoint configured"}
                                                </div>
                                            </div>

                                            {/* ========================================= */}
                                            {/* Store Actions */}
                                            {/* ========================================= */}

                                            <div style={styles.actionPanel}>
                                                <div style={styles.actionInfo}>
                                                    <div style={styles.actionSync}>
                                                        Last sync: {lastSync}
                                                    </div>
                                                </div>

                                                <div style={styles.actionButtons}>
                                                    {/* EDIT */}
                                                    <button
                                                        type="button"
                                                        style={styles.editAction}
                                                        onClick={() => editStore(store)}
                                                    >
                                                        Edit
                                                    </button>

                                                    {/* ENABLE / DISABLE */}
                                                    <button
                                                        type="button"
                                                        style={styles.toggleAction}
                                                        onClick={() => toggleStatus(store)}
                                                    >
                                                        {isConnected ? "Disable" : "Enable"}
                                                    </button>

                                                    {/* DELETE */}
                                                    <button
                                                        type="button"
                                                        style={styles.deleteAction}
                                                        onClick={() => deleteStore(store.id)}
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </div>
                                        </article>
                                    );
                                })}
                            </div>
                        )}
                    </section>

                    {/* ========================================= */}
                    {/* Integration Marketplace */}
                    {/* ========================================= */}

                    <section style={styles.marketplaceSection}>
                        <div style={styles.marketplaceHeader}>
                            <div>
                                <h2 style={styles.marketplaceTitle}>
                                    Integration Marketplace
                                </h2>
                                <p style={styles.marketplaceDescription}>
                                    Connect RuachAgent to the platforms your business
                                    already uses.
                                </p>
                            </div>

                            <div style={styles.marketplaceCount}>
                                More integrations coming soon
                            </div>
                        </div>

                        <div style={styles.integrationGrid}>
                            {[
                                {
                                    name: "Shopify",
                                    code: "S",
                                    type: "E-commerce",
                                    description: "Receive Shopify orders and automatically process customer receipt transactions."
                                },
                                {
                                    name: "WooCommerce",
                                    code: "W",
                                    type: "E-commerce",
                                    description: "Connect your WooCommerce store and route completed orders into RuachAgent."
                                },
                                {
                                    name: "Square",
                                    code: "SQ",
                                    type: "POS",
                                    description: "Connect Square transaction events for automated digital till slip delivery."
                                },
                                {
                                    name: "Clover",
                                    code: "C",
                                    type: "POS",
                                    description: "Bring Clover-powered point-of-sale transactions into your RuachAgent workflow."
                                },
                                {
                                    name: "Lightspeed",
                                    code: "L",
                                    type: "POS & Retail",
                                    description: "Connect your Lightspeed environment for centralized transaction processing."
                                },
                                {
                                    name: "Custom POS",
                                    code: "↯",
                                    type: "Webhook",
                                    description: "Connect almost any POS or online store capable of sending webhook events.",
                                    custom: true
                                }
                            ].map((integration) => (
                                <div
                                    key={integration.name}
                                    style={{
                                        ...styles.integrationCard,
                                        ...(integration.custom
                                            ? styles.customIntegration
                                            : {})
                                    }}
                                >
                                    <div style={styles.integrationTop}>
                                        <div style={styles.integrationIdentity}>
                                            <div style={styles.integrationIcon}>
                                                {integration.code}
                                            </div>

                                            <div>
                                                <div style={styles.integrationName}>
                                                    {integration.name}
                                                </div>
                                                <div style={styles.integrationType}>
                                                    {integration.type}
                                                </div>
                                            </div>
                                        </div>

                                        <span style={styles.availableBadge}>
                                            AVAILABLE
                                        </span>
                                    </div>

                                    <div style={styles.integrationDescription}>
                                        {integration.description}
                                    </div>

                                    <button
                                        type="button"
                                        style={styles.integrationButton}
                                        onClick={() => startIntegration(integration.name)}
                                    >
                                        Connect
                                    </button>
                                </div>
                            ))}

                        </div>
                    </section>

                    {/* ========================================= */}
                    {/* Store Configuration Drawer */}
                    {/* ========================================= */}

                    {drawerOpen && (
                        <div
                            style={styles.drawerOverlay}
                            onMouseDown={(e) => {
                                if (e.target === e.currentTarget) {
                                    closeDrawer();
                                }
                            }}
                        >
                            <aside style={styles.drawer}>
                                {/* Drawer Header */}
                                <div style={styles.drawerHeader}>
                                    <div>
                                        <div style={styles.drawerEyebrow}>
                                            {selectedStore
                                                ? "Integration Management"
                                                : "New Integration"}
                                        </div>

                                        <h2 style={styles.drawerTitle}>
                                            {selectedStore
                                                ? "Manage Store"
                                                : "Connect Store"}
                                        </h2>

                                        <p style={styles.drawerSubtitle}>
                                            Configure how this store communicates
                                            with RuachAgent.
                                        </p>
                                    </div>

                                    <button
                                        type="button"
                                        style={styles.closeButton}
                                        onClick={closeDrawer}
                                        aria-label="Close drawer"
                                    >
                                        ×
                                    </button>
                                </div>

                                {/* Drawer Body */}
                                <div style={styles.drawerBody}>

                                    {/* Provider Preview */}
                                    <div style={styles.providerPreview}>
                                        <div style={styles.providerPreviewIcon}>
                                            {(form.provider || "POS")
                                                .slice(0, 3)
                                                .toUpperCase()}
                                        </div>

                                        <div>
                                            <div style={styles.providerPreviewName}>
                                                {form.provider || "Select provider"}
                                            </div>

                                            <div style={styles.providerPreviewStatus}>
                                                RuachAgent store integration
                                            </div>
                                        </div>
                                    </div>

                                    {/* Basic Configuration */}
                                    <section style={styles.formSection}>
                                        <div style={styles.formSectionTitle}>
                                            Store Configuration
                                        </div>

                                        <div style={styles.formGroup}>
                                            <label style={styles.formLabel}>
                                                Provider
                                            </label>

                                            <select
                                                name="provider"
                                                value={form.provider}
                                                onChange={handleInput}
                                                style={styles.formSelect}
                                            >
                                                <option value="">
                                                    Select provider
                                                </option>
                                                <option value="Shopify">
                                                    Shopify
                                                </option>
                                                <option value="WooCommerce">
                                                    WooCommerce
                                                </option>
                                                <option value="Square">
                                                    Square
                                                </option>
                                                <option value="Clover">
                                                    Clover
                                                </option>
                                                <option value="Lightspeed">
                                                    Lightspeed
                                                </option>
                                                <option value="Custom POS">
                                                    Custom POS
                                                </option>
                                            </select>
                                        </div>

                                        <div style={styles.formGroup}>
                                            <label style={styles.formLabel}>
                                                Store Name
                                            </label>

                                            <input
                                                type="text"
                                                name="store_name"
                                                value={form.store_name}
                                                onChange={handleInput}
                                                placeholder="e.g. Johannesburg Store"
                                                style={styles.formInput}
                                            />
                                        </div>

                                        <div style={styles.formGroup}>
                                            <label style={styles.formLabel}>
                                                Store Identifier
                                            </label>

                                            <input
                                                type="text"
                                                name="store_identifier"
                                                value={form.store_identifier}
                                                onChange={handleInput}
                                                placeholder="Store ID, domain or POS identifier"
                                                style={styles.formInput}
                                            />

                                            <div style={styles.formHint}>
                                                Used to identify this integration
                                                when multiple stores are connected.
                                            </div>
                                        </div>
                                    </section>

                                    {/* Webhook Configuration */}
                                    <section style={styles.formSection}>
                                        <div style={styles.formSectionTitle}>
                                            Webhook Configuration
                                        </div>

                                        <div style={styles.formGroup}>
                                            <label style={styles.formLabel}>
                                                Webhook URL
                                            </label>

                                            <input
                                                type="url"
                                                name="webhook_url"
                                                value={form.webhook_url}
                                                onChange={handleInput}
                                                placeholder="https://..."
                                                style={styles.formInput}
                                            />

                                            <div style={styles.formHint}>
                                                Endpoint used to receive transaction
                                                events from the connected store.
                                            </div>
                                        </div>

                                        <div style={styles.formGroup}>
                                            <label style={styles.formLabel}>
                                                Webhook Secret
                                            </label>

                                            <input
                                                type="password"
                                                name="webhook_secret"
                                                value={form.webhook_secret}
                                                onChange={handleInput}
                                                placeholder="Enter webhook signing secret"
                                                style={styles.formInput}
                                            />
                                        </div>
                                    </section>

                                    {/* Authentication */}
                                    <section style={styles.formSection}>
                                        <div style={styles.formSectionTitle}>
                                            Authentication
                                        </div>

                                        <div style={styles.formGroup}>
                                            <label style={styles.formLabel}>
                                                API Key
                                            </label>

                                            <input
                                                type="password"
                                                name="api_key_encrypted"
                                                value={form.api_key_encrypted}
                                                onChange={handleInput}
                                                placeholder="API key"
                                                style={styles.formInput}
                                            />
                                        </div>

                                        <div style={styles.formGroup}>
                                            <label style={styles.formLabel}>
                                                Access Token
                                            </label>

                                            <input
                                                type="password"
                                                name="access_token_encrypted"
                                                value={form.access_token_encrypted}
                                                onChange={handleInput}
                                                placeholder="Access token"
                                                style={styles.formInput}
                                            />
                                        </div>

                                        <div style={styles.formGroup}>
                                            <label style={styles.formLabel}>
                                                Refresh Token
                                            </label>

                                            <input
                                                type="password"
                                                name="refresh_token_encrypted"
                                                value={form.refresh_token_encrypted}
                                                onChange={handleInput}
                                                placeholder="Refresh token"
                                                style={styles.formInput}
                                            />
                                        </div>
                                    </section>

                                    {/* Status */}
                                    <section style={styles.formSection}>
                                        <div style={styles.formSectionTitle}>
                                            Connection Status
                                        </div>

                                        <div style={styles.formGroup}>
                                            <label style={styles.formLabel}>
                                                Status
                                            </label>

                                            <select
                                                name="status"
                                                value={form.status}
                                                onChange={handleInput}
                                                style={styles.formSelect}
                                            >
                                                <option value="connected">
                                                    Connected
                                                </option>
                                                <option value="disconnected">
                                                    Disconnected
                                                </option>
                                            </select>
                                        </div>
                                    </section>
                                </div>

                                {/* Drawer Footer */}
                                <div style={styles.drawerFooter}>
                                    <button
                                        type="button"
                                        style={styles.drawerCancel}
                                        onClick={closeDrawer}
                                        disabled={saving}
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        type="button"
                                        style={styles.drawerSave}
                                        disabled={
                                            saving ||
                                            !form.provider ||
                                            !form.store_name
                                        }
                                        onClick={async () => {
                                            if (selectedStore) {
                                                await updateStore();
                                            } else {
                                                await createStore();
                                            }
                                            setDrawerOpen(false);
                                        }}
                                    >
                                        {saving
                                            ? "Saving..."
                                            : selectedStore
                                                ? "Save Changes"
                                                : "Connect Store"}
                                    </button>
                                </div>
                            </aside>
                        </div>
                    )}
                </main>
            </div>
        </div >
    );
}
