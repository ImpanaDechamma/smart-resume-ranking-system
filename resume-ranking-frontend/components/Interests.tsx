"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Sparkles, ChevronRight } from "lucide-react";

const interestCategories = [
  {
    name: "Development",
    options: ["Frontend", "Backend", "Full Stack", "Mobile", "DevOps", "Data Engineering"],
  },
  {
    name: "Technologies",
    options: ["React", "TypeScript", "Python", "Node.js", "AWS", "Kubernetes", "GraphQL"],
  },
  {
    name: "Industries",
    options: ["Fintech", "Healthcare", "E-commerce", "SaaS", "AI/ML", "Gaming", "Education"],
  },
  {
    name: "Work Style",
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

  const handleContinue = () => {
    completeOnboarding();
  };

  const handleSkip = () => {
    completeOnboarding();
  };

  return (
    <div className="flex min-h-screen items-start justify-center bg-background px-4 py-12">
      <div className="w-full max-w-2xl">
        <div className="rounded-2xl border border-border bg-card shadow-xl">
          {/* Header */}
          <div className="border-b border-border p-6">
            <div className="mb-2 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                <Sparkles className="h-4 w-4 text-primary" />
              </div>
              <h2 className="text-xl font-bold text-foreground">
                Personalize Your Experience
              </h2>
            </div>
            <p className="text-sm text-muted-foreground">
              Select your interests to get better job recommendations. You can always change these later.
            </p>
          </div>

          {/* Interest Groups */}
          <div className="max-h-[55vh] space-y-6 overflow-y-auto p-6">
            {interestCategories.map((category) => (
              <div key={category.name}>
                <h3 className="mb-3 text-sm font-semibold text-foreground">
                  {category.name}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {category.options.map((option) => (
                    <button
                      key={option}
                      onClick={() => toggleInterest(option)}
                      className={`rounded-full border px-4 py-2 text-sm font-medium transition-all ${
                        selected.has(option)
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-background text-muted-foreground hover:border-primary/50 hover:text-foreground"
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between border-t border-border p-4">
            <span className="text-sm text-primary font-medium">
              {selected.size} selected
            </span>
            <div className="flex gap-3">
              <button
                onClick={handleSkip}
                className="rounded-xl border border-border px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground transition-all"
              >
                Skip for now
              </button>
              <button
                onClick={handleContinue}
                className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-all"
              >
                Continue
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
