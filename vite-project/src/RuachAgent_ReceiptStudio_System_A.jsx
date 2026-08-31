import React, { useState } from "react";
import {
  Menu,
  ChevronDown,
  Undo2,
  Redo2,
  ZoomIn,
  ZoomOut,
  Grid3X3,
  Magnet,
  Ruler,
  Sparkles,
  Download,
  Save,
  PanelBottom,
  PanelRight,
  Maximize2,
  CircleDot,
  Monitor,
  Tablet,
  Smartphone,
} from "lucide-react";

// ================================================================
// RECEIPT STUDIO MODULES
// System A is the outer shell. These three systems are mounted
// directly inside the shell so AdminPanel only needs to import A.
// ================================================================
import RuachAgentReceiptStudioSystemB from "./RuachAgent_ReceiptStudio_System_B";
import RuachAgentReceiptStudioSystemC from "./RuachAgent_ReceiptStudio_System_C";
import RuachAgentReceiptStudioSystemD from "./RuachAgent_ReceiptStudio_System_D";

/*
 * ================================================================
 * RUACHAGENT — RECEIPT EDITING STUDIO
 * SYSTEM A — STUDIO SHELL
 * ================================================================
 *
 * System A is intentionally a SHELL / COMPOSITION COMPONENT.
 *
 * It owns:
 *   - application chrome
 *   - top toolbar
 *   - workspace frame
 *   - left application rail
 *   - bottom status bar
 *   - global studio controls
 *
 * It does NOT own:
 *   - Object Model
 *   - Design Inspector
 *   - Canvas Renderer
 *   - Animation Timeline implementation
 *   - designConfig mutations
 *   - MatrixTillSlip rendering
 *
 * Those systems are mounted directly by System A.
 *
 * AdminPanel.jsx imports ONLY this shell. System A imports and composes:
 *   - System B — Properties
 *   - System C — Receipt Canvas
 *   - System D — Color Grading
 *
 * This keeps the studio as one application while the individual systems
 * remain separate files and separate responsibilities.
 */

