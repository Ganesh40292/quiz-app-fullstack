import React, { useEffect, useState, useCallback } from "react";
import {
  getAdminQuestionsPaginated,
  getStats,
  addQuestion,
  updateQuestion,
  deleteQuestion
} from "../services/api";
import DashboardCharts from "../components/DashboardCharts";
import { useToast } from "../components/Toast";

function AdminPage() {
  const { addToast } = useToast();
  
  // Navigation tabs
  const [activeTab, setActiveTab] = useState("dashboard"); // dashboard, questions

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

  return (
    <div className="container">
      <div className="admin-layout">
        
        {/* 🔵 SIDEBAR */}
        <div className="sidebar">
          <h3>Admin Panel</h3>
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

        </div>
      </div>
    </div>
  );
}

export default AdminPage;