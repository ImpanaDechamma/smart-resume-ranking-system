"use client";

import { useState } from "react";
import { useApp, Job } from "@/context/AppContext";
import { useAuth } from "@/context/AuthContext";
import { Plus, Building2, Calendar, Users, ArrowRight, X } from "lucide-react";

interface JobsProps {
  setPage: (page: string) => void;
  setApplyJob: (job: Job | null) => void;
}

export default function Jobs({ setPage, setApplyJob }: JobsProps) {
  const { jobs, applications, addJob } = useApp();
  const { user } = useAuth();
  const isHR = user?.role === "hr";
  const [showAddModal, setShowAddModal] = useState(false);

  const handleApply = (job: Job) => {
    setApplyJob(job);
    setPage("apply");
  };

  const hasApplied = (jobId: string) => {
    return applications.some(
      (app) => app.jobId === jobId && app.candidateEmail === user?.email
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">
            {isHR ? "Manage Jobs" : "Browse Jobs"}
          </h2>
          <p className="text-sm text-muted-foreground">
            {isHR
              ? "Create and manage job postings"
              : "Find your next opportunity"}
          </p>
        </div>
        {isHR && (
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-all hover:bg-primary/90"
          >
            <Plus className="h-4 w-4" />
            Post New Job
          </button>
        )}
      </div>

      {/* Jobs Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {jobs.map((job) => (
          <JobCard
            key={job.id}
            job={job}
            isHR={isHR}
            hasApplied={hasApplied(job.id)}
            onApply={() => handleApply(job)}
            onViewRankings={() => setPage("rankings")}
          />
        ))}
      </div>

      {/* Add Job Modal */}
      {showAddModal && (
        <AddJobModal onClose={() => setShowAddModal(false)} onAdd={addJob} />
      )}
    </div>
  );
}

function JobCard({
  job,
  isHR,
  hasApplied,
  onApply,
  onViewRankings,
}: {
  job: Job;
  isHR: boolean;
  hasApplied: boolean;
  onApply: () => void;
  onViewRankings: () => void;
}) {
  return (
    <div className="group relative overflow-hidden rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5">
      {/* Accent line */}
      <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-primary to-primary/50" />

      <div className="mb-4 flex items-start justify-between">
        <div>
          <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
            {job.title}
          </h3>
          <div className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
            <Building2 className="h-3.5 w-3.5" />
            {job.company}
          </div>
        </div>
        {hasApplied && (
          <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
            Applied
          </span>
        )}
      </div>

      <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">
        {job.description}
      </p>

      <div className="mb-4 flex flex-wrap gap-1.5">
        {job.skills.slice(0, 4).map((skill) => (
          <span
            key={skill}
            className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary"
          >
            {skill}
          </span>
        ))}
        {job.skills.length > 4 && (
          <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
            +{job.skills.length - 4}
          </span>
        )}
      </div>

      <div className="flex items-center justify-between border-t border-border pt-4">
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            {new Date(job.posted).toLocaleDateString()}
          </span>
          <span className="flex items-center gap-1">
            <Users className="h-3.5 w-3.5" />
            {job.applicants} applied
          </span>
        </div>

        {isHR ? (
          <button
            onClick={onViewRankings}
            className="flex items-center gap-1 text-xs font-medium text-primary hover:underline"
          >
            View Rankings
            <ArrowRight className="h-3 w-3" />
          </button>
        ) : (
          <button
            onClick={onApply}
            disabled={hasApplied}
            className={`flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
              hasApplied
                ? "cursor-not-allowed bg-secondary text-muted-foreground"
                : "bg-primary text-primary-foreground hover:bg-primary/90"
            }`}
          >
            {hasApplied ? "Applied" : "Apply Now"}
            {!hasApplied && <ArrowRight className="h-3 w-3" />}
          </button>
        )}
      </div>
    </div>
  );
}

function AddJobModal({
  onClose,
  onAdd,
}: {
  onClose: () => void;
  onAdd: (job: Omit<Job, "id" | "applicants" | "posted">) => void;
}) {
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [description, setDescription] = useState("");
  const [skills, setSkills] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      title,
      company,
      description,
      skills: skills.split(",").map((s) => s.trim()).filter(Boolean),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/20 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-2xl">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">Post New Job</h3>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-muted-foreground hover:bg-secondary hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Job Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Senior Frontend Developer"
              required
              className="w-full rounded-xl border border-border bg-background py-3 px-4 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Company
            </label>
            <input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="TechCorp Inc."
              required
              className="w-full rounded-xl border border-border bg-background py-3 px-4 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the role and responsibilities..."
              required
              rows={3}
              className="w-full rounded-xl border border-border bg-background py-3 px-4 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Required Skills (comma separated)
            </label>
            <input
              type="text"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              placeholder="React, TypeScript, Node.js"
              required
              className="w-full rounded-xl border border-border bg-background py-3 px-4 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-border py-3 text-sm font-medium text-foreground hover:bg-secondary transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 rounded-xl bg-primary py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-all"
            >
              Post Job
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
