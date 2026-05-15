import { memo } from "react";

function DisLike({ disliked, dislikes, onDislike, label }) {
  const DislikeAction = (e) => {
    e.stopPropagation();
    onDislike();
  };

  return (
    <button
      onClick={DislikeAction}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
        disliked
          ? "bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400"
          : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-rose-50 dark:hover:bg-rose-900/30 hover:text-rose-500 dark:hover:text-rose-300"
      }`}>
      <span>👎</span>
      {dislikes > 0 ? `${dislikes} ${label || "Dislike"}` : (label || "Dislike")}
    </button>
  );
}

export default memo(DisLike);

