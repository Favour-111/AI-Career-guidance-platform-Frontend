import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  BookOpen,
  ExternalLink,
  Clock,
  Award,
  ChevronDown,
  ChevronUp,
  Play,
} from "lucide-react";
import { fetchMarketData } from "../store/slices/marketSlice";
import Spinner from "../components/common/Spinner";
import { SkeletonResourceRow } from "../components/common/Skeleton";

const TYPE_COLORS = {
  Course:
    "bg-[#4988C4]/10 text-[#0F2854] dark:bg-[#4988C4]/20 dark:text-[#BDE8F5]",
  Certificate:
    "bg-[#1C4D8D]/10 text-[#1C4D8D] dark:bg-[#1C4D8D]/20 dark:text-[#BDE8F5]",
  Tutorial:
    "bg-[#4988C4]/10 text-[#4988C4] dark:bg-[#4988C4]/20 dark:text-[#BDE8F5]",
  Practice:
    "bg-[#0F2854]/10 text-[#0F2854] dark:bg-[#0F2854]/20 dark:text-[#BDE8F5]",
  Guide:
    "bg-[#4988C4]/10 text-[#0F2854] dark:bg-[#4988C4]/10 dark:text-[#BDE8F5]",
  Book: "bg-[#091B3A]/10 text-[#091B3A] dark:bg-[#091B3A]/30 dark:text-[#BDE8F5]",
  Documentation:
    "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
};

