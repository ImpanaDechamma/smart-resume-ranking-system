"use client";

import { useAuth } from "@/context/AuthContext";
import { FileText, LayoutDashboard, Briefcase, ClipboardList, BarChart3, LogOut } from "lucide-react";

interface NavbarProps {
  page: string;
  setPage: (page: string) => void;
}

export default function Navbar({ page, setPage }: NavbarProps) {
  const { user, logout } = useAuth();
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
          <div className="hidden md:flex flex-col items-end">
            <span className="text-sm font-bold text-foreground leading-none">{user?.name}</span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-primary mt-1">
              {user?.role}
            </span>
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
