import { useEffect, useMemo, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import api from "../services/api";
import { fetchProfile } from "../store/slices/profileSlice";
import { fetchMarketData } from "../store/slices/marketSlice";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import {
  TrendingUp,
  Briefcase,
  DollarSign,
  CheckCircle2,
  XCircle,
  Award,
  Target,
  ChevronRight,
  ArrowUpRight,
  BookOpen,
  Settings,
  ExternalLink,
  RefreshCw,
  MapPin,
  Building2,
} from "lucide-react";

const DEMAND_COLOR = {
  "Very High": "#22c55e",
  High:        "#3b82f6",
  Medium:      "#f59e0b",
  Low:         "#ef4444",
};
const DEMAND_BG = {
  "Very High": "#dcfce7",
  High:        "#dbeafe",
  Medium:      "#fef9c3",
  Low:         "#fee2e2",
};
const DEMAND_DESC = {
  "Very High": "Employers are actively hiring — strong job market",
  High:        "Good availability of roles in this field",
  Medium:      "Moderate number of openings available",
  Low:         "Fewer openings — consider upskilling or adjacent roles",
};

export default function MarketTrendsPage() {
  const dispatch = useDispatch();
  const { profile } = useSelector((s) => s.profile);
  const { careers, loading } = useSelector((s) => s.market);

  // Live jobs from Adzuna
  const [liveJobs, setLiveJobs]           = useState([]);
  const [liveTotal, setLiveTotal]         = useState(null);
  const [liveLoading, setLiveLoading]     = useState(false);
  const [liveError, setLiveError]         = useState(null);

  useEffect(() => {
    dispatch(fetchProfile());
    dispatch(fetchMarketData());
  }, [dispatch]);

  const fetchLiveJobs = useCallback(async (query) => {
    setLiveLoading(true);
    setLiveError(null);
    try {
      const { data } = await api.get("/market/live-jobs", { params: { query } });
      setLiveJobs(data.jobs || []);
      setLiveTotal(data.total ?? null);
    } catch (err) {
      setLiveError(
        err.response?.data?.message || "Could not load live jobs right now."
      );
    } finally {
      setLiveLoading(false);
    }
  }, []);

  const targetCareerData = useMemo(() => {
    if (!profile?.targetCareer || !careers.length) return null;
    const q = profile.targetCareer.toLowerCase().trim();
    let match = careers.find((c) => c.title.toLowerCase() === q);
    if (!match)
      match = careers.find(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          q.includes(c.title.toLowerCase())
      );
    if (!match) {
      const words = q.split(/\s+/).filter((w) => w.length > 3);
      if (words.length) {
        match = careers.find(
          (c) =>
            words.filter((w) => c.title.toLowerCase().includes(w)).length >=
            Math.ceil(words.length / 2)
        );
      }
    }
    return match || null;
  }, [profile, careers]);

  // Fetch live Adzuna jobs whenever target career resolves
  useEffect(() => {
    const query = targetCareerData?.title || profile?.targetCareer;
    if (query) fetchLiveJobs(query);
  }, [targetCareerData, profile?.targetCareer, fetchLiveJobs]);

  const growthRank = useMemo(() => {
    if (!targetCareerData) return null;
    const sorted = [...careers]
      .filter((c) => c.growthRate != null)
      .sort((a, b) => b.growthRate - a.growthRate);
    const idx = sorted.findIndex((c) => c.careerId === targetCareerData.careerId);
    return idx >= 0 ? { rank: idx + 1, total: sorted.length } : null;
  }, [targetCareerData, careers]);

  const salaryRank = useMemo(() => {
    if (!targetCareerData?.averageSalary?.mid) return null;
    const sorted = [...careers]
      .filter((c) => c.averageSalary?.mid)
      .sort((a, b) => b.averageSalary.mid - a.averageSalary.mid);
    const idx = sorted.findIndex((c) => c.careerId === targetCareerData.careerId);
    return idx >= 0 ? { rank: idx + 1, total: sorted.length } : null;
  }, [targetCareerData, careers]);

  const relatedCareers = useMemo(() => {
    if (!targetCareerData) return [];
    const dOrder = { "Very High": 4, High: 3, Medium: 2, Low: 1 };
    return careers
      .filter(
        (c) =>
          c.category === targetCareerData.category &&
          c.careerId !== targetCareerData.careerId
      )
      .sort(
        (a, b) => (dOrder[b.demandLevel] || 0) - (dOrder[a.demandLevel] || 0)
      )
      .slice(0, 6);
  }, [targetCareerData, careers]);

  const userSkillNames = useMemo(
    () => new Set((profile?.skills || []).map((s) => s.name?.toLowerCase())),
    [profile]
  );

  const salaryChartData = useMemo(() => {
    if (!targetCareerData?.averageSalary) return [];
    const { entry = 0, mid = 0, senior = 0 } = targetCareerData.averageSalary;
    return [
      { level: "Entry",  value: +(entry  / 1_000_000).toFixed(1), monthly: Math.round(entry  / 12 / 1000) },
      { level: "Mid",    value: +(mid    / 1_000_000).toFixed(1), monthly: Math.round(mid    / 12 / 1000) },
      { level: "Senior", value: +(senior / 1_000_000).toFixed(1), monthly: Math.round(senior / 12 / 1000) },
    ];
  }, [targetCareerData]);

  const topSkills     = targetCareerData?.topSkills || [];
  const matchedSkills = topSkills.filter((s) => userSkillNames.has(s.name?.toLowerCase()));
  const missingSkills = topSkills.filter((s) => !userSkillNames.has(s.name?.toLowerCase()));
  const matchPct = topSkills.length
    ? Math.round((matchedSkills.length / topSkills.length) * 100)
    : 0;

  // Score live jobs: match user's skills against the full job description text
  // Works for ALL career fields (healthcare, tech, education, finance…)
  const scoredJobs = useMemo(() => {
    if (!liveJobs.length) return [];
    const userSkillList = [...userSkillNames]; // e.g. ["excel", "python", "patient care"]
    return liveJobs
      .map((job) => {
        const descLower = (job.title + " " + job.description).toLowerCase();
        const youHave = userSkillList.filter((skill) => descLower.includes(skill));
        // Cap at 100% — score relative to top 5 skills to avoid inflating with tiny matches
        const jobMatchPct = userSkillList.length
          ? Math.min(100, Math.round((youHave.length / Math.min(userSkillList.length, 6)) * 100))
          : 0;
        return { ...job, youHave, jobMatchPct };
      })
      .sort((a, b) => b.jobMatchPct - a.jobMatchPct);
  }, [liveJobs, userSkillNames]);

  if (loading)
    return (
      <div className="max-w-4xl mx-auto space-y-5 animate-pulse">
        <div className="rounded-2xl h-28" style={{ background: "#0F2854" }} />
        <div className="grid grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-24 rounded-2xl bg-white" style={{ border: "1px solid #eef3fa" }} />
          ))}
        </div>
        <div className="grid lg:grid-cols-2 gap-5">
          <div className="h-72 rounded-2xl bg-white" style={{ border: "1px solid #eef3fa" }} />
          <div className="h-72 rounded-2xl bg-white" style={{ border: "1px solid #eef3fa" }} />
        </div>
        <div className="h-40 rounded-2xl bg-white" style={{ border: "1px solid #eef3fa" }} />
        <div className="h-64 rounded-2xl bg-white" style={{ border: "1px solid #eef3fa" }} />
      </div>
    );

  if (!profile?.targetCareer)
    return (
      <div className="max-w-4xl mx-auto space-y-5 animate-slide-up">
        <div className="rounded-2xl px-5 sm:px-6 py-5" style={{ background: "#0F2854" }}>
          <div className="flex items-center gap-3">
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: "rgba(189,232,245,0.12)", border: "1px solid rgba(189,232,245,0.15)" }}
            >
              <TrendingUp className="w-5 h-5" style={{ color: "#BDE8F5" }} />
            </div>
            <div>
              <h1 className="text-xl font-black text-white">Career Market Outlook</h1>
              <p className="text-sm mt-0.5" style={{ color: "rgba(189,232,245,0.65)" }}>
                Real market data for your chosen career path
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-10 text-center" style={{ border: "1px solid #eef3fa" }}>
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{ background: "#f0f5ff" }}
          >
            <Target className="w-7 h-7" style={{ color: "#4988C4" }} />
          </div>
          <h2 className="text-lg font-black mb-2" style={{ color: "#0F2854" }}>No Target Career Set</h2>
          <p className="text-sm text-gray-500 max-w-sm mx-auto mb-6 leading-relaxed">
            Set your target career in your profile and this page will show you real market
            data salary ranges, growth rate, required skills, and how you compare.
          </p>
          <Link
            to="/profile"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white hover:opacity-90 transition-opacity"
            style={{ background: "#0F2854" }}
          >
            <Settings className="w-4 h-4" /> Set Target Career in Profile
          </Link>
        </div>
      </div>
    );

  if (!targetCareerData)
    return (
      <div className="max-w-4xl mx-auto space-y-5 animate-slide-up">
        <div className="rounded-2xl px-5 sm:px-6 py-5" style={{ background: "#0F2854" }}>
          <div className="flex items-center gap-3">
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: "rgba(189,232,245,0.12)", border: "1px solid rgba(189,232,245,0.15)" }}
            >
              <TrendingUp className="w-5 h-5" style={{ color: "#BDE8F5" }} />
            </div>
            <div>
              <h1 className="text-xl font-black text-white">Career Market Outlook</h1>
              <p className="text-sm mt-0.5" style={{ color: "rgba(189,232,245,0.65)" }}>
                Target: <span className="font-bold text-white">{profile.targetCareer}</span>
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-8 text-center" style={{ border: "1px solid #eef3fa" }}>
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{ background: "#fff7ed" }}
          >
            <BookOpen className="w-6 h-6" style={{ color: "#f59e0b" }} />
          </div>
          <h2 className="text-base font-black mb-2" style={{ color: "#0F2854" }}>
            No market data found for "{profile.targetCareer}"
          </h2>
          <p className="text-sm text-gray-500 max-w-sm mx-auto mb-5 leading-relaxed">
            This career isn't in our database yet. Try updating your profile with a supported
            career title, or get AI-powered suggestions.
          </p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <Link
              to="/profile"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white hover:opacity-90 transition-opacity"
              style={{ background: "#0F2854" }}
            >
              <Settings className="w-4 h-4" /> Update Target Career
            </Link>
            <Link
              to="/recommendations"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold hover:opacity-80 transition-opacity"
              style={{ background: "#f0f5ff", color: "#1C4D8D" }}
            >
              Get AI Recommendations <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    );

  const demColor = DEMAND_COLOR[targetCareerData.demandLevel] || "#1C4D8D";
  const demBg    = DEMAND_BG[targetCareerData.demandLevel]    || "#dbeafe";

  return (
    <div className="max-w-4xl mx-auto space-y-5 animate-slide-up">

      {/* HEADER */}
      <div className="relative rounded-2xl overflow-hidden" style={{ background: "#0F2854" }}>
        <div
          className="absolute -top-12 -right-12 w-56 h-56 rounded-full pointer-events-none opacity-10"
          style={{ background: "radial-gradient(circle, #4988C4 0%, transparent 70%)" }}
        />
        <div className="relative z-10 px-5 sm:px-6 py-5 flex flex-col sm:flex-row sm:items-center gap-4">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: "rgba(189,232,245,0.12)", border: "1px solid rgba(189,232,245,0.15)" }}
          >
            <TrendingUp className="w-5 h-5" style={{ color: "#BDE8F5" }} />
          </div>
          <div className="flex-1 min-w-0">
            <p
              className="text-[11px] font-black uppercase tracking-widest mb-1"
              style={{ color: "rgba(189,232,245,0.5)" }}
            >
              YOUR CAREER MARKET OUTLOOK
            </p>
            <h1 className="text-xl sm:text-2xl font-black text-white leading-tight">
              {targetCareerData.title}
            </h1>
            <p className="text-xs sm:text-sm mt-0.5" style={{ color: "rgba(189,232,245,0.6)" }}>
              {targetCareerData.category} · Live market data for Nigeria
            </p>
          </div>
          <div className="flex-shrink-0 flex items-center gap-2">
            <span
              className="px-3 py-1.5 rounded-xl text-xs font-black"
              style={{ background: demBg, color: demColor }}
            >
              {targetCareerData.demandLevel} Demand
            </span>
            <Link
              to="/profile"
              className="w-9 h-9 rounded-xl flex items-center justify-center transition-colors hover:opacity-80"
              style={{ background: "rgba(189,232,245,0.1)", border: "1px solid rgba(189,232,245,0.18)" }}
              title="Change target career"
            >
              <Settings className="w-4 h-4" style={{ color: "#BDE8F5" }} />
            </Link>
          </div>
        </div>
      </div>

      {/* 3 KEY METRICS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div
          className="bg-white rounded-2xl p-4 transition-all hover:-translate-y-0.5"
          style={{ border: "1px solid #eef3fa", borderLeft: "4px solid #22c55e", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "#dcfce7" }}>
              <TrendingUp className="w-4 h-4" style={{ color: "#16a34a" }} />
            </div>
            {growthRank && (
              <span className="text-[10px] font-black px-2 py-0.5 rounded-lg" style={{ background: "#f0fdf4", color: "#16a34a" }}>
                #{growthRank.rank} of {growthRank.total}
              </span>
            )}
          </div>
          <p className="text-2xl font-black" style={{ color: "#0F2854" }}>
            {targetCareerData.growthRate ?? "—"}%
          </p>
          <p className="text-xs font-semibold text-gray-500 mt-0.5">Annual Growth Rate</p>
          <p className="text-[11px] text-gray-400 mt-1 leading-snug">
            {(targetCareerData.growthRate ?? 0) >= 20
              ? "Very fast-growing field"
              : (targetCareerData.growthRate ?? 0) >= 10
              ? "Healthy growth trajectory"
              : (targetCareerData.growthRate ?? 0) >= 5
              ? "Steady, moderate growth"
              : "Slower growth — competitive market"}
          </p>
        </div>

        <div
          className="bg-white rounded-2xl p-4 transition-all hover:-translate-y-0.5"
          style={{ border: "1px solid #eef3fa", borderLeft: `4px solid ${demColor}`, boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}
        >
          <div className="mb-2">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: demBg }}>
              <Briefcase className="w-4 h-4" style={{ color: demColor }} />
            </div>
          </div>
          <p className="text-2xl font-black" style={{ color: "#0F2854" }}>
            {targetCareerData.demandLevel}
          </p>
          <p className="text-xs font-semibold text-gray-500 mt-0.5">Market Demand</p>
          <p className="text-[11px] text-gray-400 mt-1 leading-snug">
            {DEMAND_DESC[targetCareerData.demandLevel] || "Demand data available"}
          </p>
        </div>

        <div
          className="bg-white rounded-2xl p-4 transition-all hover:-translate-y-0.5"
          style={{ border: "1px solid #eef3fa", borderLeft: "4px solid #4988C4", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "#eff6ff" }}>
              <DollarSign className="w-4 h-4" style={{ color: "#4988C4" }} />
            </div>
            {salaryRank && (
              <span className="text-[10px] font-black px-2 py-0.5 rounded-lg" style={{ background: "#eff6ff", color: "#1C4D8D" }}>
                #{salaryRank.rank} of {salaryRank.total}
              </span>
            )}
          </div>
          <p className="text-2xl font-black" style={{ color: "#0F2854" }}>
            {targetCareerData.averageSalary?.mid
              ? `₦${(targetCareerData.averageSalary.mid / 1_000_000).toFixed(1)}M`
              : "—"}
          </p>
          <p className="text-xs font-semibold text-gray-500 mt-0.5">Mid-level Avg. Salary / yr</p>
          <p className="text-[11px] text-gray-400 mt-1 leading-snug">
            {targetCareerData.averageSalary?.mid
              ? `~₦${Math.round(targetCareerData.averageSalary.mid / 12 / 1000)}k per month`
              : "Salary data not available"}
          </p>
        </div>
      </div>

      {/* SALARY + SKILLS */}
      <div className="grid lg:grid-cols-2 gap-5">
        <div
          className="bg-white rounded-2xl overflow-hidden"
          style={{ border: "1px solid #eef3fa", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}
        >
          <div className="px-5 py-4" style={{ borderBottom: "1px solid #f0f5fb" }}>
            <p className="text-[11px] font-black uppercase tracking-widest" style={{ color: "#9ca3af" }}>SALARY BREAKDOWN</p>
            <p className="text-[13px] font-bold mt-0.5" style={{ color: "#0F2854" }}>Annual earnings by experience level</p>
          </div>
          {salaryChartData.length > 0 ? (
            <div className="p-5">
              <ResponsiveContainer width="100%" height={150}>
                <BarChart data={salaryChartData} barSize={30}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f5fb" vertical={false} />
                  <XAxis dataKey="level" tick={{ fontSize: 12, fill: "#6B7280", fontWeight: 600 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#9CA3AF" }} unit="M" axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)", fontSize: 12 }}
                    formatter={(v) => [`₦${v}M / year`, "Salary"]}
                  />
                  <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                    <Cell fill="#6ba3d4" />
                    <Cell fill="#4988C4" />
                    <Cell fill="#0F2854" />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <div className="mt-4 divide-y" style={{ borderColor: "#f0f5fb" }}>
                {salaryChartData.map(({ level, value, monthly }, i) => (
                  <div key={level} className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ background: ["#6ba3d4","#4988C4","#0F2854"][i] }} />
                      <span className="text-[13px] font-semibold" style={{ color: "#374151" }}>{level}-level</span>
                    </div>
                    <div className="text-right">
                      <p className="text-[13px] font-black" style={{ color: "#0F2854" }}>₦{value}M / yr</p>
                      <p className="text-[11px] text-gray-400">~₦{monthly}k / month</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-5 text-center text-sm text-gray-400">No salary data available</div>
          )}
        </div>

        <div
          className="bg-white rounded-2xl overflow-hidden"
          style={{ border: "1px solid #eef3fa", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}
        >
          <div className="px-5 py-4 flex items-start justify-between gap-3" style={{ borderBottom: "1px solid #f0f5fb" }}>
            <div>
              <p className="text-[11px] font-black uppercase tracking-widest" style={{ color: "#9ca3af" }}>SKILLS REQUIRED</p>
              <p className="text-[13px] font-bold mt-0.5" style={{ color: "#0F2854" }}>Top skills for this career</p>
            </div>
            {topSkills.length > 0 && (
              <div className="flex-shrink-0 text-right">
                <p className="text-lg font-black" style={{ color: matchPct >= 60 ? "#16a34a" : matchPct >= 30 ? "#f59e0b" : "#ef4444" }}>
                  {matchPct}%
                </p>
                <p className="text-[10px] text-gray-400 font-semibold">your match</p>
              </div>
            )}
          </div>
          <div className="divide-y" style={{ borderColor: "#f7fafd" }}>
            {topSkills.length === 0 ? (
              <p className="p-5 text-sm text-gray-400 text-center">No skills data available</p>
            ) : (
              topSkills.slice(0, 8).map((skill) => {
                const has = userSkillNames.has(skill.name?.toLowerCase());
                return (
                  <div key={skill.name} className="flex items-center gap-3 px-5 py-3 hover:bg-blue-50/20 transition-colors">
                    {has
                      ? <CheckCircle2 className="w-4 h-4 flex-shrink-0" style={{ color: "#16a34a" }} />
                      : <XCircle className="w-4 h-4 flex-shrink-0 text-gray-300" />
                    }
                    <span className="flex-1 text-[13px] font-semibold" style={{ color: has ? "#0F2854" : "#6b7280" }}>
                      {skill.name}
                    </span>
                    <div className="flex items-center gap-1.5">
                      {skill.importance >= 8 && (
                        <span className="text-[10px] font-black px-2 py-0.5 rounded-lg" style={{ background: "#fff7ed", color: "#d97706" }}>
                          Essential
                        </span>
                      )}
                      {has && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg" style={{ background: "#dcfce7", color: "#16a34a" }}>
                          You have this
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
          {missingSkills.length > 0 && (
            <div className="px-5 py-3.5" style={{ background: "#fffbeb", borderTop: "1px solid #fef3c7" }}>
              <p className="text-[11px] text-gray-500 leading-relaxed">
                <span className="font-bold text-amber-600">
                  {missingSkills.length} skill{missingSkills.length !== 1 ? "s" : ""} to learn:
                </span>{" "}
                {missingSkills.slice(0, 4).map((s) => s.name).join(", ")}
                {missingSkills.length > 4 ? ` +${missingSkills.length - 4} more` : ""}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* MARKET POSITION */}
      {(growthRank || salaryRank) && (
        <div
          className="bg-white rounded-2xl overflow-hidden"
          style={{ border: "1px solid #eef3fa", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}
        >
          <div className="px-5 py-4" style={{ borderBottom: "1px solid #f0f5fb" }}>
            <p className="text-[11px] font-black uppercase tracking-widest" style={{ color: "#9ca3af" }}>MARKET POSITION</p>
            <p className="text-[13px] font-bold mt-0.5" style={{ color: "#0F2854" }}>
              How {targetCareerData.title} ranks among all careers in Nigeria
            </p>
          </div>
          <div className="grid grid-cols-2 divide-x" style={{ borderColor: "#f0f5fb" }}>
            {growthRank && (
              <div className="p-5 text-center">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-2" style={{ background: "#f0fdf4" }}>
                  <TrendingUp className="w-5 h-5" style={{ color: "#16a34a" }} />
                </div>
                <p className="text-3xl font-black" style={{ color: "#0F2854" }}>#{growthRank.rank}</p>
                <p className="text-xs font-semibold text-gray-500 mt-0.5">Growth Rank</p>
                <p className="text-[11px] text-gray-400 mt-0.5">out of {growthRank.total} careers</p>
                <div className="mt-3 h-2 rounded-full overflow-hidden" style={{ background: "#f1f5f9" }}>
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${100 - (((growthRank.rank - 1) / growthRank.total) * 100)}%`,
                      background: "linear-gradient(90deg, #22c55e, #4ade80)",
                    }}
                  />
                </div>
                <p className="text-[10px] text-gray-400 mt-1.5">
                  Better than {Math.round(((growthRank.total - growthRank.rank) / growthRank.total) * 100)}% of careers
                </p>
              </div>
            )}
            {salaryRank && (
              <div className="p-5 text-center">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-2" style={{ background: "#eff6ff" }}>
                  <Award className="w-5 h-5" style={{ color: "#4988C4" }} />
                </div>
                <p className="text-3xl font-black" style={{ color: "#0F2854" }}>#{salaryRank.rank}</p>
                <p className="text-xs font-semibold text-gray-500 mt-0.5">Salary Rank</p>
                <p className="text-[11px] text-gray-400 mt-0.5">out of {salaryRank.total} careers</p>
                <div className="mt-3 h-2 rounded-full overflow-hidden" style={{ background: "#f1f5f9" }}>
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${100 - (((salaryRank.rank - 1) / salaryRank.total) * 100)}%`,
                      background: "linear-gradient(90deg, #4988C4, #6ba3d4)",
                    }}
                  />
                </div>
                <p className="text-[10px] text-gray-400 mt-1.5">
                  Better than {Math.round(((salaryRank.total - salaryRank.rank) / salaryRank.total) * 100)}% of careers
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* RELATED CAREERS */}
      {relatedCareers.length > 0 && (
        <div
          className="bg-white rounded-2xl overflow-hidden"
          style={{ border: "1px solid #eef3fa", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}
        >
          <div
            className="px-5 py-3.5 flex items-center justify-between"
            style={{ borderBottom: "1px solid #f0f5fb" }}
          >
            <div>
              <p className="text-[11px] font-black uppercase tracking-widest" style={{ color: "#9ca3af" }}>RELATED CAREERS</p>
              <p className="text-[12px] text-gray-400 mt-0.5">
                Other {targetCareerData.category} careers you might consider
              </p>
            </div>
            <span className="text-[11px] text-gray-400">{relatedCareers.length} careers</span>
          </div>
          <div className="divide-y" style={{ borderColor: "#f7fafd" }}>
            {relatedCareers.map((career) => {
              const dc = DEMAND_COLOR[career.demandLevel] || "#1C4D8D";
              const db = DEMAND_BG[career.demandLevel]    || "#dbeafe";
              return (
                <div
                  key={career.careerId}
                  className="flex items-center gap-4 px-5 py-3.5 hover:bg-blue-50/20 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-[13.5px] font-bold leading-tight" style={{ color: "#0F2854" }}>{career.title}</p>
                      <span className="text-[10px] font-black px-2 py-0.5 rounded-lg" style={{ background: db, color: dc }}>
                        {career.demandLevel}
                      </span>
                    </div>
                    <p className="text-[11.5px] text-gray-400 mt-0.5 truncate">{career.description}</p>
                  </div>
                  <div className="hidden sm:flex items-center gap-4 flex-shrink-0 text-right">
                    {career.growthRate != null && (
                      <div>
                        <p className="text-[13px] font-black" style={{ color: "#16a34a" }}>{career.growthRate}%</p>
                        <p className="text-[10px] text-gray-400">growth</p>
                      </div>
                    )}
                    {career.averageSalary?.mid && (
                      <div>
                        <p className="text-[13px] font-black" style={{ color: "#4988C4" }}>
                          ₦{(career.averageSalary.mid / 1_000_000).toFixed(1)}M
                        </p>
                        <p className="text-[10px] text-gray-400">mid / yr</p>
                      </div>
                    )}
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-gray-300 flex-shrink-0" />
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* LIVE JOBS */}
      <div
        className="bg-white rounded-2xl overflow-hidden"
        style={{ border: "1px solid #eef3fa", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}
      >
        <div
          className="px-5 py-3.5 flex items-center justify-between"
          style={{ borderBottom: "1px solid #f0f5fb" }}
        >
          <div>
            <p className="text-[11px] font-black uppercase tracking-widest" style={{ color: "#9ca3af" }}>
              LIVE JOB OPENINGS
            </p>
            <p className="text-[12px] text-gray-400 mt-0.5">
              Open roles for{" "}
              <span className="font-semibold" style={{ color: "#0F2854" }}>
                {targetCareerData?.title || profile?.targetCareer}
              </span>
              {" "} sorted by your skill match
              {liveTotal !== null && !liveLoading && (
                <span className="ml-1">({liveTotal} found)</span>
              )}
            </p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <a
              href="https://www.themuse.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] font-semibold text-gray-400 hover:text-gray-600 transition-colors"
            >
              via The Muse
            </a>
            <button
              onClick={() => {
                const q = targetCareerData?.title || profile?.targetCareer;
                if (q) fetchLiveJobs(q);
              }}
              disabled={liveLoading}
              className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors hover:bg-gray-100 disabled:opacity-40"
              style={{ border: "1px solid #e5edf6" }}
              title="Refresh"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-gray-400 ${liveLoading ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>

        {liveLoading ? (
          <div className="divide-y" style={{ borderColor: "#f7fafd" }}>
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-4 px-5 py-4 animate-pulse">
                <div className="w-9 h-9 rounded-xl flex-shrink-0" style={{ background: "#f1f5f9" }} />
                <div className="flex-1 space-y-2">
                  <div className="h-3.5 w-48 rounded-md" style={{ background: "#f1f5f9" }} />
                  <div className="h-3 w-32 rounded-md" style={{ background: "#f8fafc" }} />
                </div>
                <div className="h-8 w-20 rounded-xl hidden sm:block" style={{ background: "#f1f5f9" }} />
              </div>
            ))}
          </div>
        ) : liveError ? (
          <div className="px-5 py-8 text-center">
            <p className="text-sm font-semibold text-amber-600 mb-1">Could not load live jobs</p>
            <p className="text-xs text-gray-400 max-w-sm mx-auto leading-relaxed">{liveError}</p>
          </div>
        ) : liveJobs.length === 0 ? (
          <div className="px-5 py-8 text-center text-sm text-gray-400">
            No live listings found for this role right now.
          </div>
        ) : (
          <div className="divide-y" style={{ borderColor: "#f7fafd" }}>
            {scoredJobs.map((job, idx) => (
              <div
                key={job.id}
                className="flex items-start gap-3 sm:gap-4 px-5 py-4 hover:bg-blue-50/20 transition-colors"
              >
                {/* Company avatar with match ring for top picks */}
                <div className="relative flex-shrink-0 mt-0.5">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-black text-sm"
                    style={{ background: job.jobMatchPct >= 50 ? "#1C4D8D" : "#0F2854" }}
                  >
                    {job.company?.[0]?.toUpperCase() || "J"}
                  </div>
                  {idx === 0 && scoredJobs.length > 1 && (
                    <span
                      className="absolute -top-1.5 -right-1.5 text-[9px] font-black px-1 rounded-md text-white"
                      style={{ background: "#22c55e" }}
                    >
                      #1
                    </span>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start gap-2 flex-wrap">
                    <p className="text-[13.5px] font-bold leading-snug" style={{ color: "#0F2854" }}>
                      {job.title}
                    </p>
                    {job.jobMatchPct > 0 && (
                      <span
                        className="inline-flex items-center gap-1 text-[10px] font-black px-1.5 py-0.5 rounded-lg flex-shrink-0"
                        style={{
                          background: job.jobMatchPct >= 60 ? "#dcfce7" : job.jobMatchPct >= 30 ? "#dbeafe" : "#f1f5f9",
                          color:      job.jobMatchPct >= 60 ? "#16a34a" : job.jobMatchPct >= 30 ? "#1C4D8D" : "#6b7280",
                        }}
                      >
                        <CheckCircle2 className="w-2.5 h-2.5" />
                        {job.jobMatchPct}% skill match
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3 mt-1 flex-wrap">
                    <span className="flex items-center gap-1 text-[11.5px] text-gray-500">
                      <Building2 className="w-3 h-3" /> {job.company}
                    </span>
                    <span className="flex items-center gap-1 text-[11.5px] text-gray-400">
                      <MapPin className="w-3 h-3" /> {job.location}
                    </span>
                    {job.salary && (
                      <span className="text-[11.5px] font-semibold" style={{ color: "#16a34a" }}>
                        {job.salary}
                      </span>
                    )}
                    {job.type && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg" style={{ background: "#f0f5ff", color: "#1C4D8D" }}>
                        {job.type}
                      </span>
                    )}
                  </div>

                  {/* Show matched skills below meta row */}
                  {job.youHave?.length > 0 && (
                    <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                      <span className="text-[10px] font-black uppercase tracking-wide" style={{ color: "#16a34a" }}>Your skills:</span>
                      {job.youHave.slice(0, 5).map((skill) => (
                        <span key={skill} className="text-[10px] px-1.5 py-0.5 rounded-md font-semibold" style={{ background: "#dcfce7", color: "#15803d", border: "1px solid #bbf7d0" }}>
                          ✓ {skill}
                        </span>
                      ))}
                    </div>
                  )}
                  {/* Category tags */}
                  {job.tags?.length > 0 && (
                    <div className="flex gap-1.5 mt-1.5 flex-wrap">
                      {job.tags.map((tag) => (
                        <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded-md font-medium" style={{ background: "#f7faff", color: "#6b7280", border: "1px solid #eef3fa" }}>{tag}</span>
                      ))}
                    </div>
                  )}
                </div>

                <a
                  href={job.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[12px] font-bold text-white flex-shrink-0 hover:opacity-90 transition-opacity mt-0.5"
                  style={{ background: "#1C4D8D" }}
                >
                  <span className="hidden sm:inline">Apply</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
