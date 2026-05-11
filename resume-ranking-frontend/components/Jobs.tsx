"use client";

import { useState, useEffect } from "react";
import { useApp, Job } from "@/context/AppContext";
import { useAuth } from "@/context/AuthContext";
import { Plus, Building2, Calendar, Users, ArrowRight, X, Sparkles, CheckCircle2, Zap, Image, LayoutGrid, Target, Pencil, Trash2 } from "lucide-react";
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

  // Benchmarks: unlimited simulations. Live jobs: apply once only.
  const isBlocked = (job: Job) => !job.is_benchmark && hasApplied(job.id);

  const filteredJobs = jobs.filter(job => 
    activeTab === "benchmarks" ? job.is_benchmark : !job.is_benchmark
  );

  return (
    <>
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header & Mode Switcher */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 bg-card/40 backdrop-blur-xl border border-border/50 rounded-[2.5rem] p-8 md:p-10 shadow-xl shadow-black/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-gradient-to-bl from-primary/10 to-transparent rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        
        <div className="relative z-10">
          <h2 className="text-4xl font-black tracking-tighter text-foreground">
            {isHR ? "Talent Acquisition" : activeTab === "benchmarks" ? "Career Simulations" : "Active Openings"}
          </h2>
          <p className="text-lg font-medium text-foreground/50 mt-1">
            {activeTab === "benchmarks" 
              ? "Verify your profile against industry-leading engineering standards."
              : "Directly apply to current job openings and get noticed by HR."}
          </p>
          
          <div className="mt-6 flex items-center p-1.5 bg-secondary/50 rounded-2xl border border-border/50 w-fit">
            <button
              onClick={() => setActiveTab("benchmarks")}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === "benchmarks" ? "bg-white text-primary shadow-lg" : "text-muted-foreground hover:text-foreground"}`}
            >
              <Target className="w-4 h-4" />
              Benchmarks
            </button>
            <button
              onClick={() => setActiveTab("active")}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === "active" ? "bg-white text-primary shadow-lg" : "text-muted-foreground hover:text-foreground"}`}
            >
              <LayoutGrid className="w-4 h-4" />
              Live Jobs
            </button>
          </div>
        </div>

        {isHR && (
          <button
            onClick={() => setAutoOpenAddModal && setAutoOpenAddModal(true)}
            className="relative z-10 flex items-center gap-3 rounded-2xl bg-primary px-8 py-5 font-black text-white shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all hover:-translate-y-1"
          >
            <Plus className="h-5 w-5" />
            Host New opening
          </button>
        )}
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
  return (
    <div className="group flex flex-col relative overflow-hidden rounded-[2.5rem] border border-border/50 bg-white shadow-xl shadow-black/5 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/10">
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
          <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.2em] text-foreground/30">
            <span className="flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5" />
              {job.applicants}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              Recent
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Edit / Delete — only for the HR who created this job */}
            {canEdit && (
              <>
                <button
                  onClick={onEdit}
                  title="Edit job"
                  className="p-2 rounded-xl border border-border/50 bg-secondary hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-all"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={onDelete}
                  title="Delete job"
                  className="p-2 rounded-xl border border-border/50 bg-secondary hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/30 transition-all"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </>
            )}
            <button
              onClick={isHR ? onViewRankings : onApply}
              disabled={!isHR && isBlocked}
              className={`flex items-center gap-2 rounded-xl px-6 py-3 text-xs font-black uppercase tracking-widest transition-all ${
                isBlocked && !isHR
                  ? "bg-secondary text-foreground/30 cursor-not-allowed"
                  : "bg-primary text-white shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5"
              }`}
            >
              {isHR
                ? "Rankings"
                : job.is_benchmark
                ? hasApplied ? "Simulate Again" : "Simulate"
                : isBlocked ? "Applied" : "Apply"}
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

