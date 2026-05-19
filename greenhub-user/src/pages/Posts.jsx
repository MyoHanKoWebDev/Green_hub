import React, { useState, useEffect, Fragment } from "react";
import PostComposer from "../components/post/PostComposer";
import PostCard from "../components/post/PostCard";
import PostSkeleton from "../components/skeleton/PostSkeleton"; // Import it here
import GreenHeroSidebar from "../components/post/GreenHeroSidebar";
import {
  BookmarkIcon,
  TrophyIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
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
import ConfirmModal from "../components/common/ConfirmationDelete"; // Import your modal
import CommentModal from "../components/post/CommentModal";
import { motion, AnimatePresence } from "framer-motion";

const Posts = ({ memberId, onPostCreated, onPostDeleted, isSavedMode }) => {
  const { user, loading } = useAuth(); // User who is logged in
  const [posts, setPosts] = useState([]);
  const [loadings, setLoadings] = useState(false);
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
    setSidebarKey((prev) => prev + 1);
  };

  // This function updates the specific post in the main list
  const handleCommentAdded = (postId, newCount) => {
    console.log("Parent received update for:", postId, "New count:", newCount);
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId ? { ...post, comments_count: newCount } : post,
      ),
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
    if (isSavedMode && !user) return;

    setLoadings(true);
    try {
      const params = new URLSearchParams();

      // Always use user.id for reactions/saves
      if (user?.id) {
        params.append("member_id", user.id);
      }

      if (memberId) {
        params.append("profile_id", memberId);
      }

      const url = isSavedMode
        ? `/api/user/userProfile/savedPosts?viewer_id=${user?.id}`
        : `/api/user/posts?${params.toString()}`;

      const res = await axios.get(url);
      if (res.data.status) {
        setPosts(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadings(false);
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
        if (onPostDeleted) onPostDeleted();
        setIsDeleteModalOpen(false); // Close modal
      }
    } catch (err) {
      toast.error(err.response.data.message);
    } finally {
      setDeleteLoading(false);
      setPostToDelete(null);
    }
  };

  useEffect(() => {
    if (loading) return;
    fetchPosts();
  }, [user?.id, memberId, isSavedMode]);

  if (loading) return <PostSkeleton />;

  return (
    <div className="bg-gray-50 min-h-screen pt-6 pb-12">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-10">
        {/* MOBILE HEADER: Shows only on small screens */}
        {!memberId && (
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
        )}

        {/* Main Grid: Left (75%) | Right (25%) */}
        <div className="flex flex-col xl:flex-row gap-8">
          {/* Left Area (Feed + Composer) - 75% */}
          <main className="xl:flex-1 space-y-6  ">
            {user?.id &&
              !isSavedMode &&
              (!memberId || Number(memberId) === user?.id) && (
                <div
                  className={`${
                    // ONLY apply sticky logic if we are NOT on a profile page
                    !memberId
                      ? `sticky z-[40] transition-all duration-300 ${
                          scrollDir === "up"
                            ? "top-40 xl:top-24 opacity-100 translate-y-0"
                            : "top-[-200px] opacity-0 -translate-y-10"
                        }`
                      : "relative mb-6" // On profile, keep it simple and static
                  }`}
                >
                  <PostComposer
                    user={user}
                    setPosts={setPosts}
                    postToEdit={editingPost}
                    setPostToEdit={setEditingPost}
                    onSuccess={() => {
                      if (onPostCreated) onPostCreated();
                    }}
                  />
                </div>
              )}

            <div
              className={`${memberId ? "mt-0" : "xl:mt-12 mt-20"} flex flex-col gap-6`}
            >
              <AnimatePresence>
                {loadings ? (
                  <>
                    <PostSkeleton key="s1" />
                    <PostSkeleton key="s2" />
                  </>
                ) : posts.length > 0 ? (
                  posts.map((post) => (
                    <motion.div
                      key={post.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                    >
                      <PostCard
                        post={post}
                        onDelete={openDeleteModal}
                        onEdit={(post) => setEditingPost(post)}
                        user={user}
                        setPosts={setPosts}
                        onCommentClick={() => openComments(post)}
                        onReactSuccess={handleSidebarUpdate}
                        isSavedMode={isSavedMode}
                      />
                    </motion.div>
                  ))
                ) : (
                  /* EMPTY STATE UI */
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full flex flex-col items-center justify-center py-24 bg-white rounded-3xl border-2 border-dashed border-gray-100 shadow-sm"
                  >
                    <div className="bg-lime-50 p-6 rounded-full mb-6">
                      <BookmarkIcon className="w-14 h-14 text-lime-200" />
                    </div>

                    <div className="text-center">
                      <h3 className="text-xl font-black text-gray-800 tracking-tight">
                        {isSavedMode
                          ? "Your bookmark list is empty"
                          : "No stories shared yet"}
                      </h3>
                      <p className="text-gray-400 text-sm mt-2 max-w-[250px] mx-auto font-medium leading-relaxed">
                        {isSavedMode
                          ? "When you find something inspiring, save it to view it later here."
                          : "Be the first one to start a conversation in the community!"}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </main>

          {/* Right Area (Leaderboard) - 25% */}
          <aside className="hidden xl:block xl:w-96 xl:flex-shrink-0">
            {/* Sticky ensures the hero list follows you while you scroll the main feed */}
            <div className="sticky top-24 space-y-6">
              {!memberId && <GreenHeroSidebar key={sidebarKey} />}

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
