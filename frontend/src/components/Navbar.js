import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";
import { soundFx } from "../utils/audio";

function Navbar() {
  const [soundMuted, setSoundMuted] = useState(soundFx.isMuted);
  const token = localStorage.getItem("token");
  const role = (localStorage.getItem("role") || "").toLowerCase();
  const username = localStorage.getItem("username");

  const isLoggedIn = !!token;
  const isAdmin = isLoggedIn && role === "admin";

  const getLinkClass = ({ isActive }) =>
    isActive ? "nav-link active-link" : "nav-link";

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <nav className="navbar relative z-10 flex row justify-between items-center px-8 py-6 max-w-7xl mx-auto">

      {/* 🔵 CINEMATIC LOGO */}
      <NavLink to="/" className="logo" style={{ textDecoration: "none" }}>
        <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: "1.75rem", fontWeight: "700", letterSpacing: "-0.5px", color: "#ffffff" }}>
          Quizora<sup style={{ fontSize: "0.75rem", verticalAlign: "super" }}>®</sup>
        </span>
      </NavLink>

      <div className="nav-links flex items-center gap-6">

        {/* 📝 Quiz / Test Link */}
        <NavLink to="/" className={getLinkClass}>
          {isAdmin ? "🧪 Test Quiz" : "Home"}
        </NavLink>

        {/* 🏆 Leaderboard (Only when logged in) */}
        {isLoggedIn && (
          <NavLink to="/leaderboard" className={getLinkClass}>
            Leaderboard
          </NavLink>
        )}

        {/* 👑 Admin Dashboard (Admin Only) */}
        {isAdmin && (
          <NavLink to="/admin" className={getLinkClass} style={{ color: "#00c6ff", fontWeight: "bold" }}>
            👑 Admin Panel
          </NavLink>
        )}

        {/* 📜 My History */}
        {isLoggedIn && (
          <NavLink to="/history" className={getLinkClass}>
            My History
          </NavLink>
        )}

        {/* ❓ Help & Support */}
        {isLoggedIn && (
          <NavLink to="/help" className={getLinkClass}>
            Help
          </NavLink>
        )}

        {/* 👤 Profile */}
        {isLoggedIn && (
          <NavLink to="/profile" className={getLinkClass} style={{ display: "inline-flex", alignItems: "center", gap: "5px" }}>
            👤 {username} {isAdmin && <span style={{ fontSize: "10px", background: "#00c6ff", color: "#000", padding: "2px 6px", borderRadius: "10px", fontWeight: "bold" }}>ADMIN</span>}
          </NavLink>
        )}

        <button
          onClick={() => {
            const muted = soundFx.toggleMute();
            setSoundMuted(muted);
          }}
          aria-label={soundMuted ? "Unmute Audio Effects" : "Mute Audio Effects"}
          title={soundMuted ? "Unmute Audio Effects" : "Mute Audio Effects"}
          style={{
            background: "transparent",
            border: "none",
            fontSize: "1.2rem",
            cursor: "pointer",
            padding: "4px"
          }}
        >
          {soundMuted ? "🔇" : "🔊"}
        </button>

        <ThemeToggle />

        {!isLoggedIn ? (
          <NavLink to="/login" className={getLinkClass}>
            Login
          </NavLink>
        ) : (
          <button
            className="liquid-glass nav-cta-btn"
            style={{
              borderRadius: "9999px",
              padding: "8px 20px",
              fontSize: "0.875rem",
              color: "#ffffff",
              cursor: "pointer",
              border: "none"
            }}
            onClick={handleLogout}
          >
            Logout
          </button>
        )}

      </div>

    </nav>
  );
}

export default React.memo(Navbar);