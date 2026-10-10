import React from "react";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";

function TermsPage() {
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
          <span style={{ color: "#ffffff" }}>Terms & Conditions</span>
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
            Legal Documentation
          </div>
          <h1 style={{ fontSize: "2.4rem", fontWeight: "800", color: "#ffffff", margin: "0 0 12px", fontFamily: "'Outfit', sans-serif" }}>
            Terms & Conditions
          </h1>
          <p style={{ margin: 0, fontSize: "0.95rem", color: "#cbd5e1", lineHeight: "1.6" }}>
            Effective Date: October 11, 2026 • Last Updated: October 2026
          </p>
          <p style={{ margin: "8px 0 0", fontSize: "0.9rem", color: "#94a3b8", lineHeight: "1.6" }}>
            Please review these Terms and Conditions thoroughly before accessing or registering on the Quizora platform. By creating an account or taking quizzes, you agree to comply with all terms detailed herein.
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
              1. Platform Overview & Scope
            </h2>
            <p>
              Quizora is a full-stack interactive assessment and learning platform engineered by Ganesh Prasad. The platform provides curriculum-aligned question modules, live scoring, and competitive leaderboard rankings across four core academic disciplines:
            </p>
            <ul style={{ paddingLeft: "22px", margin: "10px 0" }}>
              <li><b>Mathematics:</b> Algebra, geometry, calculus, probability, and numerical problem solving.</li>
              <li><b>Science:</b> Physics, chemistry, biological systems, planetary science, and experimental methodologies.</li>
              <li><b>Computer Programming:</b> Data structures, algorithms, Java, Python, web technologies, and software engineering principles.</li>
              <li><b>General Knowledge:</b> World history, geography, arts, scientific discoveries, and civic literacy.</li>
            </ul>
            <p>
              By accessing any section of Quizora—whether as a guest, registered learner, or administrator—you agree to be bound by these Terms and our Privacy Policy.
            </p>
          </section>

          {/* Section 2 */}
          <section style={{ marginBottom: "32px" }}>
            <h2 style={{ fontSize: "1.3rem", fontWeight: "700", color: "#ffffff", borderBottom: "1px solid rgba(255, 255, 255, 0.1)", paddingBottom: "8px", marginBottom: "14px" }}>
              2. User Accounts & Registration Eligibility
            </h2>
            <p>
              To track quiz history, earn leaderboard placement, and submit questions for community review, users must register an account. During registration:
            </p>
            <ul style={{ paddingLeft: "22px", margin: "10px 0" }}>
              <li>You agree to provide a truthful, unique username and maintain the confidentiality of your password credentials.</li>
              <li>Passwords must be chosen securely. The platform enforces one-way BCrypt cryptographic hashing on all stored passwords.</li>
              <li>You are strictly prohibited from sharing your account or attempting to access other users’ accounts.</li>
              <li>Google OAuth 2.0 authentication is provided for convenience. Using Google Sign-In links your verified Google email to your Quizora profile.</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section style={{ marginBottom: "32px" }}>
            <h2 style={{ fontSize: "1.3rem", fontWeight: "700", color: "#ffffff", borderBottom: "1px solid rgba(255, 255, 255, 0.1)", paddingBottom: "8px", marginBottom: "14px" }}>
              3. Fair Play, Anti-Cheating & Integrity Policies
            </h2>
            <p>
              Quizora takes fair competition seriously. The platform tracks session completion times, accuracy metrics, and response patterns. The following actions constitute immediate violations:
            </p>
            <ul style={{ paddingLeft: "22px", margin: "10px 0" }}>
              <li>Using automated browser scripts, scrapers, bots, or browser extensions to extract answers or artificially inflate scores.</li>
              <li>Manipulating HTTP payloads, client-side timers, or local storage values during an active quiz session.</li>
              <li>Exploiting sudden-death or timed-challenge modes through automated submission.</li>
              <li>Attempting to bypass server-side rate limits or API moderation endpoints.</li>
            </ul>
            <p>
              Accounts caught violating fair play standards will have their scores permanently expunged from the leaderboard and risk immediate suspension.
            </p>
          </section>

          {/* Section 4 */}
          <section style={{ marginBottom: "32px" }}>
            <h2 style={{ fontSize: "1.3rem", fontWeight: "700", color: "#ffffff", borderBottom: "1px solid rgba(255, 255, 255, 0.1)", paddingBottom: "8px", marginBottom: "14px" }}>
              4. Mid-Quiz Abandonment Policy
            </h2>
            <p>
              To maintain statistical accuracy and prevent partial score inflation, if a participant exits, reloads, or abandons a quiz session before submitting all questions, all answered questions within that session are discarded. Confirmation reminders are provided prior to exiting to prevent accidental loss of progress.
            </p>
          </section>

          {/* Section 5 */}
          <section style={{ marginBottom: "32px" }}>
            <h2 style={{ fontSize: "1.3rem", fontWeight: "700", color: "#ffffff", borderBottom: "1px solid rgba(255, 255, 255, 0.1)", paddingBottom: "8px", marginBottom: "14px" }}>
              5. Administrator Roles & Security Controls
            </h2>
            <p>
              Administrative access to question authoring, bulk CSV importing, and review queues is strictly restricted to designated administrative IDs. Unauthorized attempts to gain administrative credentials trigger automated rate limiting, security lockout challenges, and notification alerts dispatched directly to project maintenance.
            </p>
          </section>

          {/* Section 6 */}
          <section style={{ marginBottom: "32px" }}>
            <h2 style={{ fontSize: "1.3rem", fontWeight: "700", color: "#ffffff", borderBottom: "1px solid rgba(255, 255, 255, 0.1)", paddingBottom: "8px", marginBottom: "14px" }}>
              6. Question Submission Guidelines & Moderation
            </h2>
            <p>
              Any question submitted through the platform must conform to quality and community standards:
            </p>
            <ul style={{ paddingLeft: "22px", margin: "10px 0" }}>
              <li>Questions must be factually accurate, clearly written, and have exactly one verifiably correct choice among options A, B, C, and D.</li>
              <li>Questions must be original or in the public domain, free of copyrighted test materials.</li>
              <li>Abusive, profane, discriminatory, or spam submissions will result in immediate rejection and account review.</li>
              <li>All submitted questions undergo a two-tier review queue (Pending Review, Approved, Rejected) before appearing in public quizzes.</li>
            </ul>
          </section>

          {/* Section 7 */}
          <section style={{ marginBottom: "32px" }}>
            <h2 style={{ fontSize: "1.3rem", fontWeight: "700", color: "#ffffff", borderBottom: "1px solid rgba(255, 255, 255, 0.1)", paddingBottom: "8px", marginBottom: "14px" }}>
              7. Intellectual Property & Code Attribution
            </h2>
            <p>
              The Quizora architecture, branding, user interface implementations, and question datasets are created and maintained by Ganesh Prasad. Third-party libraries including React, Spring Boot, and WebGL shader shaders are utilized under their respective open-source licenses. Users retain personal ownership of original questions submitted, while granting Quizora a non-exclusive license to host and serve those questions to learners.
            </p>
          </section>

          {/* Section 8 */}
          <section style={{ marginBottom: "32px" }}>
            <h2 style={{ fontSize: "1.3rem", fontWeight: "700", color: "#ffffff", borderBottom: "1px solid rgba(255, 255, 255, 0.1)", paddingBottom: "8px", marginBottom: "14px" }}>
              8. Disclaimer of Warranties & Limitation of Liability
            </h2>
            <p>
              The platform is provided "as is" and "as available" for educational practice and testing purposes. While we strive for 100% question accuracy and 24/7 uptime, we make no express warranties regarding uninterrupted availability, error-free operation, or external exam outcomes.
            </p>
          </section>

          {/* Section 9 */}
          <section>
            <h2 style={{ fontSize: "1.3rem", fontWeight: "700", color: "#ffffff", borderBottom: "1px solid rgba(255, 255, 255, 0.1)", paddingBottom: "8px", marginBottom: "14px" }}>
              9. Contact & Inquiries
            </h2>
            <p>
              For legal inquiries, dispute resolution, question error corrections, or platform support, please contact:
            </p>
            <div style={{ background: "rgba(255, 255, 255, 0.05)", padding: "16px", borderRadius: "12px", border: "1px solid rgba(255, 255, 255, 0.1)" }}>
              <p style={{ margin: "0 0 6px" }}><b>Project Developer:</b> Ganesh Prasad</p>
              <p style={{ margin: "0 0 6px" }}><b>Project Email:</b> <a href="mailto:ganeshprasad40292.dev@gmail.com" style={{ color: "#00c6ff" }}>ganeshprasad40292.dev@gmail.com</a></p>
              <p style={{ margin: 0 }}><b>Support Portal:</b> <Link to="/help" style={{ color: "#00c6ff" }}>Help & Support Center</Link></p>
            </div>
          </section>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default TermsPage;
