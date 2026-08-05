import React from "react";
import PropTypes from "prop-types";

function QuestionCard({
  question,
  index,
  selectedAnswers,
  setSelectedAnswers,
  practiceMode = false,
  isFlagged = false,
  onToggleFlag,
}) {
  const answered = selectedAnswers[question.id] !== undefined;

  const handleChange = (option) => {
    if (practiceMode && answered) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [question.id]: option,
    }));
  };

  return (
    <div className="card" style={{ position: "relative" }}>
      {/* 🟢 Question Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px", marginBottom: "16px" }}>
        <h3 style={{ margin: 0, flex: 1 }}>
          {index + 1}. {question.question}
        </h3>

        {onToggleFlag && (
          <button
            type="button"
            onClick={() => onToggleFlag(question.id)}
            title={isFlagged ? "Unflag Question" : "Flag Question for Review"}
            style={{
              background: isFlagged ? "rgba(255, 183, 0, 0.2)" : "rgba(255, 255, 255, 0.05)",
              border: `1px solid ${isFlagged ? "#ffb700" : "rgba(255, 255, 255, 0.15)"}`,
              color: isFlagged ? "#ffb700" : "#a1a1aa",
              padding: "6px 12px",
              borderRadius: "12px",
              fontSize: "0.8rem",
              fontWeight: "600",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "4px",
              transition: "all 0.2s ease"
            }}
          >
            🚩 {isFlagged ? "Flagged" : "Flag"}
          </button>
        )}
      </div>

      {/* 🔵 Options */}
      {["A", "B", "C", "D"].map((opt) => {
        const selectedOpt = selectedAnswers[question.id];
        const isSelected = selectedOpt === opt;
        const optionText = question[`option${opt}`];

        let className = "option";
        if (practiceMode && answered) {
          if (opt === question.correctAnswer) {
            className += " correct";
          } else if (isSelected) {
            className += " wrong";
          }
        } else if (isSelected) {
          className += " selected";
        }

        return (
          <label
            key={opt}
            className={className}
            style={{
              cursor: (practiceMode && answered) ? "not-allowed" : "pointer",
              opacity: (practiceMode && answered && !isSelected && opt !== question.correctAnswer) ? 0.65 : 1
            }}
          >
            {/* Radio */}
            <input
              type="radio"
              name={`question-${question.id}`}
              value={opt}
              checked={isSelected}
              disabled={practiceMode && answered}
              onChange={() => handleChange(opt)}
              style={{ display: "none" }} // Hide the radio button for cleaner glassmorphic UI
            />

            {/* Text */}
            <span>
              {opt}. {optionText || "N/A"}
            </span>
          </label>
        );
      })}
    </div>
  );
}

/* =========================
   PROP TYPES
========================= */
QuestionCard.propTypes = {
  index: PropTypes.number.isRequired,
  selectedAnswers: PropTypes.object.isRequired,
  setSelectedAnswers: PropTypes.func.isRequired,
  question: PropTypes.shape({
    id: PropTypes.number.isRequired,
    question: PropTypes.string,
    optionA: PropTypes.string,
    optionB: PropTypes.string,
    optionC: PropTypes.string,
    optionD: PropTypes.string,
  }).isRequired,
};

export default QuestionCard;