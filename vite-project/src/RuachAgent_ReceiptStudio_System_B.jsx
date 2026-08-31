import React, { useMemo, useState } from "react";

import {
  Search,
  Image as ImageIcon,
  QrCode,
  Type,
  ReceiptText,
  ShoppingBag,
  Calculator,
  Minus,
  Frame,
  Layers3,
  Eye,
  EyeOff,
  Crop,
  ZoomIn,
  ZoomOut,
  Shapes,
  Pipette,
  ChevronDown,
  ChevronRight,
  Move,
  RotateCw,
  Lock,
  Unlock,
  Maximize2,
  Plus,
  Trash2,
  GripVertical
} from "lucide-react";


/* ============================================================
   RUACHAGENT RECEIPT STUDIO
   SYSTEM B — PROPERTIES
   ============================================================

   RESPONSIBILITY:

   • Object selection
   • Object discovery
   • Crop
   • Zoom
   • Unzoom
   • Shape
   • Chroma Key
   • Visibility
   • Object-level layout configuration

   IMPORTANT:

   This component NEVER edits MatrixTillSlip.jsx.

   It only modifies designConfig.

   AdminPanel owns the live designConfig and passes it to:

       System B
          ↓
       AdminPanel state
          ↓
       MatrixTillSlip
          ↓
       Live Receipt Preview

   ============================================================ */


/* ============================================================
   DEFAULT OBJECT DEFINITIONS
   ============================================================ */

const OBJECT_GROUPS = [
  {
    id: "logo",
    label: "Logo",
    type: "Image",
    icon: ImageIcon
  },
  {
    id: "businessName",
    label: "Business Name",
    type: "Text",
    icon: Type
  },
  {
    id: "items",
    label: "Items List",
    type: "Table",
    icon: ShoppingBag
  },
  {
    id: "qrCode",
    label: "QR Code",
    type: "Image",
    icon: QrCode
  },
  {
    id: "voucher",
    label: "Voucher Section",
    type: "Section",
    icon: ReceiptText
  },
  {
    id: "total",
    label: "Total",
    type: "Calculation",
    icon: Calculator
  },
  {
    id: "divider",
    label: "Divider",
    type: "Line",
    icon: Minus
  },
  {
    id: "icons",
    label: "Icons",
    type: "Graphic",
    icon: Layers3
  },
  {
    id: "frame",
    label: "Receipt Frame",
    type: "Frame",
    icon: Frame
  },
  {
    id: "background",
    label: "Background",
    type: "Surface",
    icon: ReceiptText
  }
];


/* ============================================================
   SAFE CONFIGURATION HELPERS
   ============================================================ */

const cloneObject = (value) => {
  if (typeof structuredClone === "function") {
    try {
      return structuredClone(value);
    } catch {
      // Fall through.
    }
  }

  return JSON.parse(JSON.stringify(value || {}));
};


const getPath = (object, path, fallback = undefined) => {
  if (!object || !path) return fallback;

  const parts = path.split(".");
  let current = object;

  for (const part of parts) {
    if (
      current === null ||
      current === undefined ||
      typeof current !== "object"
    ) {
      return fallback;
    }

    current = current[part];
  }

  return current === undefined ? fallback : current;
};


const setPath = (object, path, value) => {
  const parts = path.split(".");
  let current = object;

  parts.forEach((part, index) => {
    if (index === parts.length - 1) {
      current[part] = value;
      return;
    }

    if (
      !current[part] ||
      typeof current[part] !== "object"
    ) {
      current[part] = {};
    }

    current = current[part];
  });
};


/* ============================================================
   SYSTEM B
   ============================================================ */

