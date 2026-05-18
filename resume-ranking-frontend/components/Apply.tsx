"use client";

import { useState } from "react";
import { useApp, Job } from "@/context/AppContext";
import { useAuth } from "@/context/AuthContext";
import { UploadCloud, CheckCircle2, Building2, ArrowLeft, FileText, Briefcase, Calendar, Check, ArrowRight, Sparkles, Users } from "lucide-react";

interface ApplyProps {
  job: Job | null;
  setPage: (page: string) => void;
}

export default function Apply({ job, setPage }: ApplyProps) {
  const { applyToJob, refreshNotifications } = useApp();
  const { user } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [result, setResult] = useState<any>(null);

  if (!job) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
        <div className="h-24 w-24 rounded-full bg-secondary flex items-center justify-center mb-6">
          <FileText className="h-10 w-10 text-muted-foreground/40" />
        </div>
        <p className="text-xl font-bold text-foreground">No path selected</p>
        <button
          onClick={() => setPage("jobs")}
          className="mt-6 flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-bold shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Benchmarks
        </button>
      </div>
    );
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && (droppedFile.type === "application/pdf" || droppedFile.name.endsWith(".docx"))) {
      setFile(droppedFile);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && (selectedFile.type === "application/pdf" || selectedFile.name.endsWith(".docx"))) {
      setFile(selectedFile);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !user) return;
    
    setIsSubmitting(true);
    
    try {
      const screeningResult = await applyToJob(job.id, user.name, user.email, file);
      setResult(screeningResult);
      setSubmitted(true);
      // Refresh notifications so bell lights up immediately
      refreshNotifications();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted && result) {
    const statusColors = {
      "Shortlisted": "text-emerald-500 bg-emerald-500/10",
      "Needs Improvement": "text-amber-500 bg-amber-500/10",
      "Rejected": "text-red-500 bg-red-500/10"
    };

    return (
      <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 max-w-5xl mx-auto py-12">
        <div className="flex items-center justify-between mb-12">
           <div>
              <h1 className="text-4xl font-black tracking-tight text-foreground mb-2">Screening Analysis</h1>
              <p className="text-muted-foreground font-semibold flex items-center gap-2">
                <Building2 className="w-4 h-4" /> {job.company} &bull; {job.title}
              </p>
           </div>
           <button 
             onClick={() => setPage("jobs")}
             className="px-6 py-3 rounded-xl bg-secondary font-bold hover:bg-secondary/80 transition-all flex items-center gap-2"
           >
             <ArrowLeft className="w-4 h-4" /> Try Another Path
           </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Score Card */}
          <div className="lg:col-span-2 space-y-8">
            <div className="rounded-[2.5rem] border border-border bg-card/40 backdrop-blur-xl p-10 shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[100px] -mr-32 -mt-32 rounded-full" />
               
               <div className="relative z-10">
                 <div className="flex items-center justify-between mb-10">
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground mb-1">Overall Match Score</p>
                      <h2 className="text-6xl font-black text-primary">{result.score}%</h2>
                    </div>
                    <div className={`px-6 py-3 rounded-2xl font-black uppercase tracking-widest text-xs border border-current/20 ${statusColors[result.status as keyof typeof statusColors] || "text-muted-foreground bg-secondary"}`}>
                      {result.status}
                    </div>
                 </div>

                 <div className="space-y-6">
                    <ScoreBar label="Skills Match" value={result.details?.breakdown?.skills || (result.score > 70 ? 70 : result.score)} max={70} />
                    <ScoreBar label="Education & CGPA" value={result.details?.breakdown?.education || 15} max={15} />
                    <ScoreBar label="Experience Level" value={result.details?.breakdown?.experience || 15} max={15} />
                 </div>
               </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              <div className="rounded-[2rem] border border-border bg-card/30 p-8">
                <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" /> Strengths Identified
                </h3>
                <ul className="space-y-4">
                   {job.skills.filter(s => !(result.details?.missing_skills || []).includes(s)).map((skill: string) => (
                     <li key={skill} className="flex items-center gap-3 text-sm font-semibold text-foreground/80">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        {skill}
                     </li>
                   ))}
                </ul>
              </div>

              <div className="rounded-[2rem] border border-border bg-card/30 p-8">
                <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-amber-500">
                  <Sparkles className="w-5 h-5" /> Missing Skills
                </h3>
                <div className="flex flex-wrap gap-2">
                   {result.details?.missing_skills?.length > 0 ? result.details.missing_skills.map((skill: string) => (
                     <span key={skill} className="px-3 py-1.5 rounded-lg bg-amber-500/10 text-amber-600 text-xs font-bold border border-amber-500/20">
                        {skill}
                     </span>
                   )) : <p className="text-xs text-muted-foreground font-medium italic">All mandatory skills found!</p>}
                </div>
              </div>
            </div>
          </div>

          {/* AI Recommendations Sidebar */}
          <div className="space-y-8">
             <div className="rounded-[2.5rem] bg-primary p-10 text-primary-foreground shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-[50px] -mr-16 -mt-16 rounded-full" />
                <Sparkles className="w-10 h-10 mb-6" />
                <h3 className="text-2xl font-black mb-4 leading-tight">AI Skill Recommendations</h3>
                <p className="text-primary-foreground/80 text-sm font-medium mb-8">Based on your target of {job.company}, we recommend mastering:</p>
                <div className="space-y-3">
                   {result.details?.missing_skills?.slice(0, 3).map((skill: string) => (
                     <div key={skill} className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/10">
                        <p className="text-xs font-black uppercase tracking-widest mb-1 opacity-60">Learning Path</p>
                        <p className="font-bold">{skill} Fundamentals</p>
                     </div>
                   ))}
                </div>
             </div>

             <div className="rounded-[2.5rem] border border-border bg-card/40 p-10">
                <h3 className="text-lg font-bold mb-6">Suggested Certifications</h3>
                <div className="space-y-4">
                   {["AWS Certified Developer", "Google Cloud Associate", "Meta Front-End Certificate"].map(cert => (
                     <div key={cert} className="flex items-start gap-3">
                        <div className="mt-1 h-5 w-5 shrink-0 rounded-full bg-secondary flex items-center justify-center">
                          <Check className="w-3 h-3 text-primary" />
                        </div>
                        <p className="text-sm font-semibold text-foreground/80">{cert}</p>
                     </div>
                   ))}
                </div>
             </div>
          </div>
        </div>

        <div className="mt-12 p-8 rounded-[2rem] bg-secondary/50 border border-border/50 text-center">
           <p className="text-sm font-bold text-muted-foreground italic">
             "Your resume matches {result.score}% with {job.company} {job.title} requirements. Focus on the missing skills to reach the 90%+ elite bracket."
           </p>
           <p className="mt-4 text-[10px] uppercase tracking-widest font-black text-primary/60">
             Disclaimer: This is an AI-powered simulation for educational purposes only.
           </p>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-6xl mx-auto">
      
      <button
        onClick={() => setPage("jobs")}
        className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors mb-8 w-fit group"
      >
        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
        Back to Benchmarks
      </button>

      <div className="grid lg:grid-cols-5 gap-8 xl:gap-12 items-start">
        
        {/* Left Side: Benchmark Details */}
        <div className="lg:col-span-2 lg:sticky lg:top-32 space-y-6">
          <div className="rounded-[2rem] border border-border/50 bg-card/40 backdrop-blur-xl p-8 shadow-xl shadow-black/5">
            <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-primary/20 to-blue-500/10 border border-primary/10 flex items-center justify-center mb-6 shadow-sm">
              <Building2 className="h-8 w-8 text-primary" />
            </div>
            
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground mb-2">
              {job.title}
            </h1>
            <p className="text-lg font-semibold text-muted-foreground mb-8">
              {job.company} Benchmark
            </p>

            {!job.is_benchmark && job.remaining_vacancies !== undefined && (
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest border mb-6 ${
                job.remaining_vacancies <= 3 ? 'bg-red-500/10 border-red-500/20 text-red-500 animate-pulse' : 'bg-primary/10 border-primary/20 text-primary'
              }`}>
                <Users className="w-4 h-4" />
                {job.remaining_vacancies} {job.remaining_vacancies === 1 ? 'seat' : 'seats'} left
              </div>
            )}

            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3 text-sm font-bold text-foreground">
                <Briefcase className="w-5 h-5 text-muted-foreground" />
                Benchmark Standards
              </div>
              <div className="flex items-center gap-3 text-sm font-bold text-foreground text-amber-500">
                <Sparkles className="w-5 h-5" />
                AI Analysis Active
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4">Core Skillset</h3>
              <div className="flex flex-wrap gap-2">
                {job.skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-lg bg-secondary/80 border border-border/50 px-3 py-1.5 text-xs font-bold text-foreground"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Upload Area */}
        <div className="lg:col-span-3">
          <div className="rounded-[2rem] border border-border/50 bg-card/40 backdrop-blur-xl p-8 shadow-xl shadow-black/5 h-full flex flex-col">
            <div className="mb-8">
              <h2 className="text-2xl font-extrabold tracking-tight text-foreground mb-2">
                {job.is_benchmark ? "Screen Your Resume" : "Apply for this Role"}
              </h2>
              <p className="text-muted-foreground font-medium">
                {job.is_benchmark 
                  ? `Upload your resume to see how you rank against ${job.company}'s engineering standards.`
                  : `Submit your profile to ${job.company}. Your resume will be ranked and forwarded to HR.`}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
              {/* Massive Drop Zone */}
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                className={`relative flex-1 min-h-[300px] flex flex-col items-center justify-center rounded-[2rem] border-2 border-dashed p-10 text-center transition-all duration-300 ${
                  file
                    ? "border-emerald-500/50 bg-emerald-500/5"
                    : dragOver
                    ? "border-primary bg-primary/5 scale-[1.02]"
                    : "border-border hover:border-primary/50 hover:bg-secondary/50 cursor-pointer"
                }`}
              >
                <input
                  type="file"
                  accept=".pdf,.docx"
                  onChange={handleFileChange}
                  className="absolute inset-0 cursor-pointer opacity-0 z-10"
                />
                
                {file ? (
                  <div className="flex flex-col items-center animate-in zoom-in duration-300">
                    <div className="h-20 w-20 rounded-full bg-emerald-500/20 flex items-center justify-center mb-6 shadow-inner">
                      <FileText className="h-10 w-10 text-emerald-500" />
                    </div>
                    <p className="text-xl font-extrabold text-foreground mb-2">{file.name}</p>
                    <p className="text-sm font-semibold text-emerald-500 flex items-center gap-1.5">
                      <Check className="w-4 h-4" /> Ready to {job.is_benchmark ? 'screen' : 'apply'}
                    </p>
                    <p className="mt-6 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                      Click or drag a different file to replace
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center pointer-events-none">
                    <div className={`h-24 w-24 rounded-full flex items-center justify-center mb-6 transition-colors duration-300 ${dragOver ? 'bg-primary/20 text-primary' : 'bg-secondary text-muted-foreground'}`}>
                      <UploadCloud className="h-12 w-12" />
                    </div>
                    <p className="text-2xl font-extrabold text-foreground mb-2">
                      {job.is_benchmark ? "Drop Your Resume" : "Upload Resume to Apply"}
                    </p>
                    <p className="text-base font-medium text-muted-foreground mb-8">
                      PDF or DOCX supported
                    </p>
                    <span className="rounded-full bg-background border border-border px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-muted-foreground shadow-sm">
                      SECURE SUBMISSION
                    </span>
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={!file || isSubmitting || (!job.is_benchmark && job.remaining_vacancies !== undefined && job.remaining_vacancies <= 0)}
                className={`mt-8 w-full rounded-2xl py-5 text-lg font-bold shadow-xl transition-all duration-300 flex items-center justify-center gap-3 ${
                  file && !isSubmitting && (job.is_benchmark || (job.remaining_vacancies !== undefined && job.remaining_vacancies > 0))
                    ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-primary/30 hover:-translate-y-1"
                    : "cursor-not-allowed bg-secondary/80 border border-border/50 text-muted-foreground shadow-none"
                }`}
              >
                {isSubmitting ? (
                  <>
                    <div className="h-5 w-5 rounded-full border-2 border-primary-foreground border-r-transparent animate-spin" />
                    {job.is_benchmark ? "Analyzing Profile..." : "Submitting Application..."}
                  </>
                ) : (!job.is_benchmark && job.remaining_vacancies !== undefined && job.remaining_vacancies <= 0) ? (
                  "Job is Full"
                ) : file ? (
                  <>
                    {job.is_benchmark ? "Run AI Screening" : "Submit Application"}
                    <ArrowRight className="h-5 w-5" />
                  </>
                ) : (
                  "Select a file to begin"
                )}
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}

function ScoreBar({ label, value, max }: { label: string, value: number, max: number }) {
  const percentage = (value / max) * 100;
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-xs font-bold uppercase tracking-widest">
        <span className="text-muted-foreground">{label}</span>
        <span className="text-foreground">{value} / {max}</span>
      </div>
      <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
        <div 
          className="h-full bg-primary transition-all duration-1000 ease-out" 
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
