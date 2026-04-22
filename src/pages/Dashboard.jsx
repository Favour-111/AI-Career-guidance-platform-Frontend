import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchProfile } from "../store/slices/profileSlice";
import { fetchRecommendations } from "../store/slices/recommendationSlice";
import SkillRadarChart from "../components/dashboard/SkillRadarChart";
import ActivityFeed from "../components/dashboard/ActivityFeed";
import CareerCard from "../components/career/CareerCard";
import Spinner from "../components/common/Spinner";
import {
  SkeletonStatCard,
  SkeletonCareerCard,
} from "../components/common/Skeleton";
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
} from "lucide-react";

export default function Dashboard() {
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);
  const { profile } = useSelector((s) => s.profile);
  const { recommendation, loading: recLoading } = useSelector(
    (s) => s.recommendations,
  );
  const [activities, setActivities] = useState([]);
  const [loadingActivities, setLoadingActivities] = useState(true);

  useEffect(() => {
    dispatch(fetchProfile());
    dispatch(fetchRecommendations());
    if (user?.role === "admin") {
      api
        .get("/admin/stats")
        .then(({ data }) => setActivities(data.recentActivity || []))
        .catch(() => {})
        .finally(() => setLoadingActivities(false));
    } else {
      api
        .get("/profile/activity")
        .then(({ data }) => setActivities(data.activities || []))
        .catch(() => {})
        .finally(() => setLoadingActivities(false));
    }
  }, [dispatch]);

  const topCareers = recommendation?.careers?.slice(0, 3) || [];
  const profileCompletion = profile?.completionPercentage || 0;
  const skillCount = profile?.skills?.length || 0;
  const careerCount = user?.bookmarkedCareers?.length || 0;
  const recommendationCount = recommendation?.careers?.length || 0;

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-slide-up">
      {/* ── Hero Welcome Banner ── */}
      <div
        className="relative rounded-3xl overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, #091B3A 0%, #0F2854 45%, #1C4D8D 100%)",
          boxShadow: "0 20px 60px rgba(9,27,58,0.45)",
        }}
      >
        {/* Decorative mesh blobs */}
        <div
          className="absolute -top-20 -right-20 w-72 h-72 rounded-full opacity-20 pointer-events-none"
          style={{
            background: "radial-gradient(circle, #4988C4 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute -bottom-16 left-10 w-56 h-56 rounded-full opacity-10 pointer-events-none"
          style={{
            background: "radial-gradient(circle, #BDE8F5 0%, transparent 70%)",
          }}
        />

        {/* Top shimmer line */}
        <div
          className="h-px w-full"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, rgba(189,232,245,0.5) 50%, transparent 100%)",
          }}
        />

        <div className="relative z-10 p-6 md:p-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
            {/* Left: Greeting + CTA */}
            <div className="flex-1 min-w-0">
              {/* Pill badge */}
              <div
                className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-full border"
                style={{
                  borderColor: "rgba(189,232,245,0.2)",
                  background: "rgba(189,232,245,0.08)",
                }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full animate-pulse"
                  style={{ background: "#BDE8F5" }}
                />
                <span
                  className="text-xs font-semibold tracking-widest uppercase"
                  style={{ color: "#BDE8F5" }}
                >
                  {greeting}
                </span>
              </div>

              <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight leading-none">
                Welcome back,{" "}
                <span
                  className="inline-block"
                  style={{
                    background: "linear-gradient(90deg, #BDE8F5, #fff)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  {user?.name?.split(" ")[0]}
                </span>
              </h1>

              <p
                className="mt-3 text-sm leading-relaxed max-w-md"
                style={{ color: "rgba(189,232,245,0.65)" }}
              >
                {profileCompletion < 80
                  ? `Your profile is ${profileCompletion}% complete — finish it to unlock sharper AI career matches.`
                  : "Your profile is in great shape. Here are your latest career insights."}
              </p>

              {/* CTA buttons */}
              <div className="flex flex-wrap gap-3 mt-6">
                {!recommendation && (
                  <Link
                    to="/recommendations"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 hover:scale-105 active:scale-95"
                    style={{
                      background: "linear-gradient(135deg, #4988C4, #1C4D8D)",
                      color: "#fff",
                      boxShadow: "0 4px 16px rgba(73,136,196,0.4)",
                    }}
                  >
                    <Sparkles className="w-4 h-4" />
                    Generate AI Matches
                  </Link>
                )}
                <Link
                  to="/profile"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold backdrop-blur transition-all duration-200 hover:scale-105 active:scale-95"
                  style={{
                    border: "1.5px solid rgba(189,232,245,0.25)",
                    background: "rgba(189,232,245,0.07)",
                    color: "#BDE8F5",
                  }}
                >
                  <User className="w-4 h-4" />
                  Edit Profile
                </Link>
                <Link
                  to="/market-trends"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold backdrop-blur transition-all duration-200 hover:scale-105 active:scale-95"
                  style={{
                    border: "1.5px solid rgba(189,232,245,0.25)",
                    background: "rgba(189,232,245,0.07)",
                    color: "#BDE8F5",
                  }}
                >
                  <TrendingUp className="w-4 h-4" />
                  Market Trends
                </Link>
              </div>
            </div>

            {/* Right: Profile ring + field tag */}
            <div className="flex-shrink-0 flex flex-col items-center gap-3">
              {/* Outer glow ring */}
              <div className="relative">
                <div
                  className="absolute inset-0 rounded-full blur-xl opacity-30"
                  style={{
                    background: "radial-gradient(circle, #4988C4, transparent)",
                  }}
                />
                <div className="relative w-28 h-28">
                  <svg className="w-28 h-28 -rotate-90" viewBox="0 0 112 112">
                    {/* Track */}
                    <circle
                      cx="56"
                      cy="56"
                      r="48"
                      fill="none"
                      stroke="rgba(255,255,255,0.08)"
                      strokeWidth="7"
                    />
                    {/* Low progress accent arc */}
                    <circle
                      cx="56"
                      cy="56"
                      r="48"
                      fill="none"
                      stroke="rgba(189,232,245,0.15)"
                      strokeWidth="7"
                      strokeDasharray={`${2 * Math.PI * 48}`}
                      strokeDashoffset={0}
                    />
                    {/* Progress arc */}
                    <circle
                      cx="56"
                      cy="56"
                      r="48"
                      fill="none"
                      stroke="url(#ringGrad)"
                      strokeWidth="7"
                      strokeLinecap="round"
                      strokeDasharray={`${2 * Math.PI * 48}`}
                      strokeDashoffset={`${2 * Math.PI * 48 * (1 - profileCompletion / 100)}`}
                      className="transition-all duration-1000"
                    />
                    <defs>
                      <linearGradient
                        id="ringGrad"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="0%"
                      >
                        <stop offset="0%" stopColor="#BDE8F5" />
                        <stop offset="100%" stopColor="#4988C4" />
                      </linearGradient>
                    </defs>
                  </svg>
                  {/* Center content */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-black text-white leading-none">
                      {profileCompletion}%
                    </span>
                    <span
                      className="text-xs mt-0.5"
                      style={{ color: "rgba(189,232,245,0.6)" }}
                    >
                      complete
                    </span>
                  </div>
                </div>
              </div>

              <span
                className="text-xs font-semibold tracking-wide px-3 py-1 rounded-full"
                style={{
                  background: "rgba(189,232,245,0.1)",
                  color: "rgba(189,232,245,0.75)",
                  border: "1px solid rgba(189,232,245,0.15)",
                }}
              >
                Profile Score
              </span>

              {profile?.fieldOfStudy && (
                <span
                  className="text-xs font-semibold px-3 py-1 rounded-full"
                  style={{
                    background: "rgba(73,136,196,0.2)",
                    color: "#BDE8F5",
                    border: "1px solid rgba(73,136,196,0.3)",
                  }}
                >
                  {profile.fieldOfStudy}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Bottom shimmer line */}
        <div
          className="h-px w-full"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, rgba(189,232,245,0.15) 50%, transparent 100%)",
          }}
        />
      </div>

      {/* ── Stat Strip ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Skills",
            value: skillCount,
            sub: "In your profile",
            icon: Star,
            gradient: "linear-gradient(135deg, #0F2854, #1C4D8D)",
            glow: "rgba(15,40,84,0.25)",
            link: "/profile",
          },
          {
            label: "AI Matches",
            value: recommendationCount,
            sub: "Career suggestions",
            icon: Lightbulb,
            gradient: "linear-gradient(135deg, #1C4D8D, #4988C4)",
            glow: "rgba(28,77,141,0.2)",
            link: "/recommendations",
          },
          {
            label: "Bookmarked",
            value: careerCount,
            sub: "Saved careers",
            icon: BookOpen,
            gradient: "linear-gradient(135deg, #4988C4, #6ba3d4)",
            glow: "rgba(73,136,196,0.2)",
            link: "/recommendations",
          },
          {
            label: "Profile Score",
            value: `${profileCompletion}%`,
            sub: profileCompletion >= 80 ? "Looking great!" : "Tap to improve",
            icon: Activity,
            gradient:
              profileCompletion >= 80
                ? "linear-gradient(135deg, #1C4D8D, #4988C4)"
                : "linear-gradient(135deg, #0F2854, #1C4D8D)",
            glow: "rgba(15,40,84,0.2)",
            link: "/profile",
            progress: profileCompletion,
          },
        ].map(
          ({
            label,
            value,
            sub,
            icon: Icon,
            gradient,
            glow,
            link,
            progress,
          }) => (
            <Link
              key={label}
              to={link}
              className="group relative rounded-2xl p-5 overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              style={{
                background: "white",
                boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
              }}
            >
              {/* Top color bar */}
              <div
                className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl"
                style={{ background: gradient }}
              />

              <div className="flex items-start justify-between mb-4">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center shadow-sm transition-transform duration-300 group-hover:scale-110"
                  style={{
                    background: gradient,
                    boxShadow: `0 4px 14px ${glow}`,
                  }}
                >
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <ChevronRight
                  className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-x-0 group-hover:translate-x-1"
                  style={{ color: "#1C4D8D" }}
                />
              </div>

              <p className="text-2xl font-black text-gray-900 leading-none">
                {value}
              </p>
              <p className="text-sm font-bold text-gray-700 mt-1">{label}</p>
              <p className="text-xs text-gray-400 mt-0.5">{sub}</p>

              {progress !== undefined && (
                <div
                  className="mt-3 h-1 rounded-full overflow-hidden"
                  style={{ background: "rgba(15,40,84,0.08)" }}
                >
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${progress}%`, background: gradient }}
                  />
                </div>
              )}
            </Link>
          ),
        )}
      </div>

      {/* Main Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-dark-card rounded-2xl shadow-card p-6 lg:col-span-1">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-base font-bold text-gray-900 dark:text-white">
                Skill Overview
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">
                Your top skills at a glance
              </p>
            </div>
            <Link
              to="/profile"
              className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all duration-200 hover:opacity-80"
              style={{ color: "#1C4D8D", background: "rgba(28,77,141,0.08)" }}
            >
              Edit <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
          {profile?.skills?.length > 0 ? (
            <SkillRadarChart skills={profile.skills} />
          ) : (
            <div className="flex flex-col items-center justify-center h-52 text-center">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mb-3"
                style={{ background: "rgba(15,40,84,0.07)" }}
              >
                <Award className="w-7 h-7" style={{ color: "#0F2854" }} />
              </div>
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                No skills yet
              </p>
              <p className="text-xs text-gray-400 mb-4">
                Add skills to see your radar chart
              </p>
              <Link
                to="/profile"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold text-white transition-all duration-200 hover:opacity-90"
                style={{ background: "#0F2854" }}
              >
                <Star className="w-3.5 h-3.5" />
                Add Skills
              </Link>
            </div>
          )}
        </div>

        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-gray-900 dark:text-white">
                Top Career Matches
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">
                AI-powered recommendations for you
              </p>
            </div>
            <Link
              to="/recommendations"
              className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all duration-200 hover:opacity-80"
              style={{ color: "#1C4D8D", background: "rgba(28,77,141,0.08)" }}
            >
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          {recLoading ? (
            <div className="space-y-3">
              {[0, 1, 2].map((i) => (
                <SkeletonCareerCard key={i} />
              ))}
            </div>
          ) : topCareers.length > 0 ? (
            <div className="space-y-3">
              {topCareers.map((career, idx) => (
                <div key={career.careerId} className="relative pl-4">
                  <span
                    className="absolute left-0 top-4 w-6 h-6 rounded-full text-xs font-bold text-white flex items-center justify-center shadow z-10"
                    style={{
                      background:
                        idx === 0
                          ? "#0F2854"
                          : idx === 1
                            ? "#1C4D8D"
                            : "#4988C4",
                    }}
                  >
                    {idx + 1}
                  </span>
                  <CareerCard career={career} />
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white dark:bg-dark-card rounded-2xl shadow-card p-10 flex flex-col items-center justify-center text-center">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
                style={{ background: "rgba(73,136,196,0.12)" }}
              >
                <Target className="w-8 h-8" style={{ color: "#4988C4" }} />
              </div>
              <p className="font-bold text-gray-800 dark:text-white mb-1">
                No recommendations yet
              </p>
              <p className="text-sm text-gray-400 mb-5 max-w-xs">
                Complete your profile and generate AI-powered career matches
                tailored to you.
              </p>
              <Link
                to="/recommendations"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-200 hover:opacity-90 active:scale-95"
                style={{
                  background:
                    "linear-gradient(135deg, #0F2854 0%, #1C4D8D 100%)",
                }}
              >
                <Zap className="w-4 h-4" />
                Generate Now
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Activity Feed */}
      <div className="bg-white dark:bg-dark-card rounded-2xl shadow-card overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-dark-border">
          <div>
            <h2 className="text-base font-bold text-gray-900 dark:text-white">
              Recent Activity
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Your latest actions on the platform
            </p>
          </div>
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: "rgba(15,40,84,0.07)" }}
          >
            <TrendingUp className="w-4 h-4" style={{ color: "#0F2854" }} />
          </div>
        </div>
        <div className="p-6">
          {loadingActivities ? (
            <div className="space-y-3">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 animate-pulse"
                >
                  <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 shrink-0" />
                  <div className="flex-1 space-y-1.5">
                    <div className="h-3 w-3/4 rounded bg-gray-200 dark:bg-gray-700" />
                    <div className="h-2.5 w-1/2 rounded bg-gray-200 dark:bg-gray-700" />
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
  );
}
