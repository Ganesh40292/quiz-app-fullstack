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
   Ensures stale or "undefined" tokens are cleared cleanly.
========================= */
const getValidToken = () => {
  const token = localStorage.getItem("token");
  if (!token || token === "undefined" || token === "null" || token.trim() === "") {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("username");
    localStorage.removeItem("email");
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
  const role = (localStorage.getItem("role") || "").toLowerCase();
  if (!token || role !== "admin") {
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

          {/* 🏆 LEADERBOARD (Public) */}
          <Route
            path="/leaderboard"
            element={<LeaderboardPage />}
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

          {/* ⚠️ 404 */}
          <Route path="*" element={<h1 style={{ textAlign: "center", marginTop: "50px", color: "#fff" }}>404 - Page Not Found</h1>} />

        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;