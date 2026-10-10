import React from "react";
import { Link } from "react-router-dom";

function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer
      style={{
        width: "100%",
        marginTop: "auto",
        position: "relative",
        zIndex: 10,
        background: "rgba(10, 15, 30, 0.88)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderTop: "1px solid rgba(255, 255, 255, 0.12)",
        borderLeft: "none",
        borderRight: "none",
        borderBottom: "none",
        borderRadius: "24px 24px 0 0",
        boxShadow: "0 -10px 40px rgba(0, 0, 0, 0.6)",
        overflow: "hidden"
      }}
    >
      {/* Subtle accent border line */}
      <div
        style={{
          height: "2px",
          width: "100%",
          background: "linear-gradient(90deg, transparent, rgba(0, 198, 255, 0.6), rgba(168, 85, 247, 0.6), transparent)"
        }}
      />

      <div
        style={{
          maxWidth: "1040px",
          margin: "0 auto",
          padding: "40px 24px 28px"
        }}
      >
        {/* Main Content Columns */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "36px",
            marginBottom: "36px"
          }}
        >
          {/* Column 1: Brand & About */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
              <span
                style={{
                  fontFamily: "'Outfit', sans-serif",
                  fontSize: "1.4rem",
                  fontWeight: "700",
                  letterSpacing: "-0.5px",
                  color: "#ffffff"
                }}
              >
                Quizora<sup style={{ fontSize: "0.7rem", color: "#00c6ff", marginLeft: "2px" }}>®</sup>
              </span>
            </div>
            <p
              style={{
                margin: "0 0 16px",
                fontSize: "0.88rem",
                color: "#94a3b8",
                lineHeight: "1.6"
              }}
            >
              An interactive quiz application for learning, testing skills, and competing with friends across programming, science, math, and general trivia.
            </p>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              <span
                style={{
                  fontSize: "0.75rem",
                  padding: "3px 9px",
                  borderRadius: "6px",
                  background: "rgba(255, 255, 255, 0.06)",
                  color: "#cbd5e1",
                  border: "1px solid rgba(255, 255, 255, 0.08)"
                }}
              >
                React
              </span>
              <span
                style={{
                  fontSize: "0.75rem",
                  padding: "3px 9px",
                  borderRadius: "6px",
                  background: "rgba(255, 255, 255, 0.06)",
                  color: "#cbd5e1",
                  border: "1px solid rgba(255, 255, 255, 0.08)"
                }}
              >
                Spring Boot
              </span>
              <span
                style={{
                  fontSize: "0.75rem",
                  padding: "3px 9px",
                  borderRadius: "6px",
                  background: "rgba(255, 255, 255, 0.06)",
                  color: "#cbd5e1",
                  border: "1px solid rgba(255, 255, 255, 0.08)"
                }}
              >
                MySQL
              </span>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4
              style={{
                margin: "0 0 14px",
                fontSize: "0.85rem",
                fontWeight: "700",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                color: "#e2e8f0"
              }}
            >
              Navigation
            </h4>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {[
                { to: "/", label: "Start Quiz" },
                { to: "/leaderboard", label: "Leaderboard" },
                { to: "/history", label: "My History" },
                { to: "/help", label: "Help & Support" }
              ].map((link) => (
                <li key={link.to} style={{ marginBottom: "10px" }}>
                  <Link
                    to={link.to}
                    style={{
                      color: "#94a3b8",
                      textDecoration: "none",
                      fontSize: "0.88rem",
                      transition: "color 0.2s ease"
                    }}
                    onMouseEnter={(e) => (e.target.style.color = "#00c6ff")}
                    onMouseLeave={(e) => (e.target.style.color = "#94a3b8")}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Quiz Topics */}
          <div>
            <h4
              style={{
                margin: "0 0 14px",
                fontSize: "0.85rem",
                fontWeight: "700",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                color: "#e2e8f0"
              }}
            >
              Topics
            </h4>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {[
                "Programming & Code",
                "Mathematics",
                "Science & Nature",
                "General Knowledge"
              ].map((topic) => (
                <li
                  key={topic}
                  style={{
                    marginBottom: "10px",
                    color: "#94a3b8",
                    fontSize: "0.88rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px"
                  }}
                >
                  <span style={{ color: "#00c6ff", fontSize: "0.75rem" }}>•</span>
                  {topic}
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Quiz Info & Tips */}
          <div>
            <h4
              style={{
                margin: "0 0 14px",
                fontSize: "0.85rem",
                fontWeight: "700",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                color: "#e2e8f0"
              }}
            >
              Quick Tips
            </h4>
            <p style={{ margin: "0 0 10px", fontSize: "0.85rem", color: "#94a3b8", lineHeight: "1.5" }}>
              💡 Practice in <b>Practice Mode</b> for instant answers, or try <b>Challenge Mode</b> for rapid sudden-death rounds!
            </p>
            <p style={{ margin: 0, fontSize: "0.85rem", color: "#64748b" }}>
              Timer resets per quiz. Scores are ranked live on the leaderboard.
            </p>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Back to top */}
        <div
          style={{
            paddingTop: "24px",
            borderTop: "1px solid rgba(255, 255, 255, 0.06)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "14px",
            fontSize: "0.82rem",
            color: "#64748b"
          }}
        >
          <div>
            © 2026 <b>Quizora</b>. Created by Ganesh Prasad.
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
            <Link
              to="/terms"
              style={{
                color: "#94a3b8",
                textDecoration: "none",
                transition: "color 0.2s ease"
              }}
              onMouseEnter={(e) => (e.target.style.color = "#00c6ff")}
              onMouseLeave={(e) => (e.target.style.color = "#94a3b8")}
            >
              Terms & Conditions
            </Link>
            <span>•</span>
            <Link
              to="/privacy"
              style={{
                color: "#94a3b8",
                textDecoration: "none",
                transition: "color 0.2s ease"
              }}
              onMouseEnter={(e) => (e.target.style.color = "#00c6ff")}
              onMouseLeave={(e) => (e.target.style.color = "#94a3b8")}
            >
              Privacy Policy
            </Link>
            <span>•</span>
            <Link
              to="/help"
              style={{
                color: "#94a3b8",
                textDecoration: "none",
                transition: "color 0.2s ease"
              }}
              onMouseEnter={(e) => (e.target.style.color = "#ffffff")}
              onMouseLeave={(e) => (e.target.style.color = "#94a3b8")}
            >
              Support
            </Link>
            <span>•</span>
            <button
              type="button"
              onClick={scrollToTop}
              style={{
                background: "none",
                border: "none",
                color: "#00c6ff",
                fontSize: "0.82rem",
                fontWeight: "600",
                cursor: "pointer",
                padding: 0,
                display: "inline-flex",
                alignItems: "center",
                gap: "4px"
              }}
            >
              Back to top ↑
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
