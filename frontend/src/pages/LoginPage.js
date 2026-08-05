import React, { useState } from "react";
import ShaderBackground from "../components/ShaderBackground";

function LoginPage() {
  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  /* =========================
     HANDLE INPUT
  ========================= */
  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  /* =========================
     HANDLE LOGIN
  ========================= */
  const handleLogin = async () => {
    console.log("Login clicked");

    if (!form.username || !form.password) {
      alert("Enter username & password");
      return;
    }

    try {
      setLoading(true);

      const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8080/api";
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        throw new Error("Server not responding");
      }

      const data = await res.json();
      console.log("RESPONSE:", data);

      if (data.status === "success") {
        // 🔐 Save auth
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.role);
        localStorage.setItem("username", data.username);

        // 🔁 Redirect (force refresh)
        window.location.href =
          data.role === "admin" ? "/admin" : "/";
      } else {
        alert(data.message || "Invalid credentials");
      }

    } catch (err) {
      console.error(err);
      alert("Backend not running or error occurred");
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     UI
  ========================= */
  return (
    <div className="login-wrapper" style={{ position: "relative", minHeight: "90vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      {/* 🌌 WEBGL ANIMATED SHADER BACKGROUND */}
      <ShaderBackground />

      {/* 🔐 GLASSMORPHIC LOGIN CARD */}
      <div
        className="login-box liquid-glass animate-fade-rise"
        style={{
          position: "relative",
          zIndex: 10,
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          background: "rgba(15, 23, 42, 0.65)",
          border: "1px solid rgba(255, 255, 255, 0.15)",
          boxShadow: "0 20px 50px rgba(0, 0, 0, 0.6), inset 0 1px 1px rgba(255, 255, 255, 0.2)",
          borderRadius: "24px",
          padding: "40px 36px",
          width: "100%",
          maxWidth: "420px"
        }}
      >
        <h1 className="login-title" style={{ fontFamily: "'Outfit', sans-serif", fontSize: "2rem", fontWeight: "700", letterSpacing: "-0.5px", marginBottom: "24px", color: "#ffffff" }}>
          🔐 Login to Quizora
        </h1>

        <input
          type="text"
          name="username"
          placeholder="Enter Username"
          value={form.username}
          onChange={handleChange}
        />

        <input
          type="password"
          name="password"
          placeholder="Enter Password"
          value={form.password}
          onChange={handleChange}
        />

        <button
          className="btn liquid-glass hover:scale-[1.03]"
          onClick={handleLogin}
          disabled={loading}
          style={{ width: "100%", marginTop: "15px", borderRadius: "9999px", padding: "14px", fontSize: "1rem", fontWeight: "500", cursor: "pointer" }}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {/* 🔹 Helper text */}
        <p style={{ marginTop: "16px", fontSize: "13px", color: "#a1a1aa" }}>
          Use admin / user credentials or register a new one.
        </p>

        <p
          style={{ marginTop: "16px", fontSize: "14px", cursor: "pointer", color: "#00c6ff", fontWeight: "500" }}
          onClick={() => window.location.href = "/register"}
        >
          Need an account? Register here →
        </p>
      </div>
    </div>
  );
}

export default LoginPage;