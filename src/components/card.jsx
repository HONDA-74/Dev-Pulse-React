import { memo } from "react";
import { v4 as uuid } from "uuid";
import Like from "./like";
import DisLike from "./dislike";
import { useDispatch, useSelector } from "react-redux";
import { toggleReaction } from "../features/posts/postsSlice";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";

function Card({ card }) {
  const { t } = useTranslation();
  const {
    img,
    title,
    description,
    time,
    tags,
    id,
    likes = 0,
    dislikes = 0,
    likedBy = [],
    dislikedBy = [],
  } = card;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const userId = user?.id;

  const isLiked = likedBy.includes(userId);
  const isDisliked = dislikedBy.includes(userId);

  const handleReaction = (type) => {
    if (!user) return;
    dispatch(toggleReaction({ id, userId: user.id, type }));
  };

  return (
    <div onClick={() => navigate(`/posts/${id}`)} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1.5 hover:border-indigo-300 dark:hover:border-indigo-800 transition-all duration-300 pb-5 flex flex-col">
      <img src={img} alt="" className="w-full h-44 object-cover" />
      <div className="flex-1 flex flex-col px-5">
        <h3
          className="text-base font-semibold text-slate-800 dark:text-white mt-4 mb-2 leading-snug transition-colors duration-200"
          style={{ fontFamily: "'Outfit', sans-serif" }}>
          {title}
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-4 flex-1 transition-colors duration-200">
          {description}
        </p>
        <span className="text-xs text-slate-400 dark:text-slate-500 font-medium mb-3">{time}</span>

        <div className="flex flex-wrap gap-1.5 mb-4">
          {Array.isArray(tags) &&
            tags.map((tag) => (
              <span
                key={uuid()}
                className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400">
                {tag}
              </span>
            ))}
        </div>

        <div className="flex gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
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

