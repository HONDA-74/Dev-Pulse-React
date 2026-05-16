import { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { toggleReaction, fetchPosts } from "../features/posts/postsSlice";
import { useTranslation } from "react-i18next";
import { formatRelativeTime } from "../utils/formatRelativeTime";

/* ─── Estimated reading time ──────────────────────────────────── */
function readingTime(text = "") {
  const words = text.trim().split(/\s+/).length;
  const mins  = Math.max(1, Math.ceil(words / 200));
  return `${mins} min read`;
}

/* ─── Avatar ─────────────────────────────────────────────────── */
function Avatar({ size = "md" }) {
  const sz = size === "lg"
    ? "w-12 h-12 text-sm"
    : "w-9 h-9 text-xs";
  return (
    <div
      className={`${sz} rounded-full flex-shrink-0 flex items-center justify-center font-bold text-white shadow-md`}
      style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}
    >
      DP
    </div>
  );
}

/* ─── Tag chip ───────────────────────────────────────────────── */
function TagChip({ label }) {
  return (
    <span className="
      inline-flex items-center gap-1
      text-xs font-semibold px-3 py-1.5 rounded-full
      bg-slate-100 dark:bg-slate-800
      text-slate-600 dark:text-slate-300
      border border-slate-200 dark:border-slate-700
      hover:bg-indigo-50 dark:hover:bg-indigo-900/30
      hover:text-indigo-600 dark:hover:text-indigo-400
      hover:border-indigo-200 dark:hover:border-indigo-700
      transition-all duration-150 cursor-default select-none
    ">
      <span className="text-indigo-400">#</span>{label}
    </span>
  );
}

/* ─── Skeleton ───────────────────────────────────────────────── */
function Skeleton() {
  return (
    <div className="animate-pulse max-w-4xl mx-auto px-6 py-12 space-y-6">
      <div className="h-72 sm:h-96 bg-slate-100 dark:bg-slate-800 rounded-3xl" />
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800" />
        <div className="space-y-2">
          <div className="h-4 w-32 bg-slate-100 dark:bg-slate-800 rounded" />
          <div className="h-3 w-48 bg-slate-100 dark:bg-slate-800 rounded" />
        </div>
      </div>
      <div className="h-9 bg-slate-100 dark:bg-slate-800 rounded-xl w-3/4" />
      <div className="space-y-3">
        <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-full" />
        <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-5/6" />
        <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-4/5" />
      </div>
      <div className="flex gap-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-7 w-20 bg-slate-100 dark:bg-slate-800 rounded-full" />
        ))}
      </div>
    </div>
  );
}

