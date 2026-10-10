import React, { useState, useEffect } from "react";

function QuitConfirmationModal({ isOpen, onClose, onConfirm, answeredCount = 0 }) {
  const [step, setStep] = useState(1);

  // Reset to step 1 every time the modal is opened
  useEffect(() => {
    if (isOpen) {
      setStep(1);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "rgba(2, 6, 23, 0.8)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
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
          maxWidth: "480px",
          width: "100%",
          padding: "32px 28px",
          borderRadius: "24px",
          background: "linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 27, 75, 0.95) 100%)",
          border: step === 1 ? "1.5px solid rgba(245, 158, 11, 0.5)" : "1.5px solid rgba(239, 68, 68, 0.6)",
          boxShadow: step === 1
            ? "0 20px 50px rgba(0, 0, 0, 0.6), 0 0 35px rgba(245, 158, 11, 0.25)"
            : "0 20px 50px rgba(0, 0, 0, 0.6), 0 0 35px rgba(239, 68, 68, 0.3)",
          textAlign: "center",
          color: "#ffffff",
          animation: "scaleUp 0.25s ease"
        }}
      >
        {step === 1 ? (
          /* STEP 1: First Reminder */
          <div>
            <div
              style={{
                width: "60px",
                height: "60px",
                borderRadius: "50%",
                background: "rgba(245, 158, 11, 0.15)",
                border: "2px solid #f59e0b",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.8rem",
                margin: "0 auto 18px",
                boxShadow: "0 0 20px rgba(245, 158, 11, 0.3)"
              }}
            >
              ⚠️
            </div>

            <h3
              style={{
                fontSize: "1.35rem",
                fontWeight: "700",
                marginBottom: "12px",
                color: "#ffffff"
              }}
            >
              Leave Quiz Mid-Way?
            </h3>

            {/* Reminder Banner */}
            <div
              style={{
                background: "rgba(245, 158, 11, 0.12)",
                border: "1px solid rgba(245, 158, 11, 0.35)",
                borderRadius: "12px",
                padding: "14px 16px",
                marginBottom: "20px",
                textAlign: "left"
              }}
            >
              <p
                style={{
                  margin: 0,
                  fontSize: "0.95rem",
                  lineHeight: "1.5",
                  color: "#fde68a",
                  fontWeight: "600"
                }}
              >
                ⚠️ Reminder: All the questions you have answered will be deleted if you leave the quiz mid-way.
              </p>
              {answeredCount > 0 && (
                <p
                  style={{
                    margin: "8px 0 0",
                    fontSize: "0.82rem",
                    color: "#cbd5e1"
                  }}
                >
                  You currently have <b>{answeredCount} answered question{answeredCount > 1 ? "s" : ""}</b> that will be discarded.
                </p>
              )}
            </div>

            <p
              style={{
                fontSize: "0.92rem",
                color: "#94a3b8",
                marginBottom: "24px"
              }}
            >
              Do you want to leave the quiz?
            </p>

            {/* Step 1 Actions */}
            <div style={{ display: "flex", gap: "12px" }}>
              <button
                type="button"
                onClick={onClose}
                style={{
                  flex: 1,
                  padding: "12px 20px",
                  borderRadius: "12px",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  background: "rgba(255, 255, 255, 0.08)",
                  color: "#ffffff",
                  fontSize: "0.95rem",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "all 0.2s ease"
                }}
              >
                No, Stay
              </button>
              <button
                type="button"
                onClick={() => setStep(2)}
                style={{
                  flex: 1,
                  padding: "12px 20px",
                  borderRadius: "12px",
                  border: "none",
                  background: "linear-gradient(135deg, #f59e0b, #d97706)",
                  color: "#ffffff",
                  fontSize: "0.95rem",
                  fontWeight: "700",
                  cursor: "pointer",
                  boxShadow: "0 4px 15px rgba(245, 158, 11, 0.4)",
                  transition: "all 0.2s ease"
                }}
              >
                Yes, Leave
              </button>
            </div>
          </div>
        ) : (
          /* STEP 2: Double Confirmation */
          <div>
            <div
              style={{
                width: "60px",
                height: "60px",
                borderRadius: "50%",
                background: "rgba(239, 68, 68, 0.15)",
                border: "2px solid #ef4444",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.8rem",
                margin: "0 auto 18px",
                boxShadow: "0 0 20px rgba(239, 68, 68, 0.35)"
              }}
            >
              ❓
            </div>

            <h3
              style={{
                fontSize: "1.4rem",
                fontWeight: "700",
                marginBottom: "12px",
                color: "#ffffff"
              }}
            >
              Are you sure?
            </h3>

            <div
              style={{
                background: "rgba(239, 68, 68, 0.12)",
                border: "1px solid rgba(239, 68, 68, 0.35)",
                borderRadius: "12px",
                padding: "14px 16px",
                marginBottom: "20px",
                textAlign: "left"
              }}
            >
              <p
                style={{
                  margin: 0,
                  fontSize: "0.92rem",
                  lineHeight: "1.5",
                  color: "#fca5a5",
                  fontWeight: "600"
                }}
              >
                🚨 This action cannot be undone. All your progress will be wiped clean immediately.
              </p>
            </div>

            <p
              style={{
                fontSize: "0.92rem",
                color: "#94a3b8",
                marginBottom: "24px"
              }}
            >
              Are you certain you want to exit and delete all answers?
            </p>

            {/* Step 2 Actions: Yes and No */}
            <div style={{ display: "flex", gap: "12px" }}>
              <button
                type="button"
                onClick={onClose}
                style={{
                  flex: 1,
                  padding: "12px 20px",
                  borderRadius: "12px",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  background: "rgba(255, 255, 255, 0.08)",
                  color: "#ffffff",
                  fontSize: "0.95rem",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "all 0.2s ease"
                }}
              >
                No, Keep Playing
              </button>
              <button
                type="button"
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
                style={{
                  flex: 1,
                  padding: "12px 20px",
                  borderRadius: "12px",
                  border: "none",
                  background: "linear-gradient(135deg, #ef4444, #b91c1c)",
                  color: "#ffffff",
                  fontSize: "0.95rem",
                  fontWeight: "700",
                  cursor: "pointer",
                  boxShadow: "0 4px 15px rgba(239, 68, 68, 0.45)",
                  transition: "all 0.2s ease"
                }}
              >
                Yes, Quit
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default QuitConfirmationModal;
