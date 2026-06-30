import {
  Bookmark,
  BookmarkCheck,
  TrendingUp,
  Wrench,
  Briefcase,
  Globe2,
  Building2,
  Sparkles,
} from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import api from "../../services/api";
import { setUser } from "../../store/slices/authSlice";
import toast from "react-hot-toast";

const DEMAND_STYLES = {
  "Very High": { bg: "#dcfce7", color: "#15803d" },
  High: { bg: "#dbeafe", color: "#1d4ed8" },
  Medium: { bg: "#fef9c3", color: "#a16207" },
  Low: { bg: "#fee2e2", color: "#b91c1c" },
};

const normalizeSalaryAmount = (value) => {
  const amount = Number(value);
  if (!Number.isFinite(amount) || amount <= 0) return null;

  // Legacy fallback records were saved as "thousands" (e.g., 4500 means 4.5M).
  if (amount >= 1000 && amount < 1000000) {
    return amount * 1000;
  }
  return amount;
};

const formatCurrency = (value) => {
  const normalizedAmount = normalizeSalaryAmount(value);
  if (!normalizedAmount) return null;
  return `₦${(normalizedAmount / 1000000).toFixed(1)}M`;
};

const formatSalaryRange = (salaryRange) => {
  if (!salaryRange) return null;
  const minLabel = formatCurrency(salaryRange.min);
  const maxLabel = formatCurrency(salaryRange.max);
  if (!minLabel && !maxLabel) return null;
  if (minLabel && maxLabel) return `${minLabel} - ${maxLabel}/yr`;
  return `${minLabel || maxLabel}/yr`;
};

const formatOpenings = (value) => {
  const count = Number(value);
  if (!Number.isFinite(count) || count <= 0) return null;
  if (count >= 1000) return `${(count / 1000).toFixed(count >= 10000 ? 0 : 1)}k`;
  return String(Math.round(count));
};

