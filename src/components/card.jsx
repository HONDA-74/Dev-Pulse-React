import { memo } from "react";
import { v4 as uuid } from "uuid";
import Like from "./like";
import DisLike from "./dislike";
import { useDispatch, useSelector } from "react-redux";
import { toggleReaction } from "../features/posts/postsSlice";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { formatRelativeTime } from "../utils/formatRelativeTime";

function Card({ card }) {
  const { t } = useTranslation();
  const {
    img,
    title,
    description,
    createdAt,   // new numeric timestamp (Date.now())
    time,        // legacy string field – still supported
    tags,
    id,
    likes = 0,
    dislikes = 0,
    likedBy = [],
    dislikedBy = [],
  } = card;

  const navigate  = useNavigate();
  const dispatch  = useDispatch();
  const user      = useSelector((state) => state.auth.user);
  const userId    = user?.id;

  const isLiked    = likedBy.includes(userId);
  const isDisliked = dislikedBy.includes(userId);

  // Prefer numeric createdAt; fall back to legacy time string
  const displayTime = formatRelativeTime(createdAt ?? time);

  const handleReaction = (type) => {
    if (!user) return;
    dispatch(toggleReaction({ id, userId: user.id, type }));
  };

  return (
    <div
      onClick={() => navigate(`/posts/${id}`)}
      className="
        group cursor-pointer
        bg-white dark:bg-slate-900
        border border-slate-200 dark:border-slate-800
        rounded-2xl overflow-hidden shadow-sm
        hover:shadow-xl hover:shadow-indigo-100/40 dark:hover:shadow-indigo-900/20
        hover:-translate-y-1.5 hover:border-indigo-300 dark:hover:border-indigo-700
        transition-all duration-300 ease-out
        flex flex-col h-full
      "
    >
      {/* ── Image ── */}
      <div className="relative w-full aspect-video overflow-hidden flex-shrink-0 bg-slate-100 dark:bg-slate-800">
        {img ? (
          <img
            src={img}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-300 dark:text-slate-600 text-4xl">
            📄
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* ── Body ── */}
      <div className="flex-1 flex flex-col px-4 pt-4 pb-4">

        {displayTime && (
          <span className="text-[10px] font-semibold uppercase tracking-widest text-indigo-400 dark:text-indigo-500 mb-1.5">
            {displayTime}
          </span>
        )}

        <h3
          className="text-sm font-bold text-slate-800 dark:text-white mb-2 leading-snug group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-200"
          style={{ fontFamily: "'Outfit', sans-serif" }}
        >
          {title}
        </h3>

        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-3 flex-1 line-clamp-3">
          {description}
        </p>

        {Array.isArray(tags) && tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {tags.slice(0, 3).map((tag) => (
              <span
                key={uuid()}
                className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800"
              >
                #{tag}
              </span>
            ))}
            {tags.length > 3 && (
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500">
                +{tags.length - 3}
              </span>
            )}
          </div>
        )}

        <div className="flex gap-2 pt-3 border-t border-slate-100 dark:border-slate-800 mt-auto">
          <Like
            likes={likes}
            liked={isLiked}
            onLike={() => handleReaction("like")}
            label={t("dashboard:posts.reactions.like")}
          />
          <DisLike
            dislikes={dislikes}
            disliked={isDisliked}
            onDislike={() => handleReaction("dislike")}
            label={t("dashboard:posts.reactions.dislike")}
          />
        </div>
      </div>
    </div>
  );
}

export default memo(Card);