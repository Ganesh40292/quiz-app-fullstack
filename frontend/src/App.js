import React, { lazy, Suspense } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from "react-router-dom";

import Navbar from "./components/Navbar";

// Instant initial page imports
import LoginPage from "./pages/LoginPage";
import QuizPage from "./pages/QuizPage";

// Lazy-loaded routes for code splitting & bundle optimization
const ResultPage = lazy(() => import("./pages/ResultPage"));
const AdminPage = lazy(() => import("./pages/AdminPage"));
const RegisterPage = lazy(() => import("./pages/RegisterPage"));
const LeaderboardPage = lazy(() => import("./pages/LeaderboardPage"));
const HistoryPage = lazy(() => import("./pages/HistoryPage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const HelpPage = lazy(() => import("./pages/HelpPage"));
const TermsPage = lazy(() => import("./pages/TermsPage"));
const PrivacyPolicyPage = lazy(() => import("./pages/PrivacyPolicyPage"));

/* =========================
   PAGE LOADING FALLBACK
========================= */
function PageLoader() {
  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "60vh",
      color: "#00c6ff",
      fontSize: "1.2rem",
      fontWeight: "600",
      letterSpacing: "1px"
    }}>
      <div style={{
        width: "40px",
        height: "40px",
        border: "3px solid rgba(0, 198, 255, 0.2)",
        borderTop: "3px solid #00c6ff",
        borderRadius: "50%",
        animation: "spin 0.8s linear infinite",
        marginRight: "12px"
      }} />
      Loading...
    </div>
  );
}

/* =========================
   PROTECTED ROUTE WRAPPERS & TOKEN VALIDATION
   Ensures stale, expired, or tampered tokens are cleared cleanly.
========================= */
const parseJwtPayload = (token) => {
  try {
    const base64Url = token.split(".")[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
};

const clearAuthSession = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  localStorage.removeItem("username");
  localStorage.removeItem("email");
};

const getValidToken = () => {
  const token = localStorage.getItem("token");
  if (!token || token === "undefined" || token === "null" || token.trim() === "") {
    clearAuthSession();
    return null;
  }

  const payload = parseJwtPayload(token);
  // Auto-clear if token exp is in the past
  if (payload && payload.exp && payload.exp * 1000 < Date.now()) {
    clearAuthSession();
    return null;
  }

  return token;
};

function ProtectedRoute({ children }) {
  const token = getValidToken();
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function AdminRoute({ children }) {
  const token = getValidToken();
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  const payload = parseJwtPayload(token);
  const tokenRole = payload?.role ? payload.role.toLowerCase() : "";
  const storedRole = (localStorage.getItem("role") || "").toLowerCase();

  if (tokenRole !== "admin" && storedRole !== "admin") {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function GuestRoute({ children }) {
  const token = getValidToken();
  if (token) {
    return <Navigate to="/" replace />;
  }
  return children;
}

function App() {
  React.useEffect(() => {
    // Background pre-warm ping for Render cold starts
    const rawUrl = process.env.REACT_APP_API_URL || "http://localhost:8080/api";
    const healthUrl = rawUrl.replace(/\/api\/?$/, "") + "/actuator/health";
    fetch(healthUrl).catch(() => {});
  }, []);

  return (
    <Router>
      <Navbar />

      <Suspense fallback={<PageLoader />}>
        <Routes>

          {/* 🔐 HOME — Quiz (Protected) */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <QuizPage />
              </ProtectedRoute>
            }
          />

          {/* 🔐 LOGIN PAGE (Guest Only) */}
          <Route
            path="/login"
            element={
              <GuestRoute>
                <LoginPage />
              </GuestRoute>
            }
          />

          {/* 📝 REGISTER PAGE (Guest Only) */}
          <Route
            path="/register"
            element={
              <GuestRoute>
                <RegisterPage />
              </GuestRoute>
            }
          />

          {/* 🟡 RESULT (PROTECTED) */}
          <Route
            path="/result"
            element={
              <ProtectedRoute>
                <ResultPage />
              </ProtectedRoute>
            }
          />

          {/* 🏆 LEADERBOARD (Protected - Requires Login) */}
          <Route
            path="/leaderboard"
            element={
              <ProtectedRoute>
                <LeaderboardPage />
              </ProtectedRoute>
            }
          />

          {/* 👤 MY HISTORY (PROTECTED) */}
          <Route
            path="/history"
            element={
              <ProtectedRoute>
                <HistoryPage />
              </ProtectedRoute>
            }
          />

          {/* 👤 USER PROFILE (PROTECTED) */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />

          {/* ❓ HELP & CONTACT (PROTECTED) */}
          <Route
            path="/help"
            element={
              <ProtectedRoute>
                <HelpPage />
              </ProtectedRoute>
            }
          />

          {/* 🔴 ADMIN (Admin Only) */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminPage />
              </AdminRoute>
            }
          />

          {/* 📜 TERMS & CONDITIONS (Public) */}
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/terms-and-conditions" element={<TermsPage />} />

          {/* 🛡️ PRIVACY POLICY (Public) */}
          <Route path="/privacy" element={<PrivacyPolicyPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />

          {/* ⚠️ 404 */}
          <Route path="*" element={<h1 style={{ textAlign: "center", marginTop: "50px", color: "#fff" }}>404 - Page Not Found</h1>} />

        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;