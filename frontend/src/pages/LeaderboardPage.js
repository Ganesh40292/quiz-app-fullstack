import React, { useEffect, useState } from "react";
import { getLeaderboard } from "../services/api";

function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      const data = await getLeaderboard();
      setLeaderboard(data);
      setLoading(false);
    };
    fetchLeaderboard();
  }, []);

  const filteredLeaderboard = leaderboard.filter((entry) =>
    (entry.user?.username || "Unknown").toLowerCase().includes(search.toLowerCase())
  );

  const topThree = leaderboard.slice(0, 3);

  return (
    <div className="container" style={{ maxWidth: "900px", margin: "0 auto", padding: "40px 24px" }}>
      
      {/* 🏆 HEADER */}
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
          🏆 Global Leaderboard
        </h1>
        <p style={{ color: "#a1a1aa", fontSize: "1.05rem" }}>
          Top scholars and high achievers competing for global dominance.
        </p>
      </div>

      {/* 🥇 TOP 3 PODIUM CARDS */}
      {!loading && topThree.length > 0 && (
        <div
          className="animate-fade-rise-delay"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "20px",
            marginBottom: "40px"
          }}
        >
          {topThree.map((entry, idx) => {
            const pct = entry.totalQuestions ? Math.round((entry.score / entry.totalQuestions) * 100) : 0;
            const medals = ["🥇 1st Place", "🥈 2nd Place", "🥉 3rd Place"];
            const borderColors = ["#ffd700", "#c0c0c0", "#cd7f32"];
            const glowColors = ["rgba(255, 215, 0, 0.25)", "rgba(192, 192, 192, 0.2)", "rgba(205, 127, 50, 0.2)"];

            return (
              <div
                key={entry.id || idx}
                className="liquid-glass"
                style={{
                  borderRadius: "24px",
                  padding: "28px 20px",
                  textAlign: "center",
                  background: "rgba(15, 23, 42, 0.6)",
                  border: `2px solid ${borderColors[idx]}`,
                  boxShadow: `0 0 30px ${glowColors[idx]}`,
                  transition: "transform 0.3s ease, box-shadow 0.3s ease"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-6px)";
                  e.currentTarget.style.boxShadow = `0 0 40px ${glowColors[idx]}`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = `0 0 30px ${glowColors[idx]}`;
                }}
              >
                <div style={{ fontSize: "2.5rem", marginBottom: "8px" }}>{medals[idx].split(" ")[0]}</div>
                <span
                  style={{
                    fontSize: "0.75rem",
                    fontWeight: "700",
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                    color: borderColors[idx]
                  }}
                >
                  {medals[idx]}
                </span>
                <h3 style={{ fontFamily: "'Outfit', sans-serif", fontSize: "1.4rem", color: "#ffffff", margin: "8px 0" }}>
                  {entry.user?.username || "Unknown"}
                </h3>
                <p style={{ fontSize: "1.1rem", fontWeight: "700", color: "#00c6ff" }}>
                  {entry.score} / {entry.totalQuestions} <span style={{ fontSize: "0.85rem", color: "#a1a1aa" }}>({pct}%)</span>
                </p>
              </div>
            );
          })}
        </div>
      )}

      {/* 🔍 SEARCH PLAYER */}
      {!loading && leaderboard.length > 0 && (
        <div style={{ marginBottom: "20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <p style={{ color: "#a1a1aa", fontSize: "0.9rem", margin: 0 }}>
            Showing <strong>{filteredLeaderboard.length}</strong> players
          </p>
          <input
            type="text"
            placeholder="🔍 Search player..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              padding: "10px 16px",
              borderRadius: "12px",
              fontSize: "0.85rem",
              width: "220px",
              margin: 0
            }}
          />
        </div>
      )}

      {/* 📊 LEADERBOARD TABLE */}
      {loading ? (
        <p style={{ color: "#a1a1aa", textAlign: "center" }}>Loading rankings...</p>
      ) : leaderboard.length === 0 ? (
        <p style={{ color: "#a1a1aa", textAlign: "center" }}>No scores submitted yet. Be the first to take a quiz!</p>
      ) : (
        <div
          className="liquid-glass animate-fade-rise-delay-2"
          style={{
            borderRadius: "20px",
            padding: "0",
            overflow: "hidden",
            border: "1px solid rgba(255, 255, 255, 0.12)",
            background: "rgba(15, 23, 42, 0.5)"
          }}
        >
          <table style={{ width: "100%", borderCollapse: "collapse", color: "#fff" }}>
            <thead>
              <tr style={{ background: "rgba(255, 255, 255, 0.05)", borderBottom: "1px solid rgba(255,255,255,0.1)", textAlign: "left" }}>
                <th style={{ padding: "16px 24px", width: "100px" }}>Rank</th>
                <th style={{ padding: "16px 24px" }}>Player</th>
                <th style={{ padding: "16px 24px" }}>Score</th>
                <th style={{ padding: "16px 24px" }}>Accuracy</th>
              </tr>
            </thead>
            <tbody>
              {filteredLeaderboard.map((entry, index) => {
                const pct = entry.totalQuestions ? Math.round((entry.score / entry.totalQuestions) * 100) : 0;
                let rankBadge = `#${index + 1}`;
                if (index === 0) rankBadge = "🥇";
                else if (index === 1) rankBadge = "🥈";
                else if (index === 2) rankBadge = "🥉";

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
                    <td style={{ padding: "16px 24px", fontSize: index < 3 ? "1.4rem" : "1rem", fontWeight: "600" }}>
                      {rankBadge}
                    </td>
                    <td style={{ padding: "16px 24px", fontWeight: "600", color: "#ffffff" }}>
                      👤 {entry.user?.username || "Unknown"}
                    </td>
                    <td style={{ padding: "16px 24px", fontWeight: "700", color: pct >= 80 ? "#00ff88" : "#00c6ff" }}>
                      {entry.score} / {entry.totalQuestions}
                    </td>
                    <td style={{ padding: "16px 24px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <span style={{ fontWeight: "600", minWidth: "45px" }}>{pct}%</span>
                        <div style={{ flex: 1, height: "6px", background: "rgba(255,255,255,0.1)", borderRadius: "9999px", overflow: "hidden" }}>
                          <div
                            style={{
                              height: "100%",
                              width: `${pct}%`,
                              background: pct >= 80 ? "linear-gradient(90deg, #00c6ff, #00ff88)" : "#00c6ff",
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

export default LeaderboardPage;
