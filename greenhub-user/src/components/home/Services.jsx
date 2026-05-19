import React from "react";
import { 
  UserPlusIcon, 
  ShoppingBagIcon, 
  GlobeAmericasIcon, 
  ChartBarIcon 
} from "@heroicons/react/24/outline";

const HowItWorks = () => {
  const steps = [
    {
      title: "Join the Community",
      desc: "Create your eco-profile and connect with like-minded environmental advocates in Myanmar.",
      icon: UserPlusIcon,
      bgColor: "bg-lime-100",
      iconColor: "text-lime-600",
    },
    {
      title: "Shop Sustainably",
      desc: "Browse our trusted marketplace for high-quality, verified eco-friendly products.",
      icon: ShoppingBagIcon,
      bgColor: "bg-emerald-100",
      iconColor: "text-emerald-600",
    },
    {
      title: "Support Local Projects",
      desc: "Every purchase contributes directly to local reforestation and waste management initiatives.",
      icon: GlobeAmericasIcon,
      bgColor: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      title: "Track Your Impact",
      desc: "Watch your personal 'Impact Score' grow as you contribute to a cleaner, greener future.",
      icon: ChartBarIcon,
      bgColor: "bg-yellow-100",
      iconColor: "text-yellow-600",
    },
  ];

  return (
    <section className="py-20 bg-lime-50 rounded-3xl dark:bg-gray-950 transition-colors duration-300">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-gray-900 dark:text-white">
            How <span className="text-lime-600">GreenHub</span> Works
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-xl max-w-2xl mx-auto font-light">
            Join the movement toward a sustainable Myanmar in four simple steps.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div
              key={index}
              className="p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 transition-all group 
                        hover:border-lime-500/30 hover:scale-105 hover:shadow-2xl 
                        bg-white dark:bg-gray-900"
            >
              <div
                className={`rounded-2xl w-14 h-14 flex items-center justify-center mb-6 
                          ${step.bgColor} dark:bg-opacity-10 transition-all group-hover:rotate-6`}
              >
                <step.icon className={`h-7 w-7 ${step.iconColor}`} />
              </div>
              
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-3">
                {step.title}
              </h3>
              
              <p className="text-gray-600 dark:text-gray-400 font-light leading-relaxed">
                {step.desc}
              </p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <button className="bg-lime-600 hover:bg-lime-700 text-white font-bold rounded-2xl px-10 py-4 shadow-lg shadow-lime-200 dark:shadow-none transition-all active:scale-95">
            Start Your Journey Today
          </button>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;