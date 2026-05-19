import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaExclamationTriangle } from 'react-icons/fa';

const NotFound = () => {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4">
      <div className="text-center">
        {/* Animated Icon or Large Number */}
        <div className="relative inline-block">
          <h1 className="text-9xl font-black text-gray-200 dark:text-gray-800 animate-pulse">
            404
          </h1>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
             <FaExclamationTriangle className="text-lime-500 text-6xl" />
          </div>
        </div>

        <h2 className="mt-8 text-3xl font-bold text-gray-800 dark:text-white md:text-4xl">
          Oops! Page not found.
        </h2>
        
        <p className="mt-4 text-gray-500 dark:text-gray-400 max-w-md mx-auto">
          The page you are looking for might have been removed, had its name changed, 
          or is temporarily unavailable.
        </p>

        <div className="mt-10">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-lime-600 rounded-full hover:bg-lime-700 transition-all shadow-lg shadow-lime-200 dark:shadow-none"
          >
            <FaHome className="text-lg" />
            Back to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;