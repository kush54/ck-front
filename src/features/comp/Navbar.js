import React, { useState } from "react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const [language, setLanguage] = useState("en"); // Default language is English
  
    const handleLanguageChange = (lang) => {
      setLanguage(lang);
    };

  const translate = (key) => {
    const translations = {
      en: {
        heroTitle: "Empower Your Creativity with Creators Kit",
        heroSubtitle:
          "AI-powered tools to bring your content ideas to life—fast and efficiently.",
        getStarted: "Get Started Now",
        whyChooseUs: "Why Choose Us?",
        whyChooseUsDesc:
          "Discover the features that make Creators Kit the ultimate choice for content creators.",
        tutorials: "Tutorials",
        tutorialsDesc: "Step-by-step guides to help you make the most of Creators Kit.",
        pricing: "Our Pricing Plans",
        pricingDesc: "Flexible pricing options to suit creators of all levels.",
        contact: "Contact",
      },
      hi: {
        heroTitle: "अपनी रचनात्मकता को Creators Kit के साथ सशक्त बनाएं",
        heroSubtitle:
          "AI-समर्थित उपकरणों के साथ अपनी सामग्री विचारों को जीवन में लाएं—त्वरित और प्रभावी रूप से।",
        getStarted: "अब शुरू करें",
        whyChooseUs: "हमारा चयन क्यों करें?",
        whyChooseUsDesc:
          "वो विशेषताएँ खोजें जो Creators Kit को कंटेंट क्रिएटर्स के लिए सबसे अच्छा बनाती हैं।",
        tutorials: "ट्यूटोरियल्स",
        tutorialsDesc:
          "Creators Kit का अधिकतम लाभ उठाने में मदद करने के लिए चरण-दर-चरण मार्गदर्शिकाएँ।",
        pricing: "हमारी मूल्य निर्धारण योजनाएं",
        pricingDesc:
          "सभी स्तरों के क्रिएटर्स के लिए लचीली मूल्य निर्धारण विकल्प।",
        contact: "संपर्क करें",
      },
    };

    return translations[language][key] || key;
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-gray-900 text-white shadow-lg z-50 transition-transform transform hover:scale-100 hover:bg-gray-800 duration-300 ease-in-out">
      <div className="container mx-auto flex justify-between items-center px-6 py-4">
        <div className="text-3xl font-bold text-yellow-400 hover:text-yellow-600 transition-all duration-300">
          CK
        </div>

        {/* Hamburger Menu for Mobile */}
        <button
          onClick={handleMenuToggle}
          className="lg:hidden text-yellow-400 hover:text-yellow-600 focus:outline-none"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
            ></path>
          </svg>
        </button>

        {/* Navigation Links */}
        <div
          className={`lg:flex lg:space-x-8 text-lg font-medium absolute lg:static top-16 left-0 w-full lg:w-auto bg-gray-900 lg:bg-transparent transform lg:transform-none ${
            isMenuOpen ? "block" : "hidden"
          }`}
        >
          <a
            href="/get-started"
            className="block lg:inline-block py-2 px-4 lg:py-0 hover:text-yellow-400 transition-all transform hover:scale-100 duration-300"
          >
            {translate("getStarted")}
          </a>
          <a
            href="#features"
            className="block lg:inline-block py-2 px-4 lg:py-0 hover:text-yellow-400 transition-all transform hover:scale-100 duration-300"
          >
            {translate("whyChooseUs")}
          </a>
          <a
            href="#tutorials"
            className="block lg:inline-block py-2 px-4 lg:py-0 hover:text-yellow-400 transition-all transform hover:scale-100 duration-300"
          >
            {translate("tutorials")}
          </a>
          <a
            href="#pricing"
            className="block lg:inline-block py-2 px-4 lg:py-0 hover:text-yellow-400 transition-all transform hover:scale-100 duration-300"
          >
            {translate("pricing")}
          </a>
          <a
            href="#footer"
            className="block lg:inline-block py-2 px-4 lg:py-0 hover:text-yellow-400 transition-all transform hover:scale-100 duration-300"
          >
            {translate("contact")}
          </a>

          {/* Language Switcher */}
          <div className="flex space-x-4 py-4 lg:py-0 justify-center">
            <button
              onClick={() => handleLanguageChange("en")}
              className="text-yellow-400 hover:text-yellow-600"
            >
              English
            </button>
            <button
              onClick={() => handleLanguageChange("hi")}
              className="text-yellow-400 hover:text-yellow-600"
            >
              हिंदी
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
