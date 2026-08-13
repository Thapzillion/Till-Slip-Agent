import React, { useMemo, useState } from "react";
import {
  Box,
  Layers3,
  ScanLine,
  Type,
  ReceiptText,
  ShoppingBag,
  Sigma,
  Minus,
  Image,
  SquareDashed,
  CircleDot,
  ChevronRight,
  ChevronDown,
  Plus,
  Copy,
  Trash2,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  GripVertical,
  Search,
  SlidersHorizontal,
  Database,
  Orbit,
  Sparkles,
  PanelTop,
  Grid3X3,
  Move3D,
  Maximize2,
  Rotate3D,
  Crosshair,
  Cuboid,
  Scan,
  Zap,
  Activity,
  Layers,
  Command,
  MousePointer2,
  MoreHorizontal
} from "lucide-react";

/*
===============================================================================
RUACHAGENT — SYSTEM B
OBJECT MODEL
===============================================================================

PURPOSE
-------
System B defines the structured object model consumed by the Receipt Studio.

IMPORTANT ARCHITECTURE RULE
---------------------------
This system does NOT edit MatrixTillSlip.jsx.

The receipt JSX remains the renderer.

The studio manipulates a normalized object graph / designConfig model:

    Studio UI
       ↓
    Object Model
       ↓
    designConfig
       ↓
    MatrixTillSlip.jsx
       ↓
    Customer Receipt

Every object has a stable `id`, `type`, `role`, `visible`, `locked`,
transform information, and a configuration payload.

SUPPORTED OBJECT CLASSES
------------------------
1. Logo
2. QR Code
3. Text
4. Receipt Sections
5. Product Items
6. Totals
7. Dividers
8. Icons
9. Frames
10. Backgrounds

SHAPES
------
Standalone shapes are intentionally NOT an object class.

Logo and QR Code may have their own shape/container configuration:

    logo.layout.shape
    qr.layout.shape

This lets the studio create circular, rounded, squircle, hexagonal, etc.
logo / QR containers without introducing a generic Shape object.

DESIGN CONFIG COMPATIBILITY
---------------------------
The object model is designed to serialize into the receipt's existing
designConfig structure. The renderer can consume only the portions it
understands while preserving the remainder of the configuration.

===============================================================================
*/


/* ============================================================================
   OBJECT TYPE DEFINITIONS
============================================================================ */

export const OBJECT_TYPES = {
  LOGO: "logo",
  QR: "qr",
  TEXT: "text",
  SECTION: "section",
  PRODUCT: "product",
  TOTAL: "total",
  DIVIDER: "divider",
  ICON: "icon",
  FRAME: "frame",
  BACKGROUND: "background"
};

export const OBJECT_LABELS = {
  logo: "BRAND CORE",
  qr: "QR NODE",
  text: "TYPE MATRIX",
  section: "RECEIPT MODULE",
  product: "ITEM NODE",
  total: "VALUE CORE",
  divider: "DIVIDER LINE",
  icon: "ICON GLYPH",
  frame: "FRAME SHELL",
  background: "AMBIENT FIELD"
};

export const OBJECT_ICONS = {
  logo: Image,
  qr: ScanLine,
  text: Type,
  section: ReceiptText,
  product: ShoppingBag,
  total: Sigma,
  divider: Minus,
  icon: CircleDot,
  frame: SquareDashed,
  background: PanelTop
};


/* ============================================================================
   SHARED TRANSFORM MODEL
============================================================================ */

export const createTransform = (overrides = {}) => ({
  x: 0,
  y: 0,
  width: 100,
  height: 100,
  scale: 1,
  rotation: 0,
  opacity: 1,
  skewX: 0,
  skewY: 0,
  zIndex: 0,
  anchorX: 0.5,
  anchorY: 0.5,
  ...overrides
});


/* ============================================================================
   SHARED OBJECT BASE
============================================================================ */

export const createBaseObject = ({
  id,
  type,
  name,
  role,
  transform,
  visible = true,
  locked = false,
  selectable = true,
  ...rest
}) => ({
  id,
  type,
  name,
  role,
  visible,
  locked,
  selectable,
  transform: createTransform(transform),
  metadata: {
    system: "RuachAgent",
    objectModelVersion: "2.0",
    renderer: "MatrixTillSlip"
  },
  ...rest
});


/* ============================================================================
   LOGO OBJECT
============================================================================ */

export const createLogoObject = (overrides = {}) =>
  createBaseObject({
    id: "logo.primary",
    type: OBJECT_TYPES.LOGO,
    name: "Merchant Logo",
    role: "merchant_brand",
    transform: {
      x: 50,
      y: 82,
      width: 180,
      height: 110,
      ...overrides.transform
    },
    data: {
      source: null,
      url: "",
      alt: "Merchant Logo",
      fit: "contain",
      preserveAspectRatio: true,
      shape: "rounded",
      shapeRadius: 18,
      shapePadding: 8,
      crop: {
        x: 0,
        y: 0,
        zoom: 1
      },
      ...overrides.data
    },
    layout: {
      position: "center",
      horizontalAlign: "center",
      verticalAlign: "center",
      ...overrides.layout
    },
    color: {
      mode: "original",
      tint: "#00D9FF",
      brightness: 1,
      contrast: 1,
      saturation: 1,
      ...overrides.color
    },
    effects: {
      glow: false,
      glowIntensity: 0.4,
      glass: false,
      metallic: false,
      holographic: false,
      floating: false,
      hover: false,
      rotate360: false,
      ...overrides.effects
    },
    ...overrides
  });


/* ============================================================================
   QR OBJECT
============================================================================ */

export const createQRCodeObject = (overrides = {}) =>
  createBaseObject({
    id: "qr.primary",
    type: OBJECT_TYPES.QR,
    name: "Receipt QR",
    role: "transaction_qr",
    transform: {
      x: 50,
      y: 500,
      width: 180,
      height: 180,
      ...overrides.transform
    },
    data: {
      contentType: "transaction_url",
      value: "",
      errorCorrection: "H",
      quietZone: 8,
      foreground: "#FFFFFF",
      background: "#061016",
      ...overrides.data
    },
    layout: {
      position: "center",
      shape: "square",
      cornerRadius: 12,
      padding: 12,
      ...overrides.layout
    },
    effects: {
      pulse: false,
      scanLine: false,
      glow: true,
      holographic: false,
      animatedBorder: false,
      animationSpeed: 1,
      ...overrides.effects
    },
    ...overrides
  });


