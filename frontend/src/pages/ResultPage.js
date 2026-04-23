import React from "react";
import PropTypes from "prop-types";
import Button from "../components/Button";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";

function ResultPage({ score, total, restartQuiz, questions, selectedAnswers }) {
  const { width, height } = useWindowSize();

  const percentage = total ? Math.round((score / total) * 100) : 0;

  /* =========================
     MESSAGE LOGIC
  ========================= */
  let message = "";
  if (percentage === 100) message = "Excellent 🎉";
  else if (percentage >= 60) message = "Great Job 👍";
  else if (percentage >= 40) message = "Good Effort 🙂";
  else message = "Try Again 💡";

  return (
    <div className="container">

      {/* 🎉 CONFETTI (only if good score) */}
      {percentage >= 60 && (
        <Confetti width={width} height={height} />
      )}

      <h1>Quiz Result</h1>

      {/* 🔥 SCORE CARD */}
      <div className="card" style={{ textAlign: "center" }}>
        <h2>Your Score: {score} / {total}</h2>
        <h3>{percentage}%</h3>
        <h3>{message}</h3>

        {/* 📊 PROGRESS */}
        <div className="progress-container">
          <div
            className="progress-bar"
            style={{
              width: `${percentage}%`,
              background:
                percentage >= 60
                  ? "linear-gradient(90deg, #28a745, #00ff88)"
                  : "linear-gradient(90deg, #dc3545, #ff4d6d)",
            }}
          ></div>
        </div>
      </div>

      {/* 🔍 ANSWER REVIEW */}
      {questions.map((q, index) => {
        const selected = selectedAnswers[q.id];
        const correct = q.correctAnswer;

        return (
          <div key={q.id} className="card">
            <h3>
              {index + 1}. {q.question}
            </h3>

            {["A", "B", "C", "D"].map((opt) => {
              let className = "option";

              if (opt === correct) className += " correct";
              else if (opt === selected && selected !== correct)
                className += " wrong";

              return (
                <div key={opt} className={className}>
                  {opt}. {q[`option${opt}`]}
                </div>
              );
            })}

            {/* 📌 Answer summary */}
            <p style={{ marginTop: "10px", fontSize: "14px", color: "#ddd" }}>
              Your Answer: <b>{selected || "Not Attempted"}</b> |{" "}
              Correct Answer: <b>{correct}</b>
            </p>
          </div>
        );
      })}

      {/* 🔘 RESTART */}
      <Button text="Restart Quiz" onClick={restartQuiz} />
    </div>
  );
}

/* =========================
   PROP TYPES
========================= */
ResultPage.propTypes = {
  score: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  restartQuiz: PropTypes.func.isRequired,
  questions: PropTypes.array.isRequired,
  selectedAnswers: PropTypes.object.isRequired,
};

export default ResultPage;