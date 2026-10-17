
import React from "react";

/* ================================================================
   LUXURY TILL SLIP — BACKEND LOGIC
   Preserved from the supplied implementation.
   ================================================================ */

export function useLuxuryTillSlipBackend({
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

        if (resolvedCurrencySymbol && raw.startsWith(resolvedCurrencySymbol)) {
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
                "LuxuryTillSlip: onDownload handler was not supplied."
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
   LUXURY MINIMALISM — VISUAL COMPONENT
   No simulator fields or hardcoded merchant identity.
   ================================================================ */

export default function LuxuryTillSlip({
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
    } = useLuxuryTillSlipBackend({
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

    /* ---------------------------------------------------------------
       Merchant information comes from real application data.
       No editable simulator inputs are created here.
       --------------------------------------------------------------- */

    const merchantName =
        settings?.business_name ||
        settings?.company_name ||
        settings?.merchant_name ||
        receiptData?.business_name ||
        receiptData?.company_name ||
        receiptData?.merchant_name ||
        "";

    const merchantAddress =
        settings?.business_address ||
        settings?.company_address ||
        settings?.address ||
        receiptData?.business_address ||
        receiptData?.company_address ||
        receiptData?.address ||
        "";

    const merchantEmail =
        settings?.business_email ||
        settings?.company_email ||
        settings?.email ||
        receiptData?.business_email ||
        receiptData?.company_email ||
        receiptData?.email ||
        "";

    const merchantPhone =
        settings?.business_phone ||
        settings?.company_phone ||
        settings?.phone ||
        receiptData?.business_phone ||
        receiptData?.company_phone ||
        receiptData?.phone ||
        "";

    const transactionReference =
        receiptId ||
        receiptData?.receipt_id ||
        receiptData?.transaction_id ||
        receiptData?.id ||
        "";

    const discountValue =
        voucher?.discount_percentage ??
        voucher?.discount_percent ??
        voucher?.discount ??
        voucher?.percentage ??
        null;

    const voucherLabel =
        voucher?.code ||
        voucher?.voucher_code ||
        voucher?.name ||
        "";

    const hasVoucher = Boolean(voucher || qrCodeUrl || checkoutPayloadLink);

    const discountText =
        discountValue !== null && discountValue !== undefined
            ? `${String(discountValue).replace(/%$/, "")}%`
            : "";

    const getItemName = (item) =>
        item?.name ||
        item?.product_name ||
        item?.description ||
        item?.title ||
        "Item";

    const getItemQuantity = (item) =>
        item?.quantity ??
        item?.qty ??
        1;

    const getItemPrice = (item) => {
        const explicitTotal =
            item?.subtotal ??
            item?.line_total ??
            item?.total_price ??
            item?.total;

        if (explicitTotal !== null && explicitTotal !== undefined) {
            return explicitTotal;
        }

        const price =
            item?.price ??
            item?.unit_price ??
            item?.amount ??
            "";

        const quantity = Number(getItemQuantity(item));
        const numericPrice = Number(
            String(price).replace(/,/g, "")
        );

        if (
            price !== "" &&
            Number.isFinite(numericPrice) &&
            Number.isFinite(quantity)
        ) {
            return numericPrice * quantity;
        }

        return price;
    };

    const displayTotal = formatCurrency(total);

    const displayVat =
        vat !== null && vat !== undefined && vat !== ""
            ? formatCurrency(vat)
            : "";

    const displayDate = formattedTransactionDate;

    return (
        <div className="luxury-slip-shell">
            <style>{`
                .luxury-slip-shell {
                    --luxury-ink: #20201e;
                    --luxury-muted: #85827c;
                    --luxury-gold: #ad8950;
                    --luxury-gold-light: #d5bd8b;
                    --luxury-paper: #fffefa;
                    --luxury-line: #e9e2d7;

                    width: 100%;
                    box-sizing: border-box;
                    padding: 28px 14px;
                    color: var(--luxury-ink);
                    background:
                        radial-gradient(
                            ellipse at 50% 0%,
                            rgba(255,255,255,0.98),
                            rgba(239,235,226,0.92) 75%
                        );
                    font-family:
                        Inter, -apple-system, BlinkMacSystemFont,
                        "Segoe UI", sans-serif;
                }

                .luxury-slip-shell *,
                .luxury-slip-shell *::before,
                .luxury-slip-shell *::after {
                    box-sizing: border-box;
                }

                .luxury-slip-card {
                    position: relative;
                    isolation: isolate;
                    width: 100%;
                    max-width: 690px;
                    margin: 0 auto;
                    overflow: hidden;
                    padding: clamp(24px, 5.5vw, 48px);
                    border: 1px solid rgba(173,137,80,0.20);
                    border-radius: 27px;
                    background: var(--luxury-paper);
                    box-shadow:
                        0 20px 55px rgba(46,37,23,0.09),
                        0 3px 12px rgba(46,37,23,0.035);
                }

                .luxury-slip-watermark {
                    position: absolute;
                    z-index: -1;
                    left: 50%;
                    top: 43%;
                    width: min(64%, 330px);
                    max-height: 350px;
                    object-fit: contain;
                    transform: translate(-50%, -50%);
                    opacity: 0.035;
                    pointer-events: none;
                    filter: grayscale(1);
                }

                .luxury-slip-topline {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 13px;
                    color: var(--luxury-muted);
                    font-size: 9px;
                    font-weight: 600;
                    letter-spacing: 0.30em;
                    line-height: 1.8;
                    text-align: center;
                    text-transform: uppercase;
                }

                .luxury-slip-topline::before,
                .luxury-slip-topline::after {
                    content: "";
                    height: 1px;
                    flex: 1;
                    background: var(--luxury-line);
                }

                .luxury-slip-brand {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    text-align: center;
                    padding: 27px 0 25px;
                }

                .luxury-slip-logo {
                    display: block;
                    width: 88px;
                    height: 88px;
                    margin-bottom: 18px;
                    object-fit: contain;
                    border-radius: 50%;
                }

                .luxury-slip-monogram {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 76px;
                    height: 76px;
                    margin-bottom: 20px;
                    border: 1px solid var(--luxury-gold-light);
                    border-radius: 50%;
                    color: var(--luxury-gold);
                    font-family: Georgia, "Times New Roman", serif;
                    font-size: 32px;
                }

                .luxury-slip-business-name {
                    margin: 0;
                    color: var(--luxury-ink);
                    font-family: Georgia, "Times New Roman", serif;
                    font-size: clamp(25px, 5vw, 36px);
                    font-weight: 400;
                    letter-spacing: 0.045em;
                    line-height: 1.25;
                    overflow-wrap: anywhere;
                }

                .luxury-slip-gold-rule {
                    width: 82px;
                    height: 1px;
                    margin: 19px auto 17px;
                    background: var(--luxury-gold);
                }

                .luxury-slip-contact {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 8px;
                    max-width: 100%;
                    color: #65615b;
                    font-size: 12px;
                    line-height: 1.7;
                    text-align: center;
                    overflow-wrap: anywhere;
                }

                .luxury-slip-contact:empty {
                    display: none;
                }

                .luxury-slip-meta {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    gap: 15px;
                    padding: 20px 0;
                    border-top: 1px solid var(--luxury-line);
                    border-bottom: 1px solid var(--luxury-line);
                }

                .luxury-slip-verified {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    padding: 9px 12px;
                    border: 1px solid #e8ddc8;
                    border-radius: 999px;
                    color: #866a3d;
                    font-size: 9px;
                    font-weight: 700;
                    letter-spacing: 0.13em;
                    text-transform: uppercase;
                    white-space: nowrap;
                }

                .luxury-slip-check {
                    display: inline-flex;
                    width: 17px;
                    height: 17px;
                    align-items: center;
                    justify-content: center;
                    border-radius: 50%;
                    background: var(--luxury-gold);
                    color: white;
                    font-size: 11px;
                }

                .luxury-slip-transaction {
                    display: flex;
                    flex-direction: column;
                    gap: 6px;
                    text-align: right;
                    overflow-wrap: anywhere;
                }

                .luxury-slip-label {
                    color: var(--luxury-muted);
                    font-size: 9px;
                    font-weight: 700;
                    letter-spacing: 0.18em;
                    text-transform: uppercase;
                }

                .luxury-slip-date {
                    font-size: 12px;
                    line-height: 1.6;
                    font-variant-numeric: tabular-nums;
                }

                .luxury-slip-reference {
                    color: var(--luxury-muted);
                    font-size: 10px;
                }

                .luxury-slip-section {
                    padding-top: 27px;
                }

                .luxury-slip-section-title {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 14px;
                    margin: 0 0 22px;
                    color: #8b6b3c;
                    font-size: 10px;
                    font-weight: 700;
                    letter-spacing: 0.25em;
                    text-align: center;
                    text-transform: uppercase;
                }

                .luxury-slip-section-title::before,
                .luxury-slip-section-title::after {
                    content: "";
                    height: 1px;
                    flex: 1;
                    background: var(--luxury-line);
                }

                .luxury-slip-item {
                    display: grid;
                    grid-template-columns: 35px minmax(0, 1fr) auto;
                    align-items: start;
                    gap: 10px;
                    padding: 17px 0;
                    border-bottom: 1px solid var(--luxury-line);
                }

                .luxury-slip-item:last-child {
                    border-bottom: 0;
                }

                .luxury-slip-item-number {
                    padding-top: 2px;
                    color: var(--luxury-gold);
                    font-family: Georgia, "Times New Roman", serif;
                    font-size: 15px;
                }

                .luxury-slip-item-name {
                    color: #292824;
                    font-size: 13px;
                    font-weight: 500;
                    line-height: 1.65;
                    overflow-wrap: anywhere;
                }

                .luxury-slip-item-detail {
                    margin-top: 4px;
                    color: var(--luxury-muted);
                    font-size: 11px;
                    line-height: 1.5;
                }

                .luxury-slip-item-price {
                    padding-top: 2px;
                    color: #45423c;
                    font-size: 12px;
                    font-variant-numeric: tabular-nums;
                    text-align: right;
                    white-space: nowrap;
                }

                .luxury-slip-empty {
                    padding: 25px 10px;
                    color: var(--luxury-muted);
                    font-size: 12px;
                    text-align: center;
                }

                .luxury-slip-total {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 15px;
                    margin-top: 19px;
                    padding: 24px 20px;
                    border: 1px solid #e7ddcc;
                    border-radius: 12px;
                    background: linear-gradient(
                        120deg,
                        #fffefa,
                        #faf6ee
                    );
                }

                .luxury-slip-total-label {
                    color: #33312c;
                    font-family: Georgia, "Times New Roman", serif;
                    font-size: 13px;
                    letter-spacing: 0.11em;
                }

                .luxury-slip-total-amount {
                    color: #9b763f;
                    font-family: Georgia, "Times New Roman", serif;
                    font-size: clamp(22px, 4.5vw, 30px);
                    font-weight: 400;
                    font-variant-numeric: tabular-nums;
                    text-align: right;
                    overflow-wrap: anywhere;
                }

                .luxury-slip-vat {
                    display: flex;
                    justify-content: space-between;
                    gap: 12px;
                    padding: 13px 3px 0;
                    color: var(--luxury-muted);
                    font-size: 11px;
                }

                .luxury-slip-voucher {
                    margin-top: 31px;
                    padding: 27px 20px;
                    border: 1px solid var(--luxury-line);
                    border-radius: 18px;
                    background: #fffefa;
                    text-align: center;
                }

                .luxury-slip-gift-icon {
                    display: flex;
                    width: 46px;
                    height: 46px;
                    align-items: center;
                    justify-content: center;
                    margin: 0 auto 15px;
                    border: 1px solid var(--luxury-gold-light);
                    border-radius: 50%;
                    color: var(--luxury-gold);
                    font-family: Georgia, "Times New Roman", serif;
                    font-size: 23px;
                }

                .luxury-slip-voucher-heading {
                    margin: 0 0 20px;
                    color: #8b6b3c;
                    font-size: 9px;
                    font-weight: 700;
                    letter-spacing: 0.20em;
                    line-height: 1.8;
                    text-transform: uppercase;
                }

                .luxury-slip-qr {
                    display: block;
                    width: 142px;
                    height: 142px;
                    margin: 0 auto 18px;
                    padding: 9px;
                    border: 1px solid #eee7da;
                    border-radius: 10px;
                    background: #fff;
                    object-fit: contain;
                }

                .luxury-slip-qr-placeholder {
                    display: flex;
                    width: 142px;
                    height: 142px;
                    align-items: center;
                    justify-content: center;
                    margin: 0 auto 18px;
                    padding: 18px;
                    border: 1px dashed #d8c7a7;
                    border-radius: 10px;
                    color: var(--luxury-muted);
                    font-size: 11px;
                    line-height: 1.7;
                }

                .luxury-slip-claim {
                    margin: 0 0 10px;
                    color: #302e29;
                    font-family: Georgia, "Times New Roman", serif;
                    font-size: 13px;
                    letter-spacing: 0.12em;
                }

                .luxury-slip-voucher-description {
                    max-width: 340px;
                    margin: 0 auto;
                    color: var(--luxury-muted);
                    font-size: 12px;
                    line-height: 1.9;
                    overflow-wrap: anywhere;
                }

                .luxury-slip-discount {
                    color: #98723b;
                    font-weight: 700;
                }

                .luxury-slip-code {
                    margin-top: 13px;
                    color: #78613e;
                    font-size: 11px;
                    letter-spacing: 0.08em;
                    overflow-wrap: anywhere;
                }

                .luxury-slip-expiry {
                    margin-top: 22px;
                    padding-top: 18px;
                    border-top: 1px dashed #e6ddce;
                    color: var(--luxury-muted);
                    font-size: 10px;
                    line-height: 1.8;
                    letter-spacing: 0.07em;
                    text-transform: uppercase;
                }

                .luxury-slip-expiry strong {
                    color: #96703b;
                }

                .luxury-slip-expiry.is-expired,
                .luxury-slip-expiry.is-expired strong {
                    color: #a64b43;
                }

                .luxury-slip-download {
                    display: flex;
                    width: 100%;
                    min-height: 57px;
                    align-items: center;
                    justify-content: center;
                    gap: 12px;
                    margin-top: 27px;
                    padding: 17px 16px;
                    border: 1px solid #9c7a47;
                    border-radius: 9px;
                    background: #242320;
                    color: #e4c995;
                    font-family: inherit;
                    font-size: 10px;
                    font-weight: 700;
                    letter-spacing: 0.15em;
                    line-height: 1.7;
                    text-align: center;
                    text-transform: uppercase;
                    cursor: pointer;
                    transition:
                        background 180ms ease,
                        color 180ms ease,
                        box-shadow 180ms ease,
                        transform 180ms ease;
                }

                .luxury-slip-download:hover {
                    background: #39352d;
                    color: #f5e7c7;
                    box-shadow: 0 8px 20px rgba(63,48,25,0.12);
                }

                .luxury-slip-download:active {
                    transform: scale(0.99);
                }

                .luxury-slip-download:focus-visible {
                    outline: 2px solid var(--luxury-gold);
                    outline-offset: 4px;
                }

                .luxury-slip-download-icon {
                    font-size: 19px;
                    font-weight: 400;
                }

                .luxury-slip-footer {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 9px;
                    margin-top: 23px;
                    color: #a39a8b;
                    font-size: 8px;
                    letter-spacing: 0.22em;
                    text-align: center;
                    text-transform: uppercase;
                }

                .luxury-slip-footer::before,
                .luxury-slip-footer::after {
                    content: "";
                    width: 18px;
                    height: 1px;
                    background: #e7dfd2;
                }

                @media (max-width: 480px) {
                    .luxury-slip-shell {
                        padding: 12px 7px;
                    }

                    .luxury-slip-card {
                        padding: 23px 17px;
                        border-radius: 19px;
                    }

                    .luxury-slip-topline {
                        gap: 8px;
                        font-size: 8px;
                        letter-spacing: 0.17em;
                    }

                    .luxury-slip-meta {
                        gap: 10px;
                    }

                    .luxury-slip-verified {
                        gap: 6px;
                        padding: 8px;
                        font-size: 8px;
                        letter-spacing: 0.06em;
                    }

                    .luxury-slip-date {
                        font-size: 10px;
                    }

                    .luxury-slip-reference {
                        font-size: 9px;
                    }

                    .luxury-slip-item {
                        grid-template-columns: 25px minmax(0, 1fr) auto;
                        gap: 7px;
                    }

                    .luxury-slip-item-name {
                        font-size: 12px;
                    }

                    .luxury-slip-item-price {
                        font-size: 11px;
                    }

                    .luxury-slip-total {
                        padding: 19px 14px;
                    }

                    .luxury-slip-total-label {
                        font-size: 11px;
                    }

                    .luxury-slip-voucher {
                        padding: 24px 13px;
                    }

                    .luxury-slip-download {
                        font-size: 9px;
                        letter-spacing: 0.09em;
                    }
                }

                @media print {
                    .luxury-slip-shell {
                        padding: 0;
                        background: #fff;
                    }

                    .luxury-slip-card {
                        max-width: none;
                        border: 0;
                        border-radius: 0;
                        box-shadow: none;
                    }

                    .luxury-slip-download {
                        display: none;
                    }

                    .luxury-slip-watermark {
                        opacity: 0.035;
                    }
                }

                @media (prefers-reduced-motion: reduce) {
                    .luxury-slip-download {
                        transition: none;
                    }
                }
            `}</style>

            <article className="luxury-slip-card">
                {watermarkUrl && (
                    <img
                        className="luxury-slip-watermark"
                        src={watermarkUrl}
                        alt=""
                        aria-hidden="true"
                    />
                )}

                <div className="luxury-slip-topline">
                    <span>Digital Transaction Receipt</span>
                </div>

                {/* Merchant identity is supplied by real application data. */}
                <header className="luxury-slip-brand">
                    {logoUrl ? (
                        <img
                            className="luxury-slip-logo"
                            src={logoUrl}
                            alt={merchantName ? `${merchantName} logo` : "Merchant logo"}
                        />
                    ) : (
                        <div
                            className="luxury-slip-monogram"
                            aria-hidden="true"
                        >
                            {merchantName
                                ? merchantName
                                    .trim()
                                    .split(/\s+/)
                                    .slice(0, 2)
                                    .map((word) => word[0])
                                    .join("")
                                    .toUpperCase()
                                : "✦"}
                        </div>
                    )}

                    {merchantName && (
                        <>
                            <h1 className="luxury-slip-business-name">
                                {merchantName}
                            </h1>
                            <div className="luxury-slip-gold-rule" />
                        </>
                    )}

                    <div className="luxury-slip-contact">
                        {merchantAddress && <div>{merchantAddress}</div>}
                        {merchantEmail && <div>{merchantEmail}</div>}
                        {merchantPhone && <div>{merchantPhone}</div>}
                    </div>
                </header>

                <section
                    className="luxury-slip-meta"
                    aria-label="Transaction information"
                >
                    <div className="luxury-slip-verified">
                        <span className="luxury-slip-check" aria-hidden="true">
                            ✓
                        </span>
                        Verified Mode
                    </div>

                    <div className="luxury-slip-transaction">
                        <span className="luxury-slip-label">
                            Transaction
                        </span>

                        <time className="luxury-slip-date">
                            {displayDate}
                        </time>

                        {transactionReference && (
                            <span className="luxury-slip-reference">
                                Ref. {transactionReference}
                            </span>
                        )}
                    </div>
                </section>

                <section
                    className="luxury-slip-section"
                    aria-label="Purchased items"
                >
                    <h2 className="luxury-slip-section-title">
                        Items Purchased
                    </h2>

                    {receiptDataItems.length > 0 ? (
                        <div>
                            {receiptDataItems.map((item, index) => (
                                <div
                                    className="luxury-slip-item"
                                    key={
                                        item?.id ??
                                        item?.product_id ??
                                        `${getItemName(item)}-${index}`
                                    }
                                >
                                    <span className="luxury-slip-item-number">
                                        {String(index + 1).padStart(2, "0")}
                                    </span>

                                    <div>
                                        <div className="luxury-slip-item-name">
                                            {getItemName(item)}
                                        </div>

                                        <div className="luxury-slip-item-detail">
                                            Qty: {getItemQuantity(item)}
                                            {item?.variant
                                                ? ` · ${item.variant}`
                                                : ""}
                                        </div>
                                    </div>

                                    <div className="luxury-slip-item-price">
                                        {formatCurrency(getItemPrice(item))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="luxury-slip-empty">
                            No purchased items available.
                        </div>
                    )}
                </section>

                <section aria-label="Receipt total">
                    <div className="luxury-slip-total">
                        <span className="luxury-slip-total-label">
                            Total Due
                        </span>

                        <span className="luxury-slip-total-amount">
                            {displayTotal || "—"}
                        </span>
                    </div>

                    {displayVat && (
                        <div className="luxury-slip-vat">
                            <span>VAT</span>
                            <span>{displayVat}</span>
                        </div>
                    )}
                </section>

                {hasVoucher && (
                    <section
                        className="luxury-slip-voucher"
                        aria-label="Voucher and discount"
                    >
                        <div className="luxury-slip-gift-icon" aria-hidden="true">
                            ♧
                        </div>

                        <h2 className="luxury-slip-voucher-heading">
                            A Little Something Extra
                        </h2>

                        {qrCodeUrl ? (
                            <img
                                className="luxury-slip-qr"
                                src={qrCodeUrl}
                                alt="Scan to access the voucher"
                            />
                        ) : checkoutPayloadLink ? (
                            <a
                                href={checkoutPayloadLink}
                                target="_blank"
                                rel="noreferrer"
                                aria-label="Open voucher checkout link"
                            >
                                <div className="luxury-slip-qr-placeholder">
                                    Open your voucher
                                </div>
                            </a>
                        ) : (
                            <div className="luxury-slip-qr-placeholder">
                                Voucher QR unavailable
                            </div>
                        )}

                        <h3 className="luxury-slip-claim">
                            {voucherLabel || "Claim Your Discount"}
                        </h3>

                        <p className="luxury-slip-voucher-description">
                            {discountText ? (
                                <>
                                    Enjoy a special{" "}
                                    <span className="luxury-slip-discount">
                                        {discountText} discount
                                    </span>
                                    {voucher?.description
                                        ? ` — ${voucher.description}`
                                        : " on your next eligible purchase."}
                                </>
                            ) : (
                                voucher?.description ||
                                "Your voucher details are ready to explore."
                            )}
                        </p>

                        {voucher?.code && (
                            <div className="luxury-slip-code">
                                Voucher code: {voucher.code}
                            </div>
                        )}

                        <div
                            className={`luxury-slip-expiry ${isExpired ? "is-expired" : ""
                                }`}
                        >
                            {isExpired ? (
                                <>
                                    Voucher status: <strong>Expired</strong>
                                </>
                            ) : (
                                <>
                                    Expires in:{" "}
                                    <strong>
                                        {daysRemaining}{" "}
                                        {daysRemaining === 1 ? "day" : "days"}
                                    </strong>
                                </>
                            )}
                        </div>
                    </section>
                )}

                <button
                    type="button"
                    className="luxury-slip-download"
                    onClick={handleDownload}
                >
                    <span
                        className="luxury-slip-download-icon"
                        aria-hidden="true"
                    >
                        ↓
                    </span>
                    Download Official Invoice PDF
                </button>

                <footer className="luxury-slip-footer">
                    End of Transaction
                </footer>
            </article>
        </div>
    );
}
