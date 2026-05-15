import { useTranslation } from "react-i18next";

export default function AboutPage() {
  const { t } = useTranslation();

  const team = [
    { id: "alex", emoji: "👨‍💻" },
    { id: "jordan", emoji: "🎨" },
    { id: "sam", emoji: "⚙️" },
  ];

  return (
    <div className="max-w-screen-md mx-auto px-6 py-16 transition-colors duration-200">
      {/* Hero */}
      <div className="text-center mb-16">
        <div
          className="font-extrabold text-4xl text-slate-800 dark:text-white mb-4"
          style={{ fontFamily: "'Outfit', sans-serif" }}>
          {t("about.title")}
        </div>
        <p className="text-slate-500 dark:text-slate-400 text-lg leading-relaxed max-w-lg mx-auto">
          {t("about.subtitle")}
        </p>
      </div>

      {/* Mission */}
      <div className="bg-gradient-to-br from-indigo-50 to-violet-50 dark:from-indigo-950/20 dark:to-violet-950/20 border border-indigo-100 dark:border-indigo-900 rounded-2xl p-8 mb-10 transition-colors duration-200">
        <h2
          className="text-xl font-bold text-slate-800 dark:text-white mb-3"
          style={{ fontFamily: "'Outfit', sans-serif" }}>
          {t("about.mission.title")}
        </h2>
        <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
          {t("about.mission.desc")}
        </p>
      </div>

      {/* Values */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-14">
        {[
          { icon: "🌍", key: "open" },
          { icon: "🤝", key: "inclusive" },
          { icon: "🚀", key: "growth" },
        ].map(({ icon, key }) => (
          <div
            key={key}
            className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 text-center shadow-sm hover:shadow-md hover:border-indigo-200 dark:hover:border-indigo-800 transition-all duration-200">
            <div className="text-3xl mb-3">{icon}</div>
            <h3 className="font-bold text-slate-800 dark:text-white mb-1" style={{ fontFamily: "'Outfit', sans-serif" }}>
              {t(`about.values.${key}.title`)}
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {t(`about.values.${key}.desc`)}
            </p>
          </div>
        ))}
      </div>

      {/* Team */}
      <h2
        className="text-2xl font-extrabold text-slate-800 dark:text-white mb-6 text-center"
        style={{ fontFamily: "'Outfit', sans-serif" }}>
        {t("about.team.title")}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {team.map(({ id, emoji }) => (
          <div
            key={id}
            className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 text-center shadow-sm hover:shadow-md transition-all duration-200">
            <div className="text-4xl mb-3">{emoji}</div>
            <div className="font-bold text-slate-800 dark:text-white text-sm">
              {t(`about.team.members.${id}.name`)}
            </div>
            <div className="text-xs text-slate-400 dark:text-slate-500 mt-1">
              {t(`about.team.members.${id}.role`)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}