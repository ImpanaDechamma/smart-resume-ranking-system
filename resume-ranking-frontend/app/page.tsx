"use client";

import { useState } from "react";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { AppProvider } from "@/context/AppContext";
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

function AppContent() {
  const { user, justRegistered } = useAuth();
  const isHR = user?.role === "hr";
  const [page, setPage] = useState<string | null>(null);
  const [applyJob, setApplyJob] = useState<Job | null>(null);
  const [showAuth, setShowAuth] = useState<"login" | "register" | null>(null);

  // Determine effective page based on role when page not yet set
  const effectivePage = page ?? (isHR ? "dashboard" : "jobs");

  if (!user && !showAuth) {
    return (
      <LandingPage
        onGetStarted={() => setShowAuth("register")}
        onLogin={() => setShowAuth("login")}
      />
    );
  }

  if (!user) {
    return (
      <Login
        onBack={() => setShowAuth(null)}
        defaultMode={showAuth || "login"}
        onLoginSuccess={(role) => setPage(role === "hr" ? "dashboard" : "jobs")}
      />
    );
  }

  if (justRegistered && !isHR) return <Interests />;

  return (
    <div className="min-h-screen bg-background">
      <Navbar page={effectivePage} setPage={setPage} />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {effectivePage === "dashboard" && isHR && <HRDashboard setPage={setPage} />}
        {effectivePage === "jobs" && <Jobs setPage={setPage} setApplyJob={setApplyJob} />}
        {effectivePage === "apply" && !isHR && <Apply job={applyJob} setPage={setPage} />}
        {effectivePage === "my-applications" && !isHR && <MyApplications setPage={setPage} />}
        {effectivePage === "rankings" && isHR && <Rankings />}
      </main>
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
