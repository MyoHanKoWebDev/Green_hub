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
          path: "/posts",
          element: <Posts />,
        },
        {
          path: "/projects",
          element: <Projects />,
        },
        {
          path: "/about",
          element: <About />,
        },
        {
          path: "/contact",
          element: <Contact />,
        },
      ],
    },
    {
      path: '/signin',
      element: <Signin />
    },
    {
      path: '/signup',
      element: <Signup />
    },
    {
      path: '/forgot-password',
      element: <ForgotPassword />
    },
    {
      path: '/verify-otp',
      element: <VerifyOtp />
    },
    {
      path: '/reset-password',
      element: <ResetPassword />
    }
  ]);

  return <RouterProvider router={router} />;
};

export default Router;
