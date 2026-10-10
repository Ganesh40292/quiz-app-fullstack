import React from "react";
import { Link } from "react-router-dom";

function LegalDocModal({ isOpen, onClose, type }) {
  if (!isOpen) return null;

  const isTerms = type === "terms";
  const title = isTerms ? "Terms & Conditions" : "Privacy Policy";

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "rgba(2, 6, 23, 0.85)",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        animation: "fadeIn 0.2s ease"
      }}
    >
      <div
        className="liquid-glass"
        style={{
          maxWidth: "760px",
          width: "100%",
          maxHeight: "85vh",
          display: "flex",
          flexDirection: "column",
          borderRadius: "24px",
          background: "linear-gradient(135deg, rgba(15, 23, 42, 0.98) 0%, rgba(30, 27, 75, 0.98) 100%)",
          border: "1.5px solid rgba(0, 198, 255, 0.3)",
          boxShadow: "0 25px 60px rgba(0, 0, 0, 0.7), 0 0 40px rgba(0, 198, 255, 0.2)",
          color: "#ffffff",
          overflow: "hidden"
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "20px 28px",
            borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            background: "rgba(255, 255, 255, 0.02)"
          }}
        >
          <div>
            <h3 style={{ margin: 0, fontSize: "1.35rem", fontWeight: "700", color: "#ffffff" }}>
              {isTerms ? "📜 Terms & Conditions" : "🛡️ Privacy Policy"}
            </h3>
            <span style={{ fontSize: "0.8rem", color: "#94a3b8" }}>
              Quizora Platform • Comprehensive Project Documentation
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{
              background: "rgba(255, 255, 255, 0.1)",
              border: "none",
              color: "#cbd5e1",
              fontSize: "1.2rem",
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.2s ease"
            }}
          >
            ✕
          </button>
        </div>

        {/* Scrollable Reader Body */}
        <div
          style={{
            padding: "24px 28px",
            overflowY: "auto",
            lineHeight: "1.7",
            fontSize: "0.92rem",
            color: "#cbd5e1",
            flex: 1
          }}
        >
          {isTerms ? (
            <div>
              <p>
                <b>Effective Date:</b> October 2026 • <b>Project Author:</b> Ganesh Prasad
              </p>
              <p>
                Welcome to <b>Quizora</b>. By creating an account, participating in quiz sessions, or testing questions, you agree to comply with the terms and conditions outlined below.
              </p>

              <h4 style={{ color: "#00c6ff", margin: "18px 0 8px" }}>1. Educational & Assessment Platform</h4>
              <p>
                Quizora provides structured assessments across 4 core domains: Mathematics, Science, Computer Programming, and General Knowledge. Features include Timed Quiz mode, Practice Mode with explanations, and Sudden-Death Challenge Mode.
              </p>

              <h4 style={{ color: "#00c6ff", margin: "18px 0 8px" }}>2. User Account Integrity</h4>
              <p>
                Users agree to provide truthful credentials. Passwords are encrypted using one-way BCrypt algorithms. You are responsible for all actions taken under your account. Google OAuth 2.0 is supported for authentication.
              </p>

              <h4 style={{ color: "#00c6ff", margin: "18px 0 8px" }}>3. Fair Play & Anti-Cheating Standards</h4>
              <p>
                Scores on the public leaderboard must be earned through honest participation. The use of bots, scraping scripts, payload tampering, or automated solvers is strictly forbidden and results in immediate score expungement.
              </p>

              <h4 style={{ color: "#00c6ff", margin: "18px 0 8px" }}>4. Mid-Quiz Abandonment Policy</h4>
              <p>
                If a user leaves an active quiz before completion, answered questions in that session are deleted to preserve leaderboard statistical integrity.
              </p>

              <h4 style={{ color: "#00c6ff", margin: "18px 0 8px" }}>5. Question Authoring & Community Standards</h4>
              <p>
                All submitted questions must be accurate, clearly phrased, and original. Questions enter a moderation review queue (Pending, Approved, Rejected) before live quiz deployment.
              </p>

              <h4 style={{ color: "#00c6ff", margin: "18px 0 8px" }}>6. Administrative Access & Security</h4>
              <p>
                Administrative access is restricted to authorized credentials. Unauthorized access attempts trigger automated rate-limiting, lockout security questions, and administrative notification alerts.
              </p>

              <h4 style={{ color: "#00c6ff", margin: "18px 0 8px" }}>7. Project Ownership & Contact</h4>
              <p>
                All platform architecture and interface implementations are developed by Ganesh Prasad. For questions or dispute resolutions, contact: <a href="mailto:ganeshprasad40292.dev@gmail.com" style={{ color: "#00c6ff" }}>ganeshprasad40292.dev@gmail.com</a>.
              </p>
            </div>
          ) : (
            <div>
              <p>
                <b>Effective Date:</b> October 2026 • <b>Project Author:</b> Ganesh Prasad
              </p>
              <p>
                Quizora is committed to data privacy and minimal information collection. We only collect the data necessary to provide secure authentication and quiz performance rankings.
              </p>

              <h4 style={{ color: "#00c6ff", margin: "18px 0 8px" }}>1. Information We Collect</h4>
              <p>
                - <b>Account Information:</b> Username, role, and registration date.<br />
                - <b>Credentials:</b> Passwords are never stored in plain text; they are encrypted via salted BCrypt hashes.<br />
                - <b>Google Authentication:</b> When signing in with Google, we verify your email and display name via Google's tokeninfo endpoint.<br />
                - <b>Performance Data:</b> Quiz scores, answers submitted, completion timestamps, and leaderboard stats.
              </p>

              <h4 style={{ color: "#00c6ff", margin: "18px 0 8px" }}>2. How Information Is Used</h4>
              <p>
                Information is strictly used to authenticate sessions, compute scores, display rankings on the leaderboard, and generate completion certificates. We never sell, monetize, or transfer your personal data to advertisers.
              </p>

              <h4 style={{ color: "#00c6ff", margin: "18px 0 8px" }}>3. Local Storage & Cookies</h4>
              <p>
                We do not use advertising or tracking cookies. Browser <code>localStorage</code> is used exclusively for active session tokens, usernames, and theme preferences.
              </p>

              <h4 style={{ color: "#00c6ff", margin: "18px 0 8px" }}>4. Security Protections</h4>
              <p>
                Spring Boot token-bucket rate limiting restricts brute-force attempts on API and auth endpoints. MySQL data stores are protected behind isolated backend services.
              </p>

              <h4 style={{ color: "#00c6ff", margin: "18px 0 8px" }}>5. User Data Control</h4>
              <p>
                You can review your complete quiz attempt history at any time or request account deletion by emailing: <a href="mailto:ganeshprasad40292.dev@gmail.com" style={{ color: "#00c6ff" }}>ganeshprasad40292.dev@gmail.com</a>.
              </p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div
          style={{
            padding: "16px 28px",
            borderTop: "1px solid rgba(255, 255, 255, 0.1)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            background: "rgba(255, 255, 255, 0.02)"
          }}
        >
          <Link
            to={isTerms ? "/terms" : "/privacy"}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "#00c6ff",
              fontSize: "0.85rem",
              textDecoration: "underline",
              display: "inline-flex",
              alignItems: "center",
              gap: "4px"
            }}
          >
            Open Full {title} in New Tab ↗
          </Link>

          <button
            type="button"
            onClick={onClose}
            style={{
              padding: "10px 24px",
              borderRadius: "10px",
              border: "none",
              background: "linear-gradient(135deg, #00c6ff, #0072ff)",
              color: "#ffffff",
              fontSize: "0.9rem",
              fontWeight: "600",
              cursor: "pointer",
              boxShadow: "0 4px 15px rgba(0, 198, 255, 0.35)"
            }}
          >
            I Understand & Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default LegalDocModal;
