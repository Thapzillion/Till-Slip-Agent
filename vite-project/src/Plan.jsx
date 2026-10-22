
import { useCallback, useEffect, useState } from "react";
import {
    X,
    Crown,
    ShieldCheck,
    Clock3,
    CalendarDays,
    RefreshCw,
    Zap,
    Infinity as InfinityIcon,
    CheckCircle2,
    AlertCircle,
} from "lucide-react";
import { supabase } from "./supabaseClient";
import "./Plan.css";

const PREMIUM_PRICE = "$6.99";
const PREMIUM_PRICE_ZAR = "R129.00";
const DAY_MS = 24 * 60 * 60 * 1000;

function formatDate(value) {
    if (!value) return null;

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return null;

    return date.toLocaleDateString("en-ZA", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });
}

function getDaysRemaining(value) {
    if (!value) return null;

    const time = new Date(value).getTime();
    if (Number.isNaN(time)) return null;

    return Math.max(0, Math.ceil((time - Date.now()) / DAY_MS));
}

function getPlanStatus(subscription) {
    if (!subscription) {
        return {
            type: "unknown",
            label: "Status unavailable",
            description: "Your subscription record could not be found.",
        };
    }

    const status = String(
        subscription.subscription_status || ""
    ).toLowerCase();

    if (status === "trial") {
        const days = getDaysRemaining(subscription.trial_ends_at);

        if (days === null) {
            return {
                type: "trial",
                label: "Free trial",
                description: "Your account is marked as being in a free trial.",
            };
        }

        if (days > 0) {
            return {
                type: "trial",
                label: "Free trial",
                description: `${days} day${days === 1 ? "" : "s"} remaining in your free trial.`,
            };
        }

        return {
            type: "expired",
            label: "Trial ended",
            description: "Your free-trial period has ended.",
        };
    }

    const paidStatuses = ["active", "premium", "paid", "subscribed"];
    const paidUntil = subscription.paid_until;
    const paidDays = getDaysRemaining(paidUntil);

    if (paidStatuses.includes(status)) {
        if (paidUntil && paidDays === 0) {
            return {
                type: "expired",
                label: "Subscription expired",
                description: "Your recorded premium access period has ended.",
            };
        }

        return {
            type: "premium",
            label: "Premium active",
            description: paidUntil
                ? `Premium access is scheduled until ${formatDate(paidUntil)}.`
                : "Your account is marked as having an active premium subscription.",
        };
    }

    if (["expired", "cancelled", "canceled", "inactive", "past_due"].includes(status)) {
        return {
            type: "expired",
            label: status === "past_due" ? "Payment needs attention" : "Not active",
            description:
                status === "past_due"
                    ? "Your subscription payment may need attention."
                    : "Your account does not currently have an active premium subscription.",
        };
    }

    return {
        type: "unknown",
        label: "Status unavailable",
        description: `Your subscription status is "${status || "not set"}".`,
    };
}

