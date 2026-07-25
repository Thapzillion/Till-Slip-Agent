import { useState, useEffect } from 'react';

import { supabase } from './supabaseClient';

import { useNavigate } from "react-router-dom";

import React, { useState, useEffect, useRef } from 'react';


// ==========================================
// 1. THIN SIDEBAR COMPONENT
// ==========================================
function Sidebar({ activeTab, setActiveTab }) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navItems = [
    { id: 'slips', label: 'Till Slips Sent', icon: '🧾' },
    { id: 'stores', label: 'Connected Stores', icon: '🏪' },
    { id: 'prompts', label: 'Prompts', icon: '⚡' },
    { id: 'settings', label: 'Settings', icon: '⚙️' }
  ];

  return (
    <aside style={{
      width: isCollapsed ? '64px' : '220px',
      height: 'calc(100vh - 32px)',
      position: 'sticky',
      top: '16px',
      background: 'linear-gradient(180deg, rgba(8, 14, 18, 0.95), rgba(4, 8, 12, 0.98))',
      backdropFilter: 'blur(16px)',
      border: '1px solid rgba(0, 255, 200, 0.14)',
      borderRadius: '20px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '16px 10px',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      boxShadow: '0 10px 30px rgba(0,0,0,0.5), 0 0 15px rgba(0,255,200,0.05)',
      boxSizing: 'border-box',
      zIndex: 120,
      userSelect: 'none'
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: isCollapsed ? 'center' : 'space-between',
          padding: '0 8px'
        }}>
          {!isCollapsed && (
            <span style={{
              fontSize: '11px',
              fontWeight: '800',
              color: '#00ffd5',
              letterSpacing: '1.5px',
              textTransform: 'uppercase'
            }}>
              Navigation
            </span>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            style={{
              background: 'rgba(0, 255, 200, 0.08)',
              border: '1px solid rgba(0, 255, 200, 0.2)',
              color: '#00ffd5',
              borderRadius: '8px',
              width: '28px',
              height: '28px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            {isCollapsed ? '➔' : '⬅'}
          </button>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <div
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: isCollapsed ? '12px' : '10px 14px',
                  justifyContent: isCollapsed ? 'center' : 'flex-start',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: isActive ? '700' : '500',
                  color: isActive ? '#041014' : '#a3b8cc',
                  background: isActive
                    ? 'linear-gradient(90deg, #00e0b8 0%, #00ffd5 100%)'
                    : 'transparent',
                  boxShadow: isActive ? '0 0 15px rgba(0, 255, 200, 0.35)' : 'none',
                  transition: 'all 0.2s ease'
                }}
              >
                <span style={{ fontSize: '16px' }}>{item.icon}</span>
                {!isCollapsed && <span>{item.label}</span>}
              </div>
            );
          })}
        </nav>
      </div>

      <div style={{
        borderTop: '1px solid rgba(0, 255, 200, 0.1)',
        paddingTop: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: isCollapsed ? 'center' : 'flex-start',
        gap: '10px',
        paddingLeft: isCollapsed ? '0' : '8px'
      }}>
        <div style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          backgroundColor: '#00ffd5',
          boxShadow: '0 0 8px #00ffd5'
        }} />
        {!isCollapsed && (
          <span style={{ fontSize: '10px', color: '#8a99ad', fontFamily: 'monospace' }}>
            NODE ONLINE
          </span>
        )}
      </div>
    </aside>
  );
}

// ==========================================
// PROMPT CHAT ENGINE (GEMINI-STYLE CHAT FOR ADMIN PANEL)
// ==========================================
function AdminPromptChat({ appState }) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'model',
      text: "I'm connected to your live Admin Panel state. Ask me to analyze transaction volumes, audit your webhook settings, calculate discount impacts, or summarize merchant configuration."
    }
  ]);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isGenerating]);

  // SYSTEM PROMPT ENGINE: Synthesizes entire Admin Panel context into LLM reasoning
  const processAdminPrompt = (userPrompt) => {
    const prompt = userPrompt.toLowerCase();
    const { settings, txCount, txVolume, user, trialDaysRemaining } = appState;

    // Build absolute system state snapshot
    const systemContext = {
      merchant: settings?.business_name || 'Unconfigured Store',
      address: settings?.store_address || 'No Address',
      currency: settings?.currency || 'ZAR',
      discountRate: settings?.discount_percentage ?? 10,
      voucherExpiry: settings?.voucher_expiration_days ?? 30,
      webhookSlug: settings?.webhook_slug || 'none',
      totalSlips: txCount || 0,
      totalVolume: txVolume || 0,
      accountEmail: user?.email || 'N/A',
      trialRemaining: trialDaysRemaining ?? 'N/A'
    };

    // Prompt intent matching & reasoning engine
    if (prompt.includes('audit') || prompt.includes('status') || prompt.includes('overview') || prompt.includes('summary')) {
      return `### 📊 Live Admin Panel Audit
      
• **Merchant Identifier:** ${systemContext.merchant} (${systemContext.address})
• **Financial Throughput:** ${systemContext.currency} ${systemContext.totalVolume} across **${systemContext.totalSlips}** processed slips.
• **Active Rules:** ${systemContext.discountRate}% discount with a ${systemContext.voucherExpiry}-day expiry window.
• **Integration Status:** Webhook slug \`${systemContext.webhookSlug}\` is active.
• **Account Health:** ${systemContext.accountEmail} (${systemContext.trialRemaining} trial days remaining).`;
    }

    if (prompt.includes('webhook') || prompt.includes('endpoint') || prompt.includes('url') || prompt.includes('api')) {
      return `### ⚡ Webhook Infrastructure

Your current webhook routing is bound to slug \`${systemContext.webhookSlug}\`.

**Production Endpoint URL:**
\`\`\`text
https://agadjdvhqguunowplbak.functions.supabase.co/receipt-agent?slug=${systemContext.webhookSlug}
\`\`\`
*You can update this slug directly in your Agent Parameters settings card.*`;
    }

    if (prompt.includes('analyze') || prompt.includes('metric') || prompt.includes('volume') || prompt.includes('average')) {
      const avg = systemContext.totalSlips > 0 ? (systemContext.totalVolume / systemContext.totalSlips).toFixed(2) : 0;
      return `### 📈 Performance Analysis

* **Processed Till Slips:** ${systemContext.totalSlips}
* **Gross Transaction Volume:** ${systemContext.currency} ${systemContext.totalVolume}
* **Average Basket Size:** ${systemContext.currency} ${avg}
* **Discount Exposure:** Up to ${systemContext.discountRate}% potential reward issue per valid slip.`;
    }

    if (prompt.includes('change') || prompt.includes('update') || prompt.includes('how do i')) {
      return `To modify system behavior, use the active controls in the grid layout:
1. **Change Store Name/Currency:** Edit the **Business Profile** block.
2. **Adjust Vouchers/Discounts:** Update values in **Agent Parameters**.
3. **Connect POS:** Direct your receipt webhook payloads to the endpoint listed under **API Integration**.`;
    }

    // Default LLM Context-Aware Response
    return `I evaluated your prompt against your current panel state for **${systemContext.merchant}**:

* **Current Currency:** ${systemContext.currency}
* **Active Webhook Slug:** \`${systemContext.webhookSlug}\`
* **Voucher Rules:** ${systemContext.discountRate}% off (${systemContext.voucherExpiry} days expiry)
* **Total Parsed:** ${systemContext.totalSlips} slips (${systemContext.currency} ${systemContext.totalVolume})

What specific analysis, parameter query, or report generation would you like me to run?`;
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim() || isGenerating) return;

    const userText = input.trim();
    setMessages((prev) => [...prev, { role: 'user', text: userText }]);
    setInput('');
    setIsGenerating(true);

    // Simulate AI generation lag
    setTimeout(() => {
      const response = processAdminPrompt(userText);
      setMessages((prev) => [...prev, { role: 'model', text: response }]);
      setIsGenerating(false);
    }, 600);
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          height: '52px',
          padding: '0 20px',
          borderRadius: '26px',
          background: 'linear-gradient(135deg, #00ffd5, #00b8ff)',
          color: '#041014',
          border: 'none',
          fontWeight: '800',
          fontSize: '13px',
          letterSpacing: '0.5px',
          cursor: 'pointer',
          boxShadow: '0 0 25px rgba(0, 255, 200, 0.4), 0 10px 30px rgba(0,0,0,0.6)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}
      >
        <span>⚡</span>
        <span>{isOpen ? 'Close Prompt Chat' : 'Ask Admin Gemini'}</span>
      </button>

      {/* Gemini-Style Chat Drawer */}
      {isOpen && (
        <div style={{
          position: 'fixed',
          bottom: '88px',
          right: '24px',
          width: '420px',
          maxHeight: '600px',
          height: '78vh',
          background: 'linear-gradient(180deg, rgba(6, 12, 18, 0.98), rgba(3, 7, 10, 0.99))',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(0, 255, 200, 0.25)',
          borderRadius: '20px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.8), 0 0 40px rgba(0, 255, 200, 0.1)',
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}>
          {/* Header Bar */}
          <div style={{
            padding: '14px 18px',
            background: 'rgba(0, 255, 200, 0.04)',
            borderBottom: '1px solid rgba(0, 255, 200, 0.12)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#00ffd5', boxShadow: '0 0 8px #00ffd5' }} />
              <span style={{ fontSize: '12px', fontWeight: '800', color: '#00ffd5', letterSpacing: '1px' }}>
                ADMIN PANEL PROMPT ENGINE
              </span>
            </div>
            <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', color: '#8a99ad', cursor: 'pointer', fontSize: '14px' }}>✕</button>
          </div>

          {/* Conversation Stream */}
          <div style={{ flex: 1, padding: '16px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {messages.map((m, idx) => (
              <div
                key={idx}
                style={{
                  maxWidth: m.role === 'user' ? '80%' : '92%',
                  alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                  background: m.role === 'user'
                    ? 'linear-gradient(90deg, #00e0b8, #00ffd5)'
                    : 'rgba(255, 255, 255, 0.03)',
                  color: m.role === 'user' ? '#041014' : '#e8ffff',
                  border: m.role === 'user' ? 'none' : '1px solid rgba(0, 255, 200, 0.12)',
                  borderRadius: m.role === 'user' ? '16px 16px 2px 16px' : '16px 16px 16px 2px',
                  padding: '12px 14px',
                  fontSize: '12px',
                  lineHeight: '1.5',
                  whiteSpace: 'pre-wrap',
                  fontFamily: m.role === 'model' ? 'system-ui, -apple-system, sans-serif' : 'inherit'
                }}
              >
                {m.text}
              </div>
            ))}
            {isGenerating && (
              <div style={{ fontSize: '12px', color: '#00ffd5', fontStyle: 'italic', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span>✨</span> Processing admin panel state...
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Gemini Prompt Bar */}
          <form onSubmit={handleSend} style={{ padding: '12px', borderTop: '1px solid rgba(0, 255, 200, 0.12)', background: 'rgba(0,0,0,0.4)', display: 'flex', gap: '8px' }}>
            <input
              type="text"
              placeholder="Ask anything about your store settings, volume, or webhooks..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              style={{
                flex: 1,
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(0, 255, 200, 0.2)',
                borderRadius: '12px',
                padding: '10px 14px',
                color: '#ffffff',
                fontSize: '12px',
                outline: 'none'
              }}
            />
            <button
              type="submit"
              disabled={isGenerating}
              style={{
                background: 'linear-gradient(90deg, #00e0b8, #00ffd5)',
                color: '#041014',
                border: 'none',
                borderRadius: '12px',
                padding: '0 16px',
                fontWeight: '700',
                cursor: 'pointer',
                fontSize: '12px'
              }}
            >
              Run
            </button>
          </form>
        </div>
      )}
    </>
  );
}

