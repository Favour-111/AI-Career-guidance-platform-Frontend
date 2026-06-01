import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchRecommendations,
  generateRecommendations,
  clearRecommendationError,
} from "../store/slices/recommendationSlice";
import { fetchProfile } from "../store/slices/profileSlice";
import CareerCard from "../components/career/CareerCard";
import { SkeletonCareerCard } from "../components/common/Skeleton";
import Button from "../components/common/Button";
import { Link } from "react-router-dom";
import {
  Zap,
  RefreshCw,
  Clock,
  BookmarkCheck,
  Filter,
  User,
  LayoutGrid,
  LayoutList,
  SlidersHorizontal,
  Target,
  TrendingUp,
  AlertCircle,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import toast from "react-hot-toast";

export default function RecommendationsPage() {
  const dispatch = useDispatch();
  const { recommendation, loading, generating, error } = useSelector((s) => s.recommendations);
  const { profile } = useSelector((s) => s.profile);
  const { user } = useSelector((s) => s.auth);
  const [filter, setFilter] = useState("all");
  const [gridView, setGridView] = useState(true);

  useEffect(() => {
    dispatch(fetchRecommendations());
    dispatch(fetchProfile());
  }, [dispatch]);

  const handleGenerate = async () => {
    dispatch(clearRecommendationError());
    const result = await dispatch(generateRecommendations());
    if (generateRecommendations.fulfilled.match(result)) {
      if (result.payload?.warning) {
        toast(result.payload.warning);
      } else {
        toast.success("AI recommendations generated!");
      }
    } else {
      toast.error(result.payload || "Failed to generate recommendations");
    }
  };

  const hasSkills = profile?.skills?.length > 0;
  const careers = recommendation?.careers || [];
  const filteredCareers =
    filter === "bookmarked"
      ? careers.filter((c) => user?.bookmarkedCareers?.includes(c.careerId))
      : filter === "high"
        ? careers.filter((c) => c.matchScore >= 70)
        : careers;

  const highMatchCount = careers.filter((c) => c.matchScore >= 70).length;
  const bookmarkedCount = careers.filter((c) => user?.bookmarkedCareers?.includes(c.careerId)).length;

  return (
    <div className="max-w-5xl mx-auto space-y-5 animate-slide-up">

      {/* ── HEADER ── */}
      <div className="relative rounded-2xl overflow-hidden"
        style={{ background: "#0F2854" }}>
        <div className="h-px w-full" style={{ background: "rgba(189,232,245,0.12)" }} />
        <div className="px-6 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl font-black text-white leading-tight">AI Career Recommendations</h1>
            <p className="text-sm mt-1" style={{ color: "rgba(189,232,245,0.65)" }}>
              Personalized career paths for Nigeria's job market
            </p>
            {recommendation && (
              <div className="flex items-center gap-1.5 mt-2 text-xs" style={{ color: "rgba(189,232,245,0.45)" }}>
                <Clock className="w-3.5 h-3.5" />
                Updated {formatDistanceToNow(new Date(recommendation.generatedAt), { addSuffix: true })}
              </div>
            )}
          </div>
          <button onClick={handleGenerate} disabled={!hasSkills || generating}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white flex-shrink-0 transition-all hover:opacity-90 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
            style={{ background: hasSkills ? "#1C4D8D" : "rgba(255,255,255,0.15)", boxShadow: hasSkills ? "0 4px 16px rgba(73,136,196,0.35)" : "none" }}>
            <RefreshCw className={`w-4 h-4 ${generating ? "animate-spin" : ""}`} />
            {recommendation ? "Regenerate" : "Generate"} Recommendations
          </button>
        </div>
        <div className="h-px w-full" style={{ background: "rgba(189,232,245,0.06)" }} />
      </div>

      {/* ── PROFILE INCOMPLETE WARNING ── */}
      {!hasSkills && (
        <div className="flex items-start gap-3 p-4 rounded-2xl"
          style={{ background: "#fefce8", border: "1.5px solid #fde68a" }}>
          <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: "#fef9c3" }}>
            <AlertCircle className="w-5 h-5 text-yellow-600" />
          </div>
          <div>
            <p className="font-bold text-yellow-800 text-sm">Profile Incomplete</p>
            <p className="text-xs text-yellow-700 mt-0.5">
              Add at least one skill to generate AI career recommendations.
            </p>
            <Link to="/profile" className="inline-flex items-center gap-1 mt-2 text-xs font-bold text-yellow-800 underline">
              Complete Profile →
            </Link>
          </div>
        </div>
      )}

      {/* ── LOADING ── */}
      {(loading || generating) && (
        <div className="space-y-3">
          {[0, 1, 2, 3].map((i) => <SkeletonCareerCard key={i} />)}
          <p className="text-center text-sm text-gray-400 animate-pulse">
            {generating ? "🤖 AI is analyzing your profile…" : "Loading recommendations…"}
          </p>
        </div>
      )}

      {/* ── ERROR ── */}
      {error && !generating && !loading && (
        <div className="p-5 rounded-2xl text-center" style={{ background: "#fef2f2", border: "1.5px solid #fecaca" }}>
          <p className="text-red-700 font-semibold text-sm">{error}</p>
          <button onClick={handleGenerate}
            className="mt-3 text-sm font-semibold underline text-red-600">Try Again</button>
        </div>
      )}

      {/* ── RESULTS ── */}
      {!loading && !generating && recommendation && careers.length > 0 && (
        <>
          {/* Input snapshot */}
          <div className="bg-white rounded-2xl p-4" style={{ border: "1px solid #eef3fa", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
            <p className="text-[12px] font-bold uppercase tracking-wider mb-2.5" style={{ color: "#0F2854" }}>
              Based on your profile
            </p>
            <div className="flex flex-wrap gap-2">
              {recommendation.inputSnapshot?.skills?.slice(0, 8).map((s) => (
                <span key={s.name} className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-lg"
                  style={{ background: "#e8f0fa", color: "#1C4D8D" }}>
                  {s.name}
                  <span className="text-[9px] font-bold px-1 py-0.5 rounded" style={{ background: "#1C4D8D", color: "#fff" }}>L{s.level}</span>
                </span>
              ))}
              {recommendation.inputSnapshot?.interests?.map((i) => (
                <span key={i} className="text-[11px] font-semibold px-2.5 py-1 rounded-lg"
                  style={{ background: "rgba(73,136,196,0.1)", color: "#4988C4" }}>
                  {i}
                </span>
              ))}
            </div>
          </div>

          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center gap-1 p-1 rounded-xl" style={{ background: "#f0f5fc" }}>
                {[
                  { id: "all", label: `All (${careers.length})` },
                  { id: "high", label: `Strong Match (${highMatchCount})` },
                  { id: "bookmarked", label: `Saved (${bookmarkedCount})` },
                ].map(({ id, label }) => (
                  <button key={id} onClick={() => setFilter(id)}
                    className="px-3 py-1.5 rounded-lg text-[11.5px] font-semibold transition-all"
                    style={filter === id
                      ? { background: "#fff", color: "#0F2854", boxShadow: "0 1px 4px rgba(0,0,0,0.1)" }
                      : { color: "#6b7280" }}>
                    {label}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setGridView(!gridView)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors hover:bg-gray-100"
                style={{ color: "#0F2854", border: "1px solid #e5edf6" }}>
                {gridView ? <LayoutList className="w-3.5 h-3.5" /> : <LayoutGrid className="w-3.5 h-3.5" />}
                {gridView ? "List view" : "Grid view"}
              </button>
            </div>
          </div>

          {/* Career cards */}
          {filteredCareers.length === 0 ? (
            <div className="bg-white rounded-2xl py-12 text-center" style={{ border: "1px solid #eef3fa" }}>
              <BookmarkCheck className="w-10 h-10 mx-auto mb-3 text-gray-200" />
              <p className="text-sm text-gray-400">No careers match this filter.</p>
            </div>
          ) : (
            <div className={gridView ? "grid md:grid-cols-2 gap-4" : "space-y-3"}>
              {filteredCareers.map((career) => (
                <CareerCard key={career.careerId} career={career} compact={!gridView} />
              ))}
            </div>
          )}
        </>
      )}

      {/* ── EMPTY STATE ── */}
      {!loading && !generating && !recommendation && hasSkills && (
        <div className="bg-white rounded-2xl py-20 flex flex-col items-center justify-center text-center"
          style={{ border: "1px solid #eef3fa" }}>
          <div className="w-16 h-16 rounded-3xl flex items-center justify-center mb-5"
            style={{ background: "rgba(15,40,84,0.07)" }}>
            <Zap className="w-8 h-8" style={{ color: "#0F2854" }} />
          </div>
          <h3 className="text-xl font-black mb-2" style={{ color: "#0F2854" }}>Ready to find your career path?</h3>
          <p className="text-sm text-gray-400 max-w-sm mb-6">
            Our AI will analyze your {profile?.skills?.length} skills and match you to the best careers in Nigeria's job market.
          </p>
          <button onClick={handleGenerate}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90"
            style={{ background: "#0F2854" }}>
            <Zap className="w-5 h-5" /> Generate My Career Recommendations
          </button>
        </div>
      )}
    </div>
  );
}
