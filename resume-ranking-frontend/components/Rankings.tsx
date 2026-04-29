"use client";

import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { Trophy, Mail, FileText } from "lucide-react";

export default function Rankings() {
  const { jobs, getApplicationsForJob, updateApplicationStatus } = useApp();
  const [selectedJobId, setSelectedJobId] = useState(jobs[0]?.id || "");

  const applications = getApplicationsForJob(selectedJobId)
    .sort((a, b) => b.score - a.score);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Candidate Rankings</h2>
          <p className="text-sm text-muted-foreground">
            AI-powered resume scoring and ranking
          </p>
        </div>
        <select
          value={selectedJobId}
          onChange={(e) => setSelectedJobId(e.target.value)}
          className="rounded-xl border border-border bg-card px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        >
          {jobs.map((job) => (
            <option key={job.id} value={job.id}>
              {job.title} - {job.company}
            </option>
          ))}
        </select>
      </div>

      {applications.length === 0 ? (
        <div className="flex min-h-[40vh] flex-col items-center justify-center text-center">
          <FileText className="mb-4 h-16 w-16 text-muted-foreground/30" />
          <p className="text-lg text-muted-foreground">No applications yet</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Candidates will appear here once they apply
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-border bg-card">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-secondary/50">
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Rank
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Candidate
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Score
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Applied
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app, index) => (
                <tr
                  key={app.id}
                  className={`border-b border-border transition-colors hover:bg-secondary/30 ${
                    index === 0 ? "bg-amber-50" : ""
                  }`}
                >
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      {index === 0 && (
                        <Trophy className="h-4 w-4 text-amber-500" />
                      )}
                      <span
                        className={`rounded-lg px-2 py-1 text-sm font-bold ${
                          index === 0
                            ? "bg-amber-100 text-amber-700"
                            : index === 1
                            ? "bg-gray-100 text-gray-700"
                            : index === 2
                            ? "bg-orange-100 text-orange-700"
                            : "text-muted-foreground"
                        }`}
                      >
                        #{index + 1}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div>
                      <p className="font-medium text-foreground">
                        {app.candidateName}
                      </p>
                      <div className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                        <Mail className="h-3 w-3" />
                        {app.candidateEmail}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-20 overflow-hidden rounded-full bg-secondary">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${getScoreColor(app.score)}`}
                          style={{ width: `${app.score}%` }}
                        />
                      </div>
                      <span className="text-sm font-semibold text-foreground">
                        {app.score}%
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm text-muted-foreground">
                    {new Date(app.appliedDate).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-4">
                    <select
                      value={app.status}
                      onChange={(e) =>
                        updateApplicationStatus(
                          app.id,
                          e.target.value as typeof app.status
                        )
                      }
                      className={`rounded-lg border px-2 py-1 text-xs font-medium transition-all focus:outline-none focus:ring-2 focus:ring-primary/20 ${getStatusSelectStyles(app.status)}`}
                    >
                      <option value="pending">Pending</option>
                      <option value="reviewed">Reviewed</option>
                      <option value="shortlisted">Shortlisted</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
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
    pending: "border-amber-300 bg-amber-50 text-amber-700",
    reviewed: "border-blue-300 bg-blue-50 text-blue-700",
    shortlisted: "border-emerald-300 bg-emerald-50 text-emerald-700",
    rejected: "border-red-300 bg-red-50 text-red-700",
  };
  return styles[status] || "";
}
