import React, { useState } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { AppProvider } from "./context/AppContext";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import HRDashboard from "./pages/HRDashboard";
import Jobs from "./pages/Jobs";
import Apply from "./pages/Apply";
import MyApplications from "./pages/MyApplications";
import Rankings from "./pages/Rankings";
import Interests from "./pages/Interests";
import "./App.css";

function AppContent() {
  const { user, justRegistered } = useAuth();
  const isHR = user?.role === "hr";
  const [page, setPage] = useState(isHR ? "dashboard" : "jobs");
  const [applyJob, setApplyJob] = useState(null);

  if (!user) return <Login />;
  if (justRegistered && !isHR) return <Interests />;

  return (
    <div className="app">
      <Navbar page={page} setPage={setPage} />
      <main className="main-content">
        {isHR && page === "dashboard" && <HRDashboard setPage={setPage} />}
        {page === "jobs" && <Jobs setPage={setPage} setApplyJob={setApplyJob} />}
        {!isHR && page === "apply" && <Apply job={applyJob} setPage={setPage} />}
        {!isHR && page === "my-applications" && <MyApplications setPage={setPage} />}
        {isHR && page === "rankings" && <Rankings />}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </AuthProvider>
  );
}
