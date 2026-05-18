"use client";

import { useAuth } from "@/context/AuthContext";
import { useApp } from "@/context/AppContext";
import { 
  User, Mail, Shield, Calendar, MapPin, Briefcase, Camera, 
  Save, ArrowLeft, TrendingUp, CheckCircle2, Clock, 
  LayoutGrid, Activity, Laptop, Wallet, GraduationCap,
  ChevronRight, Play, Check, MoreVertical, Plus,
  FileText, Award, BarChart3, Star, X
} from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ProfileProps {
  onBack: () => void;
}

export default function Profile({ onBack }: ProfileProps) {
  const { user } = useAuth();
  const { applications, jobs } = useApp();
  const isHR = user?.role === "hr";
  
  const [isEditing, setIsEditing] = useState(false);
  const [activeAccordion, setActiveAccordion] = useState("skills");
  const [showInsights, setShowInsights] = useState(false);
  const [showGrowthPlan, setShowGrowthPlan] = useState(false);

  // Derived Data from actual system state
  const myJobs = isHR ? jobs.filter(j => j.created_by === user?.id) : [];
  const myApplications = isHR 
    ? applications.filter(a => jobs.some(j => j.id === a.jobId && j.created_by === user?.id))
    : applications.filter(a => a.candidateEmail === user?.email);

  // Dynamic Skills & Missing Skills
  const candidateSkills = Array.from(new Set(myApplications.flatMap(a => a.candidateSkills || []))).slice(0, 5);
  const missingSkills = Array.from(new Set(myApplications.flatMap(a => a.missingSkills || [])));
  
  const avgMatchScore = myApplications.length > 0 
    ? Math.round(myApplications.reduce((acc, a) => acc + (a.score || 0), 0) / myApplications.length) 
    : 0;

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    location: "Location not specified",
    bio: isHR 
      ? "Expert recruiter focused on identifying top-tier technical talent through AI-driven insights." 
      : "Proactive candidate seeking to leverage technical skills in a high-growth environment."
  });

  // Load from local storage for "real" persistence without backend changes
  useEffect(() => {
    const saved = localStorage.getItem(`profile_${user?.id}`);
    if (saved) {
      setFormData(JSON.parse(saved));
    }
  }, [user?.id]);

  const handleSave = () => {
    localStorage.setItem(`profile_${user?.id}`, JSON.stringify(formData));
    setIsEditing(false);
  };

  const stats = {
    primary: isHR ? myJobs.length : myApplications.length,
    secondary: isHR ? myApplications.length : myApplications.filter(a => a.status === 'shortlisted').length,
    tertiary: isHR ? myApplications.filter(a => a.status === 'shortlisted').length : `${avgMatchScore}%`,
    engagement: isHR 
      ? (myJobs.length > 0 ? "92%" : "0%") 
      : (myApplications.length > 0 ? `${Math.min(40 + myApplications.length * 10, 98)}%` : "0%"),
    engagementValue: isHR 
      ? (myJobs.length > 0 ? 92 : 0) 
      : (myApplications.length > 0 ? Math.min(40 + myApplications.length * 10, 98) : 0),
  };

  const weeklyActivity = (() => {
    const days = ["S", "M", "T", "W", "T", "F", "S"];
    const activityCounts = [0, 0, 0, 0, 0, 0, 0];
    
    myApplications.forEach(app => {
      const dateStr = app.appliedDate || app.appliedAt;
      if (dateStr) {
        const date = new Date(dateStr);
        if (!isNaN(date.getTime())) {
          activityCounts[date.getDay()] += 1;
        }
      }
    });

    if (isHR) {
      myJobs.forEach(job => {
        const dateStr = job.created_at;
        if (dateStr && dateStr !== "Just now") {
          const date = new Date(dateStr);
          if (!isNaN(date.getTime())) {
            activityCounts[date.getDay()] += 1;
          }
        }
      });
    }

    const maxCount = Math.max(...activityCounts, 1);
    
    return activityCounts.map((count, index) => ({
      day: days[index],
      value: count > 0 ? Math.max(10, Math.round((count / maxCount) * 100)) : 0
    }));
  })();

  const [tasks, setTasks] = useState(isHR ? [
    { id: 1, title: "Review New Applications", time: "Pending", completed: false },
    { id: 2, title: "Update Benchmark Specs", time: "Today", completed: true },
    { id: 3, title: "Shortlist for Lead Dev", time: "Tomorrow", completed: false },
    { id: 4, title: "Platform Skill Sync", time: "Sep 15", completed: true },
  ] : [
    { id: 1, title: "Optimize Resume", time: "Pending", completed: false },
    { id: 2, title: "Apply to Top Match", time: "Today", completed: true },
    { id: 3, title: "Review Skill Gaps", time: "Today", completed: false },
    { id: 4, title: "Complete Profile", time: "Completed", completed: true },
  ]);

  const toggleTask = (id: number) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20 animate-in fade-in slide-in-from-bottom-8 duration-700">
      
      {/* Header with Navigation and Stats Bar */}
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-all font-black uppercase tracking-widest text-[10px] group"
          >
            <div className="p-2 rounded-full bg-secondary/50 group-hover:bg-primary/10 group-hover:text-primary transition-all">
              <ArrowLeft className="w-4 h-4" />
            </div>
            Back to Dashboard
          </button>
          
          <div className="flex items-center gap-4">
             <div className="px-4 py-2 rounded-2xl bg-card/40 backdrop-blur-md border border-border/50 text-[10px] font-black uppercase tracking-widest text-foreground flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-primary" />
                Last Sync: Just now
             </div>
             <button 
                onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                className={`flex items-center gap-2 rounded-2xl px-6 py-3 font-black uppercase tracking-widest text-[10px] transition-all shadow-lg hover:-translate-y-1 ${isEditing ? 'bg-emerald-500 text-white shadow-emerald-500/20' : 'bg-primary text-white shadow-primary/20'}`}
              >
                {isEditing ? <Save className="w-3.5 h-3.5" /> : <Shield className="w-3.5 h-3.5" />}
                {isEditing ? 'Save Changes' : 'Edit Profile'}
              </button>
          </div>
        </div>

        <h1 className="text-5xl font-black tracking-tighter text-foreground">
          {isHR ? "Recruiter" : "Candidate"} <span className="text-primary">Profile.</span>
        </h1>

        {/* Stats Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
           <StatPill label={isHR ? "Jobs Posted" : "Applications"} value={stats.primary} percent={Math.min(stats.primary * 10, 100)} color="bg-blue-600" />
           <StatPill label={isHR ? "Applicants" : "Shortlisted"} value={stats.secondary} percent={Math.min(stats.secondary * 8, 100)} color="bg-primary" />
           <StatPill label={isHR ? "Shortlisted" : "Avg Match"} value={stats.tertiary} percent={avgMatchScore} color="bg-violet-600" />
           <StatPill label="Engagement" value={stats.engagement} percent={stats.engagementValue} color="bg-blue-400" />
           
           <div className="hidden lg:flex col-span-2 items-center justify-end gap-12 px-8 py-4 bg-card/20 rounded-[2rem] border border-border/50">
              <div className="text-right">
                 <p className="text-2xl font-black text-foreground">{jobs.length}</p>
                 <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Total Jobs</p>
              </div>
              <div className="text-right">
                 <p className="text-2xl font-black text-foreground">{applications.length}</p>
                 <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Global Apps</p>
              </div>
               <div className="text-right">
                  <p className="text-2xl font-black text-foreground">
                    {myApplications.length > 0 
                        ? (avgMatchScore >= 90 ? "Top 1%" : avgMatchScore >= 80 ? "Top 5%" : avgMatchScore >= 70 ? "Top 15%" : "Top 40%")
                        : "N/A"}
                  </p>
                  <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Platform Rank</p>
               </div>
           </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Column 1: User Card & Relevant Sections */}
        <div className="lg:col-span-3 space-y-8">
           <div className="relative group overflow-hidden rounded-[3rem] bg-gradient-to-br from-blue-600 to-primary p-1 shadow-2xl">
              <div className="bg-card/90 backdrop-blur-xl rounded-[2.8rem] p-6 text-center">
                 <div className="relative mx-auto w-40 h-40 mb-6">
                    <div className="absolute inset-0 rounded-[2.5rem] bg-primary/20 animate-pulse scale-110" />
                    <img 
                      src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || "User")}&background=${isHR ? '007bff' : 'ff5722'}&color=fff&size=512`} 
                      alt={user?.name}
                      className="relative z-10 w-full h-full object-cover rounded-[2.2rem] shadow-xl border-4 border-white"
                    />
                    <button 
                      onClick={() => alert("Upload functionality coming soon!")}
                      className="absolute bottom-0 right-0 p-2.5 bg-primary text-white rounded-2xl shadow-xl hover:scale-110 transition-all border-2 border-white"
                    >
                       <Camera className="w-4 h-4" />
                    </button>
                 </div>
                 
                 {isEditing ? (
                   <input 
                    type="text" 
                    value={formData.name} 
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-secondary/50 border border-primary/30 rounded-xl p-2 text-center text-lg font-black outline-none focus:border-primary"
                   />
                 ) : (
                   <h2 className="text-2xl font-black text-foreground tracking-tight mb-1">{formData.name}</h2>
                 )}
                 
                 <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-6">{isHR ? 'Talent Specialist' : 'Candidate'}</p>
                 
                 <div className="flex items-center justify-center gap-2 text-xs font-bold text-muted-foreground">
                    <MapPin className="w-3.5 h-3.5" />
                    {isEditing ? (
                      <input 
                        type="text" 
                        value={formData.location} 
                        onChange={(e) => setFormData({...formData, location: e.target.value})}
                        className="bg-transparent border-b border-muted-foreground/30 text-center outline-none focus:border-primary"
                      />
                    ) : formData.location}
                 </div>
              </div>
           </div>

           <div className="space-y-3">
              <AccordionItem 
                icon={<Award className="w-4 h-4" />} 
                label="Recent Activity" 
                value={candidateSkills.length > 0 ? candidateSkills.join(", ") : "No activity recorded"} 
                sub="Skills Impact" 
                active={activeAccordion === "skills"} 
                onClick={() => setActiveAccordion("skills")}
              />
              <AccordionItem 
                icon={<FileText className="w-4 h-4" />} 
                label="Resumes Uploaded" 
                value={isHR ? "0" : myApplications.length.toString()} 
                active={activeAccordion === "resumes"} 
                onClick={() => setActiveAccordion("resumes")}
              />
              <AccordionItem 
                icon={<Briefcase className="w-4 h-4" />} 
                label="Employment Status" 
                value={myApplications.length > 0 ? "Active" : "N/A"} 
                active={activeAccordion === "employment"} 
                onClick={() => setActiveAccordion("employment")}
              />
           </div>
        </div>

        {/* Column 2: Activity Chart & Recent Actions */}
        <div className="lg:col-span-6 space-y-8">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Progress Chart */}
              <div className="bg-card/40 backdrop-blur-xl rounded-[3rem] border border-border/50 p-8 shadow-xl">
                 <div className="flex items-center justify-between mb-8">
                    <div>
                       <h3 className="text-lg font-black text-foreground">Platform Activity</h3>
                       <p className="text-2xl font-black text-primary">{stats.primary + stats.secondary} <span className="text-[10px] text-muted-foreground font-bold">Total Actions</span></p>
                    </div>
                    <div className="p-2 rounded-xl bg-secondary">
                       <Activity className="w-4 h-4 text-primary" />
                    </div>
                 </div>
                 
                 <div className="flex items-end justify-between h-40 gap-2">
                    {weeklyActivity.map((d, i) => (
                       <div key={`${d.day}-${i}`} className="flex flex-col items-center gap-3 flex-1 group">
                          <div className="relative w-full">
                             <div 
                                className="w-full bg-primary/20 rounded-full transition-all duration-1000 group-hover:bg-primary/40"
                                style={{ height: `120px` }}
                             />
                             <motion.div 
                                initial={{ height: 0 }}
                                animate={{ height: `${d.value}%` }}
                                className="absolute bottom-0 w-full bg-primary rounded-full shadow-lg shadow-primary/20"
                             />
                          </div>
                          <span className="text-[10px] font-black text-muted-foreground">{d.day}</span>
                       </div>
                    ))}
                 </div>
              </div>

              {/* Match Insights */}
              <div className="bg-card/40 backdrop-blur-xl rounded-[3rem] border border-border/50 p-8 shadow-xl text-center flex flex-col justify-between">
                 <div className="flex items-center justify-between mb-8">
                    <h3 className="text-lg font-black text-foreground">Performance</h3>
                    <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                 </div>
                 
                 <div className="space-y-6 text-left">
                    <div className="space-y-2">
                       <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                          <span>Profile Strength</span>
                          <span>{avgMatchScore}%</span>
                       </div>
                       <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                          <div className="h-full bg-primary" style={{ width: `${myApplications.length > 0 ? avgMatchScore : 0}%` }} />
                       </div>
                    </div>
                    <div className="space-y-2">
                       <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                          <span>Skill Accuracy</span>
                          <span>{myApplications.length > 0 ? `${Math.min(100, Math.round(avgMatchScore * 1.1))}%` : "0%"}</span>
                       </div>
                       <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500" style={{ width: myApplications.length > 0 ? `${Math.min(100, Math.round(avgMatchScore * 1.1))}%` : "0%" }} />
                       </div>
                    </div>
                 </div>

                 <button 
                  onClick={() => setShowInsights(true)}
                  className="w-full mt-8 p-4 rounded-2xl bg-secondary text-foreground font-black uppercase tracking-widest text-[10px] hover:bg-primary hover:text-white transition-all shadow-md active:scale-95"
                 >
                    View Breakdown
                 </button>
              </div>
           </div>

           {/* Recent System Logs */}
           <div className="bg-card/40 backdrop-blur-xl rounded-[3rem] border border-border/50 p-8 shadow-xl">
              <div className="flex items-center justify-between mb-8">
                 <h3 className="text-lg font-black text-foreground">Recent Activity Logs</h3>
                 <BarChart3 className="w-4 h-4 text-primary" />
              </div>

              <div className="space-y-4">
                 {myApplications.slice(0, 3).map((app, i) => (
                    <div key={app.id} className="flex items-start gap-8 p-6 bg-secondary/30 rounded-[2rem] border border-border/50 group hover:border-primary/30 transition-all cursor-pointer">
                       <div className="text-right shrink-0">
                          <p className="text-xs font-black text-foreground">System</p>
                          <p className="text-[10px] font-bold text-muted-foreground">Log #{i+1}</p>
                       </div>
                       <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                             <h4 className="text-sm font-black text-foreground">
                                {isHR ? "New Applicant for " : "Applied to "} {app.jobTitle}
                             </h4>
                             <StatusBadge status={app.status} />
                          </div>
                          <p className="text-xs font-medium text-muted-foreground">Transaction recorded at {new Date(app.appliedDate).toLocaleDateString()}</p>
                       </div>
                    </div>
                 ))}
                 {myApplications.length === 0 && (
                   <p className="text-center py-10 text-muted-foreground font-bold italic text-sm">No activity recorded yet.</p>
                 )}
              </div>
           </div>
        </div>

        {/* Column 3: Action Required */}
        <div className="lg:col-span-3 space-y-8">
           {/* Growth Plan Section */}
           <div className="bg-card/40 backdrop-blur-xl rounded-[3rem] border border-border/50 p-8 shadow-xl">
              <div className="flex items-center justify-between mb-6">
                 <h3 className="text-lg font-black text-foreground">Growth Potential</h3>
                 <span className="text-2xl font-black text-foreground">{myApplications.length > 0 ? 100 - avgMatchScore : 0}%</span>
              </div>
              
              <div className="flex h-3 gap-1 rounded-full overflow-hidden bg-secondary mb-6 shadow-inner">
                 <div className="h-full bg-primary" style={{ width: `${myApplications.length > 0 ? avgMatchScore : 0}%` }} />
                 <div className="h-full bg-amber-500" style={{ width: `${myApplications.length > 0 ? Math.max(0, 100 - avgMatchScore) : 0}%` }} />
              </div>

              <div className="space-y-4">
                 <button 
                  onClick={() => setShowGrowthPlan(true)}
                  className="w-full p-4 bg-primary rounded-2xl text-white shadow-lg shadow-primary/20 flex items-center justify-between hover:-translate-y-1 transition-all active:scale-95"
                 >
                    <span className="text-[10px] font-black uppercase tracking-widest">Growth Plan</span>
                    <TrendingUp className="w-4 h-4" />
                 </button>
              </div>
           </div>

           {/* Action Required Checklist */}
           <div className="bg-primary rounded-[3rem] p-8 shadow-2xl shadow-primary/20 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
              
              <div className="relative z-10">
                 <div className="flex items-center justify-between mb-8">
                    <h3 className="text-lg font-black text-white tracking-tight">Action Required</h3>
                    <span className="text-2xl font-black text-white/50">{tasks.filter(t => t.completed).length}/{tasks.length}</span>
                 </div>

                 <div className="space-y-4">
                    {tasks.map(task => (
                       <button 
                        key={task.id} 
                        onClick={() => toggleTask(task.id)}
                        className="w-full flex items-center gap-4 group text-left transition-all active:scale-95"
                       >
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border transition-all ${task.completed ? 'bg-white/20 border-white/30 text-white' : 'bg-white/5 border-white/10 text-white/40'}`}>
                             {task.completed ? <Check className="w-4 h-4" /> : <div className="w-4 h-4" />}
                          </div>
                          <div className="flex-1 min-w-0">
                             <p className={`text-xs font-black truncate ${task.completed ? 'text-white' : 'text-white/60'}`}>{task.title}</p>
                             <p className="text-[10px] font-bold text-white/40">{task.time}</p>
                          </div>
                       </button>
                    ))}
                 </div>
              </div>
           </div>
        </div>
      </div>

      {/* Insights Modal */}
      <AnimatePresence>
        {showInsights && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-8">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowInsights(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-md" 
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-lg bg-card rounded-[3rem] p-10 border border-border/50 shadow-2xl"
            >
              <button onClick={() => setShowInsights(false)} className="absolute top-6 right-6 p-2 rounded-full hover:bg-secondary"><X className="w-5 h-5" /></button>
              <h3 className="text-3xl font-black mb-6">Performance Breakdown</h3>
              <div className="space-y-6">
                {myApplications.length > 0 ? (
                  myApplications.map(app => (
                    <div key={app.id} className="p-4 rounded-2xl bg-secondary/30 border border-border/50">
                       <div className="flex justify-between items-center mb-2">
                          <p className="font-bold text-foreground">{app.jobTitle}</p>
                          <span className="text-primary font-black">{app.score}%</span>
                       </div>
                       <div className="h-1.5 w-full bg-background rounded-full overflow-hidden">
                          <div className="h-full bg-primary" style={{ width: `${app.score}%` }} />
                       </div>
                    </div>
                  ))
                ) : <p className="text-muted-foreground italic">No data to display.</p>}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Growth Plan Modal */}
      <AnimatePresence>
        {showGrowthPlan && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-8">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowGrowthPlan(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-md" 
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-lg bg-primary rounded-[3rem] p-10 shadow-2xl text-white"
            >
              <button onClick={() => setShowGrowthPlan(false)} className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/10"><X className="w-5 h-5" /></button>
              <div className="flex items-center gap-3 mb-8">
                <TrendingUp className="w-8 h-8" />
                <h3 className="text-3xl font-black">Growth Plan</h3>
              </div>
              <p className="text-white/70 mb-8 font-medium">Based on your applications, our AI recommends focusing on the following skill gaps to reach a 100% match score:</p>
              <div className="flex flex-wrap gap-3">
                {missingSkills.length > 0 ? (
                  missingSkills.map(skill => (
                    <span key={skill} className="px-5 py-3 bg-white/10 border border-white/20 rounded-2xl font-black text-sm">{skill}</span>
                  ))
                ) : <p className="italic">No specific skill gaps identified. You are doing great!</p>}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

function StatPill({ label, value, percent, color }: { label: string, value: any, percent: number, color: string }) {
   return (
      <div className="bg-card/40 backdrop-blur-md rounded-[1.5rem] border border-border/50 p-4 shadow-xl flex items-center gap-4">
         <div className="relative w-12 h-12 flex-shrink-0">
            <svg className="w-full h-full transform -rotate-90">
               <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-secondary" />
               <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="4" fill="transparent" strokeDasharray={126} strokeDashoffset={126 - (126 * percent / 100)} className={color.replace('bg-', 'text-')} />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-foreground">
               {Math.round(percent)}%
            </div>
         </div>
         <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground leading-none mb-1">{label}</p>
            <p className="text-lg font-black text-foreground">{value}</p>
         </div>
      </div>
   );
}

function AccordionItem({ icon, label, value, sub, active, onClick }: { icon: React.ReactNode, label: string, value?: string, sub?: string, active?: boolean, onClick: () => void }) {
   return (
      <div 
        onClick={onClick}
        className={`p-5 rounded-3xl border transition-all duration-300 group cursor-pointer ${active ? 'bg-white shadow-xl border-border/50' : 'bg-card/20 border-transparent hover:bg-card/40 hover:border-border/30'}`}
      >
         <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
               <div className={`p-2.5 rounded-xl transition-all ${active ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-secondary text-muted-foreground'}`}>
                  {icon}
               </div>
               <span className={`text-xs font-black tracking-tight ${active ? 'text-foreground' : 'text-muted-foreground'}`}>{label}</span>
            </div>
            <ChevronRight className={`w-4 h-4 transition-transform ${active ? 'rotate-90 text-primary' : 'text-muted-foreground/30'}`} />
         </div>
         <AnimatePresence>
          {active && value && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="mt-6 pl-12 flex items-center justify-between border-l-2 border-primary/20 ml-5">
                   <div>
                      <p className="text-sm font-black text-foreground">{value}</p>
                      <p className="text-[10px] font-bold text-muted-foreground">{sub}</p>
                   </div>
                </div>
              </motion.div>
          )}
         </AnimatePresence>
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
