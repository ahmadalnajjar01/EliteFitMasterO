import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
import C1 from "../../assets/Images/C1.png";
import C2 from "../../assets/Images/C2.png";
import C3 from "../../assets/Images/C3.png";
import S2 from "../../assets/Images/S2.webp";

// Custom hook for intersection observer (reveal animations)
const useInView = (options = {}) => {
  const [ref, setRef] = useState(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    if (!ref) return;
    const observer = new IntersectionObserver(([entry]) => {
      setIsInView(entry.isIntersecting);
    }, options);
    observer.observe(ref);
    return () => {
      if (ref) observer.unobserve(ref);
    };
  }, [ref, options]);

  return [setRef, isInView];
};

const CategoryCard = ({
  title,
  category,
  image,
  cta,
  link, // new prop to determine destination
  cardType = "standard",
  isSale = false,
  saleText = "",
  delay = 0,
  isInView = false,
}) => {
  const cardStyles = {
    featured: "lg:col-span-2 lg:h-96",
    standard: "h-80",
    compact: "h-64",
  };

  return (
    <div
      className={`relative overflow-hidden group rounded-xl transition-all duration-500 
      bg-[#181818] 
      shadow-[0_10px_30px_rgba(0,0,0,0.3),0_0_0_1px_rgba(240,187,120,0.05)] 
      hover:shadow-[0_20px_40px_rgba(0,0,0,0.4),0_0_0_1px_rgba(240,187,120,0.1)] 
      ${cardStyles[cardType]} 
      ${isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
      style={{
        transitionDelay: `${delay}ms`,
        backdropFilter: "blur(8px)",
      }}
    >
      {/* Subtle border glow effect */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-xl pointer-events-none"
        style={{
          boxShadow:
            "0 0 15px 2px rgba(240,187,120,0.3), inset 0 0 0 1px rgba(240,187,120,0.2)",
          transition: "opacity 0.7s ease",
        }}
      ></div>

      {/* Gradient overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#000000]/90 via-[#000000]/60 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-700 z-10"></div>

      {/* Sale badge */}
      {isSale && (
        <div className="absolute top-4 right-4 z-30 rotate-12 transform transition-all duration-500 group-hover:rotate-0 group-hover:scale-110">
          <div className="bg-[#F0BB78] text-[#000000] font-bold py-1.5 px-4 rounded-full shadow-[0_0_20px_rgba(240,187,120,0.4)] flex items-center">
            <svg
              className="w-4 h-4 mr-1 animate-pulse"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z"
                clipRule="evenodd"
              ></path>
            </svg>
            <span>SALE</span>
            {saleText && (
              <span className="ml-1 text-xs font-normal bg-white text-[#000000] px-1.5 py-0.5 rounded-sm shadow-inner">
                {saleText}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Card content */}
      <div className="absolute inset-0 p-6 flex flex-col justify-between z-20">
        <div>
          <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-[#F0BB78] text-[#000000] mb-2 shadow-md backdrop-blur-sm transform translate-y-1 opacity-80 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
            {category}
          </span>
          <h3 className="text-2xl lg:text-3xl font-bold text-white group-hover:text-[#F0BB78] transition-colors duration-500 drop-shadow-md transform group-hover:-translate-y-1">
            {title}
          </h3>
        </div>
        {cta && link && (
          <Link
            to={link}
            className="self-start mt-4 transform translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-700"
          >
            <button className="bg-[#F0BB78] text-[#000000] font-semibold py-3 px-6 rounded-lg hover:shadow-[0_5px_15px_rgba(240,187,120,0.4)] transition-all duration-300 transform hover:-translate-y-1 flex items-center">
              <span>{cta}</span>
              <svg
                className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform duration-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                ></path>
              </svg>
            </button>
          </Link>
        )}
      </div>

      {/* Image container */}
      {cardType === "featured" ? (
        <div className="absolute right-0 top-0 h-full w-1/2 lg:w-3/5 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-l from-transparent to-[#000000] z-10 opacity-0 group-hover:opacity-80 transition-opacity duration-700"></div>
          <img
            src={image}
            alt={title}
            className="h-full w-full object-cover object-center transform group-hover:scale-110 transition-all duration-1000 ease-out"
            style={{ filter: "brightness(0.8) contrast(1.1)" }}
          />
        </div>
      ) : (
        <div className="absolute right-0 top-0 h-full w-full overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-[#000000] to-transparent z-10 opacity-0 group-hover:opacity-80 transition-opacity duration-700"></div>
          <img
            src={image}
            alt={title}
            className="h-full w-full object-cover object-center transform group-hover:scale-110 transition-all duration-1000 ease-out"
            style={{ filter: "brightness(0.8) contrast(1.1)" }}
          />
        </div>
      )}
    </div>
  );
};

const CategorySection = () => {
  // State for storing the customer, category, and product counts from the backend
  const [happyCustomerCount, setHappyCustomerCount] = useState(null);
  const [categoryCount, setCategoryCount] = useState(null);
  const [productCount, setProductCount] = useState(null);

  // Fetch customer count when the component mounts
  useEffect(() => {
    const fetchCustomerCount = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/customers/count"
        );
        if (!response.ok) {
          throw new Error(`HTTP error: ${response.status}`);
        }
        const data = await response.json();
        setHappyCustomerCount(data.count);
      } catch (error) {
        console.error("Error fetching customer count:", error);
      }
    };

    fetchCustomerCount();
  }, []);

  // Fetch categories list and compute total count
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/categories/get-all-categories"
        );
        if (!response.ok) {
          throw new Error(`HTTP error: ${response.status}`);
        }
        const categoriesData = await response.json();
        setCategoryCount(categoriesData.length);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  // Fetch all products and compute total count
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/products");
        if (!response.ok) {
          throw new Error(`HTTP error: ${response.status}`);
        }
        const productsData = await response.json();
        setProductCount(productsData.length);
      } catch (error) {
        console.error("Error fetching product count:", error);
      }
    };

    fetchProducts();
  }, []);

  // Define category data with appropriate links for Category Cards
  const categories = [
    {
      title: "Women's Collection",
      category: "Fashion",
      image: C1,
      cta: "Explore Collection",
      cardType: "featured",
      link: "/women",
    },
    {
      title: "Kids Essentials",
      category: "Supplies & Apparel",
      image: C2,
      cta: "Shop Now",
      cardType: "standard",
      link: "/kids",
    },
    {
      title: "Men's Style",
      category: "Fashion & Accessories",
      image: C3,
      cta: "View Collection",
      cardType: "standard",
      link: "/men",
    },
    {
      title: "Seasonal Sale",
      category: "Limited Time Offers",
      image: S2,
      cta: "Shop Deals",
      cardType: "standard",
      isSale: true,
      saleText: "UP TO 40%",
      link: "/sale",
    },
  ];

  // Custom hook for section reveal animation
  const [sectionRef, sectionInView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  // Define the stats for display.
  // The stats now use the dynamically fetched values for Categories, Products, and Happy Customers.
  const stats = [
    {
      label: "Categories",
      value:
        categoryCount !== null ? categoryCount.toLocaleString() : "Loading...",
      icon: (
        <svg
          className="w-6 h-6 text-[#F0BB78]"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
        </svg>
      ),
    },
    {
      label: "Products",
      value:
        productCount !== null ? productCount.toLocaleString() : "Loading...",
      icon: (
        <svg
          className="w-6 h-6 text-[#F0BB78]"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
   
    {
      label: "Happy Customers",
      value:
        happyCustomerCount !== null
          ? happyCustomerCount.toLocaleString()
          : "Loading...",
      icon: (
        <svg
          className="w-6 h-6 text-[#F0BB78]"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
  ];

  return (
    <section
      ref={sectionRef}
      className="py-24 bg-gradient-to-b bg-[#ffffff] relative overflow-hidden"
    >
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-64 h-64 rounded-full bg-[#F0BB78]/5 blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-[#F0BB78]/5 blur-3xl translate-x-1/2 translate-y-1/2 pointer-events-none"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-3 py-1 bg-[#F0BB78] text-black rounded-full text-sm font-semibold tracking-wide uppercase shadow-sm">
            Collections
          </span>
          <h2 className="mt-4 text-4xl sm:text-5xl font-bold text-black leading-tight">
            Explore Categories
          </h2>
          <div className="mt-4 mx-auto h-1 w-24 bg-[#F0BB78] rounded-full shadow-lg"></div>
          <p className="mt-8 text-xl text-black max-w-2xl mx-auto leading-relaxed">
            Discover our carefully curated collection of premium products
            designed to elevate your style and enhance your lifestyle.
          </p>
        </div>

        {/* Category grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {categories.map((category, index) => (
            <div
              key={category.title}
              className={index === 0 ? "md:col-span-2 lg:col-span-2" : ""}
            >
              <CategoryCard
                {...category}
                delay={index * 100}
                isInView={sectionInView}
              />
            </div>
          ))}
        </div>

        {/* Stats section */}
        <div
          className={`mt-20 bg-[#181818]  rounded-2xl p-8 md:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.3)] backdrop-blur-sm transform transition-all duration-700 ${
            sectionInView
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-8"
          }`}
          style={{ transitionDelay: "500ms" }}
        >
          <div className="flex flex-col md:flex-row items-center ">
            <div className="md:w-1/3 mb-8 md:mb-0 ">
              <div className="bg-[#252525] p-2 rounded-full inline-block shadow-xl ">
                <div className="bg-[#F0BB78] p-4 rounded-full shadow-inner ">
                  <svg
                    className="w-12 h-12 text-[#000000] "
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5 2a1 1 0 011 1v1h8V3a1 1 0 112 0v1h1a2 2 0 012 2v10a2 2 0 01-2 2H3a2 2 0 01-2-2V6a2 2 0 012-2h1V3a1 1 0 011-1zm11 14V6H4v10h12z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
              <h3 className="text-2xl font-bold mt-6 text-white ">
                Elitefit Stats
              </h3>
              <p className="text-white/70 mt-2 ">
                We take pride in our commitment to quality and customer
                satisfaction. Here are some numbers that reflect our dedication
                to excellence.
              </p>
            </div>
            <div className="md:w-2/3 md:pl-12 grid grid-cols-2 gap-4 md:grid-cols-3 ml-30">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="bg-[#252525] p-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 hover:bg-[#303030] transform hover:-translate-y-1"
                >
                  <div className="flex items-center justify-center">
                    <div className="h-10 w-10 bg-[#F0BB78]/20 text-[#F0BB78] rounded-full flex items-center justify-center mr-3 shadow-[0_0_10px_rgba(240,187,120,0.2)]">
                      {stat.icon}
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-white">
                        {stat.value}
                      </p>
                      <p className="text-sm text-white/60">{stat.label}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Banner */}
        <div
          className={`mt-16 bg-gradient-to-r from-[#181818] to-[#252525] rounded-xl p-8 text-white shadow-[0_15px_35px_rgba(0,0,0,0.4)] transform hover:scale-[1.02] transition-all duration-300 ${
            sectionInView
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-8"
          }`}
          style={{ transitionDelay: "600ms" }}
        >
          <div className="flex flex-col md:flex-row md:justify-between md:items-center">
            <div>
              <h3 className="text-2xl font-bold mb-4">
                Ready to explore our collections?
              </h3>
              <p className="mb-6 md:mb-0 text-[#F0BB78]/90">
                Discover premium products that match your unique style.
              </p>
            </div>
            <Link
              to="/products"
              className="bg-[#F0BB78] text-[#000000] font-semibold py-3 px-6 rounded-lg hover:shadow-[0_5px_15px_rgba(240,187,120,0.4)] transition-all duration-300 transform hover:-translate-y-1 inline-flex items-center justify-center"
            >
              <span>Browse All Categories</span>
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
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
