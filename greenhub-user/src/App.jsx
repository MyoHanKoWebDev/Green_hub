import { Outlet } from "react-router-dom"
import axios from "../api/axios";

import Navbar from "./components/Navbar";
import { useEffect } from "react";

function App() {
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (!token) return; // Don't call API if there's no token
      try {
        await axios.get('api/user/verify-session');
        console.log("Session is valid.");
      } catch (err) {
        // Your interceptor handles the 401 redirect, 
        // but you can add custom logic here if needed.
        console.error("Session expired or invalid token");
      }
    };

    checkAuth();
  }, []); 

  return (
    <>
      <>
      <Navbar />

      <div className="h-screen p-5 mt-20">
        <Outlet />
      </div>
    </>
    </>
  );
}

export default App;
