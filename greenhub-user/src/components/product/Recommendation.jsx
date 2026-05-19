import React from 'react'
import { Link } from 'react-router-dom';
import {
  StarIcon,
  ChevronRightIcon,
  CheckCircleIcon,
    ShoppingCartIcon

} from "@heroicons/react/24/solid";
import {
  ExclamationTriangleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";

const Recommendation = ({data , handleAddToCart}) => {
  return (
    <>
    {/* --- RECOMMENDED SECTION --- */}
        <section className="mt-16 pt-16 border-t border-gray-200 ">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-3xl font-bold">Recommended for You</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
            {data.recommendations?.length > 0 ? (
              data.recommendations.map((recProd) => {
                // Prepare recommendations using safety guards
                const recRating = recProd.ratings_avg_rating
                  ? Number(recProd.ratings_avg_rating).toFixed(1)
                  : "0.0";
                const recImage = recProd.image
                  ? `${import.meta.env.VITE_BACKEND_URL}/uploads/admin/${recProd.image}`
                  : "/fallback-product.jpg";

                return (
                  <Link
                    to={`/products/${recProd.id}`}
                    key={recProd.id}
                    className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-xl 
             dark:border-gray-700  overflow-hidden transform transition 
              duration-300 hover:shadow-xlopacity-0 animate-fadeIn"
                    style={{ animationDelay: recProd.delay }}
                  >
                    <div className="relative overflow-hidden">
                      <div className="overflow-hidden  border border-gray-300 rounded-3xl">
                        <img
                          src={recImage}
                          alt={recProd.productName}
                          className="w-full h-56 object-cover transition-transform duration-300 hover:scale-105
               cursor-pointer"
                        />
                      </div>

                      <span className="absolute top-2 right-2 bg-lime-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                        {recProd.eco_projects[0].title}
                      </span>
                    </div>
                    {/* Content Container */}
                    <div className="p-4">
                      {/* Price Section */}
                      <div className="flex items-baseline gap-2 mb-1">
                        <span className="text-xl font-bold text-gray-900">
                          {recProd.price ? Number(recProd.price).toLocaleString("en-US") : "0"} Ks
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="text-sm font-medium text-gray-800 line-clamp-2 min-h-[40px] mb-2">
                        {recProd.productName}
                      </h3>

                      {/* Footer Section: Rating + Sold + Cart */}
                      <div className="flex items-center justify-between mt-auto">
                        <div className="flex items-center gap-2">
                          {/* Rating Badge */}
                          <div className="flex items-center bg-yellow-400 px-4 py-2 rounded text-white text-xs font-bold rounded-3xl">
                            <StarIcon className="h-3 w-3 mr-1" />
                            {recRating}
                          </div>
                        </div>

                        {/* Cart Button */}
                  <button
                    disabled={recProd.stock_qty <= 0}
                    onClick={(e) => handleAddToCart(e, recProd)}
                    className={`relative z-50 p-2 rounded-full transition-colors shadow-sm active:scale-90 ${
                      recProd.stock_qty <= 0
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-lime-500 hover:bg-lime-600 text-white"
                    }`}
                  >
                    <ShoppingCartIcon className="h-4 w-4" />
                  </button>
                      </div>
                    </div>
                  </Link>
                );
              })
            ) : (
              <div className="col-span-2 md:col-span-4 flex justify-center py-10 bg-gray-100 dark:bg-gray-900 rounded-2xl text-gray-500 text-sm">
                No matching eco-frienldy products found in recommendations.
              </div>
            )}
          </div>
        </section>
        </>
  )
}

export default Recommendation