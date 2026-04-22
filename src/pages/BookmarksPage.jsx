import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchRecommendations } from "../store/slices/recommendationSlice";
import CareerCard from "../components/career/CareerCard";
import Spinner from "../components/common/Spinner";
import { Link } from "react-router-dom";
import { Bookmark, Zap, ArrowRight } from "lucide-react";

export default function BookmarksPage() {
  const dispatch = useDispatch();
  const { recommendation, loading } = useSelector((s) => s.recommendations);
  const { user } = useSelector((s) => s.auth);

  useEffect(() => {
    dispatch(fetchRecommendations());
  }, [dispatch]);

  const bookmarkedIds = user?.bookmarkedCareers || [];
  const allCareers = recommendation?.careers || [];
  const bookmarked = allCareers.filter((c) =>
    bookmarkedIds.includes(c.careerId),
  );

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-slide-up">
      {/* Header banner */}
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
        <div className="p-6 md:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center"
                style={{
                  background: "rgba(189,232,245,0.12)",
                  border: "1px solid rgba(189,232,245,0.18)",
                }}
              >
                <Bookmark className="w-4 h-4" style={{ color: "#BDE8F5" }} />
              </div>
              <span
                className="text-xs font-semibold uppercase tracking-wider"
                style={{ color: "rgba(189,232,245,0.55)" }}
              >
                Saved Careers
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-white mb-1">
              My Bookmarks
            </h1>
            <p className="text-sm" style={{ color: "rgba(189,232,245,0.65)" }}>
              Careers you've saved for later — revisit and compare anytime.
            </p>
          </div>
          <div
            className="px-4 py-2.5 rounded-xl flex items-center gap-2 flex-shrink-0"
            style={{
              background: "rgba(189,232,245,0.1)",
              border: "1px solid rgba(189,232,245,0.15)",
            }}
          >
            <Bookmark className="w-4 h-4" style={{ color: "#BDE8F5" }} />
            <span className="text-white font-bold text-lg leading-none">
              {bookmarkedIds.length}
            </span>
            <span
              className="text-sm font-medium"
              style={{ color: "rgba(189,232,245,0.6)" }}
            >
              saved
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex justify-center py-16">
          <Spinner size="lg" />
        </div>
      ) : bookmarked.length === 0 ? (
        <div className="card text-center py-16">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{ background: "rgba(15,40,84,0.06)" }}
          >
            <Bookmark className="w-7 h-7 text-gray-300" />
          </div>
          <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-1">
            No bookmarks yet
          </h3>
          <p className="text-sm text-gray-400 mb-6 max-w-xs mx-auto">
            {bookmarkedIds.length > 0 && !recommendation
              ? "Generate your AI recommendations first, then your bookmarked careers will appear here."
              : "Browse your AI recommendations and click the bookmark icon on any career to save it."}
          </p>
          <Link
            to="/recommendations"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:scale-105"
            style={{
              background: "linear-gradient(135deg, #0F2854, #1C4D8D)",
              boxShadow: "0 4px 16px rgba(15,40,84,0.25)",
            }}
          >
            <Zap className="w-4 h-4" />
            View Recommendations
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              <span className="font-semibold text-gray-700 dark:text-gray-200">
                {bookmarked.length}
              </span>{" "}
              saved {bookmarked.length === 1 ? "career" : "careers"}
            </p>
            <Link
              to="/recommendations"
              className="text-sm font-semibold flex items-center gap-1 transition-colors"
              style={{ color: "#1C4D8D" }}
            >
              Browse all
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {bookmarked.map((career) => (
              <CareerCard key={career.careerId} career={career} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
