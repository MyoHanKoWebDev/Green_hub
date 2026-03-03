import React, { useState } from "react";
import { FaRecycle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "../../api/axios";
import SuccessAlert from "../components/SuccessAlert";
import toast from 'react-hot-toast'; 

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [generalError, setGeneralError] = useState("");


  const handleSubmit = async (e) => {
    e.preventDefault();
    setGeneralError("");
    setLoading(true);
    try {
      const response = await axios.post("api/user/send-otp", { email });

      if (response.data.status) {
          toast.success(response.data.message, {
          duration: 4000,
          style: {
            borderRadius: '10px',
            background: '#333',
            color: '#fff',
          },
        });
          navigate("/verify-otp", { state: { email } });

      }
    } catch (err) {
      if (err.response && err.response.status === 422) {
        setGeneralError(err.response.data.message);
      }else{
        setGeneralError("Connection to server failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">

      <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm text-center">
          <FaRecycle className="w-auto h-10 text-lime-500 mx-auto cursor-pointer" />
          <h2 className="mt-8 text-2xl font-bold tracking-tight text-gray-900">
            Forgot Password?
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Enter your email and we'll send you a 6-digit recovery code.
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-sm">
          {/* General Error Alert */}
          {generalError && (
            <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm">
              {generalError}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="space-y-6 p-6 bg-gray-100 rounded-xl shadow-sm"
          >
            <div>
              <label className="block text-sm font-medium text-gray-900">
                Email address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-2 block w-full rounded-md bg-white px-3 py-1.5 text-gray-900 outline-gray-300 focus:outline-lime-600 sm:text-sm"
                placeholder="eco-hero@example.com"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center rounded-md shadow-xs text-sm/6 bg-lime-500 px-3 py-2 font-semibold text-white hover:bg-lime-600 focus-visible:outline-2 focus-visible:outline-lime-500 disabled:bg-gray-400"
            >
              {loading ? "Sending..." : "Send Reset Code"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
