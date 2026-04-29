"use client";

import { useState } from "react";
import { useApp, Job } from "@/context/AppContext";
import { useAuth } from "@/context/AuthContext";
import { UploadCloud, CheckCircle2, Building2, ArrowLeft, FileText, Briefcase, Calendar, Check, ArrowRight } from "lucide-react";

interface ApplyProps {
  job: Job | null;
  setPage: (page: string) => void;
}

export default function Apply({ job, setPage }: ApplyProps) {
  const { applyToJob } = useApp();
  const { user } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!job) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
        <div className="h-24 w-24 rounded-full bg-secondary flex items-center justify-center mb-6">
          <FileText className="h-10 w-10 text-muted-foreground/40" />
        </div>
        <p className="text-xl font-bold text-foreground">No job selected</p>
        <button
          onClick={() => setPage("jobs")}
          className="mt-6 flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-bold shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Jobs
        </button>
      </div>
    );
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === "application/pdf") {
      setFile(droppedFile);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !user) return;
    
    setIsSubmitting(true);
    
    // Simulate slight network delay for better UX
    setTimeout(() => {
      applyToJob(job.id, user.name, user.email, file.name);
      setSubmitted(true);
      setIsSubmitting(false);
    }, 1000);
  };

  if (submitted) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center text-center animate-in fade-in zoom-in duration-500">
        <div className="relative group">
          <div className="absolute inset-0 bg-emerald-500/20 blur-[60px] rounded-full group-hover:bg-emerald-500/30 transition-colors duration-500" />
          <div className="relative rounded-[2.5rem] border border-border/50 bg-card/60 backdrop-blur-xl p-12 shadow-2xl max-w-md w-full">
            <div className="mb-8 flex h-24 w-24 mx-auto items-center justify-center rounded-full bg-emerald-500/10 shadow-inner">
              <CheckCircle2 className="h-12 w-12 text-emerald-500" />
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight text-foreground mb-4">Application Submitted!</h2>
            <p className="text-muted-foreground font-medium mb-2">
              Your resume for <span className="text-foreground font-bold">{job.title}</span> at <span className="text-foreground font-bold">{job.company}</span> has been received.
            </p>
            <p className="text-sm text-muted-foreground/70 mb-10">
              Our AI is analyzing your profile. We'll be in touch soon.
            </p>
            <button
              onClick={() => setPage("my-applications")}
              className="w-full rounded-xl bg-primary px-6 py-4 font-bold text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-1 transition-all"
            >
              View My Applications
            </button>
          </div>
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
        Back to Jobs
      </button>

      <div className="grid lg:grid-cols-5 gap-8 xl:gap-12 items-start">
        
        {/* Left Side: Job Details */}
        <div className="lg:col-span-2 lg:sticky lg:top-32 space-y-6">
          <div className="rounded-[2rem] border border-border/50 bg-card/40 backdrop-blur-xl p-8 shadow-xl shadow-black/5">
            <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-primary/20 to-blue-500/10 border border-primary/10 flex items-center justify-center mb-6 shadow-sm">
              <Building2 className="h-8 w-8 text-primary" />
            </div>
            
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground mb-2">
              {job.title}
            </h1>
            <p className="text-lg font-semibold text-muted-foreground mb-8">
              {job.company}
            </p>

            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3 text-sm font-bold text-foreground">
                <Briefcase className="w-5 h-5 text-muted-foreground" />
                Full-time
              </div>
              <div className="flex items-center gap-3 text-sm font-bold text-foreground">
                <Calendar className="w-5 h-5 text-muted-foreground" />
                Posted {new Date(job.posted).toLocaleDateString()}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4">Required Skills</h3>
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
              <h2 className="text-2xl font-extrabold tracking-tight text-foreground mb-2">Submit Your Resume</h2>
              <p className="text-muted-foreground font-medium">Upload your PDF resume. Our AI will automatically extract your details and score your match.</p>
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
                  accept=".pdf"
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
                      <Check className="w-4 h-4" /> Ready to submit
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
                      Drag & Drop
                    </p>
                    <p className="text-base font-medium text-muted-foreground mb-8">
                      your resume here, or click to browse
                    </p>
                    <span className="rounded-full bg-background border border-border px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-muted-foreground shadow-sm">
                      PDF ONLY
                    </span>
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={!file || isSubmitting}
                className={`mt-8 w-full rounded-2xl py-5 text-lg font-bold shadow-xl transition-all duration-300 flex items-center justify-center gap-3 ${
                  file && !isSubmitting
                    ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-primary/30 hover:-translate-y-1"
                    : "cursor-not-allowed bg-secondary/80 border border-border/50 text-muted-foreground shadow-none"
                }`}
              >
                {isSubmitting ? (
                  <>
                    <div className="h-5 w-5 rounded-full border-2 border-primary-foreground border-r-transparent animate-spin" />
                    Processing Application...
                  </>
                ) : file ? (
                  <>
                    Submit Application
                    <ArrowRight className="h-5 w-5" />
                  </>
                ) : (
                  "Select a file to continue"
                )}
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}
