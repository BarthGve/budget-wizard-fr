
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { registerServiceWorker } from './registerSW'

// Enregistrement du service worker pour les fonctionnalités PWA
registerServiceWorker();

createRoot(document.getElementById("root")!).render(<App />);
