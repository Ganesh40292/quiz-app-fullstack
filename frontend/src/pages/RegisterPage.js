import React, { useState, useEffect } from "react";
import { registerUser, googleLogin } from "../services/api";
import ShaderBackground from "../components/ShaderBackground";
import LegalDocModal from "../components/LegalDocModal";

function RegisterPage() {
  const [form, setForm] = useState({
    username: "",
    password: "",
    role: "USER"
  });
  const [loading, setLoading] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [modalType, setModalType] = useState(null); // 'terms' | 'privacy' | null

  /* =========================
     GOOGLE OAUTH HANDLER
  ========================= */
  const handleGoogleResponse = async (response) => {
    try {
      setLoading(true);
      // Decode JWT payload from Google
      const base64Url = response.credential.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      const payload = JSON.parse(jsonPayload);

      const res = await googleLogin({
        email: payload.email,
        name: payload.name || payload.given_name
      });

      if (res.status === "success") {
        localStorage.setItem("token", res.token);
        localStorage.setItem("role", res.role);
        localStorage.setItem("username", res.username);
        localStorage.setItem("email", res.email);
        window.location.href = res.role.toLowerCase() === "admin" ? "/admin" : "/";
      } else {
        alert(res.message || "Google registration failed.");
      }
    } catch (err) {
      console.error("Google Auth error:", err);
      alert("Failed to authenticate with Google.");
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     GOOGLE OAUTH HANDLER & CLICK
  ========================= */
  const handleGoogleClick = () => {
    if (!acceptedTerms) {
      alert("Please accept the Terms & Conditions and Privacy Policy before continuing with Google.");
      return;
    }

    const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID || "349278238147-e2j6a56t4kfqgqlvsq9iq4dodm4j0b4m.apps.googleusercontent.com";
    
    if (window.google?.accounts?.id) {
      try {
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: handleGoogleResponse
        });
        window.google.accounts.id.prompt();
      } catch (err) {
        console.error("Google SDK error:", err);
      }
    } else {
      alert("Google Sign-In service is loading. Please click again in 2 seconds.");
    }
  };

  useEffect(() => {
    const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID || "349278238147-e2j6a56t4kfqgqlvsq9iq4dodm4j0b4m.apps.googleusercontent.com";
    if (window.google?.accounts?.id) {
      try {
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: handleGoogleResponse
        });
      } catch (err) {
        console.warn("Google SDK init error:", err);
      }
    }
  }, []);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleRegister = async () => {
    if (!acceptedTerms) {
      alert("Please accept the Terms & Conditions and Privacy Policy to proceed with registration.");
      return;
    }

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

        <input type="text" name="username" aria-label="Choose Username" autoComplete="username" placeholder="Choose Username" value={form.username} onChange={handleChange} />
        <input type="password" name="password" aria-label="Choose Password" autoComplete="new-password" placeholder="Choose Password" value={form.password} onChange={handleChange} />
        
        <label htmlFor="role-select" style={{ display: "block", textAlign: "left", fontSize: "13px", marginTop: "12px", color: "#a1a1aa" }}>Account Role:</label>
        <select id="role-select" name="role" aria-label="Account Role" value={form.role} onChange={handleChange} style={{ margin: "6px 0 14px 0", width: "100%" }}>
          <option value="USER">👤 Regular User (Take Quizzes)</option>
          <option value="ADMIN">👑 Admin (Manage Questions & CRUD)</option>
        </select>

        {/* 📜 MANDATORY TERMS & PRIVACY CHECKBOX */}
        <div style={{ display: "flex", alignItems: "flex-start", gap: "10px", margin: "14px 0 18px", textAlign: "left" }}>
          <input
            type="checkbox"
            id="register-terms"
            checked={acceptedTerms}
            onChange={(e) => setAcceptedTerms(e.target.checked)}
            style={{
              marginTop: "3px",
              width: "18px",
              height: "18px",
              accentColor: "#00c6ff",
              cursor: "pointer",
              flexShrink: 0
            }}
          />
          <label htmlFor="register-terms" style={{ fontSize: "0.83rem", color: "#cbd5e1", lineHeight: "1.45", cursor: "pointer" }}>
            I agree to the{" "}
            <button
              type="button"
              onClick={(e) => { e.preventDefault(); setModalType("terms"); }}
              style={{
                background: "none",
                border: "none",
                color: "#00c6ff",
                padding: 0,
                textDecoration: "underline",
                cursor: "pointer",
                fontWeight: "600",
                fontSize: "0.83rem"
              }}
            >
              Terms & Conditions
            </button>{" "}
            and{" "}
            <button
              type="button"
              onClick={(e) => { e.preventDefault(); setModalType("privacy"); }}
              style={{
                background: "none",
                border: "none",
                color: "#00c6ff",
                padding: 0,
                textDecoration: "underline",
                cursor: "pointer",
                fontWeight: "600",
                fontSize: "0.83rem"
              }}
            >
              Privacy Policy
            </button>
            .
          </label>
        </div>

        <button
          className="btn liquid-glass hover:scale-[1.03]"
          onClick={handleRegister}
          disabled={loading || !acceptedTerms}
          style={{
            width: "100%",
            borderRadius: "9999px",
            padding: "14px",
            fontSize: "1rem",
            fontWeight: "500",
            cursor: acceptedTerms && !loading ? "pointer" : "not-allowed",
            opacity: acceptedTerms && !loading ? 1 : 0.6
          }}
        >
          {loading ? "Registering..." : "Register"}
        </button>

        {/* 🔘 SEPARATOR */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", margin: "20px 0 16px" }}>
          <div style={{ flex: 1, height: "1px", background: "rgba(255, 255, 255, 0.15)" }} />
          <span style={{ fontSize: "0.8rem", color: "#a1a1aa", textTransform: "uppercase" }}>OR</span>
          <div style={{ flex: 1, height: "1px", background: "rgba(255, 255, 255, 0.15)" }} />
        </div>

        {/* 🌐 SIGN IN WITH GOOGLE BUTTON */}
        <button
          type="button"
          className="liquid-glass hover:scale-[1.02]"
          onClick={handleGoogleClick}
          disabled={!acceptedTerms}
          style={{
            width: "100%",
            borderRadius: "9999px",
            padding: "12px",
            fontSize: "0.95rem",
            fontWeight: "600",
            cursor: acceptedTerms ? "pointer" : "not-allowed",
            opacity: acceptedTerms ? 1 : 0.6,
            border: "1px solid rgba(255, 255, 255, 0.2)",
            background: "rgba(255, 255, 255, 0.08)",
            color: "#ffffff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
            transition: "all 0.25s ease"
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
          </svg>
          Sign in with Google
        </button>

        <p
          style={{ marginTop: "20px", fontSize: "14px", cursor: "pointer", color: "#00c6ff", fontWeight: "500" }}
          onClick={() => window.location.href = "/login"}
        >
          Already have an account? Login here →
        </p>
      </div>

      {/* 📜 MODAL READER FOR TERMS & PRIVACY */}
      <LegalDocModal
        isOpen={!!modalType}
        onClose={() => setModalType(null)}
        type={modalType}
      />
    </div>
  );
}

export default RegisterPage;
