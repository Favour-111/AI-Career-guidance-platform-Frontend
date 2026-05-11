import {
  Bookmark,
  BookmarkCheck,
  TrendingUp,
  ChevronRight,
  AlertCircle,
  Wrench,
  BarChart2,
} from "lucide-react";
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

export default function CareerCard({ career, showActions = true, compact = false }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const isBookmarked = user?.bookmarkedCareers?.includes(career.careerId);

  const score = career.matchScore || 0;
  const scoreColor = score >= 70 ? "#16a34a" : score >= 45 ? "#ca8a04" : "#dc2626";
  const scoreBg = score >= 70 ? "#f0fdf4" : score >= 45 ? "#fefce8" : "#fef2f2";
  const scoreLabel = score >= 70 ? "Strong Match" : score >= 45 ? "Good Match" : "Partial";
  const demand = DEMAND_STYLES[career.demand] || DEMAND_STYLES["Medium"];

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
            {career.salaryRange && (
              <span className="text-[11px] font-medium" style={{ color: "#1C4D8D" }}>
                ₦{(career.salaryRange.min / 1000000).toFixed(1)}M–₦{(career.salaryRange.max / 1000000).toFixed(1)}M/yr
              </span>
            )}
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full"
              style={{ background: demand.bg, color: demand.color }}>{career.demand}</span>
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
          {career.growthRate && (
            <span className="flex items-center gap-1 text-[10.5px] font-semibold px-2 py-1 rounded-lg"
              style={{ background: "#f0f5fc", color: "#1C4D8D" }}>
              <TrendingUp className="w-3 h-3" /> {career.growthRate}% growth
            </span>
          )}
          {career.salaryRange && (
            <span className="text-[11px] font-semibold" style={{ color: "#1C4D8D" }}>
              ₦{(career.salaryRange.min / 1000000).toFixed(1)}M – ₦{(career.salaryRange.max / 1000000).toFixed(1)}M/yr
            </span>
          )}
        </div>

        {/* Skill gaps */}
        {career.skillGaps?.length > 0 && (
          <div className="pt-3" style={{ borderTop: "1px solid #f0f5fc" }}>
            <p className="text-[10.5px] font-bold mb-1.5 flex items-center gap-1" style={{ color: "#ca8a04" }}>
              <Wrench className="w-3.5 h-3.5" /> Skills to develop
            </p>
            <div className="flex flex-wrap gap-1.5">
              {career.skillGaps.slice(0, 5).map((gap) => (
                <span key={gap} className="px-2 py-0.5 text-[10.5px] font-semibold rounded-md"
                  style={{ background: "#fef9c3", color: "#92400e" }}>
                  {gap}
                </span>
              ))}
              {career.skillGaps.length > 5 && (
                <span className="text-[10.5px] text-gray-400">+{career.skillGaps.length - 5} more</span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
