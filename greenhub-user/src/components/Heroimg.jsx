import React from "react";

const Heroimg = ({title,desc}) => {
  return (
    <div className="relative min-h-[500px] flex items-center text-white px-4 sm:px-8 md:px-12 z-0">
      <div className="absolute inset-0 ">
        <img
        src="https://images.unsplash.com/photo-1663427929917-333d88949f7a?q=80&w=1932&auto=format&fit=crop"
        //src="../../public/images/Green1.jpg"
          alt="Earth from space"
          className="w-full h-full object-cover object-center rounded-3xl overflow-hidden"
        />
        <div className="absolute inset-0"></div>
      </div>
      <div className="relative z-10 mx-auto text-center px-4">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
          <span className="bg-gradient-to-r from-lime-500 to-lime-200 text-transparent bg-clip-text">
            {title}
          </span>
          {/* <span className="bg-gradient-to-r from-lime-200 to-lime-500 text-transparent bg-clip-text">
            {" "}
            Products
          </span> */}
        </h1>

        <p className="mt-4 text-base sm:text-lg text-gray-300 max-w-2xl mx-auto">
          {desc}
        </p>
      </div>
    </div>
  );
};

export default Heroimg;
