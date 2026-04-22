import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { registerUser, clearError } from "../store/slices/authSlice";
import toast from "react-hot-toast";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import {
  BrainCircuit,
  User,
  Mail,
  Lock,
  ArrowRight,
  CheckCircle,
} from "lucide-react";

export default function RegisterPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((s) => s.auth);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [fieldErrors, setFieldErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "Full name is required";
    if (!form.email) errs.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email))
      errs.email = "Invalid email address";
    if (!form.password) errs.password = "Password is required";
    else if (form.password.length < 6)
      errs.password = "Password must be at least 6 characters";
    if (form.password !== form.confirmPassword)
      errs.confirmPassword = "Passwords do not match";
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

    const result = await dispatch(
      registerUser({
        name: form.name,
        email: form.email,
        password: form.password,
      }),
    );
    if (registerUser.fulfilled.match(result)) {
      toast.success("Account created! Welcome to CareerAI 🎉");
      navigate("/dashboard");
    } else {
      toast.error(result.payload || "Registration failed");
    }
  };

  const strength =
    form.password.length >= 8 &&
    /[A-Z]/.test(form.password) &&
    /[0-9]/.test(form.password)
      ? "strong"
      : form.password.length >= 6
        ? "medium"
        : form.password
          ? "weak"
          : "";

  return (
    <div className="min-h-screen flex bg-surface dark:bg-dark-bg">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-brand items-center justify-center p-12 relative overflow-hidden">
        <div className="relative text-white text-center max-w-md z-10">
          <div className="w-20 h-20 bg-white/10 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <BrainCircuit className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl font-extrabold mb-4">Start Your Journey</h2>
          <p className="text-white/70 text-lg leading-relaxed">
            Create your free account and get AI-powered career recommendations
            tailored to you.
          </p>
          <div className="mt-10 space-y-3">
            {[
              "Personalized career path recommendations",
              "Real-time job market insights",
              "Skill gap analysis & learning paths",
              "Progress tracking dashboard",
            ].map((f) => (
              <div
                key={f}
                className="flex items-center gap-3 text-white/80 text-sm"
              >
                <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                {f}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6 overflow-y-auto">
        <div className="w-full max-w-md py-8">
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
              <BrainCircuit className="w-5 h-5 text-white" />
            </div>
            <span className="text-primary dark:text-white font-bold text-xl">
              CareerAI
            </span>
          </div>

          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-1">
            Create your account
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mb-8 text-sm">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-primary dark:text-secondary font-semibold hover:underline"
            >
              Sign in
            </Link>
          </p>

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <Input
              label="Full Name"
              type="text"
              placeholder="Jane Doe"
              icon={User}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              error={fieldErrors.name}
              autoComplete="name"
            />
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
            <div>
              <Input
                label="Password"
                type="password"
                placeholder="Min. 6 characters"
                icon={Lock}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                error={fieldErrors.password}
                autoComplete="new-password"
              />
              {strength && (
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex gap-1 flex-1">
                    {["weak", "medium", "strong"].map((s, i) => (
                      <div
                        key={s}
                        className={`h-1 flex-1 rounded-full transition-colors ${
                          strength === "weak" && i === 0
                            ? "bg-red-400"
                            : strength === "medium" && i <= 1
                              ? "bg-yellow-400"
                              : strength === "strong"
                                ? "bg-green-400"
                                : "bg-gray-200 dark:bg-dark-border"
                        }`}
                      />
                    ))}
                  </div>
                  <span
                    className={`text-xs font-semibold capitalize ${
                      strength === "weak"
                        ? "text-red-500"
                        : strength === "medium"
                          ? "text-yellow-500"
                          : "text-green-500"
                    }`}
                  >
                    {strength}
                  </span>
                </div>
              )}
            </div>
            <Input
              label="Confirm Password"
              type="password"
              placeholder="Repeat your password"
              icon={Lock}
              value={form.confirmPassword}
              onChange={(e) =>
                setForm({ ...form, confirmPassword: e.target.value })
              }
              error={fieldErrors.confirmPassword}
              autoComplete="new-password"
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
              Create Account
              <ArrowRight className="w-4 h-4" />
            </Button>
          </form>

          <p className="mt-6 text-xs text-center text-gray-400">
            By registering, you agree to our Terms of Service and Privacy
            Policy.
          </p>
        </div>
      </div>
    </div>
  );
}
