/* ============================================================================
   TillSlipsCollection.jsx
   PART 1A
   Imports • Component • State • Search Logic • Categories
   ============================================================================ */

import React, { useEffect, useMemo, useState } from "react";
import { useBusiness } from "./backend/businessService";
import MatrixTillSlip from "./models/MatrixTillSlip";
import {
    Search,
    LayoutGrid,
    Sparkles,
    Filter,
    PanelBottomClose
} from "lucide-react";

/* ============================================================================
   DESIGN CATEGORIES
   ============================================================================ */

const GALLERY_BACKGROUND_VIDEO = "/videos/till-slips-gallery.mp4";

const DESIGN_CATEGORIES = [
    "All",
    "Modern",
    "Cyber",
    "Matrix",
    "Luxury",
    "Minimal",
    "Black Gold",
    "Titanium",
    "Business",
    "Classic"
];

/* ============================================================================
   DESIGN COLLECTION

   This page does NOT contain the actual till slip designs.

   Each object only describes the card.

   The receipt JSX itself will be pasted inside each card later.
   ============================================================================ */

const DESIGNS = [

    {
        id: "matrix-grid",
        name: "Matrix Grid",
        category: "Matrix"
    },

    {
        id: "cyber-neon",
        name: "Cyber Neon",
        category: "Cyber"
    },

    {
        id: "tech-hud",
        name: "Tech HUD",
        category: "Modern"
    },

    {
        id: "black-gold",
        name: "Black Gold",
        category: "Black Gold"
    },

    {
        id: "luxury-minimal",
        name: "Luxury Minimal",
        category: "Luxury"
    },

    {
        id: "titanium",
        name: "Titanium",
        category: "Titanium"
    },

    {
        id: "classic-ink",
        name: "Classic Ink",
        category: "Classic"
    }

];

/* ============================================================================
   COMPONENT
   ============================================================================ */

