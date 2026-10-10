import React, { useEffect, useState, useCallback } from "react";
import {
  getAdminQuestionsPaginated,
  getStats,
  addQuestion,
  updateQuestion,
  deleteQuestion,
  approveQuestion,
  rejectQuestion,
  getQuestions,
  submitQuiz
} from "../services/api";
import DashboardCharts from "../components/DashboardCharts";
import QuestionCard from "../components/QuestionCard";
import { useToast } from "../components/Toast";
import QuitConfirmationModal from "../components/QuitConfirmationModal";

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
      const data = await getAdminQuestionsPaginated(page, size, search);
      
      // Spring Page object has content and totalPages
      setQuestions(data.content || []);
      setTotalPages(data.totalPages || 0);
    } catch (err) {
      console.error("Error fetching questions:", err);
      addToast("Failed to fetch questions.", "error");
    } finally {
      setLoading(false);
    }
  }, [page, size, search, addToast]);

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
      addToast(err.message || "Failed to submit question.", "error");
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     MODERATION HANDLERS
  ========================= */
  const handleApprove = async (id) => {
    try {
      await approveQuestion(id);
      addToast("Question approved for live quizzes! ✅", "success");
      fetchQuestions();
      fetchStats();
    } catch (err) {
      addToast(err.message || "Failed to approve question.", "error");
    }
  };

  const handleReject = async (id) => {
    try {
      await rejectQuestion(id);
      addToast("Question rejected from live quizzes! ❌", "info");
      fetchQuestions();
      fetchStats();
    } catch (err) {
      addToast(err.message || "Failed to reject question.", "error");
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

  // Server-paginated and searched questions
  const filtered = questions;

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
  const [showTestQuitModal, setShowTestQuitModal] = useState(false);

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

  const handleTestResetClick = () => {
    if (testQuestions.length > 0 && !testSubmitted && Object.keys(testAnswers).length > 0) {
      setShowTestQuitModal(true);
    } else {
      resetTestQuiz();
    }
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
              <div
                className="card"
                style={{
                  padding: "28px",
                  borderRadius: "20px",
                  border: "1px solid rgba(0, 198, 255, 0.3)",
                  background: "linear-gradient(135deg, rgba(15, 23, 42, 0.75) 0%, rgba(30, 27, 75, 0.45) 100%)",
                  boxShadow: "0 12px 35px rgba(0, 0, 0, 0.35)",
                  position: "relative",
                  overflow: "hidden"
                }}
              >
                {/* Header with Title, Icon and Status */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "22px", flexWrap: "wrap", gap: "10px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div
                      style={{
                        width: "42px",
                        height: "42px",
                        borderRadius: "12px",
                        background: editId ? "linear-gradient(135deg, #f59e0b, #ef4444)" : "linear-gradient(135deg, #00c6ff, #0072ff)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "1.3rem",
                        boxShadow: editId ? "0 4px 15px rgba(245, 158, 11, 0.35)" : "0 4px 15px rgba(0, 198, 255, 0.35)"
                      }}
                    >
                      {editId ? "✏️" : "➕"}
                    </div>
                    <div>
                      <h3 style={{ margin: 0, fontSize: "1.25rem", fontWeight: "700", color: "var(--text-primary)" }}>
                        {editId ? `Edit Question #${editId}` : "Create New Question"}
                      </h3>
                      <p style={{ margin: "2px 0 0", fontSize: "0.82rem", color: "var(--text-secondary)" }}>
                        {editId ? "Update question content, choices, or metadata" : "Add a high-quality question with options and correct answer"}
                      </p>
                    </div>
                  </div>

                  {editId && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditId(null);
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
                      }}
                      style={{
                        padding: "8px 16px",
                        borderRadius: "8px",
                        fontSize: "0.85rem",
                        fontWeight: "600",
                        background: "rgba(239, 68, 68, 0.15)",
                        border: "1px solid rgba(239, 68, 68, 0.4)",
                        color: "#ef4444",
                        cursor: "pointer",
                        transition: "all 0.2s ease"
                      }}
                    >
                      ✕ Cancel Edit
                    </button>
                  )}
                </div>

                {/* Question Statement */}
                <div style={{ marginBottom: "20px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                    <label style={{ fontSize: "0.82rem", fontWeight: "700", letterSpacing: "0.04em", color: "var(--accent)", textTransform: "uppercase" }}>
                      📝 Question Statement <span style={{ color: "#ef4444" }}>*</span>
                    </label>
                    <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>
                      {form.question?.length || 0} characters
                    </span>
                  </div>
                  <textarea
                    name="question"
                    value={form.question || ""}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Enter the complete question statement here..."
                    style={{
                      width: "100%",
                      padding: "14px 16px",
                      borderRadius: "12px",
                      background: "var(--input-bg)",
                      color: "var(--input-text)",
                      border: "var(--input-border)",
                      outline: "none",
                      fontSize: "0.95rem",
                      lineHeight: "1.5",
                      fontFamily: "inherit",
                      resize: "vertical",
                      boxSizing: "border-box",
                      transition: "all 0.2s ease"
                    }}
                  />
                </div>

                {/* 4 Options Grid (A, B, C, D) */}
                <div style={{ marginBottom: "22px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                    <label style={{ fontSize: "0.82rem", fontWeight: "700", letterSpacing: "0.04em", color: "var(--accent)", textTransform: "uppercase" }}>
                      🎯 Answer Options <span style={{ color: "#ef4444" }}>*</span>
                    </label>
                    <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>
                      Click badge or checkmark to set correct answer
                    </span>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "14px" }}>
                    {[
                      { key: "optionA", letter: "A", color: "#38bdf8", bg: "rgba(56, 189, 248, 0.15)" },
                      { key: "optionB", letter: "B", color: "#a855f7", bg: "rgba(168, 85, 247, 0.15)" },
                      { key: "optionC", letter: "C", color: "#f59e0b", bg: "rgba(245, 158, 11, 0.15)" },
                      { key: "optionD", letter: "D", color: "#10b981", bg: "rgba(16, 185, 129, 0.15)" }
                    ].map(({ key, letter, color, bg }) => {
                      const isCorrect = form.correctAnswer?.toUpperCase() === letter;
                      return (
                        <div
                          key={key}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            background: isCorrect ? "rgba(16, 185, 129, 0.12)" : "var(--input-bg)",
                            border: isCorrect ? "1.5px solid #10b981" : "var(--input-border)",
                            borderRadius: "12px",
                            padding: "6px 12px",
                            transition: "all 0.2s ease",
                            boxShadow: isCorrect ? "0 0 14px rgba(16, 185, 129, 0.25)" : "none"
                          }}
                        >
                          <button
                            type="button"
                            onClick={() => setForm((prev) => ({ ...prev, correctAnswer: letter }))}
                            title={`Mark Option ${letter} as correct answer`}
                            style={{
                              width: "32px",
                              height: "32px",
                              borderRadius: "8px",
                              border: `1.5px solid ${isCorrect ? "#10b981" : color}`,
                              background: isCorrect ? "#10b981" : bg,
                              color: isCorrect ? "#ffffff" : color,
                              fontWeight: "700",
                              fontSize: "0.85rem",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              cursor: "pointer",
                              flexShrink: 0,
                              marginRight: "10px",
                              transition: "all 0.2s ease"
                            }}
                          >
                            {letter}
                          </button>

                          <input
                            type="text"
                            name={key}
                            value={form[key] || ""}
                            onChange={handleChange}
                            placeholder={`Enter Option ${letter}...`}
                            style={{
                              flex: 1,
                              background: "transparent",
                              border: "none",
                              color: "var(--input-text)",
                              fontSize: "0.92rem",
                              outline: "none",
                              padding: "8px 4px",
                              margin: 0
                            }}
                          />

                          <button
                            type="button"
                            onClick={() => setForm((prev) => ({ ...prev, correctAnswer: letter }))}
                            title={isCorrect ? "Currently selected as correct" : `Set ${letter} as correct`}
                            style={{
                              background: "none",
                              border: "none",
                              cursor: "pointer",
                              padding: "4px 6px",
                              borderRadius: "6px",
                              color: isCorrect ? "#10b981" : "var(--text-secondary)",
                              fontSize: "0.82rem",
                              fontWeight: "600",
                              display: "flex",
                              alignItems: "center",
                              gap: "4px"
                            }}
                          >
                            {isCorrect ? "✓ Correct" : "Select"}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 3-Column: Correct Answer Selector + Category Datalist + Difficulty Select */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", marginBottom: "22px" }}>
                  {/* Correct Answer Selector */}
                  <div>
                    <label style={{ display: "block", fontSize: "0.82rem", fontWeight: "700", letterSpacing: "0.04em", color: "var(--accent)", textTransform: "uppercase", marginBottom: "6px" }}>
                      ✅ Correct Answer <span style={{ color: "#ef4444" }}>*</span>
                    </label>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "8px", height: "46px" }}>
                      {["A", "B", "C", "D"].map((opt) => {
                        const isSelected = form.correctAnswer?.toUpperCase() === opt;
                        return (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => setForm((prev) => ({ ...prev, correctAnswer: opt }))}
                            style={{
                              height: "100%",
                              borderRadius: "10px",
                              fontWeight: "700",
                              fontSize: "0.95rem",
                              cursor: "pointer",
                              border: isSelected ? "1.5px solid #10b981" : "var(--input-border)",
                              background: isSelected ? "linear-gradient(135deg, #059669, #10b981)" : "var(--input-bg)",
                              color: isSelected ? "#ffffff" : "var(--text-secondary)",
                              boxShadow: isSelected ? "0 4px 12px rgba(16, 185, 129, 0.35)" : "none",
                              transition: "all 0.2s ease"
                            }}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Category Field */}
                  <div>
                    <label style={{ display: "block", fontSize: "0.82rem", fontWeight: "700", letterSpacing: "0.04em", color: "var(--accent)", textTransform: "uppercase", marginBottom: "6px" }}>
                      📂 Category
                    </label>
                    <input
                      type="text"
                      list="admin-category-list"
                      name="category"
                      value={form.category || ""}
                      onChange={handleChange}
                      placeholder="e.g. Science, Math, Java..."
                      style={{
                        width: "100%",
                        height: "46px",
                        padding: "0 14px",
                        margin: 0,
                        borderRadius: "10px",
                        background: "var(--input-bg)",
                        color: "var(--input-text)",
                        border: "var(--input-border)",
                        outline: "none",
                        fontSize: "0.92rem",
                        boxSizing: "border-box"
                      }}
                    />
                    <datalist id="admin-category-list">
                      <option value="Math" />
                      <option value="Science" />
                      <option value="Programming" />
                      <option value="General Knowledge" />
                      <option value="Java" />
                      <option value="Python" />
                      <option value="Data Structures" />
                      <option value="Web Development" />
                    </datalist>
                  </div>

                  {/* Difficulty Field */}
                  <div>
                    <label style={{ display: "block", fontSize: "0.82rem", fontWeight: "700", letterSpacing: "0.04em", color: "var(--accent)", textTransform: "uppercase", marginBottom: "6px" }}>
                      ⚡ Difficulty
                    </label>
                    <select
                      name="difficulty"
                      value={form.difficulty || ""}
                      onChange={handleChange}
                      style={{
                        width: "100%",
                        height: "46px",
                        padding: "0 14px",
                        margin: 0,
                        borderRadius: "10px",
                        background: "var(--input-bg)",
                        color: "var(--input-text)",
                        border: "var(--input-border)",
                        outline: "none",
                        fontSize: "0.92rem",
                        boxSizing: "border-box",
                        cursor: "pointer"
                      }}
                    >
                      <option value="">Select Difficulty...</option>
                      <option value="Easy">🟢 Easy</option>
                      <option value="Medium">🟡 Medium</option>
                      <option value="Hard">🔴 Hard</option>
                    </select>
                  </div>
                </div>

                {/* Action Buttons */}
                <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                  <button
                    className="btn"
                    onClick={handleSubmit}
                    disabled={loading}
                    style={{
                      flex: 1,
                      height: "48px",
                      borderRadius: "12px",
                      fontSize: "1rem",
                      fontWeight: "700",
                      letterSpacing: "0.02em",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px",
                      background: editId ? "linear-gradient(135deg, #f59e0b, #ef4444)" : "var(--btn-gradient)",
                      boxShadow: editId ? "0 6px 20px rgba(245, 158, 11, 0.35)" : "0 6px 20px rgba(0, 198, 255, 0.35)",
                      cursor: loading ? "not-allowed" : "pointer"
                    }}
                  >
                    {loading ? (
                      "⏳ Processing..."
                    ) : editId ? (
                      "💾 Update Question"
                    ) : (
                      "✨ Add Question to Bank"
                    )}
                  </button>

                  {editId && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditId(null);
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
                      }}
                      style={{
                        height: "48px",
                        padding: "0 20px",
                        borderRadius: "12px",
                        border: "1px solid rgba(255, 255, 255, 0.2)",
                        background: "rgba(255, 255, 255, 0.08)",
                        color: "var(--text-primary)",
                        fontWeight: "600",
                        fontSize: "0.95rem",
                        cursor: "pointer"
                      }}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>

              {/* SEARCH (SERVER-WIDE) */}
              <input
                style={{ marginTop: "20px" }}
                placeholder="🔍 Search question statement across entire question bank..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(0);
                }}
              />

              {/* QUESTIONS LIST */}
              {loading ? (
                <p>Loading questions list...</p>
              ) : filtered.length === 0 ? (
                <p>No questions found on this page.</p>
              ) : (
                filtered.map((q) => (
                  <div key={q.id} className="card" style={{ position: "relative" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "10px" }}>
                      <h3 style={{ margin: 0 }}>{q.question}</h3>
                      <span
                        style={{
                          fontSize: "0.75rem",
                          fontWeight: "700",
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                          padding: "4px 10px",
                          borderRadius: "12px",
                          whiteSpace: "nowrap",
                          background: q.status === "APPROVED"
                            ? "rgba(0, 255, 136, 0.15)"
                            : q.status === "REJECTED"
                            ? "rgba(255, 77, 109, 0.15)"
                            : "rgba(255, 170, 0, 0.15)",
                          color: q.status === "APPROVED"
                            ? "#00ff88"
                            : q.status === "REJECTED"
                            ? "#ff4d6d"
                            : "#ffaa00",
                          border: `1px solid ${
                            q.status === "APPROVED"
                              ? "rgba(0, 255, 136, 0.3)"
                              : q.status === "REJECTED"
                              ? "rgba(255, 77, 109, 0.3)"
                              : "rgba(255, 170, 0, 0.3)"
                          }`
                        }}
                      >
                        {q.status || "APPROVED"}
                      </span>
                    </div>

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

                    <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "15px" }}>
                      {q.status !== "APPROVED" && (
                        <button
                          className="btn"
                          style={{ margin: 0, padding: "6px 14px", fontSize: "13px", background: "linear-gradient(135deg, #10b981, #059669)" }}
                          onClick={() => handleApprove(q.id)}
                        >
                          Approve ✅
                        </button>
                      )}
                      {q.status !== "REJECTED" && (
                        <button
                          className="btn"
                          style={{ margin: 0, padding: "6px 14px", fontSize: "13px", background: "linear-gradient(135deg, #f59e0b, #d97706)" }}
                          onClick={() => handleReject(q.id)}
                        >
                          Reject ⛔
                        </button>
                      )}
                      <button
                        className="btn"
                        style={{ margin: 0, padding: "6px 14px", fontSize: "13px" }}
                        onClick={() => handleEdit(q)}
                      >
                        Edit ✏️
                      </button>
                      <button
                        className="btn"
                        style={{ margin: 0, padding: "6px 14px", fontSize: "13px", background: "linear-gradient(135deg, #dc3545, #ff4d6d)" }}
                        onClick={() => handleDelete(q.id)}
                      >
                        Delete 🗑️
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
                      onClick={handleTestResetClick}
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

              {/* 🚪 DOUBLE CONFIRMATION QUIT MODAL */}
              <QuitConfirmationModal
                isOpen={showTestQuitModal}
                onClose={() => setShowTestQuitModal(false)}
                onConfirm={resetTestQuiz}
                answeredCount={Object.keys(testAnswers).length}
              />
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default AdminPage;