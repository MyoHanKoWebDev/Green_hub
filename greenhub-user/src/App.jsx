import { Outlet } from "react-router-dom"
import axios from "../api/axios";

import Navbar from "./components/Navbar";
import { useEffect } from "react";

function App() {
  useEffect(() => {
    const checkAuth = async () => {
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

      <div className="h-screen p-5 ">
        <Outlet />
      </div>
    </>
    </>
  );
}

export default App;
