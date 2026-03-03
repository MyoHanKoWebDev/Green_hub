import React from "react";

const Hero = () => {
  return (
    <div>
      <div className="w-full max-w-[1400px] mx-auto bg-white rounded-xl overflow-hidden ">
        {/* <!-- Hero --> */}
        <section className="flex flex-col items-center text-center px-4 sm:px-6 lg:px-10 py-8 sm:py-12">
          {/* <!-- Rating avatars --> */}
          <div className="flex flex-col sm:flex-row items-center gap-3 mb-6 sm:mb-8">
            <div className="flex -space-x-2">
              <img
                src="https://randomuser.me/api/portraits/women/32.jpg"
                className="w-8 h-8 rounded-full border-3 border-white shadow-sm"
              />
              <img
                src="https://randomuser.me/api/portraits/men/22.jpg"
                className="w-8 h-8 rounded-full border-3 border-white shadow-sm"
              />
              <img
                src="https://randomuser.me/api/portraits/women/65.jpg"
                className="w-8 h-8 rounded-full border-3 border-white shadow-sm"
              />
              <img
                src="https://randomuser.me/api/portraits/men/41.jpg"
                className="w-8 h-8 rounded-full border-3 border-white shadow-sm"
              />
              <div className="w-8 h-8 rounded-full bg-lime-500 border-3 border-white shadow-sm flex items-center justify-center">
                <span className="text-white text-xs font-bold">+50K</span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <div className="flex gap-0.5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  data-lucide="star"
                  className="lucide lucide-star w-4 h-4 text-lime-400 fill-current"
                >
                  <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"></path>
                </svg>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  data-lucide="star"
                  className="lucide lucide-star w-4 h-4 text-lime-400 fill-current"
                >
                  <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"></path>
                </svg>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  data-lucide="star"
                  className="lucide lucide-star w-4 h-4 text-lime-400 fill-current"
                >
                  <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"></path>
                </svg>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  data-lucide="star"
                  className="lucide lucide-star w-4 h-4 text-lime-400 fill-current"
                >
                  <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"></path>
                </svg>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  data-lucide="star"
                  className="lucide lucide-star w-4 h-4 text-lime-400 fill-current"
                >
                  <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"></path>
                </svg>
              </div>
              <span className="text-xs sm:text-sm text-slate-600 ml-1">
                Trusted by 50,000+ families
              </span>
            </div>
          </div>

          <h1 className="max-w-4xl text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-slate-800 mb-4 sm:mb-6">
            Premium{" "}
            <span className="highlight font-bold text-lime-600">
              organic groceries
            </span>{" "}
            delivered to your doorstep in 30 minutes
          </h1>

          <p className="max-w-2xl text-base sm:text-lg text-slate-600 mb-8 sm:mb-10 leading-relaxed px-4">
            Experience the finest selection of farm-fresh produce, artisanal
            goods, and everyday essentials. From locally-sourced vegetables to
            gourmet ingredients, we bring quality directly to you.
          </p>

          {/* <!-- CTA buttons --> */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-12 sm:mb-16 w-full sm:w-auto">
            <a
              href="#"
              className="flex items-center justify-center gap-2 rounded-full bg-lime-500 text-white px-8 sm:px-10 py-3 sm:py-4 text-base font-semibold shadow-lg hover:bg-lime-600 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                data-lucide="smartphone"
                className="lucide lucide-smartphone w-5 h-5"
              >
                <rect width="14" height="20" x="5" y="2" rx="2" ry="2"></rect>
                <path d="M12 18h.01"></path>
              </svg>
              Get FreshCart App
            </a>
            <a
              href="#"
              className="flex items-center justify-center gap-2 rounded-full bg-white border-2 border-slate-200 text-slate-700 px-8 sm:px-10 py-3 sm:py-4 text-base font-semibold hover:bg-slate-50 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                data-lucide="play-circle"
                className="lucide lucide-play-circle w-5 h-5"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <polygon points="10 8 16 12 10 16 10 8"></polygon>
              </svg>
              Watch Demo
            </a>
          </div>

          {/* <!-- Hero media --> */}
          <div className="relative w-full">
            <img
              src="https://jbmsmartstart.in/wp-content/uploads/2023/09/vegetable-names.jpg"
              className="w-full max-w-5xl sm:rounded-2xl object-cover h-[250px] sm:h-[350px] lg:h-[400px] bg-cover rounded-xl mr-auto ml-auto shadow-2xl"
              alt="Premium grocery shopping experience"
            />

            {/* <!-- Subscription card --> */}
            <div className="absolute -left-2 sm:-left-4 lg:left-16 top-8 sm:top-20 sm:rounded-2xl sm:p-7 w-[180px] sm:w-[220px] text-left bg-white border-slate-100 border rounded-xl pt-4 pr-4 pb-4 pl-4 shadow-xl">
              <div className="flex items-center gap-2 sm:gap-3 sm:mb-4 text-left mb-3">
                <div className="w-8 sm:w-10 h-8 sm:h-10 bg-lime-500 rounded-lg sm:rounded-xl flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    data-lucide="repeat"
                    className="lucide lucide-repeat w-4 sm:w-5 h-4 sm:h-5 text-white"
                  >
                    <path d="m17 2 4 4-4 4"></path>
                    <path d="M3 11v-1a4 4 0 0 1 4-4h14"></path>
                    <path d="m7 22-4-4 4-4"></path>
                    <path d="M21 13v1a4 4 0 0 1-4 4H3"></path>
                  </svg>
                </div>
                <div className="">
                  <h3 className="text-xs sm:text-sm font-bold text-slate-800">
                    Smart Subscribe
                  </h3>
                  <p className="text-[10px] sm:text-xs text-slate-500">
                    by Madison Chen
                  </p>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-2 sm:mb-3">
                Never run out of essentials again. Our AI learns your shopping
                patterns.
              </p>
              <div className="flex items-center gap-2 text-[10px] sm:text-xs text-lime-600 font-medium">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  data-lucide="check-circle"
                  className="lucide lucide-check-circle w-3 sm:w-4 h-3 sm:h-4"
                >
                  <path d="M21.801 10A10 10 0 1 1 17 3.335"></path>
                  <path d="m9 11 3 3L22 4"></path>
                </svg>
                Save up to 25% monthly
              </div>
            </div>

            {/* <!-- Recipe card --> */}
            <div className="absolute -right-2 sm:-right-4 lg:right-16 top-16 sm:top-32 sm:rounded-2xl sm:p-7 w-[160px] sm:w-[200px] text-left bg-white border-slate-100 border rounded-xl pt-4 pr-4 pb-4 pl-4 shadow-xl">
              <div className="flex items-center justify-between mb-2 sm:mb-3">
                <span className="text-[9px] sm:text-xs uppercase text-slate-500 font-semibold tracking-wider">
                  Chef's Recipe
                </span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  data-lucide="chef-hat"
                  className="lucide lucide-chef-hat w-3 sm:w-4 h-3 sm:h-4 text-lime-500"
                >
                  <path d="M17 21a1 1 0 0 0 1-1v-5.35c0-.457.316-.844.727-1.041a4 4 0 0 0-2.134-7.589 5 5 0 0 0-9.186 0 4 4 0 0 0-2.134 7.588c.411.198.727.585.727 1.041V20a1 1 0 0 0 1 1Z"></path>
                  <path d="M6 17h12"></path>
                </svg>
              </div>
              <h3 className="text-sm sm:text-base font-bold text-slate-800 mb-1 sm:mb-2">
                Truffle Risotto Milano
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mb-3 sm:mb-4">
                8 ingredients • 45 min
              </p>
              <div className="flex items-center gap-1 sm:gap-2 mb-2 sm:mb-3">
                <img
                  src="https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&amp;fit=crop&amp;w=32&amp;q=60"
                  className="w-7 sm:w-9 h-7 sm:h-9 rounded-lg sm:rounded-xl object-cover"
                />
                <img
                  src="https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&amp;fit=crop&amp;w=32&amp;q=60"
                  className="w-7 sm:w-9 h-7 sm:h-9 rounded-lg sm:rounded-xl object-cover"
                />
                <span className="flex items-center justify-center w-7 sm:w-9 h-7 sm:h-9 rounded-lg sm:rounded-xl bg-slate-100 text-[10px] sm:text-xs text-slate-600 font-medium">
                  +6
                </span>
              </div>
              <div className="text-[10px] sm:text-xs text-lime-600 font-medium">
                All ingredients available
              </div>
            </div>

            {/* <!-- Enhanced search bar --> */}
            <div className="absolute left-1/2 -translate-x-1/2 -bottom-4 sm:bottom-12 w-[90%] sm:w-[280px] lg:w-[380px]">
              <div className="flex items-center bg-white shadow-2xl rounded-lg sm:rounded-2xl overflow-hidden px-3 sm:px-6 py-3 sm:py-4 border border-lime-100">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  data-lucide="search"
                  className="lucide lucide-search w-4 sm:w-5 h-4 sm:h-5 text-slate-400"
                >
                  <path d="m21 21-4.34-4.34"></path>
                  <circle cx="11" cy="11" r="8"></circle>
                </svg>
                <input
                  type="text"
                  placeholder="Search organic vegetables..."
                  className="w-full text-xs sm:text-sm border-0 focus:ring-0 placeholder-slate-400 px-2 sm:px-4 bg-transparent"
                />
                <button className="bg-lime-500 text-white p-2 rounded-lg sm:rounded-xl hover:bg-lime-600 transition-colors">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    data-lucide="arrow-right"
                    className="lucide lucide-arrow-right w-3 sm:w-4 h-3 sm:h-4"
                  >
                    <path d="M5 12h14"></path>
                    <path d="m12 5 7 7-7 7"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Hero;
