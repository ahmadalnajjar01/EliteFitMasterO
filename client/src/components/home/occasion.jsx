import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// Import images
import photooccasion1 from "../../assets/Images/winter.jpg";
import photooccasion2 from "../../assets/Images/summer.jpg";
import photooccasion3 from "../../assets/Images/formal.jpg";
import photooccasion4 from "../../assets/Images/sport.jpg";

const occasions = [
  {
    name: "Winter",
    image: photooccasion1,
    description: "Stay warm and stylish with our winter collection",
    tagline: "Cozy & Elegant",
  },
  {
    name: "Summer",
    image: photooccasion2,
    description: "Light, breathable fabrics for the hottest days",
    tagline: "Cool & Fresh",
  },
  {
    name: "Formal",
    image: photooccasion3,
    description: "Make a statement at your next formal event",
    tagline: "Sophisticated & Refined",
  },
  {
    name: "Sport",
    image: photooccasion4,
    description: "Performance wear for your active lifestyle",
    tagline: "Dynamic & Functional",
  },
];

const Occasion = () => {
  const navigate = useNavigate();
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const handleOccasionClick = (occasionName) => {
    navigate(`/occasion/${occasionName.toLowerCase()}`);
  };

  return (
    <section className="py-24 bg-gradient-to-b bg-[#fff] relative overflow-hidden">
      {/* Background decorative elements - matching CategorySection */}
      <div className="absolute top-0 left-0 w-64 h-64 rounded-full bg-[#F0BB78]/5 blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-[#F0BB78]/5 blur-3xl translate-x-1/2 translate-y-1/2 pointer-events-none"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Section Header - updated to match CategorySection */}
        <div className="text-center mb-16">
          <span className="inline-block px-3 py-1 bg-[#F0BB78] text-black rounded-full text-sm font-semibold tracking-wide uppercase shadow-sm">
            Curated Collections
          </span>
          <h2 className="mt-4 text-4xl sm:text-5xl font-bold text-black leading-tight">
            Shop by Occasion
          </h2>
          <div className="mt-4 mx-auto h-1 w-24 bg-[#F0BB78] rounded-full shadow-lg"></div>
          <p className="mt-8 text-xl text-black max-w-2xl mx-auto leading-relaxed">
            Discover perfectly curated outfits for every moment and season in
            your life
          </p>
        </div>

        {/* Occasion Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {occasions.map((occasion, index) => (
            <div
              key={index}
              className="relative h-110 rounded-xl overflow-hidden group transition-all duration-500 
              bg-[#181818] 
              shadow-[0_10px_30px_rgba(0,0,0,0.3),0_0_0_1px_rgba(240,187,120,0.05)] 
              hover:shadow-[0_20px_40px_rgba(0,0,0,0.4),0_0_0_1px_rgba(240,187,120,0.1)] 
              transform hover:-translate-y-1"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              onClick={() => handleOccasionClick(occasion.name)}
            >
              {/* Subtle border glow effect - matching CategoryCard */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-xl pointer-events-none"
                style={{
                  boxShadow:
                    "0 0 15px 2px rgba(240,187,120,0.3), inset 0 0 0 1px rgba(240,187,120,0.2)",
                  transition: "opacity 0.7s ease",
                }}
              ></div>

              {/* Card Background */}
              <div className="absolute inset-0">
                <img
                  className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-110"
                  src={occasion.image}
                  alt={occasion.name}
                  style={{ filter: "brightness(0.8) contrast(1.1)" }}
                />
                {/* Gradient Overlay - updated to match CategoryCard */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#000000]/90 via-[#000000]/60 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-700 z-10"></div>
              </div>

              {/* Badge - updated styling */}
              <div className="absolute top-4 right-4 bg-[#F0BB78] text-[#000000] px-3 py-1 rounded-full text-sm font-medium shadow-md transform rotate-12 group-hover:rotate-0 group-hover:scale-110 transition-all duration-500 z-20">
                {occasion.tagline}
              </div>

              {/* Content - updated to match CategoryCard styling */}
              <div className="absolute inset-0 p-6 flex flex-col justify-between z-20">
                <div>
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-[#F0BB78]/20 text-white mb-2 shadow-md transform translate-y-1 opacity-80 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
                    {occasion.name}
                  </span>
                  <h3 className="text-2xl lg:text-3xl font-bold text-white group-hover:text-[#F0BB78] transition-colors duration-500 drop-shadow-md transform group-hover:-translate-y-1">
                    {occasion.name} Collection
                  </h3>
                  {/* Description with reveal animation */}
                  <p className="text-white/90 mt-2 transform transition-all duration-300 ease-in-out opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0">
                    {occasion.description}
                  </p>
                </div>

                {/* Button - updated styling */}
                <button className="mt-4 self-start bg-[#F0BB78] text-[#000000] px-4 py-2 rounded-lg font-semibold transform transition-all duration-300 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 hover:shadow-[0_5px_15px_rgba(240,187,120,0.4)] hover:-translate-y-1 flex items-center">
                  Explore Collection
                  <svg
                    className="ml-2 w-4 h-4 transition-transform duration-300 transform group-hover:translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    ></path>
                  </svg>
                </button>
              </div>

              {/* Pulsing Indicator */}
              {hoveredIndex === index && (
                <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center pointer-events-none">
                  <div className="h-24 w-24 rounded-full border-2 border-[#F0BB78] opacity-0 animate-ping"></div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Featured Seasonal Banner - updated styling */}
        <div className="mt-16 relative overflow-hidden rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] transform hover:scale-[1.02] transition-all duration-500 bg-gradient-to-r from-[#181818] to-[#252525]">
          <div className="p-8 md:p-12 lg:p-16">
            <div className="relative z-10 max-w-3xl">
              <h3 className="text-3xl font-bold text-white mb-4">
                Seasonal Specials
              </h3>
              <p className="text-[#F0BB78]/90 text-lg mb-6">
                Discover curated collections for every season with exclusive
                discounts and early access to new arrivals.
              </p>
              <button
                onClick={() => navigate("/seasonal-specials")}
                className="bg-[#F0BB78] text-[#000000] font-semibold py-3 px-6 rounded-lg hover:shadow-[0_5px_15px_rgba(240,187,120,0.4)] transition-all duration-300 transform hover:-translate-y-1 flex items-center"
              >
                View Seasonal Offers
                <svg
                  className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </button>
            </div>
            {/* Decorative Elements */}
            <div className="absolute right-0 bottom-0 h-64 w-64 bg-[#F0BB78] opacity-5 rounded-full -mb-16 -mr-16"></div>
            <div className="absolute right-32 top-0 h-40 w-40 bg-[#F0BB78] opacity-5 rounded-full -mt-16 -mr-16"></div>
          </div>
        </div>

        {/* Testimonial - updated styling */}
        
      </div>
    </section>
  );
};

export default Occasion;
