import React, { useMemo } from "react";

/**
 * ================================================================
 * RUACHAGENT AI — SYSTEM D
 * CANVAS RENDERER
 * ================================================================
 *
 * RESPONSIBILITY
 * ----------------------------------------------------------------
 * System D is the visual rendering layer of the Receipt Studio.
 *
 * It receives:
 *
 *   designConfig
 *   receiptData
 *   settings
 *   selectedObjectId
 *
 * and turns the configuration into a live editing canvas.
 *
 * IMPORTANT ARCHITECTURE RULE
 * ----------------------------------------------------------------
 * This component DOES NOT rewrite JSX based on AI instructions.
 *
 * The JSX remains the renderer.
 *
 * AI / Studio
 *      ↓
 * designConfig
 *      ↓
 * System D
 *      ↓
 * rendered receipt
 *
 * The same designConfig can later be used by the customer-facing
 * receipt renderer so that the saved design and preview remain
 * visually consistent.
 *
 * SYSTEM D DOES NOT OWN:
 *   - Supabase persistence
 *   - AI prompting
 *   - save/revert logic
 *   - object inspector state
 *
 * Those responsibilities belong to AdminPanel / backend services.
 *
 * ================================================================
 */

export default function ReceiptCanvasRenderer({
    receiptData = {},
    settings = {},
    designConfig = {},
    selectedObjectId = null,
    onSelectObject,
    canvasMode = "studio",
}) {
    const config = designConfig || {};

    const colors = config.colors || {};
    const typography = config.typography || {};
    const effects = config.effects || {};
    const receipt = config.receipt || {};
    const logo = config.logo || {};
    const qr = config.qr || {};
    const text = config.text || {};
    const objects = config.objects || {};

    /*
     * --------------------------------------------------------------
     * DEFAULT DESIGN CONFIG
     * --------------------------------------------------------------
     *
     * The renderer is intentionally tolerant of partial configs.
     * This allows the AI to modify one property without requiring
     * the entire designConfig object to exist.
     */
    const primaryColor =
        colors.primary ||
        colors.accent ||
        "#00c8ff";

    const secondaryColor =
        colors.secondary ||
        "#071019";

    const accentColor =
        colors.accent ||
        "#00e5ff";

    const backgroundColor =
        colors.background ||
        "#05070a";

    const surfaceColor =
        colors.surface ||
        "#0b1016";

    const textColor =
        colors.text ||
        "#f4f8fb";

    const mutedColor =
        colors.mutedText ||
        "#81909e";

    const dividerColor =
        colors.divider ||
        "rgba(255,255,255,0.12)";

    const receiptWidth =
        Number(receipt.width) ||
        Number(receipt.receiptWidth) ||
        390;

    const outerPadding =
        Number(receipt.outerPadding) ||
        24;

    const sectionSpacing =
        Number(receipt.sectionSpacing) ||
        18;

    const borderWidth =
        Number(receipt.borderWidth) ||
        1;

    const borderRadius =
        Number(receipt.borderRadius) ||
        16;

    const borderStyle =
        receipt.borderStyle ||
        "solid";

    /*
     * --------------------------------------------------------------
     * HELPERS
     * --------------------------------------------------------------
     */

    const safeNumber = (value, fallback = 0) => {
        const number = Number(value);
        return Number.isFinite(number) ? number : fallback;
    };

    const getNested = (source, path, fallback) => {
        try {
            const result = path.split(".").reduce(
                (current, key) => current?.[key],
                source
            );

            return result === undefined || result === null
                ? fallback
                : result;
        } catch {
            return fallback;
        }
    };

    const normalizeScale = (value, fallback = 1) => {
        const parsed = Number(value);
        if (!Number.isFinite(parsed)) return fallback;

        /*
         * Supports both:
         *
         * 1.25
         * 125
         *
         * so the Studio can store either representation.
         */
        return parsed > 10 ? parsed / 100 : parsed;
    };

    const objectConfig = (objectId) => {
        return (
            objects?.[objectId] ||
            config?.[objectId] ||
            {}
        );
    };

    const selected =
        selectedObjectId
            ? objectConfig(selectedObjectId)
            : {};

    const isSelected = (objectId) =>
        selectedObjectId === objectId;

    /*
     * --------------------------------------------------------------
     * OBJECT TRANSFORM ENGINE
     * --------------------------------------------------------------
     *
     * Every visual object can be transformed through configuration.
     */

    const buildTransform = (object = {}) => {
        const layout = object.layout || object.transform || {};

        const x = safeNumber(
            layout.x ?? layout.position?.x,
            0
        );

        const y = safeNumber(
            layout.y ?? layout.position?.y,
            0
        );

        const scaleX = normalizeScale(
            layout.scaleX ?? layout.scale,
            1
        );

        const scaleY = normalizeScale(
            layout.scaleY ?? layout.scale,
            scaleX
        );

        const rotation = safeNumber(
            layout.rotation,
            0
        );

        const skewX = safeNumber(
            layout.skewX,
            0
        );

        const skewY = safeNumber(
            layout.skewY,
            0
        );

        return `
            translate(${x}px, ${y}px)
            rotate(${rotation}deg)
            skew(${skewX}deg, ${skewY}deg)
            scale(${scaleX}, ${scaleY})
        `;
    };

    /*
     * --------------------------------------------------------------
     * EFFECT ENGINE
     * --------------------------------------------------------------
     */

    const effectConfig = (object = {}) => ({
        ...effects,
        ...(object.effects || {}),
    });

    const buildEffectStyle = (object = {}) => {
        const effect = effectConfig(object);

        const style = {};

        if (effect.shadow || effect.shadowEnabled) {
            style.filter = `
                drop-shadow(
                    ${safeNumber(effect.shadowX, 0)}px
                    ${safeNumber(effect.shadowY, 5)}px
                    ${safeNumber(effect.shadowBlur, 16)}px
                    ${effect.shadowColor || "rgba(0,0,0,.55)"}
                )
            `;
        }

        if (effect.glow || effect.neon) {
            const glowColor =
                effect.glowColor ||
                effect.neonColor ||
                accentColor;

            const intensity =
                safeNumber(
                    effect.glowIntensity,
                    18
                );

            style.filter = `
                ${style.filter || ""}
                drop-shadow(
                    0 0 ${intensity}px ${glowColor}
                )
            `;
        }

        if (effect.opacity !== undefined) {
            style.opacity =
                Math.max(
                    0,
                    Math.min(
                        1,
                        safeNumber(effect.opacity, 1)
                    )
                );
        }

        if (
            effect.blur !== undefined &&
            safeNumber(effect.blur, 0) > 0
        ) {
            style.backdropFilter =
                `blur(${safeNumber(effect.blur)}px)`;
        }

        return style;
    };

    /*
     * --------------------------------------------------------------
     * ANIMATION CLASS ENGINE
     * --------------------------------------------------------------
     */

    const getAnimationClass = (object = {}) => {
        const effect = effectConfig(object);

        if (
            effect.infiniteRotation ||
            effect.rotation360 ||
            effect["360Rotation"]
        ) {
            return "ruach-object-spin";
        }

        if (effect.floating) {
            return "ruach-object-float";
        }

        if (effect.pulse) {
            return "ruach-object-pulse";
        }

        if (effect.hover || effect.smoothHover) {
            return "ruach-object-hover";
        }

        if (effect.scanLine) {
            return "ruach-object-scan";
        }

        return "";
    };

    /*
     * --------------------------------------------------------------
     * OBJECT SELECTION
     * --------------------------------------------------------------
     */

    const objectInteraction = (objectId) => ({
        onClick: (event) => {
            event.stopPropagation();

            if (typeof onSelectObject === "function") {
                onSelectObject(objectId);
            }
        },

        className: [
            "ruach-canvas-object",
            getAnimationClass(objectConfig(objectId)),
            isSelected(objectId)
                ? "ruach-canvas-object-selected"
                : "",
        ].join(" "),
    });

    /*
     * --------------------------------------------------------------
     * LOGO
     * --------------------------------------------------------------
     */

    const logoUrl =
        settings?.logo_url ||
        receiptData?.logo_url ||
        logo?.url ||
        logo?.src ||
        "";

    const logoLayout = logo.layout || {};

    const logoStyle = {
        width:
            logoLayout.width ||
            `${safeNumber(logo.width, 96)}px`,

        height:
            logoLayout.height ||
            "auto",

        opacity:
            logoLayout.opacity !== undefined
                ? safeNumber(logoLayout.opacity, 1)
                : 1,

        transform:
            buildTransform(logo),

        objectFit:
            logoLayout.objectFit ||
            "contain",

        ...buildEffectStyle(logo),
    };

    /*
     * --------------------------------------------------------------
     * QR CODE
     * --------------------------------------------------------------
     */

    const qrUrl =
        receiptData?.qrCodeUrl ||
        receiptData?.qr_code_url ||
        qr?.url ||
        "";

    const qrLayout = qr.layout || {};

    const qrStyle = {
        width:
            qrLayout.width ||
            `${safeNumber(qr.size, 108)}px`,

        height:
            qrLayout.height ||
            `${safeNumber(qr.size, 108)}px`,

        opacity:
            qrLayout.opacity !== undefined
                ? safeNumber(qrLayout.opacity, 1)
                : 1,

        transform:
            buildTransform(qr),

        borderRadius:
            safeNumber(
                qrLayout.cornerRadius ??
                qr.cornerRadius,
                8
            ),

        ...buildEffectStyle(qr),
    };

    /*
     * --------------------------------------------------------------
     * RECEIPT DATA NORMALIZATION
     * --------------------------------------------------------------
     */

    const merchantName =
        receiptData?.merchantName ||
        settings?.business_name ||
        "Merchant";

    const location =
        receiptData?.location ||
        settings?.store_address ||
        "";

    const items =
        Array.isArray(receiptData?.items)
            ? receiptData.items
            : [];

    const total =
        receiptData?.total ||
        receiptData?.grandTotal ||
        "R0.00";

    const vat =
        receiptData?.vat ||
        "R0.00";

    /*
     * --------------------------------------------------------------
     * TEXT STYLE
     * --------------------------------------------------------------
     */

    const headingText =
        text.heading ||
        {};

    const bodyText =
        text.body ||
        {};

    const totalText =
        text.total ||
        {};

    const textStyle = (type = "body") => {
        const selectedText =
            type === "heading"
                ? headingText
                : type === "total"
                    ? totalText
                    : bodyText;

        const fontSize =
            selectedText.fontSize ||
            typography?.[type]?.fontSize ||
            (type === "heading"
                ? 21
                : type === "total"
                    ? 22
                    : 13);

        const fontFamily =
            selectedText.fontFamily ||
            typography.fontFamily ||
            "Inter, Arial, sans-serif";

        const fontWeight =
            selectedText.fontWeight ||
            typography.fontWeight ||
            (type === "total"
                ? 700
                : 500);

        const letterSpacing =
            selectedText.letterSpacing ??
            typography.letterSpacing ??
            0;

        const opacity =
            selectedText.opacity !== undefined
                ? safeNumber(
                    selectedText.opacity,
                    1
                )
                : 1;

        return {
            fontFamily,
            fontSize:
                typeof fontSize === "number"
                    ? `${fontSize}px`
                    : fontSize,

            fontWeight,

            letterSpacing:
                typeof letterSpacing === "number"
                    ? `${letterSpacing}px`
                    : letterSpacing,

            color:
                selectedText.color ||
                textColor,

            opacity,

            textAlign:
                selectedText.alignment ||
                "left",

            transform:
                buildTransform(selectedText),

            ...buildEffectStyle(selectedText),
        };
    };

    /*
     * --------------------------------------------------------------
     * RECEIPT BACKGROUND
     * --------------------------------------------------------------
     */

    const backgroundGradient =
        colors.dynamicGradient
            ? `
                linear-gradient(
                    ${safeNumber(colors.gradientAngle, 135)}deg,
                    ${colors.gradientStart || primaryColor},
                    ${colors.gradientEnd || secondaryColor}
                )
              `
            : colors.gradient
                ? colors.gradient
                : backgroundColor;

    const receiptStyle = {
        width: `${receiptWidth}px`,
        maxWidth: "100%",

        padding:
            `${outerPadding}px`,

        background:
            backgroundGradient,

        color:
            textColor,

        border:
            `${borderWidth}px ${borderStyle} ${colors.border || primaryColor
            }`,

        borderRadius:
            `${borderRadius}px`,

        boxShadow:
            effects.ambientGlow
                ? `
                    0 0 20px ${effects.ambientGlowColor ||
                primaryColor
                }66,
                    0 25px 80px rgba(0,0,0,.55)
                  `
                : "0 25px 80px rgba(0,0,0,.55)",

        position: "relative",
        overflow: "hidden",
    };

    /*
     * --------------------------------------------------------------
     * SELECTION OUTLINE
     * --------------------------------------------------------------
     */

    const selectionStyle = {
        position: "absolute",
        inset: "-3px",
        border:
            `1px solid ${accentColor}`,
        borderRadius:
            `${borderRadius + 3}px`,
        pointerEvents: "none",
        boxShadow:
            `0 0 18px ${accentColor}66`,
    };

    /*
     * --------------------------------------------------------------
     * PRODUCT ROW
     * --------------------------------------------------------------
     */

    const renderProduct = (item, index) => {
        const productId =
            `product-${index}`;

        const productConfig =
            objectConfig(productId);

        return (
            <div
                key={productId}
                {...objectInteraction(productId)}
                style={{
                    ...styles.productRow,
                    gap: 12,
                    marginBottom:
                        sectionSpacing / 2,
                    background:
                        productConfig.background ||
                        "transparent",
                    ...buildEffectStyle(
                        productConfig
                    ),
                }}
            >
                <div
                    style={{
                        ...styles.productName,
                        ...textStyle("body"),
                    }}
                >
                    {item?.name || "Product"}
                </div>

                <div
                    style={{
                        ...styles.productPrice,
                        ...textStyle("body"),
                    }}
                >
                    {item?.price || "R0.00"}
                </div>
            </div>
        );
    };

    /*
     * --------------------------------------------------------------
     * PARTICLES
     * --------------------------------------------------------------
     */

    const particlesEnabled =
        effects.particles ||
        receipt.effects?.particles;

    const particleCount =
        Math.max(
            0,
            Math.min(
                30,
                safeNumber(
                    effects.particleCount,
                    12
                )
            )
        );

    const particleNodes =
        useMemo(() => {
            if (!particlesEnabled) return [];

            return Array.from({
                length: particleCount,
            }).map((_, index) => (
                <span
                    key={index}
                    className="ruach-particle"
                    style={{
                        left:
                            `${(index * 37) % 100}%`,
                        top:
                            `${(index * 61) % 100}%`,
                        animationDelay:
                            `${(index * 0.31) % 4}s`,
                    }}
                />
            ));
        }, [
            particlesEnabled,
            particleCount,
        ]);

    /*
     * --------------------------------------------------------------
     * RENDER
     * --------------------------------------------------------------
     */

    return (
        <div
            className={`ruach-canvas-shell ${canvasMode === "studio"
                    ? "ruach-canvas-studio"
                    : ""
                }`}
            style={styles.shell}
            onClick={() => {
                if (typeof onSelectObject === "function") {
                    onSelectObject(null);
                }
            }}
        >
            <div style={styles.canvasHeader}>
                <div>
                    <div style={styles.canvasEyebrow}>
                        RUACHAGENT // CANVAS ENGINE
                    </div>

                    <div style={styles.canvasTitle}>
                        LIVE RECEIPT RENDER
                    </div>
                </div>

                <div style={styles.canvasTelemetry}>
                    <span style={styles.telemetryDot} />
                    DESIGN CONFIG LINKED
                </div>
            </div>

            <div
                className="ruach-canvas-workspace"
                style={styles.workspace}
            >
                <div
                    className="ruach-receipt-stage"
                    style={styles.stage}
                >
                    <div
                        className="ruach-receipt-shadow"
                        style={{
                            ...styles.receiptShadow,
                            width:
                                `${receiptWidth}px`,
                        }}
                    />

                    <article
                        className="ruach-receipt"
                        style={receiptStyle}
                        onClick={(event) =>
                            event.stopPropagation()
                        }
                    >
                        {particlesEnabled && (
                            <div
                                className="ruach-particles"
                                style={
                                    styles.particles
                                }
                            >
                                {particleNodes}
                            </div>
                        )}

                        {effects.holographic && (
                            <div
                                className="ruach-holographic-layer"
                                style={
                                    styles.holographicLayer
                                }
                            />
                        )}

                        {effects.metallic && (
                            <div
                                className="ruach-metallic-layer"
                                style={
                                    styles.metallicLayer
                                }
                            />
                        )}

                        {/* =================================================
                            MERCHANT / LOGO
                        ================================================== */}

                        <div
                            {...objectInteraction(
                                "logo"
                            )}
                            style={{
                                ...styles.logoZone,
                                marginBottom:
                                    sectionSpacing,
                                ...buildEffectStyle(
                                    logo
                                ),
                            }}
                        >
                            {logoUrl ? (
                                <img
                                    src={logoUrl}
                                    alt="Merchant logo"
                                    style={logoStyle}
                                    draggable={false}
                                />
                            ) : (
                                <div
                                    style={
                                        styles.logoPlaceholder
                                    }
                                >
                                    <span>
                                        MERCHANT
                                    </span>
                                    <small>
                                        LOGO
                                    </small>
                                </div>
                            )}

                            {isSelected("logo") && (
                                <div
                                    style={
                                        selectionStyle
                                    }
                                />
                            )}
                        </div>

                        {/* =================================================
                            MERCHANT TEXT
                        ================================================== */}

                        <div
                            {...objectInteraction(
                                "merchant-heading"
                            )}
                            style={{
                                marginBottom:
                                    sectionSpacing,
                            }}
                        >
                            <h2
                                style={{
                                    ...styles.heading,
                                    ...textStyle(
                                        "heading"
                                    ),
                                }}
                            >
                                {merchantName}
                            </h2>

                            {location && (
                                <p
                                    style={{
                                        ...styles.location,
                                        ...textStyle(
                                            "body"
                                        ),
                                    }}
                                >
                                    {location}
                                </p>
                            )}

                            {isSelected(
                                "merchant-heading"
                            ) && (
                                    <div
                                        style={
                                            selectionStyle
                                        }
                                    />
                                )}
                        </div>

                        {/* =================================================
                            DIVIDER
                        ================================================== */}

                        <div
                            {...objectInteraction(
                                "divider"
                            )}
                            style={{
                                ...styles.divider,
                                background:
                                    dividerColor,
                                marginBottom:
                                    sectionSpacing,
                            }}
                        >
                            {isSelected("divider") && (
                                <div
                                    style={
                                        selectionStyle
                                    }
                                />
                            )}
                        </div>

                        {/* =================================================
                            PRODUCTS
                        ================================================== */}

                        <section
                            {...objectInteraction(
                                "products"
                            )}
                            style={{
                                marginBottom:
                                    sectionSpacing,
                            }}
                        >
                            {items.length > 0 ? (
                                items.map(
                                    renderProduct
                                )
                            ) : (
                                <div
                                    style={{
                                        ...styles.emptyProducts,
                                        color:
                                            mutedColor,
                                    }}
                                >
                                    NO PRODUCT DATA
                                </div>
                            )}

                            {isSelected(
                                "products"
                            ) && (
                                    <div
                                        style={
                                            selectionStyle
                                        }
                                    />
                                )}
                        </section>

                        {/* =================================================
                            TOTALS
                        ================================================== */}

                        <section
                            {...objectInteraction(
                                "totals"
                            )}
                            style={{
                                marginTop:
                                    sectionSpacing,
                            }}
                        >
                            <div
                                style={{
                                    ...styles.totalLine,
                                    color:
                                        mutedColor,
                                }}
                            >
                                <span>VAT</span>
                                <span>{vat}</span>
                            </div>

                            <div
                                style={{
                                    ...styles.totalLine,
                                    ...textStyle(
                                        "total"
                                    ),
                                    color:
                                        totalText.color ||
                                        textColor,
                                    marginTop: 8,
                                }}
                            >
                                <span>TOTAL</span>
                                <span>{total}</span>
                            </div>

                            {isSelected(
                                "totals"
                            ) && (
                                    <div
                                        style={
                                            selectionStyle
                                        }
                                    />
                                )}
                        </section>

                        {/* =================================================
                            QR CODE
                        ================================================== */}

                        <div
                            {...objectInteraction(
                                "qr"
                            )}
                            style={{
                                ...styles.qrZone,
                                marginTop:
                                    sectionSpacing * 1.4,
                                marginBottom:
                                    sectionSpacing,
                                ...buildEffectStyle(
                                    qr
                                ),
                            }}
                        >
                            {qrUrl ? (
                                <img
                                    src={qrUrl}
                                    alt="Receipt QR code"
                                    style={qrStyle}
                                    draggable={false}
                                />
                            ) : (
                                <div
                                    style={{
                                        ...styles.qrPlaceholder,
                                        width:
                                            qrStyle.width,
                                        height:
                                            qrStyle.height,
                                        borderRadius:
                                            qrStyle.borderRadius,
                                    }}
                                >
                                    <span>QR</span>
                                    <small>
                                        CODE
                                    </small>
                                </div>
                            )}

                            {qr.scanLine && (
                                <div
                                    className="ruach-qr-scan"
                                    style={
                                        styles.qrScan
                                    }
                                />
                            )}

                            {isSelected("qr") && (
                                <div
                                    style={
                                        selectionStyle
                                    }
                                />
                            )}
                        </div>

                        {/* =================================================
                            FOOTER
                        ================================================== */}

                        <div
                            {...objectInteraction(
                                "footer"
                            )}
                            style={{
                                ...styles.footer,
                                color:
                                    mutedColor,
                                ...textStyle(
                                    "body"
                                ),
                            }}
                        >
                            {receiptData?.footer ||
                                "Powered by RuachAgent AI"}

                            {isSelected(
                                "footer"
                            ) && (
                                    <div
                                        style={
                                            selectionStyle
                                        }
                                    />
                                )}
                        </div>

                        {effects.animatedBorder && (
                            <div
                                className="ruach-animated-border"
                                style={
                                    styles.animatedBorder
                                }
                            />
                        )}

                        {selectedObjectId ===
                            "receipt" && (
                                <div
                                    style={
                                        selectionStyle
                                    }
                                />
                            )}
                    </article>
                </div>
            </div>

            <div style={styles.canvasFooter}>
                <span>
                    X {safeNumber(
                        selected?.layout?.x,
                        0
                    )}
                </span>

                <span>
                    Y {safeNumber(
                        selected?.layout?.y,
                        0
                    )}
                </span>

                <span>
                    Z {safeNumber(
                        selected?.layout?.z ??
                        selected?.zIndex,
                        0
                    )}
                </span>

                <span>
                    {selectedObjectId
                        ? `SELECTED // ${selectedObjectId.toUpperCase()}`
                        : "NO OBJECT SELECTED"}
                </span>

                <span style={{ marginLeft: "auto" }}>
                    CONFIG // LIVE
                </span>
            </div>

            <style>{`
                .ruach-canvas-shell {
                    box-sizing: border-box;
                    width: 100%;
                    min-height: 640px;
                    color: #eaf6ff;
                    font-family:
                        Inter,
                        ui-sans-serif,
                        system-ui,
                        -apple-system,
                        BlinkMacSystemFont,
                        "Segoe UI",
                        sans-serif;
                    background:
                        radial-gradient(
                            circle at 50% 20%,
                            rgba(0, 153, 255, .10),
                            transparent 32%
                        ),
                        linear-gradient(
                            145deg,
                            #030507 0%,
                            #070b10 48%,
                            #020305 100%
                        );
                    border:
                        1px solid rgba(82, 180, 255, .14);
                    overflow: hidden;
                    position: relative;
                }

                .ruach-canvas-shell::before {
                    content: "";
                    position: absolute;
                    inset: 0;
                    pointer-events: none;
                    background-image:
                        linear-gradient(
                            rgba(255,255,255,.025) 1px,
                            transparent 1px
                        ),
                        linear-gradient(
                            90deg,
                            rgba(255,255,255,.025) 1px,
                            transparent 1px
                        );
                    background-size: 32px 32px;
                    mask-image:
                        linear-gradient(
                            to bottom,
                            black,
                            transparent 92%
                        );
                }

                .ruach-canvas-workspace {
                    min-height: 520px;
                }

                .ruach-receipt-stage {
                    perspective: 1400px;
                }

                .ruach-receipt {
                    transform-style: preserve-3d;
                    transition:
                        box-shadow .25s ease,
                        transform .25s ease;
                }

                .ruach-canvas-object {
                    position: relative;
                    cursor: pointer;
                    transition:
                        outline .16s ease,
                        filter .2s ease,
                        transform .2s ease;
                }

                .ruach-canvas-object:hover {
                    outline:
                        1px solid rgba(0, 201, 255, .38);
                    outline-offset: 5px;
                }

                .ruach-canvas-object-selected {
                    outline:
                        1px solid rgba(0, 216, 255, .95);
                    outline-offset: 6px;
                    box-shadow:
                        0 0 0 1px rgba(0, 216, 255, .15),
                        0 0 22px rgba(0, 174, 255, .18);
                }

                .ruach-object-spin {
                    animation:
                        ruachSpin 8s linear infinite;
                }

                .ruach-object-float {
                    animation:
                        ruachFloat 3.8s ease-in-out infinite;
                }

                .ruach-object-pulse {
                    animation:
                        ruachPulse 2s ease-in-out infinite;
                }

                .ruach-object-hover:hover {
                    transform:
                        translateY(-4px)
                        scale(1.015);
                }

                .ruach-object-scan {
                    overflow: hidden;
                }

                .ruach-particle {
                    position: absolute;
                    width: 2px;
                    height: 2px;
                    border-radius: 50%;
                    background: #00d9ff;
                    box-shadow:
                        0 0 8px #00d9ff;
                    animation:
                        ruachParticle 4s ease-in-out infinite;
                }

                .ruach-holographic-layer,
                .ruach-metallic-layer {
                    position: absolute;
                    inset: 0;
                    pointer-events: none;
                    z-index: 3;
                }

                .ruach-holographic-layer {
                    background:
                        linear-gradient(
                            115deg,
                            transparent 15%,
                            rgba(0, 229, 255, .10),
                            rgba(120, 70, 255, .08),
                            transparent 80%
                        );
                    mix-blend-mode: screen;
                    animation:
                        ruachHologram 6s linear infinite;
                }

                .ruach-metallic-layer {
                    background:
                        linear-gradient(
                            110deg,
                            transparent 35%,
                            rgba(255,255,255,.13) 48%,
                            transparent 60%
                        );
                    mix-blend-mode: screen;
                    animation:
                        ruachMetallic 5s ease-in-out infinite;
                }

                .ruach-animated-border {
                    position: absolute;
                    inset: 0;
                    pointer-events: none;
                    border-radius: inherit;
                    border: 1px solid transparent;
                    background:
                        linear-gradient(
                            90deg,
                            transparent,
                            #00d9ff,
                            transparent
                        ) border-box;
                    mask:
                        linear-gradient(#fff 0 0) padding-box,
                        linear-gradient(#fff 0 0);
                    mask-composite: exclude;
                    animation:
                        ruachBorder 3s linear infinite;
                }

                .ruach-qr-scan {
                    position: absolute;
                    left: 10%;
                    right: 10%;
                    top: 0;
                    height: 2px;
                    background: #00eaff;
                    box-shadow:
                        0 0 14px #00eaff;
                    animation:
                        ruachQrScan 2.4s linear infinite;
                }

                @keyframes ruachSpin {
                    from {
                        transform: rotateY(0deg);
                    }
                    to {
                        transform: rotateY(360deg);
                    }
                }

                @keyframes ruachFloat {
                    0%, 100% {
                        transform: translateY(0);
                    }
                    50% {
                        transform: translateY(-7px);
                    }
                }

                @keyframes ruachPulse {
                    0%, 100% {
                        opacity: 1;
                        filter:
                            drop-shadow(
                                0 0 0 transparent
                            );
                    }
                    50% {
                        opacity: .78;
                        filter:
                            drop-shadow(
                                0 0 12px
                                rgba(0, 220, 255, .8)
                            );
                    }
                }

                @keyframes ruachParticle {
                    0%, 100% {
                        transform:
                            translate3d(0, 0, 0);
                        opacity: .15;
                    }
                    50% {
                        transform:
                            translate3d(10px, -18px, 0);
                        opacity: .9;
                    }
                }

                @keyframes ruachHologram {
                    from {
                        transform:
                            translateX(-70%);
                    }
                    to {
                        transform:
                            translateX(70%);
                    }
                }

                @keyframes ruachMetallic {
                    0%, 100% {
                        transform:
                            translateX(-80%);
                    }
                    50% {
                        transform:
                            translateX(80%);
                    }
                }

                @keyframes ruachBorder {
                    from {
                        transform: rotate(0deg);
                    }
                    to {
                        transform: rotate(360deg);
                    }
                }

                @keyframes ruachQrScan {
                    0% {
                        transform: translateY(0);
                        opacity: 0;
                    }
                    15% {
                        opacity: 1;
                    }
                    85% {
                        opacity: 1;
                    }
                    100% {
                        transform: translateY(105px);
                        opacity: 0;
                    }
                }
            `}</style>
        </div>
    );
}

