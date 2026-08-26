import React, { useEffect, useMemo, useState } from "react";
import {
    SunMedium,
    Sparkles,
    Lightbulb,
    Waves,
    Palette,
    SlidersHorizontal,
    RotateCcw,
    Check,
    ChevronDown,
    ChevronRight,
    Target,
    Layers3,
} from "lucide-react";

/*
|--------------------------------------------------------------------------
| RuachAgent Receipt Studio
| System D — Color Grading
|--------------------------------------------------------------------------
|
| RESPONSIBILITY
|
| Advanced color grading for the currently selected receipt object.
|
| IMPORTANT:
|
| This component NEVER edits MatrixTillSlip.jsx.
|
| It modifies:
|
| designConfig.colorGrading.targets[selectedElement]
|
| MatrixTillSlip.jsx is responsible for reading that configuration.
|
|--------------------------------------------------------------------------
*/

/* ==========================================================================
   DEFAULT TARGET CONFIGURATION
   ========================================================================== */

const createDefaultTargetGrading = () => ({
    basic: {
        exposure: 0,
        contrast: 0,
        highlights: 0,
        shadows: 0,
        saturation: 0,
        whites: 0,
        blacks: 0,
        vibrance: 100,
    },

    neon: {
        enabled: false,
        color: "#00F0FF",
        intensity: 80,
        spread: 50,
        glow: 70,
    },

    glow: {
        enabled: false,
        intensity: 60,
        radius: 80,
        threshold: 50,
    },

    light: {
        enabled: false,
        keyLight: 45,
        fillLight: 25,
        rimLight: 35,
        intensity: 65,
        direction: 45,
        keyColor: "#FFD7CE",
        fillColor: "#EAFBFF",
        rimColor: "#D9F8FF",
    },

    sparkle: {
        enabled: false,
        intensity: 40,
        size: 30,
        density: 20,
        animated: true,
    },

    gradient: {
        enabled: false,
        type: "linear",
        startColor: "#00F0FF",
        endColor: "#0066FF",
        angle: 0,
        opacity: 100,
    },

    advanced: {
        hueShift: 0,
        colorTemperature: 6500,
        tint: 0,
        sharpen: 10,
        noiseReduction: 0,
    },
});


/* ==========================================================================
   AVAILABLE RECEIPT TARGETS
   ========================================================================== */

const TARGETS = [
    {
        id: "logo",
        label: "Logo",
        description: "Merchant logo",
    },
    {
        id: "businessName",
        label: "Business Name",
        description: "Merchant name",
    },
    {
        id: "businessLocation",
        label: "Business Location",
        description: "Store address",
    },
    {
        id: "transaction",
        label: "Transaction",
        description: "Transaction information",
    },
    {
        id: "verifiedBadge",
        label: "Verified Badge",
        description: "Verification indicator",
    },
    {
        id: "qrCode",
        label: "QR Code",
        description: "Receipt QR code",
    },
    {
        id: "qrLabel",
        label: "QR Label",
        description: "QR instruction text",
    },
    {
        id: "items",
        label: "Items",
        description: "Purchased products",
    },
    {
        id: "vat",
        label: "VAT",
        description: "Tax information",
    },
    {
        id: "total",
        label: "Total",
        description: "Receipt total",
    },
    {
        id: "voucher",
        label: "Voucher",
        description: "Voucher information",
    },
    {
        id: "footer",
        label: "Footer",
        description: "Receipt footer",
    },
    {
        id: "socialIcons",
        label: "Social Icons",
        description: "Receipt social icons",
    },
    {
        id: "receiptBackground",
        label: "Receipt Background",
        description: "Receipt surface",
    },
    {
        id: "receiptBorder",
        label: "Receipt Border",
        description: "Receipt outer border",
    },
];


/* ==========================================================================
   SAFE OBJECT HELPERS
   ========================================================================== */

function cloneObject(value) {
    if (!value || typeof value !== "object") {
        return {};
    }

    return JSON.parse(JSON.stringify(value));
}


function ensureColorGradingConfig(config) {
    const next = cloneObject(config);

    if (!next.colorGrading || typeof next.colorGrading !== "object") {
        next.colorGrading = {};
    }

    if (
        !next.colorGrading.targets ||
        typeof next.colorGrading.targets !== "object"
    ) {
        next.colorGrading.targets = {};
    }

    return next;
}


function ensureTargetConfig(config, targetId) {
    const next = ensureColorGradingConfig(config);

    if (!next.colorGrading.targets[targetId]) {
        next.colorGrading.targets[targetId] =
            createDefaultTargetGrading();
    }

    return next;
}


/* ==========================================================================
   COMPONENT
   ========================================================================== */

