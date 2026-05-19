import { useState, useEffect, useMemo } from "react";
import { useLocation, useParams } from "react-router-dom";
import axios from "../../api/axios";
import {
  CalendarDaysIcon,
  GlobeAltIcon,
  EnvelopeIcon,
  VideoCameraIcon,
} from "@heroicons/react/24/outline";
import { getImageUrl } from "../utils/getImageUrl";
import { formatDate } from "../utils/formatDate";
import { motion, AnimatePresence } from "framer-motion";
import ProfileSkeleton from "../components/skeleton/ProfileSkeleton";
import Posts from "./Posts";
import Projects from "./Projects";
import { useAuth } from "../context/AuthContext";
import UserOrders from "../components/settting/UserOrders";

export default function UserProfile() {
  const { user } = useAuth();
  const { userId } = useParams(); // Get ID from URL /user/:userId
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("posts");
  const location = useLocation(); // Add this

  useEffect(() => {
    // If we arrived here via navigate and passed an activeTab in state
    if (location.state?.activeTab) {
      setActiveTab(location.state.activeTab);
      
      // Clean up the state so it doesn't stay "orders" if they refresh
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        // This endpoint should return user details + totalPosts + totalProjects
        const res = await axios.get(`/api/user/userProfile/${userId}`);
        if (res.data.status) {
          setProfileData(res.data.data);
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [userId]);

  const handleCountUpdate = (type, action = "increase") => {
    setProfileData((prev) => {
      if (!prev) return prev;

      // Determine the value to add (1 or -1)
      const change = action === "increase" ? 1 : -1;

      return {
        ...prev,
        totalPosts:
          type === "post"
            ? Math.max(0, (prev.totalPosts || 0) + change) // Math.max ensures it never goes below 0
            : prev.totalPosts,
        totalProjects:
          type === "project"
            ? Math.max(0, (prev.totalProjects || 0) + change)
            : prev.totalProjects,
      };
    });
  };

  const loggedInUser = JSON.parse(localStorage.getItem("user"));
  
  // Check if the profile being viewed belongs to the person logged in
  const isOwner = loggedInUser && Number(loggedInUser.id) === Number(userId);

  const tabs = useMemo(() => {
    const baseTabs = [
      { id: "posts", label: "Recent Updates" },
      { id: "projects", label: "Showcase Projects" },
    ];

    // 3. Only push the Orders and Saved tabs if isOwner is true
    if (isOwner) {
      baseTabs.push({ id: "orders", label: "My Orders" });
      baseTabs.push({ id: "saved", label: "Saved Posts" });
    }


    return baseTabs;
    
  }, [userId, isOwner]); // Add isOwner to dependency array

  if (loading) return <ProfileSkeleton />;
  if (!profileData)
    return <div className="p-10 text-center">User not found.</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="space-y-8 max-w-7xl mx-auto">
        {/* Profile Header Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <img
            src="../../images/green.jpg"
            //src="../../public/images/Green1.jpg"
            alt="Earth from space"
            className="w-full h-32 object-cover object-center  overflow-hidden"
          />
          <div className="px-6 pb-6">
            <div className="flex flex-col md:flex-row items-end -mt-12 gap-6">
              <div className="relative shrink-0">
                <img
                  src={getImageUrl(profileData?.proImg)}
                  alt={profileData?.name}
                  className="w-36 h-36 rounded-2xl object-cover border-4 border-white shadow-lg bg-white"
                />
              </div>

              <div className="flex-grow pb-2">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  <div>
                    {/* Dynamic Name from Backend */}
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">
                      {profileData?.name || "Eco Member"}
                    </h1>
                    <p className="text-gray-500 font-medium flex items-center gap-2 mt-1">
                      <GlobeAltIcon className="w-5 h-5 text-lime-500" />
                      Verified Eco-Contributor
                    </p>
                  </div>

                  {/* INTEGRATED STATS - No separate boxes */}
                  <div className="flex items-center gap-10 lg:border-l lg:border-gray-100 lg:pl-10">
                    <div className="group">
                      <p className="text-2xl font-black text-gray-900 group-hover:text-lime-600 transition-colors">
                        {profileData?.totalPosts || 0}
                      </p>
                      <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">
                        Posts
                      </p>
                    </div>

                    <div className="group">
                      <p className="text-2xl font-black text-gray-900 group-hover:text-lime-600 transition-colors">
                        {profileData?.totalProjects || 0}
                      </p>
                      <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">
                        Projects
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Lower Info Bar */}
            <div className="mt-8 pt-6 border-t border-gray-50 flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600">
                {Number(userId) === user?.id && (
                  <span className="flex items-center gap-2 font-semibold bg-lime-50 text-lime-700 px-3 py-1.5 rounded-lg border border-lime-100">
                    <EnvelopeIcon className="w-4 h-4" />
                    {profileData?.email || "Email not set"}
                  </span>
                )}
                <span className="flex items-center gap-2 font-semibold">
                  <CalendarDaysIcon className="w-4 h-4 text-gray-400" /> Joined{" "}
                  {formatDate(profileData?.created_at)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <div className="w-full">
            {/* 1. Add Z-index and relative to the Nav Container */}
            <div className="sticky top-16 md:top-20 z-[50] bg-gray-50/95 backdrop-blur-sm border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`relative z-[51] pb-4 px-1 border-b-2 font-bold text-sm transition-all cursor-pointer ${
                      activeTab === tab.id
                        ? "border-lime-500 text-lime-600"
                        : "border-transparent text-gray-400 hover:text-gray-600"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="lg:-mx-4 xl:-mx-6"
              >
                {activeTab === "posts" && (
                  /* 2. REMOVE the -mt-30. Use pt-4 for a tight gap instead */
                  <div className="w-full pt-4 md:pt-6">
                    <Posts
                      /* Add 'all' to the key to differentiate it from 'saved' */
                      key={`profile-posts-all-${user?.id}`}
                      memberId={userId}
                      onPostCreated={() =>
                        handleCountUpdate("post", "increase")
                      }
                      onPostDeleted={() =>
                        handleCountUpdate("post", "decrease")
                      }
                    />
                  </div>
                )}

                {activeTab === "projects" && (
                  <div className="w-full pt-4">
                    <Projects
                    
                      memberId={userId}
                      onProjectCreated={() =>
                        handleCountUpdate("project", "increase")
                      }
                      onProjectDeleted={() =>
                        handleCountUpdate("project", "decrease")
                      }
                    />
                  </div>
                )}

                {isOwner && activeTab === "orders" && (
                  <div className="w-full pt-4">
                    <UserOrders key={userId}  userId={userId}/>
                  </div>
                )}

                {isOwner && activeTab === "saved" && (
                  <div className="w-full pt-4">
                    {/* We use a specific mode for saved posts */}
                    <Posts
                      key={`profile-posts-saved-${user?.id}`}
                      memberId={userId}
                      isSavedMode={true}
                    />
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
}
