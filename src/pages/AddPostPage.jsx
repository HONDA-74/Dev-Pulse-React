import { useState } from "react";
import { useDispatch } from "react-redux";
import { addPost } from "../features/posts/postsSlice";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";

/* ─── Tag list (same as original) ───────────────────────────── */
const TAGS = [
  "JavaScript", "React",  "Rust",   "AI/ML",      "DevOps",      "CSS",
  "Go",         "TypeScript", "Python", "WebAssembly", "C++",      "C#",
  "Java",       "PHP",    "Swift",  "Ruby",        "backend",     "frontend",
  "fullstack",  "mobile", "UI/UX",  "design",
];

/* ─── Inline form state (no useForm hook — we drop "time") ──── */
const INIT = {
  title:       "",
  description: "",
  tags:        [],
  img:         "",
  likes:       0,
  dislikes:    0,
  likedBy:     [],
  dislikedBy:  [],
};

export default function AddPostPage() {
  const { t }    = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [form,    setForm]    = useState(INIT);
  const [preview, setPreview] = useState("");

  /* Field change */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (name === "img") setPreview(value);
  };

  /* Tag toggle */
  const handleTagToggle = (tag) => {
    setForm((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter((t) => t !== tag)
        : [...prev.tags, tag],
    }));
  };

  /* Submit – inject createdAt automatically */
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const postData = { ...form, createdAt: Date.now() };
      await dispatch(addPost(postData)).unwrap();
      setForm(INIT);
      setPreview("");
      navigate("/posts", { replace: true });
    } catch (err) {
      console.error(err);
    }
  };

  /* Shared input class */
  const inputCls = `
    w-full px-4 py-3.5 text-sm rounded-xl
    border border-slate-200 dark:border-slate-700
    bg-slate-50 dark:bg-slate-800/60
    text-slate-800 dark:text-white
    placeholder-slate-400 dark:placeholder-slate-500
    outline-none
    focus:border-indigo-400 dark:focus:border-indigo-500
    focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900/50
    focus:bg-white dark:focus:bg-slate-800
    transition-all duration-200
  `;

  const labelCls = "block text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-2";

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-200">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-14">

        <div className="mb-10">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-indigo-500 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-3 py-1.5 rounded-full border border-indigo-100 dark:border-indigo-800 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
            New post
          </div>
          <h1
            className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white leading-tight"
            style={{ fontFamily: "'Outfit', sans-serif" }}
          >
            {t("dashboard:sidebar.title")}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-2">
            Share your knowledge with the devpulse community.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl shadow-slate-200/60 dark:shadow-slate-900/60 overflow-hidden">

          <div className="h-1 w-full bg-gradient-to-r from-indigo-500 via-violet-500 to-indigo-400" />

          <form onSubmit={handleSubmit} className="p-8 sm:p-10 flex flex-col gap-8">

            <div>
              <label className={labelCls}>
                {t("dashboard:sidebar.form.title")}
              </label>
              <input
                type="text"
                name="title"
                required
                value={form.title}
                onChange={handleChange}
                className={inputCls}
                placeholder={t("dashboard:sidebar.form.placeholders.title")}
              />
            </div>

            <div>
              <label className={labelCls}>
                {t("dashboard:sidebar.form.description")}
              </label>
              <textarea
                name="description"
                required
                value={form.description}
                onChange={handleChange}
                className={`${inputCls} min-h-[140px] resize-y leading-relaxed`}
                placeholder={t("dashboard:sidebar.form.placeholders.description")}
              />
            </div>

            <div>
              <label className={labelCls}>
                {t("dashboard:sidebar.form.img")}
              </label>

              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round"
                      d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                </div>
                <input
                  type="url"
                  name="img"
                  value={form.img}
                  onChange={handleChange}
                  className={`${inputCls} pl-11`}
                  placeholder={t("dashboard:sidebar.form.placeholders.img")}
                />
              </div>

              {/* Live preview */}
              {preview && (
                <div className="mt-3 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 aspect-video">
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => { e.currentTarget.style.display = "none"; }}
                  />
                </div>
              )}
            </div>

            <div>
              <label className={labelCls}>
                {t("dashboard:sidebar.form.tags")}
              </label>
              <p className="text-xs text-slate-400 dark:text-slate-500 mb-3">
                Select all that apply. Click to toggle.
              </p>
              <div className="flex flex-wrap gap-2">
                {TAGS.map((tag) => {
                  const active = form.tags.includes(tag);
                  return (
                    <button
                      type="button"
                      key={tag}
                      onClick={() => handleTagToggle(tag)}
                      className={`
                        px-3.5 py-1.5 text-xs font-semibold rounded-full
                        border transition-all duration-200 select-none
                        ${active
                          ? "bg-indigo-500 text-white border-indigo-500 shadow-md shadow-indigo-200 dark:shadow-indigo-900/40 scale-105"
                          : "bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-300 dark:hover:border-indigo-700"
                        }
                      `}
                    >
                      {active ? `✓ ${tag}` : `# ${tag}`}
                    </button>
                  );
                })}
              </div>
              {form.tags.length > 0 && (
                <p className="text-xs text-indigo-500 dark:text-indigo-400 font-medium mt-3">
                  {form.tags.length} tag{form.tags.length > 1 ? "s" : ""} selected
                </p>
              )}
            </div>

            <div className="h-px bg-slate-100 dark:bg-slate-800 -mx-2" />

            <div className="flex items-center justify-between gap-4 flex-wrap">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors"
              >
                ← Cancel
              </button>

              <button
                type="submit"
                className="
                  flex items-center gap-2.5
                  px-8 py-3.5
                  bg-indigo-500 hover:bg-indigo-600
                  text-white text-sm font-bold
                  rounded-xl
                  transition-all duration-200
                  hover:-translate-y-0.5
                  hover:shadow-xl hover:shadow-indigo-300/50 dark:hover:shadow-indigo-900/50
                  active:translate-y-0 active:scale-[0.98]
                  focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2
                "
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
                {t("dashboard:sidebar.form.submit")}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}