/* ============================================================================
   TEXT OBJECT
============================================================================ */

export const createTextObject = ({
  id = "text.heading",
  name = "Receipt Heading",
  role = "heading",
  text = "MERCHANT NAME",
  overrides = {}
} = {}) =>
  createBaseObject({
    id,
    type: OBJECT_TYPES.TEXT,
    name,
    role,
    transform: {
      x: 50,
      y: 220,
      width: 360,
      height: 48,
      ...overrides.transform
    },
    content: {
      text,
      editable: true,
      semantic: role,
      ...overrides.content
    },
    typography: {
      family: "Orbitron",
      weight: 700,
      size: 24,
      lineHeight: 1.15,
      letterSpacing: 1.5,
      alignment: "center",
      casing: "uppercase",
      ...overrides.typography
    },
    color: {
      color: "#EAFBFF",
      brightness: 1,
      contrast: 1,
      gradient: null,
      ...overrides.color
    },
    effects: {
      shadow: false,
      glow: false,
      neon: false,
      metallic: false,
      glass: false,
      holographic: false,
      pulse: false,
      ...overrides.effects
    },
    ...overrides
  });


/* ============================================================================
   RECEIPT SECTION OBJECT
============================================================================ */

export const createSectionObject = ({
  id = "section.header",
  name = "Header Module",
  role = "header",
  children = [],
  overrides = {}
} = {}) =>
  createBaseObject({
    id,
    type: OBJECT_TYPES.SECTION,
    name,
    role,
    transform: {
      x: 0,
      y: 0,
      width: 420,
      height: 180,
      ...overrides.transform
    },
    section: {
      semantic: role,
      children,
      flow: "vertical",
      gap: 12,
      padding: 20,
      alignment: "center",
      collapsible: false,
      ...overrides.section
    },
    style: {
      surface: "transparent",
      background: "transparent",
      border: false,
      ...overrides.style
    },
    ...overrides
  });


/* ============================================================================
   PRODUCT ITEM OBJECT
============================================================================ */

export const createProductObject = ({
  id = "product.001",
  name = "Product Item",
  productName = "Milk",
  price = "R32.00",
  quantity = 1,
  overrides = {}
} = {}) =>
  createBaseObject({
    id,
    type: OBJECT_TYPES.PRODUCT,
    name,
    role: "line_item",
    transform: {
      x: 0,
      y: 350,
      width: 420,
      height: 42,
      ...overrides.transform
    },
    product: {
      name: productName,
      quantity,
      price,
      sku: "",
      image: null,
      ...overrides.product
    },
    layout: {
      display: "row",
      nameAlignment: "left",
      priceAlignment: "right",
      gap: 12,
      ...overrides.layout
    },
    typography: {
      family: "Share Tech Mono",
      size: 14,
      weight: 400,
      ...overrides.typography
    },
    ...overrides
  });


/* ============================================================================
   TOTAL OBJECT
============================================================================ */

export const createTotalObject = (overrides = {}) =>
  createBaseObject({
    id: "total.grand",
    type: OBJECT_TYPES.TOTAL,
    name: "Grand Total",
    role: "grand_total",
    transform: {
      x: 0,
      y: 620,
      width: 420,
      height: 72,
      ...overrides.transform
    },
    total: {
      label: "TOTAL",
      value: "R105.30",
      currency: "ZAR",
      emphasis: "high",
      ...overrides.total
    },
    style: {
      background: "rgba(0, 217, 255, 0.04)",
      border: "1px solid rgba(0, 217, 255, 0.55)",
      radius: 16,
      padding: 16,
      ...overrides.style
    },
    typography: {
      family: "Orbitron",
      labelSize: 13,
      valueSize: 22,
      weight: 700,
      ...overrides.typography
    },
    ...overrides
  });


/* ============================================================================
   DIVIDER OBJECT
============================================================================ */

export const createDividerObject = (overrides = {}) =>
  createBaseObject({
    id: "divider.items",
    type: OBJECT_TYPES.DIVIDER,
    name: "Items Divider",
    role: "section_divider",
    transform: {
      x: 0,
      y: 325,
      width: 420,
      height: 1,
      ...overrides.transform
    },
    divider: {
      style: "dashed",
      thickness: 1,
      color: "#1A8DA3",
      opacity: 0.7,
      glow: false,
      ...overrides.divider
    },
    ...overrides
  });


/* ============================================================================
   ICON OBJECT
============================================================================ */

export const createIconObject = (overrides = {}) =>
  createBaseObject({
    id: "icon.brand",
    type: OBJECT_TYPES.ICON,
    name: "Social Icon",
    role: "social_icon",
    transform: {
      x: 50,
      y: 750,
      width: 34,
      height: 34,
      ...overrides.transform
    },
    icon: {
      library: "lucide",
      name: "MessageCircle",
      size: 20,
      strokeWidth: 1.8,
      color: "#00D9FF",
      ...overrides.icon
    },
    ...overrides
  });


/* ============================================================================
   FRAME OBJECT
============================================================================ */

export const createFrameObject = (overrides = {}) =>
  createBaseObject({
    id: "frame.receipt",
    type: OBJECT_TYPES.FRAME,
    name: "Receipt Frame",
    role: "receipt_frame",
    transform: {
      x: 0,
      y: 0,
      width: 420,
      height: 840,
      ...overrides.transform
    },
    frame: {
      style: "cyber-corner",
      borderWidth: 1,
      borderRadius: 24,
      color: "#00D9FF",
      glow: true,
      innerLine: true,
      ...overrides.frame
    },
    ...overrides
  });


/* ============================================================================
   BACKGROUND OBJECT
============================================================================ */

export const createBackgroundObject = (overrides = {}) =>
  createBaseObject({
    id: "background.receipt",
    type: OBJECT_TYPES.BACKGROUND,
    name: "Ambient Receipt Field",
    role: "receipt_background",
    transform: {
      x: 0,
      y: 0,
      width: 420,
      height: 840,
      ...overrides.transform
    },
    background: {
      mode: "gradient",
      base: "#03090D",
      secondary: "#07141A",
      accent: "#00D9FF",
      opacity: 1,
      grid: true,
      gridSize: 16,
      noise: false,
      ...overrides.background
    },
    ...overrides
  });


/* ============================================================================
   COMPLETE DEFAULT OBJECT GRAPH
============================================================================ */

