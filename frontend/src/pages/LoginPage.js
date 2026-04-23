import React, { useState } from "react";

function LoginPage() {
  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  /* =========================
     HANDLE INPUT
  ========================= */
  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  /* =========================
     HANDLE LOGIN
  ========================= */
  const handleLogin = async () => {
    console.log("Login clicked");

    if (!form.username || !form.password) {
      alert("Enter username & password");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        throw new Error("Server not responding");
      }

      const data = await res.json();
      console.log("RESPONSE:", data);

      if (data.status === "success") {
        // 🔐 Save auth
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.role);
        localStorage.setItem("username", data.username);

        // 🔁 Redirect (force refresh)
        window.location.href =
          data.role === "admin" ? "/admin" : "/";
      } else {
        alert(data.message || "Invalid credentials");
      }

    } catch (err) {
      console.error(err);
      alert("Backend not running or error occurred");
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     UI
  ========================= */
  return (
    <div className="login-wrapper">
      <div className="login-box">

        <h1 className="login-title">🔐 Login</h1>

        <input
          type="text"
          name="username"
          placeholder="Enter Username"
          value={form.username}
          onChange={handleChange}
        />

        <input
          type="password"
          name="password"
          placeholder="Enter Password"
          value={form.password}
          onChange={handleChange}
        />

        <button
          className="btn"
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {/* 🔹 Helper text */}
        <p style={{ marginTop: "10px", fontSize: "13px", opacity: 0.7 }}>
          Use admin / user credentials
        </p>

      </div>
    </div>
  );
}

export default LoginPage;