
import { useCallback, useEffect, useState } from "react";
import {
    X,
    UserRound,
    Mail,
    Crown,
    CalendarClock,
    Clock3,
    ShieldCheck,
    RefreshCw,
    AlertCircle,
} from "lucide-react";
import { supabase } from "../supabaseClient";
import "./Profile.css";

const DAY_MS = 1000 * 60 * 60 * 24;
const noop = () => { };

function getDaysRemaining(dateValue) {
    if (!dateValue) return null;

    const timestamp = new Date(dateValue).getTime();

    if (!Number.isFinite(timestamp)) return null;

    return Math.max(0, Math.ceil((timestamp - Date.now()) / DAY_MS));
}

function formatDate(dateValue) {
    if (!dateValue) return "Not available";

    const date = new Date(dateValue);

    if (!Number.isFinite(date.getTime())) return "Not available";

    return new Intl.DateTimeFormat(undefined, {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    }).format(date);
}

function getSubscriptionDetails(subscription) {
    if (!subscription) {
        return {
            plan: "Subscription unavailable",
            status: "Unknown",
            endDate: null,
            daysRemaining: null,
            periodLabel: "Renewal / expiry",
            isTrial: false,
            isExpired: false,
        };
    }

    const status = String(
        subscription.subscription_status || "unknown"
    ).toLowerCase();

    const isTrial = status === "trial";

    // The supplied database schema uses trial_ends_at for trials
    // and paid_until for paid subscriptions.
    const endDate = isTrial
        ? subscription.trial_ends_at
        : subscription.paid_until;

    const daysRemaining = getDaysRemaining(endDate);
    const isExpired =
        endDate &&
        Number.isFinite(new Date(endDate).getTime()) &&
        new Date(endDate).getTime() <= Date.now();

    const planName = subscription.subscription_plan
        ? String(subscription.subscription_plan)
            .replace(/[_-]/g, " ")
            .replace(/\b\w/g, (letter) => letter.toUpperCase())
        : "Premium";

    let statusLabel = status.replace(/[_-]/g, " ");
    statusLabel = statusLabel.replace(/\b\w/g, (letter) =>
        letter.toUpperCase()
    );

    if (isExpired && status !== "active") {
        statusLabel = "Expired";
    } else if (isExpired && status === "active") {
        statusLabel = "Payment period ended";
    }

    return {
        plan: planName,
        status: statusLabel,
        endDate,
        daysRemaining,
        periodLabel: isTrial ? "Free trial ends" : "Paid plan ends",
        isTrial,
        isExpired: Boolean(isExpired),
    };
}

