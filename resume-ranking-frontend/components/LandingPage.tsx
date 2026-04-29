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
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
              <FileText className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-semibold text-foreground">ResumeRank</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">
              How It Works
            </a>
            <a href="#testimonials" className="text-muted-foreground hover:text-foreground transition-colors">
              Testimonials
            </a>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" onClick={onLogin} className="text-foreground">
              Sign In
            </Button>
            <Button onClick={onGetStarted} className="bg-primary text-primary-foreground hover:bg-primary/90">
              Get Started
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/hero-bg.jpg"
            alt="Professional team collaboration"
            fill
            className="object-cover opacity-15"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary border border-border mb-8">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-sm text-muted-foreground">
                Trusted by 500+ companies worldwide
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-foreground mb-6 text-balance">
              Smart Resume Ranking
              <br />
              <span className="text-muted-foreground">for Modern Hiring</span>
            </h1>

            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
              Transform your recruitment process with AI-powered resume screening.
              Find the perfect candidates faster with intelligent matching and
              unbiased ranking.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <Button
                size="lg"
                onClick={onGetStarted}
                className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-6 text-lg rounded-full"
              >
                Start Free Trial
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-border text-foreground hover:bg-secondary px-8 py-6 text-lg rounded-full"
              >
                Watch Demo
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-4xl font-bold text-foreground mb-1">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Dashboard Preview */}
      <section className="py-20 px-6 bg-secondary/50">
        <div className="max-w-7xl mx-auto">
          <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-border">
            <Image
              src="/images/dashboard-preview.jpg"
              alt="ResumeRank Dashboard Preview"
              width={1400}
              height={800}
              className="w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
            <div className="absolute bottom-8 left-8 right-8">
              <p className="text-lg text-foreground font-medium">
                Powerful dashboard to manage all your recruitment needs
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Everything You Need
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Powerful features to streamline your hiring process from start to finish
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className={`p-8 rounded-2xl border transition-all duration-300 cursor-pointer ${
                  activeFeature === index
                    ? "bg-primary text-primary-foreground border-primary shadow-lg scale-105"
                    : "bg-card border-border hover:border-primary/50 hover:shadow-md"
                }`}
                onMouseEnter={() => setActiveFeature(index)}
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 ${
                    activeFeature === index
                      ? "bg-primary-foreground/20"
                      : "bg-secondary"
                  }`}
                >
                  <feature.icon
                    className={`w-6 h-6 ${
                      activeFeature === index ? "text-primary-foreground" : "text-foreground"
                    }`}
                  />
                </div>
                <h3
                  className={`text-xl font-semibold mb-3 ${
                    activeFeature === index ? "text-primary-foreground" : "text-foreground"
                  }`}
                >
                  {feature.title}
                </h3>
                <p
                  className={
                    activeFeature === index
                      ? "text-primary-foreground/80"
                      : "text-muted-foreground"
                  }
                >
                  {feature.description}
                </p>
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
