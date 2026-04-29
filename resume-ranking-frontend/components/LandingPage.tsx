"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Users,
  TrendingUp,
  CheckCircle,
  ArrowRight,
  Star,
  Zap,
  Shield,
  BarChart3,
  Search,
  Award,
} from "lucide-react";

interface LandingPageProps {
  onGetStarted: () => void;
  onLogin: () => void;
}

const stats = [
  { value: "10K+", label: "Resumes Ranked" },
  { value: "500+", label: "Companies Trust Us" },
  { value: "95%", label: "Hiring Accuracy" },
  { value: "70%", label: "Time Saved" },
];

const features = [
  {
    icon: Search,
    title: "AI-Powered Analysis",
    description:
      "Our advanced algorithms analyze resumes against job requirements with precision matching.",
  },
  {
    icon: TrendingUp,
    title: "Smart Ranking",
    description:
      "Automatically rank candidates based on skills, experience, and cultural fit scores.",
  },
  {
    icon: Zap,
    title: "Instant Results",
    description:
      "Get ranked candidate lists in seconds, not hours. Streamline your hiring process.",
  },
  {
    icon: Shield,
    title: "Bias-Free Screening",
    description:
      "Our AI focuses on qualifications and skills, ensuring fair and objective evaluation.",
  },
  {
    icon: BarChart3,
    title: "Detailed Analytics",
    description:
      "Comprehensive insights and reports to help you make data-driven hiring decisions.",
  },
  {
    icon: Award,
    title: "Quality Matches",
    description:
      "Find the perfect candidates faster with our intelligent matching technology.",
  },
];

const testimonials = [
  {
    quote:
      "This platform reduced our screening time by 80%. We now focus on interviewing the best candidates instead of sorting through hundreds of resumes.",
    author: "Sarah Chen",
    role: "Head of HR, TechCorp",
    rating: 5,
  },
  {
    quote:
      "The AI ranking is incredibly accurate. It identified top candidates that we might have overlooked in manual screening.",
    author: "Michael Roberts",
    role: "Talent Director, InnovateCo",
    rating: 5,
  },
  {
    quote:
      "A game-changer for our recruitment team. The bias-free screening ensures we are getting the most qualified candidates.",
    author: "Emily Thompson",
    role: "CEO, StartupXYZ",
    rating: 5,
  },
];

const howItWorks = [
  {
    step: "01",
    title: "Post Your Job",
    description:
      "Create detailed job listings with required skills, experience, and qualifications.",
  },
  {
    step: "02",
    title: "Collect Applications",
    description:
      "Candidates submit their resumes through our streamlined application process.",
  },
  {
    step: "03",
    title: "AI Analysis",
    description:
      "Our AI analyzes each resume against your job requirements in real-time.",
  },
  {
    step: "04",
    title: "Get Rankings",
    description:
      "Receive a ranked list of candidates with detailed match scores and insights.",
  },
];

