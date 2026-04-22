import { Link } from "react-router-dom";
import {
  BrainCircuit,
  TrendingUp,
  BookOpen,
  Users,
  ArrowRight,
  CheckCircle,
  Star,
  Zap,
} from "lucide-react";

const features = [
  {
    icon: BrainCircuit,
    title: "AI-Powered Matching",
    desc: "Our ML engine analyzes your skills and interests to recommend the most fitting career paths with precision.",
    color: "bg-primary/10 text-primary dark:bg-primary/20 dark:text-secondary",
    border: "#0F2854",
  },
  {
    icon: TrendingUp,
    title: "Real-Time Market Trends",
    desc: "Stay ahead with live job market insights, in-demand skills, salary ranges, and industry growth data.",
    color:
      "bg-[#4988C4]/10 text-[#4988C4] dark:bg-[#4988C4]/20 dark:text-[#BDE8F5]",
    border: "#4988C4",
  },
  {
    icon: BookOpen,
    title: "Personalized Learning Paths",
    desc: "Get curated course recommendations and step-by-step roadmaps to bridge your skill gaps efficiently.",
    color:
      "bg-[#1C4D8D]/10 text-[#1C4D8D] dark:bg-[#1C4D8D]/20 dark:text-[#BDE8F5]",
    border: "#1C4D8D",
  },
  {
    icon: Users,
    title: "Skill Gap Analysis",
    desc: "Instantly see what skills you need to develop for your target career with actionable next steps.",
    color:
      "bg-[#0F2854]/10 text-[#0F2854] dark:bg-[#0F2854]/20 dark:text-[#BDE8F5]",
    border: "#0F2854",
  },
];

const stats = [
  { value: "50+", label: "Career Paths Analyzed" },
  { value: "500+", label: "Learning Resources" },
  { value: "98%", label: "Accuracy Rate" },
  { value: "24/7", label: "AI Availability" },
];

const testimonials = [
  {
    name: "Sarah K.",
    role: "Now a Data Scientist at Google",
    text: "CareerAI identified the exact skills I was missing and helped me land my dream role in just 6 months.",
    rating: 5,
  },
  {
    name: "Michael R.",
    role: "Transitioned to Cloud Architecture",
    text: "The market trend insights were eye-opening. I pivoted my career based on the data and doubled my salary.",
    rating: 5,
  },
  {
    name: "Priya M.",
    role: "Junior Dev → Senior Engineer",
    text: "The personalized learning roadmap kept me focused. Best career investment I have ever made.",
    rating: 5,
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-dark-bg">
      {/* Navbar */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-white/80 dark:bg-dark-surface/80 backdrop-blur-md border-b border-gray-100 dark:border-dark-border">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center">
              <BrainCircuit className="w-4.5 h-4.5 text-white" size={18} />
            </div>
            <span className="text-primary dark:text-white font-bold text-lg">
              CareerAI
            </span>
          </div>
          <div className="flex items-center gap-3">
            {/* <Link to="/login" className="btn-ghost text-sm">
              Sign In
            </Link> */}
            <Link to="/register" className="btn-primary text-sm">
              Get Started Free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 dark:bg-primary/20 text-primary dark:text-secondary text-sm font-semibold mb-6">
            <Zap className="w-3.5 h-3.5" />
            AI-Powered Career Guidance
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-primary dark:text-white leading-tight mb-6">
            Discover Your{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Perfect Career Path
            </span>{" "}
            with AI
          </h1>
          <p className="text-lg md:text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Stop guessing your career. Our AI analyzes your unique skills,
            interests, and the live job market to give you precision-targeted
            career recommendations and learning roadmaps.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to="/register"
              className="btn-primary text-base px-8 py-3.5 rounded-2xl"
            >
              Start Your Career Analysis
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/login"
              className="btn-secondary text-base px-8 py-3.5 rounded-2xl"
            >
              Sign In
            </Link>
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-gray-500">
            {[
              "Free to start",
              "No credit card required",
              "AI-powered insights",
            ].map((item) => (
              <div key={item} className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4" style={{ color: "#4988C4" }} />
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section
        className="py-16"
        style={{
          background: "linear-gradient(135deg, #0F2854 0%, #1C4D8D 100%)",
        }}
      >
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-3xl md:text-4xl font-extrabold text-white">
                {stat.value}
              </p>
              <p
                className="mt-1 text-sm font-medium"
                style={{ color: "#BDE8F5" }}
              >
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6 bg-white dark:bg-dark-bg">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-extrabold text-primary dark:text-white mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
              A complete AI-driven career toolkit designed for students and
              professionals at every stage.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {features.map((f) => (
              <div
                key={f.title}
                className="card hover:shadow-card-hover transition-all duration-200 border-t-2"
                style={{ borderTopColor: f.border }}
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center ${f.color} mb-4`}
                >
                  <f.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                  {f.title}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-6 bg-white dark:bg-dark-surface">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-extrabold text-primary dark:text-white mb-3">
              Loved by Thousands
            </h2>
            <p className="text-gray-500 dark:text-gray-400">
              Real stories from real people who changed their careers.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="card">
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-4">
                  "{t.text}"
                </p>
                <div>
                  <p className="font-bold text-gray-900 dark:text-white text-sm">
                    {t.name}
                  </p>
                  <p className="text-xs text-gray-400">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        className="py-20 px-6 text-white text-center"
        style={{
          background:
            "linear-gradient(135deg, #0F2854 0%, #1C4D8D 60%, #4988C4 100%)",
        }}
      >
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
            Ready to Transform Your Career?
          </h2>
          <p className="text-white/70 mb-8 text-lg">
            Join thousands of students and professionals who use CareerAI to
            navigate their path to success.
          </p>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 btn-primary bg-white text-primary hover:bg-gray-100 text-base px-8 py-3.5 rounded-2xl shadow-glow"
          >
            Get Started for Free
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center" style={{ background: "#060E1F" }}>
        <p className="text-sm" style={{ color: "rgba(189,232,245,0.4)" }}>
          © 2026 CareerAI Platform. Built with AI for your success.
        </p>
      </footer>
    </div>
  );
}
