"use client";

import { useState } from "react";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { FileText, Mail, Lock, User, Briefcase, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LoginProps {
  onBack?: () => void;
  defaultMode?: "login" | "register";
}

export default function Login({ onBack, defaultMode = "login" }: LoginProps) {
  const [isLogin, setIsLogin] = useState(defaultMode === "login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState<"candidate" | "hr">("candidate");
  const [error, setError] = useState("");
  const { login, register } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (isLogin) {
      const success = login(email, password);
      if (!success) {
        setError("Invalid email or password");
      }
    } else {
      if (!name.trim()) {
        setError("Please enter your name");
        return;
      }
      const success = register(email, password, name, role);
      if (!success) {
        setError("Email already exists");
      }
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left side - Image */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        <Image
          src="/images/hero-bg.jpg"
          alt="Professional team collaboration"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-foreground/60" />
        <div className="absolute inset-0 flex flex-col justify-center p-16 text-card">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-card flex items-center justify-center">
              <FileText className="w-6 h-6 text-foreground" />
            </div>
            <span className="text-2xl font-bold">ResumeRank</span>
          </div>
          <h2 className="text-4xl font-bold mb-4 leading-tight">
            Find the Perfect Candidates
            <br />
            with AI-Powered Ranking
          </h2>
          <p className="text-card/80 text-lg max-w-md">
            Transform your hiring process with intelligent resume screening and
            unbiased candidate matching.
          </p>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex-1 flex items-center justify-center bg-background px-6 py-12">
        <div className="w-full max-w-md">
          {onBack && (
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to home
            </button>
          )}

          {/* Mobile Logo */}
          <div className="lg:hidden mb-8 flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
              <FileText className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">ResumeRank</span>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              {isLogin ? "Welcome back" : "Create your account"}
            </h1>
            <p className="text-muted-foreground">
              {isLogin
                ? "Sign in to access your dashboard"
                : "Get started with ResumeRank today"}
            </p>
          </div>

          {/* Tab Toggle */}
          <div className="mb-8 flex rounded-xl bg-secondary p-1">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 rounded-lg py-3 text-sm font-medium transition-all ${
                isLogin
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 rounded-lg py-3 text-sm font-medium transition-all ${
                !isLogin
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Register
            </button>
          </div>

          {error && (
            <div className="mb-6 rounded-xl bg-destructive/10 border border-destructive/20 p-4 text-sm text-destructive">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full rounded-xl border border-border bg-card py-3.5 pl-12 pr-4 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-border bg-card py-3.5 pl-12 pr-4 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full rounded-xl border border-border bg-card py-3.5 pl-12 pr-4 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>
            </div>

            {!isLogin && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  I am a...
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setRole("candidate")}
                    className={`flex flex-col items-center justify-center gap-2 rounded-xl border-2 py-5 transition-all ${
                      role === "candidate"
                        ? "border-primary bg-primary/5 text-foreground"
                        : "border-border bg-card text-muted-foreground hover:border-primary/50"
                    }`}
                  >
                    <User className={`h-6 w-6 ${role === "candidate" ? "text-primary" : ""}`} />
                    <span className="font-medium">Candidate</span>
                    <span className="text-xs text-muted-foreground">Looking for jobs</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole("hr")}
                    className={`flex flex-col items-center justify-center gap-2 rounded-xl border-2 py-5 transition-all ${
                      role === "hr"
                        ? "border-primary bg-primary/5 text-foreground"
                        : "border-border bg-card text-muted-foreground hover:border-primary/50"
                    }`}
                  >
                    <Briefcase className={`h-6 w-6 ${role === "hr" ? "text-primary" : ""}`} />
                    <span className="font-medium">HR Manager</span>
                    <span className="text-xs text-muted-foreground">Hiring talent</span>
                  </button>
                </div>
              </div>
            )}

            <Button
              type="submit"
              className="w-full rounded-xl bg-primary py-6 text-base font-semibold text-primary-foreground hover:bg-primary/90 transition-all"
            >
              {isLogin ? "Sign In" : "Create Account"}
            </Button>
          </form>

          {/* Demo accounts hint */}
          <div className="mt-8 rounded-xl bg-secondary/70 border border-border p-5">
            <p className="mb-3 text-sm font-semibold text-foreground">
              Demo Accounts
            </p>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>
                <span className="font-medium text-foreground">HR Manager:</span>{" "}
                hr@company.com / hr123
              </p>
              <p>
                <span className="font-medium text-foreground">Candidate:</span>{" "}
                candidate@email.com / cand123
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
