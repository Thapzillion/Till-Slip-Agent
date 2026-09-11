import React from "react";

/**
 * ================================================================
 * MATRIX TILL SLIP
 * ================================================================
 *
 * PURPOSE:
 * Pure receipt renderer.
 *
 * IMPORTANT ARCHITECTURE:
 *
 * MatrixTillSlip does NOT own editing.
 *
 * Editing is handled by:
 *
 * System A → Studio Shell / shared state
 * System B → Properties
 * System C → Receipt Canvas
 * System D → Color Grading
 *
 * MatrixTillSlip ONLY renders the receipt.
 *
 * It therefore intentionally does NOT receive:
 *
 * - designConfig
 * - selectedElement
 * - selectedElementId
 * - onSelectElement
 * - onDesignConfigChange
 * - crop functions
 * - zoom functions
 * - shape editing functions
 * - chroma-key functions
 * - color-grading functions
 * - editing state
 *
 * The receipt preview throughout the application should therefore
 * behave as a normal, non-editing receipt renderer.
 *
 * Backend/application data remains supported through:
 *
 * - receiptData
 * - settings
 * - user
 * - voucher
 * - isExpired
 * - daysRemaining
 * - qrCodeUrl
 * - checkoutPayloadLink
 * - receiptId
 * - onDownload
 * - activeCurrencySymbol
 *
 * ================================================================
 */