export default function RuachAgentReceiptStudioSystemB({

  /*
   * LIVE DESIGN CONFIGURATION
   */
  designConfig = {},

  /*
   * Required parent callback.
   *
   * System B calls this every time an editing
   * control changes.
   */
  onDesignConfigChange,

  /*
   * Optional direct state setter.
   *
   * Useful if AdminPanel passes setReceiptData-style
   * functionality.
   */
  setDesignConfig,

  /*
   * Optional callback when an object is selected.
   */
  selectedObjectId = "logo",
  onSelectObject,

  /*
   * Optional callback for the actual preview.
   */
  onObjectFocus,

  /*
   * Chroma Key is handled by the Studio/Canvas layer
   * because it needs to listen for clicks anywhere
   * on the application.
   */
  onStartChromaKey,

  /*
   * Receipt settings are useful for object discovery.
   */
  settings = {},

  /*
   * Search control.
   */
  searchPlaceholder = "Search elements..."
}) {


  /* ========================================================
     LOCAL UI STATE
     ======================================================== */

  const [search, setSearch] = useState("");

  const [expandedGroups, setExpandedGroups] = useState({
    logo: true,
    businessName: true,
    items: true,
    qrCode: true,
    voucher: true
  });

  const [aspectLocks, setAspectLocks] = useState({
    logo: true,
    qrCode: true
  });


  /* ========================================================
     CONFIGURATION WRITER
     ======================================================== */

  const updateConfig = (path, value) => {

    const nextConfig = cloneObject(designConfig);

    setPath(nextConfig, path, value);

    /*
     * Main architecture:
     *
     * System B
     *    ↓
     * AdminPanel state
     *    ↓
     * MatrixTillSlip
     */

    if (typeof onDesignConfigChange === "function") {
      onDesignConfigChange(nextConfig);
    }

    /*
     * Optional direct setter.
     */

    if (typeof setDesignConfig === "function") {
      setDesignConfig(nextConfig);
    }

    /*
     * Notify preview focus/update layer if supplied.
     */

    if (typeof onObjectFocus === "function") {
      onObjectFocus(selectedObjectId);
    }
  };


  /* ========================================================
     OBJECT SELECTION
     ======================================================== */

  const selectObject = (objectId) => {

    if (typeof onSelectObject === "function") {
      onSelectObject(objectId);
    }

    if (typeof onObjectFocus === "function") {
      onObjectFocus(objectId);
    }
  };


  /* ========================================================
     SEARCH
     ======================================================== */

  const filteredObjects = useMemo(() => {

    const normalizedSearch = search
      .trim()
      .toLowerCase();

    if (!normalizedSearch) {
      return OBJECT_GROUPS;
    }

    return OBJECT_GROUPS.filter((object) =>
      object.label
        .toLowerCase()
        .includes(normalizedSearch)
      ||
      object.type
        .toLowerCase()
        .includes(normalizedSearch)
    );

  }, [search]);


  /* ========================================================
     GROUP TOGGLE
     ======================================================== */

  const toggleGroup = (id) => {

    setExpandedGroups((current) => ({
      ...current,
      [id]: !current[id]
    }));
  };


  /* ========================================================
     OBJECT VISIBILITY
     ======================================================== */

  const getVisibility = (objectId) => {

    switch (objectId) {

      case "logo":
        return getPath(
          designConfig,
          "logo.enabled",
          true
        );

      case "qrCode":
        return getPath(
          designConfig,
          "qrCode.enabled",
          true
        );

      case "voucher":
        return getPath(
          designConfig,
          "receipt.showVoucher",
          true
        );

      default:
        return true;
    }
  };


  const toggleVisibility = (
    event,
    objectId
  ) => {

    event.stopPropagation();

    const current = getVisibility(objectId);

    switch (objectId) {

      case "logo":
        updateConfig(
          "logo.enabled",
          !current
        );
        break;

      case "qrCode":
        updateConfig(
          "qrCode.enabled",
          !current
        );
        break;

      case "voucher":
        updateConfig(
          "receipt.showVoucher",
          !current
        );
        break;

      default:
        break;
    }
  };


  /* ========================================================
     OBJECT-SPECIFIC CONFIGURATION
     ======================================================== */

  const getObjectConfiguration = (objectId) => {
    const layout = getPath(
      designConfig,
      `${objectId}.layout`,
      {}
    ) || {};

    return {
      zoom: Number(layout.zoom ?? layout.scale ?? 1),
      opacity: Number(layout.opacity ?? 1),
      width: layout.width ?? "",
      height: layout.height ?? "",
      shape: layout.shape ?? (objectId === "qrCode" ? "rounded" : "original"),
      cornerRadius: Number(layout.cornerRadius ?? 18),
      crop: {
        enabled: Boolean(layout.crop?.enabled),
        top: Number(layout.crop?.top ?? 0),
        right: Number(layout.crop?.right ?? 0),
        bottom: Number(layout.crop?.bottom ?? 0),
        left: Number(layout.crop?.left ?? 0)
      }
    };
  };


  /* ========================================================
     NUMERIC INPUT
     ======================================================== */

  const NumericControl = ({
    label,
    value,
    min,
    max,
    step = 0.01,
    suffix = "",
    onChange
  }) => (
    <div style={styles.controlRow}>
      <div style={styles.controlLabel}>{label}</div>
      <div style={styles.numericControl}>
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={Number.isFinite(Number(value)) ? value : min}
          onChange={(event) => onChange(Number(event.target.value))}
          style={styles.range}
        />
        <div style={styles.numericValue}>
          {Number(value).toFixed(step < 1 ? 2 : 0)}{suffix}
        </div>
      </div>
    </div>
  );


  /* ========================================================
     SELECT CONTROL
     ======================================================== */

  const SelectControl = ({ label, value, options, onChange }) => (
    <div style={styles.controlRow}>
      <div style={styles.controlLabel}>{label}</div>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        style={styles.select}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );


  /* ========================================================
     OBJECT TOOLS

     IMPORTANT:
     Crop / Zoom / Unzoom are intentionally available for every
     receipt object. Shape is restricted to Logo and QR Code.
     Chroma Key starts the Studio-wide colour picker through the
     parent callback.
     ======================================================== */

  const ObjectTools = ({ objectId }) => {
    const configuration = getObjectConfiguration(objectId);
    const isShapeSupported = objectId === "logo" || objectId === "qrCode";
    const isImageObject = objectId === "logo" || objectId === "qrCode";

    const updateLayout = (key, value) => {
      updateConfig(`${objectId}.layout.${key}`, value);
    };

    const updateCrop = (key, value) => {
      updateConfig(`${objectId}.layout.crop.${key}`, value);
    };

    const toggleCrop = () => {
      const enabled = !configuration.crop.enabled;

      updateConfig(
        `${objectId}.layout.crop`,
        {
          enabled,
          top: configuration.crop.top || (enabled ? 5 : 0),
          right: configuration.crop.right || (enabled ? 5 : 0),
          bottom: configuration.crop.bottom || (enabled ? 5 : 0),
          left: configuration.crop.left || (enabled ? 5 : 0)
        }
      );
    };

    const changeZoom = (amount) => {
      const current = Number(configuration.zoom || 1);
      const next = Math.min(4, Math.max(0.1, current + amount));

      updateLayout("zoom", Number(next.toFixed(2)));
    };

    const cycleShape = () => {
      const shapes = objectId === "logo"
        ? ["original", "circle", "rounded", "square"]
        : ["square", "rounded", "circle"];

      const current = configuration.shape;
      const index = shapes.indexOf(current);
      const next = shapes[(index + 1) % shapes.length];

      updateLayout("shape", next);
    };

    const startChromaKey = () => {
      if (typeof onStartChromaKey === "function") {
        onStartChromaKey(objectId);
        return;
      }

      /* Fallback event for System A / AdminPanel implementations that
         listen for the Studio-wide picker themselves. */
      window.dispatchEvent(
        new CustomEvent("ruachagent:start-chroma-key", {
          detail: { objectId }
        })
      );
    };

    return (
      <div>
        <div style={styles.toolStrip}>
          <ToolButton
            icon={Crop}
            label="Crop"
            active={configuration.crop.enabled}
            onClick={toggleCrop}
          />

          <ToolButton
            icon={ZoomIn}
            label="Zoom"
            onClick={() => changeZoom(0.1)}
          />

          <ToolButton
            icon={ZoomOut}
            label="Unzoom"
            onClick={() => changeZoom(-0.1)}
          />

          {isShapeSupported && (
            <ToolButton
              icon={Shapes}
              label="Shape"
              onClick={cycleShape}
              active
            />
          )}

          <ToolButton
            icon={Pipette}
            label="Chroma Key"
            active={Boolean(configuration.chromaKey?.enabled)}
            onClick={() => startChromaKey()}
          />
        </div>

        {configuration.crop.enabled && (
          <div style={styles.subPanel}>
            <div style={styles.subPanelTitle}>Crop Area</div>

            {[
              ["Top", "top"],
              ["Right", "right"],
              ["Bottom", "bottom"],
              ["Left", "left"]
            ].map(([label, key]) => (
              <NumericControl
                key={key}
                label={label}
                value={configuration.crop[key]}
                min={0}
                max={49}
                step={1}
                suffix="%"
                onChange={(value) => updateCrop(key, value)}
              />
            ))}
          </div>
        )}

        <div style={styles.subPanel}>
          <div style={styles.subPanelTitle}>Scale</div>

          <NumericControl
            label="Zoom"
            value={configuration.zoom}
            min={0.1}
            max={4}
            step={0.01}
            suffix="×"
            onChange={(value) => updateLayout("zoom", value)}
          />
        </div>

        {isImageObject && (
          <div style={styles.subPanel}>
            <div style={styles.subPanelTitle}>Image</div>

            <NumericControl
              label="Opacity"
              value={configuration.opacity}
              min={0}
              max={1}
              step={0.01}
              suffix=""
              onChange={(value) => updateLayout("opacity", value)}
            />

            {objectId === "qrCode" && (
              <NumericControl
                label="Corner Radius"
                value={configuration.cornerRadius}
                min={0}
                max={100}
                step={1}
                suffix="px"
                onChange={(value) => updateLayout("cornerRadius", value)}
              />
            )}
          </div>
        )}

        {objectId === "logo" && (
          <div style={styles.subPanel}>
            <div style={styles.subPanelTitle}>Logo Size</div>

            <DimensionInput
              label="Width"
              value={configuration.width}
              placeholder="Auto"
              onChange={(value) => updateLayout("width", value)}
            />

            <DimensionInput
              label="Height"
              value={configuration.height}
              placeholder="Auto"
              onChange={(value) => updateLayout("height", value)}
            />
          </div>
        )}
      </div>
    );
  };

  /* ========================================================
     DIMENSION INPUT
     ======================================================== */

  const DimensionInput = ({
    label,
    value,
    placeholder,
    onChange
  }) => {

    return (
      <div style={styles.dimensionRow}>

        <span style={styles.dimensionLabel}>
          {label}
        </span>

        <input
          type="text"
          value={value}
          placeholder={placeholder}
          onChange={(event) =>
            onChange(event.target.value)
          }
          style={styles.dimensionInput}
        />

      </div>
    );
  };


  /* ========================================================
     TOOL BUTTON
     ======================================================== */

  const ToolButton = ({
    icon: Icon,
    label,
    onClick,
    disabled = false,
    active = false
  }) => {

    return (
      <button
        type="button"
        disabled={disabled}
        onClick={onClick}
        style={{
          ...styles.toolButton,
          ...(disabled
            ? styles.toolButtonDisabled
            : {}),
          ...(active
            ? styles.toolButtonActive
            : {})
        }}
        title={
          disabled
            ? `${label} is not available for this object`
            : label
        }
      >

        <Icon size={15} />

        <span>
          {label}
        </span>

      </button>
    );
  };


  /* ========================================================
     RENDER
     ======================================================== */

  return (

    <section style={styles.container}>

      {/* =================================================
                HEADER
            ================================================== */}

      <div style={styles.header}>

        <div>

          <div style={styles.eyebrow}>
            RECEIPT STUDIO
          </div>

          <h2 style={styles.title}>
            Properties
          </h2>

          <p style={styles.subtitle}>
            Edit and transform receipt elements
          </p>

        </div>

      </div>


      {/* =================================================
                SEARCH
            ================================================== */}

      <div style={styles.searchWrapper}>

        <Search
          size={15}
          style={styles.searchIcon}
        />

        <input
          value={search}
          onChange={(event) =>
            setSearch(event.target.value)
          }
          placeholder={searchPlaceholder}
          style={styles.searchInput}
        />

      </div>


      {/* =================================================
                OBJECT LIST
            ================================================== */}

      <div style={styles.objectList}>

        {filteredObjects.map((object) => {

          const Icon = object.icon;

          const isSelected =
            selectedObjectId === object.id;

          const isExpanded =
            expandedGroups[object.id];

          const visible =
            getVisibility(object.id);

          return (

            <div
              key={object.id}
              style={{
                ...styles.objectCard,
                ...(isSelected
                  ? styles.objectCardSelected
                  : {})
              }}
            >

              {/* =================================
                               OBJECT HEADER
                            ================================== */}

              <div
                role="button"
                tabIndex={0}
                onClick={() => toggleGroup(object.id)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    toggleGroup(object.id);
                  }
                }}
                style={styles.objectHeader}
              >

                <div
                  style={
                    styles.objectHeaderLeft
                  }
                >

                  <div
                    style={
                      styles.objectChevron
                    }
                  >
                    {isExpanded
                      ? <ChevronDown
                        size={14}
                      />
                      : <ChevronRight
                        size={14}
                      />
                    }
                  </div>


                  <div
                    style={
                      styles.objectIcon
                    }
                  >
                    <Icon size={16} />
                  </div>


                  <div
                    style={
                      styles.objectIdentity
                    }
                  >

                    <strong>
                      {object.label}
                    </strong>

                    <span>
                      {object.type}
                    </span>

                  </div>

                </div>


                <button
                  type="button"
                  onClick={(event) =>
                    toggleVisibility(
                      event,
                      object.id
                    )
                  }
                  style={
                    styles.visibilityButton
                  }
                >

                  {visible
                    ? <Eye size={15} />
                    : <EyeOff size={15} />
                  }

                </button>

              </div>


              {/* =================================
                               OBJECT BODY
                            ================================== */}

              {isExpanded && (

                <div>

                  <button
                    type="button"
                    onClick={() =>
                      selectObject(
                        object.id
                      )
                    }
                    style={{
                      ...styles.selectObjectButton,
                      ...(isSelected
                        ? styles.selectObjectButtonActive
                        : {})
                    }}
                  >

                    <Move size={13} />

                    <span>
                      Edit this element
                    </span>

                  </button>


                  {isSelected && (

                    <ObjectTools
                      objectId={
                        object.id
                      }
                    />

                  )}

                </div>

              )}

            </div>

          );

        })}


        {filteredObjects.length === 0 && (

          <div style={styles.emptyState}>

            <Search size={22} />

            <strong>
              No elements found
            </strong>

            <span>
              Try another search.
            </span>

          </div>

        )}

      </div>


      {/* =================================================
                ADD ELEMENT
            ================================================== */}

      <button
        type="button"
        style={styles.addElementButton}
        onClick={() => {

          console.info(
            "Add New Element: reserved for future object model."
          );

        }}
      >

        <Plus size={16} />

        <span>
          Add New Element
        </span>

      </button>

    </section>
  );
}


