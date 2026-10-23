import React from "react";

import "./SpaceTillSlip.css";

export function useSpaceTillSlipBackend({
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
                "SpaceTillSlip: onDownload handler was not supplied."
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

/* ====================================================================
   SPACETILLSLIP — DIGITAL RECEIPT INTERFACE
   ==================================================================== */

export default function SpaceTillSlip(props) {
    const {
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
    } = props;

    const {
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
    } = useSpaceTillSlipBackend(props);

    /* ================================================================
       DYNAMIC RECEIPT VALUES
       ================================================================ */

    const receiptNumber =
        receiptData?.receipt_number ??
        receiptData?.receipt_id ??
        receiptId ??
        "";

    const currency = resolvedCurrencySymbol;

    const subtotal =
        receiptData?.subtotal ??
        receiptData?.subtotal_amount ??
        null;

    const discount =
        receiptData?.discount ??
        receiptData?.discount_amount ??
        null;

    const transactionItems = receiptDataItems.map((item, index) => {
        const quantity =
            item?.quantity ??
            item?.qty ??
            1;

        const unitPrice =
            item?.unit_price ??
            item?.price ??
            item?.amount ??
            "";

        const lineTotal =
            item?.line_total ??
            item?.total ??
            item?.total_price ??
            (
                Number(unitPrice) * Number(quantity)
            );

        return {
            ...item,
            _spaceKey: item?.id ?? index,
            _spaceName:
                item?.name ??
                item?.product_name ??
                item?.description ??
                "",
            _spaceQuantity: quantity,
            _spacePrice: unitPrice,
            _spaceTotal: lineTotal,
        };
    });

    const formattedVat =
        vat !== null && vat !== undefined && vat !== ""
            ? formatCurrency(vat)
            : "";

    const formattedTotal = formatCurrency(total);

    /* ================================================================
       SPACE AGE DESIGN SYSTEM
       ================================================================ */

    const styles = {
        shell: {
            width: "100%",
            maxWidth: "560px",
            margin: "0 auto",
            padding: "12px",
            boxSizing: "border-box",
            color: "#e8f4ff",
            fontFamily:
                "'Inter', 'Segoe UI', Arial, sans-serif",
        },

        receipt: {
            position: "relative",
            overflow: "hidden",
            isolation: "isolate",
            width: "100%",
            boxSizing: "border-box",
            padding: "clamp(16px, 4vw, 28px)",
            background:
                "radial-gradient(ellipse at 50% 0%, rgba(38,101,156,0.20), transparent 42%), linear-gradient(160deg, #050a12 0%, #02050a 58%, #07121e 100%)",
            border: "1px solid rgba(184,220,255,0.62)",
            borderRadius: "24px",
            boxShadow:
                "0 0 0 4px rgba(109,177,255,0.035), 0 0 35px rgba(66,153,255,0.12), inset 0 0 35px rgba(74,147,230,0.035)",
        },

        frame: {
            position: "absolute",
            inset: "7px",
            border: "1px solid rgba(150,203,255,0.19)",
            borderRadius: "17px",
            pointerEvents: "none",
            zIndex: 0,
        },

        content: {
            position: "relative",
            zIndex: 1,
        },

        microLabel: {
            color: "#8fbde9",
            fontSize: "9px",
            fontWeight: 600,
            letterSpacing: "3px",
            textTransform: "uppercase",
        },

        divider: {
            height: "1px",
            margin: "19px 0",
            background:
                "linear-gradient(90deg, transparent, rgba(133,196,255,0.65), rgba(255,255,255,0.12), transparent)",
        },

        section: {
            background: "rgba(7,17,29,0.74)",
            border: "1px solid rgba(139,190,244,0.19)",
            borderRadius: "13px",
            padding: "14px",
        },

        label: {
            color: "#8ba8c7",
            fontSize: "10px",
            letterSpacing: "1.3px",
            textTransform: "uppercase",
        },

        value: {
            color: "#edf6ff",
            fontSize: "12px",
            overflowWrap: "anywhere",
        },
    };

    /* ================================================================
       RECEIPT CONTENT
       ================================================================ */

    return (
        <div className="space-receipt-shell" style={styles.shell}>
            <style>{`
                @keyframes spacePulse {
                    0%, 100% {
                        opacity: .48;
                        filter: brightness(.85);
                    }
                    50% {
                        opacity: 1;
                        filter: brightness(1.3);
                    }
                }

                @keyframes spaceOrbit {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }

                @keyframes spaceShimmer {
                    0% { background-position: -200% 0; }
                    100% { background-position: 200% 0; }
                }

                .space-receipt-glow {
                    animation: spacePulse 4s ease-in-out infinite;
                }

                .space-receipt-orbit {
                    animation: spaceOrbit 24s linear infinite;
                }

                .space-receipt-item {
                    transition:
                        background .2s ease,
                        border-color .2s ease;
                }

                .space-receipt-item:hover {
                    background: rgba(89,165,255,.065);
                }

                .space-receipt-download {
                    appearance: none;
                    border: 1px solid rgba(174,215,255,.65);
                    border-radius: 12px;
                    padding: 13px 18px;
                    width: 100%;
                    background: linear-gradient(
                        110deg,
                        #d8edff 0%,
                        #8dc6ff 38%,
                        #eef7ff 52%,
                        #91c8ff 70%,
                        #d8edff 100%
                    );
                    background-size: 200% 100%;
                    color: #07111e;
                    font-size: 11px;
                    font-weight: 800;
                    letter-spacing: 2px;
                    cursor: pointer;
                    transition: box-shadow .2s ease;
                }

                .space-receipt-download:hover {
                    box-shadow: 0 0 24px rgba(105,180,255,.25);
                    animation: spaceShimmer 2s linear infinite;
                }

                @media (prefers-reduced-motion: reduce) {
                    .space-receipt-glow,
                    .space-receipt-orbit,
                    .space-receipt-download {
                        animation: none !important;
                    }

                    .space-receipt-item {
                        transition: none;
                    }
                }

                @media print {
                    .space-receipt-no-print {
                        display: none !important;
                    }

                    .space-receipt-shell {
                        padding: 0 !important;
                    }

                    .space-receipt-card {
                        box-shadow: none !important;
                        print-color-adjust: exact;
                        -webkit-print-color-adjust: exact;
                    }
                }
            `}</style>

            <article
                className="space-receipt-card"
                style={styles.receipt}
            >
                <div style={styles.frame} />

                {/* AMBIENT SPACE LIGHTING */}

                <div
                    aria-hidden="true"
                    className="space-receipt-glow"
                    style={{
                        position: "absolute",
                        top: "-95px",
                        left: "20%",
                        width: "60%",
                        height: "180px",
                        background:
                            "radial-gradient(ellipse, rgba(67,153,255,.15), transparent 70%)",
                        pointerEvents: "none",
                    }}
                />

                {/* HEADER / MERCHANT LOGO */}

                <div className="space-receipt-content" style={styles.content}>
                    <div style={{ textAlign: "center" }}>
                        <div
                            style={{
                                ...styles.microLabel,
                                marginBottom: "17px",
                            }}
                        >
                            INFINITY INTERFACE
                        </div>

                        <div
                            style={{
                                position: "relative",
                                width: "100px",
                                height: "100px",
                                margin: "0 auto 12px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <div
                                aria-hidden="true"
                                className="space-receipt-orbit"
                                style={{
                                    position: "absolute",
                                    inset: "3px",
                                    border: "1px solid rgba(144,204,255,.5)",
                                    borderRadius: "50%",
                                    boxShadow:
                                        "0 0 22px rgba(82,158,255,.12)",
                                }}
                            />

                            <div
                                aria-hidden="true"
                                style={{
                                    position: "absolute",
                                    inset: "13px",
                                    border: "1px solid rgba(144,204,255,.2)",
                                    borderRadius: "50%",
                                }}
                            />

                            {logoUrl ? (
                                <img
                                    src={logoUrl}
                                    alt="Merchant logo"
                                    style={{
                                        position: "relative",
                                        zIndex: 1,
                                        width: "65px",
                                        height: "65px",
                                        objectFit: "contain",
                                        filter:
                                            "drop-shadow(0 0 12px rgba(106,183,255,.22))",
                                    }}
                                />
                            ) : (
                                <svg
                                    viewBox="0 0 100 100"
                                    width="68"
                                    height="68"
                                    aria-hidden="true"
                                    style={{
                                        position: "relative",
                                        zIndex: 1,
                                    }}
                                >
                                    <defs>
                                        <linearGradient
                                            id="spaceLogoGradient"
                                            x1="0"
                                            y1="0"
                                            x2="1"
                                            y2="1"
                                        >
                                            <stop
                                                offset="0%"
                                                stopColor="#ffffff"
                                            />
                                            <stop
                                                offset="55%"
                                                stopColor="#a9d5ff"
                                            />
                                            <stop
                                                offset="100%"
                                                stopColor="#548cc7"
                                            />
                                        </linearGradient>
                                    </defs>

                                    <path
                                        d="M50 8 L88 77 L12 77 Z"
                                        fill="none"
                                        stroke="url(#spaceLogoGradient)"
                                        strokeWidth="2"
                                    />

                                    <path
                                        d="M26 56 L50 17 L74 56"
                                        fill="none"
                                        stroke="url(#spaceLogoGradient)"
                                        strokeWidth="3"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />

                                    <circle
                                        cx="50"
                                        cy="57"
                                        r="4"
                                        fill="#d7edff"
                                    />
                                </svg>
                            )}
                        </div>

                        <div
                            style={{
                                fontSize: "clamp(23px, 6vw, 34px)",
                                fontWeight: 300,
                                letterSpacing: "clamp(4px, 1.3vw, 8px)",
                                color: "#f1f7ff",
                                overflowWrap: "anywhere",
                                textShadow:
                                    "0 0 20px rgba(133,194,255,.22)",
                            }}
                        >
                            TILL SLIP
                        </div>

                        <div
                            style={{
                                ...styles.microLabel,
                                marginTop: "10px",
                                letterSpacing: "2px",
                            }}
                        >
                            DIGITAL TRANSACTION RECORD
                        </div>
                    </div>

                    <div style={styles.divider} />

                    {/* TRANSACTION METADATA */}

                    <div style={styles.section}>
                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns:
                                    "repeat(auto-fit, minmax(125px, 1fr))",
                                gap: "16px",
                            }}
                        >
                            <div>
                                <div style={styles.label}>
                                    Transaction date
                                </div>
                                <div
                                    style={{
                                        ...styles.value,
                                        marginTop: "6px",
                                    }}
                                >
                                    {formattedTransactionDate}
                                </div>
                            </div>

                            <div>
                                <div style={styles.label}>
                                    Receipt reference
                                </div>
                                <div
                                    style={{
                                        ...styles.value,
                                        marginTop: "6px",
                                    }}
                                >
                                    {receiptNumber || ""}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div style={styles.divider} />

                    {/* ITEMS TABLE */}

                    <section>
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                gap: "8px",
                                marginBottom: "14px",
                            }}
                        >
                            <div
                                style={{
                                    color: "#d8eaff",
                                    fontSize: "11px",
                                    fontWeight: 700,
                                    letterSpacing: "2px",
                                }}
                            >
                                PURCHASE MANIFEST
                            </div>

                            <div style={styles.microLabel}>
                                {transactionItems.length} ITEMS
                            </div>
                        </div>

                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns:
                                    "minmax(0, 1fr) 36px minmax(65px, auto)",
                                gap: "8px",
                                padding: "10px 4px",
                                borderTop:
                                    "1px solid rgba(141,194,255,.25)",
                                borderBottom:
                                    "1px solid rgba(141,194,255,.25)",
                                color: "#8fbde9",
                                fontSize: "9px",
                                letterSpacing: "1px",
                                textTransform: "uppercase",
                            }}
                        >
                            <div>Item</div>
                            <div style={{ textAlign: "center" }}>Qty</div>
                            <div style={{ textAlign: "right" }}>Total</div>
                        </div>

                        {transactionItems.map((item) => (
                            <div
                                key={item._spaceKey}
                                className="space-receipt-item"
                                style={{
                                    display: "grid",
                                    gridTemplateColumns:
                                        "minmax(0, 1fr) 36px minmax(65px, auto)",
                                    gap: "8px",
                                    alignItems: "center",
                                    padding: "13px 4px",
                                    borderBottom:
                                        "1px solid rgba(129,170,213,.13)",
                                }}
                            >
                                <div
                                    style={{
                                        minWidth: 0,
                                        color: "#e3efff",
                                        fontSize: "12px",
                                        lineHeight: 1.5,
                                        overflowWrap: "anywhere",
                                    }}
                                >
                                    {item._spaceName}

                                    <div
                                        style={{
                                            marginTop: "3px",
                                            color: "#7997b9",
                                            fontSize: "10px",
                                        }}
                                    >
                                        {formatCurrency(item._spacePrice)}
                                    </div>
                                </div>

                                <div
                                    style={{
                                        textAlign: "center",
                                        fontSize: "12px",
                                        color: "#b9d9fb",
                                    }}
                                >
                                    {item._spaceQuantity}
                                </div>

                                <div
                                    style={{
                                        textAlign: "right",
                                        fontSize: "12px",
                                        color: "#f0f7ff",
                                        whiteSpace: "nowrap",
                                    }}
                                >
                                    {formatCurrency(item._spaceTotal)}
                                </div>
                            </div>
                        ))}

                        {transactionItems.length === 0 && (
                            <div
                                style={{
                                    padding: "22px 4px",
                                    color: "#7997b9",
                                    fontSize: "12px",
                                    textAlign: "center",
                                }}
                            >
                                No receipt items available.
                            </div>
                        )}
                    </section>

                    <div style={styles.divider} />

                    {/* TOTALS PANEL */}

                    <section
                        style={{
                            ...styles.section,
                            borderColor:
                                "rgba(132,191,255,.35)",
                            boxShadow:
                                "inset 0 0 22px rgba(71,135,205,.035)",
                        }}
                    >
                        {subtotal !== null &&
                            subtotal !== undefined &&
                            subtotal !== "" && (
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        gap: "12px",
                                        marginBottom: "12px",
                                    }}
                                >
                                    <span style={styles.label}>
                                        Subtotal
                                    </span>
                                    <span style={styles.value}>
                                        {formatCurrency(subtotal)}
                                    </span>
                                </div>
                            )}

                        {discount !== null &&
                            discount !== undefined &&
                            discount !== "" && (
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        gap: "12px",
                                        marginBottom: "12px",
                                    }}
                                >
                                    <span style={styles.label}>
                                        Discount
                                    </span>
                                    <span
                                        style={{
                                            ...styles.value,
                                            color: "#9fe4ff",
                                        }}
                                    >
                                        {formatCurrency(discount)}
                                    </span>
                                </div>
                            )}

                        {formattedVat !== "" && (
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    gap: "12px",
                                    marginBottom: "12px",
                                }}
                            >
                                <span style={styles.label}>VAT</span>
                                <span style={styles.value}>
                                    {formattedVat}
                                </span>
                            </div>
                        )}

                        <div
                            style={{
                                height: "1px",
                                margin: "15px 0",
                                background:
                                    "rgba(143,190,245,.22)",
                            }}
                        />

                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                flexWrap: "wrap",
                                gap: "8px",
                            }}
                        >
                            <div
                                style={{
                                    color: "#c7e2ff",
                                    fontSize: "12px",
                                    fontWeight: 700,
                                    letterSpacing: "2px",
                                }}
                            >
                                TOTAL
                            </div>

                            <div
                                style={{
                                    color: "#f0f8ff",
                                    fontSize: "clamp(23px, 6vw, 32px)",
                                    fontWeight: 500,
                                    letterSpacing: "-.5px",
                                    textShadow:
                                        "0 0 20px rgba(104,178,255,.25)",
                                    overflowWrap: "anywhere",
                                }}
                            >
                                {formattedTotal}
                            </div>
                        </div>
                    </section>

                    {/* MERCHANT WATERMARK */}

                    {watermarkUrl && (
                        <div
                            aria-hidden="true"
                            style={{
                                position: "absolute",
                                zIndex: -1,
                                top: "43%",
                                left: "50%",
                                width: "65%",
                                height: "220px",
                                transform: "translate(-50%, -50%)",
                                opacity: 0.045,
                                pointerEvents: "none",
                            }}
                        >
                            <img
                                src={watermarkUrl}
                                alt=""
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "contain",
                                }}
                            />
                        </div>
                    )}

                    <div style={styles.divider} />

                    {/* QR CODE / DIGITAL RECEIPT */}

                    <section
                        style={{
                            ...styles.section,
                            textAlign: "center",
                            padding: "20px 14px",
                        }}
                    >
                        <div
                            style={{
                                ...styles.microLabel,
                                marginBottom: "15px",
                            }}
                        >
                            DIGITAL RECEIPT ACCESS
                        </div>

                        {qrCodeUrl ? (
                            <div
                                style={{
                                    display: "inline-flex",
                                    padding: "10px",
                                    background: "#f4f8ff",
                                    borderRadius: "12px",
                                    border:
                                        "1px solid rgba(163,211,255,.8)",
                                    boxShadow:
                                        "0 0 25px rgba(82,159,255,.14)",
                                }}
                            >
                                <img
                                    src={qrCodeUrl}
                                    alt="Receipt QR code"
                                    style={{
                                        display: "block",
                                        width: "150px",
                                        height: "150px",
                                        maxWidth: "100%",
                                        objectFit: "contain",
                                    }}
                                />
                            </div>
                        ) : (
                            <div
                                style={{
                                    width: "150px",
                                    height: "150px",
                                    maxWidth: "100%",
                                    margin: "0 auto",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    border:
                                        "1px dashed rgba(143,190,245,.35)",
                                    borderRadius: "12px",
                                    color: "#7997b9",
                                    fontSize: "10px",
                                    lineHeight: 1.6,
                                    padding: "12px",
                                    boxSizing: "border-box",
                                }}
                            >
                                QR code will appear when supplied by the application.
                            </div>
                        )}

                        <div
                            style={{
                                marginTop: "15px",
                                color: "#b8d8fa",
                                fontSize: "10px",
                                lineHeight: 1.8,
                                letterSpacing: "1px",
                            }}
                        >
                            SCAN TO ACCESS YOUR DIGITAL RECEIPT
                        </div>

                        {checkoutPayloadLink && (
                            <a
                                href={checkoutPayloadLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                    display: "inline-block",
                                    marginTop: "12px",
                                    color: "#9ed1ff",
                                    fontSize: "11px",
                                    textDecoration: "none",
                                    borderBottom:
                                        "1px solid rgba(158,209,255,.4)",
                                    paddingBottom: "3px",
                                }}
                            >
                                Open digital receipt ↗
                            </a>
                        )}
                    </section>

                    {/* TRANSACTION FOOTER */}

                    <div
                        style={{
                            marginTop: "23px",
                            textAlign: "center",
                        }}
                    >
                        <div
                            style={{
                                color: "#d5eaff",
                                fontSize: "12px",
                                fontWeight: 600,
                                letterSpacing: "3px",
                            }}
                        >
                            THANK YOU
                        </div>

                        <div
                            style={{
                                marginTop: "8px",
                                color: "#8da9c9",
                                fontSize: "10px",
                                letterSpacing: "1.5px",
                                lineHeight: 1.8,
                            }}
                        >
                            YOUR TRANSACTION HAS BEEN RECORDED
                        </div>

                        {receiptNumber && (
                            <div
                                style={{
                                    marginTop: "12px",
                                    color: "#6f91b6",
                                    fontSize: "9px",
                                    letterSpacing: "1px",
                                    overflowWrap: "anywhere",
                                }}
                            >
                                REFERENCE: {receiptNumber}
                            </div>
                        )}

                        <div
                            aria-hidden="true"
                            style={{
                                margin: "22px auto 0",
                                width: "75%",
                                height: "1px",
                                background:
                                    "linear-gradient(90deg, transparent, #82bfff, transparent)",
                            }}
                        />

                        <div
                            style={{
                                ...styles.microLabel,
                                marginTop: "15px",
                                fontSize: "8px",
                                letterSpacing: "2px",
                            }}
                        >
                            INFINITY INTERFACE · SPACE AGE EDITION
                        </div>
                    </div>

                    {/* DOWNLOAD CONTROL */}

                    {typeof onDownload === "function" && (
                        <div
                            className="space-receipt-no-print"
                            style={{ marginTop: "22px" }}
                        >
                            <button
                                type="button"
                                className="space-receipt-download"
                                onClick={handleDownload}
                            >
                                ↓ &nbsp; DOWNLOAD DIGITAL RECEIPT
                            </button>
                        </div>
                    )}
                </div>
            </article>
        </div>
    );
}
