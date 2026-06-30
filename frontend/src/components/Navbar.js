import React from "react";
import { NavLink } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";

function Navbar() {

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const username = localStorage.getItem("username");

  const isLoggedIn = !!token;

  const getLinkClass = ({ isActive }) =>
    isActive ? "nav-link active-link" : "nav-link";

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <nav className="navbar">

      {/* 🔵 BOLD LOGO */}
      <NavLink to="/" className="logo">
        <b>🎯 Quiz App</b>
      </NavLink>

      <div className="nav-links">

        <NavLink to="/" className={getLinkClass}>
          Quiz
        </NavLink>

        <NavLink to="/leaderboard" className={getLinkClass}>
          Leaderboard
        </NavLink>

        {isLoggedIn && role === "admin" && (
          <NavLink to="/admin" className={getLinkClass}>
            Admin
          </NavLink>
        )}

        {isLoggedIn && (
          <NavLink to="/history" className={getLinkClass}>
            My History
          </NavLink>
        )}

        {isLoggedIn && (
          <NavLink to="/profile" className={getLinkClass} style={{ display: "inline-flex", alignItems: "center", gap: "5px" }}>
            👤 {username}
          </NavLink>
        )}

        <ThemeToggle />

        {!isLoggedIn ? (
          <NavLink to="/login" className={getLinkClass}>
            Login
          </NavLink>
        ) : (
          <button className="btn" style={{ margin: 0, padding: "8px 16px", fontSize: "14px" }} onClick={handleLogout}>
            Logout
          </button>
        )}

      </div>

    </nav>
  );
}

export default Navbar;