export default function MatrixTillSlip({
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
       RECEIPT DATA
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
       RECEIPT DISPLAY SETTINGS
       ================================================================ */

    const primaryColor =
        receiptData?.themeColor ||
        "#08E3D8";

    const secondaryColor =
        "#00B8FF";

    const backgroundColor =
        "linear-gradient(180deg, #061017 0%, #03080D 100%)";

    const surfaceColor =
        "#07181E";

    const textColor =
        "#FFFFFF";

    const mutedTextColor =
        "#94A3B8";

    const receiptPadding = 12;

    const receiptBorderWidth = 2;

    const receiptBorderRadius = 24;

    const sectionSpacing = 12;

    const receiptWidth = "100%";

    /* ================================================================
       DOWNLOAD
       ================================================================ */

    const handleDownload = (event) => {
        if (event) {
            event.preventDefault();
        }

        if (typeof onDownload === "function") {
            onDownload();
        } else {
            console.warn(
                "MatrixTillSlip: onDownload handler was not supplied."
            );
        }
    };

    /* ================================================================
       RECEIPT VISIBILITY
       ================================================================ */

    const showWatermark = true;

    const showVoucher = true;

    const showDownloadButton = true;

    /* ================================================================
       RENDER
       ================================================================ */

    return (
        <div
            id="till-slip-capture"
            className="matrix-till-slip-root"
            style={{
                width: receiptWidth,
                padding: `${receiptPadding}px`,
                border:
                    `${receiptBorderWidth}px solid ${primaryColor}`,
                borderRadius:
                    `${receiptBorderRadius}px`,
                background:
                    backgroundColor,
                color:
                    textColor,
                boxSizing:
                    "border-box",
                position:
                    "relative",
                overflow:
                    "hidden",
                boxShadow:
                    `0 0 10px ${primaryColor}66,
                     0 0 30px ${primaryColor}22,
                     0 25px 60px rgba(0,0,0,0.65)`,
            }}
        >

            {/* ========================================================
                RECEIPT STYLES
               ======================================================== */}

            <style>{`
                .matrix-till-slip-root,
                .matrix-till-slip-root * {
                    box-sizing: border-box;
                }

                .matrix-receipt-surface {
                    width: 100%;
                    min-height: 100%;
                    background:
                        linear-gradient(
                            180deg,
                            ${surfaceColor} 0%,
                            #041116 48%,
                            #030A0F 100%
                        );

                    background-image:
                        linear-gradient(
                            ${primaryColor}12 1px,
                            transparent 1px
                        ),
                        linear-gradient(
                            90deg,
                            ${primaryColor}12 1px,
                            transparent 1px
                        );

                    background-size:
                        24px 24px;

                    border:
                        1px solid ${primaryColor}55;

                    border-radius:
                        ${Math.max(
                8,
                receiptBorderRadius - 6
            )}px;

                    color:
                        ${textColor};

                    padding:
                        ${receiptPadding}px;

                    font-family:
                        "Courier New",
                        Courier,
                        monospace;

                    position:
                        relative;

                    overflow:
                        hidden;
                }

                .matrix-receipt-divider {
                    height: 1px;
                    width: 100%;
                    margin-bottom:
                        ${sectionSpacing}px;

                    background:
                        linear-gradient(
                            90deg,
                            transparent,
                            ${primaryColor}66,
                            ${secondaryColor}55,
                            transparent
                        );
                }

                .matrix-receipt-item {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    gap: 12px;

                    padding:
                        7px 0;

                    border-bottom:
                        1px dashed rgba(255,255,255,0.10);
                }

                .matrix-receipt-total {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    gap: 12px;

                    margin-top:
                        ${sectionSpacing}px;

                    padding:
                        14px;

                    border:
                        2px solid ${primaryColor};

                    border-radius:
                        16px;

                    background:
                        linear-gradient(
                            90deg,
                            ${primaryColor}1A,
                            ${secondaryColor}0D
                        );
                }

                .matrix-receipt-logo-stage,
                .matrix-receipt-qr-stage {
                    position: relative;

                    display: inline-flex;

                    align-items: center;
                    justify-content: center;

                    overflow: hidden;
                }

                .matrix-receipt-logo-stage {
                    min-width: 52px;
                    min-height: 52px;

                    padding: 8px;

                    background:
                        rgba(255,255,255,0.035);
                }

                .matrix-receipt-qr-stage {
                    padding: 12px;

                    background:
                        #FFFFFF;
                }

                @media print {

                    .matrix-receipt-download {
                        display: none !important;
                    }

                }
            `}</style>

            {/* ========================================================
                AMBIENT LIGHT
               ======================================================== */}

            <div
                aria-hidden="true"
                style={{
                    position: "absolute",
                    top: "-90px",
                    right: "-90px",
                    width: "220px",
                    height: "220px",
                    borderRadius: "50%",
                    background:
                        `radial-gradient(
                            circle,
                            ${primaryColor}28,
                            transparent 70%
                        )`,
                    filter:
                        "blur(12px)",
                    pointerEvents:
                        "none",
                }}
            />

            {/* ========================================================
                RECEIPT SURFACE
               ======================================================== */}

            <div
                className="matrix-receipt-surface"
            >

                {/* ====================================================
                    WATERMARK
                   ==================================================== */}

                {settings?.logo_url &&
                    showWatermark && (

                        <div
                            aria-hidden="true"
                            style={{
                                position:
                                    "absolute",
                                inset:
                                    0,
                                pointerEvents:
                                    "none",
                                display:
                                    "flex",
                                alignItems:
                                    "center",
                                justifyContent:
                                    "center",
                                opacity:
                                    0.035,
                                zIndex:
                                    0,
                            }}
                        >

                            <img
                                src={
                                    settings.logo_url
                                }
                                alt=""
                                style={{
                                    width:
                                        150,
                                    height:
                                        150,
                                    objectFit:
                                        "contain",
                                }}
                            />

                        </div>
                    )}

                {/* ====================================================
                    RECEIPT CONTENT
                   ==================================================== */}

                <div
                    style={{
                        position:
                            "relative",
                        zIndex:
                            2,
                    }}
                >

                    {/* ==================================================
                        TOP METADATA
                       ================================================== */}

                    <div
                        style={{
                            display:
                                "flex",
                            justifyContent:
                                "space-between",
                            alignItems:
                                "flex-start",
                            gap:
                                12,
                            fontSize:
                                10,
                            color:
                                mutedTextColor,
                            marginBottom:
                                sectionSpacing,
                        }}
                    >

                        <div
                            style={{
                                padding:
                                    "3px 7px",
                                borderRadius:
                                    999,
                                background:
                                    `${primaryColor}1C`,
                                border:
                                    `1px solid ${primaryColor}`,
                                color:
                                    primaryColor,
                                fontWeight:
                                    900,
                                letterSpacing:
                                    "0.6px",
                            }}
                        >
                            VERIFIED NODE
                        </div>

                        <div
                            style={{
                                textAlign:
                                    "right",
                                lineHeight:
                                    1.5,
                            }}
                        >

                            <div
                                style={{
                                    fontWeight:
                                        900,
                                    color:
                                        "#C5CCDA",
                                    textTransform:
                                        "uppercase",
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
                                        marginTop:
                                            3,
                                        fontSize:
                                            8,
                                        opacity:
                                            0.6,
                                    }}
                                >
                                    #
                                    {String(
                                        receiptId
                                    ).slice(
                                        0,
                                        8
                                    )}
                                </div>
                            )}

                        </div>

                    </div>

                    {/* ==================================================
                        LOGO
                       ================================================== */}

                    <div
                        style={{
                            display:
                                "flex",
                            justifyContent:
                                "center",
                            alignItems:
                                "center",
                            marginBottom:
                                sectionSpacing,
                        }}
                    >

                        {settings?.logo_url ? (

                            <div
                                className="matrix-receipt-logo-stage"
                                style={{
                                    width:
                                        150,
                                    height:
                                        150,

                                    borderRadius:
                                        18,
                                }}
                            >

                                <img
                                    src={
                                        settings.logo_url
                                    }
                                    alt="Merchant Logo"
                                    style={{
                                        width:
                                            "100%",
                                        height:
                                            "100%",
                                        objectFit:
                                            "contain",
                                    }}
                                />

                            </div>

                        ) : (

                            <div
                                style={{
                                    padding:
                                        12,
                                    color:
                                        mutedTextColor,
                                    border:
                                        `1px dashed ${mutedTextColor}`,
                                    borderRadius:
                                        12,
                                    fontSize:
                                        10,
                                }}
                            >
                                NO LOGO RECORDED
                            </div>

                        )}

                    </div>

                    {/* ==================================================
                        BUSINESS INFORMATION
                       ================================================== */}

                    <div
                        style={{
                            textAlign:
                                "center",
                            marginBottom:
                                sectionSpacing,
                        }}
                    >

                        <strong
                            style={{
                                display:
                                    "block",
                                fontSize:
                                    "18px",
                                fontWeight:
                                    900,
                                letterSpacing:
                                    "1px",
                                color:
                                    textColor,
                                textTransform:
                                    "uppercase",
                            }}
                        >
                            {settings?.business_name ||
                                "MY BUSINESS BRAND"}
                        </strong>

                        <div
                            style={{
                                width:
                                    70,
                                height:
                                    2,
                                margin:
                                    "9px auto",
                                borderRadius:
                                    999,
                                background:
                                    `linear-gradient(
                                        90deg,
                                        ${primaryColor},
                                        ${secondaryColor}
                                    )`,
                            }}
                        />

                        <div
                            style={{
                                color:
                                    mutedTextColor,
                                fontSize:
                                    11,
                                fontWeight:
                                    700,
                                whiteSpace:
                                    "pre-wrap",
                                lineHeight:
                                    1.6,
                            }}
                        >
                            {settings?.store_address ||
                                "Outlet Physical Address Street\nKrugersdorp, South Africa"}
                        </div>

                        <div
                            style={{
                                marginTop:
                                    6,
                                color:
                                    mutedTextColor,
                                fontSize:
                                    10,
                            }}
                        >
                            {user?.email ||
                                receiptData?.customer_email ||
                                "info@merchantnode.com"}
                        </div>

                    </div>

                    {/* ==================================================
                        DIVIDER
                       ================================================== */}

                    <div
                        className="matrix-receipt-divider"
                    />

                    {/* ==================================================
                        ITEMS
                       ================================================== */}

                    <div
                        style={{
                            marginBottom:
                                sectionSpacing,
                        }}
                    >

                        <div
                            style={{
                                fontSize:
                                    10,
                                textTransform:
                                    "uppercase",
                                letterSpacing:
                                    1,
                                marginBottom:
                                    6,
                                color:
                                    primaryColor,
                                fontWeight:
                                    900,
                            }}
                        >
                            Items Purchased
                        </div>

                        {receiptDataItems.length > 0 ? (

                            receiptDataItems.map(
                                (
                                    item,
                                    index
                                ) => (

                                    <div
                                        key={
                                            item?.id ??
                                            index
                                        }
                                        className="matrix-receipt-item"
                                    >

                                        <span
                                            style={{
                                                maxWidth:
                                                    "75%",
                                                color:
                                                    textColor,
                                                fontSize:
                                                    11,
                                                fontWeight:
                                                    700,
                                            }}
                                        >
                                            {item?.name ||
                                                "Unnamed item"}
                                        </span>

                                        <span
                                            style={{
                                                whiteSpace:
                                                    "nowrap",
                                                color:
                                                    "#BFC1C8",
                                                fontWeight:
                                                    900,
                                            }}
                                        >
                                            {item?.price ??
                                                ""}
                                        </span>

                                    </div>

                                )
                            )

                        ) : (

                            <div
                                style={{
                                    padding:
                                        "12px 0",
                                    color:
                                        mutedTextColor,
                                    textAlign:
                                        "center",
                                    fontSize:
                                        10,
                                }}
                            >
                                No transaction items
                                recorded.
                            </div>

                        )}

                        {/* ==============================================
                            VAT
                           ============================================== */}

                        {vat !== null &&
                            vat !== undefined && (

                                <div
                                    style={{
                                        display:
                                            "flex",
                                        justifyContent:
                                            "space-between",
                                        marginTop:
                                            8,
                                        padding:
                                            "8px 0",
                                        color:
                                            mutedTextColor,
                                        fontSize:
                                            11,
                                    }}
                                >

                                    <span>
                                        VAT
                                    </span>

                                    <span>
                                        {vat}
                                    </span>

                                </div>

                            )}

                    </div>

                    {/* ==================================================
                        TOTAL
                       ================================================== */}

                    <div
                        className="matrix-receipt-total"
                    >

                        <span>
                            TOTAL DUE
                        </span>

                        <span
                            style={{
                                color:
                                    primaryColor,
                                fontWeight:
                                    900,
                            }}
                        >
                            {total}
                        </span>

                    </div>

                    {/* ==================================================
                        VOUCHER + QR
                       ================================================== */}

                    {showVoucher && (

                        <div
                            style={{
                                marginTop:
                                    sectionSpacing,
                                padding:
                                    12,
                                border:
                                    `2px solid ${primaryColor}`,
                                borderRadius:
                                    20,
                                background:
                                    "rgba(10,20,28,0.68)",
                                textAlign:
                                    "center",
                            }}
                        >

                            <div
                                style={{
                                    fontSize:
                                        9,
                                    color:
                                        primaryColor,
                                    fontWeight:
                                        900,
                                    letterSpacing:
                                        1,
                                    marginBottom:
                                        7,
                                }}
                            >
                                NEXT VISIT VOUCHER
                            </div>

                            {/* ==========================================
                                QR CODE
                               ========================================== */}

                            <div
                                style={{
                                    display:
                                        "inline-flex",
                                    alignItems:
                                        "center",
                                    justifyContent:
                                        "center",
                                    marginBottom:
                                        7,
                                }}
                            >

                                <div
                                    className="matrix-receipt-qr-stage"
                                    style={{
                                        width:
                                            96,
                                        height:
                                            96,
                                        borderRadius:
                                            12,
                                    }}
                                >

                                    {qrCodeUrl ? (

                                        <img
                                            src={
                                                qrCodeUrl
                                            }
                                            alt="Voucher QR Code"
                                            style={{
                                                width:
                                                    "100%",
                                                height:
                                                    "100%",
                                                objectFit:
                                                    "contain",
                                            }}
                                        />

                                    ) : (

                                        <div
                                            style={{
                                                width:
                                                    "100%",
                                                height:
                                                    "100%",
                                                display:
                                                    "flex",
                                                alignItems:
                                                    "center",
                                                justifyContent:
                                                    "center",
                                                color:
                                                    "#11161D",
                                                background:
                                                    "#FFFFFF",
                                                fontSize:
                                                    8,
                                                textAlign:
                                                    "center",
                                            }}
                                        >
                                            QR
                                            <br />
                                            UNAVAILABLE
                                        </div>

                                    )}

                                </div>

                            </div>

                            <div
                                style={{
                                    fontSize:
                                        9,
                                    color:
                                        "#FFFFFF",
                                    fontWeight:
                                        900,
                                    letterSpacing:
                                        1,
                                    marginBottom:
                                        4,
                                }}
                            >
                                CLAIM DISCOUNT
                            </div>

                            <div
                                style={{
                                    fontSize:
                                        10,
                                    color:
                                        mutedTextColor,
                                    lineHeight:
                                        1.6,
                                }}
                            >
                                Scan to instantly
                                claim your{" "}

                                <strong
                                    style={{
                                        color:
                                            primaryColor,
                                    }}
                                >
                                    {settings?.discount_percentage ??
                                        10}
                                    % discount
                                </strong>

                                {" "}and maintain
                                your customer balance.
                            </div>

                            <div
                                style={{
                                    marginTop:
                                        9,
                                    paddingTop:
                                        8,
                                    borderTop:
                                        "1px dashed rgba(255,255,255,0.10)",
                                    fontSize:
                                        9,
                                    color:
                                        mutedTextColor,
                                }}
                            >

                                {isExpired ? (
                                    <>
                                        VOUCHER STATUS:{" "}

                                        <span
                                            style={{
                                                color:
                                                    "#EF4444",
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
                                                    primaryColor,
                                            }}
                                        >
                                            {daysRemaining ||
                                                settings?.voucher_expiration_days ||
                                                30}{" "}
                                            DAYS
                                        </span>
                                    </>
                                )}

                            </div>

                            {voucher?.voucher_token && (

                                <div
                                    style={{
                                        marginTop:
                                            8,
                                        fontSize:
                                            8,
                                        color:
                                            "rgba(255,255,255,0.35)",
                                        wordBreak:
                                            "break-all",
                                    }}
                                >
                                    TOKEN:{" "}
                                    {
                                        voucher.voucher_token
                                    }
                                </div>

                            )}

                        </div>

                    )}

                    {/* ==================================================
                        FOOTER
                       ================================================== */}

                    <div
                        style={{
                            marginTop:
                                sectionSpacing,
                            textAlign:
                                "center",
                            color:
                                mutedTextColor,
                            fontSize:
                                9,
                        }}
                    >
                        Powered by RuachAgent AI
                    </div>

                </div>

            </div>

            {/* ========================================================
                DOWNLOAD BUTTON
               ======================================================== */}

            {showDownloadButton && (

                <div
                    className="matrix-receipt-download"
                    style={{
                        marginTop:
                            18,
                        textAlign:
                            "center",
                    }}
                >

                    <a
                        href="#download"
                        onClick={
                            handleDownload
                        }
                        style={{
                            display:
                                "block",
                            background:
                                `linear-gradient(
                                    90deg,
                                    ${primaryColor},
                                    ${secondaryColor}
                                )`,
                            color:
                                "#041014",
                            textDecoration:
                                "none",
                            padding:
                                14,
                            borderRadius:
                                14,
                            fontSize:
                                11,
                            fontWeight:
                                900,
                            letterSpacing:
                                "0.7px",
                            textTransform:
                                "uppercase",
                            boxShadow:
                                `0 10px 28px ${primaryColor}38`,
                        }}
                    >
                        Download Official Invoice PDF
                    </a>

                </div>

            )}

        </div>
    );
}