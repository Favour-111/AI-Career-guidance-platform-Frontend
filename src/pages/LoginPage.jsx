import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, clearError } from "../store/slices/authSlice";
import toast from "react-hot-toast";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import { BrainCircuit, Mail, Lock, ArrowRight, MapPin, TrendingUp, Target, BookOpen } from "lucide-react";

const PERKS = [
  { icon: Target, label: "AI Career Matching" },
  { icon: TrendingUp, label: "Nigeria Market Insights" },
  { icon: BookOpen, label: "Personalized Learning Paths" },
  { icon: BrainCircuit, label: "Skill Gap Analysis" },
];

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((s) => s.auth);

  const [form, setForm] = useState({ email: "", password: "" });
  const [fieldErrors, setFieldErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!form.email) errs.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = "Invalid email address";
    if (!form.password) errs.password = "Password is required";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearError());
    const errs = validate();
    if (Object.keys(errs).length) { setFieldErrors(errs); return; }
    setFieldErrors({});
    const result = await dispatch(loginUser(form));
    if (loginUser.fulfilled.match(result)) {
      toast.success(`Welcome back, ${result.payload.user.name.split(" ")[0]}!`);
      navigate("/dashboard");
    } else {
      toast.error(result.payload || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* ── LEFT PANEL ── */}
      <div className="hidden lg:flex lg:w-[45%] items-center justify-center p-12 relative overflow-hidden"
        style={{ background: "#0F2854" }}>
        {/* Decorative circles */}
        <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full opacity-15"
          style={{ background: "radial-gradient(circle, #4988C4 0%, transparent 70%)" }} />
        <div className="absolute -bottom-20 -left-20 w-56 h-56 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #BDE8F5 0%, transparent 70%)" }} />
        <div className="h-px absolute top-0 left-0 right-0"
          style={{ background: "rgba(189,232,245,0.10)" }} />

        <div className="relative z-10 text-white text-center max-w-md">
          <div className="w-16 h-16 rounded-3xl flex items-center justify-center mx-auto mb-5"
            style={{ background: "rgba(189,232,245,0.12)", border: "1.5px solid rgba(189,232,245,0.2)" }}>
            <BrainCircuit className="w-8 h-8 text-white" />
          </div>
          <div className="flex items-center justify-center gap-1.5 mb-3">
            <MapPin className="w-3.5 h-3.5" style={{ color: "#BDE8F5" }} />
            <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: "#BDE8F5" }}>Nigeria</span>
          </div>
          <h2 className="text-3xl font-black mb-3 leading-tight">Welcome Back!</h2>
          <p className="text-white/65 leading-relaxed mb-10">
            Your AI career coach is ready. Sign in to continue your personalized career journey in Nigeria's job market.
          </p>
          <div className="grid grid-cols-2 gap-3 text-left">
            {PERKS.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2.5 rounded-xl px-3 py-2.5"
                style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(189,232,245,0.1)" }}>
                <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: "rgba(189,232,245,0.12)" }}>
                  <Icon className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="text-white/80 text-[11.5px] font-semibold">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div className="flex-1 flex items-center justify-center p-6" style={{ background: "#fafcff" }}>
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex items-center gap-2.5 mb-8 lg:hidden">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: "#0F2854" }}>
              <BrainCircuit className="w-5 h-5 text-white" />
            </div>
            <span className="font-black text-xl" style={{ color: "#0F2854" }}>CareerAI</span>
          </div>

          <h1 className="text-2xl font-black mb-1" style={{ color: "#0F2854" }}>Sign in to your account</h1>
          <p className="text-gray-500 text-sm mb-7">
            Don't have an account?{" "}
            <Link to="/register" className="font-bold hover:underline" style={{ color: "#1C4D8D" }}>
              Create one free
            </Link>
          </p>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <Input label="Email Address" type="email" placeholder="you@example.com"
              icon={Mail} value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              error={fieldErrors.email} autoComplete="email" />
            <Input label="Password" type="password" placeholder="••••••••"
              icon={Lock} value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              error={fieldErrors.password} autoComplete="current-password" />

            {error && (
              <div className="p-3 rounded-xl text-sm font-medium"
                style={{ background: "#fef2f2", border: "1px solid #fecaca", color: "#b91c1c" }}>
                {error}
              </div>
            )}

            <Button type="submit" loading={loading} className="w-full" size="lg">
              Sign In <ArrowRight className="w-4 h-4" />
            </Button>
          </form>

          <p className="mt-8 text-center text-xs text-gray-400">
            By signing in you agree to our{" "}
            <span className="font-semibold" style={{ color: "#1C4D8D" }}>Terms of Service</span>
            {" & "}
            <span className="font-semibold" style={{ color: "#1C4D8D" }}>Privacy Policy</span>
          </p>
        </div>
      </div>
    </div>
  );
}

