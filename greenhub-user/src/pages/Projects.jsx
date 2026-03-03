import { useState } from "react";
import ProjectFeed from "../components/Projectfeed";
import Creatproject from "../components/Createproject";
import Heroimg from "../components/Heroimg";
import Footer from "../components/Footer";

const Projects = () => {
  const [showForm, setShowForm] = useState(false);
  return (
    <>
      <Heroimg
        title="Community Green Projects"
        desc=" Explore inspiring eco-projects created by members of our GreenHub
    community. From recycling innovations to local sustainability
    initiatives, discover ideas that make our planet cleaner and share your
    own to inspire others."
      />
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:col-span-3 space-y-6 pt-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Sustainable Community Projects
            </h2>
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-lime-500 text-white px-4 py-2 rounded-lg hover:bg-lime-600 transition"
            >
              Share Your Green Project
            </button>
          </div>
          {/* Smooth slide-down form */}
          <div
            className={`overflow-hidden transition-all duration-500 ease-in-out border
               border-slate-300 rounded-2xl shadow-lg ${
                 showForm ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
               }`}
          >
            <Creatproject />
          </div>
          <ProjectFeed />
        </div>
        {/* RightSidebar will go here later */}
      </div>
      <Footer />
    </>
  );
};

export default Projects;
