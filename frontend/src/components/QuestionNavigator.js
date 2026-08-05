import React from "react";

function QuestionNavigator({
  questions,
  currentIndex,
  setCurrentIndex,
  selectedAnswers,
  flaggedQuestions
}) {
  const answeredCount = Object.keys(selectedAnswers).length;
  const flaggedCount = Object.keys(flaggedQuestions).filter((id) => flaggedQuestions[id]).length;

  return (
    <div
      className="liquid-glass"
      style={{
        borderRadius: "16px",
        padding: "16px 20px",
        marginBottom: "24px",
        border: "1px solid rgba(255, 255, 255, 0.12)",
        background: "rgba(15, 23, 42, 0.4)"
      }}
    >
      {/* Header Info */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px", fontSize: "0.85rem" }}>
        <span style={{ color: "#ffffff", fontWeight: "600" }}>📌 Question Navigator</span>
        <div style={{ display: "flex", gap: "12px", color: "#a1a1aa" }}>
          <span>✅ Answered: <strong style={{ color: "#00ff88" }}>{answeredCount}</strong></span>
          <span>🚩 Flagged: <strong style={{ color: "#ffb700" }}>{flaggedCount}</strong></span>
        </div>
      </div>

      {/* Grid Buttons */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
        {questions.map((q, idx) => {
          const isCurrent = idx === currentIndex;
          const isAnswered = selectedAnswers[q.id] !== undefined;
          const isFlagged = flaggedQuestions[q.id];

          let bg = "rgba(255, 255, 255, 0.05)";
          let borderColor = "rgba(255, 255, 255, 0.15)";
          let color = "#ffffff";

          if (isCurrent) {
            borderColor = "#00c6ff";
            bg = "rgba(0, 198, 255, 0.25)";
          } else if (isFlagged) {
            borderColor = "#ffb700";
            bg = "rgba(255, 183, 0, 0.2)";
            color = "#ffb700";
          } else if (isAnswered) {
            borderColor = "#00ff88";
            bg = "rgba(0, 255, 136, 0.15)";
            color = "#00ff88";
          }

          return (
            <button
              key={q.id}
              onClick={() => setCurrentIndex(idx)}
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "10px",
                border: `1.5px solid ${borderColor}`,
                background: bg,
                color: color,
                fontSize: "0.85rem",
                fontWeight: "600",
                cursor: "pointer",
                position: "relative",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.2s ease"
              }}
            >
              {idx + 1}
              {isFlagged && (
                <span
                  style={{
                    position: "absolute",
                    top: "-4px",
                    right: "-4px",
                    fontSize: "0.6rem"
                  }}
                >
                  🚩
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default QuestionNavigator;
