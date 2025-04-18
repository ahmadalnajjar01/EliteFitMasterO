// ThemeProvider.js
import React from "react";

// Define your color palette
export const colors = {
  primary: "#FA5990",
  secondary: "#060640",
  background: "#FADED9",
  text: "#515161",
  accent: "#3A8FB6",
  white: "#FFFFFF",
  black: "#000000",
  gray: "#CED5D8",
};

// Define your typography
export const typography = {
  h1: "text-5xl sm:text-6xl md:text-7xl font-bold",
  h2: "text-3xl font-bold",
  h3: "text-2xl font-semibold",
  body: "text-md sm:text-lg",
  small: "text-sm sm:text-base",
};

// Define your button styles
export const Button = ({ children, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="text-sm px-2 min-h-[36px] w-full bg-blue-600 hover:bg-blue-700 text-white tracking-wide ml-auto outline-none border-none rounded"
    >
      {children}
    </button>
  );
};

// Define your card component
export const Card = ({ title, description, image, price, originalPrice }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transform transition duration-300 hover:scale-105">
      <div className="w-full">
        <img
          src={image}
          alt={title}
          className="w-full object-cover object-top aspect-[230/307]"
        />
      </div>
      <div className="p-2 flex-1 flex flex-col">
        <div className="flex-1">
          <h5 className="text-sm sm:text-base font-bold text-gray-800 truncate">
            {title}
          </h5>
          <p className="mt-1 text-gray-500 truncate">{description}</p>
          <div className="flex flex-wrap justify-between gap-2 mt-2">
            <div className="flex gap-2">
              <h6 className="text-sm sm:text-base font-bold text-gray-800">
                {price}
              </h6>
              <h6 className="text-sm sm:text-base text-gray-500">
                <strike>{originalPrice}</strike>
              </h6>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 mt-4">
          <div className="bg-pink-100 hover:bg-pink-200 w-12 h-9 flex items-center justify-center rounded cursor-pointer">
            <Icon name="wishlist" className="fill-pink-600 inline-block" />
          </div>
          <Button>Add to cart</Button>
        </div>
      </div>
    </div>
  );
};

// Define your icon component
export const Icon = ({ name, className }) => {
  const icons = {
    wishlist: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16px"
        className={className}
        viewBox="0 0 64 64"
      >
        <path d="M45.5 4A18.53 18.53 0 0 0 32 9.86 18.5 18.5 0 0 0 0 22.5C0 40.92 29.71 59 31 59.71a2 2 0 0 0 2.06 0C34.29 59 64 40.92 64 22.5A18.52 18.52 0 0 0 45.5 4ZM32 55.64C26.83 52.34 4 36.92 4 22.5a14.5 14.5 0 0 1 26.36-8.33 2 2 0 0 0 3.27 0A14.5 14.5 0 0 1 60 22.5c0 14.41-22.83 29.83-28 33.14Z" />
      </svg>
    ),
    // Add more icons as needed
  };

  return icons[name];
};

// Define your section header component
export const SectionHeader = ({ title, linkText, linkUrl }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:justify-between items-center">
      <h2 className="text-lg sm:text-xl mr-4 font-semibold text-[#060640]">
        {title}
      </h2>
      <Link
        to={linkUrl}
        className="flex items-center text-gray-600 hover:underline mt-4 sm:mt-0"
      >
        <span className="mr-2 text-[#515161]">{linkText}</span>
        <Icon name="arrow-right" className="w-4 h-4 text-gray-600" />
      </Link>
    </div>
  );
};

// Define your ThemeProvider component
export const ThemeProvider = ({ children }) => {
  return <div className="theme-provider">{children}</div>;
};
