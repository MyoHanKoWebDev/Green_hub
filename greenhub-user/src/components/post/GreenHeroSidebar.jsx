import React, { useState, useEffect } from "react";
import axios from "../../../api/axios";
import { ChevronRightIcon } from "@heroicons/react/20/solid";
import { TrophyIcon, StarIcon } from "@heroicons/react/24/outline";
import { getImageUrl } from "../../utils/getImageUrl"; // Use your existing util
import { useNavigate } from "react-router-dom";

const GreenHeroSidebar = () => {
  const [heroes, setHeroes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchHeroes();
  }, []);

  const fetchHeroes = async () => {
    try {
      const res = await axios.get("/api/user/posts/green-heroes");
      if (res.data.status) {
        setHeroes(res.data.data);
      }
    } catch (err) {
      console.error("Failed to load leaders");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
      {/* Title */}
      <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-5">
        <div className="p-3 bg-lime-100 rounded-2xl">
          <TrophyIcon className="w-7 h-7 text-lime-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Green Heroes</h2>
          <p className="text-sm text-gray-500">Most liked Eco-warriors</p>
        </div>
      </div>

      {/* Hero List */}
      <div className="space-y-4">
        {loading ? (
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 bg-gray-100 rounded-xl" />
            ))}
          </div>
        ) : (
          heroes
            .filter((hero) => (hero.reacts_count || 0) > 10) // Only show if count > 10
            .map((hero, index) => (
              <div
                key={hero.id}
                className="flex items-center justify-between group cursor-pointer hover:bg-gray-50 p-2 rounded-xl transition"
              >
                <div className="flex items-center gap-3.5">
                  <div className="relative">
                    <img
                      onClick={()=>navigate(`/user/${hero.id}`)}
                      src={getImageUrl(hero.proImg)}
                      alt={hero.name}
                      className="w-11 h-11 rounded-full object-cover border border-gray-100"
                    />
                    <span className="absolute -top-1 -left-1 w-5 h-5 bg-lime-500 text-white text-[10px] flex items-center justify-center rounded-full border-2 border-white font-bold">
                      {index + 1}
                    </span>
                  </div>

                  <div>
                    <p className="text-sm font-bold text-gray-900 leading-tight group-hover:text-lime-700">
                      {hero.name}
                    </p>
                    <span className="flex items-center gap-1 text-[10px] uppercase font-bold tracking-widest text-lime-600">
                      <StarIcon className="w-3 h-3" />
                      Eco Member
                    </span>
                  </div>
                </div>
                <span className="text-xs font-bold text-gray-500 px-2 py-1 bg-gray-50 rounded-lg group-hover:bg-lime-50 group-hover:text-lime-700">
                  {hero.reacts_count || 0} ❤️
                </span>
              </div>
            ))
        )}

        {/* Show empty state if no one is above 10 */}
        {heroes.filter((h) => (h.reacts_count || 0) > 10).length === 0 &&
          !loading && (
            <p className="text-center text-gray-400 py-10 text-sm italic">
              No heroes have reached 10 XP yet!
            </p>
          )}
      </div>
    </div>
  );
};

export default GreenHeroSidebar;
