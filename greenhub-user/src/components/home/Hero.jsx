import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowRight, FaLeaf, FaSeedling, FaGlobe } from 'react-icons/fa';

const Hero = () => {
  const navigate = useNavigate();

  return (
    <div className="relative bg-white dark:bg-gray-950 overflow-hidden">
      {/* Decorative Background Blobs */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-lime-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
      <div className="absolute top-0 -right-4 w-72 h-72 bg-emerald-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
      
      <div className="container mx-auto px-4 pt-10 pb-16 lg:pt-12 lg:pb-14 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          
          {/* Text Content */}
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-lime-100 dark:bg-lime-900/30 text-lime-700 dark:text-lime-400 text-sm font-bold mb-6">
              <FaSeedling />
              <span>Myanmar's #1 Eco-Community</span>
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-black text-slate-900 dark:text-white leading-[1.1] mb-6">
              Small Acts, <br />
              <span className="text-lime-600">Big Impact.</span>
            </h1>
            
            <p className="text-lg text-slate-600 dark:text-slate-400 mb-10 max-w-xl mx-auto lg:mx-0">
              Join GreenHub to discover sustainable projects, learn eco-friendly habits, 
              and shop for green products. Together, we’re building a cleaner Myanmar.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <button 
                onClick={() => navigate('/posts')}
                className="group flex items-center gap-2 bg-slate-900 dark:bg-lime-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-slate-800 dark:hover:bg-lime-500 transition-all shadow-xl shadow-slate-200 dark:shadow-none"
              >
                Explore Feed
                <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
              </button>
              
              <button 
                onClick={() => navigate('/about')}
                className="px-8 py-4 rounded-2xl font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
              >
                Learn Our Story
              </button>
            </div>

            {/* Quick Stats */}
            <div className="mt-12 flex items-center justify-center lg:justify-start gap-8 text-slate-500 dark:text-slate-400">
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-slate-900 dark:text-white">10k+</span>
                <span className="text-xs uppercase tracking-wider">Members</span>
              </div>
              <div className="w-px h-8 bg-slate-200 dark:bg-slate-800" />
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-slate-900 dark:text-white">500+</span>
                <span className="text-xs uppercase tracking-wider">Projects</span>
              </div>
            </div>
          </div>

          {/* Visual Side */}
          <div className="flex-1 relative">
            <div className="relative z-10 w-full max-w-lg mx-auto">
              {/* Main Image */}
              <img 
                src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=800"
                alt="Eco Future" 
                className="rounded-[3rem] h-80 shadow-2xl border-8 border-white "
              />
              
              {/* Floating Card 1 */}
              <div className="absolute -bottom-6 -left-6 bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-xl flex items-center gap-4 animate-bounce-slow">
                <div className="w-10 h-10 bg-lime-100 text-lime-600 rounded-full flex items-center justify-center">
                  <FaLeaf />
                </div>
                <div>
                  <p className="text-xs text-slate-500">Trees Planted</p>
                  <p className="font-bold dark:text-white">+1,240</p>
                </div>
              </div>

              {/* Floating Card 2 */}
              <div className="absolute top-10 -right-6 bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-xl hidden sm:flex items-center gap-4 animate-bounce-slow animation-delay-1000">
                <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
                  <FaGlobe />
                </div>
                <div>
                  <p className="text-xs text-slate-500">Impact Score</p>
                  <p className="font-bold dark:text-white">98.4%</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Hero;