const styles = {
  shell: {
    position: "relative",
    width: "100%",
    height: "100%",
    minHeight: "760px",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    background:
      "radial-gradient(circle at 50% -20%, rgba(0,150,255,.14), transparent 32%), radial-gradient(circle at 80% 100%, rgba(0,210,255,.07), transparent 28%), #05070a",
    color: "#e8f2ff",
    fontFamily:
      'Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif',
  },

  topbar: {
    height: 58,
    minHeight: 58,
    display: "flex",
    alignItems: "center",
    borderBottom: "1px solid rgba(104,151,190,.18)",
    background: "linear-gradient(180deg,#0d1218,#070a0e)",
    boxShadow: "0 8px 30px rgba(0,0,0,.35)",
    zIndex: 100,
  },

  topLeft: {
    width: 310,
    height: "100%",
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "0 12px",
    borderRight: "1px solid rgba(104,151,190,.12)",
    flexShrink: 0,
  },

  menu: {
    width: 34,
    height: 34,
    display: "grid",
    placeItems: "center",
    border: "1px solid rgba(120,170,210,.18)",
    borderRadius: 8,
    background: "rgba(255,255,255,.025)",
    color: "#a9c4dd",
    cursor: "pointer",
  },

  crumb: {
    minWidth: 0,
    display: "flex",
    alignItems: "center",
    gap: 7,
  },

  crumbMuted: {
    color: "#71859a",
    fontSize: 10,
    fontWeight: 800,
    letterSpacing: ".08em",
    whiteSpace: "nowrap",
  },

  crumbStrong: {
    color: "#f4f8fc",
    fontSize: 13,
    fontWeight: 900,
    whiteSpace: "nowrap",
  },

  pro: {
    padding: "3px 7px",
    borderRadius: 5,
    border: "1px solid rgba(0,230,255,.4)",
    background: "rgba(0,196,255,.08)",
    color: "#52eaff",
    fontSize: 8,
    fontWeight: 900,
    letterSpacing: ".12em",
  },

  topCenter: {
    flex: 1,
    minWidth: 0,
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },

  documentName: {
    color: "#dcecff",
    fontSize: 12,
    fontWeight: 800,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    maxWidth: 240,
  },

  live: {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    padding: "5px 9px",
    borderRadius: 999,
    border: "1px solid rgba(0,224,255,.24)",
    background: "rgba(0,224,255,.045)",
    color: "#76eaff",
    fontSize: 8,
    fontWeight: 800,
    whiteSpace: "nowrap",
  },

  dot: {
    width: 6,
    height: 6,
    borderRadius: "50%",
    background: "#16e6a0",
    boxShadow: "0 0 10px rgba(22,230,160,.8)",
  },

  topRight: {
    width: 430,
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 6,
    padding: "0 10px",
    flexShrink: 0,
  },

  group: {
    display: "flex",
    alignItems: "center",
    gap: 2,
    padding: 3,
    border: "1px solid rgba(115,156,190,.15)",
    borderRadius: 8,
    background: "rgba(255,255,255,.02)",
  },

  iconBtn: {
    height: 31,
    minWidth: 31,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    padding: "0 8px",
    border: "1px solid transparent",
    borderRadius: 6,
    background: "transparent",
    color: "#8fa6bc",
    cursor: "pointer",
    fontSize: 9,
    fontWeight: 800,
  },

  activeBtn: {
    background: "rgba(0,174,255,.10)",
    borderColor: "rgba(0,211,255,.25)",
    color: "#5fe8ff",
  },

  aiBtn: {
    height: 34,
    display: "inline-flex",
    alignItems: "center",
    gap: 7,
    padding: "0 12px",
    border: "1px solid rgba(115,156,190,.2)",
    borderRadius: 7,
    background: "linear-gradient(180deg,#19202a,#0c1016)",
    color: "#c5d8e9",
    cursor: "pointer",
    fontSize: 9,
    fontWeight: 800,
    whiteSpace: "nowrap",
  },

  exportBtn: {
    height: 34,
    display: "inline-flex",
    alignItems: "center",
    gap: 7,
    padding: "0 12px",
    border: "1px solid rgba(0,206,255,.32)",
    borderRadius: 7,
    background: "rgba(0,164,255,.05)",
    color: "#bfefff",
    cursor: "pointer",
    fontSize: 9,
    fontWeight: 800,
    whiteSpace: "nowrap",
  },

  saveBtn: {
    height: 34,
    display: "inline-flex",
    alignItems: "center",
    gap: 7,
    padding: "0 15px",
    border: "1px solid rgba(0,225,255,.45)",
    borderRadius: 7,
    background: "linear-gradient(135deg,#009fe3,#00c8f5)",
    color: "#001017",
    cursor: "pointer",
    fontSize: 9,
    fontWeight: 900,
    boxShadow: "0 0 24px rgba(0,188,255,.18)",
    whiteSpace: "nowrap",
  },

  body: {
    flex: 1,
    minHeight: 0,
    display: "flex",
    overflow: "hidden",
  },

  rail: {
    width: 54,
    minWidth: 54,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "9px 0",
    gap: 6,
    borderRight: "1px solid rgba(104,151,190,.14)",
    background: "linear-gradient(180deg,#080c11,#05080c)",
    zIndex: 90,
  },

  railBtn: {
    width: 38,
    height: 38,
    display: "grid",
    placeItems: "center",
    border: "1px solid transparent",
    borderRadius: 8,
    background: "transparent",
    color: "#617589",
    cursor: "pointer",
  },

  railActive: {
    color: "#57e7ff",
    borderColor: "rgba(0,218,255,.26)",
    background:
      "linear-gradient(180deg,rgba(0,185,255,.13),rgba(0,111,170,.05))",
    boxShadow: "inset 0 0 18px rgba(0,194,255,.06)",
  },

  railSpacer: {
    flex: 1,
  },

  workspace: {
    position: "relative",
    flex: 1,
    minWidth: 0,
    minHeight: 0,
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    background:
      "radial-gradient(circle at 50% 40%, rgba(0,115,180,.055), transparent 46%), #06090d",
  },

  workspaceInner: {
    position: "relative",
    flex: 1,
    minWidth: 0,
    minHeight: 0,
    overflow: "hidden",
  },

  workspaceGrid: {
    width: "100%",
    height: "100%",
    minWidth: 0,
    minHeight: 0,
    display: "grid",
    gridTemplateColumns: "285px minmax(360px, 1fr) 340px",
    overflow: "hidden",
  },

  bottom: {
    height: 36,
    minHeight: 36,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    padding: "0 12px",
    borderTop: "1px solid rgba(104,151,190,.12)",
    background: "linear-gradient(180deg,#080c11,#05080c)",
    zIndex: 80,
  },

  status: {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    color: "#698196",
    fontSize: 8,
  },

  statusGroup: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    minWidth: 0,
  },

  timelineDock: {
    position: "relative",
    width: "100%",
    minHeight: 0,
    borderTop: "1px solid rgba(104,151,190,.18)",
    background: "#06090d",
    boxShadow: "0 -12px 30px rgba(0,0,0,.25)",
    zIndex: 85,
  },

  backdrop: {
    position: "absolute",
    inset: 0,
    pointerEvents: "none",
    background:
      "linear-gradient(90deg,rgba(0,207,255,.025) 1px,transparent 1px),linear-gradient(rgba(0,207,255,.025) 1px,transparent 1px)",
    backgroundSize: "32px 32px",
    opacity: 0.55,
  },

  shortcutHint: {
    color: "#52687b",
    fontSize: 7,
    letterSpacing: ".06em",
    whiteSpace: "nowrap",
  },
};