export function AddJobModal({
  onClose,
  onAdd,
}: {
  onClose: () => void;
  onAdd: (job: Omit<Job, "id" | "applicants" | "posted"> & { logoFile?: File, bannerFile?: File, is_benchmark?: boolean }) => void;
}) {
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [description, setDescription] = useState("");
  const [skills, setSkills] = useState("");
  const [isBenchmark, setIsBenchmark] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState("");
  const [bannerPreview, setBannerPreview] = useState("");

  const handlePaste = (e: React.ClipboardEvent, type: 'logo' | 'banner') => {
    const items = e.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf("image") !== -1) {
        const file = items[i].getAsFile();
        if (file) {
          if (type === 'logo') {
            setLogoFile(file);
            setLogoPreview(URL.createObjectURL(file));
          } else {
            setBannerFile(file);
            setBannerPreview(URL.createObjectURL(file));
          }
        }
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'logo' | 'banner') => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (type === 'logo') {
        setLogoFile(file);
        setLogoPreview(URL.createObjectURL(file));
      } else {
        setBannerFile(file);
        setBannerPreview(URL.createObjectURL(file));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onAdd({
      title,
      company,
      description,
      skills: skills.split(",").map((s) => s.trim()).filter(Boolean),
      is_benchmark: isBenchmark,
      logoFile: logoFile || undefined,
      bannerFile: bannerFile || undefined
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8 animate-in fade-in zoom-in-95 duration-300">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-md" onClick={onClose} />
      
      <div className="relative w-full max-w-5xl h-[90vh] overflow-hidden rounded-[3rem] border border-border bg-white shadow-2xl flex flex-col md:flex-row">
        
        {/* Sidebar */}
        <div className="md:w-[35%] bg-primary p-12 flex flex-col justify-between relative overflow-hidden shrink-0">
          <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-transparent pointer-events-none" />
          <div className="relative z-10">
            <div className="h-16 w-16 rounded-[1.5rem] bg-white/10 flex items-center justify-center mb-8 border border-white/20">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-4xl font-black tracking-tighter text-white mb-6 leading-none">
              Host an <br />Opening.
            </h2>
            <p className="text-white/70 text-lg font-medium leading-relaxed mb-10">
              Create a new hiring benchmark or a live job opening for candidates.
            </p>

            <div className="space-y-6">
               <div className="p-6 rounded-[2rem] bg-white/5 border border-white/10">
                  <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">Pro Tip</p>
                  <p className="text-sm font-bold text-white/90">Benchmarks are for simulation. Live jobs are for actual hiring.</p>
               </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="flex-1 overflow-y-auto bg-white p-8 sm:p-14">
          <button onClick={onClose} className="absolute top-8 right-8 rounded-full p-3 text-foreground/20 hover:bg-secondary hover:text-foreground transition-all z-20">
            <X className="h-6 w-6" />
          </button>

          <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-12">
            <div className="space-y-10">
              <div className="flex items-center gap-4">
                <span className="h-10 w-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center text-sm font-black border border-primary/20">01</span>
                <h3 className="text-2xl font-black text-foreground">Opening Type</h3>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <button
                  type="button"
                  onClick={() => setIsBenchmark(true)}
                  className={`p-6 rounded-3xl border-2 text-left transition-all ${isBenchmark ? 'border-primary bg-primary/5 ring-4 ring-primary/10' : 'border-border bg-white hover:border-primary/50'}`}
                >
                  <Target className={`w-8 h-8 mb-4 ${isBenchmark ? 'text-primary' : 'text-muted-foreground'}`} />
                  <p className="font-black text-foreground uppercase tracking-widest text-[10px] mb-1">Benchmark</p>
                  <p className="text-xs font-bold text-foreground/50 leading-relaxed">Simulate company hiring standards.</p>
                </button>
                <button
                  type="button"
                  onClick={() => setIsBenchmark(false)}
                  className={`p-6 rounded-3xl border-2 text-left transition-all ${!isBenchmark ? 'border-primary bg-primary/5 ring-4 ring-primary/10' : 'border-border bg-white hover:border-primary/50'}`}
                >
                  <LayoutGrid className={`w-8 h-8 mb-4 ${!isBenchmark ? 'text-primary' : 'text-muted-foreground'}`} />
                  <p className="font-black text-foreground uppercase tracking-widest text-[10px] mb-1">Live Job</p>
                  <p className="text-xs font-bold text-foreground/50 leading-relaxed">Actual opening for candidate hiring.</p>
                </button>
              </div>
            </div>

            <div className="space-y-10">
              <div className="flex items-center gap-4">
                <span className="h-10 w-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center text-sm font-black border border-primary/20">02</span>
                <h3 className="text-2xl font-black text-foreground">Basic Details</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-foreground/30">Job Title</label>
                  <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Lead Dev" required className="w-full bg-secondary/30 border border-border/50 rounded-2xl py-5 px-8 text-foreground font-bold focus:border-primary outline-none transition-all" />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-foreground/30">Company</label>
                  <input type="text" value={company} onChange={(e) => setCompany(e.target.value)} placeholder="e.g. Acme Inc" required className="w-full bg-secondary/30 border border-border/50 rounded-2xl py-5 px-8 text-foreground font-bold focus:border-primary outline-none transition-all" />
                </div>
              </div>
            </div>

            <div className="space-y-10">
              <div className="flex items-center gap-4">
                <span className="h-10 w-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center text-sm font-black border border-primary/20">03</span>
                <h3 className="text-2xl font-black text-foreground">Visual Assets</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-foreground/30">Brand Logo</label>
                  <div onPaste={(e) => handlePaste(e, 'logo')} className="relative group h-44 rounded-[2rem] border-2 border-dashed border-border/50 bg-secondary/20 hover:bg-secondary/40 flex flex-col items-center justify-center transition-all overflow-hidden">
                    <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'logo')} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                    {logoPreview ? <img src={logoPreview} className="h-full w-full object-contain p-8" /> : (
                      <div className="text-center group-hover:scale-110 transition-transform">
                        <Plus className="h-10 w-10 text-foreground/10 mx-auto" />
                        <p className="text-[9px] font-black uppercase tracking-widest text-foreground/30 mt-4">Brand Image</p>
                      </div>
                    )}
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-foreground/30">Cover Banner</label>
                  <div onPaste={(e) => handlePaste(e, 'banner')} className="relative group h-44 rounded-[2rem] border-2 border-dashed border-border/50 bg-secondary/20 hover:bg-secondary/40 flex flex-col items-center justify-center transition-all overflow-hidden">
                    <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'banner')} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                    {bannerPreview ? <img src={bannerPreview} className="h-full w-full object-cover" /> : (
                      <div className="text-center group-hover:scale-110 transition-transform">
                        <Image className="h-10 w-10 text-foreground/10 mx-auto" />
                        <p className="text-[9px] font-black uppercase tracking-widest text-foreground/30 mt-4">Header Visual</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-10">
              <div className="flex items-center gap-4">
                <span className="h-10 w-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center text-sm font-black border border-primary/20">04</span>
                <h3 className="text-2xl font-black text-foreground">Requirements</h3>
              </div>
              <div className="space-y-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-foreground/30">Skills (Comma separated)</label>
                  <input type="text" value={skills} onChange={(e) => setSkills(e.target.value)} placeholder="React, Node, SQL..." required className="w-full bg-secondary/30 border border-border/50 rounded-2xl py-5 px-8 text-foreground font-bold focus:border-primary outline-none transition-all" />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-foreground/30">Description</label>
                  <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Mission details..." required rows={5} className="w-full bg-secondary/30 border border-border/50 rounded-[2rem] py-8 px-8 text-foreground font-bold focus:border-primary outline-none transition-all resize-none" />
                </div>
              </div>
            </div>

            <div className="pt-12 border-t border-border/50 flex items-center justify-between">
              <p className="text-xs font-bold text-foreground/30 max-w-xs">Double check your requirements before publishing live.</p>
              <div className="flex gap-4">
                <button type="button" onClick={onClose} className="rounded-2xl px-10 py-5 text-sm font-black uppercase tracking-widest text-foreground/30 hover:bg-secondary transition-all">Discard</button>
                <button type="submit" className="rounded-2xl bg-primary px-12 py-5 text-sm font-black uppercase tracking-widest text-white shadow-xl shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-1 transition-all">Publish Live</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
