import React, { useState } from "react";
import { registerUser } from "../services/api";
import ShaderBackground from "../components/ShaderBackground";

function RegisterPage() {
  const [form, setForm] = useState({
    username: "",
    password: "",
    role: "USER"
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleRegister = async () => {
    if (!form.username || !form.password) {
      alert("Enter username & password");
      return;
    }

    try {
      setLoading(true);
      const data = await registerUser(form);

      if (data.status === "success") {
        alert(`Registration successful as ${form.role}! Please login.`);
        window.location.href = "/login";
      } else {
        alert(data.message || "Registration failed");
      }
    } catch (err) {
      console.error(err);
      alert("Backend not running or error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper" style={{ position: "relative", minHeight: "90vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      {/* 🌌 WEBGL ANIMATED SHADER BACKGROUND */}
      <ShaderBackground />

      {/* 📝 GLASSMORPHIC REGISTER CARD */}
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
          📝 Create Account
        </h1>

        <input type="text" name="username" placeholder="Choose Username" value={form.username} onChange={handleChange} />
        <input type="password" name="password" placeholder="Choose Password" value={form.password} onChange={handleChange} />
        
        <label style={{ display: "block", textAlign: "left", fontSize: "13px", marginTop: "12px", color: "#a1a1aa" }}>Account Role:</label>
        <select name="role" value={form.role} onChange={handleChange} style={{ margin: "6px 0 18px 0", width: "100%" }}>
          <option value="USER">👤 Regular User (Take Quizzes)</option>
          <option value="ADMIN">👑 Admin (Manage Questions & CRUD)</option>
        </select>

        <button
          className="btn liquid-glass hover:scale-[1.03]"
          onClick={handleRegister}
          disabled={loading}
          style={{ width: "100%", borderRadius: "9999px", padding: "14px", fontSize: "1rem", fontWeight: "500", cursor: "pointer" }}
        >
          {loading ? "Registering..." : "Register"}
        </button>

        <p
          style={{ marginTop: "20px", fontSize: "14px", cursor: "pointer", color: "#00c6ff", fontWeight: "500" }}
          onClick={() => window.location.href = "/login"}
        >
          Already have an account? Login here →
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;
