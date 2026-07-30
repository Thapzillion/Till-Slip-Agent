import React from "react";
import "./AdminPanel.css";

import {
  LayoutDashboard,
  Receipt,
  Store,
  SlidersHorizontal,
  FileText,
  Plug,
  HelpCircle,
  Bell,
  UserCircle2,
  Sparkles,
  Palette,
  Cpu,
  Send,
  ArrowUpRight
} from "lucide-react";

export default function AdminPanel() {
  return (
    <div className="admin-page">

      {/* ==============================
            LEFT SIDEBAR
      =============================== */}

      <aside className="sidebar">

        {/* Logo */}

        <div className="sidebar-logo">

          <div className="logo-icon">
            R
          </div>

          <div>
            <h2>RuachAgent AI</h2>
            <span>Intelligent Till Slip Assistant</span>
          </div>

        </div>

        {/* PREVIEWS */}

        <div className="sidebar-section">

          <p className="sidebar-title">
            PREVIEWS
          </p>

          <button className="sidebar-item active">

            <LayoutDashboard size={18} />

            <span>Analysis</span>

          </button>

          <button className="sidebar-item">

            <Receipt size={18} />

            <span>Till Slips Sent</span>

          </button>

          <button className="sidebar-item">

            <Store size={18} />

            <span>Connected Stores</span>

          </button>

        </div>

        {/* SETTINGS */}

        <div className="sidebar-section">

          <p className="sidebar-title">
            SETTINGS
          </p>

          <button className="sidebar-item">

            <SlidersHorizontal size={18} />

            <span>Agent Parameters</span>

          </button>

          <button className="sidebar-item">

            <FileText size={18} />

            <span>Till Slip Preview</span>

          </button>

          <button className="sidebar-item">

            <Plug size={18} />

            <span>Integrations</span>

          </button>

        </div>

        {/* Bottom Card */}

        <div className="sidebar-bottom">

          <div className="bottom-profile">

            <div className="bottom-logo">
              R
            </div>

            <div>

              <h4>RuachAgent AI</h4>

              <p>Version 1.0.0</p>

            </div>

          </div>

        </div>

      </aside>

      {/* ==============================
            MAIN CONTENT
      =============================== */}

      <main className="main-content">

        {/* ==========================
              TOP NAVIGATION
        =========================== */}

        <header className="topbar">

          <div className="topbar-center">

            <h1>
              RuachAgent AI
            </h1>

            <p>
              Your intelligent till slip assistant
            </p>

          </div>

          <div className="topbar-actions">

            <button className="icon-button">
              <HelpCircle size={20} />
            </button>

            <button className="icon-button">
              <Bell size={20} />
            </button>

            <button className="icon-button">

              <UserCircle2 size={24} />

            </button>

          </div>

        </header>

        {/* ==========================
              CONTENT AREA
        =========================== */}

        <div className="content-layout">

          {/* ======================
                 CHAT PANEL
          ======================= */}

          <section className="chat-panel">

            {/* The welcome area,
                feature cards,
                conversation,
                prompt input
                will be added
                in Part 2 */}

          </section>

          {/* ======================
              TILL SLIP PREVIEW
          ======================= */}

          <aside className="preview-panel">

            <aside className="preview-panel">

    <div className="preview-card">

        {/* Header */}

        <div className="preview-header">

            <div>

                <h2>Till Slip Preview</h2>

                <p>AI Generated Receipt</p>

            </div>

            <div className="status-badge">

                <div className="status-dot"></div>

                <span>AI Connected</span>

            </div>

        </div>

        {/* Receipt */}

            <div className="receipt-paper">

    <div className="ai-preview-badge">

        ✨ AI Live Preview

    </div>

    <div className="receipt-merchant">

        <h2>RUACH STORE</h2>

        <p>Johannesburg, South Africa</p>

    </div>

    <div className="receipt-divider"></div>

    <div className="receipt-items">

        <div className="receipt-row">

            <span>Milk</span>

            <span>R32.00</span>

        </div>

        <div className="receipt-row">

            <span>Bread</span>

            <span>R18.50</span>

        </div>

        <div className="receipt-row">

            <span>Eggs</span>

            <span>R41.00</span>

        </div>

    </div>

    <div className="receipt-total">

        <div className="receipt-total-row">

            <span>VAT</span>

            <span>R13.80</span>

        </div>

        <div className="receipt-total-row receipt-grand-total">

            <span>Total</span>

            <span>R105.30</span>

        </div>

    </div>

    <div className="receipt-qr"></div>

    <div className="receipt-footer">

        Powered by RuachAgent AI

    </div>

</div>

        {/* Statistics */}

        <div className="preview-stats">

            <div className="stat-card">

                <span className="stat-value">
                    0
                </span>

                <span className="stat-label">
                    Receipts
                </span>

            </div>

            <div className="stat-card">

                <span className="stat-value">
                    0
                </span>

                <span className="stat-label">
                    Connected
                </span>

            </div>

        </div>

        {/* AI Status */}

        <div className="ai-card">

            <div className="ai-icon">

                <Cpu size={20} />

            </div>

            <div>

                <h4>RuachAgent AI Engine</h4>

                <p>

                    Waiting for your first request to generate
                    a digital till slip.

                </p>

            </div>

        </div>

        {/* Actions */}

        <div className="preview-actions">

            <button className="primary-action">

                Generate Preview

            </button>

            <button className="secondary-action">

                Clear

            </button>

        </div>

        {/* Export */}

        <div className="export-card">

            <h3>

                Export

            </h3>

            <p>

                Download or share your generated receipt.

            </p>

            <button className="export-button">

                Export Receipt

            </button>

        </div>

    </div>

</aside>

          </aside>

        </div>

      </main>

    </div>
  );
}

