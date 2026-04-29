"use client";

import { useApp } from "@/context/AppContext";
import { useAuth } from "@/context/AuthContext";
import { Briefcase, Users, Clock, CheckCircle, TrendingUp, Sparkles, Activity, FileText } from "lucide-react";

interface HRDashboardProps {
  setPage: (page: string) => void;
}

export default function HRDashboard({ setPage }: HRDashboardProps) {
  const { jobs, applications } = useApp();
  const { user } = useAuth();

  const stats = {
    totalJobs: jobs.length,
    totalApplicants: applications.length,
    pendingReview: applications.filter((a) => a.status === "pending").length,
    shortlisted: applications.filter((a) => a.status === "shortlisted").length,
  };

  const statusCounts = {
    pending: applications.filter((a) => a.status === "pending").length,
    reviewed: applications.filter((a) => a.status === "reviewed").length,
    shortlisted: applications.filter((a) => a.status === "shortlisted").length,
    rejected: applications.filter((a) => a.status === "rejected").length,
  };

  const maxStatusCount = Math.max(...Object.values(statusCounts), 1);

  const recentApplications = [...applications]
    .sort((a, b) => new Date(b.appliedDate).getTime() - new Date(a.appliedDate).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-card/40 backdrop-blur-xl border border-border/50 rounded-3xl p-6 md:p-8 shadow-xl shadow-primary/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-gradient-to-bl from-primary/20 to-transparent rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        
        <div className="relative z-10 flex items-center gap-5">
          <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center shadow-lg shadow-primary/30">
            <Sparkles className="h-8 w-8 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight text-foreground">Welcome back, {user?.name?.split(' ')[0] || 'HR'}</h2>
            <p className="text-lg font-medium text-muted-foreground mt-1">
              Here is what's happening with your recruitment pipeline today.
            </p>
          </div>
        </div>

        <button
          onClick={() => setPage("rankings")}
          className="relative z-10 flex items-center gap-2 rounded-xl bg-primary px-6 py-3 font-semibold text-primary-foreground shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all hover:-translate-y-0.5"
        >
          <TrendingUp className="h-5 w-5" />
          View Rankings
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (Main Stats) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Stats Grid 2x2 */}
          <div className="grid grid-cols-2 gap-4 sm:gap-6">
            <StatWidget
              icon={<Briefcase className="h-6 w-6" />}
              label="Active Jobs"
              value={stats.totalJobs}
              color="primary"
            />
            <StatWidget
              icon={<Users className="h-6 w-6" />}
              label="Total Applicants"
              value={stats.totalApplicants}
              color="blue"
            />
            <StatWidget
              icon={<Clock className="h-6 w-6" />}
              label="Pending Review"
              value={stats.pendingReview}
              color="amber"
            />
            <StatWidget
              icon={<CheckCircle className="h-6 w-6" />}
              label="Shortlisted"
              value={stats.shortlisted}
              color="green"
            />
          </div>

          {/* Application Pipeline */}
          <div className="rounded-3xl border border-border/50 bg-card/60 backdrop-blur-xl p-8 shadow-xl shadow-black/5 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
            
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
                <Activity className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-foreground">
                Application Pipeline
              </h3>
            </div>
            
            <div className="space-y-6">
              {Object.entries(statusCounts).map(([status, count]) => (
                <div key={status} className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                      {status}
                    </span>
                    <span className="text-lg font-extrabold text-foreground">
                      {count}
                    </span>
                  </div>
                  <div className="h-3 w-full overflow-hidden rounded-full bg-secondary/50 shadow-inner">
                    <div
                      className={`h-full rounded-full transition-all duration-1000 ease-out shadow-sm ${getStatusColor(status)}`}
                      style={{ width: `${(count / maxStatusCount) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (Sidebar) */}
        <div className="space-y-8">
          
          {/* Top Performing Jobs */}
          <div className="rounded-3xl border border-border/50 bg-card/60 backdrop-blur-xl p-6 shadow-xl shadow-black/5">
            <h3 className="mb-6 text-lg font-bold text-foreground flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-500" />
              Hot Jobs
            </h3>
            <div className="space-y-4">
              {jobs
                .sort((a, b) => b.applicants - a.applicants)
                .slice(0, 3)
                .map((job, idx) => (
                  <div
                    key={job.id}
                    className="group relative overflow-hidden rounded-2xl border border-border/50 bg-background/50 p-4 transition-all hover:border-primary/30 hover:bg-card hover:shadow-md"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-bold text-foreground group-hover:text-primary transition-colors">{job.title}</p>
                        <p className="text-xs font-medium text-muted-foreground mt-1">{job.company}</p>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="rounded-lg bg-primary/10 px-2.5 py-1 text-xs font-extrabold text-primary">
                          {job.applicants} apps
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Activity Feed */}
          <div className="rounded-3xl border border-border/50 bg-card/60 backdrop-blur-xl p-6 shadow-xl shadow-black/5 flex-1">
            <h3 className="mb-6 text-lg font-bold text-foreground flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-500" />
              Recent Activity
            </h3>
            <div className="space-y-0 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
              {recentApplications.map((app, i) => (
                <div key={app.id} className="relative flex items-start justify-between gap-4 py-4 group">
                  <div className="absolute left-5 -translate-x-1/2 w-3 h-3 rounded-full border-2 border-background bg-primary shadow-sm group-hover:scale-150 transition-transform" />
                  
                  <div className="ml-10 flex-1">
                    <p className="text-sm font-bold text-foreground leading-none">
                      {app.candidateName}
                    </p>
                    <p className="text-xs font-medium text-muted-foreground mt-1 mb-2 line-clamp-1">
                      Applied for <span className="text-foreground">{app.jobTitle}</span>
                    </p>
                    <StatusBadge status={app.status} />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

function StatWidget({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  color: "primary" | "blue" | "amber" | "green";
}) {
  const colorClasses = {
    primary: "from-primary/20 to-primary/5 text-primary border-primary/20",
    blue: "from-blue-500/20 to-blue-500/5 text-blue-600 border-blue-500/20",
    amber: "from-amber-500/20 to-amber-500/5 text-amber-600 border-amber-500/20",
    green: "from-emerald-500/20 to-emerald-500/5 text-emerald-600 border-emerald-500/20",
  };

  const bgIcons = {
    primary: "text-primary",
    blue: "text-blue-500",
    amber: "text-amber-500",
    green: "text-emerald-500",
  }

  return (
    <div className={`relative overflow-hidden rounded-3xl border bg-gradient-to-br p-6 shadow-xl shadow-black/5 backdrop-blur-xl transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl group ${colorClasses[color]}`}>
      <div className={`absolute -right-6 -bottom-6 opacity-10 scale-[2.5] transform -rotate-12 transition-transform duration-700 group-hover:scale-[3] group-hover:rotate-0 ${bgIcons[color]}`}>
        {icon}
      </div>
      
      <div className="relative z-10">
        <div className="mb-4 inline-flex p-3 bg-background/80 rounded-2xl backdrop-blur-md shadow-sm">
          {icon}
        </div>
        <div className="flex flex-col-reverse">
          <p className="text-sm font-extrabold uppercase tracking-widest opacity-80 mt-1">{label}</p>
          <p className="text-5xl font-extrabold tracking-tighter">{value}</p>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const statusStyles: Record<string, string> = {
    pending: "bg-amber-500/15 text-amber-600 border-amber-500/20",
    reviewed: "bg-blue-500/15 text-blue-600 border-blue-500/20",
    shortlisted: "bg-emerald-500/15 text-emerald-600 border-emerald-500/20",
    rejected: "bg-red-500/15 text-red-600 border-red-500/20",
  };

  return (
    <span
      className={`inline-flex items-center rounded-lg border px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-widest ${statusStyles[status]}`}
    >
      {status}
    </span>
  );
}

function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    pending: "bg-amber-500",
    reviewed: "bg-blue-500",
    shortlisted: "bg-emerald-500",
    rejected: "bg-red-500",
  };
  return colors[status] || "bg-muted-foreground";
}
