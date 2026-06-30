import React from "react";
import PropTypes from "prop-types";

function QuestionCard({
  question,
  index,
  selectedAnswers,
  setSelectedAnswers,
  practiceMode = false,
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
    <div className="card">
      {/* 🟢 Question */}
      <h3>
        {index + 1}. {question.question}
      </h3>

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