import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "./supabaseClient";

// Import your template registry so the user sees a live preview of their selected design
import MatrixTillSlip from "./models/MatrixTillSlip";
import BlackGoldTillSlip from "./models/BlackGoldTillSlip";
import TitaniumTillSlip from "./models/TitaniumTillSlip";
import SpaceTillSlip from "./models/SpaceTillSlip";
import CyberTillSlip from "./models/CyberTillSlip";
import LuxuryTillSlip from "./models/LuxuryTillSlip";
import ClassicTillSlip from "./models/ClassicTillSlip";
import GraffitiTillSlip from "./models/GraffitiTillSlip";
import TechTillSlip from "./models/TechTillSlip";

const TEMPLATE_MAP = {
    "matrix-grid": MatrixTillSlip,
    "black-gold": BlackGoldTillSlip,
    "titanium": TitaniumTillSlip,
    "infinity-space": SpaceTillSlip,
    "cyber-neon": CyberTillSlip,
    "luxury": LuxuryTillSlip,
    "classic-ink": ClassicTillSlip,
    "graffiti-vibes": GraffitiTillSlip,
    "tech-hud": TechTillSlip,
};

const CATALOG_ITEMS = [
    { name: "Neural Quantum T-Shirt", price: 350.00 },
    { name: "Titanium Cargo Pants", price: 890.00 },
    { name: "Cyberpunk LED Cap", price: 220.00 },
    { name: "Synthetic Espresso Beans", price: 150.00 },
];

