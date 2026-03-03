import React from "react";
import MediaCarousel from "./Mediacarousel";

const ProjectCard = ({ post }) => {
  return (
    <article className="flex max-w-xl flex-col items-start justify-between
     bg-white p-5 rounded-xl shadow hover:shadow-lg transition">

      {/* Date + Category */}
      <div className="flex items-center gap-x-4 text-xs">
        <time className="text-gray-500">{post.date}</time>

        <span className="relative z-10 rounded-full bg-green-50 px-3 py-1.5 font-medium text-green-700">
          {post.category}
        </span>
      </div>

      {/* Media */}
      {post.media?.length > 0 && (
        <div className="mt-4 w-full">
          <MediaCarousel media={post.media} />
        </div>
      )}

      {/* Title + Description */}
      <div className="group relative grow">
        <h3 className="mt-4 text-lg font-semibold text-gray-900 group-hover:text-gray-600">
          {post.title}
        </h3>
        <p className="mt-3 text-sm text-gray-600 line-clamp-3">
          {post.description}
        </p>
      </div>

      {/* Author */}
      <div className="relative mt-6 flex items-center gap-x-4">
        <img
          src={post.author.avatar}
          alt=""
          className="size-10 rounded-full bg-gray-50"
        />
        <div className="text-sm">
          <p className="font-semibold text-gray-900">{post.author.name}</p>
          <p className="text-gray-600">{post.author.role}</p>
        </div>
      </div>
    </article>
  );
};

export default ProjectCard;
