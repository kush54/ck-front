import React, { useState } from "react";

const Home = () => {
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
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="relative">
      {/* Navbar Section */}
      <nav className="fixed top-0 left-0 w-full bg-gray-900 text-white shadow-lg z-50 transition-transform transform hover:scale-100 hover:bg-gray-800 duration-300 ease-in-out">
  <div className="container mx-auto flex justify-between items-center px-6 py-4">
    <div className="text-3xl font-bold text-yellow-400 hover:text-yellow-600 transition-all duration-300">
      CK
    </div>

    {/* Hamburger Menu for Mobile */}
    <button
      onClick={() => setIsMenuOpen(!isMenuOpen)}
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
          d={
            isMenuOpen
              ? "M6 18L18 6M6 6l12 12" // Close icon
              : "M4 6h16M4 12h16M4 18h16" // Hamburger icon
          }
        ></path>
      </svg>
    </button>

    {/* Navigation Links */}
    <div
      className={`lg:flex lg:space-x-8 text-lg font-medium absolute lg:static top-16 left-0 w-full lg:w-auto bg-gray-900 lg:bg-transparent transition-transform ${
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


      {/* Hero Section */}
      <section className="relative flex items-center justify-center min-h-screen bg-gray-800 text-white text-center px-6 py-16 animate-fadeIn">
        <div className="container mx-auto">
          <h1 className="text-6xl md:text-7xl font-extrabold leading-tight mb-6 animate-slideInUp">
            {translate("heroTitle")}
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 animate-slideInUp delay-200">
            {translate("heroSubtitle")}
          </p>
          <button className="bg-yellow-500 text-white px-8 py-4 rounded-full shadow-lg hover:bg-yellow-600 transition-all transform hover:scale-105 duration-300">
            {translate("getStarted")}
          </button>
        </div>

        {/* 3D Animation */}
        <div className="absolute top-20 right-20 w-64 h-64 animate-rotateSlow">
          <div className="w-full h-full animate-spin-slow">
            <svg
              className="w-full h-full"
              viewBox="0 0 100 100"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g fill="none" stroke="yellow" strokeWidth="2">
                <rect x="20" y="20" width="60" height="60" rx="10" />
                <line x1="20" y1="20" x2="80" y2="80" />
                <line x1="20" y1="80" x2="80" y2="20" />
              </g>
            </svg>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-gray-100 text-center animate-fadeIn">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-gray-800 mb-8 animate-slideInUp">
            {translate("whyChooseUs")}
          </h2>
          <p className="text-lg text-gray-600 mb-12 animate-slideInUp delay-200">
            {translate("whyChooseUsDesc")}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "AI Script Writing",
                description: "Generate professional scripts in seconds.",
              },
              {
                title: "Text-to-Speech",
                description: "Convert text into natural, expressive audio.",
              },
              {
                title: "Media Assistance",
                description: "Get relevant images, videos, and soundtracks.",
              },
            ].map((feature, idx) => (
              <div
                key={idx}
                className="p-8 bg-white shadow-md rounded-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 hover:bg-yellow-50 animate-scaleUp"
              >
                <h3 className="text-2xl font-semibold text-yellow-500 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tutorials Section */}
      <section
        id="tutorials"
        className="py-24 bg-gray-900 text-center text-white animate-fadeIn"
      >
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-yellow-400 mb-8 animate-slideInUp">
            {translate("tutorials")}
          </h2>
          <p className="text-lg text-gray-300 mb-12 animate-slideInUp delay-200">
            {translate("tutorialsDesc")}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { title: "Getting Started", url: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
              { title: "Advanced Tools", url: "https://www.youtube.com/embed/3JZ_D3ELwOQ" },
              { title: "Content Tips", url: "https://www.youtube.com/embed/tgbNymZ7vqY" },
            ].map((tutorial, idx) => (
              <div key={idx} className="bg-gray-800 p-4 rounded-lg shadow-md hover:shadow-xl transition-all hover:scale-105">
                <iframe
                  src={tutorial.url}
                  title={tutorial.title}
                  className="w-full h-64 rounded-md"
                  allowFullScreen
                ></iframe>
                <h3 className="text-xl font-semibold text-yellow-400 mt-4">{tutorial.title}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 bg-gray-100 text-center animate-fadeIn">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-gray-800 mb-8 animate-slideInUp">
            {translate("pricing")}
          </h2>
          <p className="text-lg text-gray-600 mb-12 animate-slideInUp delay-200">
            {translate("pricingDesc")}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[{ title: "Starter", price: "$0/month", features: ["Basic Tools", "Community Access"] },
              { title: "Pro", price: "$19.99/month", features: ["Advanced Tools", "Priority Support"] },
              { title: "Enterprise", price: "Contact Us", features: ["Custom Solutions", "Team Collaboration"] }
            ].map((plan, idx) => (
              <div
                key={idx}
                className="p-8 bg-white shadow-md rounded-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                <h3 className="text-2xl font-semibold text-yellow-500 mb-4">
                  {plan.title}
                </h3>
                <h4 className="text-4xl font-bold mb-4">{plan.price}</h4>
                <ul className="text-gray-600 space-y-2">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center justify-center">
                      <span className="text-yellow-500 mr-2">✔</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer
  id="footer"
  className="bg-gray-900 text-white py-16 border-t-4 border-yellow-500 animate-fadeIn"
>
  <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
    {/* Creators Kit Section */}
    <div>
      <h3 className="text-2xl font-bold text-yellow-400 mb-4">Creators Kit</h3>
      <p className="text-gray-400">
        Simplifying content creation with AI-driven tools for every creator.
      </p>
    </div>

    {/* Quick Links Section */}
    <div>
      <h4 className="text-lg font-semibold text-yellow-400 mb-4">Quick Links</h4>
      <ul className="space-y-2">
        <li>
          <a href="#features" className="hover:text-yellow-400 transition-all">
            {translate("whyChooseUs")}
          </a>
        </li>
        <li>
          <a href="#pricing" className="hover:text-yellow-400 transition-all">
            {translate("pricing")}
          </a>
        </li>
        <li>
          <a href="#tutorials" className="hover:text-yellow-400 transition-all">
            {translate("tutorials")}
          </a>
        </li>
      </ul>
    </div>

    {/* Follow Us Section */}
    <div>
      <h4 className="text-lg font-semibold text-yellow-400 mb-4">Follow Us</h4>
      <ul className="space-y-2">
        <li>
          <a href="#" className="hover:text-yellow-400 transition-all">
            Facebook
          </a>
        </li>
        <li>
          <a href="#" className="hover:text-yellow-400 transition-all">
            Twitter
          </a>
        </li>
        <li>
          <a href="#" className="hover:text-yellow-400 transition-all">
            Instagram
          </a>
        </li>
      </ul>
    </div>

    {/* Additional Section (optional) */}
    <div>
      <h4 className="text-lg font-semibold text-yellow-400 mb-4">Contact</h4>
      <ul className="space-y-2">
        <li>
          <a href="mailto:info@creatorskit.com" className="hover:text-yellow-400 transition-all">
            Email Us
          </a>
        </li>
        <li>
          <a href="tel:+123456789" className="hover:text-yellow-400 transition-all">
            Call Us
          </a>
        </li>
      </ul>
    </div>
  </div>
</footer>

    </div>
  );
};

export default Home;
