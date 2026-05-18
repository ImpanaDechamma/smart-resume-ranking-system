"use client";

import { useState, useEffect } from "react";
import { useApp, Job } from "@/context/AppContext";
import { useAuth } from "@/context/AuthContext";
import { Plus, Building2, Calendar, Users, ArrowRight, X, Sparkles, CheckCircle2, Zap, Image, LayoutGrid, Target, Pencil, Trash2, Trophy, Bookmark, BookmarkCheck } from "lucide-react";
import { EditJobModal } from "@/components/EditJobModal";

interface JobsProps {
  setPage: (page: string) => void;
  setApplyJob: (job: Job | null) => void;
  setRankingJobId: (id: string) => void;
  setAutoOpenAddModal?: (open: boolean) => void;
}

export default function Jobs({ setPage, setApplyJob, setRankingJobId, setAutoOpenAddModal }: JobsProps) {
  const { jobs, applications, editJob, deleteJob } = useApp();
  const { user } = useAuth();
  const isHR = user?.role === "hr";
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  
  const [activeTab, setActiveTab] = useState<"benchmarks" | "active">("benchmarks");

  const handleApply = (job: Job) => {
    setApplyJob(job);
    setPage("apply");
  };

  const hasApplied = (jobId: string) => {
    return applications.some(
      (app) => app.jobId === jobId && app.candidateEmail === user?.email
    );
  };

  // Benchmarks: unlimited simulations. Live jobs: apply once only OR if full.
  const isBlocked = (job: Job) => {
    if (job.is_benchmark) return false;
    const applied = hasApplied(job.id);
    const full = job.remaining_vacancies !== undefined && job.remaining_vacancies <= 0;
    return applied || full;
  };

  const filteredJobs = jobs.filter(job => 
    activeTab === "benchmarks" ? job.is_benchmark : !job.is_benchmark
  );

  return (
    <>
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Dynamic Candidate Header */}
      <div className="relative group overflow-hidden rounded-[3rem] border border-border/50 bg-white/40 backdrop-blur-3xl shadow-2xl shadow-black/5">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-transparent to-transparent pointer-events-none" />
        
        <div className="relative z-10 flex flex-col lg:flex-row items-center">
          {/* Content */}
          <div className="flex-1 p-10 md:p-16 lg:p-20">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-500/5 border border-orange-500/10 text-[9px] font-black uppercase tracking-[0.2em] text-orange-600/60 mb-8">
               <Zap className="w-3 h-3" />
               Career Launchpad
            </div>
            <h2 className="text-5xl md:text-6xl font-black tracking-tighter text-foreground mb-6 leading-[1.1]">
              Accelerate Your <br />
              <span className="text-primary">Career Growth.</span>
            </h2>
            <p className="text-lg font-medium text-muted-foreground max-w-md mb-12 leading-relaxed opacity-80">
              Simulate interviews, match your resume against industry standards, and find your dream role.
            </p>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <div className="flex items-center p-1.5 bg-secondary/50 rounded-[2rem] border border-border/50 backdrop-blur-md">
                <button
                  onClick={() => setActiveTab("benchmarks")}
                  className={`flex items-center gap-2 px-6 py-3 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === "benchmarks" ? "bg-white text-primary shadow-lg" : "text-muted-foreground hover:text-foreground"}`}
                >
                  Benchmarks
                </button>
                <button
                  onClick={() => setActiveTab("active")}
                  className={`flex items-center gap-2 px-6 py-3 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === "active" ? "bg-white text-primary shadow-lg" : "text-muted-foreground hover:text-foreground"}`}
                >
                  Live Jobs
                </button>
              </div>

              {isHR && (
                <button
                  onClick={() => setAutoOpenAddModal && setAutoOpenAddModal(true)}
                  className="flex items-center gap-3 rounded-2xl bg-primary px-8 py-4 font-black text-white text-xs uppercase tracking-widest shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all hover:-translate-y-1"
                >
                  Host Opening
                </button>
              )}
            </div>
          </div>

          {/* Illustration */}
          <div className="w-full lg:w-[48%] h-[400px] lg:h-[500px] self-stretch relative overflow-hidden">
             <img 
               src="/images/candidate_dashboard.png" 
               alt="Candidate Illustration" 
               className="w-full h-full object-cover object-center transform transition-transform duration-1000 group-hover:scale-105"
             />
             <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-l from-transparent via-transparent to-white/40 lg:to-white/60" />
          </div>
        </div>
      </div>


      {/* Grid */}
      {filteredJobs.length > 0 ? (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {filteredJobs.map((job) => {
            const canEdit = isHR && job.created_by && job.created_by === user?.id;
            return (
              <JobCard
                key={job.id}
                job={job}
                isHR={isHR}
                canEdit={!!canEdit}
                hasApplied={hasApplied(job.id)}
                isBlocked={isBlocked(job)}
                onApply={() => handleApply(job)}
                onViewRankings={() => { setRankingJobId(job.id); setPage("rankings"); }}
                onEdit={() => setEditingJob(job)}
                onDelete={() => {
                  if (confirm(`Delete "${job.title}"? This cannot be undone.`)) deleteJob(job.id);
                }}
              />
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-32 text-center bg-card/20 rounded-[3rem] border border-dashed border-border">
          <div className="h-20 w-20 rounded-full bg-secondary flex items-center justify-center mb-6">
            <LayoutGrid className="h-10 w-10 text-muted-foreground/30" />
          </div>
          <h3 className="text-2xl font-black text-foreground">No {activeTab} found</h3>
          <p className="text-muted-foreground font-medium mt-2">Check back later for new opportunities.</p>
        </div>
      )}
    </div>

      {/* Edit Job Modal — only for HR's own jobs */}
      {editingJob && (
        <EditJobModal
          job={editingJob}
          onClose={() => setEditingJob(null)}
          onSave={async (updates) => {
            await editJob(editingJob.id, updates);
            setEditingJob(null);
          }}
        />
      )}
    </>
  );
}

function JobCard({
  job,
  isHR,
  canEdit,
  hasApplied,
  isBlocked,
  onApply,
  onViewRankings,
  onEdit,
  onDelete,
}: {
  job: Job;
  isHR: boolean;
  canEdit: boolean;
  hasApplied: boolean;
  isBlocked: boolean;
  onApply: () => void;
  onViewRankings: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const { interests, toggleInterest } = useApp();
  const isInterested = interests.includes(job.id);

  return (
    <div className="group flex flex-col h-full relative overflow-hidden rounded-[2.5rem] border border-border/50 bg-white shadow-xl shadow-black/5 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/10">
      {/* Banner */}
      <div className="h-40 w-full relative overflow-hidden bg-secondary">
        {job.banner ? (
          <img src={job.banner} alt="Job Banner" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-primary/10 via-blue-500/5 to-transparent" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        
        <div className="absolute top-6 right-6">
          <div className={`px-4 py-1.5 rounded-full backdrop-blur-md border text-[10px] font-black uppercase tracking-widest shadow-lg ${job.is_benchmark ? 'bg-amber-500/20 border-amber-500/30 text-amber-200' : 'bg-emerald-500/20 border-emerald-500/30 text-emerald-200'}`}>
            {job.is_benchmark ? 'AI Benchmark' : 'Active Hiring'}
          </div>
        </div>

        {/* Vacancy Badge */}
        {!job.is_benchmark && job.vacancies !== undefined && job.remaining_vacancies !== undefined && (
          <div className="absolute top-6 left-6">
            <div className={`px-4 py-1.5 rounded-full backdrop-blur-md border text-[10px] font-black uppercase tracking-widest shadow-lg ${
              job.remaining_vacancies <= 3 ? 'bg-red-500/80 border-red-400 text-white animate-pulse' : 'bg-black/20 border-white/20 text-white'
            }`}>
              {job.remaining_vacancies} {job.remaining_vacancies === 1 ? 'seat' : 'seats'} left
            </div>
          </div>
        )}

        {/* Applied badge — only shown on live jobs that the user already applied to */}
        {hasApplied && !job.is_benchmark && (
          <div className="absolute bottom-6 right-6">
            <span className="flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-[10px] font-black text-emerald-600 shadow-xl uppercase tracking-widest">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Applied
            </span>
          </div>
        )}
        {/* Simulated badge — shown on benchmarks the user already ran */}
        {hasApplied && job.is_benchmark && (
          <div className="absolute bottom-6 right-6">
            <span className="flex items-center gap-1.5 rounded-full bg-primary/90 px-3 py-1 text-[10px] font-black text-white shadow-xl uppercase tracking-widest">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Simulated
            </span>
          </div>
        )}
      </div>

      <div className="px-8 pb-8 pt-4 flex-1 flex flex-col relative">
        {/* Logo */}
        <div className="absolute -top-12 left-8 h-20 w-20 rounded-[1.5rem] bg-white p-3 shadow-2xl flex items-center justify-center overflow-hidden z-10 border border-border/50 transition-transform group-hover:scale-110">
          {job.logo ? (
            <img 
              src={job.logo} 
              alt={job.company} 
              className="w-full h-full object-contain"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(job.company)}&background=random&color=fff&size=128`;
              }}
            />
          ) : (
            <Building2 className="h-10 w-10 text-primary" />
          )}
        </div>

        <div className="mt-10 mb-6">
          <h3 className="text-2xl font-black tracking-tight text-foreground group-hover:text-primary transition-colors line-clamp-1">
            {job.title}
          </h3>
          <p className="text-lg font-bold text-foreground/40 mt-1">
            {job.company}
          </p>
        </div>

        <p className="mb-8 line-clamp-2 text-[15px] text-foreground/50 font-medium leading-relaxed flex-1">
          {job.description}
        </p>

        <div className="mb-8 flex flex-wrap gap-2">
          {job.skills.slice(0, 3).map((skill) => (
            <span
              key={skill}
              className="rounded-xl bg-secondary px-4 py-2 text-xs font-bold text-foreground/60 border border-border/50"
            >
              {skill}
            </span>
          ))}
          {job.skills.length > 3 && (
            <span className="rounded-xl bg-primary/5 px-4 py-2 text-xs font-bold text-primary border border-primary/10">
              +{job.skills.length - 3}
            </span>
          )}
        </div>

        {/* Action Button */}
        <div className="pt-6 border-t border-border/50 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            {/* Edit / Delete — only for the HR who created this job */}
            {canEdit && (
              <>
                <button
                  onClick={onEdit}
                  title="Edit job"
                  className="p-2.5 rounded-xl border border-border/50 bg-secondary hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-all"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  onClick={onDelete}
                  title="Delete job"
                  className="p-2.5 rounded-xl border border-border/50 bg-secondary hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/30 transition-all"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </>
            )}

            {!isHR && (
              <button
                onClick={() => toggleInterest(job.id)}
                title={isInterested ? "Remove from interests" : "Add to interests"}
                className={`p-2.5 rounded-xl border border-border/50 transition-all ${
                  isInterested 
                    ? "bg-primary text-white border-primary shadow-lg" 
                    : "bg-secondary hover:bg-primary/10 hover:text-primary hover:border-primary/30"
                }`}
              >
                {isInterested ? <BookmarkCheck className="h-4 w-4 fill-current" /> : <Bookmark className="h-4 w-4" />}
              </button>
            )}
            
            {isHR && !job.is_benchmark && (
              <button
                onClick={onViewRankings}
                className="flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-[10px] font-black uppercase tracking-widest text-foreground border border-border/50 hover:bg-secondary transition-all"
              >
                <Trophy className="h-4 w-4 text-amber-500" />
                Rankings
              </button>
            )}
          </div>

          <button
            onClick={isHR ? (job.is_benchmark ? undefined : onViewRankings) : onApply}
            disabled={(!isHR && isBlocked) || (isHR && job.is_benchmark)}
            className={`flex items-center gap-2 rounded-xl px-6 py-3 text-xs font-black uppercase tracking-widest transition-all ${
              (isBlocked && !isHR) || (isHR && job.is_benchmark)
                ? "bg-secondary text-foreground/30 cursor-not-allowed"
                : "bg-primary text-white shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5"
            }`}
          >
            {isHR
              ? job.is_benchmark ? "Benchmark" : "Rankings"
              : job.is_benchmark
              ? hasApplied ? "Simulate Again" : "Simulate"
              : hasApplied ? "Applied" : (job.remaining_vacancies !== undefined && job.remaining_vacancies <= 0) ? "Full" : "Apply"}
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

      </div>
    </div>
  );
}
