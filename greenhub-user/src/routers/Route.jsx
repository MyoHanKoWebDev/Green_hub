import "../index.css";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import App from "../App";
import Home from "../pages/Home";
import Product from "../pages/Product";
import Contact from "../pages/Contact";
import About from "../pages/About";
import Posts from "../pages/Posts";
import Projects from "../pages/Projects";
import Signin from "../pages/Signin";
import Signup from "../pages/Signup";
import ForgotPassword from "../pages/ForgotPassword";
import VerifyOtp from "../pages/VerifyOtp";
import ResetPassword from "../pages/ResetPassword";
import ProductDetail from "../pages/ProductDetail";
import Checkout from "../pages/Checkout";
import ProtectedRoute from "../components/common/ProtectRout";
import UserProfile from "../pages/UserProfile";
import Setting from "../pages/Setting"
import NotFound from "../pages/NotFound";

const Router = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <App />,
      children: [
        {
          path: "/",
          element: <Home />,
        },
        {
          path: "/products",
          element: <Product />,
        },
        {
          path: "/products/:id",
          element: <ProductDetail />,
        },
        {
          path: "/posts",
          element: <Posts />,
        },
        {
          path: "/projects",
          element: <Projects />,
        },
        {
          path: "/user/:userId",
          element: <UserProfile />,
        },
        {
          path: "/settings",
          element: <Setting />,
        },
        {
          element: <ProtectedRoute />, // All children here require login
          children: [
        {
          path: "/checkout",
          element: <Checkout />,
        },
      ]},
        {
          path: "/about",
          element: <About />,
        },
        {
          path: "/contact",
          element: <Contact />,
        },
        {
          path: "*",
          element: <NotFound />,
        }
      ],
    },
    {
      path: "/signin",
      element: <Signin />,
    },
    {
      path: "/signup",
      element: <Signup />,
    },
    {
      path: "/forgot-password",
      element: <ForgotPassword />,
    },
    {
      path: "/verify-otp",
      element: <VerifyOtp />,
    },
    {
      path: "/reset-password",
      element: <ResetPassword />,
    },
  ]);

  return <RouterProvider router={router} />;
};

export default Router;
