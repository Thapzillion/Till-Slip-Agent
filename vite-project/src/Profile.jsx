
import React, { useEffect, useMemo } from "react";
import {
    X,
    UserRound,
    Mail,
    ShieldCheck,
    Crown,
    Clock3,
    CalendarDays,
    CheckCircle2,
    Zap,
    CircleAlert,
    LoaderCircle,
} from "lucide-react";
import "./Profile.css";

const DAY_IN_MS = 24 * 60 * 60 * 1000;

function getValidDate(...values) {
    for (const value of values) {
        if (!value) continue;

        const date = new Date(value);

        if (!Number.isNaN(date.getTime())) {
            return date;
        }
    }

    return null;
}

function getDaysRemaining(expiryDate) {
    if (!expiryDate) return null;

    const difference = expiryDate.getTime() - Date.now();

    if (difference <= 0) return 0;

    return Math.ceil(difference / DAY_IN_MS);
}

function formatDate(date) {
    if (!date) return "Not available";

    return new Intl.DateTimeFormat(undefined, {
        day: "numeric",
        month: "long",
        year: "numeric",
    }).format(date);
}

function getSubscriptionDetails({
    subscription,
    trialExpiryDate,
    trialDaysRemaining,
}) {
    const planType = String(
        subscription?.plan_type ??
        subscription?.plan ??
        subscription?.type ??
        subscription?.name ??
        ""
    ).toLowerCase();

    const status = String(
        subscription?.status ?? ""
    ).toLowerCase();

    const isTrial =
        status.includes("trial") ||
        planType.includes("trial") ||
        subscription?.is_trial === true ||
        subscription?.trial_active === true;

    const trialExpiry = getValidDate(
        trialExpiryDate,
        subscription?.trial_ends_at,
        subscription?.trial_end,
        subscription?.trial_expiry_date,
        subscription?.trial_expires_at
    );

    const premiumExpiry = getValidDate(
        subscription?.current_period_end,
        subscription?.expires_at,
        subscription?.end_date,
        subscription?.expiry_date,
        subscription?.premium_expiry_date,
        subscription?.subscription_end_date,
        subscription?.period_end
    );

    const expiryDate = isTrial
        ? trialExpiry
        : premiumExpiry;

    const calculatedDays = getDaysRemaining(expiryDate);

    // Use the existing trial countdown only as a fallback when
    // the actual trial expiry timestamp is unavailable.
    const daysRemaining =
        calculatedDays !== null
            ? calculatedDays
            : isTrial &&
                Number.isFinite(Number(trialDaysRemaining))
                ? Math.max(0, Number(trialDaysRemaining))
                : null;

    const isExpired =
        daysRemaining === 0 ||
        status === "expired" ||
        status === "cancelled" ||
        status === "canceled";

    let planName = "Premium";

    if (isTrial) {
        planName = "3-Day Free Trial";
    } else if (
        planType.includes("free") ||
        status === "free"
    ) {
        planName = "Free Plan";
    } else if (
        subscription?.plan_name ||
        subscription?.name
    ) {
        planName =
            subscription.plan_name || subscription.name;
    }

    let statusLabel = "ACTIVE";

    if (isExpired) {
        statusLabel = "EXPIRED";
    } else if (
        status === "pending" ||
        status === "incomplete"
    ) {
        statusLabel = "PENDING";
    } else if (
        status === "past_due" ||
        status === "payment_failed"
    ) {
        statusLabel = "PAYMENT REQUIRED";
    }

    return {
        planName,
        isTrial,
        expiryDate,
        daysRemaining,
        isExpired,
        statusLabel,
    };
}

