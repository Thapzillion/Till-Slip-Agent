import React from "react";

/**
 * MatrixTillSlip
 *
 * Universal Matrix Grid till-slip renderer.
 *
 * Props:
 * - receiptData
 * - settings
 * - user
 * - activeCurrencySymbol
 * - designConfig
 * - voucher
 * - isExpired
 * - daysRemaining
 * - qrCodeUrl
 * - checkoutPayloadLink
 * - receiptId
 * - onDownload
 */

export default function MatrixTillSlip({
    receiptData = {},
    settings = {},
    user = null,
    activeCurrencySymbol = "",

    // AI / design configuration
    designConfig = {},

    // Voucher
    voucher = null,
    isExpired = false,
    daysRemaining = 0,

    // QR / receipt
    qrCodeUrl = "",
    checkoutPayloadLink = "",
    receiptId = null,

    // Actions
    onDownload,

    // Optional external styling
    style: containerStyle = {}
}) {

    // ============================================================
    // DESIGN CONFIGURATION
    // ============================================================

    const config = designConfig || {};

    const colors = config.colors || {};
    const effects = config.effects || {};
    const typography = config.typography || {};
    const receiptConfig = config.receipt || {};
    const logoConfig = config.logo || {};


    // ============================================================
    // RECEIPT DATE
    // ============================================================

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
                hour12: false
            })
            .replace(/,/g, "");


    // ============================================================
    // CONFIGURATION FALLBACKS
    // ============================================================

    const primaryColor =
        colors.primary || "#08E3D8";

    const secondaryColor =
        colors.secondary || "#00B8FF";

    const backgroundColor =
        colors.background ||
        "linear-gradient(180deg, rgba(8,18,24,0.95), rgba(4,10,14,0.98))";

    const textColor =
        colors.text || "#FFFFFF";

    const mutedTextColor =
        colors.mutedText || "#94A3B8";

    const receiptGlow =
        effects.receiptGlow ||
        `
            0 0 6px rgba(8,227,216,.75),
            0 0 16px rgba(8,227,216,.45),
            0 0 34px rgba(8,227,216,.18),
            0 25px 60px rgba(0,0,0,.65)
        `;

    const businessNameSize =
        typography.businessNameSize || "20px";

    const businessNameWeight =
        typography.businessNameWeight || "900";

    const showWatermark =
        receiptConfig.showWatermark !== false;

    const showVoucher =
        receiptConfig.showVoucher !== false;

    const showDownloadButton =
        receiptConfig.showDownloadButton !== false;

    const logoEnabled =
        logoConfig.enabled !== false;

    const logoSize =
        logoConfig.size === "small"
            ? 100
            : logoConfig.size === "large"
                ? 220
                : 170;


    // ============================================================
    // LOGO POSITION
    // ============================================================

    let logoPosition = {
        top: "52%",
        left: "50%",
        transform: "translate(-50%, -50%)"
    };

    if (logoConfig.position === "top-left") {
        logoPosition = {
            top: "80px",
            left: "40px",
            transform: "none"
        };
    }

    if (logoConfig.position === "top-right") {
        logoPosition = {
            top: "80px",
            left: "auto",
            right: "40px",
            transform: "none"
        };
    }

    if (logoConfig.position === "center") {
        logoPosition = {
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)"
        };
    }


    // ============================================================
    // RECEIPT CONTENT
    // ============================================================

    const items =
        Array.isArray(receiptData?.items)
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


    // ============================================================
    // DOWNLOAD HANDLER
    // ============================================================

    const handleDownload = (event) => {

        if (event) {
            event.preventDefault();
        }

        if (typeof onDownload === "function") {
            onDownload();
            return;
        }

        console.warn(
            "MatrixTillSlip: onDownload handler was not supplied."
        );
    };


    // ============================================================
    // RENDER
    // ============================================================

    return (
        <div
            id="till-slip-capture"
            style={{
                padding: "28px",
                border: `2px solid ${primaryColor}`,
                boxShadow: receiptGlow,
                background: backgroundColor,
                position: "relative",
                overflow: "hidden",
                boxSizing: "border-box",
                ...containerStyle
            }}
        >

            {/* =====================================================
                TOP GLOW EFFECT
            ====================================================== */}

            <div
                style={{
                    position: "absolute",
                    top: "-120px",
                    right: "-120px",
                    width: "240px",
                    height: "240px",
                    borderRadius: "50%",
                    background:
                        `radial-gradient(
                            circle,
                            ${primaryColor}30,
                            transparent 70%
                        )`,
                    filter:
                        effects.glowBlur || "blur(10px)",
                    pointerEvents: "none"
                }}
            />


            {/* =====================================================
                HEADER
            ====================================================== */}

            <h3
                style={{
                    margin: "0 0 18px 0",
                    fontSize: "12px",
                    fontWeight: "800",
                    color: primaryColor,
                    letterSpacing: "2px",
                    textTransform: "uppercase",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    position: "relative",
                    zIndex: 2
                }}
            >
                ⚡ Live Inbox Email Till Slip Mirror
            </h3>


            {/* =====================================================
                RECEIPT CONTAINER
            ====================================================== */}

            <div
                style={{
                    background: `
                        linear-gradient(
                            180deg,
                            #041116 0%,
                            #07181E 45%,
                            #041116 100%
                        )
                    `,
                    backgroundImage: `
                        linear-gradient(
                            ${primaryColor}14 1px,
                            transparent 1px
                        ),
                        linear-gradient(
                            90deg,
                            ${primaryColor}14 1px,
                            transparent 1px
                        )
                    `,
                    backgroundSize: "24px 24px",
                    color: textColor,
                    borderRadius: "26px",
                    padding: "9px 7px",
                    boxShadow: receiptGlow,
                    fontFamily: '"Courier New", monospace',
                    position: "relative",
                    overflow: "hidden",
                    border: `2px solid ${primaryColor}`
                }}
            >

                {/* =================================================
                    RECEIPT CORNER LIGHT
                ================================================== */}

                <div
                    style={{
                        position: "absolute",
                        top: "-80px",
                        left: "-80px",
                        width: "30px",
                        height: "30px",
                        background:
                            `radial-gradient(
                                circle,
                                ${primaryColor}14,
                                transparent 70%
                            )`,
                        borderRadius: "50%"
                    }}
                />


                {/* =================================================
                    CENTRAL LOGO WATERMARK
                ================================================== */}

                {settings?.logo_url &&
                    logoEnabled &&
                    showWatermark && (
                        <div
                            style={{
                                position: "absolute",
                                width: `${logoSize}px`,
                                height: `${logoSize}px`,
                                backgroundImage:
                                    `url(${settings.logo_url})`,
                                backgroundSize: "contain",
                                backgroundPosition: "center",
                                backgroundRepeat: "no-repeat",
                                opacity:
                                    logoConfig.watermarkOpacity ??
                                    0.035,
                                pointerEvents: "none",
                                zIndex: 1,
                                ...logoPosition
                            }}
                        />
                    )}


                {/* =================================================
                    RECEIPT CONTENT
                ================================================== */}

                <div
                    style={{
                        position: "relative",
                        zIndex: 2
                    }}
                >

                    {/* =================================================
                        TOP METADATA
                    ================================================== */}

                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "flex-start",
                            fontSize: "10px",
                            color: mutedTextColor,
                            marginBottom: "9px"
                        }}
                    >

                        <div
                            style={{
                                padding: "2px 5px",
                                borderRadius: "999px",
                                background:
                                    `${primaryColor}1F`,
                                border:
                                    `2px solid ${primaryColor}`,
                                boxShadow: `
                                    0 0 6px ${primaryColor}99,
                                    inset 0 0 12px ${primaryColor}2E
                                `,
                                color: primaryColor,
                                fontWeight: "800",
                                letterSpacing: "0.5px"
                            }}
                        >
                            VERIFIED NODE
                        </div>


                        <div
                            style={{
                                textAlign: "right",
                                lineHeight: "1.5"
                            }}
                        >
                            <div
                                style={{
                                    fontWeight: "900",
                                    color: "#C5CCDA",
                                    textTransform: "uppercase",
                                    letterSpacing: "0.5px"
                                }}
                            >
                                Transaction
                            </div>

                            <div>
                                {formattedTransactionDate}
                            </div>

                            {receiptId && (
                                <div
                                    style={{
                                        marginTop: "3px",
                                        fontSize: "8px",
                                        opacity: 0.6
                                    }}
                                >
                                    #{receiptId.slice(0, 8)}
                                </div>
                            )}
                        </div>

                    </div>


                    {/* =================================================
                        TOP MINI LOGO
                    ================================================== */}

                    <div
                        style={{
                            textAlign: "center",
                            marginBottom: "9px"
                        }}
                    >

                        {settings?.logo_url &&
                            logoEnabled ? (

                            <div
                                style={{
                                    display: "inline-flex",
                                    padding: "10px 18px",
                                    borderRadius: "18px",
                                    background:
                                        "rgba(15,23,42,0.06)",
                                    border:
                                        "1px solid rgba(15,23,42,0.06)",
                                    boxShadow:
                                        "0 10px 24px rgba(0,0,0,0.08)"
                                }}
                            >

                                <img
                                    src={settings.logo_url}
                                    alt="Merchant Logo"
                                    style={{
                                        maxHeight:
                                            logoConfig.mainLogoHeight ||
                                            "52px",
                                        maxWidth:
                                            logoConfig.mainLogoWidth ||
                                            "170px",
                                        objectFit: "contain"
                                    }}
                                />

                            </div>

                        ) : (

                            <div
                                style={{
                                    border:
                                        `1px dashed ${mutedTextColor}`,
                                    padding: "10px",
                                    color: mutedTextColor,
                                    fontSize: "10px",
                                    fontWeight: "bold",
                                    borderRadius: "12px"
                                }}
                            >
                                [ NO LOGO RECORDED ]
                            </div>

                        )}

                    </div>


                    {/* =================================================
                        BRAND DETAILS
                    ================================================== */}

                    <div
                        style={{
                            textAlign: "center",
                            marginBottom: "11px"
                        }}
                    >

                        <strong
                            style={{
                                fontSize: businessNameSize,
                                fontWeight: businessNameWeight,
                                textTransform: "uppercase",
                                letterSpacing:
                                    typography.businessNameSpacing ||
                                    "1px",
                                display: "block",
                                color: textColor,
                                textShadow:
                                    effects.businessNameGlow ||
                                    `0 0 10px ${primaryColor}26`
                            }}
                        >
                            {settings?.business_name ||
                                "MY BUSINESS BRAND"}
                        </strong>


                        <div
                            style={{
                                width: "70px",
                                height: "2px",
                                margin: "10px auto",
                                borderRadius: "999px",
                                background:
                                    `linear-gradient(
                                        90deg,
                                        ${primaryColor},
                                        ${secondaryColor}
                                    )`
                            }}
                        />


                        <div
                            style={{
                                fontSize:
                                    typography.addressSize ||
                                    "11px",
                                color:
                                    colors.address ||
                                    "rgba(255,255,255,0.85)",
                                marginTop: "6px",
                                whiteSpace: "pre-wrap",
                                lineHeight: "1.6",
                                fontWeight: "700"
                            }}
                        >
                            {settings?.store_address ||
                                "Outlet Physical Address Street\nKrugersdorp, South Africa"}
                        </div>


                        <div
                            style={{
                                fontSize: "11px",
                                color:
                                    colors.email ||
                                    "rgba(220,255,250,0.5)",
                                marginTop: "6px",
                                fontFamily:
                                    "system-ui, sans-serif"
                            }}
                        >
                            {user?.email ||
                                receiptData?.customer_email ||
                                "info@merchantnode.com"}
                        </div>

                    </div>


                    {/* =================================================
                        SEPARATOR
                    ================================================== */}

                    <div
                        style={{
                            height: "1px",
                            background:
                                `linear-gradient(
                                    90deg,
                                    transparent,
                                    ${primaryColor}33,
                                    transparent
                                )`,
                            marginBottom: "9px"
                        }}
                    />


                    {/* =================================================
                        ITEMS
                    ================================================== */}

                    <div
                        style={{
                            fontSize: "11px",
                            lineHeight: "1.9",
                            marginBottom: "6px",
                            fontWeight: "700"
                        }}
                    >

                        <div
                            style={{
                                fontSize: "10px",
                                textTransform: "uppercase",
                                letterSpacing: "1px",
                                marginBottom: "6px",
                                color: `${primaryColor}99`,
                                fontWeight: "900"
                            }}
                        >
                            Items Purchased
                        </div>


                        {items.length > 0 ? (

                            items.map((item, index) => (

                                <div
                                    key={
                                        item?.id ??
                                        index
                                    }
                                    style={{
                                        display: "flex",
                                        justifyContent:
                                            "space-between",
                                        marginBottom: "4px",
                                        padding: "8px 0",
                                        borderBottom:
                                            "1px dashed rgba(15,23,42,0.12)",
                                        gap: "12px"
                                    }}
                                >

                                    <span
                                        style={{
                                            maxWidth: "75%"
                                        }}
                                    >
                                        {item?.name ||
                                            "Unnamed item"}
                                    </span>


                                    <span
                                        style={{
                                            fontWeight: "900",
                                            color:
                                                colors.itemPrice ||
                                                "#BFC1C8",
                                            whiteSpace:
                                                "nowrap"
                                        }}
                                    >
                                        {item?.price ?? ""}
                                    </span>

                                </div>

                            ))

                        ) : (

                            <div
                                style={{
                                    padding: "12px 0",
                                    color: mutedTextColor,
                                    textAlign: "center",
                                    fontSize: "10px"
                                }}
                            >
                                No transaction items recorded.
                            </div>

                        )}


                        {/* =================================================
                            VAT
                        ================================================== */}

                        {vat !== null &&
                            vat !== undefined && (

                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent:
                                            "space-between",
                                        marginTop: "10px",
                                        padding: "8px 0",
                                        color: mutedTextColor
                                    }}
                                >
                                    <span>VAT</span>
                                    <span>{vat}</span>
                                </div>
                            )}


                        {/* =================================================
                            TOTAL
                        ================================================== */}

                        <div
                            style={{
                                display: "flex",
                                justifyContent:
                                    "space-between",
                                marginTop: "14px",
                                padding: "16px",
                                borderRadius: "16px",
                                background:
                                    `linear-gradient(
                                        90deg,
                                        ${primaryColor}1A,
                                        ${primaryColor}0F
                                    )`,
                                border:
                                    `2px solid ${primaryColor}`,
                                boxShadow: `
                                    0 0 8px ${primaryColor}73,
                                    inset 0 0 18px ${primaryColor}0F
                                `,
                                fontWeight: "900",
                                fontSize: "14px",
                                color:
                                    colors.totalLabel ||
                                    "#B1B5C6"
                            }}
                        >

                            <span>
                                TOTAL DUE
                            </span>

                            <span
                                style={{
                                    color:
                                        colors.totalValue ||
                                        "#00A884",
                                    textShadow:
                                        `0 0 10px ${primaryColor}26`
                                }}
                            >
                                {total}
                            </span>

                        </div>

                    </div>


                    {/* =================================================
                        VOUCHER
                    ================================================== */}

                    {showVoucher && (

                        <div
                            style={{
                                background:
                                    "rgba(10,20,28,0.6)",
                                border:
                                    `2px solid ${primaryColor}`,
                                boxShadow: `
                                    0 0 8px ${primaryColor}59,
                                    inset 0 0 12px ${primaryColor}0F
                                `,
                                borderRadius: "22px",
                                padding: "12px",
                                textAlign: "center",
                                marginTop: "24px",
                                position: "relative",
                                overflow: "hidden"
                            }}
                        >

                            {/* Inner glow */}

                            <div
                                style={{
                                    position: "absolute",
                                    top: "-40px",
                                    right: "-40px",
                                    width: "120px",
                                    height: "120px",
                                    borderRadius: "50%",
                                    background:
                                        `radial-gradient(
                                            circle,
                                            ${primaryColor}1F,
                                            transparent 70%
                                        )`
                                }}
                            />


                            <span
                                style={{
                                    fontSize: "9px",
                                    color: primaryColor,
                                    fontWeight: "900",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent:
                                        "center",
                                    gap: "6px",
                                    marginBottom: "6px",
                                    letterSpacing: "1px",
                                    textTransform:
                                        "uppercase"
                                }}
                            >
                                ⚡ Next Visit Voucher Code Inside
                            </span>


                            {/* =================================================
                                QR
                            ================================================== */}

                            <div
                                style={{
                                    display: "inline-block",
                                    padding: "12px",
                                    background: "#FFFFFF",
                                    borderRadius: "18px",
                                    border:
                                        `1px solid ${primaryColor}26`,
                                    boxShadow: `
                                        0 12px 25px rgba(0,0,0,0.35),
                                        0 0 20px ${primaryColor}26
                                    `,
                                    marginBottom: "5px"
                                }}
                            >

                                {qrCodeUrl ? (

                                    <img
                                        src={qrCodeUrl}
                                        alt="Voucher Token QR"
                                        style={{
                                            width: "80px",
                                            height: "80px",
                                            display: "block"
                                        }}
                                    />

                                ) : (

                                    <div
                                        style={{
                                            width: "80px",
                                            height: "80px",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent:
                                                "center",
                                            color: "#11161D",
                                            fontSize: "8px",
                                            textAlign: "center"
                                        }}
                                    >
                                        QR
                                        <br />
                                        UNAVAILABLE
                                    </div>

                                )}

                            </div>


                            {/* =================================================
                                CLAIM DISCOUNT
                            ================================================== */}

                            <div
                                style={{
                                    fontSize: "9px",
                                    color:
                                        "rgba(255,255,255,0.9)",
                                    textTransform:
                                        "uppercase",
                                    letterSpacing: "1px",
                                    fontWeight: "900",
                                    marginBottom: "4px"
                                }}
                            >
                                Claim Discount
                            </div>


                            <div
                                style={{
                                    fontSize: "11px",
                                    color:
                                        "rgba(220,255,250,0.7)",
                                    lineHeight: "1.6",
                                    fontFamily:
                                        "system-ui, -apple-system, sans-serif",
                                    padding: "0 6px"
                                }}
                            >
                                Scan to instantly claim your{" "}

                                <strong
                                    style={{
                                        color: primaryColor,
                                        fontWeight: "900"
                                    }}
                                >
                                    {
                                        settings?.discount_percentage ??
                                        10
                                    }% discount
                                </strong>{" "}
                                balance.
                            </div>


                            {/* =================================================
                                VOUCHER STATUS
                            ================================================== */}

                            <div
                                style={{
                                    fontSize: "10px",
                                    color: mutedTextColor,
                                    marginTop: "10px",
                                    paddingTop: "8px",
                                    borderTop:
                                        "1px dashed rgba(255,255,255,0.08)",
                                    fontFamily:
                                        '"Courier New", monospace',
                                    fontWeight: "bold",
                                    letterSpacing: "0.5px"
                                }}
                            >

                                {isExpired ? (

                                    <>
                                        VOUCHER STATUS:{" "}
                                        <span
                                            style={{
                                                color: "#EF4444"
                                            }}
                                        >
                                            EXPIRED
                                        </span>
                                    </>

                                ) : (

                                    <>
                                        EXPIRES IN:{" "}
                                        <span
                                            style={{
                                                color:
                                                    daysRemaining <= 3
                                                        ? "#F59E0B"
                                                        : primaryColor
                                            }}
                                        >
                                            {daysRemaining ||
                                                settings?.voucher_expiration_days ||
                                                30} DAYS
                                        </span>
                                    </>

                                )}

                            </div>


                            {/* Voucher token when available */}

                            {voucher?.voucher_token && (

                                <div
                                    style={{
                                        marginTop: "8px",
                                        fontSize: "8px",
                                        color:
                                            "rgba(255,255,255,0.4)",
                                        wordBreak:
                                            "break-all"
                                    }}
                                >
                                    TOKEN:{" "}
                                    {voucher.voucher_token}
                                </div>
                            )}

                        </div>
                    )}


                    {/* =================================================
                        DOWNLOAD BUTTON
                    ================================================== */}

                    {showDownloadButton && (

                        <div
                            style={{
                                marginTop: "28px",
                                textAlign: "center"
                            }}
                        >

                            <a
                                href="#download"
                                onClick={handleDownload}
                                style={{
                                    display: "block",
                                    background:
                                        `linear-gradient(
                                            90deg,
                                            ${primaryColor},
                                            ${secondaryColor}
                                        )`,
                                    color: "#041014",
                                    textDecoration: "none",
                                    padding: "16px",
                                    borderRadius: "16px",
                                    fontSize: "12px",
                                    fontWeight: "900",
                                    fontFamily:
                                        "system-ui, sans-serif",
                                    letterSpacing: "0.8px",
                                    textTransform:
                                        "uppercase",
                                    boxShadow: `
                                        0 12px 30px ${primaryColor}40,
                                        0 0 24px ${primaryColor}26
                                    `,
                                    transition:
                                        "all 0.25s ease"
                                }}
                            >
                                Download Official Invoice PDF
                            </a>

                        </div>
                    )}

                </div>

            </div>

        </div>
    );
}

