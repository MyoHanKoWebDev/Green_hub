import React from "react";
import Banner from "../components/Banner";
import Footer from "../components/Footer";
import Hero from "../components/Hero";
import Pricing from "../components/Pricing";
import Services from "../components/Services";

const Home = () => {
  return (
    <div>
        <Hero />
        <Services />
        <Banner />
        <Pricing />
        <Footer />
    </div>
  );
};

export default Home;
