import { Navigate, Outlet } from "react-router";
import { useAuth } from "./context/AuthContext";

const ProtectedRoute = () => {
  const { token } = useAuth();

  // If no token exists in sessionStorage, kick them back to login
  if (!token) {
    return <Navigate to="/signin" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;