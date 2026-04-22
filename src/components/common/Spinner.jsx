export default function Spinner({ size = "md", className = "" }) {
  const sizes = {
    sm: "w-4 h-4 border-2",
    md: "w-7 h-7 border-2",
    lg: "w-12 h-12 border-3",
  };
  return (
    <div
      className={`${sizes[size]} rounded-full border-primary/20 dark:border-white/20 border-t-primary dark:border-t-secondary animate-spin inline-block ${className}`}
    />
  );
}
