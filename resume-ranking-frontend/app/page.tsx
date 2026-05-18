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
import Sidebar from "@/components/Sidebar";
import Profile from "@/components/Profile";
import CandidateDashboard from "@/components/CandidateDashboard";
import AddJobModal from "@/components/AddJobModal";

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
    <div className="min-h-screen bg-[#FDFDFF]">
      <Sidebar page={page} setPage={setPage} />
      
      <div className="pl-28 pr-8 pb-12 transition-all duration-500">
        <Navbar page={page} setPage={setPage} />
        
        <main className="pt-28 relative z-10 mx-auto max-w-[1600px]">
          {page === "profile" && <Profile onBack={() => setPage(isHR ? "dashboard" : "dashboard")} />}
          {isHR && page === "dashboard" && <HRDashboard setPage={setPage} setAutoOpenAddModal={setAutoOpenAddModal} />}
          {!isHR && page === "dashboard" && <CandidateDashboard setPage={setPage} />}
          {page === "jobs" && <Jobs setPage={setPage} setApplyJob={setApplyJob} setRankingJobId={setRankingJobId} setAutoOpenAddModal={setAutoOpenAddModal} />}
          {!isHR && page === "apply" && <Apply job={applyJob} setPage={setPage} />}
          {!isHR && page === "my-applications" && <MyApplications setPage={setPage} />}
          {isHR && page === "rankings" && <Rankings initialJobId={rankingJobId} />}
        </main>

      </div>

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