export default function Profile({
    isOpen = true,
    onClose = () => { },
    user = null,
    subscription = null,
    subscriptionLoading = false,
    trialDaysRemaining = null,
    trialExpiryDate = null,
}) {
    const details = useMemo(
        () =>
            getSubscriptionDetails({
                subscription,
                trialExpiryDate,
                trialDaysRemaining,
            }),
        [
            subscription,
            trialExpiryDate,
            trialDaysRemaining,
        ]
    );

    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                onClose();
            }
        };

        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener(
                "keydown",
                handleKeyDown
            );
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const email = user?.email || "Email unavailable";
    const {
        planName,
        isTrial,
        expiryDate,
        daysRemaining,
        isExpired,
        statusLabel,
    } = details;

    const statusColor = isExpired
        ? "#ff7777"
        : "#78d5ff";

    const countdownLabel =
        daysRemaining === null
            ? "Awaiting expiry date"
            : daysRemaining === 0
                ? "Expired or ending today"
                : `${daysRemaining} ${daysRemaining === 1 ? "day" : "days"
                } remaining`;

    return (
        <div
            className="ruach-profile-overlay"
            onMouseDown={(event) => {
                if (event.target === event.currentTarget) {
                    onClose();
                }
            }}
        >
            <section
                className="ruach-profile-modal"
                role="dialog"
                aria-modal="true"
                aria-labelledby="ruach-profile-title"
            >
                <div className="ruach-profile-grid" />
                <div className="ruach-profile-glow" />

                <div className="ruach-profile-topline">
                    <span className="ruach-profile-brand">
                        <span className="ruach-profile-brand-dot" />
                        RUACHAGENT
                    </span>

                    <button
                        type="button"
                        className="ruach-profile-close"
                        onClick={onClose}
                        aria-label="Close profile"
                    >
                        <X size={19} />
                    </button>
                </div>

                <div className="ruach-profile-content">
                    <div className="ruach-profile-emblem">
                        <div className="ruach-profile-emblem-ring" />
                        <UserRound size={31} strokeWidth={1.5} />
                    </div>

                    <div className="ruach-profile-eyebrow">
                        <ShieldCheck size={13} />
                        SECURE ACCOUNT IDENTITY
                    </div>

                    <h2
                        id="ruach-profile-title"
                        className="ruach-profile-title"
                    >
                        Your <span>Profile.</span>
                    </h2>

                    <p className="ruach-profile-subtitle">
                        Your account identity and membership status,
                        in one place.
                    </p>

                    <div className="ruach-profile-section-label">
                        ACCOUNT INFORMATION
                    </div>

                    <div className="ruach-profile-info-card">
                        <div className="ruach-profile-info-icon">
                            <Mail size={18} />
                        </div>

                        <div className="ruach-profile-info-copy">
                            <span className="ruach-profile-field-label">
                                REGISTERED EMAIL
                            </span>

                            <span
                                className="ruach-profile-email"
                                title={email}
                            >
                                {email}
                            </span>
                        </div>

                        <CheckCircle2
                            className="ruach-profile-verified-icon"
                            size={17}
                        />
                    </div>

                    <div className="ruach-profile-section-label">
                        MEMBERSHIP OVERVIEW
                    </div>

                    <div className="ruach-profile-plan-card">
                        <div className="ruach-profile-plan-top">
                            <div className="ruach-profile-plan-symbol">
                                {isTrial ? (
                                    <Zap size={21} />
                                ) : (
                                    <Crown size={21} />
                                )}
                            </div>

                            <div className="ruach-profile-plan-heading">
                                <span className="ruach-profile-field-label">
                                    CURRENT SUBSCRIPTION
                                </span>

                                <h3>{planName}</h3>
                            </div>

                            <span
                                className={`ruach-profile-status ${isExpired ? "is-expired" : ""
                                    }`}
                            >
                                <span className="ruach-profile-status-dot" />
                                {statusLabel}
                            </span>
                        </div>

                        <div className="ruach-profile-plan-divider" />

                        {subscriptionLoading ? (
                            <div className="ruach-profile-loading">
                                <LoaderCircle
                                    size={19}
                                    className="ruach-profile-spinner"
                                />
                                <span>
                                    Synchronizing subscription details...
                                </span>
                            </div>
                        ) : (
                            <>
                                <div className="ruach-profile-countdown">
                                    <div>
                                        <span className="ruach-profile-field-label">
                                            {isTrial
                                                ? "FREE TRIAL TIME LEFT"
                                                : "SUBSCRIPTION TIME LEFT"}
                                        </span>

                                        <div
                                            className="ruach-profile-days"
                                            style={{ color: statusColor }}
                                        >
                                            {daysRemaining === null
                                                ? "--"
                                                : daysRemaining}
                                            <span>
                                                {daysRemaining === 1
                                                    ? "day"
                                                    : "days"}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="ruach-profile-clock">
                                        <Clock3 size={22} />
                                    </div>
                                </div>

                                <div
                                    className={`ruach-profile-countdown-caption ${isExpired ? "is-expired" : ""
                                        }`}
                                >
                                    {countdownLabel}
                                </div>

                                <div className="ruach-profile-expiry-row">
                                    <div className="ruach-profile-expiry-icon">
                                        {isExpired ? (
                                            <CircleAlert size={17} />
                                        ) : (
                                            <CalendarDays size={17} />
                                        )}
                                    </div>

                                    <div className="ruach-profile-expiry-copy">
                                        <span className="ruach-profile-field-label">
                                            {isTrial
                                                ? "TRIAL END DATE"
                                                : "PLAN EXPIRY DATE"}
                                        </span>

                                        <strong>
                                            {formatDate(expiryDate)}
                                        </strong>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                    <div className="ruach-profile-security-note">
                        <ShieldCheck size={15} />
                        <span>
                            Your account details are displayed securely
                            within your RuachAgent workspace.
                        </span>
                    </div>

                    <button
                        type="button"
                        className="ruach-profile-done"
                        onClick={onClose}
                    >
                        <span>Return to workspace</span>
                        <span className="ruach-profile-arrow">↗</span>
                    </button>

                    <div className="ruach-profile-footer">
                        RUACHAGENT <span>·</span> ACCOUNT CENTRE
                    </div>
                </div>
            </section>
        </div>
    );
}
