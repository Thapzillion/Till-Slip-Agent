import React, { useEffect, useState } from "react";

/**
 * MatrixTillSlip
 *
 * Matrix receipt renderer.
 *
 * IMPORTANT:
 * This component intentionally does NOT read or render the old global
 * Legacy animation configuration is intentionally ignored.
 *
 * The Editing Studio owns the configuration. MatrixTillSlip only consumes
 * the configuration required to render the receipt:
 *
 * System B — Properties
 *   - Crop
 *   - Zoom / Unzoom
 *   - Shape (Logo + QR only)
 *   - Chroma Key (Logo + QR)
 *
 * System D — Color Grading
 *   - Basic
 *   - Neon
 *   - Glow
 *   - Light
 *   - Sparkle
 *   - Gradient
 *   - Advanced
 *
 * Every editable receipt element can have its own configuration.
 *
 * Recommended designConfig shape:
 *
 * {
 *   logo: {
 *     layout: {
 *       scale: 1,
 *       zoom: 1,
 *       width: "120px",
 *       height: "120px",
 *       shape: "circle",
 *       crop: { top: 0, right: 0, bottom: 0, left: 0 },
 *       chromaKey: { enabled: false, color: "#ffffff", tolerance: 35 }
 *     },
 *     colors: { ... }
 *   },
 *   qrCode: {
 *     layout: {
 *       scale: 1,
 *       zoom: 1,
 *       shape: "rounded",
 *       cornerRadius: 18,
 *       crop: { top: 0, right: 0, bottom: 0, left: 0 },
 *       chromaKey: { enabled: false, color: "#ffffff", tolerance: 35 }
 *     },
 *     colors: { ... }
 *   },
 *   text: {
 *     businessName: { ... },
 *     address: { ... },
 *     email: { ... },
 *     items: { ... },
 *     vat: { ... },
 *     total: { ... }
 *   },
 *   colorGrading: {
 *     selectedElementId: "businessName",
 *     elements: {
 *       businessName: { ... },
 *       logo: { ... },
 *       qr: { ... }
 *     }
 *   },
 *   theme: {
 *     colors: {
 *       primary: "#08E3D8",
 *       secondary: "#00B8FF",
 *       background: "#041116",
 *       text: "#FFFFFF",
 *       mutedText: "#94A3B8"
 *     }
 *   }
 * }
 */

const clamp = (value, min, max) =>
    Math.min(max, Math.max(min, Number(value) || 0));

const hexToRgb = (hex) => {
    if (!hex) return null;

    const normalized = String(hex)
        .replace("#", "")
        .trim();

    if (![3, 6].includes(normalized.length)) return null;

    const value =
        normalized.length === 3
            ? normalized
                .split("")
                .map((char) => char + char)
                .join("")
            : normalized;

    const parsed = Number.parseInt(value, 16);

    if (Number.isNaN(parsed)) return null;

    return {
        r: (parsed >> 16) & 255,
        g: (parsed >> 8) & 255,
        b: parsed & 255
    };
};

const resolveColor = (value, fallback) => {
    if (!value) return fallback;
    return value;
};

const mergeObjects = (...objects) =>
    objects.reduce(
        (result, object) => ({
            ...result,
            ...(object && typeof object === "object" ? object : {})
        }),
        {}
    );

const getElementGrading = (config, id) => {
    const colorGrading = config?.colorGrading || {};
    const elements = colorGrading?.elements || {};
    const selectedId =
        colorGrading?.selectedElementId ||
        config?.selectedElementId;

    /*
     * The Color Grading studio can either:
     *
     * 1. store grading directly under elements[id], OR
     * 2. keep the currently selected element in selectedElementId and
     *    store the active grading controls directly under colorGrading.
     *
     * Supporting both makes the renderer tolerant of either Studio
     * implementation without changing the JSX receipt itself.
     */
    const selectedGrading =
        selectedId === id
            ? {
                basic: colorGrading?.basic,
                neon: colorGrading?.neon,
                glow: colorGrading?.glow,
                light: colorGrading?.light,
                sparkle: colorGrading?.sparkle,
                gradient: colorGrading?.gradient,
                advanced: colorGrading?.advanced
            }
            : {};

    return mergeObjects(
        colorGrading?.[id],
        elements?.[id],
        config?.elements?.[id]?.colorGrading,
        config?.elements?.[id]?.colors,
        selectedGrading
    );
};

const getElementConfig = (config, id, directConfig) =>
    mergeObjects(
        directConfig,
        config?.elements?.[id],
        {
            colors: getElementGrading(config, id)
        }
    );

const getCropInsets = (crop) => {
    if (!crop || typeof crop !== "object") {
        return {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0
        };
    }

    if (crop.enabled === false) {
        return {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0
        };
    }

    return {
        top: clamp(crop.top, 0, 49),
        right: clamp(crop.right, 0, 49),
        bottom: clamp(crop.bottom, 0, 49),
        left: clamp(crop.left, 0, 49)
    };
};

const shapeStyle = (shape, cornerRadius = 18) => {
    switch (String(shape || "original").toLowerCase()) {
        case "circle":
            return {
                borderRadius: "50%"
            };

        case "square":
            return {
                borderRadius: "0"
            };

        case "rounded":
            return {
                borderRadius: `${cornerRadius}px`
            };

        case "hexagon":
            return {
                clipPath:
                    "polygon(25% 6%, 75% 6%, 100% 50%, 75% 94%, 25% 94%, 0 50%)"
            };

        case "diamond":
            return {
                clipPath:
                    "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)"
            };

        case "octagon":
            return {
                clipPath:
                    "polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)"
            };

        default:
            return {
                borderRadius: `${cornerRadius}px`
            };
    }
};

