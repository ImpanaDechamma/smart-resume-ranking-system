"use client";

import { useState, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import { Trophy, Mail, FileText, Medal, Crown, Star } from "lucide-react";

export default function Rankings({ initialJobId }: { initialJobId?: string }) {
  const { jobs, getApplicationsForJob, updateApplicationStatus } = useApp();
  const [selectedJobId, setSelectedJobId] = useState(initialJobId || jobs[0]?.id || "");

  useEffect(() => {
    if (initialJobId) setSelectedJobId(initialJobId);
  }, [initialJobId]);

  const applications = getApplicationsForJob(selectedJobId)
    .sort((a, b) => b.score - a.score);

  const top3 = applications.slice(0, 3);
  const remaining = applications.slice(3);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between bg-card/40 backdrop-blur-xl border border-border/50 p-6 sm:p-8 rounded-3xl shadow-xl shadow-black/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-gradient-to-bl from-primary/10 via-blue-500/5 to-transparent rounded-full blur-[80px] -translate-y-1/2 translate-x-1/4 pointer-events-none" />
        <div className="relative z-10">
          <div className="inline-flex p-3 rounded-2xl bg-primary/10 text-primary mb-4">
            <Trophy className="h-6 w-6" />
          </div>
          <h2 className="text-3xl font-extrabold text-foreground tracking-tight">Candidate Rankings</h2>
          <p className="text-sm font-medium text-muted-foreground mt-1">
            AI-powered resume scoring to find your perfect match.
          </p>
        </div>
        
        <div className="relative z-10 w-full sm:w-72">
          <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2 block">
            Filter by Job Role
          </label>
          <div className="relative">
            <select
              value={selectedJobId}
              onChange={(e) => setSelectedJobId(e.target.value)}
              className="w-full appearance-none rounded-xl border border-border/50 bg-background/50 px-4 py-3.5 text-sm font-bold text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all cursor-pointer"
            >
              {jobs.map((job) => (
                <option key={job.id} value={job.id} className="font-medium bg-background">
                  {job.title} - {job.company}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-muted-foreground">
              <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {applications.length === 0 ? (
        <div className="flex min-h-[40vh] flex-col items-center justify-center text-center bg-card/20 border border-border/50 rounded-3xl backdrop-blur-sm">
          <div className="h-24 w-24 rounded-full bg-secondary flex items-center justify-center mb-6">
            <FileText className="h-10 w-10 text-muted-foreground/40" />
          </div>
          <p className="text-xl font-bold text-foreground">No applications yet</p>
          <p className="mt-2 text-sm font-medium text-muted-foreground max-w-sm">
            When candidates apply to this position, their AI-scored rankings will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-12">
          
          {/* Top 3 Podium */}
          {top3.length > 0 && (
            <div>
              <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-8 text-center flex items-center justify-center gap-2">
                <Star className="w-4 h-4 text-amber-500" />
                Top Candidates
                <Star className="w-4 h-4 text-amber-500" />
              </h3>
              
              <div className="flex flex-col md:flex-row items-end justify-center gap-6 px-4">
                {/* 2nd Place */}
                {top3[1] && <PodiumCard app={top3[1]} rank={2} updateApplicationStatus={updateApplicationStatus} />}
                
                {/* 1st Place */}
                {top3[0] && <PodiumCard app={top3[0]} rank={1} updateApplicationStatus={updateApplicationStatus} />}
                
                {/* 3rd Place */}
                {top3[2] && <PodiumCard app={top3[2]} rank={3} updateApplicationStatus={updateApplicationStatus} />}
              </div>
            </div>
          )}

          {/* Remaining Candidates List */}
          {remaining.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4 pl-2">
                Other Candidates
              </h3>
              <div className="space-y-3">
                {remaining.map((app, index) => (
                  <div
                    key={app.id}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl border border-border/50 bg-card/40 backdrop-blur-md hover:bg-card/80 hover:border-primary/20 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="flex items-center gap-5">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-secondary/80 text-muted-foreground font-extrabold text-sm border border-border">
                        #{index + 4}
                      </div>
                      <div>
                        <p className="font-extrabold text-foreground text-lg">
                          {app.candidateName}
                        </p>
                        <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground mt-0.5">
                          <Mail className="h-3 w-3" />
                          {app.candidateEmail}
                          <span className="mx-1">•</span>
                          {new Date(app.appliedDate).toLocaleDateString()}
                        </div>
                        {app.missingSkills && app.missingSkills.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {app.missingSkills.map((skill: string) => (
                              <span key={skill} className="px-1.5 py-0.5 text-[10px] font-bold bg-amber-500/10 text-amber-600 rounded">
                                Lacks: {skill}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 w-full sm:w-auto mt-4 sm:mt-0">
                      <div className="flex items-center gap-3 w-full sm:w-48">
                        <div className="flex-1 h-2.5 overflow-hidden rounded-full bg-secondary/80 shadow-inner">
                          <div
                            className={`h-full rounded-full transition-all duration-1000 ${getScoreColor(app.score)}`}
                            style={{ width: `${app.score}%` }}
                          />
                        </div>
                        <span className="text-sm font-extrabold text-foreground w-10 text-right">
                          {app.score}%
                        </span>
                      </div>
                      
                      <StatusSelect app={app} updateApplicationStatus={updateApplicationStatus} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      )}
    </div>
  );
}

function PodiumCard({ app, rank, updateApplicationStatus }: { app: any, rank: number, updateApplicationStatus: any }) {
  const isFirst = rank === 1;
  const rankColors = {
    1: "from-amber-500 to-yellow-300 border-amber-400 shadow-amber-500/20 text-amber-700",
    2: "from-slate-400 to-gray-200 border-slate-300 shadow-slate-500/20 text-slate-700",
    3: "from-orange-600 to-amber-700 border-orange-500 shadow-orange-700/20 text-orange-800",
  };

  const bgGlows = {
    1: "bg-amber-500/5",
    2: "bg-slate-400/5",
    3: "bg-orange-600/5",
  };

  const height = isFirst ? "h-[340px]" : rank === 2 ? "h-[300px]" : "h-[280px]";
  const order = isFirst ? "order-1 md:order-2" : rank === 2 ? "order-2 md:order-1" : "order-3 md:order-3";

  return (
    <div className={`relative flex flex-col items-center w-full md:w-1/3 max-w-[320px] ${order}`}>
      {/* Rank Badge Floating */}
      <div className={`absolute -top-6 z-20 flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br shadow-xl border-2 border-background ${rankColors[rank as keyof typeof rankColors]}`}>
        {rank === 1 ? <Crown className="w-6 h-6 text-white" /> : <Medal className="w-6 h-6 text-white" />}
      </div>

      {/* Card Body */}
      <div className={`w-full flex flex-col justify-between rounded-[2rem] border border-border/50 bg-card/60 backdrop-blur-xl p-6 pt-12 shadow-2xl transition-transform hover:-translate-y-2 ${bgGlows[rank as keyof typeof bgGlows]} ${height}`}>
        
        <div className="text-center space-y-1">
          <h4 className="text-xl font-extrabold text-foreground truncate px-2">{app.candidateName}</h4>
          <p className="text-xs font-semibold text-muted-foreground truncate">{app.candidateEmail}</p>
          {app.missingSkills && app.missingSkills.length > 0 && (
             <div className="flex flex-wrap justify-center gap-1 pt-1">
               {app.missingSkills.slice(0, 2).map((skill: string) => (
                 <span key={skill} className="px-1.5 py-0.5 text-[9px] font-bold bg-amber-500/10 text-amber-600 rounded border border-amber-500/20">
                   Needs {skill}
                 </span>
               ))}
               {app.missingSkills.length > 2 && (
                 <span className="px-1.5 py-0.5 text-[9px] font-bold bg-amber-500/10 text-amber-600 rounded border border-amber-500/20">+{app.missingSkills.length - 2}</span>
               )}
             </div>
          )}
        </div>

        <div className="flex flex-col items-center gap-2 my-auto">
          <div className="text-5xl font-black tracking-tighter">
            <span className={`bg-gradient-to-br bg-clip-text text-transparent ${rankColors[rank as keyof typeof rankColors]}`}>
              {app.score}
            </span>
            <span className="text-2xl text-muted-foreground ml-1">%</span>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Match Score</span>
        </div>

        <div className="w-full">
          <StatusSelect app={app} updateApplicationStatus={updateApplicationStatus} fullWidth />
        </div>
      </div>
    </div>
  );
}

function StatusSelect({ app, updateApplicationStatus, fullWidth = false }: { app: any, updateApplicationStatus: any, fullWidth?: boolean }) {
  return (
    <select
      value={app.status}
      onChange={(e) => updateApplicationStatus(app.id, e.target.value)}
      className={`appearance-none rounded-xl border px-4 py-2.5 text-xs font-extrabold uppercase tracking-widest transition-all focus:outline-none focus:ring-4 cursor-pointer text-center ${fullWidth ? 'w-full' : 'w-40'} ${getStatusSelectStyles(app.status)}`}
    >
      <option value="pending" className="font-bold">Pending</option>
      <option value="reviewed" className="font-bold">Reviewed</option>
      <option value="shortlisted" className="font-bold">Shortlisted</option>
      <option value="rejected" className="font-bold">Rejected</option>
    </select>
  );
}

function getScoreColor(score: number): string {
  if (score >= 90) return "bg-emerald-500";
  if (score >= 80) return "bg-primary";
  if (score >= 70) return "bg-blue-500";
  return "bg-amber-500";
}

function getStatusSelectStyles(status: string): string {
  const styles: Record<string, string> = {
    pending: "border-amber-500/20 bg-amber-500/10 text-amber-600 focus:border-amber-500 focus:ring-amber-500/20",
    reviewed: "border-blue-500/20 bg-blue-500/10 text-blue-600 focus:border-blue-500 focus:ring-blue-500/20",
    shortlisted: "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 focus:border-emerald-500 focus:ring-emerald-500/20",
    rejected: "border-red-500/20 bg-red-500/10 text-red-600 focus:border-red-500 focus:ring-red-500/20",
  };
  return styles[status] || "";
}
