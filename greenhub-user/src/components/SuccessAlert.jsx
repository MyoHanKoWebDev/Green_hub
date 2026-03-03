import React, { useEffect } from "react";
import { FaCheckCircle, FaTimes } from "react-icons/fa";

const SuccessAlert = ({ message, onClose }) => {
  // Auto-close after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-5 right-5 z-50 animate-fade-in-down">
      <div className="flex items-center p-4 mb-4 text-lime-800 border-t-4 border-lime-500 bg-lime-50 rounded-lg shadow-lg max-w-md" role="alert">
        <FaCheckCircle className="flex-shrink-0 w-5 h-5" />
        <div className="ml-3 text-sm font-medium mr-8">
          {message}
        </div>
        <button
          onClick={onClose}
          className="ml-auto -mx-1.5 -my-1.5 bg-lime-50 text-lime-500 rounded-lg focus:ring-2 focus:ring-lime-400 p-1.5 hover:bg-lime-200 inline-flex h-8 w-8"
        >
          <FaTimes className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default SuccessAlert;