import React, { useEffect, useState } from "react";
import { FaChevronDown } from "react-icons/fa";

const LanguageSwitcher = () => {
  const [currentLang, setCurrentLang] = useState("en");

  useEffect(() => {
    // Initialize Google Translate Script once
    if (!window.googleTranslateElementInit) {
      window.googleTranslateElementInit = () => {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: "en",
            includedLanguages: "en,my",
            autoDisplay: false,
            layout: window.google.translate.TranslateElement.InlineLayout.HORIZONTAL,
          },
          "google_translate_element"
        );
      };

      const addScript = document.createElement("script");
      addScript.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      addScript.async = true;
      document.body.appendChild(addScript);
    }
  }, []);

  const changeLanguage = (langCode) => {
    setCurrentLang(langCode);

    const triggerGoogle = () => {
      const googleCombo = document.querySelector(".goog-te-combo");
      if (googleCombo) {
        googleCombo.value = langCode;
        googleCombo.dispatchEvent(new Event("change", { bubbles: true }));
      } else {
        console.warn("Google Translate still loading... retrying");
        setTimeout(triggerGoogle, 500);
      }
    };

    triggerGoogle();

    // Force style cleanup when switching back to English
    if (langCode === "en") {
      document.documentElement.classList.remove("translated-ltr");
      document.body.style.top = "0px";
      
      // Attempt to click Google's internal "Show Original" if bar exists
      const clearBtn = document.querySelector('iframe.goog-te-banner-frame')?.contentDocument?.querySelector('.goog-te-button button');
      if (clearBtn) clearBtn.click();
    }
  };

  return (
    <div className="relative flex items-center group">
      {/* Hidden Google Container - Must be opacity-0, not display:none */}
      <div 
        id="google_translate_element" 
        className="absolute opacity-0 pointer-events-none"
        style={{ width: 0, height: 0, overflow: "hidden" }}
      ></div>

      {/* CUSTOM UI - Added 'notranslate' to prevent 'EN' becoming 'IN' */}
      <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-full px-4 py-2 shadow-sm hover:border-lime-400 transition-all cursor-pointer relative notranslate">
        <img 
          src={currentLang === "en" ? "https://flagcdn.com/w40/us.png" : "https://flagcdn.com/w40/mm.png"} 
          alt="flag" 
          className="w-5 h-3.5 object-cover rounded-sm"
        />
        <span className="text-sm font-bold text-slate-700 uppercase">{currentLang}</span>
        <FaChevronDown className="w-2.5 h-2.5 text-slate-400 ml-1" />

        {/* INVISIBLE SELECT OVERLAY */}
        <select 
          onChange={(e) => changeLanguage(e.target.value)}
          value={currentLang}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
        >
          <option value="en">English</option>
          <option value="my">Myanmar</option>
        </select>
      </div>
    </div>
  );
};

export default LanguageSwitcher;