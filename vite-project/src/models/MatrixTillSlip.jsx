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

    /* Normalize the Editing Studio schema and the legacy AI schema. */
    const colors = config.colors || {};
    const effects = config.effects || {};
    const typography = config.typography || {};
    const receiptConfig = config.receipt || {};

    const logoConfig = config.logo || {};
    const logoLayout = logoConfig.layout || {};
    const logoColors = logoConfig.colors || {};
    const logoEffects = logoConfig.effects || {};

    const qrConfig = config.qrCode || {};
    const qrLayout = qrConfig.layout || {};
    const qrColors = qrConfig.colors || {};
    const qrEffects = qrConfig.effects || {};

    const textConfig = config.text || {};
    const themeConfig = config.theme || {};
    const themeLayout = themeConfig.layout || {};
    const themeColors = themeConfig.colors || {};
    const themeEffects = themeConfig.effects || {};

    const rotationEffect = effects.infiniteRotation || logoEffects.infiniteRotation || {};
    const hoverEffect = effects.hoverAnimation || logoEffects.hover || {};
    const floatingEffect = effects.floatingElements || effects.floatingProductElements || logoEffects.floating || {};
    const metallicEffect = effects.metallicReflection || logoEffects.metallic || themeEffects.metallic || {};
    const glassEffect = effects.glassEffect || logoEffects.glass || themeEffects.glass || {};
    const neonEffect = effects.neonGlow || logoEffects.neonGlow || {};
    const holographicEffect = effects.holographicLighting || logoEffects.holographic || themeEffects.holographic || {};
    const dynamicGradientEffect = effects.dynamicGradient || themeEffects.dynamicGradient || {};

    const animatedQrEffect = effects.animatedQr || effects.animatedQRCode || {
        enabled: Boolean(
            qrEffects.pulse?.enabled ||
            qrEffects.scanline?.enabled ||
            qrEffects.glow?.enabled ||
            qrEffects.holographic?.enabled ||
            qrEffects.animatedBorder?.enabled
        ),
        pulse: qrEffects.pulse?.enabled !== false,
        scanline: qrEffects.scanline?.enabled === true,
        glowColor: qrEffects.glow?.color,
        speed: qrEffects.animationSpeed || qrEffects.pulse?.speed || "2.4s"
    };

    const particleEffect = effects.particleEffects || {
        enabled: themeEffects.particles?.enabled === true,
        ...themeEffects.particles
    };

    const transitionEffect = effects.premiumTransitions || {
        enabled: themeEffects.premiumTransition?.enabled === true,
        ...themeEffects.premiumTransition
    };

    // Transition timing fallbacks used by CSS transitions
    const transitionDuration = transitionEffect.duration || transitionEffect.transitionDuration || "0.25s";
    const transitionEasing = transitionEffect.easing || transitionEffect.timingFunction || "ease";

    const logoRotationEnabled = rotationEffect.enabled === true || logoEffects.infiniteRotation?.enabled === true;
    const logoHoverEnabled = hoverEffect.enabled === true || logoEffects.hover?.enabled === true;
    const logoFloatingEnabled = floatingEffect.enabled === true || logoEffects.floating?.enabled === true;
    const logoMetallicEnabled = metallicEffect.enabled === true || logoEffects.metallic?.enabled === true;
    const logoGlassEnabled = glassEffect.enabled === true || logoEffects.glass?.enabled === true;
    const logoNeonEnabled = neonEffect.enabled === true || logoEffects.neonGlow?.enabled === true;
    const logoHolographicEnabled = holographicEffect.enabled === true || logoEffects.holographic?.enabled === true;

    const themeGlassEnabled = themeEffects.glass?.enabled === true;
    const themeNeonEnabled = themeEffects.neonBorder?.enabled === true;
    const themeHolographicEnabled = themeEffects.holographic?.enabled === true;
    const themeMetallicEnabled = themeEffects.metallic?.enabled === true;
    const themeDynamicGradientEnabled = themeEffects.dynamicGradient?.enabled === true;

    const qrPulseEnabled = qrEffects.pulse?.enabled === true;
    const qrScanlineEnabled = qrEffects.scanline?.enabled === true;
    const qrGlowEnabled = qrEffects.glow?.enabled === true;
    const qrHolographicEnabled = qrEffects.holographic?.enabled === true;
    const qrAnimatedBorderEnabled = qrEffects.animatedBorder?.enabled === true;

    const rotationEnabled = rotationEffect.enabled === true;
    const hoverEnabled = hoverEffect.enabled === true;
    const floatingEnabled = floatingEffect.enabled === true;
    const metallicEnabled = metallicEffect.enabled === true;
    const glassEnabled = glassEffect.enabled === true;
    const neonEnabled = neonEffect.enabled === true;
    const holographicEnabled = holographicEffect.enabled === true;
    const dynamicGradientEnabled = dynamicGradientEffect.enabled === true;
    const animatedQrEnabled = animatedQrEffect.enabled === true;
    const particlesEnabled = particleEffect.enabled === true || themeEffects.particles?.enabled === true;

    const resolveEffectColor = (value, fallback) => {
        if (!value || value === "primary") return fallback;
        if (value === "secondary") return colors.secondary || "#00B8FF";
        if (value === "accent") return colors.accent || "#39D9FF";
        return value;
    };


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
        themeColors.primary || colors.primary || "#08E3D8";

    const secondaryColor =
        themeColors.secondary || colors.secondary || "#00B8FF";

    const backgroundColor =
        themeColors.background || colors.background ||
        "linear-gradient(180deg, rgba(8,18,24,0.95), rgba(4,10,14,0.98))";

    const textColor =
        themeColors.text || colors.text || "#FFFFFF";

    const mutedTextColor =
        themeColors.mutedText || colors.mutedText || "#94A3B8";

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

    const headingText = textConfig.heading || {};
    const bodyText = textConfig.body || {};
    const totalText = textConfig.total || {};

    const textStyleFromConfig = (target, fallback = {}) => {
        const brightness = Number(target.brightness ?? 1);
        const contrast = Number(target.contrast ?? 1);
        const effect = target.effects || {};
        const gradientEnabled = target.dynamicGradient?.enabled === true;
        const gradientColors = target.dynamicGradient?.colors || [primaryColor, secondaryColor];

        return {
            fontFamily: target.fontFamily || fallback.fontFamily,
            fontSize: target.fontSize ? `${target.fontSize}px` : fallback.fontSize,
            fontWeight: target.fontWeight || fallback.fontWeight,
            letterSpacing: target.letterSpacing !== undefined ? `${target.letterSpacing}px` : fallback.letterSpacing,
            textAlign: target.alignment || fallback.textAlign,
            opacity: target.opacity ?? fallback.opacity,
            color: target.color || fallback.color,
            transform: `scale(${target.scale || 1}) rotate(${target.rotation || 0}deg)`,
            transformOrigin: "center",
            filter: `brightness(${brightness}) contrast(${contrast})`,
            textShadow:
                effect.neon?.enabled || effect.glow?.enabled || effect.shadow?.enabled
                    ? `0 0 ${effect.neon?.radius || 10}px ${effect.neon?.color || primaryColor}99, 0 4px 12px rgba(0,0,0,0.35)`
                    : undefined,
            ...(gradientEnabled
                ? {
                    backgroundImage: `linear-gradient(90deg, ${gradientColors.join(", ")})`,
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text"
                }
                : {})
        };
    };

    const headingVisualStyle = textStyleFromConfig(headingText, {
        fontSize: businessNameSize,
        fontWeight: businessNameWeight,
        letterSpacing: typography.businessNameSpacing || "1px",
        color: textColor
    });
    const bodyVisualStyle = textStyleFromConfig(bodyText, {
        fontSize: "11px", fontWeight: "700", color: "rgba(255,255,255,0.85)"
    });
    const totalVisualStyle = textStyleFromConfig(totalText, {
        fontSize: "14px", fontWeight: "900", color: colors.totalLabel || "#B1B5C6"
    });

    const showWatermark =
        receiptConfig.showWatermark !== false;

    const showVoucher =
        receiptConfig.showVoucher !== false;

    const showDownloadButton =
        receiptConfig.showDownloadButton !== false;

    const themeBorderWidth = Number(themeLayout.borderWidth ?? 2);
    const themeBorderRadius = Number(themeLayout.borderRadius ?? 26);
    const themeOuterPadding = Number(themeLayout.outerPadding ?? 9);
    const themeReceiptWidth = themeLayout.width || "100%";

    const logoEnabled = logoConfig.enabled !== false;

    const baseLogoSize =
        logoConfig.size === "small" ? 100 :
            logoConfig.size === "large" ? 220 : 170;

    const numericLogoScale = Number.isFinite(Number(logoLayout.scale ?? logoConfig.scale))
        ? Math.max(0.1, Number(logoLayout.scale ?? logoConfig.scale))
        : 1;

    const logoWidth =
        logoLayout.width || logoConfig.width || logoConfig.mainLogoWidth ||
        `${Math.round(baseLogoSize * numericLogoScale)}px`;

    const logoHeight =
        logoLayout.height || logoConfig.height || logoConfig.mainLogoHeight ||
        `${Math.round(baseLogoSize * numericLogoScale)}px`;

    const logoMaxWidth = logoLayout.maxWidth || logoConfig.maxWidth || "100%";
    const logoMaxHeight = logoLayout.maxHeight || logoConfig.maxHeight || "none";
    const logoPositionName = logoLayout.position || logoConfig.position || "top-center";
    const logoRotation = Number(logoLayout.rotation ?? logoConfig.rotation ?? 0);
    const logoOpacity = Number(logoLayout.opacity ?? logoConfig.opacity ?? 1);
    const logoAspectRatio = logoLayout.aspectRatio || logoConfig.aspectRatio || "auto";
    const logoLockAspectRatio = logoLayout.lockAspectRatio ?? logoConfig.lockAspectRatio ?? true;

    let logoPosition = {
        top: "20px",
        left: "50%",
        transform: `translateX(-50%) rotate(${logoRotation}deg)`
    };

    if (logoPositionName === "top-left") {
        logoPosition = { top: "20px", left: "20px", transform: `rotate(${logoRotation}deg)` };
    }
    if (logoPositionName === "top-right") {
        logoPosition = { top: "20px", right: "20px", transform: `rotate(${logoRotation}deg)` };
    }
    if (logoPositionName === "top-center" || logoPositionName === "top") {
        logoPosition = { top: "20px", left: "50%", transform: `translateX(-50%) rotate(${logoRotation}deg)` };
    }
    if (logoPositionName === "center") {
        logoPosition = { top: "50%", left: "50%", transform: `translate(-50%, -50%) rotate(${logoRotation}deg)` };
    }
    if (logoPositionName === "bottom-center" || logoPositionName === "bottom") {
        logoPosition = { bottom: "40px", left: "50%", transform: `translateX(-50%) rotate(${logoRotation}deg)` };
    }
    if (logoPositionName === "bottom-left") {
        logoPosition = { bottom: "40px", left: "40px", transform: `rotate(${logoRotation}deg)` };
    }
    if (logoPositionName === "bottom-right") {
        logoPosition = { bottom: "40px", right: "40px", transform: `rotate(${logoRotation}deg)` };
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

    const qrCodeSize =
        typeof config.qrCode?.size === "number"
            ? `${config.qrCode.size}px`
            : config.qrCode?.size || "80px";

    const qrScale = Number(qrLayout.scale ?? qrConfig.scale ?? 1);
    const qrRotation = Number(qrLayout.rotation ?? qrConfig.rotation ?? 0);
    const qrCornerRadius = Number(qrLayout.cornerRadius ?? qrConfig.cornerRadius ?? 18);
    const qrForeground = qrColors.foreground || "#050608";
    const qrBackground = qrColors.background || "#FFFFFF";
    const qrOpacity = Number(qrColors.opacity ?? qrConfig.opacity ?? 1);


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
            className="matrix-till-slip-root"
            style={{
                width: themeReceiptWidth,
                padding: `${themeOuterPadding}px`,
                border: `${themeBorderWidth}px solid ${primaryColor}`,
                boxShadow: receiptGlow,
                background: backgroundColor,
                position: "relative",
                overflow: "hidden",
                boxSizing: "border-box",
                ...containerStyle
            }}
        >

            <style>{`
                @keyframes ruachInfiniteRotation {
                    from { transform: rotateY(0deg); }
                    to { transform: rotateY(360deg); }
                }
                @keyframes ruachFloat {
                    0%, 100% { transform: translate3d(0, 0, 0); }
                    50% { transform: translate3d(0, -${floatingEffect.amplitude || 7}px, 0); }
                }
                @keyframes ruachMetallicSweep {
                    0% { background-position: -220% 0; }
                    100% { background-position: 220% 0; }
                }
                @keyframes ruachHolographic {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
                @keyframes ruachGradient {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
                @keyframes ruachQrPulse {
                    0%, 100% { transform: scale(1); filter: drop-shadow(0 0 0 transparent); }
                    50% { transform: scale(1.035); filter: drop-shadow(0 0 10px ${resolveEffectColor(animatedQrEffect.glowColor, primaryColor)}66); }
                }
                @keyframes ruachQrScan {
                    0% { transform: translateY(-55px); opacity: 0; }
                    15% { opacity: .75; }
                    85% { opacity: .75; }
                    100% { transform: translateY(55px); opacity: 0; }
                }
                @keyframes ruachParticleDrift {
                    0% { transform: translate3d(0, 0, 0); opacity: 0; }
                    15% { opacity: var(--particle-opacity); }
                    85% { opacity: var(--particle-opacity); }
                    100% { transform: translate3d(var(--particle-x), var(--particle-y), 0); opacity: 0; }
                }
                @keyframes ruachNeonPulse {
                    0%, 100% { opacity: .72; }
                    50% { opacity: 1; }
                }
                .matrix-effect-target {
                    transition: all ${transitionDuration} ${transitionEasing};
                }
                .matrix-hover-target:hover {
                    transform: translate3d(0, ${hoverEffect.translateY ?? -3}px, 0) scale(${hoverEffect.scale || 1.025}) rotate(${hoverEffect.rotate || 0}deg);
                    filter: drop-shadow(0 10px 22px ${resolveEffectColor(hoverEffect.glowColor, primaryColor)}33);
                }
                .matrix-rotation-target {
                    animation: ruachInfiniteRotation ${rotationEffect.speed || "18s"} linear infinite;
                    animation-direction: ${rotationEffect.direction === "reverse" ? "reverse" : "normal"};
                    transform-style: preserve-3d;
                }
                .matrix-float-target {
                    animation: ruachFloat ${floatingEffect.duration || "4s"} ease-in-out infinite;
                    animation-delay: ${floatingEffect.delay || "0s"};
                }
                .matrix-metallic-target {
                    position: relative;
                    isolation: isolate;
                }
                .matrix-metallic-target::after {
                    content: "";
                    position: absolute;
                    inset: 0;
                    pointer-events: none;
                    background: linear-gradient(115deg, transparent 25%, rgba(255,255,255,${metallicEffect.intensity ?? .28}) 48%, transparent 68%);
                    background-size: 220% 100%;
                    animation: ruachMetallicSweep ${metallicEffect.speed || "3.5s"} linear infinite;
                    mix-blend-mode: screen;
                    border-radius: inherit;
                    z-index: 3;
                }
                .matrix-glass-target {
                    backdrop-filter: blur(${glassEffect.blur || "14px"}) saturate(${glassEffect.saturation || "140%"});
                    -webkit-backdrop-filter: blur(${glassEffect.blur || "14px"}) saturate(${glassEffect.saturation || "140%"});
                    background: rgba(255,255,255,${glassEffect.opacity ?? .08}) !important;
                    border-color: rgba(255,255,255,${glassEffect.borderOpacity ?? .18}) !important;
                }
                .matrix-neon-target {
                    animation: ${neonEffect.pulse === false ? "none" : "ruachNeonPulse 2.2s ease-in-out infinite"};
                    box-shadow: 0 0 ${neonEffect.radius || 24}px ${resolveEffectColor(neonEffect.color, primaryColor)}${Math.round((neonEffect.intensity ?? .55) * 99).toString(16).padStart(2, "0")};
                }
                .matrix-holographic-target {
                    background-image: linear-gradient(120deg, ${((holographicEffect.colors || [primaryColor, secondaryColor, "#FF4FD8"]).join(", "))}) !important;
                    background-size: 300% 300% !important;
                    animation: ruachHolographic ${holographicEffect.speed || "5s"} ease infinite;
                }
                .matrix-dynamic-gradient-target {
                    background-image: linear-gradient(${dynamicGradientEffect.angle || "135deg"}, ${((dynamicGradientEffect.colors || [primaryColor, secondaryColor]).join(", "))}) !important;
                    background-size: 240% 240% !important;
                    animation: ruachGradient ${dynamicGradientEffect.speed || "6s"} ease infinite;
                }
                .matrix-qr-animated {
                    animation: ${animatedQrEffect.pulse === false ? "none" : `ruachQrPulse ${animatedQrEffect.speed || "2.4s"} ease-in-out infinite`};
                }
                .matrix-qr-scanline {
                    position: absolute;
                    left: 8px;
                    right: 8px;
                    top: 50%;
                    height: 2px;
                    background: ${resolveEffectColor(animatedQrEffect.scanlineColor, primaryColor)};
                    box-shadow: 0 0 8px ${resolveEffectColor(animatedQrEffect.scanlineColor, primaryColor)};
                    animation: ruachQrScan ${animatedQrEffect.speed || "2.2s"} linear infinite;
                    pointer-events: none;
                    z-index: 4;
                }
                .matrix-premium-transition {
                    transition: all ${transitionDuration} ${transitionEasing};
                }
                @media print {
                    .matrix-rotation-target,
                    .matrix-float-target,
                    .matrix-metallic-target::after,
                    .matrix-neon-target,
                    .matrix-holographic-target,
                    .matrix-dynamic-gradient-target,
                    .matrix-qr-animated,
                    .matrix-qr-scanline,
                    .matrix-till-slip-root > div[aria-hidden="true"] {
                        animation: none !important;
                    }
                    .matrix-hover-target {
                        transform: none !important;
                    }
                }
            `}</style>

            {particlesEnabled && (
                <div
                    aria-hidden="true"
                    style={{
                        position: "absolute",
                        inset: 0,
                        overflow: "hidden",
                        pointerEvents: "none",
                        zIndex: 4
                    }}
                >
                    {Array.from({ length: Math.min(60, Math.max(1, Number(particleEffect.count) || 14)) }).map((_, index) => (
                        <span
                            key={`particle-${index}`}
                            style={{
                                position: "absolute",
                                left: `${(index * 37) % 100}%`,
                                top: `${(index * 61) % 100}%`,
                                width: `${particleEffect.size || 2}px`,
                                height: `${particleEffect.size || 2}px`,
                                borderRadius: "50%",
                                background: resolveEffectColor(particleEffect.color, primaryColor),
                                boxShadow: `0 0 8px ${resolveEffectColor(particleEffect.color, primaryColor)}`,
                                opacity: 0,
                                ["--particle-x"]: `${((index % 2 ? 1 : -1) * (20 + (index % 5) * 10))}px`,
                                ["--particle-y"]: `${-(20 + (index % 7) * 12)}px`,
                                ["--particle-opacity"]: particleEffect.opacity ?? 0.55,
                                animation: `ruachParticleDrift ${particleEffect.duration || "4s"} ease-in-out ${(index * .17).toFixed(2)}s infinite`
                            }}
                        />
                    ))}
                </div>
            )}

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
                className={[
                    "matrix-receipt-surface",
                    "matrix-effect-target",
                    (glassEnabled || themeGlassEnabled) ? "matrix-glass-target" : "",
                    (neonEnabled || themeNeonEnabled) ? "matrix-neon-target" : "",
                    (holographicEnabled || themeHolographicEnabled) ? "matrix-holographic-target" : "",
                    (dynamicGradientEnabled || themeDynamicGradientEnabled) ? "matrix-dynamic-gradient-target" : "",
                    (metallicEnabled || themeMetallicEnabled) ? "matrix-metallic-target" : ""
                ].filter(Boolean).join(" ")}
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
                    borderRadius: `${themeBorderRadius}px`,
                    padding: `${themeOuterPadding}px`,
                    boxShadow: receiptGlow,
                    fontFamily: '"Courier New", monospace',
                    position: "relative",
                    overflow: "hidden",
                    border: `${themeBorderWidth}px solid ${primaryColor}`
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
                            className={[
                                "matrix-effect-target",
                                (logoRotationEnabled || (rotationEnabled && (rotationEffect.target === "logo" || rotationEffect.target === "all"))) ? "matrix-rotation-target" : "",
                                (logoHoverEnabled || (hoverEnabled && (hoverEffect.target === "logo" || hoverEffect.target === "all"))) ? "matrix-hover-target" : "",
                                (logoFloatingEnabled || (floatingEnabled && (floatingEffect.target === "logo" || floatingEffect.target === "all"))) ? "matrix-float-target" : "",
                                logoMetallicEnabled ? "matrix-metallic-target" : "",
                                logoGlassEnabled ? "matrix-glass-target" : "",
                                logoNeonEnabled ? "matrix-neon-target" : "",
                                logoHolographicEnabled ? "matrix-holographic-target" : ""
                            ].filter(Boolean).join(" ")}
                            style={{
                                position: "absolute",
                                width: logoWidth,
                                height: logoHeight,
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
                                    className={[
                                        "matrix-merchant-logo",
                                        "matrix-effect-target",
                                        (logoRotationEnabled || (rotationEnabled && (rotationEffect.target === "logo" || rotationEffect.target === "all"))) ? "matrix-rotation-target" : "",
                                        (logoHoverEnabled || (hoverEnabled && (hoverEffect.target === "logo" || hoverEffect.target === "all"))) ? "matrix-hover-target" : "",
                                        (logoFloatingEnabled || (floatingEnabled && (floatingEffect.target === "logo" || floatingEffect.target === "all"))) ? "matrix-float-target" : "",
                                        logoMetallicEnabled ? "matrix-metallic-target" : "",
                                        logoGlassEnabled ? "matrix-glass-target" : "",
                                        logoNeonEnabled ? "matrix-neon-target" : "",
                                        logoHolographicEnabled ? "matrix-holographic-target" : ""
                                    ].filter(Boolean).join(" ")}
                                    style={{
                                        width: logoWidth,
                                        height: logoHeight,
                                        maxWidth: logoMaxWidth,
                                        maxHeight: logoMaxHeight,
                                        objectFit: logoConfig.objectFit || "contain",
                                        aspectRatio: logoConfig.aspectRatio || "auto",
                                        opacity: logoOpacity,
                                        borderRadius: logoLayout.borderRadius || logoConfig.borderRadius || undefined,
                                        padding: logoLayout.padding || logoConfig.padding || undefined,
                                        mixBlendMode: logoLayout.blendMode || logoConfig.blendMode || "normal",
                                        aspectRatio: logoLockAspectRatio ? (logoAspectRatio || "auto") : "auto",
                                        transform: `scale(${numericLogoScale}) rotate(${logoRotation}deg)`,
                                        transformOrigin: "center",
                                        filter: (() => {
                                            const mode = logoColors.mode || "original";
                                            const brightness = Number(logoColors.brightness ?? 1);
                                            const contrast = Number(logoColors.contrast ?? 1);
                                            const saturation = Number(logoColors.saturation ?? 1);
                                            const filters = [
                                                mode === "grayscale" || mode === "monochrome" ? "grayscale(1)" : "",
                                                mode === "tint" && logoColors.tintColor ? `drop-shadow(0 0 0 ${logoColors.tintColor})` : "",
                                                `brightness(${brightness})`,
                                                `contrast(${contrast})`,
                                                `saturate(${saturation})`
                                            ].filter(Boolean);
                                            return filters.length ? filters.join(" ") : undefined;
                                        })(),
                                        transition: `all ${transitionDuration} ${transitionEasing}`
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
                                ...bodyVisualStyle,
                                color:
                                    bodyText.color ||
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
                                    className={[
                                        "matrix-product-item",
                                        "matrix-effect-target",
                                        floatingEnabled && (floatingEffect.target === "products" || floatingEffect.target === "items" || floatingEffect.target === "all") ? "matrix-float-target" : "",
                                        hoverEnabled && (hoverEffect.target === "products" || hoverEffect.target === "items" || hoverEffect.target === "all") ? "matrix-hover-target" : ""
                                    ].filter(Boolean).join(" ")}
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
                                            ...bodyVisualStyle,
                                            maxWidth: "75%",
                                            color: bodyText.color || textColor
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
                                ...totalVisualStyle,
                                color:
                                    totalText.color ||
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
                                        totalText.effects?.neon?.enabled || totalText.effects?.glow?.enabled
                                            ? `0 0 10px ${primaryColor}88`
                                            : `0 0 10px ${primaryColor}26`
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
                                className={[
                                    "matrix-qr-container",
                                    "matrix-effect-target",
                                    (animatedQrEnabled || qrPulseEnabled) ? "matrix-qr-animated" : "",
                                    qrHolographicEnabled ? "matrix-holographic-target" : "",
                                    qrGlowEnabled ? "matrix-neon-target" : "",
                                    qrAnimatedBorderEnabled ? "matrix-neon-target" : "",
                                    hoverEnabled && (hoverEffect.target === "qr" || hoverEffect.target === "all") ? "matrix-hover-target" : ""
                                ].filter(Boolean).join(" ")}
                                style={{
                                    display: "inline-block",
                                    position: "relative",
                                    padding: "12px",
                                    background: qrBackground,
                                    borderRadius: `${qrCornerRadius}px`,
                                    border:
                                        `1px solid ${primaryColor}26`,
                                    boxShadow: `
                                        0 12px 25px rgba(0,0,0,0.35),
                                        0 0 20px ${primaryColor}26
                                    `,
                                    marginBottom: "5px"
                                }}
                            >

                                {(animatedQrEnabled || qrScanlineEnabled) && animatedQrEffect.scanline !== false && (
                                    <span className="matrix-qr-scanline" aria-hidden="true" />
                                )}

                                {qrCodeUrl ? (

                                    <img
                                        src={qrCodeUrl}
                                        alt="Voucher Token QR"
                                        style={{
                                            width: qrCodeSize,
                                            height: qrCodeSize,
                                            transform: `scale(${Number.isFinite(qrScale) ? qrScale : 1}) rotate(${qrRotation}deg)`,
                                            transformOrigin: "center",
                                            opacity: qrOpacity,
                                            display: "block",
                                            objectFit: "contain",
                                            filter: qrForeground !== "#050608" ? `drop-shadow(0 0 2px ${qrForeground})` : undefined
                                        }}
                                    />

                                ) : (

                                    <div
                                        style={{
                                            width: qrCodeSize,
                                            height: qrCodeSize,
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


