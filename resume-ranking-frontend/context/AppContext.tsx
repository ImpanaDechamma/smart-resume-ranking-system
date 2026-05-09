"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { useAuth } from "./AuthContext";

export interface Job {
  id: string;
  title: string;
  company: string;
  description: string;
  skills: string[];
  posted: string;
  applicants: number;
}

export interface Application {
  id: string;
  jobId: string;
  jobTitle: string;
  company: string;
  appliedDate: string;
  status: "pending" | "reviewed" | "shortlisted" | "rejected";
  score: number;
  candidateName: string;
  candidateEmail: string;
  resumeFile?: string;
  candidateSkills?: string[];
  missingSkills?: string[];
}

interface AppContextType {
  jobs: Job[];
  applications: Application[];
  addJob: (job: Omit<Job, "id" | "applicants" | "posted">) => Promise<void>;
  applyToJob: (jobId: string, candidateName: string, candidateEmail: string, resumeFile: File | string) => Promise<void>;
  updateApplicationStatus: (appId: string, status: Application["status"]) => Promise<void>;
  getApplicationsForJob: (jobId: string) => Application[];
  getApplicationsForCandidate: (email: string) => Application[];
  notifications: any[];
  clearNotifications: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const { user } = useAuth();

  // Fetch Jobs on mount
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/jobs");
        if (res.ok) {
          const data = await res.json();
          setJobs(data.map((j: any) => ({
            ...j,
            id: j.id.toString(),
          })));
        }
      } catch (err) {
        console.error("Error fetching jobs:", err);
      }
    };
    fetchJobs();
  }, []);

  // Fetch Applications if user is logged in
  useEffect(() => {
    if (!user) return;

    const fetchApplications = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };

        if (user.role === "candidate") {
          const res = await fetch("http://localhost:5000/api/applications/my", { headers });
          if (res.ok) {
            const data = await res.json();
            setApplications(data.map((app: any) => ({ ...app, candidateEmail: user.email })));
          }
        } else if (user.role === "hr") {
          // Simplification: HR fetches applications for all jobs they created
          // or we can fetch them per job when they click on a job.
          // Since UI expects all applications in state for Dashboard, let's fetch for all jobs.
          let allApps: Application[] = [];
          for (const job of jobs) {
            const res = await fetch(`http://localhost:5000/api/applications/job/${job.id}`, { headers });
            if (res.ok) {
              const data = await res.json();
              allApps = [...allApps, ...data];
            }
          }
          // Remove duplicates if any
          const uniqueApps = Array.from(new Map(allApps.map((a) => [a.id, a])).values());
          setApplications(uniqueApps);
          
          // Generate HR Notifications
          const pendingCount = uniqueApps.filter(a => a.status === 'pending').length;
          if (pendingCount > 0) {
            setNotifications([{
              id: 'hr-notif',
              title: 'New Applications',
              message: `You have ${pendingCount} new candidates waiting for review.`,
              type: 'info'
            }]);
          }
        }
      } catch (err) {
        console.error("Error fetching applications:", err);
      }
    };

    if (jobs.length > 0 || user.role === "candidate") {
      fetchApplications();
    }
  }, [user, jobs]);

  const addJob = async (job: Omit<Job, "id" | "applicants" | "posted">) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/jobs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: job.title,
          company: job.company,
          description: job.description,
          skills: job.skills,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const newJob: Job = {
          ...job,
          id: data.id.toString(),
          applicants: 0,
          posted: new Date().toISOString().split("T")[0],
        };
        setJobs((prev) => [newJob, ...prev]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const applyToJob = async (jobId: string, candidateName: string, candidateEmail: string, resumeFile: File | string) => {
    try {
      const token = localStorage.getItem("token");
      
      const formData = new FormData();
      if (resumeFile instanceof File) {
        formData.append("resume", resumeFile);
      } else {
        console.error("Expected a File object for resume");
        return;
      }

      const res = await fetch(`http://localhost:5000/api/applications/${jobId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        
        const newApp: Application = {
          id: data.applicationId.toString(),
          jobId,
          jobTitle: jobs.find(j => j.id === jobId)?.title || "",
          company: jobs.find(j => j.id === jobId)?.company || "",
          appliedDate: new Date().toISOString().split("T")[0],
          status: "pending",
          score: 0,
          candidateName,
          candidateEmail,
        };

        setApplications((prev) => [...prev, newApp]);
        setJobs((prev) =>
          prev.map((j) =>
            j.id === jobId ? { ...j, applicants: j.applicants + 1 } : j
          )
        );
      } else {
        console.error(await res.json());
      }
    } catch (err) {
      console.error(err);
    }
  };

  const updateApplicationStatus = async (appId: string, status: Application["status"]) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/api/applications/${appId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      if (res.ok) {
        setApplications((prev) =>
          prev.map((app) => (app.id === appId ? { ...app, status } : app))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getApplicationsForJob = (jobId: string) => {
    return applications.filter((app) => app.jobId === jobId);
  };

  const getApplicationsForCandidate = (email: string) => {
    return applications.filter((app) => app.candidateEmail === email);
  };

  return (
    <AppContext.Provider
      value={{
        jobs,
        applications,
        addJob,
        applyToJob,
        updateApplicationStatus,
        getApplicationsForJob,
        getApplicationsForCandidate,
        notifications,
        clearNotifications: () => setNotifications([]),
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
