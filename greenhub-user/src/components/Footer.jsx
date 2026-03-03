import React from "react";

const Footer = () => {
  return (
    <div>
      <footer className="pt-24 bg-gray-900 rounded-3xl">
        <div className="max-w-screen-xl mx-auto px-4 md:px-8">
          {/* Newsletter Section */}
          <div className="flex justify-between items-center gap-12 md:flex-row flex-col">
            <div className="flex-1 max-w-lg">
              <h3 className="text-white text-2xl font-bold">
                Join the GreenHub newsletter — stay updated on eco tips,
                products, and community projects.
              </h3>
            </div>

            <div className="flex items-center mt-6 md:mt-0 gap-4">
              <div className="relative w-full md:w-64">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full pl-4 pr-3 py-2 text-gray-700 bg-white outline-none border focus:border-lime-500 shadow-sm rounded-lg"
                />
              </div>
              <button className="py-3 px-4 font-medium text-sm text-center text-white bg-lime-600 hover:bg-lime-500 active:bg-lime-700 rounded-lg shadow">
                Subscribe
              </button>
            </div>
          </div>

          {/* Footer Navigation */}
          <div className="flex-1 mt-16 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 sm:gap-12">
            {/* Eco Resources */}
            <ul className="space-y-4 text-gray-300">
              <h4 className="text-gray-200 font-semibold sm:pb-2">
                Eco Resources
              </h4>
              <li><a className="hover:text-lime-400 duration-150" href="#">Contact Us</a></li>
              <li><a className="hover:text-lime-400 duration-150" href="#">Support Center</a></li>
              <li><a className="hover:text-lime-400 duration-150" href="#">Eco Knowledge Base</a></li>
              <li><a className="hover:text-lime-400 duration-150" href="#">Sustainability Blog</a></li>
            </ul>

            {/* GreenHub About */}
            <ul className="space-y-4 text-gray-300">
              <h4 className="text-gray-200 font-semibold sm:pb-2">About GreenHub</h4>
              <li><a className="hover:text-lime-400 duration-150" href="#">Our Mission</a></li>
              <li><a className="hover:text-lime-400 duration-150" href="#">Terms & Conditions</a></li>
              <li><a className="hover:text-lime-400 duration-150" href="#">Privacy Policy</a></li>
              <li><a className="hover:text-lime-400 duration-150" href="#">Why GreenHub?</a></li>
            </ul>

            {/* Explore Modules */}
            <ul className="space-y-4 text-gray-300">
              <h4 className="text-gray-200 font-semibold sm:pb-2">Explore</h4>
              <li><a className="hover:text-lime-400 duration-150" href="#">Eco Projects</a></li>
              <li><a className="hover:text-lime-400 duration-150" href="#">Community Posts</a></li>
              <li><a className="hover:text-lime-400 duration-150" href="#">Green Products</a></li>
              <li><a className="hover:text-lime-400 duration-150" href="#">User Stories</a></li>
            </ul>

            {/* Company / Team */}
            <ul className="space-y-4 text-gray-300">
              <h4 className="text-gray-200 font-semibold sm:pb-2">Our Community</h4>
              <li><a className="hover:text-lime-400 duration-150" href="#">Partners & NGOs</a></li>
              <li><a className="hover:text-lime-400 duration-150" href="#">Meet the Team</a></li>
              <li><a className="hover:text-lime-400 duration-150" href="#">Get Involved</a></li>
            </ul>
          </div>

          {/* Bottom Footer */}
          <div className="mt-10 py-10 border-t border-gray-700 flex items-center justify-between sm:justify-center sm:flex-row flex-col">
            <p className="text-gray-400">
              © 2025 GreenHub. Empowering a greener tomorrow.
            </p>

            <div className="flex items-center gap-x-6 text-gray-400 mt-6 sm:mt-0">
              <a href="#" className="hover:text-lime-400 duration-150">
                <i className="fa-brands fa-facebook-f text-xl"></i>
              </a>
              <a href="#" className="hover:text-lime-400 duration-150">
                <i className="fa-brands fa-instagram text-xl"></i>
              </a>
              <a href="#" className="hover:text-lime-400 duration-150">
                <i className="fa-brands fa-twitter text-xl"></i>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
