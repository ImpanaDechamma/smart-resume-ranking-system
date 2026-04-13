import React from "react";
import { useApp } from "../context/AppContext";

export default function HRDashboard({ setPage }) {
  const { jobs, applications } = useApp();

  const avgScore = applications.length
    ? Math.round(applications.reduce((sum, a) => sum + a.score, 0) / applications.length)
    : 0;

  const topApp = [...applications].sort((a, b) => b.score - a.score)[0];

  const scoreRanges = [
    { label: "90-100", count: applications.filter((a) => a.score >= 90).length, color: "#6b8f71" },
    { label: "75-89", count: applications.filter((a) => a.score >= 75 && a.score < 90).length, color: "#9c6b3c" },
    { label: "60-74", count: applications.filter((a) => a.score >= 60 && a.score < 75).length, color: "#a07830" },
    { label: "Below 60", count: applications.filter((a) => a.score < 60).length, color: "#c0614a" },
  ];

  return (
    <div className="page">
      <h2>HR Dashboard</h2>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">Jobs Posted</div>
          <div className="stat-value">{jobs.length}</div>
          <div className="stat-label">Total Active</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">Applications</div>
          <div className="stat-value">{applications.length}</div>
          <div className="stat-label">Total Received</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">Avg. Score</div>
          <div className="stat-value">{avgScore}%</div>
          <div className="stat-label">Across All Jobs</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">Top Score</div>
          <div className="stat-value">{topApp ? topApp.score + "%" : "N/A"}</div>
          <div className="stat-label">Best Applicant</div>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="card">
          <h3>Score Distribution</h3>
          <div className="bar-chart">
            {scoreRanges.map((range) => (
              <div key={range.label} className="bar-row">
                <span className="bar-label">{range.label}</span>
                <div className="bar-track">
                  <div className="bar-fill" style={{ width: applications.length ? `${(range.count / applications.length) * 100}%` : "0%", backgroundColor: range.color }} />
                </div>
                <span className="bar-count">{range.count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h3>Active Jobs</h3>
          <div className="recent-list">
            {jobs.slice(-4).map((job) => {
              const count = applications.filter((a) => a.jobId === job.id).length;
              return (
                <div key={job.id} className="recent-item">
                  <div>
                    <strong>{job.title}</strong>
                    <p>{job.company}</p>
                  </div>
                  <span className="badge">{count} applicants</span>
                </div>
              );
            })}
          </div>
          <button className="btn-secondary" onClick={() => setPage("jobs")}>Manage Jobs</button>
        </div>

        <div className="card">
          <h3>Top Applicants</h3>
          <div className="recent-list">
            {[...applications].sort((a, b) => b.score - a.score).slice(0, 4).map((a, i) => (
              <div key={a.id} className="recent-item">
                <div>
                  <strong>{i + 1}. {a.candidateName}</strong>
                  <p>{jobs.find((j) => j.id === a.jobId)?.title}</p>
                </div>
                <span className="score-badge" style={{ backgroundColor: a.score >= 85 ? "#6b8f71" : a.score >= 70 ? "#9c6b3c" : "#a07830" }}>
                  {a.score}%
                </span>
              </div>
            ))}
          </div>
          <button className="btn-secondary" onClick={() => setPage("rankings")}>View Rankings</button>
        </div>
      </div>
    </div>
  );
}
