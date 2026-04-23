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

function App() {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  return (
    <Router>
      <Navbar />

      <Routes>

        {/* 🔐 LOGIN FIRST */}
        <Route
          path="/"
          element={
            token ? <QuizPage /> : <Navigate to="/login" replace />
          }
        />

        {/* 🔐 LOGIN PAGE */}
        <Route
          path="/login"
          element={
            token ? <Navigate to="/" replace /> : <LoginPage />
          }
        />

        {/* 🟡 RESULT (PROTECTED) */}
        <Route
          path="/result"
          element={
            token ? <ResultPage /> : <Navigate to="/login" replace />
          }
        />

        {/* 🔴 ADMIN */}
        <Route
          path="/admin"
          element={
            token && role === "admin"
              ? <AdminPage />
              : <Navigate to="/login" replace />
          }
        />

        {/* ⚠️ 404 */}
        <Route path="*" element={<h1>404</h1>} />

      </Routes>
    </Router>
  );
}

export default App;