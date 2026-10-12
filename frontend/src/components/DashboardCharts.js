import React from "react";

function DashboardCharts({ stats }) {
  const {
    totalQuestions = 0,
    totalUsers = 0,
    totalResults = 0,
    averageScore = 0,
    categoryDistribution = {},
    difficultyDistribution = {}
  } = stats;

  // Ring gauge configs
  const radius = 54;
  const strokeWidth = 9;
  const circumference = 2 * Math.PI * radius;
  const clampedScore = Math.min(Math.max(averageScore, 0), 100);
  const strokeDashoffset = circumference - (clampedScore / 100) * circumference;

  // Color dynamics based on score
  const getAccuracyColor = (score) => {
    if (score >= 80) return { start: "#00ff88", end: "#00c6ff", label: "Elite Tier", badgeBg: "rgba(0, 255, 136, 0.15)", border: "rgba(0, 255, 136, 0.4)" };
    if (score >= 60) return { start: "#00c6ff", end: "#0072ff", label: "Proficient", badgeBg: "rgba(0, 198, 255, 0.15)", border: "rgba(0, 198, 255, 0.4)" };
    if (score >= 40) return { start: "#f59e0b", end: "#f97316", label: "Intermediate", badgeBg: "rgba(245, 158, 11, 0.15)", border: "rgba(245, 158, 11, 0.4)" };
    if (score > 0) return { start: "#ef4444", end: "#dc2626", label: "Developing", badgeBg: "rgba(239, 68, 68, 0.15)", border: "rgba(239, 68, 68, 0.4)" };
    return { start: "#64748b", end: "#475569", label: "No Attempts Yet", badgeBg: "rgba(100, 116, 139, 0.15)", border: "rgba(100, 116, 139, 0.4)" };
  };

  const accuracyTheme = getAccuracyColor(clampedScore);

  // Category Icon Mapping
  const getCategoryIcon = (catName) => {
    const c = (catName || "").toLowerCase();
    if (c.includes("math")) return "📐";
    if (c.includes("science")) return "🔬";
    if (c.includes("java")) return "☕";
    if (c.includes("python")) return "🐍";
    if (c.includes("program") || c.includes("code")) return "💻";
    if (c.includes("web") || c.includes("html") || c.includes("react")) return "🌐";
    if (c.includes("data") || c.includes("algo")) return "⚡";
    if (c.includes("history")) return "📜";
    if (c.includes("art")) return "🎨";
    return "💡";
  };

  // Categories processing
  const categories = Object.keys(categoryDistribution);
  const totalCategoryQuestions = Object.values(categoryDistribution).reduce((a, b) => a + b, 0) || totalQuestions || 1;

  // Difficulties processing
  const easyCount = difficultyDistribution["Easy"] || difficultyDistribution["EASY"] || 0;
  const mediumCount = difficultyDistribution["Medium"] || difficultyDistribution["MEDIUM"] || 0;
  const hardCount = difficultyDistribution["Hard"] || difficultyDistribution["HARD"] || 0;
  const totalDiffQuestions = (easyCount + mediumCount + hardCount) || totalQuestions || 1;

  const easyPct = Math.round((easyCount / totalDiffQuestions) * 100);
  const mediumPct = Math.round((mediumCount / totalDiffQuestions) * 100);
  const hardPct = Math.max(0, 100 - easyPct - mediumPct);

  return (
    <div style={{ marginTop: "10px" }}>
      {/* 📊 TOP KPI SUMMARY CARDS */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "18px",
          marginBottom: "26px"
        }}
      >
        {/* Card 1: Total Questions */}
        <div
          className="liquid-glass hover-scale"
          style={{
            borderRadius: "20px",
            padding: "24px 20px",
            background: "rgba(15, 23, 42, 0.65)",
            border: "1px solid rgba(0, 198, 255, 0.25)",
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.4)",
            display: "flex",
            alignItems: "center",
            gap: "16px"
          }}
        >
          <div
            style={{
              width: "52px",
              height: "52px",
              borderRadius: "14px",
              background: "linear-gradient(135deg, rgba(0, 198, 255, 0.2), rgba(0, 114, 255, 0.2))",
              border: "1px solid rgba(0, 198, 255, 0.4)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.6rem"
            }}
          >
            📚
          </div>
          <div>
            <span style={{ fontSize: "0.82rem", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: "600" }}>
              Total Questions
            </span>
            <h2 style={{ margin: "2px 0 0", fontSize: "1.9rem", fontWeight: "700", color: "#ffffff", fontFamily: "'Outfit', sans-serif" }}>
              {totalQuestions}
            </h2>
          </div>
        </div>

        {/* Card 2: Registered Users */}
        <div
          className="liquid-glass hover-scale"
          style={{
            borderRadius: "20px",
            padding: "24px 20px",
            background: "rgba(15, 23, 42, 0.65)",
            border: "1px solid rgba(168, 85, 247, 0.25)",
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.4)",
            display: "flex",
            alignItems: "center",
            gap: "16px"
          }}
        >
          <div
            style={{
              width: "52px",
              height: "52px",
              borderRadius: "14px",
              background: "linear-gradient(135deg, rgba(168, 85, 247, 0.2), rgba(139, 92, 246, 0.2))",
              border: "1px solid rgba(168, 85, 247, 0.4)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.6rem"
            }}
          >
            👥
          </div>
          <div>
            <span style={{ fontSize: "0.82rem", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: "600" }}>
              Registered Users
            </span>
            <h2 style={{ margin: "2px 0 0", fontSize: "1.9rem", fontWeight: "700", color: "#ffffff", fontFamily: "'Outfit', sans-serif" }}>
              {totalUsers}
            </h2>
          </div>
        </div>

        {/* Card 3: Total Attempts */}
        <div
          className="liquid-glass hover-scale"
          style={{
            borderRadius: "20px",
            padding: "24px 20px",
            background: "rgba(15, 23, 42, 0.65)",
            border: "1px solid rgba(0, 255, 136, 0.25)",
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.4)",
            display: "flex",
            alignItems: "center",
            gap: "16px"
          }}
        >
          <div
            style={{
              width: "52px",
              height: "52px",
              borderRadius: "14px",
              background: "linear-gradient(135deg, rgba(0, 255, 136, 0.2), rgba(16, 185, 129, 0.2))",
              border: "1px solid rgba(0, 255, 136, 0.4)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.6rem"
            }}
          >
            🎯
          </div>
          <div>
            <span style={{ fontSize: "0.82rem", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: "600" }}>
              Quiz Attempts
            </span>
            <h2 style={{ margin: "2px 0 0", fontSize: "1.9rem", fontWeight: "700", color: "#ffffff", fontFamily: "'Outfit', sans-serif" }}>
              {totalResults}
            </h2>
          </div>
        </div>
      </div>

      {/* 📈 3 CORE ANALYTICS PANELS (ACCURACY, CATEGORIES, DIFFICULTIES) */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "24px"
        }}
      >
        {/* PANEL 1: AVERAGE ACCURACY (CIRCULAR RADIAL GAUGE) */}
        <div
          className="liquid-glass"
          style={{
            borderRadius: "24px",
            padding: "28px 24px",
            background: "rgba(15, 23, 42, 0.65)",
            border: "1px solid rgba(255, 255, 255, 0.12)",
            boxShadow: "0 15px 35px rgba(0, 0, 0, 0.4)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between"
          }}
        >
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <h3 style={{ margin: 0, fontSize: "1.2rem", fontWeight: "700", color: "#ffffff", display: "flex", alignItems: "center", gap: "8px" }}>
                <span>🎯</span> Average Accuracy
              </h3>
              <span
                style={{
                  fontSize: "0.75rem",
                  fontWeight: "700",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  padding: "4px 10px",
                  borderRadius: "12px",
                  background: accuracyTheme.badgeBg,
                  color: accuracyTheme.start,
                  border: `1px solid ${accuracyTheme.border}`
                }}
              >
                {accuracyTheme.label}
              </span>
            </div>
            <p style={{ margin: "0 0 20px", fontSize: "0.88rem", color: "#94a3b8" }}>
              Overall player performance accuracy
            </p>
          </div>

          {/* Radial Progress Gauge */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "10px 0" }}>
            <div style={{ position: "relative", width: "160px", height: "160px" }}>
              <svg width="160" height="160" viewBox="0 0 140 140" style={{ transform: "rotate(-90deg)" }}>
                <defs>
                  <linearGradient id="accuracyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor={accuracyTheme.start} />
                    <stop offset="100%" stopColor={accuracyTheme.end} />
                  </linearGradient>
                  <filter id="gaugeGlow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>
                {/* Background Track */}
                <circle
                  cx="70"
                  cy="70"
                  r={radius}
                  fill="none"
                  stroke="rgba(255, 255, 255, 0.08)"
                  strokeWidth={strokeWidth}
                />
                {/* Animated Fill Track */}
                <circle
                  cx="70"
                  cy="70"
                  r={radius}
                  fill="none"
                  stroke="url(#accuracyGradient)"
                  strokeWidth={strokeWidth}
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  filter="url(#gaugeGlow)"
                  style={{
                    transition: "stroke-dashoffset 1s cubic-bezier(0.16, 1, 0.3, 1)"
                  }}
                />
              </svg>

              {/* Center Content */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  pointerEvents: "none"
                }}
              >
                <span
                  style={{
                    fontFamily: "'Outfit', sans-serif",
                    fontSize: "2.2rem",
                    fontWeight: "800",
                    color: "#ffffff",
                    letterSpacing: "-0.5px",
                    lineHeight: 1
                  }}
                >
                  {averageScore}%
                </span>
                <span style={{ fontSize: "0.72rem", color: "#94a3b8", marginTop: "4px", textTransform: "uppercase", letterSpacing: "1px", fontWeight: "600" }}>
                  Accuracy Rate
                </span>
              </div>
            </div>
          </div>

          {/* Quick Metrics Footer */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "10px",
              marginTop: "20px",
              paddingTop: "16px",
              borderTop: "1px solid rgba(255, 255, 255, 0.08)"
            }}
          >
            <div style={{ textAlign: "center" }}>
              <span style={{ fontSize: "0.75rem", color: "#94a3b8" }}>Evaluated Attempts</span>
              <p style={{ margin: "3px 0 0", fontSize: "1.1rem", fontWeight: "700", color: "#00c6ff" }}>{totalResults}</p>
            </div>
            <div style={{ textAlign: "center" }}>
              <span style={{ fontSize: "0.75rem", color: "#94a3b8" }}>Benchmark Standard</span>
              <p style={{ margin: "3px 0 0", fontSize: "1.1rem", fontWeight: "700", color: "#00ff88" }}>75.0%</p>
            </div>
          </div>
        </div>

        {/* PANEL 2: CATEGORY DISTRIBUTION */}
        <div
          className="liquid-glass"
          style={{
            borderRadius: "24px",
            padding: "28px 24px",
            background: "rgba(15, 23, 42, 0.65)",
            border: "1px solid rgba(255, 255, 255, 0.12)",
            boxShadow: "0 15px 35px rgba(0, 0, 0, 0.4)",
            display: "flex",
            flexDirection: "column"
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
            <h3 style={{ margin: 0, fontSize: "1.2rem", fontWeight: "700", color: "#ffffff", display: "flex", alignItems: "center", gap: "8px" }}>
              <span>📂</span> Category Distribution
            </h3>
            <span
              style={{
                fontSize: "0.75rem",
                fontWeight: "700",
                padding: "3px 9px",
                borderRadius: "10px",
                background: "rgba(0, 198, 255, 0.15)",
                color: "#00c6ff",
                border: "1px solid rgba(0, 198, 255, 0.3)"
              }}
            >
              {categories.length} {categories.length === 1 ? "Domain" : "Domains"}
            </span>
          </div>
          <p style={{ margin: "0 0 20px", fontSize: "0.88rem", color: "#94a3b8" }}>
            Questions count per category
          </p>

          {/* List or Empty State */}
          {categories.length === 0 ? (
            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "30px 20px",
                borderRadius: "16px",
                background: "rgba(255, 255, 255, 0.03)",
                border: "1px dashed rgba(255, 255, 255, 0.15)",
                textAlign: "center"
              }}
            >
              <span style={{ fontSize: "2rem", marginBottom: "8px" }}>📭</span>
              <p style={{ margin: "0 0 6px", fontSize: "0.95rem", fontWeight: "600", color: "#ffffff" }}>
                No questions logged
              </p>
              <p style={{ margin: 0, fontSize: "0.8rem", color: "#94a3b8" }}>
                Import CSV or add questions from the Questions tab to populate domain stats.
              </p>
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "14px",
                maxHeight: "260px",
                overflowY: "auto",
                paddingRight: "4px"
              }}
            >
              {categories.map((cat) => {
                const count = categoryDistribution[cat] || 0;
                const percentage = Math.round((count / totalCategoryQuestions) * 100);

                return (
                  <div key={cat}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                      <span style={{ fontSize: "0.88rem", fontWeight: "600", color: "#e2e8f0", display: "flex", alignItems: "center", gap: "6px" }}>
                        <span>{getCategoryIcon(cat)}</span> {cat}
                      </span>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <span style={{ fontSize: "0.82rem", fontWeight: "700", color: "#00c6ff" }}>
                          {count} {count === 1 ? "q" : "q's"}
                        </span>
                        <span style={{ fontSize: "0.75rem", color: "#94a3b8", minWidth: "35px", textAlign: "right" }}>
                          ({percentage}%)
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar Track */}
                    <div
                      style={{
                        width: "100%",
                        height: "7px",
                        background: "rgba(255, 255, 255, 0.08)",
                        borderRadius: "9999px",
                        overflow: "hidden"
                      }}
                    >
                      <div
                        style={{
                          height: "100%",
                          width: `${percentage}%`,
                          borderRadius: "9999px",
                          background: "linear-gradient(90deg, #00c6ff, #a855f7)",
                          boxShadow: "0 0 10px rgba(0, 198, 255, 0.5)",
                          transition: "width 0.8s cubic-bezier(0.16, 1, 0.3, 1)"
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* PANEL 3: DIFFICULTY LEVELS */}
        <div
          className="liquid-glass"
          style={{
            borderRadius: "24px",
            padding: "28px 24px",
            background: "rgba(15, 23, 42, 0.65)",
            border: "1px solid rgba(255, 255, 255, 0.12)",
            boxShadow: "0 15px 35px rgba(0, 0, 0, 0.4)",
            display: "flex",
            flexDirection: "column"
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
            <h3 style={{ margin: 0, fontSize: "1.2rem", fontWeight: "700", color: "#ffffff", display: "flex", alignItems: "center", gap: "8px" }}>
              <span>⚡</span> Difficulty Levels
            </h3>
            <span
              style={{
                fontSize: "0.75rem",
                fontWeight: "700",
                padding: "3px 9px",
                borderRadius: "10px",
                background: "rgba(245, 158, 11, 0.15)",
                color: "#f59e0b",
                border: "1px solid rgba(245, 158, 11, 0.3)"
              }}
            >
              3 Tiers
            </span>
          </div>
          <p style={{ margin: "0 0 20px", fontSize: "0.88rem", color: "#94a3b8" }}>
            Difficulty dispersion chart
          </p>

          {/* Unified Stacked Bar */}
          <div
            style={{
              width: "100%",
              height: "10px",
              borderRadius: "9999px",
              overflow: "hidden",
              display: "flex",
              marginBottom: "20px",
              background: "rgba(255, 255, 255, 0.08)"
            }}
          >
            <div style={{ width: `${easyPct}%`, background: "linear-gradient(90deg, #10b981, #059669)", transition: "width 0.8s ease" }} title={`Easy: ${easyCount}`} />
            <div style={{ width: `${mediumPct}%`, background: "linear-gradient(90deg, #f59e0b, #d97706)", transition: "width 0.8s ease" }} title={`Medium: ${mediumCount}`} />
            <div style={{ width: `${hardPct}%`, background: "linear-gradient(90deg, #ef4444, #dc2626)", transition: "width 0.8s ease" }} title={`Hard: ${hardCount}`} />
          </div>

          {/* 3 Tier Cards */}
          <div style={{ display: "flex", flexDirection: "column", gap: "12px", flex: 1, justifyContent: "center" }}>
            {/* Easy Tier */}
            <div
              style={{
                padding: "12px 14px",
                borderRadius: "14px",
                background: "rgba(16, 185, 129, 0.08)",
                border: "1px solid rgba(16, 185, 129, 0.25)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ fontSize: "1.1rem" }}>🟢</span>
                <div>
                  <h4 style={{ margin: 0, fontSize: "0.92rem", fontWeight: "700", color: "#10b981" }}>Easy</h4>
                  <span style={{ fontSize: "0.74rem", color: "#94a3b8" }}>Beginner Friendly</span>
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <span style={{ fontSize: "1.05rem", fontWeight: "700", color: "#ffffff" }}>{easyCount}</span>
                <span style={{ fontSize: "0.75rem", color: "#10b981", marginLeft: "6px", fontWeight: "600" }}>({easyPct}%)</span>
              </div>
            </div>

            {/* Medium Tier */}
            <div
              style={{
                padding: "12px 14px",
                borderRadius: "14px",
                background: "rgba(245, 158, 11, 0.08)",
                border: "1px solid rgba(245, 158, 11, 0.25)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ fontSize: "1.1rem" }}>🟡</span>
                <div>
                  <h4 style={{ margin: 0, fontSize: "0.92rem", fontWeight: "700", color: "#f59e0b" }}>Medium</h4>
                  <span style={{ fontSize: "0.74rem", color: "#94a3b8" }}>Standard Skill</span>
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <span style={{ fontSize: "1.05rem", fontWeight: "700", color: "#ffffff" }}>{mediumCount}</span>
                <span style={{ fontSize: "0.75rem", color: "#f59e0b", marginLeft: "6px", fontWeight: "600" }}>({mediumPct}%)</span>
              </div>
            </div>

            {/* Hard Tier */}
            <div
              style={{
                padding: "12px 14px",
                borderRadius: "14px",
                background: "rgba(239, 68, 68, 0.08)",
                border: "1px solid rgba(239, 68, 68, 0.25)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ fontSize: "1.1rem" }}>🔴</span>
                <div>
                  <h4 style={{ margin: 0, fontSize: "0.92rem", fontWeight: "700", color: "#ef4444" }}>Hard</h4>
                  <span style={{ fontSize: "0.74rem", color: "#94a3b8" }}>Advanced Mastery</span>
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <span style={{ fontSize: "1.05rem", fontWeight: "700", color: "#ffffff" }}>{hardCount}</span>
                <span style={{ fontSize: "0.75rem", color: "#ef4444", marginLeft: "6px", fontWeight: "600" }}>({hardPct}%)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardCharts;
