import { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { toggleReaction, fetchPosts } from "../features/posts/postsSlice";
import { useTranslation } from "react-i18next";

function TagPill({ label }) {
  return (
    <span className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800 transition-colors duration-200">
      {label}
    </span>
  );
}

function Skeleton() {
  return (
    <div className="animate-pulse space-y-4 p-8">
      <div className="h-56 bg-slate-100 dark:bg-slate-800 rounded-2xl" />
      <div className="h-6 bg-slate-100 dark:bg-slate-800 rounded-lg w-3/4" />
      <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-full" />
      <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-5/6" />
      <div className="flex gap-2 mt-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-6 w-16 bg-slate-100 dark:bg-slate-800 rounded-full" />
        ))}
      </div>
    </div>
  );
}

export default function PostDetailsPage() {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const { posts, loading } = useSelector((state) => state.posts);
  const post = posts.find((p) => p.id === id);

  const [visible, setVisible] = useState(false);
  const overlayRef = useRef(null);
  const closeButtonRef = useRef(null);

  useEffect(() => {
    if (!posts.length) {
      dispatch(fetchPosts());
    }
  }, [dispatch, posts.length]);

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
  }, []);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, []);

  useEffect(() => {
    if (!loading && post) {
      closeButtonRef.current?.focus();
    }
  }, [loading, post]);

  const handleClose = useCallback(() => {
    setVisible(false);
    setTimeout(() => navigate("/posts", { replace: true }), 280);
  }, [navigate]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") handleClose();

      if (e.key === "Tab" && overlayRef.current) {
        const focusable = overlayRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey ? document.activeElement === first : document.activeElement === last) {
          e.preventDefault();
          (e.shiftKey ? last : first)?.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [handleClose]);

  const onOverlayClick = (e) => {
    if (e.target === overlayRef.current) handleClose();
  };

  const userId = user?.id;
  const isLiked = post?.likedBy?.includes(userId);
  const isDisliked = post?.dislikedBy?.includes(userId);

  const handleReaction = (type) => {
    if (!userId) return;
    dispatch(toggleReaction({ id, userId, type }));
  };

  return (
    <>
      <style>{`
        @keyframes dpFadeIn   { from { opacity: 0 } to { opacity: 1 } }
        @keyframes dpFadeOut  { from { opacity: 1 } to { opacity: 0 } }
        @keyframes dpSlideIn  { from { opacity: 0; transform: translateY(28px) scale(0.96) } to { opacity: 1; transform: translateY(0) scale(1) } }
        @keyframes dpSlideOut { from { opacity: 1; transform: translateY(0) scale(1) } to { opacity: 0; transform: translateY(28px) scale(0.96) } }

        .dp-overlay-enter { animation: dpFadeIn  0.28s cubic-bezier(0.4,0,0.2,1) forwards; }
        .dp-overlay-exit  { animation: dpFadeOut 0.28s cubic-bezier(0.4,0,0.2,1) forwards; }
        .dp-modal-enter   { animation: dpSlideIn  0.3s cubic-bezier(0.34,1.56,0.64,1) forwards; }
        .dp-modal-exit    { animation: dpSlideOut 0.25s cubic-bezier(0.4,0,0.2,1) forwards; }

        .dp-scrollbar::-webkit-scrollbar { width: 5px; }
        .dp-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .dp-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 99px; }
        .dark .dp-scrollbar::-webkit-scrollbar-thumb { background: #334155; }
      `}</style>

      <div
        ref={overlayRef}
        onClick={onOverlayClick}
        role="dialog"
        aria-modal="true"
        aria-label="Post details"
        className={`fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8
          ${visible ? "dp-overlay-enter" : "dp-overlay-exit"}`}
        style={{
          background: "rgba(15, 23, 42, 0.55)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
        }}
      >
        <div
          className={`relative w-full max-w-2xl max-h-[90vh] bg-white dark:bg-slate-900 rounded-3xl shadow-2xl
            overflow-hidden flex flex-col transition-colors duration-200
            ${visible ? "dp-modal-enter" : "dp-modal-exit"}`}
          style={{ boxShadow: "0 32px 64px -12px rgba(0,0,0,0.25), 0 0 0 1px rgba(99,102,241,0.08)" }}
        >
          <button
            ref={closeButtonRef}
            onClick={handleClose}
            aria-label="Close"
            className="absolute top-4 right-4 z-20 w-9 h-9 flex items-center justify-center
              rounded-full bg-white/90 dark:bg-slate-800/90 shadow-md border border-slate-100 dark:border-slate-700
              text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-white dark:hover:bg-slate-700 hover:border-indigo-200
              hover:shadow-indigo-100 transition-all duration-200 focus:outline-none
              focus:ring-2 focus:ring-indigo-400"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M1 1l12 12M13 1L1 13" />
            </svg>
          </button>

          <div className="overflow-y-auto dp-scrollbar flex-1">

            {loading && !post && <Skeleton />}

            {!loading && !post && (
              <div className="flex flex-col items-center justify-center gap-4 py-24 px-8 text-center">
                <div className="w-16 h-16 rounded-2xl bg-rose-50 dark:bg-rose-900/20 flex items-center justify-center text-3xl">😵</div>
                <p className="text-slate-700 dark:text-slate-300 font-semibold">{t("dashboard:posts.empty")}</p>
                <button
                  onClick={handleClose}
                  className="mt-2 px-5 py-2 bg-indigo-500 text-white text-sm font-semibold rounded-xl hover:bg-indigo-600 transition"
                >
                  {t("navbar.home")}
                </button>
              </div>
            )}

            {post && (
              <>
                {post.img && (
                  <div className="relative w-full h-56 sm:h-72 overflow-hidden bg-slate-100 dark:bg-slate-800 flex-shrink-0">
                    <img
                      src={post.img}
                      alt={post.title}
                      className="w-full h-full object-cover"
                      style={{ filter: "brightness(0.97)" }}
                    />
                    <div
                      className="absolute inset-0 dark:hidden"
                      style={{ background: "linear-gradient(to top, rgba(255,255,255,0.6) 0%, transparent 60%)" }}
                    />
                    <div
                      className="absolute inset-0 hidden dark:block"
                      style={{ background: "linear-gradient(to top, rgba(15,23,42,0.8) 0%, transparent 60%)" }}
                    />
                  </div>
                )}

                <div className="px-7 pb-8 pt-5">

                  {post.time && (
                    <p className="text-xs font-semibold text-indigo-400 dark:text-indigo-500 uppercase tracking-widest mb-2 transition-colors duration-200">
                      {post.time}
                    </p>
                  )}

                  <h2
                    className="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-white leading-tight mb-4 transition-colors duration-200"
                    style={{ fontFamily: "'Outfit', sans-serif" }}
                  >
                    {post.title}
                  </h2>

                  <div className="h-px bg-gradient-to-r from-indigo-100 dark:from-indigo-900 via-slate-100 dark:via-slate-800 to-transparent mb-5" />

                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-[15px] mb-6 whitespace-pre-wrap transition-colors duration-200">
                    {post.description}
                  </p>

                  {Array.isArray(post.tags) && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-8">
                      {post.tags.map((tag) => (
                        <TagPill key={tag} label={tag} />
                      ))}
                    </div>
                  )}

                  <div className="flex items-center gap-3 pt-5 border-t border-slate-100 dark:border-slate-800 transition-colors duration-200">
                    <button
                      onClick={() => handleReaction("like")}
                      disabled={!userId}
                      title={!userId ? "Log in to react" : undefined}
                      className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold
                        transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-300
                        ${isLiked
                          ? "bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-400 shadow-inner"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 hover:text-indigo-600 dark:hover:text-indigo-400 hover:shadow-sm"
                        }
                        ${!userId ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                    >
                      <span className="text-base">👍</span>
                      <span>{post.likes > 0 ? post.likes : ""} {t("dashboard:posts.reactions.like")}</span>
                    </button>

                    <button
                      onClick={() => handleReaction("dislike")}
                      disabled={!userId}
                      title={!userId ? "Log in to react" : undefined}
                      className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold
                        transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-rose-200
                        ${isDisliked
                          ? "bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400 shadow-inner"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-rose-50 dark:hover:bg-rose-900/30 hover:text-rose-50 hover:text-rose-500 hover:shadow-sm"
                        }
                        ${!userId ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                    >
                      <span className="text-base">👎</span>
                      <span>{post.dislikes > 0 ? post.dislikes : ""} {t("dashboard:posts.reactions.dislike")}</span>
                    </button>

                    {!userId && (
                      <span className="ml-auto text-xs text-slate-400 dark:text-slate-500 italic">
                        {t("auth:login.noAccount")}
                      </span>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}