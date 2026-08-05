import React, { useEffect, useState, useCallback } from "react";
import {
  getAdminQuestionsPaginated,
  getStats,
  addQuestion,
  updateQuestion,
  deleteQuestion,
  getQuestions,
  submitQuiz
} from "../services/api";
import DashboardCharts from "../components/DashboardCharts";
import QuestionCard from "../components/QuestionCard";
import { useToast } from "../components/Toast";

function AdminPage() {
  const { addToast } = useToast();
  
  // Navigation tabs
  const [activeTab, setActiveTab] = useState("dashboard"); // dashboard, questions, testquiz

  // Paginated questions list state
  const [questions, setQuestions] = useState([]);
  const [search, setSearch] = useState("");
  const [editId, setEditId] = useState(null);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(false);

  // Pagination configs
  const [page, setPage] = useState(0);
  const [size] = useState(5); // 5 questions per page
  const [totalPages, setTotalPages] = useState(0);

  const [form, setForm] = useState({
    question: "",
    optionA: "",
    optionB: "",
    optionC: "",
    optionD: "",
    correctAnswer: "",
    category: "",
    difficulty: ""
  });

  /* =========================
     FETCH PAGINATED QUESTIONS
  ========================= */
  const fetchQuestions = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getAdminQuestionsPaginated(page, size);
      
      // Spring Page object has content and totalPages
      setQuestions(data.content || []);
      setTotalPages(data.totalPages || 0);
    } catch (err) {
      console.error("Error fetching questions:", err);
      addToast("Failed to fetch questions.", "error");
    } finally {
      setLoading(false);
    }
  }, [page, size, addToast]);

  /* =========================
     FETCH STATS
  ========================= */
  const fetchStats = async () => {
    try {
      const data = await getStats();
      setStats(data);
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  };

  useEffect(() => {
    if (activeTab === "questions") {
      fetchQuestions();
    }
    fetchStats();
  }, [page, activeTab, fetchQuestions]);

  /* =========================
     HANDLE INPUT
  ========================= */
  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  /* =========================
     ADD / UPDATE QUESTION
  ========================= */
  const handleSubmit = async () => {
    if (!form.question || !form.correctAnswer) {
      addToast("Please fill in the required fields", "error");
      return;
    }

    try {
      setLoading(true);

      if (editId) {
        await updateQuestion(editId, form);
        addToast("Question updated successfully!", "success");
      } else {
        await addQuestion(form);
        addToast("Question added successfully!", "success");
      }

      // Reset form
      setForm({
        question: "",
        optionA: "",
        optionB: "",
        optionC: "",
        optionD: "",
        correctAnswer: "",
        category: "",
        difficulty: ""
      });

      setEditId(null);
      fetchQuestions();
      fetchStats();

    } catch (err) {
      console.error("Submit error:", err);
      addToast("Failed to submit question.", "error");
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     DELETE QUESTION
  ========================= */
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this question?")) return;

    try {
      await deleteQuestion(id);
      addToast("Question deleted successfully", "success");
      fetchQuestions();
      fetchStats();
    } catch (err) {
      console.error("Delete error:", err);
      addToast("Failed to delete question.", "error");
    }
  };

  /* =========================
     EDIT QUESTION
  ========================= */
  const handleEdit = (q) => {
    setForm(q);
    setEditId(q.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Local client filtering on loaded page chunk
  const filtered = questions.filter((q) =>
    q.question.toLowerCase().includes(search.toLowerCase())
  );

  /* =========================
     TEST QUIZ STATE & LOGIC
  ========================= */
  const [testQuestions, setTestQuestions] = useState([]);
  const [testAnswers, setTestAnswers] = useState({});
  const [testScore, setTestScore] = useState(null);
  const [testSubmitted, setTestSubmitted] = useState(false);
  const [testLoading, setTestLoading] = useState(false);
  const [testCategory, setTestCategory] = useState("");
  const [testDifficulty, setTestDifficulty] = useState("");
  const [availableCategories, setAvailableCategories] = useState(["All"]);
  const [availableDifficulties, setAvailableDifficulties] = useState(["All", "Easy", "Medium", "Hard"]);

  // Fetch filter options when test quiz tab is active
  useEffect(() => {
    if (activeTab === "testquiz") {
      const fetchFilters = async () => {
        try {
          const s = await getStats();
          if (s.categoryDistribution) {
            setAvailableCategories(["All", ...Object.keys(s.categoryDistribution)]);
          }
          if (s.difficultyDistribution) {
            setAvailableDifficulties(["All", ...Object.keys(s.difficultyDistribution)]);
          }
        } catch (err) {
          console.error(err);
        }
      };
      fetchFilters();
    }
  }, [activeTab]);

  const loadTestQuiz = async () => {
    try {
      setTestLoading(true);
      setTestSubmitted(false);
      setTestScore(null);
      setTestAnswers({});
      const cat = testCategory === "All" ? "" : testCategory;
      const diff = testDifficulty === "All" ? "" : testDifficulty;
      const data = await getQuestions(cat, diff);
      setTestQuestions(data);
      addToast(`Loaded ${data.length} questions for testing`, "success");
    } catch (err) {
      addToast("Failed to load test questions", "error");
    } finally {
      setTestLoading(false);
    }
  };

  const handleTestSubmit = async () => {
    try {
      setTestLoading(true);
      const result = await submitQuiz(testAnswers);
      setTestScore(result.score ?? result);
      setTestSubmitted(true);
      addToast(`Test complete! Score: ${result.score}/${result.total}`, "success");
    } catch (err) {
      addToast("Failed to submit test quiz", "error");
    } finally {
      setTestLoading(false);
    }
  };

  const resetTestQuiz = () => {
    setTestQuestions([]);
    setTestAnswers({});
    setTestScore(null);
    setTestSubmitted(false);
    setTestCategory("");
    setTestDifficulty("");
  };

  return (
    <div className="admin-bg-wrapper">
      <div className="admin-bg-overlay" />
      
      <div className="admin-layout">
        
        {/* 🔵 SIDEBAR */}
        <div className="sidebar">
          <h3>👑 Admin Panel</h3>
          <p
            className={activeTab === "dashboard" ? "active" : ""}
            onClick={() => setActiveTab("dashboard")}
          >
            📊 Dashboard
          </p>
          <p
            className={activeTab === "questions" ? "active" : ""}
            onClick={() => setActiveTab("questions")}
          >
            📋 Questions
          </p>
          <p
            className={activeTab === "testquiz" ? "active" : ""}
            onClick={() => setActiveTab("testquiz")}
          >
            🧪 Test Quiz
          </p>
        </div>

        {/* 🔵 MAIN CONTENT */}
        <div className="main">
          
          {/* TAB 1: DASHBOARD VIEW */}
          {activeTab === "dashboard" && (
            <div>
              <h1 style={{ textAlign: "left" }}>📊 Stats & Analytics Dashboard</h1>
              <DashboardCharts stats={stats} />
            </div>
          )}

          {/* TAB 2: QUESTIONS MANAGEMENT */}
          {activeTab === "questions" && (
            <div>
              <h1 style={{ textAlign: "left" }}>📋 Manage Questions</h1>
              
              {/* 📥 CSV BULK UPLOAD CARD */}
              <div className="liquid-glass" style={{ borderRadius: "16px", padding: "20px 24px", marginBottom: "20px", border: "1px solid rgba(0, 198, 255, 0.3)", background: "rgba(15, 23, 42, 0.4)" }}>
                <h3 style={{ margin: "0 0 8px 0", color: "#ffffff", fontSize: "1.1rem" }}>📥 Bulk Import Questions via CSV</h3>
                <p style={{ fontSize: "0.85rem", color: "#a1a1aa", marginBottom: "12px" }}>
                  Upload a CSV file with header: <code>question,optionA,optionB,optionC,optionD,correctAnswer,category,difficulty</code>
                </p>
                <input
                  type="file"
                  accept=".csv"
                  onChange={async (e) => {
                    const file = e.target.files[0];
                    if (!file) return;

                    const reader = new FileReader();
                    reader.onload = async (evt) => {
                      try {
                        const text = evt.target.result;
                        const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
                        if (lines.length <= 1) {
                          addToast("CSV file appears to be empty or missing data.", "error");
                          return;
                        }

                        // Skip header row if present
                        const startIndex = lines[0].toLowerCase().includes("question") ? 1 : 0;
                        let count = 0;

                        for (let i = startIndex; i < lines.length; i++) {
                          const parts = lines[i].split(",").map((p) => p.trim().replace(/^"(.*)"$/, "$1"));
                          if (parts.length >= 8) {
                            const [question, optionA, optionB, optionC, optionD, correctAnswer, category, difficulty] = parts;
                            await addQuestion({ question, optionA, optionB, optionC, optionD, correctAnswer, category, difficulty });
                            count++;
                          }
                        }

                        addToast(`Successfully imported ${count} questions! 🎉`, "success");
                        fetchQuestions();
                        fetchStats();
                      } catch (err) {
                        console.error("CSV import error:", err);
                        addToast("Failed to parse or upload CSV.", "error");
                      }
                    };
                    reader.readAsText(file);
                  }}
                  style={{ color: "#ffffff", fontSize: "0.9rem", cursor: "pointer" }}
                />
              </div>

              {/* ➕ FORM CARD */}
              <div className="card">
                <h3>{editId ? "✏️ Edit Question" : "➕ Add Question"}</h3>
                
                <input
                  name="question"
                  value={form.question}
                  onChange={handleChange}
                  placeholder="Enter Question Text"
                />
                
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                  <input name="optionA" value={form.optionA} onChange={handleChange} placeholder="Option A" />
                  <input name="optionB" value={form.optionB} onChange={handleChange} placeholder="Option B" />
                  <input name="optionC" value={form.optionC} onChange={handleChange} placeholder="Option C" />
                  <input name="optionD" value={form.optionD} onChange={handleChange} placeholder="Option D" />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px", marginTop: "10px" }}>
                  <input name="correctAnswer" value={form.correctAnswer} onChange={handleChange} placeholder="Correct Answer (A/B/C/D)" />
                  <input name="category" value={form.category} onChange={handleChange} placeholder="Category (e.g. Java)" />
                  <input name="difficulty" value={form.difficulty} onChange={handleChange} placeholder="Difficulty (e.g. Medium)" />
                </div>

                <button className="btn" onClick={handleSubmit} disabled={loading} style={{ width: "100%", marginTop: "20px" }}>
                  {loading
                    ? "Processing..."
                    : editId
                    ? "Update Question"
                    : "Add Question"}
                </button>
              </div>

              {/* SEARCH */}
              <input
                style={{ marginTop: "20px" }}
                placeholder="🔍 Search loaded questions on this page..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

              {/* QUESTIONS LIST */}
              {loading ? (
                <p>Loading questions list...</p>
              ) : filtered.length === 0 ? (
                <p>No questions found on this page.</p>
              ) : (
                filtered.map((q) => (
                  <div key={q.id} className="card">
                    <h3>{q.question}</h3>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5px", margin: "10px 0" }}>
                      <p><b>A:</b> {q.optionA}</p>
                      <p><b>B:</b> {q.optionB}</p>
                      <p><b>C:</b> {q.optionC}</p>
                      <p><b>D:</b> {q.optionD}</p>
                    </div>
                    <p style={{ fontSize: "14px" }}>
                      <b>Correct:</b> <span style={{ color: "#00ff88" }}>{q.correctAnswer}</span> |{" "}
                      <b>Category:</b> {q.category || "General"} |{" "}
                      <b>Difficulty:</b> {q.difficulty || "Medium"}
                    </p>

                    <div style={{ display: "flex", gap: "10px", marginTop: "15px" }}>
                      <button
                        className="btn"
                        style={{ margin: 0, padding: "8px 16px", fontSize: "14px" }}
                        onClick={() => handleEdit(q)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn"
                        style={{ margin: 0, padding: "8px 16px", fontSize: "14px", background: "linear-gradient(135deg, #dc3545, #ff4d6d)" }}
                        onClick={() => handleDelete(q.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              )}

              {/* 📋 PAGINATION CONTROLS */}
              {totalPages > 1 && (
                <div className="pagination-controls">
                  <button
                    className="btn"
                    style={{ margin: 0, padding: "8px 16px" }}
                    disabled={page === 0}
                    onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
                  >
                    Previous
                  </button>
                  <span>
                    Page {page + 1} of {totalPages}
                  </span>
                  <button
                    className="btn"
                    style={{ margin: 0, padding: "8px 16px" }}
                    disabled={page >= totalPages - 1}
                    onClick={() => setPage((prev) => Math.min(prev + 1, totalPages - 1))}
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: TEST QUIZ */}
          {activeTab === "testquiz" && (
            <div>
              <h1 style={{ textAlign: "left" }}>🧪 Test Quiz</h1>
              <p style={{ opacity: 0.7, marginBottom: "20px" }}>
                Test your quiz questions as a participant to verify correctness before users take them.
              </p>

              {!testSubmitted && testQuestions.length === 0 && (
                <div className="card">
                  <h3>Select Filters (Optional)</h3>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                    <select value={testCategory} onChange={(e) => setTestCategory(e.target.value)}>
                      <option value="">Select Category</option>
                      {availableCategories.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                    <select value={testDifficulty} onChange={(e) => setTestDifficulty(e.target.value)}>
                      <option value="">Select Difficulty</option>
                      {availableDifficulties.map((diff) => (
                        <option key={diff} value={diff}>{diff}</option>
                      ))}
                    </select>
                  </div>
                  <button
                    className="btn"
                    style={{ width: "100%", marginTop: "20px" }}
                    onClick={loadTestQuiz}
                    disabled={testLoading}
                  >
                    {testLoading ? "Loading..." : "🚀 Load & Start Test"}
                  </button>
                </div>
              )}

              {testQuestions.length > 0 && !testSubmitted && (
                <>
                  <p style={{ marginBottom: "10px" }}>
                    Answered: {Object.keys(testAnswers).length} / {testQuestions.length}
                  </p>
                  <div className="progress-container">
                    <div
                      className="progress-bar"
                      style={{ width: `${testQuestions.length ? (Object.keys(testAnswers).length / testQuestions.length) * 100 : 0}%` }}
                    />
                  </div>

                  {testQuestions.map((q, index) => (
                    <QuestionCard
                      key={q.id}
                      question={q}
                      index={index}
                      selectedAnswers={testAnswers}
                      setSelectedAnswers={setTestAnswers}
                      practiceMode={false}
                    />
                  ))}

                  <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
                    <button className="btn" onClick={handleTestSubmit} disabled={testLoading}>
                      {testLoading ? "Submitting..." : "✅ Submit Test"}
                    </button>
                    <button
                      className="btn"
                      style={{ background: "linear-gradient(135deg, #6b7280, #9ca3af)" }}
                      onClick={resetTestQuiz}
                    >
                      🔄 Reset
                    </button>
                  </div>
                </>
              )}

              {testSubmitted && (
                <div className="card" style={{ textAlign: "center" }}>
                  <h2 style={{ fontSize: "48px", margin: "10px 0" }}>
                    {testScore}/{testQuestions.length}
                  </h2>
                  <p style={{ fontSize: "18px", marginBottom: "10px" }}>
                    {testScore === testQuestions.length
                      ? "🎉 Perfect! All questions are correctly set up!"
                      : testScore >= testQuestions.length * 0.7
                      ? "👍 Good score. Review the missed questions."
                      : "⚠️ Low score. Check your answer keys for errors."}
                  </p>
                  <p style={{ opacity: 0.7, marginBottom: "20px" }}>
                    Score: {Math.round((testScore / testQuestions.length) * 100)}%
                  </p>

                  {/* Show answer breakdown */}
                  {testQuestions.map((q, idx) => {
                    const userAnswer = testAnswers[q.id];
                    const isCorrect = userAnswer && userAnswer.toUpperCase() === q.correctAnswer.toUpperCase();
                    return (
                      <div
                        key={q.id}
                        className="card"
                        style={{
                          textAlign: "left",
                          borderLeft: `5px solid ${isCorrect ? "#00ff88" : "#ff4d6d"}`,
                          marginBottom: "10px"
                        }}
                      >
                        <p><b>Q{idx + 1}:</b> {q.question}</p>
                        <p style={{ color: isCorrect ? "#00ff88" : "#ff4d6d" }}>
                          Your Answer: {userAnswer || "Not answered"} | Correct: {q.correctAnswer}
                        </p>
                      </div>
                    );
                  })}

                  <button className="btn" onClick={resetTestQuiz} style={{ marginTop: "20px" }}>
                    🔄 Test Again
                  </button>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default AdminPage;