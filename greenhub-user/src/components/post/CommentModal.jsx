import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PaperAirplaneIcon, XMarkIcon, FaceSmileIcon, AtSymbolIcon, EllipsisHorizontalIcon, TrashIcon } from '@heroicons/react/24/outline';
import { PaperAirplaneIcon as SendIconSolid } from '@heroicons/react/24/solid';
import { getImageUrl } from '../../utils/getImageUrl';
import { formatDate } from '../../utils/formatDate';

const CommentModal = ({ isOpen, onClose, post, user, onCommentAdded }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [isFetching, setIsFetching] = useState(false);

  const [hoveredCommentId, setHoveredCommentId] = useState(null);
const [activeMenuId, setActiveMenuId] = useState(null);

  useEffect(() => {
    if (isOpen && post?.id) {
      fetchComments();
    }
  }, [isOpen, post?.id]);

  const fetchComments = async () => {
    setIsFetching(true);
    try {
      // DEBUG: console.log("Fetching for post ID:", post.id);
      const res = await axios.get(`/api/user/comments/${post.id}`);
      if (res.data.status) {
        setComments(res.data.data);
      }
    } catch (err) {
      console.error("Failed to load comments", err);
    } finally {
      setIsFetching(false);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const res = await axios.post("/api/user/comments", {
        comTtext: newComment,
        post_id: post.id,
        member_id: user.id
      });

      if (res.data.status) {
        setComments([res.data.data, ...comments]); 
        setNewComment("");
        if (onCommentAdded) {
            onCommentAdded(post.id, res.data.comments_count);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (commentId) => {

  try {
    const res = await axios.delete(`/api/user/comments/${commentId}`);
    if (res.data.status) {
      // Remove from local modal state
      setComments(prev => prev.filter(c => c.id !== commentId));
      
      // Update parent count (subtract 1)
      if (onCommentAdded) {
        onCommentAdded(post.id, post.comments_count - 1);
      }
    }
  } catch (err) {
    console.error("Delete failed:", err);
  }
};

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl space-y-4">
        
        {/* Main Comments Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <span className="text-sm font-medium text-gray-500 uppercase tracking-wider">Discussion Thread</span>
            <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
              <XMarkIcon className="size-5 text-gray-400" />
            </button>
          </div>

          {/* Scrollable Comment Area */}
          <div className="max-h-[50vh] overflow-y-auto p-6 space-y-8 custom-scrollbar">
            {isFetching ? (
            <div className="text-center py-10 text-gray-400">Loading comments...</div>
          ) :
            comments.length === 0 ? (
              <p className="text-center text-gray-400 py-10 text-sm italic">No comments yet. Start the conversation!</p>
            ) :
            (comments.map((com) => (
              <div key={com.id} className="group relative flex gap-4 pr-8"
              onMouseEnter={() => setHoveredCommentId(com.id)}
    onMouseLeave={() => {
        setHoveredCommentId(null);
        setActiveMenuId(null); // Close menu if mouse leaves
    }}>
                {/* Avatar & Content code remains the same... */}
    <div className="size-10 shrink-0 rounded-full bg-gray-100  overflow-hidden">
        <img src={getImageUrl(com.user?.proImg)} alt="" className="size-full object-cover" />
    </div>

    <div className="flex-1">
        <div className="flex items-center gap-2">
            <span className="text-[15px] font-bold text-gray-900">{com.user?.name}</span>
            <span className="text-[13px] text-gray-400">{formatDate(com.comDate)}</span>
        </div>
        <p className="text-[15px] text-gray-600 mt-1">{com.comTtext}</p>
    </div>
                  
                  {/* Delete Section: Only show if it's the current user's comment */}
    {user?.id === com.member_id && hoveredCommentId === com.id && (
      <div className="absolute right-0 top-0">
        <button 
          onClick={() => setActiveMenuId(activeMenuId === com.id ? null : com.id)}
          className="p-1 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors"
        >
          <EllipsisHorizontalIcon className="size-6" />
        </button>

        {/* Mini Dropdown Menu */}
        {activeMenuId === com.id && (
          <div className="absolute right-0 w-32 bg-white border border-gray-100  rounded-lg shadow-xl z-10">
            <button 
              onClick={() => handleDelete(com.id)}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
            >
              <TrashIcon className="size-4" />
              Delete
            </button>
          </div>
        )}
      </div>
    )}
              </div>
            )))
            }
          </div>
        </div>

        {/* Input Card */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-4">
          <form onSubmit={handleSend} className="space-y-3">
            <div className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white p-2 shadow-sm">
            <textarea
              className="w-full resize-none border-none p-0 text-[15px] text-gray-700 placeholder:text-gray-400 focus:ring-0 min-h-[60px] outline-none"
              placeholder="Write a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />   
              <div className=' '>
                <button 
                type="submit" 
                disabled={!newComment.trim()}
                className={`p-2 rounded-xl transition-all ${
                  newComment.trim() 
                  ? 'bg-lime-600 text-white shadow-lg shadow-lime-200' 
                  : 'bg-gray-100 text-gray-300 cursor-not-allowed'
                }`}
              >
                <SendIconSolid className="size-5 -rotate-45 relative left-[1px]" />
              </button>
              </div>
              
              </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CommentModal;