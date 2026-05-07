export const ProductCardSkeleton = () => {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl overflow-hidden border border-gray-100 dark:border-gray-800 animate-pulse">
      {/* Image Area Skeleton */}
      <div className="relative p-2">
        <div className="w-full h-56 bg-gray-200 dark:bg-gray-800 rounded-3xl" />
        {/* Project Tag Skeleton */}
        <div className="absolute top-4 right-4 w-20 h-6 bg-gray-300 dark:bg-gray-700 rounded-full" />
      </div>

      {/* Content Container */}
      <div className="p-4 space-y-3">
        {/* Price Skeleton */}
        <div className="h-6 w-16 bg-gray-200 dark:bg-gray-800 rounded" />
        
        {/* Title Skeleton (Two lines) */}
        <div className="space-y-2">
          <div className="h-4 w-full bg-gray-200 dark:bg-gray-800 rounded" />
          <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-800 rounded" />
        </div>

        {/* Footer Skeleton */}
        <div className="flex items-center justify-between pt-2">
          {/* Rating Badge Skeleton */}
          <div className="h-8 w-16 bg-gray-200 dark:bg-gray-800 rounded-3xl" />
          {/* Cart Button Skeleton */}
          <div className="h-8 w-8 bg-gray-200 dark:bg-gray-800 rounded-full" />
        </div>
      </div>
    </div>
  );
};