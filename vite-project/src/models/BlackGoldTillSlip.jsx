
import React from "react";


/* ================================================================
   BlackGold TILL SLIP BACKEND
   PRESERVED FROM YOUR ORIGINAL CODE
   ================================================================ */

function getBlackGoldTillSlipData({
    receiptData = {},
    settings = {},
    user = null,
    activeCurrencySymbol = "",
    voucher = null,
    isExpired = false,
    daysRemaining = 0,
    qrCodeUrl = "",
    checkoutPayloadLink = "",
    receiptId = null,
    onDownload,
}) {
    /* ================================================================
       RECEIPT DATA PROCESSING
       ================================================================ */

    const receiptDataItems = Array.isArray(receiptData?.items)
        ? receiptData.items
        : [];

    const total =
        receiptData?.total ??
        receiptData?.total_amount ??
        "";

    const vat =
        receiptData?.vat ??
        receiptData?.vat_amount ??
        null;

    const transactionDate = receiptData?.created_at
        ? new Date(receiptData.created_at)
        : new Date();

    const formattedTransactionDate =
        transactionDate
            .toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: false,
            })
            .replace(/,/g, "");

    /* ================================================================
       BRAND ASSET LOGIC
       ================================================================ */

    const logoUrl = settings?.logo_url || "";

    const watermarkUrl =
        receiptData?.watermark_url ||
        settings?.watermark_url ||
        logoUrl ||
        "";

    /* ================================================================
       CURRENCY DISPLAY LOGIC
       ================================================================ */

    const CURRENCY_SYMBOLS = {
        ZAR: "R",
        USD: "$",
        GBP: "£",
        EUR: "€",
        NGN: "₦",
    };

    const resolvedCurrencySymbol =
        activeCurrencySymbol ||
        CURRENCY_SYMBOLS[
        settings?.currency ||
        receiptData?.currency ||
        "ZAR"
        ] ||
        "";

    const formatCurrency = (value) => {
        if (value === null || value === undefined || value === "") {
            return "";
        }

        const raw = String(value).trim();

        if (
            resolvedCurrencySymbol &&
            raw.startsWith(resolvedCurrencySymbol)
        ) {
            return raw;
        }

        const numeric = Number(raw.replace(/,/g, ""));

        if (Number.isFinite(numeric)) {
            return `${resolvedCurrencySymbol}${resolvedCurrencySymbol ? " " : ""}${numeric.toFixed(2)}`;
        }

        return `${resolvedCurrencySymbol}${resolvedCurrencySymbol ? " " : ""}${raw}`;
    };

    /* ================================================================
       DOWNLOAD HANDLER
       ================================================================ */

    const handleDownload = (event) => {
        if (event) {
            event.preventDefault();
        }

        if (typeof onDownload === "function") {
            onDownload();
        } else {
            console.warn(
                "BlackGoldTillSlip: onDownload handler was not supplied."
            );
        }
    };

    return {
        receiptDataItems,
        total,
        vat,
        transactionDate,
        formattedTransactionDate,
        logoUrl,
        watermarkUrl,
        resolvedCurrencySymbol,
        formatCurrency,
        handleDownload,
    };
}

/* ================================================================
   BlackGold TILL SLIP COMPONENT
   ================================================================ */

