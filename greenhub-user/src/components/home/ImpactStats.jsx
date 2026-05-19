import React from 'react';
// Stick to the 20/solid path since you already have it installed and working
import { 
  UsersIcon, 
  GlobeAsiaAustraliaIcon, 
  SparklesIcon 
} from "@heroicons/react/20/solid";

const ImpactStats = () => {
  const stats = [
    { 
      id: 1, 
      label: "Community Members", 
      value: "10,000+", 
      icon: UsersIcon, 
      color: "bg-blue-50 text-blue-600 dark:bg-blue-900/20" 
    },
    { 
      id: 2, 
      label: "Trees Planted", 
      value: "12,400", 
      icon: GlobeAsiaAustraliaIcon, // This fits the Myanmar/Global eco vibe
      color: "bg-lime-50 text-lime-600 dark:bg-lime-900/20" 
    },
    { 
      id: 3, 
      label: "Waste Reduced", 
      value: "8.5 Tons", 
      icon: SparklesIcon, // Represents "Cleanliness"
      color: "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20" 
    },
  ];

  return (
    <section className="pb-15 bg-white dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((stat) => (
            <div 
              key={stat.id} 
              className="flex flex-col items-center p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 hover:shadow-xl transition-all duration-300 group"
            >
              <div className={`p-4 rounded-2xl ${stat.color} mb-6 group-hover:scale-110 transition-transform`}>
                <stat.icon className="h-8 w-8" />
              </div>
              <h3 className="text-4xl font-black text-gray-900 dark:text-white mb-2">
                {stat.value}
              </h3>
              <p className="text-gray-500 dark:text-gray-400 font-medium uppercase tracking-widest text-xs">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ImpactStats;