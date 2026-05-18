"use client";

import { useState, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import { useAuth } from "@/context/AuthContext";
import { Trophy, Mail, FileText, Medal, Crown, Star, CheckCircle, XCircle, Clock, Calendar } from "lucide-react";

export default function Rankings({ initialJobId }: { initialJobId?: string }) {
  const { jobs, getApplicationsForJob, updateApplicationStatus } = useApp();
  const { user } = useAuth();

  // Rankings only applies to live jobs THEY created
  const liveJobs = jobs.filter(job => !job.is_benchmark && job.created_by === user?.id);
  const [selectedJobId, setSelectedJobId] = useState(initialJobId || liveJobs[0]?.id || "");

  useEffect(() => {
    if (initialJobId) setSelectedJobId(initialJobId);
  }, [initialJobId]);

  const applications = getApplicationsForJob(selectedJobId)
    .sort((a, b) => b.score - a.score);

  const top3 = applications.slice(0, 3);
  const remaining = applications.slice(3);

  if (liveJobs.length === 0) {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center text-center bg-card/20 border border-border/50 rounded-3xl backdrop-blur-sm">
        <div className="h-24 w-24 rounded-full bg-secondary flex items-center justify-center mb-6">
          <Trophy className="h-10 w-10 text-muted-foreground/40" />
        </div>
        <p className="text-xl font-bold text-foreground">No live jobs yet</p>
        <p className="mt-2 text-sm font-medium text-muted-foreground max-w-sm">
          Rankings are only available for live job openings. Create a live job first to start receiving and ranking candidates.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Premium Rankings Header */}
      <div className="relative overflow-hidden rounded-[3rem] border border-border/50 bg-card/40 backdrop-blur-xl p-10 md:p-14 shadow-2xl shadow-black/5">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-gradient-to-bl from-primary/10 via-blue-500/5 to-transparent rounded-full blur-[100px] -translate-y-1/2 translate-x-1/4 pointer-events-none" />
        
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-end justify-between gap-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-6">
               <Trophy className="w-3 h-3" />
               Talent Intelligence
            </div>
            <h2 className="text-5xl font-black tracking-tighter text-foreground mb-4">Candidate <span className="text-primary">Rankings.</span></h2>
            <p className="text-lg font-medium text-muted-foreground max-w-md leading-relaxed">
              AI-powered resume scoring and skill gap analysis to help you identify top-tier talent instantly.
            </p>
          </div>
          
          <div className="w-full lg:w-80 space-y-4">
            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
              Select Recruitment Bench
            </label>
            <div className="relative group">
              <select
                value={selectedJobId}
                onChange={(e) => setSelectedJobId(e.target.value)}
                className="w-full appearance-none rounded-[1.5rem] border border-border/50 bg-background/50 px-6 py-4 text-sm font-bold text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all cursor-pointer hover:bg-background"
              >
                {liveJobs.map((job) => (
                  <option key={job.id} value={job.id} className="font-medium bg-background">
                    {job.title} @ {job.company}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-6 text-primary group-hover:scale-110 transition-transform">
                <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                  <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                </svg>
              </div>
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
              
              <div className="flex flex-col md:flex-row items-end justify-center gap-6 px-4 pt-16">
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
                      <div className="flex items-center gap-4">
                        <img 
                          src={`https://ui-avatars.com/api/?name=${encodeURIComponent(app.candidateName)}&background=random&color=fff&size=128`} 
                          alt={app.candidateName}
                          className="w-12 h-12 rounded-xl object-cover border border-border/50"
                        />
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
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-end sm:items-center gap-6 w-full sm:w-auto">
                      <div className="flex items-center gap-4">
                        {app.resumeFile && typeof app.resumeFile === 'string' && (
                          <a
                            href={app.resumeFile.startsWith('http') ? app.resumeFile : `http://127.0.0.1:5000/api/resume/view/${app.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-secondary hover:bg-primary/10 hover:text-primary transition-all text-[10px] font-black uppercase tracking-widest"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            Resume
                          </a>
                        )}
                        <div className="text-right">
                          <p className="text-2xl font-black text-primary leading-none">{app.score}%</p>
                          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">Match</p>
                        </div>
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
  const isSecond = rank === 2;
  const isThird = rank === 3;

  const rankColors = {
    1: "from-amber-500 to-yellow-300 border-amber-400 shadow-amber-500/20 text-amber-700",
    2: "from-slate-400 to-gray-200 border-slate-300 shadow-slate-500/20 text-slate-700",
    3: "from-orange-600 to-amber-700 border-orange-500 shadow-orange-700/20 text-orange-800",
  };

  return (
    <div className={`relative flex flex-col items-center group transition-all duration-500 ${isFirst ? 'z-30 scale-110 -translate-y-4' : 'z-20 scale-100'} w-full md:w-1/3 max-w-[320px]`}>
      {/* Crown/Medal */}
      <div className={`absolute -top-10 left-1/2 -translate-x-1/2 transition-transform duration-500 group-hover:-translate-y-2`}>
        {isFirst && <Crown className="w-12 h-12 text-amber-400 drop-shadow-[0_0_15px_rgba(251,191,36,0.5)]" />}
        {isSecond && <Medal className="w-10 h-10 text-slate-300 drop-shadow-[0_0_15px_rgba(203,213,225,0.5)]" />}
        {isThird && <Medal className="w-10 h-10 text-orange-400 drop-shadow-[0_0_15px_rgba(251,146,60,0.5)]" />}
      </div>

      <div className={`w-full rounded-[2.5rem] p-8 flex flex-col items-center text-center transition-all border shadow-2xl ${
        isFirst ? 'bg-primary border-primary/20 text-white shadow-primary/20 min-h-[460px]' : 
        'bg-card/80 border-border/50 text-foreground shadow-black/5 min-h-[420px]'
      }`}>
        <div className="relative mb-6">
          <div className={`w-24 h-24 rounded-[2rem] p-1 border-2 ${isFirst ? 'border-white/20' : 'border-primary/20'}`}>
            <img 
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(app.candidateName)}&background=random&color=fff&size=256`} 
              alt={app.candidateName}
              className="w-full h-full rounded-[1.8rem] object-cover"
            />
          </div>
          <div className={`absolute -bottom-2 -right-2 w-10 h-10 rounded-2xl flex items-center justify-center font-black text-xs shadow-xl border-2 ${
            isFirst ? 'bg-white text-primary border-primary' : 'bg-primary text-white border-white'
          }`}>
            #{rank}
          </div>
        </div>

        <h4 className={`text-xl font-black mb-1 line-clamp-1 ${isFirst ? 'text-white' : 'text-foreground'}`}>{app.candidateName}</h4>
        <p className={`text-[10px] font-black uppercase tracking-widest mb-6 ${isFirst ? 'text-white/60' : 'text-muted-foreground'}`}>Score: {app.score}%</p>
        
        <div className="flex flex-col gap-3 w-full mt-auto">
          {app.resumeFile && (
            <a
              href={app.resumeFile.startsWith('http') ? app.resumeFile : `http://127.0.0.1:5000/api/resume/view/${app.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center justify-center gap-2 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                isFirst ? 'bg-white text-primary shadow-xl hover:bg-white/90' : 'bg-primary text-white shadow-lg hover:bg-primary/90'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              View Resume
            </a>
          )}
          <StatusSelect app={app} updateApplicationStatus={updateApplicationStatus} fullWidth invert={isFirst} />
        </div>
      </div>
    </div>
  );
}

function StatusSelect({ app, updateApplicationStatus, fullWidth = false, invert = false }: { app: any, updateApplicationStatus: any, fullWidth?: boolean, invert?: boolean }) {
  const [saving, setSaving] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [interviewDate, setInterviewDate] = useState("");
  
  const handleStatus = async (status: string, date?: string) => {
    setSaving(true);
    await updateApplicationStatus(app.id, status, date);
    setSaving(false);
    setShowDatePicker(false);
  };

  const status = app.status || "pending";

  return (
    <div className={`flex flex-col gap-4 w-full`}>
      <div className="grid grid-cols-2 gap-3 w-full">
        <button
          onClick={() => status === "shortlisted" ? handleStatus("pending") : setShowDatePicker(!showDatePicker)}
          disabled={saving}
          className={`py-3.5 px-2 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all border flex items-center justify-center gap-1.5 shadow-sm ${
            status === "shortlisted" 
            ? (invert ? 'bg-white text-primary' : 'bg-emerald-500 text-white') 
            : (invert ? 'bg-white/20 border-white/30 text-white hover:bg-white/30' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 hover:bg-emerald-500/20')
          }`}
        >
          <CheckCircle className="w-4 h-4" />
          {status === "shortlisted" ? "Shortlisted" : "Shortlist"}
        </button>
        <button
          onClick={() => handleStatus("rejected")}
          disabled={saving}
          className={`py-3.5 px-2 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all border flex items-center justify-center gap-1.5 shadow-sm ${
            status === "rejected" 
            ? (invert ? 'bg-white text-primary' : 'bg-red-500 text-white') 
            : (invert ? 'bg-white/20 border-white/30 text-white hover:bg-white/30' : 'bg-red-500/10 border-red-500/20 text-red-600 hover:bg-red-500/20')
          }`}
        >
          <XCircle className="w-4 h-4" />
          Reject
        </button>
      </div>

      {showDatePicker && (
        <div className={`p-5 rounded-[2rem] border animate-in zoom-in-95 slide-in-from-top-4 duration-500 ${invert ? 'bg-white text-primary shadow-2xl' : 'bg-card border-border/50 shadow-xl'}`}>
          <div className="flex items-center justify-between mb-3">
            <p className="text-[9px] font-black uppercase tracking-widest opacity-80">Interview Date</p>
            <Calendar className="w-3.5 h-3.5 opacity-50" />
          </div>
          
          <div className="space-y-3">
            <input 
              type="date"
              value={interviewDate}
              onChange={(e) => setInterviewDate(e.target.value)}
              className={`w-full p-3 rounded-xl text-[10px] font-bold outline-none focus:ring-4 focus:ring-primary/10 transition-all ${invert ? 'bg-secondary/50 border border-primary/10' : 'bg-secondary/30 border border-transparent focus:border-primary/20'}`}
            />
            <button 
              onClick={() => handleStatus("shortlisted", interviewDate)}
              disabled={!interviewDate || saving}
              className="w-full py-3 bg-primary text-white rounded-xl text-[9px] font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:translate-y-0"
            >
              Confirm
            </button>
          </div>
        </div>
      )}

      {app.interviewDate && (
        <div className={`flex items-center gap-3 p-4 rounded-2xl border ${invert ? 'bg-white/10 border-white/20 text-white' : 'bg-primary/5 border-primary/10 text-primary'}`}>
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${invert ? 'bg-white text-primary' : 'bg-primary text-white'}`}>
            <Calendar className="w-4 h-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-[9px] font-black uppercase tracking-widest opacity-70">Scheduled Interview</span>
            <span className="text-xs font-black">{new Date(app.interviewDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
          </div>
        </div>
      )}
    </div>
  );
}
