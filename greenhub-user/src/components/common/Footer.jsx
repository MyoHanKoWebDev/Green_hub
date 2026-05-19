import React, { useState } from "react";
import { Link } from "react-router-dom"; // Use Link for internal routing
import { toast } from "react-hot-toast";

const Footer = () => {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) return toast.error("Please enter an email");
    
    // Logic for newsletter API
    toast.success("Thanks for joining the movement!");
    setEmail("");
  };

  return (
    <div className="mt-10"> {/* Added margin top to separate from content */}
      <footer className="pt-24 bg-gray-900 rounded-t-[3rem]"> {/* Changed to rounded-t for better flow */}
        <div className="max-w-screen-xl mx-auto px-4 md:px-8">
          
          {/* Newsletter Section */}
          <div className="flex justify-between items-center gap-12 md:flex-row flex-col">
            <div className="flex-1 max-w-lg">
              <h3 className="text-white text-2xl font-bold">
                Join the GreenHub newsletter — stay updated on eco tips,
                products, and community projects.
              </h3>
            </div>

            <form onSubmit={handleSubscribe} className="flex items-center mt-6 md:mt-0 gap-4">
              <div className="relative w-full md:w-64">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full pl-4 pr-3 py-2 text-gray-700 bg-white outline-none border focus:border-lime-500 shadow-sm rounded-lg"
                  required
                />
              </div>
              <button 
                type="submit"
                className="py-3 px-4 font-medium text-sm text-center text-white bg-lime-600 hover:bg-lime-500 active:bg-lime-700 rounded-lg shadow transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>

          {/* Footer Navigation */}
          <div className="flex-1 mt-16 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 sm:gap-12">
            
            {/* Eco Resources */}
            <ul className="space-y-4 text-gray-400">
              <h4 className="text-gray-200 font-semibold sm:pb-2">Eco Resources</h4>
              <li><Link className="hover:text-lime-400 duration-150" to="/contact">Contact Us</Link></li>
              <li><Link className="hover:text-lime-400 duration-150" to="#">Support Center</Link></li>
              <li><Link className="hover:text-lime-400 duration-150" to="#">Knowledge Base</Link></li>
              <li><Link className="hover:text-lime-400 duration-150" to="/posts">Sustainability Blog</Link></li>
            </ul>

            {/* GreenHub About */}
            <ul className="space-y-4 text-gray-400">
              <h4 className="text-gray-200 font-semibold sm:pb-2">About GreenHub</h4>
              <li><Link className="hover:text-lime-400 duration-150" to="/about">Our Mission</Link></li>
              <li><Link className="hover:text-lime-400 duration-150" to="#">Terms & Conditions</Link></li>
              <li><Link className="hover:text-lime-400 duration-150" to="#">Privacy Policy</Link></li>
              <li><Link className="hover:text-lime-400 duration-150" to="/about">Why GreenHub?</Link></li>
            </ul>

            {/* Explore Modules */}
            <ul className="space-y-4 text-gray-400">
              <h4 className="text-gray-200 font-semibold sm:pb-2">Explore</h4>
              <li><Link className="hover:text-lime-400 duration-150" to="/projects">Eco Projects</Link></li>
              <li><Link className="hover:text-lime-400 duration-150" to="/posts">Community Posts</Link></li>
              <li><Link className="hover:text-lime-400 duration-150" to="/products">Green Products</Link></li>
              <li><Link className="hover:text-lime-400 duration-150" to="#">User Stories</Link></li>
            </ul>

            {/* Community */}
            <ul className="space-y-4 text-gray-400">
              <h4 className="text-gray-200 font-semibold sm:pb-2">Our Community</h4>
              <li><Link className="hover:text-lime-400 duration-150" to="#">Partners & NGOs</Link></li>
              <li><Link className="hover:text-lime-400 duration-150" to="/about">Meet the Team</Link></li>
              <li><Link className="hover:text-lime-400 duration-150" to="/signup">Get Involved</Link></li>
            </ul>
          </div>

          {/* Bottom Footer */}
          <div className="mt-10 py-10 border-t border-gray-800 flex items-center justify-between sm:flex-row flex-col gap-4 text-center">
            <p className="text-gray-500 text-sm">
              © 2026 GreenHub. Empowering a greener Myanmar.
            </p>

            <div className="flex items-center gap-x-6 text-gray-400">
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="hover:text-lime-400 duration-150">
                <i className="fa-brands fa-facebook-f text-xl"></i>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-lime-400 duration-150">
                <i className="fa-brands fa-instagram text-xl"></i>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="hover:text-lime-400 duration-150">
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