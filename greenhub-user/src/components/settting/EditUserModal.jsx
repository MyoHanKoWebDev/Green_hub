import React, { useState, useEffect } from "react";
import axios from "../../../api/axios";
import { toast } from "react-hot-toast";

export default function EditUserModal({ isOpen, onClose, user, onUpdateSuccess }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
  });
  const [selectedFile, setSelectedFile] = useState(null);

  // Sync user data when modal opens
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        address: user.address || "",
      });
    }
  }, [user, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Use FormData for file uploads
    const data = new FormData();
    data.append("name", formData.name);
    data.append("email", formData.email);
    data.append("address", formData.address);
    if (selectedFile) {
      data.append("proImg", selectedFile);
    }

    try {
      // Laravel needs _method: 'PUT' or 'PATCH' if using FormData via POST
      const response = await axios.post(`/api/user/update-profile/${user.id}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data.status) {
        toast.success(response.data.message);
        onUpdateSuccess(response.data.user); // Update local user state
        onClose();
      }
    } catch (err) {
      const errors = err.response?.data?.errors;
      if (errors) {
        Object.values(errors).forEach((msg) => toast.error(msg[0]));
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl dark:bg-gray-900">
        <h3 className="mb-6 text-xl font-bold text-gray-800 dark:text-white">Edit Profile</h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Profile Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setSelectedFile(e.target.files[0])}
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-lime-50 file:text-lime-700 hover:file:bg-lime-100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Full Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full rounded-lg border border-gray-300 p-2.5 outline-none focus:border-lime-500 dark:bg-gray-800"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email Address</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full rounded-lg border border-gray-300 p-2.5 outline-none focus:border-lime-500 dark:bg-gray-800"
              required
            />
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-8 py-2.5 bg-gray-100 text-gray-800 font-bold rounded-2xl hover:bg-gray-200 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-lime-500 text-white px-8 py-2.5 rounded-xl font-bold shadow-lg shadow-lime-100 active:scale-95 transition disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}