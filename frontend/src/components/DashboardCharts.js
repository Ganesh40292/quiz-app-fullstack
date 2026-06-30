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
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (averageScore / 100) * circumference;

  // Bar chart configs for category distribution
  const categories = Object.keys(categoryDistribution);
  const catValues = Object.values(categoryDistribution);
  const maxCatVal = Math.max(...catValues, 1);
  const barChartHeight = 120;
  const barWidth = 35;
  const barGap = 20;
  const chartWidth = categories.length * (barWidth + barGap) + 40;

  // Bar chart for difficulty distribution
  const difficulties = Object.keys(difficultyDistribution);
  const diffValues = Object.values(difficultyDistribution);
  const maxDiffVal = Math.max(...diffValues, 1);
  const diffChartWidth = difficulties.length * (barWidth + barGap) + 40;

  return (
    <div>
      {/* 📊 KPI Stats Cards */}
      <div className="analytics-grid">
        <div className="card" style={{ textAlign: "center", margin: "10px 0" }}>
          <h2 style={{ fontSize: "36px", color: "var(--accent)" }}>{totalQuestions}</h2>
          <p>Total Questions</p>
        </div>
        <div className="card" style={{ textAlign: "center", margin: "10px 0" }}>
          <h2 style={{ fontSize: "36px", color: "var(--accent)" }}>{totalUsers}</h2>
          <p>Registered Users</p>
        </div>
        <div className="card" style={{ textAlign: "center", margin: "10px 0" }}>
          <h2 style={{ fontSize: "36px", color: "var(--accent)" }}>{totalResults}</h2>
          <p>Total Quiz Attempts</p>
        </div>
      </div>

      <div className="analytics-grid" style={{ marginTop: "20px" }}>
        {/* Gauge Chart (Average Score) */}
        <div className="card chart-card">
          <h3>Average Accuracy</h3>
          <svg width="150" height="150" viewBox="0 0 120 120" className="chart-svg">
            <circle
              cx="60"
              cy="60"
              r={radius}
              fill="transparent"
              stroke="var(--progress-bg)"
              strokeWidth="10"
            />
            <circle
              cx="60"
              cy="60"
              r={radius}
              fill="transparent"
              stroke="var(--accent)"
              strokeWidth="10"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              transform="rotate(-90 60 60)"
              className="gauge-circle"
            />
            <text
              x="50%"
              y="53%"
              textAnchor="middle"
              dy=".3em"
              fill="var(--text-primary)"
              fontSize="18"
              fontWeight="bold"
            >
              {averageScore}%
            </text>
          </svg>
          <p style={{ marginTop: "10px" }}>Overall player performance accuracy</p>
        </div>

        {/* Bar Chart (Categories) */}
        <div className="card chart-card">
          <h3>Category Distribution</h3>
          {categories.length === 0 ? (
            <p style={{ margin: "40px 0" }}>No questions logged</p>
          ) : (
            <svg
              width="100%"
              height="150"
              viewBox={`0 0 ${Math.max(chartWidth, 200)} 150`}
              className="chart-svg"
            >
              {categories.map((cat, idx) => {
                const count = categoryDistribution[cat];
                const height = (count / maxCatVal) * barChartHeight;
                const x = idx * (barWidth + barGap) + 30;
                const y = 130 - height;

                return (
                  <g key={cat}>
                    <rect
                      x={x}
                      y={y}
                      width={barWidth}
                      height={height}
                      fill="url(#barGradient)"
                      rx="4"
                      className="bar-rect"
                    />
                    <text
                      x={x + barWidth / 2}
                      y={y - 8}
                      textAnchor="middle"
                      fill="var(--text-primary)"
                      fontSize="10"
                      fontWeight="bold"
                    >
                      {count}
                    </text>
                    <text
                      x={x + barWidth / 2}
                      y="145"
                      textAnchor="middle"
                      fill="var(--text-secondary)"
                      fontSize="9"
                    >
                      {cat.length > 8 ? `${cat.substring(0, 6)}..` : cat}
                    </text>
                  </g>
                );
              })}
              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--accent)" />
                  <stop offset="100%" stopColor="var(--accent-secondary)" />
                </linearGradient>
              </defs>
            </svg>
          )}
          <p style={{ marginTop: "10px" }}>Questions count per category</p>
        </div>

        {/* Bar Chart (Difficulties) */}
        <div className="card chart-card">
          <h3>Difficulty Levels</h3>
          {difficulties.length === 0 ? (
            <p style={{ margin: "40px 0" }}>No difficulties loaded</p>
          ) : (
            <svg
              width="100%"
              height="150"
              viewBox={`0 0 ${Math.max(diffChartWidth, 200)} 150`}
              className="chart-svg"
            >
              {difficulties.map((diff, idx) => {
                const count = difficultyDistribution[diff];
                const height = (count / maxDiffVal) * barChartHeight;
                const x = idx * (barWidth + barGap) + 30;
                const y = 130 - height;

                return (
                  <g key={diff}>
                    <rect
                      x={x}
                      y={y}
                      width={barWidth}
                      height={height}
                      fill="url(#diffGradient)"
                      rx="4"
                      className="bar-rect"
                    />
                    <text
                      x={x + barWidth / 2}
                      y={y - 8}
                      textAnchor="middle"
                      fill="var(--text-primary)"
                      fontSize="10"
                      fontWeight="bold"
                    >
                      {count}
                    </text>
                    <text
                      x={x + barWidth / 2}
                      y="145"
                      textAnchor="middle"
                      fill="var(--text-secondary)"
                      fontSize="9"
                    >
                      {diff}
                    </text>
                  </g>
                );
              })}
              <defs>
                <linearGradient id="diffGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ff4d6d" />
                  <stop offset="100%" stopColor="#dc3545" />
                </linearGradient>
              </defs>
            </svg>
          )}
          <p style={{ marginTop: "10px" }}>Difficulty dispersion chart</p>
        </div>
      </div>
    </div>
  );
}

export default DashboardCharts;
