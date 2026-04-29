"use client";

import { useState } from "react";
import { useApp, Job } from "@/context/AppContext";
import { useAuth } from "@/context/AuthContext";
import { Upload, CheckCircle, Building2, ArrowLeft, FileText } from "lucide-react";

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

  if (!job) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
        <FileText className="mb-4 h-16 w-16 text-muted-foreground/30" />
        <p className="text-lg text-muted-foreground">No job selected</p>
        <button
          onClick={() => setPage("jobs")}
          className="mt-4 flex items-center gap-2 text-primary hover:underline"
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
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !user) return;

    applyToJob(job.id, user.name, user.email, file.name);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
        <div className="rounded-2xl border border-border bg-card p-8 shadow-xl">
          <div className="mb-4 flex h-16 w-16 mx-auto items-center justify-center rounded-full bg-emerald-100">
            <CheckCircle className="h-8 w-8 text-emerald-600" />
          </div>
          <h2 className="text-xl font-bold text-foreground">Application Submitted!</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Your application for {job.title} has been received.
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            We&apos;ll review your resume and get back to you soon.
          </p>
          <button
            onClick={() => setPage("my-applications")}
            className="mt-6 rounded-xl bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-all"
          >
            View My Applications
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <button
        onClick={() => setPage("jobs")}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Jobs
      </button>

      {/* Job Banner */}
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold text-foreground">{job.title}</h2>
            <div className="mt-1 flex items-center gap-1 text-muted-foreground">
              <Building2 className="h-4 w-4" />
              {job.company}
            </div>
          </div>
        </div>
        <p className="mt-4 text-sm text-muted-foreground">{job.description}</p>
        <div className="mt-4 flex flex-wrap gap-1.5">
          {job.skills.map((skill) => (
            <span
              key={skill}
              className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Application Form */}
      <form onSubmit={handleSubmit} className="rounded-xl border border-border bg-card p-6">
        <h3 className="mb-6 text-lg font-semibold text-foreground">
          Submit Your Application
        </h3>

        {/* Drop Zone */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={`relative flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 text-center transition-all ${
            file
              ? "border-emerald-400 bg-emerald-50"
              : dragOver
              ? "border-primary bg-primary/5"
              : "border-border hover:border-primary/50 hover:bg-secondary/50"
          }`}
        >
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            className="absolute inset-0 cursor-pointer opacity-0"
          />
          
          {file ? (
            <>
              <FileText className="mb-3 h-12 w-12 text-emerald-600" />
              <p className="font-medium text-foreground">{file.name}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Click or drag to replace
              </p>
            </>
          ) : (
            <>
              <Upload className="mb-3 h-12 w-12 text-muted-foreground" />
              <p className="font-medium text-foreground">
                Drop your resume here
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                or click to browse (PDF only)
              </p>
            </>
          )}
        </div>

        <button
          type="submit"
          disabled={!file}
          className={`mt-6 w-full rounded-xl py-3 text-sm font-semibold uppercase tracking-wider transition-all ${
            file
              ? "bg-primary text-primary-foreground hover:bg-primary/90"
              : "cursor-not-allowed bg-secondary text-muted-foreground"
          }`}
        >
          Submit Application
        </button>
      </form>
    </div>
  );
}
