import React from "react";
import UserMetaCard from "../components/settting/UserMetaCard";
import UserInfoCard from "../components/settting/UserInfoCard";
import SecurityCard from "../components/common/SecurityCard";
import { useAuth } from "../context/AuthContext";
import Footer from "../components/common/Footer";
import Home from "./Home";
import { useNavigate } from "react-router-dom";

const Setting = () => {
   const { user, updateUser, token } = useAuth(); // Assume refreshUser updates the global state
  const navigate = useNavigate();

  // If user isn't logged in, redirect them
  if (!user) {
    navigate("/");
    return null;
  }

  return (
    <>
    <div className="mx-auto max-w-screen-2xl p-4">
      {/* Optional: Add Breadcrumbs here if you have the component */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
          Account Settings
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Top Header Card: Profile Image & Basic Name */}
        <UserMetaCard user={user} />

        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
          <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
            Profile Details
          </h3>
          <div className="space-y-6">
            {/* Personal Information (Name, Email) */}
            <UserInfoCard user={user} onUpdateSuccess={updateUser}/>
            
            {/* Security Section (Password Change) */}
            <SecurityCard user={user} token={token}/>
          </div>
        </div>
      </div>
    </div>
    <Footer />
    </>
  );
}
export default Setting;