import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
    Activity,
    ArrowUpRight,
    CheckCircle2,
    CircleAlert,
    Clock3,
    CreditCard,
    Mail,
    Minus,
    Plus,
    ReceiptText,
    RotateCcw,
    ShoppingBag,
    ShoppingCart,
    ShieldCheck,
    Sparkles,
    Trash2,
    X,
    Zap,
} from "lucide-react";
import { supabase } from "./supabaseClient";

import MatrixTillSlip from "./models/MatrixTillSlip";
import BlackGoldTillSlip from "./models/BlackGoldTillSlip";
import TitaniumTillSlip from "./models/TitaniumTillSlip";
import SpaceTillSlip from "./models/SpaceTillSlip";
import CyberTillSlip from "./models/CyberTillSlip";
import LuxuryTillSlip from "./models/LuxuryTillSlip";
import ClassicTillSlip from "./models/ClassicTillSlip";
import GraffitiTillSlip from "./models/GraffitiTillSlip";
import TechTillSlip from "./models/TechTillSlip";
import "./PosSimulatorView.css";

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
    { name: "Neural Quantum T-Shirt", price: 350.0 },
    { name: "Titanium Cargo Pants", price: 890.0 },
    { name: "Cyberpunk LED Cap", price: 220.0 },
    { name: "Synthetic Espresso Beans", price: 150.0 },
];

const RECEIPT_FUNCTION = "receipt-agent";

