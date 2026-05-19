import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from "react-router-dom";
import { StarIcon, ShoppingCartIcon, ArrowRightIcon } from "@heroicons/react/20/solid";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

const HomePopularProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchPopular = async () => {
      try {
        // Fetching top 4 products sorted by highest average rating
        const res = await axios.get('/api/admin/products?sort=popular&per_page=4');
        if (res.data.status) {
          setProducts(res.data.data);
        }
      } catch (err) {
        console.error("Error fetching popular products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPopular();
  }, []);

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

  if (loading || products.length === 0) return null;

  return (
    <section className="py-15 bg-gray-50 dark:bg-gray-950">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-10">
        
        {/* Section Heading */}
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
              Top <span className="text-lime-600">Rated</span> Choice
            </h2>
            <p className="text-gray-500 mt-2">The most loved eco-products by our community.</p>
          </div>
          <Link to="/products" className="group flex items-center gap-2 text-lime-600 font-bold hover:text-lime-700 transition-colors">
            See Marketplace <ArrowRightIcon className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Product Grid - Exactly your design */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((p, index) => (
            <Link
              to={`/products/${p.id}`}
              key={p.id}
              className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-xl overflow-hidden transform transition duration-300 hover:shadow-xl animate-fadeIn"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="relative overflow-hidden">
                <div className="overflow-hidden border border-gray-100 dark:border-gray-800 rounded-3xl m-2">
                  <img
                    src={`${import.meta.env.VITE_BACKEND_URL}/uploads/admin/${p.image}`}
                    alt={p.productName}
                    className="w-full h-56 object-cover transition-transform duration-300 hover:scale-105"
                  />
                </div>

                {p.eco_projects?.[0] && (
                  <span className="absolute top-4 right-4 bg-lime-500 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-sm">
                    {p.eco_projects[0].title}
                  </span>
                )}
              </div>

              <div className="p-4">
                {/* Price */}
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-xl font-black text-gray-900 dark:text-white">
                    {p.price ? Number(p.price).toLocaleString() : "0"} Ks
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 line-clamp-2 min-h-[40px] mb-4">
                  {p.productName}
                </h3>

                {/* Rating & Cart */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center bg-yellow-400 px-3 py-1.5 rounded-full text-white text-xs font-bold">
                    <StarIcon className="h-3 w-3 mr-1" />
                    {p.ratings_avg_rating ? Number(p.ratings_avg_rating).toFixed(1) : "0.0"}
                  </div>

                  <button
                    disabled={p.stock_qty <= 0}
                     onClick={(e) => handleAddToCart(e, p)}
                    className={`p-2 rounded-full transition-all active:scale-90 shadow-md ${
                      p.stock_qty <= 0
                        ? "bg-gray-300 cursor-not-allowed"
                        : "bg-lime-500 hover:bg-lime-600 text-white"
                    }`}
                  >
                    <ShoppingCartIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HomePopularProducts;