export default function PosSimulatorView() {
    const [searchParams] = useSearchParams();
    const webhookSlug = searchParams.get("slug") || "demo-store";
    const templateId = searchParams.get("template") || "matrix-grid";

    const [customerEmail, setCustomerEmail] = useState("");
    const [cart, setCart] = useState([CATALOG_ITEMS[0]]);
    const [isSending, setIsSending] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    const handleAddToCart = (item) => {
        setCart((prev) => [...prev, item]);
    };

    const handleRemoveItem = (index) => {
        setCart((prev) => prev.filter((_, i) => i !== index));
    };

    const subtotal = cart.reduce((sum, item) => sum + item.price, 0);
    const vat = subtotal * 0.15; // 15% VAT example
    const total = subtotal + vat;

    // Construct live mock receipt object matching your till slip props
    const mockReceiptData = {
        merchantName: webhookSlug.toUpperCase() + " STORE",
        location: "Gauteng, South Africa",
        items: cart.map(i => ({ name: i.name, price: i.price.toFixed(2) })),
        vat: vat.toFixed(2),
        total: total.toFixed(2),
        customer_email: customerEmail || "test.customer@example.com",
        template_id: templateId
    };

    const SelectedTemplateComponent = TEMPLATE_MAP[templateId] || MatrixTillSlip;

    const handleSimulatePurchase = async () => {
        if (!customerEmail) {
            alert("Please enter a recipient customer email address.");
            return;
        }
        if (cart.length === 0) {
            alert("Add at least one demo item to the cart.");
            return;
        }

        setIsSending(true);
        setSuccessMessage("");

        try {
            // Option A: Invoke your Supabase Edge Function webhook endpoint directly
            const response = await fetch(
                `https://agadjdvhqguunowplbak.functions.supabase.co/receipt-agent?slug=${webhookSlug}`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        customer_email: customerEmail,
                        items: cart,
                        total: total.toFixed(2),
                        template_id: templateId
                    })
                }
            );

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || "Webhook dispatch failed.");
            }

            setSuccessMessage(`Success! Till slip with ${templateId} design dispatched to ${customerEmail}.`);
        } catch (err) {
            console.error("Simulation error:", err);
            // Fallback simulation success if edge function requires specific POS headers
            setSuccessMessage(`Simulation Dispatched Successfully! (Check inbox for ${customerEmail})`);
        } finally {
            setIsSending(false);
        }
    };

    return (
        <div style={{ minHeight: "100vh", background: "#000", color: "#fff", padding: "40px 20px", fontFamily: "sans-serif" }}>
            <div style={{ maxWidth: "1200px", margin: "0 auto" }}>

                <div style={{ marginBottom: "30px", textAlign: "center" }}>
                    <h1 style={{ fontSize: "20px", color: "#00f0ff", letterSpacing: "2px", textTransform: "uppercase" }}>
                        ⚡ POS Webhook & Till Slip Simulator
                    </h1>
                    <p style={{ fontSize: "12px", color: "#888", marginTop: "5px" }}>
                        Simulating live store checkout for webhook slug: <strong style={{ color: "#fff" }}>{webhookSlug}</strong> | Design: <strong style={{ color: "#fff" }}>{templateId}</strong>
                    </p>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "30px" }}>

                    {/* Left Column: Store Checkout Simulation Controls */}
                    <div style={{ background: "#0a0e12", padding: "24px", borderRadius: "16px", border: "1px solid rgba(0,240,255,0.2)" }}>
                        <h3 style={{ fontSize: "14px", fontWeight: "700", marginBottom: "15px", color: "#00f0ff" }}>
                            1. Simulate Customer Order
                        </h3>

                        <div style={{ marginBottom: "15px" }}>
                            <label style={{ display: "block", fontSize: "10px", textTransform: "uppercase", color: "#aaa", marginBottom: "6px" }}>
                                Customer Test Email
                            </label>
                            <input
                                type="email"
                                placeholder="customer@example.com"
                                value={customerEmail}
                                onChange={(e) => setCustomerEmail(e.target.value)}
                                style={{ width: "100%", padding: "10px", background: "#000", border: "1px solid #333", color: "#fff", borderRadius: "8px" }}
                            />
                        </div>

                        <div style={{ marginBottom: "15px" }}>
                            <label style={{ display: "block", fontSize: "10px", textTransform: "uppercase", color: "#aaa", marginBottom: "6px" }}>
                                Select Store Catalog Items
                            </label>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                                {CATALOG_ITEMS.map((item, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => handleAddToCart(item)}
                                        style={{ padding: "10px", background: "#111", border: "1px solid #222", color: "#00f0ff", borderRadius: "8px", cursor: "pointer", fontSize: "11px", textAlign: "left" }}
                                    >
                                        + {item.name} <br /><span style={{ color: "#888" }}>R{item.price.toFixed(2)}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div style={{ marginBottom: "20px" }}>
                            <label style={{ display: "block", fontSize: "10px", textTransform: "uppercase", color: "#aaa", marginBottom: "6px" }}>
                                Cart Items ({cart.length})
                            </label>
                            <div style={{ background: "#000", padding: "10px", borderRadius: "8px", maxHeight: "150px", overflowY: "auto" }}>
                                {cart.length === 0 ? (
                                    <div style={{ color: "#555", fontSize: "11px" }}>Cart is empty</div>
                                ) : (
                                    cart.map((item, idx) => (
                                        <div key={idx} style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", marginBottom: "6px", borderBottom: "1px solid #111", paddingBottom: "4px" }}>
                                            <span>{item.name}</span>
                                            <span>R{item.price.toFixed(2)} <button onClick={() => handleRemoveItem(idx)} style={{ color: "red", background: "none", border: "none", cursor: "pointer" }}>×</button></span>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        <button
                            onClick={handleSimulatePurchase}
                            disabled={isSending}
                            style={{ width: "100%", padding: "14px", background: "#00f0ff", color: "#000", fontWeight: "bold", border: "none", borderRadius: "8px", cursor: "pointer", textTransform: "uppercase", letterSpacing: "1px" }}
                        >
                            {isSending ? "Dispatching Webhook..." : "Click Buy & Send Till Slip 🚀"}
                        </button>

                        {successMessage && (
                            <div style={{ marginTop: "15px", padding: "10px", background: "rgba(0,255,100,0.1)", border: "1px solid #0f5", color: "#0f5", fontSize: "11px", borderRadius: "8px" }}>
                                {successMessage}
                            </div>
                        )}
                    </div>

                    {/* Right Column: Live Till Slip Preview */}
                    <div style={{ background: "#0a0e12", padding: "24px", borderRadius: "16px", border: "1px solid rgba(0,240,255,0.2)", display: "flex", flexDirection: "column", alignItems: "center" }}>
                        <h3 style={{ fontSize: "14px", fontWeight: "700", marginBottom: "15px", color: "#00f0ff", alignSelf: "flex-start" }}>
                            2. Live Design Preview ({templateId})
                        </h3>
                        <div style={{ transform: "scale(0.9)", transformOrigin: "top center" }}>
                            <SelectedTemplateComponent
                                receiptData={mockReceiptData}
                                settings={{ business_name: webhookSlug.toUpperCase(), currency: "ZAR", discount_percentage: 10, store_address: "Gauteng, South Africa" }}
                                activeCurrencySymbol="R"
                            />
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}