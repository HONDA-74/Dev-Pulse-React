import { Link } from "react-router";
import { useTranslation } from "react-i18next";

export default function NotFoundPage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50/30 dark:from-slate-950 dark:to-indigo-950/20 flex items-center justify-center px-4 transition-colors duration-200">
      <div className="text-center">
        <div
          className="text-8xl font-extrabold text-indigo-500 mb-4"
          style={{ fontFamily: "'Outfit', sans-serif" }}>
          {t("notFound.title")}
        </div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-3">{t("notFound.subtitle")}</h1>
        <p className="text-slate-500 dark:text-slate-400 mb-8">
          {t("notFound.desc")}
        </p>
        <Link
          to="/home"
          className="px-6 py-3 bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-semibold rounded-full transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-200">
          {t("notFound.button")}
        </Link>
      </div>
    </div>
  );
}