// Static reference data available instantly globally

const CURRENCY_OPTIONS = [

  { code: 'ZAR', symbol: 'R', name: 'South African Rand' },

  { code: 'USD', symbol: '$', name: 'US Dollar' },

  { code: 'GBP', symbol: '£', name: 'British Pound' },

  { code: 'EUR', symbol: '€', name: 'Euro' },

  { code: 'NGN', symbol: '₦', name: 'Nigerian Naira' }

];



export default function AdminPanel() {

  const [user, setUser] = useState(null);

  const [email, setEmail] = useState('');

  const [password, setPassword] = useState('');

  const [txCount, setTxCount] = useState(0);

  const [txVolume, setTxVolume] = useState(0);

  const [graphData, setGraphData] = useState(Array.from({ length: 28 }).map(() => 0));

  const [isSaveSyncing, setIsSaveSyncing] = useState(false);
 
  const [isAuthSyncing, setIsAuthSyncing] = useState(false);

  const [pendingLogoFile, setPendingLogoFile] = useState(null);
  
  const [isCheckingSession, setIsCheckingSession] = useState(true);

  const [receipt, setReceipt] = useState(null);

  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  
  const [subscriptionLoading, setSubscriptionLoading] = useState(true);


  // --- COMPONENT RENDER-STATE ALIGNMENT LAYER ---
  const activeInboxesCount = user ? 1 : 0; // Tracks the primary active synchronized node
  const totalParsedCount = txCount;       // Maps your optimized total count directly to your UI
  const inboxGraphData = graphData;       // Routes your 28-day database matrix cleanly to the graph bars
  const selectedDateRangeLabel = "PAST_28_DAYS"; // Synced to our server-side SQL aggregation constraint limit


  const [showTrialWelcomeModal, setShowTrialWelcomeModal] = useState(false);
  const [trialDaysRemaining, setTrialDaysRemaining] = useState(0);
  const [trialExpiryDate, setTrialExpiryDate] = useState(null);

  const [signupSuccessMessage, setSignupSuccessMessage] = useState("");

  const navigate = useNavigate();

  const [settings, setSettings] = useState({

    business_name: '',

    store_address: '',

    discount_percentage: 10,

    webhook_slug: '',

    currency: 'ZAR',

    logo_url: ''

  });



  // RuachAgent Responsive Cyber Neon Theme System
  //I haven'nt yet added it to the DAdminPanel.jsx


const isMobile = window.innerWidth <= 768;
const isTablet = window.innerWidth > 768 && window.innerWidth <= 1200;
const isDesktop = window.innerWidth > 1200;

const styles = {
  /* =========================
     APP CONTAINER
  ========================= */
  container: {
    minHeight: '100vh',
    background: `
      radial-gradient(circle at top left, rgba(0,255,200,0.08), transparent 30%),
      radial-gradient(circle at bottom right, rgba(0,255,255,0.05), transparent 35%),
      linear-gradient(135deg, #05070a 0%, #0b1118 40%, #07131a 100%)
    `,
    color: '#e8ffff',
    fontFamily: `
      -apple-system,
      BlinkMacSystemFont,
      "SF Pro Display",
      "Segoe UI",
      Roboto,
      sans-serif
    `,
    paddingBottom: isMobile ? '90px' : '32px',
    paddingLeft: isDesktop ? '24px' : '14px',
    paddingRight: isDesktop ? '24px' : '14px',
    transition: 'all 0.25s ease',
    position: 'relative',
    overflowX: 'hidden',
    boxSizing: 'border-box'
  },

  /* =========================
     MAIN APP SHELL
  ========================= */
  appShell: {
    display: 'grid',
    gridTemplateColumns: isDesktop ? '230px 1fr' : '1fr',
    gap: '22px',
    width: '100%',
    maxWidth: '1800px',
    margin: '0 auto',
    alignItems: 'start',
    boxSizing: 'border-box'
  },

  /* =========================
     CONTENT AREA
  ========================= */
  content: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    alignSelf: 'stretch',
    boxSizing: 'border-box'
  },

  /* =========================
     HEADER
  ========================= */
  header: {
    display: 'flex',
    flexDirection: isMobile ? 'column' : 'row',
    justifyContent: 'space-between',
    alignItems: isMobile ? 'flex-start' : 'center',
    gap: isMobile ? '14px' : '24px', // Ensured spacing buffer
    padding: isMobile ? '16px' : '20px 24px',
    background: 'rgba(10, 18, 24, 0.72)',
    backdropFilter: 'blur(18px)',
    border: '1px solid rgba(0,255,200,0.10)',
    borderRadius: '22px',
    position: 'sticky',
    top: '12px',
    zIndex: 100,
    boxShadow: '0 10px 35px rgba(0,0,0,0.35)',
    boxSizing: 'border-box',
    width: '100%'
  },

  /* =========================
     GRID SYSTEM (Main Layout Sections)
  ========================= */
  dashboardGrid: {
    display: isDesktop ? 'grid' : 'flex',
    flexDirection: isDesktop ? 'row' : 'column', // Set strict layout orientation bounds
    gridTemplateColumns: isDesktop ? '1.1fr 1.1fr 1.2fr' : undefined,
    gap: isDesktop ? '24px' : '20px', // Uniform gap sizing avoids spilling blocks out of view
    width: '100%',
    alignItems: 'start',
    boxSizing: 'border-box'
  },

  /* =========================
     PERFORMANCE NODE METRICS SUB-GRID
  ========================= */
  analyticsSubGrid: {
    display: 'flex',
    flexDirection: isMobile ? 'column' : 'row',
    gap: isMobile ? '8px' : '12px', // Added breathing space to sub-cards
    width: '100%',
    boxSizing: 'border-box'
  },

  /* =========================
     CARDS
  ========================= */
  flatCard: {
    background: 'linear-gradient(180deg, rgba(12, 20, 26, 0.96), rgba(8, 14, 18, 0.98))',
    borderRadius: isMobile ? '18px' : '20px',
    padding: isMobile ? '16px' : '20px', // Re-scaled default card padding values
    border: '1px solid rgba(0,255,200,0.14)',
    boxShadow: `
      0 0 0 1px rgba(255,255,255,0.02),
      0 12px 40px rgba(0,0,0,0.55),
      0 0 25px rgba(0,255,200,0.08)
    `,
    backdropFilter: 'blur(18px)',
    position: 'relative',
    overflow: 'hidden',
    transition: 'all 0.25s ease',
    width: '100%', // Assures block stays pinned at native parent containers limits
    boxSizing: 'border-box'
  },

  /* =========================
     MINI CARD
  ========================= */
  concaveCard: {
    flex: 1, // Let flex boxes auto-distribute cleanly
    background: 'linear-gradient(145deg, rgba(10, 20, 26, 0.92), rgba(6, 12, 16, 0.98))',
    borderRadius: '14px',
    padding: '14px 16px',
    border: '1px solid rgba(0,255,200,0.10)',
    boxShadow: `
      inset 0 1px 1px rgba(255,255,255,0.04),
      inset 0 -8px 12px rgba(0,0,0,0.35)
    `,
    boxSizing: 'border-box'
  },

  /* =========================
     INPUTS
  ========================= */
  input: {
    width: '100%',
    boxSizing: 'border-box',
    padding: isMobile ? '13px 14px' : '15px 16px',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(0,255,200,0.12)',
    borderRadius: '16px',
    color: '#ffffff',
    fontSize: isMobile ? '13px' : '14px',
    outline: 'none',
    transition: 'all 0.2s ease',
    backdropFilter: 'blur(10px)',
    boxSizing: 'border-box',
    boxShadow: 'inset 0 0 12px rgba(0,0,0,0.3)'
  },

  /* =========================
     BUTTONS
  ========================= */
  button: {
    width: '100%',
    background: 'linear-gradient(90deg, #00e0b8 0%, #00f5d4 50%, #00ffd5 100%)',
    color: '#041014',
    border: 'none',
    padding: isMobile ? '13px 14px' : '15px 18px',
    borderRadius: '16px',
    fontWeight: '700',
    fontSize: isMobile ? '13px' : '14px',
    letterSpacing: '0.5px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: `
      0 0 18px rgba(0,255,200,0.35),
      0 8px 24px rgba(0,255,200,0.18)
    `,
    textTransform: 'uppercase',
    boxSizing: 'border-box'
  },

  /* =========================
     RESPONSIVE TITLES
  ========================= */
  title: {
    fontSize: isMobile ? '21px' : isTablet ? '25px' : '30px',
    fontWeight: '700',
    letterSpacing: '1px',
    color: '#ffffff',
    textShadow: '0 0 12px rgba(0,255,200,0.28)',
    lineHeight: '1.1',
    whiteSpace: 'nowrap', // Prevents logo layout drops or character truncation errors
    minWidth: 'max-content'
  },

  subtitle: {
    fontSize: isMobile ? '11px' : '13px',
    color: 'rgba(220, 255, 250, 0.71)',
    letterSpacing: '1.2px',
    textTransform: 'uppercase'
  },

  /* =========================
     STATUS BADGES
  ========================= */
  statusBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: isMobile ? '7px 12px' : '8px 14px',
    borderRadius: '999px',
    background: 'rgba(0, 255, 200, 0)',
    border: '1px solid rgba(0,255,200,0.18)',
    color: '#00ffd5',
    fontSize: isMobile ? '11px' : '12px',
    fontWeight: '600',
    letterSpacing: '0.5px'
  },

  /* =========================
     RESPONSIVE DIVIDER
  ========================= */
  divider: {
    width: '100%',
    height: '1px',
    background: 'linear-gradient(90deg, transparent, rgba(0,255,200,0.18), transparent)',
    margin: isMobile ? '14px 0' : '18px 0'
  },

  /* =========================
     MOBILE FLOATING ACTION BAR
  ========================= */
  mobileDock: {
    position: 'fixed',
    bottom: '18px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: 'calc(100% - 28px)',
    maxWidth: '420px',
    display: isMobile ? 'flex' : 'none',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: '14px',
    borderRadius: '22px',
    background: 'rgba(8,18,24,0.88)',
    backdropFilter: 'blur(18px)',
    border: '1px solid rgba(0,255,200,0.14)',
    zIndex: 500,
    boxShadow: `
      0 10px 35px rgba(0,0,0,0.45),
      0 0 25px rgba(0,255,200,0.08)
    `,
    boxSizing: 'border-box'
  },

  /* =========================
     MODAL
  ========================= */
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(2, 8, 12, 0.82)',
    backdropFilter: 'blur(12px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: isMobile ? '14px' : '22px',
    boxSizing: 'border-box'
  },

  /* =========================
     RESPONSIVE NEON CIRCLE
  ========================= */
  neonCircle: {
    width: isMobile ? '140px' : '180px',
    height: isMobile ? '140px' : '180px',
    borderRadius: '50%',
    border: '2px solid rgba(0,255,200,0.14)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto',
    boxShadow: `
      0 0 30px rgba(0,255,200,0.15),
      inset 0 0 24px rgba(0,255,200,0.08)
    `,
    background: 'radial-gradient(circle, rgba(0,255,200,0.06), transparent)',
    boxSizing: 'border-box'
  }
};


 // ============================================================
// FIXES APPLIED:
// 1. handleAuth now uses authResponse.data.user directly —
//    no more polling loop / getActiveUser() race condition.
// 2. initializePortal is guarded with a flag so it doesn't
//    double-fetch when onAuthStateChange also fires on mount.
// 3. fetchLiveAnalytics sets analytics to zero when no business
//    profile exists yet, instead of silently returning.
// 4. handleSave uses the user already in state first,
//    only falling back to getActiveUser() if state is empty.
// 5. NOTE (schema): Ensure owner_id has a UNIQUE CONSTRAINT
//    in your Supabase business_settings table for upsert to work.
// ============================================================

// --- NEW STATE HOOKS REQUIRED AT TOP OF COMPONENT ---
// const [user, setUser] = useState(null);
// const [isCheckingSession, setIsCheckingSession] = useState(true);


async function getActiveUser() {
  try {
    const {
      data: { session },
      error
    } = await supabase.auth.getSession();

    if (error) {
      console.error("Session retrieval failed:", error.message);
      return null;
    }

    return session?.user || null;
  } catch (err) {
    console.error("Auth session crash:", err.message);
    return null;
  }
}

async function fetchLiveAnalytics(userId) {
  try {
    if (!userId) {
      console.warn("Analytics blocked: No authenticated user.");
      return;
    }

    // 1. Fetch the lightweight business ID link
    const { data: biz, error: bizError } = await supabase
      .from('business_settings')
      .select('id')
      .eq('owner_id', userId)
      .maybeSingle();

    if (bizError) throw bizError;

    if (!biz?.id) {
      console.warn("No business profile found — resetting analytics to zero.");
      setTxCount(0);
      setTxVolume(0);
      setGraphData(Array.from({ length: 28 }).map(() => 0));
      return;
    }

    // 2. Execute server-side aggregation matrix via RPC
    const { data: analytics, error: rpcError } = await supabase
      .rpc('get_merchant_analytics', { target_business_id: biz.id });

    if (rpcError) throw rpcError;

    if (analytics && analytics.length > 0) {
      const stats = analytics[0];
      const count = Number(stats.total_count) || 0;
      const volume = Number(stats.total_volume) || 0;
      const rawPoints = stats.graph_points || [];

      setTxCount(count);
      setTxVolume(volume);

      // 3. Scale and clean the graph points array securely for your layout viewport
      if (rawPoints.length > 0) {
        // Reverse because SQL gathered them via DESC order for the LIMIT constraint
        const chronologicalPoints = [...rawPoints].reverse();
        const maxTx = Math.max(...chronologicalPoints.map(v => Number(v) || 1), 1);

        const historicalPrices = chronologicalPoints.map(val => {
          const rawAmount = Number(val) || 0;
          return Math.max(15, Math.min(90, (rawAmount / maxTx) * 90));
        });

        // Maintain strict 28-point layout bounds padding
        const paddedData = Array(28)
          .fill(0)
          .concat(historicalPrices)
          .slice(-28);

        setGraphData(paddedData);
      } else {
        setGraphData(Array.from({ length: 28 }).map(() => 0));
      }
    } else {
      setTxCount(0);
      setTxVolume(0);
      setGraphData(Array.from({ length: 28 }).map(() => 0));
    }
  } catch (err) {
    console.error("Analytics stream catch handled:", err.message);
  }
}

async function fetchMerchantSettings(userId) {
  if (!userId) return;

  // ─── ABORT CONTROLLER SETUP ───
  // Instantiates native signal with a 10-second timeout threshold
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);

  try {
    // ─── DIAGNOSTIC DRILLDOWN LOGS ───
    console.log("FETCH SETTINGS START");
    console.log("userId:", userId);
    console.log("QUERY START");

    const query = supabase
      .from('business_settings')
      .select('*')
      .eq('owner_id', userId)
      .maybeSingle()
      .abortSignal(controller.signal); // Attaches signal to physically cancel hanging HTTP network request

    const { data, error } = await query;

    console.log("QUERY END");
    console.log("SETTINGS DATA:", data);
    console.log("SETTINGS ERROR:", error);

    if (error) throw error;
    
    if (data) {
      setSettings({
        id: data.id,
        owner_id: data.owner_id,
        business_name: data.business_name || '',
        store_address: data.store_address || '',
        discount_percentage: data.discount_percentage ?? 10,
        webhook_slug: data.webhook_slug || '',
        currency: data.currency || 'ZAR',
        logo_url: data.logo_url || '',
        voucher_expiration_days: data.voucher_expiration_days ?? 30 // Synced database value downstream
      });
    } else {
      setSettings({
        business_name: '',
        store_address: '',
        discount_percentage: 10,
        webhook_slug: '',
        currency: 'ZAR',
        logo_url: '',
        voucher_expiration_days: 30 // Default standard fallback configuration slot
      });
    }
  } catch (error) {
    if (error.name === 'AbortError') {
      console.warn("fetchMerchantSettings query aborted due to 10s timeout threshold.");
    } else {
      console.error("Profile load failure:", error.message);
    }

    // If a timeout or error happens, clear settings to standard defaults so the form still works
    setSettings({
      business_name: '',
      store_address: '',
      discount_percentage: 10,
      webhook_slug: '',
      currency: 'ZAR',
      logo_url: '',
      voucher_expiration_days: 30 // Clear condition alignment sync
    });
  } finally {
    clearTimeout(timeoutId); // Guarantees timer handle is cleared when complete
  }
}

async function checkSubscription(userId) {
  setSubscriptionLoading(true);

  try {
    let { data, error } = await supabase
      .from("subscriptions")
      .select(`
        subscription_status,
        trial_ends_at,
        trial_welcome_seen
      `)
      .eq("user_id", userId)
      .maybeSingle();

    if (error) {
      throw error;
    }

    // ---------------------------------------
    // NO SUBSCRIPTION RECORD FOUND
    // Auto-create 3-Day Trial and welcome user directly
    // ---------------------------------------
    if (!data) {
      const trialEnds = new Date();
      trialEnds.setDate(trialEnds.getDate() + 3);

      const { data: newSub, error: insertError } = await supabase
        .from("subscriptions")
        .upsert({
          user_id: userId,
          subscription_status: "trial",
          trial_ends_at: trialEnds.toISOString(),
          trial_welcome_seen: false
        })
        .select(`
          subscription_status,
          trial_ends_at,
          trial_welcome_seen
        `)
        .single();

      if (insertError) {
        throw insertError;
      }

      data = newSub;
    }

    // ---------------------------------------
    // CALCULATE DATES & EXPIRATION
    // ---------------------------------------
    const now = new Date();
    const expiry = new Date(data.trial_ends_at);
    const msRemaining = expiry.getTime() - now.getTime();

    const daysRemaining = Math.max(
      0,
      Math.ceil(msRemaining / (1000 * 60 * 60 * 24))
    );

    setTrialDaysRemaining(daysRemaining);
    setTrialExpiryDate(expiry);

    const expired = msRemaining <= 0;

    // ---------------------------------------
    // ACTIVE PREMIUM TRIAL WELCOME
    // ---------------------------------------
    if (
      data.subscription_status === "trial" &&
      !expired &&
      !data.trial_welcome_seen
    ) {
      setShowTrialWelcomeModal(true);
    }

    // ---------------------------------------
    // TRIAL EXPIRED
    // ---------------------------------------
    if (
      expired &&
      data.subscription_status !== "active"
    ) {
      setShowSubscriptionModal(true);
    }

  } catch (err) {
    console.error("Subscription check failed:", err);
  } finally {
    setSubscriptionLoading(false);
  }
}

useEffect(() => {
  let isMounted = true;

  // ─── FAILSAFE SAFETY TIMEOUT ───
  // Guarantees the loading gate MUST drop after 4 seconds maximum, no matter what happens.
  const loadingFailsafe = setTimeout(() => {
    if (isMounted) {
      console.warn("Session check exceeded safety threshold — forcing workspace entry.");
      setIsCheckingSession(false);
    }
  }, 4000);

  // ─── 1. BOOTSTRAP INITIAL SESSION ───
  async function bootstrapSession() {
    try {
      setIsCheckingSession(true);
      const {
        data: { session }
      } = await supabase.auth.getSession();

      if (session?.user && isMounted) {
        setUser(session.user);
      }
    } catch (err) {
      console.error("Critical bootstrap session failure:", err);
    } finally {
      if (isMounted) {
        setIsCheckingSession(false);
        clearTimeout(loadingFailsafe); // Clear timer if session resolves quickly
      }
    }
  }

  bootstrapSession();

  // Clean up email confirmation redirection hash parameters from the URL
  const hash = window.location.hash;
  if (hash && (hash.includes('access_token=') || hash.includes('type=signup'))) {
    window.history.replaceState(null, null, window.location.pathname);
  }

  // Temporary connectivity diagnostics check
  async function checkSupabaseReachability() {
    try {
      const { data, error } = await supabase.from('business_settings').select('count');
      console.log('Supabase reachability check:', data, error);
    } catch (e) {
      console.error('Reachability network check failed:', e);
    }
  }
  checkSupabaseReachability();

  // Unified Single-Source Auth Listener Engine
  const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
    if (!isMounted) return;

    console.log(`Supabase Auth Event Triggered: [${event}]`);

    try {
      if (session?.user) {
        setUser(session.user);

        // Check subscription status (Triggers Trial / Expiry Modals)
        await checkSubscription(session.user.id);

        // Show admin panel immediately & stream data in background
        setIsCheckingSession(false);
        clearTimeout(loadingFailsafe);

        fetchMerchantSettings(session.user.id).catch(err =>
          console.error("Asynchronous settings load background failure:", err)
        );

        fetchLiveAnalytics(session.user.id).catch(err =>
          console.error("Asynchronous analytics load background failure:", err)
        );

      } else {
        // Teardown when signed out
        setUser(null);
        setSettings({
          business_name: '',
          store_address: '',
          discount_percentage: 10,
          webhook_slug: '',
          currency: 'ZAR',
          logo_url: '',
          voucher_expiration_days: 30
        });
        setTxCount(0);
        setTxVolume(0);
        setGraphData(Array.from({ length: 28 }).map(() => 0));
        setIsCheckingSession(false);
        clearTimeout(loadingFailsafe);
      }
    } catch (err) {
      console.error("Auth state mutation engine caught failure:", err);
      if (isMounted) {
        setIsCheckingSession(false);
        clearTimeout(loadingFailsafe);
      }
    }
  });

  return () => {
    isMounted = false;
    clearTimeout(loadingFailsafe);
    subscription.unsubscribe();
  };
}, []);

return (
    <div style={styles.container}>
      {/* Sidebar + Main Grid Content */}
      <div style={{ display: 'flex', gap: '20px', width: '100%', alignItems: 'flex-start' }}>
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        
        <div style={{ flex: 1, width: '100%' }}>
          {/* Dashboard grid cards go here */}
        </div>
      </div>

      {/* FULL ADMIN PANEL GEMINI-STYLE PROMPT CHAT */}
      <AdminPromptChat appState={{ settings, txCount, txVolume, user, trialDaysRemaining }} />
    </div>
  );
}

async function handleAuth(type, event = null) {
  if (event && typeof event.preventDefault === 'function') {
    event.preventDefault();
  }

  if (!email || !password) {
    alert("Please fill in all authorization fields.");
    return;
  }

  if (isAuthSyncing) return;

  setIsAuthSyncing(true);

  try {
    if (type === 'login') {
      // ==========================================
      // 1. THE LOGIN PATH (Unchanged flow)
      // ==========================================
      const authResponse = await supabase.auth.signInWithPassword({ email, password });

      if (authResponse.error) {
        alert(authResponse.error.message);
        return;
      }

      const activeUser = authResponse.data?.user;

      if (!activeUser?.id) {
        alert("Authentication succeeded, but session is still initializing. Please wait a moment.");
        return;
      }

      await checkSubscription(activeUser.id);
      console.log("Authenticated User:", activeUser.id);

    } else {
      // ==========================================
      // 2. THE REGISTER PATH (Clean Separation)
      // ==========================================
      const authResponse = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          // Redirects the user right back to the site origin upon verification confirmation
          emailRedirectTo: `${window.location.origin}/admin`
        }
      });

      if (authResponse.error) {
    alert(authResponse.error.message);
    return;
      }

setSignupSuccessMessage(
    "Sign up request successful. Check your email to verify your account."
);

setEmail("");
setPassword("");
    }

  } catch (err) {
    console.error("Authentication crash:", err);
    alert(err.message || "Authentication failed.");
  } finally {
    setIsAuthSyncing(false);
  }
}

async function uploadBusinessLogo(file, webhookSlug) {
  try {
    console.log('--- uploadBusinessLogo fired ---');
    const fileExtension = file.name.split('.').pop();
    const fileName = `public/${webhookSlug}_${Date.now()}.${fileExtension}`;

    const { data: bucketTest, error: bucketError } = await supabase.storage.from('logos').list();
    const { data: storageData, error: storageError } = await supabase
      .storage
      .from('logos')
      .upload(fileName, file, { upsert: true });

    if (storageError) throw storageError;

    const { data: publicUrlData } = supabase
      .storage
      .from('logos')
      .getPublicUrl(storageData.path);

    const permanentUrl = publicUrlData.publicUrl;

    // Database write successfully removed from here to eliminate the race condition.
    return permanentUrl;
  } catch (error) {
    console.error('uploadBusinessLogo caught error:', error.message);
    return null;
  }


async function handleSave(e) {
  if (e && typeof e.preventDefault === 'function') {
    e.preventDefault();
  }

  if (isSaveSyncing) return;
  setIsSaveSyncing(true);

  try {
    const activeUser = user || await getActiveUser();

    if (!activeUser?.id) {
      alert("Sync Blocked: Active authentication session required.");
      return;
    }

    const cleanBusinessName = settings?.business_name?.trim() || '';
    const cleanWebhookSlug = settings?.webhook_slug?.trim() || '';

    if (!cleanBusinessName || !cleanWebhookSlug) {
      alert("Validation Failed: Required parameter fields cannot be left blank.");
      return;
    }

    let resolvedLogoUrl = settings?.logo_url || '';

    if (resolvedLogoUrl.startsWith('blob:') && pendingLogoFile) {
      const uploadedUrl = await uploadBusinessLogo(pendingLogoFile, cleanWebhookSlug);
      if (uploadedUrl) {
        resolvedLogoUrl = uploadedUrl;
        setPendingLogoFile(null);
      } else {
        resolvedLogoUrl = settings?.logo_url?.startsWith('blob:') ? '' : (settings?.logo_url || '');
      }
    }

    const payload = {
      owner_id: activeUser.id,
      business_name: cleanBusinessName,
      store_address: settings?.store_address?.trim() || '',
      discount_percentage: Number(settings?.discount_percentage ?? 10),
      webhook_slug: cleanWebhookSlug,
      currency: settings?.currency || 'ZAR',
      logo_url: resolvedLogoUrl,
      voucher_expiration_days: Number(settings?.voucher_expiration_days ?? 30) // Appended database column value to save payload
    };

    if (settings?.id) {
      payload.id = settings.id;
    }

    // ─── ATOMIC UPSERT INTEGRATION ───
    // This saves all changes simultaneously, writing the fresh logo_url alongside everything else safely
    const { data, error } = await supabase
      .from('business_settings')
      .upsert(payload, { onConflict: 'owner_id' })
      .select();

    if (error) throw error;
    alert('Live Agent Settings Synced Successfully!');

    if (data && data[0]) {
      setSettings(data[0]);
    }
  } catch (error) {
    console.error("Profile synchronization failed:", error);
    alert('Error syncing live profile: ' + (error.message || 'Unknown error'));
  } finally {
    setIsSaveSyncing(false);
  }
}

const SAFE_CURRENCY_OPTIONS = typeof CURRENCY_OPTIONS !== 'undefined' ? CURRENCY_OPTIONS : [
  { code: 'ZAR', symbol: 'R' },
  { code: 'USD', symbol: '$' },
  { code: 'EUR', symbol: '€' },
  { code: 'GBP', symbol: '£' }
];

const activeCurrencySymbol =
  SAFE_CURRENCY_OPTIONS.find(
    c => c.code === (settings?.currency || 'ZAR')
  )?.symbol || 'R';

  
// --- CRITICAL PERSISTENT GATE CONDITIONAL RENDER ---
if (isCheckingSession) {
  return (
    <div style={{
      ...styles.container,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      backgroundColor: '#0a0a0a',
      color: '#ffffff',
      fontFamily: 'monospace',
      fontSize: '13px',
      letterSpacing: '1px'
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ marginBottom: '12px', fontSize: '24px', animation: 'pulse 1.5s infinite' }}>⚡</div>
        SYNCHRONIZING SECURE NODE IDENTITY...
      </div>
    </div>
  );
}

  return (
    <div style={{ ...styles.container, opacity: isAuthSyncing ? 0.6 : 1 }}>

{/* GLOBAL MODAL 3: Premium Payment Negotiation */}
{showSubscriptionModal && (
  <div
    style={{
      ...styles.modalOverlay,
      background:
        "radial-gradient(circle at top, rgba(0,255,170,0.08), rgba(0,0,0,0.94) 45%, #000000 100%)",
      backdropFilter: "blur(12px)",
    }}
  >
    <div
      style={{
        ...styles.flatCard,
        maxWidth: "460px",
        width: "90%",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
        border: "1px solid rgba(0,255,170,0.25)",
        borderRadius: "24px",
        background:
          "linear-gradient(145deg, #050505 0%, #071822 55%, #02110d 100%)",
        boxShadow:
          "0 0 20px rgba(0,255,170,0.18), 0 0 45px rgba(0,198,255,0.12)",
      }}
    >
      {/* Neon Background Glow */}
      <div
        style={{
          position: "absolute",
          top: "-90px",
          left: "50%",
          transform: "translateX(-50%)",
          width: "260px",
          height: "260px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(0,255,170,0.28) 0%, rgba(0,198,255,0.12) 45%, transparent 75%)",
          filter: "blur(30px)",
          pointerEvents: "none",
        }}
      />

      {/* Lock Icon */}
      <div
        style={{
          width: "82px",
          height: "82px",
          margin: "0 auto 22px",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "40px",
          background:
            "linear-gradient(135deg, #00F5A0, #00C6FF)",
          boxShadow:
            "0 0 20px rgba(0,255,170,0.45), 0 0 45px rgba(0,198,255,0.35)",
        }}
      >
        🔒
      </div>

      <div
        style={{
          color: "#00F5A0",
          fontSize: "12px",
          fontWeight: 700,
          letterSpacing: "3px",
          marginBottom: "12px",
        }}
      >
        PREMIUM MEMBERSHIP REQUIRED
      </div>

      <h2
        style={{
          color: "#ffffff",
          marginBottom: "14px",
          fontSize: "28px",
          fontWeight: 700,
          textShadow: "0 0 12px rgba(0,198,255,0.35)",
        }}
      >
        Your Free Trial Has Expired
      </h2>

      <p
        style={{
          color: "#b9c7cf",
          fontSize: "15px",
          lineHeight: "1.8",
          marginBottom: "28px",
        }}
      >
        To continue using <strong style={{ color: "#00F5A0" }}>RuachAgent</strong>
        {" "}Premium features and maintain uninterrupted access to your merchant
        dashboard, please upgrade your subscription.
      </p>

      {/* Plan Details Card */}
      <div
        style={{
          background:
            "linear-gradient(145deg, rgba(0,198,255,0.08), rgba(0,255,170,0.06))",
          borderRadius: "18px",
          padding: "22px",
          marginBottom: "28px",
          border: "1px solid rgba(0,255,170,0.25)",
          boxShadow:
            "0 0 20px rgba(0,198,255,0.08)",
        }}
      >
        <div
          style={{
            color: "#ffffff",
            fontWeight: "700",
            fontSize: "18px",
            marginBottom: "8px",
          }}
        >
          Merchant Pro Plan
        </div>

        <div
          style={{
            color: "#00F5A0",
            fontSize: "34px",
            fontWeight: "800",
            textShadow: "0 0 15px rgba(0,255,170,.45)",
          }}
        >
          $6.99 [R129.00]
          <span
            style={{
              fontSize: "14px",
              color: "#9ca3af",
              fontWeight: "500",
            }}
          >
            {" "}
            / month
          </span>
        </div>

        <div
          style={{
            marginTop: "14px",
            color: "#8fdcff",
            fontSize: "13px",
          }}
        >
          ✓ Unlimited premium access
          <br />
          ✓ Merchant dashboard
          <br />
          ✓ Future premium updates included
        </div>
      </div>

      <button
        onClick={() => {
          if (!window.PaystackPop) {
            alert("Paystack SDK failed to load. Please check your network connection.");
            return;
          }

          const handler = window.PaystackPop.setup({
            key: process.env.REACT_APP_PAYSTACK_PUBLIC_KEY || "pk_live_870272ce5b082f6522a2f9d130c368284664c7f4",
            email: user?.email,
            amount: 12900,
            currency: "ZAR",
            ref: "RUACH_" + Math.floor(Math.random() * 1000000000 + 1),
            metadata: {
              custom_fields: [
                {
                  display_name: "User ID",
                  variable_name: "user_id",
                  value: user?.id,
                },
                {
                  display_name: "Plan",
                  variable_name: "plan_type",
                  value: "pro_monthly",
                },
              ],
              user_id: user?.id,
              plan_type: "pro_monthly",
            },
            onClose: () => {
              console.log("Paystack modal closed by user.");
            },
            callback: async (response) => {
              console.log("Paystack Payment Successful, Reference:", response.reference);
              alert("Payment successful! Updating your workspace access...");

              setTimeout(async () => {
                await checkSubscription(user.id);
                setShowSubscriptionModal(false);
              }, 2000);
            },
          });

          handler.openIframe();
        }}
        style={{
          ...styles.button,
          width: "100%",
          padding: "16px",
          fontSize: "16px",
          fontWeight: "700",
          border: "none",
          borderRadius: "14px",
          cursor: "pointer",
          color: "#ffffff",
          background:
            "linear-gradient(90deg, #00F5A0 0%, #00C6FF 100%)",
          boxShadow:
            "0 0 18px rgba(0,255,170,0.35), 0 0 30px rgba(0,198,255,0.25)",
          transition: "all .25s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-2px)";
          e.currentTarget.style.boxShadow =
            "0 0 28px rgba(0,255,170,.55),0 0 45px rgba(0,198,255,.4)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow =
            "0 0 18px rgba(0,255,170,.35),0 0 30px rgba(0,198,255,.25)";
        }}
      >
        Upgrade Now with Paystack →
      </button>
    </div>
  </div>
)}

     {/* GLOBAL MODAL 2: 3-DAY PREMIUM TRIAL WELCOME */}
{showTrialWelcomeModal && (
  <div
    style={{
      ...styles.modalOverlay,
      background:
        "radial-gradient(circle at top, rgba(0,255,170,0.08), rgba(0,0,0,0.94) 45%, #000000 100%)",
      backdropFilter: "blur(12px)"
    }}
  >
    <div
      style={{
        ...styles.flatCard,
        maxWidth: "460px",
        width: "90%",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
        border: "1px solid rgba(0,255,170,0.25)",
        borderRadius: "24px",
        background:
          "linear-gradient(145deg, #050505 0%, #071822 55%, #02110d 100%)",
        boxShadow:
          "0 0 20px rgba(0,255,170,0.18), 0 0 45px rgba(0,180,255,0.12)"
      }}
    >
      {/* Decorative Glow */}
      <div
        style={{
          position: "absolute",
          top: "-90px",
          left: "50%",
          transform: "translateX(-50%)",
          width: "260px",
          height: "260px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(0,255,170,0.28) 0%, rgba(0,180,255,0.12) 45%, transparent 75%)",
          filter: "blur(30px)",
          pointerEvents: "none"
        }}
      />

      {/* Neon Badge */}
      <div
        style={{
          width: "82px",
          height: "82px",
          margin: "0 auto 22px",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "42px",
          background:
            "linear-gradient(135deg, #00F5A0, #00C6FF)",
          boxShadow:
            "0 0 20px rgba(0,255,170,0.45), 0 0 45px rgba(0,198,255,0.35)"
        }}
      >
        🎉
      </div>

      <div
        style={{
          color: "#00F5A0",
          fontSize: "12px",
          letterSpacing: "3px",
          fontWeight: 700,
          marginBottom: "12px"
        }}
      >
        PREMIUM ACCESS ACTIVATED
      </div>

      <h2
        style={{
          color: "#ffffff",
          marginBottom: "16px",
          fontSize: "30px",
          fontWeight: 700,
          textShadow: "0 0 12px rgba(0,198,255,0.35)"
        }}
      >
        Welcome to Your Premium Trial
      </h2>

      <p
        style={{
          color: "#b9c7cf",
          lineHeight: "1.9",
          marginBottom: "28px",
          fontSize: "15px"
        }}
      >
        Your email has been successfully verified and your merchant
        workspace is now online.
        <br />
        <br />
        You now have unrestricted access to every Premium feature for the
        next
        <strong
          style={{
            color: "#00F5A0",
            textShadow: "0 0 10px rgba(0,255,170,0.55)"
          }}
        >
          {" "}
          {trialDaysRemaining} day
          {trialDaysRemaining !== 1 ? "s" : ""}
        </strong>
        .
      </p>

      <button
        onClick={async () => {
          if (user?.id) {
            await supabase
              .from("subscriptions")
              .update({
                trial_welcome_seen: true
              })
              .eq("user_id", user.id);
          }

          setShowTrialWelcomeModal(false);
        }}
        style={{
          ...styles.button,
          width: "100%",
          padding: "16px",
          fontSize: "16px",
          fontWeight: 700,
          border: "none",
          borderRadius: "14px",
          cursor: "pointer",
          color: "#ffffff",
          background:
            "linear-gradient(90deg, #00F5A0 0%, #00C6FF 100%)",
          boxShadow:
            "0 0 18px rgba(0,255,170,0.35), 0 0 30px rgba(0,198,255,0.25)",
          transition: "all .25s ease"
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-2px)";
          e.currentTarget.style.boxShadow =
            "0 0 28px rgba(0,255,170,.55),0 0 45px rgba(0,198,255,.4)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow =
            "0 0 18px rgba(0,255,170,.35),0 0 30px rgba(0,198,255,.25)";
        }}
      >
        Enter Workspace →
      </button>
    </div>
  </div>
)}
      
      {/* GLOBAL MODAL 1: EMAIL CONFIRMED SUCCESS POP-UP */}

      <header style={{ 
        ...styles.header, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        gap: '12px'
      }}>
        
        {/* Logo + badge — only visible when user is logged in */}
        {user && (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: "12px",
      flexShrink: 0,
    }}
  >
    <img
  src="/RuachAgentLogo.png"
      alt="RuachAgent"
      style={{
        height: "72px",
        width: "auto",
        objectFit: "contain",
        filter: `
          drop-shadow(0 0 4px rgba(8,227,216,.85))
          drop-shadow(0 0 10px rgba(8,227,216,.45))
          drop-shadow(0 0 20px rgba(8,227,216,.20))
        `,
        userSelect: "none",
        pointerEvents: "none"
      }}
    />
  </div>
)}

        {/* User email + disconnect — pushed to the far right */}
        {user && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginLeft: 'auto' }}>
            <span style={{ fontSize: '12px', color: '#737373', fontFamily: 'monospace' }}>{user.email}</span>
            <button 
              onClick={() => supabase.auth.signOut()} 
              style={{ 
                background: 'transparent', 
                border: '1px solid #262626', 
                color: '#ef4444', 
                padding: '6px 12px', 
                borderRadius: '6px', 
                fontSize: '11px', 
                fontWeight: '500', 
                cursor: 'pointer',
                transition: 'border-color 0.15s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = '#ef4444'}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = '#152d38'}
            >
              Disconnect
            </button>
          </div>
        )}
      </header>

      <input style={{ display: 'none' }} type="password" autoComplete="on" />

      <main style={{ padding: '24px 12px', maxWidth: '1500px', margin: '0 auto' }}>
        {!user ? (
          <section style={{ maxWidth: '360px', margin: '60px auto 0 auto' }}>
            <div style={styles.flatCard}>
              <h2 style={{ textAlign: 'center', fontSize: '18px', fontWeight: '500', margin: '0 0 24px 0', color: '#ffffff', letterSpacing: '0.3px' }}>Master Portal Login</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {signupSuccessMessage && (
    <div
        style={{
            background: "#06281d",
            color: "#00FFD5",
            border: "1px solid rgba(0,255,210,.25)",
            padding: "12px",
            borderRadius: "10px",
            marginBottom: "16px",
            textAlign: "center",
            fontSize: "13px"
        }}
    >
        ✅ {signupSuccessMessage}
    </div>
)}
                <input type="email" placeholder="Merchant Email" value={email} onChange={e => setEmail(e.target.value)} style={styles.input} />
                <input type="password" placeholder="Access Password" value={password} onChange={e => setPassword(e.target.value)} style={styles.input} />
                <button onClick={() => handleAuth('login')} style={styles.button} disabled={isAuthSyncing}>
                  {isAuthSyncing ? 'Verifying Node...' : 'Login'}
                </button>
                <button 
                  onClick={() => handleAuth('register')} 
                  style={{ 
                    ...styles.button, 
                    background: 'transparent', 
                    color: '#a3a3a3', 
                    border: '1px solid #262626',
                    marginTop: '4px'
                  }} 
                  disabled={isAuthSyncing}
                >
                  Sign Up
                </button>
              </div>
            </div>
          </section>

        ) : (
          <section style={styles.dashboardGrid}>
  {/* COLUMN 1: AGENT PARAMETERS CONTROL BLOCK */}
  <div style={{ ...styles.flatCard, width: '100%', padding: isDesktop ? '12px' : '18px' }}>
    <h3 style={{ margin: '0 0 12px 0', fontSize: '11px', fontWeight: '600', color: '#ffffff', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
      Agent Parameters
    </h3>              
    {/* Block 1 CORNER LIGHT */}
    <div style={{
      position: 'absolute',
      top: '-80px',
      left: '-80px',
      width: '180px',
      height: '180px',
      background: 'radial-gradient(circle, rgba(0,255,200,0.08), transparent 70%)',
      borderRadius: '50%'
    }} />

    {/* Reduced internal gap from 20px to 12px */}
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {/* BRAND LOGO */}
      <div>
        <label htmlFor="logo-upload" style={{ fontSize: '9px', color: '#737373', fontWeight: '500', display: 'block', marginBottom: '6px', letterSpacing: '0.5px' }}>
          BUSINESS BRAND LOGO (PICTURE PRINT)
        </label>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <label htmlFor="logo-upload" style={{ ...styles.button, display: 'inline-block', padding: '8px 12px', fontSize: '11px', background: 'transparent', border: '1px solid #067962db', color: '#ffffff', cursor: 'pointer', textAlign: 'center', flex: 1, boxShadow: 'none', textTransform: 'none' }}>
            Choose Image File
            <input
              id="logo-upload"
              name="logo_url"
              type="file"
              accept="image/*"
              autoComplete="off"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  const localUrl = URL.createObjectURL(file);
                  setSettings(prev => ({ ...prev, logo_url: localUrl }));
                  setPendingLogoFile(file);
                }
              }}
              style={{ display: 'none' }}
            />
          </label>
          <div style={{ ...styles.concaveCard, padding: '2px', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', borderRadius: '4px' }}>
            {settings?.logo_url ? (
              <img src={settings.logo_url} alt="Logo Mirror" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '3px' }} />
            ) : (
              <span style={{ fontSize: '12px', color: '#404040' }}>🖼️</span>
            )}
          </div>
        </div>
      </div>
 
      {/* LIVE WEBHOOK SLUG */}
      <div>
        <label htmlFor="webhook-slug" style={{ fontSize: '9px', color: '#737373', fontWeight: '500', display: 'block', marginBottom: '6px', letterSpacing: '0.5px' }}>
          LIVE WEBHOOK SLUG
        </label>
        <input
          id="webhook-slug"
          name="webhook_slug"
          type="text"
          autoComplete="off"
          placeholder="e.g., eddienetwork"
          value={settings?.webhook_slug || ''}
          onChange={(e) => {
            const cleanValue = e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, '');
            setSettings(prev => ({ ...prev, webhook_slug: cleanValue }));
          }}
          style={{ ...styles.input, padding: '10px 12px', fontSize: '11px', fontFamily: 'monospace', letterSpacing: '0.5px' }}
        />
      </div>

      {/* DYNAMIC CURRENCY SELECT SYSTEM */}
      <div>
        <label htmlFor="currency" style={{ fontSize: '9px', color: '#737373', fontWeight: '500', display: 'block', marginBottom: '6px', letterSpacing: '0.5px' }}>
          OPERATIONAL CURRENCY
        </label>
        <div style={{ position: 'relative' }}>
          <select
            id="currency"
            name="currency"
            value={settings?.currency || 'ZAR'}
            onChange={(e) => {
              const val = e.target.value;
              setSettings(prev => ({ ...prev, currency: val }));
            }}
            style={{ ...styles.input, padding: '10px 30px 10px 12px', fontSize: '11px', fontFamily: 'monospace', letterSpacing: '0.5px', appearance: 'none', cursor: 'pointer' }}
          >
            {CURRENCY_OPTIONS.map((curr) => (
              <option key={curr.code} value={curr.code} style={{ background: '#0b1118', color: '#ffffff', fontFamily: 'monospace' }}>
                {curr.name} ({curr.symbol})
              </option>
            ))}
          </select>
          <span style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', fontSize: '9px', color: '#737373', pointerEvents: 'none', fontFamily: 'monospace' }}>▼</span>
        </div>
      </div>

      {/* BUSINESS BRAND NAME */}
      <div>
        <label htmlFor="business-name" style={{ fontSize: '9px', color: '#737373', fontWeight: '500', display: 'block', marginBottom: '6px', letterSpacing: '0.5px' }}>
          BUSINESS BRAND NAME
        </label>
        <input
          id="business-name"
          name="business_name"
          type="text"
          autoComplete="organization"
          value={settings?.business_name || ''}
          onChange={(e) => {
            const val = e.target.value;
            setSettings(prev => ({ ...prev, business_name: val }));
          }}
          style={{ ...styles.input, padding: '10px 12px', fontSize: '11px', fontFamily: 'monospace', letterSpacing: '0.5px' }}
        />
      </div>

      {/* PHYSICAL OUTLET ADDRESS */}
      <div>
        <label htmlFor="store-address" style={{ fontSize: '9px', color: '#737373', fontWeight: '500', display: 'block', marginBottom: '6px', letterSpacing: '0.5px' }}>
          PHYSICAL OUTLET ADDRESS
        </label>
        <textarea
          id="store-address"
          name="store_address"
          autoComplete="street-address"
          value={settings?.store_address || ''}
          onChange={(e) => {
            const val = e.target.value;
            setSettings(prev => ({ ...prev, store_address: val }));
          }}
          style={{ ...styles.input, padding: '10px 12px', minHeight: '52px', resize: 'none', fontSize: '11px', fontFamily: 'monospace', letterSpacing: '0.5px', lineHeight: '1.5' }}
        />
      </div>

      {/* AI DISCOUNT COMPILER VALUE (%) */}
      <div>
        <label htmlFor="discount-percentage" style={{ fontSize: '9px', color: '#737373', fontWeight: '500', display: 'block', marginBottom: '6px', letterSpacing: '0.5px' }}>
          AI DISCOUNT COMPILER VALUE (%)
        </label>
        <input
          id="discount-percentage"
          name="discount_percentage"
          type="number"
          autoComplete="off"
          value={settings?.discount_percentage ?? 10}
          onChange={(e) => {
            const val = parseInt(e.target.value) || 0;
            setSettings(prev => ({ ...prev, discount_percentage: val }));
          }}
          style={{ ...styles.input, padding: '10px 12px', fontSize: '11px', fontFamily: 'monospace', letterSpacing: '0.5px' }}
        />
      </div>

      {/* VOUCHER EXPIRATION POLICY (DAYS) */}
<div>
  <label htmlFor="voucher-expiry-days" style={{ fontSize: '9px', color: '#737373', fontWeight: '500', display: 'block', marginBottom: '6px', letterSpacing: '0.5px' }}>
    VOUCHER EXPIRATION POLICY (DAYS)
  </label>
  <input
    id="voucher-expiry-days"
    name="voucher_expiration_days" // Linked to DB column name
    type="number"
    autoComplete="off"
    placeholder="e.g., 30"
    min="1"
    value={settings?.voucher_expiration_days ?? 30} // Reading right key with fallback to 30 matching your DB default
    onChange={(e) => {
      const val = parseInt(e.target.value) || 0;
      setSettings(prev => ({ ...prev, voucher_expiration_days: val })); // Syncing right key to state
    }}
    style={{ ...styles.input, padding: '10px 12px', fontSize: '11px', fontFamily: 'monospace', letterSpacing: '0.5px' }}
  />
</div>

      {/* TRIGGER LIVE HANDSHAKE SYNC */}
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (!isSaveSyncing) handleSave(e);
        }}
        style={{
          ...styles.button,
          background: isSaveSyncing ? '#111827' : styles.button.background,
          color: isSaveSyncing ? '#6b7280' : '#041014',
          border: isSaveSyncing ? '1px solid rgba(255,255,255,0.05)' : 'none',
          boxShadow: isSaveSyncing ? 'none' : styles.button.boxShadow,
          marginTop: '6px',
          padding: '11px 14px',
          fontSize: '12px',
          letterSpacing: '0.5px',
          textTransform: 'uppercase',
          cursor: isSaveSyncing ? 'not-allowed' : 'pointer'
        }}
        disabled={isSaveSyncing}
      >
        {isSaveSyncing ? 'Syncing Profile...' : 'Save & Sync Live Profile'}
      </button>
    </div>
  </div>

            {/* COLUMN 2: ANALYTICS & HUB BLOCK */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: isDesktop ? '1 1 0%' : '1 1 100%', width: '100%' }}>
             {/* PERFORMANCE NODE ANALYTICS: INBOX EMAIL SLIP METRICS */}
<div style={{
  ...styles.flatCard,
  border: '1px solid rgba(16, 185, 129, 0.25)', 
  background: 'linear-gradient(180deg, rgba(8, 18, 24, 0.95), rgba(4, 10, 14, 0.98))',
  boxShadow: '0 0 35px rgba(16, 185, 129, 0.05)', 
  position: 'relative',
  overflow: 'hidden'
}}>

  {/* Block 2 CORNER LIGHT */}
  <div style={{
    position: 'absolute',
    top: '-80px',
    left: '-80px',
    width: '180px',
    height: '180px',
    background: 'radial-gradient(circle, rgba(116, 150, 234, 0.17), transparent 70%)', 
    borderRadius: '50%'
  }} />

  {/* NEW FLAT GRID FOCUSING ON INBOX VOLUMES & PARSING SUCCESS METRICS */}
<div
  style={{
    ...styles.analyticsSubGrid,
    gap: '14px',
    marginTop: '6px'
  }}
>
  {/* INBOXES SYNCHRONIZED */}
  <div
    style={{
      ...styles.concaveCard,
      padding: '18px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      minHeight: '90px',
      border: '1px solid rgba(16,185,129,0.08)',
      background:
        'linear-gradient(145deg, rgba(16,185,129,0.04), rgba(255,255,255,0.01))',
      position: 'relative',
      overflow: 'hidden'
    }}
  >
    <div
      style={{
        position: 'absolute',
        top: '-20px',
        right: '-20px',
        width: '70px',
        height: '70px',
        borderRadius: '50%',
        background: 'rgba(16,185,129,0.05)'
      }}
    />

    <div
      style={{
        fontSize: '9px',
        color: '#8a99ad',
        fontWeight: '700',
        letterSpacing: '1px',
        textTransform: 'uppercase'
      }}
    >
      Inboxes Synchronized
    </div>

    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: '8px'
      }}
    >
      <div
        style={{
          fontSize: '12px',
          fontWeight: '900',
          color: '#ffffff',
          fontFamily: 'monospace',
          lineHeight: '1'
        }}
      >
        {typeof activeInboxesCount !== 'undefined'
          ? activeInboxesCount
          : 0}
      </div>

      <div
        style={{
          padding: '4px 8px',
          borderRadius: '999px',
          background: 'rgba(16,185,129,0.12)',
          color: '#10b981',
          fontSize: '5px',
          fontWeight: '700',
          letterSpacing: '0.4px'
        }}
      >
        ACTIVE
      </div>
    </div>
  </div>

  {/* PARSED SLIPS */}
  <div
    style={{
      ...styles.concaveCard,
      padding: '18px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      minHeight: '90px',
      border: '1px solid rgba(59,130,246,0.08)',
      background:
        'linear-gradient(145deg, rgba(59,130,246,0.04), rgba(255,255,255,0.01))',
      position: 'relative',
      overflow: 'hidden'
    }}
  >
    <div
      style={{
        position: 'absolute',
        top: '-20px',
        right: '-20px',
        width: '70px',
        height: '70px',
        borderRadius: '50%',
        background: 'rgba(59,130,246,0.05)'
      }}
    />

    <div
      style={{
        fontSize: '9px',
        color: '#8a99ad',
        fontWeight: '700',
        letterSpacing: '1px',
        textTransform: 'uppercase'
      }}
    >
      Parsed Slips Volume
    </div>

    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: '8px'
      }}
    >
      <div
        style={{
          fontSize: '12px',
          fontWeight: '900',
          color: '#3b82f6',
          fontFamily: 'monospace',
          lineHeight: '1'
        }}
      >
        {(typeof totalParsedCount !== 'undefined'
          ? totalParsedCount
          : 0).toLocaleString()}
      </div>

      <div
        style={{
          padding: '4px 8px',
          borderRadius: '999px',
          background: 'rgba(59,130,246,0.12)',
          color: '#60a5fa',
          fontSize: '5px',
          fontWeight: '700',
          letterSpacing: '0.4px'
        }}
      >
        DOCS
      </div>
    </div>
  </div>
</div>

  {/* DATE RANGE PERIOD HISTOGRAM MICRO-GRAPH */}
  <div style={{ marginTop: '24px', marginBottom: '5px' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', fontSize: '9px', fontWeight: '700', color: '#8a99ad', letterSpacing: '0.5px', fontFamily: 'monospace' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <span style={{ color: '#10b981' }}>●</span>
        <span>INBOX SLIP DENSITY OVER TIME PERIOD</span>
      </div>
      <span style={{ color: '#10b981' }}>
        RANGE: {typeof selectedDateRangeLabel !== 'undefined' ? selectedDateRangeLabel : 'PAST_30_DAYS'}
      </span>
    </div>
    
    <div style={{ background: 'rgba(56, 65, 80, 0.61) 30, 37)', height: '65px', borderRadius: '12px', boxShadow: 'inset 3px 3px 6px #000, inset -3px -3px 6px rgba(255,255,255,0.02)', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'flex-end', padding: '0 12px', gap: '5px' }}>
      {(typeof inboxGraphData !== 'undefined' ? inboxGraphData : Array(28).fill(0)).map((heightValue, idx, arr) => {
        const hasData = heightValue > 0;
        const isLatestPeriod = idx === arr.length - 1;
        return (
          <div
            key={idx}
            style={{
              flex: 1,
              height: hasData ? `${Math.min(heightValue, 100)}%` : '2px',
              background: !hasData
                ? 'rgba(61, 84, 118, 0.3)'
                : isLatestPeriod
                  ? 'linear-gradient(to top, #10b981, #6ee7b7)'
                  : 'linear-gradient(to top, rgba(16, 185, 129, 0.05), #10b981)',
              borderTopLeftRadius: '2px',
              borderTopRightRadius: '2px',
              opacity: hasData ? (isLatestPeriod ? 1 : 0.6) : 0.3,
              transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
          ></div>
        );
      })}
      <div style={{ position: 'absolute', width: '100%', height: '1px', background: 'rgba(255,255,255,0.02)', top: '20px', left: 0 }}></div>
      <div style={{ position: 'absolute', width: '100%', height: '1px', background: 'rgba(255,255,255,0.02)', top: '45px', left: 0 }}></div>
    </div>
  </div>
  </div>

              {/* INTEGRATION ENDPOINT TARGET BLOCK */}
              <div style={styles.flatCard}>
                <h3 style={{ margin: '0 0 12px 0', fontSize: '13px', fontWeight: '800' }}>Integration Endpoint Target</h3>
                <div style={{ ...styles.concaveCard, fontFamily: 'monospace', fontSize: '12px', color: '#3b82f6', wordBreak: 'break-all', padding: '15px', marginBottom: '14px' }}>
                  {settings?.webhook_slug ? `https://agadjdvhqguunowplbak.functions.supabase.co/receipt-agent?slug=${settings.webhook_slug}` : 'Define a unique webhook slug first...'}
                </div>
                <div style={{ fontSize: '11px', color: '#8a99ad', lineHeight: '1.5', paddingLeft: '2px', fontFamily: 'system-ui, sans-serif' }}>
                  💡 <span style={{ fontWeight: '600' }}>Deployment Action:</span> Paste this generated webhook link into your <strong style={{ color: '#fff' }}>[Inbound Email Webhook Configuration or POS Webhook Portal]</strong> to begin routing automated transaction slip payloads directly to your AI agent node.
                </div>
              </div>
            </div>


            {/* COLUMN 3: LIVE ENDPOINT & INVOICE MIRROR STACK */}
            <div style={{
              flex: isDesktop ? '1 1 0%' : '1 1 100%',
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}>
              {/* LIVE INBOX EMAIL TILL SLIP MIRROR */}
              <div style={{
                ...styles.flatCard,
                border:'2px solid #08E3D8',
boxShadow:`
0 0 8px rgba(8,227,216,.6),
0 0 22px rgba(8,227,216,.18)
`,
                background: 'linear-gradient(180deg, rgba(8,18,24,0.95), rgba(4,10,14,0.98))',
                boxShadow: '0 0 35px rgba(0,255,200,0.08)',
                position: 'relative',
                overflow: 'hidden'
              }}>

                {/* TOP GLOW EFFECT */}
                <div style={{
                  position: 'absolute',
                  top: '-120px',
                  right: '-120px',
                  width: '240px',
                  height: '240px',
                  borderRadius: '50%',
                  background: 'radial-gradient(circle, rgba(0,255,200,0.18), transparent 70%)',
                  filter: 'blur(10px)',
                  pointerEvents: 'none'
                }} />

                <h3 style={{
                  margin: '0 0 18px 0',
                  fontSize: '12px',
                  fontWeight: '800',
                  color: '#00ffd5',
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  position: 'relative',
                  zIndex: 2
                }}>
                  ⚡ Live Inbox Email Till Slip Mirror
                </h3>

                {/* ADVANCED DIGITAL RECEIPT CONTAINER */}
                <div style={{
                  background: `
                linear-gradient(
                180deg,
              #041116 0%,
              #07181E 45%,
              #041116 100%
                )
                `,
                  backgroundImage: `
                  linear-gradient(rgba(8,227,216,.08) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(8,227,216,.08) 1px, transparent 1px)
                  `,
                  backgroundSize: '24px 24px',
                  /*backgroundSize: '100% 2px, 2px 100%',*/
                  color: '#ffffff',
                  borderRadius: '26px',
                  padding: '9px 7px',
                  boxShadow: `
                  0 0 6px rgba(8,227,216,.75),
                  0 0 16px rgba(8,227,216,.45),
                  0 0 34px rgba(8,227,216,.18),
                  0 25px 60px rgba(0,0,0,.65)
                  `,
                  fontFamily: '"Courier New", monospace',
                  position: 'relative',
                  overflow: 'hidden',
                  border: '2px solid #08E3D8',
                }}>

                  {/* RECEIPT CORNER LIGHT */}
                  <div style={{
                    position: 'absolute',
                    top: '-80px',
                    left: '-80px',
                    width: '30px',
                    height: '30px',
                    background: 'radial-gradient(circle, rgba(0,255,200,0.08), transparent 70%)',
                    borderRadius: '50%'
                  }} />

                  {/* CENTRAL BIG LOGO WATERMARK */}
                  {settings?.logo_url && (
                    <div style={{
                      position: 'absolute',
                      top: '52%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      width: '180px',
                      height: '180px',
                      backgroundImage: `url(${settings.logo_url})`,
                      backgroundSize: 'contain',
                      backgroundPosition: 'center',
                      backgroundRepeat: 'no-repeat',
                      opacity: 0.035,
                      pointerEvents: 'none',
                      zIndex: 1
                    }} />
                  )}

                  {/* RECEIPT CONTENT WRAPPER */}
                  <div style={{ position: 'relative', zIndex: 2 }}>

                    {/* TOP METADATA ROW */}
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      fontSize: '10px',
                      color: '#64748b',
                      marginBottom: '9px'
                    }}>
                      <div style={{
                        padding: '2px 5px',
                        borderRadius: '999px',
                        background: 'rgba(8,227,216,.12)',
                        border: '2px solid #08E3D8',
                        boxShadow: `
                        0 0 6px rgba(8,227,216,.6),
                        inset 0 0 12px rgba(8,227,216,.18)
                        `,
                        color:'#08E3D8',
                        fontWeight: '800',
                        letterSpacing: '0.5px'
                      }}>
                        VERIFIED NODE
                      </div>

                      <div style={{
                        textAlign: 'right',
                        lineHeight: '1.5'
                      }}>
                        <div style={{
                          fontWeight: '900',
                          color: '#c5ccda',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px'
                        }}>
                        
                        </div>

                        <div style={{
  textAlign: 'right',
  lineHeight: '1.5'
}}>
  <div style={{
    fontWeight: '900',
    color: '#c5ccda',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  }}>
    Transaction
  </div>

  {/* FIX: Renders the dynamic real-time date if available, otherwise defaults gracefully */}
  <div>
    {settings?.created_at ? (
      new Date(settings.created_at).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      }).replace(/,/g, '') // Removes commas to match your premium look cleanly
    ) : (
      // Clean fallback using the exact current time if no record row is selected in preview mode
      new Date().toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      }).replace(/,/g, '')
    )}
  </div>