export default function CareerCard({ career, showActions = true, compact = false }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [showAllSkillGaps, setShowAllSkillGaps] = useState(false);
  const isBookmarked = user?.bookmarkedCareers?.includes(career.careerId);

  const score = career.finalScore || career.matchScore || 0;
  const scoreColor = score >= 70 ? "#16a34a" : score >= 45 ? "#ca8a04" : "#dc2626";
  const scoreBg = score >= 70 ? "#f0fdf4" : score >= 45 ? "#fefce8" : "#fef2f2";
  const scoreLabel = score >= 70 ? "Strong Match" : score >= 45 ? "Good Match" : "Partial";
  const demand = DEMAND_STYLES[career.demand] || DEMAND_STYLES["Medium"];
  const salaryLabel = formatCurrency(career.avgSalary) || formatSalaryRange(career.salaryRange);
  const liveOpeningsLabel = formatOpenings(career.liveOpenings);
  const trendingSkills = career.trendingSkills || [];
  const hiringCompanies = career.topHiringCompanies || [];
  const skillGaps = career.skillGaps || [];
  const visibleSkillGaps = showAllSkillGaps ? skillGaps : skillGaps.slice(0, 5);

  const handleBookmark = async () => {
    try {
      const { data } = await api.post("/profile/bookmark", { careerId: career.careerId });
      dispatch(setUser({ ...user, bookmarkedCareers: data.bookmarkedCareers }));
      toast.success(isBookmarked ? "Bookmark removed" : "Career bookmarked!");
    } catch {
      toast.error("Failed to update bookmark");
    }
  };

  // Compact list-row style (for list view / dashboard)
  if (compact) {
    return (
      <div className="bg-white rounded-2xl flex items-center gap-4 px-5 py-3.5 transition-all hover:shadow-sm group"
        style={{ border: "1px solid #eef3fa" }}>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-[13.5px] font-bold truncate" style={{ color: "#0F2854" }}>{career.title}</p>
            <span className="text-[10.5px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0"
              style={{ background: scoreBg, color: scoreColor }}>{scoreLabel}</span>
          </div>
          <div className="flex items-center gap-3 mt-0.5 flex-wrap">
            <span className="text-[11px] text-gray-400">{career.category}</span>
            {salaryLabel && (
              <span className="text-[11px] font-medium" style={{ color: "#1C4D8D" }}>
                {salaryLabel}
              </span>
            )}
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full"
              style={{ background: demand.bg, color: demand.color }}>{career.demand}</span>
            {career.marketScore != null && (
              <span className="text-[11px] font-medium text-gray-400">
                Market {career.marketScore}%
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="flex items-center gap-1.5">
            <div className="w-16 h-1 rounded-full overflow-hidden" style={{ background: "#eef3fa" }}>
              <div className="h-full rounded-full" style={{ width: `${score}%`, background: scoreColor }} />
            </div>
            <span className="text-[11px] font-bold" style={{ color: scoreColor }}>{score}%</span>
          </div>
          {showActions && (
            <button onClick={handleBookmark}
              className="w-7 h-7 rounded-lg flex items-center justify-center transition-all hover:scale-110"
              style={{ background: isBookmarked ? "#e8f0fa" : "transparent" }}>
              {isBookmarked
                ? <BookmarkCheck className="w-4 h-4" style={{ color: "#1C4D8D" }} />
                : <Bookmark className="w-4 h-4 text-gray-300 group-hover:text-gray-400 transition-colors" />}
            </button>
          )}
        </div>
      </div>
    );
  }

  // Full card style (for grid view)
  return (
    <div className="bg-white rounded-2xl overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
      style={{ border: "1px solid #eef3fa", boxShadow: "0 2px 10px rgba(0,0,0,0.04)" }}>
      {/* Color top bar based on match */}
      <div className="h-[3px] w-full" style={{ background: `${scoreColor}` }} />

      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0 pr-3">
            <h3 className="font-bold text-base leading-tight" style={{ color: "#0F2854" }}>{career.title}</h3>
            <p className="text-xs text-gray-400 mt-0.5">{career.category}</p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="px-2.5 py-1 rounded-lg text-[11px] font-bold"
              style={{ background: scoreBg, color: scoreColor }}>{score}% {scoreLabel}</span>
            {showActions && (
              <button onClick={handleBookmark}
                className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:scale-110"
                style={{ background: isBookmarked ? "#e8f0fa" : "#f5f8fc" }}>
                {isBookmarked
                  ? <BookmarkCheck className="w-4 h-4" style={{ color: "#1C4D8D" }} />
                  : <Bookmark className="w-4 h-4 text-gray-400" />}
              </button>
            )}
          </div>
        </div>

        {/* Description */}
        <p className="text-[12.5px] text-gray-500 line-clamp-2 mb-3 leading-relaxed">{career.description}</p>

        {/* Match progress bar */}
        <div className="mb-3">
          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "#f0f5fc" }}>
            <div className="h-full rounded-full transition-all duration-700"
              style={{ width: `${score}%`, background: `${scoreColor}` }} />
          </div>
        </div>

        {/* Tags row */}
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="text-[10.5px] font-bold px-2 py-1 rounded-lg"
            style={{ background: demand.bg, color: demand.color }}>{career.demand} Demand</span>
          {career.hiringTrend && (
            <span className="flex items-center gap-1 text-[10.5px] font-semibold px-2 py-1 rounded-lg"
              style={{ background: "#ecfeff", color: "#0e7490" }}>
              <Sparkles className="w-3 h-3" /> {career.hiringTrend}
            </span>
          )}
          {career.growthRate && (
            <span className="flex items-center gap-1 text-[10.5px] font-semibold px-2 py-1 rounded-lg"
              style={{ background: "#f0f5fc", color: "#1C4D8D" }}>
              <TrendingUp className="w-3 h-3" /> {career.growthRate}% growth
            </span>
          )}
          {liveOpeningsLabel && (
            <span className="flex items-center gap-1 text-[10.5px] font-semibold px-2 py-1 rounded-lg"
              style={{ background: "#f8fafc", color: "#475569" }}>
              <Briefcase className="w-3 h-3" /> {liveOpeningsLabel} openings
            </span>
          )}
          {career.remotePercent != null && (
            <span className="flex items-center gap-1 text-[10.5px] font-semibold px-2 py-1 rounded-lg"
              style={{ background: "#eef2ff", color: "#4338ca" }}>
              <Globe2 className="w-3 h-3" /> {career.remotePercent}% remote
            </span>
          )}
          {salaryLabel && (
            <span className="text-[11px] font-semibold" style={{ color: "#1C4D8D" }}>
              {salaryLabel}{career.avgSalary ? "/yr avg" : ""}
            </span>
          )}
        </div>

        {(career.compatibilityScore != null || career.marketScore != null) && (
          <div className="grid grid-cols-2 gap-2 mb-3">
            <div className="rounded-xl px-3 py-2" style={{ background: "#f8fafc", border: "1px solid #eef3fa" }}>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-wide">Compatibility</p>
              <p className="text-sm font-black" style={{ color: "#0F2854" }}>{career.compatibilityScore ?? score}%</p>
            </div>
            <div className="rounded-xl px-3 py-2" style={{ background: "#f8fafc", border: "1px solid #eef3fa" }}>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-wide">Market</p>
              <p className="text-sm font-black" style={{ color: "#0F2854" }}>{career.marketScore ?? career.marketDemand ?? "—"}%</p>
            </div>
          </div>
        )}

        {career.reason && (
          <p className="text-[11.5px] text-gray-500 leading-relaxed mb-3 rounded-xl px-3 py-2"
            style={{ background: "#f8fafc", border: "1px solid #eef3fa" }}>
            {career.reason}
          </p>
        )}

        {trendingSkills.length > 0 && (
          <div className="mb-3">
            <p className="text-[10.5px] font-bold mb-1.5 flex items-center gap-1" style={{ color: "#0e7490" }}>
              <Sparkles className="w-3.5 h-3.5" /> Trending skills
            </p>
            <div className="flex flex-wrap gap-1.5">
              {trendingSkills.slice(0, 5).map((skill) => (
                <span key={skill} className="px-2 py-0.5 text-[10.5px] font-semibold rounded-md"
                  style={{ background: "#ecfeff", color: "#0e7490" }}>
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {hiringCompanies.length > 0 && (
          <div className="mb-3 flex items-start gap-2 text-[11px] text-gray-400">
            <Building2 className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
            <span className="line-clamp-1">
              Hiring: {hiringCompanies.slice(0, 4).join(", ")}
            </span>
          </div>
        )}

        {/* Skill gaps */}
        {skillGaps.length > 0 && (
          <div className="pt-3" style={{ borderTop: "1px solid #f0f5fc" }}>
            <p className="text-[10.5px] font-bold mb-1.5 flex items-center gap-1" style={{ color: "#ca8a04" }}>
              <Wrench className="w-3.5 h-3.5" /> Skills to develop
            </p>
            <div className="flex flex-wrap gap-1.5">
              {visibleSkillGaps.map((gap, index) => (
                <span key={`${gap}-${index}`} className="px-2 py-0.5 text-[10.5px] font-semibold rounded-md"
                  style={{ background: "#fef9c3", color: "#92400e" }}>
                  {gap}
                </span>
              ))}
              {skillGaps.length > 5 && (
                <button
                  type="button"
                  onClick={() => setShowAllSkillGaps((current) => !current)}
                  className="px-2 py-0.5 text-[10.5px] font-bold rounded-md transition-colors hover:bg-amber-100"
                  style={{ color: "#92400e" }}
                >
                  {showAllSkillGaps ? "See less" : `+${skillGaps.length - 5} more`}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
