import React, { useEffect, useState, useCallback, useRef } from "react";
import QuestionCard from "../components/QuestionCard";
import Button from "../components/Button";
import { getQuestions, submitQuiz, getStats, checkAnswerApi } from "../services/api";
import ResultPage from "./ResultPage";
import { useToast } from "../components/Toast";
import { QUOTES, getCurrent30MinQuoteIndex } from "../data/quotes";
import CircularTimer from "../components/CircularTimer";
import QuestionNavigator from "../components/QuestionNavigator";
import { soundFx } from "../utils/audio";
import QuitConfirmationModal from "../components/QuitConfirmationModal";
import Footer from "../components/Footer";

/* =========================
   ROTATING QUOTE COMPONENT
   Changes every 30 minutes
========================= */
function QuoteBlock() {
  const [quoteIndex, setQuoteIndex] = useState(getCurrent30MinQuoteIndex(QUOTES.length));
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const checkQuote = () => {
      const newIndex = getCurrent30MinQuoteIndex(QUOTES.length);
      if (newIndex !== quoteIndex) {
        setFade(false);
        setTimeout(() => {
          setQuoteIndex(newIndex);
          setFade(true);
        }, 400);
      }
    };

    const interval = setInterval(checkQuote, 60 * 1000); // check every minute
    return () => clearInterval(interval);
  }, [quoteIndex]);

  const { quote, author } = QUOTES[quoteIndex];

  return (
    <div
      className="animate-fade-rise-delay"
      style={{
        maxWidth: "640px",
        margin: "0 auto 32px",
        padding: "20px 28px",
        borderRadius: "16px",
        background: "rgba(255, 255, 255, 0.03)",
        border: "1px solid rgba(255, 255, 255, 0.08)",
        textAlign: "center",
        opacity: fade ? 1 : 0,
        transition: "opacity 0.4s ease"
      }}
    >
      <p style={{
        fontFamily: "'Instrument Serif', serif",
        fontSize: "clamp(1.05rem, 2vw, 1.25rem)",
        fontStyle: "italic",
        color: "#e2e8f0",
        lineHeight: 1.6,
        marginBottom: "8px"
      }}>
        "{quote}"
      </p>
      <span style={{
        fontSize: "0.85rem",
        color: "#00c6ff",
        fontWeight: "500",
        letterSpacing: "0.5px"
      }}>
        — {author}
      </span>
    </div>
  );
}

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
  const [flaggedQuestions, setFlaggedQuestions] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showQuitModal, setShowQuitModal] = useState(false);
  const [reviewAnswers, setReviewAnswers] = useState({});

  // Synchronized refs to avoid stale closures during auto-submit & timer expiry
  const selectedAnswersRef = useRef(selectedAnswers);
  useEffect(() => {
    selectedAnswersRef.current = selectedAnswers;
  }, [selectedAnswers]);
  const isSubmittingRef = useRef(false);

  // Warning when leaving tab/refreshing mid-quiz
  useEffect(() => {
    if (!quizStarted || showResult) return;
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = "All the questions you have answered will be deleted if you leave mid-way.";
      return e.returnValue;
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [quizStarted, showResult]);

  const handleConfirmQuit = () => {
    addToast("Quiz session ended. All answered questions have been deleted.", "info");
    restartQuiz();
  };

  // Toggle Flag handler
  const toggleFlag = (id) => {
    setFlaggedQuestions((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Dynamically fetched categories & difficulties from backend
  const [categories, setCategories] = useState(["All"]);
  const [difficulties, setDifficulties] = useState(["All", "Easy", "Medium", "Hard"]);

  // Fetch categories and difficulties from backend stats on mount
  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const stats = await getStats();
        if (stats.categoryDistribution) {
          const cats = Object.keys(stats.categoryDistribution);
          setCategories(["All", ...cats]);
        }
        if (stats.difficultyDistribution) {
          const diffs = Object.keys(stats.difficultyDistribution);
          setDifficulties(["All", ...diffs]);
        }
      } catch (err) {
        console.error("Error fetching filters:", err);
      }
    };
    fetchFilters();
  }, []);

  /* =========================
     START QUIZ
  ========================= */
  const handleStartQuiz = async () => {
    isSubmittingRef.current = false;
    setLoading(true);
    setQuizStarted(true);
    setCurrentIndex(0);
    setFlaggedQuestions({});
    try {
      const filteredCat = category === "All" ? "" : category;
      const filteredDiff = difficulty === "All" ? "" : difficulty;
      const data = await getQuestions(filteredCat, filteredDiff);
      
      setQuestions(data);
      
      // ✅ Set mode timers
      let calcTime = 0;
      if (mode === "timed") {
        calcTime = data.length * 60; // 1 min per question
      } else if (mode === "challenge") {
        calcTime = data.length * 20; // 20s per question for extra challenge!
      }
      setTimeLeft(calcTime);
      setTotalTime(calcTime);
      
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
    if (isSubmittingRef.current) return;
    isSubmittingRef.current = true;
    try {
      // Prioritize explicit argument, fallback to ref to guarantee freshest selections without stale closure
      const rawAnswers = forcedAnswers || selectedAnswersRef.current || selectedAnswers;
      const answersToSubmit = {};
      questions.forEach((q) => {
        answersToSubmit[q.id] = rawAnswers[q.id] || "";
      });

      const result = await submitQuiz(answersToSubmit);
      const finalScore = result.score ?? result;

      if (result.correctAnswers) {
        setReviewAnswers(result.correctAnswers);
      }
      setScore(finalScore);
      setShowResult(true);
      addToast("Quiz submitted successfully!", "success");
    } catch (error) {
      console.error("Submit error:", error);
      addToast("Failed to submit quiz.", "error");
      isSubmittingRef.current = false;
    }
  }, [questions, selectedAnswers, addToast]);

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

    if (lastQuestionId && lastAnswer) {
      checkAnswerApi(lastQuestionId, lastAnswer).then((res) => {
        if (!res.correct) {
          soundFx.playWrong();
          addToast("❌ Wrong Answer! Sudden Death Triggered!", "error");
          handleSubmit(selectedAnswersRef.current || selectedAnswers);
        } else {
          soundFx.playCorrect();
          addToast("✨ Correct! Keep going!", "success");
        }
      }).catch((err) => {
        console.error("Challenge check error:", err);
      });
    }
  }, [selectedAnswers, mode, quizStarted, showResult, loading, handleSubmit, addToast]);

  /* =========================
     TIMER LOGIC (AUTOSUBMIT ON EXPIRY)
  ========================= */
  useEffect(() => {
    if (!quizStarted || showResult || loading || mode === "practice") return;

    if (timeLeft <= 0) {
      addToast("⏱️ Time's up! Auto-submitting answers...", "info");
      handleSubmit(selectedAnswersRef.current);
      return;
    }

    if (timeLeft <= 10) {
      soundFx.playTick();
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
    isSubmittingRef.current = false;
    setSelectedAnswers({});
    selectedAnswersRef.current = {};
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
        correctAnswers={reviewAnswers}
      />
    );
  }

  /* =========================
     QUIZ SETUP VIEW (LANDING)
  ========================= */
  if (!quizStarted) {
    return (
      <div className="relative min-h-screen text-foreground flex flex-col justify-between" style={{ minHeight: "100vh", position: "relative", display: "flex", flexDirection: "column" }}>
        
        {/* 🎥 FULLSCREEN LOOPING BACKGROUND VIDEO */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="hero-video-bg"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            objectFit: "cover",
            zIndex: 0
          }}
        >
          <source
            src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260314_131748_f2ca2a28-fed7-44c8-b9a9-bd9acdd5ec31.mp4"
            type="video/mp4"
          />
        </video>

        {/* 🌌 CINEMATIC HERO CONTENT CONTAINER */}
        <div
          className="hero-content-wrapper relative z-10 flex flex-col items-center text-center px-6 pt-16 pb-12 max-w-7xl mx-auto"
          style={{ position: "relative", zIndex: 10, maxWidth: "1280px", margin: "0 auto", padding: "40px 24px 40px", flex: 1, width: "100%" }}
        >
          {/* H1 CINEMATIC TYPOGRAPHY */}
          <h1
            className="animate-fade-rise"
            style={{
              fontFamily: "'Instrument Serif', serif",
              fontSize: "clamp(2.75rem, 7vw, 5.5rem)",
              lineHeight: 0.95,
              letterSpacing: "-2.46px",
              maxWidth: "1100px",
              fontWeight: 400,
              color: "#ffffff",
              margin: "0 auto 24px"
            }}
          >
            Where <em style={{ fontStyle: "normal", color: "#a1a1aa" }}>knowledge</em> turns{" "}
            <em style={{ fontStyle: "normal", color: "#a1a1aa" }}>into mastery.</em>
          </h1>

          {/* SUBTEXT */}
          <p
            className="animate-fade-rise-delay"
            style={{
              color: "#a1a1aa",
              fontSize: "clamp(1rem, 2vw, 1.125rem)",
              maxWidth: "672px",
              margin: "0 auto 40px",
              lineHeight: 1.625
            }}
          >
            Challenge your intellect, master core subjects, and compete on the global leaderboard. Built for curious minds, active learners, and high achievers ready to test their limits.
          </p>

          {/* 💬 ROTATING INSPIRATIONAL QUOTE */}
          <QuoteBlock />

          {/* 🧪 QUIZ SETUP CONTROL CARD (LIQUID GLASS) */}
          <div
            className="liquid-glass animate-fade-rise-delay-2"
            style={{
              width: "100%",
              maxWidth: "800px",
              borderRadius: "24px",
              padding: "32px 28px",
              margin: "0 auto",
              backdropFilter: "blur(12px)",
              background: "rgba(15, 23, 42, 0.45)",
              border: "1px solid rgba(255, 255, 255, 0.15)"
            }}
          >
            <h3 style={{ fontSize: "1.25rem", color: "#ffffff", marginBottom: "16px", fontWeight: "500" }}>
              1. Choose Quiz Mode
            </h3>
            
            <div className="mode-selector" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", marginBottom: "24px" }}>
              <div
                className={`mode-option ${mode === "timed" ? "active" : ""}`}
                style={{
                  padding: "16px",
                  borderRadius: "16px",
                  background: mode === "timed" ? "rgba(0, 198, 255, 0.2)" : "rgba(255, 255, 255, 0.05)",
                  border: mode === "timed" ? "1px solid #00c6ff" : "1px solid rgba(255, 255, 255, 0.1)",
                  cursor: "pointer",
                  transition: "all 0.2s ease"
                }}
                onClick={() => setMode("timed")}
              >
                <h3 style={{ fontSize: "1rem", color: "#ffffff" }}>⏱️ Timed Mode</h3>
                <p style={{ fontSize: "13px", color: "#cbd5e1", marginTop: "4px" }}>1 minute per question. Standard scoring.</p>
              </div>
              
              <div
                className={`mode-option ${mode === "practice" ? "active" : ""}`}
                style={{
                  padding: "16px",
                  borderRadius: "16px",
                  background: mode === "practice" ? "rgba(0, 198, 255, 0.2)" : "rgba(255, 255, 255, 0.05)",
                  border: mode === "practice" ? "1px solid #00c6ff" : "1px solid rgba(255, 255, 255, 0.1)",
                  cursor: "pointer",
                  transition: "all 0.2s ease"
                }}
                onClick={() => setMode("practice")}
              >
                <h3 style={{ fontSize: "1rem", color: "#ffffff" }}>📚 Practice Mode</h3>
                <p style={{ fontSize: "13px", color: "#cbd5e1", marginTop: "4px" }}>No timer. Instant right/wrong answer feedback.</p>
              </div>

              <div
                className={`mode-option ${mode === "challenge" ? "active" : ""}`}
                style={{
                  padding: "16px",
                  borderRadius: "16px",
                  background: mode === "challenge" ? "rgba(0, 198, 255, 0.2)" : "rgba(255, 255, 255, 0.05)",
                  border: mode === "challenge" ? "1px solid #00c6ff" : "1px solid rgba(255, 255, 255, 0.1)",
                  cursor: "pointer",
                  transition: "all 0.2s ease"
                }}
                onClick={() => setMode("challenge")}
              >
                <h3 style={{ fontSize: "1rem", color: "#ffffff" }}>⚡ Challenge Mode</h3>
                <p style={{ fontSize: "13px", color: "#cbd5e1", marginTop: "4px" }}>20s per question. One wrong answer = Game Over!</p>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", margin: "16px 0" }}>
              <div>
                <h4 style={{ fontSize: "0.9rem", color: "#cbd5e1", marginBottom: "8px", textAlign: "left" }}>2. Category</h4>
                <select value={category} onChange={(e) => setCategory(e.target.value)} style={{ margin: 0 }}>
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <h4 style={{ fontSize: "0.9rem", color: "#cbd5e1", marginBottom: "8px", textAlign: "left" }}>3. Difficulty</h4>
                <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} style={{ margin: 0 }}>
                  <option value="">Select Difficulty</option>
                  {difficulties.map((diff) => (
                    <option key={diff} value={diff}>
                      {diff}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* 🚀 LIQUID GLASS CTA BUTTON */}
            <button
              className="liquid-glass hover:scale-[1.03]"
              style={{
                borderRadius: "9999px",
                padding: "16px 48px",
                fontSize: "1.125rem",
                color: "#ffffff",
                fontWeight: "500",
                cursor: "pointer",
                marginTop: "24px",
                border: "none",
                background: "rgba(255, 255, 255, 0.05)",
                display: "inline-flex",
                alignItems: "center",
                gap: "10px"
              }}
              onClick={handleStartQuiz}
            >
              Start Quiz 🚀
            </button>
          </div>
        </div>

        {/* 🌟 NATURAL & FULL-WIDTH FOOTER ANCHORED TO BOTTOM OF HOME PAGE */}
        <Footer />
      </div>
    );
  }

  /* =========================
     QUIZ IN-PROGRESS VIEW
  ========================= */
  const answered = Object.keys(selectedAnswers).length;
  const progress = questions.length ? (answered / questions.length) * 100 : 0;

  return (
    <div className="container" style={{ maxWidth: "800px", margin: "0 auto" }}>
      
      {/* 🛑 QUIZ TOP BAR WITH LEAVE BUTTON */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", padding: "0 4px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontSize: "0.85rem", fontWeight: "700", textTransform: "uppercase", letterSpacing: "1px", color: "#00c6ff" }}>
            {mode.toUpperCase()} MODE
          </span>
          {category && category !== "All" && (
            <span style={{ fontSize: "0.78rem", padding: "3px 10px", borderRadius: "8px", background: "rgba(255, 255, 255, 0.08)", color: "#cbd5e1", border: "1px solid rgba(255, 255, 255, 0.1)" }}>
              {category}
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={() => setShowQuitModal(true)}
          style={{
            padding: "8px 16px",
            borderRadius: "9999px",
            border: "1px solid rgba(239, 68, 68, 0.4)",
            background: "rgba(239, 68, 68, 0.12)",
            color: "#ef4444",
            fontSize: "0.82rem",
            fontWeight: "600",
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            transition: "all 0.2s ease"
          }}
        >
          🚪 Leave Quiz
        </button>
      </div>

      {/* ⏱️ ANIMATED CIRCULAR TIMER (hidden in practice mode) */}
      {mode !== "practice" && (
        <CircularTimer timeLeft={timeLeft} totalTime={totalTime} />
      )}

      {/* 📌 QUESTION NAVIGATOR GRID */}
      {questions.length > 0 && (
        <QuestionNavigator
          questions={questions}
          currentIndex={currentIndex}
          setCurrentIndex={setCurrentIndex}
          selectedAnswers={selectedAnswers}
          flaggedQuestions={flaggedQuestions}
        />
      )}

      {/* 📊 PROGRESS BAR */}
      <div style={{ marginBottom: "20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", color: "#a1a1aa", marginBottom: "6px" }}>
          <span>Question {currentIndex + 1} of {questions.length}</span>
          <span>{Math.round(progress)}% Completed</span>
        </div>
        <div className="progress-container" style={{ height: "6px", borderRadius: "9999px" }}>
          <div className="progress-bar" style={{ width: `${progress}%`, background: "linear-gradient(90deg, #00c6ff, #00ff88)", borderRadius: "9999px" }} />
        </div>
      </div>

      {/* 📚 CURRENT QUESTION SLIDE */}
      {loading ? (
        <p style={{ color: "#a1a1aa", textAlign: "center" }}>Loading questions...</p>
      ) : questions.length === 0 ? (
        <div className="card" style={{ textAlign: "center" }}>
          <p>No questions matched your selected filters.</p>
          <Button text="Go Back" onClick={restartQuiz} />
        </div>
      ) : (
        <div key={questions[currentIndex]?.id} className="animate-fade-rise">
          <QuestionCard
            question={questions[currentIndex]}
            index={currentIndex}
            selectedAnswers={selectedAnswers}
            setSelectedAnswers={setSelectedAnswers}
            practiceMode={mode === "practice"}
            isFlagged={!!flaggedQuestions[questions[currentIndex]?.id]}
            onToggleFlag={toggleFlag}
          />

          {/* SLIDE NAVIGATION CONTROLS */}
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "24px", gap: "16px" }}>
            <button
              className="liquid-glass"
              disabled={currentIndex === 0}
              onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
              style={{
                padding: "12px 28px",
                borderRadius: "9999px",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                color: currentIndex === 0 ? "rgba(255, 255, 255, 0.3)" : "#ffffff",
                cursor: currentIndex === 0 ? "not-allowed" : "pointer",
                background: "rgba(255, 255, 255, 0.05)"
              }}
            >
              ← Previous
            </button>

            {currentIndex < questions.length - 1 ? (
              <button
                className="liquid-glass"
                onClick={() => setCurrentIndex((prev) => Math.min(questions.length - 1, prev + 1))}
                style={{
                  padding: "12px 28px",
                  borderRadius: "9999px",
                  border: "1px solid rgba(0, 198, 255, 0.4)",
                  color: "#ffffff",
                  cursor: "pointer",
                  background: "rgba(0, 198, 255, 0.15)"
                }}
              >
                Next →
              </button>
            ) : (
              <button
                className="liquid-glass"
                onClick={() => handleSubmit()}
                style={{
                  padding: "12px 32px",
                  borderRadius: "9999px",
                  border: "none",
                  color: "#ffffff",
                  cursor: "pointer",
                  fontWeight: "600",
                  background: "linear-gradient(90deg, #00c6ff, #00ff88)",
                  boxShadow: "0 0 20px rgba(0, 255, 136, 0.3)"
                }}
              >
                Submit Quiz 🚀
              </button>
            )}
          </div>
        </div>
      )}

      {/* 🚪 DOUBLE CONFIRMATION QUIT MODAL */}
      <QuitConfirmationModal
        isOpen={showQuitModal}
        onClose={() => setShowQuitModal(false)}
        onConfirm={handleConfirmQuit}
        answeredCount={answered}
      />
    </div>
  );
}

export default QuizPage;