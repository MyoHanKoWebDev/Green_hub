import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaRecycle } from "react-icons/fa";
import axios from "../../api/axios";
import toast from 'react-hot-toast'; 

const VerifyOtp = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || ""; // Recover email from state
  const [otp, setOtp] = useState("");

  const [generalError, setGeneralError] = useState("");


  const handleVerify = async (e) => {
    e.preventDefault();
    setGeneralError("");
    try {
      const response = await axios.post("api/user/verify-otp", { email, otp });
      if (response.data.status) {
          toast.success(response.data.message, {
          duration: 4000,
          style: {
            borderRadius: '10px',
            background: '#333',
            color: '#fff',
          },
        });
          navigate("/reset-password", { state: { email } });
      }
    } catch (err) {
      if (err.response && err.response.status === 401) {
        setGeneralError(err.response.data.message);
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
            Check your Email
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            We sent a 6-digit code to <span className="font-semibold">{}</span>
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
            onSubmit={handleVerify}
            className="space-y-6 p-6 bg-gray-100 rounded-xl"
          >
            <div>
              <label className="block text-sm font-medium text-gray-900 text-center">
                Verification Code
              </label>
              <input
                type="text"
                required
                maxLength="6"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="mt-2 block w-full text-center tracking-widest text-xl rounded-md bg-white px-3 py-2 outline-gray-300 focus:outline-lime-600"
                placeholder="000000"
              />
            </div>
            <button
              type="submit"
              className="w-full flex justify-center rounded-md bg-lime-500 px-3 py-2 text-sm font-semibold text-white hover:bg-lime-600"
            >
              Verify Code
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default VerifyOtp;
