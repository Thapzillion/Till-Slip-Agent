import React, { useEffect, useMemo, useState } from "react";
import {
  ChevronDown, ChevronRight, Eye, EyeOff, Lock, Unlock,
  RotateCcw, Move3D, Maximize2, Palette, Type, Sparkles,
  Layers3, SlidersHorizontal, Box, Blend, Wand2, RefreshCw,
  Copy, Check, Link2, Unlink2, Rotate3D, ArrowUp, ArrowDown,
  ChevronsUp, ChevronsDown, Grid3X3, MousePointer2, Scan,
  Zap, MonitorCog
} from "lucide-react";

/**
 * RUACHAGENT AI — SYSTEM C: DESIGN INSPECTOR
 * ---------------------------------------------------------------
 * Professional right-side property inspector for the Receipt
 * Editing Studio. It edits configuration only; it never edits JSX.
 *
 * Domains:
 *   Position | Size | Rotation | Colors | Typography | Effects
 *   Layering | Transformations
 *
 * The parent owns the canonical designConfig. This component emits
 * a new configuration through onDesignConfigChange().
 */

const DEFAULT_OBJECT = {
  id: "preview-object",
  type: "text",
  name: "Selected Object",
  visible: true,
  locked: false,
  transform: {
    x: 0, y: 0, width: 100, height: 40,
    scaleX: 1, scaleY: 1, rotation: 0,
    skewX: 0, skewY: 0, opacity: 1,
    anchorX: 0.5, anchorY: 0.5,
  },
  colors: {
    color: "#E8F7FF", background: "#071017",
    brightness: 100, contrast: 100, saturation: 100,
    treatment: "original", tint: "#00D9FF",
    gradientEnabled: false, gradientStart: "#00D9FF",
    gradientEnd: "#0066FF", gradientAngle: 90,
  },
  typography: {
    fontFamily: "Orbitron", fontWeight: 600, fontSize: 16,
    lineHeight: 1.25, letterSpacing: 0,
    textAlign: "left", textTransform: "none",
  },
  effects: {
    shadow: false, shadowBlur: 10, shadowOpacity: 0.35,
    shadowX: 0, shadowY: 4,
    glow: false, glowIntensity: 0.5, glowColor: "#00D9FF", glowRadius: 18,
    neon: false, neonIntensity: 0.5,
    metallic: false, metallicIntensity: 0.5,
    glass: false, glassBlur: 12, glassOpacity: 0.18,
    holographic: false, holographicIntensity: 0.5,
    pulse: false, floating: false, hover: false, rotation360: false,
    animationSpeed: 1,
  },
  layering: { zIndex: 1, blendMode: "normal" },
};

const clone = (v) => {
  if (typeof structuredClone === "function") {
    try { return structuredClone(v); } catch (_) { }
  }
  return JSON.parse(JSON.stringify(v));
};
const num = (v, fallback = 0) => Number.isFinite(Number(v)) ? Number(v) : fallback;
const clamp = (v, min, max) => Math.min(Math.max(v, min), max);

function mergeObject(object) {
  const o = clone(object || {});
  return {
    ...clone(DEFAULT_OBJECT), ...o,
    transform: { ...DEFAULT_OBJECT.transform, ...(o.transform || {}) },
    colors: { ...DEFAULT_OBJECT.colors, ...(o.colors || {}) },
    typography: { ...DEFAULT_OBJECT.typography, ...(o.typography || {}) },
    effects: { ...DEFAULT_OBJECT.effects, ...(o.effects || {}) },
    layering: { ...DEFAULT_OBJECT.layering, ...(o.layering || {}) },
  };
}

