import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './assets/styles/main.css';
import App from './App';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './components/Toast';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ThemeProvider>
      <ToastProvider>
        <App />
      </ToastProvider>
    </ThemeProvider>
  </React.StrictMode>
);

reportWebVitals();

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((reg) => console.log("Service worker registered successfully"))
      .catch((err) => console.error("Service worker registration failed: ", err));
  });
}