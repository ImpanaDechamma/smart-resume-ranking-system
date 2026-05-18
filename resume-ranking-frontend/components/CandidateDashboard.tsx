"use client";

import { useApp } from "@/context/AppContext";
import { useAuth } from "@/context/AuthContext";
import { 
  Briefcase, Users, Clock, CheckCircle, TrendingUp, Sparkles, 
  Activity, FileText, Zap, PieChart, BarChart3, Plus, Search,
  ArrowUpRight, Target, Heart, Star, User
} from "lucide-react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface CandidateDashboardProps {
  setPage: (page: string) => void;
}

export default function CandidateDashboard({ setPage }: CandidateDashboardProps) {
  const { jobs, applications, interests } = useApp();
  const { user } = useAuth();

  const myApplications = applications.filter(a => a.candidateEmail === user?.email);
  const interestedJobs = jobs.filter(j => interests.includes(j.id));
  const avgMatchScore = myApplications.length > 0 
    ? Math.round(myApplications.reduce((acc, a) => acc + (a.score || 0), 0) / myApplications.length) 
    : 0;

  const stats = {
    applied: myApplications.length,
    shortlisted: myApplications.filter((a) => a.status === "shortlisted").length,
    pending: myApplications.filter((a) => a.status === "pending").length,
  };

  const topMatches = [...jobs]
    .sort((a, b) => b.applicants - a.applicants)
    .slice(0, 4);

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      
      {/* Bento Grid Header */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Main Hero Card (Large) */}
        <div className="lg:col-span-8 group">
           <div className="relative h-[480px] rounded-[3rem] overflow-hidden border border-border/50 bg-white/40 backdrop-blur-3xl shadow-2xl transition-all hover:shadow-orange-500/5">
              <img 
                src="/images/candidate_dashboard.png" 
                alt="Candidate" 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/40 to-transparent flex flex-col justify-end p-12 lg:p-16">
                 <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-[9px] font-black uppercase tracking-[0.2em] text-orange-600 mb-6 w-fit">
                    <Zap className="w-3 h-3" />
                    Launchpad Pro
                 </div>
                 <h2 className="text-5xl lg:text-7xl font-black tracking-tighter text-foreground mb-6 leading-[0.9]">
                    Fuel Your <br />
                    <span className="text-primary">Ambition.</span>
                 </h2>
                 <p className="text-lg font-medium text-muted-foreground max-w-sm mb-10 leading-relaxed opacity-80">
                    Your personalized hub for AI-driven career matching and interview simulations.
                 </p>
                 <div className="flex gap-4">
                    <button 
                      onClick={() => setPage("jobs")}
                      className="px-8 py-4 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-primary/20 transition-all hover:-translate-y-1"
                    >
                       Explore Benchmarks
                    </button>
                    <button 
                      onClick={() => setPage("my-applications")}
                      className="px-8 py-4 bg-white text-foreground text-[10px] font-black uppercase tracking-widest rounded-2xl border border-border shadow-sm transition-all hover:bg-secondary"
                    >
                       My Applications
                    </button>
                 </div>
              </div>
           </div>
        </div>

        {/* Top Matches Card (Tall) */}
        <div className="lg:col-span-4 h-[480px]">
           <div className="h-full rounded-[3rem] border border-border/50 bg-white/40 backdrop-blur-3xl p-8 flex flex-col shadow-xl">
              <div className="flex items-center justify-between mb-8">
                 <h3 className="text-xl font-black text-foreground tracking-tight">Top Match</h3>
                 <div className="w-10 h-10 rounded-2xl bg-secondary/50 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-primary" />
                 </div>
              </div>
              
              <div className="space-y-4 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                 {topMatches.map((job) => (
                    <div 
                      key={job.id} 
                      onClick={() => setPage("jobs")}
                      className="flex items-center justify-between p-4 bg-secondary/30 rounded-3xl border border-transparent hover:border-primary/20 hover:bg-white transition-all cursor-pointer group"
                    >
                       <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-sm">
                             <Briefcase className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                             <p className="text-sm font-black text-foreground truncate max-w-[120px]">{job.title}</p>
                             <p className="text-[10px] font-bold text-muted-foreground">{job.company}</p>
                          </div>
                       </div>
                       <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                 ))}
              </div>

              <button 
                onClick={() => setPage("jobs")}
                className="mt-8 w-full p-4 bg-secondary text-foreground font-black uppercase tracking-widest text-[10px] rounded-2xl hover:bg-primary hover:text-white transition-all"
              >
                 Explore All
              </button>
           </div>
        </div>

        {/* Stats Grid - Row 2 */}
        
        {/* 1. Skill Profile (Wide) */}
        <div className="lg:col-span-6">
           <div className="rounded-[3rem] border border-border/50 bg-white/40 backdrop-blur-3xl p-10 shadow-xl relative overflow-hidden group">
              <div className="flex items-center justify-between mb-10">
                 <h3 className="text-xl font-black text-foreground">AI Profile</h3>
                 <div className="w-10 h-10 rounded-2xl bg-orange-500/10 text-orange-600 flex items-center justify-center">
                    <User className="w-5 h-5" />
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-8">
                 <div className="space-y-6">
                    <div className="space-y-2">
                       <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                          <span>Applied</span>
                          <span>{stats.applied}</span>
                       </div>
                       <div className="h-2 w-full bg-secondary/50 rounded-full overflow-hidden">
                          <div className="h-full bg-primary" style={{ width: `${Math.min(stats.applied * 10, 100)}%` }} />
                       </div>
                    </div>
                    <div className="space-y-2">
                       <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                          <span>Shortlisted</span>
                          <span>{stats.shortlisted}</span>
                       </div>
                       <div className="h-2 w-full bg-secondary/50 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500" style={{ width: `${stats.applied > 0 ? (stats.shortlisted / stats.applied) * 100 : 0}%` }} />
                       </div>
                    </div>
                 </div>
                 <div className="flex flex-col items-center justify-center">
                    <div className="relative w-32 h-32">
                       <PieChart className="w-full h-full text-primary/20" />
                       <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-2xl font-black text-primary">{avgMatchScore}%</span>
                       </div>
                    </div>
                    <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest mt-4">Avg Match Score</p>
                 </div>
              </div>
           </div>
        </div>

        {/* 2. Rankings (Compact) */}
        <div className="lg:col-span-3">
           <div className="rounded-[3rem] border border-border/50 bg-white/40 backdrop-blur-3xl p-10 shadow-xl h-full flex flex-col justify-between group">
              <div className="flex items-center justify-between">
                 <h3 className="text-xl font-black text-foreground">Rank</h3>
                 <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5" />
                 </div>
              </div>
               <div className="py-8">
                  <p className="text-5xl font-black text-foreground">#{avgMatchScore >= 80 ? "3" : avgMatchScore >= 50 ? "12" : "48"}</p>
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-2">Overall Standing</p>
               </div>
               <div className="flex gap-2">
                  <div className="flex-1 h-1 bg-secondary rounded-full overflow-hidden">
                     <div className="h-full bg-amber-500" style={{ width: `${avgMatchScore}%` }} />
                  </div>
               </div>
           </div>
        </div>

        {/* 3. Favorite/Quick Access (Compact) */}
        <div className="lg:col-span-3">
           <div className="rounded-[3rem] border border-border/50 bg-white/40 backdrop-blur-3xl p-10 shadow-xl h-full flex flex-col justify-between group">
              <div className="flex items-center justify-between">
                 <h3 className="text-xl font-black text-foreground">Badges</h3>
                 <div className="w-10 h-10 rounded-2xl bg-red-500/10 text-red-600 flex items-center justify-center">
                    <Heart className="w-5 h-5" />
                 </div>
              </div>
               <div className="py-8">
                  <p className="text-5xl font-black text-foreground">{Array.from(new Set(myApplications.flatMap(a => a.candidateSkills || []))).length}</p>
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-2">Skills Verified</p>
               </div>
              <button 
                onClick={() => setPage("profile")}
                className="w-full py-4 bg-secondary text-foreground text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-primary hover:text-white transition-all"
              >
                 View Profile
              </button>
           </div>
        </div>

      </div>

      {/* Interested Jobs Section */}
      {interestedJobs.length > 0 && (
        <div className="pt-12 space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-3xl font-black text-foreground tracking-tight">Interest List</h3>
              <p className="text-muted-foreground font-medium mt-1">Jobs you've bookmarked for later.</p>
            </div>
            <button 
              onClick={() => setPage("jobs")}
              className="px-6 py-3 rounded-xl bg-secondary text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all"
            >
              View All Jobs
            </button>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {interestedJobs.map((job) => (
              <div 
                key={job.id}
                onClick={() => setPage("jobs")}
                className="group p-8 rounded-[2.5rem] border border-border/50 bg-white shadow-xl shadow-black/5 hover:-translate-y-1 transition-all cursor-pointer relative overflow-hidden"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-secondary/50 flex items-center justify-center overflow-hidden">
                    {job.logo ? (
                      <img src={job.logo} alt={job.company} className="w-full h-full object-contain p-2" />
                    ) : (
                      <Briefcase className="w-6 h-6 text-primary" />
                    )}
                  </div>
                  {!job.is_benchmark && job.remaining_vacancies !== undefined && (
                    <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      job.remaining_vacancies <= 3 ? 'bg-red-500 text-white animate-pulse' : 'bg-primary/10 text-primary'
                    }`}>
                      {job.remaining_vacancies} {job.remaining_vacancies === 1 ? 'seat' : 'seats'} left
                    </div>
                  )}
                </div>
                <h4 className="text-xl font-black text-foreground mb-1 group-hover:text-primary transition-colors">{job.title}</h4>
                <p className="text-sm font-bold text-muted-foreground mb-4">{job.company}</p>
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary">
                  <span>Details</span>
                  <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
