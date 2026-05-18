"use client";

import { useApp } from "@/context/AppContext";
import { useAuth } from "@/context/AuthContext";
import { 
  Briefcase, Users, Clock, CheckCircle, TrendingUp, Sparkles, 
  Activity, FileText, Zap, PieChart, BarChart3, Plus, Search,
  ArrowUpRight, Target
} from "lucide-react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface HRDashboardProps {
  setPage: (page: string) => void;
  setAutoOpenAddModal: (open: boolean) => void;
}

export default function HRDashboard({ setPage, setAutoOpenAddModal }: HRDashboardProps) {
  const { jobs, applications } = useApp();
  const { user } = useAuth();
  const [topSkills, setTopSkills] = useState<{skill: string; count: number}[]>([]);

  useEffect(() => {
    const fetchSkillStats = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://127.0.0.1:5000/api/skills/stats", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) setTopSkills(await res.json());
      } catch (err) {
        console.error("Error fetching skill stats:", err);
      }
    };
    fetchSkillStats();
  }, []);

  const stats = {
    totalJobs: jobs.length,
    totalApplicants: applications.length,
    pendingReview: applications.filter((a) => a.status === "pending").length,
    shortlisted: applications.filter((a) => a.status === "shortlisted").length,
  };

  const recentApplications = [...applications]
    .sort((a, b) => new Date(b.appliedAt || b.appliedDate).getTime() - new Date(a.appliedAt || a.appliedDate).getTime())
    .slice(0, 4);

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      
      {/* Bento Grid Header */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Main Hero Card (Large) */}
        <div className="lg:col-span-8 group">
           <div className="relative h-[480px] rounded-[3rem] overflow-hidden border border-border/50 bg-white/40 backdrop-blur-3xl shadow-2xl transition-all hover:shadow-primary/5">
              <img 
                src="/images/hr_dashboard.png" 
                alt="HR" 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/40 to-transparent flex flex-col justify-end p-12 lg:p-16">
                 <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-[9px] font-black uppercase tracking-[0.2em] text-primary mb-6 w-fit">
                    <Sparkles className="w-3 h-3" />
                    Premium Analytics
                 </div>
                 <h2 className="text-5xl lg:text-7xl font-black tracking-tighter text-foreground mb-6 leading-[0.9]">
                    Precision <br />
                    <span className="text-primary">Acquisition.</span>
                 </h2>
                 <p className="text-lg font-medium text-muted-foreground max-w-sm mb-10 leading-relaxed opacity-80">
                    Your central command for AI-driven recruitment benchmarks and talent rankings.
                 </p>
                 <div className="flex gap-4">
                    <button 
                      onClick={() => setPage("jobs")}
                      className="px-8 py-4 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-primary/20 transition-all hover:-translate-y-1"
                    >
                       View Benchmarks
                    </button>
                    <button 
                      onClick={() => setAutoOpenAddModal(true)}
                      className="px-8 py-4 bg-white text-foreground text-[10px] font-black uppercase tracking-widest rounded-2xl border border-border shadow-sm transition-all hover:bg-secondary"
                    >
                       Add Job
                    </button>
                 </div>
              </div>
           </div>
        </div>

        {/* Recent Applicants Card (Tall) */}
        <div className="lg:col-span-4 h-[480px]">
           <div className="h-full rounded-[3rem] border border-border/50 bg-white/40 backdrop-blur-3xl p-8 flex flex-col shadow-xl">
              <div className="flex items-center justify-between mb-8">
                 <h3 className="text-xl font-black text-foreground tracking-tight">Applicants</h3>
                 <div className="w-10 h-10 rounded-2xl bg-secondary/50 flex items-center justify-center">
                    <Users className="w-5 h-5 text-primary" />
                 </div>
              </div>
              
              <div className="space-y-4 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                 {recentApplications.map((app) => (
                    <div 
                      key={app.id} 
                      onClick={() => setPage("rankings")}
                      className="flex items-center justify-between p-4 bg-secondary/30 rounded-3xl border border-transparent hover:border-primary/20 hover:bg-white transition-all cursor-pointer group"
                    >
                       <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-sm">
                             <img 
                              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(app.candidateName)}&background=random&color=fff`} 
                              className="w-full h-full rounded-2xl"
                              alt=""
                             />
                          </div>
                          <div>
                             <p className="text-sm font-black text-foreground truncate max-w-[120px]">{app.candidateName}</p>
                             <div className="flex items-center gap-2">
                                <p className="text-[10px] font-bold text-muted-foreground uppercase">{app.status}</p>
                                {app.resumeFile && (
                                   <a 
                                      href={app.resumeFile.startsWith('http') ? app.resumeFile : `http://127.0.0.1:5000/api/resume/view/${app.id}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      onClick={(e) => e.stopPropagation()}
                                      className="text-[9px] font-black text-primary hover:underline flex items-center gap-0.5"
                                   >
                                      <FileText className="w-2.5 h-2.5" />
                                      Resume
                                   </a>
                                )}
                             </div>
                          </div>
                       </div>
                       <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                 ))}

                 {recentApplications.length === 0 && (
                   <div className="h-full flex flex-col items-center justify-center text-center py-10">
                      <p className="text-xs font-bold text-muted-foreground italic">No recent applications</p>
                   </div>
                 )}
              </div>

              <button 
                onClick={() => setPage("rankings")}
                className="mt-8 w-full p-4 bg-secondary text-foreground font-black uppercase tracking-widest text-[10px] rounded-2xl hover:bg-primary hover:text-white transition-all"
              >
                 See Full List
              </button>
           </div>
        </div>

        {/* Stats Grid - Row 2 */}
        
        {/* 1. Skill Distribution (Wide) */}
        <div className="lg:col-span-6">
           <div className="rounded-[3rem] border border-border/50 bg-white/40 backdrop-blur-3xl p-10 shadow-xl relative overflow-hidden group">
              <div className="flex items-center justify-between mb-10">
                 <h3 className="text-xl font-black text-foreground">Talent Market</h3>
                 <div className="w-10 h-10 rounded-2xl bg-violet-500/10 text-violet-600 flex items-center justify-center">
                    <Target className="w-5 h-5" />
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-8">
                 <div className="space-y-6">
                    {topSkills.slice(0, 3).map((skill) => (
                       <div key={skill.skill} className="space-y-2">
                          <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                             <span>{skill.skill}</span>
                             <span>{skill.count} Jobs</span>
                          </div>
                          <div className="h-2 w-full bg-secondary/50 rounded-full overflow-hidden">
                             <div 
                                className="h-full bg-violet-500 transition-all duration-1000" 
                                style={{ width: `${(skill.count / (topSkills[0]?.count || 1)) * 100}%` }} 
                             />
                          </div>
                       </div>
                    ))}
                 </div>
                 <div className="flex flex-col items-center justify-center">
                    <div className="relative w-32 h-32">
                       <PieChart className="w-full h-full text-violet-500/20" />
                       <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-2xl font-black text-violet-600">{topSkills.length}</span>
                       </div>
                    </div>
                    <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest mt-4">Active Skillsets</p>
                 </div>
              </div>
           </div>
        </div>

        {/* 2. Platform Usage (Compact) */}
        <div className="lg:col-span-3">
           <div className="rounded-[3rem] border border-border/50 bg-white/40 backdrop-blur-3xl p-10 shadow-xl h-full flex flex-col justify-between group">
              <div className="flex items-center justify-between">
                 <h3 className="text-xl font-black text-foreground">Usage</h3>
                 <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                    <Activity className="w-5 h-5" />
                 </div>
              </div>
              <div className="py-8">
                 <p className="text-5xl font-black text-foreground">{stats.totalJobs}</p>
                 <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-2">Benchmarks Active</p>
              </div>
              <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl">
                 <p className="text-[10px] font-bold text-emerald-600">Peak Performance Detected</p>
              </div>
           </div>
        </div>

        {/* 3. Success Rate (Compact) */}
        <div className="lg:col-span-3">
           <div className="rounded-[3rem] border border-border/50 bg-white/40 backdrop-blur-3xl p-10 shadow-xl h-full flex flex-col justify-between group">
              <div className="flex items-center justify-between">
                 <h3 className="text-xl font-black text-foreground">Success</h3>
                 <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                    <CheckCircle className="w-5 h-5" />
                 </div>
              </div>
              <div className="py-8">
                 <p className="text-5xl font-black text-foreground">
                    {stats.totalApplicants > 0 ? Math.round((stats.shortlisted / stats.totalApplicants) * 100) : 0}%
                 </p>
                 <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-2">Shortlist Rate</p>
              </div>
              <button 
                onClick={() => setPage("rankings")}
                className="w-full py-4 bg-secondary text-foreground text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-primary hover:text-white transition-all"
              >
                 Report
              </button>
           </div>
        </div>

      </div>
    </div>
  );
}
