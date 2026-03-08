import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaRecycle } from "react-icons/fa";
import axios from "../../api/axios";
import SuccessAlert from "../components/SuccessAlert";
import toast from 'react-hot-toast'; // Import toast

const ResetPassword = () => {
  
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || "";
  const [passwords, setPasswords] = useState({
    password: "",
    password_confirmation: "",
  });

  const [generalError, setGeneralError] = useState("");
  const [errors, setErrors] = useState({});

  const handleReset = async (e) => {
    e.preventDefault();
    setErrors({});
    setGeneralError("");
    try {
      const response = await axios.post("api/user/reset-password", {
        email,
        ...passwords,
      });
      if (response.data.status) {
        toast.success(response.data.message, {
          duration: 4000,
          style: {
            borderRadius: '10px',
            background: '#333',
            color: '#fff',
          },
        });
          navigate("/signin");
      }
    } catch (err) {
      if (err.response) {
        if (err.response.status === 422) {
          // Validation errors (missing fields, invalid email format)
          setErrors(err.response.data.errors);
        } else if (err.response.status === 403) {
          // Logic errors (Email not found or wrong password)
          setGeneralError(err.response.data.message);
        }
      } else {
        setGeneralError("Connection to server failed. Please try again.");
      }
    }
  };

  return (
    <div className="relative">
      <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm text-center">
          <FaRecycle className="w-auto h-10 text-lime-500 mx-auto" />
          <h2 className="mt-8 text-2xl font-bold text-gray-900">
            Set New Password
          </h2>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-sm">
          <form
            onSubmit={handleReset}
            className="space-y-4 p-6 bg-gray-100 rounded-xl"
          >
            {/* General Error Alert */}
            {generalError && (
              <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm">
                {generalError}
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-900">
                New Password
              </label>
              <input
                type="password"
                required
                onChange={(e) =>
                  setPasswords({ ...passwords, password: e.target.value })
                }
                className="mt-1 block w-full rounded-md bg-white px-3 py-1.5 outline-gray-300 focus:outline-lime-600 sm:text-sm"
              />
              {errors.password && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.password[0]}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900">
                Confirm Password
              </label>
              <input
                type="password"
                required
                onChange={(e) =>
                  setPasswords({
                    ...passwords,
                    password_confirmation: e.target.value,
                  })
                }
                className="mt-1 block w-full rounded-md bg-white px-3 py-1.5 outline-gray-300 focus:outline-lime-600 sm:text-sm"
              />
            </div>
            <button
              type="submit"
              className="w-full flex justify-center rounded-md bg-lime-500 px-3 py-2 text-sm font-semibold text-white hover:bg-lime-600 mt-4"
            >
              Reset Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
