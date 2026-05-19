import React from "react";
import { FaLeaf, FaUsers, FaGlobeAmericas, FaSeedling } from "react-icons/fa";
import Footer from "../components/common/Footer";
import { useNavigate } from "react-router-dom";

const About = () => {
  const navigate = useNavigate();
  const stats = [
    { label: "Active Members", value: "10K+", icon: <FaUsers /> },
    { label: "Trees Planted", value: "25K+", icon: <FaLeaf /> },
    { label: "Projects Funded", value: "150+", icon: <FaSeedling /> },
    { label: "Global Reach", value: "45+", icon: <FaGlobeAmericas /> },
  ];

  return (
    <div className="bg-white dark:bg-gray-950">
      {/* --- HERO SECTION --- */}
      <section className="relative py-20 overflow-hidden bg-lime-50 dark:bg-lime-900/10 rounded-3xl">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-lime-200/20 rounded-l-full blur-3xl" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <span className="text-lime-600 font-bold tracking-widest uppercase text-sm">
              Our Story
            </span>
            <h1 className="mt-4 text-5xl md:text-6xl font-extrabold text-slate-900 dark:text-white leading-tight">
              Rooting for a <span className="text-lime-600">Greener</span>{" "}
              Tomorrow.
            </h1>
            <p className="mt-6 text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
              GreenHub started as a small community of nature enthusiasts in
              Mandalay. Today, it’s a global platform where innovators,
              environmentalists, and everyday heroes connect to share
              sustainable projects and eco-friendly solutions.
            </p>
          </div>
        </div>
      </section>

      {/* --- OUR EVOLUTION SECTION --- */}
      <section className="py-20 bg-white dark:bg-gray-950">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">
              From Tradition to Digital Innovation
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-lg">
              Originally founded by{" "}
              <span className="font-semibold text-lime-600">
                GreenTech Co. Ltd
              </span>{" "}
              in Mandalay, we spent years using workshops and printed materials
              to fight deforestation and waste. But we realized that to save our
              environment, we had to move as fast as the world does.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Problem 1: Scalability */}
            <div className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
              <div className="w-12 h-12 bg-lime-500 text-white rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-lime-200">
                <FaGlobeAmericas />
              </div>
              <h3 className="text-xl font-bold mb-3 dark:text-white">
                Beyond Boundaries
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                Physical workshops only reach a few. GreenHub scales
                environmental education to every corner of Myanmar instantly.
              </p>
            </div>

            {/* Problem 2: Engagement */}
            <div className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
              <div className="w-12 h-12 bg-lime-500 text-white rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-lime-200">
                <FaUsers />
              </div>
              <h3 className="text-xl font-bold mb-3 dark:text-white">
                Engaging the Youth
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                We’ve moved past printed flyers to build a digital community
                where the younger generation can lead the green movement.
              </p>
            </div>

            {/* Problem 3: Marketplace */}
            <div className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
              <div className="w-12 h-12 bg-lime-500 text-white rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-lime-200">
                <FaSeedling />
              </div>
              <h3 className="text-xl font-bold mb-3 dark:text-white">
                Trusted Marketplace
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                Closing the gap between wanting to be green and finding the
                right products. Our marketplace makes sustainability accessible.
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* --- OUR MISSION --- */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                alt="Green environment"
                className="rounded-3xl shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-500"
              />
              <div className="absolute -bottom-6 -right-6 bg-lime-600 p-8 rounded-2xl hidden md:block">
                <p className="text-white font-medium italic">
                  "The best time to plant a tree was 20 years ago. The second
                  best time is now."
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">
                Why GreenHub?
              </h2>
              <div className="space-y-6">
                {[
                  {
                    title: "Eco-Innovation",
                    desc: "Supporting technology that reduces our carbon footprint.",
                  },
                  {
                    title: "Global Community",
                    desc: "Connecting like-minded individuals to share knowledge and resources.",
                  },
                  {
                    title: "Transparency",
                    desc: "Tracking every dollar and every seedling to ensure maximum impact.",
                  },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-12 h-12 shrink-0 bg-lime-100 dark:bg-lime-900/30 rounded-full flex items-center justify-center text-lime-600 font-bold">
                      0{i + 1}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-white">
                        {item.title}
                      </h3>
                      <p className="text-slate-600 dark:text-slate-400">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      
      {/* --- STATS COUNTER --- */}
      <section className="py-12 bg-white dark:bg-gray-900 border-y border-slate-100 dark:border-slate-800">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, idx) => (
              <div key={idx} className="text-center group">
                <div className="text-lime-600 text-3xl mb-2 flex justify-center group-hover:scale-110 transition-transform">
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold text-slate-900 dark:text-white">
                  {stat.value}
                </div>
                <div className="text-sm text-slate-500 uppercase tracking-wide">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* --- CTA --- */}
      <section className="py-20 container mx-auto px-4">
        <div className="bg-slate-900 rounded-[3rem] p-12 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/leaf.png')]" />
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Ready to make an impact?
          </h2>
          <p className="text-slate-300 mb-8 max-w-xl mx-auto">
            Join the GreenHub movement today. Start sharing your eco-projects or
            support others in the community.
          </p>
          <button type="button" onClick={() => navigate('/signin')}
           className="relative z-20 bg-lime-500 text-slate-900 px-8 py-4 rounded-full font-bold hover:bg-lime-400 transition-colors cursor-pointer">
            Get Started for Free
          </button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
