import React, { useState } from "react";
import { useToast } from "../components/Toast";

function HelpPage() {
  const { addToast } = useToast();
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      addToast("Please fill in all required fields", "error");
      return;
    }

    const accessKey = process.env.REACT_APP_WEB3FORMS_KEY || "YOUR_WEB3FORMS_ACCESS_KEY";

    try {
      setSending(true);
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify({
          access_key: accessKey,
          name: form.name,
          email: form.email,
          subject: `[Quizora Help] ${form.subject || "Support Inquiry"}`,
          message: form.message,
          from_name: "Quizora Help Portal"
        })
      });

      const data = await res.json();

      if (data.success) {
        setSubmitted(true);
        addToast("Your message has been sent directly to admin Gmail!", "success");
      } else {
        console.error("Web3Forms error:", data);
        addToast(data.message || "Failed to send message. Please check Access Key.", "error");
      }
    } catch (err) {
      console.error("Network error:", err);
      addToast("Network error occurred. Please try again.", "error");
    } finally {
      setSending(false);
    }
  };

  const adminEmail = "ganeshprasad40292.dev@gmail.com";

  return (
    <div className="container" style={{ maxWidth: "900px", margin: "0 auto", padding: "40px 24px" }}>

      {/* HERO HEADER */}
      <div className="animate-fade-rise" style={{ textAlign: "center", marginBottom: "48px" }}>
        <div style={{ fontSize: "3.5rem", marginBottom: "12px" }}>🆘</div>
        <h1 style={{
          fontFamily: "'Outfit', sans-serif",
          fontSize: "clamp(2.2rem, 5vw, 3.2rem)",
          fontWeight: 700,
          letterSpacing: "-1px",
          color: "#ffffff",
          marginBottom: "12px"
        }}>
          Help & Support
        </h1>
        <p style={{ color: "#a1a1aa", fontSize: "1.1rem", maxWidth: "600px", margin: "0 auto", lineHeight: 1.7 }}>
          Found a bug? Have a question? Need assistance?<br />
          We're here to help — reach out and we'll respond within <strong style={{ color: "#00c6ff" }}>24 hours</strong>.
        </p>
      </div>

      {/* CONTACT CARDS */}
      <div className="animate-fade-rise-delay" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "20px", marginBottom: "40px" }}>

        {/* Email Card */}
        <div
          className="liquid-glass"
          style={{
            borderRadius: "20px",
            padding: "28px 24px",
            border: "1px solid rgba(255, 255, 255, 0.12)",
            background: "rgba(15, 23, 42, 0.5)",
            textAlign: "center",
            transition: "transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease",
            cursor: "pointer"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-4px)";
            e.currentTarget.style.boxShadow = "0 0 30px rgba(0, 198, 255, 0.15)";
            e.currentTarget.style.borderColor = "rgba(0, 198, 255, 0.4)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "none";
            e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.12)";
          }}
          onClick={() => window.location.href = `mailto:${adminEmail}`}
        >
          <div style={{ fontSize: "2.5rem", marginBottom: "12px" }}>📧</div>
          <h3 style={{ color: "#ffffff", fontSize: "1.1rem", marginBottom: "8px" }}>Email Us</h3>
          <p style={{ color: "#00c6ff", fontSize: "0.9rem", wordBreak: "break-all" }}>{adminEmail}</p>
          <p style={{ color: "#a1a1aa", fontSize: "0.8rem", marginTop: "8px" }}>Click to open your email client</p>
        </div>

        {/* Response Time Card */}
        <div
          className="liquid-glass"
          style={{
            borderRadius: "20px",
            padding: "28px 24px",
            border: "1px solid rgba(255, 255, 255, 0.12)",
            background: "rgba(15, 23, 42, 0.5)",
            textAlign: "center",
            transition: "transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-4px)";
            e.currentTarget.style.boxShadow = "0 0 30px rgba(0, 198, 255, 0.15)";
            e.currentTarget.style.borderColor = "rgba(0, 198, 255, 0.4)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "none";
            e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.12)";
          }}
        >
          <div style={{ fontSize: "2.5rem", marginBottom: "12px" }}>⏱️</div>
          <h3 style={{ color: "#ffffff", fontSize: "1.1rem", marginBottom: "8px" }}>Response Time</h3>
          <p style={{ color: "#a1a1aa", fontSize: "0.9rem" }}>We typically respond within <strong style={{ color: "#ffffff" }}>24 hours</strong></p>
        </div>

        {/* FAQ Card */}
        <div
          className="liquid-glass"
          style={{
            borderRadius: "20px",
            padding: "28px 24px",
            border: "1px solid rgba(255, 255, 255, 0.12)",
            background: "rgba(15, 23, 42, 0.5)",
            textAlign: "center",
            transition: "transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-4px)";
            e.currentTarget.style.boxShadow = "0 0 30px rgba(0, 198, 255, 0.15)";
            e.currentTarget.style.borderColor = "rgba(0, 198, 255, 0.4)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "none";
            e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.12)";
          }}
        >
          <div style={{ fontSize: "2.5rem", marginBottom: "12px" }}>🛡️</div>
          <h3 style={{ color: "#ffffff", fontSize: "1.1rem", marginBottom: "8px" }}>Bug Reports</h3>
          <p style={{ color: "#a1a1aa", fontSize: "0.9rem" }}>Include steps to reproduce & screenshots for faster fixes</p>
        </div>
      </div>

      {/* CONTACT FORM */}
      <div
        className="liquid-glass animate-fade-rise-delay-2"
        style={{
          borderRadius: "24px",
          padding: "36px 32px",
          border: "1px solid rgba(255, 255, 255, 0.12)",
          background: "rgba(15, 23, 42, 0.5)",
          backdropFilter: "blur(12px)",
          transition: "border-color 0.3s ease, box-shadow 0.3s ease"
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = "rgba(0, 198, 255, 0.25)";
          e.currentTarget.style.boxShadow = "0 0 40px rgba(0, 198, 255, 0.08)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.12)";
          e.currentTarget.style.boxShadow = "none";
        }}
      >
        <h2 style={{ fontFamily: "'Outfit', sans-serif", color: "#ffffff", fontSize: "1.5rem", fontWeight: "700", marginBottom: "8px" }}>
          📝 Send us a Message
        </h2>
        <p style={{ color: "#a1a1aa", fontSize: "0.9rem", marginBottom: "24px" }}>
          Fill out the form below and we'll respond to <strong style={{ color: "#00c6ff" }}>{adminEmail}</strong>
        </p>

        {submitted ? (
          <div style={{ textAlign: "center", padding: "40px 0" }}>
            <div style={{ fontSize: "4rem", marginBottom: "16px" }}>✅</div>
            <h3 style={{ color: "#00ff88", fontSize: "1.3rem", marginBottom: "8px" }}>Message Sent Successfully!</h3>
            <p style={{ color: "#a1a1aa", marginBottom: "24px" }}>We'll get back to you at {form.email} within 24 hours.</p>
            <button
              className="btn"
              style={{ padding: "12px 32px" }}
              onClick={() => { setSubmitted(false); setForm({ name: "", email: "", subject: "", message: "" }); }}
            >
              Send Another Message
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
              <div>
                <label style={{ display: "block", color: "#cbd5e1", fontSize: "0.85rem", marginBottom: "6px" }}>Your Name *</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter your name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  style={{ width: "100%" }}
                />
              </div>
              <div>
                <label style={{ display: "block", color: "#cbd5e1", fontSize: "0.85rem", marginBottom: "6px" }}>Your Email *</label>
                <input
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleChange}
                  required
                  style={{ width: "100%" }}
                />
              </div>
            </div>

            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", color: "#cbd5e1", fontSize: "0.85rem", marginBottom: "6px" }}>Subject</label>
              <select name="subject" value={form.subject} onChange={handleChange} style={{ width: "100%" }}>
                <option value="">Select a topic</option>
                <option value="bug">🐛 Bug Report</option>
                <option value="feature">💡 Feature Request</option>
                <option value="account">🔑 Account Issue</option>
                <option value="quiz">📝 Quiz Content Error</option>
                <option value="other">💬 General Question</option>
              </select>
            </div>

            <div style={{ marginBottom: "24px" }}>
              <label style={{ display: "block", color: "#cbd5e1", fontSize: "0.85rem", marginBottom: "6px" }}>Message *</label>
              <textarea
                name="message"
                placeholder="Describe your issue or question in detail..."
                value={form.message}
                onChange={handleChange}
                required
                rows={5}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  borderRadius: "12px",
                  background: "var(--input-bg)",
                  color: "var(--input-text)",
                  border: "var(--input-border)",
                  fontSize: "0.95rem",
                  resize: "vertical",
                  fontFamily: "var(--font-body)",
                  outline: "none",
                  transition: "border-color 0.3s ease"
                }}
              />
            </div>

            <button
              type="submit"
              disabled={sending}
              className="liquid-glass"
              style={{
                borderRadius: "9999px",
                padding: "14px 40px",
                fontSize: "1rem",
                color: "#ffffff",
                fontWeight: "500",
                cursor: sending ? "not-allowed" : "pointer",
                border: "none",
                background: "rgba(255, 255, 255, 0.05)",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                opacity: sending ? 0.6 : 1
              }}
              onMouseEnter={(e) => {
                if (!sending) {
                  e.currentTarget.style.transform = "scale(1.04)";
                  e.currentTarget.style.boxShadow = "0 0 20px rgba(0, 198, 255, 0.25)";
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              {sending ? "Sending Message..." : "Send Message 📤"}
            </button>
          </form>
        )}
      </div>

      {/* FAQ SECTION */}
      <div className="animate-fade-rise-delay" style={{ marginTop: "56px" }}>
        <h2 style={{
          fontFamily: "'Outfit', sans-serif",
          fontSize: "1.8rem",
          fontWeight: 700,
          color: "#ffffff",
          textAlign: "center",
          marginBottom: "28px"
        }}>
          ❓ Frequently Asked Questions
        </h2>

        {[
          { q: "How do I reset my password?", a: "Currently, contact the admin via email to reset your password. A self-service reset feature is coming soon." },
          { q: "Why are my quiz scores not saving?", a: "Ensure you are logged in and the backend server is running. If the issue persists, clear your browser cache and try again." },
          { q: "Can I suggest new quiz categories?", a: "Absolutely! Use the contact form above with 'Feature Request' as the subject to suggest new categories or question topics." },
          { q: "How do I become an admin?", a: "Register a new account and select 'Admin' as the account role during registration, or contact the existing admin." }
        ].map((faq, idx) => (
          <div
            key={idx}
            className="liquid-glass"
            style={{
              borderRadius: "20px",
              padding: "24px 28px",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              background: "rgba(15, 23, 42, 0.5)",
              marginBottom: "16px",
              transition: "border-color 0.3s ease, transform 0.2s ease, box-shadow 0.3s ease"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "rgba(0, 198, 255, 0.4)";
              e.currentTarget.style.transform = "translateX(6px)";
              e.currentTarget.style.boxShadow = "0 0 25px rgba(0, 198, 255, 0.12)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.1)";
              e.currentTarget.style.transform = "translateX(0)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <h4 style={{ color: "#ffffff", fontSize: "1.05rem", marginBottom: "8px", fontWeight: "600" }}>❓ {faq.q}</h4>
            <p style={{ color: "#a1a1aa", fontSize: "0.92rem", lineHeight: 1.6 }}>{faq.a}</p>
          </div>
        ))}
      </div>

    </div>
  );
}

export default HelpPage;
