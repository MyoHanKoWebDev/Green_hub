import React, { useState } from "react";

const MediaCarousel = ({ media }) => {
  const [index, setIndex] = useState(0);

  const next = () => setIndex((index + 1) % media.length);
  const prev = () => setIndex((index - 1 + media.length) % media.length);

  return (
    <div className="relative w-full">
      {/* Media Display */}
      <div className="w-full h-64 rounded-lg overflow-hidden">
        {media[index].type === "image" ? (
          <img
            src={media[index].url}
            className="w-full h-full object-cover"
            alt="project-media"
          />
        ) : (
          <video controls className="w-full h-full object-cover">
            <source src={media[index].url} type="video/mp4" />
          </video>
        )}
      </div>

      {/* Controls */}
      {media.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-gray-800/50 text-white p-2 rounded-full"
          >
            ‹
          </button>
          <button
            onClick={next}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-gray-800/50 text-white p-2 rounded-full"
          >
            ›
          </button>
        </>
      )}
    </div>
  );
};

export default MediaCarousel;
