import React, { useEffect, useState } from "react";
import { getUserHistory } from "../services/api";
import { useToast } from "../components/Toast";

function ProfilePage() {
  const { addToast } = useToast();
  const [history, setHistory] = useState([]);

  const username = localStorage.getItem("username") || "Learner";
  const email = localStorage.getItem("email") || "user@quizora.com";
  const role = (localStorage.getItem("role") || "user").toUpperCase();

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
      icon: "⚡",
      name: "First Steps",
      desc: "Completed your first quiz attempt.",
      unlocked: totalQuizzes >= 1,
    },
    {
      id: "hard_worker",
      icon: "🔥",
      name: "Hard Worker",
      desc: "Completed at least 5 quiz attempts.",
      unlocked: totalQuizzes >= 5,
    },
    {
      id: "grandmaster",
      icon: "👑",
      name: "Grandmaster",
      desc: "Completed at least 10 quiz attempts.",
      unlocked: totalQuizzes >= 10,
    },
    {
      id: "perfectionist",
      icon: "🏆",
      name: "Perfectionist",
      desc: "Achieved a 100% score on a quiz.",
      unlocked: hasPerfectScore,
    },
    {
      id: "scholar",
      icon: "🧠",
      name: "Smart Thinker",
      desc: "Maintained an average accuracy of 75% or higher.",
      unlocked: averageAccuracy >= 75 && totalQuizzes > 0,
    },
  ];

  const unlockedCount = badges.filter((b) => b.unlocked).length;
  const badgeProgressPct = Math.round((unlockedCount / badges.length) * 100);

  return (
    <div className="container" style={{ maxWidth: "950px", margin: "0 auto", padding: "40px 24px" }}>
      
      {/* 👤 HERO PROFILE CARD */}
      <div
        className="liquid-glass animate-fade-rise"
        style={{
          borderRadius: "28px",
          padding: "36px 32px",
          marginBottom: "36px",
          border: "1px solid rgba(0, 198, 255, 0.3)",
          background: "linear-gradient(135deg, rgba(15, 23, 42, 0.8), rgba(30, 27, 75, 0.7))",
          boxShadow: "0 20px 40px rgba(0, 0, 0, 0.4)",
          display: "flex",
          alignItems: "center",
          gap: "28px",
          flexWrap: "wrap",
          position: "relative",
          overflow: "hidden"
        }}
      >
        {/* Glow Accent */}
        <div
          style={{
            position: "absolute",
            top: "-50px",
            right: "-50px",
            width: "200px",
            height: "200px",
            background: "radial-gradient(circle, rgba(0, 198, 255, 0.25) 0%, transparent 70%)",
            pointerEvents: "none"
          }}
        />

        {/* Avatar Circle */}
        <div
          style={{
            width: "90px",
            height: "90px",
            borderRadius: "50%",
            background: "linear-gradient(135deg, #00c6ff, #00ff88)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "2.4rem",
            fontWeight: "800",
            color: "#0f172a",
            boxShadow: "0 0 30px rgba(0, 198, 255, 0.4)",
            border: "3px solid rgba(255, 255, 255, 0.3)"
          }}
        >
          {username.substring(0, 1).toUpperCase()}
        </div>

        {/* User Details */}
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "6px", flexWrap: "wrap" }}>
            <h1
              style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: "clamp(1.8rem, 4vw, 2.5rem)",
                fontWeight: "700",
                color: "#ffffff",
                margin: 0
              }}
            >
              {username}
            </h1>
            <span
              style={{
                fontSize: "0.75rem",
                fontWeight: "700",
                letterSpacing: "1px",
                padding: "4px 12px",
                borderRadius: "9999px",
                background: role === "ADMIN" ? "linear-gradient(90deg, #ff4d6d, #ffb700)" : "rgba(0, 198, 255, 0.2)",
                color: role === "ADMIN" ? "#ffffff" : "#00c6ff",
                border: `1px solid ${role === "ADMIN" ? "#ff4d6d" : "rgba(0, 198, 255, 0.4)"}`
              }}
            >
              {role === "ADMIN" ? "👑 ADMIN" : "⚡ SCHOLAR"}
            </span>
          </div>
          <p style={{ color: "#a1a1aa", fontSize: "0.95rem", margin: 0 }}>✉️ {email}</p>
        </div>
      </div>

      {/* 📊 ANALYTICS STATS GRID */}
      <div
        className="animate-fade-rise-delay"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "20px",
          marginBottom: "40px"
        }}
      >
        {/* Quizzes Attempted */}
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
          <p style={{ fontSize: "0.8rem", color: "#a1a1aa", textTransform: "uppercase", letterSpacing: "1px" }}>Quizzes Taken</p>
          <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: "2.2rem", color: "#ffffff", margin: "6px 0 0" }}>
            {totalQuizzes}
          </h2>
        </div>

        {/* Total Questions */}
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
          <p style={{ fontSize: "0.8rem", color: "#a1a1aa", textTransform: "uppercase", letterSpacing: "1px" }}>Questions Answered</p>
          <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: "2.2rem", color: "#ffffff", margin: "6px 0 0" }}>
            {totalQuestions}
          </h2>
        </div>

        {/* Avg Accuracy */}
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
          <p style={{ fontSize: "0.8rem", color: "#a1a1aa", textTransform: "uppercase", letterSpacing: "1px" }}>Average Accuracy</p>
          <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: "2.2rem", color: "#00c6ff", margin: "6px 0 0" }}>
            {averageAccuracy}%
          </h2>
        </div>

        {/* Badges Unlocked */}
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
          <p style={{ fontSize: "0.8rem", color: "#a1a1aa", textTransform: "uppercase", letterSpacing: "1px" }}>Badges Unlocked</p>
          <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: "2.2rem", color: "#00ff88", margin: "6px 0 0" }}>
            {unlockedCount} / {badges.length}
          </h2>
        </div>
      </div>

      {/* 🏅 GAMIFICATION ACHIEVEMENTS SECTION */}
      <div className="animate-fade-rise-delay-2" style={{ marginBottom: "40px" }}>
        
        {/* Section Title & Progress Bar */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "16px", flexWrap: "wrap", gap: "10px" }}>
          <div>
            <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: "1.6rem", color: "#ffffff", fontWeight: "700", margin: "0 0 4px 0" }}>
              🏅 Gamification Achievements
            </h2>
            <p style={{ color: "#a1a1aa", fontSize: "0.9rem", margin: 0 }}>
              Complete challenges to unlock exclusive scholar badges.
            </p>
          </div>
          <div style={{ textAlign: "right" }}>
            <span style={{ fontSize: "0.85rem", color: "#00ff88", fontWeight: "600" }}>{badgeProgressPct}% Unlocked</span>
          </div>
        </div>

        {/* Badge Overall Progress Bar */}
        <div style={{ height: "6px", background: "rgba(255, 255, 255, 0.1)", borderRadius: "9999px", overflow: "hidden", marginBottom: "24px" }}>
          <div style={{ height: "100%", width: `${badgeProgressPct}%`, background: "linear-gradient(90deg, #00c6ff, #00ff88)", borderRadius: "9999px", transition: "width 0.6s ease" }} />
        </div>

        {/* Badges Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "20px"
          }}
        >
          {badges.map((badge) => (
            <div
              key={badge.id}
              className="liquid-glass"
              style={{
                borderRadius: "20px",
                padding: "24px 20px",
                border: badge.unlocked ? "1.5px solid rgba(0, 255, 136, 0.5)" : "1px solid rgba(255, 255, 255, 0.08)",
                background: badge.unlocked ? "rgba(15, 23, 42, 0.6)" : "rgba(15, 23, 42, 0.25)",
                boxShadow: badge.unlocked ? "0 0 25px rgba(0, 255, 136, 0.15)" : "none",
                opacity: badge.unlocked ? 1 : 0.55,
                transition: "transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease",
                display: "flex",
                gap: "16px",
                alignItems: "flex-start"
              }}
              onMouseEnter={(e) => {
                if (badge.unlocked) {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow = "0 0 35px rgba(0, 255, 136, 0.25)";
                }
              }}
              onMouseLeave={(e) => {
                if (badge.unlocked) {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 0 25px rgba(0, 255, 136, 0.15)";
                }
              }}
            >
              {/* Badge Icon */}
              <div
                style={{
                  width: "52px",
                  height: "52px",
                  borderRadius: "16px",
                  background: badge.unlocked ? "rgba(0, 255, 136, 0.15)" : "rgba(255, 255, 255, 0.05)",
                  border: `1px solid ${badge.unlocked ? "#00ff88" : "rgba(255, 255, 255, 0.1)"}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.6rem",
                  flexShrink: 0
                }}
              >
                {badge.icon}
              </div>

              {/* Badge Content */}
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                  <h4 style={{ color: badge.unlocked ? "#ffffff" : "#a1a1aa", fontSize: "1.05rem", fontWeight: "600", margin: 0 }}>
                    {badge.name}
                  </h4>
                  {badge.unlocked ? (
                    <span style={{ fontSize: "0.75rem", color: "#00ff88", fontWeight: "700" }}>✓ UNLOCKED</span>
                  ) : (
                    <span style={{ fontSize: "0.75rem", color: "#a1a1aa" }}>🔒 LOCKED</span>
                  )}
                </div>
                <p style={{ color: "#a1a1aa", fontSize: "0.85rem", lineHeight: 1.5, margin: 0 }}>
                  {badge.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

export default ProfilePage;