export default function LandingPage({ onGetStarted, onLogin }: LandingPageProps) {
  const [activeFeature, setActiveFeature] = useState(0);

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/60 backdrop-blur-xl border-b border-border/40 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 group cursor-pointer">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform">
              <FileText className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground tracking-tight">ResumeRank</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
              How It Works
            </a>
            <a href="#testimonials" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
              Testimonials
            </a>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" onClick={onLogin} className="text-foreground hover:bg-secondary/80 font-medium">
              Sign In
            </Button>
            <Button onClick={onGetStarted} className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-md hover:shadow-primary/25 transition-all font-medium rounded-full px-6">
              Get Started
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/hero-bg.jpg"
            alt="Professional team collaboration"
            fill
            className="object-cover opacity-[0.03]"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/95 to-background" />
          
          {/* Animated Glow Orbs */}
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] mix-blend-screen opacity-50 animate-pulse duration-10000" />
          <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[150px] mix-blend-screen opacity-50" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="max-w-4xl mx-auto text-center pt-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 backdrop-blur-md border border-border/50 mb-8 shadow-sm transition-transform hover:scale-105 cursor-default">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-sm font-medium text-foreground/80">
                Trusted by 500+ innovative companies
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-foreground mb-6 text-balance leading-tight">
              Smart Resume Ranking
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-500">
                for Modern Hiring
              </span>
            </h1>

            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
              Transform your recruitment process with AI-powered resume screening.
              Find the perfect candidates faster with intelligent matching and
              unbiased ranking.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
              <Button
                size="lg"
                onClick={onGetStarted}
                className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-6 text-lg rounded-full shadow-xl shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-1 transition-all duration-300 group"
              >
                Start Free Trial
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="bg-background/50 backdrop-blur-md border-border/50 text-foreground hover:bg-secondary/80 px-8 py-6 text-lg rounded-full hover:-translate-y-1 transition-all duration-300"
              >
                Watch Demo
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 p-6 md:p-8 rounded-3xl bg-secondary/30 backdrop-blur-sm border border-border/40 shadow-sm">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-4xl font-bold text-foreground mb-2 bg-clip-text">{stat.value}</div>
                  <div className="text-sm font-medium text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Dashboard Preview */}
      <section className="relative py-20 px-6">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent z-0" />
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-primary/10 border border-border/50 ring-1 ring-white/10 group">
            <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent z-10" />
            <Image
              src="/images/dashboard-preview.jpg"
              alt="ResumeRank Dashboard Preview"
              width={1400}
              height={800}
              className="w-full object-cover transform group-hover:scale-[1.02] transition-transform duration-700 ease-out"
            />
            <div className="absolute bottom-8 left-8 right-8 z-20">
              <p className="text-xl text-foreground font-semibold drop-shadow-md">
                Powerful dashboard to manage all your recruitment needs
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-6 relative">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold text-foreground mb-4 tracking-tight">
              Everything You Need
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-medium">
              Powerful features to streamline your hiring process from start to finish
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className={`group relative p-8 rounded-3xl border transition-all duration-500 cursor-pointer overflow-hidden ${
                  activeFeature === index
                    ? "bg-card/80 border-primary/50 shadow-xl shadow-primary/10 -translate-y-2"
                    : "bg-card/40 border-border/40 hover:bg-card/60 hover:border-primary/30 hover:-translate-y-1 hover:shadow-lg"
                } backdrop-blur-sm`}
                onMouseEnter={() => setActiveFeature(index)}
              >
                {/* Glow Effect */}
                <div className={`absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 transition-opacity duration-500 ${activeFeature === index ? 'opacity-100' : 'group-hover:opacity-50'}`} />
                
                <div className="relative z-10">
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-colors duration-300 ${
                      activeFeature === index
                        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30"
                        : "bg-secondary text-foreground group-hover:bg-primary/20 group-hover:text-primary"
                    }`}
                  >
                    <feature.icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-foreground tracking-tight">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground font-medium leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 px-6 bg-secondary/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              How It Works
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Get started in minutes with our simple four-step process
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorks.map((item, index) => (
              <div key={item.step} className="relative">
                <div className="text-7xl font-bold text-border mb-4">{item.step}</div>
                <h3 className="text-xl font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
                {index < howItWorks.length - 1 && (
                  <div className="hidden lg:block absolute top-8 right-0 w-1/2 h-0.5 bg-border" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Image + Text Section */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="relative rounded-2xl overflow-hidden">
              <Image
                src="/images/team-collaboration.jpg"
                alt="HR Manager reviewing candidates"
                width={600}
                height={500}
                className="w-full object-cover rounded-2xl"
              />
            </div>
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                Focus on What Matters:
                <br />
                <span className="text-muted-foreground">The Best Candidates</span>
              </h2>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                Stop spending hours manually reviewing resumes. Our AI-powered system
                does the heavy lifting, so you can focus on engaging with top talent
                and making great hires.
              </p>
              <ul className="space-y-4">
                {[
                  "Reduce time-to-hire by up to 70%",
                  "Eliminate unconscious bias in screening",
                  "Never miss a qualified candidate again",
                  "Make data-driven hiring decisions",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <span className="text-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24 px-6 bg-secondary/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Loved by HR Teams
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              See what industry leaders are saying about ResumeRank
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.author}
                className="bg-card p-8 rounded-2xl border border-border"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 fill-yellow-500 text-yellow-500"
                    />
                  ))}
                </div>
                <p className="text-foreground mb-6 leading-relaxed">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>
                <div>
                  <div className="font-semibold text-foreground">{testimonial.author}</div>
                  <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Ready to Transform Your Hiring?
          </h2>
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            Join hundreds of companies already using ResumeRank to find the best
            candidates faster.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              size="lg"
              onClick={onGetStarted}
              className="bg-primary text-primary-foreground hover:bg-primary/90 px-10 py-6 text-lg rounded-full"
            >
              Get Started Free
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={onLogin}
              className="border-border text-foreground hover:bg-secondary px-10 py-6 text-lg rounded-full"
            >
              Sign In
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-border bg-secondary/30">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <FileText className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="text-lg font-semibold text-foreground">ResumeRank</span>
            </div>
            <div className="flex items-center gap-8">
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Contact
              </a>
            </div>
            <div className="text-sm text-muted-foreground">
              2024 ResumeRank. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
