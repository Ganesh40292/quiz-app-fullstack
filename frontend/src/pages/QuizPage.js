import React, { useEffect, useState, useCallback } from "react";
import QuestionCard from "../components/QuestionCard";
import Button from "../components/Button";
import { getQuestions, submitQuiz } from "../services/api";
import ResultPage from "./ResultPage";

function QuizPage() {
  const [questions, setQuestions] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [score, setScore] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [loading, setLoading] = useState(true);

  /* =========================
     FETCH QUESTIONS + SET TIMER
  ========================= */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getQuestions();
        setQuestions(data);

        // ✅ 1 min per question
        setTimeLeft(data.length * 60);
      } catch (error) {
        console.error("Error fetching questions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  /* =========================
     SUBMIT QUIZ
  ========================= */
  const handleSubmit = useCallback(async () => {
    try {
      const result = await submitQuiz(selectedAnswers);

      // handle both formats
      const finalScore = result.score ?? result;

      setScore(finalScore);
      setShowResult(true);
    } catch (error) {
      console.error("Submit error:", error);
    }
  }, [selectedAnswers]);

  /* =========================
     TIMER LOGIC
  ========================= */
  useEffect(() => {
    if (showResult || loading) return;

    if (timeLeft === 0) {
      handleSubmit();
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft, showResult, loading, handleSubmit]);

  /* =========================
     RESTART
  ========================= */
  const restartQuiz = () => {
    setSelectedAnswers({});
    setScore(null);
    setShowResult(false);
    setTimeLeft(questions.length * 60);
  };

  /* =========================
     RESULT PAGE
  ========================= */
  if (showResult) {
    return (
      <ResultPage
        score={score}
        total={questions.length}
        restartQuiz={restartQuiz}
        questions={questions}
        selectedAnswers={selectedAnswers}
      />
    );
  }

  const answered = Object.keys(selectedAnswers).length;
  const progress = questions.length
    ? (answered / questions.length) * 100
    : 0;

  return (
    <div className="container">
      <h1>Quiz Page</h1>

      {/* ⏱️ TIMER */}
      <div
        className="timer"
        style={{ color: timeLeft <= 10 ? "#ff4d6d" : "#ffffff" }}
      >
        ⏱️ Time Left: {timeLeft}s
      </div>

      {/* 📊 PROGRESS */}
      <p style={{ color: "#fff" }}>
        Answered: {answered} / {questions.length}
      </p>

      <div className="progress-container">
        <div
          className="progress-bar"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      {/* 📚 QUESTIONS */}
      {loading ? (
        <p style={{ color: "#fff" }}>Loading questions...</p>
      ) : questions.length === 0 ? (
        <p style={{ color: "#fff" }}>No questions available</p>
      ) : (
        questions.map((q, index) => (
          <QuestionCard
            key={q.id}
            question={q}
            index={index}
            selectedAnswers={selectedAnswers}
            setSelectedAnswers={setSelectedAnswers}
          />
        ))
      )}

      <Button text="Submit Quiz" onClick={handleSubmit} />
    </div>
  );
}

export default QuizPage;