<section className="chat-panel">

    {/* Main Glass Container */}

    <div className="chat-window">

        {/* Welcome */}

        <div className="hero">

            <div className="hero-badge">

                <Sparkles size={16} />

                <span>RuachAgent AI</span>

            </div>

            <h1>
                Welcome to
                <span> RuachAgent AI</span>
            </h1>

            <p>
                Your AI assistant for creating, managing and delivering
                intelligent digital till slips.
            </p>

        </div>

        {/* Feature Cards */}

        <div className="feature-grid">

            <div className="feature-card">

                <div className="feature-icon">
                    <Palette size={24} />
                </div>

                <h3>AI-Powered Design</h3>

                <p>
                    Instantly generate beautiful till slips using AI while
                    maintaining your brand identity.
                </p>

            </div>

            <div className="feature-card">

                <div className="feature-icon">

                    <Cpu size={24} />

                </div>

                <h3>Smart Parameters</h3>

                <p>
                    Fine tune receipt formatting, tax rules,
                    merchant details and branding with AI.
                </p>

            </div>

            <div className="feature-card">

                <div className="feature-icon">

                    <Store size={24} />

                </div>

                <h3>Store Integration</h3>

                <p>
                    Connect POS systems and automatically
                    synchronize digital till slips.
                </p>

            </div>

            <div className="feature-card">

                <div className="feature-icon">

                    <ArrowUpRight size={24} />

                </div>

                <h3>Instant Delivery</h3>

                <p>
                    Deliver digital receipts through SMS,
                    WhatsApp or Email within seconds.
                </p>

            </div>

        </div>

        {/* Empty Conversation */}

        <div className="conversation">

            <div className="conversation-center">

                <div className="conversation-icon">

                    <Sparkles size={42} />

                </div>

                <h2>
                    Start a conversation
                </h2>

                <p>

                    Ask RuachAgent AI to generate,
                    redesign or analyse your till slips.

                </p>

            </div>

        </div>

        {/* Prompt Area */}

        <div className="prompt-section">

            <div className="prompt-box">

                <input

                    type="text"

                    placeholder="Ask RuachAgent AI anything..."

                />

                <button>

                    <Send size={18} />

                </button>

            </div>

            <div className="prompt-footer">

                <span>
                    AI can make mistakes. Verify important information.
                </span>

                <span>
                    Powered by RuachAgent AI
                </span>

            </div>

        </div>

    </div>

</section>