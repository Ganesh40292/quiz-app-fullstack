import React, { useRef } from "react";

function CertificateModal({ score, total, onClose }) {
  const certRef = useRef();
  const username = localStorage.getItem("username") || "Valued Learner";
  const percentage = total ? Math.round((score / total) * 100) : 0;
  const dateStr = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        background: "rgba(0, 0, 0, 0.85)",
        backdropFilter: "blur(12px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px"
      }}
    >
      <div style={{ maxWidth: "800px", width: "100%", textAlign: "center" }}>
        
        {/* Printable Certificate Frame */}
        <div
          ref={certRef}
          id="printable-certificate"
          className="liquid-glass"
          style={{
            borderRadius: "24px",
            padding: "48px 40px",
            background: "linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(30, 27, 75, 0.95))",
            border: "3px solid #00c6ff",
            boxShadow: "0 0 50px rgba(0, 198, 255, 0.25)",
            color: "#ffffff",
            position: "relative"
          }}
        >
          {/* Header Badge */}
          <div style={{ fontSize: "3rem", marginBottom: "8px" }}>📜</div>
          
          <h2 style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: "0.9rem",
            letterSpacing: "3px",
            color: "#00c6ff",
            textTransform: "uppercase",
            marginBottom: "12px"
          }}>
            Quizora Portal — Official Certificate of Excellence
          </h2>

          <h1 style={{
            fontFamily: "'Instrument Serif', serif",
            fontSize: "clamp(2rem, 5vw, 3.2rem)",
            color: "#ffffff",
            fontWeight: "400",
            marginBottom: "16px"
          }}>
            Certificate of Achievement
          </h1>

          <p style={{ color: "#a1a1aa", fontSize: "1rem" }}>This is proudly awarded to</p>

          <h2 style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: "2rem",
            color: "#00ff88",
            fontWeight: "700",
            margin: "12px 0 16px"
          }}>
            {username}
          </h2>

          <p style={{ color: "#cbd5e1", maxWidth: "560px", margin: "0 auto 24px", lineHeight: "1.6" }}>
            For demonstrating exceptional mastery and scoring <strong style={{ color: "#00ff88" }}>{percentage}% ({score}/{total})</strong> on the Quizora Interactive Knowledge Evaluation.
          </p>

          <div style={{ display: "flex", justifyContent: "space-around", marginTop: "36px", paddingTop: "24px", borderTop: "1px solid rgba(255,255,255,0.1)" }}>
            <div>
              <p style={{ fontSize: "0.85rem", color: "#a1a1aa" }}>Date Issued</p>
              <p style={{ fontWeight: "600", color: "#ffffff" }}>{dateStr}</p>
            </div>
            <div>
              <p style={{ fontSize: "0.85rem", color: "#a1a1aa" }}>Verification ID</p>
              <p style={{ fontWeight: "600", color: "#00c6ff" }}>QZR-{Math.floor(100000 + Math.random() * 900000)}</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ marginTop: "24px", display: "flex", gap: "16px", justifyContent: "center" }}>
          <button
            className="liquid-glass"
            onClick={handlePrint}
            style={{
              borderRadius: "9999px",
              padding: "12px 32px",
              fontSize: "1rem",
              color: "#ffffff",
              fontWeight: "600",
              cursor: "pointer",
              border: "none",
              background: "rgba(0, 198, 255, 0.2)"
            }}
          >
            🖨️ Print / Save as PDF
          </button>
          
          <button
            className="liquid-glass"
            onClick={onClose}
            style={{
              borderRadius: "9999px",
              padding: "12px 28px",
              fontSize: "1rem",
              color: "#a1a1aa",
              cursor: "pointer",
              border: "none",
              background: "rgba(255, 255, 255, 0.05)"
            }}
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}

export default CertificateModal;
