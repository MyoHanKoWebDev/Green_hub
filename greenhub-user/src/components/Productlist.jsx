import React from "react";

const products = [
  {
    id: 1,
    title: "Luxury Handcrafted Bamboo Furniture",
    desc: "Made by sustainable forest cooperatives, each piece supports reforestation and local artisans.",
    price: "$1,499.99",
    img: "../../public/images/BambooChair.jpg",
    delay: "0s",
  },
  {
    id: 2,
    title: "Solar-Powered Lantern from Community Projects",
    desc: "Made in collaboration with renewable energy initiatives, supporting rural electrification projects.",
    price: "$49.99",
    img: "../../public/images/SolarLatern.jpg",
    delay: "0.1s",
  },
  {
    id: 3,
    title: "Eco-Friendly Handcrafted Wooden Jewelry Box",
    desc: "Made from reclaimed wood by a community woodworking project, each piece is unique and sustainable.",
    price: "$399.99",
    img: "../../public/images/WoodenBox.jpg",
    delay: "0.2s",
  },
  {
    id: 4,
    title: "Eco-Friendly Reusable Water Bottle",
    desc: "Stainless steel, BPA-free bottle that keeps drinks hot or cold, reducing plastic waste.",
    price: "$29.99",
    img: "../../public/images/WaterBottle.jpg",
    delay: "0.3s",
  },
  {
    id: 5,
    title: "Plant-a-Tree Eco Kit",
    desc: "Each purchase plants a tree in deforested areas, contributing to reforestation projects worldwide.",
    price: "$29.99",
    img: "../../public/images/TreeKit.jpg",
    delay: "0.4s",
  },
  {
    id: 6,
    title: "Handcrafted Recycled Glass Chandelier",
    desc: "Each chandelier is made by a local artisan community using recycled glass, turning waste into luxurious decor.",
    price: "$1,199.99",
    img: "../../public/images/Candielier.jpg",
    delay: "0.5s",
  }
];

const Productlist = () => {
  return (
    <section className="px-4 bg-gray-50 dark:bg-gray-950">

      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {products.map((p) => (
          <article
            key={p.id}
            className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-xl 
             dark:border-gray-700  overflow-hidden transform transition 
            duration-300 hover:shadow-xl hover:-translate-y-1 opacity-0 animate-fadeIn"
            style={{ animationDelay: p.delay }}
          >
            <div className="relative overflow-hidden">
              <div className="overflow-hidden  border border-gray-300 rounded-3xl">
                <img
                src={p.img}
                alt={p.title}
                className="w-full h-56 object-cover transition-transform duration-300 hover:scale-105
               cursor-pointer"
              />
              </div>
              
              <span className="absolute top-2 right-2 bg-lime-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                OUTSTANDING
              </span>
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-1">{p.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">{p.desc}</p>

              <div className="mt-4 flex items-center justify-between bg-gray-200 rounded-2xl ps-3 overflow-hidden">
                <span className="text-md font-bold">{p.price}</span>
                <button className="p-2 hover:bg-lime-200 dark:hover:bg-gray-800 transition 
                rounded-2xl cursor-pointer">
                  🛒
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default Productlist;
