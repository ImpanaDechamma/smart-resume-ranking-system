"use client";

import { useAuth } from "@/context/AuthContext";
import { 
  LayoutDashboard, Briefcase, BarChart3, User, LogOut, 
  Settings, HelpCircle, ChevronRight, Sparkles, FileText,
  ClipboardList
} from "lucide-react";
import { motion } from "framer-motion";

interface SidebarProps {
  page: string;
  setPage: (page: string) => void;
}

export default function Sidebar({ page, setPage }: SidebarProps) {
  const { user, logout } = useAuth();
  const isHR = user?.role === "hr";

  const menuItems = isHR ? [
    { id: "dashboard", icon: <LayoutDashboard />, label: "Overview" },
    { id: "jobs", icon: <Briefcase />, label: "Benchmarks" },
    { id: "rankings", icon: <BarChart3 />, label: "Analytics" },
  ] : [
    { id: "dashboard", icon: <LayoutDashboard />, label: "Home" },
    { id: "jobs", icon: <Sparkles />, label: "Explore" },
    { id: "my-applications", icon: <ClipboardList />, label: "Tracker" },
  ];

  return (
    <div className="fixed left-6 top-1/2 -translate-y-1/2 z-[100] group">
      <div className="bg-white/70 backdrop-blur-3xl border border-white/20 rounded-[2.5rem] p-3 shadow-2xl shadow-black/5 flex flex-col items-center gap-4 transition-all duration-500 hover:p-4">
        
        {/* Brand/Logo */}
        <div className="w-12 h-12 rounded-[1.5rem] bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/20 mb-4">
           <FileText className="w-6 h-6" />
        </div>

        {/* Navigation */}
        <div className="space-y-3">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setPage(item.id)}
              className={`relative flex items-center justify-center w-12 h-12 rounded-2xl transition-all group/item ${
                page === item.id 
                ? "bg-primary text-white shadow-xl shadow-primary/20" 
                : "text-muted-foreground hover:bg-secondary/80 hover:text-primary"
              }`}
            >
              {item.icon}
              
              {/* Tooltip */}
              <div className="absolute left-16 px-4 py-2 bg-white/90 backdrop-blur-xl border border-border/50 rounded-xl shadow-xl opacity-0 translate-x-[-10px] pointer-events-none group-hover/item:opacity-100 group-hover/item:translate-x-0 transition-all text-[10px] font-black uppercase tracking-widest text-foreground whitespace-nowrap">
                {item.label}
              </div>
            </button>
          ))}
        </div>

        <div className="w-8 h-[1px] bg-border/30 my-4" />

        {/* Bottom Actions */}
        <div className="space-y-3">
           <button 
             onClick={() => setPage("profile")}
             className={`flex items-center justify-center w-12 h-12 rounded-2xl transition-all ${page === "profile" ? "bg-primary text-white shadow-lg" : "text-muted-foreground hover:bg-secondary/80"}`}
           >
              <User className="w-5 h-5" />
           </button>
           <button 
             onClick={logout}
             className="flex items-center justify-center w-12 h-12 rounded-2xl text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all"
           >
              <LogOut className="w-5 h-5" />
           </button>
        </div>

      </div>
    </div>
  );
}
