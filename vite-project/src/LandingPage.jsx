import React from 'react';

export default function LandingPage() {
  // Handles the smooth anchor link navigation behavior natively in React
  const handleScroll = (e, targetId) => {
    e.preventDefault();
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div style={{
      margin: 0,
      fontFamily: 'Arial, sans-serif',
      background: 'radial-gradient(circle at top, #0b1820, #05070A 60%)',
      color: '#eef',
      minHeight: '100vh',
      boxSizing: 'border-box'
    }}>
      {/* Scope original CSS rules explicitly within this component layout view */}
      <style>{`
        header { position: sticky; top: 0; background: rgba(5,7,10,.8); backdrop-filter: blur(10px); display: flex; justify-content: space-between; align-items: center; padding: 18px 8%; border-bottom: 1px solid rgba(0,255,213,.15); z-index: 100; }
        .logo { font-size: 28px; font-weight: 700; color: #00ffd5; }
        nav a { color: #cfe; text-decoration: none; margin: 0 12px; cursor: pointer; }
        .btn { padding: 14px 24px; border-radius: 40px; background: linear-gradient(90deg, #00ffd5, #00bfff); color: #001; font-weight: bold; text-decoration: none; display: inline-block; }
        .btn-secondary { padding: 14px 24px; border-radius: 40px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.2); color: #cfe; font-weight: bold; text-decoration: none; display: inline-block; cursor: not-allowed; }
        .hero { display: grid; grid-template-columns: 1.1fr 1fr; gap: 40px; padding: 70px 8%; align-items: center; }
        h1 { font-size: 58px; line-height: 1.05; margin: 0 0 20px; }
        p { color: #c9d4dd; line-height: 1.7; }
        .actions { display: flex; gap: 16px; flex-wrap: wrap; margin-top: 25px; }
        .panel { background: rgba(255,255,255,.03); border: 1px solid rgba(0,255,213,.15); border-radius: 24px; padding: 20px; box-shadow: 0 0 30px rgba(0,255,213,.08); }
        .hero img { width: 100%; border-radius: 20px; display: block; }
        section { padding: 70px 8%; }
        .cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 24px; }
        .card { transition: .3s; }
        .card:hover { transform: translateY(-8px); }
        .steps { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 20px; }
        footer { padding: 40px; text-align: center; border-top: 1px solid rgba(255,255,255,.08); color: #9fb; }
        @media(max-width: 900px) { .hero { grid-template-columns: 1fr; } h1 { font-size: 42px; } }
      `}</style>

      <header>
        <div
  className="logo"
  style={{
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  }}
>
  <img
  src="/RuachAgentLogo.png"
  alt="RuachAgent"
  style={{
    height: "90px",
    width: "auto",
    objectFit: "contain",
    filter: `
      drop-shadow(0 0 6px rgba(8,227,216,.8))
      drop-shadow(0 0 16px rgba(8,227,216,.35))
    `
  }}
/>
</div>
        <nav>
          <a href="#features" onClick={(e) => handleScroll(e, 'features')}>Features</a>
          <a href="#works" onClick={(e) => handleScroll(e, 'works')}>How It Works</a>
          <a href="#faq" onClick={(e) => handleScroll(e, 'faq')}>FAQ</a>
        </nav>
        {/* Points to the login path handled by your React app router */}
        <a className="btn" href="/login">Launch Web App</a>
      </header>

      <section className="hero">
        <div>
          <h1>Ditch the Paper.<br />Automate Your Receipts in Real-Time.</h1>
          <p>RuachAgent seamlessly integrates with your POS or webhook setup to instantly send beautiful, fully customized digital till slips the moment a transaction clears.</p>
          <div className="actions">
            <span className="btn-secondary">💻 Desktop App (Coming Soon)</span>
            <span className="btn-secondary">📱 Mobile Version (Coming Soon)</span>
          </div>
        </div>
        <div className="panel">
          <img src="/receipt-preview.png" alt="Receipt Preview" />
        </div>
      </section>

      <section id="features">
        <h2>Core Features</h2>
        <div className="cards">
          <div className="panel card">
            <h3>Branded to Perfection</h3>
            <p>Upload logos, currencies and create premium digital receipts with watermark branding.</p>
          </div>
          <div className="panel card">
            <h3>Webhook & AI Automation</h3>
            <p>Generate endpoint URLs and automate receipt routing, discounts and voucher policies.</p>
          </div>
          <div className="panel card">
            <h3>QR Enabled Receipts</h3>
            <p>Every receipt includes secure QR codes for vouchers, tracking and verification.</p>
          </div>
        </div>
      </section>

      <section id="works">
        <h2>Inside the Merchant Dashboard</h2>
        <div className="panel" style={{ marginBottom: '20px' }}>
          <img src="/dashboard-preview.png" alt="Dashboard Preview" style={{ width: '100%', borderRadius: '20px', display: 'block' }} />
        </div>
        <div className="steps">
          <div className="panel">
            <h3>1. Configure</h3>
            <p>Business information, branding and receipt preferences.</p>
          </div>
          <div className="panel">
            <h3>2. Sync Endpoint</h3>
            <p>Copy webhook URL and connect your POS.</p>
          </div>
          <div className="panel">
            <h3>3. Monitor</h3>
            <p>Watch live synchronized inboxes and parsed slips.</p>
          </div>
          <div className="panel">
            <h3>4. Live Mirror</h3>
            <p>Preview exactly what customers receive.</p>
          </div>
        </div>
      </section>

      <section>
        <div className="panel" style={{ textAlign: 'center' }}>
          <h2>Ready to upgrade your checkout experience?</h2>
          <p>Join modern merchants saving time and eliminating paper receipts.</p>
          <div className="actions" style={{ justifyContent: 'center' }}>
            <span className="btn-secondary">💻 Desktop App (Coming Soon)</span>
            <span className="btn-secondary">📱 Mobile App (Coming Soon)</span>
          </div>
        </div>
      </section>

      <section id="faq">
        <h2>FAQ</h2>
        <div className="panel">
          <h3>Does it support custom branding?</h3>
          <p>Yes.</p>
          <h3>Can it integrate with webhooks?</h3>
          <p>Yes, using generated endpoint URLs.</p>
          <h3>How do customers access their receipts?</h3>
          <p>Customers receive their receipts via email if the store's POS collects email addresses.</p>
          <h3>How can customers scan their QR codes?</h3>
          <p>Customers can scan the QR codes using their smartphone cameras.</p>
        </div>
      </section>

      <footer>© 2026 RuachAgent. All rights reserved. | Privacy Policy | Terms | Support</footer>
    </div>
  );
}