/* ─── Main component ─────────────────────────────────────────── */
export default function PostDetailsPage() {
  const { t }       = useTranslation();
  const { id }      = useParams();
  const navigate    = useNavigate();
  const dispatch    = useDispatch();
  const user        = useSelector((state) => state.auth.user);
  const { posts, loading } = useSelector((state) => state.posts);
  const post        = posts.find((p) => p.id === id);

  const [visible, setVisible]   = useState(false);
  const overlayRef              = useRef(null);
  const closeButtonRef          = useRef(null);

  /* Fetch if store is empty */
  useEffect(() => {
    if (!posts.length) dispatch(fetchPosts());
  }, [dispatch, posts.length]);

  /* Animate in */
  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
  }, []);

  /* Lock body scroll */
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, []);

  /* Focus close button once content loads */
  useEffect(() => {
    if (!loading && post) closeButtonRef.current?.focus();
  }, [loading, post]);

  /* Close handler */
  const handleClose = useCallback(() => {
    setVisible(false);
    setTimeout(() => navigate("/posts", { replace: true }), 280);
  }, [navigate]);

  /* Keyboard: Escape + Tab trap */
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") { handleClose(); return; }
      if (e.key === "Tab" && overlayRef.current) {
        const focusable = overlayRef.current.querySelectorAll(
          'button,[href],input,select,textarea,[tabindex]:not([tabindex="-1"])'
        );
        const first = focusable[0];
        const last  = focusable[focusable.length - 1];
        if (e.shiftKey ? document.activeElement === first : document.activeElement === last) {
          e.preventDefault();
          (e.shiftKey ? last : first)?.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [handleClose]);

  /* Overlay click closes */
  const onOverlayClick = (e) => {
    if (e.target === overlayRef.current) handleClose();
  };

  const userId     = user?.id;
  const isLiked    = post?.likedBy?.includes(userId);
  const isDisliked = post?.dislikedBy?.includes(userId);

  const handleReaction = (type) => {
    if (!userId) return;
    dispatch(toggleReaction({ id, userId, type }));
  };

  const timeDisplay = formatRelativeTime(post?.createdAt ?? post?.time);
  const estRead     = post ? readingTime(post.description) : "";

  /* ── Render ──────────────────────────────────────────────────── */
  return (
    <>
      <style>{`
        @keyframes dpOverlayIn  { from { opacity:0 } to { opacity:1 } }
        @keyframes dpOverlayOut { from { opacity:1 } to { opacity:0 } }
        @keyframes dpPanelIn    { from { opacity:0; transform:translateY(40px) scale(0.97) } to { opacity:1; transform:translateY(0) scale(1) } }
        @keyframes dpPanelOut   { from { opacity:1; transform:translateY(0)  scale(1) } to { opacity:0; transform:translateY(24px) scale(0.97) } }

        .dp-overlay-in  { animation: dpOverlayIn  0.28s cubic-bezier(0.4,0,0.2,1) forwards; }
        .dp-overlay-out { animation: dpOverlayOut 0.25s cubic-bezier(0.4,0,0.2,1) forwards; }
        .dp-panel-in    { animation: dpPanelIn  0.35s cubic-bezier(0.34,1.3,0.64,1) forwards; }
        .dp-panel-out   { animation: dpPanelOut 0.25s cubic-bezier(0.4,0,0.2,1) forwards; }

        .dp-scroll { scrollbar-width: thin; scrollbar-color: #e2e8f0 transparent; }
        .dp-scroll::-webkit-scrollbar       { width: 4px; }
        .dp-scroll::-webkit-scrollbar-track { background: transparent; }
        .dp-scroll::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 99px; }
        .dark .dp-scroll::-webkit-scrollbar-thumb { background: #334155; }
      `}</style>

      {/* ── Backdrop ── */}
      <div
        ref={overlayRef}
        onClick={onOverlayClick}
        role="dialog"
        aria-modal="true"
        aria-label="Post details"
        className={`fixed inset-0 z-50 flex items-start justify-center overflow-y-auto py-8 px-4 sm:px-8 ${visible ? "dp-overlay-in" : "dp-overlay-out"}`}
        style={{
          background: "rgba(2,6,23,0.72)",
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
        }}
      >

        {/* ── Panel ── */}
        <article
          className={`
            relative w-full max-w-4xl
            bg-white dark:bg-slate-900
            rounded-3xl shadow-2xl overflow-hidden
            transition-colors duration-200
            mb-8
            ${visible ? "dp-panel-in" : "dp-panel-out"}
          `}
          style={{
            boxShadow: "0 48px 96px -24px rgba(0,0,0,0.4), 0 0 0 1px rgba(99,102,241,0.1)",
          }}
        >

          {/* ── Close ── */}
          <button
            ref={closeButtonRef}
            onClick={handleClose}
            aria-label="Close"
            className="
              absolute top-4 right-4 z-30
              w-9 h-9 flex items-center justify-center rounded-full
              bg-white/90 dark:bg-slate-800/90
              border border-slate-200 dark:border-slate-700
              shadow-lg text-slate-500 dark:text-slate-400
              hover:bg-white dark:hover:bg-slate-700
              hover:text-slate-900 dark:hover:text-white
              hover:border-indigo-300 dark:hover:border-indigo-600
              transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-indigo-400
            "
          >
            <svg width="12" height="12" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round">
              <path d="M1 1l12 12M13 1L1 13" />
            </svg>
          </button>

          {/* ── Loading ── */}
          {loading && !post && <Skeleton />}

          {/* ── Not found ── */}
          {!loading && !post && (
            <div className="flex flex-col items-center justify-center gap-5 py-32 px-8 text-center">
              <div className="w-20 h-20 rounded-3xl bg-rose-50 dark:bg-rose-900/20 flex items-center justify-center text-4xl shadow-inner">
                😵
              </div>
              <div>
                <p className="text-xl font-bold text-slate-800 dark:text-white mb-1">
                  {t("dashboard:posts.empty")}
                </p>
                <p className="text-sm text-slate-400 dark:text-slate-500">
                  This post might have been removed.
                </p>
              </div>
              <button
                onClick={handleClose}
                className="mt-2 px-6 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-semibold rounded-xl transition-colors shadow-lg shadow-indigo-200 dark:shadow-indigo-900/40"
              >
                ← Back to Posts
              </button>
            </div>
          )}

          {/* ── Post content ── */}
          {post && (
            <div className="dp-scroll overflow-y-auto">

              {/* Hero image */}
              {post.img && (
                <div className="relative w-full overflow-hidden bg-slate-100 dark:bg-slate-800" style={{ aspectRatio: "16/7" }}>
                  <img
                    src={post.img}
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                  {/* bottom-to-top scrim for contrast */}
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background: "linear-gradient(to top, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.1) 40%, transparent 70%)",
                    }}
                  />
                </div>
              )}

              {/* Content wrapper */}
              <div className="px-6 sm:px-10 md:px-14 py-10">

                {/* ── Author row ── */}
                <div className="flex items-center justify-between gap-4 mb-7">
                  <div className="flex items-center gap-3">
                    <Avatar size="lg" />
                    <div>
                      <p className="text-sm font-bold text-slate-800 dark:text-white leading-tight">
                        devpulse Author
                      </p>
                      <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5 flex items-center gap-1.5 flex-wrap">
                        {timeDisplay && <span>{timeDisplay}</span>}
                        {timeDisplay && <span className="opacity-40">•</span>}
                        <span>{estRead}</span>
                      </p>
                    </div>
                  </div>

                  {/* Bookmark / share placeholder buttons */}
                  <div className="flex items-center gap-2">
                    <button
                      aria-label="Bookmark"
                      className="w-9 h-9 flex items-center justify-center rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-500 hover:text-indigo-500 hover:border-indigo-300 dark:hover:border-indigo-700 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all duration-150"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                      </svg>
                    </button>
                    <button
                      aria-label="Share"
                      className="w-9 h-9 flex items-center justify-center rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-500 hover:text-indigo-500 hover:border-indigo-300 dark:hover:border-indigo-700 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all duration-150"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* ── Title ── */}
                <h1
                  className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white leading-tight mb-6"
                  style={{ fontFamily: "'Outfit', sans-serif" }}
                >
                  {post.title}
                </h1>

                {/* ── Divider ── */}
                <div className="h-px bg-gradient-to-r from-indigo-200 dark:from-indigo-800 via-slate-200 dark:via-slate-700/50 to-transparent mb-8" />

                {/* ── Body text ── */}
                <div className="prose-like">
                  <p className="text-[15px] sm:text-base text-slate-600 dark:text-slate-300 leading-[1.9] whitespace-pre-wrap">
                    {post.description}
                  </p>
                </div>

                {/* ── Tags ── */}
                {Array.isArray(post.tags) && post.tags.length > 0 && (
                  <div className="mt-10">
                    <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-3">
                      Topics
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {post.tags.map((tag) => (
                        <TagChip key={tag} label={tag} />
                      ))}
                    </div>
                  </div>
                )}

                {/* ── Reactions ── */}
                <div className="mt-10 pt-8 border-t border-slate-100 dark:border-slate-800">
                  <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-4">
                    Reactions
                  </p>

                  <div className="flex items-center gap-3 flex-wrap">

                    {/* Like */}
                    <button
                      onClick={() => handleReaction("like")}
                      disabled={!userId}
                      title={!userId ? "Log in to react" : undefined}
                      className={`
                        group/like flex items-center gap-2.5
                        px-5 py-2.5 rounded-xl text-sm font-semibold
                        border transition-all duration-200
                        focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:ring-offset-1
                        ${isLiked
                          ? "bg-indigo-500 border-indigo-500 text-white shadow-lg shadow-indigo-200 dark:shadow-indigo-900/50"
                          : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:border-indigo-300 dark:hover:border-indigo-700 hover:text-indigo-600 dark:hover:text-indigo-400 hover:shadow-md"
                        }
                        ${!userId ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}
                      `}
                    >
                      <span className="text-lg transition-transform duration-200 group-hover/like:scale-125">👍</span>
                      <span>
                        {post.likes > 0 ? post.likes : ""} {t("dashboard:posts.reactions.like")}
                      </span>
                    </button>

                    {/* Dislike */}
                    <button
                      onClick={() => handleReaction("dislike")}
                      disabled={!userId}
                      title={!userId ? "Log in to react" : undefined}
                      className={`
                        group/dislike flex items-center gap-2.5
                        px-5 py-2.5 rounded-xl text-sm font-semibold
                        border transition-all duration-200
                        focus:outline-none focus:ring-2 focus:ring-rose-300 focus:ring-offset-1
                        ${isDisliked
                          ? "bg-rose-500 border-rose-500 text-white shadow-lg shadow-rose-200 dark:shadow-rose-900/50"
                          : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-rose-50 dark:hover:bg-rose-900/20 hover:border-rose-300 dark:hover:border-rose-800 hover:text-rose-600 dark:hover:text-rose-400 hover:shadow-md"
                        }
                        ${!userId ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}
                      `}
                    >
                      <span className="text-lg transition-transform duration-200 group-hover/dislike:scale-125">👎</span>
                      <span>
                        {post.dislikes > 0 ? post.dislikes : ""} {t("dashboard:posts.reactions.dislike")}
                      </span>
                    </button>

                    {/* Login nudge */}
                    {!userId && (
                      <p className="ml-auto text-xs text-slate-400 dark:text-slate-500 italic">
                        {t("auth:login.noAccount")}
                      </p>
                    )}
                  </div>
                </div>

              </div>{/* /content wrapper */}
            </div>
          )}

        </article>
      </div>
    </>
  );
}