import React from "react";

/**
 * GraffitiTillSlip.jsx
 * Black + gold graffiti digital till slip.
 *
 * Existing backend props and receipt-processing logic are preserved.
 * No simulator inputs are added for business name, logo, or QR code.
 */

export default function GraffitiTillSlip({
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
       RECEIPT DATA PROCESSING — PRESERVED
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
       BRAND ASSET LOGIC — PRESERVED
       ================================================================ */

    const logoUrl = settings?.logo_url || "";

    const watermarkUrl =
        receiptData?.watermark_url ||
        settings?.watermark_url ||
        logoUrl ||
        "";

    /* ================================================================
       CURRENCY DISPLAY LOGIC — PRESERVED
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
       DOWNLOAD HANDLER — PRESERVED
       ================================================================ */

    const handleDownload = (event) => {
        if (event) {
            event.preventDefault();
        }

        if (typeof onDownload === "function") {
            onDownload();
        } else {
            console.warn(
                "GraffitiTillSlip: onDownload handler was not supplied."
            );
        }
    };

    /* ================================================================
       LIVE BUSINESS INFORMATION
       No simulator inputs or hardcoded merchant identity.
       Adjust these mappings only if your app uses different field names.
       ================================================================ */

    const businessName =
        settings?.business_name ||
        settings?.businessName ||
        receiptData?.business_name ||
        receiptData?.businessName ||
        user?.business_name ||
        user?.businessName ||
        user?.business?.name ||
        "";

    const businessAddress =
        settings?.business_address ||
        settings?.address ||
        receiptData?.business_address ||
        user?.business?.address ||
        "";

    const businessPhone =
        settings?.business_phone ||
        settings?.phone ||
        receiptData?.business_phone ||
        "";

    const businessEmail =
        settings?.business_email ||
        settings?.email ||
        receiptData?.business_email ||
        "";

    const receiptNumber =
        receiptId ||
        receiptData?.receipt_id ||
        receiptData?.receipt_number ||
        receiptData?.id ||
        "";

    const qrSource = qrCodeUrl || "";

    const transactionItems = receiptDataItems.map((item, index) => {
        const quantity = Number(
            item?.quantity ?? item?.qty ?? 1
        );

        const unitPrice =
            item?.unit_price ??
            item?.price ??
            item?.amount ??
            "";

        const lineTotal =
            item?.total ??
            item?.line_total ??
            item?.subtotal ??
            (
                unitPrice !== "" &&
                    Number.isFinite(Number(unitPrice))
                    ? Number(unitPrice) * quantity
                    : ""
            );

        return {
            key: item?.id ?? index,
            name:
                item?.name ??
                item?.description ??
                item?.product_name ??
                "Item",
            quantity,
            unitPrice,
            lineTotal,
        };
    });

    const subtotal =
        receiptData?.subtotal ??
        receiptData?.sub_total ??
        "";

    const discount =
        receiptData?.discount ??
        receiptData?.discount_amount ??
        null;

    const paymentMethod =
        receiptData?.payment_method ||
        receiptData?.paymentMethod ||
        "";

    const formatOptionalCurrency = (value) =>
        value === null || value === undefined || value === ""
            ? "—"
            : formatCurrency(value);

    return (
        <div className="graffiti-slip-page">
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Permanent+Marker&family=Roboto+Mono:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap');

                .graffiti-slip-page {
                    --ink: #080808;
                    --gold: #dca83f;
                    --gold-light: #ffdb80;
                    --paper: #f4f0e8;
                    --muted: #aaa49a;

                    width: 100%;
                    box-sizing: border-box;
                    padding: 24px 12px;
                    background:
                        radial-gradient(ellipse at 50% 0%,
                            rgba(220,168,63,.12), transparent 45%),
                        #080808;
                    color: var(--paper);
                    font-family: 'Space Grotesk', sans-serif;
                }

                .graffiti-slip-page *,
                .graffiti-slip-page *::before,
                .graffiti-slip-page *::after {
                    box-sizing: border-box;
                }

                .graffiti-slip {
                    position: relative;
                    isolation: isolate;
                    overflow: hidden;
                    width: 100%;
                    max-width: 600px;
                    margin: 0 auto;
                    padding: clamp(20px, 5vw, 38px);
                    background:
                        radial-gradient(circle at 12% 8%,
                            rgba(255,255,255,.055), transparent 20%),
                        radial-gradient(circle at 90% 70%,
                            rgba(220,168,63,.07), transparent 24%),
                        repeating-linear-gradient(
                            0deg,
                            rgba(255,255,255,.012) 0px,
                            rgba(255,255,255,.012) 1px,
                            transparent 1px,
                            transparent 5px
                        ),
                        #0c0c0c;
                    border: 1px solid rgba(220,168,63,.75);
                    box-shadow:
                        0 0 0 5px #111,
                        0 0 0 6px rgba(220,168,63,.32),
                        0 24px 70px rgba(0,0,0,.5);
                }

                .graffiti-slip::before {
                    content: "";
                    position: absolute;
                    z-index: -1;
                    inset: 8px;
                    pointer-events: none;
                    border: 1px solid rgba(220,168,63,.45);
                }

                .graffiti-slip::after {
                    content: "";
                    position: absolute;
                    z-index: -1;
                    width: 250px;
                    height: 250px;
                    top: 190px;
                    right: -145px;
                    border: 2px solid rgba(220,168,63,.09);
                    border-radius: 50%;
                    box-shadow:
                        0 0 0 14px rgba(220,168,63,.025),
                        0 0 0 29px rgba(220,168,63,.025);
                    pointer-events: none;
                }

                .gs-splatter {
                    position: absolute;
                    z-index: -1;
                    color: var(--gold);
                    opacity: .12;
                    font-family: 'Permanent Marker', cursive;
                    font-size: 65px;
                    line-height: 1;
                    pointer-events: none;
                    user-select: none;
                    transform: rotate(-13deg);
                }

                .gs-splatter-one {
                    top: 100px;
                    left: -12px;
                }

                .gs-splatter-two {
                    right: -10px;
                    bottom: 220px;
                    transform: rotate(15deg);
                }

                .gs-topline {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 12px;
                    padding-bottom: 16px;
                    border-bottom: 1px dashed rgba(220,168,63,.55);
                }

                .gs-kicker {
                    color: var(--gold);
                    font-family: 'Roboto Mono', monospace;
                    font-size: 10px;
                    letter-spacing: 3px;
                    text-transform: uppercase;
                }

                .gs-receipt-no {
                    max-width: 58%;
                    color: var(--muted);
                    font-family: 'Roboto Mono', monospace;
                    font-size: 10px;
                    text-align: right;
                    overflow-wrap: anywhere;
                }

                .gs-brand {
                    position: relative;
                    padding: 28px 0 24px;
                    text-align: center;
                }

                .gs-logo-frame {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 104px;
                    height: 104px;
                    margin: 0 auto 17px;
                    padding: 8px;
                    border: 1px solid rgba(220,168,63,.8);
                    border-radius: 50%;
                    background:
                        radial-gradient(circle,
                            rgba(220,168,63,.14), transparent 70%);
                    box-shadow:
                        0 0 0 5px rgba(220,168,63,.055),
                        inset 0 0 24px rgba(220,168,63,.07);
                }

                .gs-logo {
                    width: 100%;
                    height: 100%;
                    object-fit: contain;
                    border-radius: 50%;
                }

                .gs-logo-placeholder {
                    color: rgba(220,168,63,.65);
                    font-size: 30px;
                    line-height: 1;
                }

                .gs-business-name {
                    margin: 0;
                    color: #fff;
                    font-family: 'Permanent Marker', cursive;
                    font-size: clamp(27px, 7vw, 43px);
                    line-height: 1.15;
                    letter-spacing: .5px;
                    overflow-wrap: anywhere;
                    text-shadow:
                        2px 2px 0 rgba(220,168,63,.75),
                        -1px -1px 0 rgba(255,255,255,.08);
                }

                .gs-name-underline {
                    width: 70%;
                    height: 3px;
                    margin: 13px auto 11px;
                    background: linear-gradient(
                        90deg,
                        transparent,
                        var(--gold),
                        #fff1c6,
                        var(--gold),
                        transparent
                    );
                    transform: skewX(-20deg);
                }

                .gs-tagline {
                    margin: 0;
                    color: var(--gold-light);
                    font-family: 'Roboto Mono', monospace;
                    font-size: 10px;
                    letter-spacing: 2px;
                    text-transform: uppercase;
                }

                .gs-contact {
                    display: grid;
                    grid-template-columns: 1fr;
                    gap: 9px;
                    margin: 0 0 25px;
                    padding: 15px 0;
                    border-top: 1px dashed rgba(220,168,63,.35);
                    border-bottom: 1px dashed rgba(220,168,63,.35);
                }

                .gs-contact-row {
                    display: flex;
                    align-items: flex-start;
                    gap: 10px;
                    min-width: 0;
                    color: #e8e4dc;
                    font-size: 12px;
                    line-height: 1.55;
                    overflow-wrap: anywhere;
                }

                .gs-contact-icon {
                    flex: 0 0 18px;
                    color: var(--gold);
                    font-size: 14px;
                }

                .gs-section-title {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 12px;
                    margin-bottom: 12px;
                    color: var(--gold);
                    font-family: 'Permanent Marker', cursive;
                    font-size: 17px;
                    letter-spacing: 1px;
                }

                .gs-section-title small {
                    color: var(--muted);
                    font-family: 'Roboto Mono', monospace;
                    font-size: 9px;
                    font-weight: 400;
                    letter-spacing: 1px;
                }

                .gs-table-wrap {
                    width: 100%;
                    overflow-x: auto;
                }

                .gs-items-table {
                    width: 100%;
                    border-collapse: collapse;
                    table-layout: fixed;
                    font-size: 12px;
                }

                .gs-items-table th {
                    padding: 11px 6px;
                    background: linear-gradient(
                        110deg, #b98024, #f0c66b, #dca83f
                    );
                    color: #090909;
                    font-family: 'Roboto Mono', monospace;
                    font-size: 10px;
                    font-weight: 700;
                    letter-spacing: .5px;
                    text-align: left;
                    text-transform: uppercase;
                }

                .gs-items-table th:first-child {
                    width: 13%;
                    padding-left: 9px;
                }

                .gs-items-table th:nth-child(2) {
                    width: 39%;
                }

                .gs-items-table th:nth-child(3) {
                    width: 22%;
                    text-align: right;
                }

                .gs-items-table th:nth-child(4) {
                    width: 26%;
                    text-align: right;
                }

                .gs-items-table td {
                    padding: 13px 6px;
                    border-bottom: 1px dashed rgba(220,168,63,.32);
                    color: #f0eee8;
                    vertical-align: top;
                    overflow-wrap: anywhere;
                }

                .gs-items-table td:first-child {
                    padding-left: 9px;
                    color: var(--gold-light);
                    font-family: 'Roboto Mono', monospace;
                }

                .gs-items-table td:nth-child(3),
                .gs-items-table td:nth-child(4) {
                    text-align: right;
                    font-family: 'Roboto Mono', monospace;
                    font-size: 10px;
                }

                .gs-empty {
                    padding: 25px 8px !important;
                    color: var(--muted) !important;
                    text-align: center;
                    font-style: italic;
                }

                .gs-totals {
                    width: 100%;
                    max-width: 330px;
                    margin: 22px 0 0 auto;
                    padding-top: 16px;
                    border-top: 1px solid rgba(220,168,63,.55);
                }

                .gs-total-row {
                    display: flex;
                    justify-content: space-between;
                    gap: 15px;
                    padding: 6px 0;
                    color: #d0cbc2;
                    font-family: 'Roboto Mono', monospace;
                    font-size: 11px;
                }

                .gs-total-row span:last-child {
                    text-align: right;
                    overflow-wrap: anywhere;
                }

                .gs-total-row.discount {
                    color: var(--gold-light);
                }

                .gs-grand-total {
                    display: flex;
                    align-items: baseline;
                    justify-content: space-between;
                    gap: 12px;
                    margin-top: 10px;
                    padding-top: 15px;
                    border-top: 1px dashed rgba(220,168,63,.6);
                }

                .gs-grand-total span:first-child {
                    color: var(--gold);
                    font-family: 'Permanent Marker', cursive;
                    font-size: 19px;
                    letter-spacing: 1px;
                }

                .gs-grand-total span:last-child {
                    color: #fff;
                    font-family: 'Roboto Mono', monospace;
                    font-size: clamp(17px, 4.5vw, 24px);
                    font-weight: 700;
                    text-align: right;
                    overflow-wrap: anywhere;
                }

                .gs-meta {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 8px 20px;
                    margin-top: 20px;
                    padding-top: 14px;
                    border-top: 1px dashed rgba(220,168,63,.3);
                    color: var(--muted);
                    font-family: 'Roboto Mono', monospace;
                    font-size: 10px;
                }

                .gs-meta strong {
                    color: #f3eee4;
                    font-weight: 500;
                }

                .gs-qr-area {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 18px;
                    margin-top: 32px;
                    padding: 20px 0;
                    border-top: 1px dashed rgba(220,168,63,.4);
                    border-bottom: 1px dashed rgba(220,168,63,.4);
                }

                .gs-qr-frame {
                    display: flex;
                    flex: 0 0 118px;
                    align-items: center;
                    justify-content: center;
                    width: 118px;
                    height: 118px;
                    padding: 7px;
                    background: #fff;
                    border: 2px solid var(--gold);
                    box-shadow: 0 0 18px rgba(220,168,63,.12);
                }

                .gs-qr-image {
                    width: 100%;
                    height: 100%;
                    object-fit: contain;
                }

                .gs-qr-placeholder {
                    color: #5d564a;
                    font-size: 10px;
                    text-align: center;
                }

                .gs-qr-copy {
                    min-width: 0;
                    max-width: 190px;
                }

                .gs-qr-copy h3 {
                    margin: 0 0 8px;
                    color: #fff;
                    font-family: 'Permanent Marker', cursive;
                    font-size: 20px;
                    line-height: 1.25;
                }

                .gs-qr-copy p {
                    margin: 0;
                    color: var(--gold-light);
                    font-family: 'Roboto Mono', monospace;
                    font-size: 10px;
                    line-height: 1.7;
                }

                .gs-thank-you {
                    padding: 25px 0 8px;
                    text-align: center;
                }

                .gs-thank-you h3 {
                    margin: 0 0 8px;
                    color: var(--gold);
                    font-family: 'Permanent Marker', cursive;
                    font-size: clamp(24px, 7vw, 37px);
                    letter-spacing: 1px;
                    transform: rotate(-2deg);
                }

                .gs-thank-you p {
                    margin: 0;
                    color: #eee8dc;
                    font-family: 'Roboto Mono', monospace;
                    font-size: 10px;
                    letter-spacing: 1.5px;
                    line-height: 1.8;
                    text-transform: uppercase;
                }

                .gs-download {
                    display: block;
                    width: 100%;
                    margin-top: 22px;
                    padding: 15px 18px;
                    border: 1px solid var(--gold);
                    background: linear-gradient(
                        110deg, #9b681d, #e4b74f, #b9842e
                    );
                    color: #080808;
                    font-family: 'Roboto Mono', monospace;
                    font-size: 12px;
                    font-weight: 700;
                    letter-spacing: 1px;
                    text-transform: uppercase;
                    cursor: pointer;
                    transition:
                        transform .2s ease,
                        box-shadow .2s ease,
                        filter .2s ease;
                }

                .gs-download:hover {
                    transform: translateY(-2px);
                    filter: brightness(1.1);
                    box-shadow: 0 8px 25px rgba(220,168,63,.2);
                }

                .gs-download:focus-visible {
                    outline: 2px solid white;
                    outline-offset: 4px;
                }

                .gs-footer {
                    margin-top: 24px;
                    color: #777168;
                    font-family: 'Roboto Mono', monospace;
                    font-size: 9px;
                    letter-spacing: 1px;
                    line-height: 1.8;
                    text-align: center;
                    overflow-wrap: anywhere;
                }

                @media (max-width: 380px) {
                    .graffiti-slip {
                        padding: 20px 15px;
                    }

                    .gs-items-table {
                        font-size: 10px;
                    }

                    .gs-items-table th {
                        font-size: 8px;
                    }

                    .gs-items-table td {
                        padding: 11px 4px;
                    }

                    .gs-items-table td:nth-child(3),
                    .gs-items-table td:nth-child(4) {
                        font-size: 9px;
                    }

                    .gs-qr-area {
                        gap: 12px;
                    }

                    .gs-qr-frame {
                        flex-basis: 95px;
                        width: 95px;
                        height: 95px;
                    }
                }

                @media (prefers-reduced-motion: reduce) {
                    .gs-download {
                        transition: none;
                    }
                }

                @media print {
                    .graffiti-slip-page {
                        padding: 0;
                        background: #fff;
                        print-color-adjust: exact;
                        -webkit-print-color-adjust: exact;
                    }

                    .graffiti-slip {
                        max-width: 100%;
                        box-shadow: none;
                        break-inside: avoid;
                    }

                    .gs-download {
                        display: none;
                    }
                }
            `}</style>

            <article className="graffiti-slip">
                <span
                    className="gs-splatter gs-splatter-one"
                    aria-hidden="true"
                >
                    ＋
                </span>

                <span
                    className="gs-splatter gs-splatter-two"
                    aria-hidden="true"
                >
                    Ｘ
                </span>

                {/* Receipt heading */}
                <div className="gs-topline">
                    <span className="gs-kicker">Digital Receipt</span>

                    <span className="gs-receipt-no">
                        {receiptNumber
                            ? `#${receiptNumber}`
                            : "TRANSACTION RECEIPT"}
                    </span>
                </div>

                {/* Business branding: real connected data only */}
                <header className="gs-brand">
                    <div className="gs-logo-frame">
                        {logoUrl ? (
                            <img
                                className="gs-logo"
                                src={logoUrl}
                                alt={
                                    businessName
                                        ? `${businessName} logo`
                                        : "Business logo"
                                }
                            />
                        ) : (
                            <span
                                className="gs-logo-placeholder"
                                aria-hidden="true"
                            >
                                ✦
                            </span>
                        )}
                    </div>

                    {businessName && (
                        <h1 className="gs-business-name">
                            {businessName}
                        </h1>
                    )}

                    <div className="gs-name-underline" />

                    <p className="gs-tagline">
                        Thank you for your support
                    </p>
                </header>

                {/* Business contact details */}
                {(businessAddress || businessPhone || businessEmail) && (
                    <section
                        className="gs-contact"
                        aria-label="Business contact information"
                    >
                        {businessAddress && (
                            <div className="gs-contact-row">
                                <span
                                    className="gs-contact-icon"
                                    aria-hidden="true"
                                >
                                    ◈
                                </span>
                                <span>{businessAddress}</span>
                            </div>
                        )}

                        {businessPhone && (
                            <div className="gs-contact-row">
                                <span
                                    className="gs-contact-icon"
                                    aria-hidden="true"
                                >
                                    ☎
                                </span>
                                <span>{businessPhone}</span>
                            </div>
                        )}

                        {businessEmail && (
                            <div className="gs-contact-row">
                                <span
                                    className="gs-contact-icon"
                                    aria-hidden="true"
                                >
                                    ✉
                                </span>
                                <span>{businessEmail}</span>
                            </div>
                        )}
                    </section>
                )}

                {/* Purchased items */}
                <section aria-label="Purchased items">
                    <div className="gs-section-title">
                        <span>THE GOODS</span>
                        <small>ITEMIZED LIST</small>
                    </div>

                    <div className="gs-table-wrap">
                        <table className="gs-items-table">
                            <thead>
                                <tr>
                                    <th>Qty</th>
                                    <th>Item</th>
                                    <th>Price</th>
                                    <th>Total</th>
                                </tr>
                            </thead>

                            <tbody>
                                {transactionItems.length > 0 ? (
                                    transactionItems.map((item) => (
                                        <tr key={item.key}>
                                            <td>{item.quantity}</td>
                                            <td>{item.name}</td>
                                            <td>
                                                {formatOptionalCurrency(
                                                    item.unitPrice
                                                )}
                                            </td>
                                            <td>
                                                {formatOptionalCurrency(
                                                    item.lineTotal
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan={4}
                                            className="gs-empty"
                                        >
                                            No items available for this
                                            transaction.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* Totals */}
                <section
                    className="gs-totals"
                    aria-label="Receipt totals"
                >
                    {subtotal !== "" && (
                        <div className="gs-total-row">
                            <span>SUBTOTAL</span>
                            <span>{formatCurrency(subtotal)}</span>
                        </div>
                    )}

                    {discount !== null &&
                        discount !== undefined &&
                        discount !== "" && (
                            <div className="gs-total-row discount">
                                <span>DISCOUNT</span>
                                <span>
                                    {Number(discount) > 0 ? "− " : ""}
                                    {formatCurrency(
                                        Math.abs(Number(discount)) ||
                                        discount
                                    )}
                                </span>
                            </div>
                        )}

                    {vat !== null &&
                        vat !== undefined &&
                        vat !== "" && (
                            <div className="gs-total-row">
                                <span>VAT / TAX</span>
                                <span>{formatCurrency(vat)}</span>
                            </div>
                        )}

                    <div className="gs-grand-total">
                        <span>TOTAL</span>
                        <span>
                            {total !== ""
                                ? formatCurrency(total)
                                : "—"}
                        </span>
                    </div>
                </section>

                {/* Transaction metadata */}
                <div className="gs-meta">
                    <span>
                        DATE:{" "}
                        <strong>{formattedTransactionDate}</strong>
                    </span>

                    {paymentMethod && (
                        <span>
                            PAYMENT: <strong>{paymentMethod}</strong>
                        </span>
                    )}
                </div>

                {/* QR code: supplied by the connected application */}
                <section
                    className="gs-qr-area"
                    aria-label="Receipt QR code"
                >
                    <div className="gs-qr-frame">
                        {qrSource ? (
                            <img
                                className="gs-qr-image"
                                src={qrSource}
                                alt="Receipt QR code"
                            />
                        ) : (
                            <span className="gs-qr-placeholder">
                                QR CODE
                                <br />
                                WILL APPEAR HERE
                            </span>
                        )}
                    </div>

                    <div className="gs-qr-copy">
                        <h3>SCAN IT.</h3>
                        <p>
                            SCAN TO VIEW
                            <br />
                            YOUR DIGITAL RECEIPT
                        </p>
                    </div>
                </section>

                {/* Graffiti-inspired closing message */}
                <footer className="gs-thank-you">
                    <h3>THANK YOU!</h3>
                    <p>
                        Your support keeps us moving.
                        <br />
                        We appreciate you.
                    </p>
                </footer>

                <button
                    type="button"
                    className="gs-download"
                    onClick={handleDownload}
                >
                    ↓ &nbsp; Download Receipt
                </button>

                <div className="gs-footer">
                    {receiptNumber
                        ? `RECEIPT REF: ${receiptNumber}`
                        : "THANK YOU FOR SHOPPING WITH US"}
                    <br />
                    KEEP YOUR RECEIPT FOR YOUR RECORDS
                </div>
            </article>
        </div>
    );
}
