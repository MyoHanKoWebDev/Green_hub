import React, { useEffect, useRef, useState } from "react";
import { 
  PhotoIcon, 
  PaperAirplaneIcon,
  XMarkIcon
} from "@heroicons/react/24/outline";
import toast from "react-hot-toast";
import axios from "../../../api/axios";
import { getImageUrl } from "../../utils/getImageUrl";
import { useNavigate } from "react-router-dom";

const PostComposer = ({ user , setPosts , postToEdit, setPostToEdit , onSuccess}) => {
  const [content, setContent] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]); // New File objects
  const [existingImages, setExistingImages] = useState([]); // Old filenames from DB
  const [previews, setPreviews] = useState([]); // Visual URLs for both
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  
  const POST_IMAGE_BASE_URL = `${import.meta.env.VITE_BACKEND_URL}/uploads/posts/`;

  useEffect(() => {
    if (postToEdit) {
      setContent(postToEdit.content || "");
      
      // 1. Store the raw filenames so we can send them back to Laravel
      const oldImages = postToEdit.image || [];
      setExistingImages(oldImages);
      
      // 2. Generate full URLs for the UI previews
      const existingPreviews = oldImages.map(img => 
         img.startsWith('http') ? img : `${POST_IMAGE_BASE_URL}${img}`
      );
      setPreviews(existingPreviews);
      setSelectedFiles([]); 
      
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [postToEdit]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    
    // Validate total count (Existing + New + Incoming)
    if (previews.length + files.length > 4) {
      toast.error("You can only have a maximum of 4 images.");
      return;
    }

    const newFiles = [];
    const newPreviews = [];

    files.forEach((file) => {
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} is too large (Max 5MB)`);
        return;
      }
      newFiles.push(file);
      newPreviews.push(URL.createObjectURL(file));
    });

    setSelectedFiles((prev) => [...prev, ...newFiles]);
    setPreviews((prev) => [...prev, ...newPreviews]);
    e.target.value = null;
  };

  const cancelEdit = () => {
    setPostToEdit(null);
    setContent("");
    setSelectedFiles([]);
    setExistingImages([]);
    setPreviews([]);
  };

  const removeImage = (index) => {
    // Check if we are removing an existing image or a new one
    if (index < existingImages.length) {
      // Removing an old image
      setExistingImages((prev) => prev.filter((_, i) => i !== index));
    } else {
      // Removing a new file
      const newFileIndex = index - existingImages.length;
      setSelectedFiles((prev) => prev.filter((_, i) => i !== newFileIndex));
    }

    // Revoke URL if it was a new file preview
    if (previews[index].startsWith('blob:')) {
      URL.revokeObjectURL(previews[index]);
    }
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim() && previews.length === 0) return;

    setLoading(true);
    const formData = new FormData();
    formData.append("content", content);
    formData.append("member_id", user.id);

    if (postToEdit) {
      formData.append("_method", "PUT");
      // Send the list of old images we want to KEEP
      formData.append("existing_images", JSON.stringify(existingImages));
    }

    selectedFiles.forEach((file) => {
      formData.append("images[]", file);
    });

    try {
      const url = postToEdit ? `/api/user/posts/${postToEdit.id}` : "/api/user/posts";
      const response = await axios.post(url, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

    if (response.data.status) {
  toast.success(postToEdit ? "Post updated!" : "Posted to the hub!");
  
  const updatedPostFromServer = response.data.data;

  if (postToEdit) {
    setPosts((prev) => prev.map(p => 
      p.id === postToEdit.id 
        ? { 
            ...updatedPostFromServer, 
            // PRESERVE these values from the local state
            is_reacted: p.is_reacted, 
            is_saved: p.is_saved 
          } 
        : p
    ));
  } else {
    if (onSuccess) onSuccess();
    setPosts((prev) => [updatedPostFromServer, ...prev]);
  }

  cancelEdit();
}
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Failed to post update";
      toast.error(errorMsg, {
        duration: 4000,
        position:"top-center"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`bg-white p-4 sm:p-6 rounded-3xl border ${postToEdit ? 'border-lime-400 ring-2 ring-lime-50' : 'border-gray-100'} shadow-sm sticky top-20 transition-all duration-300`}>
      {postToEdit && (
        <div className="flex justify-between items-center mb-4 bg-lime-50 p-2 px-4 rounded-xl">
          <span className="text-sm font-bold text-lime-700">Editing Post</span>
          <button onClick={cancelEdit} className="text-xs text-lime-600 hover:underline">Cancel Edit</button>
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col sm:flex-row gap-4 border-b border-gray-100 mb-3">
          <img 
           onClick={()=>navigate(`/user/${user?.id}`)}
          src={getImageUrl(user?.proImg, user)} alt={user?.name} className="w-12 h-12 rounded-full object-cover cursor-pointer" />
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={`How are you helping the planet today, ${user?.name}?`}
            rows="2"
            className="flex-1 bg-gray-50 p-3.5 px-5 rounded-2xl border-none outline-none focus:ring-1 focus:ring-lime-300 text-gray-800 placeholder:text-gray-400 resize-none"
          />
          <button 
            type="submit" 
            disabled={loading || (!content.trim() && previews.length === 0)}
            className="w-full sm:w-auto self-end sm:self-center bg-lime-500 text-white font-bold text-sm rounded-xl px-6 py-3 hover:bg-lime-600 active:scale-95 transition flex items-center justify-center gap-2 shadow-sm disabled:bg-gray-300"
          >
            {loading ? "Processing..." : (
              <>
                <PaperAirplaneIcon className="w-4 h-4 -rotate-45" />
                <span>{postToEdit ? "Update Post" : "Share Post"}</span>
              </>
            )}
          </button>
        </div>

        {previews.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
            {previews.map((url, index) => (
              <div key={url} className="relative group aspect-square rounded-2xl overflow-hidden border border-gray-100 shadow-inner">
                <img src={url} alt="preview" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-2 right-2 p-1.5 bg-black/50 text-white rounded-full hover:bg-red-500 transition-all opacity-0 group-hover:opacity-100"
                >
                  <XMarkIcon className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between pt-4 border-t border-gray-50">
          <div className="flex gap-4">
            <input
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              ref={fileInputRef}
              onChange={handleFileChange}
            />
            <button 
              type="button"
              onClick={() => fileInputRef.current.click()}
              disabled={previews.length >= 4}
              className="flex items-center gap-2 text-gray-500 hover:text-gray-700 text-sm font-medium disabled:opacity-30 transition-opacity"
            >
              <PhotoIcon className="w-5 h-5 text-blue-500" />
              <span>Image ({previews.length}/4)</span>
            </button>
          </div>
          
          <div className="text-sm text-gray-500">
            Visibility: <span className="font-bold text-gray-900">Public 🌍</span>
          </div>

        </div>
      </form>
    </div>
  );
};

export default PostComposer;

