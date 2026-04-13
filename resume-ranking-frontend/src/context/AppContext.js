import React, { createContext, useContext, useState } from "react";
import { mockJobs, mockApplications } from "../data/mockData";

const AppContext = createContext();

export function AppProvider({ children }) {
  const [jobs, setJobs] = useState(mockJobs);
  const [applications, setApplications] = useState(mockApplications);

  const addJob = (job) => {
    const newJob = { ...job, id: Date.now(), postedDate: new Date().toISOString().split("T")[0] };
    setJobs((prev) => [...prev, newJob]);
  };

  const applyToJob = (application) => {
    const score = computeScore(application.skills, jobs.find((j) => j.id === application.jobId)?.skills || []);
    const newApp = { ...application, id: Date.now(), score, status: "Applied", appliedDate: new Date().toISOString().split("T")[0] };
    setApplications((prev) => [...prev, newApp]);
  };

  const computeScore = (candidateSkills, jobSkills) => {
    if (!jobSkills.length) return Math.floor(Math.random() * 30) + 60;
    const matched = candidateSkills.filter((s) =>
      jobSkills.some((js) => js.toLowerCase() === s.toLowerCase())
    ).length;
    const base = Math.round((matched / jobSkills.length) * 60);
    const bonus = Math.floor(Math.random() * 20) + 20;
    return Math.min(base + bonus, 100);
  };

  const getApplicationsByJob = (jobId) =>
    applications.filter((a) => a.jobId === jobId).sort((a, b) => b.score - a.score);

  const getApplicationsByCandidate = (candidateId) =>
    applications.filter((a) => a.candidateId === candidateId);

  const updateStatus = (appId, status) =>
    setApplications((prev) => prev.map((a) => a.id === appId ? { ...a, status } : a));

  return (
    <AppContext.Provider value={{ jobs, applications, addJob, applyToJob, getApplicationsByJob, getApplicationsByCandidate, updateStatus }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
