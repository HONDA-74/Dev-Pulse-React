import { Navigate } from "react-router";
import { useContext } from "react";
import { UserContext } from "../context/user-context/user-context";

export default function ProtectedRoute({ children }) {
  const { user } = useContext(UserContext);

  if (user) return <Navigate to="/home" replace />;
  return children;
}