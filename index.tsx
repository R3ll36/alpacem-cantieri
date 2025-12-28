import React from 'react';
import './index.css';
import { createRoot } from 'react-dom/client';
import App from './App';
import { ToastProvider } from './context/ToastContext';

const container = document.getElementById('root');
if (!container) {
  throw new Error("Could not find root element to mount to");
}

const root = createRoot(container);
root.render(
  <React.StrictMode>
    <ToastProvider>
      <App />
    </ToastProvider>
  </React.StrictMode>
);
