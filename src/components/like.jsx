import { memo } from "react";

function Like({ liked, likes, onLike, label }) {
  const likeAction = (e) => {
    e.stopPropagation();
    onLike();
  };

  return (
    <button
      onClick={likeAction}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
        liked
          ? "bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400"
          : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 hover:text-indigo-500 dark:hover:text-indigo-300"
      }`}>
      <span>👍</span>
      {likes > 0 ? `${likes} ${label || "Like"}` : (label || "Like")}
    </button>
  );
}

export default memo(Like);

