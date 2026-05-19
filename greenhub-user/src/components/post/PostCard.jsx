import React, { useEffect, useRef, useState } from "react";
import {
  ChatBubbleOvalLeftEllipsisIcon,
  ShareIcon,
  EllipsisHorizontalIcon,
  GlobeAltIcon,
  BookmarkIcon,
  TrashIcon,
  PencilSquareIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@heroicons/react/24/outline";
import {
  HeartIcon as HeartSolid,
  BookmarkIcon as BookmarkSolid,
  ChatBubbleLeftRightIcon,
} from "@heroicons/react/24/solid";

import {
  HeartIcon as HeartOutline,
  BookmarkIcon as BookmarkOutline,
} from "@heroicons/react/24/outline";
import { formatDate } from "../../utils/formatDate";
import { getImageUrl } from "../../utils/getImageUrl";
import toast from "react-hot-toast";
import axios from "../../../api/axios";
import { useNavigate } from "react-router-dom";

const LeafIcon = ({ className }) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"
    />
  </svg>
);

const PostCard = ({
  post,
  onDelete,
  onEdit,
  user,
  setPosts,
  onCommentClick,
  onReactSuccess,
  isSavedMode
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const media = post.image || [];
  const baseUrl = "http://localhost:8000/uploads/posts/"; // Adjust to your server URL
  const menuRef = useRef();
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();

  const getTruncatedText = (text) => {
    if (!text) return "";
    const sentences = text.split(/(?<=[.!?])\s+/);
    if (sentences.length <= 2) return text;

    return sentences.slice(0, 2).join(" ") + "...";
  };

  const hasMore =
    post.content && post.content.split(/(?<=[.!?])\s+/).length > 2;

  // Check if current user is the owner
  const isOwner = user && post.member_id == user.id;
  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleToggleReact = async () => {

    try {
      const response = await axios.post("/api/user/posts/toggleReact", {
        // Force values to Numbers to be safe
        post_id: Number(post.id),
        member_id: Number(user.id),
      });

      if (response.data.status) {
        setPosts((prev) =>
          prev.map((p) =>
            p.id === post.id
              ? {
                  ...p,
                  reacts_count: response.data.reacts_count,
                  is_reacted: response.data.action === "liked",
                }
              : p,
          ),
        );

        if (onReactSuccess) {
          onReactSuccess();
        }
      }
    } catch (err) {
      // Look at the specific error for post_id in the console
      console.error("Validation Details:", err.response?.data?.errors);
      toast.error("Action failed. Check console for details.");
    }
  };
  const handleToggleSave = async () => {
    if (!user?.id) return toast.error("Please login to save posts");

    try {
      const response = await axios.post("/api/user/posts/toggleSave", {
        post_id: post.id,
        member_id: user.id,
      });

      if (response.data.status) {
        setPosts((prev) =>
          {
        // CHECK: Are we currently in the "Saved" tab?
        // You can pass 'isSavedMode' as a prop to PostCard
        if (isSavedMode) {
          // REMOVE immediately: Filter out the post that was just unsaved
          return prev.filter((p) => p.id !== post.id);
        }

        // FEED MODE: Just toggle the boolean so the icon changes color
        return prev.map((p) =>
          p.id === post.id ? { ...p, is_saved: !p.is_saved } : p
        );
      }
        );
        toast.success(response.data.message);
      }
    } catch (err) {
      console.error("Save Error:", err.response?.data);
      toast.error("Failed to save post");
    }
  };

  return (
    <article className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm space-y-5">
      {/* Post Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            onClick={()=>navigate(`/user/${post.user?.id}`)}
            src={getImageUrl(post.user?.proImg, user)}
            alt="user"
            className="w-12 h-12 rounded-full object-cover cursor-pointer"
          />
          <div>
            <p className="font-bold text-gray-900">
              {post.user?.name || "Eco Member"}
            </p>
            <p className="text-xs text-gray-400 flex items-center gap-1">
              <GlobeAltIcon className="w-3 h-3 text-lime-500" />
              {formatDate(post.post_date)} • EcoMember
            </p>
          </div>
        </div>
        {isOwner && (
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              <EllipsisHorizontalIcon className="w-6 h-6" />
            </button>

            {showMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-gray-100 z-10 overflow-hidden">
                <button
                  onClick={() => {
                    onEdit(post);
                    setShowMenu(false);
                  }}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-lime-50 hover:text-lime-600"
                >
                  <PencilSquareIcon className="size-4" /> Edit
                </button>
                <button
                  onClick={() => {
                    onDelete(post.id);
                    setShowMenu(false);
                  }}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  <TrashIcon className="size-4" /> Delete
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Post Content */}
      <div className="text-gray-700 leading-relaxed text-sm">
        <p className="whitespace-pre-wrap">
          {isExpanded ? post.content : getTruncatedText(post.content)}
        </p>
        {hasMore && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-2 flex items-center gap-1 text-lime-600 font-semibold hover:text-lime-700 transition-colors focus:outline-none"
          >
            {isExpanded ? (
              <>
                <span>Show less</span>
                <ChevronUpIcon className="size-4" />
              </>
            ) : (
              <>
                <span>Read full description</span>
                <ChevronDownIcon className="size-4" />
              </>
            )}
          </button>
        )}
      </div>

      {/* Post Media Grid */}
      {media.length > 0 && (
        <div
          className={`grid gap-3 ${media.length === 1 ? "sm:grid-cols-4 grid-cols-2 " : "sm:grid-cols-4 grid-cols-2"} `}
        >
          {media.map((imgName, idx) => (
            <img
              key={idx}
              src={`${baseUrl}${imgName}`}
              alt="Post upload"
              className="rounded-2xl w-full sm:h-60 h-50 object-cover border border-gray-100"
            />
          ))}
        </div>
      )}

      {/* Interaction Row */}
      {user?.id && (
        <div className="border-t border-gray-50  flex items-center justify-between text-gray-500 text-sm font-medium">
          <div className="flex items-center gap-2 sm:gap-6">
            {/* React Button */}
            <button
              onClick={handleToggleReact}
              className="flex items-center gap-1.5 group transition-colors"
            >
              {post.is_reacted == 1 || post.is_reacted == true ? (
                <HeartSolid className="size-6 text-red-500 scale-110 transition-transform" />
              ) : (
                <HeartOutline className="size-6 text-gray-500 group-hover:text-red-500" />
              )}
              <span
                className={`text-sm font-medium ${post.is_reacted ? "text-red-500" : "text-gray-500"}`}
              >
                {post.reacts_count || 0}
              </span>
            </button>

            {/* Comments */}
            <button
              onClick={onCommentClick}
              className="flex items-center gap-2 hover:text-blue-600 group transition"
            >
              <div className="p-2 rounded-xl bg-gray-50 group-hover:bg-blue-50">
                <ChatBubbleOvalLeftEllipsisIcon className="w-5 h-5 group-hover:text-blue-600" />
              </div>
              <span>
                {post.comments_count || 0}{" "}
                <span className="hidden xs:inline">Comments</span>
              </span>
            </button>
          </div>

          {/* Save Button */}
          <button
            onClick={handleToggleSave}
            className="text-gray-500 transition-colors"
          >
            {post.is_saved == 1 ? (
              <BookmarkSolid className="size-6 text-lime-600" />
            ) : (
              <BookmarkOutline className="size-6 hover:text-lime-600" />
            )}
          </button>
        </div>
      )}
    </article>
  );
};

export default PostCard;
