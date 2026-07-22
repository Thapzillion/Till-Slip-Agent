// RuachAgent Live Engine Link - Production Automation Node
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './LandingPage';
import AdminPanel from './AdminPanel';
import ReceiptView from './ReceiptView';
import Billing from "./Billing";

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

        <Route path="/billing" element={<Billing />} />
        
        {/*Pages for Privacy Policy, Terms and Support*/}
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/support" element={<Support />} />

        {/* Clean, safe default fallback routing */}
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </Router>
  );
}