import React, {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState
} from "react";

import {
    Move,
    ZoomIn,
    ZoomOut,
    Maximize2,
    RotateCcw,
    Grid3X3,
    MousePointer2,
    Hand,
    Crosshair,
    Lock,
    Unlock,
    RefreshCw,
    Monitor,
    Smartphone,
    Tablet,
    Eye,
    EyeOff
} from "lucide-react";

import MatrixTillSlip from "./models/MatrixTillSlip";


/* ============================================================
   RUACHAGENT RECEIPT STUDIO
   SYSTEM C — RECEIPT CANVAS
   ============================================================

   RESPONSIBILITIES

   • Render the selected till-slip template
   • Prioritize selectedTemplateId
   • Listen for TillSlipsCollection selection events
   • Display MatrixTillSlip through designConfig
   • Provide an infinite-style workspace
   • Allow receipt movement
   • Allow zoom / unzoom
   • Allow canvas panning
   • Allow centering
   • Provide visual selection state
   • Preserve designConfig architecture
   • Never modify receipt JSX
   • Send configuration changes upward
   • Remain compatible with AdminPanel save logic

   ============================================================ */


/* ============================================================
   DEFAULT CANVAS CONFIGURATION
   ============================================================ */

const DEFAULT_CANVAS = {
    zoom: 0.72,

    position: {
        x: 0,
        y: 0
    },

    grid: true,

    snapToGrid: true,

    gridSize: 24,

    mode: "select"
};


/* ============================================================
   SAFE NUMBER
   ============================================================ */

function safeNumber(value, fallback = 0) {
    const number = Number(value);

    return Number.isFinite(number)
        ? number
        : fallback;
}


/* ============================================================
   CLAMP
   ============================================================ */

function clamp(value, min, max) {
    return Math.min(
        Math.max(value, min),
        max
    );
}


/* ============================================================
   DEEP CLONE
   ============================================================ */

function cloneConfig(config) {
    if (!config) {
        return {};
    }

    try {
        return JSON.parse(
            JSON.stringify(config)
        );
    } catch {
        return {
            ...config
        };
    }
}


/* ============================================================
   SET NESTED VALUE
   ============================================================ */

function setNestedValue(
    object,
    path,
    value
) {
    const result = cloneConfig(object);

    let cursor = result;

    path.forEach((key, index) => {
        if (index === path.length - 1) {
            cursor[key] = value;
            return;
        }

        if (
            !cursor[key] ||
            typeof cursor[key] !== "object"
        ) {
            cursor[key] = {};
        }

        cursor = cursor[key];
    });

    return result;
}


/* ============================================================
   COMPONENT
   ============================================================ */

