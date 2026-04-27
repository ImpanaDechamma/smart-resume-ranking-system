import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login, register } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    if (isRegister) {
      const ok = register(form.name, form.email, form.password);
      if (!ok) setError("Email already registered.");
    } else {
      const ok = login(form.email, form.password);
      if (!ok) setError("Invalid email or password.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-logo-wrap">
          <img src="/image.png" alt="Resume Match" className="login-logo" />
        </div>
        <h1>Resume Match</h1>
        <p className="login-subtitle">Smart Resume Ranking System</p>

        <div className="tab-toggle">
          <button className={!isRegister ? "tab active" : "tab"} onClick={() => { setIsRegister(false); setError(""); }}>Login</button>
          <button className={isRegister ? "tab active" : "tab"} onClick={() => { setIsRegister(true); setError(""); }}>Register</button>
        </div>

        <form onSubmit={handleSubmit}>
          {isRegister && (
            <div className="form-group">
              <label>Full Name</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your full name" required />
            </div>
          )}
          <div className="form-group">
            <label>Email</label>
            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="email@example.com" required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="••••••••" required />
          </div>
          {error && <p className="error-msg">{error}</p>}
          <button type="submit" className="btn-primary full-width">{isRegister ? "Create Account" : "Login"}</button>
        </form>

        {!isRegister && (
          <div className="login-hint">
            <p><strong>HR:</strong> hr@resume.com / hr123</p>
            <p><strong>Candidate:</strong> alice@email.com / alice123</p>
          </div>
        )}
      </div>
    </div>
  );
}
