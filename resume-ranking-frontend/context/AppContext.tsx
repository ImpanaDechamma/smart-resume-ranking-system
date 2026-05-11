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
  logo?: string;
  banner?: string;
  is_benchmark?: boolean;
  created_by?: string;  // HR user ID who posted this job
}

export interface Application {
  id: string;
  jobId: string;
  jobTitle: string;
  company: string;
  appliedDate: string;
  appliedAt?: string;
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
  addJob: (job: Omit<Job, "id" | "applicants" | "posted"> & { logoFile?: File, bannerFile?: File }) => Promise<void>;
  editJob: (jobId: string, updates: { title: string; description: string; skills: string[] }) => Promise<void>;
  deleteJob: (jobId: string) => Promise<void>;
  applyToJob: (jobId: string, candidateName: string, candidateEmail: string, resumeFile: File | string) => Promise<void>;
  updateApplicationStatus: (appId: string, status: Application["status"]) => Promise<void>;
  getApplicationsForJob: (jobId: string) => Application[];
  getApplicationsForCandidate: (email: string) => Application[];
  notifications: any[];
  clearNotifications: () => Promise<void>;
  refreshNotifications: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const { user } = useAuth();

  // ── Fetch real notifications from DB ──────────────────────────────────
  const fetchNotifications = async () => {
    if (!user) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/notifications/my", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setNotifications(data);
      }
    } catch (err) {
      console.error("Error fetching notifications:", err);
    }
  };


  // Fetch Jobs on mount
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/jobs");
        if (res.ok) {
          const data = await res.json();
          setJobs(data.map((j: any) => ({
            ...j,
            id: j.id?.toString() || j._id?.toString() || "",
            skills: Array.isArray(j.skills) ? j.skills : (j.mandatory_skills || []),
            created_by: j.created_by || "",
          })));
        }
      } catch (err) {
        console.error("Error fetching jobs:", err);
      }
    };
    fetchJobs();
  }, []);

  // Fetch notifications when user logs in
  useEffect(() => {
    if (user) fetchNotifications();
    else setNotifications([]);
  }, [user]);

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
        }
      } catch (err) {
        console.error("Error fetching applications:", err);
      }
    };

    if (jobs.length > 0 || user.role === "candidate") {
      fetchApplications();
    }
  }, [user, jobs]);

  const addJob = async (job: Omit<Job, "id" | "applicants" | "posted"> & { logoFile?: File, bannerFile?: File, is_benchmark?: boolean }) => {
    try {
      const token = localStorage.getItem("token");
      
      const formData = new FormData();
      formData.append("title", job.title);
      formData.append("company", job.company);
      formData.append("description", job.description);
      formData.append("skills", job.skills.join(","));
      formData.append("is_benchmark", job.is_benchmark ? "true" : "false");
      
      if (job.logoFile) {
        formData.append("logo", job.logoFile);
      } else if (job.logo) {
        formData.append("logo", job.logo);
      }

      if (job.bannerFile) {
        formData.append("banner", job.bannerFile);
      } else if (job.banner) {
        formData.append("banner", job.banner);
      }

      const res = await fetch("http://localhost:5000/api/jobs", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (res.ok) {
        // Refresh jobs list from server so the new job appears immediately
        const r = await fetch("http://localhost:5000/api/jobs");
        if (r.ok) {
          const d = await r.json();
          setJobs(d.map((j: any) => ({ 
            ...j, 
            id: j.id?.toString() || j._id?.toString() || "",
            skills: Array.isArray(j.skills) ? j.skills : (j.mandatory_skills || []),
          })));
        }
      } else {
        const errData = await res.json().catch(() => ({}));
        console.error("Failed to create job:", errData.error || res.status);
        alert(`Failed to create job: ${errData.error || "Server error"}`);
      }
    } catch (err) {
      console.error(err);
      alert("Network error — could not connect to backend.");
    }
  };

  const editJob = async (jobId: string, updates: { title: string; description: string; skills: string[] }) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/api/jobs/${jobId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: updates.title,
          description: updates.description,
          skills: updates.skills.join(","),
        }),
      });
      if (res.ok) {
        const r = await fetch("http://localhost:5000/api/jobs");
        if (r.ok) {
          const d = await r.json();
          setJobs(d.map((j: any) => ({
            ...j,
            id: j.id?.toString() || j._id?.toString() || "",
            skills: Array.isArray(j.skills) ? j.skills : (j.mandatory_skills || []),
            created_by: j.created_by || "",
          })));
        }
      } else {
        const err = await res.json().catch(() => ({}));
        alert(`Failed to update job: ${err.error || "Server error"}`);
      }
    } catch (err) {
      console.error(err);
      alert("Network error — could not connect to backend.");
    }
  };

  const deleteJob = async (jobId: string) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/api/jobs/${jobId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setJobs((prev) => prev.filter((j) => j.id !== jobId));
      } else {
        const err = await res.json().catch(() => ({}));
        alert(`Failed to delete job: ${err.error || "Server error"}`);
      }
    } catch (err) {
      console.error(err);
      alert("Network error — could not connect to backend.");
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
          id: (data.applicationId || data.id || "").toString(),
          jobId,
          jobTitle: jobs.find(j => j.id === jobId)?.title || "",
          company: jobs.find(j => j.id === jobId)?.company || "",
          appliedDate: new Date().toISOString().split("T")[0],
          appliedAt: new Date().toISOString(),
          status: data.status || "pending",
          score: data.score || 0,
          candidateName,
          candidateEmail,
        };

        setApplications((prev) => [...prev, newApp]);
        setJobs((prev) =>
          prev.map((j) =>
            j.id === jobId ? { ...j, applicants: (j.applicants || 0) + 1 } : j
          )
        );
        fetchNotifications();
        return data;
      } else {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to screen resume");
      }
    } catch (err) {
      console.error(err);
      throw err;
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
        fetchNotifications();
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

  const clearNotifications = async () => {
    try {
      const token = localStorage.getItem("token");
      await fetch("http://localhost:5000/api/notifications/clear", {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications([]);
    } catch (err) {
      console.error("Error clearing notifications:", err);
    }
  };

  return (
    <AppContext.Provider
      value={{
        jobs,
        applications,
        addJob,
        editJob,
        deleteJob,
        applyToJob,
        updateApplicationStatus,
        getApplicationsForJob,
        getApplicationsForCandidate,
        notifications,
        clearNotifications,
        refreshNotifications: fetchNotifications,
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
