
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import './index.css';
import { Toaster } from 'sonner';
import { register } from './registerSW';

// Enregistrement du service worker
register();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/*" element={<App />} />
      </Routes>
    </BrowserRouter>
    <Toaster richColors closeButton position="top-right" />
  </React.StrictMode>,
);
