import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProfile } from "../store/slices/profileSlice";
import { fetchMarketData } from "../store/slices/marketSlice";
import Spinner from "../components/common/Spinner";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  AreaChart,
  Area,
} from "recharts";
import {
  TrendingUp,
  Search,
  Briefcase,
  DollarSign,
  Zap,
  User,
} from "lucide-react";

// Maps fieldOfStudy → MarketData category
const FIELD_TO_CATEGORY = {
  Technology: "Technology",
  "Medical & Health": "Medical & Health",
  "Finance & Economics": "Finance & Economics",
  "Arts & Humanities": "Arts & Humanities",
  Engineering: "Engineering",
  "Business & Management": "Business & Management",
  Law: "Law",
  Education: "Education",
  "Science & Research": "Data & AI",
};

const COLORS = [
  "#0F2854",
  "#1C4D8D",
  "#4988C4",
  "#091B3A",
  "#6ba3d4",
  "#2B6FAD",
];
const DEMAND_COLOR = {
  "Very High": "#22c55e",
  High: "#3b82f6",
  Medium: "#f59e0b",
  Low: "#ef4444",
};

export default function MarketTrendsPage() {
  const dispatch = useDispatch();
  const { profile } = useSelector((s) => s.profile);
  const { careers, skills, stats, loading } = useSelector((s) => s.market);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [autoFiltered, setAutoFiltered] = useState(false);

  useEffect(() => {
    dispatch(fetchProfile());
    dispatch(fetchMarketData());
  }, [dispatch]);

  // Auto-select the user's field of study as the active category once data loads
  useEffect(() => {
    if (!loading && !autoFiltered && profile?.fieldOfStudy) {
      const mapped =
        FIELD_TO_CATEGORY[profile.fieldOfStudy] || profile.fieldOfStudy;
      const available = new Set(careers.map((c) => c.category));
      if (available.has(mapped)) {
        setActiveCategory(mapped);
        setAutoFiltered(true);
      }
    }
  }, [loading, autoFiltered, profile, careers]);

  const categories = ["All", ...new Set(careers.map((c) => c.category))];

  const filtered = careers.filter((c) => {
    const matchSearch =
      !search || c.title.toLowerCase().includes(search.toLowerCase());
    const matchCat = activeCategory === "All" || c.category === activeCategory;
    return matchSearch && matchCat;
  });

  // Charts are scoped to the active category when one is selected
  const chartBase =
    activeCategory === "All"
      ? careers
      : careers.filter((c) => c.category === activeCategory);

  const growthData = chartBase
    .filter((c) => c.growthRate)
    .sort((a, b) => b.growthRate - a.growthRate)
    .slice(0, 8)
    .map((c) => ({
      name: c.title
        .replace(" Engineer", " Eng.")
        .replace(" Developer", " Dev."),
      growth: c.growthRate,
    }));

  const salaryData = chartBase
    .filter((c) => c.averageSalary?.mid)
    .sort((a, b) => b.averageSalary.mid - a.averageSalary.mid)
    .slice(0, 6)
    .map((c) => ({
      name: c.title.split(" ").slice(0, 2).join(" "),
      Entry: Math.round(c.averageSalary.entry / 1000),
      Mid: Math.round(c.averageSalary.mid / 1000),
      Senior: Math.round(c.averageSalary.senior / 1000),
    }));

  // Derive in-demand skills from the active category's careers
  const filteredSkills = (() => {
    const skillMap = {};
    chartBase.forEach((career) => {
      (career.topSkills || []).forEach((skill) => {
        if (!skillMap[skill.name]) {
          skillMap[skill.name] = {
            name: skill.name,
            count: 0,
            totalImportance: 0,
          };
        }
        skillMap[skill.name].count += 1;
        skillMap[skill.name].totalImportance += skill.importance || 0;
      });
    });
    return Object.values(skillMap)
      .map((s) => ({
        ...s,
        avgImportance: Math.round((s.totalImportance / s.count) * 10) / 10,
      }))
      .sort((a, b) => b.count - a.count || b.avgImportance - a.avgImportance)
      .slice(0, 12);
  })();

  const demandData =
    stats?.byDemand?.map((d) => ({
      name: d._id,
      value: d.count,
      color: DEMAND_COLOR[d._id] || "#1C4D8D",
    })) || [];

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-slide-up">
      {/* Header */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #0F2854 0%, #1C4D8D 100%)",
        }}
      >
        <div
          className="h-1 w-full"
          style={{
            background:
              "linear-gradient(90deg, transparent, #4988C4, transparent)",
          }}
        />
        <div className="p-6 md:p-8 flex items-center gap-4">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: "rgba(189,232,245,0.15)" }}
          >
            <TrendingUp className="w-6 h-6" style={{ color: "#BDE8F5" }} />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-extrabold text-white">
              Job Market Intelligence
            </h1>
            <p
              className="text-sm mt-0.5"
              style={{ color: "rgba(189,232,245,0.7)" }}
            >
              Explore live demand, salary benchmarks, and in-demand skills
              across all industries.
            </p>
            {profile?.fieldOfStudy && (
              <div className="flex items-center gap-2 mt-2">
                <User className="w-3.5 h-3.5" style={{ color: "#BDE8F5" }} />
                <span
                  className="text-xs font-semibold"
                  style={{ color: "#BDE8F5" }}
                >
                  Showing trends for your field:{" "}
                  <span className="underline underline-offset-2">
                    {profile.fieldOfStudy}
                  </span>
                </span>
                <button
                  onClick={() => {
                    setActiveCategory("All");
                    setAutoFiltered(true);
                  }}
                  className="text-xs ml-1 opacity-60 hover:opacity-100 transition-opacity"
                  style={{ color: "#BDE8F5" }}
                >
                  (show all)
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stats summary */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              label: "Career Paths",
              value: stats.total,
              icon: Briefcase,
              accent: "#0F2854",
              bg: "rgba(15,40,84,0.07)",
            },
            {
              label: "Avg. Growth Rate",
              value: careers.length
                ? `${Math.round(careers.reduce((a, c) => a + (c.growthRate || 0), 0) / careers.length)}%`
                : "—",
              icon: TrendingUp,
              accent: "#1C4D8D",
              bg: "rgba(28,77,141,0.08)",
            },
            {
              label: "Top Avg. Salary",
              value: (() => {
                const mids = careers
                  .filter((c) => c.averageSalary?.mid)
                  .map((c) => c.averageSalary.mid);
                return mids.length
                  ? `$${Math.round(Math.max(...mids) / 1000)}k`
                  : "—";
              })(),
              icon: DollarSign,
              accent: "#4988C4",
              bg: "rgba(73,136,196,0.10)",
            },
            {
              label: "In-Demand Skills",
              value: skills.length,
              icon: Zap,
              accent: "#0F2854",
              bg: "rgba(15,40,84,0.07)",
            },
          ].map(({ label, value, icon: Icon, accent, bg }) => (
            <div
              key={label}
              className="card border-l-4"
              style={{ borderLeftColor: accent }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                style={{ background: bg }}
              >
                <Icon className="w-5 h-5" style={{ color: accent }} />
              </div>
              <p className="text-2xl font-extrabold text-gray-900 dark:text-white">
                {value}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                {label}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Charts row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Growth rate chart */}
        <div className="card">
          <h2 className="section-title mb-5">
            Top Career Growth Rates (%)
            {activeCategory !== "All" && (
              <span className="ml-2 text-xs font-normal text-gray-400">
                — {activeCategory}
              </span>
            )}
          </h2>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={growthData} layout="vertical" barSize={14}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#E5E7EB"
                horizontal={false}
              />
              <XAxis
                type="number"
                tick={{ fontSize: 11, fill: "#9CA3AF" }}
                unit="%"
              />
              <YAxis
                type="category"
                dataKey="name"
                tick={{ fontSize: 10, fill: "#6B7280" }}
                width={100}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: 12,
                  border: "none",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                  fontSize: 12,
                }}
                formatter={(v) => [`${v}%`, "Growth"]}
              />
              <Bar dataKey="growth" fill="#0F2854" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Salary comparison */}
        <div className="card">
          <h2 className="section-title mb-5">
            Salary Comparison ($k / year)
            {activeCategory !== "All" && (
              <span className="ml-2 text-xs font-normal text-gray-400">
                — {activeCategory}
              </span>
            )}
          </h2>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={salaryData} barSize={10}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="name" tick={{ fontSize: 9, fill: "#6B7280" }} />
              <YAxis tick={{ fontSize: 11, fill: "#9CA3AF" }} unit="k" />
              <Tooltip
                contentStyle={{
                  borderRadius: 12,
                  border: "none",
                  fontSize: 12,
                }}
                formatter={(v) => [`$${v}k`, ""]}
              />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="Entry" fill="#6ba3d4" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Mid" fill="#4988C4" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Senior" fill="#0F2854" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Demand distribution + Top skills */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="section-title mb-5">Demand Distribution</h2>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={demandData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={85}
                dataKey="value"
                paddingAngle={3}
              >
                {demandData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  borderRadius: 12,
                  border: "none",
                  fontSize: 12,
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h2 className="section-title mb-4">
            Top In-Demand Skills
            {activeCategory !== "All" && (
              <span className="ml-2 text-xs font-normal text-gray-400">
                — {activeCategory}
              </span>
            )}
          </h2>
          <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
            {filteredSkills.length === 0 ? (
              <p className="text-xs text-gray-400">
                No skill data available for this category.
              </p>
            ) : (
              filteredSkills.map((skill, i) => (
                <div key={skill.name} className="flex items-center gap-3">
                  <span className="text-xs font-bold text-gray-400 w-5">
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between mb-0.5">
                      <span className="text-xs font-semibold text-gray-700 dark:text-gray-200 truncate">
                        {skill.name}
                      </span>
                      <span className="text-xs text-gray-400">
                        {skill.count} {skill.count === 1 ? "career" : "careers"}
                      </span>
                    </div>
                    <div className="skill-bar h-1.5">
                      <div
                        className="skill-bar-fill"
                        style={{
                          width: `${(skill.count / (filteredSkills[0]?.count || 1)) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Career browser */}
      <div className="card">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
          <h2 className="section-title">Browse All Careers</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              className="input-field pl-9 w-full sm:w-56"
              placeholder="Search careers…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Category filter */}
        <div className="flex gap-2 flex-wrap mb-5">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                activeCategory === cat
                  ? "bg-primary text-white"
                  : "bg-gray-100 dark:bg-dark-surface text-gray-600 dark:text-gray-300 hover:bg-gray-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((career) => (
            <div
              key={career.careerId}
              className="p-4 bg-surface dark:bg-dark-surface rounded-xl border dark:border-dark-border hover:border-secondary dark:hover:border-secondary transition-colors"
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-bold text-sm text-gray-900 dark:text-white leading-tight">
                  {career.title}
                </h3>
                <span
                  className={`badge ml-2 flex-shrink-0 ${
                    career.demandLevel === "Very High"
                      ? "badge-success"
                      : career.demandLevel === "High"
                        ? "badge-primary"
                        : career.demandLevel === "Medium"
                          ? "badge-warning"
                          : "badge-danger"
                  }`}
                >
                  {career.demandLevel}
                </span>
              </div>
              <p className="text-xs text-gray-400 mb-3 line-clamp-2">
                {career.description}
              </p>
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1 text-green-600 dark:text-green-400 font-semibold">
                  <TrendingUp className="w-3 h-3" />
                  {career.growthRate}% growth
                </div>
                {career.averageSalary?.mid && (
                  <span className="text-gray-500 font-medium">
                    ~${Math.round(career.averageSalary.mid / 1000)}k/yr
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
