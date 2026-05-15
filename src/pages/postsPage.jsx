import { useEffect } from "react";
import { Outlet, useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { fetchPosts, setSearchQuery } from "../features/posts/postsSlice";
import Card from "../components/card";
import Search from "../components/search";
import { useTranslation } from "react-i18next";

export default function PostsPage() {
  const { t } = useTranslation();
  const { id } = useParams();
  const dispatch = useDispatch();
  const { posts, loading, searchQuery } = useSelector((state) => state.posts);

  useEffect(() => {
    dispatch(fetchPosts());
  }, [dispatch]);

  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-screen-xl mx-auto px-6 py-10">
      <div className="flex flex-col md:flex-row gap-10">
        {/* Main Content */}
        <div className={`flex-1 transition-all duration-300 ${id ? "hidden lg:block" : "block"}`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
            <div>
              <h1
                className="text-3xl font-extrabold text-slate-800 dark:text-white mb-2"
                style={{ fontFamily: "'Outfit', sans-serif" }}>
                {t("navbar.posts")}
              </h1>
              <p className="text-slate-500 dark:text-slate-400 text-sm">
                {t("home.hero.subtitle")}
              </p>
            </div>
            <Search
              onSearch={(val) => dispatch(setSearchQuery(val))}
              placeholder={t("dashboard:posts.search")}
            />
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-80 bg-slate-100 dark:bg-slate-800 animate-pulse rounded-3xl" />
              ))}
            </div>
          ) : filteredPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredPosts.map((post) => (
                <Card key={post.id} card={post} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-700">
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-1">{t("dashboard:posts.empty")}</h3>
            </div>
          )}
        </div>

        {/* Details Sidebar / Modal */}
        {id && (
          <div className="w-full lg:w-[450px] animate-in slide-in-from-right duration-300">
            <Outlet />
          </div>
        )}
      </div>
    </div>
  );
}