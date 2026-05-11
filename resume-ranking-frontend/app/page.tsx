"use client";

import { useState, useEffect } from "react";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { AppProvider, useApp } from "@/context/AppContext";
import { Job } from "@/context/AppContext";
import LandingPage from "@/components/LandingPage";
import Navbar from "@/components/Navbar";
import Login from "@/components/Login";
import HRDashboard from "@/components/HRDashboard";
import Jobs from "@/components/Jobs";
import Apply from "@/components/Apply";
import MyApplications from "@/components/MyApplications";
import Rankings from "@/components/Rankings";
import Interests from "@/components/Interests";
import { AddJobModal } from "@/components/Jobs";

function AppContent() {
  const { user, justRegistered } = useAuth();
  const { addJob } = useApp();
  const isHR = user?.role === "hr";
  const [page, setPage] = useState(isHR ? "dashboard" : "jobs");
  const [applyJob, setApplyJob] = useState<Job | null>(null);
  const [rankingJobId, setRankingJobId] = useState<string>("");
  const [showAuth, setShowAuth] = useState<"login" | "register" | null>(null);
  const [autoOpenAddModal, setAutoOpenAddModal] = useState(false);

  
  useEffect(() => {
    if (user) {
      setPage(isHR ? "dashboard" : "jobs");
    }
  }, [user, isHR]);

  if (!user && !showAuth) {
    return (
      <LandingPage
        onGetStarted={() => setShowAuth("register")}
        onLogin={() => setShowAuth("login")}
      />
    );
  }

  if (!user) {
    return <Login onBack={() => setShowAuth(null)} defaultMode={showAuth || "login"} />;
  }

  if (justRegistered && !isHR) return <Interests />;

  return (
    <div className="min-h-screen bg-background">
      <Navbar page={page} setPage={setPage} />
      <main className="mx-auto max-w-7xl px-4 pt-32 pb-12 sm:px-6 lg:px-8 relative z-10">
        {isHR && page === "dashboard" && <HRDashboard setPage={setPage} setAutoOpenAddModal={setAutoOpenAddModal} />}
        {page === "jobs" && <Jobs setPage={setPage} setApplyJob={setApplyJob} setRankingJobId={setRankingJobId} setAutoOpenAddModal={setAutoOpenAddModal} />}
        {!isHR && page === "apply" && <Apply job={applyJob} setPage={setPage} />}
        {!isHR && page === "my-applications" && <MyApplications setPage={setPage} />}
        {isHR && page === "rankings" && <Rankings initialJobId={rankingJobId} />}
      </main>

      {/* Global Add Job Modal - Renders outside the main content to avoid z-index/navbar issues */}
      {autoOpenAddModal && isHR && (
        <AddJobModal 
          onClose={() => setAutoOpenAddModal(false)} 
          onAdd={addJob} 
        />
      )}
    </div>
  );
}

export default function Page() {
  return (
    <AuthProvider>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </AuthProvider>
  );
}
