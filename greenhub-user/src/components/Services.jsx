import React from "react";

const Services = () => {
  return (
    <div className="my-14">
      <section className="py-24 bg-lime-100 transition-colors duration-300">
        <div className="container mx-auto px-6">
          {/* <!-- Section Header --> */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-black ">
              <span className="bg-clip-text text-black">Powerful features</span>
              for modern teams
            </h2>
            <p className="text-gray-700  text-xl max-w-2xl mx-auto font-extralight">
              Everything you need to connect, manage, and scale your global
              operations with unprecedented efficiency.
            </p>
          </div>

          {/* <!-- Features Grid --> */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* <!-- Feature Card Component -->
      <!-- You can reuse this and change icon/text per card -->
      <!-- Feature 1 --> */}
            <div
              className="p-8 rounded-xl border transition-all group 
         border-gray-200 hover:border-indigo-500/30 hover:scale-105 hover:shadow-xl 
        bg-white text-black"
            >
              <div
                className="rounded-lg w-12 h-12 flex items-center justify-center mb-6 
          bg-indigo-100 group-hover:bg-indigo-200 
          dark:bg-indigo-500/10 dark:group-hover:bg-indigo-500/20 transition-all"
              >
                <svg
                  className="h-6 w-6 text-indigo-500 dark:text-indigo-400"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M5 12h14M12 5l7 7-7 7"
                  ></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800  mb-3">
                Global Connectivity
              </h3>
              <p className="text-gray-600 font-light leading-relaxed">
                Connect teams across borders with real-time collaboration tools
                designed for distributed workforces.
              </p>
            </div>

            {/* <!-- Feature 2 --> */}
            <div
              className="p-8 rounded-xl border transition-all group 
         border-gray-200 hover:border-indigo-500/30 hover:scale-105 hover:shadow-xl 
        bg-white text-black"
            >
              <div
                className="rounded-lg w-12 h-12 flex items-center justify-center mb-6 
          bg-purple-100 group-hover:bg-purple-200 
          dark:bg-purple-500/10 dark:group-hover:bg-purple-500/20 transition-all"
              >
                <svg
                  className="h-6 w-6 text-purple-500 dark:text-purple-400"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  ></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800  mb-3">
                Intelligent Automation
              </h3>
              <p className="text-gray-600 font-light leading-relaxed">
                Streamline workflows with AI-powered automation that learns and
                adapts to your team's unique processes.
              </p>
            </div>

            {/* <!-- Feature 3 --> */}
            <div
              className="p-8 rounded-xl border transition-all group 
         border-gray-200 hover:border-indigo-500/30 hover:scale-105 hover:shadow-xl 
        bg-white text-black"
            >
              <div
                className="rounded-lg w-12 h-12 flex items-center justify-center mb-6 
          bg-blue-100 group-hover:bg-blue-200 
          dark:bg-blue-500/10 dark:group-hover:bg-blue-500/20 transition-all"
              >
                <svg
                  className="h-6 w-6 text-blue-500 dark:text-blue-400"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  ></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800  mb-3">
                Advanced Analytics
              </h3>
              <p className="text-gray-600 font-light leading-relaxed">
                Gain actionable insights with customizable dashboards that
                visualize your most important metrics.
              </p>
            </div>

            {/* <!-- Feature 4 --> */}
            <div
              className="p-8 rounded-xl border transition-all group 
         border-gray-200 hover:border-indigo-500/30 hover:scale-105 hover:shadow-xl 
        bg-white text-black"
            >
              <div
                className="rounded-lg w-12 h-12 flex items-center justify-center mb-6 
          bg-green-100 group-hover:bg-green-200 
          dark:bg-green-500/10 dark:group-hover:bg-green-500/20 transition-all"
              >
                <svg
                  className="h-6 w-6 text-green-500 dark:text-green-400"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  ></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800  mb-3">
                Enterprise Security
              </h3>
              <p className="text-gray-600 font-light leading-relaxed">
                Protect sensitive data with bank-level encryption and compliance
                frameworks that meet global standards.
              </p>
            </div>

            {/* <!-- Feature 5 --> */}
            <div
              className="p-8 rounded-xl border transition-all group 
         border-gray-200 hover:border-indigo-500/30 hover:scale-105 hover:shadow-xl 
        bg-white text-black"
            >
              <div
                className="rounded-lg w-12 h-12 flex items-center justify-center mb-6 
          bg-pink-100 group-hover:bg-pink-200 
          dark:bg-pink-500/10 dark:group-hover:bg-pink-500/20 transition-all"
              >
                <svg
                  className="h-6 w-6 text-pink-500 dark:text-pink-400"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  ></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800  mb-3">
                Team Collaboration
              </h3>
              <p className="text-gray-600 font-light leading-relaxed">
                Foster seamless teamwork with integrated communication tools,
                file sharing, and project management.
              </p>
            </div>

            {/* <!-- Feature 6 --> */}
            <div
              className="p-8 rounded-xl border transition-all group 
         border-gray-200 hover:border-indigo-500/30 hover:scale-105 hover:shadow-xl 
        bg-white text-black"
            >
              <div
                className="rounded-lg w-12 h-12 flex items-center justify-center mb-6 
          bg-amber-100 group-hover:bg-amber-200 
          dark:bg-amber-500/10 dark:group-hover:bg-amber-500/20 transition-all"
              >
                <svg
                  className="h-6 w-6 text-amber-500 dark:text-amber-400"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
                  ></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800  mb-3">
                Scalable Infrastructure
              </h3>
              <p className="text-gray-600 font-light leading-relaxed">
                Grow with confidence on a platform designed to handle
                enterprise-level demands with zero downtime.
              </p>
            </div>
          </div>

          {/* <!-- CTA --> */}
          <div className="mt-16 text-center">
            <button className="bg-gradient-to-r from-lime-500 to-lime-700 text-white font-light rounded-md px-8 py-3 hover:opacity-90 transition-all">
              Explore all features
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;