export default function LearningPage() {
  const dispatch = useDispatch();
  const { recommendation } = useSelector((s) => s.recommendations);
  const { careers, loading } = useSelector((s) => s.market);
  const [expanded, setExpanded] = useState({});
  const [activeFilter, setActiveFilter] = useState("All");

  useEffect(() => {
    dispatch(fetchMarketData());
  }, [dispatch]);

  // Build learning resources from recommendations (if available) + all careers
  const recommendedPaths = recommendation?.careers?.slice(0, 3) || [];

  const allResources = [];
  const seenUrls = new Set();
  [...recommendedPaths, ...careers].forEach((career) => {
    (career.learningPaths || []).forEach((res) => {
      if (!seenUrls.has(res.url)) {
        seenUrls.add(res.url);
        allResources.push({
          ...res,
          careerTitle: career.title,
          careerId: career.careerId || career.id,
        });
      }
    });
  });

  const types = [
    "All",
    ...new Set(allResources.map((r) => r.type).filter(Boolean)),
  ];
  const filtered =
    activeFilter === "All"
      ? allResources
      : allResources.filter((r) => r.type === activeFilter);

  const toggleCareer = (id) =>
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));

  if (loading)
    return (
      <div className="max-w-5xl mx-auto space-y-4 animate-pulse">
        <div className="h-32 rounded-2xl bg-gray-200 dark:bg-gray-700" />
        <div className="flex gap-2">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-8 w-20 rounded-full bg-gray-200 dark:bg-gray-700"
            />
          ))}
        </div>
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <SkeletonResourceRow key={i} />
        ))}
      </div>
    );

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
        <div className="p-6 md:p-8 flex items-center gap-4">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: "rgba(189,232,245,0.15)" }}
          >
            <BookOpen className="w-6 h-6" style={{ color: "#BDE8F5" }} />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-white">
              Learning Paths
            </h1>
            <p
              className="text-sm mt-0.5"
              style={{ color: "rgba(189,232,245,0.7)" }}
            >
              Curated courses, certifications, and resources to bridge your
              skill gaps and advance your career.
            </p>
          </div>
        </div>
      </div>

      {/* If user has recommendations — show personalized paths */}
      {recommendedPaths.length > 0 && (
        <div className="card">
          <h2 className="section-title mb-4">
            Your Personalized Learning Roadmaps
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">
            Based on your AI career recommendations
          </p>
          <div className="space-y-4">
            {recommendedPaths.map((career) => {
              const isOpen = expanded[career.careerId] !== false; // default open for first 3
              return (
                <div
                  key={career.careerId}
                  className="border dark:border-dark-border rounded-xl overflow-hidden"
                >
                  <button
                    onClick={() => toggleCareer(career.careerId)}
                    className="w-full flex items-center justify-between p-4 bg-surface dark:bg-dark-surface hover:bg-gray-100 dark:hover:bg-dark-card transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center">
                        <Award
                          className="w-4.5 h-4.5 text-primary dark:text-secondary"
                          size={18}
                        />
                      </div>
                      <div className="text-left">
                        <p className="font-bold text-gray-900 dark:text-white text-sm">
                          {career.title}
                        </p>
                        <p className="text-xs text-gray-400">
                          {career.learningPaths?.length || 0} resources ·{" "}
                          {career.matchScore}% match
                        </p>
                      </div>
                    </div>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    )}
                  </button>
                  {isOpen && (
                    <div className="p-4 grid sm:grid-cols-2 gap-3 bg-white dark:bg-dark-card">
                      {career.learningPaths?.map((res, i) => (
                        <a
                          key={i}
                          href={res.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-start gap-3 p-3 rounded-xl border dark:border-dark-border hover:border-secondary dark:hover:border-secondary hover:bg-surface dark:hover:bg-dark-surface transition-all group"
                        >
                          <div className="w-8 h-8 rounded-lg bg-primary/10 dark:bg-primary/20 flex items-center justify-center flex-shrink-0">
                            <Play className="w-3.5 h-3.5 text-primary dark:text-secondary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-800 dark:text-white group-hover:text-primary dark:group-hover:text-secondary line-clamp-2">
                              {res.title}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <span
                                className={`badge text-xs ${TYPE_COLORS[res.type] || "badge-primary"}`}
                              >
                                {res.type}
                              </span>
                              {res.duration && (
                                <span className="flex items-center gap-1 text-xs text-gray-400">
                                  <Clock className="w-3 h-3" />
                                  {res.duration}
                                </span>
                              )}
                            </div>
                          </div>
                          <ExternalLink className="w-3.5 h-3.5 text-gray-300 group-hover:text-secondary flex-shrink-0 mt-0.5" />
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* All resources browser */}
      <div className="card">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <h2 className="section-title">All Learning Resources</h2>
          <span className="text-sm text-gray-400">
            {filtered.length} resources
          </span>
        </div>

        {/* Type filter */}
        <div className="flex gap-2 flex-wrap mb-5">
          {types.map((type) => (
            <button
              key={type}
              onClick={() => setActiveFilter(type)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                activeFilter === type
                  ? "bg-primary text-white"
                  : "bg-gray-100 dark:bg-dark-surface text-gray-600 dark:text-gray-300 hover:bg-gray-200"
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.slice(0, 24).map((res, i) => (
            <a
              key={i}
              href={res.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col gap-2 p-4 rounded-xl border dark:border-dark-border hover:border-secondary dark:hover:border-secondary hover:shadow-card transition-all group"
            >
              <div className="flex items-start justify-between">
                <span
                  className={`badge text-xs ${TYPE_COLORS[res.type] || "badge-primary"}`}
                >
                  {res.type}
                </span>
                <ExternalLink className="w-3.5 h-3.5 text-gray-300 group-hover:text-secondary flex-shrink-0" />
              </div>
              <p className="text-sm font-semibold text-gray-800 dark:text-white group-hover:text-primary dark:group-hover:text-secondary line-clamp-2 leading-snug">
                {res.title}
              </p>
              <div className="mt-auto flex items-center justify-between">
                <span className="text-xs text-gray-400 truncate">
                  {res.careerTitle}
                </span>
                {res.duration && (
                  <span className="flex items-center gap-1 text-xs text-gray-400 flex-shrink-0 ml-2">
                    <Clock className="w-3 h-3" />
                    {res.duration}
                  </span>
                )}
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
