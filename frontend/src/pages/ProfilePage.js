import React, { useEffect, useState } from "react";
import { getUserHistory } from "../services/api";
import { useToast } from "../components/Toast";

function ProfilePage() {
  const { addToast } = useToast();
  const [history, setHistory] = useState([]);

  const username = localStorage.getItem("username") || "User";
  const email = localStorage.getItem("email") || "No email provided";

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await getUserHistory();
        setHistory(data);
      } catch (err) {
        console.error(err);
        addToast("Failed to fetch user history details.", "error");
      }
    };
    fetchHistory();
  }, [addToast]);

  // Calculations for profile stats
  const totalQuizzes = history.length;
  
  let totalScore = 0;
  let totalQuestions = 0;
  let hasPerfectScore = false;

  history.forEach((attempt) => {
    totalScore += attempt.score;
    totalQuestions += attempt.totalQuestions;
    if (attempt.score === attempt.totalQuestions && attempt.totalQuestions > 0) {
      hasPerfectScore = true;
    }
  });

  const averageAccuracy = totalQuestions > 0 ? Math.round((totalScore / totalQuestions) * 100) : 0;

  // Gamification badge allocations
  const badges = [
    {
      id: "first_steps",
      name: "⚡ First Steps",
      desc: "Completed your first quiz attempt.",
      unlocked: totalQuizzes >= 1,
    },
    {
      id: "hard_worker",
      name: "🔥 Hard Worker",
      desc: "Completed at least 5 quiz attempts.",
      unlocked: totalQuizzes >= 5,
    },
    {
      id: "grandmaster",
      name: "👑 Grandmaster",
      desc: "Completed at least 10 quiz attempts.",
      unlocked: totalQuizzes >= 10,
    },
    {
      id: "perfectionist",
      name: "🏆 Perfectionist",
      desc: "Achieved a 100% score on a quiz.",
      unlocked: hasPerfectScore,
    },
    {
      id: "scholar",
      name: "🧠 Smart Thinker",
      desc: "Maintained an average accuracy of 75% or higher.",
      unlocked: averageAccuracy >= 75 && totalQuizzes > 0,
    },
  ];

  return (
    <div className="container">
      <h1>👤 My Profile</h1>

      <div className="card profile-header">
        <div className="profile-avatar">
          {username.substring(0, 1).toUpperCase()}
        </div>
        <div>
          <h2>{username}</h2>
          <p>{email}</p>
        </div>
      </div>

      <div className="analytics-grid">
        <div className="card" style={{ textAlign: "center", margin: "10px 0" }}>
          <h2>{totalQuizzes}</h2>
          <p>Quizzes Completed</p>
        </div>
        <div className="card" style={{ textAlign: "center", margin: "10px 0" }}>
          <h2>{averageAccuracy}%</h2>
          <p>Average Accuracy</p>
        </div>
        <div className="card" style={{ textAlign: "center", margin: "10px 0" }}>
          <h2>{badges.filter((b) => b.unlocked).length} / {badges.length}</h2>
          <p>Badges Unlocked</p>
        </div>
      </div>

      <h2 style={{ marginTop: "30px" }}>🏅 Gamification Achievements</h2>
      <div className="badge-grid">
        {badges.map((badge) => (
          <div key={badge.id} className={`badge-item ${badge.unlocked ? "active" : ""}`}>
            <div className="badge-icon">
              {badge.id === "first_steps" && "⚡"}
              {badge.id === "hard_worker" && "🔥"}
              {badge.id === "grandmaster" && "👑"}
              {badge.id === "perfectionist" && "🏆"}
              {badge.id === "scholar" && "🧠"}
            </div>
            <div className="badge-name">{badge.name}</div>
            <div className="badge-desc">{badge.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProfilePage;
