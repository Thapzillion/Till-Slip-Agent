// RuachAgent Live Engine Link - Production Automation Node
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './LandingPage';
import AdminPanel from './AdminPanel';
import ReceiptView from './ReceiptView';

// SIDEBAR NAVIGATION PAGES
//PREVIEW
import Analysis from './Analysis';
import ConnectedStores from './ConnectedStores';

//SETTINGS
import TillSlipsCollection from './TillSlipsCollection';
import AgentParameters from './AgentParameters';

import PrivacyPolicy from './pages/PrivacyPolicy';
import Terms from './pages/Terms';
import Support from './pages/Support';

export default function App() {
  return (
    <Router>
      <Routes>
        {/* SAFE PRODUCTION NAVIGATION CONTROL */}

        {/* The index landing page loads immediately when hitting your domain */}
        <Route path="/" element={<LandingPage />} />

        {/* Removed the :businessId parameter entirely so it stops hijacking your session states */}
        <Route path="/admin" element={<AdminPanel />} />

        {/* The Standalone Customer Document Engine Route */}
        <Route path="/receipt/:id" element={<ReceiptView />} />

        {/*Pages for Sidebar Navigation*/}
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/support" element={<Support />} />

        {/* PREVIEW PAGES */}
        <Route path="/analysis" element={<Analysis />} />
        <Route path="/connected-stores" element={<ConnectedStores />} />

        {/* SETTINGS PAGES */}
        <Route path="/agent-parameters" element={<AgentParameters />} />
        <Route path="/till-slips-collection" element={<TillSlipsCollection />} />

        {/* Clean, safe default fallback routing */}
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </Router>
  );
}