const buildGradingFilter = (grading = {}) => {
    const basic = grading?.basic || grading || {};
    const advanced = grading?.advanced || {};

    const exposure = Number(basic.exposure ?? 0);
    const contrast = Number(basic.contrast ?? 0);
    const saturation = Number(basic.saturation ?? 0);
    const vibrance = Number(basic.vibrance ?? 0);
    const hueShift = Number(advanced.hueShift ?? 0);

    const brightness = clamp(1 + exposure / 100, 0.15, 3);
    const contrastValue = clamp(1 + contrast / 100, 0.1, 3);
    const saturationValue = clamp(
        1 + (saturation + vibrance * 0.35) / 100,
        0,
        3
    );

    const filters = [
        `brightness(${brightness})`,
        `contrast(${contrastValue})`,
        `saturate(${saturationValue})`
    ];

    if (hueShift) {
        filters.push(`hue-rotate(${hueShift}deg)`);
    }

    if (Number(advanced.blur) > 0) {
        filters.push(`blur(${Number(advanced.blur)}px)`);
    }

    return filters.join(" ");
};

const buildGradingStyle = (
    grading = {},
    fallbackColor = "#08E3D8",
    isText = false
) => {
    const basic = grading?.basic || grading || {};
    const neon = grading?.neon || {};
    const glow = grading?.glow || {};
    const light = grading?.light || {};
    const sparkle = grading?.sparkle || {};
    const gradient = grading?.gradient || {};
    const advanced = grading?.advanced || {};

    const primary =
        neon.color ||
        gradient.startColor ||
        fallbackColor;

    const shadows = [];

    if (Number(neon.intensity ?? 0) > 0 || neon.enabled === true) {
        const intensity = clamp(Number(neon.intensity ?? 60), 0, 100);
        const spread = clamp(Number(neon.spread ?? 40), 1, 120);

        shadows.push(
            `0 0 ${Math.round(spread * 0.25)}px ${primary}`,
            `0 0 ${Math.round(spread * 0.65)}px ${primary}${Math.round(
                intensity * 0.55
            )
                .toString(16)
                .padStart(2, "0")}`,
            `0 0 ${spread}px ${primary}${Math.round(
                intensity * 0.28
            )
                .toString(16)
                .padStart(2, "0")}`
        );
    }

    if (Number(glow.intensity ?? 0) > 0 || glow.enabled === true) {
        const intensity = clamp(Number(glow.intensity ?? 60), 0, 100);
        const radius = clamp(Number(glow.radius ?? 30), 1, 150);

        shadows.push(
            `0 0 ${radius}px ${primary}${Math.round(
                intensity * 0.5
            )
                .toString(16)
                .padStart(2, "0")}`
        );
    }

    if (light.enabled === true || Number(light.intensity ?? 0) > 0) {
        const intensity = clamp(Number(light.intensity ?? 30), 0, 100);

        shadows.push(
            `0 0 ${Math.max(4, Math.round(intensity / 3))}px rgba(255,255,255,${(
                intensity / 200
            ).toFixed(2)})`
        );
    }

    if (advanced.sharpen) {
        shadows.push(
            `0 0 ${clamp(Number(advanced.sharpen), 0, 20)}px rgba(255,255,255,0.08)`
        );
    }

    const style = {
        filter: buildGradingFilter(grading, fallbackColor),
        textShadow: isText && shadows.length
            ? shadows.join(", ")
            : undefined,
        boxShadow: !isText && shadows.length
            ? shadows.join(", ")
            : undefined
    };

    if (gradient.enabled === true) {
        const startColor = gradient.startColor || fallbackColor;
        const endColor = gradient.endColor || "#00B8FF";
        const angle = gradient.startAngle ?? gradient.angle ?? 90;
        const opacity = clamp(
            Number(gradient.opacity ?? 100) / 100,
            0,
            1
        );

        style.backgroundImage =
            `linear-gradient(${angle}deg, ${startColor}, ${endColor})`;
        style.backgroundBlendMode = "screen";
        style.opacity = opacity;

        if (isText) {
            style.color = "transparent";
            style.WebkitBackgroundClip = "text";
            style.WebkitTextFillColor = "transparent";
            style.backgroundClip = "text";
        }
    }

    if (Number(basic.highlights ?? 0) !== 0) {
        style.textShadow = [
            style.textShadow,
            `0 0 ${Math.abs(Number(basic.highlights)) / 2}px rgba(255,255,255,${Math.abs(
                Number(basic.highlights)
            ) / 500})`
        ]
            .filter(Boolean)
            .join(", ");
    }

    if (sparkle.enabled === true) {
        style["--ruach-sparkle-color"] =
            sparkle.color || primary;
    }

    return style;
};

