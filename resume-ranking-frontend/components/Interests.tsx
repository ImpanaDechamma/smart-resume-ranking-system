"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Sparkles, ChevronRight, Check, Code2, Cpu, Building2, Briefcase } from "lucide-react";
import { motion } from "framer-motion";

const interestCategories = [
  {
    name: "Development",
    icon: <Code2 className="w-5 h-5 text-white" />,
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80",
    options: ["Frontend", "Backend", "Full Stack", "Mobile", "DevOps", "Data Engineering"],
    color: "bg-blue-600",
  },
  {
    name: "Technologies",
    icon: <Cpu className="w-5 h-5 text-white" />,
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
    options: ["React", "TypeScript", "Python", "Node.js", "AWS", "Kubernetes", "GraphQL"],
    color: "bg-purple-600",
  },
  {
    name: "Industries",
    icon: <Building2 className="w-5 h-5 text-white" />,
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80",
    options: ["Fintech", "Healthcare", "E-commerce", "SaaS", "AI/ML", "Gaming", "Education"],
    color: "bg-emerald-600",
  },
  {
    name: "Work Style",
    icon: <Briefcase className="w-5 h-5 text-white" />,
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=600&q=80",
    options: ["Remote", "Hybrid", "On-site", "Startup", "Enterprise", "Freelance"],
    color: "bg-amber-600",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

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
    <div className="relative min-h-screen bg-background overflow-hidden selection:bg-primary/30 font-sans">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-primary/10 rounded-full blur-[120px] mix-blend-screen animate-pulse pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-purple-500/10 rounded-full blur-[150px] mix-blend-screen pointer-events-none" />
      
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-16 flex flex-col min-h-screen pb-40">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center justify-center h-20 w-20 rounded-3xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 mb-8 shadow-2xl shadow-primary/20 backdrop-blur-xl">
            <Sparkles className="h-10 w-10 text-primary animate-pulse" />
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-foreground mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
            Personalize Your Experience
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-medium leading-relaxed">
            Select your professional interests to help us tailor your dashboard and deliver the most relevant opportunities.
          </p>
        </motion.div>

        {/* Categories Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid md:grid-cols-2 gap-8 mb-16 flex-1"
        >
          {interestCategories.map((category) => (
            <motion.div 
              variants={itemVariants}
              key={category.name} 
              className="relative overflow-hidden bg-card/80 backdrop-blur-2xl border border-border/50 rounded-[2rem] shadow-xl hover:shadow-2xl transition-all duration-500 group flex flex-col"
            >
              {/* Image Header Area */}
              <div className="relative h-48 w-full overflow-hidden">
                {/* Gradient overlay to smoothly blend image with card background */}
                <div className="absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent z-10" />
                <img 
                  src={category.image} 
                  alt={category.name} 
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 group-hover:rotate-1 transition-all duration-700 opacity-80" 
                />
                
                {/* Header Title over image */}
                <div className="absolute top-6 left-6 z-20 flex items-center gap-4">
                  <div className={`p-3 ${category.color} rounded-2xl shadow-lg ring-4 ring-background/20`}>
                    {category.icon}
                  </div>
                  <h3 className="text-2xl font-black text-white drop-shadow-md tracking-tight">
                    {category.name}
                  </h3>
                </div>
              </div>
              
              {/* Content Area */}
              <div className="relative z-20 p-6 pt-2 flex-1 flex flex-col">
                <div className="flex flex-wrap gap-3 mt-auto">
                  {category.options.map((option) => {
                    const isSelected = selected.has(option);
                    return (
                      <button
                        key={option}
                        onClick={() => toggleInterest(option)}
                        className={`relative overflow-hidden rounded-2xl px-5 py-3 text-sm font-bold transition-all duration-300 transform hover:scale-105 active:scale-95 ${
                          isSelected
                            ? "bg-primary text-white shadow-xl shadow-primary/30 border-transparent ring-2 ring-primary ring-offset-2 ring-offset-card"
                            : "bg-background/80 text-foreground border border-border hover:bg-secondary hover:text-foreground"
                        }`}
                      >
                        <div className="flex items-center gap-2 relative z-10">
                          {isSelected && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ type: "spring", stiffness: 500, damping: 30 }}
                            >
                              <Check className="w-4 h-4" />
                            </motion.div>
                          )}
                          {option}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

      </div>

      {/* Sticky Footer Area */}
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, type: "spring", stiffness: 200, damping: 20 }}
        className="fixed bottom-8 left-0 right-0 px-6 z-50 flex justify-center pointer-events-none"
      >
        <div className="bg-card/90 backdrop-blur-2xl border border-border/50 rounded-[2rem] p-4 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-6 w-full max-w-4xl pointer-events-auto">
          <div className="flex flex-col px-4">
            <span className="text-xl font-black text-foreground tracking-tight">
              <span className="text-primary">{selected.size}</span> {selected.size === 1 ? 'interest' : 'interests'} selected
            </span>
            <span className="text-sm font-medium text-muted-foreground">
              You can adjust these preferences anytime later.
            </span>
          </div>
          
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <button
              onClick={handleSkip}
              className="flex-1 sm:flex-none px-6 py-4 rounded-2xl font-bold text-muted-foreground hover:bg-secondary hover:text-foreground transition-all duration-300"
            >
              Skip for now
            </button>
            <button
              onClick={handleContinue}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 rounded-2xl bg-primary px-10 py-4 font-black text-white hover:bg-primary/90 shadow-xl shadow-primary/30 hover:shadow-primary/50 hover:-translate-y-1 transition-all duration-300"
            >
              Continue
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
