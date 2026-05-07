import React from 'react'

export const DetailSkeleton = () => {
  return (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 animate-pulse">
    <div className="h-[450px] bg-gray-100 rounded-3xl" />
    <div className="space-y-10">
      <div className="h-6 w-1/2 bg-gray-100 rounded" />
      <div className="h-24 w-full bg-gray-100 rounded" />
      <div className="h-8 w-3/4 bg-gray-100 rounded" />
      <div className="h-12 w-32 bg-gray-100 rounded" />
      <div className="h-24 w-full bg-gray-100 rounded" />
    </div>
  </div>
  )
}
