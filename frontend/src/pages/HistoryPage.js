import React, { useEffect, useState } from "react";
import { getUserHistory } from "../services/api";

function HistoryPage() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      const data = await getUserHistory();
      setHistory(data);
      setLoading(false);
    };
    fetchHistory();
  }, []);

  return (
    <div className="container">
      <h1>👤 My Quiz History</h1>
      
      {loading ? (
        <p style={{ color: "#fff" }}>Loading history...</p>
      ) : history.length === 0 ? (
        <p style={{ color: "#fff" }}>You haven't taken any quizzes yet!</p>
      ) : (
        <div className="card" style={{ padding: "0" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", color: "#fff" }}>
            <thead>
              <tr style={{ background: "rgba(255, 255, 255, 0.1)", borderBottom: "1px solid rgba(255,255,255,0.2)" }}>
                <th style={{ padding: "15px" }}>Attempt ID</th>
                <th style={{ padding: "15px" }}>Score</th>
                <th style={{ padding: "15px" }}>Total Questions</th>
                <th style={{ padding: "15px" }}>Accuracy</th>
              </tr>
            </thead>
            <tbody>
              {history.map((entry, index) => (
                <tr key={entry.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.1)", textAlign: "center" }}>
                  <td style={{ padding: "15px" }}>#{index + 1}</td>
                  <td style={{ padding: "15px", fontWeight: "bold", color: entry.score >= entry.totalQuestions / 2 ? "#00ff88" : "#ff4d6d" }}>
                    {entry.score}
                  </td>
                  <td style={{ padding: "15px" }}>{entry.totalQuestions}</td>
                  <td style={{ padding: "15px" }}>
                    {Math.round((entry.score / entry.totalQuestions) * 100)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default HistoryPage;
