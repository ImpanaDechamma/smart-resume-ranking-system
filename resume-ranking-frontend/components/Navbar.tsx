"use client";

import { useAuth } from "@/context/AuthContext";
import { FileText, LayoutDashboard, Briefcase, ClipboardList, BarChart3, LogOut, Bell } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { useState } from "react";

interface NavbarProps {
  page: string;
  setPage: (page: string) => void;
}

export default function Navbar({ page, setPage }: NavbarProps) {
  const { user, logout } = useAuth();
  const { notifications, clearNotifications } = useApp();
  const [showNotifications, setShowNotifications] = useState(false);
  const isHR = user?.role === "hr";

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-5xl px-4 pointer-events-none">
      <header className="pointer-events-auto bg-background/60 backdrop-blur-2xl border border-white/10 dark:border-white/5 rounded-full shadow-2xl shadow-black/10 flex items-center justify-between px-6 py-3 transition-all duration-500 hover:bg-background/80 hover:shadow-primary/20">
        
        {/* Logo */}
        <button
          onClick={() => setPage(isHR ? "dashboard" : "jobs")}
          className="flex items-center gap-2 group transition-transform hover:scale-105"
        >
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-blue-500 shadow-md">
            <FileText className="h-4 w-4 text-white" />
          </div>
          <span className="text-lg font-bold tracking-tight text-foreground group-hover:text-primary transition-colors hidden sm:block">
            ResumeRank
          </span>
        </button>

        {/* Navigation Links */}
        <nav className="flex items-center gap-1 bg-secondary/30 rounded-full p-1 border border-border/50">
          {isHR && (
            <>
              <NavButton
                active={page === "dashboard"}
                onClick={() => setPage("dashboard")}
                icon={<LayoutDashboard className="h-4 w-4" />}
                label="Dashboard"
              />
              <NavButton
                active={page === "jobs"}
                onClick={() => setPage("jobs")}
                icon={<Briefcase className="h-4 w-4" />}
                label="Jobs"
              />
              <NavButton
                active={page === "rankings"}
                onClick={() => setPage("rankings")}
                icon={<BarChart3 className="h-4 w-4" />}
                label="Rankings"
              />
            </>
          )}
          {!isHR && (
            <>
              <NavButton
                active={page === "jobs"}
                onClick={() => setPage("jobs")}
                icon={<Briefcase className="h-4 w-4" />}
                label="Browse Jobs"
              />
              <NavButton
                active={page === "my-applications"}
                onClick={() => setPage("my-applications")}
                icon={<ClipboardList className="h-4 w-4" />}
                label="My Applications"
              />
            </>
          )}
        </nav>

        {/* User Actions */}
        <div className="flex items-center gap-4">
          {/* Notification Bell */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className={`flex items-center justify-center w-10 h-10 rounded-full transition-all ${
                notifications.length > 0 
                ? "bg-primary/10 text-primary animate-pulse" 
                : "bg-secondary/50 text-muted-foreground hover:bg-secondary"
              }`}
            >
              <Bell className="h-4 w-4" />
              {notifications.length > 0 && (
                <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 border-2 border-background rounded-full" />
              )}
            </button>

            {showNotifications && (
              <div className="absolute top-12 right-0 w-80 bg-card/90 backdrop-blur-2xl border border-border/50 rounded-2xl shadow-2xl z-[70] p-4 animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-sm font-bold text-foreground">Notifications</h4>
                  <button 
                    onClick={clearNotifications}
                    className="text-[10px] font-bold uppercase tracking-widest text-primary hover:underline"
                  >
                    Clear all
                  </button>
                </div>
                <div className="space-y-3">
                  {notifications.length > 0 ? (
                    notifications.map((n) => (
                      <div key={n.id} className="p-3 rounded-xl bg-secondary/30 border border-border/50">
                        <p className="text-xs font-bold text-foreground">{n.title}</p>
                        <p className="text-[11px] text-muted-foreground mt-1">{n.message}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-center text-muted-foreground py-4">No new notifications</p>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="h-8 w-[1px] bg-border/50 hidden md:block" />
          <button
            onClick={logout}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-secondary/50 text-muted-foreground hover:bg-destructive hover:text-white hover:shadow-lg hover:shadow-destructive/30 transition-all group"
            title="Logout"
          >
            <LogOut className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </header>
    </div>
  );
}

function NavButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-all duration-300 ${
        active
          ? "bg-primary text-white shadow-md shadow-primary/30 scale-100"
          : "text-muted-foreground hover:bg-background/80 hover:text-foreground scale-95 hover:scale-100"
      }`}
    >
      {icon}
      <span className="hidden lg:inline">{label}</span>
    </button>
  );
}
