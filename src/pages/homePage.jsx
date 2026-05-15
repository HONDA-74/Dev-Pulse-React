import Slider from "../components/slider";
import { Link } from "react-router";
import { useTranslation } from "react-i18next";

export default function HomePage() {
  const { t } = useTranslation();

  return (
    <div>
      {/* Hero Section */}
      <section className="max-w-screen-xl mx-auto px-6 pt-16 pb-8 text-center">
        <div className="inline-flex items-center gap-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-xs font-semibold px-4 py-2 rounded-full mb-6 border border-indigo-100 dark:border-indigo-800 transition-colors duration-200">
          <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
          {t("home.community")}
        </div>

        <h1
          className="text-5xl font-extrabold text-slate-800 dark:text-white mb-5 leading-tight transition-colors duration-200"
          style={{ fontFamily: "'Outfit', sans-serif" }}>
          {t("home.hero.title")}
        </h1>

        <p className="text-slate-500 dark:text-slate-400 text-lg max-w-xl mx-auto mb-8 leading-relaxed transition-colors duration-200">
          {t("home.hero.subtitle")}
        </p>

        <div className="flex items-center justify-center gap-4">
          <Link
            to="/posts"
            className="px-6 py-3 bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-semibold rounded-full transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-200">
            {t("home.actions.browse")}
          </Link>
          <Link
            to="/create-post"
            className="px-6 py-3 border border-slate-200 dark:border-slate-700 hover:border-indigo-300 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-slate-800 text-sm font-semibold rounded-full transition-all duration-200">
            {t("home.actions.create")}
          </Link>
        </div>
      </section>

      {/* Slider */}
      <Slider />

      {/* Stats */}
      <section className="max-w-screen-xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { value: "7+", label: t("home.stats.posts") },
            { value: "22+", label: t("home.stats.tags") },
            { value: "100%", label: t("home.stats.openSource") },
          ].map(({ value, label }) => (
            <div
              key={label}
              className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 text-center shadow-sm hover:shadow-md hover:border-indigo-200 dark:hover:border-indigo-800 transition-all duration-200">
              <div
                className="text-3xl font-extrabold text-indigo-500 mb-1"
                style={{ fontFamily: "'Outfit', sans-serif" }}>
                {value}
              </div>
              <div className="text-sm text-slate-500 dark:text-slate-400 font-medium">{label}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}