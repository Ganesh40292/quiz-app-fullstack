import React, { useEffect, useState } from "react";
import { getUserHistory } from "../services/api";

function HistoryPage() {
  const [history, setHistory] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      const data = await getUserHistory();
      setHistory(data);
      setLoading(false);
    };
    fetchHistory();
  }, []);

  const filteredHistory = history.filter((entry) => {
    const pct = entry.totalQuestions ? (entry.score / entry.totalQuestions) * 100 : 0;
    if (filter === "high") return pct >= 80;
    if (filter === "low") return pct < 50;
    return true;
  });

  const totalAttempts = history.length;
  const avgAccuracy = totalAttempts
    ? Math.round(
        history.reduce((acc, curr) => acc + (curr.totalQuestions ? (curr.score / curr.totalQuestions) * 100 : 0), 0) /
          totalAttempts
      )
    : 0;

  const bestScore = totalAttempts
    ? Math.max(
        ...history.map((curr) => (curr.totalQuestions ? Math.round((curr.score / curr.totalQuestions) * 100) : 0))
      )
    : 0;

  return (
    <div className="container" style={{ maxWidth: "900px", margin: "0 auto", padding: "40px 24px" }}>
      
      {/* 👤 HEADER */}
      <div className="animate-fade-rise" style={{ textAlign: "center", marginBottom: "36px" }}>
        <h1
          style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: "clamp(2.2rem, 5vw, 3.2rem)",
            fontWeight: "700",
            letterSpacing: "-1px",
            color: "#ffffff",
            marginBottom: "8px"
          }}
        >
          👤 My Quiz History
        </h1>
        <p style={{ color: "#a1a1aa", fontSize: "1.05rem" }}>
          Track your learning milestones, scores, and personal progress over time.
        </p>
      </div>

      {/* 📊 STAT SUMMARY CARDS */}
      {!loading && history.length > 0 && (
        <div
          className="animate-fade-rise-delay"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "20px",
            marginBottom: "36px"
          }}
        >
          <div
            className="liquid-glass"
            style={{
              borderRadius: "20px",
              padding: "24px 20px",
              textAlign: "center",
              border: "1px solid rgba(255, 255, 255, 0.12)",
              background: "rgba(15, 23, 42, 0.5)",
              transition: "transform 0.3s ease, border-color 0.3s ease"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-4px)";
              e.currentTarget.style.borderColor = "rgba(0, 198, 255, 0.4)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.12)";
            }}
          >
            <p style={{ fontSize: "0.85rem", color: "#a1a1aa", textTransform: "uppercase", letterSpacing: "1px" }}>Total Quizzes</p>
            <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: "2.2rem", color: "#ffffff", margin: "6px 0 0" }}>{totalAttempts}</h2>
          </div>

          <div
            className="liquid-glass"
            style={{
              borderRadius: "20px",
              padding: "24px 20px",
              textAlign: "center",
              border: "1px solid rgba(0, 198, 255, 0.3)",
              background: "rgba(15, 23, 42, 0.5)",
              transition: "transform 0.3s ease, border-color 0.3s ease"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-4px)";
              e.currentTarget.style.borderColor = "rgba(0, 198, 255, 0.6)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.borderColor = "rgba(0, 198, 255, 0.3)";
            }}
          >
            <p style={{ fontSize: "0.85rem", color: "#a1a1aa", textTransform: "uppercase", letterSpacing: "1px" }}>Avg Accuracy</p>
            <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: "2.2rem", color: "#00c6ff", margin: "6px 0 0" }}>{avgAccuracy}%</h2>
          </div>

          <div
            className="liquid-glass"
            style={{
              borderRadius: "20px",
              padding: "24px 20px",
              textAlign: "center",
              border: "1px solid rgba(0, 255, 136, 0.3)",
              background: "rgba(15, 23, 42, 0.5)",
              transition: "transform 0.3s ease, border-color 0.3s ease"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-4px)";
              e.currentTarget.style.borderColor = "rgba(0, 255, 136, 0.6)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.borderColor = "rgba(0, 255, 136, 0.3)";
            }}
          >
            <p style={{ fontSize: "0.85rem", color: "#a1a1aa", textTransform: "uppercase", letterSpacing: "1px" }}>Personal Best</p>
            <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: "2.2rem", color: "#00ff88", margin: "6px 0 0" }}>{bestScore}%</h2>
          </div>
        </div>
      )}

      {/* 🔍 FILTER BAR */}
      {!loading && history.length > 0 && (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <p style={{ color: "#a1a1aa", fontSize: "0.9rem", margin: 0 }}>
            Showing <strong>{filteredHistory.length}</strong> of <strong>{history.length}</strong> attempts
          </p>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            style={{ padding: "10px 16px", borderRadius: "12px", fontSize: "0.85rem", width: "auto", margin: 0 }}
          >
            <option value="all">All Attempts</option>
            <option value="high">🏆 Excellent (≥ 80%)</option>
            <option value="low">💡 Needs Practice (&lt; 50%)</option>
          </select>
        </div>
      )}

      {/* 📊 HISTORY TABLE */}
      {loading ? (
        <p style={{ color: "#a1a1aa", textAlign: "center" }}>Loading history...</p>
      ) : history.length === 0 ? (
        <p style={{ color: "#a1a1aa", textAlign: "center" }}>You haven't taken any quizzes yet!</p>
      ) : (
        <div
          className="liquid-glass animate-fade-rise-delay-2"
          style={{
            borderRadius: "24px",
            padding: "0",
            overflow: "hidden",
            border: "1px solid rgba(255, 255, 255, 0.12)",
            background: "rgba(15, 23, 42, 0.5)"
          }}
        >
          <table style={{ width: "100%", borderCollapse: "collapse", color: "#fff" }}>
            <thead>
              <tr style={{ background: "rgba(255, 255, 255, 0.05)", borderBottom: "1px solid rgba(255,255,255,0.1)", textAlign: "left" }}>
                <th style={{ padding: "18px 24px" }}>Attempt</th>
                <th style={{ padding: "18px 24px" }}>Score</th>
                <th style={{ padding: "18px 24px" }}>Total Questions</th>
                <th style={{ padding: "18px 24px" }}>Accuracy</th>
              </tr>
            </thead>
            <tbody>
              {filteredHistory.map((entry, index) => {
                const pct = entry.totalQuestions ? Math.round((entry.score / entry.totalQuestions) * 100) : 0;
                return (
                  <tr
                    key={entry.id || index}
                    style={{
                      borderBottom: "1px solid rgba(255,255,255,0.05)",
                      transition: "background 0.2s ease"
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(0, 198, 255, 0.08)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  >
                    <td style={{ padding: "18px 24px", fontWeight: "600", color: "#ffffff" }}>#{index + 1}</td>
                    <td style={{ padding: "18px 24px", fontWeight: "700", color: pct >= 80 ? "#00ff88" : pct >= 50 ? "#00c6ff" : "#ff4d6d" }}>
                      {entry.score}
                    </td>
                    <td style={{ padding: "18px 24px", color: "#cbd5e1" }}>{entry.totalQuestions}</td>
                    <td style={{ padding: "18px 24px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <span style={{ fontWeight: "600", minWidth: "45px" }}>{pct}%</span>
                        <div style={{ flex: 1, height: "8px", background: "rgba(255,255,255,0.1)", borderRadius: "9999px", overflow: "hidden" }}>
                          <div
                            style={{
                              height: "100%",
                              width: `${pct}%`,
                              background: pct >= 80 ? "linear-gradient(90deg, #00c6ff, #00ff88)" : pct >= 50 ? "#00c6ff" : "#ff4d6d",
                              borderRadius: "9999px"
                            }}
                          />
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default HistoryPage;
