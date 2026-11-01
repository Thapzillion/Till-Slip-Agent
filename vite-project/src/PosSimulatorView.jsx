
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

// This must match the template IDs accepted by receipt-agent.
const TEMPLATE_MAP = {
    "matrix-grid": MatrixTillSlip,
    "black-gold": BlackGoldTillSlip,
    titanium: TitaniumTillSlip,
    "infinity-space": SpaceTillSlip,
    "cyber-neon": CyberTillSlip,
    luxury: LuxuryTillSlip,
    "classic-ink": ClassicTillSlip,
    "graffiti-vibes": GraffitiTillSlip,
    "tech-hud": TechTillSlip,
};

// Demo products used only by the simulator.
const CATALOG_ITEMS = [
    { name: "Neural Quantum T-Shirt", price: 350.00 },
    { name: "Titanium Cargo Pants", price: 890.00 },
    { name: "Cyberpunk LED Cap", price: 220.00 },
    { name: "Synthetic Espresso Beans", price: 150.00 },
];

const RECEIPT_FUNCTION = "receipt-agent";

export default function PosSimulatorView({
    webhookSlug: configuredWebhookSlug,
    templateId: configuredTemplateId,
} = {}) {
    const [searchParams] = useSearchParams();

    // Read configuration from props first, then URL parameters.
    const webhookSlug =
        configuredWebhookSlug ||
        searchParams.get("slug") ||
        "demo-store";

    const templateId =
        configuredTemplateId ||
        searchParams.get("template") ||
        "matrix-grid";

    const [customerEmail, setCustomerEmail] = useState(
        "messengerthapelo@gmail.com"
    );

    const [cart, setCart] = useState([CATALOG_ITEMS[0]]);
    const [isSending, setIsSending] = useState(false);
    const [createdReceiptUrl, setCreatedReceiptUrl] = useState("");

    const handleAddToCart = (item) => {
        setCart((previousCart) => [...previousCart, item]);
        setCreatedReceiptUrl("");
    };

    const handleRemoveItem = (index) => {
        setCart((previousCart) =>
            previousCart.filter((_, itemIndex) => itemIndex !== index)
        );
        setCreatedReceiptUrl("");
    };

    // Calculate the simulated transaction totals.
    const subtotal = cart.reduce(
        (sum, item) => sum + Number(item.price || 0),
        0
    );

    const vat = subtotal * 0.15;
    const total = subtotal + vat;

    const SelectedTemplateComponent =
        TEMPLATE_MAP[templateId] || MatrixTillSlip;

    // Submit the test transaction through the deployed Edge Function.
    const handleSimulatePurchase = async () => {
        if (!webhookSlug || webhookSlug === "demo-store") {
            alert(
                "A valid business webhook slug is required. Configure your simulator with the merchant's actual webhook slug."
            );
            return;
        }

        if (!customerEmail.trim()) {
            alert("Please enter a customer email address.");
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail.trim())) {
            alert("Please enter a valid email address.");
            return;
        }

        if (cart.length === 0) {
            alert("Please add at least one item to the cart.");
            return;
        }

        setIsSending(true);
        setCreatedReceiptUrl("");

        try {
            /*
             * IMPORTANT:
             * Do not insert directly into public.receipts here.
             *
             * The receipt-agent Edge Function handles the database insert
             * using its service-role client.
             *
             * test_purchase: true tells the updated Edge Function to:
             * - Authenticate the signed-in merchant.
             * - Verify that the merchant owns the webhook slug.
             * - Save the test receipt.
             * - Skip loyalty voucher creation.
             * - Skip customer email delivery.
             */

            const { data, error } = await supabase.functions.invoke(
                RECEIPT_FUNCTION,
                {
                    body: {
                        slug: webhookSlug,
                        customer_email: customerEmail.trim(),
                        items: cart.map((item) => ({
                            name: item.name,
                            price: Number(item.price),
                        })),
                        total_amount: Number(total.toFixed(2)),
                        template_id: templateId,
                        design_config: {},
                        test_purchase: true,
                    },
                }
            );

            if (error) {
                let detailedMessage = error.message;

                // Supabase Functions errors can contain a JSON response body.
                try {
                    const response = error.context;

                    if (response && typeof response.json === "function") {
                        const errorBody = await response.json();

                        detailedMessage =
                            errorBody?.error ||
                            errorBody?.message ||
                            detailedMessage;
                    }
                } catch (parseError) {
                    console.warn(
                        "Could not read Edge Function error response:",
                        parseError
                    );
                }

                throw new Error(detailedMessage);
            }

            if (!data || data.success !== true || !data.receipt_id) {
                throw new Error(
                    data?.error ||
                    data?.message ||
                    "The receipt-agent function did not return a valid receipt ID."
                );
            }

            // Open the generated receipt using the returned database ID.
            const receiptLink = `${window.location.origin}/receipt/${data.receipt_id}`;

            setCreatedReceiptUrl(receiptLink);

            alert(
                `Test receipt created successfully for ${customerEmail}. No customer email or loyalty voucher was generated.`
            );
        } catch (err) {
            console.error("POS simulation error:", err);

            alert(
                "Simulation failed: " +
                (err?.message || "An unexpected error occurred.")
            );
        } finally {
            setIsSending(false);
        }
    };

    // Preview data for the selected till-slip template.
    const mockReceiptData = {
        merchantName: webhookSlug.toUpperCase() + " STORE",
        location: "Gauteng, South Africa",
        items: cart.map((item) => ({
            name: item.name,
            price: Number(item.price).toFixed(2),
        })),
        vat: vat.toFixed(2),
        total: total.toFixed(2),
        customer_email: customerEmail,
    };

    return (
        <div
            style={{
                minHeight: "100vh",
                background: "#000",
                color: "#fff",
                padding: "40px 20px",
                fontFamily: "sans-serif",
            }}
        >
            <div style={{ maxWidth: "1200px", margin: "0 auto" }}>

                {/* Header */}
                <div
                    style={{
                        marginBottom: "30px",
                        textAlign: "center",
                    }}
                >
                    <h1
                        style={{
                            fontSize: "20px",
                            color: "#00f0ff",
                            letterSpacing: "2px",
                            textTransform: "uppercase",
                        }}
                    >
                        ⚡ POS Webhook & Till Slip Simulator
                    </h1>

                    <p
                        style={{
                            fontSize: "12px",
                            color: "#888",
                            marginTop: "5px",
                        }}
                    >
                        Simulating checkout for Slug:{" "}
                        <strong style={{ color: "#fff" }}>
                            {webhookSlug}
                        </strong>{" "}
                        | Template:{" "}
                        <strong style={{ color: "#fff" }}>
                            {templateId}
                        </strong>
                    </p>
                </div>

                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                        gap: "30px",
                    }}
                >

                    {/* ==================================================
                        CUSTOMER ORDER CONTROLS
                    ================================================== */}
                    <div
                        style={{
                            background: "#0a0e12",
                            padding: "24px",
                            borderRadius: "16px",
                            border: "1px solid rgba(0,240,255,0.2)",
                        }}
                    >
                        <h3
                            style={{
                                fontSize: "14px",
                                fontWeight: "700",
                                marginBottom: "15px",
                                color: "#00f0ff",
                            }}
                        >
                            1. Simulate Customer Order
                        </h3>

                        {/* Customer email */}
                        <div style={{ marginBottom: "15px" }}>
                            <label
                                style={{
                                    display: "block",
                                    fontSize: "10px",
                                    textTransform: "uppercase",
                                    color: "#aaa",
                                    marginBottom: "6px",
                                }}
                            >
                                Recipient Email
                            </label>

                            <input
                                type="email"
                                value={customerEmail}
                                onChange={(event) => {
                                    setCustomerEmail(event.target.value);
                                    setCreatedReceiptUrl("");
                                }}
                                style={{
                                    width: "100%",
                                    boxSizing: "border-box",
                                    padding: "10px",
                                    background: "#000",
                                    border: "1px solid #333",
                                    color: "#fff",
                                    borderRadius: "8px",
                                }}
                            />
                        </div>

                        {/* Demo products */}
                        <div style={{ marginBottom: "15px" }}>
                            <label
                                style={{
                                    display: "block",
                                    fontSize: "10px",
                                    textTransform: "uppercase",
                                    color: "#aaa",
                                    marginBottom: "6px",
                                }}
                            >
                                Add Demo Items
                            </label>

                            <div
                                style={{
                                    display: "grid",
                                    gridTemplateColumns: "1fr 1fr",
                                    gap: "8px",
                                }}
                            >
                                {CATALOG_ITEMS.map((item, index) => (
                                    <button
                                        key={index}
                                        type="button"
                                        onClick={() => handleAddToCart(item)}
                                        style={{
                                            padding: "10px",
                                            background: "#111",
                                            border: "1px solid #222",
                                            color: "#00f0ff",
                                            borderRadius: "8px",
                                            cursor: "pointer",
                                            fontSize: "11px",
                                            textAlign: "left",
                                        }}
                                    >
                                        + {item.name}
                                        <br />
                                        <span style={{ color: "#888" }}>
                                            R{item.price.toFixed(2)}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Cart */}
                        <div style={{ marginBottom: "20px" }}>
                            <label
                                style={{
                                    display: "block",
                                    fontSize: "10px",
                                    textTransform: "uppercase",
                                    color: "#aaa",
                                    marginBottom: "6px",
                                }}
                            >
                                Cart Items ({cart.length})
                            </label>

                            <div
                                style={{
                                    background: "#000",
                                    padding: "10px",
                                    borderRadius: "8px",
                                    maxHeight: "150px",
                                    overflowY: "auto",
                                }}
                            >
                                {cart.length === 0 ? (
                                    <p
                                        style={{
                                            color: "#777",
                                            fontSize: "11px",
                                        }}
                                    >
                                        Your cart is empty.
                                    </p>
                                ) : (
                                    cart.map((item, index) => (
                                        <div
                                            key={index}
                                            style={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                                alignItems: "center",
                                                gap: "10px",
                                                fontSize: "11px",
                                                marginBottom: "6px",
                                                borderBottom: "1px solid #111",
                                                paddingBottom: "4px",
                                            }}
                                        >
                                            <span>{item.name}</span>

                                            <span
                                                style={{
                                                    whiteSpace: "nowrap",
                                                }}
                                            >
                                                R{item.price.toFixed(2)}

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleRemoveItem(index)
                                                    }
                                                    aria-label={`Remove ${item.name}`}
                                                    style={{
                                                        color: "red",
                                                        background: "none",
                                                        border: "none",
                                                        cursor: "pointer",
                                                        marginLeft: "8px",
                                                    }}
                                                >
                                                    ×
                                                </button>
                                            </span>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Totals */}
                        <div
                            style={{
                                borderTop: "1px solid #222",
                                paddingTop: "12px",
                                marginBottom: "18px",
                                fontSize: "12px",
                            }}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    marginBottom: "6px",
                                    color: "#aaa",
                                }}
                            >
                                <span>Subtotal</span>
                                <span>R{subtotal.toFixed(2)}</span>
                            </div>

                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    marginBottom: "6px",
                                    color: "#aaa",
                                }}
                            >
                                <span>VAT (15%)</span>
                                <span>R{vat.toFixed(2)}</span>
                            </div>

                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    fontWeight: "bold",
                                    color: "#00f0ff",
                                    fontSize: "14px",
                                }}
                            >
                                <span>Total</span>
                                <span>R{total.toFixed(2)}</span>
                            </div>
                        </div>

                        {/* Submit test purchase */}
                        <button
                            type="button"
                            onClick={handleSimulatePurchase}
                            disabled={isSending}
                            style={{
                                width: "100%",
                                padding: "14px",
                                background: isSending ? "#555" : "#00f0ff",
                                color: "#000",
                                fontWeight: "bold",
                                border: "none",
                                borderRadius: "8px",
                                cursor: isSending ? "not-allowed" : "pointer",
                                textTransform: "uppercase",
                                letterSpacing: "1px",
                            }}
                        >
                            {isSending
                                ? "Processing..."
                                : "Complete Test Purchase 🚀"}
                        </button>

                        {/* Generated receipt link */}
                        {createdReceiptUrl && (
                            <div
                                style={{
                                    marginTop: "15px",
                                    padding: "12px",
                                    background: "rgba(0,255,100,0.1)",
                                    border: "1px solid #0f5",
                                    borderRadius: "8px",
                                }}
                            >
                                <p
                                    style={{
                                        fontSize: "11px",
                                        color: "#0f5",
                                        marginBottom: "6px",
                                    }}
                                >
                                    Test receipt generated successfully!
                                </p>

                                <a
                                    href={createdReceiptUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                        fontSize: "11px",
                                        color: "#00f0ff",
                                        textDecoration: "underline",
                                        wordBreak: "break-all",
                                    }}
                                >
                                    Open Generated Till Slip Link ↗
                                </a>
                            </div>
                        )}

                        <p
                            style={{
                                fontSize: "10px",
                                color: "#777",
                                lineHeight: "1.5",
                                marginTop: "12px",
                            }}
                        >
                            Simulator mode: creates a test receipt only.
                            It does not send a customer email or create a
                            loyalty voucher.
                        </p>
                    </div>

                    {/* ==================================================
                        LIVE TILL SLIP PREVIEW
                    ================================================== */}
                    <div
                        style={{
                            background: "#0a0e12",
                            padding: "24px",
                            borderRadius: "16px",
                            border: "1px solid rgba(0,240,255,0.2)",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            minWidth: 0,
                        }}
                    >
                        <h3
                            style={{
                                fontSize: "14px",
                                fontWeight: "700",
                                marginBottom: "15px",
                                color: "#00f0ff",
                                alignSelf: "flex-start",
                            }}
                        >
                            2. Live Till Slip Design Preview ({templateId})
                        </h3>

                        <div
                            style={{
                                width: "100%",
                                display: "flex",
                                justifyContent: "center",
                                minWidth: 0,
                            }}
                        >
                            <div
                                style={{
                                    transform: "scale(0.85)",
                                    transformOrigin: "top center",
                                }}
                            >
                                <SelectedTemplateComponent
                                    receiptData={mockReceiptData}
                                    settings={{
                                        business_name:
                                            webhookSlug.toUpperCase(),
                                        currency: "ZAR",
                                        discount_percentage: 10,
                                        store_address:
                                            "Gauteng, South Africa",
                                    }}
                                    activeCurrencySymbol="R"
                                />
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
