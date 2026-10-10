import React from "react";
import PropTypes from "prop-types";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("[Quizora Error Boundary caught an exception]:", error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "linear-gradient(135deg, #090d16 0%, #0d1527 100%)",
            color: "#ffffff",
            padding: "24px",
            fontFamily: "Inter, system-ui, sans-serif",
            textAlign: "center",
          }}
        >
          <div
            style={{
              maxWidth: "520px",
              width: "100%",
              padding: "40px 32px",
              borderRadius: "24px",
              background: "rgba(255, 255, 255, 0.04)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
            }}
          >
            <div style={{ fontSize: "3.5rem", marginBottom: "16px" }}>⚡</div>
            <h1
              style={{
                fontSize: "1.75rem",
                fontWeight: "700",
                marginBottom: "12px",
                background: "linear-gradient(90deg, #00c6ff, #00ff88)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Something went unexpected
            </h1>
            <p
              style={{
                color: "#94a3b8",
                fontSize: "0.95rem",
                lineHeight: "1.6",
                marginBottom: "28px",
              }}
            >
              We encountered an unexpected display issue. Don't worry, your progress has been safely handled.
            </p>

            <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
              <button
                type="button"
                onClick={this.handleReload}
                style={{
                  padding: "12px 24px",
                  borderRadius: "9999px",
                  border: "1px solid rgba(255, 255, 255, 0.15)",
                  background: "rgba(255, 255, 255, 0.08)",
                  color: "#ffffff",
                  fontSize: "0.9rem",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
              >
                🔄 Refresh Page
              </button>
              <button
                type="button"
                onClick={this.handleGoHome}
                style={{
                  padding: "12px 28px",
                  borderRadius: "9999px",
                  border: "none",
                  background: "linear-gradient(90deg, #00c6ff, #00ff88)",
                  color: "#0f172a",
                  fontSize: "0.9rem",
                  fontWeight: "700",
                  cursor: "pointer",
                  boxShadow: "0 4px 15px rgba(0, 198, 255, 0.3)",
                  transition: "all 0.2s ease",
                }}
              >
                🏠 Return Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ErrorBoundary;
