"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

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
}

interface AppContextType {
  jobs: Job[];
  applications: Application[];
  addJob: (job: Omit<Job, "id" | "applicants" | "posted">) => void;
  applyToJob: (jobId: string, candidateName: string, candidateEmail: string, resumeFile: string) => void;
  updateApplicationStatus: (appId: string, status: Application["status"]) => void;
  getApplicationsForJob: (jobId: string) => Application[];
  getApplicationsForCandidate: (email: string) => Application[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const initialJobs: Job[] = [
  {
    id: "1",
    title: "Senior Frontend Developer",
    company: "TechCorp Inc.",
    description: "We are looking for an experienced frontend developer with strong React skills to join our growing team.",
    skills: ["React", "TypeScript", "CSS", "Node.js"],
    posted: "2024-01-15",
    applicants: 24,
  },
  {
    id: "2",
    title: "Full Stack Engineer",
    company: "StartupXYZ",
    description: "Join our fast-paced startup as a full stack engineer working on cutting-edge technology.",
    skills: ["Python", "Django", "React", "PostgreSQL"],
    posted: "2024-01-18",
    applicants: 18,
  },
  {
    id: "3",
    title: "DevOps Engineer",
    company: "CloudSystems",
    description: "Looking for a DevOps engineer to help us scale our infrastructure and improve deployment processes.",
    skills: ["AWS", "Docker", "Kubernetes", "CI/CD"],
    posted: "2024-01-20",
    applicants: 12,
  },
  {
    id: "4",
    title: "UI/UX Designer",
    company: "DesignHub",
    description: "Creative UI/UX designer needed to craft beautiful and intuitive user experiences.",
    skills: ["Figma", "Adobe XD", "User Research", "Prototyping"],
    posted: "2024-01-22",
    applicants: 31,
  },
];

const initialApplications: Application[] = [
  {
    id: "app1",
    jobId: "1",
    jobTitle: "Senior Frontend Developer",
    company: "TechCorp Inc.",
    appliedDate: "2024-01-16",
    status: "shortlisted",
    score: 92,
    candidateName: "Alice Chen",
    candidateEmail: "alice@email.com",
  },
  {
    id: "app2",
    jobId: "1",
    jobTitle: "Senior Frontend Developer",
    company: "TechCorp Inc.",
    appliedDate: "2024-01-17",
    status: "reviewed",
    score: 85,
    candidateName: "Bob Wilson",
    candidateEmail: "bob@email.com",
  },
  {
    id: "app3",
    jobId: "2",
    jobTitle: "Full Stack Engineer",
    company: "StartupXYZ",
    appliedDate: "2024-01-19",
    status: "pending",
    score: 78,
    candidateName: "Carol Davis",
    candidateEmail: "carol@email.com",
  },
];

export function AppProvider({ children }: { children: ReactNode }) {
  const [jobs, setJobs] = useState<Job[]>(initialJobs);
  const [applications, setApplications] = useState<Application[]>(initialApplications);

  const addJob = (job: Omit<Job, "id" | "applicants" | "posted">) => {
    const newJob: Job = {
      ...job,
      id: Date.now().toString(),
      applicants: 0,
      posted: new Date().toISOString().split("T")[0],
    };
    setJobs((prev) => [...prev, newJob]);
  };

  const applyToJob = (jobId: string, candidateName: string, candidateEmail: string, resumeFile: string) => {
    const job = jobs.find((j) => j.id === jobId);
    if (!job) return;

    const newApplication: Application = {
      id: `app${Date.now()}`,
      jobId,
      jobTitle: job.title,
      company: job.company,
      appliedDate: new Date().toISOString().split("T")[0],
      status: "pending",
      score: Math.floor(Math.random() * 30) + 70,
      candidateName,
      candidateEmail,
      resumeFile,
    };

    setApplications((prev) => [...prev, newApplication]);
    setJobs((prev) =>
      prev.map((j) =>
        j.id === jobId ? { ...j, applicants: j.applicants + 1 } : j
      )
    );
  };

  const updateApplicationStatus = (appId: string, status: Application["status"]) => {
    setApplications((prev) =>
      prev.map((app) => (app.id === appId ? { ...app, status } : app))
    );
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
