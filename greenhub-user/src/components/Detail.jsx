import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  StarIcon,
  ChevronRightIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/solid";
import {
  ExclamationTriangleIcon,
  XCircleIcon,
  ShoppingCartIcon
} from "@heroicons/react/24/outline";
import { ProductCardSkeleton } from "../components/ProductCardSkeleton"; // Reusing your skeleton
import axios from "../../api/axios";
import Shoppingcart from "../components/Shoppingcart";
import { DetailSkeleton } from "../components/DetailSkeleton";
import ProductTabs from "./ProductTabs";
import { useCart } from "../context/CartContext";
import toast from "react-hot-toast";
import Recommendation from "./Recommendation";
import { useAuth } from "../context/AuthContext";

// A basic skeleton for the main product detail area

const Detail = () => {
  const {user} = useAuth;
  const { cartItems, addToCart } = useCart();
  const { id } = useParams(); // Get product ID from URL
  const [data, setData] = useState({ product: null, recommendations: [] });
  const [loading, setLoading] = useState(true);
  const [cartOpen, setCartOpen] = useState(false);
  const [errors, setErrors] = useState("");

  // Load product detail data

  const handleAddToCart = (e, p) => {
    e.preventDefault(); // Prevents the Link from opening the Detail page
    e.stopPropagation(); // Prevents double-firing the click event

    if (!user) {
          // 1. Show Alert (Using toast for a better Nganter UI experience)
          toast.error("Please sign in to purchase to products");
          return;
      }

    // Optional: Check stock here to prevent even calling the context if empty
    if (p.stock_qty <= 0) {
      toast.error("This item is out of stock", { id: `out-${p.id}` });
      return;
    }

    addToCart(p);
  };


  const loadProductData = async () => {
    setLoading(true);
    setErrors("");
    try {
      const res = await axios.get(`api/admin/products/${id}`);
      if (res.data.status) {
        setData(res.data);
      }
    } catch (err) {
      if (err.response) {
        setErrors(err.response.data.message);
      }
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    loadProductData();
  }, [id]);

  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  // Loading and Error States
  if (loading)
    return (
      <div className="max-w-7xl mx-auto px-4 pt-16 space-y-24">
        <DetailSkeleton />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {[...Array(4)].map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  if (!data.data) return null;

  const product = data.data;

  // Use optional chaining and fallback for missing rating
  const avgRating = product.ratings_avg_rating
    ? Number(product.ratings_avg_rating).toFixed(1)
    : "0.0";
  //   const projectTitle = product.eco_projects?.[0]?.title || 'Eco Product';
  const mainImage = product.image
    ? `${import.meta.env.VITE_BACKEND_URL}/uploads/admin/${product.image}`
    : "/fallback-product.jpg";

  return (
    <main className="bg-gray-50 dark:bg-gray-950 min-h-screen pb-24 text-gray-900 dark:text-white">
      {errors && (
        <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm">
          {errors}
        </div>
      )}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* --- Main Product Section --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 xl:gap-x-16 gap-y-10  ">
          {/* Left Side: Product Image & Gallery Skeletons */}

          <div className="bg-gray-200/50 rounded-3xl p-6 shadow-subtle border border-gray-100 ">
            <img
              src={mainImage}
              alt={product.productName}
              className="w-full h-[380px] lg:h-[500px] object-contain"
            />
          </div>

          {/* Right Side: Product Details */}
          <div className="pt-8 md:pt-12 space-y-8">
            {/* Title & Top Right Actions */}
            <div className="flex items-start justify-between gap-4">
              {/* Breadcrumb Navigation - Align with example image */}
              <nav className="flex items-center gap-2 text-sm text-gray-500">
                <Link to="/" className="hover:text-lime-600">
                  Home
                </Link>
                <ChevronRightIcon className="h-4 w-4" />
                <Link to="/products" className="hover:text-lime-600">
                  Product
                </Link>
                <ChevronRightIcon className="h-4 w-4" />
                <span className="text-gray-900 dark:text-gray-200 line-clamp-1">
                  {product.productName}
                </span>
              </nav>
              {/* Action Icons group (Like, Share, Bag) */}
              <div className="flex items-center gap-3 shrink-0">
                <button
                  onClick={() => setCartOpen(true)}
                  className="text-gray-400 hover:text-lime-600 relative"
                >
                  <ShoppingCartIcon className="h-6 w-6" />
                  {totalItems > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-[10px] text-white rounded-full px-1.5">
                      {totalItems}
                    </span>
                  )}
                </button>
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-950 dark:text-white leading-tight">
              {product.productName}
            </h1>

            {/* Rating Section - Safety check implemented */}
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1.5 bg-yellow-400 px-3 py-1.5 rounded-full text-white font-bold">
                <StarIcon className="h-4 w-4" />
                <span>{avgRating}</span>
              </div>
              <span className="text-gray-500">
                • {product.ratings_count} Reviews
              </span>
              <span className="inline-flex items-center gap-1.5 text-lime-600 font-medium">
                <CheckCircleIcon className="h-4 w-4" /> Eco-Verified
              </span>
            </div>

            {/* Pricing */}
            <div className="flex items-baseline gap-3 mb-8">
              <span className="text-3xl font-bold text-gray-950 ">
                {product.price
                  ? Number(product.price).toLocaleString("en-US")
                  : "0"}{" "}
                Ks
              </span>
            </div>

            {product.stock_qty > 0 ? (
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Availability:
                  </h2>

                  <div
                    className={`flex items-center gap-1.5 text-sm font-bold px-3 py-1 rounded-full ${
                      product.stock_qty <= 2
                        ? "bg-red-50 text-red-600"
                        : "bg-lime-50 text-lime-600"
                    }`}
                  >
                    {product.stock_qty <= 2 ? (
                      <>
                        <ExclamationTriangleIcon className="h-4 w-4" />
                        <span>
                          {product.stock_qty === 1
                            ? `Only ${product.stock_qty} unit left`
                            : `${product.stock_qty} units left - Low Stock`}
                        </span>
                      </>
                    ) : (
                      <>
                        <CheckCircleIcon className="h-4 w-4" />
                        <span>{product.stock_qty} units in stock</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-red-500 bg-red-50 w-fit px-4 py-2 rounded-xl border border-red-100">
                <XCircleIcon className="h-5 w-5" />
                <h2 className="text-sm font-extrabold uppercase tracking-tight">
                  Out of Stock
                </h2>
              </div>
            )}

            {/* Description - Same alignment as example */}
            <div className="space-y-3">
              <h2 className="text-lg font-semibold">Description</h2>
              <div className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed prose prose-sm dark:prose-invert">
                {product.description ||
                  "No description available for this eco-friendly product."}
              </div>
            </div>

            {/* Action Buttons - Buy Now & Add to Cart (Matched example alignment) */}
            <div className="grid grid-cols-2 gap-4 mt-12 pt-10 border-t border-gray-200 dark:border-gray-800">
              <button
                onClick={() => addToCart(product)}
                className="bg-black text-white font-bold py-4 rounded-2xl transition hover:bg-gray-800 shadow-lg:scale-95"
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>

        <ProductTabs product={product} onReviewSubmitted={loadProductData} />

        {/* --- RECOMMENDED SECTION --- */}
        <Recommendation data={data} handleAddToCart={handleAddToCart}/>
      </div>
      <Shoppingcart open={cartOpen} setOpen={setCartOpen} />
    </main>
  );
};

export default Detail;
