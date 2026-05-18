"use client";

import { useApp } from "@/context/AppContext";
import { useAuth } from "@/context/AuthContext";
import { Building2, Calendar, FileText, ArrowRight, CheckCircle2, Clock, XCircle, Briefcase } from "lucide-react";

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
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-6xl mx-auto">
      
      {/* Visual Header */}
      <div className="relative overflow-hidden rounded-[3rem] border border-border/50 bg-card/40 backdrop-blur-xl p-10 md:p-14 shadow-2xl shadow-black/5">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-gradient-to-bl from-orange-500/10 to-transparent rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-[10px] font-black uppercase tracking-[0.2em] text-orange-600 mb-6">
               <Briefcase className="w-3 h-3" />
               Application Tracker
            </div>
            <h2 className="text-5xl font-black tracking-tighter text-foreground mb-4">Track Your <span className="text-primary">Journey.</span></h2>
            <p className="text-lg font-medium text-muted-foreground max-w-md leading-relaxed">
              Monitor your screening status across all simulations and live job applications in real-time.
            </p>
          </div>

          <div className="flex items-center gap-8 bg-background/50 backdrop-blur-md p-8 rounded-[2.5rem] border border-border/50">
            <div className="text-center">
              <span className="block text-4xl font-black text-foreground">{applications.length}</span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mt-1">Applied</span>
            </div>
            <div className="w-px h-12 bg-border/50" />
            <div className="text-center">
              <span className="block text-4xl font-black text-emerald-500">
                {applications.filter(a => a.status === 'shortlisted').length}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mt-1">Selected</span>
            </div>
          </div>
        </div>
      </div>

      {/* Applications List */}
      <div className="space-y-6">
        {[...applications]
          .sort((a, b) => {
            const timeA = new Date(a.appliedAt || a.appliedDate).getTime();
            const timeB = new Date(b.appliedAt || b.appliedDate).getTime();
            return timeB - timeA;
          })
          .map((app) => (
            <ApplicationTrackerCard key={app.id} app={app} />
          ))}
      </div>
    </div>
  );
}

function ApplicationTrackerCard({ app }: { app: any }) {
  const steps = ["pending", "reviewed", "shortlisted"];
  const status = app.status?.toLowerCase() || "pending";
  const isRejected = status === "rejected";
  const currentStepIndex = isRejected ? -1 : steps.indexOf(status);

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
      
      {app.interviewDate && (
        <div className="relative z-10 mt-6 p-6 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-between group/interview animate-in slide-in-from-bottom-2 duration-500">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/20">
                <Calendar className="w-6 h-6" />
             </div>
             <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-1">Upcoming Interview</p>
                <h4 className="text-xl font-black text-foreground">
                  {new Date(app.interviewDate).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </h4>
             </div>
          </div>
          <div className="hidden md:flex flex-col items-end">
             <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Location</p>
             <p className="text-sm font-bold text-foreground">Virtual Meeting Link in Notifications</p>
          </div>
        </div>
      )}

      {/* Missing Skills Section */}
      {app.missingSkills && app.missingSkills.length > 0 && (
        <div className="relative z-10 mt-6 pt-6 border-t border-border/50">
          <h4 className="text-[10px] font-bold text-amber-500 uppercase tracking-widest mb-3 flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            Skills to Improve For This Role
          </h4>
          <div className="flex flex-wrap gap-2">
            {app.missingSkills.map((skill: string) => (
              <span key={skill} className="px-3 py-1.5 text-xs font-bold bg-amber-500/10 text-amber-600 border border-amber-500/20 rounded-xl transition-colors hover:bg-amber-500/20">
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}
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
