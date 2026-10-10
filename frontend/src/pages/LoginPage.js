import React, { useState, useEffect } from "react";
import ShaderBackground from "../components/ShaderBackground";
import { googleLogin, verifySecurityQuestion } from "../services/api";
import LegalDocModal from "../components/LegalDocModal";

function LoginPage() {
  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [showChallengeModal, setShowChallengeModal] = useState(false);
  const [challengeQuestion, setChallengeQuestion] = useState("");
  const [securityAnswer, setSecurityAnswer] = useState("");
  const [blockedError, setBlockedError] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);

  /* =========================
     GOOGLE OAUTH HANDLER
  ========================= */
  const handleGoogleResponse = async (response) => {
    try {
      setLoading(true);
      const res = await googleLogin({
        credential: response.credential
      });

      if (res.status === "success") {
        localStorage.setItem("token", res.token);
        localStorage.setItem("role", res.role);
        localStorage.setItem("username", res.username);
        localStorage.setItem("email", res.email);
        window.location.href = res.role.toLowerCase() === "admin" ? "/admin" : "/";
      } else {
        alert(res.message || "Google Login failed.");
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
      alert("Please accept the Terms & Conditions before continuing with Google.");
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
    if (!acceptedTerms) {
      alert("Please accept the Terms & Conditions to proceed with login.");
      return;
    }

    if (!form.username || !form.password) {
      alert("Enter username & password");
      return;
    }

    try {
      setLoading(true);
      setBlockedError("");

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

      if (data.status === "success") {
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.role);
        localStorage.setItem("username", data.username);
        window.location.href = data.role.toLowerCase() === "admin" ? "/admin" : "/";
      } else if (data.status === "challenge") {
        setShowChallengeModal(true);
        setChallengeQuestion(data.question || "What is the nickname of the creator of project?");
      } else if (data.status === "blocked") {
        setBlockedError(data.message || "You are not able to access admin");
        setShowChallengeModal(false);
        alert(data.message || "You are not able to access admin");
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
     HANDLE CREATOR SECURITY CHALLENGE
  ========================= */
  const handleVerifyChallenge = async () => {
    if (!securityAnswer || !securityAnswer.trim()) {
      alert("Please provide the answer to the security question.");
      return;
    }

    try {
      setLoading(true);
      const res = await verifySecurityQuestion({
        username: form.username,
        password: form.password,
        securityAnswer: securityAnswer.trim()
      });

      if (res.status === "success") {
        localStorage.setItem("token", res.token);
        localStorage.setItem("role", res.role);
        localStorage.setItem("username", res.username);
        setShowChallengeModal(false);
        window.location.href = res.role.toLowerCase() === "admin" ? "/admin" : "/";
      } else if (res.status === "blocked") {
        setShowChallengeModal(false);
        setBlockedError(res.message || "You are not able to access admin");

        // 🚨 Dispatch direct email alert to creator
        try {
          fetch("https://api.web3forms.com/submit", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              access_key: "1dd4eaeb-c34a-43de-9ea2-4a5b8fcf933b",
              name: "Quizora Security Sentinel",
              email: "security-alert@quizora.dev",
              subject: "[SECURITY ALERT] Unauthorized Admin Access Attempt on Quizora!",
              message: `🚨 CRITICAL SECURITY ALERT: Unauthorized Admin Access Attempt\n\nA user attempted to access administrative privileges (3+ failed attempts) and entered an incorrect answer to the creator's security challenge question.\n\n• Target Admin Account: ${form.username}\n• Incorrect Answer Entered: "${securityAnswer}"\n• Timestamp: ${new Date().toISOString()}\n• Result: User blocked with "You are not able to access admin".`
            })
          });
        } catch (e) {
          console.error("Alert email error:", e);
        }

        alert(res.message || "You are not able to access admin");
      } else {
        alert(res.message || "Verification failed");
      }
    } catch (err) {
      console.error("Challenge error:", err);
      alert("Failed to verify security question.");
    } finally {
      setLoading(false);
    }
  };

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

        {blockedError && (
          <div
            style={{
              background: "rgba(239, 68, 68, 0.2)",
              border: "1px solid rgba(239, 68, 68, 0.5)",
              color: "#fca5a5",
              padding: "12px 16px",
              borderRadius: "12px",
              marginBottom: "20px",
              fontSize: "0.95rem",
              fontWeight: "600",
              textAlign: "center"
            }}
          >
            ⛔ {blockedError}
          </div>
        )}

        <input
          type="text"
          name="username"
          aria-label="Username"
          autoComplete="username"
          placeholder="Enter Username"
          value={form.username}
          onChange={handleChange}
        />

        <input
          type="password"
          name="password"
          aria-label="Password"
          autoComplete="current-password"
          placeholder="Enter Password"
          value={form.password}
          onChange={handleChange}
        />

        {/* 📜 MANDATORY TERMS CHECKBOX */}
        <div style={{ display: "flex", alignItems: "flex-start", gap: "10px", margin: "14px 0 16px", textAlign: "left" }}>
          <input
            type="checkbox"
            id="login-terms"
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
          <label htmlFor="login-terms" style={{ fontSize: "0.83rem", color: "#cbd5e1", lineHeight: "1.45", cursor: "pointer" }}>
            I agree to the{" "}
            <button
              type="button"
              onClick={(e) => { e.preventDefault(); setShowTermsModal(true); }}
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
            </button>
            .
          </label>
        </div>

        <button
          className="btn liquid-glass hover:scale-[1.03]"
          onClick={handleLogin}
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
          {loading ? "Logging in..." : "Login"}
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
          onClick={() => window.location.href = "/register"}
        >
          Need an account? Register here →
        </p>
      </div>

      {/* 🛡️ CREATOR SECURITY CHALLENGE MODAL */}
      {showChallengeModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 1000,
            background: "rgba(0, 0, 0, 0.85)",
            backdropFilter: "blur(14px)",
            WebkitBackdropFilter: "blur(14px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px"
          }}
        >
          <div
            className="liquid-glass animate-fade-rise"
            style={{
              background: "rgba(15, 23, 42, 0.95)",
              border: "1px solid rgba(0, 198, 255, 0.4)",
              boxShadow: "0 0 50px rgba(0, 198, 255, 0.25)",
              borderRadius: "24px",
              padding: "40px 32px",
              maxWidth: "460px",
              width: "100%",
              textAlign: "center"
            }}
          >
            <div style={{ fontSize: "2.75rem", marginBottom: "12px" }}>🛡️</div>
            <h2 style={{ fontSize: "1.45rem", fontWeight: "700", color: "#ffffff", marginBottom: "8px" }}>
              Admin Security Challenge
            </h2>
            <p style={{ color: "#a1a1aa", fontSize: "0.9rem", marginBottom: "20px", lineHeight: "1.5" }}>
              Multiple administrative access attempts detected. Please answer the creator's security verification question:
            </p>

            <div
              style={{
                background: "rgba(255, 255, 255, 0.05)",
                border: "1px solid rgba(0, 198, 255, 0.25)",
                padding: "16px 20px",
                borderRadius: "16px",
                color: "#00c6ff",
                fontWeight: "600",
                fontSize: "1.05rem",
                marginBottom: "24px",
                lineHeight: "1.4"
              }}
            >
              "{challengeQuestion}"
            </div>

            <input
              type="text"
              placeholder="Enter nickname..."
              value={securityAnswer}
              onChange={(e) => setSecurityAnswer(e.target.value)}
              style={{
                width: "100%",
                padding: "14px 18px",
                borderRadius: "12px",
                background: "rgba(0, 0, 0, 0.5)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                color: "#ffffff",
                marginBottom: "20px",
                fontSize: "1rem"
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleVerifyChallenge();
              }}
              autoFocus
            />

            <div style={{ display: "flex", gap: "12px" }}>
              <button
                className="btn"
                onClick={handleVerifyChallenge}
                disabled={loading}
                style={{
                  flex: 1,
                  margin: 0,
                  padding: "12px",
                  background: "linear-gradient(135deg, #00c6ff, #0072ff)",
                  fontWeight: "600",
                  cursor: "pointer"
                }}
              >
                {loading ? "Verifying..." : "Verify & Unlock"}
              </button>
              <button
                className="btn"
                onClick={() => {
                  setShowChallengeModal(false);
                  setSecurityAnswer("");
                }}
                style={{
                  flex: 1,
                  margin: 0,
                  padding: "12px",
                  background: "rgba(255, 255, 255, 0.1)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  cursor: "pointer"
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {/* 📜 MODAL READER FOR TERMS */}
      <LegalDocModal
        isOpen={showTermsModal}
        onClose={() => setShowTermsModal(false)}
        type="terms"
      />
    </div>
  );
}

export default LoginPage;