
import React, { useState, useEffect } from "react";
import photo1 from "../../assets/Images/AI-body.png";
import photo2 from "../../assets/Images/smartOutfit.png";

const technologies = [
  {
    id: 1,
    name: "AI-Powered Body Sizing",
    image: photo1,
    description:
      "Upload a clear, full-body photo, and our AI-powered system will analyze your measurements and body shape to recommend the best size for you.",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
        />
      </svg>
    ),
    features: [
      "Accurate within 97% of in-store measurements",
      "Works with any smartphone camera",
      "Privacy-focused with instant data processing",
    ],
  },
  {
    id: 2,
    name: "Smart Outfit Recommendations",
    image: photo2,
    description:
      "Select an item, and our AI suggests complementary pieces like jackets, jeans, or accessories to create the perfect outfit tailored to your style.",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13 10V3L4 14h7v7l9-11h-7z"
        />
      </svg>
    ),
    features: [
      "Personalized style matching algorithms",
      "Season and occasion awareness",
      "Color palette harmonization",
    ],
  },
];

const Technology = () => {
  const [activeTab, setActiveTab] = useState(technologies[0].id);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleTabClick = (id) => {
    setIsVisible(false);
    setTimeout(() => {
      setActiveTab(id);
      setIsVisible(true);
    }, 300);
  };

  const activeTech = technologies.find((tech) => tech.id === activeTab);

  return (
    <section className="py-24 bg-gradient-to-b bg-[#fff]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-3 py-1 bg-[#F0BB78] text-black rounded-full text-sm font-semibold tracking-wide uppercase shadow-sm">
            Innovation
          </span>
          <h2 className="mt-4 text-4xl sm:text-5xl font-bold text-black leading-tight">
            Technologies We Use
          </h2>
          <div className="mt-4 mx-auto h-1 w-24 bg-[#F0BB78] rounded-full shadow-lg"></div>
          <p className="mt-8 text-xl text-black max-w-2xl mx-auto leading-relaxed">
            Explore the innovative technologies that power our personalized
            shopping experience and revolutionize the way you shop online.
          </p>
        </div>

        {/* Technology Display Area */}
        <div className="flex flex-col lg:flex-row gap-12 mt-16">
          {/* Left side - Technology Tabs */}
          <div className="lg:w-1/3">
            <div className="bg-[#181818] rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.3)] p-2 backdrop-blur-sm">
              {technologies.map((tech) => (
                <button
                  key={tech.id}
                  onClick={() => handleTabClick(tech.id)}
                  className={`w-full text-left p-5 mb-2 rounded-lg transition-all duration-300 flex items-center ${
                    activeTab === tech.id
                      ? "bg-[#F0BB78] text-[#000000] shadow-[0_8px_15px_rgba(240,187,120,0.3)]"
                      : "bg-[#252525] text-white hover:bg-[#303030]"
                  }`}
                >
                  <div
                    className={`p-3 rounded-full mr-4 transition-all duration-300 ${
                      activeTab === tech.id
                        ? "bg-[#000000] shadow-[0_0_15px_rgba(0,0,0,0.5)]"
                        : "bg-[#181818]"
                    }`}
                  >
                    {tech.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{tech.name}</h3>
                    <p
                      className={`text-sm mt-1 ${
                        activeTab === tech.id
                          ? "text-[#000000]/80"
                          : "text-white/70"
                      }`}
                    >
                      {tech.description.substring(0, 60)}...
                    </p>
                  </div>
                </button>
              ))}
            </div>

            {/* CTA Section */}
            <div className="bg-gradient-to-r from-[#181818] to-[#252525] rounded-xl p-8 mt-8 text-white shadow-[0_15px_35px_rgba(0,0,0,0.4)] transform hover:scale-[1.02] transition-all duration-300">
              <h3 className="text-2xl font-bold mb-4">Ready to try it out?</h3>
              <p className="mb-6 text-[#F0BB78]/90">
                Experience the future of shopping today with our
                state-of-the-art technology.
              </p>
              <button className="bg-[#F0BB78] text-[#000000] font-semibold py-3 px-6 rounded-lg hover:shadow-[0_5px_15px_rgba(240,187,120,0.4)] transition-all duration-300 transform hover:-translate-y-1">
                Get Started
              </button>
            </div>
          </div>

          {/* Right side - Active Technology Display */}
          <div className="lg:w-2/3">
            <div
              className={`bg-[#181818] backdrop-blur-sm rounded-2xl shadow-[0_15px_40px_rgba(0,0,0,0.3)] overflow-hidden transition-all duration-500 transform ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4"
              }`}
            >
              <div className="relative">
                <img
                  className="w-full h-72 sm:h-96 object-cover object-center"
                  src={activeTech?.image}
                  alt={activeTech?.name}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#000000] to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-8">
                  <h3 className="text-3xl font-bold text-white mb-2">
                    {activeTech?.name}
                  </h3>
                  <span className="px-4 py-1.5 bg-[#F0BB78] text-[#000000] text-sm font-medium rounded-full shadow-[0_0_20px_rgba(240,187,120,0.4)]">
                    Powered by Machine Learning
                  </span>
                </div>
              </div>

              <div className="p-8">
                <p className="text-xl text-white/80 leading-relaxed mb-8">
                  {activeTech?.description}
                </p>

                <h4 className="text-lg font-semibold text-white mb-4">
                  Key Features
                </h4>
                <div className="grid md:grid-cols-3 gap-4">
                  {activeTech?.features.map((feature, index) => (
                    <div
                      key={index}
                      className="bg-[#252525] p-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 hover:bg-[#303030] transform hover:-translate-y-1"
                    >
                      <div className="flex items-center">
                        <div className="h-8 w-8 bg-[#F0BB78] text-[#000000] rounded-full flex items-center justify-center mr-3 shadow-[0_0_10px_rgba(240,187,120,0.2)]">
                          <span className="font-semibold">{index + 1}</span>
                        </div>
                        <span className="text-white/90">{feature}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 flex items-center justify-between">
                  <div className="flex items-center space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg
                        key={star}
                        className="w-5 h-5 text-[#F0BB78]"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                    <span className="text-sm text-white/60 ml-2">
                      4.9/5 Customer Rating
                    </span>
                  </div>
                  <button className="inline-flex items-center px-5 py-2 bg-[#F0BB78] text-[#000000] text-sm font-medium rounded-lg hover:bg-[#D9A768] transition-colors duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                    Learn More
                    <svg
                      className="w-4 h-4 ml-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Testimonial Section */}
       
      </div>
    </section>
  );
};

export default Technology;