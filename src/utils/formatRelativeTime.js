export function formatRelativeTime(timestamp) {
  if (!timestamp) return "";

  const date = typeof timestamp === "number" ? new Date(timestamp) : new Date(timestamp);

  if (isNaN(date.getTime())) {
    return String(timestamp);
  }

  const now = Date.now();
  const diffMs = now - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr  = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr  / 24);

  if (diffSec < 60)  return "Just now";
  if (diffMin < 60)  return `${diffMin} minute${diffMin === 1 ? "" : "s"} ago`;
  if (diffHr  < 24)  return `${diffHr} hour${diffHr  === 1 ? "" : "s"} ago`;
  if (diffDay < 7)   return `${diffDay} day${diffDay  === 1 ? "" : "s"} ago`;

  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}