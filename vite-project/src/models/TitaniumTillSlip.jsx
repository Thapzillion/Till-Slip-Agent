
import React from "react";

import "./TitaniumTillSlip.css";

/* ================================================================
   TITANIUM TILL SLIP — BACKEND LOGIC
   Preserved from the supplied backend implementation.
   ================================================================ */

export function useTitaniumTillSlipBackend({
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
                "TitaniumTillSlip: onDownload handler was not supplied."
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
   TITANIUM VISUAL DESIGN
   No hardcoded business identity or simulated receipt inputs.
   ================================================================ */

const styles = {
    page: {
        width: "100%",
        boxSizing: "border-box",
        padding: "22px 12px",
        background:
            "radial-gradient(ellipse at top, #343a40 0%, #101215 45%, #030405 100%)",
        color: "#e5e8eb",
        fontFamily:
            "'Arial', 'Helvetica Neue', sans-serif",
    },

    receipt: {
        position: "relative",
        overflow: "hidden",
        width: "100%",
        maxWidth: "650px",
        margin: "0 auto",
        padding: "clamp(12px, 3.5vw, 25px)",
        boxSizing: "border-box",
        border: "2px solid #aeb5bb",
        borderRadius: "10px",
        background:
            "linear-gradient(145deg, #aeb4b9 0%, #555b60 9%, #171a1d 19%, #292d31 48%, #0c0e10 76%, #555b60 92%, #aeb4b9 100%)",
        boxShadow:
            "0 0 0 3px #25292d, 0 0 0 5px #777e84, 0 22px 70px rgba(0,0,0,.8), inset 0 0 24px rgba(255,255,255,.09)",
    },

    inner: {
        position: "relative",
        zIndex: 1,
    },

    topStrip: {
        padding: "12px 8px",
        textAlign: "center",
        background:
            "linear-gradient(180deg, #080a0c, #292d31, #090b0d)",
        border: "1px solid #92999f",
        boxShadow: "inset 0 1px 1px rgba(255,255,255,.3)",
        color: "#d9dde0",
        fontSize: "clamp(9px, 2vw, 12px)",
        fontWeight: 700,
        letterSpacing: "2px",
        textTransform: "uppercase",
    },

    hero: {
        marginTop: "12px",
        padding: "25px 10px",
        textAlign: "center",
        background:
            "linear-gradient(135deg, #090b0d, #343a3f 45%, #101214 75%, #292d31)",
        border: "1px solid #92999f",
        boxShadow:
            "inset 0 0 0 3px #181b1e, inset 0 0 25px rgba(255,255,255,.06)",
    },

    logo: {
        display: "block",
        maxWidth: "120px",
        maxHeight: "100px",
        objectFit: "contain",
        margin: "0 auto 14px",
        filter: "grayscale(1) contrast(1.1)",
    },

    businessName: {
        margin: 0,
        overflowWrap: "anywhere",
        color: "#f3f4f5",
        fontSize: "clamp(23px, 5.6vw, 38px)",
        lineHeight: 1.15,
        fontWeight: 900,
        letterSpacing: "1px",
        textTransform: "uppercase",
        textShadow: "0 2px 0 #51565b, 0 5px 10px #000",
    },

    subtitle: {
        marginTop: "10px",
        color: "#bfc5ca",
        fontSize: "11px",
        letterSpacing: "4px",
        fontWeight: 700,
        textTransform: "uppercase",
    },

    titaniumLabel: {
        display: "inline-block",
        marginTop: "18px",
        padding: "7px 15px",
        border: "1px solid #858c92",
        background:
            "linear-gradient(180deg, #555c62, #171a1d)",
        color: "#f2f3f4",
        fontSize: "10px",
        letterSpacing: "3px",
        fontWeight: 800,
    },

    verification: {
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "12px",
        marginTop: "12px",
        padding: "14px 12px",
        background: "linear-gradient(110deg, #111416, #30353a, #111416)",
        border: "1px solid #737a80",
        fontSize: "11px",
    },

    verified: {
        color: "#e6e9eb",
        fontWeight: 800,
        letterSpacing: "1px",
    },

    transaction: {
        textAlign: "right",
        overflowWrap: "anywhere",
        color: "#d0d4d7",
        lineHeight: 1.7,
    },

    panel: {
        marginTop: "12px",
        padding: "16px 13px",
        background:
            "linear-gradient(140deg, rgba(62,68,73,.96), rgba(17,19,22,.98) 55%, rgba(36,40,44,.98))",
        border: "1px solid #777e84",
        boxShadow:
            "inset 0 0 0 2px rgba(0,0,0,.55), inset 0 1px 0 rgba(255,255,255,.15)",
    },

    sectionTitle: {
        margin: "0 0 15px",
        paddingBottom: "10px",
        borderBottom: "1px solid #666d73",
        color: "#e1e4e6",
        fontSize: "12px",
        letterSpacing: "2px",
        fontWeight: 800,
        textTransform: "uppercase",
    },

    businessDetails: {
        display: "flex",
        alignItems: "center",
        gap: "14px",
        minWidth: 0,
    },

    businessIcon: {
        flex: "0 0 48px",
        width: "48px",
        height: "48px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        border: "1px solid #969da3",
        background: "linear-gradient(145deg, #454b51, #111315)",
        color: "#e4e7e9",
        fontSize: "23px",
        boxShadow: "inset 0 0 12px rgba(0,0,0,.8)",
    },

    detailText: {
        minWidth: 0,
        overflowWrap: "anywhere",
        color: "#d2d6d9",
        fontSize: "12px",
        lineHeight: 1.8,
    },

    item: {
        display: "grid",
        gridTemplateColumns: "minmax(0, 1fr)",
        gap: "12px",
        padding: "16px 0",
        borderBottom: "1px solid #555c62",
    },

    itemImageBox: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        minHeight: "105px",
        boxSizing: "border-box",
        padding: "12px",
        border: "1px solid #676e74",
        background:
            "radial-gradient(ellipse, #454c52 0%, #202428 48%, #101214 100%)",
    },

    itemImage: {
        maxWidth: "100%",
        maxHeight: "115px",
        objectFit: "contain",
        filter: "grayscale(1) contrast(1.05)",
    },

    itemName: {
        color: "#eef0f1",
        fontSize: "13px",
        lineHeight: 1.6,
        overflowWrap: "anywhere",
    },

    itemMeta: {
        marginTop: "4px",
        color: "#aeb5ba",
        fontSize: "11px",
        lineHeight: 1.6,
    },

    itemPrice: {
        color: "#f1f3f4",
        fontSize: "16px",
        fontWeight: 800,
        overflowWrap: "anywhere",
        textAlign: "right",
        textShadow: "0 2px 5px #000",
    },

    totals: {
        marginTop: "12px",
        padding: "16px 14px",
        border: "2px solid #9da4aa",
        background:
            "linear-gradient(110deg, #777e84, #272c30 20%, #101214 65%, #555c62)",
        boxShadow:
            "inset 0 0 0 2px #25292d, inset 0 1px 0 rgba(255,255,255,.3)",
    },

    totalLine: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: "12px",
        color: "#d8dcdf",
        fontSize: "12px",
    },

    totalAmount: {
        color: "#fff",
        fontSize: "clamp(24px, 6vw, 36px)",
        fontWeight: 900,
        overflowWrap: "anywhere",
        textShadow: "0 2px 0 #555b60, 0 5px 10px #000",
    },

    voucher: {
        marginTop: "12px",
        padding: "16px 12px",
        border: "1px solid #777e84",
        background:
            "linear-gradient(145deg, #393f44, #111416 35%, #262b30 100%)",
        boxShadow: "inset 0 0 0 3px #191c1f",
    },

    voucherTitle: {
        margin: "0 0 14px",
        color: "#e8ebed",
        textAlign: "center",
        fontSize: "12px",
        fontWeight: 800,
        letterSpacing: "1.5px",
        lineHeight: 1.8,
    },

    voucherContent: {
        display: "grid",
        gridTemplateColumns: "minmax(0, 1fr)",
        gap: "16px",
        alignItems: "center",
    },

    qrFrame: {
        width: "100%",
        maxWidth: "210px",
        boxSizing: "border-box",
        margin: "0 auto",
        padding: "9px",
        background:
            "linear-gradient(145deg, #cbd0d4, #666e75, #dfe2e4)",
        border: "1px solid #eef0f1",
        boxShadow: "0 5px 15px rgba(0,0,0,.5)",
    },

    qrImage: {
        display: "block",
        width: "100%",
        aspectRatio: "1 / 1",
        objectFit: "contain",
        background: "#fff",
    },

    voucherText: {
        color: "#d5d9dc",
        fontSize: "12px",
        lineHeight: 1.8,
        overflowWrap: "anywhere",
    },

    voucherCode: {
        marginTop: "8px",
        color: "#fff",
        fontSize: "20px",
        fontWeight: 900,
        letterSpacing: "2px",
        overflowWrap: "anywhere",
    },

    expired: {
        marginTop: "8px",
        color: "#d7a0a0",
        fontSize: "12px",
        fontWeight: 800,
        letterSpacing: "1px",
    },

    downloadButton: {
        display: "flex",
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        gap: "10px",
        marginTop: "14px",
        padding: "16px 10px",
        boxSizing: "border-box",
        border: "2px solid #b5bbc0",
        borderRadius: "4px",
        background:
            "linear-gradient(180deg, #747b81, #343a3f 18%, #15181b 55%, #454b50 100%)",
        boxShadow:
            "inset 0 0 0 2px #292d31, 0 5px 12px rgba(0,0,0,.45)",
        color: "#f1f3f4",
        fontSize: "12px",
        fontWeight: 800,
        letterSpacing: "1px",
        textAlign: "center",
        cursor: "pointer",
    },

    watermark: {
        position: "absolute",
        inset: "0",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 0,
        pointerEvents: "none",
        opacity: 0.035,
    },

    watermarkImage: {
        width: "70%",
        maxHeight: "45%",
        objectFit: "contain",
        filter: "grayscale(1)",
    },

    footer: {
        padding: "17px 5px 4px",
        color: "#aeb4b9",
        fontSize: "9px",
        letterSpacing: "2px",
        textAlign: "center",
        lineHeight: 1.8,
        overflowWrap: "anywhere",
    },
};

