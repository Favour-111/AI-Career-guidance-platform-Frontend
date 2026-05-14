import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { fetchProfile } from "../store/slices/profileSlice";
import { fetchRecommendations } from "../store/slices/recommendationSlice";
import SkillRadarChart from "../components/dashboard/SkillRadarChart";
import ActivityFeed from "../components/dashboard/ActivityFeed";
import Spinner from "../components/common/Spinner";
import { SkeletonCareerCard } from "../components/common/Skeleton";
import api from "../services/api";
import {
  User,
  Star,
  Lightbulb,
  TrendingUp,
  ArrowRight,
  Zap,
  BookOpen,
  ChevronRight,
  Target,
  Award,
  Sparkles,
  Activity,
  Code2,
  Landmark,
  HeartPulse,
  HardHat,
  GraduationCap,
  Briefcase,
  Scale,
  Palette,
  Filter,
  LayoutList,
  LayoutGrid,
  Clock,
  CheckCircle2,
  Circle,
  BookmarkCheck,
} from "lucide-react";

const QUICK_ACTIONS = [
  { label: "Technology", icon: Code2, color: "#0F2854", bg: "#e8f0fb", path: "/market-trends" },
  { label: "Finance & Banking", icon: Landmark, color: "#1C4D8D", bg: "#eaf1fc", path: "/market-trends" },
  { label: "Healthcare", icon: HeartPulse, color: "#1a6b4a", bg: "#e6f5ef", path: "/market-trends" },
  { label: "Engineering", icon: HardHat, color: "#7c3e0e", bg: "#fdf1e8", path: "/market-trends" },
  { label: "Education", icon: GraduationCap, color: "#4b1da8", bg: "#f0ebfd", path: "/market-trends" },
  { label: "Business", icon: Briefcase, color: "#085e6f", bg: "#e5f5f8", path: "/market-trends" },
  { label: "Law", icon: Scale, color: "#7a1c1c", bg: "#fceaea", path: "/market-trends" },
  { label: "Arts & Design", icon: Palette, color: "#875c00", bg: "#fdf5e2", path: "/market-trends" },
];

const normalizeSalaryAmount = (value) => {
  const amount = Number(value);
  if (!Number.isFinite(amount) || amount <= 0) return null;
  if (amount >= 1000 && amount < 1000000) return amount * 1000;
  return amount;
};

const formatSalaryRange = (salaryRange) => {
  if (!salaryRange) return null;
  const min = normalizeSalaryAmount(salaryRange.min);
  const max = normalizeSalaryAmount(salaryRange.max);
  if (!min && !max) return null;
  if (min && max) return `₦${(min / 1000000).toFixed(1)}M-₦${(max / 1000000).toFixed(1)}M/yr`;
  const value = min || max;
  return `₦${(value / 1000000).toFixed(1)}M/yr`;
};

