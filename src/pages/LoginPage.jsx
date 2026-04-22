import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, clearError } from "../store/slices/authSlice";
import toast from "react-hot-toast";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import { BrainCircuit, Mail, Lock, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((s) => s.auth);

  const [form, setForm] = useState({ email: "", password: "" });
  const [fieldErrors, setFieldErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!form.email) errs.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email))
      errs.email = "Invalid email address";
    if (!form.password) errs.password = "Password is required";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearError());
    const errs = validate();
    if (Object.keys(errs).length) {
      setFieldErrors(errs);
      return;
    }
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
    <div className="min-h-screen flex dark:bg-dark-bg">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-brand items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white"
              style={{
                width: Math.random() * 80 + 20,
                height: Math.random() * 80 + 20,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                opacity: Math.random() * 0.5,
              }}
            />
          ))}
        </div>
        <div className="relative text-white text-center max-w-md z-10">
          <div className="w-20 h-20 bg-white/10 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <BrainCircuit className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl font-extrabold mb-4">Welcome Back!</h2>
          <p className="text-white/70 text-lg leading-relaxed">
            Your AI career coach is ready. Sign in to continue your personalized
            career journey.
          </p>
          <div className="mt-10 grid grid-cols-2 gap-4 text-left">
            {[
              "AI Career Matching",
              "Market Insights",
              "Skill Analysis",
              "Learning Paths",
            ].map((f) => (
              <div
                key={f}
                className="flex items-center gap-2 text-white/80 text-sm"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-secondary" />
                {f}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          {/* Logo mobile */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
              <BrainCircuit className="w-5 h-5 text-white" />
            </div>
            <span className="text-primary dark:text-white font-bold text-xl">
              CareerAI
            </span>
          </div>

          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-1">
            Sign in to your account
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mb-8 text-sm">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-primary dark:text-secondary font-semibold hover:underline"
            >
              Create one free
            </Link>
          </p>

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <Input
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              icon={Mail}
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              error={fieldErrors.email}
              autoComplete="email"
            />
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              icon={Lock}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              error={fieldErrors.password}
              autoComplete="current-password"
            />

            {error && (
              <div className="p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                <p className="text-sm text-red-600 dark:text-red-400 font-medium">
                  {error}
                </p>
              </div>
            )}

            <Button
              type="submit"
              loading={loading}
              className="w-full"
              size="lg"
            >
              Sign In
              <ArrowRight className="w-4 h-4" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
