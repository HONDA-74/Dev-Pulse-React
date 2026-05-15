import { useTranslation } from "react-i18next";

function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="mt-20 py-10 px-6 md:px-10 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 text-center transition-colors duration-200">
      <div
        className="font-extrabold text-xl text-slate-800 dark:text-white mb-4"
        style={{ fontFamily: "'Outfit', sans-serif" }}>
        dev<span className="text-indigo-500">pulse</span>
      </div>
      <div className="flex justify-center flex-wrap gap-6 mb-5">
        {[
          { label: t("footer.about"), href: "#" },
          { label: t("footer.privacy"), href: "#" },
          { label: t("footer.terms"), href: "#" },
          { label: t("footer.blog"), href: "#" },
          { label: t("footer.github"), href: "#" },
        ].map((link) => (
          <a
            key={link.label}
            href={link.href}
            className="text-sm font-medium text-slate-400 hover:text-rose-500 transition-colors duration-200">
            {link.label}
          </a>
        ))}
      </div>
      <p className="text-xs text-slate-400">
        {t("footer.rights")}
      </p>
    </footer>
  );
}

export default Footer;