export default function Dashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((s) => s.auth);
  const { profile, loading: profileLoading } = useSelector((s) => s.profile);
  const { recommendation, loading: recLoading } = useSelector((s) => s.recommendations);
  const [activities, setActivities] = useState([]);
  const [loadingActivities, setLoadingActivities] = useState(true);
  const [listView, setListView] = useState(true);

  useEffect(() => {
    dispatch(fetchProfile());
    dispatch(fetchRecommendations());
    if (user?.role === "admin") {
      api.get("/admin/stats")
        .then(({ data }) => setActivities(data.recentActivity || []))
        .catch(() => {}).finally(() => setLoadingActivities(false));
    } else {
      api.get("/profile/activity")
        .then(({ data }) => setActivities(data.activities || []))
        .catch(() => {}).finally(() => setLoadingActivities(false));
    }
  }, [dispatch]);

  const topCareers = recommendation?.careers?.slice(0, 5) || [];
  const profileCompletion = profile?.completionPercentage || 0;
  const skillCount = profile?.skills?.length || 0;
  const careerCount = user?.bookmarkedCareers?.length || 0;
  const recommendationCount = recommendation?.careers?.length || 0;

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  const initialContentLoading =
    (profileLoading || recLoading || loadingActivities) &&
    !profile &&
    !recommendation &&
    activities.length === 0;

  if (initialContentLoading) {
    return (
      <div className="max-w-7xl mx-auto min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <Spinner size="lg" />
          <p className="mt-3 text-sm text-gray-500">Loading dashboard content...</p>
        </div>
      </div>
    );
  }

  const pendingActions = [
    {
      id: "profile",
      title: "Complete your profile",
      desc: `${profileCompletion}% done — add skills, education & goals`,
      done: profileCompletion >= 80,
      link: "/profile",
      progress: profileCompletion,
    },
    {
      id: "recommendations",
      title: "Generate AI career recommendations",
      desc: recommendationCount > 0 ? `${recommendationCount} matches generated` : "No recommendations yet",
      done: recommendationCount > 0,
      link: "/recommendations",
      progress: recommendationCount > 0 ? 100 : 0,
    },
    {
      id: "market",
      title: "Explore Nigeria job market trends",
      desc: "Live salary & demand data by role",
      done: false,
      link: "/market-trends",
      progress: 0,
    },
  ];

  return (
    <div className="space-y-5 max-w-7xl mx-auto animate-slide-up">

      {/* ── COMPACT HERO ── */}
      <div className="relative rounded-2xl overflow-hidden"
        style={{ background: "#0F2854", boxShadow: "0 16px 48px rgba(9,27,58,0.4)" }}>
        <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full opacity-20 pointer-events-none"
          style={{ background: "radial-gradient(circle, #4988C4 0%, transparent 70%)" }} />
        <div className="h-px w-full" style={{ background: "rgba(189,232,245,0.12)" }} />
        <div className="relative z-10 px-4 sm:px-6 py-4 sm:py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 mb-2 px-2.5 py-1 rounded-full"
              style={{ background: "rgba(189,232,245,0.1)", border: "1px solid rgba(189,232,245,0.18)" }}>
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "#BDE8F5" }} />
              <span className="text-[10.5px] font-bold uppercase tracking-widest" style={{ color: "#BDE8F5" }}>
                {greeting}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-white tracking-tight leading-tight">
              Welcome back,{" "}
              <span style={{ color: "#BDE8F5" }}>
                {user?.name?.split(" ")[0]}
              </span>
            </h1>
            <p className="mt-1.5 text-xs sm:text-sm" style={{ color: "rgba(189,232,245,0.6)" }}>
              {profileCompletion < 80
                ? `Your profile is ${profileCompletion}% complete finish it for sharper AI matches.`
                : "Your profile is in great shape. Here are your latest career insights."}
            </p>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            {/* SVG ring */}
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 80 80">
                <circle cx="40" cy="40" r="34" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="6" />
                <circle cx="40" cy="40" r="34" fill="none" stroke="url(#ring2)" strokeWidth="6"
                  strokeLinecap="round" strokeDasharray={`${2 * Math.PI * 34}`}
                  strokeDashoffset={`${2 * Math.PI * 34 * (1 - profileCompletion / 100)}`}
                  className="transition-all duration-1000" />
                <defs>
                  <linearGradient id="ring2" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#BDE8F5" />
                    <stop offset="100%" stopColor="#4988C4" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-base sm:text-xl font-black text-white leading-none">{profileCompletion}%</span>
                <span className="text-[9px]" style={{ color: "rgba(189,232,245,0.6)" }}>profile</span>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              {!recommendation && (
                <Link to="/recommendations"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white transition-all hover:opacity-90 hover:scale-105"
                  style={{ background: "#1C4D8D", boxShadow: "0 4px 14px rgba(73,136,196,0.35)" }}>
                  <Sparkles className="w-3.5 h-3.5" /> Generate AI Matches
                </Link>
              )}
              <Link to="/market-trends"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all hover:scale-105"
                style={{ border: "1.5px solid rgba(189,232,245,0.25)", background: "rgba(189,232,245,0.07)", color: "#BDE8F5" }}>
                <TrendingUp className="w-3.5 h-3.5" /> Market Trends
              </Link>
            </div>
          </div>
        </div>
        <div className="h-px w-full" style={{ background: "rgba(189,232,245,0.06)" }} />
      </div>

      {/* ── STAT STRIP ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Skills", value: skillCount, sub: "In your profile", icon: Star, gradient: "#0F2854", link: "/profile" },
          { label: "AI Matches", value: recommendationCount, sub: "Career suggestions", icon: Lightbulb, gradient: "#1C4D8D", link: "/recommendations" },
          { label: "Bookmarked", value: careerCount, sub: "Saved careers", icon: BookmarkCheck, gradient: "#4988C4", link: "/bookmarks" },
          { label: "Profile Score", value: `${profileCompletion}%`, sub: profileCompletion >= 80 ? "Looking great!" : "Tap to improve", icon: Activity, gradient: "#0F2854", link: "/profile", progress: profileCompletion },
        ].map(({ label, value, sub, icon: Icon, gradient, link, progress }) => (
          <Link key={label} to={link}
            className="group relative rounded-2xl p-3 sm:p-4 overflow-hidden transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg bg-white"
            style={{ boxShadow: "0 2px 10px rgba(0,0,0,0.06)", border: "1px solid #eef3fa" }}>
            <div className="absolute top-0 left-0 right-0 h-[3px] rounded-t-2xl" style={{ background: gradient }} />
            <div className="flex items-start justify-between mb-2 sm:mb-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: gradient }}>
                <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all" style={{ color: "#1C4D8D" }} />
            </div>
            <p className="text-xl sm:text-2xl font-black text-gray-900">{value}</p>
            <p className="text-[12px] sm:text-[13px] font-bold text-gray-700 mt-0.5">{label}</p>
            <p className="text-[10px] sm:text-xs text-gray-400 mt-0.5">{sub}</p>
            {progress !== undefined && (
              <div className="mt-2.5 h-1 rounded-full overflow-hidden" style={{ background: "rgba(15,40,84,0.08)" }}>
                <div className="h-full rounded-full transition-all duration-700" style={{ width: `${progress}%`, background: gradient }} />
              </div>
            )}
          </Link>
        ))}
      </div>

      {/* ── QUICK CAREER ACTIONS ── */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-[15px] font-bold" style={{ color: "#0F2854" }}>Quick Career Explorations</h2>
            <p className="text-xs text-gray-400 mt-0.5">Browse Nigeria's job market by field</p>
          </div>
          <Link to="/market-trends" className="text-xs font-semibold flex items-center gap-1 hover:opacity-75"
            style={{ color: "#1C4D8D" }}>
            View all <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <div className="grid grid-cols-4 lg:grid-cols-8 gap-2">
          {QUICK_ACTIONS.map(({ label, icon: Icon, color, bg, path }) => (
            <Link key={label} to={path}
              className="group flex flex-col items-center gap-1.5 py-3 sm:py-4 px-1 rounded-2xl text-center transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
              style={{ background: bg, border: `1.5px solid ${bg}` }}>
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center transition-transform duration-200 group-hover:scale-110"
                style={{ background: color }}>
                <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <span className="text-[9px] sm:text-[11px] font-bold leading-tight" style={{ color }}>{label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* ── MAIN CONTENT GRID ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Left col (2/3): Pending + Career List */}
        <div className="lg:col-span-2 space-y-4">

          {/* Toolbar */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors hover:bg-gray-100"
                style={{ color: "#0F2854", border: "1px solid #e5edf6" }}>
                <Filter className="w-3.5 h-3.5" /> Filter
              </button>
              <button onClick={() => setListView(!listView)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors hover:bg-gray-100"
                style={{ color: "#0F2854", border: "1px solid #e5edf6" }}>
                {listView ? <LayoutGrid className="w-3.5 h-3.5" /> : <LayoutList className="w-3.5 h-3.5" />}
                {listView ? "Grid view" : "List view"}
              </button>
            </div>
            <Link to="/recommendations"
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-bold text-white transition-all hover:opacity-90"
              style={{ background: "#0F2854" }}>
              + New Analysis
            </Link>
          </div>

          {/* Pending Actions */}
          <div className="bg-white rounded-2xl overflow-hidden" style={{ border: "1px solid #eef3fa", boxShadow: "0 2px 10px rgba(0,0,0,0.04)" }}>
            <div className="flex items-center justify-between px-5 py-3.5" style={{ borderBottom: "1px solid #f0f5fb" }}>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "rgba(15,40,84,0.08)" }}>
                  <Circle className="w-3.5 h-3.5" style={{ color: "#0F2854" }} />
                </div>
                <span className="text-[13px] font-bold" style={{ color: "#0F2854" }}>Pending Actions</span>
              </div>
              <span className="text-[10.5px] font-semibold px-2.5 py-1 rounded-full"
                style={{ background: "rgba(15,40,84,0.07)", color: "#0F2854" }}>
                {pendingActions.filter(a => !a.done).length} remaining
              </span>
            </div>
            <div className="divide-y" style={{ borderColor: "#f7fafd" }}>
              {pendingActions.map((action) => (
                <Link key={action.id} to={action.link}
                  className="flex items-center gap-3 sm:gap-4 px-4 sm:px-5 py-3 sm:py-3.5 hover:bg-blue-50/40 transition-colors group">
                  <div className="flex-shrink-0">
                    {action.done
                      ? <CheckCircle2 className="w-5 h-5" style={{ color: "#16a34a" }} />
                      : <Circle className="w-5 h-5 text-gray-300" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-[12px] sm:text-[13px] font-semibold truncate ${action.done ? "line-through text-gray-400" : ""}`}
                      style={{ color: action.done ? undefined : "#0F2854" }}>
                      {action.title}
                    </p>
                    <p className="text-[11px] text-gray-400 mt-0.5 truncate">{action.desc}</p>
                    {!action.done && action.progress > 0 && (
                      <div className="mt-1.5 h-1 w-32 rounded-full overflow-hidden" style={{ background: "#eef3fa" }}>
                        <div className="h-full rounded-full" style={{ width: `${action.progress}%`, background: "#4988C4" }} />
                      </div>
                    )}
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                </Link>
              ))}
            </div>
          </div>

          {/* Career Matches List */}
          <div className="bg-white rounded-2xl overflow-hidden" style={{ border: "1px solid #eef3fa", boxShadow: "0 2px 10px rgba(0,0,0,0.04)" }}>
            <div className="flex items-center justify-between px-5 py-3.5" style={{ borderBottom: "1px solid #f0f5fb" }}>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "rgba(28,77,141,0.1)" }}>
                  <Target className="w-3.5 h-3.5" style={{ color: "#1C4D8D" }} />
                </div>
                <span className="text-[13px] font-bold" style={{ color: "#0F2854" }}>Active Career Paths</span>
              </div>
              <Link to="/recommendations" className="text-[11px] font-semibold flex items-center gap-1 hover:opacity-75"
                style={{ color: "#1C4D8D" }}>
                View all <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {recLoading ? (
              <div className="p-4 space-y-3">
                {[0, 1, 2].map((i) => <SkeletonCareerCard key={i} />)}
              </div>
            ) : topCareers.length > 0 ? (
              <div className="divide-y" style={{ borderColor: "#f7fafd" }}>
                {topCareers.map((career, idx) => {
                  const score = career.matchScore || 0;
                  const scoreColor = score >= 70 ? "#16a34a" : score >= 45 ? "#ca8a04" : "#dc2626";
                  const scoreBg = score >= 70 ? "#f0fdf4" : score >= 45 ? "#fefce8" : "#fef2f2";
                  const statusLabel = score >= 70 ? "Strong Match" : score >= 45 ? "Good Match" : "Partial Match";
                  const salaryLabel = formatSalaryRange(career.salaryRange);
                  return (
                    <div key={career.careerId}
                      className="flex items-center gap-3 sm:gap-4 px-4 sm:px-5 py-3 sm:py-3.5 hover:bg-blue-50/30 transition-colors group cursor-default">
                      {/* Rank */}
                      <div className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-black text-white flex-shrink-0"
                        style={{ background: idx === 0 ? "#0F2854" : idx === 1 ? "#1C4D8D" : "#4988C4" }}>
                        {idx + 1}
                      </div>
                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-[13.5px] font-bold truncate" style={{ color: "#0F2854" }}>
                            {career.title}
                          </p>
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0"
                            style={{ background: scoreBg, color: scoreColor }}>
                            {statusLabel}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 sm:gap-3 mt-1 flex-wrap">
                          <span className="text-[11px] text-gray-400">{career.category}</span>
                          {career.skillGaps?.length > 0 && (
                            <span className="text-[11px] text-gray-400">
                              {career.skillGaps.length} gap{career.skillGaps.length !== 1 ? "s" : ""} to fill
                            </span>
                          )}
                          {salaryLabel && (
                            <span className="text-[11px] font-medium" style={{ color: "#1C4D8D" }}>
                              {salaryLabel}
                            </span>
                          )}
                        </div>
                        {/* Match bar */}
                        <div className="mt-1.5 flex items-center gap-2">
                          <div className="flex-1 h-1 rounded-full overflow-hidden" style={{ background: "#eef3fa", maxWidth: "120px" }}>
                            <div className="h-full rounded-full transition-all duration-700"
                              style={{ width: `${score}%`, background: scoreColor }} />
                          </div>
                          <span className="text-[10.5px] font-bold" style={{ color: scoreColor }}>{score}%</span>
                        </div>
                      </div>
                      {/* Actions */}
                      <Link to="/recommendations"
                        className="flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
                        style={{ background: "rgba(15,40,84,0.07)" }}>
                        <ArrowRight className="w-3.5 h-3.5" style={{ color: "#0F2854" }} />
                      </Link>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="px-5 py-10 flex flex-col items-center justify-center text-center">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-3"
                  style={{ background: "rgba(73,136,196,0.1)" }}>
                  <Target className="w-6 h-6" style={{ color: "#4988C4" }} />
                </div>
                <p className="font-bold text-sm" style={{ color: "#0F2854" }}>No recommendations yet</p>
                <p className="text-xs text-gray-400 mt-1 mb-4 max-w-xs">
                  Complete your profile and generate AI-powered career matches tailored to Nigeria's job market.
                </p>
                <Link to="/recommendations"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white"
                  style={{ background: "#0F2854" }}>
                  <Zap className="w-4 h-4" /> Generate Now
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Right col (1/3): Skill chart + Activity */}
        <div className="space-y-4">
          {/* Skill radar */}
          <div className="bg-white rounded-2xl overflow-hidden" style={{ border: "1px solid #eef3fa", boxShadow: "0 2px 10px rgba(0,0,0,0.04)" }}>
            <div className="flex items-center justify-between px-5 py-3.5" style={{ borderBottom: "1px solid #f0f5fb" }}>
              <div>
                <p className="text-[13px] font-bold" style={{ color: "#0F2854" }}>Skill Overview</p>
                <p className="text-[11px] text-gray-400 mt-0.5">Your top skills at a glance</p>
              </div>
              <Link to="/profile" className="text-[11px] font-semibold px-2.5 py-1 rounded-lg hover:opacity-75"
                style={{ background: "rgba(28,77,141,0.08)", color: "#1C4D8D" }}>
                Edit
              </Link>
            </div>
            <div className="p-4">
              {profile?.skills?.length > 0 ? (
                <SkillRadarChart skills={profile.skills} />
              ) : (
                <div className="flex flex-col items-center justify-center h-40 text-center">
                  <Award className="w-8 h-8 mb-2" style={{ color: "#cddff5" }} />
                  <p className="text-sm font-semibold text-gray-600 mb-1">No skills yet</p>
                  <Link to="/profile" className="text-xs font-semibold hover:underline" style={{ color: "#1C4D8D" }}>
                    Add skills →
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Activity feed */}
          <div className="bg-white rounded-2xl overflow-hidden" style={{ border: "1px solid #eef3fa", boxShadow: "0 2px 10px rgba(0,0,0,0.04)" }}>
            <div className="flex items-center gap-2 px-5 py-3.5" style={{ borderBottom: "1px solid #f0f5fb" }}>
              <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "rgba(15,40,84,0.08)" }}>
                <Clock className="w-3.5 h-3.5" style={{ color: "#0F2854" }} />
              </div>
              <p className="text-[13px] font-bold" style={{ color: "#0F2854" }}>Recent Activity</p>
            </div>
            <div className="p-4">
              {loadingActivities ? (
                <div className="space-y-3">
                  {[0, 1, 2].map((i) => (
                    <div key={i} className="flex items-center gap-3 animate-pulse">
                      <div className="w-7 h-7 rounded-full bg-gray-100 shrink-0" />
                      <div className="flex-1 space-y-1.5">
                        <div className="h-2.5 w-3/4 rounded bg-gray-100" />
                        <div className="h-2 w-1/2 rounded bg-gray-100" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <ActivityFeed activities={activities} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
