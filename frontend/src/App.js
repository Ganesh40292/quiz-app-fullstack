import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from "react-router-dom";

import Navbar from "./components/Navbar";
import QuizPage from "./pages/QuizPage";
import ResultPage from "./pages/ResultPage";
import AdminPage from "./pages/AdminPage";
import LoginPage from "./pages/LoginPage";

import RegisterPage from "./pages/RegisterPage";
import LeaderboardPage from "./pages/LeaderboardPage";
import HistoryPage from "./pages/HistoryPage";
import ProfilePage from "./pages/ProfilePage";
import HelpPage from "./pages/HelpPage";

/* =========================
   PROTECTED ROUTE WRAPPER
   Reads auth state on EVERY render so the
   browser back-button never forces a logout.
========================= */
function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to="/login" />;
  }
  return children;
}

function AdminRoute({ children }) {
  const token = localStorage.getItem("token");
  const role = (localStorage.getItem("role") || "").toLowerCase();
  if (!token || role !== "admin") {
    return <Navigate to="/login" />;
  }
  return children;
}

function GuestRoute({ children }) {
  const token = localStorage.getItem("token");
  if (token) {
    return <Navigate to="/" />;
  }
  return children;
}

function App() {
  return (
    <Router>
      <Navbar />

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
        <Route path="*" element={<h1>404</h1>} />

      </Routes>
    </Router>
  );
}

export default App;