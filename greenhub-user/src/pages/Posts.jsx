import React, { useState, useEffect, Fragment } from "react";
import PostComposer from "../components/PostComposer";
import PostCard from "../components/PostCard";
import PostSkeleton from "../components/PostSkeleton"; // Import it here
import GreenHeroSidebar from "../components/GreenHeroSidebar";
import { TrophyIcon, XMarkIcon } from "@heroicons/react/24/outline";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { useAuth } from "../context/AuthContext";
import axios from "../../api/axios";
import { useScrollDirection } from "../utils/useScrollDirection";
import toast from "react-hot-toast";
import ConfirmModal from "../components/ConfirmationDelete"; // Import your modal
import CommentModal from "../components/CommentModal";

const Posts = () => {
  const { user } = useAuth(); // User who is logged in
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const scrollDir = useScrollDirection();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [editingPost, setEditingPost] = useState(null);

  const [selectedPost, setSelectedPost] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [sidebarKey, setSidebarKey] = useState(0);

  // Function to be called whenever a post is liked/reacted to
  const handleSidebarUpdate = () => {
    setSidebarKey(prev => prev + 1);
  };

  // This function updates the specific post in the main list
  const handleCommentAdded = (postId, newCount) => {
    console.log("Parent received update for:", postId, "New count:", newCount);
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId ? { ...post, comments_count: newCount } : post
      )
    );
  };

  const openComments = (post) => {
    setSelectedPost(post);
    setIsModalOpen(true);
  };

  // Function called when user clicks "Delete" in the PostCard menu
  const openDeleteModal = (postId) => {
    setPostToDelete(postId);
    setIsDeleteModalOpen(true);
  };

  const fetchPosts = async () => {
    // If user isn't loaded yet, we can't check their likes
    const queryParam = user?.id ? `?member_id=${user.id}` : ""; 
    try {
      setLoading(true);
      // Send the member_id in the URL
      const res = await axios.get(`/api/user/posts${queryParam}`);

      if (res.data.status) {
        setPosts(res.data.data);
      }
    } catch (err) {
      console.error("Fetch failed", err);
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (!postToDelete) return;

    setDeleteLoading(true);
    try {
      const response = await axios.delete(`/api/user/posts/${postToDelete}`);

      if (response.data.status) {
        toast.success("Green update removed!");
        // Update local state
        setPosts((prev) => prev.filter((p) => p.id !== postToDelete));
        setIsDeleteModalOpen(false); // Close modal
      }
    } catch (err) {
      toast.error(err.response.data.message);
    } finally {
      setDeleteLoading(false);
      setPostToDelete(null);
    }
  };
  // 1. Fetch posts and heroes on component mount
  useEffect(() => {
    fetchPosts();
  }, [user?.id]);

  return (
    <div className="bg-gray-50 min-h-screen pt-6 pb-12">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-10">
        {/* MOBILE HEADER: Shows only on small screens */}
        <div
          className={`xl:hidden sticky z-[40] transition-all duration-500 ease-in-out mb-10 w-full${
            scrollDir === "up"
              ? "top-20 opacity-100 translate-y-0" // Adjusted top to sit below your main Nav
              : "top-[-100px] opacity-0 -translate-y-full"
          }`}
        >
          <div className="flex items-center justify-between bg-white/80 backdrop-blur-md p-4 rounded-2xl shadow-lg border border-gray-100">
            <h2 className="font-bold text-gray-800">Community Feed</h2>
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="flex items-center gap-2 bg-lime-100 text-lime-700 px-4 py-2 rounded-xl font-bold text-sm active:scale-95 transition-transform"
            >
              <TrophyIcon className="w-5 h-5" />
              Heroes
            </button>
          </div>
        </div>

        {/* Main Grid: Left (75%) | Right (25%) */}
        <div className="flex flex-col xl:flex-row gap-8">
          {/* Left Area (Feed + Composer) - 75% */}
          <main className="xl:flex-1 space-y-6  ">
            <div
              className={`top-0 sticky z-60 transition-all duration-300 ${
                scrollDir === "up"
                  ? "top-40 xl:top-24 opacity-100" // Shows below navbar
                  : "top-[-200px] opacity-0" // Hides off-screen
              }`}
            >
              { user?.id &&
              <PostComposer
                user={user}
                setPosts={setPosts}
                postToEdit={editingPost}
                setPostToEdit={setEditingPost}
              />
              }
            </div>

            <div className="xl:mt-18 mt-35 space-y-6">
              {/* 2. Show Skeletons while loading */}
              {loading ? (
                <>
                  <PostSkeleton />
                  <PostSkeleton />
                </>
              ) : (
                /* 3. Show actual posts once loaded */
                posts.map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    onDelete={openDeleteModal}
                    onEdit={(post) => setEditingPost(post)}
                    user={user}
                    setPosts={setPosts}
                    onCommentClick={() => openComments(post)}
                    onReactSuccess={handleSidebarUpdate}
                  />
                ))
              )}
            </div>
          </main>

          {/* Right Area (Leaderboard) - 25% */}
          <aside className="hidden xl:block xl:w-96 xl:flex-shrink-0">
            {/* Sticky ensures the hero list follows you while you scroll the main feed */}
            <div className="sticky top-24 space-y-6">
              <GreenHeroSidebar key={sidebarKey} />
              {/* Optional: Add Eco-News or Event widget below */}
            </div>
          </aside>
        </div>
      </div>

      {/* MOBILE SIDEBAR DRAWER (Shopping Cart Style) */}
      <Transition show={isSidebarOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-[100] xl:hidden "
          onClose={setIsSidebarOpen}
        >
          <TransitionChild
            as={Fragment}
            enter="ease-in-out duration-500"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in-out duration-500"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity" />
          </TransitionChild>

          <div className="fixed inset-0 overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
              <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                <TransitionChild
                  as={Fragment}
                  enter="transform transition ease-in-out duration-500"
                  enterFrom="translate-x-full"
                  enterTo="translate-x-0"
                  leave="transform transition ease-in-out duration-500"
                  leaveFrom="translate-x-0"
                  leaveTo="translate-x-full"
                >
                  <DialogPanel className="pointer-events-auto w-screen max-w-md mt-18">
                    <div className="flex h-full flex-col overflow-y-auto bg-white shadow-xl rounded-l-[2.5rem]">
                      <div className="px-6 pt-6 flex justify-end">
                        <button
                          type="button"
                          className="rounded-full p-2 text-gray-400 hover:bg-gray-100"
                          onClick={() => setIsSidebarOpen(false)}
                        >
                          <XMarkIcon className="h-7 w-7" />
                        </button>
                      </div>
                      <div className="relative flex-1 px-2">
                        {/* We reuse the same sidebar component! */}
                        <GreenHeroSidebar />
                      </div>
                    </div>
                  </DialogPanel>
                </TransitionChild>
              </div>
            </div>
          </div>
        </Dialog>
      </Transition>
      {/* --- The Modal --- */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        loading={deleteLoading}
        title="Delete Post?"
        message="Are you sure you want to remove this update from the Community Feed? This cannot be undone."
      />

     <CommentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        post={selectedPost}
        user={user}
        onCommentAdded={handleCommentAdded} // Passing the logic
      />
    </div>
  );
};

export default Posts;
