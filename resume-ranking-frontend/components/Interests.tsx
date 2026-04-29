"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Sparkles, ChevronRight, Check, FileText } from "lucide-react";

const interestCategories = [
  {
    name: "Development",
    emoji: "💻",
    color: "from-blue-500/20 to-blue-600/10 border-blue-200",
    activeColor: "bg-blue-500 text-white border-blue-500",
    options: ["Frontend", "Backend", "Full Stack", "Mobile", "DevOps", "Data Engineering"],
  },
  {
    name: "Technologies",
    emoji: "⚡",
    color: "from-purple-500/20 to-purple-600/10 border-purple-200",
    activeColor: "bg-purple-500 text-white border-purple-500",
    options: ["React", "TypeScript", "Python", "Node.js", "AWS", "Kubernetes", "GraphQL"],
  },
  {
    name: "Industries",
    emoji: "🏢",
    color: "from-emerald-500/20 to-emerald-600/10 border-emerald-200",
    activeColor: "bg-emerald-500 text-white border-emerald-500",
    options: ["Fintech", "Healthcare", "E-commerce", "SaaS", "AI/ML", "Gaming", "Education"],
  },
  {
    name: "Work Style",
    emoji: "🌍",
    color: "from-amber-500/20 to-amber-600/10 border-amber-200",
    activeColor: "bg-amber-500 text-white border-amber-500",
    options: ["Remote", "Hybrid", "On-site", "Startup", "Enterprise", "Freelance"],
  },
];

export default function Interests() {
  const { completeOnboarding } = useAuth();
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const toggleInterest = (interest: string) => {
    const newSelected = new Set(selected);
    if (newSelected.has(interest)) {
      newSelected.delete(interest);
    } else {
      newSelected.add(interest);
    }
    setSelected(newSelected);
  };

  const progress = Math.min((selected.size / 5) * 100, 100);

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <div className="border-b border-border bg-card/80 backdrop-blur-md px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <FileText className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-semibold text-foreground">ResumeRank</span>
        </div>
        <button
          onClick={completeOnboarding}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Skip for now →
        </button>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-6">
            <Sparkles className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-3">
            What are you interested in?
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Pick your interests and we'll tailor job recommendations just for you.
            Select as many as you like.
          </p>

          {/* Progress bar */}
          <div className="mt-8 max-w-xs mx-auto">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">
                {selected.size} selected
              </span>
              <span className="text-sm text-muted-foreground">
                {selected.size >= 5 ? "Great choice! 🎉" : `Pick ${Math.max(0, 5 - selected.size)} more`}
              </span>
            </div>
            <div className="h-2 w-full rounded-full bg-secondary overflow-hidden">
              <div
                className="h-full rounded-full bg-primary transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Interest Categories */}
        <div className="space-y-10">
          {interestCategories.map((category) => (
            <div key={category.name}>
              <div className="flex items-center gap-3 mb-5">
                <span className="text-2xl">{category.emoji}</span>
                <h2 className="text-xl font-semibold text-foreground">{category.name}</h2>
                <div className="flex-1 h-px bg-border" />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {category.options.map((option) => {
                  const isSelected = selected.has(option);
                  return (
                    <button
                      key={option}
                      onClick={() => toggleInterest(option)}
                      className={`relative flex items-center justify-between gap-2 rounded-xl border-2 px-5 py-4 text-sm font-medium transition-all duration-200 hover:scale-105 active:scale-95 ${
                        isSelected
                          ? "border-primary bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                          : "border-border bg-card text-foreground hover:border-primary/50 hover:bg-secondary/50"
                      }`}
                    >
                      <span>{option}</span>
                      {isSelected && (
                        <Check className="h-4 w-4 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Footer CTA */}
        <div className="mt-14 flex flex-col items-center gap-4">
          <button
            onClick={completeOnboarding}
            className="flex items-center gap-3 rounded-2xl bg-primary px-10 py-4 text-base font-semibold text-primary-foreground hover:bg-primary/90 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-primary/20"
          >
            {selected.size > 0 ? `Continue with ${selected.size} interests` : "Continue"}
            <ChevronRight className="h-5 w-5" />
          </button>
          <p className="text-sm text-muted-foreground">
            You can always update your preferences later in settings
          </p>
        </div>
      </div>
    </div>
  );
}
