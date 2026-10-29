
import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "./supabaseClient";

// Till slip templates
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
    titanium: TitaniumTillSlip,
    "infinity-space": SpaceTillSlip,
    "cyber-neon": CyberTillSlip,
    luxury: LuxuryTillSlip,
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
    selectedtemplateID,
    transactionFunctionName,
} = {}) {
    const [searchParams] = useSearchParams();

    const webhookSlug =
        configuredWebhookSlug ||
        searchParams.get("slug") ||
        "demo-store";

    // Preserve the template selected by the parent page.
    const templateId =
        selectedtemplateID ||
        configuredTemplateId ||
        searchParams.get("template") ||
        "matrix-grid";

    const [customerEmail, setCustomerEmail] = useState(
        "messengerthapelo@gmail.com"
    );
    const [cart, setCart] = useState([CATALOG_ITEMS[0]]);
    const [isSending, setIsSending] = useState(false);
    const [createdReceiptUrl, setCreatedReceiptUrl] = useState("");
    const [statusMessage, setStatusMessage] = useState("");
    const [statusType, setStatusType] = useState("info");

    const handleAddToCart = (item) => {
        setCart((prev) => [...prev, item]);
    };

    const handleRemoveItem = (index) => {
        setCart((prev) => prev.filter((_, i) => i !== index));
    };

    const subtotal = cart.reduce(
        (sum, item) => sum + Number(item.price || 0),
        0
    );

    const vat = subtotal * 0.15;
    const total = subtotal + vat;

    const SelectedTemplateComponent =
        TEMPLATE_MAP[templateId] || MatrixTillSlip;

    const handleSimulatePurchase = async () => {
        if (isSending) return;

        const normalizedEmail = customerEmail.trim();

        if (!normalizedEmail) {
            setStatusType("error");
            setStatusMessage("Please enter a customer email address.");
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
            setStatusType("error");
            setStatusMessage("Please enter a valid email address.");
            return;
        }

        if (cart.length === 0) {
            setStatusType("error");
            setStatusMessage("Please add at least one item to the cart.");
            return;
        }

        if (!TEMPLATE_MAP[templateId]) {
            setStatusType("error");
            setStatusMessage(
                `Unknown till slip template: ${templateId}`
            );
            return;
        }

        if (!transactionFunctionName) {
            setStatusType("error");
            setStatusMessage(
                "Configure transactionFunctionName with your deployed " +
                "Supabase transaction Edge Function name."
            );
            return;
        }

        setIsSending(true);
        setCreatedReceiptUrl("");
        setStatusMessage("");

        try {
            // 1. Require an authenticated user.
            const {
                data: { user },
                error: authError,
            } = await supabase.auth.getUser();

            if (authError || !user) {
                throw new Error(
                    "You must be signed in to complete a test purchase."
                );
            }

            // 2. Submit the transaction to the existing server-side
            // transaction handler, which uses Resend for email delivery.
            //
            // The handler must accept slug from the request body and
            // persist template_id and design_config on the receipt.
            const { data, error } = await supabase.functions.invoke(
                transactionFunctionName,
                {
                    body: {
                        slug: webhookSlug,
                        customer_email: normalizedEmail,
                        items: cart,
                        total_amount: Number(total.toFixed(2)),
                        template_id: templateId,
                        design_config: {},
                        test_purchase: true,
                    },
                }
            );

            if (error) {
                let details = error.message;

                if (error.context?.json) {
                    try {
                        const responseBody = await error.context.json();
                        details =
                            responseBody?.error ||
                            responseBody?.message ||
                            details;
                    } catch {
                        // Retain the original error message.
                    }
                }

                throw new Error(details || "Transaction request failed.");
            }

            if (data?.error || data?.success === false) {
                throw new Error(
                    data.error || "The transaction was not successful."
                );
            }

            if (!data?.success) {
                throw new Error(
                    "The server did not confirm transaction success."
                );
            }

            // The existing handler returns success and voucher_token.
            // Update it to also return receipt_id and email_sent before
            // enabling this receipt-link and delivery confirmation.
            if (data.receipt_id) {
                setCreatedReceiptUrl(
                    `${window.location.origin}/receipt/${data.receipt_id}`
                );
            }

            if (data.email_sent === true) {
                setStatusType("success");
                setStatusMessage(
                    `Test purchase completed. The server confirmed that ` +
                    `the till slip email was sent to ${normalizedEmail}.`
                );
            } else {
                setStatusType("warning");
                setStatusMessage(
                    "The transaction was processed, but email delivery " +
                    "was not confirmed. Check the server response and Resend logs."
                );
            }
        } catch (err) {
            console.error("Simulation error:", err);
            setStatusType("error");
            setStatusMessage(
                `Simulation failed: ${err.message || "Unknown error"}`
            );
        } finally {
            setIsSending(false);
        }
    };

    const mockReceiptData = {
        merchantName: webhookSlug.toUpperCase() + " STORE",
        location: "Gauteng, South Africa",
        items: cart.map((item) => ({
            name: item.name,
            price: item.price.toFixed(2),
        })),
        vat: vat.toFixed(2),
        total: total.toFixed(2),
        customer_email: customerEmail,
    };

    const statusColors = {
        success: "#00ff66",
        error: "#ff6464",
        warning: "#ffd166",
        info: "#00f0ff",
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
                <div style={{ marginBottom: "30px", textAlign: "center" }}>
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
                    {/* Purchase controls */}
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
                                onChange={(event) =>
                                    setCustomerEmail(event.target.value)
                                }
                                autoComplete="email"
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
                                {cart.map((item, index) => (
                                    <div
                                        key={index}
                                        style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            fontSize: "11px",
                                            marginBottom: "6px",
                                            borderBottom: "1px solid #111",
                                            paddingBottom: "4px",
                                        }}
                                    >
                                        <span>{item.name}</span>
                                        <span>
                                            R{item.price.toFixed(2)}{" "}
                                            <button
                                                onClick={() =>
                                                    handleRemoveItem(index)
                                                }
                                                aria-label={`Remove ${item.name}`}
                                                style={{
                                                    color: "red",
                                                    background: "none",
                                                    border: "none",
                                                    cursor: "pointer",
                                                }}
                                            >
                                                ×
                                            </button>
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div
                            style={{
                                marginBottom: "16px",
                                fontSize: "12px",
                                color: "#aaa",
                            }}
                        >
                            <div>
                                Subtotal: R{subtotal.toFixed(2)}
                            </div>
                            <div>VAT (15%): R{vat.toFixed(2)}</div>
                            <div
                                style={{
                                    marginTop: "6px",
                                    color: "#00f0ff",
                                    fontWeight: "bold",
                                }}
                            >
                                Total: R{total.toFixed(2)}
                            </div>
                        </div>

                        <button
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
                                cursor: isSending ? "wait" : "pointer",
                                textTransform: "uppercase",
                                letterSpacing: "1px",
                            }}
                        >
                            {isSending
                                ? "Processing..."
                                : "Complete Test Purchase 🚀"}
                        </button>

                        {statusMessage && (
                            <div
                                role="status"
                                aria-live="polite"
                                style={{
                                    marginTop: "15px",
                                    padding: "12px",
                                    background: "#111",
                                    border: `1px solid ${statusColors[statusType]}`,
                                    borderRadius: "8px",
                                    color: statusColors[statusType],
                                    fontSize: "12px",
                                    overflowWrap: "anywhere",
                                }}
                            >
                                {statusMessage}
                            </div>
                        )}

                        {createdReceiptUrl && (
                            <div style={{ marginTop: "15px" }}>
                                <a
                                    href={createdReceiptUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                        fontSize: "11px",
                                        color: "#00f0ff",
                                        textDecoration: "underline",
                                        overflowWrap: "anywhere",
                                    }}
                                >
                                    Open Generated Till Slip Link ↗
                                </a>
                            </div>
                        )}
                    </div>

                    {/* Live till slip preview */}
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
                                transform: "scale(0.85)",
                                transformOrigin: "top center",
                                maxWidth: "100%",
                            }}
                        >
                            <SelectedTemplateComponent
                                receiptData={mockReceiptData}
                                settings={{
                                    business_name: webhookSlug.toUpperCase(),
                                    currency: "ZAR",
                                    discount_percentage: 10,
                                    store_address: "Gauteng, South Africa",
                                }}
                                activeCurrencySymbol="R"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