/* ================================================================
   RESPONSIVE ITEM ROW
   ================================================================ */


function TitaniumReceiptItem({ item, formatCurrency }) {
    const name =
        item?.name ??
        item?.product_name ??
        item?.description ??
        item?.title ??
        "";

    const quantity =
        item?.quantity ??
        item?.qty ??
        1;

    const unitPrice =
        item?.unit_price ??
        item?.price ??
        null;

    const lineTotal =
        item?.subtotal ??
        item?.total ??
        item?.total_price ??
        (
            unitPrice !== null &&
                unitPrice !== undefined &&
                Number.isFinite(Number(unitPrice)) &&
                Number.isFinite(Number(quantity))
                ? Number(unitPrice) * Number(quantity)
                : unitPrice
        );

    return (
        <div className="titanium-item">
            <div className="titanium-item-details">
                <div className="titanium-item-name">
                    {quantity}x {name}
                </div>

                {unitPrice !== null &&
                    unitPrice !== undefined &&
                    unitPrice !== "" && (
                        <div className="titanium-item-unit-price">
                            Unit price: {formatCurrency(unitPrice)}
                        </div>
                    )}

                {item?.sku && (
                    <div className="titanium-item-sku">
                        SKU: {item.sku}
                    </div>
                )}
            </div>

            <div className="titanium-item-price">
                {formatCurrency(lineTotal)}
            </div>
        </div>
    );
}


