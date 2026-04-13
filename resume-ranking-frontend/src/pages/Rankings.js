import React, { useState } from "react";
import { useApp } from "../context/AppContext";

function ScoreBar({ score }) {
  const color = score >= 85 ? "#6b8f71" : score >= 70 ? "#9c6b3c" : "#a07830";
  return (
    <div className="score-bar-track">
      <div className="score-bar-fill" style={{ width: `${score}%`, backgroundColor: color }} />
    </div>
  );
}

export default function Rankings() {
  const { jobs, getApplicationsByJob, updateStatus } = useApp();
  const [selectedJob, setSelectedJob] = useState(jobs[0]?.id || "");

  const ranked = selectedJob ? getApplicationsByJob(parseInt(selectedJob)) : [];

  return (
    <div className="page">
      <div className="page-header">
        <h2>Candidate Rankings</h2>
        <select value={selectedJob} onChange={(e) => setSelectedJob(e.target.value)} className="job-select">
          <option value="">-- Select Job --</option>
          {jobs.map((job) => (
            <option key={job.id} value={job.id}>{job.title} @ {job.company}</option>
          ))}
        </select>
      </div>

      {ranked.length === 0 ? (
        <div className="empty-state">No applications found for this job.</div>
      ) : (
        <div className="card">
          <table className="rankings-table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Candidate</th>
                <th>Email</th>
                <th>Experience</th>
                <th>Education</th>
                <th>Skills</th>
                <th>Score</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {ranked.map((a, i) => (
                <tr key={a.id} className={i === 0 ? "top-row" : ""}>
                  <td><span className="rank-badge">{i === 0 ? "01" : i === 1 ? "02" : i === 2 ? "03" : `${String(i + 1).padStart(2, "0")}`}</span></td>
                  <td><strong>{a.candidateName}</strong></td>
                  <td>{a.email}</td>
                  <td>{a.experience} yrs</td>
                  <td>{a.education}</td>
                  <td>
                    <div className="skills-list">
                      {a.skills.map((s) => <span key={s} className="skill-tag">{s}</span>)}
                    </div>
                  </td>
                  <td>
                    <div className="score-cell">
                      <ScoreBar score={a.score} />
                      <span className="score-text">{a.score}%</span>
                    </div>
                  </td>
                  <td>
                    <select
                      className="status-select"
                      value={a.status}
                      onChange={(e) => updateStatus(a.id, e.target.value)}
                    >
                      <option>Applied</option>
                      <option>Under Review</option>
                      <option>Shortlisted</option>
                      <option>Rejected</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