/*
 * =================================================================
 * SYSTEM D — STYLE OBJECT
 * =================================================================
 */

const styles = {
    shell: {
        position: "relative",
        width: "100%",
        minHeight: 640,
        background: "#030507",
        overflow: "hidden",
    },

    canvasHeader: {
        position: "relative",
        zIndex: 10,
        minHeight: 64,
        padding: "0 20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottom:
            "1px solid rgba(111, 190, 255, .12)",
        background:
            "linear-gradient(180deg, rgba(12,18,25,.94), rgba(4,7,10,.94))",
        boxSizing: "border-box",
    },

    canvasEyebrow: {
        fontSize: 9,
        letterSpacing: "2.4px",
        color: "#4d88aa",
        fontWeight: 700,
        marginBottom: 4,
    },

    canvasTitle: {
        fontSize: 13,
        letterSpacing: "1.2px",
        color: "#dff7ff",
        fontWeight: 800,
    },

    canvasTelemetry: {
        display: "flex",
        alignItems: "center",
        gap: 8,
        fontSize: 9,
        letterSpacing: "1.4px",
        color: "#6e9eb8",
        fontWeight: 700,
    },

    telemetryDot: {
        width: 6,
        height: 6,
        borderRadius: "50%",
        background: "#00d9ff",
        boxShadow:
            "0 0 10px rgba(0,217,255,.9)",
    },

    workspace: {
        position: "relative",
        minHeight: 520,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "46px 28px 56px",
        boxSizing: "border-box",
        background:
            "radial-gradient(circle at center, rgba(0,145,255,.08), transparent 42%)",
    },

    stage: {
        position: "relative",
        width: "100%",
        minHeight: 430,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },

    receiptShadow: {
        position: "absolute",
        height: "72%",
        maxWidth: "75%",
        background:
            "rgba(0,0,0,.72)",
        filter:
            "blur(42px)",
        transform:
            "translateY(45px) scale(.88)",
        pointerEvents: "none",
    },

    logoZone: {
        position: "relative",
        minHeight: 70,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },

    logoPlaceholder: {
        width: 96,
        height: 64,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        border:
            "1px dashed rgba(0,210,255,.45)",
        borderRadius: 10,
        color: "#53b8d7",
        background:
            "rgba(0,120,180,.06)",
        letterSpacing: "1.5px",
        fontSize: 10,
        fontWeight: 800,
    },

    heading: {
        margin: 0,
        lineHeight: 1.15,
        textAlign: "center",
    },

    location: {
        margin: "7px 0 0",
        textAlign: "center",
    },

    divider: {
        position: "relative",
        width: "100%",
        height: 1,
        opacity: .8,
    },

    productRow: {
        position: "relative",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        boxSizing: "border-box",
    },

    productName: {
        flex: 1,
        minWidth: 0,
    },

    productPrice: {
        textAlign: "right",
        whiteSpace: "nowrap",
    },

    emptyProducts: {
        textAlign: "center",
        fontSize: 9,
        letterSpacing: "1.6px",
        padding: "18px 0",
    },

    totalLine: {
        position: "relative",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
    },

    qrZone: {
        position: "relative",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: 112,
    },

    qrPlaceholder: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        border:
            "1px solid rgba(0,220,255,.45)",
        background:
            "rgba(255,255,255,.94)",
        color: "#05070a",
        fontWeight: 900,
        fontSize: 18,
        boxSizing: "border-box",
    },

    qrScan: {
        position: "absolute",
        left: "15%",
        right: "15%",
        top: 4,
    },

    footer: {
        position: "relative",
        textAlign: "center",
        fontSize: 10,
        letterSpacing: ".4px",
        marginTop: 4,
    },

    particles: {
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
        zIndex: 2,
    },

    holographicLayer: {
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        zIndex: 3,
    },

    metallicLayer: {
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        zIndex: 3,
    },

    animatedBorder: {
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        zIndex: 10,
    },

    canvasFooter: {
        position: "relative",
        zIndex: 10,
        minHeight: 34,
        display: "flex",
        alignItems: "center",
        gap: 18,
        padding: "0 14px",
        borderTop:
            "1px solid rgba(111,190,255,.10)",
        background:
            "rgba(3,6,9,.94)",
        color: "#54758a",
        fontSize: 9,
        letterSpacing: "1.1px",
        fontWeight: 700,
        boxSizing: "border-box",
    },
};