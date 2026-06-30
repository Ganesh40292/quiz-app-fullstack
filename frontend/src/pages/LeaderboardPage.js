import React, { useEffect, useState } from "react";
import { getLeaderboard } from "../services/api";

function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      const data = await getLeaderboard();
      setLeaderboard(data);
      setLoading(false);
    };
    fetchLeaderboard();
  }, []);

  return (
    <div className="container">
      <h1>🏆 Global Leaderboard</h1>
      
      {loading ? (
        <p style={{ color: "#fff" }}>Loading scores...</p>
      ) : leaderboard.length === 0 ? (
        <p style={{ color: "#fff" }}>No scores available yet.</p>
      ) : (
        <div className="card" style={{ padding: "0" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", color: "#fff" }}>
            <thead>
              <tr style={{ background: "rgba(255, 255, 255, 0.1)", borderBottom: "1px solid rgba(255,255,255,0.2)" }}>
                <th style={{ padding: "15px" }}>Rank</th>
                <th style={{ padding: "15px" }}>Player</th>
                <th style={{ padding: "15px" }}>Score</th>
                <th style={{ padding: "15px" }}>Accuracy</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((entry, index) => {
                let badge = "";
                if (index === 0) badge = "🥇";
                else if (index === 1) badge = "🥈";
                else if (index === 2) badge = "🥉";
                else badge = `#${index + 1}`;

                return (
                  <tr key={entry.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.1)", textAlign: "center" }}>
                    <td style={{ padding: "15px", fontSize: index < 3 ? "24px" : "16px" }}>{badge}</td>
                    <td style={{ padding: "15px", fontWeight: "bold" }}>{entry.user?.username || "Unknown"}</td>
                    <td style={{ padding: "15px" }}>{entry.score} / {entry.totalQuestions}</td>
                    <td style={{ padding: "15px" }}>
                      {Math.round((entry.score / entry.totalQuestions) * 100)}%
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

export default LeaderboardPage;
