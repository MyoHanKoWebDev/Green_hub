import React from "react";

const Banner = () => {
  return (
    <div>
      <section className="overflow-hidden sm:grid sm:grid-cols-2 sm:items-center bg-white">
        <div className="p-8 md:p-12 lg:px-16 lg:py-24">
          <div className="mx-auto max-w-xl text-center ltr:sm:text-left rtl:sm:text-right">
            <h2 className="text-2xl font-bold text-gray-900 md:text-3xl ">
              Lorem, ipsum dolor sit amet consectetur adipisicing elit
            </h2>

            <p className="hidden text-gray-500 md:mt-4 md:block ">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Et,
              egestas tempus tellus etiam sed. Quam a scelerisque amet
              ullamcorper eu enim et fermentum, augue. Aliquet amet volutpat
              quisque ut interdum tincidunt duis.
            </p>

            <div className="mt-4 md:mt-8">
              <a
                href="#"
                className="inline-block rounded-sm bg-lime-600 px-12 py-3 text-sm font-medium text-white transition hover:bg-lime-700 focus:ring-3 focus:ring-yellow-400 focus:outline-hidden"
              >
                Get Started Today
              </a>
            </div>
          </div>
        </div>

        <img
          alt=""
          src="https://i.nextmedia.com.au/Utils/ImageResizer.ashx?n=https%3A%2F%2Fi.nextmedia.com.au%2FNews%2F20241217020443_How-to-eat-more-vegetables.jpg&h=630&w=1120&c=1&s=1"
          className="h-full w-full object-cover sm:h-[calc(100%_-_2rem)] sm:self-end sm:rounded-ss-[30px] md:h-[calc(100%_-_4rem)] md:rounded-ss-[60px]"
        />
      </section>
    </div>
  );
};

export default Banner;
