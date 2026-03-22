import React, { useRef, useState } from "react";
import { FaRecycle } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import axios from "../../api/axios";
import SuccessAlert from "../components/SuccessAlert";
import { useGoogleLogin } from "@react-oauth/google";
import { useAuth } from "../context/AuthContext";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import toast from 'react-hot-toast'; // Import toast


const Signup = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const nameRef = useRef();
  const emailRef = useRef();
  //const addressRef = useRef();
  const passwordRef = useRef();
  const confirmPasswordRef = useRef();
  const imageRef = useRef();

  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConPassword, setShowConPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    setGeneralError("");

    const data = new FormData();
    data.append("name", nameRef.current.value);
    data.append("email", emailRef.current.value);
    // data.append("address", addressRef.current.value);
    data.append("password", passwordRef.current.value);
    data.append("password_confirmation", confirmPasswordRef.current.value);

    if (imageRef.current.files[0]) {
      data.append("proImg", imageRef.current.files[0]);
    }

    try {
      const response = await axios.post("/api/user/register", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (response.data.status) {

        login(response.data.user, response.data.token);
        navigate("/");
        toast.success(response.data.message, {
          duration: 4000,
          style: {
            borderRadius: '10px',
            background: '#333',
            color: '#fff',
          },
        });

        navigate("/");
        
      }
    } catch (err) {
      if (err.response && err.response.status === 422) {
        setErrors(err.response.data.errors);
      }
    } finally {
      setLoading(false);
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setLoadingGoogle(true);
      try {
        // This sends the access token to your backend
        const res = await axios.post("api/user/google-login", {
          token: tokenResponse.access_token,
        });

        if (res.data.status) {
          login(res.data.user, res.data.token);
          navigate("/");
        }
      } catch (err) {
        if (err.response && err.response.status === 401) {
          setGeneralError(err.response.data.message);
        } else {
          setGeneralError("Google login failed. Please try again.");
        }
      } finally {
        setLoadingGoogle(false);
      }
    },
  });

  return (
    <div className="relative">
      
      <div className="flex min-h-full flex-col justify-center px-6 py-8 lg:px-8 ">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <FaRecycle
            className="w-auto h-10 text-lime-500 mx-auto cursor-pointer"
            onClick={() => navigate("/")}
          />
          <h2 className="mt-8 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
            Create an account
          </h2>
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
            method="POST"
            className="space-y-4 p-5 bg-gray-100 rounded-xl"
          >
            <div>
              <label className="block text-sm/6 font-medium text-gray-900">
                Name
              </label>
              <div className="mt-2">
                <input
                  ref={nameRef}
                  type="text"
                  required
                  className={`block w-full rounded-md bg-white px-3 py-1.5 text-gray-900 outline-1 -outline-offset-1 ${errors.name ? "outline-red-500" : "outline-gray-300"} focus:outline-lime-600`}
                />
                {errors.name && (
                  <p className="text-xs text-red-500 mt-1">{errors.name[0]}</p>
                )}
              </div>
            </div>
            <div>
              <label className="block text-sm/6 font-medium text-gray-900">
                Email address
              </label>
              <div className="mt-2">
                <input
                  ref={emailRef}
                  type="email"
                  required
                  className={`block w-full rounded-md bg-white px-3 py-1.5 text-gray-900 outline-1 -outline-offset-1 ${errors.email ? "outline-red-500" : "outline-gray-300"} focus:outline-lime-600`}
                />
                {errors.email && (
                  <p className="text-xs text-red-500 mt-1">{errors.email[0]}</p>
                )}
              </div>
            </div>

            {/* <div>
              <label className="block text-sm/6 font-medium text-gray-900">
                Address
              </label>
              <div className="mt-2">
                <input
                  ref={addressRef}
                  type="address"
                  required
                  className={`block w-full rounded-md bg-white px-3 py-1.5 text-gray-900 outline-1 -outline-offset-1 ${errors.address ? "outline-red-500" : "outline-gray-300"} focus:outline-lime-600`}
                />
                {errors.address && (
                  <p className="text-xs text-red-500 mt-1">{errors.address[0]}</p>
                )}
              </div>
            </div> */}

            <div>
              <div className="flex items-center justify-between">
                <label className="block text-sm/6 font-medium text-gray-900">
                  Password
                </label>
              </div>
              <div className="mt-2">
                <div className="relative">
                  <input
                    ref={passwordRef}
                    type={showPassword ? "text" : "password"}
                    required
                    className={`block w-full rounded-md bg-white px-3 py-1.5 text-gray-900 outline-1 -outline-offset-1 ${errors.password ? "outline-red-500" : "outline-gray-300"} focus:outline-lime-600`}
                  />

                  {/* Eye Icon Button */}
                  <button
                    type="button" // Important: set to button so it doesn't submit the form
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-lime-600 transition-colors"
                  >
                    {showPassword ? (
                      <FaEyeSlash className="w-5 h-5" />
                    ) : (
                      <FaEye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.password[0]}
                  </p>
                )}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label className="block text-sm/6 font-medium text-gray-900">
                  Confirm Password
                </label>
              </div>
              <div className="mt-2 relative">
                <input
                  ref={confirmPasswordRef}
                  type={showConPassword ? "text" : "password"}
                  required
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-lime-600"
                />
                {/* Eye Icon Button */}
                <button
                  type="button" // Important: set to button so it doesn't submit the form
                  onClick={() => setShowConPassword(!showConPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-lime-600 transition-colors"
                >
                  {showConPassword ? (
                    <FaEyeSlash className="w-5 h-5" />
                  ) : (
                    <FaEye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <div>
                <label className="block text-sm/6 font-medium text-gray-900">
                  Profile Image
                </label>
              </div>
              <div className="mt-2">
                <input
                  ref={imageRef}
                  type="file"
                  className={`block w-full rounded-md bg-white px-3 py-1.5 text-gray-900 outline-1 -outline-offset-1 ${errors.proImg ? "outline-red-500" : "outline-gray-300"} focus:outline-lime-600`}
                />
                {errors.proImg && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.proImg[0]}
                  </p>
                )}
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="flex w-full justify-center rounded-md bg-lime-500 px-3 py-2 text-sm/6 font-semibold text-white shadow-xs hover:bg-lime-600 focus-visible:outline-2 focus-visible:outline-lime-500 disabled:bg-gray-400"
              >
                {loading ? "Registering..." : "Sign Up"}
              </button>
            </div>

            <button
              type="button"
              onClick={() => googleLogin()}
              className="flex items-center justify-center w-full px-8 py-2 mt-7 text-sm/6 font-semiboldtext-gray-900
                        transition-all duration-200 bg-gray-200 border border-transparent rounded-md hover:bg-gray-300
                    focus:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 font-pj
                    outline-1 -outline-offset-1 outline-gray-300"
              role="button"
            >
              <svg
                className="w-5 h-5 mr-4"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M19.2436 8.26113L11.0858 8.26074C10.7256 8.26074 10.4336 8.5527 10.4336 8.91293V11.519C10.4336 11.8791 10.7256 12.1712 11.0858 12.1712H15.6798C15.1767 13.4767 14.2378 14.57 13.0399 15.2647L14.9988 18.6557C18.1411 16.8384 19.9988 13.6497 19.9988 10.0803C19.9988 9.57203 19.9613 9.20871 19.8864 8.79961C19.8295 8.48879 19.5596 8.26113 19.2436 8.26113Z"
                  fill="#167EE6"
                ></path>
                <path
                  d="M9.99957 16.0871C7.75137 16.0871 5.78871 14.8587 4.73461 13.041L1.34375 14.9955C3.06934 17.9862 6.30191 20.0001 9.99957 20.0001C11.8135 20.0001 13.5251 19.5117 14.9996 18.6606V18.6559L13.0407 15.2649C12.1447 15.7846 11.1078 16.0871 9.99957 16.0871Z"
                  fill="#12B347"
                ></path>
                <path
                  d="M15 18.6603V18.6557L13.0411 15.2646C12.1451 15.7843 11.1083 16.0868 10 16.0868V19.9998C11.8139 19.9998 13.5256 19.5114 15 18.6603Z"
                  fill="#0F993E"
                ></path>
                <path
                  d="M3.91305 10.0002C3.91305 8.89207 4.21547 7.85531 4.73504 6.95934L1.34418 5.00488C0.488359 6.47469 0 8.18164 0 10.0002C0 11.8188 0.488359 13.5258 1.34418 14.9956L4.73504 13.0411C4.21547 12.1452 3.91305 11.1084 3.91305 10.0002Z"
                  fill="#FFD500"
                ></path>
                <path
                  d="M9.99957 3.91305C11.4656 3.91305 12.8123 4.43398 13.8641 5.30051C14.1236 5.51426 14.5007 5.49883 14.7384 5.26113L16.5849 3.41465C16.8546 3.14496 16.8354 2.70352 16.5473 2.45359C14.785 0.924726 12.492 0 9.99957 0C6.30191 0 3.06934 2.01395 1.34375 5.00465L4.73461 6.9591C5.78871 5.14141 7.75137 3.91305 9.99957 3.91305Z"
                  fill="#FF4B26"
                ></path>
                <path
                  d="M13.8645 5.30051C14.124 5.51426 14.5012 5.49883 14.7389 5.26113L16.5854 3.41465C16.855 3.14496 16.8358 2.70352 16.5477 2.45359C14.7854 0.924688 12.4925 0 10 0V3.91305C11.466 3.91305 12.8127 4.43398 13.8645 5.30051Z"
                  fill="#D93F21"
                ></path>
              </svg>
              {loadingGoogle ? "Signing in..." : "Sign in with Google"}
            </button>
          </form>

          <p className="mt-10 text-center text-sm/6 text-gray-500">
            Already have an account?{" "}
            <Link
              to="/signin"
              className="font-semibold text-lime-500 hover:text-lime-600"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
