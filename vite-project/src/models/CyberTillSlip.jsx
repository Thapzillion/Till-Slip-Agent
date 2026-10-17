
import React from "react";

export default function CyberTillSlip({
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
                "CyberTillSlip: onDownload handler was not supplied."
            );
        }
    };

    /* ================================================================
       CYBER NEON PRESENTATION HELPERS
       ================================================================ */

    const businessName =
        settings?.business_name ||
        settings?.company_name ||
        receiptData?.business_name ||
        receiptData?.company_name ||
        "";

    const businessAddress =
        settings?.business_address ||
        settings?.address ||
        receiptData?.business_address ||
        receiptData?.address ||
        "";

    const businessEmail =
        settings?.email ||
        settings?.business_email ||
        receiptData?.business_email ||
        "";

    const businessPhone =
        settings?.phone ||
        settings?.business_phone ||
        receiptData?.business_phone ||
        "";

    const transactionId =
        receiptId ||
        receiptData?.receipt_id ||
        receiptData?.transaction_id ||
        receiptData?.id ||
        "";

    const qrSource = qrCodeUrl || "";

    const qrTarget = checkoutPayloadLink || "";

    const displayQr = Boolean(qrSource);

    const getItemName = (item) =>
        item?.name ??
        item?.product_name ??
        item?.description ??
        item?.title ??
        "Item";

    const getItemQuantity = (item) =>
        item?.quantity ??
        item?.qty ??
        1;

    const getItemPrice = (item) =>
        item?.unit_price ??
        item?.price ??
        item?.amount ??
        "";

    const getItemTotal = (item) =>
        item?.line_total ??
        item?.total ??
        item?.total_price ??
        "";

    const displayItems = receiptDataItems;

    const displaySubtotal =
        receiptData?.subtotal ??
        receiptData?.sub_total ??
        null;

    const displayDiscount =
        receiptData?.discount ??
        receiptData?.discount_amount ??
        null;

    const displayPaymentMethod =
        receiptData?.payment_method ??
        receiptData?.paymentMethod ??
        "";

    const displayCurrency = (value) => formatCurrency(value);

    const hasExtraTotals =
        displaySubtotal !== null ||
        displayDiscount !== null ||
        vat !== null;

    /* ================================================================
       CYBER NEON UI
       ================================================================ */

    const styles = {
        page: {
            width: "100%",
            boxSizing: "border-box",
            padding: "28px 14px",
            background:
                "radial-gradient(ellipse at 50% 0%, #082844 0%, #030914 42%, #010308 100%)",
            color: "#EAF8FF",
            fontFamily:
                "'Inter', 'Segoe UI', system-ui, -apple-system, sans-serif",
            minHeight: "100%",
        },

        shell: {
            position: "relative",
            isolation: "isolate",
            overflow: "hidden",
            width: "100%",
            maxWidth: "580px",
            margin: "0 auto",
            padding: "clamp(20px, 5vw, 38px)",
            boxSizing: "border-box",
            border: "1px solid rgba(0, 195, 255, 0.62)",
            borderRadius: "22px",
            background:
                "linear-gradient(160deg, rgba(5, 20, 38, 0.98), rgba(2, 7, 17, 0.99) 55%, rgba(3, 17, 30, 0.98))",
            boxShadow:
                "0 0 14px rgba(0, 183, 255, 0.18), 0 0 48px rgba(0, 110, 255, 0.12), inset 0 0 36px rgba(0, 153, 255, 0.045)",
        },

        watermark: {
            position: "absolute",
            inset: "0",
            width: "100%",
            height: "100%",
            objectFit: "contain",
            opacity: 0.035,
            pointerEvents: "none",
            zIndex: -1,
        },

        corner: {
            position: "absolute",
            width: "38px",
            height: "38px",
            borderColor: "#00C8FF",
            borderStyle: "solid",
            pointerEvents: "none",
            opacity: 0.9,
        },

        header: {
            position: "relative",
            textAlign: "center",
            paddingBottom: "24px",
            borderBottom: "1px dashed rgba(0, 196, 255, 0.4)",
        },

        logoWrap: {
            width: "88px",
            height: "88px",
            margin: "0 auto 18px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "50%",
            border: "1px solid rgba(0, 205, 255, 0.85)",
            background:
                "radial-gradient(circle, rgba(0, 151, 255, 0.18), rgba(1, 8, 19, 0.96))",
            boxShadow:
                "0 0 16px rgba(0, 183, 255, 0.34), inset 0 0 20px rgba(0, 183, 255, 0.12)",
            overflow: "hidden",
        },

        logo: {
            maxWidth: "78%",
            maxHeight: "78%",
            objectFit: "contain",
        },

        businessName: {
            color: "#F1FBFF",
            fontSize: "clamp(19px, 4vw, 26px)",
            fontWeight: 800,
            letterSpacing: "0.15em",
            overflowWrap: "anywhere",
            textShadow: "0 0 18px rgba(0, 190, 255, 0.4)",
            margin: "0 0 10px",
        },

        eyebrow: {
            color: "#00D8FF",
            fontSize: "11px",
            letterSpacing: "0.32em",
            fontWeight: 700,
            textTransform: "uppercase",
            margin: "0 0 10px",
        },

        title: {
            color: "#D9F7FF",
            fontSize: "12px",
            fontWeight: 700,
            letterSpacing: "0.34em",
            textTransform: "uppercase",
            margin: "20px 0 0",
        },

        section: {
            padding: "23px 0",
            borderBottom: "1px dashed rgba(0, 196, 255, 0.30)",
        },

        sectionTitle: {
            color: "#00D4FF",
            fontSize: "11px",
            fontWeight: 800,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            margin: "0 0 15px",
        },

        label: {
            display: "block",
            fontSize: "10px",
            color: "#779BB8",
            letterSpacing: "0.13em",
            textTransform: "uppercase",
            marginBottom: "7px",
        },

        value: {
            color: "#E5F5FF",
            fontSize: "13px",
            lineHeight: 1.65,
            overflowWrap: "anywhere",
        },

        transactionGrid: {
            display: "grid",
            gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
            gap: "18px",
        },

        address: {
            color: "#B7D1E3",
            fontSize: "12px",
            lineHeight: 1.9,
            whiteSpace: "pre-line",
            overflowWrap: "anywhere",
        },

        table: {
            width: "100%",
            borderCollapse: "collapse",
            tableLayout: "fixed",
            fontSize: "12px",
        },

        th: {
            textAlign: "left",
            padding: "10px 3px",
            color: "#00D4FF",
            fontSize: "9px",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            borderBottom: "1px solid rgba(0, 196, 255, 0.4)",
        },

        td: {
            padding: "13px 3px",
            color: "#D5EAF7",
            lineHeight: 1.5,
            borderBottom: "1px solid rgba(95, 156, 194, 0.13)",
            overflowWrap: "anywhere",
            verticalAlign: "top",
        },

        amount: {
            textAlign: "right",
            whiteSpace: "normal",
            overflowWrap: "anywhere",
            fontVariantNumeric: "tabular-nums",
        },

        summaryRow: {
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: "12px",
            padding: "7px 0",
            color: "#A9C4D8",
            fontSize: "12px",
        },

        totalBox: {
            marginTop: "16px",
            padding: "17px 14px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "12px",
            border: "1px solid rgba(0, 195, 255, 0.8)",
            borderRadius: "8px",
            background:
                "linear-gradient(110deg, rgba(0, 145, 255, 0.12), rgba(0, 18, 36, 0.7))",
            boxShadow:
                "inset 0 0 18px rgba(0, 195, 255, 0.06), 0 0 15px rgba(0, 183, 255, 0.10)",
        },

        totalLabel: {
            color: "#00D4FF",
            fontSize: "12px",
            fontWeight: 800,
            letterSpacing: "0.2em",
        },

        totalValue: {
            color: "#43E8FF",
            fontSize: "clamp(18px, 4vw, 25px)",
            fontWeight: 800,
            textAlign: "right",
            overflowWrap: "anywhere",
            textShadow: "0 0 18px rgba(0, 195, 255, 0.42)",
        },

        qrSection: {
            display: "grid",
            gridTemplateColumns: "minmax(105px, 150px) minmax(0, 1fr)",
            gap: "18px",
            alignItems: "center",
        },

        qrFrame: {
            aspectRatio: "1 / 1",
            minWidth: 0,
            padding: "8px",
            boxSizing: "border-box",
            border: "1px solid rgba(0, 195, 255, 0.85)",
            borderRadius: "8px",
            background: "#F6FCFF",
            boxShadow: "0 0 18px rgba(0, 174, 255, 0.20)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
        },

        qrImage: {
            display: "block",
            width: "100%",
            height: "100%",
            objectFit: "contain",
        },

        qrPlaceholder: {
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background:
                "repeating-linear-gradient(45deg, #E8F7FF 0px, #E8F7FF 4px, #FFFFFF 4px, #FFFFFF 8px)",
            color: "#123A55",
            fontSize: "11px",
            textAlign: "center",
            padding: "8px",
            boxSizing: "border-box",
        },

        downloadButton: {
            width: "100%",
            minHeight: "58px",
            marginTop: "26px",
            padding: "15px 18px",
            boxSizing: "border-box",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "12px",
            border: "1px solid #00D4FF",
            borderRadius: "9px",
            background:
                "linear-gradient(110deg, rgba(0, 117, 255, 0.2), rgba(0, 24, 48, 0.96))",
            color: "#55E8FF",
            fontFamily: "inherit",
            fontSize: "12px",
            fontWeight: 800,
            letterSpacing: "0.14em",
            cursor: "pointer",
            textTransform: "uppercase",
            boxShadow:
                "0 0 17px rgba(0, 180, 255, 0.15), inset 0 0 15px rgba(0, 180, 255, 0.06)",
            transition:
                "transform 180ms ease, box-shadow 180ms ease, background 180ms ease",
        },

        footer: {
            marginTop: "22px",
            color: "#7898B2",
            fontSize: "10px",
            lineHeight: 1.8,
            textAlign: "center",
            letterSpacing: "0.08em",
            overflowWrap: "anywhere",
        },
    };

    const renderOptionalDetail = (label, value) => {
        if (value === null || value === undefined || value === "") {
            return null;
        }

        return (
            <div style={{ marginTop: "8px" }}>
                <span style={styles.label}>{label}</span>
                <div style={styles.value}>{String(value)}</div>
            </div>
        );
    };

    return (
        <div style={styles.page} className="cyber-till-page">
            <style>{`
                @keyframes cyberPulse {
                    0%, 100% {
                        box-shadow:
                            0 0 12px rgba(0, 183, 255, 0.16),
                            inset 0 0 18px rgba(0, 183, 255, 0.04);
                    }
                    50% {
                        box-shadow:
                            0 0 26px rgba(0, 183, 255, 0.28),
                            inset 0 0 24px rgba(0, 183, 255, 0.08);
                    }
                }

                @keyframes cyberScan {
                    0% { transform: translateY(-150%); opacity: 0; }
                    15% { opacity: 0.55; }
                    85% { opacity: 0.35; }
                    100% { transform: translateY(600%); opacity: 0; }
                }

                .cyber-till-page *,
                .cyber-till-page *::before,
                .cyber-till-page *::after {
                    box-sizing: border-box;
                }

                .cyber-till-shell {
                    animation: cyberPulse 5s ease-in-out infinite;
                }

                .cyber-download:hover {
                    transform: translateY(-2px);
                    background:
                        linear-gradient(110deg, rgba(0, 155, 255, 0.30), rgba(0, 37, 64, 0.98));
                    box-shadow:
                        0 0 28px rgba(0, 195, 255, 0.35),
                        inset 0 0 18px rgba(0, 195, 255, 0.10);
                }

                .cyber-download:focus-visible {
                    outline: 2px solid #E8FBFF;
                    outline-offset: 4px;
                }

                .cyber-scan-line {
                    position: absolute;
                    left: 0;
                    right: 0;
                    top: 0;
                    height: 50px;
                    pointer-events: none;
                    background:
                        linear-gradient(
                            to bottom,
                            transparent,
                            rgba(0, 195, 255, 0.045),
                            transparent
                        );
                    animation: cyberScan 9s linear infinite;
                }

                @media (prefers-reduced-motion: reduce) {
                    .cyber-till-shell,
                    .cyber-scan-line {
                        animation: none !important;
                    }

                    .cyber-download {
                        transition: none !important;
                    }
                }

                @media (max-width: 380px) {
                    .cyber-till-page {
                        padding: 12px 7px !important;
                    }

                    .cyber-till-page .cyber-qr-section {
                        grid-template-columns: 1fr !important;
                    }

                    .cyber-till-page .cyber-qr-frame {
                        max-width: 150px;
                        width: 100%;
                        margin: 0 auto;
                    }

                    .cyber-till-page .cyber-transaction-grid {
                        gap: 10px !important;
                    }
                }

                @media print {
                    .cyber-till-page {
                        padding: 0 !important;
                        background: #FFFFFF !important;
                        color: #111111 !important;
                        print-color-adjust: exact;
                        -webkit-print-color-adjust: exact;
                    }

                    .cyber-till-shell {
                        max-width: none !important;
                        box-shadow: none !important;
                        animation: none !important;
                        break-inside: avoid;
                    }

                    .cyber-download,
                    .cyber-scan-line {
                        display: none !important;
                    }
                }
            `}</style>

            <article
                className="cyber-till-shell"
                style={styles.shell}
            >
                {watermarkUrl && (
                    <img
                        src={watermarkUrl}
                        alt=""
                        aria-hidden="true"
                        style={styles.watermark}
                    />
                )}

                <div
                    className="cyber-scan-line"
                    aria-hidden="true"
                />

                <span
                    aria-hidden="true"
                    style={{
                        ...styles.corner,
                        top: 0,
                        left: 0,
                        borderWidth: "2px 0 0 2px",
                        borderTopLeftRadius: "20px",
                    }}
                />

                <span
                    aria-hidden="true"
                    style={{
                        ...styles.corner,
                        top: 0,
                        right: 0,
                        borderWidth: "2px 2px 0 0",
                        borderTopRightRadius: "20px",
                    }}
                />

                <span
                    aria-hidden="true"
                    style={{
                        ...styles.corner,
                        bottom: 0,
                        left: 0,
                        borderWidth: "0 0 2px 2px",
                        borderBottomLeftRadius: "20px",
                    }}
                />

                <span
                    aria-hidden="true"
                    style={{
                        ...styles.corner,
                        bottom: 0,
                        right: 0,
                        borderWidth: "0 2px 2px 0",
                        borderBottomRightRadius: "20px",
                    }}
                />

                {/* BUSINESS BRANDING */}

                <header style={styles.header}>
                    <div style={styles.logoWrap}>
                        {logoUrl ? (
                            <img
                                src={logoUrl}
                                alt="Business logo"
                                style={styles.logo}
                            />
                        ) : (
                            <span
                                aria-hidden="true"
                                style={{
                                    color: "#00D4FF",
                                    fontSize: "34px",
                                    fontWeight: 300,
                                    textShadow:
                                        "0 0 18px rgba(0, 195, 255, 0.7)",
                                }}
                            >
                                ◈
                            </span>
                        )}
                    </div>

                    {businessName && (
                        <h2 style={styles.businessName}>
                            {businessName}
                        </h2>
                    )}

                    <p style={styles.eyebrow}>
                        DIGITAL TRANSACTION RECORD
                    </p>

                    <div style={styles.title}>
                        ◆ Digital Till Slip ◆
                    </div>
                </header>

                {/* TRANSACTION INFORMATION */}

                <section style={styles.section}>
                    <div
                        className="cyber-transaction-grid"
                        style={styles.transactionGrid}
                    >
                        <div>
                            <span style={styles.label}>
                                Transaction ID
                            </span>
                            <div style={styles.value}>
                                {transactionId || "—"}
                            </div>
                        </div>

                        <div>
                            <span style={styles.label}>
                                Transaction Date
                            </span>
                            <div style={styles.value}>
                                {formattedTransactionDate}
                            </div>
                        </div>
                    </div>
                </section>

                {/* BUSINESS ADDRESS AND CONTACT DETAILS */}

                {(businessAddress || businessEmail || businessPhone) && (
                    <section style={styles.section}>
                        <h3 style={styles.sectionTitle}>
                            Business Information
                        </h3>

                        {businessAddress && (
                            <div style={styles.address}>
                                {businessAddress}
                            </div>
                        )}

                        {renderOptionalDetail("Email", businessEmail)}
                        {renderOptionalDetail("Telephone", businessPhone)}
                    </section>
                )}

                {/* PURCHASED ITEMS */}

                <section style={styles.section}>
                    <h3 style={styles.sectionTitle}>
                        Transaction Items
                    </h3>

                    <div style={{ width: "100%", overflowX: "auto" }}>
                        <table style={styles.table}>
                            <colgroup>
                                <col style={{ width: "43%" }} />
                                <col style={{ width: "12%" }} />
                                <col style={{ width: "20%" }} />
                                <col style={{ width: "25%" }} />
                            </colgroup>

                            <thead>
                                <tr>
                                    <th style={styles.th}>Item</th>
                                    <th
                                        style={{
                                            ...styles.th,
                                            textAlign: "center",
                                        }}
                                    >
                                        Qty
                                    </th>
                                    <th
                                        style={{
                                            ...styles.th,
                                            textAlign: "right",
                                        }}
                                    >
                                        Price
                                    </th>
                                    <th
                                        style={{
                                            ...styles.th,
                                            textAlign: "right",
                                        }}
                                    >
                                        Total
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {displayItems.length > 0 ? (
                                    displayItems.map((item, index) => (
                                        <tr key={item?.id ?? index}>
                                            <td style={styles.td}>
                                                {getItemName(item)}
                                            </td>

                                            <td
                                                style={{
                                                    ...styles.td,
                                                    textAlign: "center",
                                                }}
                                            >
                                                {getItemQuantity(item)}
                                            </td>

                                            <td
                                                style={{
                                                    ...styles.td,
                                                    ...styles.amount,
                                                }}
                                            >
                                                {displayCurrency(
                                                    getItemPrice(item)
                                                )}
                                            </td>

                                            <td
                                                style={{
                                                    ...styles.td,
                                                    ...styles.amount,
                                                }}
                                            >
                                                {displayCurrency(
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
                                                color: "#779BB8",
                                                padding: "24px 4px",
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

                {/* TOTALS */}

                <section style={styles.section}>
                    {hasExtraTotals && (
                        <div style={{ marginBottom: "12px" }}>
                            {displaySubtotal !== null && (
                                <div style={styles.summaryRow}>
                                    <span>Subtotal</span>
                                    <span style={styles.amount}>
                                        {displayCurrency(displaySubtotal)}
                                    </span>
                                </div>
                            )}

                            {displayDiscount !== null && (
                                <div style={styles.summaryRow}>
                                    <span>Discount</span>
                                    <span
                                        style={{
                                            ...styles.amount,
                                            color: "#66F2B7",
                                        }}
                                    >
                                        {displayCurrency(displayDiscount)}
                                    </span>
                                </div>
                            )}

                            {vat !== null && (
                                <div style={styles.summaryRow}>
                                    <span>VAT</span>
                                    <span style={styles.amount}>
                                        {displayCurrency(vat)}
                                    </span>
                                </div>
                            )}
                        </div>
                    )}

                    <div style={styles.totalBox}>
                        <span style={styles.totalLabel}>
                            TOTAL
                        </span>

                        <span style={styles.totalValue}>
                            {displayCurrency(total) || "—"}
                        </span>
                    </div>

                    {renderOptionalDetail(
                        "Payment Method",
                        displayPaymentMethod
                    )}
                </section>

                {/* QR VERIFICATION */}

                <section
                    className="cyber-qr-section"
                    style={styles.section}
                >
                    <div
                        className="cyber-qr-frame"
                        style={styles.qrFrame}
                    >
                        {displayQr ? (
                            <img
                                src={qrSource}
                                alt="Receipt QR code"
                                style={styles.qrImage}
                            />
                        ) : (
                            <div style={styles.qrPlaceholder}>
                                QR CODE
                                <br />
                                NOT PROVIDED
                            </div>
                        )}
                    </div>

                    <div style={{ minWidth: 0 }}>
                        <h3 style={styles.sectionTitle}>
                            Scan to Verify
                        </h3>

                        <p
                            style={{
                                color: "#B5D0E2",
                                fontSize: "12px",
                                lineHeight: 1.8,
                                margin: "0 0 10px",
                            }}
                        >
                            Scan the QR code to access the transaction
                            verification or checkout destination.
                        </p>

                        {qrTarget && (
                            <a
                                href={qrTarget}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                    color: "#38DFFF",
                                    fontSize: "11px",
                                    overflowWrap: "anywhere",
                                    textDecoration: "none",
                                }}
                            >
                                Open transaction link ↗
                            </a>
                        )}

                        {renderOptionalDetail(
                            "Receipt Reference",
                            transactionId
                        )}
                    </div>
                </section>

                {/* DOWNLOAD ACTION */}

                <button
                    type="button"
                    className="cyber-download"
                    onClick={handleDownload}
                    style={styles.downloadButton}
                >
                    <svg
                        width="22"
                        height="22"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                    >
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <path d="M7 10l5 5 5-5" />
                        <path d="M12 15V3" />
                    </svg>

                    <span>Download Till Slip</span>
                </button>

                <footer style={styles.footer}>
                    {businessName && (
                        <div>{businessName}</div>
                    )}

                    <div>
                        DIGITAL RECEIPT
                        {transactionId ? ` · ${transactionId}` : ""}
                    </div>

                    <div>
                        {isExpired
                            ? "Receipt status: expired"
                            : "Secure transaction record"}
                    </div>

                    {voucher?.code && (
                        <div>
                            Voucher: {voucher.code}
                        </div>
                    )}

                    {daysRemaining > 0 && (
                        <div>
                            {daysRemaining} day(s) remaining
                        </div>
                    )}
                </footer>
            </article>
        </div>
    );
}
