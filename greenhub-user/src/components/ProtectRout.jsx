import { useEffect } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast'; // or your preferred toast library

const ProtectedRoute = () => {
  const { user, loading } = useAuth(); // Get loading here
  const navigate = useNavigate();

  useEffect(() => {
    // 4. ONLY redirect if loading is DONE and user is still NULL
    if (!loading && !user) {
      toast.error("Please login to access this page", {
        id: 'auth-guard',
      });
      navigate("/");
    }
  }, [user, loading, navigate]);

  // 5. While the app is still figuring out if you are logged in, show nothing
  if (loading) return null; 

  return user ? <Outlet /> : null;
};
export default ProtectedRoute;