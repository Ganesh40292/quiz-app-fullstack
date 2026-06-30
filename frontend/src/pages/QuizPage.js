import React, { useEffect, useState, useCallback } from "react";
import QuestionCard from "../components/QuestionCard";
import Button from "../components/Button";
import { getQuestions, submitQuiz } from "../services/api";
import ResultPage from "./ResultPage";
import { useToast } from "../components/Toast";

function QuizPage() {
  const { addToast } = useToast();
  
  // Selection states
  const [quizStarted, setQuizStarted] = useState(false);
  const [category, setCategory] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [mode, setMode] = useState("timed"); // timed, practice, challenge
  
  // Game states
  const [questions, setQuestions] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [score, setScore] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [loading, setLoading] = useState(true);

  // Available categories (extracted or seeded)
  const categories = ["All", "Science", "Math", "Java", "General"];
  const difficulties = ["All", "Easy", "Medium", "Hard"];

  /* =========================
     START QUIZ
  ========================= */
  const handleStartQuiz = async () => {
    setLoading(true);
    setQuizStarted(true);
    try {
      const filteredCat = category === "All" ? "" : category;
      const filteredDiff = difficulty === "All" ? "" : difficulty;
      const data = await getQuestions(filteredCat, filteredDiff);
      
      setQuestions(data);
      
      // ✅ Set mode timers
      if (mode === "timed") {
        setTimeLeft(data.length * 60); // 1 min per question
      } else if (mode === "challenge") {
        setTimeLeft(data.length * 20); // 20s per question for extra challenge!
      } else {
        setTimeLeft(0); // practice mode has no timer
      }
      
      addToast(`Quiz started in ${mode.toUpperCase()} mode!`, "success");
    } catch (error) {
      console.error("Error fetching questions:", error);
      addToast("Failed to fetch quiz questions.", "error");
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     SUBMIT QUIZ
  ========================= */
  const handleSubmit = useCallback(async (forcedAnswers = null) => {
    try {
      const answersToSubmit = forcedAnswers || selectedAnswers;
      const result = await submitQuiz(answersToSubmit);
      const finalScore = result.score ?? result;

      setScore(finalScore);
      setShowResult(true);
      addToast("Quiz submitted successfully!", "success");
    } catch (error) {
      console.error("Submit error:", error);
      addToast("Failed to submit quiz.", "error");
    }
  }, [selectedAnswers, addToast]);

  /* =========================
     CHALLENGE MODE: SUDDEN DEATH
  ========================= */
  useEffect(() => {
    if (!quizStarted || mode !== "challenge" || showResult || loading) return;

    // Check if user answered a question incorrectly
    const answerKeys = Object.keys(selectedAnswers);
    if (answerKeys.length === 0) return;

    const lastQuestionId = Number(answerKeys[answerKeys.length - 1]);
    const lastAnswer = selectedAnswers[lastQuestionId];
    const questionObj = questions.find((q) => q.id === lastQuestionId);

    if (questionObj && lastAnswer) {
      if (lastAnswer.toLowerCase() !== questionObj.correctAnswer.toLowerCase()) {
        addToast("❌ Wrong Answer! Sudden Death Triggered!", "error");
        
        // Auto submit instantly with current answers
        handleSubmit(selectedAnswers);
      } else {
        addToast("✨ Correct! Keep going!", "success");
      }
    }
  }, [selectedAnswers, mode, quizStarted, questions, showResult, loading, handleSubmit, addToast]);

  /* =========================
     TIMER LOGIC
  ========================= */
  useEffect(() => {
    if (!quizStarted || showResult || loading || mode === "practice") return;

    if (timeLeft === 0) {
      addToast("⏱️ Time's up!", "info");
      handleSubmit();
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft, showResult, loading, handleSubmit, mode, quizStarted, addToast]);

  /* =========================
     RESTART / RESET
  ========================= */
  const restartQuiz = () => {
    setSelectedAnswers({});
    setScore(null);
    setShowResult(false);
    setQuizStarted(false);
    setCategory("");
    setDifficulty("");
    setMode("timed");
  };

  /* =========================
     RESULT VIEW
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

  /* =========================
     QUIZ SETUP VIEW (LANDING)
  ========================= */
  if (!quizStarted) {
    return (
      <div className="container">
        <h1>🎯 Start Your Quiz</h1>
        
        <div className="card">
          <h3>1. Choose Quiz Mode</h3>
          <div className="mode-selector">
            <div
              className={`mode-option ${mode === "timed" ? "active" : ""}`}
              onClick={() => setMode("timed")}
            >
              <h3>⏱️ Timed Mode</h3>
              <p style={{ fontSize: "13px" }}>1 minute per question. Standard scoring.</p>
            </div>
            
            <div
              className={`mode-option ${mode === "practice" ? "active" : ""}`}
              onClick={() => setMode("practice")}
            >
              <h3>📚 Practice Mode</h3>
              <p style={{ fontSize: "13px" }}>No timer. Instant right/wrong answer feedback.</p>
            </div>

            <div
              className={`mode-option ${mode === "challenge" ? "active" : ""}`}
              onClick={() => setMode("challenge")}
            >
              <h3>⚡ Challenge Mode</h3>
              <p style={{ fontSize: "13px" }}>20s per question. One wrong answer = Game Over!</p>
            </div>
          </div>

          <h3 style={{ marginTop: "20px" }}>2. Select Category (Optional)</h3>
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <h3 style={{ marginTop: "20px" }}>3. Select Difficulty (Optional)</h3>
          <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
            <option value="">Select Difficulty</option>
            {difficulties.map((diff) => (
              <option key={diff} value={diff}>
                {diff}
              </option>
            ))}
          </select>

          <button className="btn" style={{ width: "100%", marginTop: "25px" }} onClick={handleStartQuiz}>
            🚀 Start Quiz
          </button>
        </div>
      </div>
    );
  }

  /* =========================
     QUIZ IN-PROGRESS VIEW
  ========================= */
  const answered = Object.keys(selectedAnswers).length;
  const progress = questions.length ? (answered / questions.length) * 100 : 0;

  return (
    <div className="container">
      <h1>Quiz In Progress</h1>

      {/* ⏱️ TIMER (hidden in practice mode) */}
      {mode !== "practice" && (
        <div
          className="timer"
          style={{ color: timeLeft <= 10 ? "#ff4d6d" : "var(--text-primary)" }}
        >
          ⏱️ Time Left: {timeLeft}s
        </div>
      )}

      {/* 📊 PROGRESS */}
      <p style={{ marginBottom: "8px" }}>
        Answered: {answered} / {questions.length}
      </p>

      <div className="progress-container">
        <div className="progress-bar" style={{ width: `${progress}%` }} />
      </div>

      {/* 📚 QUESTIONS */}
      {loading ? (
        <p>Loading questions...</p>
      ) : questions.length === 0 ? (
        <div className="card" style={{ textAlign: "center" }}>
          <p>No questions matched your selected filters.</p>
          <Button text="Go Back" onClick={restartQuiz} />
        </div>
      ) : (
        <>
          {questions.map((q, index) => (
            <QuestionCard
              key={q.id}
              question={q}
              index={index}
              selectedAnswers={selectedAnswers}
              setSelectedAnswers={setSelectedAnswers}
              practiceMode={mode === "practice"}
            />
          ))}
          
          <Button text="Submit Quiz" onClick={() => handleSubmit()} />
        </>
      )}
    </div>
  );
}

export default QuizPage;