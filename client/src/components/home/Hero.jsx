import React from "react";
// If you use React Router and want a link button, uncomment these two lines:
// import { Link } from "react-router-dom";
// import { Play } from "lucide-react"; // or remove if not needed

// Replace with your actual video file path
import heroVideo from "../../assets/heroVedio.mp4";

const Hero = () => {
  return (
    <div className="relative flex flex-col items-center justify-center h-[80vh] bg-black text-white text-center px-4">
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        className="absolute top-0 left-0 w-full h-full object-cover opacity-50"
      >
        <source src={heroVideo} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Optional Overlay (darker layer) */}
      <div className="absolute top-0 left-0 w-full h-full bg-black opacity-20"></div>

      {/* Main Content */}
      <div className="relative z-10 max-w-3xl mx-auto">
        {/* Example of a banner-like text */}
        <div className="inline-block bg-[#F0BB78] py-1 px-4 mb-8 rounded">
          <p className="font-bold text-sm md:text-base">ELITEFIT</p>
        </div>

        {/* Heading */}
        <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
          <div className="text-6xl font-bold tracking-tighter transition-transform duration-300 hover:scale-105 hover:text-gray-300 cursor-pointer">
            <span className="font-extrabold">ELEVATE</span>
            <span className="font-light">YOUR</span>
            <span className="font-extrabold">STYLE</span>
          </div>
          The Ultimate Activewear Destination
        </h1>

        {/* Subtitle */}
        <p className="text-lg md:text-xl mb-10 max-w-2xl mx-auto">
          Discover premium clothing designed for performance, comfort, and
          standout style. Transform your fitness journey with EliteFit's
          exclusive collections.
        </p>

        {/* Buttons */}
        <div className="flex flex-wrap justify-center gap-4">
          {/* Example if you want the first button to go to a "Shop" page */}
          {/*
          <Link
            to="/shop"
            className="bg-red-600 text-white px-6 py-3 rounded hover:bg-red-500 transition-colors"
          >
            Shop Now
          </Link>
          */}

          <button
            className="bg-[#F0BB78]  text-white px-6 py-3 rounded hover:bg-[#F0BB60]  transition-colors"
            onClick={() => console.log("Go to Shop")}
          >
            Shop Now
          </button>

          <button
            className="bg-white text-black px-6 py-3 rounded hover:bg-gray-300 transition-colors"
            onClick={() => console.log("View Collection")}
          >
            View Collection
          </button>
        </div>
      </div>
    </div>
  );
};

export default Hero;


























// import React from "react";
// // If you use React Router and want a link button, uncomment these two lines:
// // import { Link } from "react-router-dom";
// // import { Play } from "lucide-react"; // or remove if not needed

// // Replace with your actual video file path
// import heroVideo from "../../assets/heroVedio.mp4";

// const Hero = () => {
//   return (
//     <div className="relative flex flex-col items-center justify-center h-[80vh] bg-black text-white text-center px-4">
//       {/* Background Video */}
//       <video
//         autoPlay
//         loop
//         muted
//         className="absolute top-0 left-0 w-full h-full object-cover opacity-50"
//       >
//         <source src={heroVideo} type="video/mp4" />
//         Your browser does not support the video tag.
//       </video>

//       {/* Optional Overlay (darker layer) */}
//       <div className="absolute top-0 left-0 w-full h-full bg-black opacity-20"></div>

//       {/* Main Content */}
//       <div className="relative z-10 max-w-3xl mx-auto">
//         {/* Example of a banner-like text */}
//         <div className="inline-block bg-[#402a6e]/50 py-1 px-4 mb-8 rounded">
//           <p className="font-bold text-sm md:text-base">ELITEFIT</p>
//         </div>

//         {/* Heading */}
//         <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
//           <div className="text-6xl font-bold tracking-tighter transition-transform duration-300 hover:scale-105 hover:text-gray-300 cursor-pointer">
//             <span className="font-extrabold">ELEVATE</span>
//             <span className="font-light">YOUR</span>
//             <span className="font-extrabold">STYLE</span>
//           </div>
//           The Ultimate Activewear Destination
//         </h1>

//         {/* Subtitle */}
//         <p className="text-lg md:text-xl mb-10 max-w-2xl mx-auto">
//           Discover premium clothing designed for performance, comfort, and
//           standout style. Transform your fitness journey with EliteFit's
//           exclusive collections.
//         </p>

//         {/* Buttons */}
//         <div className="flex flex-wrap justify-center gap-4">
//           {/* Example if you want the first button to go to a "Shop" page */}
//           {/*
//           <Link
//             to="/shop"
//             className="bg-red-600 text-white px-6 py-3 rounded hover:bg-red-500 transition-colors"
//           >
//             Shop Now
//           </Link>
//           */}

//           <button
//             className="bg-[#402a6e] text-white px-6 py-3 rounded hover:bg-red-500 transition-colors"
//             onClick={() => console.log("Go to Shop")}
//           >
//             Shop Now
//           </button>

//           <button
//             className="bg-white text-black px-6 py-3 rounded hover:bg-gray-300 transition-colors"
//             onClick={() => console.log("View Collection")}
//           >
//             View Collection
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Hero;
