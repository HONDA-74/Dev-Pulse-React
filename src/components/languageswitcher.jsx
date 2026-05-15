import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { setLanguage } from "../features/language/languageSlice";

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const currentLanguage = useSelector((state) => state.language.language);
  const dispatch = useDispatch();

  const handleLanguageChange = (lang) => {
    i18n.changeLanguage(lang);
    dispatch(setLanguage(lang));
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = lang;
  };

  return (
    <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
      <button
        onClick={() => handleLanguageChange("en")}
        className={`px-3 py-1 text-xs font-bold rounded-md transition-all duration-200 ${
          currentLanguage === "en"
            ? "bg-white dark:bg-slate-600 text-indigo-600 dark:text-white shadow-sm"
            : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
        }`}
      >
        EN
      </button>
      <button
        onClick={() => handleLanguageChange("ar")}
        className={`px-3 py-1 text-xs font-bold rounded-md transition-all duration-200 ${
          currentLanguage === "ar"
            ? "bg-white dark:bg-slate-600 text-indigo-600 dark:text-white shadow-sm"
            : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
        }`}
      >
        AR
      </button>
    </div>
  );
}