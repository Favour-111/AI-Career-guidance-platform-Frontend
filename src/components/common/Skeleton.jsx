/**
 * Skeleton loader components for graceful loading states.
 * Usage: import { SkeletonLine, SkeletonCard, SkeletonStatCard, SkeletonCareerCard } from "../components/common/Skeleton";
 */

/** Single animated placeholder line */
export function SkeletonLine({
  width = "w-full",
  height = "h-4",
  className = "",
}) {
  return (
    <div
      className={`${width} ${height} rounded-md bg-gray-200 dark:bg-gray-700 animate-pulse ${className}`}
    />
  );
}

/** Generic card with N placeholder rows */
export function SkeletonCard({ rows = 3, className = "" }) {
  return (
    <div
      className={`rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-dark-card p-5 space-y-3 ${className}`}
    >
      <SkeletonLine width="w-1/3" height="h-5" />
      {Array.from({ length: rows }).map((_, i) => (
        <SkeletonLine key={i} width={i % 2 === 0 ? "w-full" : "w-3/4"} />
      ))}
    </div>
  );
}

/** Stat card placeholder (icon + label + value) */
export function SkeletonStatCard() {
  return (
    <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-dark-card p-5 flex items-center gap-4">
      <div className="w-12 h-12 rounded-xl bg-gray-200 dark:bg-gray-700 animate-pulse shrink-0" />
      <div className="flex-1 space-y-2">
        <SkeletonLine width="w-2/3" height="h-3" />
        <SkeletonLine width="w-1/3" height="h-6" />
      </div>
    </div>
  );
}

/** Career recommendation card placeholder */
export function SkeletonCareerCard() {
  return (
    <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-dark-card p-5 space-y-4">
      {/* Header row */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gray-200 dark:bg-gray-700 animate-pulse shrink-0" />
        <div className="flex-1 space-y-1.5">
          <SkeletonLine width="w-1/2" height="h-4" />
          <SkeletonLine width="w-1/3" height="h-3" />
        </div>
        <div className="w-14 h-8 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
      </div>
      {/* Description */}
      <SkeletonLine width="w-full" />
      <SkeletonLine width="w-4/5" />
      {/* Tags row */}
      <div className="flex gap-2">
        <div className="w-16 h-6 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
        <div className="w-20 h-6 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
        <div className="w-14 h-6 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
      </div>
    </div>
  );
}

/** Learning resource row placeholder */
export function SkeletonResourceRow() {
  return (
    <div className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-dark-card">
      <div className="w-9 h-9 rounded-lg bg-gray-200 dark:bg-gray-700 animate-pulse shrink-0" />
      <div className="flex-1 space-y-1.5">
        <SkeletonLine width="w-2/3" height="h-4" />
        <SkeletonLine width="w-1/3" height="h-3" />
      </div>
      <div className="w-20 h-6 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
    </div>
  );
}
