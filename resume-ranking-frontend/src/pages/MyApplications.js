import React from "react";
import { useApp } from "../context/AppContext";
import { useAuth } from "../context/AuthContext";

const statusColor = { Applied: "#6b7f8f", Shortlisted: "#6b8f71", Rejected: "#c0614a", "Under Review": "#a07830" };

export default function MyApplications({ setPage }) {
  const { getApplicationsByCandidate, jobs } = useApp();
  const { user } = useAuth();
  const myApps = getApplicationsByCandidate(user?.id);

  return (
    <div className="page">
      <h2>My Applications</h2>

      {myApps.length === 0 ? (
        <div className="empty-state">
          <p>You haven't applied to any jobs yet.</p>
          <button className="btn-primary" style={{ marginTop: "1rem" }} onClick={() => setPage("jobs")}>Browse Jobs</button>
        </div>
      ) : (
        <div className="applications-list">
          {myApps.map((app) => {
            const job = jobs.find((j) => j.id === app.jobId);
            return (
              <div key={app.id} className="application-card">
                <div className="app-card-header">
                  <div>
                    <h3>{job?.title}</h3>
                    <p className="job-company">{job?.company}</p>
                    <p className="job-date">Applied: {app.appliedDate}</p>
                  </div>
                  <div className="app-card-right">
                    <span className="score-badge" style={{ backgroundColor: app.score >= 85 ? "#6b8f71" : app.score >= 70 ? "#9c6b3c" : "#a07830" }}>
                      Score: {app.score}%
                    </span>
                    <span className="status-badge" style={{ backgroundColor: statusColor[app.status] || "#64748b" }}>
                      {app.status}
                    </span>
                  </div>
                </div>
                <div className="skills-list" style={{ marginTop: "0.8rem" }}>
                  {app.skills.map((s) => <span key={s} className="skill-tag">{s}</span>)}
                </div>
                <p className="app-meta">{app.resumeFile} &nbsp;|&nbsp; {app.education} &nbsp;|&nbsp; {app.experience} yrs experience</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