export default function RuachAgentReceiptStudioSystemC({

    /* --------------------------------------------------------
       CORE RECEIPT DATA
       -------------------------------------------------------- */

    receiptData = {},

    settings = {},

    user = null,

    /* --------------------------------------------------------
       SELECTED TEMPLATE
       -------------------------------------------------------- */

    selectedTemplateId = null,

    /* --------------------------------------------------------
       LIVE DESIGN CONFIGURATION
       -------------------------------------------------------- */

    designConfig = {},

    setDesignConfig = null,

    onDesignConfigChange = null,

    /* --------------------------------------------------------
       ELEMENT SELECTION
       -------------------------------------------------------- */

    selectedElementId = null,

    selectedObjectId = null,

    onSelectElement = null,

    onSelectObject = null,

    /* --------------------------------------------------------
       OPTIONAL RECEIPT DATA UPDATER
       -------------------------------------------------------- */

    setReceiptData = null,

    /* --------------------------------------------------------
       RECEIPT SERVICES
       -------------------------------------------------------- */

    voucher = null,

    isExpired = false,

    daysRemaining = 0,

    qrCodeUrl = "",

    checkoutPayloadLink = "",

    receiptId = null,

    onDownload = null,

    /* --------------------------------------------------------
       OPTIONAL TEMPLATE RENDERER
       --------------------------------------------------------

       This allows future receipt JSX models to be connected
       without changing System C.

       Example:

       renderTemplate={{
           "matrix-grid": MatrixTillSlip,
           "black-gold": BlackGoldTillSlip
       }}

       -------------------------------------------------------- */

    renderTemplate = {},

    /* --------------------------------------------------------
       OPTIONAL EXTERNAL CONTROLS
       -------------------------------------------------------- */

    onTemplateChange = null,

    onCanvasChange = null,

    className = ""

}) {

    /* ========================================================
       TEMPLATE STATE
       ======================================================== */

    const [eventTemplateId, setEventTemplateId] =
        useState(null);


    /* ========================================================
       CANVAS STATE
       ======================================================== */

    const [canvas, setCanvas] =
        useState(DEFAULT_CANVAS);


    /* ========================================================
       SELECTED RECEIPT ELEMENT
       ======================================================== */

    // System C owns the active receipt-element selection.
    // The default target is the Logo, while existing external
    // selection/configuration values remain supported below.
    const [selectedElement, setSelectedElement] =
        useState("logo");

    const [internalSelectedElementId, setInternalSelectedElementId] =
        useState(
            selectedElementId ||
            selectedObjectId ||
            designConfig?.colorGrading?.selectedElementId ||
            designConfig?.selectedElementId ||
            "logo"
        );

    const activeSelectedElementId =
        selectedElement ||
        selectedElementId ||
        selectedObjectId ||
        internalSelectedElementId ||
        designConfig?.colorGrading?.selectedElementId ||
        designConfig?.selectedElementId ||
        "logo";


    /* ========================================================
       DRAG STATE
       ======================================================== */

    const [isDraggingReceipt, setIsDraggingReceipt] =
        useState(false);

    const [isPanningCanvas, setIsPanningCanvas] =
        useState(false);


    /* ========================================================
       RECEIPT POSITION
       ======================================================== */

    const [receiptPosition, setReceiptPosition] =
        useState(() => {

            const storedPosition =
                designConfig?.canvas?.position;

            return {
                x: safeNumber(
                    storedPosition?.x,
                    0
                ),

                y: safeNumber(
                    storedPosition?.y,
                    0
                )
            };
        });


    /* ========================================================
       REFS
       ======================================================== */

    const canvasRef = useRef(null);

    const workspaceRef = useRef(null);

    const dragStartRef = useRef(null);

    const panStartRef = useRef(null);


    /* ========================================================
       SELECTED TEMPLATE
       ========================================================

       IMPORTANT:

       selectedTemplateId is the primary source of truth.

       The event/localStorage values are only fallbacks for
       situations where System C is mounted outside the normal
       AdminPanel business context.

       ======================================================== */

    const effectiveTemplateId =
        selectedTemplateId ||
        eventTemplateId ||
        localStorage.getItem(
            "ruachagent:selectedTillSlipDesign"
        ) ||
        "matrix-grid";


    /* ========================================================
       LISTEN FOR TILL SLIP COLLECTION
       ======================================================== */

    useEffect(() => {

        const handleTemplateSelection = (event) => {

            const templateId =
                event?.detail;

            if (!templateId) {
                return;
            }

            setEventTemplateId(
                templateId
            );

            onTemplateChange?.(
                templateId
            );

        };


        window.addEventListener(
            "ruachagent:tillSlipDesignSelected",
            handleTemplateSelection
        );


        return () => {

            window.removeEventListener(
                "ruachagent:tillSlipDesignSelected",
                handleTemplateSelection
            );

        };

    }, [onTemplateChange]);


    /* ========================================================
       KEEP ELEMENT SELECTION IN SYNC WITH DESIGN CONFIG
       ======================================================== */

    useEffect(() => {

        const configuredSelection =
            designConfig?.colorGrading?.selectedElementId ||
            designConfig?.selectedElementId ||
            null;

        if (
            configuredSelection &&
            configuredSelection !== internalSelectedElementId
        ) {
            setInternalSelectedElementId(
                configuredSelection
            );

            setSelectedElement(
                configuredSelection
            );
        }

    }, [
        designConfig?.colorGrading?.selectedElementId,
        designConfig?.selectedElementId
    ]);


    /* ========================================================
       KEEP CANVAS POSITION IN SYNC WITH DESIGN CONFIG
       ======================================================== */

    useEffect(() => {

        const configuredPosition =
            designConfig?.canvas?.position;

        if (!configuredPosition) {
            return;
        }

        setReceiptPosition({
            x: safeNumber(
                configuredPosition.x,
                0
            ),

            y: safeNumber(
                configuredPosition.y,
                0
            )
        });

    }, [
        designConfig?.canvas?.position?.x,
        designConfig?.canvas?.position?.y
    ]);


    /* ========================================================
       DESIGN CONFIG EMITTER
       ======================================================== */

    const emitDesignConfig = useCallback(
        (nextConfig) => {

            /*
             * Parent-controlled state.
             */

            if (
                typeof setDesignConfig ===
                "function"
            ) {
                setDesignConfig(
                    nextConfig
                );
            }


            /*
             * Optional callback.
             */

            if (
                typeof onDesignConfigChange ===
                "function"
            ) {
                onDesignConfigChange(
                    nextConfig
                );
            }


            /*
             * Optional compatibility event.
             *
             * This allows other studio systems to listen
             * without coupling them directly.
             */

            window.dispatchEvent(
                new CustomEvent(
                    "ruachagent:designConfigChanged",
                    {
                        detail: nextConfig
                    }
                )
            );

        },
        [
            setDesignConfig,
            onDesignConfigChange
        ]
    );


    /* ========================================================
       SELECT RECEIPT ELEMENT
       ======================================================== */

    const handleElementSelect = useCallback(
        (elementId) => {

            if (!elementId) {
                return;
            }

            setSelectedElement(elementId);

            setInternalSelectedElementId(
                elementId
            );

            const nextConfig =
                setNestedValue(
                    designConfig || {},
                    [
                        "colorGrading",
                        "selectedElementId"
                    ],
                    elementId
                );

            emitDesignConfig(
                nextConfig
            );

            onSelectElement?.(
                elementId,
                nextConfig
            );

            onSelectObject?.(
                elementId,
                nextConfig
            );

        },
        [
            designConfig,
            emitDesignConfig,
            onSelectElement,
            onSelectObject
        ]
    );



    /* ========================================================
       UPDATE DESIGN CONFIG
       ======================================================== */

    const updateDesignConfig = useCallback(
        (path, value) => {

            const nextConfig =
                setNestedValue(
                    designConfig || {},
                    path,
                    value
                );

            emitDesignConfig(
                nextConfig
            );

            return nextConfig;

        },
        [
            designConfig,
            emitDesignConfig
        ]
    );


    /* ========================================================
       RECEIPT POSITION → DESIGN CONFIG
       ======================================================== */

    const commitReceiptPosition = useCallback(
        (position) => {

            const nextPosition = {
                x: safeNumber(
                    position.x,
                    0
                ),

                y: safeNumber(
                    position.y,
                    0
                )
            };


            setReceiptPosition(
                nextPosition
            );


            /*
             * This is important.

             * The receipt position is NOT stored merely
             * inside React state.

             * It becomes part of designConfig so that:
             *
             * AI
             * Manual studio controls
             * MatrixTillSlip
             * Save
             *
             * all operate on the same configuration.
             */

            const nextConfig =
                setNestedValue(
                    designConfig || {},
                    [
                        "canvas",
                        "position"
                    ],
                    nextPosition
                );


            emitDesignConfig(
                nextConfig
            );


            onCanvasChange?.({
                type: "receipt-position",
                position: nextPosition,
                designConfig: nextConfig
            });

        },
        [
            designConfig,
            emitDesignConfig,
            onCanvasChange
        ]
    );


    /* ========================================================
       RECEIPT DRAG START
       ======================================================== */

    const handleReceiptPointerDown =
        useCallback(
            (event) => {
                /*
                 * IMPORTANT:
                 * The receipt itself is NOT a single draggable object.
                 *
                 * MatrixTillSlip owns the interactive receipt elements.
                 * When the pointer lands on Logo, Business Name, QR,
                 * Total, Items, Voucher, etc., that element must receive
                 * the interaction and call onSelectElement().
                 *
                 * Therefore System C only starts receipt dragging when
                 * the pointer is placed on the receipt selection frame
                 * itself (the small frame/padding around the receipt),
                 * never when it lands on receipt content.
                 */

                if (event.button !== 0) {
                    return;
                }

                const target =
                    event.target instanceof Element
                        ? event.target
                        : null;

                /*
                 * Never start whole-receipt dragging from an actual
                 * receipt element.
                 */
                if (
                    target?.closest?.(
                        "[data-receipt-element]"
                    )
                ) {
                    return;
                }

                /*
                 * Only the selection frame itself may start a receipt drag.
                 * This prevents clicks on the rendered receipt surface,
                 * text, logo, QR, voucher, items, etc. from becoming grabs.
                 */
                if (
                    event.target !== event.currentTarget
                ) {
                    return;
                }

                event.preventDefault();
                event.stopPropagation();

                setIsDraggingReceipt(true);

                dragStartRef.current = {
                    pointerX: event.clientX,
                    pointerY: event.clientY,
                    originalX: receiptPosition.x,
                    originalY: receiptPosition.y
                };

                event.currentTarget.setPointerCapture?.(
                    event.pointerId
                );
            },
            [receiptPosition]
        );


    /* ========================================================
       RECEIPT DRAG MOVE
       ======================================================== */

    const handleReceiptPointerMove =
        useCallback(
            (event) => {

                if (
                    !isDraggingReceipt ||
                    !dragStartRef.current
                ) {
                    return;
                }


                const deltaX =
                    event.clientX -
                    dragStartRef.current.pointerX;


                const deltaY =
                    event.clientY -
                    dragStartRef.current.pointerY;


                /*
                 * Canvas zoom compensation.
                 *
                 * When the canvas is zoomed to 200%,
                 * moving the mouse 100px should not move
                 * the receipt by 200 logical pixels.
                 */

                const zoom =
                    canvas.zoom || 1;


                let nextX =
                    dragStartRef.current.originalX +
                    deltaX / zoom;


                let nextY =
                    dragStartRef.current.originalY +
                    deltaY / zoom;


                /*
                 * Optional grid snapping.
                 */

                if (
                    canvas.snapToGrid
                ) {

                    const grid =
                        canvas.gridSize ||
                        24;


                    nextX =
                        Math.round(
                            nextX / grid
                        ) * grid;


                    nextY =
                        Math.round(
                            nextY / grid
                        ) * grid;

                }


                commitReceiptPosition({
                    x: nextX,
                    y: nextY
                });

            },
            [
                isDraggingReceipt,
                canvas.zoom,
                canvas.snapToGrid,
                canvas.gridSize,
                commitReceiptPosition
            ]
        );


    /* ========================================================
       RECEIPT DRAG END
       ======================================================== */

    const handleReceiptPointerUp =
        useCallback(() => {

            setIsDraggingReceipt(
                false
            );

            dragStartRef.current =
                null;

        }, []);


    /* ========================================================
       CANVAS PAN START
       ======================================================== */

    const handleCanvasPointerDown =
        useCallback(
            (event) => {

                /*
                 * Middle mouse button OR Hand mode.
                 */

                const shouldPan =
                    event.button === 1 ||
                    canvas.mode === "hand";

                if (!shouldPan) {
                    return;
                }


                event.preventDefault();


                setIsPanningCanvas(
                    true
                );


                panStartRef.current = {
                    pointerX:
                        event.clientX,

                    pointerY:
                        event.clientY,

                    originalX:
                        canvas.position.x,

                    originalY:
                        canvas.position.y
                };

            },
            [
                canvas.mode,
                canvas.position
            ]
        );


    /* ========================================================
       CANVAS PAN MOVE
       ======================================================== */

    const handleCanvasPointerMove =
        useCallback(
            (event) => {

                if (
                    !isPanningCanvas ||
                    !panStartRef.current
                ) {
                    return;
                }


                const deltaX =
                    event.clientX -
                    panStartRef.current.pointerX;


                const deltaY =
                    event.clientY -
                    panStartRef.current.pointerY;


                setCanvas(
                    previous => ({
                        ...previous,

                        position: {
                            x:
                                panStartRef.current.originalX +
                                deltaX,

                            y:
                                panStartRef.current.originalY +
                                deltaY
                        }
                    })
                );

            },
            [
                isPanningCanvas
            ]
        );


    /* ========================================================
       CANVAS PAN END
       ======================================================== */

    const handleCanvasPointerUp =
        useCallback(() => {

            setIsPanningCanvas(
                false
            );

            panStartRef.current =
                null;

        }, []);


    /* ========================================================
       ZOOM
       ======================================================== */

    const updateZoom =
        useCallback(
            (amount) => {

                setCanvas(
                    previous => ({
                        ...previous,

                        zoom: clamp(
                            previous.zoom +
                            amount,
                            0.25,
                            2.5
                        )
                    })
                );

            },
            []
        );


    /* ========================================================
       RESET VIEW
       ======================================================== */

    const resetCanvasView =
        useCallback(() => {

            setCanvas({
                ...DEFAULT_CANVAS,
                zoom: 0.72
            });

            commitReceiptPosition({
                x: 0,
                y: 0
            });

        }, [
            commitReceiptPosition
        ]);


    /* ========================================================
       CENTER RECEIPT
       ======================================================== */

    const centerReceipt =
        useCallback(() => {

            commitReceiptPosition({
                x: 0,
                y: 0
            });

        }, [
            commitReceiptPosition
        ]);


    /* ========================================================
       FIT RECEIPT
       ======================================================== */

    const fitReceipt =
        useCallback(() => {

            setCanvas(
                previous => ({
                    ...previous,
                    zoom: 0.72,
                    position: {
                        x: 0,
                        y: 0
                    }
                })
            );

            commitReceiptPosition({
                x: 0,
                y: 0
            });

        }, [
            commitReceiptPosition
        ]);


    /* ========================================================
       GRID TOGGLE
       ======================================================== */

    const toggleGrid =
        useCallback(() => {

            setCanvas(
                previous => ({
                    ...previous,
                    grid:
                        !previous.grid
                })
            );

        }, []);


    /* ========================================================
       MODE
       ======================================================== */

    const setCanvasMode =
        useCallback(
            (mode) => {

                setCanvas(
                    previous => ({
                        ...previous,
                        mode
                    })
                );

            },
            []
        );


    /* ========================================================
       CURRENCY
       ======================================================== */

    const activeCurrencySymbol =
        useMemo(() => {

            switch (
            settings?.currency
            ) {

                case "ZAR":
                    return "R";

                case "USD":
                    return "$";

                case "EUR":
                    return "€";

                case "GBP":
                    return "£";

                default:
                    return "";

            }

        }, [
            settings?.currency
        ]);


    /* ========================================================
       TEMPLATE COMPONENT
       ======================================================== */

    const TemplateComponent =
        renderTemplate?.[
        effectiveTemplateId
        ];


    /* ========================================================
       MATRIX RECEIPT PROPS
       ======================================================== */

    const matrixReceiptProps =
        useMemo(() => ({
            receiptData,

            settings,

            user,

            designConfig,

            voucher,

            isExpired,

            daysRemaining,

            qrCodeUrl,

            checkoutPayloadLink,

            receiptId,

            onDownload,

            activeCurrencySymbol,

            selectedElement:
                selectedElement,

            selectedElementId:
                activeSelectedElementId,

            onSelectElement:
                handleElementSelect

        }), [
            receiptData,
            settings,
            user,
            designConfig,
            voucher,
            isExpired,
            daysRemaining,
            qrCodeUrl,
            checkoutPayloadLink,
            receiptId,
            onDownload,
            activeCurrencySymbol,
            selectedElement,
            activeSelectedElementId,
            handleElementSelect
        ]);


    /* ========================================================
       RENDER RECEIPT
       ======================================================== */

    const renderReceipt =
        () => {

            /*
             * Matrix Grid is currently the actual
             * MatrixTillSlip renderer.
             */

            if (
                effectiveTemplateId ===
                "matrix-grid"
            ) {

                return (
                    <MatrixTillSlip
                        {...matrixReceiptProps}
                    />
                );

            }


            /*
             * Future templates can be injected
             * without changing System C.
             */

            if (
                TemplateComponent
            ) {

                return (
                    <TemplateComponent
                        {...matrixReceiptProps}
                    />
                );

            }


            /*
             * Safe fallback.

             * We deliberately DO NOT render MatrixTillSlip
             * for another template ID because that would make
             * the selected template lie about which design
             * is actually active.
             */

            return (
                <div
                    style={
                        styles.templatePlaceholder
                    }
                >

                    <div
                        style={
                            styles.placeholderIcon
                        }
                    >
                        <Monitor
                            size={28}
                        />
                    </div>

                    <strong>
                        {effectiveTemplateId}
                    </strong>

                    <span>
                        Template selected
                    </span>

                    <small>
                        Connect this template's
                        receipt renderer to
                        Receipt Canvas.
                    </small>

                </div>
            );

        };


    /* ========================================================
       DESIGN CONFIG STATUS
       ======================================================== */

    const configObject =
        designConfig || {};


    const configKeys =
        Object.keys(
            configObject
        );


    /* ========================================================
       RENDER
       ======================================================== */

    return (

        <section
            className={
                `ruachagent-receipt-canvas ${className}`
            }
            style={
                styles.root
            }
        >

            {/* ==================================================
                CANVAS HEADER
               ================================================== */}

            <div
                style={
                    styles.canvasHeader
                }
            >

                <div
                    style={
                        styles.headerIdentity
                    }
                >

                </div>


                {/* ============================================
                    CANVAS TOOLS
                   ============================================ */}

                <div
                    style={
                        styles.canvasToolbar
                    }
                >


                    <button
                        type="button"
                        title="Zoom out"
                        onClick={() =>
                            updateZoom(
                                -0.1
                            )
                        }
                        style={
                            styles.toolButton
                        }
                    >
                        <ZoomOut
                            size={16}
                        />
                    </button>


                    <div
                        style={
                            styles.zoomDisplay
                        }
                    >
                        {Math.round(
                            canvas.zoom *
                            100
                        )}
                        %
                    </div>


                    <button
                        type="button"
                        title="Zoom in"
                        onClick={() =>
                            updateZoom(
                                0.1
                            )
                        }
                        style={
                            styles.toolButton
                        }
                    >
                        <ZoomIn
                            size={16}
                        />
                    </button>


                    <div
                        style={
                            styles.toolbarDivider
                        } />


                    <button
                        type="button"
                        title="Toggle grid"
                        onClick={
                            toggleGrid
                        }
                        style={{
                            ...styles.toolButton,

                            ...(canvas.grid
                                ? styles.toolButtonActive
                                : {})
                        }}
                    >
                        <Grid3X3
                            size={16}
                        />
                    </button>

                </div>


                {/* ============================================
                    TEMPLATE STATUS
                   ============================================ */}

                <div
                    style={
                        styles.templateStatus
                    }
                >

                    <span>
                        Template
                    </span>

                    <strong>
                        {effectiveTemplateId}
                    </strong>

                </div>

            </div>


            {/* ==================================================
                CANVAS WORKSPACE
               ================================================== */}

            <div
                ref={
                    workspaceRef
                }
                style={{
                    ...styles.workspace,

                    cursor:
                        canvas.mode ===
                            "hand"
                            ? (
                                isPanningCanvas
                                    ? "grabbing"
                                    : "grab"
                            )
                            : "default"
                }}

                onPointerDown={
                    handleCanvasPointerDown
                }

                onPointerMove={
                    handleCanvasPointerMove
                }

                onPointerUp={
                    handleCanvasPointerUp
                }

                onPointerLeave={
                    handleCanvasPointerUp
                }
            >

                {/* ==============================================
                    CANVAS GRID
                   ============================================== */}

                <div
                    ref={
                        canvasRef
                    }
                    style={{
                        ...styles.canvasSurface,

                        backgroundImage:
                            canvas.grid
                                ? `
                                    linear-gradient(
                                        rgba(0, 179, 255, 0.055) 1px,
                                        transparent 1px
                                    ),
                                    linear-gradient(
                                        90deg,
                                        rgba(0, 179, 255, 0.055) 1px,
                                        transparent 1px
                                    ),
                                    radial-gradient(
                                        circle at center,
                                        rgba(0, 196, 255, 0.06),
                                        transparent 48%
                                    )
                                  `
                                : `
                                    radial-gradient(
                                        circle at center,
                                        rgba(0, 196, 255, 0.06),
                                        transparent 48%
                                    )
                                  `,

                        backgroundSize:
                            canvas.grid
                                ? `
                                    ${canvas.gridSize}px
                                    ${canvas.gridSize}px,
                                    ${canvas.gridSize}px
                                    ${canvas.gridSize}px,
                                    100% 100%
                                  `
                                : "100% 100%"
                    }}
                >

                    {/* ==========================================
                        WORKSPACE COORDINATE ORIGIN
                       ========================================== */}

                    <div
                        style={
                            styles.originMarker
                        }
                    >

                        <div
                            style={
                                styles.originHorizontal
                            }
                        />

                        <div
                            style={
                                styles.originVertical
                            }

                        />

                        <span
                            style={
                                styles.originLabel
                            }
                        >
                            0, 0
                        </span>

                    </div>


                    {/* ==========================================
                        RECEIPT STAGE
                       ========================================== */}

                    <div
                        style={{
                            ...styles.receiptStage,

                            transform: `
                                translate(
                                    calc(
                                        -50% +
                                        ${canvas.position.x}px
                                    ),
                                    calc(
                                        -50% +
                                        ${canvas.position.y}px
                                    )
                                )
                                scale(
                                    ${canvas.zoom}
                                )
                            `
                        }}
                    >

                        {/* ======================================
                            RECEIPT SELECTION FRAME
                           ====================================== */}

                        <div
                            style={{
                                ...styles.receiptSelection,

                                cursor: isDraggingReceipt
                                    ? "grabbing"
                                    : "default",

                                ...(isDraggingReceipt
                                    ? styles.receiptSelectionDragging
                                    : {})
                            }}

                            onPointerDown={
                                handleReceiptPointerDown
                            }

                            onPointerMove={
                                handleReceiptPointerMove
                            }

                            onPointerUp={
                                handleReceiptPointerUp
                            }

                            onPointerCancel={
                                handleReceiptPointerUp
                            }
                        >

                            {/* ==================================
                                RECEIPT CONTENT
                               ================================== */}

                            <div
                                style={
                                    styles.receiptContainer
                                }

                                onClick={
                                    (event) => {

                                        const targetElement =
                                            event.target instanceof Element
                                                ? event.target
                                                : null;

                                        const receiptElement =
                                            targetElement?.closest(
                                                "[data-receipt-element]"
                                            );

                                        /*
                                         * ElementFrame stops propagation
                                         * for Logo, Business Name, QR,
                                         * Items, Total, etc. Therefore
                                         * reaching this handler means the
                                         * user clicked the receipt surface.
                                         */
                                        if (
                                            receiptElement
                                        ) {
                                            return;
                                        }

                                        handleElementSelect(
                                            "background"
                                        );
                                    }
                                }
                            >

                                {renderReceipt()}

                            </div>


                            {/* ==================================
                                TRANSFORM HANDLES
                               ================================== */}

                            <div
                                style={
                                    styles.handleTopLeft
                                }
                            />

                            <div
                                style={
                                    styles.handleTopRight
                                }
                            />

                            <div
                                style={
                                    styles.handleBottomLeft
                                }
                            />

                            <div
                                style={
                                    styles.handleBottomRight
                                }
                            />


                            {/* ==================================
                                RECEIPT LABEL
                               ================================== */}

                            <div
                                style={
                                    styles.receiptLabel
                                }
                            >
                                <Move
                                    size={11}
                                />

                                {effectiveTemplateId}
                            </div>

                        </div>

                    </div>


                    {/* ==========================================
                        CANVAS HUD
                       ========================================== */}

                    <div
                        style={
                            styles.canvasHud
                        }
                    >

                        <div
                            style={
                                styles.hudItem
                            }
                        >
                            <Move
                                size={12}
                            />

                            <span>
                                Select receipt elements
                            </span>
                        </div>

                        <div
                            style={
                                styles.hudItem
                            }
                        >
                            <Grid3X3
                                size={12}
                            />

                            <span>
                                {canvas.grid
                                    ? "Grid on"
                                    : "Grid off"}
                            </span>
                        </div>

                        <div
                            style={
                                styles.hudItem
                            }
                        >
                            <MousePointer2
                                size={12}
                            />

                            <span>
                                Selected:
                                {" "}
                                {activeSelectedElementId || "None"}
                            </span>
                        </div>

                        <div
                            style={
                                styles.hudItem
                            }
                        >
                            <Crosshair
                                size={12}
                            />

                            <span>
                                X {Math.round(
                                    receiptPosition.x
                                )}
                            </span>

                            <span>
                                Y {Math.round(
                                    receiptPosition.y
                                )}
                            </span>
                        </div>

                    </div>

                </div>

            </div>


            {/* ==================================================
                CANVAS FOOTER
               ================================================== */}

            <div
                style={
                    styles.canvasFooter
                }
            >

            </div>

        </section>
    );
}


