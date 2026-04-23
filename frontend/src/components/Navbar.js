import React from "react";
import { NavLink } from "react-router-dom";

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
        <b>Quiz App</b>
      </NavLink>

      <div className="nav-links">

        <NavLink to="/" className={getLinkClass}>
          Quiz
        </NavLink>

        {isLoggedIn && role === "admin" && (
          <NavLink to="/admin" className={getLinkClass}>
            Admin
          </NavLink>
        )}

        {isLoggedIn && (
          <span style={{ marginLeft: "15px", color: "#fff" }}>
            👤 {username}
          </span>
        )}

        {!isLoggedIn ? (
          <NavLink to="/login" className={getLinkClass}>
            Login
          </NavLink>
        ) : (
          <button className="btn btn-small" onClick={handleLogout}>
            Logout
          </button>
        )}

      </div>

    </nav>
  );
}

export default Navbar;