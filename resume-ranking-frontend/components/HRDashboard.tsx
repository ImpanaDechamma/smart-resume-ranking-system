"use client";

import { useApp } from "@/context/AppContext";
import { Briefcase, Users, Clock, CheckCircle, TrendingUp } from "lucide-react";

interface HRDashboardProps {
  setPage: (page: string) => void;
}

export default function HRDashboard({ setPage }: HRDashboardProps) {
  const { jobs, applications } = useApp();

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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Dashboard</h2>
          <p className="text-sm text-muted-foreground">
            Overview of your recruitment pipeline
          </p>
        </div>
        <button
          onClick={() => setPage("rankings")}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-all hover:bg-primary/90"
        >
          <TrendingUp className="h-4 w-4" />
          View Rankings
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={<Briefcase className="h-5 w-5" />}
          label="Active Jobs"
          value={stats.totalJobs}
          color="primary"
        />
        <StatCard
          icon={<Users className="h-5 w-5" />}
          label="Total Applicants"
          value={stats.totalApplicants}
          color="blue"
        />
        <StatCard
          icon={<Clock className="h-5 w-5" />}
          label="Pending Review"
          value={stats.pendingReview}
          color="amber"
        />
        <StatCard
          icon={<CheckCircle className="h-5 w-5" />}
          label="Shortlisted"
          value={stats.shortlisted}
          color="green"
        />
      </div>

      {/* Dashboard Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Application Status Chart */}
        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="mb-4 text-sm font-semibold text-foreground">
            Application Status
          </h3>
          <div className="space-y-3">
            {Object.entries(statusCounts).map(([status, count]) => (
              <div key={status} className="flex items-center gap-3">
                <span className="w-20 text-xs capitalize text-muted-foreground">
                  {status}
                </span>
                <div className="flex-1 overflow-hidden rounded-full bg-secondary">
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ${getStatusColor(status)}`}
                    style={{ width: `${(count / maxStatusCount) * 100}%` }}
                  />
                </div>
                <span className="w-6 text-right text-xs font-medium text-foreground">
                  {count}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Jobs */}
        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="mb-4 text-sm font-semibold text-foreground">
            Top Jobs by Applicants
          </h3>
          <div className="space-y-3">
            {jobs
              .sort((a, b) => b.applicants - a.applicants)
              .slice(0, 4)
              .map((job) => (
                <div
                  key={job.id}
                  className="flex items-center justify-between rounded-lg bg-secondary/50 p-3"
                >
                  <div>
                    <p className="text-sm font-medium text-foreground">{job.title}</p>
                    <p className="text-xs text-muted-foreground">{job.company}</p>
                  </div>
                  <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                    {job.applicants}
                  </span>
                </div>
              ))}
          </div>
        </div>

        {/* Recent Applications */}
        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="mb-4 text-sm font-semibold text-foreground">
            Recent Applications
          </h3>
          <div className="space-y-3">
            {recentApplications.map((app) => (
              <div
                key={app.id}
                className="flex items-center justify-between border-b border-border pb-3 last:border-0 last:pb-0"
              >
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {app.candidateName}
                  </p>
                  <p className="text-xs text-muted-foreground">{app.jobTitle}</p>
                </div>
                <StatusBadge status={app.status} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
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
    primary: "bg-primary/10 text-primary border-primary/20",
    blue: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    amber: "bg-amber-500/10 text-amber-600 border-amber-500/20",
    green: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  };

  return (
    <div className={`rounded-xl border p-5 ${colorClasses[color]}`}>
      <div className="mb-2 opacity-80">{icon}</div>
      <p className="text-3xl font-bold">{value}</p>
      <p className="mt-1 text-xs uppercase tracking-wider opacity-80">{label}</p>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const statusStyles: Record<string, string> = {
    pending: "bg-amber-500/15 text-amber-600",
    reviewed: "bg-blue-500/15 text-blue-600",
    shortlisted: "bg-emerald-500/15 text-emerald-600",
    rejected: "bg-red-500/15 text-red-600",
  };

  return (
    <span
      className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${statusStyles[status]}`}
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
