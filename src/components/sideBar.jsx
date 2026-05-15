import { memo } from "react";
import useForm from "../hooks/useForm";
import { useDispatch } from "react-redux";
import { addPost } from "../features/posts/postsSlice";
import { useTranslation } from "react-i18next";

const TAGS = [
  "JavaScript", "React", "Rust", "AI/ML", "DevOps", "CSS", "Go", "TypeScript",
  "Python", "WebAssembly", "C++", "C#", "Java", "PHP", "Swift", "Ruby",
  "backend", "frontend", "fullstack", "mobile", "UI/UX", "design",
];

function SideBar() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [formData, handleChange, handleTagToggle, resetForm] = useForm();

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(addPost(formData));
    resetForm();
  };

  const inputClass =
    "w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white outline-none focus:border-indigo-400 dark:focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900 transition-all duration-200 font-[Inter]";
  const labelClass = "text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1 block";

  return (
    <form
      className="sticky top-24 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm p-6 flex flex-col gap-4 transition-colors duration-200"
      onSubmit={handleSubmit}>
      <h2
        className="text-base font-bold text-slate-800 dark:text-white mb-1"
        style={{ fontFamily: "'Outfit', sans-serif" }}>
        {t("dashboard:sidebar.title")}
      </h2>

      <div>
        <label className={labelClass}>{t("dashboard:sidebar.form.title")}</label>
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
        <label className={labelClass}>{t("dashboard:sidebar.form.description")}</label>
        <input
          type="text"
          name="description"
          onChange={handleChange}
          value={formData.description}
          className={inputClass}
          placeholder={t("dashboard:sidebar.form.placeholders.description")}
        />
      </div>

      <div>
        <label className={labelClass}>{t("dashboard:sidebar.form.date")}</label>
        <input
          type="date"
          name="time"
          onChange={handleChange}
          value={formData.time}
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass}>{t("dashboard:sidebar.form.tags")}</label>
        <div className="flex flex-wrap gap-2 mt-1">
          {TAGS.map((tag) => {
            const isActive = formData.tags.includes(tag);
            return (
              <span
                key={tag}
                onClick={() => handleTagToggle(tag)}
                className={`cursor-pointer text-xs font-semibold px-3 py-1.5 rounded-full border transition-all duration-200 select-none ${
                  isActive
                    ? "bg-indigo-500 text-white border-indigo-500 shadow-sm shadow-indigo-200"
                    : "bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-indigo-300 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-slate-700"
                }`}>
                {tag}
              </span>
            );
          })}
        </div>
      </div>

      <div>
        <label className={labelClass}>{t("dashboard:sidebar.form.img")}</label>
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
        className="mt-2 w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-emerald-100 active:scale-[0.98]">
        {t("dashboard:sidebar.form.submit")}
      </button>
    </form>
  );
}

export default memo(SideBar);

