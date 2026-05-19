import React from "react";

const ProfileSkeleton = () => {
  return (
    <div className="min-h-screen bg-gray-50 animate-pulse">
      <main className="space-y-8 max-w-7xl mx-auto">
        
        {/* 1. Header Card Skeleton */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Banner Skeleton */}
          <div className="h-32 bg-gray-200 w-full" />
          
          <div className="px-6 pb-6">
            <div className="flex flex-col md:flex-row items-end -mt-12 gap-6">
              {/* Avatar Skeleton */}
              <div className="w-36 h-36 rounded-2xl bg-gray-300 border-4 border-white shadow-lg" />

              <div className="flex-grow pb-2">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  <div className="space-y-3">
                    {/* Name Skeleton */}
                    <div className="h-8 w-64 bg-gray-200 rounded-lg" />
                    {/* Subtitle Skeleton */}
                    <div className="h-4 w-40 bg-gray-100 rounded-md" />
                  </div>
                  
                  {/* Integrated Stats Skeleton */}
                  <div className="flex items-center gap-10 lg:border-l lg:border-gray-100 lg:pl-10">
                    {[1, 2].map((i) => (
                      <div key={i} className="text-center space-y-2">
                        <div className="h-6 w-12 bg-gray-200 rounded mx-auto" />
                        <div className="h-3 w-16 bg-gray-100 rounded mx-auto" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Lower Info Bar Skeleton */}
            <div className="mt-8 pt-6 border-t border-gray-50 flex flex-wrap items-center justify-between gap-4">
               <div className="flex gap-6">
                  <div className="h-4 w-48 bg-gray-100 rounded-md" />
                  <div className="h-4 w-32 bg-gray-100 rounded-md" />
               </div>
            </div>
          </div>
        </div>

        {/* 2. Content Grid Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          
          {/* Main Feed Area Skeleton */}
          <div className="lg:col-span-3 space-y-6">
            {/* Tabs Skeleton */}
            <div className="flex gap-8 border-b border-gray-200 pb-4">
                <div className="h-4 w-24 bg-gray-200 rounded" />
                <div className="h-4 w-24 bg-gray-100 rounded" />
            </div>

            {/* Post Card Skeletons (Mimics your existing PostSkeleton) */}
            <div className="space-y-6">
              {[1, 2].map((i) => (
                <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 space-y-4">
                  <div className="flex gap-3">
                    <div className="w-12 h-12 rounded-full bg-gray-200" />
                    <div className="space-y-2">
                      <div className="h-4 w-32 bg-gray-200 rounded" />
                      <div className="h-3 w-20 bg-gray-100 rounded" />
                    </div>
                  </div>
                  <div className="h-20 w-full bg-gray-50 rounded-xl" />
                </div>
              ))}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default ProfileSkeleton;