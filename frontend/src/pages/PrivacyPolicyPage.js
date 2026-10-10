import React from "react";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";

function PrivacyPolicyPage() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <div
        className="container"
        style={{
          maxWidth: "920px",
          margin: "40px auto 20px",
          padding: "0 20px",
          flex: 1
        }}
      >
        {/* Navigation Breadcrumb */}
        <div style={{ marginBottom: "24px", display: "flex", alignItems: "center", gap: "8px", fontSize: "0.88rem", color: "#94a3b8" }}>
          <Link to="/" style={{ color: "#00c6ff", textDecoration: "none" }}>Home</Link>
          <span>/</span>
          <span style={{ color: "#ffffff" }}>Privacy Policy</span>
        </div>

        {/* Header Hero */}
        <div
          className="liquid-glass animate-fade-rise"
          style={{
            padding: "36px 32px",
            borderRadius: "20px",
            background: "linear-gradient(135deg, rgba(15, 23, 42, 0.85) 0%, rgba(30, 27, 75, 0.6) 100%)",
            border: "1px solid rgba(0, 198, 255, 0.25)",
            boxShadow: "0 15px 40px rgba(0, 0, 0, 0.5)",
            marginBottom: "32px"
          }}
        >
          <div style={{ display: "inline-block", padding: "6px 14px", borderRadius: "9999px", background: "rgba(0, 198, 255, 0.15)", border: "1px solid rgba(0, 198, 255, 0.3)", color: "#00c6ff", fontSize: "0.82rem", fontWeight: "600", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "12px" }}>
            Privacy & Data Protection
          </div>
          <h1 style={{ fontSize: "2.4rem", fontWeight: "800", color: "#ffffff", margin: "0 0 12px", fontFamily: "'Outfit', sans-serif" }}>
            Privacy Policy
          </h1>
          <p style={{ margin: 0, fontSize: "0.95rem", color: "#cbd5e1", lineHeight: "1.6" }}>
            Effective Date: October 11, 2026 • Last Updated: October 2026
          </p>
          <p style={{ margin: "8px 0 0", fontSize: "0.9rem", color: "#94a3b8", lineHeight: "1.6" }}>
            This policy outlines how Quizora collects, stores, protects, and utilizes information when you visit, create an account, or participate in quizzes across the application.
          </p>
        </div>

        {/* Content Body */}
        <div
          className="card"
          style={{
            padding: "36px 32px",
            borderRadius: "20px",
            background: "rgba(15, 23, 42, 0.75)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            lineHeight: "1.7",
            color: "#cbd5e1"
          }}
        >
          {/* Section 1 */}
          <section style={{ marginBottom: "32px" }}>
            <h2 style={{ fontSize: "1.3rem", fontWeight: "700", color: "#ffffff", borderBottom: "1px solid rgba(255, 255, 255, 0.1)", paddingBottom: "8px", marginBottom: "14px" }}>
              1. Our Privacy Commitment
            </h2>
            <p>
              Quizora respects your privacy. We believe in minimal data collection and complete transparency. We only gather information essential to authenticate your identity, compute your quiz results, and display verified leaderboard rankings. We never sell, monetize, or rent personal data to third-party advertisers.
            </p>
          </section>

          {/* Section 2 */}
          <section style={{ marginBottom: "32px" }}>
            <h2 style={{ fontSize: "1.3rem", fontWeight: "700", color: "#ffffff", borderBottom: "1px solid rgba(255, 255, 255, 0.1)", paddingBottom: "8px", marginBottom: "14px" }}>
              2. Information We Collect
            </h2>
            <p>We collect the following categories of information:</p>
            <ul style={{ paddingLeft: "22px", margin: "10px 0" }}>
              <li>
                <b>Account Identification:</b> Your chosen username, account role (USER or ADMIN), and registration timestamp.
              </li>
              <li>
                <b>Credentials:</b> For standard registration, passwords are automatically transformed using one-way BCrypt encryption with salt before storage in MySQL. Neither administrators nor staff can view your plain-text password.
              </li>
              <li>
                <b>Third-Party Authentication (Google OAuth):</b> When using Google Sign-In, we receive your Google ID token to verify your email and display name via Google's tokeninfo endpoint. We do not access your contacts, files, or Google Drive.
              </li>
              <li>
                <b>Quiz Performance Telemetry:</b> Scores achieved, total questions attempted, completion times, and timestamps recorded for leaderboard calculations and personal score history.
              </li>
              <li>
                <b>Submitted Questions:</b> Any quiz questions, multiple-choice options, and categories contributed through the authoring interface.
              </li>
            </ul>
          </section>

          {/* Section 3 */}
          <section style={{ marginBottom: "32px" }}>
            <h2 style={{ fontSize: "1.3rem", fontWeight: "700", color: "#ffffff", borderBottom: "1px solid rgba(255, 255, 255, 0.1)", paddingBottom: "8px", marginBottom: "14px" }}>
              3. How Your Information Is Used
            </h2>
            <p>Your data is processed strictly for platform operations:</p>
            <ul style={{ paddingLeft: "22px", margin: "10px 0" }}>
              <li>Authenticating login sessions and maintaining protected route access.</li>
              <li>Generating your personal quiz performance certificates and performance history breakdown.</li>
              <li>Computing public leaderboard standings based on accurate score percentages.</li>
              <li>Protecting the system against brute-force attacks via token-bucket rate limiting.</li>
              <li>Dispatching administrative security alerts via Web3Forms in the event of repeated unauthorized administrative access attempts.</li>
            </ul>
          </section>

          {/* Section 4 */}
          <section style={{ marginBottom: "32px" }}>
            <h2 style={{ fontSize: "1.3rem", fontWeight: "700", color: "#ffffff", borderBottom: "1px solid rgba(255, 255, 255, 0.1)", paddingBottom: "8px", marginBottom: "14px" }}>
              4. Cookies & Client-Side Storage
            </h2>
            <p>
              Quizora does not employ intrusive third-party advertising cookies or cross-site tracking pixels. We use standard browser <code>localStorage</code> strictly for:
            </p>
            <ul style={{ paddingLeft: "22px", margin: "10px 0" }}>
              <li>Storing your active authentication session token (cleared upon logout).</li>
              <li>Remembering your logged-in username and role.</li>
              <li>Persisting your preferred UI theme (Dark/Light mode).</li>
            </ul>
            <p>
              You can clear these values at any time through your browser settings or by clicking the "Logout" button in the navigation bar.
            </p>
          </section>

          {/* Section 5 */}
          <section style={{ marginBottom: "32px" }}>
            <h2 style={{ fontSize: "1.3rem", fontWeight: "700", color: "#ffffff", borderBottom: "1px solid rgba(255, 255, 255, 0.1)", paddingBottom: "8px", marginBottom: "14px" }}>
              5. Data Security & Storage Architecture
            </h2>
            <p>
              All application data is securely managed within local MySQL relational databases backed by Spring Boot 3 security layers:
            </p>
            <ul style={{ paddingLeft: "22px", margin: "10px 0" }}>
              <li><b>BCrypt Cryptographic Hashing:</b> Passwords cannot be decrypted or reverse-engineered.</li>
              <li><b>Rate-Limiting Protection:</b> Restricts brute-force attempts on authentication and quiz submission endpoints.</li>
              <li><b>Role-Based Access Control (RBAC):</b> Prevents unauthorized privilege escalation between regular users and administrative panels.</li>
            </ul>
          </section>

          {/* Section 6 */}
          <section style={{ marginBottom: "32px" }}>
            <h2 style={{ fontSize: "1.3rem", fontWeight: "700", color: "#ffffff", borderBottom: "1px solid rgba(255, 255, 255, 0.1)", paddingBottom: "8px", marginBottom: "14px" }}>
              6. Your Rights & Data Retention
            </h2>
            <p>
              As a user of Quizora, you maintain rights over your personal data:
            </p>
            <ul style={{ paddingLeft: "22px", margin: "10px 0" }}>
              <li><b>Access:</b> You can review your complete quiz attempt history at any time on the "My History" page.</li>
              <li><b>Rectification:</b> You may update your profile information or dispute question answer errors through the Help center.</li>
              <li><b>Account Removal:</b> You may request the full deletion of your account and associated quiz scores by contacting the administrator.</li>
            </ul>
          </section>

          {/* Section 7 */}
          <section>
            <h2 style={{ fontSize: "1.3rem", fontWeight: "700", color: "#ffffff", borderBottom: "1px solid rgba(255, 255, 255, 0.1)", paddingBottom: "8px", marginBottom: "14px" }}>
              7. Privacy Contact
            </h2>
            <p>
              For any questions regarding this Privacy Policy or data handling procedures:
            </p>
            <div style={{ background: "rgba(255, 255, 255, 0.05)", padding: "16px", borderRadius: "12px", border: "1px solid rgba(255, 255, 255, 0.1)" }}>
              <p style={{ margin: "0 0 6px" }}><b>Project Developer:</b> Ganesh Prasad</p>
              <p style={{ margin: "0 0 6px" }}><b>Email:</b> <a href="mailto:ganeshprasad40292.dev@gmail.com" style={{ color: "#00c6ff" }}>ganeshprasad40292.dev@gmail.com</a></p>
              <p style={{ margin: 0 }}><b>Help Page:</b> <Link to="/help" style={{ color: "#00c6ff" }}>Submit an Inquiry</Link></p>
            </div>
          </section>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default PrivacyPolicyPage;
