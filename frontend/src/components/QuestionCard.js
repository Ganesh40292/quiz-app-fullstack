import React from "react";
import PropTypes from "prop-types";

function QuestionCard({
  question,
  index,
  selectedAnswers,
  setSelectedAnswers,
}) {
  const handleChange = (option) => {
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
        const isSelected = selectedAnswers[question.id] === opt;
        const optionText = question[`option${opt}`];

        return (
          <label
            key={opt}
            className={`option ${isSelected ? "selected" : ""}`}
          >
            {/* Radio */}
            <input
              type="radio"
              name={`question-${question.id}`}
              value={opt}
              checked={isSelected}
              onChange={() => handleChange(opt)}
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