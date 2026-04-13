import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { useAuth } from "../context/AuthContext";

export default function Apply({ job, setPage }) {
  const { applyToJob } = useApp();
  const { user } = useAuth();
  const [form, setForm] = useState({ experience: "", education: "", skills: "" });
  const [file, setFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!job) { setPage("jobs"); return null; }

  const handleFile = (f) => {
    if (f && (f.type === "application/pdf" || f.name.endsWith(".docx"))) setFile(f);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    applyToJob({
      candidateId: user.id,
      candidateName: user.name,
      email: user.email,
      jobId: job.id,
      experience: parseInt(form.experience),
      education: form.education,
      skills: form.skills.split(",").map((s) => s.trim()),
      resumeFile: file ? file.name : "resume.pdf",
    });
    setSuccess(true);
    setTimeout(() => setPage("my-applications"), 2000);
  };

  if (success) {
    return (
      <div className="page center-page">
        <div className="success-card">
          <div className="success-icon">&#10003;</div>
          <h2>Application Submitted</h2>
          <p>Your resume has been submitted for <strong>{job.title}</strong> at <strong>{job.company}</strong>.</p>
          <p>Redirecting to your applications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page-header">
        <h2>Apply for Job</h2>
        <button className="btn-secondary" onClick={() => setPage("jobs")}>← Back to Jobs</button>
      </div>

      <div className="job-card apply-job-banner">
        <h3>{job.title}</h3>
        <p className="job-company">{job.company}</p>
        <div className="skills-list" style={{ marginTop: "0.5rem" }}>
          {job.skills.map((s) => <span key={s} className="skill-tag">{s}</span>)}
        </div>
      </div>

      <div className="card form-card">
        <h3>Your Details</h3>
        <form onSubmit={handleSubmit}>
          <div
            className={`drop-zone ${dragOver ? "drag-over" : ""} ${file ? "has-file" : ""}`}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files[0]); }}
            onClick={() => document.getElementById("fileInput").click()}
          >
            {file ? <p>{file.name}</p> : (
              <>
                <p>Drag and drop your resume here</p>
                <p className="drop-hint">or click to browse (PDF / DOCX)</p>
              </>
            )}
            <input id="fileInput" type="file" accept=".pdf,.docx" hidden onChange={(e) => handleFile(e.target.files[0])} />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Years of Experience</label>
              <input type="number" min="0" value={form.experience} onChange={(e) => setForm({ ...form, experience: e.target.value })} placeholder="e.g. 3" required />
            </div>
            <div className="form-group">
              <label>Education</label>
              <input value={form.education} onChange={(e) => setForm({ ...form, education: e.target.value })} placeholder="e.g. B.Tech CS" required />
            </div>
          </div>

          <div className="form-group">
            <label>Your Skills (comma separated)</label>
            <input value={form.skills} onChange={(e) => setForm({ ...form, skills: e.target.value })} placeholder="e.g. React, Python, SQL" required />
          </div>

          <button type="submit" className="btn-primary">Submit Application</button>
        </form>
      </div>
    </div>
  );
}
