import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaRecycle, FaChevronDown, FaChevronUp, FaUser, FaSignOutAlt } from "react-icons/fa";
import { useAuth } from "../context/AuthContext"; // Import your hook

const Navbar = () => {
  const { user, token, logout } = useAuth(); // Get auth state
  const [isOpen, setIsOpen] = useState(false);
  const [showCommunity, setShowCommunity] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false); // State for profile dropdown
  const dropdownRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setProfileOpen(false);
    setIsOpen(false);
    navigate("/signin");
  };

  const getImageUrl = (img) => {
  if (!img) {
    // Fallback if no image exists at all
    return `https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=84cc16&color=fff`;
  }

  // If it's a Google URL (starts with http or https)
  if (img.startsWith("http")) {
    return img; 
  }

  // If it's a local upload from your Laravel 'public/uploads/profiles' folder
  return `${import.meta.env.VITE_BACKEND_URL}/uploads/profiles/${img}`;
};

  return (
    <>
      {/* MAIN NAVBAR */}
      <header className="flex items-center justify-between px-4 sm:px-10 py-4 sm:py-3 border-b border-slate-200 bg-white sticky top-0 z-50">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-lime-500 grid place-content-center">
            <FaRecycle className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg sm:text-xl font-bold text-lime-600">GreenHub</span>
        </Link>

        {/* DESKTOP MENU */}
        <nav className="hidden lg:flex items-center gap-6 xl:gap-8 text-sm font-medium">
          <Link to="/" className={`px-4 py-2 transition-colors ${location.pathname === "/" ? "font-semibold bg-slate-200 text-lime-600 rounded-lg" : "hover:bg-slate-100 hover:text-lime-600 rounded-lg"}`}>Home</Link>
          <Link to="/products" className={`px-4 py-2 transition-colors ${location.pathname === "/products" ? "bg-slate-200 text-lime-600 rounded-lg font-semibold" : "hover:bg-slate-100 hover:text-lime-600 rounded-lg"}`}>Products</Link>
          
          <div className="relative group">
            <button className={`flex items-center gap-1 transition-colors px-4 py-2 ${location.pathname.includes("posts") || location.pathname.includes("projects") ? "bg-slate-200 text-lime-600 rounded-lg font-semibold" : "font-semibold hover:text-lime-600 rounded-lg"}`}>
              Community <FaChevronDown className="w-3 h-3 mt-0.5 transition-transform duration-300 group-hover:rotate-180" />
            </button>
            <div className="absolute left-0 mt-2 w-40 bg-white shadow-lg rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-10 border border-slate-100">
              <Link to="/posts" className="block px-4 py-2 hover:bg-slate-100 hover:text-lime-600 transition-colors">Posts</Link>
              <Link to="/projects" className="block px-4 py-2 hover:bg-slate-100 hover:text-lime-600 transition-colors">Eco Projects</Link>
            </div>
          </div>

          <Link to="/about" className={`px-4 py-2 transition-colors ${location.pathname === "/about" ? "bg-slate-200 text-lime-600 rounded-lg font-semibold" : "hover:bg-slate-100 hover:text-lime-600 rounded-lg"}`}>About</Link>
          <Link to="/contact" className={`px-4 py-2 transition-colors ${location.pathname === "/contact" ? "bg-slate-200 text-lime-600 rounded-lg font-semibold" : "hover:bg-slate-100 hover:text-lime-600 rounded-lg"}`}>Contact</Link>
        </nav>

        {/* AUTH SECTION */}
        <div className="flex items-center gap-3">
          {token && user ? (
            <div className="relative" ref={dropdownRef}>
              <button 
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 p-1 pr-3 rounded-full hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200"
              >
                <img src={getImageUrl(user.proImg)} referrerPolicy="no-referrer" // Add this line!
                  alt="Profile" className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover border-2 border-lime-500" />
                <span className="hidden sm:block text-sm font-semibold text-slate-700">{user.name.split(' ')[0]}</span>
                <FaChevronDown className={`w-2 h-2 transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* PROFILE DROPDOWN MENU */}
              {profileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-100 rounded-xl shadow-xl py-2 z-[60] animate-in slide-in-from-top-2 duration-200">
                  <div className="px-4 py-2 border-b border-slate-50 mb-1">
                    <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Account</p>
                    <p className="text-sm font-medium text-slate-800 truncate">{user.email}</p>
                  </div>
                  <Link to="/profile" onClick={() => setProfileOpen(false)} className="flex items-center gap-3 px-4 py-2 text-sm text-slate-600 hover:bg-lime-50 hover:text-lime-600 transition-colors">
                    <FaUser className="w-3 h-3" /> Profile Settings
                  </Link>
                  <button onClick={handleLogout} className="flex items-center gap-3 w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors">
                    <FaSignOutAlt className="w-3 h-3" /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/signin" className="rounded-full bg-lime-500 text-white px-6 sm:px-8 py-2 sm:py-2.5 text-sm font-semibold shadow-md hover:bg-lime-600 transition-all hover:scale-105 active:scale-95">
              Sign In
            </Link>
          )}

          <button className="lg:hidden p-2 text-slate-600" onClick={() => setIsOpen(!isOpen)}>
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </header>

      {/* MOBILE MENU */}
      <div className={`lg:hidden bg-white shadow-md flex flex-col px-6 gap-2 text-slate-700 font-medium border-b transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? "max-h-[500px] py-4 opacity-100" : "max-h-0 py-0 opacity-0"}`}>
        <Link to="/" onClick={() => setIsOpen(false)} className="px-4 py-2 hover:bg-slate-50 rounded-lg">Home</Link>
        <Link to="/products" onClick={() => setIsOpen(false)} className="px-4 py-2 hover:bg-slate-50 rounded-lg">Products</Link>
        
        <div className="flex flex-col">
          <button onClick={() => setShowCommunity(!showCommunity)} className="flex justify-between items-center px-4 py-2 hover:bg-slate-50 rounded-lg font-semibold">
            Community {showCommunity ? <FaChevronUp className="w-3 h-3" /> : <FaChevronDown className="w-3 h-3" />}
          </button>
          <div className={`flex flex-col pl-6 gap-2 transition-all duration-300 overflow-hidden ${showCommunity ? "max-h-40 mt-2" : "max-h-0"}`}>
            <Link to="/posts" onClick={() => setIsOpen(false)} className="py-2 text-sm hover:text-lime-600">Posts</Link>
            <Link to="/projects" onClick={() => setIsOpen(false)} className="py-2 text-sm hover:text-lime-600">Eco Projects</Link>
          </div>
        </div>

        <Link to="/about" onClick={() => setIsOpen(false)} className="px-4 py-2 hover:bg-slate-50 rounded-lg">About</Link>
        <Link to="/contact" onClick={() => setIsOpen(false)} className="px-4 py-2 hover:bg-slate-50 rounded-lg">Contact</Link>
        
        {/* Mobile Logout (If logged in) */}
        {token && (
          <button onClick={handleLogout} className="mt-4 px-4 py-2 text-left text-red-500 border-t border-slate-100 pt-4">
            Logout
          </button>
        )}
      </div>
    </>
  );
};

export default Navbar;