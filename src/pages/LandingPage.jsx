import { Link } from "react-router-dom";
import {
  Briefcase,
  TrendingUp,
  BookOpen,
  Users,
  ArrowRight,
  CheckCircle,
  Star,
  Zap,
  MapPin,
  BarChart3,
  Target,
  Sparkles,
} from "lucide-react";

const features = [
  {
    icon: Briefcase,
    title: "AI-Powered Matching",
    desc: "Our ML engine analyzes your skills and interests to recommend the most fitting career paths in Nigeria with precision.",
    color: "#0F2854", bg: "#e8f0fb",
  },
  {
    icon: TrendingUp,
    title: "Nigeria Market Insights",
    desc: "Live salary benchmarks, in-demand skills, and industry growth data specific to Nigeria's job market.",
    color: "#1C4D8D", bg: "#eaf1fc",
  },
  {
    icon: BookOpen,
    title: "Personalized Learning Paths",
    desc: "Curated course recommendations and step-by-step roadmaps to bridge your skill gaps efficiently.",
    color: "#4988C4", bg: "#f0f7ff",
  },
  {
    icon: Target,
    title: "Skill Gap Analysis",
    desc: "Instantly see what skills you need to develop for your target career with actionable next steps.",
    color: "#085e6f", bg: "#e5f5f8",
  },
];

const stats = [
  { value: "27+", label: "Nigerian Career Paths" },
  { value: "500+", label: "Learning Resources" },
  { value: "₦1.8M+", label: "Avg Entry Salary" },
  { value: "24/7", label: "AI Availability" },
];

const testimonials = [
  {
    name: "Chukwudi A.",
    role: "Now a Data Scientist at Flutterwave",
    text: "CareerAI identified the exact skills I was missing and helped me land my dream role in just 6 months.",
    rating: 5,
  },
  {
    name: "Amaka O.",
    role: "Transitioned to Cloud Engineering",
    text: "The Nigeria market trend insights were eye-opening. I pivoted my career based on the data and doubled my salary.",
    rating: 5,
  },
  {
    name: "Ibrahim M.",
    role: "Junior Dev → Senior Engineer at Andela",
    text: "The personalized learning roadmap kept me focused. Best career investment I have ever made.",
    rating: 5,
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen" style={{ background: "#fafcff" }}>
      {/* ── NAVBAR ── */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-white/85 backdrop-blur-md"
        style={{ borderBottom: "1px solid #e8eef5" }}>
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: "#0F2854" }}>
              <Briefcase className="w-[18px] h-[18px] text-white" />
            </div>
            <div>
              <span className="font-black text-[15px] leading-none" style={{ color: "#0F2854" }}>CareerAI</span>
              <div className="flex items-center gap-1 mt-0.5">
                <MapPin className="w-2.5 h-2.5" style={{ color: "#4988C4" }} />
                <span className="text-[9px] font-bold uppercase tracking-wider" style={{ color: "#4988C4" }}>Nigeria</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login" className="text-sm font-semibold hover:opacity-75 transition-opacity" style={{ color: "#0F2854" }}>
              Sign In
            </Link>
            <Link to="/register"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 hover:scale-105"
              style={{ background: "#0F2854", boxShadow: "0 4px 14px rgba(15,40,84,0.25)" }}>
              Get Started Free <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="pt-32 pb-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-6"
            style={{ background: "rgba(15,40,84,0.07)", color: "#1C4D8D", border: "1px solid rgba(15,40,84,0.12)" }}>
            <Zap className="w-3.5 h-3.5" />
            AI-Powered Career Guidance for Nigerians
          </div>

          <h1 className="text-4xl md:text-6xl font-black leading-tight mb-6" style={{ color: "#0F2854" }}>
            Discover Your{" "}
            <span style={{ color: "#1C4D8D" }}>
              Perfect Career Path
            </span>
            {" "}in Nigeria
          </h1>

          <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed">
            Stop guessing your career. Our AI analyzes your unique skills, interests, and Nigeria's live job market to give you precision-targeted career recommendations and learning roadmaps.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/register"
              className="flex items-center gap-2 px-8 py-3.5 rounded-2xl text-base font-bold text-white transition-all hover:opacity-90 hover:scale-105"
              style={{ background: "#0F2854", boxShadow: "0 8px 28px rgba(15,40,84,0.3)" }}>
              Start Your Career Analysis <ArrowRight className="w-5 h-5" />
            </Link>
            <Link to="/login"
              className="flex items-center gap-2 px-8 py-3.5 rounded-2xl text-base font-semibold transition-all hover:bg-white hover:shadow-md"
              style={{ color: "#0F2854", border: "1.5px solid #cddff5" }}>
              Sign In
            </Link>
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-gray-500">
            {["Free to start", "No credit card required", "Nigeria-specific data"].map((item) => (
              <div key={item} className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4" style={{ color: "#4988C4" }} />
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS BANNER ── */}
      <section className="py-14"
        style={{ background: "#0F2854" }}>
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-3xl md:text-4xl font-black text-white">{stat.value}</p>
              <p className="mt-1 text-sm font-medium" style={{ color: "#BDE8F5" }}>{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-black mb-4" style={{ color: "#0F2854" }}>
              Everything You Need to Succeed
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              A complete AI-driven career toolkit designed for Nigerian students and professionals at every stage.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-5">
            {features.map((f) => (
              <div key={f.title}
                className="rounded-2xl p-6 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
                style={{ background: "#fff", border: "1.5px solid #eef3fa", borderTop: `3px solid ${f.color}` }}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: f.bg }}>
                  <f.icon className="w-6 h-6" style={{ color: f.color }} />
                </div>
                <h3 className="text-lg font-bold mb-2" style={{ color: "#0F2854" }}>{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="py-20 px-6" style={{ background: "#f5f9ff" }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-black mb-3" style={{ color: "#0F2854" }}>Loved by Nigerians</h2>
            <p className="text-gray-500">Real stories from real people who changed their careers.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {testimonials.map((t) => (
              <div key={t.name} className="bg-white rounded-2xl p-6 transition-all hover:-translate-y-0.5 hover:shadow-md"
                style={{ border: "1px solid #eef3fa" }}>
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">"{t.text}"</p>
                <div>
                  <p className="font-bold text-sm" style={{ color: "#0F2854" }}>{t.name}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA SECTION ── */}
      <section className="py-20 px-6 text-white text-center"
        style={{ background: "#0F2854" }}>
        <div className="max-w-2xl mx-auto">
          <div className="w-16 h-16 rounded-3xl flex items-center justify-center mx-auto mb-5"
            style={{ background: "rgba(189,232,245,0.15)" }}>
            <Sparkles className="w-8 h-8" style={{ color: "#BDE8F5" }} />
          </div>
          <h2 className="text-3xl md:text-4xl font-black mb-4">Ready to Transform Your Career?</h2>
          <p className="text-white/70 mb-8 text-lg">
            Join thousands of Nigerians who use CareerAI to navigate their path to success.
          </p>
          <Link to="/register"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl text-base font-bold text-primary bg-white hover:bg-gray-50 transition-all hover:scale-105"
            style={{ boxShadow: "0 8px 28px rgba(0,0,0,0.2)" }}>
            Get Started for Free <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="py-8 text-center" style={{ background: "#060E1F" }}>
        <p className="text-sm" style={{ color: "rgba(189,232,245,0.35)" }}>
          © 2026 CareerAI Nigeria Platform. Built with AI for your success.
        </p>
      </footer>
    </div>
  );
}