const SparkleOverlay = ({
    grading = {},
    color = "#08E3D8"
}) => {
    const sparkle = grading?.sparkle || {};

    if (
        sparkle.enabled !== true &&
        Number(sparkle.intensity ?? 0) <= 0
    ) {
        return null;
    }

    const density = clamp(
        Number(sparkle.density ?? 20),
        1,
        6
    );

    const count = Math.round(density);

    return (
        <span
            aria-hidden="true"
            style={{
                position: "absolute",
                inset: 0,
                pointerEvents: "none",
                overflow: "hidden",
                borderRadius: "inherit",
                zIndex: 3
            }}
        >
            {Array.from({ length: count }).map((_, index) => (
                <span
                    key={`sparkle-${index}`}
                    style={{
                        position: "absolute",
                        left: `${15 + index * (70 / Math.max(1, count - 1))}%`,
                        top: `${20 + ((index * 29) % 60)}%`,
                        width: `${Math.max(
                            2,
                            Number(sparkle.size ?? 4)
                        )}px`,
                        height: `${Math.max(
                            2,
                            Number(sparkle.size ?? 4)
                        )}px`,
                        borderRadius: "50%",
                        background:
                            sparkle.color ||
                            color,
                        boxShadow: `0 0 8px ${sparkle.color || color
                            }, 0 0 16px ${sparkle.color || color
                            }`,
                        opacity: clamp(
                            Number(sparkle.intensity ?? 40) / 100,
                            0.1,
                            1
                        )
                    }}
                />
            ))}
        </span>
    );
};

const useChromaKeySource = (source, chromaKey) => {
    const [processedSource, setProcessedSource] = useState(source || "");

    useEffect(() => {
        let cancelled = false;

        if (
            !source ||
            !chromaKey?.enabled ||
            !chromaKey?.color
        ) {
            setProcessedSource(source || "");
            return undefined;
        }

        const target = hexToRgb(chromaKey.color);

        if (!target) {
            setProcessedSource(source || "");
            return undefined;
        }

        const image = new Image();
        image.crossOrigin = "anonymous";

        image.onload = () => {
            try {
                const canvas = document.createElement("canvas");
                canvas.width = image.naturalWidth || image.width;
                canvas.height = image.naturalHeight || image.height;

                const context = canvas.getContext("2d", {
                    willReadFrequently: true
                });

                if (!context) {
                    setProcessedSource(source);
                    return;
                }

                context.drawImage(
                    image,
                    0,
                    0,
                    canvas.width,
                    canvas.height
                );

                const imageData = context.getImageData(
                    0,
                    0,
                    canvas.width,
                    canvas.height
                );

                const pixels = imageData.data;
                const tolerance = clamp(
                    Number(chromaKey.tolerance ?? 35),
                    1,
                    255
                );

                for (let index = 0; index < pixels.length; index += 4) {
                    const red = pixels[index];
                    const green = pixels[index + 1];
                    const blue = pixels[index + 2];

                    const distance = Math.sqrt(
                        (red - target.r) ** 2 +
                        (green - target.g) ** 2 +
                        (blue - target.b) ** 2
                    );

                    if (distance <= tolerance) {
                        pixels[index + 3] = 0;
                    } else if (
                        distance <= tolerance * 1.5
                    ) {
                        const feather =
                            (distance - tolerance) /
                            (tolerance * 0.5);

                        pixels[index + 3] = Math.round(
                            255 * feather
                        );
                    }
                }

                context.putImageData(
                    imageData,
                    0,
                    0
                );

                if (!cancelled) {
                    setProcessedSource(
                        canvas.toDataURL("image/png")
                    );
                }
            } catch (error) {
                console.warn(
                    "MatrixTillSlip chroma key could not process the image:",
                    error
                );

                if (!cancelled) {
                    setProcessedSource(source);
                }
            }
        };

        image.onerror = () => {
            if (!cancelled) {
                setProcessedSource(source);
            }
        };

        image.src = source;

        return () => {
            cancelled = true;
        };
    }, [
        source,
        chromaKey?.enabled,
        chromaKey?.color,
        chromaKey?.tolerance
    ]);

    return processedSource;
};

const ElementFrame = ({
    id,
    selectedElementId,
    onSelectElement,
    children,
    style = {},
    className = "",
    editStyle = {},
    ...props
}) => {
    const selected = selectedElementId === id;

    const selectElement = (event) => {
        event.stopPropagation();
        if (event.nativeEvent?.stopImmediatePropagation) {
            event.nativeEvent.stopImmediatePropagation();
        }
        onSelectElement?.(id);
    };

    return (
        <div
            {...props}
            data-receipt-element={id}
            className={className}
            onPointerDownCapture={selectElement}
            onPointerDown={selectElement}
            onClick={(event) => {
                event.stopPropagation();
                onSelectElement?.(id);
            }}
            style={{
                position: "relative",
                outline: selected
                    ? "1px solid rgba(0,240,255,0.95)"
                    : "none",
                outlineOffset: selected ? "4px" : "0",
                boxShadow: selected
                    ? "0 0 0 1px rgba(0,240,255,0.2), 0 0 18px rgba(0,240,255,0.22)"
                    : style.boxShadow,
                cursor: "pointer",
                touchAction: "manipulation",
                userSelect: "none",
                WebkitUserSelect: "none",
                pointerEvents: "auto",
                ...editStyle,
                ...style
            }}
        >
            {children}
        </div>
    );
};

