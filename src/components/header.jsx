import { NavLink, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../features/auth/authSlice";
import { useTranslation } from "react-i18next";
import ThemeToggle from "./themeToggle";
import LanguageSwitcher from "./languageSwitcher";

function Header() {
  const { t } = useTranslation();
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login", { replace: true });
  };

  const navItems = [
    { name: t("navbar.home"), path: "/home" },
    { name: t("navbar.posts"), path: "/posts" },
    { name: t("navbar.createPost"), path: "/create-post" },
    { name: t("navbar.about"), path: "/about" },
  ];

  return (
    <header className="flex justify-between items-center px-6 md:px-10 py-4 bg-white/80 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50 backdrop-blur-lg transition-colors duration-200">
      <div
        className="font-extrabold text-2xl text-slate-800 dark:text-white tracking-tight shrink-0"
        style={{ fontFamily: "'Outfit', sans-serif" }}>
        dev<span className="text-indigo-500">pulse</span>
      </div>

      <nav className="hidden md:flex items-center gap-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className="px-4 py-2 text-sm font-medium text-slate-500 dark:text-slate-400 rounded-lg hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-slate-800 transition-all duration-200">
            {item.name}
          </NavLink>
        ))}
      </nav>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <ThemeToggle />
        </div>

        <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 mx-1 hidden sm:block"></div>

        <div className="flex items-center gap-2">
          {user ? (
            <>
              <span className="text-sm font-medium text-slate-500 dark:text-slate-400 hidden sm:block">
                {t("greeting", { name: user.name })}
              </span>
              <button
                onClick={handleLogout}
                className="bg-rose-500 hover:bg-rose-600 text-white text-sm font-semibold px-5 py-2.5 rounded-full transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-rose-200 active:translate-y-0">
                {t("navbar.logout")}
              </button>
            </>
          ) : (
            <>
              <NavLink
                to="/login"
                className="text-sm font-semibold px-5 py-2.5 rounded-full border border-indigo-300 dark:border-indigo-800 text-indigo-500 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-slate-800 transition-all duration-200">
                {t("navbar.login")}
              </NavLink>
              <NavLink
                to="/register"
                className="bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-semibold px-5 py-2.5 rounded-full transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-200 active:translate-y-0">
                {t("navbar.signup")}
              </NavLink>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;