import React from "react";
import { Link } from "react-router-dom";

const Banner = () => {
  return (
    <div className="py-12 bg-gray-50 dark:bg-gray-950">
      <section className="overflow-hidden sm:grid sm:grid-cols-2 sm:items-center bg-white dark:bg-gray-900 mx-4 lg:mx-6 rounded-[3rem] shadow-sm">
        <div className="p-8 md:p-12 lg:px-16 lg:py-24">
          <div className="mx-auto max-w-xl text-center ltr:sm:text-left rtl:sm:text-right sm:text-left">
            <h2 className="text-3xl font-black text-gray-900 dark:text-white md:text-4xl">
              Small Steps, <span className="text-lime-600">Big Impact</span> for
              Myanmar
            </h2>

            <p className="text-gray-500 dark:text-gray-400 md:mt-6 md:block leading-relaxed">
              Every eco-friendly choice you make helps preserve our natural
              landscapes, from the Inle Lake to the Ayeyarwady Delta. Join a
              community committed to reducing plastic waste and supporting local
              green innovation.
            </p>

            <div className="mt-8">
              <Link
                to="/about"
                className="inline-block rounded-2xl bg-lime-600 px-12 py-4 text-sm font-bold text-white transition hover:bg-lime-700 active:scale-95 shadow-lg shadow-lime-200 dark:shadow-none"
              >
                Our Environmental Mission
              </Link>
            </div>
          </div>
        </div>

        <img
          alt="Sustainable Growth"
          src="../../public/images/image.png"
          className="h-full w-full object-cover sm:self-end sm:rounded-ss-[60px] md:rounded-ss-[100px]"
        />
      </section>
    </div>
  );
};

export default Banner;
