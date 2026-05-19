import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

export default function EditPasswordModal({ isOpen, onClose, user, token }) {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({}); // Stores validation errors from Laravel
  const [formData, setFormData] = useState({
    current_password: "",
    new_password: "",
    new_password_confirmation: "",
  });

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({}); // Clear previous errors

    try {
      // Note: We use PUT as defined in your routes, or POST with _method spoofing
      const response = await axios.put(`/api/user/change-password/${user.id}`, formData,
        {headers: {
        Authorization: `Bearer ${token}`,  
        Accept: 'application/json',
      }});

      if (response.data.status) {
        toast.success(response.data.message);
        setFormData({ current_password: "", new_password: "", new_password_confirmation: "" });
        onClose();
      }
    } catch (err) {
      if (err.response?.status === 422) {
        // Validation errors from Laravel Validator
        setErrors(err.response.data.errors);
      } else if (err.response?.status === 401) {
        // Custom "Current Password Incorrect" error
        setErrors({ current_password: [err.response.data.message] });
      } else {
        toast.error("An unexpected error occurred.");
      }
      console.log(err.response);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-gray-900">
        <h3 className="mb-6 text-xl font-bold text-gray-800 dark:text-white">Change Password</h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Current Password */}
          <div>
            <label className="block text-sm font-medium mb-1">Current Password</label>
            <input
              type="password"
              className={`w-full rounded-lg border p-2.5 outline-none transition-all ${
                errors.current_password ? "border-red-500 bg-red-50" : "border-gray-300 focus:border-lime-500"
              }`}
              onChange={(e) => setFormData({ ...formData, current_password: e.target.value })}
            />
            {errors.current_password && (
              <p className="mt-1 text-xs text-red-500 font-medium">{errors.current_password[0]}</p>
            )}
          </div>

          {/* New Password */}
          <div>
            <label className="block text-sm font-medium mb-1">New Password</label>
            <input
              type="password"
              className={`w-full rounded-lg border p-2.5 outline-none transition-all ${
                errors.new_password ? "border-red-500 bg-red-50" : "border-gray-300 focus:border-lime-500"
              }`}
              onChange={(e) => setFormData({ ...formData, new_password: e.target.value })}
            />
            {errors.new_password && (
              <p className="mt-1 text-xs text-red-500 font-medium">{errors.new_password[0]}</p>
            )}
          </div>

          {/* Confirm New Password */}
          <div>
            <label className="block text-sm font-medium mb-1">Confirm New Password</label>
            <input
              type="password"
              className={`w-full rounded-lg border p-2.5 outline-none transition-all ${
                errors.new_password_confirmation ? "border-red-500 bg-red-50" : "border-gray-300 focus:border-lime-500"
              }`}
              onChange={(e) => setFormData({ ...formData, new_password_confirmation: e.target.value })}
            />
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button type="button" onClick={onClose} className="px-8 py-2.5 bg-gray-100 text-gray-800 font-bold rounded-2xl hover:bg-gray-200 transition">
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-lime-500 text-white px-8 py-2.5 rounded-xl font-bold shadow-lg shadow-lime-100 active:scale-95 transition disabled:opacity-50"
            >
              {loading ? "Updating..." : "Update Password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}