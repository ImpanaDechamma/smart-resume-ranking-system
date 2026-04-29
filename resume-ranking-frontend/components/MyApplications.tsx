"use client";

import { useApp } from "@/context/AppContext";
import { useAuth } from "@/context/AuthContext";
import { Building2, Calendar, FileText, ArrowRight, CheckCircle2, Clock, XCircle } from "lucide-react";

interface MyApplicationsProps {
  setPage: (page: string) => void;
}

export default function MyApplications({ setPage }: MyApplicationsProps) {
  const { getApplicationsForCandidate } = useApp();
  const { user } = useAuth();

  const applications = user ? getApplicationsForCandidate(user.email) : [];

  if (applications.length === 0) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center animate-in fade-in duration-500">
        <div className="h-24 w-24 rounded-full bg-secondary flex items-center justify-center mb-6">
          <FileText className="h-10 w-10 text-muted-foreground/40" />
        </div>
        <p className="text-xl font-bold text-foreground">No applications yet</p>
        <p className="mt-2 text-sm font-medium text-muted-foreground">
          Start applying to jobs to see your progress here.
        </p>
        <button
          onClick={() => setPage("jobs")}
          className="mt-8 flex items-center gap-2 rounded-xl bg-primary px-8 py-4 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-1 transition-all"
        >
          Explore Opportunities
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 bg-card/40 backdrop-blur-xl border border-border/50 p-8 rounded-3xl shadow-xl shadow-black/5">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-foreground">My Applications</h2>
          <p className="text-sm font-medium text-muted-foreground mt-2">
            Track the status of your active job applications in real-time.
          </p>
        </div>
        <div className="flex gap-4">
          <div className="flex flex-col">
            <span className="text-3xl font-black text-foreground">{applications.length}</span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Total</span>
          </div>
          <div className="w-px h-12 bg-border/50" />
          <div className="flex flex-col">
            <span className="text-3xl font-black text-emerald-500">
              {applications.filter(a => a.status === 'shortlisted').length}
            </span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Shortlisted</span>
          </div>
        </div>
      </div>

      {/* Applications List */}
      <div className="space-y-6">
        {applications.map((app) => (
          <ApplicationTrackerCard key={app.id} app={app} />
        ))}
      </div>
    </div>
  );
}

function ApplicationTrackerCard({ app }: { app: any }) {
  const steps = ["pending", "reviewed", "shortlisted"];
  const isRejected = app.status === "rejected";
  const currentStepIndex = isRejected ? -1 : steps.indexOf(app.status);

  return (
    <div className="relative overflow-hidden rounded-3xl border border-border/50 bg-card/40 backdrop-blur-xl p-8 transition-all duration-500 hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/10 group">
      
      {/* Background Accent */}
      {app.status === 'shortlisted' && (
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[60px] pointer-events-none" />
      )}

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        
        {/* Job Info */}
        <div className="flex-1">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-background to-secondary border border-border flex items-center justify-center shadow-sm">
              <Building2 className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-extrabold text-foreground group-hover:text-primary transition-colors">{app.jobTitle}</h3>
              <p className="text-sm font-semibold text-muted-foreground">{app.company}</p>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-muted-foreground uppercase tracking-widest">
            <span className="flex items-center gap-1.5 bg-secondary/50 px-3 py-1.5 rounded-lg">
              <Calendar className="h-3.5 w-3.5" />
              Applied {new Date(app.appliedDate).toLocaleDateString()}
            </span>
            {app.score > 0 && (
              <span className="flex items-center gap-2 bg-primary/5 text-primary px-3 py-1.5 rounded-lg border border-primary/10">
                AI Match Score
                <span className="text-sm font-black">{app.score}%</span>
              </span>
            )}
          </div>
        </div>

        {/* Status Tracker */}
        <div className="flex-1 max-w-md w-full">
          {isRejected ? (
            <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6 flex flex-col items-center justify-center text-center">
              <XCircle className="w-8 h-8 text-red-500 mb-2" />
              <p className="font-bold text-red-600 uppercase tracking-widest text-xs">Application Rejected</p>
              <p className="text-sm text-muted-foreground mt-1 font-medium">The company decided to move forward with other candidates.</p>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-2 px-1">
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Application Progress</span>
                <StatusBadge status={app.status} />
              </div>
              
              <div className="relative pt-6 pb-2">
                {/* Connecting Line */}
                <div className="absolute top-8 left-[10%] right-[10%] h-1 bg-secondary rounded-full" />
                <div 
                  className="absolute top-8 left-[10%] h-1 bg-primary rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${currentStepIndex === 0 ? '0%' : currentStepIndex === 1 ? '40%' : '80%'}` }}
                />

                {/* Steps */}
                <div className="relative flex justify-between">
                  <TrackerStep 
                    label="Applied" 
                    icon={<FileText className="w-4 h-4" />}
                    active={currentStepIndex >= 0}
                    completed={currentStepIndex > 0}
                  />
                  <TrackerStep 
                    label="Reviewed" 
                    icon={<Clock className="w-4 h-4" />}
                    active={currentStepIndex >= 1}
                    completed={currentStepIndex > 1}
                  />
                  <TrackerStep 
                    label="Shortlisted" 
                    icon={<CheckCircle2 className="w-4 h-4" />}
                    active={currentStepIndex >= 2}
                    completed={currentStepIndex > 2}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

function TrackerStep({ label, icon, active, completed }: { label: string, icon: React.ReactNode, active: boolean, completed: boolean }) {
  return (
    <div className="flex flex-col items-center gap-3 relative z-10 w-20">
      <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${
        completed 
          ? "bg-primary border-primary text-white shadow-lg shadow-primary/30 scale-110" 
          : active 
            ? "bg-background border-primary text-primary shadow-lg shadow-primary/20 scale-110" 
            : "bg-secondary border-transparent text-muted-foreground"
      }`}>
        {icon}
      </div>
      <span className={`text-[10px] font-bold uppercase tracking-widest text-center transition-colors ${
        active ? "text-foreground" : "text-muted-foreground"
      }`}>
        {label}
      </span>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const statusStyles: Record<string, string> = {
    pending: "bg-amber-500/10 text-amber-600 border-amber-500/20",
    reviewed: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    shortlisted: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
    rejected: "bg-red-500/10 text-red-600 border-red-500/20",
  };

  return (
    <span
      className={`rounded-lg border px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-widest ${statusStyles[status]}`}
    >
      {status}
    </span>
  );
}
