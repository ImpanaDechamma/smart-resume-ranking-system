"use client";

import { useApp } from "@/context/AppContext";
import { useAuth } from "@/context/AuthContext";
import { Building2, Calendar, FileText, ArrowRight } from "lucide-react";

interface MyApplicationsProps {
  setPage: (page: string) => void;
}

export default function MyApplications({ setPage }: MyApplicationsProps) {
  const { getApplicationsForCandidate } = useApp();
  const { user } = useAuth();

  const applications = user ? getApplicationsForCandidate(user.email) : [];

  if (applications.length === 0) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
        <FileText className="mb-4 h-16 w-16 text-muted-foreground/30" />
        <p className="text-lg text-muted-foreground">No applications yet</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Start applying to jobs to see them here
        </p>
        <button
          onClick={() => setPage("jobs")}
          className="mt-4 flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Browse Jobs
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">My Applications</h2>
        <p className="text-sm text-muted-foreground">
          Track the status of your job applications
        </p>
      </div>

      <div className="space-y-4">
        {applications.map((app) => (
          <div
            key={app.id}
            className="rounded-xl border border-border bg-card p-5 transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-foreground">{app.jobTitle}</h3>
                <div className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                  <Building2 className="h-3.5 w-3.5" />
                  {app.company}
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <StatusBadge status={app.status} />
                {app.score > 0 && (
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-16 overflow-hidden rounded-full bg-secondary">
                      <div
                        className="h-full rounded-full bg-primary transition-all"
                        style={{ width: `${app.score}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium text-muted-foreground">
                      {app.score}%
                    </span>
                  </div>
                )}
              </div>
            </div>
            <div className="mt-4 flex items-center gap-1 text-xs text-muted-foreground">
              <Calendar className="h-3.5 w-3.5" />
              Applied on {new Date(app.appliedDate).toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const statusStyles: Record<string, string> = {
    pending: "bg-amber-100 text-amber-700",
    reviewed: "bg-blue-100 text-blue-700",
    shortlisted: "bg-emerald-100 text-emerald-700",
    rejected: "bg-red-100 text-red-700",
  };

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider ${statusStyles[status]}`}
    >
      {status}
    </span>
  );
}
