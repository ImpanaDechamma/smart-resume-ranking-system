"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  FileText,
  ArrowRight,
  Sparkles,
  ChevronRight,
  TrendingUp,
  Zap,
  Shield,
  Search,
  Check
} from "lucide-react";

interface LandingPageProps {
  onGetStarted: () => void;
  onLogin: () => void;
}

export default function LandingPage({ onGetStarted, onLogin }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-[#FBF9F1] text-[#2D3250] selection:bg-[#92C7CF]/30 selection:text-[#2D3250]">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-8 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2 group cursor-pointer">
          <div className="w-10 h-10 rounded-xl bg-[#92C7CF] flex items-center justify-center shadow-lg shadow-[#92C7CF]/20">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-black tracking-tighter">ResumeRank</span>
        </div>
        
        <div className="hidden md:flex items-center gap-12 text-[13px] font-black uppercase tracking-[0.2em] text-[#2D3250]">
          <a href="#features" className="hover:text-[#92C7CF] transition-colors">Simulation</a>
          <a href="#active" className="hover:text-[#92C7CF] transition-colors">Jobs</a>
          <a href="#about" className="hover:text-[#92C7CF] transition-colors">Vision</a>
        </div>

        <div className="flex items-center gap-6">
          <button onClick={onLogin} className="text-xs font-black uppercase tracking-widest hover:text-[#92C7CF] transition-colors">Sign In</button>
          <button 
            onClick={onGetStarted}
            className="bg-[#2D3250] text-white px-8 py-3 rounded-full text-xs font-black uppercase tracking-widest hover:bg-[#92C7CF] transition-all hover:scale-105 active:scale-95"
          >
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center pt-20 px-8 overflow-hidden">
        {/* Full Screen Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/hero-bg.png"
            alt="Hero Background"
            fill
            className="object-cover"
            priority
          />
          {/* Dark Overlay for Text Clarity */}
          <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <div className="flex justify-center mb-8">
              <span className="px-6 py-2 rounded-full bg-[#92C7CF]/20 border border-[#92C7CF]/30 text-[#92C7CF] text-[10px] font-black uppercase tracking-[0.4em] backdrop-blur-md">
                Next-Gen AI Screening
              </span>
            </div>
            
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.85] mb-8 text-white">
              Smart AI <br />
              <span className="text-[#92C7CF]">Resume Ranking.</span>
            </h1>
            
            <p className="text-xl md:text-2xl font-medium max-w-3xl mx-auto mb-12 text-white/80 leading-relaxed">
              Instantly score resumes against industry standards. 
              The intelligent bridge between top talent and world-class companies.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <button 
                onClick={onGetStarted}
                className="group bg-[#92C7CF] text-[#2D3250] px-12 py-6 rounded-full text-sm font-black uppercase tracking-[0.2em] hover:bg-white transition-all shadow-2xl shadow-[#92C7CF]/20 hover:-translate-y-1"
              >
                Analyze Your Resume
              </button>
              <button 
                onClick={onLogin}
                className="text-sm font-black uppercase tracking-[0.2em] text-white/60 hover:text-white transition-colors"
              >
                Recruiter Portal
              </button>
            </div>
          </motion.div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 animate-bounce opacity-40">
           <div className="w-6 h-10 rounded-full border-2 border-white flex justify-center p-1">
              <div className="w-1 h-2 bg-white rounded-full" />
           </div>
        </div>
      </section>

      {/* Alternating Sections - Feature 1 */}
      <section id="features" className="py-32 px-8 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="order-2 md:order-1"
          >
            <p className="text-[10px] font-black uppercase tracking-[0.4em] mb-6 opacity-40">Precision Screening</p>
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter leading-tight mb-8">
              Analyze your profile <br />
              against the best.
            </h2>
            <p className="text-lg font-medium opacity-50 mb-10 leading-relaxed">
              Compare your skills against benchmarks from Google, Microsoft, and Amazon. 
              Our AI provides deep insights into your strengths and gaps.
            </p>
            <div className="flex items-center gap-8">
              <button onClick={onGetStarted} className="bg-[#2D3250] text-white px-8 py-4 rounded-full text-[11px] font-black uppercase tracking-widest hover:bg-[#92C7CF] transition-all">Explore Benchmarks</button>
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest opacity-40">
                <Shield className="w-4 h-4" /> 100% Unbiased
              </div>
            </div>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="relative aspect-square rounded-[3rem] overflow-hidden bg-[#AAD7D9]/20 shadow-2xl order-1 md:order-2"
          >
            <Image
              src="/feature-1.png"
              alt="Feature One"
              fill
              className="object-cover p-12 transition-transform duration-1000 hover:scale-105"
            />
          </motion.div>
        </div>
      </section>

      {/* Feature 2 */}
      <section className="py-32 px-8 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-20 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="relative aspect-square rounded-[3rem] overflow-hidden bg-[#92C7CF]/10 shadow-2xl"
          >
            <Image
              src="/feature-2.png"
              alt="Feature Two"
              fill
              className="object-cover p-12 transition-transform duration-1000 hover:scale-105"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-[10px] font-black uppercase tracking-[0.4em] mb-6 opacity-40">Active Hiring</p>
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter leading-tight mb-8">
              Direct connection to <br />
              premium startups.
            </h2>
            <p className="text-lg font-medium opacity-50 mb-10 leading-relaxed">
              Don't just simulate—apply. Connect with top startups and 
              let our ranking system highlight your unique capabilities to their HR teams.
            </p>
            <button 
               onClick={onGetStarted}
               className="flex items-center gap-4 text-xs font-black uppercase tracking-widest hover:text-[#92C7CF] group transition-colors"
            >
              Browse Openings <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* Centered Features Section */}
      <section id="about" className="py-40 bg-[#AAD7D9]/20 relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-8 text-center relative z-10">
          <p className="text-[10px] font-black uppercase tracking-[0.6em] mb-12 opacity-30 text-[#2D3250]">Simulate, Refine, Excel</p>
          <h2 className="text-5xl md:text-6xl font-black tracking-tighter leading-[1.1] mb-20 text-[#2D3250]">
            The intelligent layer between <br />
            talent and opportunity.
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
            {[
              { label: "Accurate Match", value: "99%", icon: Zap },
              { label: "Time Saved", value: "85%", icon: TrendingUp },
              { label: "Unbiased", value: "100%", icon: Shield },
              { label: "Growth", value: "10x", icon: Sparkles }
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-2xl bg-white/50 flex items-center justify-center mb-6 border border-white">
                  <stat.icon className="w-5 h-5 text-[#92C7CF]" />
                </div>
                <p className="text-4xl font-black tracking-tighter mb-1">{stat.value}</p>
                <p className="text-[9px] font-black uppercase tracking-widest opacity-40">{stat.label}</p>
              </div>
            ))}
          </div>

          <button 
            onClick={onGetStarted}
            className="mt-20 bg-white text-[#2D3250] px-10 py-5 rounded-full text-[11px] font-black uppercase tracking-widest shadow-xl hover:bg-[#2D3250] hover:text-white transition-all"
          >
            Become a Candidate
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#FBF9F1] pt-32 pb-12 px-8 border-t border-[#92C7CF]/20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-20 mb-20">
            <div className="col-span-2">
              <div className="flex items-center gap-2 mb-8">
                <div className="w-10 h-10 rounded-xl bg-[#92C7CF] flex items-center justify-center">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-black tracking-tighter">ResumeRank</span>
              </div>
              <p className="text-lg font-medium opacity-40 max-w-sm leading-relaxed">
                Elevating the standard of recruitment through clean design and intelligent algorithms.
              </p>
            </div>
            
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest mb-8 opacity-30">Platform</p>
              <ul className="space-y-4 text-xs font-black uppercase tracking-widest opacity-60">
                <li><a href="#" className="hover:text-[#92C7CF] transition-colors">Simulation</a></li>
                <li><a href="#" className="hover:text-[#92C7CF] transition-colors">Hiring</a></li>
                <li><a href="#" className="hover:text-[#92C7CF] transition-colors">Benchmarks</a></li>
              </ul>
            </div>

            <div>
              <p className="text-[10px] font-black uppercase tracking-widest mb-8 opacity-30">Connect</p>
              <ul className="space-y-4 text-xs font-black uppercase tracking-widest opacity-60">
                <li><a href="#" className="hover:text-[#92C7CF] transition-colors">Twitter</a></li>
                <li><a href="#" className="hover:text-[#92C7CF] transition-colors">LinkedIn</a></li>
                <li><a href="#" className="hover:text-[#92C7CF] transition-colors">Instagram</a></li>
              </ul>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 pt-8 border-t border-[#92C7CF]/10">
            <p className="text-[10px] font-black uppercase tracking-widest opacity-30">© 2026 ResumeRank. All rights reserved.</p>
            <div className="flex gap-12 text-[10px] font-black uppercase tracking-widest opacity-30">
              <a href="#" className="hover:opacity-100 transition-opacity">Privacy Policy</a>
              <a href="#" className="hover:opacity-100 transition-opacity">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
