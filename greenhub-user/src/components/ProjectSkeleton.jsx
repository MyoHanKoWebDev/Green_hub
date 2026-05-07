const ProjectSkeleton = () => {
  return (
    <div className="flex max-w-xl flex-col items-start justify-between bg-white p-5 rounded-[2rem] border border-gray-100 shadow-sm animate-pulse">
      {/* Date + Category Skeleton */}
      <div className="flex items-center gap-x-4 w-full">
        <div className="h-3 w-20 bg-gray-200 rounded-full"></div>
        <div className="h-6 w-24 bg-lime-100 rounded-full"></div>
      </div>

      {/* Media Skeleton */}
      <div className="mt-4 w-full rounded-2xl bg-gray-200 aspect-video"></div>

      {/* Title + Description Skeleton */}
      <div className="w-full">
        <div className="mt-4 h-6 w-3/4 bg-gray-200 rounded-lg"></div>
        <div className="mt-3 space-y-2">
          <div className="h-3 w-full bg-gray-100 rounded-md"></div>
          <div className="h-3 w-full bg-gray-100 rounded-md"></div>
          <div className="h-3 w-2/3 bg-gray-100 rounded-md"></div>
        </div>
      </div>

      {/* Author Skeleton */}
      <div className="mt-6 flex items-center gap-x-4 border-t border-gray-50 pt-4 w-full">
        <div className="size-10 rounded-full bg-gray-200"></div>
        <div className="space-y-2">
          <div className="h-3 w-24 bg-gray-200 rounded-md"></div>
          <div className="h-2 w-16 bg-gray-100 rounded-md"></div>
        </div>
      </div>
    </div>
  );
};

export default ProjectSkeleton;