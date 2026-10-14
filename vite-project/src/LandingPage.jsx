import React from "react";
import { Link } from "react-router-dom";
import "./LandingPage.css";

export default function LandingPage() {
  // Preserve smooth anchor navigation.
  const handleScroll = (e, targetId) => {
    e.preventDefault();

    const element = document.getElementById(targetId);

    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="ra-landing">
      {/* Futuristic navigation */}
      <header className="ra-header">
        <a
          className="ra-brand"
          href="#top"
          aria-label="RuachAgent home"
          onClick={(e) => handleScroll(e, "top")}
        >
          <img
            src="/RuachAgentLogo.png"
            alt="RuachAgent"
          />
          <span className="ra-brand-label">RUACHAGENT</span>
        </a>

        <nav className="ra-nav" aria-label="Main navigation">
          <a
            href="#features"
            onClick={(e) => handleScroll(e, "features")}
          >
            Features
          </a>
          <a
            href="#works"
            onClick={(e) => handleScroll(e, "works")}
          >
            How It Works
          </a>
          <a
            href="#faq"
            onClick={(e) => handleScroll(e, "faq")}
          >
            FAQ
          </a>
        </nav>

        <a className="ra-button ra-button-primary ra-header-cta" href="/login">
          Launch Web App
          <span aria-hidden="true">↗</span>
        </a>
      </header>

      <main>
        {/* Hero */}
        <section className="ra-hero" id="top">
          <div className="ra-hero-grid" aria-hidden="true" />

          <div className="ra-hero-glow" aria-hidden="true" />

          <div className="ra-hero-copy">
            <div className="ra-eyebrow">
              <span className="ra-status-dot" />
              SMARTER CHECKOUT. ZERO PAPER.
            </div>

            <h1>
              Ditch the Paper.
              <br />
              <span className="ra-gradient-text">
                Automate Your
              </span>
              <br />
              Receipts in Real-Time.
            </h1>

            <p className="ra-hero-description">
              RuachAgent seamlessly integrates with your POS or
              webhook setup to instantly send beautiful, fully
              customized digital till slips the moment a
              transaction clears.
            </p>

            <div className="ra-actions">
              <a className="ra-button ra-button-primary" href="/login">
                Launch Web App
                <span aria-hidden="true">→</span>
              </a>
              <a
                className="ra-button ra-button-secondary"
                href="#features"
                onClick={(e) => handleScroll(e, "features")}
              >
                Explore Features
              </a>
            </div>

            <div className="ra-coming-soon">
              <span className="ra-coming-icon" aria-hidden="true">
                ▣
              </span>
              Desktop App
              <span className="ra-coming-divider" />
              <span className="ra-coming-icon" aria-hidden="true">
                ◈
              </span>
              Mobile App
              <span className="ra-coming-badge">COMING SOON</span>
            </div>
          </div>

          <div className="ra-hero-visual">
            <div className="ra-visual-orbit ra-orbit-one" />
            <div className="ra-visual-orbit ra-orbit-two" />

            <div className="ra-visual-label">
              <span className="ra-status-dot" />
              DIGITAL RECEIPT SYSTEM
              <span className="ra-visual-live">LIVE PREVIEW</span>
            </div>

            <div className="ra-receipt-frame ra-glass-panel">
              <div className="ra-frame-top">
                <span className="ra-window-dots">
                  <i />
                  <i />
                  <i />
                </span>
                <span>RECEIPT_PREVIEW</span>
                <span className="ra-frame-indicator">01</span>
              </div>

              <img
                src="/receipt-preview.png"
                alt="RuachAgent digital receipt preview"
                className="ra-receipt-image"
              />

              <div className="ra-frame-footer">
                <span>SECURE DIGITAL DELIVERY</span>
                <span className="ra-footer-check">✓ VERIFIED</span>
              </div>
            </div>

            <div className="ra-floating-chip ra-chip-top">
              <span className="ra-chip-icon">✳</span>
              <span>
                <strong>Automated</strong>
                <small>Receipt delivery</small>
              </span>
            </div>

            <div className="ra-floating-chip ra-chip-bottom">
              <span className="ra-chip-icon ra-chip-blue">⌁</span>
              <span>
                <strong>Seamless sync</strong>
                <small>POS &amp; webhooks</small>
              </span>
            </div>

            <div className="ra-visual-caption">
              <span>01 / DIGITAL-FIRST COMMERCE</span>
              <span>POWERED BY RUACHAGENT</span>
            </div>
          </div>

          <a
            href="#features"
            className="ra-scroll-cue"
            onClick={(e) => handleScroll(e, "features")}
          >
            <span />
            DISCOVER THE PLATFORM
          </a>
        </section>

        {/* Feature introduction */}
        <section className="ra-section ra-features" id="features">
          <div className="ra-section-heading">
            <div className="ra-eyebrow">
              <span className="ra-status-dot" />
              BUILT FOR MODERN MERCHANTS
            </div>

            <h2>
              Less paper.
              <br />
              <span className="ra-gradient-text">
                More possibilities.
              </span>
            </h2>

            <p>
              Intelligent receipt delivery, flexible integrations,
              and a premium customer experience — all in one
              streamlined platform.
            </p>
          </div>

          <div className="ra-feature-grid">
            <article className="ra-panel ra-feature-card">
              <div className="ra-feature-top">
                <div className="ra-feature-icon">✳</div>
                <span className="ra-card-index">01</span>
              </div>

              <div className="ra-card-kicker">YOUR BRAND. YOUR IDENTITY.</div>
              <h3>Branded to Perfection</h3>
              <p>
                Upload logos, currencies and create premium
                digital receipts with watermark branding.
              </p>

              <div className="ra-card-bottom">
                <span>BRAND EXPERIENCE</span>
                <span aria-hidden="true">↗</span>
              </div>
            </article>

            <article className="ra-panel ra-feature-card">
              <div className="ra-feature-top">
                <div className="ra-feature-icon">⌁</div>
                <span className="ra-card-index">02</span>
              </div>

              <div className="ra-card-kicker">INTELLIGENT AUTOMATION</div>
              <h3>Webhook &amp; AI Automation</h3>
              <p>
                Generate endpoint URLs and automate receipt
                routing, discounts and voucher policies.
              </p>

              <div className="ra-card-bottom">
                <span>CONNECTED WORKFLOWS</span>
                <span aria-hidden="true">↗</span>
              </div>
            </article>

            <article className="ra-panel ra-feature-card">
              <div className="ra-feature-top">
                <div className="ra-feature-icon">⌗</div>
                <span className="ra-card-index">03</span>
              </div>

              <div className="ra-card-kicker">SECURE BY DESIGN</div>
              <h3>QR Enabled Receipts</h3>
              <p>
                Every receipt includes secure QR codes for
                vouchers, tracking and verification.
              </p>

              <div className="ra-card-bottom">
                <span>SMART VERIFICATION</span>
                <span aria-hidden="true">↗</span>
              </div>
            </article>
          </div>
        </section>

        {/* Dashboard and workflow */}
        <section className="ra-section ra-workspace" id="works">
          <div className="ra-section-heading">
            <div className="ra-eyebrow">
              <span className="ra-status-dot" />
              THE MERCHANT CONTROL CENTER
            </div>

            <h2>
              Everything connected.
              <br />
              <span className="ra-gradient-text">
                Nothing complicated.
              </span>
            </h2>

            <p>
              Manage your receipt workflows through a unified
              merchant dashboard designed to make every step
              feel effortless.
            </p>
          </div>

          <div className="ra-dashboard-shell ra-glass-panel">
            <div className="ra-dashboard-bar">
              <div className="ra-window-dots">
                <i />
                <i />
                <i />
              </div>

              <span className="ra-dashboard-title">
                RUACHAGENT / MERCHANT DASHBOARD
              </span>

              <span className="ra-dashboard-status">
                <span className="ra-status-dot" />
                WORKSPACE PREVIEW
              </span>
            </div>

            <div className="ra-dashboard-image-wrap">
              <img
                src="/dashboard-preview.png"
                alt="RuachAgent merchant dashboard preview"
                className="ra-dashboard-image"
              />

              <div className="ra-image-corner ra-corner-tl" />
              <div className="ra-image-corner ra-corner-tr" />
              <div className="ra-image-corner ra-corner-bl" />
              <div className="ra-image-corner ra-corner-br" />
            </div>

            <div className="ra-dashboard-footer">
              <span>UNIFIED MERCHANT WORKSPACE</span>
              <span>DESIGNED FOR CLARITY <b>✳</b></span>
            </div>
          </div>

          <div className="ra-workflow-heading">
            <span className="ra-card-kicker">YOUR WORKFLOW</span>
            <h3>Four steps. One connected experience.</h3>
          </div>

          <div className="ra-workflow-grid">
            <article className="ra-panel ra-step-card">
              <span className="ra-step-number">01</span>
              <div className="ra-step-line" />
              <h3>Configure</h3>
              <p>Business information, branding and receipt preferences.</p>
            </article>

            <article className="ra-panel ra-step-card">
              <span className="ra-step-number">02</span>
              <div className="ra-step-line" />
              <h3>Sync Endpoint</h3>
              <p>Copy webhook URL and connect your POS.</p>
            </article>

            <article className="ra-panel ra-step-card">
              <span className="ra-step-number">03</span>
              <div className="ra-step-line" />
              <h3>Monitor</h3>
              <p>Watch live synchronized inboxes and parsed slips.</p>
            </article>

            <article className="ra-panel ra-step-card">
              <span className="ra-step-number">04</span>
              <div className="ra-step-line" />
              <h3>Live Mirror</h3>
              <p>Preview exactly what customers receive.</p>
            </article>
          </div>
        </section>

        {/* Conversion section */}
        <section className="ra-section ra-cta-section">
          <div className="ra-cta-panel ra-panel">
            <div className="ra-cta-grid" aria-hidden="true" />

            <div className="ra-cta-glow" aria-hidden="true" />

            <div className="ra-cta-content">
              <div className="ra-eyebrow">
                <span className="ra-status-dot" />
                THE FUTURE IS DIGITAL
              </div>

              <h2>
                Ready to upgrade
                <br />
                your <span className="ra-gradient-text">checkout experience?</span>
              </h2>

              <p>
                Join modern merchants saving time and eliminating
                paper receipts.
              </p>

              <div className="ra-actions ra-actions-centered">
                <a
                  className="ra-button ra-button-primary"
                  href="/login"
                >
                  Launch Web App <span aria-hidden="true">→</span>
                </a>
              </div>

              <div className="ra-cta-coming">
                <span>DESKTOP APP — COMING SOON</span>
                <span className="ra-cta-separator">/</span>
                <span>MOBILE APP — COMING SOON</span>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="ra-section ra-faq" id="faq">
          <div className="ra-faq-intro">
            <div className="ra-eyebrow">
              <span className="ra-status-dot" />
              QUESTIONS, ANSWERED
            </div>

            <h2>
              Good to
              <br />
              <span className="ra-gradient-text">know.</span>
            </h2>

            <p>
              Everything you need to know before getting started
              with RuachAgent.
            </p>
          </div>

          <div className="ra-faq-list">
            <details className="ra-faq-item" open>
              <summary>
                <span>Does it support custom branding?</span>
                <span className="ra-faq-plus">+</span>
              </summary>
              <p>Yes.</p>
            </details>

            <details className="ra-faq-item">
              <summary>
                <span>Can it integrate with webhooks?</span>
                <span className="ra-faq-plus">+</span>
              </summary>
              <p>Yes, using generated endpoint URLs.</p>
            </details>

            <details className="ra-faq-item">
              <summary>
                <span>How do customers access their receipts?</span>
                <span className="ra-faq-plus">+</span>
              </summary>
              <p>
                Customers receive their receipts via email if the
                store's POS collects email addresses.
              </p>
            </details>

            <details className="ra-faq-item">
              <summary>
                <span>How can customers scan their QR codes?</span>
                <span className="ra-faq-plus">+</span>
              </summary>
              <p>
                Customers can scan the QR codes using their
                smartphone cameras.
              </p>
            </details>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="ra-footer">
        <a
          href="#top"
          className="ra-footer-brand"
          onClick={(e) => handleScroll(e, "top")}
        >
          <img src="/RuachAgentLogo.png" alt="" />
          <span>RUACHAGENT</span>
        </a>

        <p>© 2026 RuachAgent. All rights reserved.</p>

        <nav className="ra-footer-links" aria-label="Legal and support">
          <Link to="/privacy">Privacy Policy</Link>
          <Link to="/terms">Terms</Link>
          <Link to="/support">Support</Link>
        </nav>
      </footer>
    </div>
  );
}