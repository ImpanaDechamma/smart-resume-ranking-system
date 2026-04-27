import React from "react";
import { useAuth } from "../context/AuthContext";

export default function Navbar({ page, setPage }) {
  const { user, logout } = useAuth();
  const isHR = user?.role === "hr";

  return (
    <nav className="navbar">
      <div className="navbar-brand" onClick={() => setPage(isHR ? "dashboard" : "jobs")}>
        <img src="/image.png" alt="Resume Match" className="navbar-logo" />
        Resume Match
      </div>
      {user && (
        <div className="navbar-links">
          {isHR && (
            <button className={page === "dashboard" ? "nav-btn active" : "nav-btn"} onClick={() => setPage("dashboard")}>Dashboard</button>
          )}
          <button className={page === "jobs" ? "nav-btn active" : "nav-btn"} onClick={() => setPage("jobs")}>
            {isHR ? "Manage Jobs" : "Browse Jobs"}
          </button>
          {isHR && (
            <button className={page === "rankings" ? "nav-btn active" : "nav-btn"} onClick={() => setPage("rankings")}>Rankings</button>
          )}
          {!isHR && (
            <button className={page === "my-applications" ? "nav-btn active" : "nav-btn"} onClick={() => setPage("my-applications")}>My Applications</button>
          )}
          <span className="nav-user">{user.name} <span className="role-tag">{user.role}</span></span>
          <button className="nav-btn logout" onClick={logout}>Logout</button>
        </div>
      )}
    </nav>
  );
}
