import React from "react";

export default function ClassicTillSlip({
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

    // Connected business profile/input — no simulator input is added.
    businessName = "",
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
            return `${resolvedCurrencySymbol}${resolvedCurrencySymbol ? " " : ""
                }${numeric.toFixed(2)}`;
        }

        return `${resolvedCurrencySymbol}${resolvedCurrencySymbol ? " " : ""
            }${raw}`;
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
                "ClassicTillSlip: onDownload handler was not supplied."
            );
        }
    };

    /* ================================================================
       DISPLAY HELPERS
       ================================================================ */

    const businessAddress =
        settings?.business_address ||
        settings?.address ||
        "";

    const businessPhone =
        settings?.business_phone ||
        settings?.phone ||
        "";

    const businessEmail =
        settings?.business_email ||
        settings?.email ||
        "";

    const receiptNumber =
        receiptId ||
        receiptData?.receipt_number ||
        receiptData?.receipt_no ||
        receiptData?.id ||
        "";

    const paymentMethod =
        receiptData?.payment_method ||
        receiptData?.paymentMethod ||
        "";

    const amountPaid =
        receiptData?.amount_paid ??
        receiptData?.amountPaid ??
        total;

    const subtotal =
        receiptData?.subtotal ??
        receiptData?.sub_total ??
        null;

    const formatDate = (date) =>
        date.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        }).toUpperCase();

    const formatTime = (date) =>
        date.toLocaleTimeString("en-GB", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false,
        });

    const getItemName = (item) =>
        item?.name ||
        item?.description ||
        item?.product_name ||
        item?.productName ||
        "Item";

    const getItemQuantity = (item) =>
        item?.quantity ?? item?.qty ?? 1;

    const getItemPrice = (item) =>
        item?.unit_price ??
        item?.price ??
        item?.amount ??
        "";

    const getItemTotal = (item) =>
        item?.total ??
        item?.total_price ??
        item?.line_total ??
        item?.subtotal ??
        "";

    const qrImage = qrCodeUrl || "";

    /* ================================================================
       CLASSIC TILL SLIP — DIGITAL PRESENTATION
       ================================================================ */

    const styles = {
        page: {
            width: "100%",
            padding: "28px 12px",
            boxSizing: "border-box",
            background:
                "radial-gradient(ellipse at top, #f4f0e7 0%, #e6dfd2 70%, #d5cbb9 100%)",
            color: "#191814",
            fontFamily:
                "'Georgia', 'Times New Roman', serif",
        },

        receipt: {
            position: "relative",
            isolation: "isolate",
            overflow: "hidden",
            width: "100%",
            maxWidth: "470px",
            margin: "0 auto",
            padding: "30px 25px 26px",
            boxSizing: "border-box",
            backgroundColor: "#fffdf8",
            backgroundImage:
                "linear-gradient(115deg, rgba(255,255,255,0.6), transparent 55%), repeating-linear-gradient(0deg, rgba(125,103,66,0.018) 0px, rgba(125,103,66,0.018) 1px, transparent 1px, transparent 4px)",
            border: "1px solid rgba(139,112,65,0.25)",
            boxShadow:
                "0 22px 55px rgba(45,34,17,0.16), 0 3px 10px rgba(45,34,17,0.08)",
        },

        content: {
            position: "relative",
            zIndex: 1,
        },

        gold: "#96743b",
        muted: "#777064",

        ornament: {
            color: "#a1834b",
            textAlign: "center",
            fontSize: "25px",
            lineHeight: 1.2,
            letterSpacing: "7px",
        },

        businessName: {
            margin: "12px 0 8px",
            fontSize: "clamp(22px, 5.8vw, 34px)",
            lineHeight: 1.15,
            textAlign: "center",
            fontWeight: 700,
            letterSpacing: "2px",
            overflowWrap: "anywhere",
            textTransform: "uppercase",
        },

        subtitle: {
            textAlign: "center",
            color: "#8b7043",
            fontFamily: "'Georgia', serif",
            fontStyle: "italic",
            fontSize: "15px",
            margin: "10px 0 18px",
        },

        divider: {
            height: "1px",
            border: 0,
            background:
                "linear-gradient(to right, transparent, #a78a53 12%, #a78a53 88%, transparent)",
            margin: "18px 0",
        },

        metadata: {
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "12px 14px",
            fontFamily: "Arial, sans-serif",
            fontSize: "11px",
            lineHeight: 1.6,
        },

        metadataValue: {
            display: "block",
            marginTop: "3px",
            fontSize: "12px",
            fontWeight: 600,
            overflowWrap: "anywhere",
        },

        sectionLabel: {
            fontFamily: "Arial, sans-serif",
            fontSize: "10px",
            fontWeight: 700,
            letterSpacing: "1.8px",
            color: "#75674e",
            textTransform: "uppercase",
        },

        table: {
            width: "100%",
            borderCollapse: "collapse",
            tableLayout: "fixed",
            fontFamily: "Arial, sans-serif",
            fontSize: "11px",
        },

        tableHeader: {
            background: "#26241f",
            color: "#fffdf8",
            fontSize: "9px",
            letterSpacing: "1px",
            textTransform: "uppercase",
        },

        cell: {
            padding: "12px 4px",
            borderBottom: "1px dashed #d8cebd",
            verticalAlign: "top",
            overflowWrap: "anywhere",
        },

        totals: {
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            fontFamily: "Arial, sans-serif",
            fontSize: "12px",
        },

        totalRow: {
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            gap: "12px",
        },

        grandTotal: {
            padding: "14px 0",
            marginTop: "2px",
            borderTop: "1px solid #a58a58",
            borderBottom: "3px double #a58a58",
            fontFamily: "Georgia, serif",
            fontSize: "19px",
            fontWeight: 700,
        },

        footer: {
            textAlign: "center",
            fontFamily: "Arial, sans-serif",
            fontSize: "10px",
            lineHeight: 1.9,
            letterSpacing: "1.2px",
        },

        downloadButton: {
            display: "block",
            width: "100%",
            maxWidth: "470px",
            margin: "18px auto 0",
            padding: "14px 20px",
            border: "1px solid #9b7b42",
            borderRadius: "3px",
            background:
                "linear-gradient(135deg, #302a20, #171612)",
            color: "#fffaf0",
            fontFamily: "Arial, sans-serif",
            fontSize: "12px",
            fontWeight: 700,
            letterSpacing: "1.5px",
            cursor: "pointer",
            textTransform: "uppercase",
        },
    };

    return (
        <div style={styles.page}>
            <article
                style={styles.receipt}
                aria-label={`${businessName || "Business"} digital till slip`}
            >
                {/* Subtle logo watermark */}
                {watermarkUrl && (
                    <div
                        aria-hidden="true"
                        style={{
                            position: "absolute",
                            zIndex: 0,
                            inset: "25% 10%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            pointerEvents: "none",
                        }}
                    >
                        <img
                            src={watermarkUrl}
                            alt=""
                            style={{
                                maxWidth: "100%",
                                maxHeight: "300px",
                                objectFit: "contain",
                                opacity: 0.045,
                            }}
                        />
                    </div>
                )}

                <div style={styles.content}>
                    {/* Classic ornamental header */}
                    <div style={styles.ornament} aria-hidden="true">
                        ❧ ✦ ❧
                    </div>

                    {logoUrl && (
                        <div
                            style={{
                                textAlign: "center",
                                margin: "14px 0",
                            }}
                        >
                            <img
                                src={logoUrl}
                                alt={`${businessName || "Business"} logo`}
                                style={{
                                    maxWidth: "100px",
                                    maxHeight: "75px",
                                    objectFit: "contain",
                                }}
                            />
                        </div>
                    )}

                    {/* Real business name; no hardcoded TILL SLIP title */}
                    {businessName && (
                        <h1 style={styles.businessName}>
                            {businessName}
                        </h1>
                    )}

                    {(businessAddress || businessPhone || businessEmail) && (
                        <div
                            style={{
                                textAlign: "center",
                                color: styles.muted,
                                fontFamily: "Arial, sans-serif",
                                fontSize: "11px",
                                lineHeight: 1.8,
                                overflowWrap: "anywhere",
                            }}
                        >
                            {businessAddress && <div>{businessAddress}</div>}
                            {businessPhone && <div>{businessPhone}</div>}
                            {businessEmail && <div>{businessEmail}</div>}
                        </div>
                    )}

                    <div style={styles.subtitle}>
                        Thank you for your purchase
                    </div>

                    <hr style={styles.divider} />

                    {/* Transaction information */}
                    <div style={styles.metadata}>
                        <div>
                            <span style={styles.sectionLabel}>Date</span>
                            <span style={styles.metadataValue}>
                                {formatDate(transactionDate)}
                            </span>
                        </div>

                        <div>
                            <span style={styles.sectionLabel}>Receipt No.</span>
                            <span style={styles.metadataValue}>
                                {receiptNumber || "—"}
                            </span>
                        </div>

                        <div>
                            <span style={styles.sectionLabel}>Time</span>
                            <span style={styles.metadataValue}>
                                {formatTime(transactionDate)}
                            </span>
                        </div>

                        <div>
                            <span style={styles.sectionLabel}>Currency</span>
                            <span style={styles.metadataValue}>
                                {settings?.currency ||
                                    receiptData?.currency ||
                                    "ZAR"}
                            </span>
                        </div>
                    </div>

                    <hr
                        style={{
                            ...styles.divider,
                            marginTop: "20px",
                        }}
                    />

                    {/* Itemized receipt */}
                    <div style={{ marginBottom: "8px" }}>
                        <div
                            style={{
                                ...styles.sectionLabel,
                                marginBottom: "10px",
                            }}
                        >
                            Order details
                        </div>

                        <table style={styles.table}>
                            <colgroup>
                                <col style={{ width: "13%" }} />
                                <col style={{ width: "43%" }} />
                                <col style={{ width: "21%" }} />
                                <col style={{ width: "23%" }} />
                            </colgroup>

                            <thead>
                                <tr style={styles.tableHeader}>
                                    <th
                                        style={{
                                            ...styles.cell,
                                            textAlign: "left",
                                        }}
                                    >
                                        Qty
                                    </th>
                                    <th
                                        style={{
                                            ...styles.cell,
                                            textAlign: "left",
                                        }}
                                    >
                                        Description
                                    </th>
                                    <th
                                        style={{
                                            ...styles.cell,
                                            textAlign: "right",
                                        }}
                                    >
                                        Price
                                    </th>
                                    <th
                                        style={{
                                            ...styles.cell,
                                            textAlign: "right",
                                        }}
                                    >
                                        Total
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {receiptDataItems.map((item, index) => (
                                    <tr
                                        key={
                                            item?.id ??
                                            item?.product_id ??
                                            index
                                        }
                                    >
                                        <td style={styles.cell}>
                                            {getItemQuantity(item)}
                                        </td>

                                        <td style={styles.cell}>
                                            {getItemName(item)}
                                        </td>

                                        <td
                                            style={{
                                                ...styles.cell,
                                                textAlign: "right",
                                            }}
                                        >
                                            {formatCurrency(getItemPrice(item))}
                                        </td>

                                        <td
                                            style={{
                                                ...styles.cell,
                                                textAlign: "right",
                                            }}
                                        >
                                            {formatCurrency(getItemTotal(item))}
                                        </td>
                                    </tr>
                                ))}

                                {receiptDataItems.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan={4}
                                            style={{
                                                ...styles.cell,
                                                textAlign: "center",
                                                color: styles.muted,
                                                padding: "20px 4px",
                                            }}
                                        >
                                            No receipt items available
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <hr style={styles.divider} />

                    {/* Totals and payment */}
                    <div style={styles.totals}>
                        {subtotal !== null && subtotal !== "" && (
                            <div style={styles.totalRow}>
                                <span>Subtotal</span>
                                <span>{formatCurrency(subtotal)}</span>
                            </div>
                        )}

                        {vat !== null && vat !== "" && (
                            <div style={styles.totalRow}>
                                <span>VAT</span>
                                <span>{formatCurrency(vat)}</span>
                            </div>
                        )}

                        <div
                            style={{
                                ...styles.totalRow,
                                ...styles.grandTotal,
                            }}
                        >
                            <span>TOTAL</span>
                            <span>{formatCurrency(total)}</span>
                        </div>

                        {paymentMethod && (
                            <div style={styles.totalRow}>
                                <span>Payment method</span>
                                <span
                                    style={{
                                        textAlign: "right",
                                        textTransform: "uppercase",
                                    }}
                                >
                                    {String(paymentMethod)}
                                </span>
                            </div>
                        )}

                        {amountPaid !== null &&
                            amountPaid !== "" && (
                                <div style={styles.totalRow}>
                                    <span>Amount paid</span>
                                    <span>{formatCurrency(amountPaid)}</span>
                                </div>
                            )}
                    </div>

                    {/* Voucher status — only when applicable */}
                    {voucher && (
                        <div
                            style={{
                                marginTop: "18px",
                                padding: "12px",
                                border: "1px dashed #b39a6b",
                                background: "rgba(180,151,94,0.06)",
                                fontFamily: "Arial, sans-serif",
                                fontSize: "11px",
                                lineHeight: 1.7,
                            }}
                        >
                            <strong>Voucher</strong>
                            <div>
                                {isExpired
                                    ? "This voucher has expired."
                                    : daysRemaining > 0
                                        ? `${daysRemaining} day(s) remaining`
                                        : "Voucher information available"}
                            </div>
                        </div>
                    )}

                    <hr
                        style={{
                            ...styles.divider,
                            marginTop: "24px",
                        }}
                    />

                    {/* QR code supplied by the existing backend */}
                    {qrImage && (
                        <div
                            style={{
                                textAlign: "center",
                                margin: "20px 0",
                            }}
                        >
                            <img
                                src={qrImage}
                                alt="Receipt QR code"
                                style={{
                                    display: "block",
                                    width: "116px",
                                    height: "116px",
                                    objectFit: "contain",
                                    margin: "0 auto 10px",
                                }}
                            />

                            <div
                                style={{
                                    ...styles.sectionLabel,
                                    fontSize: "9px",
                                }}
                            >
                                Scan for receipt details
                            </div>
                        </div>
                    )}

                    {checkoutPayloadLink && !qrImage && (
                        <div
                            style={{
                                textAlign: "center",
                                margin: "18px 0",
                                fontFamily: "Arial, sans-serif",
                                fontSize: "11px",
                            }}
                        >
                            <a
                                href={checkoutPayloadLink}
                                target="_blank"
                                rel="noreferrer"
                                style={{
                                    color: styles.gold,
                                    overflowWrap: "anywhere",
                                }}
                            >
                                View checkout details
                            </a>
                        </div>
                    )}

                    <div style={styles.footer}>
                        <div
                            style={{
                                color: styles.gold,
                                fontSize: "15px",
                                letterSpacing: "4px",
                                marginBottom: "8px",
                            }}
                        >
                            ★ ★ ★
                        </div>

                        <div style={{ fontWeight: 700 }}>
                            THANK YOU FOR YOUR SUPPORT
                        </div>

                        <div style={{ color: styles.muted }}>
                            We look forward to serving you again.
                        </div>

                        <div
                            style={{
                                marginTop: "15px",
                                color: styles.gold,
                                fontSize: "20px",
                                letterSpacing: "5px",
                            }}
                            aria-hidden="true"
                        >
                            ❧ ✦ ❧
                        </div>
                    </div>
                </div>
            </article>

            {/* Existing download callback */}
            <button
                type="button"
                onClick={handleDownload}
                style={styles.downloadButton}
            >
                Download Till Slip
            </button>
        </div>
    );
}