export const createDefaultObjectGraph = () => ({
  version: "2.0",
  selectedId: "logo.primary",
  objects: [
    createBackgroundObject(),
    createFrameObject(),
    createLogoObject(),
    createTextObject({
      id: "text.heading",
      name: "Merchant Heading",
      role: "heading",
      text: "EDDIE'S ICECREAM LAND"
    }),
    createTextObject({
      id: "text.location",
      name: "Merchant Location",
      role: "location",
      text: "7 Angelo, Beverly Hills, California",
      overrides: {
        transform: {
          y: 270,
          height: 30
        },
        typography: {
          size: 12,
          weight: 400,
          letterSpacing: 0.5
        }
      }
    }),
    createSectionObject({
      id: "section.items",
      name: "Purchased Items Module",
      role: "items",
      overrides: {
        transform: {
          y: 315,
          height: 210
        }
      }
    }),
    createProductObject({
      id: "product.001",
      productName: "Milk",
      price: "R32.00"
    }),
    createProductObject({
      id: "product.002",
      productName: "Bread",
      price: "R18.50",
      overrides: {
        transform: {
          y: 392
        }
      }
    }),
    createProductObject({
      id: "product.003",
      productName: "Eggs",
      price: "R41.00",
      overrides: {
        transform: {
          y: 434
        }
      }
    }),
    createDividerObject(),
    createTotalObject(),
    createQRCodeObject(),
    createIconObject()
  ]
});


/* ============================================================================
   OBJECT MODEL HELPERS
============================================================================ */

export const findObject = (graph, id) =>
  graph.objects.find((object) => object.id === id) || null;

export const updateObject = (graph, id, updater) => ({
  ...graph,
  objects: graph.objects.map((object) =>
    object.id === id
      ? typeof updater === "function"
        ? updater(object)
        : { ...object, ...updater }
      : object
  )
});

export const removeObject = (graph, id) => ({
  ...graph,
  objects: graph.objects.filter((object) => object.id !== id),
  selectedId: graph.selectedId === id ? null : graph.selectedId
});

export const duplicateObject = (graph, id) => {
  const source = findObject(graph, id);
  if (!source) return graph;

  const duplicate = {
    ...source,
    id: `${source.id}.copy.${Date.now()}`,
    name: `${source.name} Copy`,
    transform: {
      ...source.transform,
      x: source.transform.x + 18,
      y: source.transform.y + 18
    }
  };

  return {
    ...graph,
    objects: [...graph.objects, duplicate],
    selectedId: duplicate.id
  };
};


/* ============================================================================
   OBJECT → DESIGN CONFIG SERIALIZER
============================================================================ */

/*
This is the bridge between System B and the receipt renderer.

The object model remains editor-friendly.

The renderer-facing designConfig remains semantic.

This means the editor can work with objects while MatrixTillSlip continues
to consume a clean designConfig object.
*/

export const serializeObjectGraphToDesignConfig = (graph) => {
  const config = {
    version: graph.version,
    logo: {},
    qr: {},
    text: {},
    sections: {},
    products: {},
    totals: {},
    dividers: {},
    icons: {},
    frame: {},
    background: {}
  };

  graph.objects.forEach((object) => {
    if (!object.visible) return;

    const common = {
      id: object.id,
      visible: object.visible,
      locked: object.locked,
      transform: object.transform
    };

    switch (object.type) {
      case OBJECT_TYPES.LOGO:
        config.logo = {
          ...common,
          layout: object.layout,
          data: object.data,
          color: object.color,
          effects: object.effects
        };
        break;

      case OBJECT_TYPES.QR:
        config.qr = {
          ...common,
          layout: object.layout,
          data: object.data,
          effects: object.effects
        };
        break;

      case OBJECT_TYPES.TEXT:
        config.text[object.role] = {
          ...common,
          content: object.content,
          typography: object.typography,
          color: object.color,
          effects: object.effects
        };
        break;

      case OBJECT_TYPES.SECTION:
        config.sections[object.role] = {
          ...common,
          section: object.section,
          style: object.style
        };
        break;

      case OBJECT_TYPES.PRODUCT:
        config.products[object.id] = {
          ...common,
          product: object.product,
          layout: object.layout,
          typography: object.typography
        };
        break;

      case OBJECT_TYPES.TOTAL:
        config.totals[object.role] = {
          ...common,
          total: object.total,
          style: object.style,
          typography: object.typography
        };
        break;

      case OBJECT_TYPES.DIVIDER:
        config.dividers[object.role] = {
          ...common,
          divider: object.divider
        };
        break;

      case OBJECT_TYPES.ICON:
        config.icons[object.id] = {
          ...common,
          icon: object.icon
        };
        break;

      case OBJECT_TYPES.FRAME:
        config.frame = {
          ...common,
          frame: object.frame
        };
        break;

      case OBJECT_TYPES.BACKGROUND:
        config.background = {
          ...common,
          background: object.background
        };
        break;

      default:
        break;
    }
  });

  return config;
};


/* ============================================================================
   FUTURISTIC STYLE SYSTEM
============================================================================ */

