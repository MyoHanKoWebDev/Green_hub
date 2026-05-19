import React from "react";

const PostSkeleton = () => {
  return (
    <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm space-y-5 animate-pulse w-full">
      
      {/* Header Skeleton */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gray-200" /> {/* Avatar */}
          <div className="space-y-2">
            <div className="h-4 w-32 bg-gray-200 rounded" /> {/* Name */}
            <div className="h-3 w-20 bg-gray-100 rounded" /> {/* Meta info */}
          </div>
        </div>
        <div className="w-6 h-6 bg-gray-100 rounded" /> {/* Options icon */}
      </div>

      {/* Content Skeleton */}
      <div className="space-y-2">
        <div className="h-3 w-full bg-gray-100 rounded" />
        <div className="h-3 w-full bg-gray-100 rounded" />
        <div className="h-3 w-2/3 bg-gray-100 rounded" />
      </div>

      {/* Media Skeleton (simulating a 2-image grid) */}
      <div className="grid grid-cols-1 gap-3">
        <div className="h-60 bg-gray-200 rounded-2xl w-full" />
      </div>

      {/* Footer Skeleton */}
      <div className="border-t border-gray-50 pt-4 flex items-center justify-between">
        <div className="flex gap-6">
          <div className="h-8 w-16 bg-gray-100 rounded-xl" /> {/* Like button */}
          <div className="h-8 w-16 bg-gray-100 rounded-xl" /> {/* Comment button */}
        </div>
        <div className="h-8 w-8 bg-gray-100 rounded-xl" /> {/* Save button */}
      </div>
    </div>
  );
};

export default PostSkeleton;