</div>
                      </div>
                    </div>

                    {/* TOP MINI LOGO */}
                    <div style={{
                      textAlign: 'center',
                      marginBottom: '9px'
                    }}>
                      {settings?.logo_url ? (
                        <div style={{
                          display: 'inline-flex',
                          padding: '10px 18px',
                          borderRadius: '18px',
                          background: 'rgba(15, 23, 42, 0.06)',
                          border: '1px solid rgba(15,23,42,0.06)',
                          boxShadow: '0 10px 24px rgba(0,0,0,0.08)'
                        }}>
                          <img
                            src={settings.logo_url}
                            alt="Merchant Logo"
                            style={{
                              maxHeight: '52px',
                              maxWidth: '170px',
                              objectFit: 'contain'
                            }}
                          />
                        </div>
                      ) : (
                        <div style={{
                          border: '1px dashed #94a3b8',
                          padding: '10px',
                          color: '#64748b',
                          fontSize: '10px',
                          fontWeight: 'bold',
                          borderRadius: '12px'
                        }}>
                          [ NO LOGO RECORDED ]
                        </div>
                      )}
                    </div>

                    {/* BRAND DETAILS */}
                    <div style={{
                      textAlign: 'center',
                      marginBottom: '11px'
                    }}>
                      <strong style={{
                        fontSize: '20px',
                        fontWeight: '900',
                        textTransform: 'uppercase',
                        letterSpacing: '1px',
                        display: 'block',
                        color: '#ffffff',
                        textShadow: '0 0 10px rgba(0,255,200,0.15)'
                      }}>
                        {settings?.business_name || 'MY BUSINESS BRAND'}
                      </strong>

                      <div style={{
                        width: '70px',
                        height: '2px',
                        margin: '10px auto',
                        borderRadius: '999px',
                        background: 'linear-gradient(90deg, #00ffd5, #00b8ff)'
                      }} />

                      <div style={{
                        fontSize: '11px',
                        color: 'rgba(255,255,255,0.85)',
                        marginTop: '6px',
                        whiteSpace: 'pre-wrap',
                        lineHeight: '1.6',
                        fontWeight: '700'
                      }}>
                        {settings?.store_address || 'Outlet Physical Address Street\nKrugersdorp, South Africa'}
                      </div>

                      <div style={{
                        fontSize: '11px',
                        color: 'rgba(220,255,250,0.5)',
                        marginTop: '6px',
                        fontFamily: 'system-ui, sans-serif'
                      }}>
                        {user?.email || 'info@merchantnode.com'}
                      </div>
                    </div>

                    {/* PREMIUM SEPARATOR */}
                    <div style={{
                      height: '1px',
                      background: 'linear-gradient(90deg, transparent, rgba(0,255,200,0.2), transparent)',
                      marginBottom: '9px'
                    }} />

                    {/* ITEMIZATION */}
                    <div style={{
                      fontSize: '11px',
                      lineHeight: '1.9',
                      marginBottom: '6px',
                      fontWeight: '700'
                    }}>

                      <div style={{
                        fontSize: '10px',
                        textTransform: 'uppercase',
                        letterSpacing: '1px',
                        marginBottom: '6px',
                        color: 'rgba(0,255,200,0.6)',
                        fontWeight: '900'
                      }}>
                        Items Purchased
                      </div>

                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginBottom: '4px',
                        padding: '8px 0',
                        borderBottom: '1px dashed rgba(15,23,42,0.12)'
                      }}>
                        <span style={{ maxWidth: '75%' }}>
                          1x Premium Sample Merchandise Item
                        </span>

                        <span style={{
                          fontWeight: '900',
                          color: '#bfc1c8'
                        }}>
                          {activeCurrencySymbol}120.00
                        </span>
                      </div>

                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginBottom: '6px',
                        padding: '8px 0',
                        borderBottom: '1px dashed rgba(15,23,42,0.12)'
                      }}>
                        <span style={{ maxWidth: '75%' }}>
                          1x Standard Agent Automation Node Addon
                        </span>

                        <span style={{
                          fontWeight: '900',
                          color: '#aeb4c3'
                        }}>
                          {activeCurrencySymbol}80.00
                        </span>
                      </div>

                       {/* TOTAL DUE ROW */}
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginTop: '14px',
                        padding: '16px',
                        borderRadius: '16px',
                        background: `
linear-gradient(
90deg,
rgba(8,227,216,.10),
rgba(8,227,216,.06)
)
`,
border:'2px solid #08E3D8',
boxShadow:`
0 0 8px rgba(8,227,216,.45),
inset 0 0 18px rgba(8,227,216,.06)
`,
                        fontWeight: '900',
                        fontSize: '14px',
                        color: '#b1b5c6',
                        boxShadow: '0 6px 20px rgba(0,255,200,0.08)'
                      }}>
                        <span>TOTAL DUE</span>

                        <span style={{
                          color: '#00a884',
                          textShadow: '0 0 10px rgba(0,255,200,0.15)'
                        }}>
                          {activeCurrencySymbol}200.00
                        </span>
                      </div>
                    </div>

                    {/* VOUCHER SECTION BOX */}
                    <div style={{
                      background: 'rgba(10, 20, 28, 0.6)',
                      border:'2px solid #08E3D8',
boxShadow:`
0 0 8px rgba(8,227,216,.35),
inset 0 0 12px rgba(8,227,216,.06)
`,
                      borderRadius: '22px',
                      padding: '12px',
                      textAlign: 'center',
                      marginTop: '24px',
                      position: 'relative',
                      overflow: 'hidden',
                      /*boxShadow: '0 12px 30px rgba(0,0,0,0.25)'*/
                    }}>

                      {/* INNER GLOW */}
                      <div style={{
                        position: 'absolute',
                        top: '-40px',
                        right: '-40px',
                        width: '120px',
                        height: '120px',
                        borderRadius: '50%',
                        background: 'radial-gradient(circle, rgba(0,255,200,0.12), transparent 70%)'
                      }} />

                      <span style={{
                        fontSize: '9px',
                        color: '#00ffd5',
                        fontWeight: '900',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        marginBottom: '6px',
                        letterSpacing: '1px',
                        textTransform: 'uppercase'
                      }}>
                        ⚡ Next Visit Voucher Code Inside
                      </span>

                      <div style={{
                        display: 'inline-block',
                        padding: '12px',
                        background: '#ffffff',
                        borderRadius: '18px',
                        border: '1px solid rgba(0,255,200,0.15)',
                        boxShadow: `
                          0 12px 25px rgba(0,0,0,0.35),
                          0 0 20px rgba(0,255,200,0.15)
                        `,
                        marginBottom: '5px'
                      }}>
                        <img
                          src={`https://api.qrserver.com/v1/create-qr-code/?size=115x115&data=${encodeURIComponent(
                            `https://ruachagent.net/redeem?token=${settings?.webhook_slug || 'node'}_preview`
                          )}&color=11161d`}
                          alt="Voucher Token QR"
                          style={{
                            width: '80px',
                            height: '80px',
                            display: 'block'
                          }}
                        />
                      </div>

                      <div style={{
                        fontSize: '9px',
                        color: 'rgba(255,255,255,0.9)',
                        textTransform: 'uppercase',
                        letterSpacing: '1px',
                        fontWeight: '900',
                        marginBottom: '4px'
                      }}>
                        Claim Discount
                      </div>

                      <div style={{
                        fontSize: '11px',
                        color: 'rgba(220,255,250,0.7)',
                        lineHeight: '1.6',
                        fontFamily: 'system-ui, -apple-system, sans-serif',
                        padding: '0 6px'
                      }}>
                        Scan to instantly claim your{' '}
                        <strong style={{ color: '#00ffd5', fontWeight: '900' }}>
                          {settings?.discount_percentage ?? 10}% discount
                        </strong>{' '}
                        balance.
                      </div>

                      {/* EXPIRED IN POLICY NOTIFICATION MIRROR */}
                      <div style={{
                        fontSize: '10px',
                        color: '#64748b',
                        marginTop: '10px',
                        paddingTop: '8px',
                        borderTop: '1px dashed rgba(255,255,255,0.08)',
                        fontFamily: '"Courier New", monospace',
                        fontWeight: 'bold',
                        letterSpacing: '0.5px'
                      }}>
                        EXPIRES IN: <span style={{ color: '#ef4444' }}>{settings?.voucher_expiration_days ?? 30} DAYS</span> FROM PRINT
                      </div>
                    </div>

                    {/* ACTION BUTTON */}
                    <div style={{
                      marginTop: '28px',
                      textAlign: 'center'
                    }}>
                      <a
                        href="#download"
                        onClick={(e) => e.preventDefault()}
                        style={{
                          display: 'block',
                          background: 'linear-gradient(90deg, #00e0b8 0%, #00ffd5 50%, #00b8ff 100%)',
                          color: '#041014',
                          textDecoration: 'none',
                          padding: '16px',
                          borderRadius: '16px',
                          fontSize: '12px',
                          fontWeight: '900',
                          fontFamily: 'system-ui, sans-serif',
                          letterSpacing: '0.8px',
                          textTransform: 'uppercase',
                          boxShadow: `
                            0 12px 30px rgba(0,255,200,0.25),
                            0 0 24px rgba(0,255,200,0.15)
                          `,
                          transition: 'all 0.25s ease'
                        }}
                      >
                        Download Official Invoice PDF
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
