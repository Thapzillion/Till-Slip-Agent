import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "./supabaseClient";

// Import your till slip templates
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

export default function PosSimulatorView({
    webhookSlug: configuredWebhookSlug,
    templateId: configuredTemplateId,
} = {}) {
    const [searchParams] = useSearchParams();
    const webhookSlug =
        configuredWebhookSlug ||
        searchParams.get("slug") ||
        "demo-store";
    const templateId =
        configuredTemplateId ||
        searchParams.get("template") ||
        "matrix-grid";

    const [customerEmail, setCustomerEmail] = useState("messengerthapelo@gmail.com");
    const [cart, setCart] = useState([CATALOG_ITEMS[0]]);
    const [isSending, setIsSending] = useState(false);
    const [createdReceiptUrl, setCreatedReceiptUrl] = useState("");

    const handleAddToCart = (item) => {
        setCart((prev) => [...prev, item]);
    };

    const handleRemoveItem = (index) => {
        setCart((prev) => prev.filter((_, i) => i !== index));
    };

    const subtotal = cart.reduce((sum, item) => sum + item.price, 0);
    const vat = subtotal * 0.15;
    const total = subtotal + vat;

    const SelectedTemplateComponent = TEMPLATE_MAP[templateId] || MatrixTillSlip;

    const handleSimulatePurchase = async () => {
        if (!customerEmail) {
            alert("Please enter an email address.");
            return;
        }

        setIsSending(true);
        setCreatedReceiptUrl("");

        try {
            // 1. Look up the business_id using the webhook_slug from your business_settings table
            const { data: business, error: bizError } = await supabase
                .from("business_settings")
                .select("id")
                .eq("webhook_slug", webhookSlug)
                .maybeSingle();

            if (bizError || !business) {
                throw new Error(`Business settings not found for webhook slug: "${webhookSlug}". Make sure you saved your Agent Parameters first!`);
            }

            // 2. Insert the simulated transaction directly into your public.receipts table
            const { data: newReceipt, error: receiptError } = await supabase
                .from("receipts")
                .insert({
                    business_id: business.id,
                    customer_email: customerEmail,
                    items: cart,
                    total_amount: total,
                    template_id: templateId,
                    design_config: {}
                })
                .select()
                .single();

            if (receiptError) {
                throw receiptError;
            }

            // 3. Generate the live ReceiptView link
            const receiptLink = `${window.location.origin}/receipt/${newReceipt.id}`;
            setCreatedReceiptUrl(receiptLink);

            alert(`Success! Receipt created in database for ${customerEmail}.`);
        } catch (err) {
            console.error("Simulation error:", err);
            alert("Simulation failed: " + err.message);
        } finally {
            setIsSending(false);
        }
    };

    const mockReceiptData = {
        merchantName: webhookSlug.toUpperCase() + " STORE",
        location: "Gauteng, South Africa",
        items: cart.map(i => ({ name: i.name, price: i.price.toFixed(2) })),
        vat: vat.toFixed(2),
        total: total.toFixed(2),
        customer_email: customerEmail
    };

    return (
        <div style={{ minHeight: "100vh", background: "#000", color: "#fff", padding: "40px 20px", fontFamily: "sans-serif" }}>
            <div style={{ maxWidth: "1200px", margin: "0 auto" }}>

                <div style={{ marginBottom: "30px", textAlign: "center" }}>
                    <h1 style={{ fontSize: "20px", color: "#00f0ff", letterSpacing: "2px", textTransform: "uppercase" }}>
                        ⚡ POS Webhook & Till Slip Simulator
                    </h1>
                    <p style={{ fontSize: "12px", color: "#888", marginTop: "5px" }}>
                        Simulating checkout for Slug: <strong style={{ color: "#fff" }}>{webhookSlug}</strong> | Template: <strong style={{ color: "#fff" }}>{templateId}</strong>
                    </p>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "30px" }}>

                    {/* Controls */}
                    <div style={{ background: "#0a0e12", padding: "24px", borderRadius: "16px", border: "1px solid rgba(0,240,255,0.2)" }}>
                        <h3 style={{ fontSize: "14px", fontWeight: "700", marginBottom: "15px", color: "#00f0ff" }}>
                            1. Simulate Customer Order
                        </h3>

                        <div style={{ marginBottom: "15px" }}>
                            <label style={{ display: "block", fontSize: "10px", textTransform: "uppercase", color: "#aaa", marginBottom: "6px" }}>
                                Recipient Email
                            </label>
                            <input
                                type="email"
                                value={customerEmail}
                                onChange={(e) => setCustomerEmail(e.target.value)}
                                style={{ width: "100%", padding: "10px", background: "#000", border: "1px solid #333", color: "#fff", borderRadius: "8px" }}
                            />
                        </div>

                        <div style={{ marginBottom: "15px" }}>
                            <label style={{ display: "block", fontSize: "10px", textTransform: "uppercase", color: "#aaa", marginBottom: "6px" }}>
                                Add Demo Items
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
                                {cart.map((item, idx) => (
                                    <div key={idx} style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", marginBottom: "6px", borderBottom: "1px solid #111", paddingBottom: "4px" }}>
                                        <span>{item.name}</span>
                                        <span>R{item.price.toFixed(2)} <button onClick={() => handleRemoveItem(idx)} style={{ color: "red", background: "none", border: "none", cursor: "pointer" }}>×</button></span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <button
                            onClick={handleSimulatePurchase}
                            disabled={isSending}
                            style={{ width: "100%", padding: "14px", background: "#00f0ff", color: "#000", fontWeight: "bold", border: "none", borderRadius: "8px", cursor: "pointer", textTransform: "uppercase", letterSpacing: "1px" }}
                        >
                            {isSending ? "Processing..." : "Complete Test Purchase 🚀"}
                        </button>

                        {createdReceiptUrl && (
                            <div style={{ marginTop: "15px", padding: "12px", background: "rgba(0,255,100,0.1)", border: "1px solid #0f5", borderRadius: "8px" }}>
                                <p style={{ fontSize: "11px", color: "#0f5", marginBottom: "6px" }}>Receipt generated successfully!</p>
                                <a
                                    href={createdReceiptUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{ fontSize: "11px", color: "#00f0ff", textDecoration: "underline", wordBreak: "break-all" }}
                                >
                                    Open Generated Till Slip Link ↗
                                </a>
                            </div>
                        )}
                    </div>

                    {/* Live Preview */}
                    <div style={{ background: "#0a0e12", padding: "24px", borderRadius: "16px", border: "1px solid rgba(0,240,255,0.2)", display: "flex", flexDirection: "column", alignItems: "center" }}>
                        <h3 style={{ fontSize: "14px", fontWeight: "700", marginBottom: "15px", color: "#00f0ff", alignSelf: "flex-start" }}>
                            2. Live Till Slip Design Preview ({templateId})
                        </h3>
                        <div style={{ transform: "scale(0.85)", transformOrigin: "top center" }}>
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