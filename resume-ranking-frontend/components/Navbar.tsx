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
    <header className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => setPage(isHR ? "dashboard" : "jobs")}
          className="flex items-center gap-2 text-lg font-bold tracking-tight text-foreground transition-colors hover:text-primary"
        >
          <FileText className="h-6 w-6 text-primary" />
          <span>ResumeRank</span>
        </button>

        <nav className="flex items-center gap-1">
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

        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-2 sm:flex">
            <span className="text-sm text-muted-foreground">{user?.name}</span>
            <span className="rounded-full bg-primary/20 px-2 py-0.5 text-xs font-medium capitalize text-primary">
              {user?.role}
            </span>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
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
      className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
        active
          ? "bg-primary text-primary-foreground"
          : "text-muted-foreground hover:bg-secondary hover:text-foreground"
      }`}
    >
      {icon}
      <span className="hidden md:inline">{label}</span>
    </button>
  );
}
