import React, { useMemo, useState } from "react";

/**
 * ========================================================================
 * RUACHAGENT AI — SYSTEM E
 * ANIMATION TIMELINE
 * ========================================================================
 *
 * RESPONSIBILITY
 * ------------------------------------------------------------------------
 * System E owns the animation timeline / motion-design layer of the
 * RuachAgent Receipt Studio.
 *
 * It does NOT edit JSX receipt designs.
 *
 * It modifies animation configuration which can be consumed by:
 *
 *      System D — Canvas Renderer
 *              ↓
 *      MatrixTillSlip.jsx
 *
 * and ultimately by the customer-facing receipt renderer.
 *
 * ARCHITECTURE
 * ------------------------------------------------------------------------
 *
 *      Object Model
 *           ↓
 *      Design Inspector
 *           ↓
 *      Animation Timeline  ← SYSTEM E
 *           ↓
 *      designConfig.animation
 *           ↓
 *      Canvas Renderer
 *           ↓
 *      Receipt
 *
 * ========================================================================
 */

export default function AnimationTimeline({
    designConfig = {},
    selectedObjectId = "logo",
    onAnimationConfigChange,
    onSelectObject,
}) {
    const animationRoot =
        designConfig?.animation || {};

    const objectAnimations =
        animationRoot?.objects || {};

    const selectedAnimation =
        objectAnimations?.[selectedObjectId] ||
        createDefaultAnimation(selectedObjectId);

    const [activeTrack, setActiveTrack] =
        useState("main");

    const [selectedKeyframeId, setSelectedKeyframeId] =
        useState(
            selectedAnimation?.keyframes?.[0]?.id ||
            null
        );

    const [isPlaying, setIsPlaying] =
        useState(false);

    const [timelineZoom, setTimelineZoom] =
        useState(1);

    const [currentTime, setCurrentTime] =
        useState(0);

    const [snapEnabled, setSnapEnabled] =
        useState(true);

    /*
     * --------------------------------------------------------------------
     * CONFIGURATION UPDATE
     * --------------------------------------------------------------------
     *
     * Every control writes into:
     *
     * designConfig.animation.objects[objectId]
     *
     * No JSX is modified.
     */

    const updateAnimation = (
        patch
    ) => {
        const current =
            objectAnimations?.[selectedObjectId] ||
            createDefaultAnimation(
                selectedObjectId
            );

        const nextAnimation = {
            ...current,
            ...patch,
        };

        const nextConfig = {
            ...designConfig,

            animation: {
                ...animationRoot,

                objects: {
                    ...objectAnimations,

                    [selectedObjectId]:
                        nextAnimation,
                },
            },
        };

        if (
            typeof onAnimationConfigChange ===
            "function"
        ) {
            onAnimationConfigChange(
                nextConfig
            );
        }
    };

    /*
     * --------------------------------------------------------------------
     * KEYFRAME UPDATE
     * --------------------------------------------------------------------
     */

    const updateKeyframe = (
        keyframeId,
        patch
    ) => {
        const keyframes =
            selectedAnimation?.keyframes ||
            [];

        const nextKeyframes =
            keyframes.map((keyframe) =>
                keyframe.id === keyframeId
                    ? {
                        ...keyframe,
                        ...patch,
                    }
                    : keyframe
            );

        updateAnimation({
            keyframes:
                nextKeyframes,
        });
    };

    /*
     * --------------------------------------------------------------------
     * ADD KEYFRAME
     * --------------------------------------------------------------------
     */

    const addKeyframe = (
        time = currentTime
    ) => {
        const keyframes =
            selectedAnimation?.keyframes ||
            [];

        const nextId =
            `kf-${Date.now()}`;

        const newKeyframe = {
            id: nextId,

            time: snapTime(time),

            easing:
                selectedAnimation?.easing ||
                "ease-in-out",

            properties: {
                x: 0,
                y: 0,
                scale: 1,
                rotation: 0,
                opacity: 1,
                blur: 0,
                glow: 0,
            },
        };

        const nextKeyframes = [
            ...keyframes,
            newKeyframe,
        ].sort(
            (a, b) =>
                Number(a.time) -
                Number(b.time)
        );

        updateAnimation({
            keyframes:
                nextKeyframes,
        });

        setSelectedKeyframeId(
            nextId
        );
    };

    /*
     * --------------------------------------------------------------------
     * DELETE KEYFRAME
     * --------------------------------------------------------------------
     */

    const deleteKeyframe = (
        keyframeId
    ) => {
        const keyframes =
            selectedAnimation?.keyframes ||
            [];

        if (keyframes.length <= 1) {
            return;
        }

        const nextKeyframes =
            keyframes.filter(
                (keyframe) =>
                    keyframe.id !==
                    keyframeId
            );

        updateAnimation({
            keyframes:
                nextKeyframes,
        });

        setSelectedKeyframeId(
            nextKeyframes?.[0]?.id ||
            null
        );
    };

    /*
     * --------------------------------------------------------------------
     * SNAP
     * --------------------------------------------------------------------
     */

    const snapTime = (
        time
    ) => {
        const safe =
            Math.max(
                0,
                Math.min(
                    safeNumber(
                        selectedAnimation?.duration,
                        3000
                    ),
                    Number(time) || 0
                )
            );

        if (!snapEnabled) {
            return safe;
        }

        const frame =
            1000 / 30;

        return Math.round(
            safe / frame
        ) * frame;
    };

    /*
     * --------------------------------------------------------------------
     * DURATION
     * --------------------------------------------------------------------
     */

    const duration =
        safeNumber(
            selectedAnimation?.duration,
            3000
        );

    const fps =
        safeNumber(
            selectedAnimation?.fps,
            30
        );

    /*
     * --------------------------------------------------------------------
     * TIMELINE METRICS
     * --------------------------------------------------------------------
     */

    const timelineWidth =
        920 * timelineZoom;

    const pixelsPerMillisecond =
        timelineWidth /
        Math.max(
            duration,
            1
        );

    const timeToPixels = (
        time
    ) =>
        Number(time || 0) *
        pixelsPerMillisecond;

    const pixelsToTime = (
        pixels
    ) =>
        pixels /
        pixelsPerMillisecond;

    /*
     * --------------------------------------------------------------------
     * RULER
     * --------------------------------------------------------------------
     */

    const rulerMarks =
        useMemo(() => {
            const marks = [];

            const step =
                duration >= 10000
                    ? 1000
                    : duration >= 5000
                        ? 500
                        : 250;

            for (
                let time = 0;
                time <= duration;
                time += step
            ) {
                marks.push(time);
            }

            return marks;
        }, [
            duration,
            timelineZoom,
        ]);

    /*
     * --------------------------------------------------------------------
     * PLAYHEAD
     * --------------------------------------------------------------------
     */

    const playheadLeft =
        timeToPixels(
            currentTime
        );

    /*
     * --------------------------------------------------------------------
     * 360 ROTATION PRESET
     * --------------------------------------------------------------------
     */

    const enable360Rotation =
        () => {
            updateAnimation({
                enabled: true,

                type:
                    "rotation",

                duration:
                    4000,

                easing:
                    "linear",

                delay:
                    0,

                loop:
                    "infinite",

                keyframes: [
                    {
                        id:
                            "kf-0",

                        time:
                            0,

                        easing:
                            "linear",

                        properties: {
                            rotation:
                                0,
                        },
                    },

                    {
                        id:
                            "kf-360",

                        time:
                            4000,

                        easing:
                            "linear",

                        properties: {
                            rotation:
                                360,
                        },
                    },
                ],
            });

            setSelectedKeyframeId(
                "kf-360"
            );
        };

    /*
     * --------------------------------------------------------------------
     * RESET
     * --------------------------------------------------------------------
     */

    const resetAnimation =
        () => {
            updateAnimation(
                createDefaultAnimation(
                    selectedObjectId
                )
            );

            setCurrentTime(0);

            setSelectedKeyframeId(
                "kf-0"
            );
        };

    /*
     * --------------------------------------------------------------------
     * RENDER
     * --------------------------------------------------------------------
     */

    return (
        <section
            style={styles.shell}
            className="ruach-animation-timeline"
        >
            {/* ============================================================
                TOP HEADER
            ============================================================= */}

            <header style={styles.header}>
                <div style={styles.headerIdentity}>
                    <div style={styles.headerOrb}>
                        ◈
                    </div>

                    <div>
                        <div
                            style={
                                styles.eyebrow
                            }
                        >
                            RUACHAGENT //
                            MOTION ENGINE
                        </div>

                        <h2
                            style={
                                styles.title
                            }
                        >
                            ANIMATION TIMELINE
                        </h2>

                        <p
                            style={
                                styles.subtitle
                            }
                        >
                            Keyframe-based receipt
                            motion control
                        </p>
                    </div>
                </div>

                <div
                    style={
                        styles.headerTelemetry
                    }
                >
                    <div
                        style={
                            styles.liveIndicator
                        }
                    >
                        <span
                            style={
                                styles.liveDot
                            }
                        />
                        MOTION LINK
                    </div>

                    <div
                        style={
                            styles.objectChip
                        }
                    >
                        OBJECT //
                        <strong>
                            {String(
                                selectedObjectId
                            ).toUpperCase()}
                        </strong>
                    </div>
                </div>
            </header>

            {/* ============================================================
                CONTROL STRIP
            ============================================================= */}

            <div style={styles.controlStrip}>
                <button
                    style={
                        isPlaying
                            ? styles.toolButtonActive
                            : styles.toolButton
                    }
                    onClick={() =>
                        setIsPlaying(
                            (value) =>
                                !value
                        )
                    }
                >
                    {isPlaying
                        ? "❚❚"
                        : "▶"}
                </button>

                <button
                    style={
                        styles.toolButton
                    }
                    onClick={() =>
                        setCurrentTime(0)
                    }
                >
                    ⏮
                </button>

                <button
                    style={
                        styles.toolButton
                    }
                    onClick={() =>
                        setCurrentTime(
                            duration
                        )
                    }
                >
                    ⏭
                </button>

                <div
                    style={
                        styles.timeDisplay
                    }
                >
                    {formatTime(
                        currentTime
                    )}
                    <span>
                        /
                    </span>
                    {formatTime(
                        duration
                    )}
                </div>

                <div
                    style={
                        styles.controlDivider
                    }
                />

                <button
                    style={
                        styles.presetButton
                    }
                    onClick={
                        enable360Rotation
                    }
                >
                    ◌ 360° ROTATION
                </button>

                <button
                    style={
                        styles.presetButton
                    }
                    onClick={() =>
                        updateAnimation({
                            enabled: true,
                            type:
                                "floating",
                        })
                    }
                >
                    FLOAT
                </button>

                <button
                    style={
                        styles.presetButton
                    }
                    onClick={() =>
                        updateAnimation({
                            enabled: true,
                            type:
                                "pulse",
                        })
                    }
                >
                    PULSE
                </button>

                <button
                    style={
                        styles.resetButton
                    }
                    onClick={
                        resetAnimation
                    }
                >
                    RESET
                </button>
            </div>

            {/* ============================================================
                MAIN TIMELINE AREA
            ============================================================= */}

            <div style={styles.timelineWorkspace}>
                {/* ========================================================
                    TRACK HEADER
                ========================================================= */}

                <aside
                    style={
                        styles.trackSidebar
                    }
                >
                    <div
                        style={
                            styles.panelHeading
                        }
                    >
                        <span>
                            TRACKS
                        </span>

                        <span
                            style={
                                styles.panelCount
                            }
                        >
                            01
                        </span>
                    </div>

                    <div
                        style={
                            styles.trackList
                        }
                    >
                        <div
                            style={
                                activeTrack ===
                                    "main"
                                    ? styles.trackItemActive
                                    : styles.trackItem
                            }
                            onClick={() =>
                                setActiveTrack(
                                    "main"
                                )
                            }
                        >
                            <span
                                style={
                                    styles.trackIcon
                                }
                            >
                                ◆
                            </span>

                            <div>
                                <strong>
                                    {String(
                                        selectedObjectId
                                    ).toUpperCase()}
                                </strong>

                                <small>
                                    MASTER MOTION
                                </small>
                            </div>

                            <span
                                style={
                                    styles.trackStatus
                                }
                            >
                                ●
                            </span>
                        </div>

                        <div
                            style={
                                styles.trackProperty
                            }
                        >
                            <span>↔</span>
                            POSITION
                        </div>

                        <div
                            style={
                                styles.trackProperty
                            }
                        >
                            <span>↗</span>
                            SCALE
                        </div>

                        <div
                            style={
                                styles.trackProperty
                            }
                        >
                            <span>◐</span>
                            ROTATION
                        </div>

                        <div
                            style={
                                styles.trackProperty
                            }
                        >
                            <span>◒</span>
                            OPACITY
                        </div>

                        <div
                            style={
                                styles.trackProperty
                            }
                        >
                            <span>✦</span>
                            EFFECTS
                        </div>
                    </div>
                </aside>

                {/* ========================================================
                    TIMELINE CANVAS
                ========================================================= */}

                <div
                    style={
                        styles.timelineArea
                    }
                >
                    <div
                        style={
                            styles.timelineToolbar
                        }
                    >
                        <div
                            style={
                                styles.toolbarGroup
                            }
                        >
                            <span
                                style={
                                    styles.toolbarLabel
                                }
                            >
                                FPS
                            </span>

                            <select
                                value={
                                    fps
                                }
                                onChange={(
                                    event
                                ) =>
                                    updateAnimation({
                                        fps:
                                            Number(
                                                event
                                                    .target
                                                    .value
                                            ),
                                    })
                                }
                                style={
                                    styles.select
                                }
                            >
                                <option value={24}>
                                    24
                                </option>
                                <option value={25}>
                                    25
                                </option>
                                <option value={30}>
                                    30
                                </option>
                                <option value={60}>
                                    60
                                </option>
                            </select>
                        </div>

                        <div
                            style={
                                styles.toolbarGroup
                            }
                        >
                            <span
                                style={
                                    styles.toolbarLabel
                                }
                            >
                                SNAP
                            </span>

                            <button
                                style={
                                    snapEnabled
                                        ? styles.toggleActive
                                        : styles.toggle
                                }
                                onClick={() =>
                                    setSnapEnabled(
                                        (
                                            value
                                        ) =>
                                            !value
                                    )
                                }
                            >
                                {snapEnabled
                                    ? "ON"
                                    : "OFF"}
                            </button>
                        </div>

                        <div
                            style={
                                styles.toolbarGroup
                            }
                        >
                            <span
                                style={
                                    styles.toolbarLabel
                                }
                            >
                                ZOOM
                            </span>

                            <button
                                style={
                                    styles.zoomButton
                                }
                                onClick={() =>
                                    setTimelineZoom(
                                        (
                                            value
                                        ) =>
                                            Math.max(
                                                .65,
                                                value -
                                                .1
                                            )
                                    )
                                }
                            >
                                −
                            </button>

                            <span
                                style={
                                    styles.zoomValue
                                }
                            >
                                {Math.round(
                                    timelineZoom *
                                    100
                                )}
                                %
                            </span>

                            <button
                                style={
                                    styles.zoomButton
                                }
                                onClick={() =>
                                    setTimelineZoom(
                                        (
                                            value
                                        ) =>
                                            Math.min(
                                                2,
                                                value +
                                                .1
                                            )
                                    )
                                }
                            >
                                +
                            </button>
                        </div>
                    </div>

                    <div
                        style={
                            styles.timelineScroll
                        }
                    >
                        <div
                            style={{
                                ...styles.timelineInner,
                                width:
                                    timelineWidth,
                            }}
                        >
                            {/* RULER */}

                            <div
                                style={
                                    styles.ruler
                                }
                            >
                                {rulerMarks.map(
                                    (
                                        mark
                                    ) => (
                                        <div
                                            key={
                                                mark
                                            }
                                            style={{
                                                ...styles.rulerMark,
                                                left:
                                                    timeToPixels(
                                                        mark
                                                    ),
                                            }}
                                        >
                                            <span>
                                                {formatTime(
                                                    mark
                                                )}
                                            </span>
                                        </div>
                                    )
                                )}
                            </div>

                            {/* PLAYHEAD */}

                            <div
                                style={{
                                    ...styles.playhead,
                                    left:
                                        playheadLeft,
                                }}
                            >
                                <div
                                    style={
                                        styles.playheadHandle
                                    }
                                />

                                <div
                                    style={
                                        styles.playheadLine
                                    }
                                />
                            </div>

                            {/* TRACK ROW */}

                            <div
                                style={
                                    styles.trackCanvas
                                }
                            >
                                <div
                                    style={
                                        styles.trackLane
                                    }
                                >
                                    <div
                                        style={
                                            styles.laneName
                                        }
                                    >
                                        MOTION
                                    </div>

                                    <div
                                        style={
                                            styles.keyframeLane
                                        }
                                    >
                                        {(
                                            selectedAnimation
                                                ?.keyframes ||
                                            []
                                        ).map(
                                            (
                                                keyframe
                                            ) => {
                                                const left =
                                                    timeToPixels(
                                                        keyframe.time
                                                    );

                                                const selected =
                                                    selectedKeyframeId ===
                                                    keyframe.id;

                                                return (
                                                    <button
                                                        key={
                                                            keyframe.id
                                                        }
                                                        title={`Keyframe at ${formatTime(
                                                            keyframe.time
                                                        )}`}
                                                        onClick={() =>
                                                            setSelectedKeyframeId(
                                                                keyframe.id
                                                            )
                                                        }
                                                        style={{
                                                            ...styles.keyframe,
                                                            left:
                                                                left -
                                                                7,
                                                            ...(selected
                                                                ? styles.keyframeSelected
                                                                : {}),
                                                        }}
                                                    >
                                                        ◆
                                                    </button>
                                                );
                                            }
                                        )}
                                    </div>
                                </div>

                                {/* GRID LINES */}

                                <div
                                    style={
                                        styles.timelineGrid
                                    }
                                >
                                    {rulerMarks.map(
                                        (
                                            mark
                                        ) => (
                                            <span
                                                key={
                                                    `grid-${mark}`
                                                }
                                                style={{
                                                    left:
                                                        timeToPixels(
                                                            mark
                                                        ),
                                                }}
                                            />
                                        )
                                    )}
                                </div>
                            </div>

                            {/* ADD KEYFRAME */}

                            <button
                                style={
                                    styles.addKeyframeButton
                                }
                                onClick={() =>
                                    addKeyframe(
                                        currentTime
                                    )
                                }
                            >
                                + ADD KEYFRAME AT{" "}
                                {formatTime(
                                    currentTime
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* ============================================================
                KEYFRAME INSPECTOR
            ============================================================= */}

            <div
                style={
                    styles.bottomInspector
                }
            >
                <div
                    style={
                        styles.inspectorHeader
                    }
                >
                    <div>
                        <div
                            style={
                                styles.inspectorEyebrow
                            }
                        >
                            KEYFRAME INSPECTOR
                        </div>

                        <strong>
                            {selectedKeyframeId
                                ? "ACTIVE KEYFRAME"
                                : "NO KEYFRAME SELECTED"}
                        </strong>
                    </div>

                    {selectedKeyframeId && (
                        <button
                            style={
                                styles.deleteButton
                            }
                            onClick={() =>
                                deleteKeyframe(
                                    selectedKeyframeId
                                )
                            }
                        >
                            DELETE KEYFRAME
                        </button>
                    )}
                </div>

                {selectedKeyframeId ? (
                    <KeyframeInspector
                        keyframe={
                            (
                                selectedAnimation
                                    ?.keyframes ||
                                []
                            ).find(
                                (
                                    item
                                ) =>
                                    item.id ===
                                    selectedKeyframeId
                            )
                        }
                        duration={
                            duration
                        }
                        onChange={(
                            patch
                        ) =>
                            updateKeyframe(
                                selectedKeyframeId,
                                patch
                            )
                        }
                    />
                ) : (
                    <div
                        style={
                            styles.noKeyframe
                        }
                    >
                        Select a keyframe from
                        the motion timeline.
                    </div>
                )}
            </div>

            {/* ============================================================
                MOTION SUMMARY
            ============================================================= */}

            <div
                style={
                    styles.summaryBar
                }
            >
                <SummaryItem
                    label="DURATION"
                    value={`${duration} ms`}
                />

                <SummaryItem
                    label="EASING"
                    value={
                        selectedAnimation?.easing ||
                        "ease-in-out"
                    }
                />

                <SummaryItem
                    label="DELAY"
                    value={`${safeNumber(
                        selectedAnimation?.delay,
                        0
                    )} ms`}
                />

                <SummaryItem
                    label="LOOP"
                    value={
                        selectedAnimation?.loop ||
                        "once"
                    }
                />

                <SummaryItem
                    label="KEYFRAMES"
                    value={
                        (
                            selectedAnimation
                                ?.keyframes ||
                            []
                        ).length
                    }
                />

                <div
                    style={{
                        ...styles.summaryStatus,
                        marginLeft: "auto",
                    }}
                >
                    <span
                        style={
                            styles.liveDot
                        }
                    />

                    CONFIGURATION LINKED
                </div>
            </div>
        </section>
    );
}

/*
 * =========================================================================
 * KEYFRAME INSPECTOR
 * =========================================================================
 */

function KeyframeInspector({
    keyframe = {},
    duration = 3000,
    onChange,
}) {
    const properties =
        keyframe?.properties ||
        {};

    const updateProperty = (
        property,
        value
    ) => {
        onChange({
            properties: {
                ...properties,
                [property]:
                    value,
            },
        });
    };

    return (
        <div
            style={
                styles.keyframeInspector
            }
        >
            <InspectorField
                label="TIME"
                suffix="ms"
                value={
                    safeNumber(
                        keyframe.time,
                        0
                    )
                }
                min={0}
                max={duration}
                onChange={(value) =>
                    onChange({
                        time:
                            value,
                    })
                }
            />

            <InspectorSelect
                label="EASING"
                value={
                    keyframe.easing ||
                    "ease-in-out"
                }
                options={[
                    "linear",
                    "ease",
                    "ease-in",
                    "ease-out",
                    "ease-in-out",
                    "cubic-bezier",
                    "spring",
                ]}
                onChange={(value) =>
                    onChange({
                        easing:
                            value,
                    })
                }
            />

            <InspectorField
                label="X"
                suffix="px"
                value={
                    safeNumber(
                        properties.x,
                        0
                    )
                }
                onChange={(value) =>
                    updateProperty(
                        "x",
                        value
                    )
                }
            />

            <InspectorField
                label="Y"
                suffix="px"
                value={
                    safeNumber(
                        properties.y,
                        0
                    )
                }
                onChange={(value) =>
                    updateProperty(
                        "y",
                        value
                    )
                }
            />

            <InspectorField
                label="SCALE"
                suffix="×"
                value={
                    safeNumber(
                        properties.scale,
                        1
                    )
                }
                step={0.01}
                onChange={(value) =>
                    updateProperty(
                        "scale",
                        value
                    )
                }
            />

            <InspectorField
                label="ROTATION"
                suffix="°"
                value={
                    safeNumber(
                        properties.rotation,
                        0
                    )
                }
                onChange={(value) =>
                    updateProperty(
                        "rotation",
                        value
                    )
                }
            />

            <InspectorField
                label="OPACITY"
                suffix="%"
                value={
                    safeNumber(
                        properties.opacity,
                        1
                    ) * 100
                }
                min={0}
                max={100}
                onChange={(value) =>
                    updateProperty(
                        "opacity",
                        value / 100
                    )
                }
            />

            <InspectorField
                label="GLOW"
                suffix="%"
                value={
                    safeNumber(
                        properties.glow,
                        0
                    )
                }
                min={0}
                max={100}
                onChange={(value) =>
                    updateProperty(
                        "glow",
                        value
                    )
                }
            />
        </div>
    );
}

/*
 * =========================================================================
 * SMALL UI COMPONENTS
 * =========================================================================
 */

function InspectorField({
    label,
    value,
    suffix,
    min,
    max,
    step = 1,
    onChange,
}) {
    return (
        <label
            style={
                styles.inspectorField
            }
        >
            <span>
                {label}
            </span>

            <div
                style={
                    styles.inputWrap
                }
            >
                <input
                    type="number"
                    value={
                        Number.isFinite(
                            Number(value)
                        )
                            ? value
                            : 0
                    }
                    min={min}
                    max={max}
                    step={step}
                    onChange={(event) =>
                        onChange(
                            Number(
                                event
                                    .target
                                    .value
                            )
                        )
                    }
                    style={
                        styles.numberInput
                    }
                />

                <span
                    style={
                        styles.inputSuffix
                    }
                >
                    {suffix}
                </span>
            </div>
        </label>
    );
}

function InspectorSelect({
    label,
    value,
    options,
    onChange,
}) {
    return (
        <label
            style={
                styles.inspectorField
            }
        >
            <span>
                {label}
            </span>

            <select
                value={value}
                onChange={(event) =>
                    onChange(
                        event.target.value
                    )
                }
                style={
                    styles.inspectorSelect
                }
            >
                {options.map(
                    (option) => (
                        <option
                            key={option}
                            value={option}
                        >
                            {option}
                        </option>
                    )
                )}
            </select>
        </label>
    );
}

function SummaryItem({
    label,
    value,
}) {
    return (
        <div
            style={
                styles.summaryItem
            }
        >
            <span>
                {label}
            </span>

            <strong>
                {value}
            </strong>
        </div>
    );
}

/*
 * =========================================================================
 * DEFAULT ANIMATION
 * =========================================================================
 */

function createDefaultAnimation(
    objectId = "object"
) {
    return {
        id:
            `${objectId}-motion`,

        enabled:
            false,

        type:
            "custom",

        duration:
            3000,

        fps:
            30,

        delay:
            0,

        easing:
            "ease-in-out",

        loop:
            "once",

        direction:
            "normal",

        keyframes: [
            {
                id:
                    "kf-0",

                time:
                    0,

                easing:
                    "ease-in-out",

                properties: {
                    x: 0,
                    y: 0,
                    scale: 1,
                    rotation: 0,
                    opacity: 1,
                    blur: 0,
                    glow: 0,
                },
            },

            {
                id:
                    "kf-1",

                time:
                    3000,

                easing:
                    "ease-in-out",

                properties: {
                    x: 0,
                    y: 0,
                    scale: 1,
                    rotation: 0,
                    opacity: 1,
                    blur: 0,
                    glow: 0,
                },
            },
        ],
    };
}

/*
 * =========================================================================
 * HELPERS
 * =========================================================================
 */

function safeNumber(
    value,
    fallback = 0
) {
    const number =
        Number(value);

    return Number.isFinite(
        number
    )
        ? number
        : fallback;
}

function formatTime(
    milliseconds
) {
    const total =
        Math.max(
            0,
            safeNumber(
                milliseconds,
                0
            )
        );

    const seconds =
        Math.floor(
            total / 1000
        );

    const ms =
        Math.floor(
            total % 1000
        );

    return `${String(
        seconds
    ).padStart(
        2,
        "0"
    )}:${String(
        ms
    ).padStart(
        3,
        "0"
    )}`;
}

/*
 * =========================================================================
 * SYSTEM E — STYLE SYSTEM
 * =========================================================================
 *
 * Intentionally follows the RuachAgent const styles architecture.
 */

const styles = {
    shell: {
        width: "100%",
        minHeight: 620,
        background:
            "linear-gradient(145deg, #030507 0%, #070b10 48%, #020304 100%)",
        color: "#e7f7ff",
        border:
            "1px solid rgba(38, 156, 218, .18)",
        borderRadius: 14,
        overflow: "hidden",
        boxShadow:
            "0 24px 80px rgba(0,0,0,.55), inset 0 1px 0 rgba(255,255,255,.025)",
        fontFamily:
            "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        position: "relative",
    },

    header: {
        minHeight: 76,
        padding:
            "0 20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottom:
            "1px solid rgba(62, 175, 238, .13)",
        background:
            "linear-gradient(180deg, rgba(13,20,28,.98), rgba(5,8,12,.98))",
        position: "relative",
        zIndex: 5,
    },

    headerIdentity: {
        display: "flex",
        alignItems: "center",
        gap: 13,
    },

    headerOrb: {
        width: 40,
        height: 40,
        borderRadius: 10,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#00d9ff",
        background:
            "radial-gradient(circle, rgba(0,217,255,.18), rgba(0,80,130,.04))",
        border:
            "1px solid rgba(0,217,255,.35)",
        boxShadow:
            "0 0 20px rgba(0,174,255,.16), inset 0 0 16px rgba(0,174,255,.06)",
        fontSize: 18,
    },

    eyebrow: {
        fontSize: 8,
        letterSpacing: "2.2px",
        color: "#4b91b4",
        fontWeight: 800,
        marginBottom: 3,
    },

    title: {
        margin: 0,
        fontSize: 15,
        letterSpacing: "1.5px",
        fontWeight: 900,
        color: "#eafaff",
    },

    subtitle: {
        margin:
            "3px 0 0",
        fontSize: 9,
        color: "#5c7c8e",
        letterSpacing: ".3px",
    },

    headerTelemetry: {
        display: "flex",
        alignItems: "center",
        gap: 9,
    },

    liveIndicator: {
        display: "flex",
        alignItems: "center",
        gap: 7,
        padding:
            "7px 10px",
        border:
            "1px solid rgba(0,214,255,.16)",
        borderRadius: 6,
        background:
            "rgba(0,149,214,.035)",
        color: "#61b5d5",
        fontSize: 8,
        letterSpacing: "1.2px",
        fontWeight: 800,
    },

    liveDot: {
        width: 5,
        height: 5,
        borderRadius: "50%",
        background: "#00d9ff",
        boxShadow:
            "0 0 9px rgba(0,217,255,.9)",
        display: "inline-block",
    },

    objectChip: {
        padding:
            "7px 10px",
        border:
            "1px solid rgba(255,255,255,.08)",
        borderRadius: 6,
        background:
            "rgba(255,255,255,.025)",
        color: "#607c8d",
        fontSize: 8,
        letterSpacing: "1px",
    },

    controlStrip: {
        minHeight: 54,
        display: "flex",
        alignItems: "center",
        gap: 7,
        padding:
            "0 15px",
        borderBottom:
            "1px solid rgba(255,255,255,.07)",
        background:
            "rgba(7,11,15,.98)",
        position: "relative",
        zIndex: 4,
    },

    toolButton: {
        width: 31,
        height: 31,
        borderRadius: 6,
        border:
            "1px solid rgba(111,176,205,.16)",
        background:
            "linear-gradient(180deg, #111920, #080d12)",
        color: "#91b8ca",
        cursor: "pointer",
        fontSize: 12,
        fontWeight: 800,
    },

    toolButtonActive: {
        width: 31,
        height: 31,
        borderRadius: 6,
        border:
            "1px solid rgba(0,217,255,.62)",
        background:
            "linear-gradient(180deg, rgba(0,117,159,.4), rgba(0,57,79,.25))",
        color: "#00e5ff",
        cursor: "pointer",
        fontSize: 12,
        fontWeight: 900,
        boxShadow:
            "0 0 16px rgba(0,185,255,.18)",
    },

    timeDisplay: {
        minWidth: 96,
        fontFamily:
            "'JetBrains Mono', 'SFMono-Regular', Consolas, monospace",
        fontSize: 11,
        color: "#cceef8",
        letterSpacing: ".5px",
        textAlign: "center",
    },

    controlDivider: {
        width: 1,
        height: 25,
        background:
            "rgba(255,255,255,.08)",
        margin:
            "0 6px",
    },

    presetButton: {
        minHeight: 30,
        padding:
            "0 10px",
        borderRadius: 6,
        border:
            "1px solid rgba(0,174,255,.17)",
        background:
            "rgba(0,113,160,.035)",
        color: "#71b9d7",
        cursor: "pointer",
        fontSize: 8,
        letterSpacing: "1px",
        fontWeight: 800,
    },

    resetButton: {
        minHeight: 30,
        padding:
            "0 10px",
        marginLeft: "auto",
        borderRadius: 6,
        border:
            "1px solid rgba(255,255,255,.08)",
        background:
            "rgba(255,255,255,.02)",
        color: "#657d89",
        cursor: "pointer",
        fontSize: 8,
        letterSpacing: "1px",
        fontWeight: 800,
    },

    timelineWorkspace: {
        display: "flex",
        minHeight: 300,
        borderBottom:
            "1px solid rgba(255,255,255,.07)",
    },

    trackSidebar: {
        width: 210,
        flexShrink: 0,
        background:
            "linear-gradient(180deg, #090e13, #05080b)",
        borderRight:
            "1px solid rgba(64,168,214,.12)",
    },

    panelHeading: {
        height: 38,
        padding:
            "0 13px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottom:
            "1px solid rgba(255,255,255,.06)",
        color: "#7699aa",
        fontSize: 8,
        letterSpacing: "1.6px",
        fontWeight: 900,
    },

    panelCount: {
        color: "#2e718e",
    },

    trackList: {
        padding:
            "9px 7px",
    },

    trackItem: {
        minHeight: 48,
        padding:
            "0 9px",
        display: "flex",
        alignItems: "center",
        gap: 8,
        borderRadius: 7,
        color: "#66808f",
        cursor: "pointer",
    },

    trackItemActive: {
        minHeight: 48,
        padding:
            "0 9px",
        display: "flex",
        alignItems: "center",
        gap: 8,
        borderRadius: 7,
        color: "#d9f8ff",
        cursor: "pointer",
        background:
            "linear-gradient(90deg, rgba(0,164,221,.12), rgba(0,90,130,.025))",
        border:
            "1px solid rgba(0,197,255,.18)",
        boxShadow:
            "inset 2px 0 0 #00c8ff",
    },

    trackIcon: {
        color: "#00cfff",
        fontSize: 9,
    },

    trackStatus: {
        marginLeft: "auto",
        color: "#00d9ff",
        fontSize: 8,
        textShadow:
            "0 0 8px #00d9ff",
    },

    trackProperty: {
        height: 31,
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding:
            "0 12px 0 32px",
        color: "#49616e",
        fontSize: 8,
        letterSpacing: "1px",
        borderBottom:
            "1px solid rgba(255,255,255,.025)",
    },

    timelineArea: {
        minWidth: 0,
        flex: 1,
        background:
            "#05080b",
        overflow: "hidden",
    },

    timelineToolbar: {
        height: 38,
        display: "flex",
        alignItems: "center",
        gap: 18,
        padding:
            "0 12px",
        borderBottom:
            "1px solid rgba(255,255,255,.06)",
        background:
            "#080d12",
    },

    toolbarGroup: {
        display: "flex",
        alignItems: "center",
        gap: 6,
    },

    toolbarLabel: {
        fontSize: 7,
        letterSpacing: "1.2px",
        color: "#557281",
        fontWeight: 900,
    },

    select: {
        height: 24,
        padding:
            "0 7px",
        borderRadius: 4,
        border:
            "1px solid rgba(79,162,195,.15)",
        background:
            "#0c1319",
        color: "#a5cad8",
        outline: "none",
        fontSize: 9,
    },

    toggle: {
        minWidth: 36,
        height: 23,
        borderRadius: 4,
        border:
            "1px solid rgba(255,255,255,.08)",
        background:
            "#0b1015",
        color: "#526c79",
        cursor: "pointer",
        fontSize: 7,
        fontWeight: 900,
    },

    toggleActive: {
        minWidth: 36,
        height: 23,
        borderRadius: 4,
        border:
            "1px solid rgba(0,213,255,.45)",
        background:
            "rgba(0,161,211,.10)",
        color: "#00d9ff",
        cursor: "pointer",
        fontSize: 7,
        fontWeight: 900,
        boxShadow:
            "0 0 12px rgba(0,193,255,.12)",
    },

    zoomButton: {
        width: 22,
        height: 22,
        borderRadius: 4,
        border:
            "1px solid rgba(255,255,255,.08)",
        background:
            "#0c1217",
        color: "#79a1b2",
        cursor: "pointer",
    },

    zoomValue: {
        minWidth: 35,
        textAlign: "center",
        fontSize: 8,
        color: "#7596a5",
    },

    timelineScroll: {
        height: 260,
        overflowX: "auto",
        overflowY: "hidden",
        background:
            "linear-gradient(180deg, #05090d, #030609)",
    },

    timelineInner: {
        minWidth: 700,
        height: "100%",
        position: "relative",
    },

    ruler: {
        position: "relative",
        height: 35,
        borderBottom:
            "1px solid rgba(255,255,255,.08)",
        background:
            "rgba(255,255,255,.012)",
    },

    rulerMark: {
        position: "absolute",
        top: 0,
        height: 35,
        width: 1,
        borderLeft:
            "1px solid rgba(111,171,198,.17)",
        boxSizing: "border-box",
    },

    playhead: {
        position: "absolute",
        top: 0,
        bottom: 0,
        width: 1,
        background:
            "#00d9ff",
        zIndex: 20,
        boxShadow:
            "0 0 12px rgba(0,217,255,.75)",
        pointerEvents: "none",
    },

    playheadHandle: {
        position: "absolute",
        top: 0,
        left: -5,
        width: 10,
        height: 8,
        background:
            "#00d9ff",
        clipPath:
            "polygon(0 0, 100% 0, 50% 100%)",
        filter:
            "drop-shadow(0 0 5px #00d9ff)",
    },

    playheadLine: {
        position: "absolute",
        top: 8,
        bottom: 0,
        left: 0,
        width: 1,
    },

    trackCanvas: {
        position: "relative",
        height: 160,
    },

    trackLane: {
        position: "relative",
        height: 72,
        marginTop: 12,
        background:
            "linear-gradient(90deg, rgba(0,130,180,.045), transparent)",
        borderTop:
            "1px solid rgba(0,167,222,.10)",
        borderBottom:
            "1px solid rgba(0,167,222,.08)",
    },

    laneName: {
        position: "absolute",
        left: 10,
        top: 8,
        fontSize: 7,
        letterSpacing: "1.4px",
        color: "#4f7788",
        fontWeight: 900,
    },

    keyframeLane: {
        position: "absolute",
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
    },

    keyframe: {
        position: "absolute",
        top: 31,
        width: 14,
        height: 14,
        padding: 0,
        border: "none",
        background:
            "transparent",
        color: "#4c7890",
        cursor: "pointer",
        fontSize: 10,
        transform:
            "rotate(0deg)",
    },

    keyframeSelected: {
        color: "#00e5ff",
        textShadow:
            "0 0 12px #00e5ff",
        filter:
            "drop-shadow(0 0 5px rgba(0,217,255,.8))",
        transform:
            "scale(1.35)",
    },

    timelineGrid: {
        position: "absolute",
        inset: 0,
        top: 0,
        pointerEvents: "none",
    },

    addKeyframeButton: {
        position: "absolute",
        left: 10,
        bottom: 14,
        height: 29,
        padding:
            "0 11px",
        borderRadius: 5,
        border:
            "1px solid rgba(0,199,255,.22)",
        background:
            "rgba(0,126,170,.055)",
        color: "#58abc8",
        cursor: "pointer",
        fontSize: 7,
        letterSpacing: "1px",
        fontWeight: 900,
    },

    bottomInspector: {
        background:
            "linear-gradient(180deg, #080d12, #05080b)",
        borderBottom:
            "1px solid rgba(255,255,255,.06)",
    },

    inspectorHeader: {
        minHeight: 52,
        padding:
            "0 15px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottom:
            "1px solid rgba(255,255,255,.055)",
    },

    inspectorEyebrow: {
        color: "#3e7d98",
        fontSize: 7,
        letterSpacing: "1.7px",
        fontWeight: 900,
        marginBottom: 3,
    },

    deleteButton: {
        height: 27,
        padding:
            "0 10px",
        borderRadius: 5,
        border:
            "1px solid rgba(255,90,100,.16)",
        background:
            "rgba(160,40,50,.05)",
        color: "#a16b71",
        cursor: "pointer",
        fontSize: 7,
        letterSpacing: "1px",
        fontWeight: 900,
    },

    keyframeInspector: {
        display: "grid",
        gridTemplateColumns:
            "repeat(8, minmax(80px, 1fr))",
        gap: 8,
        padding:
            "12px 15px 15px",
    },

    inspectorField: {
        display: "flex",
        flexDirection: "column",
        gap: 5,
        minWidth: 0,
        color: "#557684",
        fontSize: 7,
        letterSpacing: "1px",
        fontWeight: 900,
    },

    inputWrap: {
        height: 29,
        display: "flex",
        alignItems: "center",
        border:
            "1px solid rgba(90,166,196,.13)",
        borderRadius: 5,
        background:
            "#0a1015",
        overflow: "hidden",
    },

    numberInput: {
        width: "100%",
        height: "100%",
        border: "none",
        outline: "none",
        background:
            "transparent",
        color: "#bde7f4",
        padding:
            "0 7px",
        fontSize: 9,
        fontFamily:
            "'JetBrains Mono', Consolas, monospace",
    },

    inputSuffix: {
        padding:
            "0 7px 0 0",
        color: "#3f6575",
        fontSize: 7,
    },

    inspectorSelect: {
        height: 29,
        width: "100%",
        border:
            "1px solid rgba(90,166,196,.13)",
        borderRadius: 5,
        background:
            "#0a1015",
        color: "#bde7f4",
        padding:
            "0 7px",
        outline: "none",
        fontSize: 8,
    },

    noKeyframe: {
        padding:
            "18px 15px",
        color: "#4f6875",
        fontSize: 9,
    },

    summaryBar: {
        minHeight: 45,
        padding:
            "0 15px",
        display: "flex",
        alignItems: "center",
        gap: 25,
        background:
            "#030609",
    },

    summaryItem: {
        display: "flex",
        flexDirection: "column",
        gap: 2,
    },

    summaryItem: {
        display: "flex",
        flexDirection: "column",
        gap: 2,
    },

    summaryItem: {
        minWidth: 70,
        display: "flex",
        flexDirection: "column",
        gap: 2,
    },

    summaryStatus: {
        display: "flex",
        alignItems: "center",
        gap: 6,
        color: "#477588",
        fontSize: 7,
        letterSpacing: "1.1px",
        fontWeight: 900,
    },
};