import { createBrowserRouter, Navigate, RouterProvider } from "react-router";
import RegisterPage from "../pages/registerPage";
import LoginPage from "../pages/loginPage";
import LayoutPage from "../pages/layoutPage";
import HomePage from "../pages/homePage";
import PostsPage from "../pages/postsPage";
import AddPostPage from "../pages/AddPostPage";
import AboutPage from "../pages/AboutPage";
import NotFoundPage from "../pages/notFoundPage";
import ProtectedRoute from "../guards/protectedRoute";
import PostDetailsPage from "../pages/postDetailsPage";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { checkUser } from "../features/auth/authSlice";
import { Toaster } from "react-hot-toast";
import { useTranslation } from "react-i18next";

export default function App() {
  const dispatch = useDispatch();
  const mode = useSelector((state) => state.theme.mode);
  const { i18n } = useTranslation();
  const language = useSelector((state) => state.language.language);

  useEffect(() => {
    dispatch(checkUser());
    
    document.documentElement.classList.toggle("dark", mode === "dark");
    
    i18n.changeLanguage(language);
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = language;
  }, [dispatch, mode, language, i18n]);

  const routerConfig = createBrowserRouter([
    {
      element: <RegisterPage />,
      path: "/register",
    },
    {
      element: <LoginPage />,
      path: "/login",
    },
    {
      element: <LayoutPage />,
      children: [
        {
          index: true,
          element: <Navigate to="home" replace></Navigate>,
        },
        {
          element: <HomePage />,
          path: "home",
        },
        {
          element: <PostsPage />,
          path: "posts",
          children: [
            {
              element: <PostDetailsPage />,
              path: ":id",
            },
          ],
        },
        {
          element: (
            <ProtectedRoute>
              <AddPostPage />
            </ProtectedRoute>
          ),
          path: "create-post",
        },
        {
          element: <AboutPage />,
          path: "about",
        },
      ],
    },
    {
      element: <NotFoundPage />,
      path: "*",
    },
  ]);

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <RouterProvider router={routerConfig}></RouterProvider>
    </>
  );
}

