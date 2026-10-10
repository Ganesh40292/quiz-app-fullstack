import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './assets/styles/main.css';
import App from './App';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './components/Toast';
import reportWebVitals from './reportWebVitals';

import ErrorBoundary from './components/ErrorBoundary';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <ThemeProvider>
        <ToastProvider>
          <App />
        </ToastProvider>
      </ThemeProvider>
    </ErrorBoundary>
  </React.StrictMode>
);

reportWebVitals();

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((reg) => {
        reg.onupdatefound = () => {
          const installingWorker = reg.installing;
          if (installingWorker) {
            installingWorker.onstatechange = () => {
              if (installingWorker.state === "installed" && navigator.serviceWorker.controller) {
                console.log("[ServiceWorker] New content available; please refresh.");
              }
            };
          }
        };
      })
      .catch((err) => console.error("Service worker registration failed: ", err));
  });
}