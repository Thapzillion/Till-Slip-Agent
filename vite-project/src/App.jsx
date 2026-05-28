import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AdminPanel from './AdminPanel';
import ReceiptView from './ReceiptView';

export default function App() {
  return (
    <Router>
      <Routes>
        {/* SAFE PRODUCTION NAVIGATION CONTROL */}
        {/* Removed the :businessId parameter entirely so it stops hijacking your session states */}
        <Route path="/admin" element={<AdminPanel />} />
        
        {/* The Standalone Customer Document Engine Route */}
        <Route path="/receipt/:id" element={<ReceiptView />} />
        
        {/* Clean, safe default fallback routing */}
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </Router>
  );
}