export default function TillSlipsCollection() {

    const {
        user,
        settings,
        receiptData,
        selectedTemplateId
    } = useBusiness();

    const [selectedDesign, setSelectedDesign] = useState(() => {
        return (
            localStorage.getItem("ruachagent:selectedTillSlipDesign") ||
            "matrix-grid"
        );
    });

    const handleChooseDesign = (designId) => {
        // UI state
        setSelectedDesign(designId);

        // Persistent source of truth
        localStorage.setItem(
            "ruachagent:selectedTillSlipDesign",
            designId
        );

        // Tell AdminPanel / other components
        window.dispatchEvent(
            new CustomEvent("ruachagent:tillSlipDesignSelected", {
                detail: designId
            })
        );
    };

    /* ==========================================================================
       STATE
       ========================================================================== */

    const [search, setSearch] = useState("");

    const [activeCategory, setActiveCategory] =
        useState("All");

    /* ==========================================================================
       FILTERED DESIGNS
       ========================================================================== */

    const filteredDesigns = useMemo(() => {

        const keyword = search.trim().toLowerCase();

        return DESIGNS.filter((design) => {

            const categoryMatch =
                activeCategory === "All"
                    ? true
                    : design.category === activeCategory;

            const searchMatch =
                design.name.toLowerCase().includes(keyword) ||
                design.category.toLowerCase().includes(keyword);

            return categoryMatch && searchMatch;

        });

    }, [search, activeCategory]);

    /* ==========================================================================
       PAGE INFORMATION
       ========================================================================== */

    const totalDesigns = filteredDesigns.length;

    const pageSubtitle =
        activeCategory === "All"
            ? `${totalDesigns} Till Slip Designs`
            : `${totalDesigns} ${activeCategory} Design${totalDesigns === 1 ? "" : "s"}`;

    const styles = {
        pageBackground: {
            position: "absolute",
            inset: 0,
            zIndex: 0,
            pointerEvents: "none",
            overflow: "hidden"
        },
        topLeftGlow: {
            position: "absolute",
            top: "0%",
            left: "0%",
            width: "0%",
            height: "0%",
            borderRadius: "0%",
            background:
                "radial-gradient(circle at 0% 0%, rgb(0, 0, 0) 0%, rgb(0, 0, 0) 0%, transparent 0%)",
            filter: "blur(0px)"
        },
        bottomRightGlow: {
            position: "absolute",
            bottom: "0%",
            right: "0%",
            width: "0%",
            height: "0%",
            borderRadius: "0%",
            background:
                "radial-gradient(circle at 0% 0%, rgb(0, 0, 0) 0%, rgb(0, 0, 0) 0%, transparent 0%)",
            filter: "blur(0px)"
        },

        /* ============= PREMIUM HEADER ============= */

        eyebrow: {
            fontSize: '9px',
            fontWeight: '700',
            letterSpacing: '2.2px',
            color: '#15c0d3',
            textTransform: 'uppercase',
            marginBottom: '5px',
        },

        pageTitle: {
            margin: 0,
            fontSize: '25px',
            lineHeight: 1.15,
            fontWeight: '600',
            letterSpacing: '-0.7px',
            color: '#f5f8fc',
        },

        pageSubtitle: {
            margin: '6px 0 0',
            color: '#bdbfbf',
            fontSize: '11px',
            lineHeight: 1.5,
            maxWidth: '650px',
        },

        gridOverlay: {
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            opacity: 0.18,
            backgroundImage: `
      linear-gradient(
        rgb(0, 29, 45) 1px,
        transparent 1px
      ),
      linear-gradient(
        90deg,
        rgb(0, 20, 27) 1px,
        transparent 1px
      )
    `},
    };

    /* ==========================================================================
       JSX STARTS IN PART 1B
       ========================================================================== */

    return (
        <>
            {/* ==========================================================================
    PART 1B.1
    HEADER • SEARCH • FILTERS • CATEGORY CHIPS
=========================================================================== */}

            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                    width: "100%",
                    overflow: "hidden",
                    background:
                        "linear-gradient(180deg,#050B10 0%,#08131B 45%,#050B10 100%)"
                }}
            >

                {/* ===============================================================
      PERSISTENT HEADER
  ================================================================ */}
                <div style={styles.gridOverlay} />

                <div
                    style={{
                        flex: "0 0 auto",
                        flexShrink: 0,
                        width: "100%",
                        overflow: "visible",
                        position: "relative",
                        zIndex: 20,
                        isolation: "isolate",
                        zoom: 0.90,
                        padding: "16px",
                        background:
                            "linear-gradient(180deg,#000000 0%,#000000 100%)",
                        boxSizing: "border-box",
                        borderBottom: "1px solid rgba(0, 197, 251, 0.67)",
                        boxShadow:
                            "0 10px 30px rgba(0,0,0,.32)"
                    }}
                >

                    {/* ===========================================================
        TITLE ROW
    ============================================================ */}

                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            gap: 25,
                            flexWrap: "wrap"
                        }}
                    >

                        {/* LEFT */}

                        <div>

                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 12
                                }}
                            >

                                <div
                                    style={{
                                        width: 48,
                                        height: 48,
                                        borderRadius: 18,

                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",

                                        background:
                                            "linear-gradient(135deg,#000000,#000000)",

                                        border: "2px solid #00e1ff",

                                        boxShadow: `
                0 0 10px rgba(38, 155, 197, 0.4),
                0 0 35px rgba(47, 147, 177, 0.33)
              `
                                    }}
                                >

                                    <LayoutGrid
                                        size={23}
                                        color="#26d0f6"
                                    />

                                </div>

                                <div style={{ minWidth: 0 }}>

                                    <div style={styles.eyebrow}>
                                        RUACHAGENT / TILL SLIPS AREA
                                    </div>

                                    <div>

                                        <h1 style={styles.pageTitle}>
                                            Till Slips Collection
                                        </h1>

                                        <div
                                            style={styles.pageSubtitle}
                                        >
                                            Pick From A Variety Of Professional Designs
                                        </div>

                                    </div>

                                </div>

                            </div>

                        </div>

                        {/* RIGHT */}

                        <div
                            style={{
                                display: "flex",
                                gap: 14,
                                alignItems: "center",
                                flexWrap: "wrap"
                            }}
                        >

                            {/* LIVE */}

                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 8,

                                    padding: "8px 14px",

                                    borderRadius: 999,

                                    background:
                                        "rgba(59,130,246,.10)",

                                    border:
                                        "1px solid rgba(59, 118, 246, 0.2)"
                                }}
                            >

                                <Sparkles
                                    size={14}
                                    color="#7DD3FC"
                                />

                                <span
                                    style={{
                                        color: "#7DD3FC",
                                        fontWeight: 800,
                                        fontSize: 12,
                                        letterSpacing: ".8px",
                                        textTransform: "uppercase"
                                    }}
                                >
                                    Live Designs
                                </span>

                            </div>

                            {/* COUNT */}

                            <div
                                style={{
                                    padding: "8px 14px",

                                    borderRadius: 999,

                                    background:
                                        "rgba(59,130,246,.10)",

                                    border:
                                        "1px solid rgba(59, 118, 246, 0.2)",

                                    color: "#7DD3FC",

                                    fontSize: 11,

                                    fontWeight: 800
                                }}
                            >
                                {totalDesigns} Available
                            </div>

                        </div>

                    </div>

                    {/* ===========================================================
        SEARCH + FILTER BUTTON
    ============================================================ */}

                    <div
                        style={{
                            display: "flex",
                            gap: 16,
                            marginTop: 18,
                            flexWrap: "wrap"
                        }}
                    >

                        {/* SEARCH */}

                        <div
                            style={{
                                flex: 1,
                                minWidth: 320,
                                position: "relative"
                            }}
                        >

                            <Search
                                size={18}
                                color="#b9cbcc"
                                style={{
                                    position: "absolute",
                                    left: 18,
                                    top: "50%",
                                    transform: "translateY(-50%)"
                                }}
                            />

                            <input
                                type="text"
                                placeholder="Search till slip designs..."
                                value={search}
                                onChange={(e) =>
                                    setSearch(e.target.value)
                                }
                                style={{
                                    width: "100%",
                                    height: 48,

                                    paddingLeft: 46,
                                    paddingRight: 18,

                                    borderRadius: 18,

                                    outline: "none",

                                    background: "#000000",

                                    border:
                                        "2px solid rgba(226, 237, 238, 0.79)7)",

                                    color: "#FFFFFF",

                                    fontSize: 14,

                                    fontWeight: 600,

                                    transition: ".25s"
                                }}
                            />

                        </div>

                        {/* FILTER */}

                        <button
                            type="button"
                            style={{
                                height: 48,

                                padding: "0 20px",

                                borderRadius: 18,

                                border: "none",

                                cursor: "pointer",

                                display: "flex",

                                alignItems: "center",

                                gap: 10,

                                background:
                                    "linear-gradient(135deg,#08E3D8,#00A8FF)",

                                color: "#041014",

                                fontWeight: 900,

                                fontSize: 13,

                                letterSpacing: ".6px",

                                boxShadow:
                                    "0 0 20px rgba(47, 222, 252, 0.8)"
                            }}
                        >

                            <Filter size={18} />

                            FILTER

                        </button>

                    </div>

                    {/* ===========================================================
        CATEGORY CHIPS
    ============================================================ */}

                    <div
                        style={{
                            display: "flex",
                            gap: 12,
                            flexWrap: "wrap",
                            marginTop: 16
                        }}
                    >

                        {DESIGN_CATEGORIES.map((category) => {

                            const active =
                                activeCategory === category;

                            return (

                                <button
                                    key={category}
                                    onClick={() =>
                                        setActiveCategory(category)
                                    }
                                    style={{
                                        padding: "9px 16px",

                                        borderRadius: 999,

                                        cursor: "pointer",

                                        transition: ".25s",

                                        fontWeight: 800,

                                        fontSize: 11,

                                        letterSpacing: ".5px",

                                        border: active
                                            ? "2px solid #08E3D8"
                                            : "1px solid rgba(255,255,255,.08)",

                                        background: active
                                            ? "linear-gradient(135deg,#08E3D8,#00A8FF)"
                                            : "#0B1620",

                                        color: active
                                            ? "#031114"
                                            : "#CBD5E1",

                                        boxShadow: active
                                            ? `
                    0 0 12px rgba(8, 220, 227, 0.35),
                    0 0 28px rgba(8, 227, 227, 0.12)
                  `
                                            : "none"
                                    }}
                                >

                                    {category}

                                </button>

                            );

                        })}

                    </div>

                </div>

                {/* ===============================================================
    PART 1B.2A
    RESPONSIVE GALLERY GRID
=============================================================== */}
                <div
                    className="till-slips-gallery-scroll"
                    style={{
                        flex: "1 1 0",
                        minHeight: 0,
                        height: 0,
                        overflowY: "auto",
                        overflowX: "hidden",
                        position: "relative",
                        padding: "16px",
                        boxSizing: "border-box",

                        background: "#171A1D"
                    }}
                >

                    <style>{`
                        .till-slips-gallery-scroll::-webkit-scrollbar {
                            width: 10px;
                        }

                        .till-slips-gallery-scroll::-webkit-scrollbar-track {
                            background: rgba(0, 0, 0, .35);
                        }

                        .till-slips-gallery-scroll::-webkit-scrollbar-thumb {
                            background: rgba(8, 198, 227, 0.75);
                            border-radius: 999px;
                            border: 2px solid rgba(23, 26, 29, .9);
                        }

                        .till-slips-gallery-scroll::-webkit-scrollbar-thumb:hover {
                            background: rgb(8, 198, 227);
                        }
                    `}</style>

                    {/* ===============================================================
    GALLERY BACKGROUND VIDEO
    ---------------------------------------------------------------
    The sticky layer is intentionally 100vh tall.

    The gallery itself clips it to the visible gallery viewport.
    Therefore:
      • no fixed positioning
      • no sidebar leakage
      • no dependence on header height
      • no gray area appearing because of a short video layer
      • video remains visually attached to the gallery while scrolling
=============================================================== */}

                    <div
                        aria-hidden="true"
                        style={{
                            position: "sticky",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100vh",
                            marginTop: "-16px",
                            marginLeft: "-16px",
                            marginBottom: "-100vh",
                            width: "calc(100% + 32px)",
                            zIndex: 0,
                            pointerEvents: "none",
                            zoom: "1.10",
                            overflow: "hidden"
                        }}
                    >
                        <video
                            autoPlay
                            loop
                            muted
                            playsInline
                            preload="auto"
                            aria-hidden="true"
                            style={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                                objectPosition: "center center",
                                pointerEvents: "none",
                                opacity: 0.32,
                                filter:
                                    "brightness(.55) saturate(.8) contrast(1.08)"
                            }}
                        >
                            <source
                                src={GALLERY_BACKGROUND_VIDEO}
                                type="video/mp4"
                            />
                        </video>

                        <div
                            aria-hidden="true"
                            style={{
                                position: "absolute",
                                inset: 0,
                                pointerEvents: "none",
                                background:
                                    "linear-gradient(180deg, rgba(4,10,14,.42), rgba(3,8,12,.60)), radial-gradient(circle at 50% 25%, rgba(0,174,255,.08), transparent 55%)"
                            }}
                        />
                    </div>

                    {/* ===========================================================
      FUTURISTIC TILL SLIP FRAME SYSTEM
  ============================================================ */}
                    <style>{`
                        .ruach-slip-frame {
                            position: relative;
                            isolation: isolate;
                            overflow: hidden;
                            min-width: 0;
                            background:
                                radial-gradient(circle at 12% 8%, rgba(8, 183, 227, 0.12), transparent 24%),
                                radial-gradient(circle at 88% 92%, rgba(0,168,255,.10), transparent 26%),
                                linear-gradient(145deg, rgba(3,10,15,.98), rgba(0,0,0,.98) 52%, rgba(5,15,22,.98));
                            border: 1px solid rgba(8, 190, 227, 0.48);
                            clip-path: polygon(
                                0 22px, 22px 0,
                                calc(100% - 22px) 0, 100% 22px,
                                100% calc(100% - 22px),
                                calc(100% - 22px) 100%, 22px 100%,
                                0 calc(100% - 22px)
                            );
                            box-shadow:
                                0 0 0 1px rgba(0,168,255,.10),
                                0 0 24px rgba(8, 154, 227, 0.1),
                                0 18px 40px rgba(0,0,0,.62);
                        }
                        .ruach-slip-frame::before {
                            content: "";
                            position: absolute;
                            inset: 7px;
                            z-index: 0;
                            pointer-events: none;
                            border: 1px solid rgba(8, 179, 227, 0.18);
                            background:
                                linear-gradient(135deg, transparent 0 14%, rgba(8, 158, 227, 0.16) 14.2% 14.45%, transparent 14.7% 100%),
                                linear-gradient(315deg, transparent 0 18%, rgba(0,168,255,.12) 18.2% 18.45%, transparent 18.7% 100%),
                                repeating-linear-gradient(135deg, transparent 0 22px, rgba(8, 176, 227, 0.04) 22px 23px, transparent 23px 44px);
                            box-shadow: inset 0 0 22px rgba(8, 158, 227, 0.04), 0 0 12px rgba(8, 172, 227, 0.08);
                        }
                        .ruach-slip-frame::after {
                            content: "";
                            position: absolute;
                            top: 12px;
                            left: 12px;
                            right: 12px;
                            height: 2px;
                            z-index: 4;
                            pointer-events: none;
                            background: linear-gradient(90deg, transparent, rgba(8, 212, 227, 0.9) 12%, rgba(0,168,255,.95) 50%, rgba(8, 205, 227, 0.9) 88%, transparent);
                            box-shadow: 0 0 7px rgba(8, 212, 227, 0.85), 0 0 18px rgba(0,168,255,.42);
                        }
                        .ruach-slip-frame-content {
                            position: relative;
                            z-index: 2;
                        }
                        .ruach-slip-preview {
                            position: relative;
                            overflow: hidden;
                            width: 100%;
                            min-height: 490px;
                            display: flex;
                            justify-content: center;
                            align-items: flex-start;
                            padding: 18px 16px 16px;
                            box-sizing: border-box;
                            background:
                                radial-gradient(circle at 50% 18%, rgba(8, 190, 227, 0.07), transparent 38%),
                                linear-gradient(180deg, rgba(2,9,13,.92), rgba(0,0,0,.96));
                            border: 1px solid rgba(8, 179, 227, 0.46);
                        }
                        .ruach-slip-preview::before {
                            content: "";
                            position: absolute;
                            inset: 0;
                            pointer-events: none;
                            opacity: .8;
                            background:
                                linear-gradient(120deg, transparent 0 24%, rgba(8, 190, 227, 0.1) 24.15%, transparent 24.4% 100%),
                                linear-gradient(300deg, transparent 0 72%, rgba(0,168,255,.09) 72.15%, transparent 72.4% 100%),
                                linear-gradient(90deg, transparent 49.7%, rgba(8, 194, 227, 0.04) 50%, transparent 50.3%);
                        }
                        .ruach-slip-footer {
                            position: relative;
                            z-index: 3;
                            background: linear-gradient(180deg, rgba(2,10,15,.94), rgba(0,0,0,.98));
                            border-top: 1px solid rgba(8, 154, 227, 0.2);
                            box-shadow: inset 0 1px 0 rgba(0,168,255,.06);
                        }
                        .ruach-slip-choose {
                            border: 1px solid rgba(8, 190, 227, 0.78) !important;
                            border-radius: 6px !important;
                            background: linear-gradient(135deg, rgba(8, 154, 227, 0.18), rgba(0,168,255,.16)), #031116 !important;
                            color: #7dd6ff !important;
                            box-shadow: inset 0 0 12px rgba(8, 165, 227, 0.08), 0 0 12px rgba(8, 179, 227, 0.18) !important;
                        }
                        .ruach-slip-choose:hover {
                            color: #031114 !important;
                            background: linear-gradient(135deg, #08c2e3, #00A8FF) !important;
                            box-shadow: 0 0 10px rgba(8, 198, 227, 0.82), 0 0 28px rgba(0,168,255,.35) !important;
                        }
                    `}</style>

                    {/* ===========================================================
    GALLERY GRID LAYOUT + INDEPENDENT VISUAL ZOOM
=========================================================== */}

                    {/* ===========================================================
    GALLERY GRID LAYOUT + INDEPENDENT VISUAL ZOOM
=========================================================== */}

                    <div
                        style={{
                            position: "relative",
                            width: "100%",
                            maxWidth: "100%",
                            minHeight: "100%",
                            zIndex: 1,
                            overflow: "visible",
                            boxSizing: "border-box"
                        }}
                    >
                        <div
                            style={{
                                display: "grid",
                                position: "relative",

                                /*
                                 * =====================================================
                                 * GALLERY GRID ZOOM ONLY
                                 * =====================================================
                                 *
                                 * This zoom affects ONLY the gallery cards.
                                 * The background video is outside this element,
                                 * therefore the video is completely unaffected.
                                 *
                                 * 1.00 = normal
                                 * 0.90 = smaller
                                 * 0.80 = smaller
                                 * 0.70 = much smaller
                                 * 1.10 = larger
                                 */
                                zoom: 0.80,

                                /*
                                 * IMPORTANT:
                                 *
                                 * DO NOT use width: "125%" here.
                                 *
                                 * The 125% width was making the grid physically
                                 * wider than the gallery viewport and was causing
                                 * the horizontal displacement shown in your screenshot.
                                 */
                                width: "100%",
                                maxWidth: "100%",

                                gridTemplateColumns:
                                    "repeat(auto-fill, minmax(280px, 1fr))",

                                gap: "18px",

                                alignItems: "start",

                                boxSizing: "border-box"
                            }}
                        >
                            {filteredDesigns.map((design) => {

                                const isSelected = selectedDesign === design.id;

                                return (

                                    <div
                                        key={design.id}
                                        className="ruach-slip-frame"
                                        style={{
                                            transition: "transform .25s ease, box-shadow .25s ease",
                                            transform: "scale(0.82)",
                                            transformOrigin: "top center",
                                            marginBottom: "0",
                                            boxShadow: isSelected
                                                ? "0 0 0 1px rgba(8, 169, 227, 0.55), 0 0 30px rgba(8, 154, 227, 0.24), 0 18px 42px rgba(0,0,0,.72)"
                                                : undefined
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.transform = "translateY(-6px) scale(0.82)";
                                            e.currentTarget.style.boxShadow = "0 0 0 1px rgba(8, 194, 227, 0.72), 0 0 34px rgba(8, 194, 227, 0.3), 0 20px 44px rgba(0,0,0,.78)";
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.transform = "translateY(0px) scale(0.82)";
                                            e.currentTarget.style.boxShadow = isSelected
                                                ? "0 0 0 1px rgba(8, 205, 227, 0.55), 0 0 30px rgba(8, 179, 227, 0.24), 0 18px 42px rgba(0,0,0,.72)"
                                                : "";
                                        }}
                                    >

                                        {/* =====================================================
            CARD HEADER
        ====================================================== */}

                                        <div
                                            className="ruach-slip-frame-content"
                                            style={{
                                                padding: "14px 16px 10px",

                                                display: "flex",

                                                justifyContent: "space-between",

                                                alignItems: "center",

                                                borderBottom:
                                                    "1px solid rgba(0,0,0,.45)"
                                            }}
                                        >

                                            <div
                                                style={{
                                                    color: "#FFFFFF",
                                                    fontSize: "12px",
                                                    fontWeight: 800,
                                                    letterSpacing: ".3px"
                                                }}
                                            >
                                                {design.name}
                                            </div>

                                            <div
                                                style={{
                                                    padding: "4px 6px",

                                                    borderRadius: "999px",

                                                    background:
                                                        "#000000",

                                                    border:
                                                        "1px solid #000000",

                                                    color: "#FFFFFF",

                                                    fontSize: "8px",

                                                    fontWeight: 800,

                                                    textTransform: "uppercase",

                                                    letterSpacing: ".6px"
                                                }}
                                            >
                                                {design.category}
                                            </div>

                                        </div>

                                        {/* =====================================================
            DESIGN PREVIEW AREA
        ====================================================== */}

                                        <div
                                            className="ruach-slip-frame-content"
                                            style={{
                                                padding: "10px 12px 12px"
                                            }}
                                        >
                                            <div className="ruach-slip-preview">

                                                {/* FUTURISTIC NEON GRID / FRAME LINES */}
                                                <div
                                                    aria-hidden="true"
                                                    style={{
                                                        position: "absolute",
                                                        inset: 0,
                                                        zIndex: 1,
                                                        pointerEvents: "none",
                                                        backgroundImage: `
                                                        linear-gradient(rgba(8, 150, 227, 0.1) 1px, transparent 1px),
                                                        linear-gradient(90deg, rgba(0, 145, 255, 0.08) 1px, transparent 1px)
                                                    `,
                                                        backgroundSize: "28px 28px",
                                                        maskImage: "linear-gradient(to bottom, rgba(0,0,0,.85), transparent 88%)"
                                                    }}
                                                />

                                                {/* ===================================================
                                            LIVE DESIGN SLOT
                                        ==================================================== */}
                                                {/*== zoom: 0.78; INCREASES ZOOMOUT FOR TILL SLIP WHICH IS INTERIOR ==*/}
                                                <style>{`
    .till-slip-live-slot {
        container-type: inline-size;
        container-name: till-slip-slot;

        display: flex;
        justify-content: center;
        align-items: flex-start;

        overflow: visible;
        width: 100%;
        min-height: 700px;

        zoom: 0.70;

        position: relative;
    }

    /*
     * ==========================================================
     * ACTUAL RECEIPT / TILL SLIP
     * ==========================================================
     *
     * IMPORTANT:
     * This changes the MatrixTillSlip INSIDE the futuristic
     * card. It does NOT change .ruach-slip-frame.
     */
    .till-slip-live-slot > * {
        width: 410px !important;
        min-width: 410px !important;
        max-width: 410px !important;

        zoom: 0.70;

        transform-origin: center top;

        flex: 0 0 410px !important;
    }
`}</style>

                                                <div
                                                    className="till-slip-live-slot"
                                                    style={{
                                                        position: "relative",
                                                        zIndex: 2,
                                                        width: "100%",
                                                        minHeight: "700px"
                                                    }}
                                                >
                                                    {design.id === "matrix-grid" ? (
                                                        <MatrixTillSlip
                                                            receiptData={receiptData}
                                                            settings={settings}
                                                            user={user}
                                                            activeCurrencySymbol={
                                                                settings?.currency_symbol ||
                                                                settings?.currencySymbol ||
                                                                ""
                                                            }
                                                        />
                                                    ) : (
                                                        <div
                                                            style={{
                                                                minHeight: "210px",
                                                                display: "flex",
                                                                alignItems: "center",
                                                                justifyContent: "center",
                                                                textAlign: "center",
                                                                color: "#79868c"    //THIS MIGHT BE THE SOURCE
                                                            }}
                                                        >
                                                            {/* Add the live {design.name} component here. */}
                                                            <span>
                                                                {/* Add your {design.name} till slip design here */}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>

                                            </div>

                                        </div>

                                        {/* ===========================================================
            CARD FOOTER
        ============================================================ */}

                                        <div
                                            className="ruach-slip-footer"
                                            style={{
                                                padding: "14px 16px",

                                                display: "flex",
                                                justifyContent: "space-between",
                                                alignItems: "center",
                                                gap: "8px",
                                                flexWrap: "wrap"
                                            }}
                                        >

                                            {/* DESIGN DETAILS */}

                                            <div>

                                                <div
                                                    style={{
                                                        color: "#FFFFFF",
                                                        fontSize: "12px",
                                                        fontWeight: 800,
                                                        letterSpacing: ".3px"
                                                    }}
                                                >
                                                    {design.name}
                                                </div>

                                                <div
                                                    style={{
                                                        marginTop: "3px",
                                                        color: "#8FA8BA",
                                                        fontSize: "9px",
                                                        fontWeight: 600
                                                    }}
                                                >
                                                    Professional Till Slip Design
                                                </div>

                                            </div>

                                            {/* CHOOSE BUTTON */}

                                            <button
                                                type="button"
                                                className="ruach-slip-choose"
                                                onClick={() => handleChooseDesign(design.id)}

                                                /*
                                                ====================================================
                                  
                                                    SELECT THIS DESIGN
                                  
                                                    Example:
                                  
                                                    setSelectedDesign(design.id);
                                  
                                                    handleChooseDesign(design);
                                  
                                                    saveSelectedDesign(design.id);
                                  
                                                ====================================================
                                                */


                                                style={{
                                                    border: "none",
                                                    outline: "none",
                                                    cursor: "pointer",

                                                    padding: "10px 16px",

                                                    borderRadius: "9px",

                                                    background:
                                                        "linear-gradient(135deg,#08E3D8,#00A8FF)",

                                                    color: "#000000",

                                                    fontWeight: 900,

                                                    fontSize: "10px",

                                                    letterSpacing: ".8px",

                                                    textTransform: "uppercase",

                                                    transition: "all .25s ease",

                                                    boxShadow: `
                0 0 16px rgba(8, 205, 227, 0.25),
                0 10px 28px rgba(0,0,0,.25)
              `
                                                }}
                                                onMouseEnter={(e) => {

                                                    e.currentTarget.style.transform =
                                                        "translateY(-2px) scale(1.02)";

                                                    e.currentTarget.style.boxShadow = `
                0 0 28px rgba(8, 216, 227, 0.45),
                0 14px 36px rgba(0,0,0,.30)
              `;

                                                }}
                                                onMouseLeave={(e) => {

                                                    e.currentTarget.style.transform =
                                                        "translateY(0px) scale(1)";

                                                    e.currentTarget.style.boxShadow = `
                0 0 16px rgba(8, 209, 227, 0.41),
                0 10px 28px rgba(0,0,0,.25)
              `;

                                                }}
                                            >
                                                CHOOSE
                                            </button>

                                        </div>

                                    </div>

                                );


                            })}

                        </div>
                    </div>

                    {/* ===========================================================
      EMPTY SEARCH STATE
  ============================================================ */}

                    {filteredDesigns.length === 0 && (
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                padding: "80px 20px"
                            }}
                        >
                            <div
                                style={{
                                    width: "100%",
                                    maxWidth: "650px",
                                    background:
                                        "linear-gradient(180deg,#08131A,#050B10)",
                                    border: "1px solid rgba(8, 205, 227, 0.52)",
                                    borderRadius: "26px",
                                    padding: "60px 40px",
                                    textAlign: "center",
                                    boxShadow:
                                        "0 18px 50px rgba(0,0,0,.35)"
                                }}
                            >
                                <Search
                                    size={60}
                                    color="#08d4e3"
                                />

                                <h2
                                    style={{
                                        color: "#FFFFFF",
                                        marginTop: "22px",
                                        marginBottom: "12px",
                                        fontSize: "28px",
                                        fontWeight: 700,
                                        lineHeight: 1.2
                                    }}
                                >
                                    No Designs Found
                                </h2>

                                <p
                                    style={{
                                        margin: "0 auto",
                                        maxWidth: "430px",
                                        color: "#94A3B8",
                                        fontSize: "14px",
                                        lineHeight: "1.9"
                                    }}
                                >
                                    No till slip designs matched your search or
                                    selected category.
                                    <br />
                                    Try a different keyword or choose another
                                    category.
                                </p>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </>
    );
}