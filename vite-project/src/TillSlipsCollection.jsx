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
    Filter
} from "lucide-react";

/* ============================================================================
   DESIGN CATEGORIES
   ============================================================================ */

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
                        position: "sticky",
                        top: 0,
                        zIndex: 50,
                        flexShrink: 0,

                        padding: "28px 34px",

                        borderBottom:
                            "1px solid rgba(8,227,216,.10)",

                        backdropFilter: "blur(18px)",

                        background:
                            "linear-gradient(180deg,rgba(7,15,22,.98),rgba(5,11,16,.98))"
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
                                    gap: 15
                                }}
                            >

                                <div
                                    style={{
                                        width: 58,
                                        height: 58,
                                        borderRadius: 18,

                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",

                                        background:
                                            "linear-gradient(135deg,#08E3D8,#00A8FF)",

                                        border: "2px solid #08E3D8",

                                        boxShadow: `
                0 0 10px rgba(8,227,216,.40),
                0 0 35px rgba(8,227,216,.15)
              `
                                    }}
                                >

                                    <LayoutGrid
                                        size={28}
                                        color="#041014"
                                    />

                                </div>

                                <div>

                                    <h1
                                        style={{
                                            margin: 0,
                                            color: "#FFFFFF",
                                            fontSize: 30,
                                            fontWeight: 900,
                                            letterSpacing: ".4px"
                                        }}
                                    >
                                        Till Slips Collection
                                    </h1>

                                    <div
                                        style={{
                                            marginTop: 6,
                                            color: "#8BCDF6",
                                            fontSize: 13,
                                            fontWeight: 700,
                                            letterSpacing: ".6px"
                                        }}
                                    >
                                        {pageSubtitle}
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

                                    padding: "10px 18px",

                                    borderRadius: 999,

                                    background:
                                        "rgba(8,227,216,.08)",

                                    border:
                                        "1px solid rgba(8,227,216,.18)"
                                }}
                            >

                                <Sparkles
                                    size={16}
                                    color="#08E3D8"
                                />

                                <span
                                    style={{
                                        color: "#08E3D8",
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
                                    padding: "10px 18px",

                                    borderRadius: 999,

                                    background:
                                        "rgba(59,130,246,.10)",

                                    border:
                                        "1px solid rgba(59,130,246,.20)",

                                    color: "#7DD3FC",

                                    fontSize: 12,

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
                            marginTop: 28,
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
                                color="#08E3D8"
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
                                    height: 56,

                                    paddingLeft: 52,
                                    paddingRight: 18,

                                    borderRadius: 18,

                                    outline: "none",

                                    background: "#09141C",

                                    border:
                                        "2px solid rgba(8,227,216,.12)",

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
                                height: 56,

                                padding: "0 24px",

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
                                    "0 0 20px rgba(8,227,216,.20)"
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
                            marginTop: 24
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
                                        padding: "11px 20px",

                                        borderRadius: 999,

                                        cursor: "pointer",

                                        transition: ".25s",

                                        fontWeight: 800,

                                        fontSize: 12,

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
                    0 0 12px rgba(8,227,216,.35),
                    0 0 28px rgba(8,227,216,.12)
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
                    style={{
                        flex: 1,
                        overflowY: "auto",
                        overflowX: "hidden",
                        padding: "30px",
                        background:
                            "linear-gradient(180deg,#050B10 0%,#08131B 100%)"
                    }}
                >

                    {/* ===========================================================
      RESPONSIVE CARD GRID
  ============================================================ */}

                    <div
                        style={{
                            display: "grid",

                            gridTemplateColumns:
                                "repeat(auto-fill, minmax(360px, 1fr))",

                            gap: "28px",

                            alignItems: "start"
                        }}
                    >

                        {filteredDesigns.map((design) => {

                            return (

                                <div
                                    key={design.id}
                                    style={{
                                        background:
                                            "linear-gradient(180deg,#09131A,#050B10)",

                                        border: "1px solid rgba(8,227,216,.12)",

                                        borderRadius: "28px",

                                        overflow: "hidden",

                                        transition: "all .25s ease",

                                        boxShadow: `
            0 12px 35px rgba(0,0,0,.35),
            0 0 15px rgba(8,227,216,.05)
          `
                                    }}

                                    onMouseEnter={(e) => {

                                        e.currentTarget.style.transform =
                                            "translateY(-6px)";

                                        e.currentTarget.style.border =
                                            "1px solid rgba(8,227,216,.35)";

                                        e.currentTarget.style.boxShadow = `
            0 20px 45px rgba(0,0,0,.45),
            0 0 30px rgba(8,227,216,.18)
          `;

                                    }}

                                    onMouseLeave={(e) => {

                                        e.currentTarget.style.transform =
                                            "translateY(0px)";

                                        e.currentTarget.style.border =
                                            "1px solid rgba(8,227,216,.12)";

                                        e.currentTarget.style.boxShadow = `
            0 12px 35px rgba(0,0,0,.35),
            0 0 15px rgba(8,227,216,.05)
          `;

                                    }}
                                >

                                    {/* =====================================================
            CARD HEADER
        ====================================================== */}

                                    <div
                                        style={{
                                            padding: "18px 22px",

                                            display: "flex",

                                            justifyContent: "space-between",

                                            alignItems: "center",

                                            borderBottom:
                                                "1px solid rgba(255,255,255,.05)"
                                        }}
                                    >

                                        <div
                                            style={{
                                                color: "#FFFFFF",
                                                fontSize: "18px",
                                                fontWeight: 800,
                                                letterSpacing: ".3px"
                                            }}
                                        >
                                            {design.name}
                                        </div>

                                        <div
                                            style={{
                                                padding: "6px 12px",

                                                borderRadius: "999px",

                                                background:
                                                    "rgba(8,227,216,.08)",

                                                border:
                                                    "1px solid rgba(8,227,216,.18)",

                                                color: "#08E3D8",

                                                fontSize: "11px",

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
                                            padding: "20px",

                                            minHeight: "620px",

                                            display: "flex",

                                            justifyContent: "center",

                                            alignItems: "center"
                                        }}
                                    >

                                        <div
                                            style={{
                                                width: "100%",

                                                minHeight: "560px",

                                                borderRadius: "22px",

                                                border:
                                                    "2px dashed rgba(8,227,216,.18)",

                                                background:
                                                    `
                linear-gradient(
                  180deg,
                  rgba(8,18,24,.65),
                  rgba(4,10,14,.92)
                )
                `,

                                                display: "flex",

                                                justifyContent: "center",

                                                alignItems: "center",

                                                padding: "24px",

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
                  linear-gradient(rgba(8,227,216,.05) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(8,227,216,.05) 1px, transparent 1px)
                  `,

                                                    backgroundSize: "22px 22px",

                                                    pointerEvents: "none"
                                                }}
                                            />

                                            {/* ===================================================
                                            LIVE DESIGN SLOT
                                        ==================================================== */}

                                            <div
                                                style={{
                                                    position: "relative",
                                                    zIndex: 2,
                                                    width: "100%"
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
                                                            minHeight: "500px",
                                                            display: "flex",
                                                            alignItems: "center",
                                                            justifyContent: "center",
                                                            textAlign: "center",
                                                            color: "#64748B"
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

                                        {/* ===========================================================
            CARD FOOTER
        ============================================================ */}

                                        <div
                                            style={{
                                                padding: "20px 22px",
                                                borderTop: "1px solid rgba(255,255,255,.05)",
                                                background:
                                                    "linear-gradient(180deg,#08131A,#060C11)",

                                                display: "flex",
                                                justifyContent: "space-between",
                                                alignItems: "center",
                                                gap: "16px",
                                                flexWrap: "wrap"
                                            }}
                                        >

                                            {/* DESIGN DETAILS */}

                                            <div>

                                                <div
                                                    style={{
                                                        color: "#FFFFFF",
                                                        fontSize: "16px",
                                                        fontWeight: 800,
                                                        letterSpacing: ".3px"
                                                    }}
                                                >
                                                    {design.name}
                                                </div>

                                                <div
                                                    style={{
                                                        marginTop: "5px",
                                                        color: "#8FA8BA",
                                                        fontSize: "12px",
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

                                                    padding: "14px 26px",

                                                    borderRadius: "14px",

                                                    background:
                                                        "linear-gradient(135deg,#08E3D8,#00A8FF)",

                                                    color: "#041014",

                                                    fontWeight: 900,

                                                    fontSize: "12px",

                                                    letterSpacing: ".8px",

                                                    textTransform: "uppercase",

                                                    transition: "all .25s ease",

                                                    boxShadow: `
                0 0 16px rgba(8,227,216,.25),
                0 10px 28px rgba(0,0,0,.25)
              `
                                                }}
                                                onMouseEnter={(e) => {

                                                    e.currentTarget.style.transform =
                                                        "translateY(-2px) scale(1.02)";

                                                    e.currentTarget.style.boxShadow = `
                0 0 28px rgba(8,227,216,.45),
                0 14px 36px rgba(0,0,0,.30)
              `;

                                                }}
                                                onMouseLeave={(e) => {

                                                    e.currentTarget.style.transform =
                                                        "translateY(0px) scale(1)";

                                                    e.currentTarget.style.boxShadow = `
                0 0 16px rgba(8,227,216,.25),
                0 10px 28px rgba(0,0,0,.25)
              `;

                                                }}
                                            >
                                                CHOOSE
                                            </button>

                                        </div>

                                    </div>

                                </div>

                            );

                        })}

                    </div>

                    {/* ===========================================================
      EMPTY SEARCH STATE
  ============================================================ */}

                    {
                        filteredDesigns.length === 0 && (

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

                                        border: "1px solid rgba(8,227,216,.15)",

                                        borderRadius: "26px",

                                        padding: "60px 40px",

                                        textAlign: "center",

                                        boxShadow:
                                            "0 18px 50px rgba(0,0,0,.35)"
                                    }}
                                >

                                    <Search
                                        size={60}
                                        color="#08E3D8"
                                    />

                                    <h2
                                        style={{
                                            color: "#FFFFFF",
                                            marginTop: "22px",
                                            marginBottom: "12px",
                                            fontSize: "28px",
                                            fontWeight: 900
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

                        )
                    }

                </div>

                {/* ===========================================================
    END OF SCROLLABLE CONTENT
=========================================================== */}

            </div>

            {/* ===========================================================
    END OF TILL SLIPS COLLECTION PAGE
=========================================================== */}

        </>
    );

}