/* ============================================================
   SYSTEM B STYLES
   ============================================================

   IMPORTANT:

   This deliberately follows the application's
   const styles pattern rather than using a separate CSS file.

   ============================================================ */

const styles = {

  container: {
    width: "100%",
    height: "100%",
    minHeight: 0,
    display: "flex",
    flexDirection: "column",
    background:
      "linear-gradient(180deg, #090d12 0%, #070b10 100%)",
    color: "#EAF7FF",
    fontFamily:
      '"Inter", "Segoe UI", system-ui, sans-serif',
    overflow: "hidden",
    boxSizing: "border-box"
  },


  header: {
    padding: "22px 22px 16px 22px",
    borderBottom:
      "1px solid rgba(0, 190, 255, 0.10)",
    background:
      "linear-gradient(180deg, rgba(16,24,33,.75), rgba(9,14,20,.4))"
  },


  eyebrow: {
    fontSize: "9px",
    fontWeight: "800",
    letterSpacing: "1.8px",
    color: "#00C8FF",
    marginBottom: "6px"
  },


  title: {
    margin: 0,
    fontSize: "17px",
    fontWeight: "800",
    letterSpacing: "-0.3px",
    color: "#F4FBFF"
  },


  subtitle: {
    margin: "5px 0 0 0",
    fontSize: "10px",
    color: "#718394",
    lineHeight: 1.5
  },


  searchWrapper: {
    position: "relative",
    margin: "15px 18px 10px 18px"
  },


  searchIcon: {
    position: "absolute",
    left: "13px",
    top: "50%",
    transform: "translateY(-50%)",
    color: "#607384",
    pointerEvents: "none"
  },


  searchInput: {
    width: "100%",
    height: "38px",
    boxSizing: "border-box",
    padding:
      "0 13px 0 38px",
    borderRadius: "8px",
    border:
      "1px solid rgba(135, 177, 205, 0.12)",
    background:
      "rgba(3, 8, 13, 0.75)",
    color: "#E8F6FF",
    outline: "none",
    fontSize: "11px"
  },


  objectList: {
    flex: 1,
    minHeight: 0,
    overflowY: "auto",
    padding: "4px 18px 18px 18px",
    scrollbarWidth: "thin"
  },


  objectCard: {
    marginBottom: "9px",
    borderRadius: "9px",
    border:
      "1px solid rgba(122, 161, 184, 0.10)",
    background:
      "linear-gradient(180deg, rgba(17,24,32,.82), rgba(9,14,20,.82))",
    overflow: "hidden",
    transition:
      "border-color .18s ease, box-shadow .18s ease"
  },


  objectCardSelected: {
    border:
      "1px solid rgba(0, 202, 255, 0.38)",
    boxShadow:
      "0 0 18px rgba(0, 179, 255, 0.08), inset 0 0 18px rgba(0,179,255,.025)"
  },


  objectHeader: {
    width: "100%",
    minHeight: "58px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    border: "none",
    background: "transparent",
    color: "inherit",
    padding: "9px 11px",
    cursor: "pointer",
    textAlign: "left"
  },


  objectHeaderLeft: {
    display: "flex",
    alignItems: "center",
    minWidth: 0,
    gap: "9px"
  },


  objectChevron: {
    width: "16px",
    color: "#627585",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },


  objectIcon: {
    width: "31px",
    height: "31px",
    borderRadius: "7px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background:
      "linear-gradient(135deg, rgba(0,195,255,.14), rgba(0,96,160,.07))",
    border:
      "1px solid rgba(0,195,255,.18)",
    color: "#00C8FF",
    flexShrink: 0
  },


  objectIdentity: {
    minWidth: 0,
    display: "flex",
    flexDirection: "column",
    gap: "3px"
  },


  visibilityButton: {
    width: "28px",
    height: "28px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "none",
    background: "transparent",
    color: "#718394",
    cursor: "pointer",
    borderRadius: "6px",
    flexShrink: 0
  },


  selectObjectButton: {
    width: "calc(100% - 20px)",
    margin: "0 10px 10px 10px",
    minHeight: "32px",
    borderRadius: "6px",
    border:
      "1px solid rgba(105,145,169,.12)",
    background:
      "rgba(255,255,255,.025)",
    color: "#8497A7",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "7px",
    fontSize: "9px",
    cursor: "pointer"
  },


  selectObjectButtonActive: {
    color: "#00D7FF",
    border:
      "1px solid rgba(0,211,255,.25)",
    background:
      "rgba(0,172,255,.06)",
    boxShadow:
      "inset 0 0 14px rgba(0,174,255,.04)"
  },


  toolStrip: {
    display: "grid",
    gridTemplateColumns:
      "repeat(5, minmax(0, 1fr))",
    margin:
      "0 10px 10px 10px",
    border:
      "1px solid rgba(103,146,171,.10)",
    borderRadius: "7px",
    overflow: "hidden",
    background:
      "rgba(1,6,10,.62)"
  },


  toolButton: {
    minWidth: 0,
    minHeight: "54px",
    border: "none",
    borderRight:
      "1px solid rgba(103,146,171,.09)",
    background: "transparent",
    color: "#8CA0AF",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "6px",
    fontSize: "8px",
    cursor: "pointer",
    transition:
      "color .15s ease, background .15s ease"
  },


  toolButtonDisabled: {
    opacity: 0.28,
    cursor: "not-allowed"
  },


  toolButtonActive: {
    color: "#00D9FF",
    background: "rgba(0,198,255,.08)",
    boxShadow: "inset 0 -2px 0 #00C8FF"
  },


  subPanel: {
    margin:
      "0 10px 10px 10px",
    padding: "12px",
    borderRadius: "7px",
    border:
      "1px solid rgba(98,142,167,.09)",
    background:
      "rgba(2,8,13,.55)"
  },


  subPanelTitle: {
    fontSize: "8px",
    fontWeight: "800",
    letterSpacing: "1.2px",
    textTransform: "uppercase",
    color: "#6D8291",
    marginBottom: "11px"
  },


  controlRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "10px",
    minHeight: "30px",
    marginBottom: "7px"
  },


  controlLabel: {
    minWidth: "74px",
    color: "#8295A5",
    fontSize: "9px"
  },


  numericControl: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    gap: "8px"
  },


  range: {
    flex: 1,
    minWidth: 0,
    accentColor: "#00C8FF",
    cursor: "pointer"
  },


  numericValue: {
    width: "48px",
    minWidth: "48px",
    height: "25px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "5px",
    border:
      "1px solid rgba(115,154,177,.12)",
    background:
      "rgba(255,255,255,.025)",
    color: "#CDEFFF",
    fontSize: "8px",
    fontFamily:
      '"JetBrains Mono", "SFMono-Regular", monospace'
  },


  select: {
    flex: 1,
    minWidth: 0,
    height: "28px",
    borderRadius: "5px",
    border:
      "1px solid rgba(115,154,177,.12)",
    background: "#0B1117",
    color: "#CDEFFF",
    outline: "none",
    fontSize: "9px",
    padding: "0 7px"
  },


  dimensionHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    color: "#647988",
    fontSize: "8px",
    marginBottom: "7px"
  },


  lockButton: {
    width: "24px",
    height: "24px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border:
      "1px solid rgba(0,197,255,.16)",
    background:
      "rgba(0,170,255,.04)",
    color: "#00C8FF",
    borderRadius: "5px",
    cursor: "pointer"
  },


  dimensionRow: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginBottom: "7px"
  },


  dimensionLabel: {
    width: "42px",
    color: "#728593",
    fontSize: "9px"
  },


  dimensionInput: {
    flex: 1,
    height: "28px",
    boxSizing: "border-box",
    borderRadius: "5px",
    border:
      "1px solid rgba(115,154,177,.12)",
    background:
      "rgba(255,255,255,.025)",
    color: "#D9F4FF",
    outline: "none",
    padding: "0 9px",
    fontSize: "9px"
  },


  emptyState: {
    minHeight: "180px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    color: "#637582",
    textAlign: "center",
    border:
      "1px dashed rgba(101,143,167,.12)",
    borderRadius: "9px",
    marginTop: "8px"
  },


  addElementButton: {
    margin: "0 18px 18px 18px",
    height: "44px",
    borderRadius: "8px",
    border:
      "1px solid rgba(0,198,255,.14)",
    background:
      "linear-gradient(180deg, rgba(0,170,255,.055), rgba(0,120,180,.025))",
    color: "#8DA6B6",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    fontSize: "10px",
    cursor: "pointer",
    flexShrink: 0
  }
};