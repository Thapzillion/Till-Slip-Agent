
import { useCallback, useEffect, useRef, useState } from "react";
import {
    X,
    Sparkles,
    Send,
    Bot,
    UserRound,
    Plus,
    MessageSquare,
    Zap,
    CircleHelp,
    ArrowUpRight,
    LoaderCircle,
    AlertCircle,
    Copy,
} from "lucide-react";
import { supabase } from "./supabaseClient";
import "./Help.css";

const SUGGESTED_QUESTIONS = [
    {
        icon: "receipt",
        title: "Till slips",
        prompt: "How do I configure and send digital till slips to customers?",
    },
    {
        icon: "store",
        title: "Connect a store",
        prompt: "How do I connect my store or POS system to RuachAgent?",
    },
    {
        icon: "settings",
        title: "Agent parameters",
        prompt: "Explain the Agent Parameters page and how to configure it.",
    },
    {
        icon: "plan",
        title: "My subscription",
        prompt: "Explain my free trial, Premium plan, and subscription status.",
    },
];

const createMessageId = () =>
    `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

function getAssistantText(data) {
    if (typeof data === "string") return data;

    return (
        data?.reply ??
        data?.response ??
        data?.text ??
        data?.message ??
        data?.answer ??
        data?.output ??
        data?.content ??
        data?.candidates?.[0]?.content?.parts
            ?.map((part) => part.text || "")
            .join("\n")
            .trim() ??
        ""
    );
}

function formatMessageText(text) {
    // Keep assistant output as text rather than interpreting model output as HTML.
    return String(text ?? "");
}

function SuggestionIcon({ type }) {
    if (type === "receipt") return <MessageSquare size={16} />;
    if (type === "store") return <ArrowUpRight size={16} />;
    if (type === "settings") return <Zap size={16} />;
    return <CircleHelp size={16} />;
}

export default function Help({
    isOpen = true,
    onClose = () => { },
    user = null,
}) {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [sending, setSending] = useState(false);
    const [error, setError] = useState("");
    const [copiedId, setCopiedId] = useState(null);

    const listRef = useRef(null);
    const inputRef = useRef(null);
    const sendingRef = useRef(false);

    const scrollToBottom = useCallback(() => {
        requestAnimationFrame(() => {
            listRef.current?.scrollTo({
                top: listRef.current.scrollHeight,
                behavior: "smooth",
            });
        });
    }, []);

    useEffect(() => {
        if (!isOpen) return;

        const handleEscape = (event) => {
            if (event.key === "Escape") onClose();
        };

        window.addEventListener("keydown", handleEscape);

        const focusTimer = window.setTimeout(() => {
            inputRef.current?.focus();
        }, 250);

        return () => {
            window.removeEventListener("keydown", handleEscape);
            window.clearTimeout(focusTimer);
        };
    }, [isOpen, onClose]);

    useEffect(() => {
        scrollToBottom();
    }, [messages, sending, scrollToBottom]);

    const startNewChat = () => {
        if (sendingRef.current) return;
        setMessages([]);
        setInput("");
        setError("");
        setCopiedId(null);
        inputRef.current?.focus();
    };

    const sendMessage = async (messageOverride) => {
        const message = String(messageOverride ?? input).trim();

        if (!message || sendingRef.current) return;

        sendingRef.current = true;
        setSending(true);
        setError("");
        setInput("");

        const userMessage = {
            id: createMessageId(),
            role: "user",
            content: message,
            createdAt: new Date().toISOString(),
        };

        // Send the existing conversation before adding the new user message.
        const historyForRequest = messages.map(({ role, content }) => ({
            role,
            content,
        }));

        setMessages((current) => [...current, userMessage]);

        try {
            const {
                data: { session },
                error: sessionError,
            } = await supabase.auth.getSession();

            if (sessionError) throw sessionError;

            if (!session?.access_token) {
                throw new Error("Please sign in again to use RuachAgent AI.");
            }

            const { data, error: functionError } =
                await supabase.functions.invoke("google-api-handler", {
                    body: {
                        message,
                        history: historyForRequest,
                        userId: user?.id ?? session.user?.id ?? null,
                    },
                });

            if (functionError) {
                // Supabase may return a FunctionsHttpError with a response body.
                let detail = "";

                try {
                    const response = functionError.context;
                    if (response && typeof response.json === "function") {
                        const body = await response.json();
                        detail = body?.error || body?.message || "";
                    }
                } catch {
                    // Use the normal error message if no readable response body exists.
                }

                throw new Error(
                    detail ||
                    functionError.message ||
                    "RuachAgent AI could not be reached. Please try again."
                );
            }

            if (data?.error) {
                throw new Error(
                    typeof data.error === "string"
                        ? data.error
                        : "RuachAgent AI returned an error."
                );
            }

            const assistantText = getAssistantText(data);

            if (!assistantText) {
                throw new Error(
                    "The AI service returned an empty response. Check the google-api-handler response format."
                );
            }

            setMessages((current) => [
                ...current,
                {
                    id: createMessageId(),
                    role: "assistant",
                    content: formatMessageText(assistantText),
                    createdAt: new Date().toISOString(),
                },
            ]);
        } catch (err) {
            console.error("RuachAgent AI chat error:", err);
            setError(
                err?.message ||
                "Something went wrong while contacting RuachAgent AI."
            );
        } finally {
            sendingRef.current = false;
            setSending(false);
            inputRef.current?.focus();
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        sendMessage();
    };

    const copyMessage = async (message) => {
        try {
            await navigator.clipboard.writeText(message.content);
            setCopiedId(message.id);
            window.setTimeout(() => {
                setCopiedId((current) => current === message.id ? null : current);
            }, 1600);
        } catch (err) {
            console.error("Unable to copy AI message:", err);
            setError("Could not copy the message. Please select and copy it manually.");
        }
    };

    if (!isOpen) return null;

    const isFirstVisit = messages.length === 0;

    return (
        <div
            className="help-overlay"
            onMouseDown={(event) => {
                if (event.target === event.currentTarget) onClose();
            }}
        >
            <section
                className="help-modal"
                role="dialog"
                aria-modal="true"
                aria-labelledby="help-heading"
            >
                <div className="help-ambient help-ambient-one" />
                <div className="help-ambient help-ambient-two" />

                <header className="help-header">
                    <div className="help-brand">
                        <div className="help-logo">
                            <Sparkles size={22} />
                            <span className="help-logo-orbit" />
                        </div>

                        <div className="help-brand-text">
                            <div className="help-brand-line">
                                <span className="help-brand-name">RUACHAGENT</span>
                                <span className="help-ai-chip">AI</span>
                            </div>
                            <span className="help-brand-subtitle">Intelligent support system</span>
                        </div>
                    </div>

                    <div className="help-header-actions">
                        <button
                            type="button"
                            className="help-new-chat"
                            onClick={startNewChat}
                            disabled={sending}
                            title="Start a new conversation"
                        >
                            <Plus size={16} />
                            <span>New chat</span>
                        </button>

                        <button
                            type="button"
                            className="help-close"
                            onClick={onClose}
                            aria-label="Close AI help"
                        >
                            <X size={19} />
                        </button>
                    </div>
                </header>

                <div className="help-system-strip">
                    <span className="help-online-indicator">
                        <span />
                    </span>
                    <span>AI KNOWLEDGE ENGINE</span>
                    <span className="help-strip-divider">/</span>
                    <span className="help-strip-muted">GEMINI INTELLIGENCE</span>
                    <span className="help-strip-spacer" />
                    <span className="help-secure-label">SECURE SESSION</span>
                </div>

                <main className="help-chat-layout">
                    <div className="help-messages" ref={listRef}>
                        {isFirstVisit ? (
                            <div className="help-welcome">
                                <div className="help-welcome-core">
                                    <div className="help-core-ring help-core-ring-one" />
                                    <div className="help-core-ring help-core-ring-two" />
                                    <div className="help-core-center">
                                        <Sparkles size={30} />
                                    </div>
                                    <span className="help-core-node help-core-node-one" />
                                    <span className="help-core-node help-core-node-two" />
                                    <span className="help-core-node help-core-node-three" />
                                </div>

                                <span className="help-eyebrow">YOUR BUSINESS AI ASSISTANT</span>
                                <h1 id="help-heading">
                                    How can I
                                    <br />
                                    <span>help you today?</span>
                                </h1>
                                <p className="help-welcome-description">
                                    Ask me about till slips, merchant settings, store connections,
                                    webhooks, subscriptions, or how RuachAgent works.
                                </p>

                                <div className="help-suggestions-heading">
                                    <span>QUICK START</span>
                                    <span className="help-suggestion-line" />
                                </div>

                                <div className="help-suggestions">
                                    {SUGGESTED_QUESTIONS.map((item) => (
                                        <button
                                            type="button"
                                            className="help-suggestion"
                                            key={item.title}
                                            onClick={() => sendMessage(item.prompt)}
                                            disabled={sending}
                                        >
                                            <span className="help-suggestion-icon">
                                                <SuggestionIcon type={item.icon} />
                                            </span>
                                            <span className="help-suggestion-copy">
                                                <strong>{item.title}</strong>
                                                <small>{item.prompt}</small>
                                            </span>
                                            <ArrowUpRight
                                                size={15}
                                                className="help-suggestion-arrow"
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="help-conversation">
                                <div className="help-conversation-label">
                                    <span className="help-conversation-label-dot" />
                                    CONVERSATION ACTIVE
                                </div>

                                {messages.map((message) => {
                                    const isAssistant = message.role === "assistant";

                                    return (
                                        <article
                                            key={message.id}
                                            className={`help-message ${isAssistant ? "help-message-assistant" : "help-message-user"
                                                }`}
                                        >
                                            <div className="help-message-avatar">
                                                {isAssistant ? (
                                                    <Sparkles size={16} />
                                                ) : (
                                                    <UserRound size={16} />
                                                )}
                                            </div>

                                            <div className="help-message-main">
                                                <div className="help-message-meta">
                                                    <strong>
                                                        {isAssistant ? "RuachAgent AI" : "You"}
                                                    </strong>
                                                    <span>
                                                        {isAssistant ? "AI ASSISTANT" : "MESSAGE"}
                                                    </span>
                                                </div>

                                                <div className="help-message-bubble">
                                                    {message.content}
                                                </div>

                                                {isAssistant && (
                                                    <button
                                                        type="button"
                                                        className="help-copy-button"
                                                        onClick={() => copyMessage(message)}
                                                        title="Copy response"
                                                    >
                                                        <Copy size={12} />
                                                        {copiedId === message.id ? "Copied" : "Copy response"}
                                                    </button>
                                                )}
                                            </div>
                                        </article>
                                    );
                                })}

                                {sending && (
                                    <div className="help-message help-message-assistant">
                                        <div className="help-message-avatar help-typing-avatar">
                                            <Sparkles size={16} />
                                        </div>
                                        <div className="help-message-main">
                                            <div className="help-message-meta">
                                                <strong>RuachAgent AI</strong>
                                                <span>PROCESSING</span>
                                            </div>
                                            <div className="help-typing-bubble" aria-label="AI is typing">
                                                <span />
                                                <span />
                                                <span />
                                                <small>Thinking through your question</small>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {error && (
                        <div className="help-error" role="alert">
                            <AlertCircle size={16} />
                            <span>{error}</span>
                            <button type="button" onClick={() => setError("")} aria-label="Dismiss error">
                                <X size={14} />
                            </button>
                        </div>
                    )}

                    <div className="help-composer-area">
                        <form className="help-composer" onSubmit={handleSubmit}>
                            <div className="help-composer-topline">
                                <span className="help-composer-status">
                                    <span />
                                    MESSAGE RUACHAGENT AI
                                </span>
                                <span className="help-composer-hint">Enter to send</span>
                            </div>

                            <textarea
                                ref={inputRef}
                                className="help-input"
                                value={input}
                                onChange={(event) => setInput(event.target.value)}
                                onKeyDown={(event) => {
                                    if (
                                        event.key === "Enter" &&
                                        !event.shiftKey &&
                                        !event.nativeEvent.isComposing
                                    ) {
                                        event.preventDefault();
                                        handleSubmit(event);
                                    }
                                }}
                                placeholder="Ask anything about your RuachAgent workspace..."
                                rows={2}
                                maxLength={5000}
                                disabled={sending}
                                aria-label="Message RuachAgent AI"
                            />

                            <div className="help-composer-bottom">
                                <span className="help-ai-disclaimer">
                                    <Bot size={14} />
                                    AI responses can make mistakes. Verify important details.
                                </span>

                                <button
                                    type="submit"
                                    className="help-send-button"
                                    disabled={!input.trim() || sending}
                                    aria-label="Send message"
                                >
                                    {sending ? (
                                        <LoaderCircle size={17} className="help-spin" />
                                    ) : (
                                        <Send size={16} />
                                    )}
                                    <span>{sending ? "Thinking..." : "Send"}</span>
                                </button>
                            </div>
                        </form>

                        <footer className="help-footer">
                            <span>RUACHAGENT <span className="help-footer-dot">·</span> HELP CENTRE</span>
                            <span>POWERED BY GEMINI</span>
                        </footer>
                    </div>
                </main>
            </section>
        </div>
    );
}