export default function RuachAgentReceiptStudioSystemD({
    designConfig = {},
    selectedElement = null,
    onDesignConfigChange,
    onSelectElement,
    disabled = false,
}) {

    /* ----------------------------------------------------------------------
       ACTIVE TARGET
    ---------------------------------------------------------------------- */

    const resolvedTarget = useMemo(() => {
        if (!selectedElement) {
            return null;
        }

        return (
            TARGETS.find(
                (target) => target.id === selectedElement
            ) || null
        );
    }, [selectedElement]);


    /* ----------------------------------------------------------------------
       LOCAL OPEN/CLOSED STATES
    ---------------------------------------------------------------------- */

    const [openSections, setOpenSections] = useState({
        basic: true,
        neon: true,
        glow: true,
        light: true,
        sparkle: true,
        gradient: true,
        advanced: true,
    });


    /* ----------------------------------------------------------------------
       LOCAL GRADING STATE
    ---------------------------------------------------------------------- */

    const [grading, setGrading] = useState(
        createDefaultTargetGrading()
    );


    /* ----------------------------------------------------------------------
       LOAD SELECTED TARGET
       ---------------------------------------------------------------------- */

    useEffect(() => {

        if (!resolvedTarget) {
            setGrading(createDefaultTargetGrading());
            return;
        }

        const normalized = ensureTargetConfig(
            designConfig,
            resolvedTarget.id
        );

        const selectedConfig =
            normalized.colorGrading.targets[
            resolvedTarget.id
            ];

        setGrading({
            ...createDefaultTargetGrading(),
            ...selectedConfig,

            basic: {
                ...createDefaultTargetGrading().basic,
                ...(selectedConfig?.basic || {}),
            },

            neon: {
                ...createDefaultTargetGrading().neon,
                ...(selectedConfig?.neon || {}),
            },

            glow: {
                ...createDefaultTargetGrading().glow,
                ...(selectedConfig?.glow || {}),
            },

            light: {
                ...createDefaultTargetGrading().light,
                ...(selectedConfig?.light || {}),
            },

            sparkle: {
                ...createDefaultTargetGrading().sparkle,
                ...(selectedConfig?.sparkle || {}),
            },

            gradient: {
                ...createDefaultTargetGrading().gradient,
                ...(selectedConfig?.gradient || {}),
            },

            advanced: {
                ...createDefaultTargetGrading().advanced,
                ...(selectedConfig?.advanced || {}),
            },
        });

    }, [designConfig, resolvedTarget.id]);


    /* ==========================================================================
       UPDATE DESIGN CONFIGURATION
       ========================================================================== */

    const commitGrading = (nextGrading) => {

        if (!resolvedTarget) {
            return;
        }

        setGrading(nextGrading);

        if (typeof onDesignConfigChange !== "function") {
            return;
        }

        const nextConfig = ensureTargetConfig(
            designConfig,
            resolvedTarget.id
        );

        nextConfig.colorGrading.targets[
            resolvedTarget.id
        ] = nextGrading;

        /*
         * Optional compatibility layer.
         *
         * Some versions of MatrixTillSlip may use:
         *
         * designConfig.color_grading
         *
         * while newer versions use:
         *
         * designConfig.colorGrading
         *
         * Keeping both synchronized makes migration safer.
         */

        nextConfig.color_grading = {
            ...(nextConfig.color_grading || {}),
            targets: nextConfig.colorGrading.targets,
        };

        onDesignConfigChange(nextConfig);
    };


    /* ==========================================================================
       UPDATE NESTED VALUE
       ========================================================================== */

    const updateSectionValue = (
        section,
        property,
        value
    ) => {

        const nextGrading = {
            ...grading,

            [section]: {
                ...(grading[section] || {}),
                [property]: value,
            },
        };

        commitGrading(nextGrading);
    };


    /* ==========================================================================
       TOGGLE SECTION
       ========================================================================== */

    const toggleSection = (section) => {

        setOpenSections((previous) => ({
            ...previous,
            [section]: !previous[section],
        }));
    };


    /* ==========================================================================
       RESET CURRENT TARGET
       ========================================================================== */

    const handleResetTarget = () => {

        const defaults =
            createDefaultTargetGrading();

        commitGrading(defaults);
    };


    /* ==========================================================================
       RESET ALL COLOR GRADING
       ========================================================================== */

    const handleResetAll = () => {

        if (typeof onDesignConfigChange !== "function") {
            return;
        }

        const nextConfig =
            ensureColorGradingConfig(designConfig);

        nextConfig.colorGrading.targets = {};

        nextConfig.color_grading = {
            ...(nextConfig.color_grading || {}),
            targets: {},
        };

        onDesignConfigChange(nextConfig);

        setGrading(
            createDefaultTargetGrading()
        );
    };


    /* ==========================================================================
       RANGE CONTROL
       ========================================================================== */

    const RangeControl = ({
        label,
        value,
        min = -100,
        max = 100,
        step = 1,
        onChange,
        suffix = "",
    }) => {

        const numericValue =
            Number.isFinite(Number(value))
                ? Number(value)
                : 0;

        return (
            <div style={styles.rangeRow}>

                <div style={styles.rangeLabel}>
                    <span>{label}</span>

                    <div style={styles.rangeValue}>
                        {numericValue}
                        {suffix}
                    </div>
                </div>

                <input
                    type="range"
                    min={min}
                    max={max}
                    step={step}
                    value={numericValue}
                    disabled={disabled}
                    onChange={(e) =>
                        onChange(
                            Number(e.target.value)
                        )
                    }
                    style={styles.rangeInput}
                />

            </div>
        );
    };


    /* ==========================================================================
       COLOR CONTROL
       ========================================================================== */

    const ColorControl = ({
        label,
        value,
        onChange,
    }) => {

        return (
            <div style={styles.colorRow}>

                <span style={styles.colorLabel}>
                    {label}
                </span>

                <div style={styles.colorControl}>

                    <input
                        type="color"
                        value={value || "#00F0FF"}
                        disabled={disabled}
                        onChange={(e) =>
                            onChange(e.target.value)
                        }
                        style={styles.colorPicker}
                    />

                    <span style={styles.colorValue}>
                        {value || "#00F0FF"}
                    </span>

                </div>

            </div>
        );
    };


    /* ==========================================================================
       TOGGLE CONTROL
       ========================================================================== */

    const Toggle = ({
        enabled,
        onChange,
    }) => {

        return (
            <button
                type="button"
                disabled={disabled}
                onClick={() => onChange(!enabled)}
                style={{
                    ...styles.toggle,
                    ...(enabled
                        ? styles.toggleActive
                        : {}),
                }}
            >

                <span
                    style={{
                        ...styles.toggleKnob,
                        ...(enabled
                            ? styles.toggleKnobActive
                            : {}),
                    }}
                />

            </button>
        );
    };


    /* ==========================================================================
       SECTION HEADER
       ========================================================================== */

    const SectionHeader = ({
        id,
        icon,
        title,
        description,
    }) => {

        const isOpen = openSections[id];

        return (
            <button
                type="button"
                onClick={() =>
                    toggleSection(id)
                }
                style={styles.sectionHeader}
            >

                <div style={styles.sectionHeaderLeft}>

                    <div style={styles.sectionIcon}>
                        {icon}
                    </div>

                    <div>

                        <div style={styles.sectionTitle}>
                            {title}
                        </div>

                        <div style={styles.sectionDescription}>
                            {description}
                        </div>

                    </div>

                </div>

                {isOpen ? (
                    <ChevronDown
                        size={14}
                    />
                ) : (
                    <ChevronRight
                        size={14}
                    />
                )}

            </button>
        );
    };


    /* ==========================================================================
       RENDER
       ========================================================================== */

    if (!resolvedTarget) {
        return (
            <section style={styles.root}>
                <div style={styles.emptyState}>
                    <Target size={22} />
                    <strong style={styles.emptyStateStrong}>
                        Select an element
                    </strong>
                    <span style={styles.emptyStateSpan}>
                        Click a logo, text, QR code, total,
                        item or another part of the receipt
                        to begin editing.
                    </span>
                </div>
            </section>
        );
    }

    return (
        <section style={styles.root}>

            {/* ================================================================
                HEADER
            ================================================================= */}

            <div style={styles.header}>

                <div style={styles.headerTitleRow}>

                    <div style={styles.headerIcon}>
                        <Palette size={16} />
                    </div>

                    <div>

                        <h2 style={styles.title}>
                            COLOR GRADING
                        </h2>

                        <p style={styles.subtitle}>
                            Enhance and style your receipt
                        </p>

                    </div>

                </div>

                <div style={styles.targetIndicator}>
                    <Target size={12} />
                    <span>
                        {resolvedTarget.label}
                    </span>
                </div>

            </div>


            {/* ================================================================
                ACTIVE OBJECT
            ================================================================= */}

            <div style={styles.activeTarget}>

                <div style={styles.activeTargetIcon}>
                    <Layers3 size={15} />
                </div>

                <div style={styles.activeTargetInfo}>

                    <span style={styles.activeTargetLabel}>
                        SELECTED ELEMENT
                    </span>

                    <strong style={styles.activeTargetName}>
                        {resolvedTarget.label}
                    </strong>

                    <span style={styles.activeTargetDescription}>
                        {resolvedTarget.description}
                    </span>

                </div>

                <div style={styles.liveIndicator}>
                    <span style={styles.liveDot} />
                    LIVE
                </div>

            </div>


            {/* ================================================================
                TARGET SELECTOR
            ================================================================= */}

            <div style={styles.targetSelector}>

                {TARGETS.map((target) => {

                    const active =
                        target.id ===
                        resolvedTarget.id;

                    return (
                        <button
                            key={target.id}
                            type="button"
                            disabled={disabled}
                            onClick={() => {

                                if (
                                    typeof onSelectElement ===
                                    "function"
                                ) {
                                    onSelectElement(
                                        target.id
                                    );
                                }

                            }}
                            style={{
                                ...styles.targetChip,
                                ...(active
                                    ? styles.targetChipActive
                                    : {}),
                            }}
                        >
                            {target.label}
                        </button>
                    );

                })}

            </div>


            {/* ================================================================
                BASIC
            ================================================================= */}

            <div style={styles.section}>

                <SectionHeader
                    id="basic"
                    icon={<SunMedium size={15} />}
                    title="BASIC"
                    description="Adjust brightness, contrast and more"
                />

                {openSections.basic && (
                    <div style={styles.sectionBody}>

                        <RangeControl
                            label="Exposure"
                            value={
                                grading.basic.exposure
                            }
                            onChange={(value) =>
                                updateSectionValue(
                                    "basic",
                                    "exposure",
                                    value
                                )
                            }
                        />

                        <RangeControl
                            label="Contrast"
                            value={
                                grading.basic.contrast
                            }
                            onChange={(value) =>
                                updateSectionValue(
                                    "basic",
                                    "contrast",
                                    value
                                )
                            }
                        />

                        <RangeControl
                            label="Highlights"
                            value={
                                grading.basic.highlights
                            }
                            onChange={(value) =>
                                updateSectionValue(
                                    "basic",
                                    "highlights",
                                    value
                                )
                            }
                            min={-100}
                            max={100}
                        />

                        <RangeControl
                            label="Shadows"
                            value={
                                grading.basic.shadows
                            }
                            onChange={(value) =>
                                updateSectionValue(
                                    "basic",
                                    "shadows",
                                    value
                                )
                            }
                            min={-100}
                            max={100}
                        />

                        <RangeControl
                            label="Saturation"
                            value={
                                grading.basic.saturation
                            }
                            onChange={(value) =>
                                updateSectionValue(
                                    "basic",
                                    "saturation",
                                    value
                                )
                            }
                        />

                        <RangeControl
                            label="Whites"
                            value={
                                grading.basic.whites
                            }
                            onChange={(value) =>
                                updateSectionValue(
                                    "basic",
                                    "whites",
                                    value
                                )
                            }
                        />

                        <RangeControl
                            label="Blacks"
                            value={
                                grading.basic.blacks
                            }
                            onChange={(value) =>
                                updateSectionValue(
                                    "basic",
                                    "blacks",
                                    value
                                )
                            }
                        />

                        <RangeControl
                            label="Vibrance"
                            value={
                                grading.basic.vibrance
                            }
                            min={0}
                            max={200}
                            onChange={(value) =>
                                updateSectionValue(
                                    "basic",
                                    "vibrance",
                                    value
                                )
                            }
                        />

                    </div>
                )}

            </div>


            {/* ================================================================
                NEON
            ================================================================= */}

            <div style={styles.section}>

                <SectionHeader
                    id="neon"
                    icon={<Sparkles size={15} />}
                    title="NEON"
                    description="Control neon colors and intensity"
                />

                {openSections.neon && (
                    <div style={styles.sectionBody}>

                        <div style={styles.effectEnableRow}>

                            <span>
                                Enable Neon
                            </span>

                            <Toggle
                                enabled={
                                    grading.neon.enabled
                                }
                                onChange={(value) =>
                                    updateSectionValue(
                                        "neon",
                                        "enabled",
                                        value
                                    )
                                }
                            />

                        </div>

                        <ColorControl
                            label="Neon Color"
                            value={
                                grading.neon.color
                            }
                            onChange={(value) =>
                                updateSectionValue(
                                    "neon",
                                    "color",
                                    value
                                )
                            }
                        />

                        <RangeControl
                            label="Neon Intensity"
                            value={
                                grading.neon.intensity
                            }
                            min={0}
                            max={100}
                            onChange={(value) =>
                                updateSectionValue(
                                    "neon",
                                    "intensity",
                                    value
                                )
                            }
                        />

                        <RangeControl
                            label="Neon Spread"
                            value={
                                grading.neon.spread
                            }
                            min={0}
                            max={100}
                            onChange={(value) =>
                                updateSectionValue(
                                    "neon",
                                    "spread",
                                    value
                                )
                            }
                        />

                        <RangeControl
                            label="Neon Glow"
                            value={
                                grading.neon.glow
                            }
                            min={0}
                            max={100}
                            onChange={(value) =>
                                updateSectionValue(
                                    "neon",
                                    "glow",
                                    value
                                )
                            }
                        />

                    </div>
                )}

            </div>


            {/* ================================================================
                GLOW
            ================================================================= */}

            <div style={styles.section}>

                <SectionHeader
                    id="glow"
                    icon={<Waves size={15} />}
                    title="GLOW"
                    description="Add glow effects to elements"
                />

                {openSections.glow && (
                    <div style={styles.sectionBody}>

                        <div style={styles.effectEnableRow}>

                            <span>
                                Enable Glow
                            </span>

                            <Toggle
                                enabled={
                                    grading.glow.enabled
                                }
                                onChange={(value) =>
                                    updateSectionValue(
                                        "glow",
                                        "enabled",
                                        value
                                    )
                                }
                            />

                        </div>

                        <RangeControl
                            label="Glow Intensity"
                            value={
                                grading.glow.intensity
                            }
                            min={0}
                            max={100}
                            onChange={(value) =>
                                updateSectionValue(
                                    "glow",
                                    "intensity",
                                    value
                                )
                            }
                        />

                        <RangeControl
                            label="Glow Radius"
                            value={
                                grading.glow.radius
                            }
                            min={0}
                            max={150}
                            onChange={(value) =>
                                updateSectionValue(
                                    "glow",
                                    "radius",
                                    value
                                )
                            }
                        />

                        <RangeControl
                            label="Glow Threshold"
                            value={
                                grading.glow.threshold
                            }
                            min={0}
                            max={100}
                            onChange={(value) =>
                                updateSectionValue(
                                    "glow",
                                    "threshold",
                                    value
                                )
                            }
                        />

                    </div>
                )}

            </div>


            {/* ================================================================
                LIGHT
            ================================================================= */}

            <div style={styles.section}>

                <SectionHeader
                    id="light"
                    icon={<Lightbulb size={15} />}
                    title="LIGHT"
                    description="Adjust lighting and highlights"
                />

                {openSections.light && (
                    <div style={styles.sectionBody}>

                        <ColorControl
                            label="Key Color"
                            value={
                                grading.light.keyColor
                            }
                            onChange={(value) =>
                                updateSectionValue(
                                    "light",
                                    "keyColor",
                                    value
                                )
                            }
                        />

                        <ColorControl
                            label="Fill Color"
                            value={
                                grading.light.fillColor
                            }
                            onChange={(value) =>
                                updateSectionValue(
                                    "light",
                                    "fillColor",
                                    value
                                )
                            }
                        />

                        <ColorControl
                            label="Rim Color"
                            value={
                                grading.light.rimColor
                            }
                            onChange={(value) =>
                                updateSectionValue(
                                    "light",
                                    "rimColor",
                                    value
                                )
                            }
                        />

                        <RangeControl
                            label="Key Light"
                            value={
                                grading.light.keyLight
                            }
                            min={0}
                            max={100}
                            onChange={(value) =>
                                updateSectionValue(
                                    "light",
                                    "keyLight",
                                    value
                                )
                            }
                        />

                        <RangeControl
                            label="Fill Light"
                            value={
                                grading.light.fillLight
                            }
                            min={0}
                            max={100}
                            onChange={(value) =>
                                updateSectionValue(
                                    "light",
                                    "fillLight",
                                    value
                                )
                            }
                        />

                        <RangeControl
                            label="Rim Light"
                            value={
                                grading.light.rimLight
                            }
                            min={0}
                            max={100}
                            onChange={(value) =>
                                updateSectionValue(
                                    "light",
                                    "rimLight",
                                    value
                                )
                            }
                        />

                        <RangeControl
                            label="Light Intensity"
                            value={
                                grading.light.intensity
                            }
                            min={0}
                            max={100}
                            onChange={(value) =>
                                updateSectionValue(
                                    "light",
                                    "intensity",
                                    value
                                )
                            }
                        />

                        <RangeControl
                            label="Light Direction"
                            value={
                                grading.light.direction
                            }
                            min={0}
                            max={360}
                            onChange={(value) =>
                                updateSectionValue(
                                    "light",
                                    "direction",
                                    value
                                )
                            }
                            suffix="°"
                        />

                    </div>
                )}

            </div>


            {/* ================================================================
                SPARKLE
            ================================================================= */}

            <div style={styles.section}>

                <SectionHeader
                    id="sparkle"
                    icon={<Sparkles size={15} />}
                    title="SPARKLE"
                    description="Add sparkle and particle effects"
                />

                {openSections.sparkle && (
                    <div style={styles.sectionBody}>

                        <RangeControl
                            label="Sparkle Intensity"
                            value={
                                grading.sparkle.intensity
                            }
                            min={0}
                            max={100}
                            onChange={(value) =>
                                updateSectionValue(
                                    "sparkle",
                                    "intensity",
                                    value
                                )
                            }
                        />

                        <RangeControl
                            label="Sparkle Size"
                            value={
                                grading.sparkle.size
                            }
                            min={1}
                            max={100}
                            onChange={(value) =>
                                updateSectionValue(
                                    "sparkle",
                                    "size",
                                    value
                                )
                            }
                        />

                        <RangeControl
                            label="Sparkle Density"
                            value={
                                grading.sparkle.density
                            }
                            min={0}
                            max={100}
                            onChange={(value) =>
                                updateSectionValue(
                                    "sparkle",
                                    "density",
                                    value
                                )
                            }
                        />

                        <div style={styles.effectEnableRow}>

                            <span>
                                Animated
                            </span>

                            <Toggle
                                enabled={
                                    grading.sparkle.animated
                                }
                                onChange={(value) =>
                                    updateSectionValue(
                                        "sparkle",
                                        "animated",
                                        value
                                    )
                                }
                            />

                        </div>

                    </div>
                )}

            </div>


            {/* ================================================================
                GRADIENT
            ================================================================= */}

            <div style={styles.section}>

                <SectionHeader
                    id="gradient"
                    icon={<Palette size={15} />}
                    title="GRADIENT"
                    description="Apply beautiful gradients"
                />

                {openSections.gradient && (
                    <div style={styles.sectionBody}>

                        <div style={styles.effectEnableRow}>

                            <span>
                                Dynamic Gradient
                            </span>

                            <Toggle
                                enabled={
                                    grading.gradient.enabled
                                }
                                onChange={(value) =>
                                    updateSectionValue(
                                        "gradient",
                                        "enabled",
                                        value
                                    )
                                }
                            />

                        </div>

                        <div style={styles.selectRow}>

                            <span>
                                Gradient Type
                            </span>

                            <select
                                value={
                                    grading.gradient.type
                                }
                                disabled={disabled}
                                onChange={(e) =>
                                    updateSectionValue(
                                        "gradient",
                                        "type",
                                        e.target.value
                                    )
                                }
                                style={styles.select}
                            >

                                <option value="linear">
                                    Linear
                                </option>

                                <option value="radial">
                                    Radial
                                </option>

                                <option value="conic">
                                    Conic
                                </option>

                            </select>

                        </div>

                        <ColorControl
                            label="Start Color"
                            value={
                                grading.gradient.startColor
                            }
                            onChange={(value) =>
                                updateSectionValue(
                                    "gradient",
                                    "startColor",
                                    value
                                )
                            }
                        />

                        <ColorControl
                            label="End Color"
                            value={
                                grading.gradient.endColor
                            }
                            onChange={(value) =>
                                updateSectionValue(
                                    "gradient",
                                    "endColor",
                                    value
                                )
                            }
                        />

                        <RangeControl
                            label="Start Angle"
                            value={
                                grading.gradient.angle
                            }
                            min={0}
                            max={360}
                            onChange={(value) =>
                                updateSectionValue(
                                    "gradient",
                                    "angle",
                                    value
                                )
                            }
                            suffix="°"
                        />

                        <RangeControl
                            label="Opacity"
                            value={
                                grading.gradient.opacity
                            }
                            min={0}
                            max={100}
                            onChange={(value) =>
                                updateSectionValue(
                                    "gradient",
                                    "opacity",
                                    value
                                )
                            }
                            suffix="%"
                        />

                    </div>
                )}

            </div>


            {/* ================================================================
                ADVANCED
            ================================================================= */}

            <div style={styles.section}>

                <SectionHeader
                    id="advanced"
                    icon={
                        <SlidersHorizontal
                            size={15}
                        />
                    }
                    title="ADVANCED"
                    description="Fine tune advanced controls"
                />

                {openSections.advanced && (
                    <div style={styles.sectionBody}>

                        <RangeControl
                            label="Hue Shift"
                            value={
                                grading.advanced.hueShift
                            }
                            min={-180}
                            max={180}
                            onChange={(value) =>
                                updateSectionValue(
                                    "advanced",
                                    "hueShift",
                                    value
                                )
                            }
                            suffix="°"
                        />

                        <RangeControl
                            label="Color Temperature"
                            value={
                                grading.advanced.colorTemperature
                            }
                            min={2000}
                            max={12000}
                            step={100}
                            onChange={(value) =>
                                updateSectionValue(
                                    "advanced",
                                    "colorTemperature",
                                    value
                                )
                            }
                            suffix="K"
                        />

                        <RangeControl
                            label="Tint"
                            value={
                                grading.advanced.tint
                            }
                            min={-100}
                            max={100}
                            onChange={(value) =>
                                updateSectionValue(
                                    "advanced",
                                    "tint",
                                    value
                                )
                            }
                        />

                        <RangeControl
                            label="Sharpen"
                            value={
                                grading.advanced.sharpen
                            }
                            min={0}
                            max={100}
                            onChange={(value) =>
                                updateSectionValue(
                                    "advanced",
                                    "sharpen",
                                    value
                                )
                            }
                        />

                        <RangeControl
                            label="Noise Reduction"
                            value={
                                grading.advanced.noiseReduction
                            }
                            min={0}
                            max={100}
                            onChange={(value) =>
                                updateSectionValue(
                                    "advanced",
                                    "noiseReduction",
                                    value
                                )
                            }
                        />

                    </div>
                )}

            </div>


            {/* ================================================================
                ACTIONS
            ================================================================= */}

            <div style={styles.actions}>

                <button
                    type="button"
                    disabled={disabled}
                    onClick={handleResetTarget}
                    style={styles.applyButton}
                >
                    <Check size={14} />
                    Apply to Receipt
                </button>

                <button
                    type="button"
                    disabled={disabled}
                    onClick={handleResetTarget}
                    style={styles.resetButton}
                >
                    <RotateCcw size={13} />
                    Reset Selected Element
                </button>

                <button
                    type="button"
                    disabled={disabled}
                    onClick={handleResetAll}
                    style={styles.resetAllButton}
                >
                    Reset All Color Grading
                </button>

            </div>

        </section>
    );
}


