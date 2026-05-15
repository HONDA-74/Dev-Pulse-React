import { useDispatch } from "react-redux";
import useForm from "../hooks/useForm";
import { addPost } from "../features/posts/postsSlice";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";

const TAGS = [
  "JavaScript", "React", "Rust", "AI/ML", "DevOps", "CSS", "Go", "TypeScript",
  "Python", "WebAssembly", "C++", "C#", "Java", "PHP", "Swift", "Ruby",
  "backend", "frontend", "fullstack", "mobile", "UI/UX", "design",
];

export default function AddPostPage() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [formData, handleChange, handleTagToggle, resetForm ] = useForm();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(addPost(formData)).unwrap();
      resetForm();
      navigate("/posts", { replace: true });
    } catch (err) {
      console.log(err);
    }
  };

  const inputClass =
    "w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white outline-none focus:border-indigo-400 dark:focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900 transition-all duration-200 font-[Inter]";
  const labelClass = "text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1 block";

  return (
    <div className="max-w-3xl mx-auto px-6 py-10 transition-colors duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm p-8">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-6" style={{ fontFamily: "'Outfit', sans-serif" }}>
          {t("dashboard:sidebar.title")}
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label className={labelClass}>
              {t("dashboard:sidebar.form.title")}
            </label>
            <input
              type="text"
              name="title"
              onChange={handleChange}
              value={formData.title}
              className={inputClass}
              placeholder={t("dashboard:sidebar.form.placeholders.title")}
            />
          </div>

          <div>
            <label className={labelClass}>
              {t("dashboard:sidebar.form.description")}
            </label>
            <textarea
              name="description"
              onChange={handleChange}
              value={formData.description}
              className={`${inputClass} h-24 resize-none`}
              placeholder={t("dashboard:sidebar.form.placeholders.description")}
            />
          </div>
          <div>
            <label className={labelClass}>
              {t("dashboard:sidebar.form.date")}
            </label>
            <input
              type="date"
              name="time"
              onChange={handleChange}
              value={formData.time}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>
              {t("dashboard:sidebar.form.tags")}
            </label>

            <div className="flex flex-wrap gap-2">
              {TAGS.map((tag) => {
                const isActive = formData.tags.includes(tag);

                return (
                  <span
                    key={tag}
                    onClick={() => handleTagToggle(tag)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-full cursor-pointer transition ${
                      isActive
                        ? "bg-indigo-500 text-white"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-indigo-50 dark:hover:bg-slate-700 hover:text-indigo-500"
                    }`}>
                    {tag}
                  </span>
                );
              })}
            </div>
          </div>

          <div>
            <label className={labelClass}>
              {t("dashboard:sidebar.form.img")}
            </label>
            <input
              type="text"
              name="img"
              onChange={handleChange}
              value={formData.img}
              className={inputClass}
              placeholder={t("dashboard:sidebar.form.placeholders.img")}
            />
          </div>

          <button
            type="submit"
            className="mt-4 w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition active:scale-95">
            {t("dashboard:sidebar.form.submit")}
          </button>
        </form>
      </div>
    </div>
  );
}

