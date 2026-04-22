import {
  Bookmark,
  BookmarkCheck,
  TrendingUp,
  ChevronRight,
  AlertCircle,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import api from "../../services/api";
import { setUser } from "../../store/slices/authSlice";
import toast from "react-hot-toast";

export default function CareerCard({ career, showActions = true }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const isBookmarked = user?.bookmarkedCareers?.includes(career.careerId);

  const matchColor =
    career.matchScore >= 70
      ? "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20"
      : career.matchScore >= 45
        ? "text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20"
        : "text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-900/20";

  const demandColor =
    {
      "Very High": "badge-success",
      High: "badge-primary",
      Medium: "badge-warning",
      Low: "badge-danger",
    }[career.demand] || "badge-primary";

  const handleBookmark = async () => {
    try {
      const { data } = await api.post("/profile/bookmark", {
        careerId: career.careerId,
      });
      dispatch(setUser({ ...user, bookmarkedCareers: data.bookmarkedCareers }));
      toast.success(isBookmarked ? "Bookmark removed" : "Career bookmarked!");
    } catch {
      toast.error("Failed to update bookmark");
    }
  };

  return (
    <div className="card hover:shadow-card-hover transition-all duration-200">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-gray-900 dark:text-white text-base leading-tight">
            {career.title}
          </h3>
          <p className="text-xs text-gray-400 mt-0.5">{career.category}</p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0 ml-3">
          <div
            className={`px-2.5 py-1 rounded-lg text-xs font-bold ${matchColor}`}
          >
            {career.matchScore}% match
          </div>
          {showActions && (
            <button
              onClick={handleBookmark}
              className="p-1.5 rounded-lg text-gray-400 hover:text-primary dark:hover:text-secondary hover:bg-gray-50 dark:hover:bg-dark-card transition-colors"
            >
              {isBookmarked ? (
                <BookmarkCheck className="w-4 h-4 text-primary dark:text-secondary" />
              ) : (
                <Bookmark className="w-4 h-4" />
              )}
            </button>
          )}
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-4">
        {career.description}
      </p>

      {/* Match bar */}
      <div className="mb-4">
        <div className="skill-bar">
          <div
            className="skill-bar-fill"
            style={{ width: `${career.matchScore}%` }}
          />
        </div>
      </div>

      {/* Metadata row */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <span className={demandColor}>{career.demand} Demand</span>
        {career.growthRate && (
          <span className="badge bg-primary/10 text-primary dark:bg-primary/20 dark:text-secondary flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            {career.growthRate}% growth
          </span>
        )}
        {career.salaryRange && (
          <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
            ${(career.salaryRange.min / 1000).toFixed(0)}k – $
            {(career.salaryRange.max / 1000).toFixed(0)}k/yr
          </span>
        )}
      </div>

      {/* Skill gaps */}
      {career.skillGaps?.length > 0 && (
        <div className="pt-3 border-t dark:border-dark-border">
          <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 flex items-center gap-1 mb-2">
            <AlertCircle className="w-3.5 h-3.5 text-yellow-500" />
            Skills to develop
          </p>
          <div className="flex flex-wrap gap-1.5">
            {career.skillGaps.slice(0, 5).map((gap) => (
              <span
                key={gap}
                className="px-2 py-0.5 text-xs bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 rounded-md font-medium"
              >
                {gap}
              </span>
            ))}
            {career.skillGaps.length > 5 && (
              <span className="text-xs text-gray-400">
                +{career.skillGaps.length - 5} more
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
