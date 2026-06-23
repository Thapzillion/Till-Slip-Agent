import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// === PROGRESSIVE WEB APP (PWA) SERVICE WORKER REGISTRATION ===
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js') // <-- Updated from /sw.js to match file name
      .then((registration) => {
        console.log('RuachAgent PWA registered successfully on scope: ', registration.scope);
      })
      .catch((error) => {
        console.error('RuachAgent PWA registration failed: ', error);
      });
  });
}