import { useState, useEffect, useRef } from 'react';

import { supabase } from './supabaseClient';

import { useNavigate } from "react-router-dom";

import {
  Paperclip,
  Image as ImageIcon,
  Mic,
  Sparkles,
  SendHorizontal,
  ShieldCheck,
  Cpu,
  Activity,
  Bot,
  BarChart3,
  Webhook,
  Plus,
} from "lucide-react";



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

  const [activeTab, setActiveTab] = useState('dashboard'); // or whatever default tab string

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

/* ============================================================
      RUACHAGENT AI CYBERPUNK THEME
      PART 1
      Container • AppShell • Sidebar • Chat Layout
============================================================ */

const styles = {

  /* ============================================================
      ROOT CONTAINER
  ============================================================ */

  container:{

      position:"relative",

      minHeight:"100vh",

      width:"100%",

      overflow:"hidden",

      overflowX:"hidden",

      background:`

      radial-gradient(circle at 12% 18%, rgba(0,255,255,.08), transparent 26%),

      radial-gradient(circle at 85% 82%, rgba(0,255,170,.08), transparent 32%),

      radial-gradient(circle at center, rgba(0,255,255,.04), transparent 50%),

      linear-gradient(

      180deg,

      #02050b 0%,

      #040913 22%,

      #06101a 60%,

      #02060d 100%)

      `,

      color:"#ffffff",

      fontFamily:`

      Inter,

      "SF Pro Display",

      "Segoe UI",

      Roboto,

      sans-serif

      `,

      transition:"all .35s ease",

      display:"flex",

      justifyContent:"center",

      alignItems:"stretch",

      padding:isMobile ? "0" : "20px",

      boxSizing:"border-box"

  },



  /* ============================================================
      APP SHELL
  ============================================================ */

  appShell:{

      position:"relative",

      display:"grid",

      gridTemplateColumns:

      isDesktop

      ?

      "290px minmax(0,1fr) 430px"

      :

      "1fr",

      width:"100%",

      maxWidth:"1900px",

      minHeight:isDesktop

      ?

      "calc(100vh - 40px)"

      :

      "100vh",

      overflow:"hidden",

      borderRadius:isDesktop

      ?

      "32px"

      :

      "0px",

      background:"rgba(7,15,28,.72)",

      backdropFilter:"blur(24px)",

      border:isDesktop

      ?

      "1px solid rgba(0,255,255,.14)"

      :

      "none",

      boxShadow:`

      0 0 0 1px rgba(255,255,255,.03),

      0 35px 120px rgba(0,0,0,.55),

      0 0 80px rgba(0,255,255,.06)

      `

  },



  /* ============================================================
      SIDEBAR
  ============================================================ */

  sidebar:{

      display:

      isDesktop

      ?

      "flex"

      :

      "none",

      flexDirection:"column",

      background:`

      linear-gradient(

      180deg,

      rgba(10,18,34,.97),

      rgba(5,10,20,.98)

      )

      `,

      borderRight:"1px solid rgba(0,255,255,.10)",

      overflow:"hidden",

      position:"relative"

  },



  sidebarGlow:{

      position:"absolute",

      top:"-160px",

      left:"-160px",

      width:"380px",

      height:"380px",

      borderRadius:"50%",

      background:"rgba(0,255,255,.10)",

      filter:"blur(130px)",

      pointerEvents:"none"

  },



  sidebarHeader:{

      display:"flex",

      alignItems:"center",

      gap:"16px",

      padding:"28px",

      borderBottom:"1px solid rgba(0,255,255,.10)"

  },



  sidebarLogo:{

      width:"58px",

      height:"58px",

      borderRadius:"18px",

      display:"flex",

      alignItems:"center",

      justifyContent:"center",

      background:"rgba(0,255,255,.10)",

      border:"1px solid rgba(0,255,255,.18)",

      boxShadow:`

      0 0 30px rgba(0,255,255,.20),

      inset 0 0 20px rgba(0,255,255,.06)

      `

  },



  sidebarTitle:{

      fontSize:"22px",

      fontWeight:700,

      color:"#79ffff",

      letterSpacing:".08em"

  },



  sidebarSubtitle:{

      marginTop:"4px",

      color:"rgba(210,255,255,.55)",

      fontSize:"12px",

      letterSpacing:".14em",

      textTransform:"uppercase"

  },



  sidebarBody:{

      flex:1,

      overflowY:"auto",

      padding:"20px"

  },



  sidebarButton:{

      width:"100%",

      display:"flex",

      alignItems:"center",

      gap:"18px",

      padding:"18px",

      marginBottom:"12px",

      borderRadius:"18px",

      background:"transparent",

      border:"1px solid transparent",

      color:"#dfffff",

      cursor:"pointer",

      transition:"all .25s ease"

  },



  sidebarButtonActive:{

      background:"rgba(0,255,255,.08)",

      border:"1px solid rgba(0,255,255,.20)",

      boxShadow:"0 0 30px rgba(0,255,255,.12)"

  },



  sidebarFooter:{

      padding:"22px",

      borderTop:"1px solid rgba(0,255,255,.10)"

  },



  /* ============================================================
      CHAT AREA
  ============================================================ */

  chat:{

      display:"flex",

      flexDirection:"column",

      minWidth:0,

      background:`

      linear-gradient(

      180deg,

      rgba(6,13,24,.80),

      rgba(5,11,18,.95)

      )

      `,

      position:"relative",

      overflow:"hidden"

  },



  chatGlowLeft:{

      position:"absolute",

      left:"-220px",

      top:"-180px",

      width:"520px",

      height:"520px",

      borderRadius:"50%",

      background:"rgba(0,255,255,.08)",

      filter:"blur(180px)",

      pointerEvents:"none"

  },



  chatGlowRight:{

      position:"absolute",

      right:"-250px",

      bottom:"-220px",

      width:"520px",

      height:"520px",

      borderRadius:"50%",

      background:"rgba(0,255,180,.08)",

      filter:"blur(190px)",

      pointerEvents:"none"

  },



  chatHeader:{

      display:"flex",

      justifyContent:"space-between",

      alignItems:"center",

      padding:isMobile

      ?

      "18px"

      :

      "24px 34px",

      borderBottom:"1px solid rgba(0,255,255,.10)",

      backdropFilter:"blur(25px)",

      background:"rgba(8,18,30,.65)",

      position:"sticky",

      top:0,

      zIndex:40

  },



  chatTitle:{

      fontSize:isMobile

      ?

      "20px"

      :

      "26px",

      fontWeight:700,

      color:"#8afcff"

  },



  chatSubtitle:{

      marginTop:"6px",

      color:"rgba(210,255,255,.55)",

      fontSize:"13px"

  },



  chatBody:{

      flex:1,

      overflowY:"auto",

      padding:isMobile

      ?

      "18px"

      :

      "34px",

      display:"flex",

      flexDirection:"column",

      gap:"26px"

  },



  mobileSidebarButton:{

      display:isDesktop

      ?

      "none"

      :

      "flex",

      alignItems:"center",

      justifyContent:"center",

      width:"46px",

      height:"46px",

      borderRadius:"14px",

      background:"rgba(0,255,255,.08)",

      border:"1px solid rgba(0,255,255,.20)",

      color:"#8afcff"

  },

/* ============================================================
    PART 2
    AI Messages • Prompt Composer • Inputs • Buttons
============================================================ */

  /* ============================================================
      CHAT MESSAGE AREA
  ============================================================ */

  messagesContainer:{

      flex:1,

      display:"flex",

      flexDirection:"column",

      gap:"26px",

      overflowY:"auto",

      overflowX:"hidden",

      paddingBottom:"25px",

      scrollBehavior:"smooth"

  },



  /* ============================================================
      ROWS
  ============================================================ */

  aiRow:{

      display:"flex",

      alignItems:"flex-start",

      gap:"18px",

      width:"100%"

  },



  userRow:{

      display:"flex",

      justifyContent:"flex-end",

      width:"100%"

  },



  /* ============================================================
      AVATAR
  ============================================================ */

  aiAvatar:{

      width:"52px",

      height:"52px",

      minWidth:"52px",

      borderRadius:"18px",

      display:"flex",

      alignItems:"center",

      justifyContent:"center",

      background:"rgba(0,255,255,.08)",

      border:"1px solid rgba(0,255,255,.20)",

      boxShadow:`

      0 0 24px rgba(0,255,255,.20),

      inset 0 0 18px rgba(0,255,255,.08)

      `

  },



  /* ============================================================
      AI MESSAGE
  ============================================================ */

  aiBubble:{

      maxWidth:isMobile

      ?

      "100%"

      :

      "76%",

      background:`

      linear-gradient(

      180deg,

      rgba(15,28,42,.95),

      rgba(8,16,28,.98)

      )

      `,

      border:"1px solid rgba(0,255,255,.15)",

      borderRadius:"26px",

      padding:isMobile

      ?

      "18px"

      :

      "24px",

      boxShadow:`

      0 0 35px rgba(0,255,255,.08),

      inset 0 0 20px rgba(255,255,255,.02)

      `,

      backdropFilter:"blur(20px)"

  },



  aiName:{

      color:"#84ffff",

      fontWeight:700,

      marginBottom:"12px",

      fontSize:"15px",

      letterSpacing:".05em"

  },



  aiText:{

      lineHeight:1.9,

      fontSize:"15px",

      color:"#f2ffff"

  },



  /* ============================================================
      USER MESSAGE
  ============================================================ */

  userBubble:{

      maxWidth:isMobile

      ?

      "100%"

      :

      "70%",

      background:`

      linear-gradient(

      135deg,

      rgba(0,255,255,.16),

      rgba(0,180,255,.12)

      )

      `,

      border:"1px solid rgba(0,255,255,.25)",

      borderRadius:"24px",

      padding:isMobile

      ?

      "18px"

      :

      "22px",

      color:"#ffffff",

      backdropFilter:"blur(16px)",

      boxShadow:`

      0 0 35px rgba(0,255,255,.10)

      `

  },



  userName:{

      color:"#7efeff",

      fontWeight:700,

      marginBottom:"10px"

  },



  messageTime:{

      marginTop:"18px",

      color:"rgba(220,255,255,.40)",

      fontSize:"12px"

  },



  /* ============================================================
      TYPING INDICATOR
  ============================================================ */

  typingBubble:{

      display:"flex",

      alignItems:"center",

      gap:"8px",

      padding:"20px",

      width:"90px",

      borderRadius:"18px",

      background:"rgba(0,255,255,.06)",

      border:"1px solid rgba(0,255,255,.15)"

  },



  typingDot:{

      width:"10px",

      height:"10px",

      borderRadius:"50%",

      background:"#62ffff",

      boxShadow:"0 0 14px #00ffff"

  },



  /* ============================================================
      PROMPT AREA
  ============================================================ */

  promptContainer:{

      position:"relative",

      padding:isMobile

      ?

      "18px"

      :

      "24px 34px",

      borderTop:"1px solid rgba(0,255,255,.10)",

      background:"rgba(7,15,26,.85)",

      backdropFilter:"blur(25px)"

  },



  promptGlass:{

      borderRadius:"28px",

      background:`

      linear-gradient(

      180deg,

      rgba(12,24,38,.98),

      rgba(7,14,25,.98)

      )

      `,

      border:"1px solid rgba(0,255,255,.18)",

      boxShadow:`

      0 0 50px rgba(0,255,255,.08),

      inset 0 0 20px rgba(255,255,255,.02)

      `,

      padding:"20px"

  },



  promptInput:{

      width:"100%",

      minHeight:"65px",

      maxHeight:"220px",

      resize:"none",

      background:"transparent",

      border:"none",

      outline:"none",

      color:"#ffffff",

      fontSize:"16px",

      lineHeight:1.8,

      fontFamily:"inherit"

  },



  promptToolbar:{

      marginTop:"18px",

      display:"flex",

      justifyContent:"space-between",

      alignItems:"center",

      gap:"18px",

      flexWrap:"wrap"

  },



  leftTools:{

      display:"flex",

      alignItems:"center",

      gap:"12px",

      flexWrap:"wrap"

  },



  rightTools:{

      display:"flex",

      alignItems:"center",

      gap:"14px"

  },



  /* ============================================================
      ICON BUTTONS
  ============================================================ */

  iconButton:{

      width:"46px",

      height:"46px",

      borderRadius:"16px",

      display:"flex",

      alignItems:"center",

      justifyContent:"center",

      background:"rgba(0,255,255,.05)",

      border:"1px solid rgba(0,255,255,.16)",

      color:"#8effff",

      cursor:"pointer",

      transition:"all .25s ease"

  },



  iconButtonHover:{

      background:"rgba(0,255,255,.12)",

      transform:"translateY(-2px)",

      boxShadow:"0 0 22px rgba(0,255,255,.18)"

  },

  /* ============================================================
      SEND BUTTON
  ============================================================ */

  sendButton:{

      display:"flex",

      alignItems:"center",

      gap:"12px",

      padding:"15px 26px",

      borderRadius:"18px",

      border:"none",

      cursor:"pointer",

      color:"#031014",

      fontWeight:700,

      fontSize:"15px",

      background:`

      linear-gradient(

      90deg,

      #00fff2,

      #00ffc8,

      #00ffa8

      )

      `,

      boxShadow:`

      0 0 35px rgba(0,255,255,.30),

      0 0 70px rgba(0,255,255,.10)

      `,

      transition:"all .25s ease"

  },

  sendButtonDisabled:{

      opacity:.45,

      cursor:"not-allowed",

      filter:"grayscale(.4)"

  },

  /* ============================================================
      SUGGESTED PROMPTS
  ============================================================ */

  suggestionsRow:{

      display:"flex",

      flexWrap:"wrap",

      gap:"12px",

      marginTop:"22px"

  },

  suggestionChip:{

      padding:"12px 18px",

      borderRadius:"999px",

      background:"rgba(0,255,255,.05)",

      border:"1px solid rgba(0,255,255,.14)",

      color:"#baffff",

      fontSize:"13px",

      cursor:"pointer",

      transition:"all .25s ease"

  },

  suggestionChipHover:{

      background:"rgba(0,255,255,.12)",

      boxShadow:"0 0 24px rgba(0,255,255,.18)"

  },

  /* ============================================================
      CUSTOM SCROLLBAR
  ============================================================ */

  scrollbar:{

      scrollbarWidth:"thin",

      scrollbarColor:"#00ffff rgba(255,255,255,.04)"

  },

  /* ============================================================
      GLASS PANEL
  ============================================================ */

  glassPanel:{

      background:"rgba(10,18,30,.75)",

      backdropFilter:"blur(22px)",

      border:"1px solid rgba(0,255,255,.14)",

      borderRadius:"24px",

      boxShadow:`

      0 0 45px rgba(0,255,255,.08),

      inset 0 0 18px rgba(255,255,255,.02)

      `
  },

/*==================== RIGHT SIDEBAR ====================*/

rightSidebar:{
display:isDesktop?"flex":"none",
flexDirection:"column",
width:"430px",
minWidth:"430px",
background:"linear-gradient(180deg,#08111d,#050c16)",
borderLeft:"1px solid rgba(0,255,255,.12)",
overflowY:"auto",
overflowX:"hidden",
position:"relative"
},

rightSidebarGlow:{
position:"absolute",
top:"-180px",
right:"-180px",
width:"450px",
height:"450px",
borderRadius:"50%",
background:"rgba(0,255,255,.08)",
filter:"blur(170px)",
pointerEvents:"none"
},

rightSidebarInner:{
position:"relative",
zIndex:2,
padding:"22px",
display:"flex",
flexDirection:"column",
gap:"20px"
},

panelCard:{
background:"linear-gradient(180deg,rgba(15,24,38,.95),rgba(7,13,24,.98))",
border:"1px solid rgba(0,255,255,.14)",
borderRadius:"24px",
padding:"22px",
backdropFilter:"blur(20px)",
boxShadow:"0 0 45px rgba(0,255,255,.06)"
},

panelHeader:{
display:"flex",
justifyContent:"space-between",
alignItems:"center",
marginBottom:"20px"
},

panelTitle:{
fontSize:"17px",
fontWeight:700,
color:"#82ffff",
letterSpacing:".05em"
},

panelSubtitle:{
fontSize:"12px",
color:"rgba(220,255,255,.45)"
},

/*==================== AGENT PARAMETERS ====================*/

parameterList:{
display:"flex",
flexDirection:"column",
gap:"20px"
},

parameterRow:{
display:"flex",
justifyContent:"space-between",
alignItems:"center",
gap:"18px"
},

parameterLabel:{
fontSize:"14px",
fontWeight:600,
color:"#eefefe"
},

parameterDescription:{
fontSize:"12px",
marginTop:"3px",
color:"rgba(220,255,255,.45)"
},

parameterValue:{
fontWeight:700,
color:"#78ffff",
fontSize:"14px"
},

slider:{
width:"100%",
marginTop:"10px",
accentColor:"#00ffff",
cursor:"pointer"
},

select:{
width:"100%",
padding:"13px 15px",
borderRadius:"14px",
background:"#101d2d",
border:"1px solid rgba(0,255,255,.15)",
color:"#fff",
outline:"none"
},

toggle:{
width:"52px",
height:"28px",
borderRadius:"999px",
background:"rgba(0,255,255,.18)",
position:"relative",
cursor:"pointer"
},

toggleCircle:{
position:"absolute",
top:"3px",
left:"3px",
width:"22px",
height:"22px",
borderRadius:"50%",
background:"#00ffff",
boxShadow:"0 0 18px #00ffff"
},

/*==================== ANALYTICS ====================*/

analyticsGrid:{
display:"grid",
gridTemplateColumns:"1fr 1fr",
gap:"15px"
},

analyticsCard:{
padding:"18px",
borderRadius:"20px",
background:"linear-gradient(180deg,rgba(0,255,255,.08),rgba(255,255,255,.02))",
border:"1px solid rgba(0,255,255,.14)",
boxShadow:"0 0 28px rgba(0,255,255,.06)"
},

analyticsIcon:{
width:"42px",
height:"42px",
borderRadius:"14px",
display:"flex",
alignItems:"center",
justifyContent:"center",
background:"rgba(0,255,255,.10)",
color:"#78ffff",
marginBottom:"15px"
},

analyticsLabel:{
fontSize:"13px",
color:"rgba(220,255,255,.55)"
},

analyticsValue:{
marginTop:"8px",
fontSize:"28px",
fontWeight:700,
color:"#ffffff"
},

analyticsChange:{
marginTop:"6px",
fontSize:"12px",
fontWeight:600,
color:"#35ffae"
},

progressSection:{
marginTop:"22px"
},

progressHeader:{
display:"flex",
justifyContent:"space-between",
marginBottom:"10px"
},

progressLabel:{
fontSize:"13px",
color:"rgba(220,255,255,.55)"
},

progressValue:{
fontWeight:700,
color:"#7dffff"
},

progressTrack:{
height:"8px",
borderRadius:"999px",
background:"rgba(255,255,255,.05)",
overflow:"hidden"
},

progressFill:{
height:"100%",
width:"78%",
borderRadius:"999px",
background:"linear-gradient(90deg,#00ffff,#00ffb7)",
boxShadow:"0 0 20px rgba(0,255,255,.45)"
},

/*==================== SYSTEM STATUS ====================*/

statusStack:{
display:"flex",
flexDirection:"column",
gap:"14px",
marginTop:"20px"
},

statusRow:{
display:"flex",
justifyContent:"space-between",
alignItems:"center"
},

statusName:{
fontSize:"13px",
color:"rgba(220,255,255,.58)"
},

statusOnline:{
fontWeight:700,
color:"#4dffb0"
},

statusOffline:{
fontWeight:700,
color:"#ff8a8a"
},

/*==================== WEBHOOK ====================*/

endpointBox:{
marginTop:"18px",
padding:"15px",
borderRadius:"16px",
background:"#0d1828",
border:"1px solid rgba(0,255,255,.15)",
fontSize:"12px",
color:"#9fffff",
wordBreak:"break-all"
},

endpointButton:{
marginTop:"16px",
width:"100%",
padding:"14px",
border:"none",
borderRadius:"16px",
background:"linear-gradient(90deg,#00ffff,#00ffbf)",
fontWeight:700,
color:"#041015",
cursor:"pointer",
boxShadow:"0 0 28px rgba(0,255,255,.28)"
},

outlineButton:{
marginTop:"12px",
width:"100%",
padding:"14px",
borderRadius:"16px",
background:"transparent",
border:"1px solid rgba(0,255,255,.15)",
color:"#9fffff",
cursor:"pointer"
},

dangerButton:{
marginTop:"12px",
width:"100%",
padding:"14px",
borderRadius:"16px",
background:"rgba(255,70,70,.08)",
border:"1px solid rgba(255,70,70,.22)",
color:"#ff8d8d",
cursor:"pointer"
},

/*==================== AI STATUS ====================*/

aiStatusCard:{
marginTop:"10px",
padding:"20px",
borderRadius:"22px",
background:"linear-gradient(135deg,rgba(0,255,255,.10),rgba(0,255,170,.05))",
border:"1px solid rgba(0,255,255,.16)"
},

aiStatusHeader:{
display:"flex",
alignItems:"center",
gap:"12px",
marginBottom:"18px"
},

aiPulse:{
width:"12px",
height:"12px",
borderRadius:"50%",
background:"#00ffb7",
boxShadow:"0 0 18px #00ffb7"
},

aiStatusTitle:{
fontWeight:700,
fontSize:"15px",
color:"#8cffff"
},

aiStatusText:{
fontSize:"13px",
lineHeight:1.8,
color:"rgba(220,255,255,.62)"
},

/*==================== MOBILE DRAWER ====================*/

mobileOverlay:{
position:"fixed",
inset:0,
background:"rgba(0,0,0,.55)",
backdropFilter:"blur(10px)",
zIndex:900,
display:isDesktop?"none":"block"
},

mobileDrawer:{
position:"fixed",
top:0,
left:0,
bottom:0,
width:"300px",
maxWidth:"86%",
background:"linear-gradient(180deg,#07111d,#030811)",
borderRight:"1px solid rgba(0,255,255,.15)",
boxShadow:"25px 0 70px rgba(0,0,0,.65)",
display:"flex",
flexDirection:"column",
zIndex:1000,
overflow:"hidden"
},

mobileDrawerGlow:{
position:"absolute",
top:"-120px",
left:"-120px",
width:"320px",
height:"320px",
borderRadius:"50%",
background:"rgba(0,255,255,.10)",
filter:"blur(120px)",
pointerEvents:"none"
},

mobileDrawerHeader:{
display:"flex",
alignItems:"center",
justifyContent:"space-between",
padding:"22px",
borderBottom:"1px solid rgba(0,255,255,.12)",
position:"relative",
zIndex:2
},

mobileDrawerLogo:{
display:"flex",
alignItems:"center",
gap:"14px"
},

mobileDrawerTitle:{
fontSize:"20px",
fontWeight:700,
color:"#83ffff"
},

mobileDrawerSubtitle:{
fontSize:"11px",
letterSpacing:".12em",
textTransform:"uppercase",
color:"rgba(220,255,255,.45)"
},

mobileCloseButton:{
width:"42px",
height:"42px",
display:"flex",
alignItems:"center",
justifyContent:"center",
borderRadius:"14px",
background:"rgba(0,255,255,.08)",
border:"1px solid rgba(0,255,255,.18)",
cursor:"pointer",
color:"#8bffff"
},

mobileDrawerBody:{
flex:1,
overflowY:"auto",
padding:"18px",
display:"flex",
flexDirection:"column",
gap:"10px"
},

mobileDrawerItem:{
display:"flex",
alignItems:"center",
gap:"16px",
padding:"15px 16px",
borderRadius:"18px",
background:"transparent",
border:"1px solid transparent",
cursor:"pointer",
transition:"all .25s ease",
color:"#ecffff",
fontWeight:600
},

mobileDrawerItemActive:{
background:"rgba(0,255,255,.08)",
border:"1px solid rgba(0,255,255,.18)",
boxShadow:"0 0 25px rgba(0,255,255,.12)"
},

mobileDrawerIcon:{
width:"42px",
height:"42px",
display:"flex",
alignItems:"center",
justifyContent:"center",
borderRadius:"14px",
background:"rgba(0,255,255,.08)",
color:"#7effff"
},

mobileDrawerFooter:{
padding:"20px",
borderTop:"1px solid rgba(0,255,255,.12)"
},

mobilePlanCard:{
padding:"18px",
borderRadius:"18px",
background:"linear-gradient(135deg,rgba(0,255,255,.10),rgba(0,255,180,.06))",
border:"1px solid rgba(0,255,255,.16)"
},

mobilePlanTitle:{
fontSize:"13px",
fontWeight:600,
color:"rgba(220,255,255,.65)"
},

mobilePlanValue:{
marginTop:"8px",
fontSize:"21px",
fontWeight:700,
color:"#83ffff"
},

mobilePlanButton:{
marginTop:"16px",
width:"100%",
padding:"13px",
border:"none",
borderRadius:"14px",
background:"linear-gradient(90deg,#00ffff,#00ffba)",
color:"#021014",
fontWeight:700,
cursor:"pointer",
boxShadow:"0 0 22px rgba(0,255,255,.28)"
},

/*==================== MOBILE NAVIGATION ====================*/

mobileNavigation:{
position:"fixed",
left:"50%",
bottom:"18px",
transform:"translateX(-50%)",
width:"calc(100% - 24px)",
maxWidth:"430px",
display:isDesktop?"none":"flex",
justifyContent:"space-between",
alignItems:"center",
padding:"12px 14px",
borderRadius:"24px",
background:"rgba(7,14,24,.90)",
backdropFilter:"blur(22px)",
border:"1px solid rgba(0,255,255,.16)",
boxShadow:"0 18px 45px rgba(0,0,0,.55),0 0 30px rgba(0,255,255,.08)",
zIndex:850
},

mobileNavButton:{
flex:1,
display:"flex",
flexDirection:"column",
alignItems:"center",
justifyContent:"center",
gap:"7px",
padding:"10px 0",
borderRadius:"16px",
cursor:"pointer",
transition:"all .25s ease",
color:"rgba(220,255,255,.55)"
},

mobileNavButtonActive:{
background:"rgba(0,255,255,.10)",
color:"#83ffff",
boxShadow:"0 0 22px rgba(0,255,255,.18)"
},

mobileNavIcon:{
fontSize:"21px"
},

mobileNavLabel:{
fontSize:"11px",
fontWeight:600,
letterSpacing:".04em"
},

mobileFab:{
position:"fixed",
right:"22px",
bottom:"105px",
width:"64px",
height:"64px",
display:isDesktop?"none":"flex",
alignItems:"center",
justifyContent:"center",
borderRadius:"50%",
border:"none",
cursor:"pointer",
background:"linear-gradient(135deg,#00ffff,#00ffb8)",
color:"#021015",
boxShadow:"0 0 35px rgba(0,255,255,.35),0 12px 35px rgba(0,0,0,.45)",
zIndex:860
},

mobileBadge:{
position:"absolute",
top:"-2px",
right:"-2px",
minWidth:"20px",
height:"20px",
padding:"0 6px",
display:"flex",
alignItems:"center",
justifyContent:"center",
borderRadius:"999px",
background:"#ff355e",
color:"#fff",
fontSize:"10px",
fontWeight:700,
boxShadow:"0 0 16px rgba(255,53,94,.35)"
},

mobileSafeArea:{
paddingBottom:"calc(env(safe-area-inset-bottom) + 92px)"
},

hideDesktop:{
display:isDesktop?"none":"block"
},

hideMobile:{
display:isDesktop?"block":"none"
},

/*==================== ANIMATIONS ====================*/

fadeIn:{
animation:"fadeIn .35s ease"
},

fadeUp:{
animation:"fadeUp .45s ease"
},

fadeDown:{
animation:"fadeDown .45s ease"
},

fadeLeft:{
animation:"fadeLeft .4s ease"
},

fadeRight:{
animation:"fadeRight .4s ease"
},

scaleIn:{
animation:"scaleIn .28s ease"
},

zoomIn:{
animation:"zoomIn .35s ease"
},

slideUp:{
animation:"slideUp .35s ease"
},

slideDown:{
animation:"slideDown .35s ease"
},

slideLeft:{
animation:"slideLeft .35s ease"
},

slideRight:{
animation:"slideRight .35s ease"
},

pulse:{
animation:"pulse 2s infinite"
},

glowPulse:{
animation:"glowPulse 2.5s infinite"
},

spin:{
animation:"spin 1s linear infinite"
},

bounce:{
animation:"bounce 1.2s infinite"
},

float:{
animation:"float 4s ease-in-out infinite"
},

blink:{
animation:"blink 1s infinite"
},

typing:{
animation:"typing 1.4s infinite"
},

hoverLift:{
transition:"all .25s ease"
},

hoverLiftActive:{
transform:"translateY(-4px)",
boxShadow:"0 15px 35px rgba(0,255,255,.18)"
},

hoverScale:{
transition:"all .25s ease"
},

hoverScaleActive:{
transform:"scale(1.04)"
},

hoverGlow:{
transition:"all .25s ease"
},

hoverGlowActive:{
boxShadow:"0 0 35px rgba(0,255,255,.28)"
},

rotate:{
transition:"transform .35s ease"
},

rotateActive:{
transform:"rotate(180deg)"
},

/*==================== MODALS ====================*/

modalOverlay:{
position:"fixed",
inset:0,
display:"flex",
alignItems:"center",
justifyContent:"center",
background:"rgba(0,0,0,.72)",
backdropFilter:"blur(14px)",
padding:isMobile?"18px":"35px",
zIndex:5000
},

modal:{
width:"100%",
maxWidth:"760px",
borderRadius:"28px",
background:"linear-gradient(180deg,#0d1829,#08111e)",
border:"1px solid rgba(0,255,255,.18)",
overflow:"hidden",
boxShadow:"0 35px 90px rgba(0,0,0,.55),0 0 60px rgba(0,255,255,.08)"
},

modalSmall:{
maxWidth:"450px"
},

modalLarge:{
maxWidth:"1100px"
},

modalHeader:{
display:"flex",
justifyContent:"space-between",
alignItems:"center",
padding:"22px 26px",
borderBottom:"1px solid rgba(0,255,255,.12)"
},

modalTitle:{
fontSize:"22px",
fontWeight:700,
color:"#84ffff"
},

modalClose:{
width:"42px",
height:"42px",
display:"flex",
alignItems:"center",
justifyContent:"center",
borderRadius:"14px",
background:"rgba(0,255,255,.08)",
border:"1px solid rgba(0,255,255,.16)",
cursor:"pointer",
color:"#8affff"
},

modalBody:{
padding:"28px"
},

modalFooter:{
display:"flex",
justifyContent:"flex-end",
gap:"14px",
padding:"22px 26px",
borderTop:"1px solid rgba(0,255,255,.12)"
},

modalCancel:{
padding:"13px 22px",
borderRadius:"14px",
border:"1px solid rgba(0,255,255,.16)",
background:"transparent",
color:"#a8ffff",
cursor:"pointer"
},

modalConfirm:{
padding:"13px 24px",
borderRadius:"14px",
border:"none",
background:"linear-gradient(90deg,#00ffff,#00ffb7)",
color:"#041014",
fontWeight:700,
cursor:"pointer",
boxShadow:"0 0 25px rgba(0,255,255,.25)"
},

/*==================== TOASTS ====================*/

toastContainer:{
position:"fixed",
top:"22px",
right:"22px",
display:"flex",
flexDirection:"column",
gap:"14px",
zIndex:6000
},

toast:{
display:"flex",
alignItems:"center",
gap:"16px",
minWidth:"320px",
padding:"18px",
borderRadius:"18px",
background:"rgba(9,18,30,.95)",
border:"1px solid rgba(0,255,255,.16)",
boxShadow:"0 18px 45px rgba(0,0,0,.45)"
},

toastSuccess:{
borderLeft:"4px solid #00ffb7"
},

toastError:{
borderLeft:"4px solid #ff4b73"
},

toastWarning:{
borderLeft:"4px solid #ffd44d"
},

toastInfo:{
borderLeft:"4px solid #00ffff"
},

toastIcon:{
fontSize:"24px",
color:"#7effff"
},

toastContent:{
flex:1
},

toastTitle:{
fontWeight:700,
fontSize:"15px",
color:"#ffffff"
},

toastMessage:{
marginTop:"4px",
fontSize:"13px",
lineHeight:1.6,
color:"rgba(220,255,255,.62)"
},

toastClose:{
cursor:"pointer",
fontSize:"18px",
color:"rgba(220,255,255,.55)"
},

/*==================== LOADER ====================*/

loader:{
display:"flex",
alignItems:"center",
justifyContent:"center",
padding:"35px"
},

loaderRing:{
width:"52px",
height:"52px",
borderRadius:"50%",
border:"3px solid rgba(0,255,255,.12)",
borderTop:"3px solid #00ffff",
animation:"spin 1s linear infinite"
},

skeleton:{
background:"linear-gradient(90deg,rgba(255,255,255,.03),rgba(255,255,255,.08),rgba(255,255,255,.03))",
backgroundSize:"300% 100%",
animation:"skeleton 1.5s infinite",
borderRadius:"12px"
},

/*==================== UTILITIES ====================*/

row:{
display:"flex",
alignItems:"center"
},

column:{
display:"flex",
flexDirection:"column"
},

center:{
display:"flex",
alignItems:"center",
justifyContent:"center"
},

spaceBetween:{
display:"flex",
justifyContent:"space-between",
alignItems:"center"
},

wrap:{
flexWrap:"wrap"
},

gap8:{gap:"8px"},
gap10:{gap:"10px"},
gap12:{gap:"12px"},
gap16:{gap:"16px"},
gap20:{gap:"20px"},
gap24:{gap:"24px"},

w100:{width:"100%"},
h100:{height:"100%"},

textCenter:{
textAlign:"center"
},

textRight:{
textAlign:"right"
},

rounded:{
borderRadius:"18px"
},

roundedLarge:{
borderRadius:"28px"
},

shadow:{
boxShadow:"0 15px 40px rgba(0,0,0,.45)"
},

glass:{
background:"rgba(12,22,35,.72)",
backdropFilter:"blur(20px)",
border:"1px solid rgba(0,255,255,.14)"
},

glassStrong:{
background:"rgba(12,22,35,.92)",
backdropFilter:"blur(24px)",
border:"1px solid rgba(0,255,255,.18)"
},

border:{
border:"1px solid rgba(0,255,255,.14)"
},

borderGlow:{
border:"1px solid rgba(0,255,255,.24)",
boxShadow:"0 0 30px rgba(0,255,255,.14)"
},

hidden:{
display:"none"
},

visible:{
display:"block"
},

pointer:{
cursor:"pointer"
},

disabled:{
opacity:.45,
pointerEvents:"none",
filter:"grayscale(.45)"
},

successText:{
color:"#32ffb5"
},

warningText:{
color:"#ffd54f"
},

dangerText:{
color:"#ff6d88"
},

infoText:{
color:"#79ffff"
},

gradientText:{
background:"linear-gradient(90deg,#00ffff,#00ffb8)",
WebkitBackgroundClip:"text",
WebkitTextFillColor:"transparent"
},

neonBorder:{
border:"1px solid rgba(0,255,255,.18)",
boxShadow:"0 0 22px rgba(0,255,255,.15)"
},

absoluteFill:{
position:"absolute",
top:0,
right:0,
bottom:0,
left:0
},
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

  {!user ? (
    <section style={{ maxWidth: '360px', margin: '60px auto 0 auto' }}>
      <div style={styles.flatCard}>
        <h2 style={{ textAlign: 'center', fontSize: '18px', fontWeight: '500', margin: '0 0 24px 0', color: '#ffffff', letterSpacing: '0.3px' }}>
          Master Portal Login
        </h2>
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
          <input 
            type="email" 
            placeholder="Merchant Email" 
            value={email} 
            onChange={e => setEmail(e.target.value)} 
            style={styles.input} 
          />
          <input 
            type="password" 
            placeholder="Access Password" 
            value={password} 
            onChange={e => setPassword(e.target.value)} 
            style={styles.input} 
          />
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
    
<main className="relative flex h-screen w-full overflow-hidden bg-[#050816] text-white">

    {/* Animated Background */}

    <div className="absolute inset-0 overflow-hidden pointer-events-none">

        <div className="absolute -top-60 -left-60 h-[700px] w-[700px] rounded-full bg-cyan-500/10 blur-[170px]" />

        <div className="absolute bottom-[-250px] right-[-150px] h-[650px] w-[650px] rounded-full bg-emerald-400/10 blur-[190px]" />

        <div className="absolute left-1/2 top-1/2 h-[550px] w-[550px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-sky-500/5 blur-[180px]" />

    </div>



{/* =======================================================
                    LEFT SIDEBAR
======================================================= */}

<aside
className="
relative
z-20
hidden
lg:flex
flex-col
w-[285px]
border-r
border-cyan-500/20
bg-[#08111f]/90
backdrop-blur-2xl
">

{/* Logo */}

<div
className="
flex
items-center
gap-4
px-6
py-6
border-b
border-cyan-500/20
">

<div
className="
flex
h-14
w-14
items-center
justify-center
rounded-2xl
bg-cyan-500/10
ring-1
ring-cyan-400/30
shadow-[0_0_25px_rgba(0,255,255,.25)]
">

<img
  src="/RuachAgentLogo.png"
      alt="RuachAgent"

className="h-10 w-10 object-contain"

/>

</div>

<div>

<h1
className="
text-xl
font-bold
tracking-wide
text-cyan-300
">

RUACHAGENT

</h1>

<p
className="
text-sm
text-slate-400
">

AI Till Slip Maker

</p>

</div>

</div>



{/* New Conversation */}

<div className="px-5 pt-6">

<button

type="button"

className="
group
flex
w-full
items-center
justify-center
gap-3
rounded-2xl
border
border-cyan-400/20
bg-gradient-to-r
from-cyan-500
to-emerald-500
px-5
py-4
font-semibold
text-black
transition-all
duration-300
hover:scale-[1.02]
hover:shadow-[0_0_35px_rgba(0,255,255,.45)]
">

<Plus size={21} />

<span>

New Conversation

</span>

</button>

</div>



{/* Navigation */}

<nav className="mt-8 flex-1 px-4 space-y-2">

<button

className="
flex
w-full
items-center
gap-4
rounded-2xl
border
border-cyan-500/20
bg-cyan-500/10
px-5
py-4
transition
hover:bg-cyan-500/20
">

<MessageSquare size={20} />

<div className="text-left">

<p className="font-medium">

Chat with AI

</p>

<p className="text-xs text-slate-400">

Main Workspace

</p>

</div>

</button>



<button

className="
flex
w-full
items-center
gap-4
rounded-2xl
px-5
py-4
transition
hover:bg-cyan-500/10
">

<Bookmark size={20}/>

<div className="text-left">

<p>

Saved Designs

</p>

<p className="text-xs text-slate-500">

Templates

</p>

</div>

</button>



<button

className="
flex
w-full
items-center
gap-4
rounded-2xl
px-5
py-4
transition
hover:bg-cyan-500/10
">

<Store size={20}/>

<div>

<p>

Connected Stores

</p>

<p className="text-xs text-slate-500">

Webhooks

</p>

</div>

</button>



<button

className="
flex
w-full
items-center
gap-4
rounded-2xl
px-5
py-4
transition
hover:bg-cyan-500/10
">

<Receipt size={20}/>

<div>

<p>

Till Slips Sent

</p>

<p className="text-xs text-slate-500">

History

</p>

</div>

</button>



<button

className="
flex
w-full
items-center
gap-4
rounded-2xl
px-5
py-4
transition
hover:bg-cyan-500/10
">

<Settings size={20}/>

<div>

<p>

Settings

</p>

<p className="text-xs text-slate-500">

Admin & Personal

</p>

</div>

</button>

</nav>



{/* Bottom User Card */}

<div
className="
m-5
rounded-3xl
border
border-cyan-500/20
bg-[#0b1628]
p-4
shadow-[0_0_35px_rgba(0,255,255,.08)]
">

<div className="flex items-center gap-4">

<div
className="
flex
h-12
w-12
items-center
justify-center
rounded-full
bg-cyan-500
font-bold
text-black
">

{user?.email?.charAt(0).toUpperCase() || "U"}

</div>

<div className="flex-1">

<p className="font-semibold">

{profile?.full_name || "Merchant"}

</p>

<p className="text-xs text-slate-400">

{user?.email}

</p>

</div>

</div>

<div className="mt-5">

<div
className="
inline-flex
rounded-full
bg-emerald-500/20
px-4
py-2
text-sm
font-semibold
text-emerald-300
">

PRO PLAN

</div>

</div>

</div>

</aside>



{/* =======================================================
                    CHAT SECTION
======================================================= */}

<section

className="
relative
z-20
flex
min-w-0
flex-1
flex-col
">

  {/* =======================================================
                    CHAT HEADER
======================================================= */}

<div
    className="
    border-b
    border-cyan-500/20
    bg-[#08111f]/70
    backdrop-blur-xl
    ">

    <div className="flex items-center justify-between px-10 py-6">

        <div className="flex items-center gap-5">

            <div
                className="
                relative
                flex
                h-16
                w-16
                items-center
                justify-center
                rounded-2xl
                bg-cyan-500/10
                ring-1
                ring-cyan-400/40
                shadow-[0_0_30px_rgba(0,255,255,.35)]
                ">

                <img
  src="/RuachAgentLogo.png"
                    alt=""
                    className="h-10 w-10 object-contain"
                />

                <span
                    className="
                    absolute
                    bottom-1
                    right-1
                    h-3
                    w-3
                    rounded-full
                    bg-emerald-400
                    animate-ping
                    "
                />

                <span
                    className="
                    absolute
                    bottom-1
                    right-1
                    h-3
                    w-3
                    rounded-full
                    bg-emerald-400
                    "
                />

            </div>

            <div>

                <h2
                    className="
                    text-2xl
                    font-bold
                    tracking-wide
                    text-cyan-300
                    ">

                    RuachAgent AI

                </h2>

                <div className="flex items-center gap-2">

                    <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"/>

                    <p className="text-sm text-emerald-300">

                        Online

                    </p>

                </div>

                <p className="mt-2 text-sm text-slate-400">

                    I can help manage receipts, analytics, webhooks, business settings and everything inside your dashboard.

                </p>

            </div>

        </div>



        <div className="flex items-center gap-5">

            <div className="hidden xl:block text-right">

                <p className="text-sm text-slate-500">

                    Logged in as

                </p>

                <p className="font-medium">

                    {user?.email}

                </p>

            </div>

            <button
                className="
                rounded-xl
                border
                border-red-500/40
                px-5
                py-3
                text-red-300
                transition
                hover:bg-red-500/10
                ">

                Disconnect

            </button>

        </div>

    </div>

</div>



{/* =======================================================
                    CHAT BODY
======================================================= */}

<div className="relative flex-1 overflow-hidden">

<div
className="
absolute
inset-0
bg-[radial-gradient(circle_at_center,rgba(0,255,255,.05),transparent_65%)]
"/>

<div
ref={messagesEndRef}
className="
relative
z-10
flex
h-full
flex-col
overflow-y-auto
px-12
py-10
space-y-8
scroll-smooth
">




{/* AI MESSAGE */}

<div className="flex gap-5">

<div
className="
flex
h-14
w-14
items-center
justify-center
rounded-full
bg-cyan-500/10
ring-1
ring-cyan-500/30
">

<img
  src="/RuachAgentLogo.png"
className="h-8 w-8"
/>

</div>

<div
className="
max-w-3xl
rounded-3xl
border
border-cyan-500/20
bg-[#101827]/80
backdrop-blur-xl
p-7
shadow-[0_0_35px_rgba(0,255,255,.08)]
">

<p className="font-semibold text-cyan-300">

RuachAgent AI

</p>

<p className="mt-3 leading-8 text-slate-300">

Welcome back.

Everything inside this dashboard can now be managed using natural language.

I can:

• Generate till slips

• Connect stores

• Upload logos

• Edit business settings

• View analytics

• Sync webhooks

• Search receipts

• Explain dashboard features

Simply ask me anything.

</p>

<p className="mt-5 text-xs text-slate-500">

11:52 AM

</p>

</div>

</div>





{/* USER MESSAGE */}

<div className="flex justify-end">

<div
className="
max-w-xl
rounded-3xl
bg-[#182230]
px-7
py-6
shadow-[0_0_25px_rgba(0,255,255,.06)]
">

<p className="font-medium">

You

</p>

<p className="mt-3">

How do I connect my Shopify store?

</p>

<p className="mt-4 text-right text-xs text-slate-500">

11:53 AM

</p>

</div>

</div>





{/* AI RESPONSE */}

<div className="flex gap-5">

<div
className="
flex
h-14
w-14
items-center
justify-center
rounded-full
bg-cyan-500/10
">

<img
  src="/RuachAgentLogo.png"
className="h-8 w-8"
/>

</div>

<div
className="
max-w-3xl
rounded-3xl
border
border-cyan-500/20
bg-[#101827]/80
p-7
">

<p className="font-semibold text-cyan-300">

RuachAgent AI

</p>

<p className="mt-4 leading-8 text-slate-300">

To connect Shopify:

1. Open Connected Stores.

2. Click Add Store.

3. Copy your webhook URL.

4. Paste it into Shopify → Notifications → Webhooks.

5. Save.

Your receipts will begin syncing automatically.

</p>

<p className="mt-5 text-xs text-slate-500">

11:53 AM

</p>

</div>

</div>






{/* TYPING */}

{isThinking && (

<div className="flex gap-5">

<div
className="
flex
h-14
w-14
items-center
justify-center
rounded-full
bg-cyan-500/10
">

<img
  src="/RuachAgentLogo.png"
className="h-8 w-8"
/>

</div>

<div
className="
rounded-3xl
border
border-cyan-500/20
bg-[#101827]
px-7
py-6
">

<div className="flex gap-2">

<div className="h-3 w-3 rounded-full bg-cyan-400 animate-bounce"/>

<div className="h-3 w-3 rounded-full bg-cyan-400 animate-bounce delay-100"/>

<div className="h-3 w-3 rounded-full bg-cyan-400 animate-bounce delay-200"/>

</div>

</div>

</div>

)}





{/* Suggested Prompts */}

<div className="flex flex-wrap gap-3 pt-6">

{[
"Generate today's till slips",
"Explain analytics",
"Upload business logo",
"Connect my Shopify store",
"Show today's receipts",
"Change discount to 15%"
].map((prompt)=>(

<button

key={prompt}

onClick={()=>setPrompt(prompt)}

className="
rounded-full
border
border-cyan-500/20
bg-cyan-500/5
px-5
py-3
text-sm
transition
hover:border-cyan-400
hover:bg-cyan-500/15
hover:shadow-[0_0_20px_rgba(0,255,255,.2)]
">

{prompt}

</button>

))}

</div>

</div>

</div>

{/* =======================================================
                    AI PROMPT COMPOSER
======================================================= */}

<div
className="
relative
z-20
border-t
border-cyan-500/20
bg-[#08111f]/90
backdrop-blur-2xl
">

<div className="px-8 py-7">

<div
className="
relative
overflow-hidden
rounded-[28px]
border
border-cyan-500/20
bg-[#0b1628]
shadow-[0_0_45px_rgba(0,255,255,.08)]
">

{/* Animated Neon Border */}

<div
className="
pointer-events-none
absolute
inset-0
rounded-[28px]
bg-gradient-to-r
from-cyan-400/0
via-cyan-400/20
to-emerald-400/0
opacity-70
animate-pulse
"
/>

<div className="relative z-10 p-6">

{/* INPUT */}

<textarea

value={prompt}

onChange={(e)=>setPrompt(e.target.value)}

rows={2}

placeholder="Ask RuachAgent AI anything..."

className="
w-full
resize-none
border-none
bg-transparent
text-[16px]
leading-8
text-white
placeholder:text-slate-500
focus:outline-none
"
/>

{/* Bottom Toolbar */}

<div className="mt-6 flex flex-wrap items-center justify-between gap-5">

{/* LEFT */}

<div className="flex flex-wrap items-center gap-3">

<button

className="
group
flex
h-12
w-12
items-center
justify-center
rounded-xl
border
border-cyan-500/20
bg-cyan-500/5
transition-all
duration-300
hover:border-cyan-400
hover:bg-cyan-500/15
hover:shadow-[0_0_25px_rgba(0,255,255,.25)]
">

<Paperclip
size={20}
className="transition group-hover:rotate-12"
/>

</button>

<button

className="
group
flex
h-12
w-12
items-center
justify-center
rounded-xl
border
border-cyan-500/20
bg-cyan-500/5
transition-all
duration-300
hover:border-cyan-400
hover:bg-cyan-500/15
hover:shadow-[0_0_25px_rgba(0,255,255,.25)]
">

<ImageIcon
size={20}
className="transition group-hover:scale-110"
/>

</button>

<button

className="
group
flex
h-12
w-12
items-center
justify-center
rounded-xl
border
border-cyan-500/20
bg-cyan-500/5
transition-all
duration-300
hover:border-cyan-400
hover:bg-cyan-500/15
hover:shadow-[0_0_25px_rgba(0,255,255,.25)]
">

<Mic
size={20}
className="transition group-hover:text-cyan-300"
/>

</button>

<div
className="
hidden
xl:flex
items-center
gap-3
rounded-xl
border
border-cyan-500/20
bg-cyan-500/5
px-4
py-3
">

<Sparkles
size={18}
className="text-cyan-300"
/>

<p className="text-sm text-slate-300">

AI Agent Ready

</p>

</div>

</div>

{/* RIGHT */}

<div className="flex items-center gap-4">

<p className="hidden lg:block text-sm text-slate-500">

Press Enter to send

</p>

<button

onClick={handleSendMessage}

disabled={!prompt.trim()}

className="
group
flex
items-center
gap-3
rounded-2xl
bg-gradient-to-r
from-cyan-400
to-emerald-400
px-7
py-4
font-semibold
text-black
transition-all
duration-300
hover:scale-[1.04]
hover:shadow-[0_0_35px_rgba(0,255,255,.45)]
disabled:cursor-not-allowed
disabled:opacity-40
">

<SendHorizontal
size={20}
className="
transition-transform
group-hover:translate-x-1
"/>

<span>

Send

</span>

</button>

</div>

</div>

</div>

</div>

{/* FOOTER */}

<div className="mt-5 flex flex-wrap items-center justify-between gap-4">

<div className="flex flex-wrap items-center gap-5">

<div className="flex items-center gap-2">

<div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"/>

<p className="text-sm text-slate-400">

RuachAgent AI Online

</p>

</div>

<div className="hidden md:flex items-center gap-2">

<ShieldCheck
size={16}
className="text-cyan-300"
/>

<p className="text-sm text-slate-500">

Encrypted Workspace

</p>

</div>

<div className="hidden xl:flex items-center gap-2">

<Cpu
size={16}
className="text-cyan-300"
/>

<p className="text-sm text-slate-500">

Neural Receipt Engine

</p>

</div>

</div>

<div className="flex items-center gap-5">

<div className="text-right">

<p className="text-xs text-slate-500">

Conversation Memory

</p>

<p className="font-medium text-cyan-300">

Enabled

</p>

</div>

<div className="text-right">

<p className="text-xs text-slate-500">

Current Model

</p>

<p className="font-medium text-emerald-300">

RuachAgent AI v1

</p>

</div>

</div>

</div>

</div>

</div>

</section>

{/* =======================================================
                    RIGHT SIDEBAR
======================================================= */}

<aside
className="
hidden
2xl:flex
w-[430px]
flex-col
border-l
border-cyan-500/20
bg-[#07101d]/95
backdrop-blur-2xl
overflow-y-auto
">

{/* ===============================
        HEADER
================================ */}

<div
className="
sticky
top-0
z-30
border-b
border-cyan-500/20
bg-[#07101d]/95
backdrop-blur-xl
px-7
py-6
">

<div className="flex items-center justify-between">

<div>

<h2
className="
text-xl
font-bold
text-cyan-300
tracking-wide
">

Workspace

</h2>

<p className="mt-2 text-sm text-slate-400">

Everything updates live while you chat.

</p>

</div>

<div
className="
flex
h-12
w-12
items-center
justify-center
rounded-xl
bg-cyan-500/10
ring-1
ring-cyan-500/30
">

<Activity size={22}/>

</div>

</div>

</div>



{/* ==========================================
        AGENT PARAMETERS
========================================== */}

<div className="p-7">

<div
className="
rounded-3xl
border
border-cyan-500/20
bg-[#101827]/80
backdrop-blur-xl
shadow-[0_0_40px_rgba(0,255,255,.08)]
">

<div className="border-b border-cyan-500/20 px-6 py-5">

<div className="flex items-center gap-3">

<Bot
size={21}
className="text-cyan-300"
/>

<h3
className="
font-bold
tracking-wide
text-cyan-300
">

Agent Parameters

</h3>

</div>

</div>

<div className="space-y-6 p-6">

{/* Temperature */}

<div>

<div className="flex justify-between">

<p className="text-sm text-slate-400">

Temperature

</p>

<p className="font-medium">

0.8

</p>

</div>

<input

type="range"

min="0"

max="1"

step="0.1"

defaultValue="0.8"

className="
mt-3
w-full
accent-cyan-400
cursor-pointer
"

/>

</div>



{/* Creativity */}

<div>

<div className="flex justify-between">

<p className="text-sm text-slate-400">

Creativity

</p>

<p>

High

</p>

</div>

<input

type="range"

defaultValue="80"

className="
mt-3
w-full
accent-emerald-400
"

/>

</div>



{/* AI Voice */}

<div>

<p className="mb-3 text-sm text-slate-400">

Voice

</p>

<select

className="
w-full
rounded-xl
border
border-cyan-500/20
bg-[#162335]
px-4
py-3
outline-none
">

<option>

Ruach Female

</option>

<option>

Ruach Male

</option>

</select>

</div>



{/* Memory */}

<div className="flex items-center justify-between">

<div>

<p className="font-medium">

Conversation Memory

</p>

<p className="text-sm text-slate-500">

Remember previous chats

</p>

</div>

<label className="relative inline-flex cursor-pointer">

<input
type="checkbox"
defaultChecked
className="peer sr-only"
/>

<div
className="
h-7
w-14
rounded-full
bg-slate-700
transition
peer-checked:bg-cyan-500
after:absolute
after:left-1
after:top-1
after:h-5
after:w-5
after:rounded-full
after:bg-white
after:transition-all
peer-checked:after:translate-x-7
"
/>

</label>

</div>

</div>

</div>



{/* ==========================================
        ANALYTICS
========================================== */}

<div
className="
mt-7
rounded-3xl
border
border-cyan-500/20
bg-[#101827]/80
shadow-[0_0_40px_rgba(0,255,255,.08)]
">

<div className="border-b border-cyan-500/20 px-6 py-5">

<div className="flex items-center gap-3">

<BarChart3
size={21}
className="text-cyan-300"
/>

<h3
className="
font-bold
tracking-wide
text-cyan-300
">

Analytics Overview

</h3>

</div>

</div>

<div className="grid grid-cols-2 gap-5 p-6">

<div
className="
rounded-2xl
bg-cyan-500/10
p-5
">

<p className="text-sm text-slate-400">

Receipts

</p>

<h2 className="mt-2 text-3xl font-bold">

{receipts?.length || 0}

</h2>

</div>

<div
className="
rounded-2xl
bg-emerald-500/10
p-5
">

<p className="text-sm text-slate-400">

Stores

</p>

<h2 className="mt-2 text-3xl font-bold">

{stores?.length || 0}

</h2>

</div>

<div
className="
rounded-2xl
bg-violet-500/10
p-5
">

<p className="text-sm text-slate-400">

Sent Today

</p>

<h2 className="mt-2 text-3xl font-bold">

243

</h2>

</div>

<div
className="
rounded-2xl
bg-orange-500/10
p-5
">

<p className="text-sm text-slate-400">

AI Accuracy

</p>

<h2 className="mt-2 text-3xl font-bold">

99.8%

</h2>

</div>

</div>

</div>



{/* ==========================================
        INTEGRATION ENDPOINT
========================================== */}

<div
className="
mt-7
rounded-3xl
border
border-cyan-500/20
bg-[#101827]/80
shadow-[0_0_40px_rgba(0,255,255,.08)]
">

<div className="border-b border-cyan-500/20 px-6 py-5">

<div className="flex items-center gap-3">

<Webhook
size={20}
className="text-cyan-300"
/>

<h3
className="
font-bold
tracking-wide
text-cyan-300
">

Integration Endpoint

</h3>

</div>

</div>

<div className="space-y-6 p-6">

<div>

<p className="mb-2 text-sm text-slate-400">

Webhook URL

</p>

<div
className="
rounded-xl
border
border-cyan-500/20
bg-[#162335]
p-4
break-all
text-sm
">

{webhookUrl ||
"https://api.ruachagent.ai/webhook"}

</div>

</div>

<button
className="
w-full
rounded-xl
bg-gradient-to-r
from-cyan-400
to-emerald-400
py-4
font-semibold
text-black
transition-all
hover:scale-[1.02]
hover:shadow-[0_0_35px_rgba(0,255,255,.35)]
">

Copy Endpoint

</button>

<button
className="
w-full
rounded-xl
border
border-cyan-500/20
bg-cyan-500/5
py-4
transition
hover:bg-cyan-500/15
">

Test Connection

</button>

<button
className="
w-full
rounded-xl
border
border-red-500/20
bg-red-500/5
py-4
text-red-300
transition
hover:bg-red-500/10
">

Disconnect Store

</button>

</div>

</div>



{/* ==========================================
        AI SYSTEM STATUS
========================================== */}

<div
className="
mt-7
rounded-3xl
border
border-cyan-500/20
bg-gradient-to-br
from-cyan-500/10
to-emerald-500/10
p-6
">

<div className="flex items-center gap-3">

<Cpu
size={22}
className="text-cyan-300"
/>

<div>

<h3 className="font-semibold">

RuachAgent Neural Core

</h3>

<p className="text-sm text-slate-400">

Everything is synchronized

</p>

</div>

</div>

<div className="mt-6 space-y-4">

<div className="flex justify-between">

<span className="text-slate-400">

Supabase

</span>

<span className="text-emerald-300">

Connected

</span>

</div>

<div className="flex justify-between">

<span className="text-slate-400">

Webhook

</span>

<span className="text-emerald-300">

Online

</span>

</div>

<div className="flex justify-between">

<span className="text-slate-400">

AI Engine

</span>

<span className="text-cyan-300">

Running

</span>

</div>

<div className="flex justify-between">

<span className="text-slate-400">

Receipt Generator

</span>

<span className="text-emerald-300">

Ready

</span>

</div>

</div>

</div>

</div>

</aside>

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
                          Transaction
                        </div>

                        <div style={{
                          marginTop: '4px',
                          fontSize: '11px',
                          color: '#94a3b8',
                          lineHeight: '1.5'
                        }}>
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
            </main>
  )}
    </div>
  );
}

// - In the next phase, you can replace the placeholder values (such as 243, 99.8%, or the default webhook URL) with your live AdminPanel state and connect the buttons directly to your existing async functions.
// Be precise when asking the ai to replace those placeholders
// Don't forget.