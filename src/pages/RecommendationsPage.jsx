import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchRecommendations,
  generateRecommendations,
  clearRecommendationError,
} from "../store/slices/recommendationSlice";
import { fetchProfile } from "../store/slices/profileSlice";
import CareerCard from "../components/career/CareerCard";
import Spinner from "../components/common/Spinner";
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
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import toast from "react-hot-toast";

export default function RecommendationsPage() {
  const dispatch = useDispatch();
  const { recommendation, loading, generating, error } = useSelector(
    (s) => s.recommendations,
  );
  const { profile } = useSelector((s) => s.profile);
  const { user } = useSelector((s) => s.auth);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    dispatch(fetchRecommendations());
    dispatch(fetchProfile());
  }, [dispatch]);

  const handleGenerate = async () => {
    dispatch(clearRecommendationError());
    const result = await dispatch(generateRecommendations());
    if (generateRecommendations.fulfilled.match(result)) {
      toast.success("AI recommendations generated!");
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

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-slide-up">
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
        <div className="p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-extrabold text-white mb-1">
                AI Career Recommendations
              </h1>
              <p className="text-sm" style={{ color: "rgba(189,232,245,0.7)" }}>
                Personalized career paths matched to your unique skills and
                interests
              </p>
              {recommendation && (
                <div
                  className="flex items-center gap-1.5 mt-2 text-xs"
                  style={{ color: "rgba(189,232,245,0.5)" }}
                >
                  <Clock className="w-3.5 h-3.5" />
                  Last updated{" "}
                  {formatDistanceToNow(new Date(recommendation.generatedAt), {
                    addSuffix: true,
                  })}
                </div>
              )}
            </div>
            <Button
              onClick={handleGenerate}
              loading={generating}
              disabled={!hasSkills}
              className="flex-shrink-0"
              style={{ background: "#4988C4", color: "#fff" }}
            >
              <RefreshCw
                className={`w-4 h-4 ${generating ? "animate-spin" : ""}`}
              />
              {recommendation ? "Regenerate" : "Generate"} Recommendations
            </Button>
          </div>
        </div>
      </div>

      {/* No profile warning */}
      {!hasSkills && (
        <div className="card border-2 border-yellow-200 dark:border-yellow-700 bg-yellow-50 dark:bg-yellow-900/10">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center flex-shrink-0">
              <User className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <p className="font-semibold text-yellow-800 dark:text-yellow-300">
                Profile Incomplete
              </p>
              <p className="text-sm text-yellow-700 dark:text-yellow-400 mt-0.5">
                Add at least one skill to your profile to generate AI career
                recommendations.
              </p>
              <Link
                to="/profile"
                className="inline-flex items-center gap-1 mt-3 text-sm font-semibold text-yellow-800 dark:text-yellow-300 underline"
              >
                Complete Profile →
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Loading */}
      {(loading || generating) && (
        <div className="space-y-4">
          {[0, 1, 2, 3, 4].map((i) => (
            <SkeletonCareerCard key={i} />
          ))}
          <p className="text-center text-sm text-gray-400 animate-pulse">
            {generating
              ? "AI is analyzing your profile…"
              : "Loading recommendations…"}
          </p>
        </div>
      )}

      {/* Error */}
      {error && !generating && !loading && (
        <div className="card border-2 border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/10 text-center py-8">
          <p className="text-red-600 dark:text-red-400 font-medium">{error}</p>
          <Button variant="ghost" onClick={handleGenerate} className="mt-3">
            Try Again
          </Button>
        </div>
      )}

      {/* Results */}
      {!loading && !generating && recommendation && careers.length > 0 && (
        <>
          {/* Input snapshot */}
          <div className="card">
            <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-3">
              Based on your profile snapshot
            </h3>
            <div className="flex flex-wrap gap-2">
              {recommendation.inputSnapshot?.skills?.slice(0, 8).map((s) => (
                <span key={s.name} className="badge-primary">
                  {s.name} (L{s.level})
                </span>
              ))}
              {recommendation.inputSnapshot?.interests?.map((i) => (
                <span
                  key={i}
                  className="badge"
                  style={{
                    background: "rgba(73,136,196,0.12)",
                    color: "#1C4D8D",
                  }}
                >
                  {i}
                </span>
              ))}
            </div>
          </div>

          {/* Filter tabs */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            {[
              { id: "all", label: `All (${careers.length})` },
              {
                id: "high",
                label: `High Match (${careers.filter((c) => c.matchScore >= 70).length})`,
              },
              {
                id: "bookmarked",
                label: `Bookmarked (${careers.filter((c) => user?.bookmarkedCareers?.includes(c.careerId)).length})`,
              },
            ].map(({ id, label }) => (
              <button
                key={id}
                onClick={() => setFilter(id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  filter === id
                    ? "bg-primary text-white"
                    : "bg-white dark:bg-dark-card text-gray-500 dark:text-gray-400 hover:text-gray-700 border dark:border-dark-border"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Career cards grid */}
          {filteredCareers.length === 0 ? (
            <div className="card text-center py-10 text-gray-400">
              <BookmarkCheck className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p>No careers match this filter.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-5">
              {filteredCareers.map((career) => (
                <CareerCard key={career.careerId} career={career} />
              ))}
            </div>
          )}
        </>
      )}

      {/* Empty state */}
      {!loading && !generating && !recommendation && hasSkills && (
        <div className="card flex flex-col items-center justify-center py-20 text-center">
          <div className="w-20 h-20 rounded-3xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center mb-5">
            <Zap className="w-10 h-10 text-primary dark:text-secondary" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Ready to find your perfect career?
          </h3>
          <p className="text-gray-400 max-w-sm mb-6">
            Our AI will analyze your {profile?.skills?.length} skills and
            interests to find the best career matches for you.
          </p>
          <Button onClick={handleGenerate} loading={generating} size="lg">
            <Zap className="w-5 h-5" />
            Generate My Career Recommendations
          </Button>
        </div>
      )}
    </div>
  );
}
