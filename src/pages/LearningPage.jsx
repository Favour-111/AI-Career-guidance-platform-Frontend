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
  Course:     { bg: "#e8f0fb", color: "#0F2854" },
  Certificate:{ bg: "#eaf1fc", color: "#1C4D8D" },
  Tutorial:   { bg: "#f0f7ff", color: "#4988C4" },
  Practice:   { bg: "#e8f0fb", color: "#0F2854" },
  Guide:      { bg: "#f0f7ff", color: "#0F2854" },
  Book:       { bg: "#e4ecf9", color: "#091B3A" },
  Documentation: { bg: "#f3f4f6", color: "#4b5563" },
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
      {/* ── HEADER ── */}
      <div className="relative rounded-2xl overflow-hidden"
        style={{ background: "#0F2854" }}>
        <div className="h-px w-full" style={{ background: "rgba(189,232,245,0.12)" }} />
        <div className="px-6 py-5 flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: "rgba(189,232,245,0.12)", border: "1px solid rgba(189,232,245,0.15)" }}>
            <BookOpen className="w-5 h-5" style={{ color: "#BDE8F5" }} />
          </div>
          <div>
            <h1 className="text-xl font-black text-white">Learning Paths</h1>
            <p className="text-sm mt-0.5" style={{ color: "rgba(189,232,245,0.65)" }}>
              Curated courses, certifications, and resources to bridge your skill gaps and advance your career.
            </p>
          </div>
        </div>
        <div className="h-px w-full" style={{ background: "rgba(189,232,245,0.06)" }} />
      </div>

      {recommendedPaths.length > 0 && (
        <div className="bg-white rounded-2xl p-5" style={{ border: "1px solid #eef3fa", boxShadow: "0 2px 10px rgba(0,0,0,0.04)" }}>
          <h2 className="text-sm font-black mb-1" style={{ color: "#0F2854" }}>Your Personalized Learning Roadmaps</h2>
          <p className="text-xs text-gray-400 mb-5">Based on your AI career recommendations</p>
          <div className="space-y-3">
            {recommendedPaths.map((career) => {
              const isOpen = expanded[career.careerId] !== false;
              return (
                <div key={career.careerId} className="rounded-xl overflow-hidden" style={{ border: "1px solid #eef3fa" }}>
                  <button onClick={() => toggleCareer(career.careerId)}
                    className="w-full flex items-center justify-between p-4 transition-colors hover:bg-[#f7faff]"
                    style={{ background: "#fafcff" }}>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "#e8f0fb" }}>
                        <Award className="w-4.5 h-4.5" style={{ color: "#0F2854" }} size={18} />
                      </div>
                      <div className="text-left">
                        <p className="font-bold text-sm" style={{ color: "#0F2854" }}>{career.title}</p>
                        <p className="text-xs text-gray-400">{career.learningPaths?.length || 0} resources · {career.matchScore}% match</p>
                      </div>
                    </div>
                    {isOpen ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                  </button>
                  {isOpen && (
                    <div className="p-4 grid sm:grid-cols-2 gap-3 bg-white">
                      {career.learningPaths?.map((res, i) => (
                        <a key={i} href={res.url} target="_blank" rel="noopener noreferrer"
                          className="flex items-start gap-3 p-3 rounded-xl transition-all group"
                          style={{ border: "1px solid #eef3fa", background: "#fafcff" }}>
                          <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "#e8f0fb" }}>
                            <Play className="w-3.5 h-3.5" style={{ color: "#1C4D8D" }} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold line-clamp-2" style={{ color: "#0F2854" }}>{res.title}</p>
                            <div className="flex items-center gap-2 mt-1">
                              {res.type && (
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                                  style={{ background: (TYPE_COLORS[res.type] || TYPE_COLORS.Documentation).bg, color: (TYPE_COLORS[res.type] || TYPE_COLORS.Documentation).color }}>
                                  {res.type}
                                </span>
                              )}
                              {res.duration && (
                                <span className="flex items-center gap-1 text-xs text-gray-400">
                                  <Clock className="w-3 h-3" />{res.duration}
                                </span>
                              )}
                            </div>
                          </div>
                          <ExternalLink className="w-3.5 h-3.5 text-gray-300 group-hover:text-[#1C4D8D] flex-shrink-0 mt-0.5 transition-colors" />
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

      {/* ── ALL RESOURCES ── */}
      <div className="bg-white rounded-2xl p-5" style={{ border: "1px solid #eef3fa", boxShadow: "0 2px 10px rgba(0,0,0,0.04)" }}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-sm font-black" style={{ color: "#0F2854" }}>All Learning Resources</h2>
            <p className="text-xs text-gray-400 mt-0.5">{filtered.length} resources</p>
          </div>
        </div>

        {/* Type filter pills */}
        <div className="flex gap-2 flex-wrap mb-5 p-2.5 rounded-xl" style={{ background: "#f7faff", border: "1px solid #eef3fa" }}>
          {types.map((type) => (
            <button key={type} onClick={() => setActiveFilter(type)}
              className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
              style={activeFilter === type
                ? { background: "#0F2854", color: "#fff" }
                : { background: "#fff", color: "#0F2854", border: "1px solid #dde6f5" }}>
              {type}
            </button>
          ))}
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filtered.slice(0, 24).map((res, i) => (
            <a key={i} href={res.url} target="_blank" rel="noopener noreferrer"
              className="flex flex-col gap-2 p-4 rounded-2xl transition-all group hover:-translate-y-0.5 hover:shadow-md"
              style={{ border: "1px solid #eef3fa", background: "#fafcff" }}>
              <div className="flex items-start justify-between">
                {res.type && (
                  <span className="text-[10px] font-black px-2 py-0.5 rounded-full"
                    style={{ background: (TYPE_COLORS[res.type] || TYPE_COLORS.Documentation).bg, color: (TYPE_COLORS[res.type] || TYPE_COLORS.Documentation).color }}>
                    {res.type}
                  </span>
                )}
                <ExternalLink className="w-3.5 h-3.5 text-gray-300 group-hover:text-[#1C4D8D] flex-shrink-0 transition-colors" />
              </div>
              <p className="text-sm font-semibold line-clamp-2 leading-snug" style={{ color: "#0F2854" }}>{res.title}</p>
              <div className="mt-auto flex items-center justify-between">
                <span className="text-xs text-gray-400 truncate">{res.careerTitle}</span>
                {res.duration && (
                  <span className="flex items-center gap-1 text-xs text-gray-400 flex-shrink-0 ml-2">
                    <Clock className="w-3 h-3" />{res.duration}
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
