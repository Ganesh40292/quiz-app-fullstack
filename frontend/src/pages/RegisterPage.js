import React, { useState } from "react";
import { registerUser } from "../services/api";

function RegisterPage() {
  const [form, setForm] = useState({
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleRegister = async () => {
    if (!form.username || !form.password) {
      alert("Enter username & password");
      return;
    }

    try {
      setLoading(true);
      const data = await registerUser(form);

      if (data.status === "success") {
        alert("Registration successful! Please login.");
        window.location.href = "/login";
      } else {
        alert(data.message || "Registration failed");
      }
    } catch (err) {
      console.error(err);
      alert("Backend not running or error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-box">
        <h1 className="login-title">📝 Register</h1>
        <input type="text" name="username" placeholder="Choose Username" value={form.username} onChange={handleChange} />
        <input type="password" name="password" placeholder="Choose Password" value={form.password} onChange={handleChange} />
        <button className="btn" onClick={handleRegister} disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>
        <p style={{ marginTop: "15px", fontSize: "14px", cursor: "pointer", opacity: 0.8 }} onClick={() => window.location.href = "/login"}>
          Already have an account? Login here.
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;
