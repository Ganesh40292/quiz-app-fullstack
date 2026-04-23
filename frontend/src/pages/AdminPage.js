import React, { useEffect, useState } from "react";

const BASE_URL = "http://localhost:8080/api/quiz";

function AdminPage() {
  const [questions, setQuestions] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [editId, setEditId] = useState(null);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    question: "",
    optionA: "",
    optionB: "",
    optionC: "",
    optionD: "",
    correctAnswer: ""
  });

  /* =========================
     FETCH QUESTIONS
  ========================= */
  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${BASE_URL}/questions`);
      const data = await res.json();

      setQuestions(data);
      setFiltered(data);
    } catch (err) {
      console.error("Error fetching questions:", err);
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     FETCH STATS
  ========================= */
  const fetchStats = async () => {
    try {
      const res = await fetch(`${BASE_URL}/stats`);
      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  };

  useEffect(() => {
    fetchQuestions();
    fetchStats();
  }, []);

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
      alert("Please fill all required fields");
      return;
    }

    try {
      setLoading(true);

      const url = editId
        ? `${BASE_URL}/update/${editId}`
        : `${BASE_URL}/add`;

      const method = editId ? "PUT" : "POST";

      await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });

      // Reset form
      setForm({
        question: "",
        optionA: "",
        optionB: "",
        optionC: "",
        optionD: "",
        correctAnswer: ""
      });

      setEditId(null);

      fetchQuestions();
      fetchStats();

    } catch (err) {
      console.error("Submit error:", err);
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     DELETE QUESTION
  ========================= */
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this question?")) return;

    try {
      await fetch(`${BASE_URL}/delete/${id}`, {
        method: "DELETE"
      });

      fetchQuestions();
      fetchStats();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  /* =========================
     EDIT QUESTION
  ========================= */
  const handleEdit = (q) => {
    setForm(q);
    setEditId(q.id);
    window.scrollTo({ top: 0, behavior: "smooth" }); // UX improvement
  };

  /* =========================
     SEARCH FILTER
  ========================= */
  useEffect(() => {
    const result = questions.filter((q) =>
      q.question.toLowerCase().includes(search.toLowerCase())
    );
    setFiltered(result);
  }, [search, questions]);

  return (
    <div className="admin-layout">

      {/* 🔵 SIDEBAR */}
      <div className="sidebar">
        <h3>Admin Panel</h3>
        <p>Dashboard</p>
        <p>Questions</p>
      </div>

      {/* 🔵 MAIN */}
      <div className="main">

        {/* 🔥 HEADER */}
        <div className="admin-header">
          <h1 className="admin-title">Admin Dashboard</h1>
        </div>

        {/* 📊 STATS */}
        <div className="stats-container">
          <div className="stat-card">
            <h3>Total Questions</h3>
            <h2>{stats.totalQuestions || 0}</h2>
          </div>
        </div>

        {/* 🔍 SEARCH */}
        <input
          className="search-bar"
          placeholder="🔍 Search questions..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* ➕ FORM */}
        <div className="card">
          <h3>{editId ? "✏️ Edit Question" : "➕ Add Question"}</h3>

          <input name="question" value={form.question} onChange={handleChange} placeholder="Question" />
          <input name="optionA" value={form.optionA} onChange={handleChange} placeholder="Option A" />
          <input name="optionB" value={form.optionB} onChange={handleChange} placeholder="Option B" />
          <input name="optionC" value={form.optionC} onChange={handleChange} placeholder="Option C" />
          <input name="optionD" value={form.optionD} onChange={handleChange} placeholder="Option D" />
          <input name="correctAnswer" value={form.correctAnswer} onChange={handleChange} placeholder="Correct (A/B/C/D)" />

          <button className="btn" onClick={handleSubmit} disabled={loading}>
            {loading
              ? "Processing..."
              : editId
              ? "Update Question"
              : "Add Question"}
          </button>
        </div>

        {/* 📋 QUESTIONS */}
        {loading ? (
          <p style={{ color: "#fff" }}>Loading...</p>
        ) : filtered.length === 0 ? (
          <p style={{ color: "#fff" }}>No questions found</p>
        ) : (
          filtered.map((q) => (
            <div key={q.id} className="card">
              <h3>{q.question}</h3>
              <p>A. {q.optionA}</p>
              <p>B. {q.optionB}</p>
              <p>C. {q.optionC}</p>
              <p>D. {q.optionD}</p>
              <p><b>Correct: {q.correctAnswer}</b></p>

              <button
                className="btn btn-small btn-edit"
                onClick={() => handleEdit(q)}
              >
                Edit
              </button>

              <button
                className="btn btn-small btn-delete"
                onClick={() => handleDelete(q.id)}
              >
                Delete
              </button>
            </div>
          ))
        )}

      </div>
    </div>
  );
}

export default AdminPage;