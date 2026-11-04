

import React, { useEffect, useState } from "react";
import {
    X,
    Mail,
    Phone,
    Clock,
    Headphones,
    MessageCircle,
    Building2,
    ShieldCheck,
    ChevronDown,
    ArrowUpRight,
    Zap,
    LifeBuoy
} from "lucide-react";

import "./Help.css";

const Help = ({ isOpen = true, onClose = () => { } }) => {
    const [expandedFaq, setExpandedFaq] = useState(0);

    useEffect(() => {
        if (!isOpen) return;

        const handleEscape = (event) => {
            if (event.key === "Escape") {
                onClose();
            }
        };

        document.addEventListener("keydown", handleEscape);

        return () => {
            document.removeEventListener("keydown", handleEscape);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const emailAddress = "ruachagentts@gmail.com";
    const phoneNumber = "+27679640375";

    const faqs = [
        {
            question: "What details should I include when emailing support?",
            answer:
                "To help us resolve your issue quickly, please include your full name, account or order reference (if applicable), and a clear description of your question or issue."
        },
        {
            question: "What is the response time for phone calls?",
            answer:
                "Calls made during operational hours are answered immediately by our support team. If you call outside of business hours, please leave a message or send an email, and we will follow up with you on the next business day."
        }
    ];

    const departments = [
        {
            name: "Technical Support",
            method: "Email",
            detail: emailAddress,
            icon: ShieldCheck,
            link: `mailto:${emailAddress}`
        },
        {
            name: "General Inquiries",
            method: "Email or Phone",
            detail: "Contact our support team",
            icon: MessageCircle,
            link: `mailto:${emailAddress}`
        },
        {
            name: "Urgent Assistance",
            method: "Phone",
            detail: "+27 67 964 0375",
            icon: Zap,
            link: `tel:${phoneNumber}`
        },
        {
            name: "Partnerships & Business",
            method: "Email",
            detail: emailAddress,
            icon: Building2,
            link: `mailto:${emailAddress}`
        }
    ];

    return (
        <div
            className="ra-help-overlay"
            onMouseDown={(event) => {
                if (event.target === event.currentTarget) {
                    onClose();
                }
            }}
        >
            <div
                className="ra-help-modal"
                role="dialog"
                aria-modal="true"
                aria-labelledby="ra-help-title"
            >
                {/* HEADER */}
                <header className="ra-help-header">
                    <div className="ra-help-brand">
                        <div className="ra-help-brand-icon">
                            <LifeBuoy size={23} />
                        </div>

                        <div>
                            <div className="ra-help-brand-name">
                                RUACHAGENT
                                <span className="ra-help-ai-label">
                                    SUPPORT
                                </span>
                            </div>

                            <div className="ra-help-brand-subtitle">
                                Customer assistance centre
                            </div>
                        </div>
                    </div>

                    <button
                        type="button"
                        className="ra-help-close"
                        onClick={onClose}
                        aria-label="Close help"
                    >
                        <X size={19} />
                    </button>
                </header>

                {/* STATUS STRIP */}
                <div className="ra-help-status">
                    <div className="ra-help-status-left">
                        <span className="ra-help-status-dot" />
                        CUSTOMER SUPPORT
                        <span className="ra-help-status-divider">/</span>
                        WE'RE HERE TO HELP
                    </div>

                    <span className="ra-help-secure-label">
                        RUACHAGENT SUPPORT
                    </span>
                </div>

                {/* MAIN CONTENT */}
                <main className="ra-help-content">

                    {/* INTRODUCTION */}
                    <section className="ra-help-intro">
                        <div className="ra-help-eyebrow">
                            <span className="ra-help-eyebrow-line" />
                            DEDICATED CUSTOMER CARE
                        </div>

                        <h1 id="ra-help-title">
                            Need Help?
                            <span> We're Here for You.</span>
                        </h1>

                        <p>
                            At <strong>RuachAgent</strong>, we are dedicated
                            to providing fast, reliable support for all your
                            inquiries, feedback, and technical assistance
                            needs. Whether you have a question about our
                            services, need assistance with your account, or
                            want to discuss business opportunities, our team
                            is ready to assist.
                        </p>
                    </section>

                    {/* CONTACT CARDS */}
                    <section className="ra-help-section">
                        <div className="ra-help-section-heading">
                            <div>
                                <span className="ra-help-section-kicker">
                                    GET IN TOUCH
                                </span>
                                <h2>Contact Information</h2>
                            </div>

                            <Headphones size={22} />
                        </div>

                        <div className="ra-help-contact-grid">

                            {/* EMAIL */}
                            <article className="ra-help-contact-card">
                                <div className="ra-help-card-top">
                                    <div className="ra-help-contact-icon">
                                        <Mail size={21} />
                                    </div>

                                    <span className="ra-help-card-tag">
                                        EMAIL SUPPORT
                                    </span>
                                </div>

                                <h3>Email Support</h3>

                                <p>
                                    For general inquiries, customer support,
                                    technical assistance, or business inquiries,
                                    reach out to us via email.
                                </p>

                                <div className="ra-help-contact-detail">
                                    <span>Email Address</span>

                                    <a href={`mailto:${emailAddress}`}>
                                        {emailAddress}
                                        <ArrowUpRight size={14} />
                                    </a>
                                </div>

                                <div className="ra-help-response-note">
                                    <Clock size={14} />
                                    <span>
                                        Response within 24 business hours
                                    </span>
                                </div>

                                <a
                                    href={`mailto:${emailAddress}`}
                                    className="ra-help-action"
                                >
                                    Send an Email
                                    <ArrowUpRight size={16} />
                                </a>
                            </article>

                            {/* PHONE */}
                            <article className="ra-help-contact-card">
                                <div className="ra-help-card-top">
                                    <div className="ra-help-contact-icon">
                                        <Phone size={21} />
                                    </div>

                                    <span className="ra-help-card-tag">
                                        DIRECT ASSISTANCE
                                    </span>
                                </div>

                                <h3>Phone Support</h3>

                                <p>
                                    Prefer to speak directly with our team?
                                    Give us a call during our standard
                                    business hours.
                                </p>

                                <div className="ra-help-contact-detail">
                                    <span>Phone Number</span>

                                    <a href={`tel:${phoneNumber}`}>
                                        +27 67 964 0375
                                        <ArrowUpRight size={14} />
                                    </a>
                                </div>

                                <div className="ra-help-response-note">
                                    <Clock size={14} />
                                    <span>
                                        Monday – Friday, 8:00 AM – 5:00 PM
                                        (SAST)
                                    </span>
                                </div>

                                <a
                                    href={`tel:${phoneNumber}`}
                                    className="ra-help-action"
                                >
                                    Call Support
                                    <ArrowUpRight size={16} />
                                </a>
                            </article>
                        </div>
                    </section>

                    {/* DEPARTMENTS */}
                    <section className="ra-help-section">
                        <div className="ra-help-section-heading">
                            <div>
                                <span className="ra-help-section-kicker">
                                    SUPPORT DIRECTORY
                                </span>
                                <h2>How We Can Help</h2>
                            </div>

                            <Building2 size={21} />
                        </div>

                        <div className="ra-help-departments">
                            {departments.map((department, index) => {
                                const DepartmentIcon = department.icon;

                                return (
                                    <div
                                        className="ra-help-department"
                                        key={department.name}
                                    >
                                        <div className="ra-help-department-icon">
                                            <DepartmentIcon size={17} />
                                        </div>

                                        <div className="ra-help-department-info">
                                            <strong>{department.name}</strong>
                                            <span>{department.method}</span>
                                        </div>

                                        <a
                                            href={department.link}
                                            className="ra-help-department-link"
                                        >
                                            {department.detail}
                                            <ArrowUpRight size={13} />
                                        </a>
                                    </div>
                                );
                            })}
                        </div>
                    </section>

                    {/* FAQ */}
                    <section className="ra-help-section ra-help-faq-section">
                        <div className="ra-help-section-heading">
                            <div>
                                <span className="ra-help-section-kicker">
                                    QUICK ANSWERS
                                </span>
                                <h2>Frequently Asked Questions</h2>
                            </div>

                            <MessageCircle size={21} />
                        </div>

                        <div className="ra-help-faq-list">
                            {faqs.map((faq, index) => {
                                const isExpanded = expandedFaq === index;

                                return (
                                    <div
                                        className={`ra-help-faq ${isExpanded ? "expanded" : ""
                                            }`}
                                        key={faq.question}
                                    >
                                        <button
                                            type="button"
                                            className="ra-help-faq-question"
                                            onClick={() =>
                                                setExpandedFaq(
                                                    isExpanded ? -1 : index
                                                )
                                            }
                                            aria-expanded={isExpanded}
                                        >
                                            <span>
                                                <span className="ra-help-faq-number">
                                                    0{index + 1}
                                                </span>

                                                {faq.question}
                                            </span>

                                            <ChevronDown
                                                size={18}
                                                className="ra-help-faq-chevron"
                                            />
                                        </button>

                                        {isExpanded && (
                                            <div className="ra-help-faq-answer">
                                                {faq.answer}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </section>

                    {/* BOTTOM BANNER */}
                    <section className="ra-help-bottom-banner">
                        <div className="ra-help-bottom-icon">
                            <Zap size={20} />
                        </div>

                        <div>
                            <strong>We're ready when you need us.</strong>
                            <span>
                                Your RuachAgent support team is just a message
                                or phone call away.
                            </span>
                        </div>

                        <a href={`mailto:${emailAddress}`}>
                            Contact Us
                            <ArrowUpRight size={15} />
                        </a>
                    </section>

                </main>

                {/* FOOTER */}
                <footer className="ra-help-footer">
                    <span>RUACHAGENT · CUSTOMER SUPPORT</span>
                    <span>POWERED BY RUACHAGENT</span>
                </footer>
            </div>
        </div>
    );
};

export default Help;