export default function DesignInspector({
  selectedObject = DEFAULT_OBJECT,
  designConfig = {},
  onDesignConfigChange,
  className = "",
  style = {},
}) {
  const [object, setObject] = useState(() => mergeObject(selectedObject));
  const [section, setSection] = useState("transform");
  const [linked, setLinked] = useState(true);
  const [advanced, setAdvanced] = useState(false);
  const [copied, setCopied] = useState("");

  useEffect(() => setObject(mergeObject(selectedObject)), [selectedObject]);

  const transform = useMemo(() => ({ ...DEFAULT_OBJECT.transform, ...object.transform }), [object]);
  const colors = useMemo(() => ({ ...DEFAULT_OBJECT.colors, ...object.colors }), [object]);
  const typography = useMemo(() => ({ ...DEFAULT_OBJECT.typography, ...object.typography }), [object]);
  const effects = useMemo(() => ({ ...DEFAULT_OBJECT.effects, ...object.effects }), [object]);
  const layering = useMemo(() => ({ ...DEFAULT_OBJECT.layering, ...object.layering }), [object]);

  const emit = (nextObject) => {
    setObject(nextObject);
    if (typeof onDesignConfigChange === "function") {
      onDesignConfigChange({
        ...designConfig,
        editor: {
          ...(designConfig.editor || {}),
          selectedObject: clone(nextObject),
        },
      });
    }
  };

  const update = (path, value) => {
    const next = clone(object);
    const parts = path.split(".");
    let cursor = next;
    parts.slice(0, -1).forEach((part) => {
      if (!cursor[part] || typeof cursor[part] !== "object") cursor[part] = {};
      cursor = cursor[part];
    });
    cursor[parts[parts.length - 1]] = value;
    emit(next);
  };

  const updateTransform = (key, value) => {
    if (!object.locked) update(`transform.${key}`, value);
  };

  const updateWidth = (value) => {
    if (object.locked) return;
    const width = Math.max(1, num(value, transform.width));
    const next = clone(object);
    if (linked) {
      const ratio = width / Math.max(1, num(transform.width, 1));
      next.transform.width = width;
      next.transform.height = Math.max(1, transform.height * ratio);
    } else next.transform.width = width;
    emit(next);
  };

  const updateHeight = (value) => {
    if (object.locked) return;
    const height = Math.max(1, num(value, transform.height));
    const next = clone(object);
    if (linked) {
      const ratio = height / Math.max(1, num(transform.height, 1));
      next.transform.height = height;
      next.transform.width = Math.max(1, transform.width * ratio);
    } else next.transform.height = height;
    emit(next);
  };

  const resetTransform = () => emit({ ...clone(object), transform: clone(DEFAULT_OBJECT.transform) });
  const toggleVisible = () => update("visible", !object.visible);
  const toggleLock = () => update("locked", !object.locked);

  const copyValue = async (key, value) => {
    try {
      await navigator.clipboard.writeText(String(value));
      setCopied(key);
      setTimeout(() => setCopied(""), 900);
    } catch (_) { }
  };

  const layer = (direction) => {
    const z = num(layering.zIndex, 1);
    const next = direction === "front" ? z + 100 : direction === "back" ? Math.max(0, z - 100) : direction === "up" ? z + 1 : Math.max(0, z - 1);
    update("layering.zIndex", next);
  };

  const Section = ({ id, icon: Icon, title, subtitle, children }) => {
    const open = section === id;
    return (
      <section style={{ ...styles.section, ...(open ? styles.sectionOpen : {}) }}>
        <button type="button" style={styles.sectionHeader} onClick={() => setSection(open ? "" : id)}>
          <span style={styles.sectionHeaderLeft}>
            <span style={{ ...styles.sectionIcon, ...(open ? styles.sectionIconActive : {}) }}><Icon size={15} /></span>
            <span>
              <span style={styles.sectionTitle}>{title}</span>
              {subtitle && <span style={styles.sectionSubtitle}>{subtitle}</span>}
            </span>
          </span>
          {open ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        </button>
        {open && <div style={styles.sectionBody}>{children}</div>}
      </section>
    );
  };

  const NumberField = ({ label, value, onChange, min, max, step = 1, suffix, disabled = false, copyKey }) => (
    <div style={styles.field}>
      <div style={styles.fieldLabelRow}>
        <span style={styles.fieldLabel}>{label}</span>
        {copyKey && <button type="button" style={styles.microButton} onClick={() => copyValue(copyKey, value)}>{copied === copyKey ? <Check size={10} /> : <Copy size={10} />}</button>}
      </div>
      <div style={styles.inputShell}>
        <input type="number" value={value ?? ""} min={min} max={max} step={step} disabled={disabled} onChange={(e) => onChange(e.target.value)} style={styles.numberInput} />
        {suffix && <span style={styles.inputSuffix}>{suffix}</span>}
      </div>
    </div>
  );

  const Slider = ({ label, value, min, max, step = 1, suffix = "", onChange, disabled = false }) => (
    <div style={styles.sliderField}>
      <div style={styles.sliderHeader}><span style={styles.fieldLabel}>{label}</span><span style={styles.sliderValue}>{num(value, min)}{suffix}</span></div>
      <input type="range" min={min} max={max} step={step} value={num(value, min)} disabled={disabled} onChange={(e) => onChange(e.target.value)} style={styles.range} />
    </div>
  );

  const Select = ({ label, value, options, onChange, disabled = false }) => (
    <div style={styles.field}>
      <div style={styles.fieldLabel}>{label}</div>
      <div style={styles.selectShell}>
        <select value={value} disabled={disabled} onChange={(e) => onChange(e.target.value)} style={styles.select}>
          {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <ChevronDown size={12} style={styles.selectChevron} />
      </div>
    </div>
  );

  const Color = ({ label, value, onChange, disabled = false }) => (
    <div style={styles.field}>
      <div style={styles.fieldLabel}>{label}</div>
      <div style={styles.colorField}>
        <input type="color" value={value || "#000000"} disabled={disabled} onChange={(e) => onChange(e.target.value)} style={styles.colorPicker} />
        <input type="text" value={value || ""} disabled={disabled} onChange={(e) => onChange(e.target.value)} style={styles.colorText} />
      </div>
    </div>
  );

  const Toggle = ({ label, checked, onChange, description, disabled = false }) => (
    <div style={styles.toggleRow}>
      <span style={styles.toggleCopy}><span style={styles.toggleLabel}>{label}</span>{description && <span style={styles.toggleDescription}>{description}</span>}</span>
      <button type="button" disabled={disabled} aria-pressed={checked} onClick={() => onChange(!checked)} style={{ ...styles.toggle, ...(checked ? styles.toggleActive : {}), ...(disabled ? styles.toggleDisabled : {}) }}>
        <span style={{ ...styles.toggleKnob, ...(checked ? styles.toggleKnobActive : {}) }} />
      </button>
    </div>
  );

  const typeLabel = {
    logo: "LOGO", qr: "QR CODE", text: "TEXT", section: "RECEIPT SECTION",
    item: "PRODUCT ITEM", total: "TOTAL", divider: "DIVIDER", icon: "ICON",
    frame: "FRAME", background: "BACKGROUND",
  }[object.type] || "OBJECT";

  return (
    <aside className={`ruachagent-design-inspector ${className}`} style={{ ...styles.inspector, ...style }}>
      <header style={styles.header}>
        <div style={styles.headerTitleRow}>
          <div style={styles.headerIcon}><SlidersHorizontal size={16} /></div>
          <div><div style={styles.headerEyebrow}>RUACHAGENT / INSPECTOR</div><h2 style={styles.headerTitle}>Design Controls</h2></div>
        </div>
        <div style={styles.headerActions}>
          <button type="button" style={styles.headerAction} onClick={toggleVisible}>{object.visible ? <Eye size={14} /> : <EyeOff size={14} />}</button>
          <button type="button" style={styles.headerAction} onClick={toggleLock}>{object.locked ? <Lock size={14} /> : <Unlock size={14} />}</button>
        </div>
      </header>

      <div style={styles.selectedObject}>
        <div style={styles.objectThumbnail}>{object.type === "qr" ? <Grid3X3 size={17} /> : object.type === "text" ? <Type size={17} /> : object.type === "total" ? <Zap size={17} /> : <Box size={17} />}</div>
        <div style={styles.selectedObjectCopy}><div style={styles.selectedObjectType}>{typeLabel}</div><div style={styles.selectedObjectName}>{object.name || "Unnamed Object"}</div></div>
        <span style={styles.valueBadge}>{object.locked ? "LOCKED" : "LIVE"}</span>
      </div>

      <div style={styles.scrollArea}>
        <Section id="transform" icon={Move3D} title="Transform" subtitle="Position, size & orientation">
          <div style={styles.controlGrid}>
            <NumberField label="X Position" value={transform.x} suffix="px" disabled={object.locked} onChange={(v) => updateTransform("x", num(v, transform.x))} />
            <NumberField label="Y Position" value={transform.y} suffix="px" disabled={object.locked} onChange={(v) => updateTransform("y", num(v, transform.y))} />
          </div>
          <div style={styles.controlGrid}>
            <NumberField label="Width" value={transform.width} min={1} suffix="px" disabled={object.locked} onChange={updateWidth} />
            <NumberField label="Height" value={transform.height} min={1} suffix="px" disabled={object.locked} onChange={updateHeight} />
          </div>
          <button type="button" style={{ ...styles.linkButton, ...(linked ? styles.linkButtonActive : {}) }} onClick={() => setLinked(!linked)}>{linked ? <Link2 size={13} /> : <Unlink2 size={13} />}{linked ? "Aspect Ratio Locked" : "Independent Size"}</button>
          <Slider label="Scale" value={transform.scaleX * 100} min={10} max={500} suffix="%" disabled={object.locked} onChange={(v) => { const s = num(v, 100) / 100; const next = clone(object); next.transform.scaleX = s; if (linked) next.transform.scaleY = s; emit(next); }} />
          <Slider label="Rotation" value={transform.rotation} min={-180} max={180} suffix="°" disabled={object.locked} onChange={(v) => updateTransform("rotation", num(v, 0))} />
          <Slider label="Opacity" value={transform.opacity * 100} min={0} max={100} suffix="%" disabled={object.locked} onChange={(v) => updateTransform("opacity", clamp(num(v, 100) / 100, 0, 1))} />
          <div style={styles.twoColumnActions}><button type="button" style={styles.utilityButton} disabled={object.locked} onClick={resetTransform}><RotateCcw size={13} />Reset</button><button type="button" style={styles.utilityButton} disabled={object.locked} onClick={() => updateTransform("rotation", Math.round(transform.rotation / 90) * 90)}><Rotate3D size={13} />Snap 90°</button></div>
        </Section>

        <Section id="position" icon={MousePointer2} title="Position" subtitle="Coordinates & anchor">
          <div style={styles.controlGrid}><NumberField label="Horizontal" value={transform.x} suffix="px" disabled={object.locked} onChange={(v) => updateTransform("x", num(v, 0))} /><NumberField label="Vertical" value={transform.y} suffix="px" disabled={object.locked} onChange={(v) => updateTransform("y", num(v, 0))} /></div>
          <div style={styles.subsectionLabel}>ANCHOR POINT</div>
          <div style={styles.anchorGrid}>
            {[[0, 0], [.5, 0], [1, 0], [0, .5], [.5, .5], [1, .5], [0, 1], [.5, 1], [1, 1]].map(([x, y]) => <button key={`${x}-${y}`} type="button" onClick={() => { const next = clone(object); next.transform.anchorX = x; next.transform.anchorY = y; emit(next); }} style={{ ...styles.anchorButton, ...(transform.anchorX === x && transform.anchorY === y ? styles.anchorButtonActive : {}) }}><span /></button>)}
          </div>
          <div style={styles.controlGrid}><NumberField label="Anchor X" value={transform.anchorX} min={0} max={1} step={.01} disabled={object.locked} onChange={(v) => updateTransform("anchorX", clamp(num(v, .5), 0, 1))} /><NumberField label="Anchor Y" value={transform.anchorY} min={0} max={1} step={.01} disabled={object.locked} onChange={(v) => updateTransform("anchorY", clamp(num(v, .5), 0, 1))} /></div>
        </Section>

        <Section id="size" icon={Maximize2} title="Size" subtitle="Dimensions & scaling">
          <NumberField label="Width" value={transform.width} min={1} suffix="px" disabled={object.locked} onChange={updateWidth} />
          <NumberField label="Height" value={transform.height} min={1} suffix="px" disabled={object.locked} onChange={updateHeight} />
          <div style={styles.subsectionLabel}>NON-DESTRUCTIVE SCALE</div>
          <div style={styles.scaleMatrix}><div style={styles.scaleCard}><span style={styles.scaleCardLabel}>X SCALE</span><strong style={styles.scaleCardValue}>{num(transform.scaleX, 1).toFixed(2)}</strong></div><div style={styles.scaleCard}><span style={styles.scaleCardLabel}>Y SCALE</span><strong style={styles.scaleCardValue}>{num(transform.scaleY, 1).toFixed(2)}</strong></div></div>
        </Section>

        <Section id="rotation" icon={Rotate3D} title="Rotation" subtitle="Orientation & skew">
          <Slider label="Rotation" value={transform.rotation} min={-180} max={180} suffix="°" disabled={object.locked} onChange={(v) => updateTransform("rotation", num(v, 0))} />
          <div style={styles.controlGrid}><NumberField label="Skew X" value={transform.skewX} min={-90} max={90} suffix="°" disabled={object.locked} onChange={(v) => updateTransform("skewX", num(v, 0))} /><NumberField label="Skew Y" value={transform.skewY} min={-90} max={90} suffix="°" disabled={object.locked} onChange={(v) => updateTransform("skewY", num(v, 0))} /></div>
          <div style={styles.rotationPresets}>{[-90, -45, 0, 45, 90, 180].map(d => <button key={d} type="button" disabled={object.locked} onClick={() => updateTransform("rotation", d)} style={{ ...styles.presetButton, ...(transform.rotation === d ? styles.presetButtonActive : {}) }}>{d}°</button>)}</div>
        </Section>

        <Section id="colors" icon={Palette} title="Colors" subtitle="Color grading & palette">
          <Color label="Primary Color" value={colors.color} disabled={object.locked} onChange={(v) => update("colors.color", v)} />
          <Color label="Surface Color" value={colors.background} disabled={object.locked} onChange={(v) => update("colors.background", v)} />
          <Slider label="Brightness" value={colors.brightness} min={0} max={200} suffix="%" disabled={object.locked} onChange={(v) => update("colors.brightness", num(v, 100))} />
          <Slider label="Contrast" value={colors.contrast} min={0} max={200} suffix="%" disabled={object.locked} onChange={(v) => update("colors.contrast", num(v, 100))} />
          <Slider label="Saturation" value={colors.saturation} min={0} max={200} suffix="%" disabled={object.locked} onChange={(v) => update("colors.saturation", num(v, 100))} />
          <div style={styles.subsectionLabel}>COLOR TREATMENT</div>
          <div style={styles.treatmentGrid}>{[["original", "Original"], ["monochrome", "Mono"], ["grayscale", "Gray"], ["tint", "Tint"]].map(([v, l]) => <button key={v} type="button" disabled={object.locked} onClick={() => update("colors.treatment", v)} style={{ ...styles.treatmentButton, ...(colors.treatment === v ? styles.treatmentButtonActive : {}) }}>{l}</button>)}</div>
          <Toggle label="Dynamic Gradient" checked={colors.gradientEnabled} disabled={object.locked} onChange={(v) => update("colors.gradientEnabled", v)} />
          {colors.gradientEnabled && <><div style={styles.controlGrid}><Color label="Gradient Start" value={colors.gradientStart} disabled={object.locked} onChange={(v) => update("colors.gradientStart", v)} /><Color label="Gradient End" value={colors.gradientEnd} disabled={object.locked} onChange={(v) => update("colors.gradientEnd", v)} /></div><Slider label="Gradient Angle" value={colors.gradientAngle} min={0} max={360} suffix="°" disabled={object.locked} onChange={(v) => update("colors.gradientAngle", num(v, 90))} /></>}
        </Section>

        <Section id="typography" icon={Type} title="Typography" subtitle="Fonts, spacing & hierarchy">
          <Select label="Font Family" value={typography.fontFamily} disabled={object.locked} options={["Orbitron", "Inter", "Montserrat", "Share Tech Mono", "JetBrains Mono", "Space Grotesk"].map(v => ({ value: v, label: v }))} onChange={(v) => update("typography.fontFamily", v)} />
          <Select label="Font Weight" value={String(typography.fontWeight)} disabled={object.locked} options={[300, 400, 500, 600, 700, 800].map(v => ({ value: String(v), label: String(v) }))} onChange={(v) => update("typography.fontWeight", num(v, 400))} />
          <div style={styles.controlGrid}><NumberField label="Font Size" value={typography.fontSize} min={1} max={500} suffix="px" disabled={object.locked} onChange={(v) => update("typography.fontSize", num(v, 16))} /><NumberField label="Letter Spacing" value={typography.letterSpacing} min={-20} max={100} step={.1} suffix="px" disabled={object.locked} onChange={(v) => update("typography.letterSpacing", num(v, 0))} /></div>
          <div style={styles.controlGrid}><Select label="Alignment" value={typography.textAlign} disabled={object.locked} options={["left", "center", "right", "justify"].map(v => ({ value: v, label: v }))} onChange={(v) => update("typography.textAlign", v)} /><Select label="Case" value={typography.textTransform} disabled={object.locked} options={["none", "uppercase", "lowercase", "capitalize"].map(v => ({ value: v, label: v }))} onChange={(v) => update("typography.textTransform", v)} /></div>
          <Slider label="Line Height" value={typography.lineHeight} min={.5} max={3} step={.05} suffix="×" disabled={object.locked} onChange={(v) => update("typography.lineHeight", num(v, 1.25))} />
        </Section>

        <Section id="effects" icon={Sparkles} title="Effects" subtitle="Lighting, material & animation">
          <div style={styles.effectHeader}><span>VISUAL FX ENGINE</span><b>LIVE</b></div>
          <Toggle label="Shadow" checked={effects.shadow} disabled={object.locked} onChange={(v) => update("effects.shadow", v)} />
          {effects.shadow && <div style={styles.effectSubPanel}><Slider label="Blur" value={effects.shadowBlur} min={0} max={100} suffix="px" disabled={object.locked} onChange={(v) => update("effects.shadowBlur", num(v, 10))} /><div style={styles.controlGrid}><NumberField label="X Offset" value={effects.shadowX} suffix="px" disabled={object.locked} onChange={(v) => update("effects.shadowX", num(v, 0))} /><NumberField label="Y Offset" value={effects.shadowY} suffix="px" disabled={object.locked} onChange={(v) => update("effects.shadowY", num(v, 4))} /></div><Slider label="Shadow Opacity" value={effects.shadowOpacity * 100} min={0} max={100} suffix="%" disabled={object.locked} onChange={(v) => update("effects.shadowOpacity", num(v, 35) / 100)} /></div>}
          <Toggle label="Glow" checked={effects.glow} disabled={object.locked} onChange={(v) => update("effects.glow", v)} description="Soft luminous edge" />
          {effects.glow && <div style={styles.effectSubPanel}><Color label="Glow Color" value={effects.glowColor} disabled={object.locked} onChange={(v) => update("effects.glowColor", v)} /><Slider label="Glow Intensity" value={effects.glowIntensity * 100} min={0} max={100} suffix="%" disabled={object.locked} onChange={(v) => update("effects.glowIntensity", num(v, 50) / 100)} /><Slider label="Glow Radius" value={effects.glowRadius} min={0} max={100} suffix="px" disabled={object.locked} onChange={(v) => update("effects.glowRadius", num(v, 18))} /></div>}
          <Toggle label="Neon" checked={effects.neon} disabled={object.locked} onChange={(v) => update("effects.neon", v)} />
          {effects.neon && <Slider label="Neon Intensity" value={effects.neonIntensity * 100} min={0} max={100} suffix="%" disabled={object.locked} onChange={(v) => update("effects.neonIntensity", num(v, 50) / 100)} />}
          <Toggle label="Metallic Reflection" checked={effects.metallic} disabled={object.locked} onChange={(v) => update("effects.metallic", v)} />
          {effects.metallic && <Slider label="Reflection Strength" value={effects.metallicIntensity * 100} min={0} max={100} suffix="%" disabled={object.locked} onChange={(v) => update("effects.metallicIntensity", num(v, 50) / 100)} />}
          <Toggle label="Glass" checked={effects.glass} disabled={object.locked} onChange={(v) => update("effects.glass", v)} />
          {effects.glass && <div style={styles.effectSubPanel}><Slider label="Glass Blur" value={effects.glassBlur} min={0} max={60} suffix="px" disabled={object.locked} onChange={(v) => update("effects.glassBlur", num(v, 12))} /><Slider label="Glass Opacity" value={effects.glassOpacity * 100} min={0} max={100} suffix="%" disabled={object.locked} onChange={(v) => update("effects.glassOpacity", num(v, 18) / 100)} /></div>}
          <Toggle label="Holographic" checked={effects.holographic} disabled={object.locked} onChange={(v) => update("effects.holographic", v)} />
          {effects.holographic && <Slider label="Holographic Intensity" value={effects.holographicIntensity * 100} min={0} max={100} suffix="%" disabled={object.locked} onChange={(v) => update("effects.holographicIntensity", num(v, 50) / 100)} />}
          <div style={styles.subsectionLabel}>MOTION</div>
          <Toggle label="Infinite 360° Rotation" checked={effects.rotation360} disabled={object.locked} onChange={(v) => update("effects.rotation360", v)} />
          <Toggle label="Smooth Hover" checked={effects.hover} disabled={object.locked} onChange={(v) => update("effects.hover", v)} />
          <Toggle label="Floating" checked={effects.floating} disabled={object.locked} onChange={(v) => update("effects.floating", v)} />
          <Toggle label="Pulse" checked={effects.pulse} disabled={object.locked} onChange={(v) => update("effects.pulse", v)} />
          <Slider label="Animation Speed" value={effects.animationSpeed} min={.1} max={5} step={.1} suffix="×" disabled={object.locked} onChange={(v) => update("effects.animationSpeed", num(v, 1))} />
        </Section>

        <Section id="layering" icon={Layers3} title="Layering" subtitle="Stack order & blend modes">
          <div style={styles.layerDepth}><div><div style={styles.fieldLabel}>Z-INDEX</div><strong style={styles.layerDepthValue}>{layering.zIndex}</strong></div><div style={styles.layerDepthIcon}><Layers3 size={18} /></div></div>
          <div style={styles.layerButtons}><button type="button" style={styles.layerButton} onClick={() => layer("front")}><ChevronsUp size={13} />To Front</button><button type="button" style={styles.layerButton} onClick={() => layer("up")}><ArrowUp size={13} />Forward</button><button type="button" style={styles.layerButton} onClick={() => layer("down")}><ArrowDown size={13} />Backward</button><button type="button" style={styles.layerButton} onClick={() => layer("back")}><ChevronsDown size={13} />To Back</button></div>
          <Select label="Blend Mode" value={layering.blendMode} disabled={object.locked} options={["normal", "screen", "multiply", "overlay", "soft-light", "hard-light", "color-dodge", "difference"].map(v => ({ value: v, label: v }))} onChange={(v) => update("layering.blendMode", v)} />
          <Toggle label="Visible" checked={object.visible} onChange={toggleVisible} /><Toggle label="Lock Object" checked={object.locked} onChange={toggleLock} />
        </Section>

        <Section id="transformations" icon={RefreshCw} title="Transformations" subtitle="Advanced matrix controls">
          <div style={styles.matrixHeader}><div><span style={styles.matrixEyebrow}>TRANSFORM MATRIX</span><strong style={styles.matrixTitle}>2D OBJECT SPACE</strong></div><Move3D size={17} /></div>
          <div style={styles.matrixGrid}><NumberField label="Scale X" value={transform.scaleX} min={.01} max={10} step={.01} disabled={object.locked} onChange={(v) => updateTransform("scaleX", num(v, 1))} /><NumberField label="Scale Y" value={transform.scaleY} min={.01} max={10} step={.01} disabled={object.locked} onChange={(v) => updateTransform("scaleY", num(v, 1))} /><NumberField label="Skew X" value={transform.skewX} min={-90} max={90} suffix="°" disabled={object.locked} onChange={(v) => updateTransform("skewX", num(v, 0))} /><NumberField label="Skew Y" value={transform.skewY} min={-90} max={90} suffix="°" disabled={object.locked} onChange={(v) => updateTransform("skewY", num(v, 0))} /></div>
          <div style={styles.transformationNotice}><MonitorCog size={14} /><span>These values remain configuration data. The receipt renderer remains untouched.</span></div>
          <button type="button" style={styles.resetMatrixButton} disabled={object.locked} onClick={resetTransform}><RotateCcw size={13} />Reset Transformation Matrix</button>
        </Section>

        <div style={styles.advancedBar}>
          <button type="button" style={styles.advancedButton} onClick={() => setAdvanced(!advanced)}><span style={styles.advancedButtonLeft}><Wand2 size={15} /><span><span style={styles.advancedTitle}>Advanced Inspector</span><span style={styles.advancedSubtitle}>Expert configuration controls</span></span></span>{advanced ? <ChevronDown size={14} /> : <ChevronRight size={14} />}</button>
          {advanced && <div style={styles.advancedBody}><div style={styles.advancedCard}><Blend size={15} /><div><strong>Configuration-safe editing</strong><p>System C changes the selected object's configuration only. JSX remains immutable.</p></div></div><div style={styles.advancedCard}><Zap size={15} /><div><strong>Renderer compatible</strong><p>Emitted values are designed to feed MatrixTillSlip and the saved receipt_design_config JSONB.</p></div></div></div>}
        </div>
      </div>

      <footer style={styles.footer}><span style={styles.footerStatus}><i style={styles.footerDot} />DESIGN CONFIG LIVE</span><span style={styles.footerObject}>{object.id || "OBJECT"}</span></footer>
    </aside>
  );
}

/* ================================================================
   BLACK / TESLA / BLUE-NEON STUDIO STYLES
   All styling is intentionally contained in the const styles
   pattern used by the RuachAgent application.
================================================================ */
const styles = {
  inspector: { width: "100%", height: "100%", minWidth: 0, display: "flex", flexDirection: "column", background: "linear-gradient(180deg,#080d12 0%,#060a0e 55%,#05080b 100%)", color: "#e8f7ff", borderLeft: "1px solid rgba(0,209,255,.12)", boxSizing: "border-box", overflow: "hidden", fontFamily: '"Inter","Segoe UI",system-ui,sans-serif', boxShadow: "-18px 0 45px rgba(0,0,0,.35),inset 1px 0 0 rgba(255,255,255,.015)" },
  header: { minHeight: 68, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 16px", borderBottom: "1px solid rgba(148,193,214,.09)", background: "linear-gradient(180deg,rgba(18,27,35,.92),rgba(8,13,18,.92))", boxSizing: "border-box" },
  headerTitleRow: { display: "flex", alignItems: "center", gap: 10, minWidth: 0 }, headerIcon: { width: 31, height: 31, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", color: "#00d9ff", background: "linear-gradient(145deg,rgba(0,217,255,.18),rgba(0,80,120,.06))", border: "1px solid rgba(0,217,255,.22)", boxShadow: "0 0 20px rgba(0,217,255,.08),inset 0 0 14px rgba(0,217,255,.04)" }, headerEyebrow: { fontSize: 8, letterSpacing: "1.8px", color: "#4c91a9", fontWeight: 700, marginBottom: 3 }, headerTitle: { margin: 0, fontSize: 14, lineHeight: 1, fontWeight: 700, color: "#eefaff" }, headerActions: { display: "flex", gap: 5 }, headerAction: { width: 29, height: 29, borderRadius: 7, border: "1px solid rgba(143,190,209,.12)", background: "rgba(255,255,255,.025)", color: "#7893a0", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" },
  selectedObject: { margin: "12px 12px 4px", minHeight: 58, padding: "9px 10px", borderRadius: 9, display: "flex", alignItems: "center", gap: 9, background: "linear-gradient(135deg,rgba(16,31,40,.9),rgba(8,16,22,.9))", border: "1px solid rgba(0,217,255,.14)", boxShadow: "inset 0 1px 0 rgba(255,255,255,.025),0 8px 25px rgba(0,0,0,.18)", boxSizing: "border-box" }, objectThumbnail: { width: 34, height: 34, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color: "#00d9ff", background: "rgba(0,217,255,.07)", border: "1px solid rgba(0,217,255,.15)" }, selectedObjectCopy: { minWidth: 0, flex: 1 }, selectedObjectType: { fontSize: 8, letterSpacing: "1.3px", color: "#00bde3", fontWeight: 700, marginBottom: 4 }, selectedObjectName: { fontSize: 11, fontWeight: 600, color: "#e5f5fa", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, valueBadge: { fontSize: 7, letterSpacing: "1px", fontWeight: 800, padding: "4px 6px", borderRadius: 5, color: "#56e7ff", background: "rgba(0,217,255,.06)", border: "1px solid rgba(0,217,255,.14)" },
  scrollArea: { flex: 1, overflowY: "auto", overflowX: "hidden", paddingBottom: 10 }, section: { margin: "6px 10px 0", borderRadius: 8, border: "1px solid rgba(145,185,204,.075)", background: "rgba(255,255,255,.012)", overflow: "hidden" }, sectionOpen: { borderColor: "rgba(0,217,255,.13)", background: "linear-gradient(180deg,rgba(10,19,25,.76),rgba(7,12,16,.7))", boxShadow: "inset 2px 0 0 rgba(0,217,255,.35)" }, sectionHeader: { width: "100%", minHeight: 51, padding: "7px 10px", border: 0, background: "transparent", color: "#dcecf2", display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer", textAlign: "left" }, sectionHeaderLeft: { display: "flex", alignItems: "center", gap: 9 }, sectionIcon: { width: 27, height: 27, borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center", color: "#627d89", background: "rgba(255,255,255,.025)", border: "1px solid rgba(255,255,255,.045)" }, sectionIconActive: { color: "#00d9ff", borderColor: "rgba(0,217,255,.18)", background: "rgba(0,217,255,.065)" }, sectionTitle: { display: "block", fontSize: 10, fontWeight: 700, color: "#dcecf2" }, sectionSubtitle: { display: "block", fontSize: 8, color: "#607a86", marginTop: 3 }, sectionBody: { padding: "3px 10px 12px", borderTop: "1px solid rgba(145,185,204,.055)" },
  field: { marginTop: 10 }, fieldLabelRow: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 5 }, fieldLabel: { fontSize: 8, fontWeight: 700, color: "#718b97", letterSpacing: '.45px', textTransform: "uppercase" }, microButton: { width: 19, height: 18, padding: 0, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 4, border: "1px solid rgba(255,255,255,.07)", color: "#66818d", background: "rgba(255,255,255,.025)" }, inputShell: { height: 31, display: "flex", alignItems: "center", borderRadius: 6, border: "1px solid rgba(143,190,209,.1)", background: "#070d12", overflow: "hidden" }, numberInput: { width: "100%", height: "100%", padding: "0 8px", border: 0, outline: 0, background: "transparent", color: "#d9f5ff", fontSize: 10, fontWeight: 600, fontFamily: '"JetBrains Mono",monospace' }, inputSuffix: { paddingRight: 8, color: "#4c6e7b", fontSize: 8, fontFamily: '"JetBrains Mono",monospace' }, selectShell: { position: "relative", height: 31, borderRadius: 6, border: "1px solid rgba(143,190,209,.1)", background: "#070d12", overflow: "hidden" }, select: { width: "100%", height: "100%", padding: "0 28px 0 8px", border: 0, outline: 0, appearance: "none", background: "transparent", color: "#cfe6ee", fontSize: 9, fontWeight: 600 }, selectChevron: { position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", color: "#4d6b76", pointerEvents: "none" }, controlGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }, sliderField: { marginTop: 11 }, sliderHeader: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 5 }, sliderValue: { fontSize: 8, color: "#8bc6d8", fontFamily: '"JetBrains Mono",monospace' }, range: { width: "100%", height: 3, margin: 0, accentColor: "#00cfff", cursor: "pointer" }, twoColumnActions: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 7, marginTop: 11 }, utilityButton: { height: 31, borderRadius: 6, border: "1px solid rgba(143,190,209,.09)", background: "rgba(255,255,255,.018)", color: "#77929d", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, fontSize: 8, fontWeight: 700 }, linkButton: { width: "100%", minHeight: 30, display: "flex", alignItems: "center", justifyContent: "center", gap: 7, borderRadius: 6, border: "1px solid rgba(143,190,209,.09)", color: "#6d8792", background: "rgba(255,255,255,.018)", fontSize: 8, fontWeight: 700, marginTop: 9 }, linkButtonActive: { color: "#7eeaff", borderColor: "rgba(0,217,255,.18)", background: "rgba(0,217,255,.045)" },
  subsectionLabel: { marginTop: 15, marginBottom: 8, fontSize: 7, letterSpacing: "1.4px", fontWeight: 800, color: "#41626f" }, anchorGrid: { width: 82, height: 82, margin: "4px auto 12px", padding: 5, display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 3, borderRadius: 7, border: "1px solid rgba(143,190,209,.08)", background: "#050a0e" }, anchorButton: { border: 0, borderRadius: 3, background: "rgba(255,255,255,.02)", display: "flex", alignItems: "center", justifyContent: "center" }, anchorButtonActive: { background: "rgba(0,217,255,.1)", boxShadow: "inset 0 0 0 1px rgba(0,217,255,.28)" }, scaleMatrix: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 7, marginTop: 10 }, scaleCard: { padding: "10px 9px", borderRadius: 7, background: "linear-gradient(135deg,rgba(255,255,255,.025),rgba(0,217,255,.025))", border: "1px solid rgba(143,190,209,.07)" }, scaleCardLabel: { display: "block", fontSize: 7, letterSpacing: "1px", color: "#53717c", fontWeight: 800, marginBottom: 5 }, scaleCardValue: { fontSize: 13, color: "#bfeef8", fontFamily: '"JetBrains Mono",monospace' }, rotationPresets: { display: "grid", gridTemplateColumns: "repeat(6,1fr)", gap: 4, marginTop: 10 }, presetButton: { height: 27, borderRadius: 5, border: "1px solid rgba(143,190,209,.08)", background: "rgba(255,255,255,.018)", color: "#6d8792", fontSize: 7 }, presetButtonActive: { color: "#65e7ff", borderColor: "rgba(0,217,255,.24)", background: "rgba(0,217,255,.065)" },
  colorField: { height: 31, display: "flex", alignItems: "center", gap: 6, padding: "3px 5px", borderRadius: 6, border: "1px solid rgba(143,190,209,.1)", background: "#070d12", boxSizing: "border-box" }, colorPicker: { width: 23, height: 23, padding: 0, border: 0, background: "transparent" }, colorText: { minWidth: 0, flex: 1, height: "100%", padding: "0 5px", border: 0, outline: 0, background: "transparent", color: "#ccebf3", fontSize: 9, fontFamily: '"JetBrains Mono",monospace' }, treatmentGrid: { display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 5 }, treatmentButton: { height: 29, borderRadius: 5, border: "1px solid rgba(143,190,209,.08)", background: "rgba(255,255,255,.015)", color: "#607b87", fontSize: 7, fontWeight: 700 }, treatmentButtonActive: { color: "#6be9ff", borderColor: "rgba(0,217,255,.24)", background: "rgba(0,217,255,.07)" },
  toggleRow: { minHeight: 39, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, borderBottom: "1px solid rgba(255,255,255,.025)" }, toggleCopy: { minWidth: 0, display: "flex", flexDirection: "column", gap: 3 }, toggleLabel: { fontSize: 9, fontWeight: 650, color: "#bed4dc" }, toggleDescription: { fontSize: 7, color: "#526e79" }, toggle: { width: 29, height: 16, padding: 2, borderRadius: 20, border: "1px solid rgba(143,190,209,.13)", background: "#0c151b", position: "relative" }, toggleActive: { background: "rgba(0,217,255,.25)", borderColor: "rgba(0,217,255,.48)", boxShadow: "0 0 13px rgba(0,217,255,.12)" }, toggleDisabled: { opacity: .45 }, toggleKnob: { position: "absolute", top: 2, left: 2, width: 10, height: 10, borderRadius: "50%", background: "#50636c" }, toggleKnobActive: { transform: "translateX(13px)", background: "#7feaff", boxShadow: "0 0 8px rgba(0,217,255,.8)" }, effectHeader: { display: "flex", alignItems: "center", justifyContent: "space-between", margin: "3px 0 5px", padding: "7px 8px", borderRadius: 6, background: "rgba(0,217,255,.025)", border: "1px solid rgba(0,217,255,.075)", fontSize: 7, letterSpacing: "1.2px", color: "#4f7e8c" }, effectSubPanel: { margin: "3px 0 7px", padding: "2px 8px 8px", borderRadius: 6, background: "rgba(0,0,0,.18)", borderLeft: "1px solid rgba(0,217,255,.14)" },
  layerDepth: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: 10, borderRadius: 7, background: "linear-gradient(135deg,rgba(0,217,255,.04),rgba(255,255,255,.015))", border: "1px solid rgba(143,190,209,.08)" }, layerDepthValue: { display: "block", marginTop: 4, fontSize: 16, color: "#b9ecf7", fontFamily: '"JetBrains Mono",monospace' }, layerDepthIcon: { width: 35, height: 35, borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center", color: "#00d9ff", background: "rgba(0,217,255,.06)", border: "1px solid rgba(0,217,255,.12)" }, layerButtons: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 5, marginTop: 8 }, layerButton: { minHeight: 31, borderRadius: 6, border: "1px solid rgba(143,190,209,.08)", background: "rgba(255,255,255,.018)", color: "#76919c", display: "flex", alignItems: "center", justifyContent: "center", gap: 5, fontSize: 7, fontWeight: 700 },
  matrixHeader: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: 10, borderRadius: 7, border: "1px solid rgba(0,217,255,.1)", background: "linear-gradient(135deg,rgba(0,217,255,.045),rgba(5,10,14,.8))", color: "#00d9ff" }, matrixEyebrow: { display: "block", fontSize: 7, letterSpacing: "1.1px", color: "#477584", fontWeight: 800, marginBottom: 3 }, matrixTitle: { display: "block", fontSize: 9, letterSpacing: .4, color: "#cfeaf2" }, matrixGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }, transformationNotice: { display: "flex", alignItems: "flex-start", gap: 7, marginTop: 10, padding: 9, borderRadius: 6, color: "#5e8390", background: "rgba(0,217,255,.025)", border: "1px solid rgba(0,217,255,.065)", fontSize: 8, lineHeight: 1.45 }, resetMatrixButton: { width: "100%", minHeight: 32, marginTop: 8, borderRadius: 6, border: "1px solid rgba(0,217,255,.14)", background: "rgba(0,217,255,.045)", color: "#65d8ed", display: "flex", alignItems: "center", justifyContent: "center", gap: 7, fontSize: 8, fontWeight: 750 },
  advancedBar: { margin: "8px 10px 0", borderRadius: 8, border: "1px solid rgba(143,190,209,.075)", background: "rgba(255,255,255,.012)", overflow: "hidden" }, advancedButton: { width: "100%", minHeight: 53, border: 0, background: "transparent", color: "#c9dfe7", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 10px" }, advancedButtonLeft: { display: "flex", alignItems: "center", gap: 8, color: "#7feaff" }, advancedTitle: { display: "block", color: "#c9dfe7", fontSize: 9, fontWeight: 700 }, advancedSubtitle: { display: "block", color: "#58737e", fontSize: 7, marginTop: 3 }, advancedBody: { padding: "0 9px 9px", borderTop: "1px solid rgba(143,190,209,.05)" }, advancedCard: { display: "flex", gap: 8, padding: "9px 0", borderBottom: "1px solid rgba(255,255,255,.025)", fontSize: 8, color: "#607c87" },
  footer: { minHeight: 36, padding: "0 12px", display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "1px solid rgba(143,190,209,.07)", background: "rgba(3,7,10,.8)", flexShrink: 0 }, footerStatus: { display: "flex", alignItems: "center", gap: 6, color: "#4f8794", fontSize: 7, fontWeight: 800, letterSpacing: "1px" }, footerDot: { width: 5, height: 5, borderRadius: "50%", background: "#00e5ff", boxShadow: "0 0 8px rgba(0,229,255,.85)" }, footerObject: { color: "#39545f", fontSize: 7, fontFamily: '"JetBrains Mono",monospace' }
};