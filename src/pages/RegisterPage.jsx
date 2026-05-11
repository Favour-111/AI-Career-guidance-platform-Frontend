import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { registerUser, clearError } from "../store/slices/authSlice";
import toast from "react-hot-toast";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import {
  BrainCircuit, User, Mail, Lock, ArrowRight, CheckCircle, MapPin,
} from "lucide-react";

const FEATURES = [
  "Personalized AI career path recommendations",
  "Nigeria-specific salary & market data",
  "Skill gap analysis & learning roadmaps",
  "Progress tracking dashboard",
];

export default function RegisterPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((s) => s.auth);

  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [fieldErrors, setFieldErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "Full name is required";
    if (!form.email) errs.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = "Invalid email address";
    if (!form.password) errs.password = "Password is required";
    else if (form.password.length < 6) errs.password = "Password must be at least 6 characters";
    if (form.password !== form.confirmPassword) errs.confirmPassword = "Passwords do not match";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearError());
    const errs = validate();
    if (Object.keys(errs).length) { setFieldErrors(errs); return; }
    setFieldErrors({});
    const result = await dispatch(registerUser({ name: form.name, email: form.email, password: form.password }));
    if (registerUser.fulfilled.match(result)) {
      toast.success("Account created! Welcome to CareerAI 🎉");
      navigate("/dashboard");
    } else {
      toast.error(result.payload || "Registration failed");
    }
  };

  const strength = form.password.length >= 8 && /[A-Z]/.test(form.password) && /[0-9]/.test(form.password)
    ? "strong" : form.password.length >= 6 ? "medium" : form.password ? "weak" : "";

  return (
    <div className="min-h-screen flex">
      {/* ── LEFT PANEL ── */}
      <div className="hidden lg:flex lg:w-[45%] items-center justify-center p-12 relative overflow-hidden"
        style={{ background: "#0F2854" }}>
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
          <h2 className="text-3xl font-black mb-3 leading-tight">Start Your Journey</h2>
          <p className="text-white/65 leading-relaxed mb-8">
            Create your free account and get AI-powered career recommendations tailored to Nigeria's job market.
          </p>
          <div className="space-y-2.5 text-left">
            {FEATURES.map((f) => (
              <div key={f} className="flex items-center gap-3 rounded-xl px-3 py-2.5"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(189,232,245,0.08)" }}>
                <CheckCircle className="w-4 h-4 flex-shrink-0" style={{ color: "#34d399" }} />
                <span className="text-white/80 text-[12px] font-semibold">{f}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div className="flex-1 flex items-center justify-center p-6 overflow-y-auto" style={{ background: "#fafcff" }}>
        <div className="w-full max-w-md py-8">
          {/* Mobile logo */}
          <div className="flex items-center gap-2.5 mb-8 lg:hidden">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: "#0F2854" }}>
              <BrainCircuit className="w-5 h-5 text-white" />
            </div>
            <span className="font-black text-xl" style={{ color: "#0F2854" }}>CareerAI</span>
          </div>

          <h1 className="text-2xl font-black mb-1" style={{ color: "#0F2854" }}>Create your account</h1>
          <p className="text-gray-500 text-sm mb-7">
            Already have an account?{" "}
            <Link to="/login" className="font-bold hover:underline" style={{ color: "#1C4D8D" }}>Sign in</Link>
          </p>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <Input label="Full Name" type="text" placeholder="e.g. Chukwudi Adeyemi"
              icon={User} value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              error={fieldErrors.name} autoComplete="name" />
            <Input label="Email Address" type="email" placeholder="you@example.com"
              icon={Mail} value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              error={fieldErrors.email} autoComplete="email" />
            <div>
              <Input label="Password" type="password" placeholder="Min. 6 characters"
                icon={Lock} value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                error={fieldErrors.password} autoComplete="new-password" />
              {strength && (
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex gap-1 flex-1">
                    {["weak", "medium", "strong"].map((s, i) => (
                      <div key={s} className="h-1.5 flex-1 rounded-full transition-colors"
                        style={{ background: strength === "weak" && i === 0 ? "#f87171"
                          : strength === "medium" && i <= 1 ? "#facc15"
                          : strength === "strong" ? "#4ade80"
                          : "#e5e7eb" }} />
                    ))}
                  </div>
                  <span className="text-xs font-bold capitalize"
                    style={{ color: strength === "weak" ? "#ef4444" : strength === "medium" ? "#ca8a04" : "#16a34a" }}>
                    {strength}
                  </span>
                </div>
              )}
            </div>
            <Input label="Confirm Password" type="password" placeholder="Repeat your password"
              icon={Lock} value={form.confirmPassword}
              onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
              error={fieldErrors.confirmPassword} autoComplete="new-password" />

            {error && (
              <div className="p-3 rounded-xl text-sm font-medium"
                style={{ background: "#fef2f2", border: "1px solid #fecaca", color: "#b91c1c" }}>
                {error}
              </div>
            )}

            <Button type="submit" loading={loading} className="w-full" size="lg">
              Create Account <ArrowRight className="w-4 h-4" />
            </Button>
          </form>

          <p className="mt-6 text-xs text-center text-gray-400">
            By registering you agree to our{" "}
            <span className="font-semibold" style={{ color: "#1C4D8D" }}>Terms of Service</span>
            {" & "}
            <span className="font-semibold" style={{ color: "#1C4D8D" }}>Privacy Policy</span>
          </p>
        </div>
      </div>
    </div>
  );
}

