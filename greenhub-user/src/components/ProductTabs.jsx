import React, { useRef, useState } from "react";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import {
  StarIcon,
  PlayIcon,
  ChatBubbleBottomCenterTextIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import axios from "../../api/axios";
import { StarIcon as StarSolid } from "@heroicons/react/24/solid";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

const ProductTabs = ({ product , onReviewSubmitted }) => {
  const {user} = useAuth(); // Get auth state
  const [selectedRating, setSelectedRating] = useState(0); // For the rating form
  const [isPlayed, setIsPlayed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const videoRef = useRef(null); // This "grabs" the video element

  const handleSubmitReview = async () => {
    // 1. Validation
    if (selectedRating === 0) {
      toast.error("Please select a star rating!", {
        duration: 4000,
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
      return;
    }
    if (!user) {
      toast.error("Please login to give a rating", {
        duration: 4000,
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await axios.post("api/admin/products/rating", {
        rating: selectedRating,
        product_id: product.id,
        member_id: user.id, // Matching your backend 'member_id'
      });

      if (response.data.status) {
        toast.success("Thank you for your feedback!", {
          duration: 4000,
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        });
        // Call the refresh function passed from the parent page
        if (onReviewSubmitted) {
           onReviewSubmitted(); 
        }
      }
    } catch (error) {
      toast.error(error.response.data.message || "Welcome back!", {
        duration: 4000,
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePlay = () => {
    if (videoRef.current) {
      videoRef.current.play();
      setIsPlayed(true);
    }
  };

  // Guard clause for safety
  if (!product) return null;

  const project = product.eco_projects?.[0]; // Access the first project
  return (
    <div className="w-full max-w-6xl mx-auto mt-16  pt-16 border-t border-gray-200">
      <TabGroup>
        {/* --- Tab List (Navigation) - Matching ref image layout --- */}
        <TabList className="flex justify-center gap-x-12 border-b border-gray-100 pb-2">
          {["Product’s Origin", "Reviews"].map((name) => (
            <Tab
              key={name}
              className={({ selected }) =>
                `whitespace-nowrap pb-4 px-2 text-sm font-semibold transition-all focus:outline-none 
                 ${
                   selected
                     ? "text-lime-600 border-b-2 border-lime-600 font-bold"
                     : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 border-b-2 border-transparent hover:border-gray-200 dark:hover:border-gray-700"
                 }`
              }
            >
              {name}
            </Tab>
          ))}
        </TabList>

        {/* --- Tab Panels (Content Area) --- */}
        <TabPanels className="mt-12 text-gray-700 dark:text-gray-300 text-sm leading-relaxed max-w-4xl mx-auto px-4">
          {/* ===========================================
             Tab 1: Product’s Origin (Project Data)
             =========================================== */}
          <TabPanel className="space-y-10 focus:outline-none">
            {project ? (
              <div className="grid grid-cols-1 md:grid-cols-[1.5fr,1fr] gap-10">
                {/* Right Side: Project Video (if available) - Standard aspect ratio */}
                {project?.video && (
                  <div className="relative aspect-video rounded-3xl overflow-hidden shadow-lg group bg-black">
                    <video
                      ref={videoRef}
                      className="w-full h-full object-cover"
                      onPlay={() => setIsPlayed(true)}
                      onPause={() => setIsPlayed(false)}
                      controls={isPlayed} // Only show browser controls AFTER it starts playing
                    >
                      <source
                        src={`${import.meta.env.VITE_BACKEND_URL}/uploads/videos/${project.video}`}
                        type="video/mp4"
                      />
                    </video>

                    {/* The Play Overlay: Only visible if isPlayed is false */}
                    {!isPlayed && (
                      <div
                        onClick={handlePlay}
                        className="absolute inset-0 bg-gray-950/40 flex items-center justify-center cursor-pointer transition-opacity hover:bg-gray-950/20"
                      >
                        <div className="flex flex-col items-center gap-2">
                          <PlayIcon className="h-16 w-16 text-white bg-white/20 p-4 rounded-full border border-white/50 backdrop-blur-sm" />
                          <span className="text-white text-xs font-bold uppercase tracking-widest">
                            Play Project Video
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Left Side: Name & Description */}
                <div className="space-y-6">
                  <div className="space-y-3">
                    <span className="text-xs font-bold uppercase tracking-widest text-lime-600">
                      The Impact Project
                    </span>
                    <h3 className="text-2xl font-extrabold text-gray-950 dark:text-white">
                      {project.title}
                    </h3>
                  </div>

                  {/* Paragraph description - matched style of reference image paragraph */}
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed prose prose-sm dark:prose-invert">
                    {project.description ||
                      "No detailed project description available. This project focuses on sustainable manufacturing and reducing ecological footprints in product lifecycle."}
                  </p>

                  {/* Example of adding bullet points (like in ref image description) */}
                  <ul className="space-y-3 pt-3 text-sm text-gray-600 dark:text-gray-400">
                    {[
                      "100% Sustainable Sourcing verified.",
                      "Fair trade certified partnership.",
                    ].map((item) => (
                      <li key={item} className="flex items-center gap-3">
                        <span className="flex-none h-2 w-2 rounded-full bg-lime-500" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <div className="text-center py-10 text-gray-500 bg-gray-100 dark:bg-gray-900 rounded-2xl">
                This eco product hasn't been linked to a specific Green Project
                yet.
              </div>
            )}
          </TabPanel>

          {/* ===========================================
             Tab 2: Reviews (Rating & Feedback)
             =========================================== */}
          <TabPanel className="space-y-12 focus:outline-none">
            {/* 1. Add Rating Section (matched style of ref image sectioning) */}
            <div className="space-y-6 p-8 bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-subtle">
              <div className="flex items-center gap-4">
                <ChatBubbleBottomCenterTextIcon className="h-8 w-8 text-lime-600" />
                <div>
                  <h3 className="text-xl font-extrabold text-gray-950 dark:text-white">
                    Share Your Feedback
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    What did you love about this sustainable product?
                  </p>
                </div>
              </div>

              {/* Interactive Rating Input */}
              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500">
                  Your Rating
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setSelectedRating(star)}
                      type="button"
                    >
                      {star <= selectedRating ? (
                        <StarSolid className="h-9 w-9 text-yellow-500" />
                      ) : (
                        <StarIcon className="h-9 w-9 text-gray-300 hover:text-yellow-400 transition" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleSubmitReview}
                  disabled={isSubmitting}
                  className={`bg-lime-500 hover:bg-lime-600 text-white font-bold px-10 py-3.5 rounded-full transition active:scale-95 shadow-md flex items-center gap-2 ${
                    isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <svg
                        className="animate-spin h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Saving...
                    </>
                  ) : (
                    "Submit Review"
                  )}
                </button>
              </div>
            </div>
          </TabPanel>
        </TabPanels>
      </TabGroup>
    </div>
  );
};

export default ProductTabs;
