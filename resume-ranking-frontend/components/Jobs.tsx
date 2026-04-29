"use client";

import { useState } from "react";
import { useApp, Job } from "@/context/AppContext";
import { useAuth } from "@/context/AuthContext";
import { Plus, Building2, Calendar, Users, ArrowRight, X, Sparkles, CheckCircle2 } from "lucide-react";

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
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-foreground">
            {isHR ? "Manage Jobs" : "Explore Opportunities"}
          </h2>
          <p className="text-sm font-medium text-muted-foreground mt-1">
            {isHR
              ? "Create and oversee job postings"
              : "Discover roles that match your unique skills"}
          </p>
        </div>
        {isHR && (
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:-translate-y-1 hover:shadow-primary/40"
          >
            <Plus className="h-5 w-5" />
            Post New Job
          </button>
        )}
      </div>

      {/* Jobs Masonry/Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
    <div className="group flex flex-col relative overflow-hidden rounded-3xl border border-border/50 bg-card/40 backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/10 hover:border-primary/30">
      {/* Top Graphic Banner */}
      <div className="h-24 w-full bg-gradient-to-r from-primary/20 via-blue-500/10 to-transparent relative">
        <div className="absolute top-4 right-4">
          {hasApplied && (
            <span className="flex items-center gap-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-600 shadow-sm backdrop-blur-md">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Applied
            </span>
          )}
        </div>
      </div>

      <div className="px-6 pb-6 pt-4 flex-1 flex flex-col relative">
        {/* Company Logo Placeholder */}
        <div className="absolute -top-10 left-6 h-14 w-14 rounded-2xl bg-gradient-to-br from-background to-secondary border border-border shadow-md flex items-center justify-center">
          <Building2 className="h-6 w-6 text-primary" />
        </div>

        <div className="mt-4 mb-4">
          <h3 className="text-xl font-extrabold tracking-tight text-foreground group-hover:text-primary transition-colors line-clamp-1">
            {job.title}
          </h3>
          <p className="text-sm font-semibold text-muted-foreground mt-1">
            {job.company}
          </p>
        </div>

        <p className="mb-6 line-clamp-3 text-sm text-muted-foreground font-medium flex-1">
          {job.description}
        </p>

        <div className="mb-6 flex flex-wrap gap-2">
          {job.skills.slice(0, 3).map((skill) => (
            <span
              key={skill}
              className="rounded-lg bg-primary/10 border border-primary/10 px-2.5 py-1 text-xs font-bold text-primary"
            >
              {skill}
            </span>
          ))}
          {job.skills.length > 3 && (
            <span className="rounded-lg bg-secondary/80 border border-border/50 px-2.5 py-1 text-xs font-bold text-muted-foreground">
              +{job.skills.length - 3}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-border/50 pt-4 mt-auto">
          <div className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              {new Date(job.posted).toLocaleDateString()}
            </span>
            <span className="flex items-center gap-1">
              <Users className="h-3.5 w-3.5" />
              {job.applicants} apps
            </span>
          </div>
        </div>

        {/* Hover Action Overlay */}
        <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-background via-background/90 to-transparent translate-y-[120%] opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 flex items-end justify-center">
          {isHR ? (
            <button
              onClick={onViewRankings}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/25 hover:bg-primary/90 transition-all"
            >
              View Rankings
              <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              onClick={onApply}
              disabled={hasApplied}
              className={`w-full flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold shadow-lg transition-all ${
                hasApplied
                  ? "cursor-not-allowed bg-secondary border border-border/50 text-muted-foreground shadow-none"
                  : "bg-primary text-primary-foreground hover:bg-primary/90 shadow-primary/25"
              }`}
            >
              {hasApplied ? "Already Applied" : "Apply Now"}
              {!hasApplied && <ArrowRight className="h-4 w-4" />}
            </button>
          )}
        </div>

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
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-background/80 backdrop-blur-md transition-opacity" 
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-4xl overflow-hidden rounded-[2rem] border border-white/10 dark:border-white/5 bg-card/90 backdrop-blur-2xl shadow-2xl shadow-black/20 flex flex-col md:flex-row">
        
        {/* Left Side Branding */}
        <div className="md:w-2/5 bg-gradient-to-br from-primary to-blue-600 p-8 text-white hidden md:flex flex-col justify-between relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('/images/hero-bg.jpg')] opacity-10 mix-blend-overlay object-cover" />
          <div className="relative z-10">
            <div className="inline-flex p-3 rounded-2xl bg-white/10 backdrop-blur-md mb-6">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-3xl font-extrabold tracking-tight mb-2">Create a New Role</h3>
            <p className="text-white/80 font-medium">Post a new job to your pipeline and let AI find the best candidates.</p>
          </div>
        </div>

        {/* Form Content */}
        <div className="flex-1 p-8 sm:p-10">
          <div className="flex items-center justify-between mb-8 md:hidden">
            <h3 className="text-2xl font-extrabold text-foreground">Post New Job</h3>
          </div>
          
          <button
            onClick={onClose}
            className="absolute top-6 right-6 rounded-full p-2 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
          >
            <X className="h-5 w-5" />
          </button>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  Job Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Frontend Developer"
                  required
                  className="w-full rounded-xl border border-border/50 bg-background/50 py-3.5 px-4 text-sm font-medium text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  Company
                </label>
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="e.g. TechCorp"
                  required
                  className="w-full rounded-xl border border-border/50 bg-background/50 py-3.5 px-4 text-sm font-medium text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What will this person do?"
                required
                rows={4}
                className="w-full rounded-xl border border-border/50 bg-background/50 py-3.5 px-4 text-sm font-medium text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all resize-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                Required Skills
              </label>
              <input
                type="text"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                placeholder="React, TypeScript, Python (comma separated)"
                required
                className="w-full rounded-xl border border-border/50 bg-background/50 py-3.5 px-4 text-sm font-medium text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all"
              />
            </div>

            <div className="pt-4 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl px-6 py-3.5 text-sm font-bold text-muted-foreground hover:bg-secondary hover:text-foreground transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-xl bg-primary px-8 py-3.5 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/90 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all"
              >
                Publish Job
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