/* ============================================================
   SYSTEM C — STYLES
   ============================================================

   IMPORTANT:

   These styles intentionally live inside the const styles
   pattern so the component can be dropped into AdminPanel
   without requiring another CSS file.

   ============================================================ */

const styles = {

    /* ========================================================
       ROOT
       ======================================================== */

    root: {
        width: "100%",
        height: "100%",
        minHeight: 0,

        display: "flex",
        flexDirection: "column",

        overflow: "hidden",

        background:
            "linear-gradient(180deg, #090d12 0%, #05080c 100%)",

        border:
            "1px solid rgba(0, 188, 255, 0.16)",

        boxShadow:
            "inset 0 1px 0 rgba(255,255,255,0.025), 0 20px 70px rgba(0,0,0,0.45)",

        color: "#e7f7ff",

        fontFamily:
            "Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    },


    /* ========================================================
       HEADER
       ======================================================== */

    canvasHeader: {
        minHeight: "58px",

        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",

        gap: "18px",

        padding:
            "0 18px",

        background:
            "linear-gradient(180deg, #10161d 0%, #0a0f14 100%)",

        borderBottom:
            "1px solid rgba(0, 196, 255, 0.12)"
    },


    headerIdentity: {
        display: "flex",
        alignItems: "center",
        gap: "12px",

        minWidth: 0
    },


    liveIndicator: {
        display: "flex",
        alignItems: "center",
        gap: "6px",

        padding:
            "5px 8px",

        border:
            "1px solid rgba(0, 229, 255, 0.24)",

        borderRadius: "5px",

        background:
            "rgba(0, 190, 255, 0.055)",

        color: "#49dfff",

        fontSize: "9px",
        fontWeight: 800,
        letterSpacing: "0.1em"
    },


    liveDot: {
        width: "6px",
        height: "6px",

        borderRadius: "50%",

        background: "#00d9ff",

        boxShadow:
            "0 0 9px rgba(0, 217, 255, 0.95)"
    },


    headerTitle: {
        display: "block",

        color: "#f2fbff",

        fontSize: "13px",
        fontWeight: 700,

        letterSpacing: "-0.01em"
    },


    headerSubtitle: {
        display: "block",

        marginTop: "2px",

        color: "#607583",

        fontSize: "9px",

        textTransform: "uppercase",

        letterSpacing: "0.08em"
    },


    /* ========================================================
       TOOLBAR
       ======================================================== */

    canvasToolbar: {
        display: "flex",
        alignItems: "center",

        gap: "5px",

        padding: "4px",

        border:
            "1px solid rgba(255,255,255,0.055)",

        borderRadius: "7px",

        background:
            "rgba(5, 9, 13, 0.92)",

        boxShadow:
            "0 8px 24px rgba(0,0,0,0.32)"
    },


    toolButton: {
        width: "30px",
        height: "28px",

        display: "flex",
        alignItems: "center",
        justifyContent: "center",

        border:
            "1px solid transparent",

        borderRadius: "5px",

        background:
            "transparent",

        color: "#78909c",

        cursor: "pointer",

        transition:
            "all 160ms ease"
    },


    toolButtonActive: {
        color: "#00d9ff",

        background:
            "rgba(0, 193, 255, 0.09)",

        border:
            "1px solid rgba(0, 204, 255, 0.25)",

        boxShadow:
            "0 0 12px rgba(0, 190, 255, 0.10)"
    },


    toolbarDivider: {
        width: "1px",
        height: "19px",

        margin:
            "0 3px",

        background:
            "rgba(255,255,255,0.08)"
    },


    zoomDisplay: {
        minWidth: "48px",

        textAlign: "center",

        color: "#d5f7ff",

        fontSize: "10px",
        fontWeight: 700
    },


    templateStatus: {
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",

        minWidth: "100px"
    },


    /* ========================================================
       WORKSPACE
       ======================================================== */

    workspace: {
        position: "relative",

        flex: 1,

        minHeight: 0,

        overflow: "hidden",

        background:
            "#070b10"
    },


    canvasSurface: {
        position: "absolute",

        inset: 0,

        overflow: "hidden",

        backgroundColor:
            "#080c11"
    },


    /* ========================================================
       ORIGIN
       ======================================================== */

    originMarker: {
        position: "absolute",

        left: "50%",
        top: "50%",

        width: 0,
        height: 0,

        pointerEvents: "none",

        opacity: 0.45
    },


    originHorizontal: {
        position: "absolute",

        left: "-100vw",
        top: "-0.5px",

        width: "200vw",
        height: "1px",

        background:
            "rgba(0, 208, 255, 0.10)"
    },


    originVertical: {
        position: "absolute",

        left: "-0.5px",
        top: "-100vh",

        width: "1px",
        height: "200vh",

        background:
            "rgba(0, 208, 255, 0.10)"
    },


    originLabel: {
        position: "absolute",

        top: "7px",
        left: "7px",

        color:
            "rgba(95, 205, 235, 0.35)",

        fontSize: "8px",

        fontFamily:
            "'SFMono-Regular', Consolas, monospace"
    },


    /* ========================================================
       RECEIPT STAGE
       ======================================================== */

    receiptStage: {
        position: "absolute",

        left: "50%",
        top: "50%",

        transformOrigin:
            "center center",

        width: "max-content",
        height: "max-content",

        transition:
            "transform 120ms ease",

        zIndex: 10
    },


    receiptSelection: {
        position: "relative",

        width: "max-content",
        height: "max-content",

        padding: "7px",

        border:
            "1px solid rgba(0, 204, 255, 0.75)",

        borderRadius: "4px",

        background:
            "rgba(0, 194, 255, 0.018)",

        boxShadow:
            "0 0 0 1px rgba(0, 205, 255, 0.08), 0 0 24px rgba(0, 191, 255, 0.10)",

        cursor: "grab",

        userSelect: "none",

        touchAction: "none"
    },


    receiptSelectionDragging: {
        cursor: "grabbing",

        border:
            "1px solid rgba(0, 229, 255, 0.98)",

        boxShadow:
            "0 0 0 1px rgba(0, 229, 255, 0.25), 0 0 35px rgba(0, 191, 255, 0.20)"
    },


    receiptContainer: {
        position: "relative",

        width: "max-content",
        height: "max-content",

        pointerEvents: "none"
    },


    /* ========================================================
       TRANSFORM HANDLES
       ======================================================== */

    handleTopLeft: {
        position: "absolute",

        top: "-4px",
        left: "-4px",

        width: "7px",
        height: "7px",

        background: "#071019",

        border:
            "1px solid #00d9ff",

        boxShadow:
            "0 0 7px rgba(0, 217, 255, 0.8)"
    },


    handleTopRight: {
        position: "absolute",

        top: "-4px",
        right: "-4px",

        width: "7px",
        height: "7px",

        background: "#071019",

        border:
            "1px solid #00d9ff",

        boxShadow:
            "0 0 7px rgba(0, 217, 255, 0.8)"
    },


    handleBottomLeft: {
        position: "absolute",

        bottom: "-4px",
        left: "-4px",

        width: "7px",
        height: "7px",

        background: "#071019",

        border:
            "1px solid #00d9ff",

        boxShadow:
            "0 0 7px rgba(0, 217, 255, 0.8)"
    },


    handleBottomRight: {
        position: "absolute",

        bottom: "-4px",
        right: "-4px",

        width: "7px",
        height: "7px",

        background: "#071019",

        border:
            "1px solid #00d9ff",

        boxShadow:
            "0 0 7px rgba(0, 217, 255, 0.8)"
    },


    receiptLabel: {
        position: "absolute",

        left: "50%",
        bottom: "-29px",

        transform:
            "translateX(-50%)",

        display: "flex",
        alignItems: "center",
        gap: "5px",

        padding:
            "5px 8px",

        border:
            "1px solid rgba(0, 205, 255, 0.22)",

        borderRadius: "4px",

        background:
            "rgba(4, 10, 15, 0.94)",

        color: "#64dfff",

        fontSize: "8px",
        fontWeight: 700,

        textTransform: "uppercase",

        letterSpacing: "0.08em",

        whiteSpace: "nowrap",

        pointerEvents: "none"
    },


    /* ========================================================
       TEMPLATE FALLBACK
       ======================================================== */

    templatePlaceholder: {
        minWidth: "250px",
        minHeight: "400px",

        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",

        gap: "8px",

        padding: "40px",

        border:
            "1px dashed rgba(0, 202, 255, 0.30)",

        borderRadius: "8px",

        background:
            "linear-gradient(180deg, rgba(0,190,255,0.035), rgba(0,0,0,0.15))",

        color: "#d8f7ff",

        textAlign: "center"
    },


    placeholderIcon: {
        width: "54px",
        height: "54px",

        display: "flex",
        alignItems: "center",
        justifyContent: "center",

        border:
            "1px solid rgba(0, 206, 255, 0.25)",

        borderRadius: "10px",

        background:
            "rgba(0, 194, 255, 0.06)",

        color: "#00d9ff",

        marginBottom: "7px"
    },


    /* ========================================================
       HUD
       ======================================================== */

    canvasHud: {
        position: "absolute",

        left: "16px",
        bottom: "16px",

        display: "flex",
        alignItems: "center",

        gap: "7px",

        zIndex: 30,

        pointerEvents: "none"
    },


    hudItem: {
        display: "flex",
        alignItems: "center",

        gap: "5px",

        padding:
            "6px 8px",

        border:
            "1px solid rgba(255,255,255,0.07)",

        borderRadius: "5px",

        background:
            "rgba(5, 9, 13, 0.86)",

        color: "#607783",

        fontSize: "8px",

        backdropFilter:
            "blur(10px)"
    },


    /* ========================================================
       FOOTER
       ======================================================== */

    canvasFooter: {
        minHeight: "36px",

        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",

        gap: "15px",

        padding:
            "0 14px",

        borderTop:
            "1px solid rgba(255,255,255,0.055)",

        background:
            "#080d12",

        color: "#536975",

        fontSize: "9px"
    },


    footerLeft: {
        display: "flex",
        alignItems: "center",

        gap: "12px"
    },


    footerLive: {
        display: "flex",
        alignItems: "center",

        gap: "5px",

        color: "#55dfff",

        fontSize: "8px",
        fontWeight: 800,

        letterSpacing: "0.08em"
    },


    footerCenter: {
        display: "flex",
        alignItems: "center",

        gap: "14px",

        color: "#6e818b",

        fontFamily:
            "'SFMono-Regular', Consolas, monospace",

        fontSize: "8px"
    },


    footerRight: {
        display: "flex",
        alignItems: "center",

        gap: "5px"
    },


    footerButton: {
        display: "flex",
        alignItems: "center",

        gap: "5px",

        padding:
            "5px 8px",

        border:
            "1px solid rgba(0, 202, 255, 0.12)",

        borderRadius: "4px",

        background:
            "rgba(0, 185, 255, 0.035)",

        color: "#79a5b4",

        fontSize: "8px",

        cursor: "pointer"
    }

};