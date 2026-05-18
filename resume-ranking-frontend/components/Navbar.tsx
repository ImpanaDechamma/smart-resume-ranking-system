"use client";

import { useAuth } from "@/context/AuthContext";
import { FileText, LayoutDashboard, Briefcase, ClipboardList, BarChart3, LogOut, Bell, Sparkles, CheckCircle, Info, Mail } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { useState } from "react";

interface NavbarProps {
  page: string;
  setPage: (page: string) => void;
}

export default function Navbar({ page, setPage }: NavbarProps) {
  const { user, logout } = useAuth();
  const { notifications, clearNotifications, markNotificationAsRead } = useApp();
  const [showNotifications, setShowNotifications] = useState(false);
  const isHR = user?.role === "hr";

  const unreadCount = Array.isArray(notifications) ? notifications.filter(n => !n.is_read).length : 0;
  const safeNotifications = Array.isArray(notifications) ? notifications : [];

  return (
    <div className="fixed top-8 left-1/2 -translate-x-1/2 z-50 w-full max-w-4xl px-4 pointer-events-none">
      <header className="pointer-events-auto bg-white/70 backdrop-blur-3xl border border-white/20 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.05)] flex items-center justify-between px-8 py-3.5 transition-all duration-500">
        
        {/* Brand */}
        <div className="flex items-center gap-6">
          <button
            onClick={() => setPage(isHR ? "dashboard" : "jobs")}
            className="flex items-center gap-3 group"
          >
            <div className="flex items-center justify-center w-9 h-9 rounded-2xl bg-primary shadow-lg shadow-primary/20">
              <FileText className="h-4 w-4 text-white" />
            </div>
            <span className="text-xl font-black tracking-tight text-foreground">
              ResumeRank
            </span>
          </button>
          
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/50 border border-border/50">
            <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">
              Sim
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-2">
          {isHR ? (
            <>
              <NavButton active={page === "dashboard"} onClick={() => setPage("dashboard")} label="Stats" />
              <NavButton active={page === "jobs"} onClick={() => setPage("jobs")} label="Benchmarks" />
              <NavButton active={page === "rankings"} onClick={() => setPage("rankings")} label="Rankings" />
            </>
          ) : (
            <>
              <NavButton active={page === "jobs"} onClick={() => setPage("jobs")} label="Explore" />
              <NavButton active={page === "my-applications"} onClick={() => setPage("my-applications")} label="Applications" />
            </>
          )}
        </nav>

        {/* User Actions */}
        <div className="flex items-center gap-3">
          {/* Notification Bell */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className={`relative flex items-center justify-center w-12 h-12 rounded-2xl transition-all ${
                unreadCount > 0 
                ? "bg-primary text-white shadow-lg shadow-primary/30" 
                : "bg-secondary/50 text-muted-foreground hover:bg-white hover:text-primary"
              }`}
            >
              <Bell className={`h-5 w-5 ${unreadCount > 0 ? 'animate-bounce' : ''}`} />
              {unreadCount > 0 && (
                <span className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-[10px] font-black text-white border-4 border-white shadow-xl">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute top-12 right-0 w-96 bg-white/95 backdrop-blur-2xl border border-border/50 rounded-[2rem] shadow-2xl z-[70] p-6 animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between mb-6">
                  <h4 className="text-sm font-black text-foreground uppercase tracking-widest">Notifications</h4>
                  <button 
                    onClick={clearNotifications}
                    className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline"
                  >
                    Clear all
                  </button>
                </div>
                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                  {safeNotifications.length > 0 ? (
                    safeNotifications.map((n) => (
                      <div 
                        key={n.id || Math.random().toString()} 
                        onMouseEnter={() => !n.is_read && markNotificationAsRead(n.id)}
                        className={`p-5 rounded-[2rem] border transition-all relative overflow-hidden group ${
                          !n.is_read 
                          ? "bg-white border-primary shadow-xl ring-4 ring-primary/5" 
                          : "bg-secondary/10 border-transparent opacity-60"
                        }`}
                      >
                        <div className="flex items-start gap-4">
                           <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                             n.type === 'status_update' ? 'bg-emerald-500/10 text-emerald-600' :
                             n.type === 'application_submitted' ? 'bg-primary/10 text-primary' :
                             'bg-violet-500/10 text-violet-600'
                           }`}>
                              {n.type === 'status_update' ? <CheckCircle className="w-5 h-5" /> :
                               n.type === 'application_submitted' ? <Mail className="w-5 h-5" /> :
                               <Sparkles className="w-5 h-5" />}
                           </div>
                           
                           <div className="flex-1">
                              <div className="flex justify-between items-start mb-2">
                                <div className="flex flex-col">
                                   {!n.is_read && (
                                     <span className="inline-flex items-center w-fit px-1.5 py-0.5 rounded-full bg-red-600 text-[8px] font-black text-white uppercase tracking-widest mb-1">New</span>
                                   )}
                                   <p className={`text-[12px] font-black leading-tight ${!n.is_read ? 'text-foreground' : 'text-muted-foreground'}`}>
                                     {n.title || (n.type === 'status_update' ? 'Status Update' : 'Career Alert')}
                                   </p>
                                </div>
                                <span className="text-[9px] font-bold text-muted-foreground/60 whitespace-nowrap ml-4">
                                  {n.created_at ? new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                                </span>
                              </div>
                              <p className={`text-[11px] font-medium leading-relaxed ${!n.is_read ? 'text-muted-foreground' : 'text-muted-foreground/50'}`}>
                                {n.message}
                              </p>
                           </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <p className="text-[10px] font-bold text-muted-foreground italic">Inbox is empty</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="h-6 w-[1px] bg-border/50 mx-1" />

          <button
            onClick={() => setPage("profile")}
            className={`flex items-center gap-3 p-1 pr-4 rounded-2xl transition-all ${page === 'profile' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'hover:bg-secondary/50'}`}
          >
            <div className="h-8 w-8 rounded-xl overflow-hidden border-2 border-white shadow-sm">
              <img 
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || "U")}&background=${isHR ? '007bff' : 'ff5722'}&color=fff`} 
                alt="Profile" 
                className="h-full w-full object-cover"
              />
            </div>
            <span className="text-xs font-black uppercase tracking-widest hidden lg:inline">Profile</span>
          </button>

          <button
            onClick={logout}
            className="flex items-center justify-center w-10 h-10 rounded-2xl bg-secondary/50 text-muted-foreground hover:bg-destructive hover:text-white hover:shadow-lg hover:shadow-destructive/30 transition-all group"
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
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 ${
        active
          ? "bg-primary/10 text-primary"
          : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
      }`}
    >
      {label}
    </button>
  );
}