/* ==========================================================================
   STYLES
   ==========================================================================
   
   IMPORTANT:
   The application uses the "const styles = {}" pattern.
   No external CSS file is required.
   
========================================================================== */

const styles = {

    root: {
        width: "100%",
        height: "100%",
        minHeight: 0,
        display: "flex",
        flexDirection: "column",
        boxSizing: "border-box",

        background:
            "linear-gradient(180deg, #0a0f14 0%, #070b0f 100%)",

        color: "#eaf7ff",

        border:
            "1px solid rgba(0, 215, 255, 0.14)",

        borderRadius: "10px",

        overflow: "hidden",

        fontFamily:
            "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",

        boxShadow:
            "0 20px 60px rgba(0,0,0,0.42)",
    },


    emptyState: {
        flex: 1,
        minHeight: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "10px",
        padding: "32px",
        textAlign: "center",
        color: "#b9d9e8",
        background:
            "radial-gradient(circle at center, rgba(0, 217, 255, 0.08), transparent 52%)",
    },

    emptyStateStrong: {
        color: "#f1fbff",
        fontSize: "14px",
        letterSpacing: "0.04em",
    },

    emptyStateSpan: {
        maxWidth: "300px",
        color: "#7895a4",
        fontSize: "12px",
        lineHeight: 1.6,
    },

    /* ----------------------------------------------------------------------
       HEADER
    ---------------------------------------------------------------------- */

    header: {
        padding: "14px 14px 12px 14px",

        borderBottom:
            "1px solid rgba(0, 215, 255, 0.12)",

        background:
            "linear-gradient(180deg, rgba(17,25,32,0.98), rgba(9,14,19,0.98))",

        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",

        gap: "10px",
    },


    headerTitleRow: {
        display: "flex",
        alignItems: "center",
        gap: "10px",
        minWidth: 0,
    },


    headerIcon: {
        width: "30px",
        height: "30px",

        display: "flex",
        alignItems: "center",
        justifyContent: "center",

        borderRadius: "7px",

        color: "#00eaff",

        background:
            "linear-gradient(135deg, rgba(0,234,255,0.16), rgba(0,115,255,0.08))",

        border:
            "1px solid rgba(0,234,255,0.30)",

        boxShadow:
            "0 0 18px rgba(0,214,255,0.12)",
    },


    title: {
        margin: 0,

        fontSize: "11px",
        fontWeight: 800,

        letterSpacing: "0.08em",

        color: "#f2fbff",
    },


    subtitle: {
        margin: "3px 0 0 0",

        fontSize: "8px",

        color: "#718896",
    },


    targetIndicator: {
        display: "flex",
        alignItems: "center",
        gap: "5px",

        padding: "5px 8px",

        borderRadius: "5px",

        color: "#00eaff",

        fontSize: "8px",
        fontWeight: 700,

        background:
            "rgba(0,234,255,0.06)",

        border:
            "1px solid rgba(0,234,255,0.18)",

        whiteSpace: "nowrap",
    },


    /* ----------------------------------------------------------------------
       ACTIVE TARGET
    ---------------------------------------------------------------------- */

    activeTarget: {
        margin: "10px 10px 7px 10px",

        padding: "9px",

        display: "flex",
        alignItems: "center",

        gap: "9px",

        borderRadius: "7px",

        background:
            "linear-gradient(135deg, rgba(0,234,255,0.08), rgba(0,90,140,0.035))",

        border:
            "1px solid rgba(0,234,255,0.16)",

        boxShadow:
            "inset 0 0 20px rgba(0,234,255,0.025)",
    },


    activeTargetIcon: {
        width: "27px",
        height: "27px",

        display: "flex",
        alignItems: "center",
        justifyContent: "center",

        borderRadius: "6px",

        color: "#00eaff",

        background:
            "rgba(0,234,255,0.08)",

        border:
            "1px solid rgba(0,234,255,0.20)",
    },


    activeTargetInfo: {
        flex: 1,
        minWidth: 0,

        display: "flex",
        flexDirection: "column",
    },


    activeTargetLabel: {
        fontSize: "7px",

        letterSpacing: "0.10em",

        color: "#58717e",

        fontWeight: 700,
    },


    activeTargetName: {
        marginTop: "2px",

        fontSize: "10px",

        color: "#eafcff",
    },


    activeTargetDescription: {
        marginTop: "2px",

        fontSize: "7px",

        color: "#647b87",

        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
    },


    liveIndicator: {
        display: "flex",
        alignItems: "center",
        gap: "4px",

        fontSize: "7px",
        fontWeight: 800,

        color: "#00eaff",

        letterSpacing: "0.06em",
    },


    liveDot: {
        width: "5px",
        height: "5px",

        borderRadius: "50%",

        background: "#00eaff",

        boxShadow:
            "0 0 8px rgba(0,234,255,0.95)",
    },


    /* ----------------------------------------------------------------------
       TARGET SELECTOR
    ---------------------------------------------------------------------- */

    targetSelector: {
        padding: "3px 10px 9px 10px",

        display: "flex",

        gap: "5px",

        overflowX: "auto",

        scrollbarWidth: "thin",
    },


    targetChip: {
        flex: "0 0 auto",

        padding: "5px 7px",

        borderRadius: "5px",

        border:
            "1px solid rgba(255,255,255,0.07)",

        background:
            "rgba(255,255,255,0.025)",

        color: "#718692",

        fontSize: "7px",
        fontWeight: 600,

        cursor: "pointer",
    },


    targetChipActive: {
        color: "#00eaff",

        border:
            "1px solid rgba(0,234,255,0.35)",

        background:
            "rgba(0,234,255,0.08)",

        boxShadow:
            "0 0 12px rgba(0,234,255,0.08)",
    },


    /* ----------------------------------------------------------------------
       SECTIONS
    ---------------------------------------------------------------------- */

    section: {
        margin: "0 7px 6px 7px",

        border:
            "1px solid rgba(255,255,255,0.055)",

        borderRadius: "7px",

        overflow: "hidden",

        background:
            "rgba(255,255,255,0.018)",
    },


    sectionHeader: {
        width: "100%",

        minHeight: "43px",

        padding: "7px 9px",

        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",

        background:
            "linear-gradient(180deg, rgba(17,25,31,0.94), rgba(11,17,22,0.94))",

        color: "#d9edf5",

        border: "none",

        cursor: "pointer",

        textAlign: "left",
    },


    sectionHeaderLeft: {
        display: "flex",
        alignItems: "center",

        gap: "8px",
    },


    sectionIcon: {
        width: "22px",
        height: "22px",

        display: "flex",
        alignItems: "center",
        justifyContent: "center",

        borderRadius: "5px",

        color: "#00eaff",

        background:
            "rgba(0,234,255,0.055)",
    },


    sectionTitle: {
        fontSize: "8px",

        fontWeight: 800,

        letterSpacing: "0.06em",

        color: "#d9f8ff",
    },


    sectionDescription: {
        marginTop: "2px",

        fontSize: "7px",

        color: "#627883",
    },


    sectionBody: {
        padding: "7px 9px 9px 9px",

        background:
            "rgba(4,8,12,0.54)",

        borderTop:
            "1px solid rgba(255,255,255,0.035)",
    },


    /* ----------------------------------------------------------------------
       RANGE
    ---------------------------------------------------------------------- */

    rangeRow: {
        marginBottom: "7px",
    },


    rangeLabel: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",

        marginBottom: "4px",

        fontSize: "7px",

        color: "#8da3ad",
    },


    rangeValue: {
        minWidth: "24px",

        padding: "2px 4px",

        borderRadius: "3px",

        textAlign: "center",

        color: "#c9f7ff",

        background:
            "rgba(255,255,255,0.035)",

        border:
            "1px solid rgba(255,255,255,0.055)",

        fontSize: "7px",
    },


    rangeInput: {
        width: "100%",

        height: "3px",

        margin: 0,

        accentColor: "#00eaff",

        cursor: "pointer",
    },


    /* ----------------------------------------------------------------------
       COLOR
    ---------------------------------------------------------------------- */

    colorRow: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",

        marginBottom: "7px",

        minHeight: "22px",
    },


    colorLabel: {
        fontSize: "7px",
        color: "#8297a2",
    },


    colorControl: {
        display: "flex",
        alignItems: "center",
        gap: "5px",
    },


    colorPicker: {
        width: "24px",
        height: "18px",

        padding: 0,

        border:
            "1px solid rgba(255,255,255,0.12)",

        borderRadius: "3px",

        background: "transparent",

        cursor: "pointer",
    },


    colorValue: {
        width: "48px",

        padding: "3px 4px",

        borderRadius: "3px",

        background:
            "rgba(255,255,255,0.025)",

        border:
            "1px solid rgba(255,255,255,0.05)",

        color: "#8ca6b2",

        fontSize: "7px",

        textAlign: "center",
    },


    /* ----------------------------------------------------------------------
       TOGGLE
    ---------------------------------------------------------------------- */

    effectEnableRow: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",

        padding: "3px 0 7px 0",

        fontSize: "7px",

        color: "#8ba0aa",
    },


    toggle: {
        position: "relative",

        width: "27px",
        height: "14px",

        padding: 0,

        borderRadius: "10px",

        border:
            "1px solid rgba(255,255,255,0.10)",

        background:
            "#182128",

        cursor: "pointer",
    },


    toggleActive: {
        background:
            "rgba(0,210,240,0.30)",

        border:
            "1px solid rgba(0,234,255,0.45)",

        boxShadow:
            "0 0 10px rgba(0,234,255,0.16)",
    },


    toggleKnob: {
        position: "absolute",

        top: "2px",
        left: "2px",

        width: "8px",
        height: "8px",

        borderRadius: "50%",

        background: "#66757d",

        transition:
            "transform 160ms ease, background 160ms ease",
    },


    toggleKnobActive: {
        transform: "translateX(13px)",

        background: "#00eaff",

        boxShadow:
            "0 0 7px rgba(0,234,255,0.8)",
    },


    /* ----------------------------------------------------------------------
       SELECT
    ---------------------------------------------------------------------- */

    selectRow: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",

        marginBottom: "7px",

        fontSize: "7px",

        color: "#8297a2",
    },


    select: {
        width: "95px",

        padding: "4px 5px",

        borderRadius: "4px",

        outline: "none",

        border:
            "1px solid rgba(255,255,255,0.07)",

        background: "#0b1116",

        color: "#cceaf2",

        fontSize: "7px",

        cursor: "pointer",
    },


    /* ----------------------------------------------------------------------
       ACTIONS
    ---------------------------------------------------------------------- */

    actions: {
        padding: "5px 7px 8px 7px",

        display: "flex",
        flexDirection: "column",

        gap: "5px",
    },


    applyButton: {
        width: "100%",

        height: "27px",

        display: "flex",
        alignItems: "center",
        justifyContent: "center",

        gap: "5px",

        borderRadius: "5px",

        border:
            "1px solid rgba(0,234,255,0.75)",

        background:
            "linear-gradient(180deg, rgba(0,190,230,0.18), rgba(0,90,120,0.13))",

        color: "#00eaff",

        fontSize: "8px",
        fontWeight: 700,

        cursor: "pointer",

        boxShadow:
            "0 0 14px rgba(0,234,255,0.08)",
    },


    resetButton: {
        width: "100%",

        height: "24px",

        display: "flex",
        alignItems: "center",
        justifyContent: "center",

        gap: "5px",

        borderRadius: "5px",

        border:
            "1px solid rgba(255,255,255,0.06)",

        background:
            "rgba(255,255,255,0.018)",

        color: "#71858f",

        fontSize: "7px",

        cursor: "pointer",
    },


    resetAllButton: {
        width: "100%",

        height: "23px",

        borderRadius: "5px",

        border:
            "1px solid rgba(255,255,255,0.035)",

        background: "transparent",

        color: "#485b64",

        fontSize: "7px",

        cursor: "pointer",
    },
};