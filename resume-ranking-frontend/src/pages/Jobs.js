import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { useAuth } from "../context/AuthContext";

export default function Jobs({ setPage, setApplyJob }) {
  const { jobs, addJob, getApplicationsByCandidate } = useApp();
  const { user } = useAuth();
  const isHR = user?.role === "hr";

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", company: "", description: "", skills: "" });
  const [success, setSuccess] = useState(false);

  const myApplications = isHR ? [] : getApplicationsByCandidate(user?.id);
  const appliedJobIds = myApplications.map((a) => a.jobId);

  const handleSubmit = (e) => {
    e.preventDefault();
    addJob({ ...form, skills: form.skills.split(",").map((s) => s.trim()) });
    setForm({ title: "", company: "", description: "", skills: "" });
    setShowForm(false);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  const handleApply = (job) => {
    setApplyJob(job);
    setPage("apply");
  };

  return (
    <div className="page">
      <div className="page-header">
        <h2>{isHR ? "Manage Jobs" : "Browse Jobs"}</h2>
        {isHR && (
          <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
            {showForm ? "Cancel" : "+ Post New Job"}
          </button>
        )}
      </div>

              {success && <div className="success-msg">Job posted successfully.</div>}

      {isHR && showForm && (
        <div className="card form-card">
          <h3>Post a New Job</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Job Title</label>
                <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Full Stack Developer" required />
              </div>
              <div className="form-group">
                <label>Company</label>
                <input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} placeholder="e.g. TechCorp" required />
              </div>
            </div>
            <div className="form-group">
              <label>Job Description</label>
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Describe the role..." rows={3} required />
            </div>
            <div className="form-group">
              <label>Required Skills (comma separated)</label>
              <input value={form.skills} onChange={(e) => setForm({ ...form, skills: e.target.value })} placeholder="e.g. React, Node.js, SQL" required />
            </div>
            <button type="submit" className="btn-primary">Post Job</button>
          </form>
        </div>
      )}

      <div className="jobs-grid">
        {jobs.map((job) => {
          const alreadyApplied = appliedJobIds.includes(job.id);
          return (
            <div key={job.id} className="job-card">
              <div className="job-card-header">
                <div>
                  <h3>{job.title}</h3>
                  <p className="job-company">{job.company}</p>
                </div>
                {!isHR && (
                  alreadyApplied
                    ? <span className="badge applied-badge">Applied</span>
                    : <button className="btn-primary small" onClick={() => handleApply(job)}>Apply Now</button>
                )}
              </div>
              <p className="job-desc">{job.description}</p>
              <div className="skills-list">
                {job.skills.map((skill) => (
                  <span key={skill} className="skill-tag">{skill}</span>
                ))}
              </div>
              <p className="job-date">Posted: {job.postedDate}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
