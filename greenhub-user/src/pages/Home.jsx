import React from "react";
import Banner from "../components/home/Banner";
import Footer from "../components/common/Footer";
import Hero from "../components/home/Hero";
import Services from "../components/home/Services";
import { FaRocket, FaStore, FaHandHoldingHeart } from 'react-icons/fa';
import HomePopularProducts from "../components/home/HomePopularProduct";
import ImpactStats from "../components/home/ImpactStats";

const Home = () => {
  return (
    <div className="bg-gray-50 dark:bg-gray-950 min-h-screen">
      {/* 1. THE HOOK: Grab attention immediately */}
      <Hero /> 
      
      {/* 2. THE PROOF: Show that the community is real before asking for anything */}
      <ImpactStats />

      {/* 3. THE EDUCATION: Explain how the platform works */}
      <Services />

      {/* 4. THE ACTION: Show the highest-rated products people can buy */}
      <HomePopularProducts /> 

      {/* 5. THE MISSION: Break the grid with a big image/message banner */}
      <Banner />

      {/* 6. THE CLOSURE: Standard footer */}
      <Footer />
    </div>
  );
};

export default Home;
