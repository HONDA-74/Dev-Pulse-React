import { Navigate } from "react-router";
import toast from "react-hot-toast";
import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

export default function ProtectedRoute({ children }) {
  const { t } = useTranslation();
  const user = useSelector((state) => state.auth.user);
  const toasted = useRef(false);

  useEffect(() => {
    if (!user && !toasted.current) {
      toasted.current = true;
      toast.error(t("auth:login.title")); // Or a specific "Access Denied" key if added
    }
  }, [user, t]);

  if (!user) return <Navigate to="/login" replace />;
  return children;
}