export default function Profile({
    isOpen = true,
    onClose = noop,
    user = null,
}) {
    const [currentUser, setCurrentUser] = useState(user);
    const [subscription, setSubscription] = useState(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState("");

    const loadProfile = useCallback(async ({ silent = false } = {}) => {
        if (silent) {
            setRefreshing(true);
        } else {
            setLoading(true);
        }

        setError("");

        try {
            // Use the authenticated session as a fallback if the parent
            // has not passed the user object yet.
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
                setCurrentUser(null);
                setSubscription(null);
                setError("Please sign in to view your subscription.");
                return;
            }

            setCurrentUser(activeUser);

            // Read the actual row from public.subscriptions.
            // Never query another user's subscription.
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

            setSubscription(data || null);

            if (!data) {
                setError(
                    "No subscription record was found for this account."
                );
            }
        } catch (err) {
            console.error("Profile subscription fetch failed:", err);
            setError(
                err?.message || "Unable to load your subscription details."
            );
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [user]);

    useEffect(() => {
        setCurrentUser(user);
    }, [user]);

    useEffect(() => {
        if (!isOpen) return undefined;

        loadProfile();

        // Keep the modal synchronized if the subscription row changes.
        let channel;

        if (user?.id) {
            channel = supabase
                .channel(`profile-subscription-${user.id}`)
                .on(
                    "postgres_changes",
                    {
                        event: "*",
                        schema: "public",
                        table: "subscriptions",
                        filter: `user_id=eq.${user.id}`,
                    },
                    () => {
                        loadProfile({ silent: true });
                    }
                )
                .subscribe();
        }

        const handleKeyDown = (event) => {
            if (event.key === "Escape") onClose();
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);

            if (channel) {
                supabase.removeChannel(channel);
            }
        };
    }, [isOpen, user?.id, loadProfile, onClose]);

    if (!isOpen) return null;

    const details = getSubscriptionDetails(subscription);
    const email = currentUser?.email || "Email unavailable";

    return (
        <div
            className="profile-modal-overlay"
            onMouseDown={(event) => {
                if (event.target === event.currentTarget) onClose();
            }}
        >
            <section
                className="profile-modal"
                role="dialog"
                aria-modal="true"
                aria-labelledby="profile-modal-title"
            >
                <header className="profile-modal-header">
                    <div className="profile-heading-icon">
                        <UserRound size={22} />
                    </div>

                    <div>
                        <p className="profile-eyebrow">RUACHAGENT / ACCOUNT</p>
                        <h2 id="profile-modal-title">Your Profile</h2>
                        <p className="profile-subtitle">
                            Account identity and subscription status
                        </p>
                    </div>

                    <button
                        type="button"
                        className="profile-close-button"
                        onClick={onClose}
                        aria-label="Close profile"
                    >
                        <X size={20} />
                    </button>
                </header>

                <div className="profile-content">
                    <article className="profile-info-card">
                        <div className="profile-card-icon">
                            <Mail size={19} />
                        </div>

                        <div className="profile-card-copy">
                            <span className="profile-label">ACCOUNT EMAIL</span>
                            <strong className="profile-email">{email}</strong>
                        </div>

                        <ShieldCheck
                            className="profile-security-icon"
                            size={20}
                        />
                    </article>

                    <article className="profile-subscription-card">
                        <div className="profile-plan-top">
                            <div className="profile-card-icon">
                                <Crown size={20} />
                            </div>

                            <div className="profile-card-copy">
                                <span className="profile-label">
                                    CURRENT SUBSCRIPTION
                                </span>
                                <h3>{details.plan}</h3>
                            </div>

                            <span className="profile-status">
                                {loading ? "Loading" : details.status}
                            </span>
                        </div>

                        {loading ? (
                            <div className="profile-loading">
                                <span className="profile-loading-indicator" />
                                Connecting to subscription database…
                            </div>
                        ) : error ? (
                            <div className="profile-error">
                                <AlertCircle size={18} />
                                <span>{error}</span>
                            </div>
                        ) : (
                            <>
                                <div className="profile-countdown">
                                    <span className="profile-label">
                                        {details.isTrial
                                            ? "FREE TRIAL TIME REMAINING"
                                            : "SUBSCRIPTION TIME REMAINING"}
                                    </span>

                                    <div className="profile-countdown-value">
                                        {details.daysRemaining === null
                                            ? "--"
                                            : details.daysRemaining}
                                        <span>
                                            {details.daysRemaining === 1 ? "day" : "days"}
                                        </span>
                                    </div>

                                    <p>
                                        {details.daysRemaining === null
                                            ? "An expiry date is not available."
                                            : details.isExpired
                                                ? "This subscription period has ended."
                                                : details.daysRemaining === 0
                                                    ? "Less than one day remains."
                                                    : details.isTrial
                                                        ? "remaining until your free trial ends."
                                                        : "remaining until your paid period ends."}
                                    </p>
                                </div>

                                <div className="profile-date-row">
                                    <CalendarClock size={18} />
                                    <div>
                                        <span className="profile-label">
                                            {details.periodLabel.toUpperCase()}
                                        </span>
                                        <strong>{formatDate(details.endDate)}</strong>
                                    </div>
                                </div>

                                {subscription?.last_payment_at && (
                                    <div className="profile-date-row">
                                        <Clock3 size={18} />
                                        <div>
                                            <span className="profile-label">
                                                LAST PAYMENT
                                            </span>
                                            <strong>
                                                {formatDate(subscription.last_payment_at)}
                                            </strong>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </article>

                    <button
                        type="button"
                        className="profile-refresh-button"
                        onClick={() => loadProfile({ silent: true })}
                        disabled={loading || refreshing}
                    >
                        <RefreshCw
                            size={16}
                            className={refreshing ? "profile-spin" : ""}
                        />
                        {refreshing ? "Refreshing…" : "Refresh subscription"}
                    </button>
                </div>

                <footer className="profile-modal-footer">
                    <span className="profile-live-dot" />
                    Subscription data from Supabase
                </footer>
            </section>
        </div>
    );
}

