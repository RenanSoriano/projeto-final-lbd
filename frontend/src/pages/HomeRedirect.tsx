import { Navigate } from "react-router-dom";
import { useAuth } from "../auth";

export function HomeRedirect() {
  const { isAuthenticated } = useAuth();

  return <Navigate replace to={isAuthenticated ? "/dashboard" : "/login"} />;
}