export default function MatrixTillSlip({
    receiptData = {},
    settings = {},
    user = null,
    activeCurrencySymbol = "",
    designConfig = {},
    voucher = null,
    isExpired = false,
    daysRemaining = 0,
    qrCodeUrl = "",
    checkoutPayloadLink = "",
    receiptId = null,
    onDownload,
    onSelectElement,
    selectedElementId: selectedElementIdProp = null,
    style: containerStyle = {}
}) {
    const config = designConfig || {};

    /*
     * System B configuration.
     * No position configuration is consumed here.
     */
    const logoConfig = config.logo || {};
    const logoLayout = logoConfig.layout || {};
    const qrConfig = config.qrCode || {};
    const qrLayout = qrConfig.layout || {};

    /*
     * System D configuration.
     * Grading is resolved per receipt element.
     */
    const logoGrading = mergeObjects(
        logoConfig.colors,
        getElementGrading(config, "logo")
    );

    const qrGrading = mergeObjects(
        qrConfig.colors,
        getElementGrading(config, "qrCode"),
        getElementGrading(config, "qr")
    );

    const businessNameConfig = getElementConfig(
        config,
        "businessName",
        config.text?.businessName ||
        config.text?.heading
    );

    const addressConfig = getElementConfig(
        config,
        "address",
        config.text?.address ||
        config.text?.body
    );

    const emailConfig = getElementConfig(
        config,
        "email",
        config.text?.email ||
        config.text?.body
    );

    const itemsConfig = getElementConfig(
        config,
        "items",
        config.text?.items ||
        config.text?.body
    );

    const vatConfig = getElementConfig(
        config,
        "vat",
        config.text?.vat ||
        config.text?.body
    );

    const totalConfig = getElementConfig(
        config,
        "total",
        config.text?.total
    );

    const voucherConfig = getElementConfig(
        config,
        "voucher",
        config.sections?.voucher
    );

    const dividerConfig = getElementConfig(
        config,
        "divider",
        config.sections?.divider
    );

    const themeColors = config.theme?.colors || {};

    const primaryColor =
        themeColors.primary ||
        config.colors?.primary ||
        "#08E3D8";

    const secondaryColor =
        themeColors.secondary ||
        config.colors?.secondary ||
        "#00B8FF";

    const backgroundColor =
        themeColors.background ||
        config.colors?.background ||
        "linear-gradient(180deg, #061017 0%, #03080D 100%)";

    const surfaceColor =
        themeColors.surface ||
        "#07181E";

    const textColor =
        themeColors.text ||
        config.colors?.text ||
        "#FFFFFF";

    const mutedTextColor =
        themeColors.mutedText ||
        config.colors?.mutedText ||
        "#94A3B8";

    /*
     * Only receipt layout values needed for the actual receipt shell.
     * No element-position editor is read here.
     */
    const themeLayout = config.theme?.layout || {};

    const receiptPadding =
        Number(themeLayout.outerPadding ?? 12);

    const receiptBorderWidth =
        Number(themeLayout.borderWidth ?? 2);

    const receiptBorderRadius =
        Number(themeLayout.borderRadius ?? 24);

    const sectionSpacing =
        Number(themeLayout.sectionSpacing ?? 12);

    const receiptWidth =
        themeLayout.width || "100%";

    const receiptDataItems = Array.isArray(
        receiptData?.items
    )
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

    const transactionDate =
        receiptData?.created_at
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

    const selectedElementId =
        selectedElementIdProp ||
        config?.colorGrading?.selectedElementId ||
        config?.selectedElementId ||
        null;

    /*
     * System B — generic element editing.
     *
     * Logo and QR have their own image-stage rendering below, so their
     * zoom/crop values are handled by logoLayout / qrLayout. Every other
     * receipt element receives its zoom and crop here through ElementFrame.
     */
    const getGenericElementEditStyle = (id) => {
        if (id === "logo" || id === "qr" || id === "qrCode") {
            return {};
        }

        const directLayout = config?.[id]?.layout || {};
        const elementLayout = config?.elements?.[id]?.layout || {};
        const layout = mergeObjects(directLayout, elementLayout);

        const zoom = clamp(
            Number(layout.zoom ?? layout.scale ?? 1),
            0.1,
            10
        );

        const crop = getCropInsets(layout.crop);
        const hasCrop =
            crop.top ||
            crop.right ||
            crop.bottom ||
            crop.left;

        return {
            transform: zoom !== 1
                ? `scale(${zoom})`
                : undefined,
            transformOrigin: "center center",
            clipPath: hasCrop
                ? `inset(${crop.top}% ${crop.right}% ${crop.bottom}% ${crop.left}%)`
                : undefined,
            overflow: hasCrop
                ? "hidden"
                : undefined
        };
    };

    /*
     * Logo properties.
     */
    const logoScale = clamp(
        Number(logoLayout.scale ?? 1),
        0.1,
        10
    );

    const logoZoom = clamp(
        Number(logoLayout.zoom ?? 1),
        0.1,
        10
    );

    const logoWidth =
        logoLayout.width ||
        `${Math.round(150 * logoScale)}px`;

    const logoHeight =
        logoLayout.height ||
        `${Math.round(150 * logoScale)}px`;

    const logoOpacity = clamp(
        Number(logoLayout.opacity ?? 1),
        0,
        1
    );

    const logoCrop =
        getCropInsets(logoLayout.crop);

    const logoShape =
        logoLayout.shape ||
        logoConfig.shape ||
        "rounded";

    const logoChromaKey =
        logoLayout.chromaKey ||
        logoConfig.chromaKey ||
        {};

    /*
     * QR properties.
     */
    const qrBaseSize =
        Number(qrLayout.size ?? qrConfig.size ?? 96);

    const qrScale = clamp(
        Number(qrLayout.scale ?? 1),
        0.1,
        10
    );

    const qrZoom = clamp(
        Number(qrLayout.zoom ?? 1),
        0.1,
        10
    );

    const qrOpacity = clamp(
        Number(qrLayout.opacity ?? qrConfig.opacity ?? 1),
        0,
        1
    );

    const qrCrop =
        getCropInsets(qrLayout.crop);

    const qrShape =
        qrLayout.shape ||
        qrConfig.shape ||
        "rounded";

    const qrCornerRadius =
        Number(
            qrLayout.cornerRadius ??
            qrConfig.cornerRadius ??
            18
        );

    const qrChromaKey =
        qrLayout.chromaKey ||
        qrConfig.chromaKey ||
        {};

    const logoSource =
        useChromaKeySource(
            settings?.logo_url || "",
            logoChromaKey
        );

    const qrSource =
        useChromaKeySource(
            qrCodeUrl || "",
            qrChromaKey
        );

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

    const showWatermark =
        config.receipt?.showWatermark !== false;

    const showVoucher =
        config.receipt?.showVoucher !== false;

    const showDownloadButton =
        config.receipt?.showDownloadButton !== false;

    const businessNameStyle = buildGradingStyle(
        businessNameConfig.colors || {},
        primaryColor,
        true
    );

    const addressStyle = buildGradingStyle(
        addressConfig.colors || {},
        primaryColor,
        true
    );

    const emailStyle = buildGradingStyle(
        emailConfig.colors || {},
        primaryColor,
        true
    );

    const itemsStyle = buildGradingStyle(
        itemsConfig.colors || {},
        primaryColor,
        true
    );

    const vatStyle = buildGradingStyle(
        vatConfig.colors || {},
        primaryColor,
        true
    );

    const totalStyle = buildGradingStyle(
        totalConfig.colors || {},
        primaryColor,
        true
    );

    const logoStyle = buildGradingStyle(
        logoGrading,
        primaryColor,
        false
    );

    const qrStyle = buildGradingStyle(
        qrGrading,
        primaryColor,
        false
    );

    const logoImageCropStyle = {
        ...shapeStyle(
            logoShape,
            Number(logoLayout.cornerRadius ?? 18)
        ),
        width: logoWidth,
        height: logoHeight,
        objectFit:
            logoLayout.objectFit || "contain",
        opacity: logoOpacity,
        transform:
            `scale(${logoScale * logoZoom})`,
        transformOrigin: "center",
        filter: logoStyle.filter,
        boxShadow: logoStyle.boxShadow
    };

    const qrImageCropStyle = {
        ...shapeStyle(
            qrShape,
            qrCornerRadius
        ),
        width: `${qrBaseSize}px`,
        height: `${qrBaseSize}px`,
        objectFit: "contain",
        opacity: qrOpacity,
        transform:
            `scale(${qrScale * qrZoom})`,
        transformOrigin: "center",
        filter: qrStyle.filter,
        boxShadow: qrStyle.boxShadow
    };

    const cropContainerStyle = (crop) => ({
        position: "relative",
        overflow: "hidden",
        clipPath:
            crop.top ||
                crop.right ||
                crop.bottom ||
                crop.left
                ? `inset(${crop.top}% ${crop.right}% ${crop.bottom}% ${crop.left}%)`
                : undefined
    });

    const clickable = (id) => ({
        id,
        selectedElementId,
        onSelectElement,
        editStyle: getGenericElementEditStyle(id)
    });

    return (
        <div
            id="till-slip-capture"
            className="matrix-till-slip-root"
            data-receipt-element="background"
            onPointerDown={(event) => {
                event.stopPropagation();
                onSelectElement?.("background");
            }}
            style={{
                width: receiptWidth,
                padding: `${receiptPadding}px`,
                border:
                    `${receiptBorderWidth}px solid ${primaryColor}`,
                borderRadius:
                    `${receiptBorderRadius}px`,
                background:
                    backgroundColor,
                color: textColor,
                boxSizing: "border-box",
                position: "relative",
                overflow: "hidden",
                boxShadow:
                    `0 0 10px ${primaryColor}66,
                     0 0 30px ${primaryColor}22,
                     0 25px 60px rgba(0,0,0,0.65)`,
                ...containerStyle
            }}
        >
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
                    background-size: 24px 24px;
                    border:
                        1px solid ${primaryColor}55;
                    border-radius:
                        ${Math.max(8, receiptBorderRadius - 6)}px;
                    color: ${textColor};
                    padding: ${receiptPadding}px;
                    font-family:
                        "Courier New",
                        Courier,
                        monospace;
                    position: relative;
                    overflow: hidden;
                }

                .matrix-receipt-divider {
                    height: 1px;
                    width: 100%;
                    margin-bottom: ${sectionSpacing}px;
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
                    padding: 7px 0;
                    border-bottom:
                        1px dashed rgba(255,255,255,0.10);
                }

                .matrix-receipt-selected {
                    outline:
                        1px solid rgba(0,240,255,0.95);
                    outline-offset: 4px;
                    box-shadow:
                        0 0 0 1px rgba(0,240,255,0.18),
                        0 0 18px rgba(0,240,255,0.20);
                }

                .matrix-receipt-total {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    gap: 12px;
                    margin-top: ${sectionSpacing}px;
                    padding: 14px;
                    border:
                        2px solid ${primaryColor};
                    border-radius: 16px;
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
                    background: rgba(255,255,255,0.035);
                }

                .matrix-receipt-qr-stage {
                    padding: 12px;
                    background: #FFFFFF;
                }

                .matrix-receipt-sparkle {
                    pointer-events: none;
                }

                @media print {
                    .matrix-receipt-selected {
                        outline: none !important;
                        box-shadow: none !important;
                    }
                }
            `}</style>

            <div
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
                    filter: "blur(12px)",
                    pointerEvents: "none"
                }}
                aria-hidden="true"
            />

            <div
                className="matrix-receipt-surface"
                data-receipt-element="surface"
                onPointerDown={(event) => {
                    event.stopPropagation();
                    onSelectElement?.("surface");
                }}
            >
                {logoSource &&
                    logoConfig.enabled !== false &&
                    showWatermark && (
                        <div
                            aria-hidden="true"
                            style={{
                                position: "absolute",
                                inset: 0,
                                pointerEvents: "none",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                opacity:
                                    logoConfig.watermarkOpacity ??
                                    0.035,
                                zIndex: 0
                            }}
                        >
                            <img
                                src={logoSource}
                                alt=""
                                style={{
                                    width: logoWidth,
                                    height: logoHeight,
                                    objectFit: "contain",
                                    ...shapeStyle(
                                        logoShape,
                                        18
                                    ),
                                    filter:
                                        logoStyle.filter
                                }}
                            />
                        </div>
                    )}

                <div
                    style={{
                        position: "relative",
                        zIndex: 2
                    }}
                >
                    {/* TOP METADATA */}

                    <div
                        style={{
                            display: "flex",
                            justifyContent:
                                "space-between",
                            alignItems: "flex-start",
                            gap: 12,
                            fontSize: 10,
                            color: mutedTextColor,
                            marginBottom: sectionSpacing
                        }}
                    >
                        <div
                            style={{
                                padding: "3px 7px",
                                borderRadius: 999,
                                background:
                                    `${primaryColor}1C`,
                                border:
                                    `1px solid ${primaryColor}`,
                                color: primaryColor,
                                fontWeight: 900,
                                letterSpacing: "0.6px"
                            }}
                        >
                            VERIFIED NODE
                        </div>

                        <div
                            style={{
                                textAlign: "right",
                                lineHeight: 1.5
                            }}
                        >
                            <div
                                style={{
                                    fontWeight: 900,
                                    color: "#C5CCDA",
                                    textTransform:
                                        "uppercase"
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
                                        marginTop: 3,
                                        fontSize: 8,
                                        opacity: 0.6
                                    }}
                                >
                                    #{String(
                                        receiptId
                                    ).slice(0, 8)}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* LOGO */}

                    <ElementFrame
                        {...clickable("logo")}
                        style={{
                            display: "flex",
                            justifyContent:
                                "center",
                            alignItems: "center",
                            marginBottom:
                                sectionSpacing
                        }}
                    >
                        {logoSource &&
                            logoConfig.enabled !== false ? (
                            <div
                                className="matrix-receipt-logo-stage"
                                style={{
                                    width:
                                        logoWidth,
                                    height:
                                        logoHeight,
                                    ...shapeStyle(
                                        logoShape,
                                        Number(
                                            logoLayout.cornerRadius ??
                                            18
                                        )
                                    )
                                }}
                            >
                                <div
                                    style={{
                                        ...cropContainerStyle(
                                            logoCrop
                                        ),
                                        width: "100%",
                                        height: "100%"
                                    }}
                                >
                                    <img
                                        src={logoSource}
                                        alt="Merchant Logo"
                                        style={{
                                            ...logoImageCropStyle,
                                            width: "100%",
                                            height: "100%"
                                        }}
                                    />
                                </div>

                                <SparkleOverlay
                                    grading={
                                        logoGrading
                                    }
                                    color={
                                        primaryColor
                                    }
                                />
                            </div>
                        ) : (
                            <div
                                style={{
                                    padding: 12,
                                    color:
                                        mutedTextColor,
                                    border:
                                        `1px dashed ${mutedTextColor}`,
                                    borderRadius: 12,
                                    fontSize: 10
                                }}
                            >
                                NO LOGO RECORDED
                            </div>
                        )}
                    </ElementFrame>

                    {/* BUSINESS NAME */}

                    <ElementFrame
                        {...clickable(
                            "businessName"
                        )}
                        style={{
                            textAlign: "center",
                            marginBottom:
                                sectionSpacing,
                            ...buildGradingStyle(
                                businessNameConfig.colors ||
                                {},
                                primaryColor,
                                true
                            )
                        }}
                    >
                        <strong
                            style={{
                                display: "block",
                                fontSize:
                                    businessNameConfig.fontSize
                                        ? `${businessNameConfig.fontSize}px`
                                        : "18px",
                                fontWeight:
                                    businessNameConfig.fontWeight ||
                                    900,
                                letterSpacing:
                                    businessNameConfig.letterSpacing !==
                                        undefined
                                        ? `${businessNameConfig.letterSpacing}px`
                                        : "1px",
                                color:
                                    businessNameConfig.colors?.textColor ||
                                    textColor,
                                textTransform:
                                    "uppercase",
                                ...businessNameStyle
                            }}
                        >
                            {settings?.business_name ||
                                "MY BUSINESS BRAND"}
                        </strong>

                        <div
                            style={{
                                width: 70,
                                height: 2,
                                margin: "9px auto",
                                borderRadius: 999,
                                background:
                                    `linear-gradient(
                                        90deg,
                                        ${primaryColor},
                                        ${secondaryColor}
                                    )`
                            }}
                        />

                        <ElementFrame
                            {...clickable("address")}
                            style={{
                                ...addressStyle,
                                color:
                                    addressConfig.colors?.textColor ||
                                    mutedTextColor,
                                fontSize:
                                    addressConfig.fontSize
                                        ? `${addressConfig.fontSize}px`
                                        : 11,
                                fontWeight:
                                    addressConfig.fontWeight ||
                                    700,
                                letterSpacing:
                                    addressConfig.letterSpacing !==
                                        undefined
                                        ? `${addressConfig.letterSpacing}px`
                                        : undefined,
                                whiteSpace:
                                    "pre-wrap",
                                lineHeight: 1.6
                            }}
                        >
                            {settings?.store_address ||
                                "Outlet Physical Address Street\nKrugersdorp, South Africa"}
                        </ElementFrame>

                        <ElementFrame
                            {...clickable("email")}
                            style={{
                                ...emailStyle,
                                marginTop: 6,
                                color:
                                    emailConfig.colors?.textColor ||
                                    mutedTextColor,
                                fontSize:
                                    emailConfig.fontSize
                                        ? `${emailConfig.fontSize}px`
                                        : 10
                            }}
                        >
                            {user?.email ||
                                receiptData?.customer_email ||
                                "info@merchantnode.com"}
                        </ElementFrame>
                    </ElementFrame>

                    {/* DIVIDER */}

                    <ElementFrame
                        {...clickable("divider")}
                        style={{
                            marginBottom:
                                sectionSpacing
                        }}
                    >
                        <div
                            className="matrix-receipt-divider"
                            style={{
                                marginBottom: 0,
                                opacity:
                                    dividerConfig.colors?.opacity ??
                                    1,
                                ...buildGradingStyle(
                                    dividerConfig.colors ||
                                    {},
                                    primaryColor,
                                    false
                                )
                            }}
                        />
                    </ElementFrame>

                    {/* ITEMS */}

                    <ElementFrame
                        {...clickable("items")}
                        style={{
                            marginBottom:
                                sectionSpacing,
                            ...buildGradingStyle(
                                itemsConfig.colors ||
                                {},
                                primaryColor,
                                false
                            )
                        }}
                    >
                        <div
                            style={{
                                fontSize: 10,
                                textTransform:
                                    "uppercase",
                                letterSpacing: 1,
                                marginBottom: 6,
                                color:
                                    itemsConfig.colors?.headingColor ||
                                    primaryColor,
                                fontWeight: 900
                            }}
                        >
                            Items Purchased
                        </div>

                        {receiptDataItems.length >
                            0 ? (
                            receiptDataItems.map(
                                (
                                    item,
                                    index
                                ) => {
                                    const itemId =
                                        `item:${index}`;

                                    const itemConfig =
                                        getElementConfig(
                                            config,
                                            itemId,
                                            config.text?.item
                                        );

                                    const itemGrading =
                                        mergeObjects(
                                            itemsConfig.colors,
                                            itemConfig.colors,
                                            getElementGrading(
                                                config,
                                                itemId
                                            )
                                        );

                                    return (
                                        <ElementFrame
                                            key={
                                                item?.id ??
                                                index
                                            }
                                            {...clickable(
                                                itemId
                                            )}
                                            className="matrix-receipt-item"
                                            style={{
                                                ...buildGradingStyle(
                                                    itemGrading,
                                                    primaryColor,
                                                    false
                                                )
                                            }}
                                        >
                                            <span
                                                style={{
                                                    maxWidth:
                                                        "75%",
                                                    color:
                                                        itemGrading.textColor ||
                                                        textColor,
                                                    fontSize:
                                                        itemConfig.fontSize
                                                            ? `${itemConfig.fontSize}px`
                                                            : 11,
                                                    fontWeight:
                                                        itemConfig.fontWeight ||
                                                        700
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
                                                        itemGrading.priceColor ||
                                                        "#BFC1C8",
                                                    fontWeight:
                                                        900
                                                }}
                                            >
                                                {item?.price ??
                                                    ""}
                                            </span>

                                            <SparkleOverlay
                                                grading={
                                                    itemGrading
                                                }
                                                color={
                                                    primaryColor
                                                }
                                            />
                                        </ElementFrame>
                                    );
                                }
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
                                    fontSize: 10
                                }}
                            >
                                No transaction items
                                recorded.
                            </div>
                        )}

                        {/* VAT */}

                        {vat !== null &&
                            vat !== undefined && (
                                <ElementFrame
                                    {...clickable(
                                        "vat"
                                    )}
                                    style={{
                                        display:
                                            "flex",
                                        justifyContent:
                                            "space-between",
                                        marginTop: 8,
                                        padding:
                                            "8px 0",
                                        color:
                                            vatConfig.colors?.textColor ||
                                            mutedTextColor,
                                        fontSize:
                                            vatConfig.fontSize
                                                ? `${vatConfig.fontSize}px`
                                                : 11,
                                        ...vatStyle
                                    }}
                                >
                                    <span>
                                        VAT
                                    </span>
                                    <span>
                                        {vat}
                                    </span>
                                </ElementFrame>
                            )}
                    </ElementFrame>

                    {/* TOTAL */}

                    <ElementFrame
                        {...clickable("total")}
                        className="matrix-receipt-total"
                        style={{
                            ...totalStyle,
                            color:
                                totalConfig.colors?.textColor ||
                                "#B1B5C6",
                            fontSize:
                                totalConfig.fontSize
                                    ? `${totalConfig.fontSize}px`
                                    : 14,
                            fontWeight:
                                totalConfig.fontWeight ||
                                900
                        }}
                    >
                        <span>
                            TOTAL DUE
                        </span>

                        <span
                            style={{
                                color:
                                    totalConfig.colors?.valueColor ||
                                    primaryColor
                            }}
                        >
                            {total}
                        </span>

                        <SparkleOverlay
                            grading={
                                totalConfig.colors ||
                                {}
                            }
                            color={
                                primaryColor
                            }
                        />
                    </ElementFrame>

                    {/* VOUCHER + QR */}

                    {showVoucher && (
                        <ElementFrame
                            {...clickable(
                                "voucher"
                            )}
                            style={{
                                marginTop:
                                    sectionSpacing,
                                padding: 12,
                                border:
                                    `2px solid ${primaryColor}`,
                                borderRadius: 20,
                                background:
                                    "rgba(10,20,28,0.68)",
                                textAlign:
                                    "center",
                                ...buildGradingStyle(
                                    voucherConfig.colors ||
                                    {},
                                    primaryColor,
                                    false
                                )
                            }}
                        >
                            <div
                                style={{
                                    fontSize: 9,
                                    color:
                                        primaryColor,
                                    fontWeight:
                                        900,
                                    letterSpacing:
                                        1,
                                    marginBottom: 7
                                }}
                            >
                                NEXT VISIT VOUCHER
                            </div>

                            {/* QR */}

                            <ElementFrame
                                {...clickable(
                                    "qrCode"
                                )}
                                style={{
                                    display:
                                        "inline-flex",
                                    alignItems:
                                        "center",
                                    justifyContent:
                                        "center",
                                    marginBottom:
                                        7,
                                    ...qrStyle
                                }}
                            >
                                <div
                                    className="matrix-receipt-qr-stage"
                                    style={{
                                        width:
                                            `${qrBaseSize}px`,
                                        height:
                                            `${qrBaseSize}px`,
                                        ...shapeStyle(
                                            qrShape,
                                            qrCornerRadius
                                        )
                                    }}
                                >
                                    <div
                                        style={{
                                            ...cropContainerStyle(
                                                qrCrop
                                            ),
                                            width: "100%",
                                            height: "100%"
                                        }}
                                    >
                                        {qrSource ? (
                                            <img
                                                src={
                                                    qrSource
                                                }
                                                alt="Voucher QR Code"
                                                style={{
                                                    ...qrImageCropStyle,
                                                    width: "100%",
                                                    height: "100%"
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
                                                        "center"
                                                }}
                                            >
                                                QR
                                                <br />
                                                UNAVAILABLE
                                            </div>
                                        )}
                                    </div>

                                    <SparkleOverlay
                                        grading={
                                            qrGrading
                                        }
                                        color={
                                            primaryColor
                                        }
                                    />
                                </div>
                            </ElementFrame>

                            <div
                                style={{
                                    fontSize: 9,
                                    color:
                                        "#FFFFFF",
                                    fontWeight:
                                        900,
                                    letterSpacing:
                                        1,
                                    marginBottom: 4
                                }}
                            >
                                CLAIM DISCOUNT
                            </div>

                            <div
                                style={{
                                    fontSize: 10,
                                    color:
                                        mutedTextColor,
                                    lineHeight: 1.6
                                }}
                            >
                                Scan to instantly
                                claim your{" "}
                                <strong
                                    style={{
                                        color:
                                            primaryColor
                                    }}
                                >
                                    {settings?.discount_percentage ??
                                        10}
                                    % discount
                                </strong>{" "}
                                balance.
                            </div>

                            <div
                                style={{
                                    marginTop: 9,
                                    paddingTop: 8,
                                    borderTop:
                                        "1px dashed rgba(255,255,255,0.10)",
                                    fontSize: 9,
                                    color:
                                        mutedTextColor
                                }}
                            >
                                {isExpired ? (
                                    <>
                                        VOUCHER STATUS:{" "}
                                        <span
                                            style={{
                                                color:
                                                    "#EF4444"
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
                                                    primaryColor
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
                                        marginTop: 8,
                                        fontSize: 8,
                                        color:
                                            "rgba(255,255,255,0.35)",
                                        wordBreak:
                                            "break-all"
                                    }}
                                >
                                    TOKEN:{" "}
                                    {
                                        voucher.voucher_token
                                    }
                                </div>
                            )}
                        </ElementFrame>
                    )}

                    {/* FOOTER */}

                    <ElementFrame
                        {...clickable(
                            "footer"
                        )}
                        style={{
                            marginTop:
                                sectionSpacing,
                            textAlign:
                                "center",
                            color:
                                mutedTextColor,
                            fontSize: 9,
                            ...buildGradingStyle(
                                config.text?.footer?.colors ||
                                getElementGrading(
                                    config,
                                    "footer"
                                ),
                                primaryColor,
                                true
                            )
                        }}
                    >
                        Powered by RuachAgent AI
                    </ElementFrame>
                </div>
            </div>

            {showDownloadButton && (
                <div
                    style={{
                        marginTop: 18,
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
                            padding: 14,
                            borderRadius: 14,
                            fontSize: 11,
                            fontWeight: 900,
                            letterSpacing: "0.7px",
                            textTransform:
                                "uppercase",
                            boxShadow:
                                `0 10px 28px ${primaryColor}38`
                        }}
                    >
                        Download Official Invoice PDF
                    </a>
                </div>
            )}
        </div>
    );
}