export default function ReceiptStudioShell({
  // --------------------------------------------------------------
  // Global AdminPanel/backend callbacks
  // --------------------------------------------------------------
  onSave,
  onRevert,
  onAIAssist,
  onExport,
  isSaveSyncing = false,
  isLoading = false,
  documentName = "Matrix Neon Receipt",

  // --------------------------------------------------------------
  // Live receipt/editor state supplied by AdminPanel
  // --------------------------------------------------------------
  receiptData = {},
  settings = {},
  user = null,
  designConfig: externalDesignConfig = {},
  selectedTemplateId = "matrix-grid",
  selectedObjectId = null,
  selectedElementId = null,
  initialObjectGraph = null,

  // --------------------------------------------------------------
  // Cross-system state bridges
  // --------------------------------------------------------------
  onDesignConfigChange,
  onObjectGraphChange,
  onSelectObject,
  onSelectElement,
}) {

  // ==============================================================
  // SYSTEM A — SINGLE SOURCE OF TRUTH
  // ==============================================================

  /*
   * System A owns the active receipt element.
   *
   * Examples:
   *
   * "logo"
   * "businessName"
   * "qrCode"
   * "total"
   * "items"
   * "voucher"
   * "background"
   * "surface"
   */
  const [selectedElement, setSelectedElement] = useState(
    selectedElementId ||
    selectedObjectId ||
    null
  );


  /*
   * System A also owns the LIVE design configuration.
   *
   * This is extremely important.
   *
   * System D modifies this object.
   * System B modifies this object.
   * System C renders this object.
   *
   * AdminPanel remains responsible for persistence.
   */
  const [liveDesignConfig, setLiveDesignConfig] = useState(
    externalDesignConfig || {}
  );


  // ==============================================================
  // KEEP SYSTEM A SYNCHRONIZED WITH ADMINPANEL
  // ==============================================================

  /*
   * When AdminPanel changes the design configuration externally
   * (for example after loading a saved design from Supabase),
   * System A adopts that configuration.
   */
  useEffect(() => {
    setLiveDesignConfig(externalDesignConfig || {});
  }, [externalDesignConfig]);


  /*
   * If AdminPanel loads a selected element from outside the studio,
   * synchronize it into System A.
   */
  useEffect(() => {
    const incomingSelection =
      selectedElementId ||
      selectedObjectId ||
      null;

    if (incomingSelection !== selectedElement) {
      setSelectedElement(incomingSelection);
    }
  }, [selectedElementId, selectedObjectId]);


  // ==============================================================
  // ELEMENT SELECTION — SYSTEM A OWNS THIS
  // ==============================================================

  const handleElementSelect = (elementId) => {

    const normalizedElement =
      elementId || null;

    // System A state
    setSelectedElement(normalizedElement);

    // Synchronize with AdminPanel if a callback exists
    if (typeof onSelectElement === "function") {
      onSelectElement(normalizedElement);
    }

    // Keep legacy/object selection bridge synchronized
    if (typeof onSelectObject === "function") {
      onSelectObject(normalizedElement);
    }
  };


  // ==============================================================
  // DESIGN CONFIGURATION — SYSTEM A OWNS THE LIVE VERSION
  // ==============================================================

  const handleDesignConfigChange = (nextConfig) => {

    const normalizedConfig =
      nextConfig && typeof nextConfig === "object"
        ? nextConfig
        : {};

    /*
     * FIRST:
     *
     * Update System A immediately.
     *
     * This causes System C to receive the new configuration
     * immediately and therefore causes MatrixTillSlip to render it.
     */
    setLiveDesignConfig(normalizedConfig);


    /*
     * SECOND:
     *
     * Notify AdminPanel.
     *
     * AdminPanel can use this to update its receiptData/design state
     * and eventually persist it through handleSave().
     */
    if (typeof onDesignConfigChange === "function") {
      onDesignConfigChange(normalizedConfig);
    }
  };


  // ==============================================================
  // OBJECT SELECTION BRIDGE
  // ==============================================================

  const handleObjectSelect = (id) => {

    const normalizedId = id || null;

    /*
     * Object selection is also reflected as element selection.
     *
     * This prevents System B/C/D from becoming disconnected.
     */
    if (normalizedId) {
      setSelectedElement(normalizedId);
    }

    if (typeof onSelectObject === "function") {
      onSelectObject(normalizedId);
    }

    if (typeof onSelectElement === "function") {
      onSelectElement(normalizedId);
    }
  };

  // ==============================================================
  // CHROMA KEY STATE
  // ==============================================================

  const [chromaKeyMode, setChromaKeyMode] = useState(false);
  const [chromaKeyTarget, setChromaKeyTarget] = useState(null);

  const handleStartChromaKey = (objectId) => {
    setChromaKeyTarget(objectId);
    setChromaKeyMode(true);
  };


  // ==============================================================
  // STUDIO UI STATE
  // ==============================================================

  const [zoom, setZoom] = useState(78);
  const [grid, setGrid] = useState(true);
  const [snap, setSnap] = useState(true);
  const [fullscreen, setFullscreen] = useState(false);
  const [activeTool, setActiveTool] = useState("studio");


  // ==============================================================
  // RAIL TOOLS
  // ==============================================================

  const railTools = [
    { id: "studio", label: "Studio" },
    { id: "layers", label: "Layers" },
    { id: "assets", label: "Assets" },
    { id: "templates", label: "Templates" },
    { id: "settings", label: "Settings" },
  ];


  // ==============================================================
  // FULLSCREEN
  // ==============================================================

  const toggleFullscreen = () => {

    if (typeof document === "undefined") {
      return;
    }

    if (!document.fullscreenElement) {

      document.documentElement
        .requestFullscreen?.()
        .catch(() => { });

      setFullscreen(true);

    } else {

      document.exitFullscreen?.().catch(() => { });

      setFullscreen(false);
    }
  };


  // ==============================================================
  // RENDER
  // ==============================================================

  return (

    <div
      style={styles.shell}
      data-ruachagent-studio-shell="true"
    >

      {/* ==========================================================
          SYSTEM A — TOP APPLICATION CHROME
         ========================================================== */}

      <header style={styles.topbar}>

        <div style={styles.topLeft}>

          <button
            type="button"
            style={styles.menu}
            title="Studio menu"
            aria-label="Studio menu"
          >
            <Menu size={17} />
          </button>


          <div style={styles.crumb}>

            <span style={styles.crumbMuted}>
              RUACHAGENT / DESIGN STUDIO
            </span>

            <span
              style={{
                color: "#3f566b",
                fontSize: 11,
              }}
            >
              ›
            </span>

            <span style={styles.crumbStrong}>
              Receipt Editing Studio
            </span>

            <span style={styles.pro}>
              PRO
            </span>

          </div>

        </div>


        {/* ========================================================
            TOPBAR SPACE
            This pushes Save completely to the far right.
           ======================================================== */}

        <div style={styles.topbarSpacer} />


        {/* ========================================================
            SAVE
           ======================================================== */}

        <button
          type="button"
          style={{
            ...styles.saveBtn,
            opacity: isSaveSyncing ? 0.65 : 1,
          }}
          disabled={isSaveSyncing}
          onClick={onSave}
        >

          <Save size={13} />

          {isSaveSyncing
            ? "Saving..."
            : "Save"}

        </button>

      </header>


      {/* ==========================================================
          SYSTEM A — WORKSPACE
         ========================================================== */}

      <section style={styles.workspace}>

        <div style={styles.backdrop} />

        <div style={styles.workspaceInner}>

          <div style={styles.workspaceGrid}>

            {/* ==================================================
                SYSTEM B — PROPERTIES
               ================================================== */}

            <RuachAgentReceiptStudioSystemB
              receiptData={receiptData}
              settings={settings}
              user={user}

              /*
               * IMPORTANT:
               *
               * B receives System A's live configuration.
               */
              designConfig={liveDesignConfig}

              selectedTemplateId={selectedTemplateId}

              /*
               * System A's selection is the source of truth.
               */
              selectedObjectId={selectedElement}
              selectedElement={selectedElement}

              initialObjectGraph={initialObjectGraph}

              onObjectGraphChange={onObjectGraphChange}

              /*
               * All changes return to System A.
               */
              onDesignConfigChange={
                handleDesignConfigChange
              }

              onObjectSelect={
                handleObjectSelect
              }

              onSelectObject={
                handleObjectSelect
              }

              onSelectElement={
                handleElementSelect
              }

              onStartChromaKey={handleStartChromaKey}
            />


            {/* ==================================================
                SYSTEM C — RECEIPT CANVAS
               ================================================== */}

            <RuachAgentReceiptStudioSystemC
              receiptData={receiptData}
              settings={settings}
              user={user}

              /*
               * THIS IS THE IMPORTANT CONNECTION.
               *
               * MatrixTillSlip receives the exact same
               * configuration that System D modifies.
               */
              designConfig={liveDesignConfig}

              selectedTemplateId={selectedTemplateId}

              /*
               * Same selected element.
               */
              selectedObjectId={selectedElement}
              selectedElementId={selectedElement}
              selectedElement={selectedElement}

              /*
               * Selection travels upward to System A.
               */
              onSelectObject={
                handleObjectSelect
              }

              onSelectElement={
                handleElementSelect
              }

              /*
               * Design changes travel upward to System A.
               */
              onDesignConfigChange={
                handleDesignConfigChange
              }
            />


            {/* ==================================================
                SYSTEM D — COLOR GRADING
               ================================================== */}

            <RuachAgentReceiptStudioSystemD
              receiptData={receiptData}
              settings={settings}
              user={user}

              /*
               * SAME LIVE CONFIGURATION.
               */
              designConfig={liveDesignConfig}

              selectedTemplateId={selectedTemplateId}

              /*
               * SAME SELECTED ELEMENT.
               */
              selectedObjectId={selectedElement}
              selectedElementId={selectedElement}
              selectedElement={selectedElement}

              /*
               * Selection is owned by System A.
               */
              onSelectObject={
                handleObjectSelect
              }

              onSelectElement={
                handleElementSelect
              }

              /*
               * D sends every color-grading change
               * back into System A.
               */
              onDesignConfigChange={
                handleDesignConfigChange
              }
            />

          </div>

        </div>

      </section>


      {/* ==========================================================
          SYSTEM A — GLOBAL STATUS BAR
         ========================================================== */}

      <footer style={styles.bottom}>

        <div style={styles.statusGroup}>

          <span style={styles.status}>

            <CircleDot
              size={10}
              color="#17e5a2"
            />

            {isLoading
              ? "Rendering..."
              : "Studio Ready"}

          </span>


          <span style={styles.shortcutHint}>
            {grid
              ? "GRID 16px"
              : "GRID OFF"}
          </span>

          <span style={styles.shortcutHint}>
            •
          </span>

          <span style={styles.shortcutHint}>
            {snap
              ? "SNAP ON"
              : "SNAP OFF"}
          </span>

          <span style={styles.shortcutHint}>
            •
          </span>

          <span style={styles.shortcutHint}>
            {zoom}% VIEW
          </span>

        </div>


        <div style={styles.statusGroup}>

          <button
            type="button"
            style={styles.iconBtn}
            onClick={() =>
              setGrid((value) => !value)
            }
            title="Toggle canvas grid"
          >
            <Grid3X3 size={13} />
          </button>


          <button
            type="button"
            style={styles.iconBtn}
            onClick={toggleFullscreen}
            title={
              fullscreen
                ? "Exit fullscreen"
                : "Fullscreen"
            }
          >
            <Maximize2 size={13} />
          </button>

        </div>

      </footer>


      {/* ==========================================================
          BACKEND REVERT BRIDGE
         ========================================================== */}

      <span
        style={{ display: "none" }}
        data-revert-handler={!!onRevert}
      />

    </div>
  );
}