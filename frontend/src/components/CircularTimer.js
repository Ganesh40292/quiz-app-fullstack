import React from "react";

function CircularTimer({ timeLeft, totalTime, size = 110, strokeWidth = 8 }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  
  const progress = totalTime > 0 ? timeLeft / totalTime : 0;
  const strokeDashoffset = circumference - progress * circumference;

  // Determine color based on time remaining ratio
  let strokeColor = "#00ff88"; // Green
  if (progress <= 0.25) {
    strokeColor = "#ff4d6d"; // Red
  } else if (progress <= 0.5) {
    strokeColor = "#ffb700"; // Yellow
  }

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;

  return (
    <div style={{ position: "relative", width: size, height: size, margin: "0 auto 16px" }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        {/* Background Track Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(255, 255, 255, 0.1)"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Animated Foreground Ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 1s linear, stroke 0.5s ease" }}
        />
      </svg>

      {/* Center Digital Display */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          color: strokeColor,
          fontFamily: "Inter, sans-serif",
          fontWeight: "700",
          fontSize: "1.1rem"
        }}
      >
        <span>{formattedTime}</span>
        <span style={{ fontSize: "0.65rem", color: "#a1a1aa", textTransform: "uppercase", letterSpacing: "1px" }}>
          Remaining
        </span>
      </div>
    </div>
  );
}

export default CircularTimer;