/* ================================================================
   MAIN DIGITAL TILL SLIP COMPONENT
   ================================================================ */

export default function TitaniumTillSlip({
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
        resolvedCurrencySymbol,
        formatCurrency,
        handleDownload,
    } = useTitaniumTillSlipBackend({
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

    /* ------------------------------------------------------------
       BUSINESS DETAILS
       Values are read from real application data.
       No example business name is inserted.
       ------------------------------------------------------------ */

    const businessName =
        settings?.business_name ??
        settings?.store_name ??
        receiptData?.business_name ??
        receiptData?.store_name ??
        "";

    const businessAddress =
        settings?.business_address ??
        settings?.address ??
        receiptData?.business_address ??
        receiptData?.address ??
        "";

    const businessEmail =
        settings?.business_email ??
        settings?.email ??
        receiptData?.business_email ??
        receiptData?.email ??
        "";

    const businessPhone =
        settings?.business_phone ??
        settings?.phone ??
        receiptData?.business_phone ??
        receiptData?.phone ??
        "";

    const transactionId =
        receiptData?.transaction_id ??
        receiptData?.reference ??
        receiptId ??
        "";

    const currencyCode =
        settings?.currency ??
        receiptData?.currency ??
        "";

    const voucherCode =
        voucher?.code ??
        voucher?.voucher_code ??
        "";

    const voucherDiscount =
        voucher?.discount_percentage ??
        voucher?.discount_percent ??
        voucher?.discount ??
        null;

    const voucherExpiry =
        voucher?.expires_at ??
        voucher?.expiry_date ??
        null;

    const qrSource = qrCodeUrl || "";

    const hasVoucher =
        Boolean(voucher) ||
        Boolean(qrSource) ||
        Boolean(checkoutPayloadLink);

    return (
        <div className="titanium-page" style={styles.page}>
            <style>
                {`
                    .titanium-receipt,
                    .titanium-receipt * {
                        box-sizing: border-box;
                    }

                    .titanium-receipt button {
                        font-family: inherit;
                        transition:
                            filter .2s ease,
                            transform .2s ease,
                            box-shadow .2s ease;
                    }

                    .titanium-receipt button:hover {
                        filter: brightness(1.18);
                        box-shadow: 0 0 18px rgba(210,220,230,.16);
                    }

                    .titanium-receipt button:active {
                        transform: translateY(1px);
                    }

                    .titanium-receipt button:focus-visible {
                        outline: 2px solid #f0f3f5;
                        outline-offset: 4px;
                    }

                    .titanium-receipt img {
                        max-width: 100%;
                    }

                    @media (min-width: 460px) {
                        .titanium-item {
                            grid-template-columns: 115px minmax(0, 1fr) !important;
                            align-items: center;
                            gap: 14px !important;
                        }

                        .titanium-voucher-content {
                            grid-template-columns: minmax(0, 210px) minmax(0, 1fr) !important;
                        }
                    }

                    @media print {
                        @page {
                            margin: 8mm;
                        }

                        body {
                            background: #fff !important;
                        }

                        .titanium-page {
                            padding: 0 !important;
                            background: #fff !important;
                        }

                        .titanium-receipt {
                            max-width: none !important;
                            box-shadow: none !important;
                            print-color-adjust: exact;
                            -webkit-print-color-adjust: exact;
                        }

                        .titanium-download {
                            display: none !important;
                        }
                    }

                    @media (prefers-reduced-motion: reduce) {
                        .titanium-receipt button {
                            transition: none;
                        }
                    }
                `}
            </style>

            <div
                className="titanium-receipt"
                style={styles.receipt}
            >
                {watermarkUrl && (
                    <div style={styles.watermark} aria-hidden="true">
                        <img
                            src={watermarkUrl}
                            alt=""
                            style={styles.watermarkImage}
                        />
                    </div>
                )}

                <div style={styles.inner}>
                    {/* METALLIC HEADER */}

                    <div style={styles.topStrip}>
                        <span aria-hidden="true">◆</span>
                        {" "}DIGITAL RECEIPT · VERIFIED TRANSACTION
                    </div>

                    <header style={styles.hero}>
                        {logoUrl && (
                            <img
                                src={logoUrl}
                                alt={
                                    businessName
                                        ? `${businessName} logo`
                                        : "Business logo"
                                }
                                style={styles.logo}
                            />
                        )}

                        {businessName && (
                            <h1 style={styles.businessName}>
                                {businessName}
                            </h1>
                        )}

                        <div style={styles.subtitle}>
                            {businessName ? "Official Receipt" : "Titanium Edition"}
                        </div>

                        <div style={styles.titaniumLabel}>
                            TITANIUM · DIGITAL INVOICE
                        </div>
                    </header>

                    {/* TRANSACTION VERIFICATION */}

                    <section style={styles.verification}>
                        <div style={styles.verified}>
                            ◈ &nbsp; TRANSACTION RECEIPT
                        </div>

                        <div style={styles.transaction}>
                            <div>TRANSACTION DATE</div>
                            <div>{formattedTransactionDate}</div>

                            {transactionId && (
                                <div>
                                    REF: {transactionId}
                                </div>
                            )}
                        </div>
                    </section>

                    {/* BUSINESS INFORMATION */}

                    {(businessName ||
                        businessAddress ||
                        businessEmail ||
                        businessPhone) && (
                            <section style={styles.panel}>
                                <div style={styles.businessDetails}>
                                    <div
                                        style={styles.businessIcon}
                                        aria-hidden="true"
                                    >
                                        ◈
                                    </div>

                                    <div style={styles.detailText}>
                                        {businessName && (
                                            <div
                                                style={{
                                                    color: "#f0f2f4",
                                                    fontSize: "15px",
                                                    fontWeight: 800,
                                                }}
                                            >
                                                {businessName}
                                            </div>
                                        )}

                                        {businessAddress && (
                                            <div>{businessAddress}</div>
                                        )}

                                        {businessEmail && (
                                            <div>{businessEmail}</div>
                                        )}

                                        {businessPhone && (
                                            <div>{businessPhone}</div>
                                        )}
                                    </div>
                                </div>
                            </section>
                        )}

                    {/* PURCHASED ITEMS */}

                    <section style={styles.panel}>
                        <h2 style={styles.sectionTitle}>
                            ITEMS PURCHASED
                        </h2>


                        {receiptDataItems.length > 0 ? (
                            <div className="titanium-items-list">
                                {receiptDataItems.map((item, index) => (
                                    <TitaniumReceiptItem
                                        key={
                                            item?.id ??
                                            item?.product_id ??
                                            `${item?.name ?? item?.description ?? "item"}-${index}`
                                        }
                                        item={item}
                                        formatCurrency={formatCurrency}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div
                                style={{
                                    padding: "18px 4px",
                                    color: "#aeb5bb",
                                    fontSize: "12px",
                                    textAlign: "center",
                                    lineHeight: 1.8,
                                }}
                            >
                                No receipt items are available.
                            </div>
                        )}
                    </section>

                    {/* TOTALS */}

                    <section style={styles.totals}>
                        {vat !== null &&
                            vat !== undefined &&
                            vat !== "" && (
                                <div
                                    style={{
                                        ...styles.totalLine,
                                        marginBottom: "12px",
                                    }}
                                >
                                    <span>VAT</span>
                                    <span>{formatCurrency(vat)}</span>
                                </div>
                            )}

                        <div style={styles.totalLine}>
                            <span
                                style={{
                                    fontWeight: 900,
                                    letterSpacing: "2px",
                                }}
                            >
                                TOTAL DUE
                            </span>

                            <span style={styles.totalAmount}>
                                {formatCurrency(total)}
                            </span>
                        </div>

                        {currencyCode && (
                            <div
                                style={{
                                    marginTop: "9px",
                                    color: "#aeb5bb",
                                    fontSize: "10px",
                                    textAlign: "right",
                                    letterSpacing: "1px",
                                }}
                            >
                                CURRENCY: {currencyCode}
                                {resolvedCurrencySymbol
                                    ? ` (${resolvedCurrencySymbol})`
                                    : ""}
                            </div>
                        )}
                    </section>

                    {/* VOUCHER AND QR CODE */}

                    {hasVoucher && (
                        <section style={styles.voucher}>
                            <h2 style={styles.voucherTitle}>
                                NEXT TIER · VOUCHER & DISCOUNT
                            </h2>

                            <div
                                className="titanium-voucher-content"
                                style={styles.voucherContent}
                            >
                                {qrSource && (
                                    <div style={styles.qrFrame}>
                                        <img
                                            src={qrSource}
                                            alt="Voucher QR code"
                                            style={styles.qrImage}
                                        />
                                    </div>
                                )}

                                <div style={styles.voucherText}>
                                    <div
                                        style={{
                                            color: "#f0f2f4",
                                            fontWeight: 800,
                                            letterSpacing: "1px",
                                        }}
                                    >
                                        CLAIM VOUCHER
                                    </div>

                                    {voucherDiscount !== null &&
                                        voucherDiscount !== undefined &&
                                        voucherDiscount !== "" && (
                                            <div style={styles.voucherCode}>
                                                {typeof voucherDiscount === "number" ||
                                                    /^\d+(\.\d+)?$/.test(
                                                        String(voucherDiscount)
                                                    )
                                                    ? `${voucherDiscount}%`
                                                    : voucherDiscount}
                                                {" "}DISCOUNT
                                            </div>
                                        )}

                                    {voucherCode && (
                                        <div style={styles.voucherCode}>
                                            {voucherCode}
                                        </div>
                                    )}

                                    {voucher?.description && (
                                        <div>{voucher.description}</div>
                                    )}

                                    {voucherExpiry && (
                                        <div style={{ marginTop: "10px" }}>
                                            EXPIRES:{" "}
                                            {Number.isNaN(
                                                new Date(voucherExpiry).getTime()
                                            )
                                                ? voucherExpiry
                                                : new Date(
                                                    voucherExpiry
                                                ).toLocaleDateString("en-GB")}
                                        </div>
                                    )}

                                    {!voucherExpiry && (
                                        <div style={{ marginTop: "10px" }}>
                                            {isExpired
                                                ? "VOUCHER EXPIRED"
                                                : `${daysRemaining} DAYS REMAINING`}
                                        </div>
                                    )}

                                    {isExpired && (
                                        <div style={styles.expired}>
                                            THIS VOUCHER HAS EXPIRED
                                        </div>
                                    )}
                                </div>
                            </div>
                        </section>
                    )}

                    {/* OFFICIAL DOWNLOAD */}

                    <button
                        type="button"
                        className="titanium-download"
                        style={styles.downloadButton}
                        onClick={handleDownload}
                    >
                        <span aria-hidden="true">▤</span>
                        DOWNLOAD OFFICIAL INVOICE
                    </button>

                    {/* METALLIC FOOTER */}

                    <footer style={styles.footer}>
                        {receiptId && (
                            <div>RECEIPT ID: {receiptId}</div>
                        )}

                        <div>
                            TITANIUM DIGITAL RECEIPT
                        </div>
                    </footer>
                </div>
            </div>
        </div>
    );
}
