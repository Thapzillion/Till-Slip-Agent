import React from "react";

/* ================================================================
   BACKEND LOGIC — PRESERVED
   ================================================================ */

export function useTechTillSlipBackend({
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
                "TechTillSlip: onDownload handler was not supplied."
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
   FUTURISTIC WHITE-LIGHT DIGITAL TILL SLIP
   ================================================================ */

export default function TechTillSlip({
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

    // Connect this to the actual business-name field in your app.
    businessName = settings?.business_name || "",
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
    } = useTechTillSlipBackend({
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

    const styles = {
        page: {
            width: "100%",
            boxSizing: "border-box",
            padding: "24px 12px",
            background: "#030405",
            color: "#F7FAFF",
            fontFamily:
                "'Inter', 'Segoe UI', Arial, sans-serif",
        },

        receipt: {
            position: "relative",
            isolation: "isolate",
            overflow: "hidden",
            width: "100%",
            maxWidth: "760px",
            margin: "0 auto",
            padding: "clamp(16px, 4vw, 34px)",
            boxSizing: "border-box",
            background:
                "radial-gradient(ellipse at 50% 0%, #20242A 0%, #0B0D10 38%, #050607 100%)",
            border: "1px solid rgba(255,255,255,0.8)",
            borderRadius: "20px",
            boxShadow:
                "0 0 12px rgba(255,255,255,0.15), 0 0 45px rgba(255,255,255,0.06), inset 0 0 30px rgba(255,255,255,0.025)",
        },

        glow: {
            position: "absolute",
            inset: "7px",
            border: "1px solid rgba(255,255,255,0.16)",
            borderRadius: "14px",
            pointerEvents: "none",
            zIndex: -1,
        },

        topLine: {
            height: "2px",
            width: "100%",
            marginBottom: "28px",
            background:
                "linear-gradient(90deg, transparent, #FFFFFF 15%, #858B94 50%, #FFFFFF 85%, transparent)",
            boxShadow: "0 0 12px rgba(255,255,255,0.55)",
        },

        eyebrow: {
            fontSize: "10px",
            letterSpacing: "4px",
            color: "#D7DBE2",
            textTransform: "uppercase",
            marginBottom: "10px",
        },

        header: {
            display: "grid",
            gridTemplateColumns: "minmax(76px, 0.65fr) minmax(0, 1.8fr)",
            alignItems: "center",
            gap: "22px",
            paddingBottom: "26px",
            borderBottom: "1px solid rgba(255,255,255,0.3)",
        },

        logoFrame: {
            width: "100%",
            maxWidth: "140px",
            aspectRatio: "1 / 1",
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "10px",
            boxSizing: "border-box",
            border: "1px solid rgba(255,255,255,0.7)",
            borderRadius: "16px",
            background:
                "linear-gradient(145deg, rgba(255,255,255,0.09), rgba(255,255,255,0.015))",
            boxShadow:
                "0 0 18px rgba(255,255,255,0.09), inset 0 0 16px rgba(255,255,255,0.05)",
        },

        logo: {
            display: "block",
            maxWidth: "100%",
            maxHeight: "100%",
            objectFit: "contain",
        },

        businessName: {
            margin: 0,
            fontSize: "clamp(21px, 4.5vw, 35px)",
            lineHeight: 1.15,
            fontWeight: 700,
            letterSpacing: "1.5px",
            overflowWrap: "anywhere",
            color: "#FFFFFF",
            textShadow: "0 0 15px rgba(255,255,255,0.22)",
        },

        address: {
            marginTop: "12px",
            color: "#C3C7CF",
            fontSize: "12px",
            lineHeight: 1.8,
            overflowWrap: "anywhere",
        },

        panel: {
            marginTop: "22px",
            padding: "16px",
            border: "1px solid rgba(255,255,255,0.26)",
            borderRadius: "12px",
            background:
                "linear-gradient(135deg, rgba(255,255,255,0.055), rgba(255,255,255,0.012))",
        },

        sectionTitle: {
            margin: "0 0 15px",
            color: "#FFFFFF",
            fontSize: "11px",
            fontWeight: 600,
            letterSpacing: "3px",
            textTransform: "uppercase",
        },

        metadataGrid: {
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(125px, 1fr))",
            gap: "18px",
        },

        label: {
            display: "block",
            marginBottom: "7px",
            fontSize: "9px",
            letterSpacing: "2px",
            color: "#AEB4BE",
            textTransform: "uppercase",
        },

        value: {
            display: "block",
            color: "#FFFFFF",
            fontSize: "12px",
            lineHeight: 1.6,
            overflowWrap: "anywhere",
        },

        tableWrap: {
            width: "100%",
            overflowX: "auto",
        },

        table: {
            width: "100%",
            borderCollapse: "collapse",
            fontSize: "12px",
            textAlign: "left",
        },

        th: {
            padding: "12px 7px",
            borderBottom: "1px solid rgba(255,255,255,0.65)",
            color: "#E9ECF2",
            fontSize: "9px",
            fontWeight: 600,
            letterSpacing: "1.3px",
            textTransform: "uppercase",
        },

        td: {
            padding: "13px 7px",
            borderBottom: "1px solid rgba(255,255,255,0.12)",
            color: "#E2E5EA",
            lineHeight: 1.5,
            verticalAlign: "top",
        },

        right: {
            textAlign: "right",
            whiteSpace: "nowrap",
        },

        bottomGrid: {
            display: "grid",
            gridTemplateColumns: "minmax(0, 0.9fr) minmax(0, 1.4fr)",
            gap: "18px",
            marginTop: "22px",
            alignItems: "stretch",
        },

        qrFrame: {
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "12px",
            minWidth: 0,
            padding: "16px 10px",
            border: "1px solid rgba(255,255,255,0.65)",
            borderRadius: "12px",
            background: "#090A0C",
            boxShadow: "inset 0 0 18px rgba(255,255,255,0.035)",
        },

        qrImage: {
            display: "block",
            width: "100%",
            maxWidth: "170px",
            aspectRatio: "1 / 1",
            objectFit: "contain",
            background: "#FFFFFF",
            padding: "6px",
            boxSizing: "border-box",
            borderRadius: "5px",
        },

        qrPlaceholder: {
            width: "100%",
            maxWidth: "170px",
            aspectRatio: "1 / 1",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "12px",
            boxSizing: "border-box",
            border: "1px dashed rgba(255,255,255,0.38)",
            borderRadius: "5px",
            color: "#BFC4CC",
            fontSize: "10px",
            textAlign: "center",
            lineHeight: 1.7,
        },

        scanText: {
            color: "#F1F3F6",
            fontSize: "9px",
            letterSpacing: "1.5px",
            textAlign: "center",
            textTransform: "uppercase",
        },

        summaryRow: {
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            gap: "12px",
            padding: "12px 0",
            borderBottom: "1px solid rgba(255,255,255,0.14)",
            fontSize: "12px",
        },

        summaryLabel: {
            color: "#BFC4CC",
            letterSpacing: "1px",
        },

        summaryValue: {
            color: "#FFFFFF",
            textAlign: "right",
            overflowWrap: "anywhere",
        },

        totalRow: {
            margin: "5px -16px 0",
            padding: "16px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "12px",
            borderTop: "1px solid #FFFFFF",
            borderBottom: "1px solid #FFFFFF",
            background:
                "linear-gradient(90deg, rgba(255,255,255,0.13), rgba(255,255,255,0.025))",
            boxShadow: "0 0 15px rgba(255,255,255,0.04)",
        },

        totalLabel: {
            color: "#FFFFFF",
            fontSize: "12px",
            fontWeight: 700,
            letterSpacing: "2px",
        },

        totalValue: {
            color: "#FFFFFF",
            fontSize: "clamp(17px, 3vw, 25px)",
            fontWeight: 700,
            textAlign: "right",
            overflowWrap: "anywhere",
            textShadow: "0 0 12px rgba(255,255,255,0.28)",
        },

        footer: {
            marginTop: "22px",
            padding: "20px 12px 6px",
            borderTop: "1px solid rgba(255,255,255,0.5)",
            textAlign: "center",
        },

        footerTitle: {
            margin: "0 0 9px",
            color: "#FFFFFF",
            fontSize: "12px",
            fontWeight: 600,
            letterSpacing: "3px",
        },

        footerText: {
            margin: 0,
            color: "#AEB4BE",
            fontSize: "10px",
            lineHeight: 1.8,
        },

        downloadButton: {
            display: "block",
            width: "100%",
            maxWidth: "270px",
            margin: "22px auto 0",
            padding: "14px 18px",
            border: "1px solid rgba(255,255,255,0.85)",
            borderRadius: "8px",
            background:
                "linear-gradient(135deg, #FFFFFF, #BFC4CC)",
            color: "#050607",
            fontSize: "11px",
            fontWeight: 700,
            letterSpacing: "2px",
            textTransform: "uppercase",
            cursor: "pointer",
            boxShadow: "0 0 18px rgba(255,255,255,0.12)",
        },
    };

    /* ================================================================
       DATA HELPERS
       ================================================================ */

    const getItemName = (item) =>
        item?.name ??
        item?.product_name ??
        item?.description ??
        item?.title ??
        "Item";

    const getItemQuantity = (item) =>
        item?.quantity ?? item?.qty ?? 1;

    const getItemPrice = (item) =>
        item?.price ??
        item?.unit_price ??
        item?.selling_price ??
        "";

    const getItemTotal = (item) =>
        item?.total ??
        item?.subtotal ??
        item?.line_total ??
        (
            Number(getItemQuantity(item)) *
            Number(getItemPrice(item))
        );

    const businessAddress =
        settings?.business_address ??
        settings?.address ??
        receiptData?.business_address ??
        "";

    const businessPhone =
        settings?.phone ??
        settings?.business_phone ??
        receiptData?.business_phone ??
        "";

    const businessEmail =
        settings?.email ??
        settings?.business_email ??
        receiptData?.business_email ??
        "";

    const receiptNumber =
        receiptId ??
        receiptData?.receipt_id ??
        receiptData?.receipt_number ??
        receiptData?.id ??
        "";

    const paymentMethod =
        receiptData?.payment_method ??
        receiptData?.paymentMethod ??
        "";

    const website =
        settings?.website ??
        settings?.website_url ??
        "";

    const qrImage = qrCodeUrl;

    return (
        <div style={styles.page}>
            <article style={styles.receipt}>
                <div style={styles.glow} />

                {watermarkUrl && (
                    <img
                        src={watermarkUrl}
                        alt=""
                        aria-hidden="true"
                        style={{
                            position: "absolute",
                            width: "220px",
                            height: "220px",
                            objectFit: "contain",
                            opacity: 0.035,
                            top: "35%",
                            left: "50%",
                            transform: "translateX(-50%)",
                            pointerEvents: "none",
                            zIndex: -1,
                        }}
                    />
                )}

                <div style={styles.topLine} />

                {/* BUSINESS BRANDING */}

                <header style={styles.header}>
                    <div style={styles.logoFrame}>
                        {logoUrl && (
                            <img
                                src={logoUrl}
                                alt="Business logo"
                                style={styles.logo}
                            />
                        )}
                    </div>

                    <div style={{ minWidth: 0 }}>
                        <div style={styles.eyebrow}>
                            Digital Transaction / Verified Record
                        </div>

                        <h1 style={styles.businessName}>
                            {businessName}
                        </h1>

                        {businessAddress && (
                            <div style={styles.address}>
                                {businessAddress}
                            </div>
                        )}

                        {businessPhone && (
                            <div style={styles.address}>
                                {businessPhone}
                            </div>
                        )}

                        {businessEmail && (
                            <div style={styles.address}>
                                {businessEmail}
                            </div>
                        )}
                    </div>
                </header>

                {/* TRANSACTION DETAILS */}

                <section style={styles.panel}>
                    <h2 style={styles.sectionTitle}>
                        Transaction Data
                    </h2>

                    <div style={styles.metadataGrid}>
                        <div>
                            <span style={styles.label}>
                                Receipt ID
                            </span>
                            <span style={styles.value}>
                                {receiptNumber || "—"}
                            </span>
                        </div>

                        <div>
                            <span style={styles.label}>
                                Transaction Date
                            </span>
                            <span style={styles.value}>
                                {formattedTransactionDate}
                            </span>
                        </div>

                        <div>
                            <span style={styles.label}>
                                Currency
                            </span>
                            <span style={styles.value}>
                                {activeCurrencySymbol ||
                                    settings?.currency ||
                                    receiptData?.currency ||
                                    "ZAR"}
                            </span>
                        </div>
                    </div>
                </section>

                {/* PURCHASED ITEMS */}

                <section style={styles.panel}>
                    <h2 style={styles.sectionTitle}>
                        Itemised Purchase
                    </h2>

                    <div style={styles.tableWrap}>
                        <table style={styles.table}>
                            <thead>
                                <tr>
                                    <th style={styles.th}>Item</th>
                                    <th
                                        style={{
                                            ...styles.th,
                                            ...styles.right,
                                        }}
                                    >
                                        Qty
                                    </th>
                                    <th
                                        style={{
                                            ...styles.th,
                                            ...styles.right,
                                        }}
                                    >
                                        Price
                                    </th>
                                    <th
                                        style={{
                                            ...styles.th,
                                            ...styles.right,
                                        }}
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
                                                index
                                            }
                                        >
                                            <td style={styles.td}>
                                                {getItemName(item)}
                                            </td>

                                            <td
                                                style={{
                                                    ...styles.td,
                                                    ...styles.right,
                                                }}
                                            >
                                                {getItemQuantity(item)}
                                            </td>

                                            <td
                                                style={{
                                                    ...styles.td,
                                                    ...styles.right,
                                                }}
                                            >
                                                {formatCurrency(
                                                    getItemPrice(item)
                                                )}
                                            </td>

                                            <td
                                                style={{
                                                    ...styles.td,
                                                    ...styles.right,
                                                }}
                                            >
                                                {formatCurrency(
                                                    getItemTotal(item)
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan={4}
                                            style={{
                                                ...styles.td,
                                                textAlign: "center",
                                                color: "#AEB4BE",
                                                padding: "24px 8px",
                                            }}
                                        >
                                            No transaction items available.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* QR VERIFICATION + TOTALS */}

                <div style={styles.bottomGrid}>
                    <section style={styles.qrFrame}>
                        {qrImage ? (
                            <img
                                src={qrImage}
                                alt="Receipt QR code"
                                style={styles.qrImage}
                            />
                        ) : (
                            <div style={styles.qrPlaceholder}>
                                QR code will appear here when the actual
                                business QR asset is connected.
                            </div>
                        )}

                        <div style={styles.scanText}>
                            Scan to verify
                        </div>
                    </section>

                    <section
                        style={{
                            ...styles.panel,
                            marginTop: 0,
                            minWidth: 0,
                        }}
                    >
                        <h2 style={styles.sectionTitle}>
                            Payment Summary
                        </h2>

                        <div style={styles.summaryRow}>
                            <span style={styles.summaryLabel}>
                                Subtotal
                            </span>
                            <span style={styles.summaryValue}>
                                {formatCurrency(
                                    receiptData?.subtotal ??
                                    receiptData?.sub_total ??
                                    ""
                                ) || "—"}
                            </span>
                        </div>

                        <div style={styles.summaryRow}>
                            <span style={styles.summaryLabel}>
                                VAT / Tax
                            </span>
                            <span style={styles.summaryValue}>
                                {vat !== null && vat !== ""
                                    ? formatCurrency(vat)
                                    : "—"}
                            </span>
                        </div>

                        <div style={styles.totalRow}>
                            <span style={styles.totalLabel}>
                                TOTAL
                            </span>
                            <span style={styles.totalValue}>
                                {formatCurrency(total) || "—"}
                            </span>
                        </div>

                        <div style={styles.summaryRow}>
                            <span style={styles.summaryLabel}>
                                Payment
                            </span>
                            <span style={styles.summaryValue}>
                                {paymentMethod || "—"}
                            </span>
                        </div>

                        {checkoutPayloadLink && (
                            <a
                                href={checkoutPayloadLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                    display: "inline-block",
                                    marginTop: "12px",
                                    color: "#FFFFFF",
                                    fontSize: "10px",
                                    textUnderlineOffset: "4px",
                                }}
                            >
                                Open transaction link
                            </a>
                        )}
                    </section>
                </div>

                {/* AUTHENTICITY FOOTER */}

                <footer style={styles.footer}>
                    <h2 style={styles.footerTitle}>
                        THANK YOU FOR YOUR PURCHASE
                    </h2>

                    <p style={styles.footerText}>
                        Digital transaction receipt
                    </p>

                    {website && (
                        <p
                            style={{
                                ...styles.footerText,
                                marginTop: "8px",
                                letterSpacing: "1px",
                            }}
                        >
                            {website}
                        </p>
                    )}

                    <button
                        type="button"
                        onClick={handleDownload}
                        style={styles.downloadButton}
                    >
                        Download Till Slip
                    </button>
                </footer>
            </article>
        </div>
    );
}