const styles = {
  shell: {
    minHeight: "100vh",
    background:
      "radial-gradient(circle at 50% -10%, rgba(0,217,255,.09), transparent 30%), #030507",
    color: "#EAFBFF",
    fontFamily: '"Inter", "Segoe UI", sans-serif',
    display: "flex",
    flexDirection: "column",
    overflow: "hidden"
  },

  topbar: {
    height: 68,
    flexShrink: 0,
    borderBottom: "1px solid rgba(0,217,255,.13)",
    background: "rgba(5,9,13,.94)",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 22px",
    boxShadow: "0 8px 40px rgba(0,0,0,.45)"
  },

  brand: {
    display: "flex",
    alignItems: "center",
    gap: 12
  },

  brandMark: {
    width: 38,
    height: 38,
    borderRadius: 10,
    display: "grid",
    placeItems: "center",
    background: "linear-gradient(145deg,#0bdfff,#057a9b)",
    color: "#001015",
    boxShadow: "0 0 24px rgba(0,217,255,.25)"
  },

  brandTitle: {
    fontSize: 13,
    fontWeight: 800,
    letterSpacing: ".12em"
  },

  brandSub: {
    color: "#52727D",
    fontSize: 9,
    letterSpacing: ".12em",
    marginTop: 3
  },

  modeBadge: {
    padding: "5px 9px",
    border: "1px solid rgba(0,217,255,.3)",
    borderRadius: 999,
    color: "#00D9FF",
    fontSize: 9,
    fontWeight: 800,
    letterSpacing: ".13em"
  },

  topActions: {
    display: "flex",
    alignItems: "center",
    gap: 8
  },

  topButton: {
    height: 34,
    padding: "0 12px",
    border: "1px solid rgba(130,180,195,.12)",
    borderRadius: 8,
    background: "#080D12",
    color: "#91AAB3",
    display: "flex",
    alignItems: "center",
    gap: 7,
    fontSize: 10,
    cursor: "pointer"
  },

  main: {
    flex: 1,
    minHeight: 0,
    display: "grid",
    gridTemplateColumns: "286px minmax(500px,1fr) 310px"
  },

  panel: {
    minWidth: 0,
    minHeight: 0,
    background: "rgba(6,10,14,.95)",
    borderRight: "1px solid rgba(0,217,255,.09)"
  },

  rightPanel: {
    borderRight: 0,
    borderLeft: "1px solid rgba(0,217,255,.09)"
  },

  panelHeader: {
    height: 52,
    padding: "0 15px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottom: "1px solid rgba(255,255,255,.055)"
  },

  panelTitle: {
    fontSize: 10,
    fontWeight: 800,
    letterSpacing: ".14em",
    color: "#A7C1C9"
  },

  panelCaption: {
    color: "#36545F",
    fontSize: 8,
    letterSpacing: ".12em"
  },

  search: {
    margin: 12,
    height: 34,
    borderRadius: 8,
    border: "1px solid rgba(0,217,255,.1)",
    background: "#04080B",
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "0 10px",
    color: "#486873"
  },

  input: {
    flex: 1,
    minWidth: 0,
    background: "transparent",
    border: 0,
    outline: 0,
    color: "#D9F7FC",
    fontSize: 10
  },

  objectGroup: {
    padding: "9px 10px 4px"
  },

  groupLabel: {
    color: "#31515C",
    fontSize: 8,
    fontWeight: 800,
    letterSpacing: ".18em",
    padding: "7px 5px"
  },

  objectRow: {
    minHeight: 38,
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "0 8px",
    borderRadius: 7,
    color: "#8EAAB2",
    cursor: "pointer",
    fontSize: 10,
    transition: "all .18s ease"
  },

  objectRowActive: {
    background:
      "linear-gradient(90deg, rgba(0,217,255,.14), rgba(0,217,255,.025))",
    color: "#DFFBFF",
    boxShadow: "inset 2px 0 0 #00D9FF"
  },

  objectIcon: {
    width: 27,
    height: 27,
    display: "grid",
    placeItems: "center",
    border: "1px solid rgba(0,217,255,.12)",
    background: "#081016",
    borderRadius: 6,
    flexShrink: 0
  },

  objectMeta: {
    minWidth: 0,
    flex: 1
  },

  objectName: {
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap"
  },

  objectType: {
    color: "#355762",
    fontSize: 7,
    letterSpacing: ".1em",
    marginTop: 2
  },

  canvasArea: {
    position: "relative",
    minWidth: 0,
    minHeight: 0,
    background:
      "radial-gradient(circle at 50% 45%, rgba(0,150,190,.08), transparent 33%), #020507",
    overflow: "hidden"
  },

  canvasToolbar: {
    height: 50,
    borderBottom: "1px solid rgba(0,217,255,.08)",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 14px",
    background: "rgba(5,8,11,.72)"
  },

  toolCluster: {
    display: "flex",
    alignItems: "center",
    gap: 5
  },

  toolButton: {
    width: 32,
    height: 32,
    border: "1px solid rgba(0,217,255,.1)",
    background: "#070C10",
    color: "#65818A",
    borderRadius: 7,
    display: "grid",
    placeItems: "center",
    cursor: "pointer"
  },

  canvas: {
    position: "absolute",
    inset: "50px 0 0",
    backgroundImage:
      "linear-gradient(rgba(0,217,255,.035) 1px, transparent 1px), linear-gradient(90deg, rgba(0,217,255,.035) 1px, transparent 1px)",
    backgroundSize: "32px 32px"
  },

  stage: {
    position: "absolute",
    left: "50%",
    top: "50%",
    transform: "translate(-50%,-50%) perspective(1100px) rotateX(2deg)",
    width: 300,
    height: 600,
    background:
      "linear-gradient(155deg, rgba(10,31,38,.98), rgba(1,8,11,.98))",
    border: "1px solid rgba(0,217,255,.6)",
    borderRadius: 22,
    boxShadow:
      "0 0 0 1px rgba(0,217,255,.08), 0 0 80px rgba(0,190,230,.14), inset 0 0 80px rgba(0,217,255,.025)",
    overflow: "hidden"
  },

  stageGrid: {
    position: "absolute",
    inset: 0,
    backgroundImage:
      "linear-gradient(rgba(0,217,255,.07) 1px, transparent 1px), linear-gradient(90deg, rgba(0,217,255,.07) 1px, transparent 1px)",
    backgroundSize: "20px 20px",
    opacity: .55
  },

  receiptHeader: {
    position: "relative",
    zIndex: 2,
    padding: 22,
    textAlign: "center"
  },

  logoPlaceholder: {
    width: 62,
    height: 62,
    margin: "0 auto 12px",
    borderRadius: 16,
    border: "1px solid rgba(0,217,255,.55)",
    background: "rgba(0,217,255,.06)",
    display: "grid",
    placeItems: "center",
    color: "#00D9FF",
    boxShadow: "0 0 28px rgba(0,217,255,.12)"
  },

  receiptTitle: {
    fontSize: 13,
    fontWeight: 800,
    letterSpacing: ".12em",
    color: "#E9FCFF"
  },

  receiptSub: {
    fontSize: 8,
    color: "#57818D",
    letterSpacing: ".12em",
    marginTop: 5
  },

  receiptLine: {
    height: 1,
    margin: "18px 20px",
    background: "linear-gradient(90deg,transparent,#00D9FF,transparent)",
    opacity: .65
  },

  itemLine: {
    display: "flex",
    justifyContent: "space-between",
    padding: "7px 24px",
    color: "#91B1B9",
    fontSize: 9,
    fontFamily: '"Share Tech Mono", monospace'
  },

  totalBox: {
    margin: 20,
    padding: 13,
    borderRadius: 13,
    border: "1px solid rgba(0,217,255,.48)",
    background: "rgba(0,217,255,.04)",
    display: "flex",
    justifyContent: "space-between",
    color: "#00D9FF",
    fontFamily: '"Orbitron", monospace',
    fontSize: 10
  },

  qrBox: {
    width: 82,
    height: 82,
    margin: "24px auto",
    borderRadius: 12,
    background:
      "repeating-linear-gradient(45deg,#EFFFFF 0 3px,#071116 3px 6px)",
    border: "6px solid #071116",
    boxShadow: "0 0 24px rgba(0,217,255,.2)"
  },

  selection: {
    position: "absolute",
    inset: 10,
    border: "1px dashed rgba(0,217,255,.8)",
    borderRadius: 16,
    pointerEvents: "none"
  },

  inspectorSection: {
    borderBottom: "1px solid rgba(255,255,255,.05)",
    padding: "13px 14px"
  },

  inspectorLabel: {
    color: "#466772",
    fontSize: 8,
    fontWeight: 800,
    letterSpacing: ".16em",
    marginBottom: 11
  },

  propertyRow: {
    display: "grid",
    gridTemplateColumns: "88px 1fr",
    gap: 8,
    alignItems: "center",
    marginBottom: 8
  },

  propertyName: {
    color: "#6E8C95",
    fontSize: 9
  },

  valueBox: {
    height: 28,
    border: "1px solid rgba(0,217,255,.1)",
    borderRadius: 6,
    background: "#04090D",
    display: "flex",
    alignItems: "center",
    padding: "0 8px",
    color: "#BCEBF2",
    fontSize: 9
  },

  statusBar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 30,
    borderTop: "1px solid rgba(0,217,255,.08)",
    background: "#04080B",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 12px",
    color: "#45616A",
    fontSize: 8,
    letterSpacing: ".08em"
  },

  footer: {
    height: 38,
    borderTop: "1px solid rgba(0,217,255,.08)",
    background: "#030608",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 16px",
    color: "#42616B",
    fontSize: 8
  }
};


