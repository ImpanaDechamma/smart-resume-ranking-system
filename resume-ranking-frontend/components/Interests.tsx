"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Sparkles, ChevronRight, Check } from "lucide-react";

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
    <div className="relative min-h-screen bg-background overflow-hidden selection:bg-primary/30">
      {/* Background Orbs */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] mix-blend-screen animate-pulse pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[150px] mix-blend-screen pointer-events-none" />
      
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-16 flex flex-col min-h-screen">
        
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 mb-6 shadow-xl shadow-primary/10">
            <Sparkles className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-foreground mb-4 tracking-tight">
            Personalize Your Experience
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-medium">
            Select your professional interests to help us deliver the most relevant job recommendations.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-16 flex-1">
          {interestCategories.map((category) => (
            <div 
              key={category.name} 
              className="bg-card/40 backdrop-blur-xl border border-border/50 rounded-3xl p-8 shadow-xl shadow-primary/5 hover:border-primary/30 transition-colors duration-500"
            >
              <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                {category.name}
              </h3>
              <div className="flex flex-wrap gap-3">
                {category.options.map((option) => {
                  const isSelected = selected.has(option);
                  return (
                    <button
                      key={option}
                      onClick={() => toggleInterest(option)}
                      className={`relative group overflow-hidden rounded-xl px-5 py-3 text-sm font-semibold transition-all duration-300 transform hover:-translate-y-0.5 ${
                        isSelected
                          ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30 border-transparent"
                          : "bg-secondary/50 text-muted-foreground border border-border/50 hover:bg-secondary hover:text-foreground hover:border-border"
                      }`}
                    >
                      {/* Inner Glow for unselected hover */}
                      {!isSelected && (
                        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                      )}
                      
                      <div className="flex items-center gap-2 relative z-10">
                        {isSelected && <Check className="w-4 h-4" />}
                        {option}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Sticky Footer Area */}
        <div className="sticky bottom-8 bg-card/80 backdrop-blur-xl border border-border/50 rounded-3xl p-6 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4 mt-auto">
          <div className="flex flex-col">
            <span className="text-lg font-bold text-foreground">
              {selected.size} {selected.size === 1 ? 'interest' : 'interests'} selected
            </span>
            <span className="text-sm text-muted-foreground">
              You can adjust these preferences anytime later.
            </span>
          </div>
          
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <button
              onClick={handleSkip}
              className="flex-1 sm:flex-none px-6 py-3 rounded-xl border border-border/50 font-semibold text-muted-foreground hover:bg-secondary hover:text-foreground transition-all duration-300"
            >
              Skip for now
            </button>
            <button
              onClick={handleContinue}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 rounded-xl bg-primary px-8 py-3 font-semibold text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all duration-300"
            >
              Continue
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
