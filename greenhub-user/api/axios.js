import axios from "axios";

// axios.defaults.baseURL = import.meta.env.DEFAULT_BASE_URL

axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL 

axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response, config } = error;

    if (response && response.status === 401) {
      // 1. Get the path of the request (e.g., "/api/user/login")
      // config.url might be full "http://localhost:8000/api/user/login"
      const requestUrl = config.url;

      // 2. Define your exclusion keywords
      // We use simple keywords instead of full URLs to avoid "localhost vs 127.0.0.1" issues
      const excludedKeywords = [
        '/login',
        '/google-login',
        '/verify-otp',
        '/reset-password'
      ];

      // 3. Check if the URL contains ANY of the keywords
      const isExcluded = excludedKeywords.some(keyword => requestUrl.includes(keyword));

      // DEBUG: Look at your console to see what the interceptor is seeing
      console.log("401 detected on:", requestUrl, "| Is Excluded:", isExcluded);

      if (!isExcluded) {
        console.warn("Session truly expired. Redirecting...");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/signin";
      }
    }
    
    return Promise.reject(error);
  }
);

export default axios