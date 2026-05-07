import {
  StarIcon,
  ShoppingCartIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/20/solid";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

const Productlist = ({ products, pagination, onPageChange }) => {
  const {user} = useAuth();
  const { addToCart } = useCart();
  
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

  return (
    <section className="px-4 bg-gray-50 dark:bg-gray-950">
      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {Array.isArray(products) &&
          products.map((p) => (
            <Link
              to={`/products/${p.id}`}
              key={p.id}
              className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-xl 
             dark:border-gray-700  overflow-hidden transform transition 
              duration-300 hover:shadow-xlopacity-0 animate-fadeIn"
              style={{ animationDelay: p.delay }}
            >
              <div className="relative overflow-hidden">
                <div className="overflow-hidden  border border-gray-300 rounded-3xl">
                  <img
                    src={`${import.meta.env.VITE_BACKEND_URL}/uploads/admin/${p.image}`}
                    alt={p.productName}
                    className="w-full h-56 object-cover transition-transform duration-300 hover:scale-105
               cursor-pointer"
                  />
                </div>

                <span className="absolute top-2 right-2 bg-lime-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                  {p.eco_projects[0].title}
                </span>
              </div>
              {/* Content Container */}
              <div className="p-4">
                {/* Price Section */}
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-xl font-bold text-gray-900">
                    {p.price ? Number(p.price).toLocaleString("en-US") : "0"} Ks
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-sm font-medium text-gray-800 line-clamp-2 min-h-[40px] mb-2">
                  {p.productName}
                </h3>

                {/* Footer Section: Rating + Sold + Cart */}
                <div className="flex items-center justify-between mt-auto">
                  <div className="flex items-center gap-2">
                    {/* Rating Badge */}
                    <div className="flex items-center bg-yellow-400 px-4 py-2 rounded text-white text-xs font-bold rounded-3xl">
                      <StarIcon className="h-3 w-3 mr-1" />
                      {p.ratings_avg_rating
                        ? Number(p.ratings_avg_rating).toFixed(1)
                        : "0.0"}
                    </div>
                  </div>

                  {/* Cart Button */}
                  <button
                    disabled={p.stock_qty <= 0}
                    onClick={(e) => handleAddToCart(e, p)}
                    className={`relative z-50 p-2 rounded-full transition-colors shadow-sm active:scale-90 ${
                      p.stock_qty <= 0
                        ? "bg-gray-300 cursor-not-allowed"
                        : "bg-lime-500 hover:bg-lime-600 text-white"
                    }`}
                  >
                    <ShoppingCartIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </Link>
          ))}
      </div>
      {/* Pagination UI */}
      <div className="mt-12 flex items-center justify-center gap-2">
        {/* Previous Button */}
        <button
          disabled={pagination.current_page === 1}
          onClick={() => onPageChange(pagination.current_page - 1)}
          className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 hover:bg-gray-100 transition-colors"
        >
          <ChevronLeftIcon className="h-5 w-5" />
        </button>

        {/* Page Numbers */}
        {[...Array(pagination.last_page)].map((_, i) => (
          <button
            key={i + 1}
            onClick={() => onPageChange(i + 1)}
            className={`w-10 h-10 rounded-lg border text-sm font-medium transition-colors ${
              pagination.current_page === i + 1
                ? "bg-lime-500 border-lime-500 text-white"
                : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
            }`}
          >
            {i + 1}
          </button>
        ))}

        {/* Next Button */}
        <button
          disabled={pagination.current_page === pagination.last_page}
          onClick={() => onPageChange(pagination.current_page + 1)}
          className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 hover:bg-gray-100 transition-colors"
        >
          <ChevronRightIcon className="h-5 w-5" />
        </button>
      </div>
    </section>
  );
};

export default Productlist;
