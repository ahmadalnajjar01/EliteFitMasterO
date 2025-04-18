import React from "react";

// Replace with your actual video file path
import aboutVideo from "../assets/aboutVedio.mp4";

const About = () => {
  return (
    <div className="bg-[#fff]">
      {/* Hero Section with Video Background */}
      <div className="relative h-[60vh] overflow-hidden">
        {/* Background Video */}
        <video
          autoPlay
          loop
          muted
          className="absolute top-0 left-0 w-full h-full object-cover"
        >
          <source src={aboutVideo} type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Overlay */}
        <div className="absolute top-0 left-0 w-full h-full bg-black opacity-50"></div>

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-white text-center px-4">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            About <span className="text-[#F0BB78]">EliteFit</span>
          </h1>
          <p className="text-lg md:text-xl max-w-2xl">
            Revolutionizing Fashion with Cutting-Edge Technology
          </p>
        </div>
      </div>

      {/* Introduction Section */}
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-black">
              Welcome to EliteFit
            </h2>
            <p className="mt-4 text-lg text-black/70">
              At EliteFit, we believe that fashion should be accessible,
              personalized, and effortless. Our mission is to redefine your
              shopping experience by combining the latest advancements in AI and
              machine learning with a curated collection of stylish,
              high-quality clothing.
            </p>
            <p className="mt-4 text-lg text-black/70">
              Whether you're looking for the perfect fit or styling inspiration,
              EliteFit is here to make your journey seamless and enjoyable.
              Discover how our innovative technologies are transforming the way
              you shop for clothes.
            </p>
          </div>
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1483985988355-763728e1935b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
              alt="Fashion Collection"
              className="rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-50 rounded-lg"></div>
          </div>
        </div>
      </div>

      {/* Technologies Section */}
      <div className="bg-[#181818] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center">
            Our Advanced Technologies
          </h2>
          <p className="mt-4 text-lg text-white/70 text-center">
            EliteFit leverages state-of-the-art AI to deliver a personalized and
            seamless shopping experience.
          </p>
          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Body Sizing and Shape Detection */}
            <div className="bg-[#252525] p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
              <h3 className="text-2xl font-bold text-[#F0BB78]">
                Body Sizing and Shape Detection
              </h3>
              <p className="mt-4 text-white/70">
                Finding the perfect fit has never been easier. With our advanced
                body sizing and shape detection tool, simply upload a clear,
                full-body photo, and our AI-powered system will analyze your
                measurements and body shape to recommend the best size for you.
              </p>
              <ul className="mt-4 list-disc list-inside text-white/70">
                <li>Accurate measurements for a perfect fit</li>
                <li>Personalized size recommendations</li>
                <li>No more guesswork—shop with confidence</li>
              </ul>
            </div>

            {/* Smart Outfit Recommendations */}
            <div className="bg-[#252525] p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
              <h3 className="text-2xl font-bold text-[#F0BB78]">
                Smart Outfit Recommendations
              </h3>
              <p className="mt-4 text-white/70">
                Elevate your style with our smart outfit recommendations. When
                you select an item, such as a black hoodie, our AI-powered
                system instantly suggests complementary pieces like jackets,
                jeans, or accessories to help you create the perfect outfit.
              </p>
              <ul className="mt-4 list-disc list-inside text-white/70">
                <li>AI-driven styling suggestions</li>
                <li>Tailored to your style preferences</li>
                <li>Create cohesive looks effortlessly</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Our Mission Section */}
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-black text-center">
          Our Mission
        </h2>
        <p className="mt-4 text-lg text-black/70 text-center">
          To empower you to express your unique style through personalized,
          high-quality fashion.
        </p>
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-[#252525] p-8 rounded-lg shadow-lg text-center hover:shadow-xl transition-shadow duration-300">
            <h3 className="text-2xl font-bold text-[#F0BB78]">
              Personalization
            </h3>
            <p className="mt-4 text-white/70">
              We use AI to tailor your shopping experience, ensuring every
              recommendation fits your style and body type.
            </p>
          </div>
          <div className="bg-[#252525] p-8 rounded-lg shadow-lg text-center hover:shadow-xl transition-shadow duration-300">
            <h3 className="text-2xl font-bold text-[#F0BB78]">Innovation</h3>
            <p className="mt-4 text-white/70">
              Our cutting-edge technologies make shopping effortless, intuitive,
              and enjoyable.
            </p>
          </div>
          <div className="bg-[#252525] p-8 rounded-lg shadow-lg text-center hover:shadow-xl transition-shadow duration-300">
            <h3 className="text-2xl font-bold text-[#F0BB78]">
              Sustainability
            </h3>
            <p className="mt-4 text-white/70">
              We are committed to reducing waste and promoting sustainable
              fashion practices.
            </p>
          </div>
        </div>
      </div>

      {/* Call to Action Section */}
      <div className="bg-gradient-to-r from-[#F0BB78] to-[#F0BB78]/80 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-[#000000]">
            Experience the Future of Fashion
          </h2>
          <p className="mt-4 text-lg text-[#000000]/70">
            Join the EliteFit community today and discover a smarter, more
            personalized way to shop.
          </p>
          <div className="mt-8">
            <a
              href="/signup"
              className="inline-block px-8 py-3 text-lg font-medium text-white bg-[#000000] rounded-lg hover:bg-[#252525] transition-colors duration-200"
            >
              Get Started
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