export default function BlackGoldTillSlip({
    receiptData = {},
    settings = {},
    user = null,
    activeCurrencySymbol = "",
    voucher = null,
    isExpired = false,
    daysRemaining = 0,
    qrCodeUrl = "",
    checkoutPayloadLink = "",
    receiptId = null,
    onDownload,
}) {
    const {
        receiptDataItems,
        total,
        vat,
        formattedTransactionDate,
        logoUrl,
        watermarkUrl,
        formatCurrency,
        handleDownload,
    } = getBlackGoldTillSlipData({
        receiptData,
        settings,
        user,
        activeCurrencySymbol,
        voucher,
        isExpired,
        daysRemaining,
        qrCodeUrl,
        checkoutPayloadLink,
        receiptId,
        onDownload,
    });

    const slipNumber =
        receiptId ??
        receiptData?.receipt_number ??
        receiptData?.receipt_id ??
        "";

    const subtotal =
        receiptData?.subtotal ??
        receiptData?.sub_total ??
        null;

    const discount =
        receiptData?.discount_amount ??
        receiptData?.discount ??
        null;

    const paymentMethod =
        receiptData?.payment_method ??
        receiptData?.paymentMethod ??
        "";

    const paymentReference =
        receiptData?.payment_reference ??
        receiptData?.reference ??
        "";

    const customerName =
        receiptData?.customer_name ??
        receiptData?.customerName ??
        "";

    const itemValue = (item, keys) => {
        for (const key of keys) {
            if (
                item?.[key] !== undefined &&
                item?.[key] !== null &&
                item?.[key] !== ""
            ) {
                return item[key];
            }
        }

        return "";
    };

    const itemName = (item) =>
        itemValue(item, [
            "name",
            "product_name",
            "description",
            "title",
            "item_name",
        ]);

    const itemQuantity = (item) =>
        itemValue(item, [
            "quantity",
            "qty",
            "count",
        ]);

    const itemPrice = (item) =>
        itemValue(item, [
            "unit_price",
            "price",
            "selling_price",
        ]);

    const itemTotal = (item) =>
        itemValue(item, [
            "total",
            "line_total",
            "total_price",
            "amount",
            "subtotal",
        ]);

    return (
        <div className="black-gold-slip-page">
            <style>{`
                .black-gold-slip-page {
                    --lux-black: #050505;
                    --lux-panel: #0b0b0b;
                    --lux-gold: #d7b56d;
                    --lux-gold-bright: #f5df9c;
                    --lux-muted: #a9a39a;
                    --lux-border: rgba(215, 181, 109, 0.27);

                    width: 100%;
                    box-sizing: border-box;
                    padding: 36px 16px;
                    color: #f6f0e5;
                    background:
                        radial-gradient(
                            ellipse at 50% 0%,
                            rgba(215, 181, 109, 0.10),
                            transparent 48%
                        ),
                        #050505;
                    font-family:
                        Inter,
                        "Helvetica Neue",
                        Arial,
                        sans-serif;
                }

                .black-gold-slip-page *,
                .black-gold-slip-page *::before,
                .black-gold-slip-page *::after {
                    box-sizing: border-box;
                }

                .black-gold-slip-toolbar {
                    width: 100%;
                    max-width: 760px;
                    margin: 0 auto 18px;
                    display: flex;
                    justify-content: flex-end;
                }

                .black-goldgold-slip-download {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    gap: 10px;
                    padding: 12px 19px;
                    border: 1px solid rgba(215, 181, 109, 0.65);
                    border-radius: 5px;
                    background: linear-gradient(
                        135deg,
                        #f5df9c,
                        #c49b4d
                    );
                    color: #17120a;
                    font-size: 12px;
                    font-weight: 800;
                    letter-spacing: 1.3px;
                    text-transform: uppercase;
                    cursor: pointer;
                    transition:
                        transform 180ms ease,
                        box-shadow 180ms ease;
                }

                .black-goldgold-slip-download:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 24px rgba(215, 181, 109, 0.17);
                }

                .black-gold-slip-download:focus-visible {
                    outline: 2px solid #f5df9c;
                    outline-offset: 4px;
                }

                .black-gold-slip {
                    position: relative;
                    isolation: isolate;
                    overflow: hidden;
                    width: 100%;
                    max-width: 760px;
                    margin: 0 auto;
                    padding: 44px clamp(18px, 5vw, 48px) 32px;
                    background:
                        linear-gradient(
                            135deg,
                            rgba(255, 255, 255, 0.018),
                            transparent 30%
                        ),
                        linear-gradient(
                            180deg,
                            #0b0b0b 0%,
                            #060606 100%
                        );
                    border: 1px solid var(--lux-border);
                    box-shadow:
                        0 0 0 5px rgba(215, 181, 109, 0.025),
                        0 24px 80px rgba(0, 0, 0, 0.55),
                        inset 0 0 50px rgba(215, 181, 109, 0.018);
                }

                .black-gold-slip::before {
                    content: "";
                    position: absolute;
                    z-index: -1;
                    inset: 8px;
                    border: 1px solid rgba(215, 181, 109, 0.10);
                    pointer-events: none;
                }

                .black-gold-slip::after {
                    content: "";
                    position: absolute;
                    z-index: -1;
                    top: -100px;
                    left: -140px;
                    width: 320px;
                    height: 320px;
                    border-radius: 50%;
                    border: 1px solid rgba(215, 181, 109, 0.07);
                    box-shadow:
                        0 0 0 22px rgba(215, 181, 109, 0.015),
                        0 0 0 44px rgba(215, 181, 109, 0.012);
                    pointer-events: none;
                }

                .black-gold-slip-watermark {
                    position: absolute;
                    z-index: -1;
                    top: 38%;
                    left: 50%;
                    width: min(68%, 370px);
                    max-height: 350px;
                    object-fit: contain;
                    opacity: 0.045;
                    filter: grayscale(1);
                    transform: translate(-50%, -50%);
                    pointer-events: none;
                }

                .black-gold-slip-header {
                    text-align: center;
                    padding-bottom: 27px;
                }

                .black-gold-slip-logo-frame {
                    width: 92px;
                    height: 92px;
                    margin: 0 auto 18px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border: 1px solid rgba(215, 181, 109, 0.48);
                    outline: 1px solid rgba(215, 181, 109, 0.12);
                    outline-offset: 5px;
                    background: rgba(215, 181, 109, 0.025);
                    clip-path: polygon(
                        50% 0%,
                        91% 18%,
                        91% 75%,
                        50% 100%,
                        9% 75%,
                        9% 18%
                    );
                }

                .black-gold-slip-logo {
                    display: block;
                    width: 78%;
                    height: 78%;
                    object-fit: contain;
                }

                .black-gold-slip-monogram {
                    color: var(--lux-gold-bright);
                    font-family: Georgia, serif;
                    font-size: 39px;
                    font-weight: 400;
                    line-height: 1;
                }

                .black-gold-slip-brand-name {
                    margin: 0;
                    overflow-wrap: anywhere;
                    color: var(--lux-gold-bright);
                    font-family: Georgia, "Times New Roman", serif;
                    font-size: clamp(25px, 5vw, 37px);
                    font-weight: 400;
                    letter-spacing: 0.19em;
                    line-height: 1.35;
                    text-transform: uppercase;
                }

                .black-gold-slip-brand-name:empty {
                    display: none;
                }

                .black-gold-slip-tagline {
                    margin-top: 7px;
                    color: var(--lux-muted);
                    font-size: 10px;
                    letter-spacing: 0.31em;
                    line-height: 1.8;
                    text-transform: uppercase;
                }

                .black-goldgold-slip-thankyou {
                    margin: 23px 0 0;
                    color: var(--lux-gold);
                    font-family: Georgia, "Times New Roman", serif;
                    font-size: 20px;
                    font-style: italic;
                    line-height: 1.5;
                }

                .black-goldgold-slip-ornament {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 12px;
                    margin: 24px 0;
                    color: var(--lux-gold);
                }

                .black-goldgold-slip-ornament::before,
                .black-gold-slip-ornament::after {
                    content: "";
                    width: 64px;
                    height: 1px;
                    background: linear-gradient(
                        90deg,
                        transparent,
                        var(--lux-gold)
                    );
                }

                .black-gold-slip-ornament::after {
                    transform: rotate(180deg);
                }

                .black-gold-slip-ornament span {
                    width: 7px;
                    height: 7px;
                    border: 1px solid var(--lux-gold);
                    transform: rotate(45deg);
                }

                .black-gold-slip-section {
                    border-top: 1px solid var(--lux-border);
                    padding-top: 19px;
                    margin-top: 19px;
                }

                .black-gold-slip-section-title {
                    margin: 0 0 17px;
                    color: var(--lux-gold);
                    font-size: 10px;
                    font-weight: 700;
                    letter-spacing: 2.2px;
                    line-height: 1.6;
                    text-transform: uppercase;
                }

                .black-gold-slip-meta {
                    display: grid;
                    grid-template-columns: repeat(2, minmax(0, 1fr));
                    gap: 20px;
                }

                .black-gold-slip-meta-block:last-child {
                    text-align: right;
                }

                .black-gold-slip-label {
                    display: block;
                    margin-bottom: 7px;
                    color: var(--lux-muted);
                    font-size: 9px;
                    letter-spacing: 1.3px;
                    line-height: 1.6;
                    text-transform: uppercase;
                }

                .black-gold-slip-value {
                    display: block;
                    color: #eee7da;
                    font-size: 12px;
                    line-height: 1.8;
                    overflow-wrap: anywhere;
                }

                .black-gold-slip-table-wrap {
                    width: 100%;
                    overflow-x: auto;
                }

                .black-gold-slip-table {
                    width: 100%;
                    border-collapse: collapse;
                    font-size: 11px;
                    text-align: left;
                }

                .black-gold-slip-table th {
                    padding: 12px 6px;
                    border-bottom: 1px solid rgba(215, 181, 109, 0.4);
                    color: var(--lux-gold);
                    font-size: 9px;
                    font-weight: 700;
                    letter-spacing: 1px;
                    text-transform: uppercase;
                    white-space: nowrap;
                }

                .black-goldgold-slip-table td {
                    padding: 14px 6px;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.055);
                    color: #e0d9ce;
                    line-height: 1.6;
                    vertical-align: top;
                }

                .black-gold-slip-table th:first-child,
                .black-gold-slip-table td:first-child {
                    padding-left: 0;
                }

                .black-gold-slip-table th:last-child,
                .black-gold-slip-table td:last-child {
                    padding-right: 0;
                }

                .black-gold-slip-number {
                    text-align: center;
                    white-space: nowrap;
                }

                .black-gold-slip-money {
                    text-align: right;
                    white-space: nowrap;
                    font-variant-numeric: tabular-nums;
                }

                .black-gold-slip-product {
                    min-width: 100px;
                    overflow-wrap: anywhere;
                }

                .black-gold-slip-empty {
                    padding: 26px 8px !important;
                    text-align: center;
                    color: var(--lux-muted) !important;
                    font-size: 11px;
                    letter-spacing: 0.5px;
                }

                .black-gold-slip-totals {
                    width: 100%;
                    max-width: 350px;
                    margin: 20px 0 0 auto;
                }

                .black-goldgold-slip-total-row {
                    display: flex;
                    align-items: flex-start;
                    justify-content: space-between;
                    gap: 18px;
                    padding: 7px 0;
                    color: var(--lux-muted);
                    font-size: 11px;
                    line-height: 1.6;
                }

                .black-gold-slip-total-row > :last-child {
                    color: #eee7da;
                    text-align: right;
                    font-variant-numeric: tabular-nums;
                }

                .black-gold-slip-grand-total {
                    margin-top: 10px;
                    padding-top: 16px;
                    border-top: 1px solid rgba(215, 181, 109, 0.45);
                    color: var(--lux-gold-bright);
                    font-family: Georgia, "Times New Roman", serif;
                    font-size: 15px;
                    letter-spacing: 1.5px;
                    text-transform: uppercase;
                }

                .black-gold-slip-grand-total > :last-child {
                    color: var(--lux-gold-bright);
                    font-size: clamp(19px, 4vw, 26px);
                    letter-spacing: 0;
                }

                .black-gold-slip-bottom {
                    display: grid;
                    grid-template-columns: minmax(0, 1fr) minmax(130px, 0.8fr);
                    gap: 24px;
                    align-items: start;
                }

                .black-gold-slip-payment {
                    min-width: 0;
                }

                .black-gold-slip-payment-value {
                    margin: 0 0 13px;
                    color: #eee7da;
                    font-size: 12px;
                    line-height: 1.8;
                    overflow-wrap: anywhere;
                }

                .black-gold-slip-qr-column {
                    min-width: 0;
                    text-align: center;
                }

                .black-gold-slip-qr-frame {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 100%;
                    max-width: 180px;
                    aspect-ratio: 1;
                    margin: 0 auto;
                    padding: 10px;
                    border: 1px solid rgba(215, 181, 109, 0.65);
                    background: #f5f0e6;
                    box-shadow: 0 0 22px rgba(215, 181, 109, 0.06);
                }

                .black-gold-slip-qr {
                    display: block;
                    width: 100%;
                    height: 100%;
                    object-fit: contain;
                }

                .black-gold-slip-qr-empty {
                    color: #766345;
                    font-size: 10px;
                    line-height: 1.6;
                    letter-spacing: 0.8px;
                    text-transform: uppercase;
                }

                .black-gold-slip-qr-caption {
                    margin-top: 13px;
                    color: var(--lux-gold);
                    font-size: 9px;
                    letter-spacing: 1.6px;
                    line-height: 1.7;
                    text-transform: uppercase;
                }

                .black-gold-slip-qr-link {
                    display: inline-block;
                    margin-top: 7px;
                    color: var(--lux-muted);
                    font-size: 10px;
                    text-decoration: underline;
                    text-underline-offset: 3px;
                    overflow-wrap: anywhere;
                }

                .black-gold-slip-footer {
                    margin-top: 30px;
                    padding-top: 22px;
                    border-top: 1px solid var(--lux-border);
                    text-align: center;
                }

                .black-gold-slip-footer-mark {
                    margin-bottom: 9px;
                    color: var(--lux-gold);
                    font-family: Georgia, serif;
                    font-size: 19px;
                }

                .black-gold-slip-footer-message {
                    margin: 0;
                    color: var(--lux-gold);
                    font-family: Georgia, "Times New Roman", serif;
                    font-size: 11px;
                    letter-spacing: 2.7px;
                    line-height: 1.9;
                    text-transform: uppercase;
                }

                .black-gold-slip-footer-note {
                    margin: 10px 0 0;
                    color: #77716a;
                    font-size: 9px;
                    line-height: 1.8;
                    letter-spacing: 0.6px;
                }

                @media (min-width: 900px) {
                    .black-gold-slip {
                        padding-top: 52px;
                        padding-bottom: 40px;
                    }
                }

                @media (max-width: 520px) {
                    .black-gold-slip-page {
                        padding: 20px 8px;
                    }

                    .black-gold-slip {
                        padding: 32px 17px 24px;
                    }

                    .black-gold-slip-brand-name {
                        letter-spacing: 0.12em;
                    }

                    .black-gold-slip-tagline {
                        letter-spacing: 0.18em;
                    }

                    .black-goldgold-slip-thankyou {
                        font-size: 18px;
                    }

                    .black-gold-slip-meta {
                        gap: 12px;
                    }

                    .black-gold-slip-value {
                        font-size: 11px;
                    }

                    .black-goldgold-slip-table {
                        font-size: 10px;
                    }

                    .black-goldgold-slip-table th {
                        font-size: 8px;
                        letter-spacing: 0.5px;
                    }

                    .black-gold-slip-table th,
                    .black-gold-slip-table td {
                        padding-left: 4px;
                        padding-right: 4px;
                    }

                    .black-gold-slip-bottom {
                        grid-template-columns: minmax(0, 1fr);
                        gap: 25px;
                    }

                    .black-gold-slip-qr-column {
                        width: 100%;
                    }

                    .black-gold-slip-qr-frame {
                        max-width: 155px;
                    }
                }

                @media print {
                    @page {
                        margin: 8mm;
                        size: auto;
                    }

                    .black-gold-slip-page {
                        padding: 0;
                        background: #fff;
                        print-color-adjust: exact;
                        -webkit-print-color-adjust: exact;
                    }

                    .black-gold-slip-toolbar {
                        display: none !important;
                    }

                    .black-gold-slip {
                        max-width: none;
                        border: 1px solid #b99a5b;
                        box-shadow: none;
                        break-inside: avoid;
                        print-color-adjust: exact;
                        -webkit-print-color-adjust: exact;
                    }

                    .black-gold-slip-watermark {
                        print-color-adjust: exact;
                        -webkit-print-color-adjust: exact;
                    }
                }

                @media (prefers-reduced-motion: reduce) {
                    .black-gold-slip-download {
                        transition: none;
                    }
                }
            `}</style>

            <div className="black-goldgold-slip-toolbar">
                <button
                    type="button"
                    className="black-gold-slip-download"
                    onClick={handleDownload}
                >
                    <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                    >
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <path d="m7 10 5 5 5-5" />
                        <path d="M12 15V3" />
                    </svg>
                    Download Till Slip
                </button>
            </div>

            <article
                className="black-gold-slip"
                aria-label="Digital till slip"
            >
                {watermarkUrl && (
                    <img
                        className="black-gold-slip-watermark"
                        src={watermarkUrl}
                        alt=""
                        aria-hidden="true"
                    />
                )}

                {/* MERCHANT BRANDING */}

                <header className="black-gold-slip-header">
                    <div className="black-gold-slip-logo-frame">
                        {logoUrl ? (
                            <img
                                className="black-goldgold-slip-logo"
                                src={logoUrl}
                                alt="Merchant logo"
                            />
                        ) : (
                            <span
                                className="black-gold-slip-monogram"
                                aria-hidden="true"
                            >
                                ✦
                            </span>
                        )}
                    </div>

                    <h1 className="black-gold-slip-brand-name">
                        {settings?.business_name ??
                            settings?.merchant_name ??
                            ""}
                    </h1>

                    {settings?.tagline && (
                        <div className="black-gold-slip-tagline">
                            {settings.tagline}
                        </div>
                    )}

                    <p className="black-gold-slip-thankyou">
                        {settings?.thank_you_message || ""}
                    </p>

                    <div
                        className="black-gold-slip-ornament"
                        aria-hidden="true"
                    >
                        <span />
                    </div>
                </header>

                {/* TRANSACTION DETAILS */}

                <section
                    className="black-gold-slip-section"
                    aria-label="Transaction details"
                >
                    <div className="black-gold-slip-meta">
                        <div className="black-gold-slip-meta-block">
                            <span className="black-gold-slip-label">
                                Transaction date
                            </span>

                            <span className="black-gold-slip-value">
                                {formattedTransactionDate}
                            </span>
                        </div>

                        <div className="black-gold-slip-meta-block">
                            <span className="black-gold-slip-label">
                                Receipt number
                            </span>

                            <span className="black-gold-slip-value">
                                {slipNumber}
                            </span>
                        </div>
                    </div>

                    {customerName && (
                        <div style={{ marginTop: 18 }}>
                            <span className="black-gold-slip-label">
                                Customer
                            </span>

                            <span className="black-gold-slip-value">
                                {customerName}
                            </span>
                        </div>
                    )}
                </section>

                {/* ITEMIZED PURCHASES */}

                <section
                    className="black-gold-slip-section"
                    aria-label="Purchased items"
                >
                    <h2 className="black-gold-slip-section-title">
                        Purchase details
                    </h2>

                    <div className="black-gold-slip-table-wrap">
                        <table className="black-gold-slip-table">
                            <thead>
                                <tr>
                                    <th scope="col">Item</th>
                                    <th
                                        scope="col"
                                        className="black-gold-slip-number"
                                    >
                                        Qty
                                    </th>
                                    <th
                                        scope="col"
                                        className="black-gold-slip-money"
                                    >
                                        Price
                                    </th>
                                    <th
                                        scope="col"
                                        className="black-gold-slip-money"
                                    >
                                        Total
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {receiptDataItems.length > 0 ? (
                                    receiptDataItems.map((item, index) => (
                                        <tr
                                            key={
                                                item?.id ??
                                                item?.product_id ??
                                                `${itemName(item)}-${index}`
                                            }
                                        >
                                            <td className="black-gold-slip-product">
                                                {itemName(item)}
                                            </td>

                                            <td className="black-gold-slip-number">
                                                {itemQuantity(item)}
                                            </td>

                                            <td className="black-gold-slip-money">
                                                {formatCurrency(
                                                    itemPrice(item)
                                                )}
                                            </td>

                                            <td className="black-gold-slip-money">
                                                {formatCurrency(
                                                    itemTotal(item)
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan={4}
                                            className="black-goldgold-slip-empty"
                                        >
                                            No item details available.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* TOTALS */}

                    <div className="black-gold-slip-totals">
                        {subtotal !== null && subtotal !== "" && (
                            <div className="black-gold-slip-total-row">
                                <span>Subtotal</span>
                                <span>
                                    {formatCurrency(subtotal)}
                                </span>
                            </div>
                        )}

                        {discount !== null &&
                            discount !== "" &&
                            Number(
                                String(discount).replace(/,/g, "")
                            ) !== 0 && (
                                <div className="black-gold-slip-total-row">
                                    <span>Discount</span>
                                    <span>
                                        {formatCurrency(discount)}
                                    </span>
                                </div>
                            )}

                        {vat !== null && vat !== "" && (
                            <div className="black-gold-slip-total-row">
                                <span>VAT</span>
                                <span>{formatCurrency(vat)}</span>
                            </div>
                        )}

                        <div className="black-gold-slip-total-row black-gold-slip-grand-total">
                            <span>Total</span>
                            <span>{formatCurrency(total)}</span>
                        </div>
                    </div>
                </section>

                {/* PAYMENT AND QR CODE */}

                <section
                    className="black-gold-slip-section"
                    aria-label="Payment and verification"
                >
                    <div className="black-gold-slip-bottom">
                        <div className="black-gold-slip-payment">
                            <h2 className="black-gold-slip-section-title">
                                Payment details
                            </h2>

                            {paymentMethod && (
                                <>
                                    <span className="black-goldgold-slip-label">
                                        Payment method
                                    </span>

                                    <p className="black-gold-slip-payment-value">
                                        {paymentMethod}
                                    </p>
                                </>
                            )}

                            {paymentReference && (
                                <>
                                    <span className="black-gold-slip-label">
                                        Payment reference
                                    </span>

                                    <p className="black-gold-slip-payment-value">
                                        {paymentReference}
                                    </p>
                                </>
                            )}

                            {receiptData?.payment_status && (
                                <>
                                    <span className="black-gold-slip-label">
                                        Payment status
                                    </span>

                                    <p className="black-gold-slip-payment-value">
                                        {receiptData.payment_status}
                                    </p>
                                </>
                            )}

                            {receiptData?.currency && (
                                <>
                                    <span className="black-gold-slip-label">
                                        Currency
                                    </span>

                                    <p className="black-gold-slip-payment-value">
                                        {receiptData.currency}
                                    </p>
                                </>
                            )}
                        </div>

                        <div className="black-goldgold-slip-qr-column">
                            <div className="black-gold-slip-qr-frame">
                                {qrCodeUrl ? (
                                    <img
                                        className="black-gold-slip-qr"
                                        src={qrCodeUrl}
                                        alt="Receipt QR code"
                                    />
                                ) : (
                                    <span className="black-gold-slip-qr-empty">
                                        QR code not provided
                                    </span>
                                )}
                            </div>

                            <div className="black-gold-slip-qr-caption">
                                Scan to verify
                            </div>

                            {checkoutPayloadLink && (
                                <a
                                    className="black-gold-slip-qr-link"
                                    href={checkoutPayloadLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Open receipt link
                                </a>
                            )}
                        </div>
                    </div>
                </section>

                {/* MERCHANT FOOTER */}

                <footer className="black-gold-slip-footer">
                    <div
                        className="black-gold-slip-footer-mark"
                        aria-hidden="true"
                    >
                        ✦
                    </div>

                    <p className="black-gold-slip-footer-message">
                        {settings?.footer_message || ""}
                    </p>

                    {settings?.website && (
                        <p className="black-gold-slip-footer-note">
                            {settings.website}
                        </p>
                    )}

                    {settings?.contact_email && (
                        <p className="black-gold-slip-footer-note">
                            {settings.contact_email}
                        </p>
                    )}

                    {settings?.phone && (
                        <p className="black-gold-slip-footer-note">
                            {settings.phone}
                        </p>
                    )}
                </footer>
            </article>
        </div>
    );
}