export default function Plan({
    isOpen = true,
    onClose = () => { },
    user = null,
}) {
    const [subscription, setSubscription] = useState(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState("");

    const loadSubscription = useCallback(async (isRefresh = false) => {
        if (isRefresh) {
            setRefreshing(true);
        } else {
            setLoading(true);
        }

        setError("");

        try {
            let activeUser = user;

            if (!activeUser?.id) {
                const {
                    data: { user: authenticatedUser },
                    error: authError,
                } = await supabase.auth.getUser();

                if (authError) throw authError;
                activeUser = authenticatedUser;
            }

            if (!activeUser?.id) {
                setSubscription(null);
                setError("Please sign in to view your subscription.");
                return;
            }

            const { data, error: subscriptionError } = await supabase
                .from("subscriptions")
                .select(`
          user_id,
          subscription_status,
          subscription_plan,
          trial_started_at,
          trial_ends_at,
          created_at,
          updated_at,
          trial_welcome_seen,
          paid_until,
          last_payment_at,
          payment_provider
        `)
                .eq("user_id", activeUser.id)
                .maybeSingle();

            if (subscriptionError) throw subscriptionError;

            setSubscription(data ?? null);

            if (!data) {
                setError(
                    "No subscription record was found for this account. Please refresh or contact support."
                );
            }
        } catch (err) {
            console.error("Error loading subscription:", err);
            setError(
                err?.message ||
                "We couldn't load your subscription details. Please try again."
            );
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [user]);

    useEffect(() => {
        if (!isOpen) return undefined;

        loadSubscription();

        const handleEscape = (event) => {
            if (event.key === "Escape") onClose();
        };

        window.addEventListener("keydown", handleEscape);

        return () => {
            window.removeEventListener("keydown", handleEscape);
        };
    }, [isOpen, loadSubscription, onClose]);

    useEffect(() => {
        if (!isOpen || !user?.id) return undefined;

        const channel = supabase
            .channel(`plan-subscription-${user.id}`)
            .on(
                "postgres_changes",
                {
                    event: "*",
                    schema: "public",
                    table: "subscriptions",
                    filter: `user_id=eq.${user.id}`,
                },
                () => loadSubscription(true)
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [isOpen, user?.id, loadSubscription]);

    if (!isOpen) return null;

    const planStatus = getPlanStatus(subscription);
    const trialEnd = formatDate(subscription?.trial_ends_at);
    const paidEnd = formatDate(subscription?.paid_until);
    const trialDays = getDaysRemaining(subscription?.trial_ends_at);
    const isPremium = planStatus.type === "premium";
    const isTrial = planStatus.type === "trial";

    return (
        <div
            className="plan-overlay"
            onMouseDown={(event) => {
                if (event.target === event.currentTarget) onClose();
            }}
        >
            <section
                className="plan-modal"
                role="dialog"
                aria-modal="true"
                aria-labelledby="plan-heading"
            >
                <div className="plan-grid-glow" aria-hidden="true" />

                <header className="plan-header">
                    <div className="plan-brand">
                        <span className="plan-brand-mark">R</span>
                        <div>
                            <span className="plan-eyebrow">RUACHAGENT</span>
                            <span className="plan-header-title">Membership & Plan</span>
                        </div>
                    </div>

                    <button
                        type="button"
                        className="plan-close"
                        onClick={onClose}
                        aria-label="Close plan modal"
                    >
                        <X size={19} />
                    </button>
                </header>

                <main className="plan-content">
                    <div className="plan-intro">
                        <div className="plan-orbit-icon">
                            <Crown size={28} strokeWidth={1.5} />
                            <span />
                        </div>

                        <p className="plan-eyebrow">YOUR BUSINESS. WITHOUT LIMITS.</p>
                        <h2 id="plan-heading">
                            Upgrade your
                            <span> experience.</span>
                        </h2>
                        <p className="plan-subtitle">
                            One premium plan. More freedom to serve your customers.
                        </p>
                    </div>

                    <section className="plan-status-panel">
                        <div className="plan-status-top">
                            <div className="plan-status-icon">
                                {isPremium ? (
                                    <ShieldCheck size={21} />
                                ) : isTrial ? (
                                    <Clock3 size={21} />
                                ) : (
                                    <AlertCircle size={21} />
                                )}
                            </div>

                            <div className="plan-status-copy">
                                <span className="plan-field-label">CURRENT ACCOUNT STATUS</span>
                                <strong>{loading ? "Checking status..." : planStatus.label}</strong>
                            </div>

                            {!loading && (
                                <span className={`plan-status-dot ${planStatus.type}`} />
                            )}
                        </div>

                        <p className="plan-status-description">
                            {loading
                                ? "Securely retrieving your subscription information."
                                : planStatus.description}
                        </p>

                        {!loading && subscription && (
                            <div className="plan-dates">
                                {isTrial && trialEnd && (
                                    <div className="plan-date-row">
                                        <CalendarDays size={15} />
                                        <span>Trial ends</span>
                                        <strong>{trialEnd}</strong>
                                    </div>
                                )}

                                {isPremium && paidEnd && (
                                    <div className="plan-date-row">
                                        <CalendarDays size={15} />
                                        <span>Premium until</span>
                                        <strong>{paidEnd}</strong>
                                    </div>
                                )}

                                {isTrial && trialDays !== null && trialDays > 0 && (
                                    <div className="plan-trial-meter">
                                        <div className="plan-trial-meter-heading">
                                            <span>Trial time remaining</span>
                                            <strong>{trialDays} day{trialDays === 1 ? "" : "s"}</strong>
                                        </div>
                                        <div className="plan-trial-track">
                                            <div
                                                className="plan-trial-fill"
                                                style={{
                                                    width: `${Math.min(100, (trialDays / 3) * 100)}%`,
                                                }}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {error && (
                            <div className="plan-error">
                                <AlertCircle size={16} />
                                <span>{error}</span>
                            </div>
                        )}

                        <button
                            type="button"
                            className="plan-refresh"
                            onClick={() => loadSubscription(true)}
                            disabled={loading || refreshing}
                        >
                            <RefreshCw
                                size={14}
                                className={refreshing ? "plan-spinning" : ""}
                            />
                            {refreshing ? "Refreshing..." : "Refresh subscription status"}
                        </button>
                    </section>

                    <section className="plan-premium-card">
                        <div className="plan-card-top">
                            <div>
                                <span className="plan-eyebrow">RUACHAGENT MEMBERSHIP</span>
                                <h3>Premium</h3>
                                <p>Built for merchants who want more.</p>
                            </div>

                            <div className="plan-premium-symbol">
                                <Zap size={24} fill="currentColor" />
                            </div>
                        </div>

                        <div className="plan-price">
                            <span className="plan-price-main">{PREMIUM_PRICE}</span>
                            <span className="plan-price-period">/ month</span>
                        </div>
                        <div className="plan-price-zar">
                            {PREMIUM_PRICE_ZAR}
                            <span> per month</span>
                        </div>

                        <div className="plan-billing-note">
                            <Clock3 size={15} />
                            <span>One paid subscription period lasts 30 days.</span>
                        </div>

                        <div className="plan-divider" />

                        <p className="plan-benefits-title">WHAT'S INCLUDED</p>

                        <ul className="plan-benefits">
                            <li>
                                <CheckCircle2 size={17} />
                                <span>
                                    <strong>Unlimited till-slip handouts</strong>
                                    <small>Give your customers digital till slips without a plan-imposed handout limit.</small>
                                </span>
                            </li>
                            <li>
                                <CheckCircle2 size={17} />
                                <span>
                                    <strong>Your choice of till-slip designs</strong>
                                    <small>Access the till-slip styles available to your merchant account.</small>
                                </span>
                            </li>
                            <li>
                                <CheckCircle2 size={17} />
                                <span>
                                    <strong>Designed for your business</strong>
                                    <small>Give customers a more modern, polished checkout experience.</small>
                                </span>
                            </li>
                            <li>
                                <InfinityIcon size={18} />
                                <span>
                                    <strong>More freedom to serve</strong>
                                    <small>Focus on your customers instead of a till-slip handout allowance.</small>
                                </span>
                            </li>
                        </ul>

                        {isPremium ? (
                            <div className="plan-current-plan">
                                <ShieldCheck size={18} />
                                You are currently on Premium
                            </div>
                        ) : (
                            <div className="plan-info-note">
                                <ShieldCheck size={17} />
                                <span>
                                    Your subscription status is read directly from your account.
                                    Payment activation must be confirmed by your existing payment
                                    flow before premium access is granted.
                                </span>
                            </div>
                        )}
                    </section>

                    <footer className="plan-footer">
                        <span className="plan-secure-indicator">
                            <span />
                            ACCOUNT STATUS SYNC
                        </span>
                        <span className="plan-footer-price">
                            {PREMIUM_PRICE} <span>/ month</span>
                        </span>
                    </footer>
                </main>
            </section>
        </div>
    );
}
