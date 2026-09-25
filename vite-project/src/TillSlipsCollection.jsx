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
                                        color="#14a7c8"
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
                                        "rgb(0, 0, 0)",

                                    border:
                                        "1px solid rgba(63, 233, 255, 0.67)"
                                }}
                            >

                                <Sparkles
                                    size={14}
                                    color="#08E3D8"
                                />

                                <span
                                    style={{
                                        color: "#839291",
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
                                    "0 0 20px rgba(0, 229, 255, 0.8)"
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
                            background: rgba(8, 227, 216, .75);
                            border-radius: 999px;
                            border: 2px solid rgba(23, 26, 29, .9);
                        }

                        .till-slips-gallery-scroll::-webkit-scrollbar-thumb:hover {
                            background: rgba(8, 227, 216, 1);
                        }
                    `}</style>

                    {/* ===============================================================
    GALLERY BACKGROUND VIDEO
    - Stays inside the gallery scroll container
    - Does NOT use fixed
    - Does NOT consume gallery layout space
    - Covers the complete visible gallery viewport
=============================================================== */}

                    <div
                        aria-hidden="true"
                        style={{
                            position: "sticky",
                            top: 0,
                            height: "calc(100vh - 177px)",
                            minHeight: 0,
                            width: "100%",
                            margin: 0,
                            marginBottom: "calc(-1 * (100vh - 177px))",
                            zIndex: 0,
                            pointerEvents: "none",
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
                                inset: 0,
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

                    <div
                        style={{
                            ...styles.pageBackground,
                            position: "absolute",
                            inset: 0,
                            zIndex: 0,
                            pointerEvents: "none"
                        }}
                    >
                    </div>

                    {/* ===========================================================
      RESPONSIVE CARD GRID
  ============================================================ */}

                    <div
                        style={{
                            display: "grid",
                            position: "relative",
                            zIndex: 1,

                            gridTemplateColumns:
                                "repeat(auto-fill, minmax(280px, 1fr))",

                            gap: "12px",

                            alignItems: "start"
                        }}
                    >

                        {filteredDesigns.map((design) => {

                            const isSelected = selectedDesign === design.id;

                            return (

                                <div
                                    key={design.id}
                                    style={{
                                        background: `
                                            linear-gradient(180deg,#000000,#000000) padding-box,
                                            linear-gradient(135deg,#000000,#626870,#000000) border-box
                                        `,

                                        border: "2px solid transparent",

                                        borderRadius: "16px",

                                        overflow: "hidden",

                                        transition: "all .25s ease",

                                        transform: "scale(0.85)",
                                        transformOrigin: "top center",  //0.85 AND BOTH INCREASE ZOOMOUT FOR CARD

                                        // Reduces the unused vertical space caused by scale(0.65)
                                        marginBottom: "-200px",

                                        boxShadow: isSelected
                                            ? "0 0 0 2px rgba(0,0,0,.8), 0 0 28px rgba(0,0,0,.95), 0 14px 28px rgba(0,0,0,.75)"
                                            : "0 10px 24px rgba(0,0,0,.45)"
                                    }}

                                    onMouseEnter={(e) => {

                                        e.currentTarget.style.transform =
                                            "translateY(-6px) scale(0.85)";  //INCREASES ZOOMOUT FOR CARD

                                        e.currentTarget.style.border =
                                            "2px solid transparent";

                                        e.currentTarget.style.boxShadow = `
            0 0 0 2px rgba(0,0,0,.9),
            0 0 34px rgba(0,0,0,.95),
            0 16px 32px rgba(0,0,0,.8)
          `;

                                    }}

                                    onMouseLeave={(e) => {

                                        e.currentTarget.style.transform =
                                            "translateY(0px) scale(0.85)";    //SCALE 0.85 INCREASES ZOOMOUT FOR CARD

                                        e.currentTarget.style.border =
                                            "2px solid transparent";

                                        e.currentTarget.style.boxShadow = isSelected
                                            ? "0 0 0 2px rgba(0,0,0,.8), 0 0 28px rgba(0,0,0,.95), 0 14px 28px rgba(0,0,0,.75)"
                                            : "0 10px 24px rgba(0,0,0,.45)";

                                    }}
                                >

                                    {/* =====================================================
            CARD HEADER
        ====================================================== */}

                                    <div
                                        style={{
                                            padding: "10px 12px",

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
                                        style={{
                                            padding: "10px",

                                            minHeight: "260px",

                                            display: "flex",

                                            justifyContent: "center",

                                            alignItems: "center"
                                        }}
                                    >

                                        <div
                                            style={{
                                                width: "100%",

                                                minHeight: "230px",

                                                borderRadius: "12px",

                                                border:
                                                    "2px solid transparent",

                                                background:
                                                    `
                                linear-gradient(180deg,#555B62,#363B41) padding-box,
                                linear-gradient(135deg,#000000,#626870,#000000) border-box
                `,

                                                display: "flex",

                                                justifyContent: "center",

                                                alignItems: "center",

                                                padding: "10px",

                                                position: "relative",

                                                overflow: "hidden"
                                            }}
                                        >

                                            {/* GRID BACKGROUND */}

                                            <div
                                                style={{
                                                    position: "absolute",

                                                    inset: 0,

                                                    backgroundImage:
                                                        `
                  linear-gradient(rgb(63, 68, 70) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(74, 74, 74, 0.4) 1px, transparent 1px)
                  `,

                                                    backgroundSize: "22px 22px",

                                                    pointerEvents: "none"
                                                }}
                                            />

                                            {/* ===================================================
                                            LIVE DESIGN SLOT
                                        ==================================================== */}
                                            {/*== zoom: 0.78; INCREASES ZOOMOUT FOR TILL SLIP ==*/}
                                            <style>{`
                                                .till-slip-live-slot {
                                                    container-type: inline-size;
                                                    container-name: till-slip-slot;
                                                    display: flex;
                                                    justify-content: center;
                                                    align-items: center;
                                                    overflow: hidden;
                                                    width: 100%;
                                                    zoom: 0.78;
                                                }

                                                .till-slip-live-slot > * {
                                                width: 300px !important;          
                                                transform-origin: center top;
                                                }

                                            
                                                @container till-slip-slot (max-width: 280px) {
                                                    .till-slip-live-slot > * {
                                                        zoom: 0.90; /* Larger zoom to fill preview area */
                                                    }
                                                }

                                                @container till-slip-slot (max-width: 230px) {
                                                    .till-slip-live-slot > * {
                                                        zoom: 0.75;
                                                    }
                                                }

                                                @container till-slip-slot (max-width: 180px) {
                                                    .till-slip-live-slot > * {
                                                        zoom: 0.60;
                                                    }
                                                }
                                            `}</style>

                                            <div
                                                className="till-slip-live-slot"
                                                style={{
                                                    position: "relative",
                                                    zIndex: 2,
                                                    width: "100%",
                                                    minHeight: "210px"
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
                                        style={{
                                            padding: "12px 14px",
                                            borderTop: "1px solid rgba(255,255,255,.05)",
                                            background:
                                                "#000000",

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