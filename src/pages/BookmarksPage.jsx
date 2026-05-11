import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchRecommendations } from "../store/slices/recommendationSlice";
import CareerCard from "../components/career/CareerCard";
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
      {/* ── HEADER ── */}
      <div className="relative rounded-2xl overflow-hidden"
        style={{ background: "#0F2854" }}>
        <div className="h-px w-full" style={{ background: "rgba(189,232,245,0.12)" }} />
        <div className="px-6 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: "rgba(189,232,245,0.12)", border: "1px solid rgba(189,232,245,0.15)" }}>
              <Bookmark className="w-5 h-5" style={{ color: "#BDE8F5" }} />
            </div>
            <div>
              <h1 className="text-xl font-black text-white">My Bookmarks</h1>
              <p className="text-sm" style={{ color: "rgba(189,232,245,0.65)" }}>Careers you've saved for later revisit anytime.</p>
            </div>
          </div>
          <div className="px-4 py-2.5 rounded-xl flex items-center gap-2 flex-shrink-0"
            style={{ background: "rgba(189,232,245,0.1)", border: "1px solid rgba(189,232,245,0.15)" }}>
            <Bookmark className="w-4 h-4" style={{ color: "#BDE8F5" }} />
            <span className="text-white font-black text-xl leading-none">{bookmarkedIds.length}</span>
            <span className="text-sm font-medium" style={{ color: "rgba(189,232,245,0.6)" }}>saved</span>
          </div>
        </div>
        <div className="h-px w-full" style={{ background: "rgba(189,232,245,0.06)" }} />
      </div>

      {/* Content */}
      {loading ? (
        <div className="space-y-4 animate-pulse">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-5"
              style={{ border: "1px solid #eef3fa", boxShadow: "0 2px 8px rgba(0,0,0,0.03)" }}>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex-1 space-y-2">
                  <div className="h-5 rounded-lg" style={{ width: `${55 + i * 7}%`, background: "#f1f5f9" }} />
                  <div className="h-3.5 w-28 rounded-md" style={{ background: "#f8fafc" }} />
                </div>
                <div className="h-6 w-16 rounded-full flex-shrink-0" style={{ background: "#f1f5f9" }} />
              </div>
              <div className="space-y-1.5 mb-4">
                <div className="h-3 w-full rounded-md" style={{ background: "#f8fafc" }} />
                <div className="h-3 w-4/5 rounded-md" style={{ background: "#f8fafc" }} />
              </div>
              <div className="flex gap-2 mb-4">
                {[...Array(3)].map((_, j) => (
                  <div key={j} className="h-6 w-16 rounded-lg" style={{ background: "#f1f5f9" }} />
                ))}
              </div>
              <div className="h-1.5 w-full rounded-full" style={{ background: "#f1f5f9" }} />
            </div>
          ))}
        </div>
      ) : bookmarked.length === 0 ? (
        <div className="text-center py-16 rounded-2xl" style={{ background: "#fff", border: "1px solid #eef3fa" }}>
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: "#f0f5ff" }}>
            <Bookmark className="w-7 h-7" style={{ color: "#4988C4" }} />
          </div>
          <h3 className="text-lg font-black mb-1" style={{ color: "#0F2854" }}>No bookmarks yet</h3>
          <p className="text-sm text-gray-400 mb-6 max-w-xs mx-auto">
            {bookmarkedIds.length > 0 && !recommendation
              ? "Generate your AI recommendations first, then your bookmarked careers will appear here."
              : "Browse your AI recommendations and click the bookmark icon on any career to save it."}
          </p>
          <Link
            to="/recommendations"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:scale-105"
            style={{
              background: "#0F2854",
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
          <div className="flex items-center justify-between px-1">
            <p className="text-sm font-semibold" style={{ color: "#0F2854" }}>
              {bookmarked.length} saved {bookmarked.length === 1 ? "career" : "careers"}
            </p>
            <Link to="/recommendations"
              className="text-sm font-bold flex items-center gap-1 hover:underline transition-colors"
              style={{ color: "#1C4D8D" }}>
              Browse all <ArrowRight className="w-3.5 h-3.5" />
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