/* ============================================================================
   SMALL UI COMPONENTS
============================================================================ */

function ObjectIcon({ type, size = 14 }) {
  const Icon = OBJECT_ICONS[type] || Box;
  return <Icon size={size} />;
}

function SectionTitle({ icon: Icon, title, caption }) {
  return (
    <div style={styles.panelHeader}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        {Icon && <Icon size={13} color="#00D9FF" />}
        <div>
          <div style={styles.panelTitle}>{title}</div>
          {caption && <div style={styles.panelCaption}>{caption}</div>}
        </div>
      </div>
    </div>
  );
}

function Property({ label, value }) {
  return (
    <div style={styles.propertyRow}>
      <span style={styles.propertyName}>{label}</span>
      <div style={styles.valueBox}>{value}</div>
    </div>
  );
}


/* ============================================================================
   OBJECT MODEL TREE
============================================================================ */

function ObjectTree({
  graph,
  selectedId,
  onSelect,
  onToggleVisibility,
  onToggleLock
}) {
  const groups = useMemo(() => {
    const groupMap = {};

    graph.objects.forEach((object) => {
      const key =
        object.type === OBJECT_TYPES.PRODUCT
          ? "product"
          : object.type === OBJECT_TYPES.TEXT
            ? "text"
            : object.type;

      if (!groupMap[key]) groupMap[key] = [];
      groupMap[key].push(object);
    });

    return groupMap;
  }, [graph.objects]);

  const groupOrder = [
    "background",
    "frame",
    "logo",
    "qr",
    "text",
    "section",
    "product",
    "total",
    "divider",
    "icon"
  ];

  return (
    <div style={{ paddingBottom: 70 }}>
      {groupOrder.map((group) => {
        const objects = groups[group];
        if (!objects?.length) return null;

        return (
          <div key={group} style={styles.objectGroup}>
            <div style={styles.groupLabel}>
              {OBJECT_LABELS[group] || group.toUpperCase()}
            </div>

            {objects.map((object) => {
              const active = selectedId === object.id;

              return (
                <div
                  key={object.id}
                  style={{
                    ...styles.objectRow,
                    ...(active ? styles.objectRowActive : {}),
                    opacity: object.visible ? 1 : 0.42
                  }}
                  onClick={() => onSelect(object.id)}
                >
                  <GripVertical size={10} color="#28444D" />

                  <div style={styles.objectIcon}>
                    <ObjectIcon type={object.type} size={13} />
                  </div>

                  <div style={styles.objectMeta}>
                    <div style={styles.objectName}>{object.name}</div>
                    <div style={styles.objectType}>
                      {object.type.toUpperCase()} / {object.role}
                    </div>
                  </div>

                  <button
                    style={{
                      background: "transparent",
                      border: 0,
                      color: "#46636C",
                      cursor: "pointer",
                      padding: 3
                    }}
                    onClick={(event) => {
                      event.stopPropagation();
                      onToggleVisibility(object.id);
                    }}
                  >
                    {object.visible ? (
                      <Eye size={11} />
                    ) : (
                      <EyeOff size={11} />
                    )}
                  </button>

                  <button
                    style={{
                      background: "transparent",
                      border: 0,
                      color: "#46636C",
                      cursor: "pointer",
                      padding: 3
                    }}
                    onClick={(event) => {
                      event.stopPropagation();
                      onToggleLock(object.id);
                    }}
                  >
                    {object.locked ? (
                      <Lock size={11} />
                    ) : (
                      <Unlock size={11} />
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}


/* ============================================================================
   SYSTEM B MAIN COMPONENT
============================================================================ */

export default function RuachAgentObjectModelStudio({
  initialObjectGraph,
  onObjectGraphChange,
  onDesignConfigChange
}) {
  const [graph, setGraph] = useState(
    initialObjectGraph || createDefaultObjectGraph()
  );

  const [search, setSearch] = useState("");
  const [activeWorkspace, setActiveWorkspace] = useState("objects");
  const [showGrid, setShowGrid] = useState(true);

  const selectedObject = useMemo(
    () => findObject(graph, graph.selectedId),
    [graph]
  );

  const commitGraph = (nextGraph) => {
    setGraph(nextGraph);

    if (typeof onObjectGraphChange === "function") {
      onObjectGraphChange(nextGraph);
    }

    if (typeof onDesignConfigChange === "function") {
      onDesignConfigChange(serializeObjectGraphToDesignConfig(nextGraph));
    }
  };

  const selectObject = (id) => {
    commitGraph({
      ...graph,
      selectedId: id
    });
  };

  const toggleVisibility = (id) => {
    commitGraph(
      updateObject(graph, id, (object) => ({
        ...object,
        visible: !object.visible
      }))
    );
  };

  const toggleLock = (id) => {
    commitGraph(
      updateObject(graph, id, (object) => ({
        ...object,
        locked: !object.locked
      }))
    );
  };

  const duplicateSelected = () => {
    if (!selectedObject) return;
    commitGraph(duplicateObject(graph, selectedObject.id));
  };

  const deleteSelected = () => {
    if (!selectedObject) return;
    commitGraph(removeObject(graph, selectedObject.id));
  };

  const updateSelectedTransform = (key, value) => {
    if (!selectedObject || selectedObject.locked) return;

    commitGraph(
      updateObject(graph, selectedObject.id, (object) => ({
        ...object,
        transform: {
          ...object.transform,
          [key]: value
        }
      }))
    );
  };

  const filteredObjects = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return graph.objects;

    return graph.objects.filter((object) =>
      `${object.name} ${object.type} ${object.role}`
        .toLowerCase()
        .includes(query)
    );
  }, [graph.objects, search]);

  const visibleGraph = {
    ...graph,
    objects: filteredObjects
  };

  return (
    <div style={styles.shell}>
      {/* TOP COMMAND BAR */}
      <header style={styles.topbar}>
        <div style={styles.brand}>
          <div style={styles.brandMark}>
            <Orbit size={20} />
          </div>

          <div>
            <div style={styles.brandTitle}>
              RUACHAGENT / OBJECT ARCHITECT
            </div>
            <div style={styles.brandSub}>
              SYSTEM B · RECEIPT OBJECT MODEL · MATRIX RENDER PIPELINE
            </div>
          </div>

          <span style={styles.modeBadge}>OBJECT ENGINE</span>
        </div>

        <div style={styles.topActions}>
          <button style={styles.topButton}>
            <Database size={12} />
            OBJECT GRAPH
          </button>

          <button style={styles.topButton}>
            <Command size={12} />
            SCHEMA 2.0
          </button>

          <button style={styles.topButton}>
            <Activity size={12} />
            LIVE MODEL
          </button>
        </div>
      </header>


      {/* THREE COLUMN EDITING ENVIRONMENT */}
      <main style={styles.main}>

        {/* ================================================================
            LEFT — OBJECT ARCHITECTURE
        ================================================================= */}
        <aside style={styles.panel}>
          <SectionTitle
            icon={Layers3}
            title="OBJECT ARCHITECTURE"
            caption="ENTITY GRAPH"
          />

          <div style={styles.search}>
            <Search size={13} />
            <input
              style={styles.input}
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search object nodes..."
            />
          </div>

          <div
            style={{
              padding: "0 12px 10px",
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: 5
            }}
          >
            {[
              ["objects", Box],
              ["layers", Layers],
              ["schema", Database]
            ].map(([key, Icon]) => (
              <button
                key={key}
                onClick={() => setActiveWorkspace(key)}
                style={{
                  height: 31,
                  borderRadius: 6,
                  border:
                    activeWorkspace === key
                      ? "1px solid rgba(0,217,255,.4)"
                      : "1px solid rgba(255,255,255,.06)",
                  background:
                    activeWorkspace === key
                      ? "rgba(0,217,255,.09)"
                      : "#050A0D",
                  color:
                    activeWorkspace === key ? "#00D9FF" : "#4F6C75",
                  fontSize: 7,
                  fontWeight: 800,
                  letterSpacing: ".1em",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 4,
                  cursor: "pointer"
                }}
              >
                <Icon size={11} />
                {key.toUpperCase()}
              </button>
            ))}
          </div>

          {activeWorkspace === "objects" && (
            <ObjectTree
              graph={visibleGraph}
              selectedId={graph.selectedId}
              onSelect={selectObject}
              onToggleVisibility={toggleVisibility}
              onToggleLock={toggleLock}
            />
          )}

          {activeWorkspace === "layers" && (
            <div style={{ padding: 14 }}>
              <div style={styles.groupLabel}>DEPTH STACK</div>

              {[...graph.objects]
                .sort(
                  (a, b) =>
                    (b.transform.zIndex || 0) -
                    (a.transform.zIndex || 0)
                )
                .map((object, index) => (
                  <div
                    key={object.id}
                    style={{
                      ...styles.objectRow,
                      background:
                        index === 0
                          ? "rgba(0,217,255,.045)"
                          : "transparent"
                    }}
                  >
                    <span
                      style={{
                        width: 23,
                        color: "#294750",
                        fontFamily: "monospace",
                        fontSize: 8
                      }}
                    >
                      {String(index).padStart(2, "0")}
                    </span>

                    <ObjectIcon type={object.type} size={12} />

                    <div style={styles.objectMeta}>
                      <div style={styles.objectName}>{object.name}</div>
                      <div style={styles.objectType}>
                        Z {object.transform.zIndex || 0}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}

          {activeWorkspace === "schema" && (
            <div style={{ padding: 14 }}>
              <div style={styles.groupLabel}>SCHEMA TELEMETRY</div>

              <Property label="VERSION" value={graph.version} />
              <Property
                label="OBJECTS"
                value={`${graph.objects.length} NODES`}
              />
              <Property
                label="SELECTED"
                value={graph.selectedId || "NONE"}
              />
              <Property
                label="VISIBLE"
                value={`${graph.objects.filter((o) => o.visible).length}`}
              />
              <Property
                label="LOCKED"
                value={`${graph.objects.filter((o) => o.locked).length}`}
              />
            </div>
          )}
        </aside>


        {/* ================================================================
            CENTER — 3D OBJECT STAGE
        ================================================================= */}
        <section style={styles.canvasArea}>
          <div style={styles.canvasToolbar}>
            <div style={styles.toolCluster}>
              <button style={styles.toolButton} title="Select">
                <MousePointer2 size={14} />
              </button>

              <button style={styles.toolButton} title="Move">
                <Move3D size={14} />
              </button>

              <button style={styles.toolButton} title="Transform">
                <Maximize2 size={14} />
              </button>

              <button style={styles.toolButton} title="Rotate">
                <Rotate3D size={14} />
              </button>

              <button style={styles.toolButton} title="Pivot">
                <Crosshair size={14} />
              </button>
            </div>

            <div style={styles.toolCluster}>
              <button
                style={{
                  ...styles.topButton,
                  height: 30,
                  color: showGrid ? "#00D9FF" : "#526C75"
                }}
                onClick={() => setShowGrid((value) => !value)}
              >
                <Grid3X3 size={12} />
                GRID
              </button>

              <button style={{ ...styles.topButton, height: 30 }}>
                <Cuboid size={12} />
                3D SPACE
              </button>

              <button style={{ ...styles.topButton, height: 30 }}>
                78%
              </button>
            </div>
          </div>

          <div
            style={{
              ...styles.canvas,
              backgroundImage: showGrid
                ? styles.canvas.backgroundImage
                : "none"
            }}
          >
            <div style={styles.stage}>
              <div style={styles.stageGrid} />

              <div style={styles.receiptHeader}>
                <div style={styles.logoPlaceholder}>
                  <Image size={27} />
                </div>

                <div style={styles.receiptTitle}>
                  EDDIE'S ICECREAM LAND
                </div>

                <div style={styles.receiptSub}>
                  SWEET MOMENTS / MADE FOR YOU
                </div>
              </div>

              <div style={styles.receiptLine} />

              <div
                style={{
                  textAlign: "center",
                  color: "#52737D",
                  fontSize: 8,
                  letterSpacing: ".13em"
                }}
              >
                TRANSACTION NODE
              </div>

              <div style={styles.receiptLine} />

              <div style={{ paddingTop: 4 }}>
                {[
                  ["MILK", "R32.00"],
                  ["BREAD", "R18.50"],
                  ["EGGS", "R41.00"]
                ].map(([name, price]) => (
                  <div key={name} style={styles.itemLine}>
                    <span>{name}</span>
                    <span>{price}</span>
                  </div>
                ))}
              </div>

              <div style={styles.totalBox}>
                <span>TOTAL</span>
                <span>R105.30</span>
              </div>

              <div style={styles.qrBox} />

              <div
                style={{
                  textAlign: "center",
                  color: "#466D77",
                  fontSize: 7,
                  letterSpacing: ".14em"
                }}
              >
                SCAN / VERIFY / RECEIPT NODE
              </div>

              <div style={styles.selection} />
            </div>

            {/* WORLD AXIS */}
            <div
              style={{
                position: "absolute",
                bottom: 52,
                left: 22,
                display: "flex",
                alignItems: "center",
                gap: 7,
                color: "#355761",
                fontSize: 8,
                letterSpacing: ".12em"
              }}
            >
              <Move3D size={12} color="#00D9FF" />
              WORLD / 0,0,0
            </div>

            {/* OBJECT TELEMETRY */}
            <div
              style={{
                position: "absolute",
                right: 22,
                bottom: 52,
                padding: "8px 10px",
                border: "1px solid rgba(0,217,255,.1)",
                borderRadius: 7,
                background: "rgba(3,8,11,.72)",
                color: "#486872",
                fontSize: 8,
                lineHeight: 1.7
              }}
            >
              <div>OBJECT: {selectedObject?.name || "NONE"}</div>
              <div>
                POS: {Math.round(selectedObject?.transform.x || 0)} /
                {Math.round(selectedObject?.transform.y || 0)}
              </div>
              <div>
                SCALE: {(selectedObject?.transform.scale || 1).toFixed(2)}X
              </div>
            </div>

            <div style={styles.statusBar}>
              <span>OBJECT SPACE · RECEIPT CANVAS · MATRIX GRID</span>
              <span>
                {graph.objects.length} NODES · {graph.objects.filter((o) => o.visible).length} ACTIVE
              </span>
            </div>
          </div>
        </section>


        {/* ================================================================
            RIGHT — OBJECT INSPECTOR
        ================================================================= */}
        <aside style={{ ...styles.panel, ...styles.rightPanel }}>
          <SectionTitle
            icon={SlidersHorizontal}
            title="OBJECT INSPECTOR"
            caption="SELECTED NODE"
          />

          {selectedObject ? (
            <>
              <div style={styles.inspectorSection}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 9
                  }}
                >
                  <div
                    style={{
                      ...styles.objectIcon,
                      width: 36,
                      height: 36
                    }}
                  >
                    <ObjectIcon type={selectedObject.type} size={17} />
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: 11,
                        fontWeight: 800,
                        color: "#DDF8FC"
                      }}
                    >
                      {selectedObject.name}
                    </div>

                    <div
                      style={{
                        color: "#3E6670",
                        fontSize: 7,
                        letterSpacing: ".12em",
                        marginTop: 3
                      }}
                    >
                      {selectedObject.type.toUpperCase()} ·{" "}
                      {selectedObject.role.toUpperCase()}
                    </div>
                  </div>

                  <button
                    style={{
                      ...styles.toolButton,
                      width: 29,
                      height: 29
                    }}
                    onClick={duplicateSelected}
                    title="Duplicate"
                  >
                    <Copy size={12} />
                  </button>

                  <button
                    style={{
                      ...styles.toolButton,
                      width: 29,
                      height: 29,
                      color: "#B95A68"
                    }}
                    onClick={deleteSelected}
                    title="Delete"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>

              <div style={styles.inspectorSection}>
                <div style={styles.inspectorLabel}>
                  TRANSFORM MATRIX
                </div>

                <Property
                  label="POSITION X"
                  value={
                    <input
                      type="number"
                      value={selectedObject.transform.x}
                      onChange={(event) =>
                        updateSelectedTransform(
                          "x",
                          Number(event.target.value)
                        )
                      }
                      style={{
                        ...styles.input,
                        width: "100%"
                      }}
                    />
                  }
                />

                <Property
                  label="POSITION Y"
                  value={
                    <input
                      type="number"
                      value={selectedObject.transform.y}
                      onChange={(event) =>
                        updateSelectedTransform(
                          "y",
                          Number(event.target.value)
                        )
                      }
                      style={{
                        ...styles.input,
                        width: "100%"
                      }}
                    />
                  }
                />

                <Property
                  label="WIDTH"
                  value={
                    <input
                      type="number"
                      value={selectedObject.transform.width}
                      onChange={(event) =>
                        updateSelectedTransform(
                          "width",
                          Number(event.target.value)
                        )
                      }
                      style={{
                        ...styles.input,
                        width: "100%"
                      }}
                    />
                  }
                />

                <Property
                  label="HEIGHT"
                  value={
                    <input
                      type="number"
                      value={selectedObject.transform.height}
                      onChange={(event) =>
                        updateSelectedTransform(
                          "height",
                          Number(event.target.value)
                        )
                      }
                      style={{
                        ...styles.input,
                        width: "100%"
                      }}
                    />
                  }
                />

                <Property
                  label="SCALE"
                  value={`${Math.round(
                    selectedObject.transform.scale * 100
                  )}%`}
                />

                <Property
                  label="ROTATION"
                  value={`${selectedObject.transform.rotation}°`}
                />

                <Property
                  label="OPACITY"
                  value={`${Math.round(
                    selectedObject.transform.opacity * 100
                  )}%`}
                />
              </div>

              <div style={styles.inspectorSection}>
                <div style={styles.inspectorLabel}>
                  NODE STATE
                </div>

                <Property
                  label="VISIBLE"
                  value={selectedObject.visible ? "ACTIVE" : "HIDDEN"}
                />

                <Property
                  label="LOCK"
                  value={selectedObject.locked ? "LOCKED" : "EDITABLE"}
                />

                <Property
                  label="SELECTABLE"
                  value={
                    selectedObject.selectable ? "ENABLED" : "DISABLED"
                  }
                />

                <Property
                  label="Z INDEX"
                  value={selectedObject.transform.zIndex}
                />
              </div>

              <div style={styles.inspectorSection}>
                <div style={styles.inspectorLabel}>
                  RENDER PIPELINE
                </div>

                <Property label="RENDERER" value="MATRIX ENGINE" />
                <Property label="SOURCE" value="DESIGN CONFIG" />
                <Property label="MUTATION" value="NON-JSX" />
                <Property label="SYNC" value="LIVE" />
              </div>

              {/* Type-specific telemetry */}
              <div style={styles.inspectorSection}>
                <div style={styles.inspectorLabel}>
                  NODE PARAMETERS
                </div>

                {selectedObject.type === OBJECT_TYPES.LOGO && (
                  <>
                    <Property
                      label="SHAPE"
                      value={selectedObject.data?.shape || "ROUNDED"}
                    />
                    <Property
                      label="FIT"
                      value={selectedObject.data?.fit || "CONTAIN"}
                    />
                    <Property
                      label="COLOR MODE"
                      value={selectedObject.color?.mode || "ORIGINAL"}
                    />
                  </>
                )}

                {selectedObject.type === OBJECT_TYPES.QR && (
                  <>
                    <Property
                      label="SHAPE"
                      value={selectedObject.layout?.shape || "SQUARE"}
                    />
                    <Property
                      label="ERROR CORR."
                      value={selectedObject.data?.errorCorrection || "H"}
                    />
                    <Property
                      label="GLOW"
                      value={selectedObject.effects?.glow ? "ON" : "OFF"}
                    />
                  </>
                )}

                {selectedObject.type === OBJECT_TYPES.TEXT && (
                  <>
                    <Property
                      label="FONT"
                      value={selectedObject.typography?.family}
                    />
                    <Property
                      label="SIZE"
                      value={`${selectedObject.typography?.size}px`}
                    />
                    <Property
                      label="WEIGHT"
                      value={selectedObject.typography?.weight}
                    />
                  </>
                )}

                {selectedObject.type === OBJECT_TYPES.PRODUCT && (
                  <>
                    <Property
                      label="PRODUCT"
                      value={selectedObject.product?.name}
                    />
                    <Property
                      label="PRICE"
                      value={selectedObject.product?.price}
                    />
                  </>
                )}

                {selectedObject.type === OBJECT_TYPES.TOTAL && (
                  <>
                    <Property
                      label="LABEL"
                      value={selectedObject.total?.label}
                    />
                    <Property
                      label="VALUE"
                      value={selectedObject.total?.value}
                    />
                  </>
                )}

                {selectedObject.type === OBJECT_TYPES.FRAME && (
                  <>
                    <Property
                      label="STYLE"
                      value={selectedObject.frame?.style}
                    />
                    <Property
                      label="GLOW"
                      value={selectedObject.frame?.glow ? "ON" : "OFF"}
                    />
                  </>
                )}

                {selectedObject.type === OBJECT_TYPES.BACKGROUND && (
                  <>
                    <Property
                      label="MODE"
                      value={selectedObject.background?.mode}
                    />
                    <Property
                      label="GRID"
                      value={
                        selectedObject.background?.grid ? "ON" : "OFF"
                      }
                    />
                  </>
                )}
              </div>
            </>
          ) : (
            <div
              style={{
                padding: 24,
                textAlign: "center",
                color: "#45626C"
              }}
            >
              <Box size={28} />
              <div
                style={{
                  marginTop: 12,
                  fontSize: 10,
                  fontWeight: 800,
                  letterSpacing: ".12em"
                }}
              >
                NO OBJECT SELECTED
              </div>
              <p
                style={{
                  fontSize: 8,
                  lineHeight: 1.6,
                  color: "#304B54"
                }}
              >
                Select a node from the object architecture to inspect its
                transform and semantic configuration.
              </p>
            </div>
          )}
        </aside>
      </main>


      {/* BOTTOM SYSTEM STATUS */}
      <footer style={styles.footer}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8
          }}
        >
          <Zap size={11} color="#00D9FF" />
          OBJECT GRAPH SYNCHRONIZED
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14
          }}
        >
          <span>10 OBJECT CLASSES</span>
          <span>NON-DESTRUCTIVE EDITING</span>
          <span>DESIGNCONFIG READY</span>
          <span style={{ color: "#00D9FF" }}>● LIVE</span>
        </div>
      </footer>
    </div>
  );
}


/*
===============================================================================
INTEGRATION EXAMPLE
===============================================================================

System A can mount System B like this:

<RuachAgentObjectModelStudio
    initialObjectGraph={objectGraph}
    onObjectGraphChange={(nextGraph) => {
        setObjectGraph(nextGraph);
    }}
    onDesignConfigChange={(nextDesignConfig) => {
        setReceiptData((previous) => ({
            ...previous,
            design_config: nextDesignConfig
        }));
    }}
/>


Then the eventual pipeline becomes:

    USER
      ↓
    OBJECT ARCHITECT
      ↓
    OBJECT GRAPH
      ↓
    serializeObjectGraphToDesignConfig()
      ↓
    receiptData.design_config
      ↓
    MatrixTillSlip
      ↓
    LIVE RECEIPT


===============================================================================
EXAMPLE OBJECT MODEL
===============================================================================

{
    id: "logo.primary",
    type: "logo",
    role: "merchant_brand",

    transform: {
        x: 50,
        y: 82,
        width: 180,
        height: 110,
        scale: 1,
        rotation: 0,
        opacity: 1
    },

    data: {
        url: "...",
        shape: "rounded",
        preserveAspectRatio: true
    },

    layout: {
        position: "center"
    },

    color: {
        mode: "original",
        brightness: 1,
        contrast: 1,
        saturation: 1
    },

    effects: {
        glow: true,
        floating: false,
        holographic: false
    }
}


The important part is that this remains DATA.

The JSX renderer does not get rewritten.

===============================================================================
*/