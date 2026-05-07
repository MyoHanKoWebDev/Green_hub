import { useState, useEffect } from "react";

export const useScrollDirection = () => {
  const [scrollDir, setScrollDir] = useState("up");

  useEffect(() => {
    let lastScrollY = window.pageYOffset;

    const updateScrollDirection = () => {
      const scrollY = window.pageYOffset;
      
      // Minimum displacement to trigger change (prevents flickering)
      if (Math.abs(scrollY - lastScrollY) < 10) {
        return;
      }

      const direction = scrollY > lastScrollY ? "down" : "up";
      if (direction !== scrollDir && (scrollY > 100 || direction === "up")) {
        setScrollDir(direction);
      }
      lastScrollY = scrollY > 0 ? scrollY : 0;
    };

    window.addEventListener("scroll", updateScrollDirection);
    return () => window.removeEventListener("scroll", updateScrollDirection);
  }, [scrollDir]);

  return scrollDir;
};