export default function PosSimulatorView({
    webhookSlug: configuredWebhookSlug,
    templateId: configuredTemplateId,
} = {}) {
    const [searchParams] = useSearchParams();

    const webhookSlug =
        configuredWebhookSlug || searchParams.get("slug") || "demo-store";
    const templateId =
        configuredTemplateId || searchParams.get("template") || "matrix-grid";

    const [customerEmail, setCustomerEmail] = useState("messengerthapelo@gmail.com");
    const [cart, setCart] = useState([CATALOG_ITEMS[0]]);
    const [isSending, setIsSending] = useState(false);
    const [createdReceiptUrl, setCreatedReceiptUrl] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const handleAddToCart = (item) => {
        setCart((previousCart) => [...previousCart, item]);
        setCreatedReceiptUrl("");
        setErrorMessage("");
        setSuccessMessage("");
    };

    const handleRemoveItem = (index) => {
        setCart((previousCart) =>
            previousCart.filter((_, itemIndex) => itemIndex !== index)
        );
        setCreatedReceiptUrl("");
        setErrorMessage("");
        setSuccessMessage("");
    };

    const handleResetCart = () => {
        setCart([]);
        setCreatedReceiptUrl("");
        setErrorMessage("");
        setSuccessMessage("");
    };

    const subtotal = cart.reduce(
        (sum, item) => sum + Number(item.price || 0),
        0
    );
    const vat = subtotal * 0.15;
    const total = subtotal + vat;

    const SelectedTemplateComponent = TEMPLATE_MAP[templateId] || MatrixTillSlip;

    const handleSimulatePurchase = async () => {
        setErrorMessage("");
        setSuccessMessage("");

        if (!webhookSlug || webhookSlug === "demo-store") {
            setErrorMessage(
                "A valid business webhook slug is required. Configure your simulator with the merchant's actual webhook slug."
            );
            return;
        }

        if (!customerEmail.trim()) {
            setErrorMessage("Please enter a customer email address.");
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail.trim())) {
            setErrorMessage("Please enter a valid email address.");
            return;
        }

        if (cart.length === 0) {
            setErrorMessage("Please add at least one item to the cart.");
            return;
        }

        setIsSending(true);
        setCreatedReceiptUrl("");

        try {
            // The receipt-agent function handles the database insert.
            // test_purchase: true must keep test transactions from generating
            // loyalty vouchers or sending customer emails.
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

                try {
                    const response = error.context;
                    if (response && typeof response.json === "function") {
                        const errorBody = await response.json();
                        detailedMessage =
                            errorBody?.error || errorBody?.message || detailedMessage;
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

            const receiptLink = `${window.location.origin}/receipt/${data.receipt_id}`;
            setCreatedReceiptUrl(receiptLink);
            setSuccessMessage(
                `Test receipt created successfully for ${customerEmail.trim()}. No customer email or loyalty voucher was generated.`
            );
        } catch (err) {
            console.error("POS simulation error:", err);
            setErrorMessage(
                "Simulation failed: " +
                (err?.message || "An unexpected error occurred.")
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
            price: Number(item.price).toFixed(2),
        })),
        vat: vat.toFixed(2),
        total: total.toFixed(2),
        customer_email: customerEmail,
    };

    return (
        <div className="pos-sim-page">
            <div className="pos-sim-shell">
                <header className="pos-sim-header">
                    <div className="pos-sim-brand">
                        <div className="pos-sim-brand-mark">
                            <Zap size={22} />
                        </div>
                        <div>
                            <div className="pos-sim-brand-name">RUACHAGENT</div>
                            <div className="pos-sim-brand-caption">POINT OF SALE LAB</div>
                        </div>
                    </div>

                    <div className="pos-sim-header-status">
                        <span className="pos-sim-live-dot" />
                        SIMULATION ENVIRONMENT
                    </div>
                </header>

                <div className="pos-sim-statusbar">
                    <div className="pos-sim-status-item">
                        <Activity size={13} />
                        <span>WEBHOOK SIMULATOR</span>
                    </div>
                    <span className="pos-sim-status-separator">/</span>
                    <span className="pos-sim-status-muted">TEST TRANSACTION MODE</span>
                    <span className="pos-sim-status-spacer" />
                    <span className="pos-sim-secure-label">
                        <ShieldCheck size={12} /> SANDBOX
                    </span>
                </div>

                <main className="pos-sim-main">
                    <section className="pos-sim-intro">
                        <div className="pos-sim-eyebrow">
                            <span /> MERCHANT DEVELOPMENT TOOLS
                        </div>
                        <h1>POS Webhook <span>Simulator.</span></h1>
                        <p>
                            Run a controlled test transaction and preview the selected
                            till-slip design before using your live checkout workflow.
                        </p>

                        <div className="pos-sim-config-strip">
                            <div>
                                <span>WEBHOOK SLUG</span>
                                <strong>{webhookSlug}</strong>
                            </div>
                            <div className="pos-sim-config-divider" />
                            <div>
                                <span>ACTIVE TEMPLATE</span>
                                <strong>{templateId}</strong>
                            </div>
                            <div className="pos-sim-config-badge">
                                <span className="pos-sim-live-dot" /> TEST MODE
                            </div>
                        </div>
                    </section>

                    <div className="pos-sim-workspace">
                        <section className="pos-sim-panel pos-sim-order-panel">
                            <div className="pos-sim-panel-heading">
                                <div className="pos-sim-step-icon"><ShoppingCart size={18} /></div>
                                <div>
                                    <span className="pos-sim-panel-kicker">TRANSACTION CONFIGURATION</span>
                                    <h2>Customer Order</h2>
                                </div>
                                <span className="pos-sim-step-number">01</span>
                            </div>

                            <div className="pos-sim-field">
                                <label htmlFor="pos-customer-email">
                                    <Mail size={13} /> RECIPIENT EMAIL
                                </label>
                                <input
                                    id="pos-customer-email"
                                    type="email"
                                    value={customerEmail}
                                    onChange={(event) => {
                                        setCustomerEmail(event.target.value);
                                        setCreatedReceiptUrl("");
                                        setErrorMessage("");
                                        setSuccessMessage("");
                                    }}
                                    placeholder="customer@example.com"
                                    autoComplete="email"
                                />
                            </div>

                            <div className="pos-sim-field">
                                <div className="pos-sim-field-heading">
                                    <label><ShoppingBag size={13} /> DEMO PRODUCT CATALOGUE</label>
                                    <span>SELECT TO ADD</span>
                                </div>
                                <div className="pos-sim-product-grid">
                                    {CATALOG_ITEMS.map((item) => (
                                        <button
                                            key={item.name}
                                            type="button"
                                            className="pos-sim-product"
                                            onClick={() => handleAddToCart(item)}
                                        >
                                            <span className="pos-sim-product-plus"><Plus size={14} /></span>
                                            <span className="pos-sim-product-name">{item.name}</span>
                                            <strong>R{item.price.toFixed(2)}</strong>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="pos-sim-cart-heading">
                                <div>
                                    <label><ShoppingCart size={13} /> ORDER SUMMARY</label>
                                    <span>{cart.length} {cart.length === 1 ? "ITEM" : "ITEMS"}</span>
                                </div>
                                {cart.length > 0 && (
                                    <button type="button" onClick={handleResetCart} className="pos-sim-text-button">
                                        <RotateCcw size={12} /> Clear cart
                                    </button>
                                )}
                            </div>

                            <div className="pos-sim-cart">
                                {cart.length === 0 ? (
                                    <div className="pos-sim-empty-cart">
                                        <ShoppingCart size={22} />
                                        <span>Your cart is empty. Add a demo product to continue.</span>
                                    </div>
                                ) : (
                                    cart.map((item, index) => (
                                        <div className="pos-sim-cart-row" key={`${item.name}-${index}`}>
                                            <div className="pos-sim-cart-item-icon"><ReceiptText size={14} /></div>
                                            <div className="pos-sim-cart-item-name">{item.name}</div>
                                            <strong>R{item.price.toFixed(2)}</strong>
                                            <button
                                                type="button"
                                                className="pos-sim-remove-item"
                                                onClick={() => handleRemoveItem(index)}
                                                aria-label={`Remove ${item.name}`}
                                                title="Remove item"
                                            >
                                                <X size={14} />
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>

                            <div className="pos-sim-totals">
                                <div><span>Subtotal</span><strong>R{subtotal.toFixed(2)}</strong></div>
                                <div><span>VAT <small>(15%)</small></span><strong>R{vat.toFixed(2)}</strong></div>
                                <div className="pos-sim-grand-total"><span>TOTAL DUE</span><strong>R{total.toFixed(2)}</strong></div>
                            </div>

                            {errorMessage && (
                                <div className="pos-sim-feedback pos-sim-error" role="alert">
                                    <CircleAlert size={16} />
                                    <span>{errorMessage}</span>
                                </div>
                            )}

                            {successMessage && (
                                <div className="pos-sim-feedback pos-sim-success" role="status">
                                    <CheckCircle2 size={16} />
                                    <span>{successMessage}</span>
                                </div>
                            )}

                            <button
                                type="button"
                                className="pos-sim-submit"
                                onClick={handleSimulatePurchase}
                                disabled={isSending}
                            >
                                {isSending ? (
                                    <><span className="pos-sim-spinner" /> PROCESSING TEST PURCHASE</>
                                ) : (
                                    <><CreditCard size={17} /> COMPLETE TEST PURCHASE <ArrowUpRight size={16} /></>
                                )}
                            </button>

                            {createdReceiptUrl && (
                                <div className="pos-sim-receipt-result">
                                    <div className="pos-sim-result-heading">
                                        <CheckCircle2 size={16} /> TEST RECEIPT GENERATED
                                    </div>
                                    <a href={createdReceiptUrl} target="_blank" rel="noopener noreferrer">
                                        Open Generated Till Slip <ArrowUpRight size={14} />
                                    </a>
                                </div>
                            )}

                            <div className="pos-sim-test-notice">
                                <ShieldCheck size={15} />
                                <span>
                                    TEST MODE ONLY. This creates a test receipt without sending a
                                    customer email or generating a loyalty voucher.
                                </span>
                            </div>
                        </section>

                        <section className="pos-sim-panel pos-sim-preview-panel">
                            <div className="pos-sim-panel-heading">
                                <div className="pos-sim-step-icon"><Sparkles size={18} /></div>
                                <div>
                                    <span className="pos-sim-panel-kicker">LIVE DESIGN RENDER</span>
                                    <h2>Till Slip Preview</h2>
                                </div>
                                <span className="pos-sim-step-number">02</span>
                            </div>

                            <div className="pos-sim-preview-meta">
                                <span><span className="pos-sim-live-dot" /> LIVE PREVIEW</span>
                                <span>{templateId}</span>
                            </div>

                            <div className="pos-sim-preview-stage">
                                <div className="pos-sim-preview-scale">
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

                            <div className="pos-sim-preview-footer">
                                <div><Clock3 size={13} /> UPDATES AS YOU EDIT THE CART</div>
                                <span>DESIGN PREVIEW</span>
                            </div>
                        </section>
                    </div>

                    <footer className="pos-sim-page-footer">
                        <span>RUACHAGENT · POS SIMULATION SYSTEM</span>
                        <span><ShieldCheck size={12} /> ISOLATED TEST TRANSACTION</span>
                    </footer>
                </main>
            </div>
        </div>
    );
}
