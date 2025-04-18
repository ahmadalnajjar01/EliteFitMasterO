import React, { useState, useEffect, useRef } from "react";
import {
  ShoppingCart,
  Menu,
  X,
  Search,
  Heart,
  User,
  LogOut,
} from "lucide-react";
import Logo from "../assets/elitefit-logo.svg";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setSearchQuery, setIsSearching } from "../Slices/searchSlice";
import { searchProducts } from "../api/products";

const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [ads, setAds] = useState([]);
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [isSearchPopupOpen, setIsSearchPopupOpen] = useState(false);
  const searchPopupRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Get data from Redux
  const cartItemsCount = useSelector((state) => state.cart.cartItems.length);
  const favoriteItemsCount = useSelector(
    (state) => state.favorite.favorite.length
  );
  const searchQuery = useSelector((state) => state.search.query);

  // Check login status
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  // Close search popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchPopupRef.current &&
        !searchPopupRef.current.contains(event.target)
      ) {
        setIsSearchPopupOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleSearchPopup = () => setIsSearchPopupOpen(!isSearchPopupOpen);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    navigate("/");
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    dispatch(setSearchQuery(query));
  };

  const handleSearchSubmit = (e) => {
    if ((e.key === "Enter" || e.type === "click") && searchQuery.trim()) {
      navigate("/search");
      setIsSearchPopupOpen(false);
      setIsMenuOpen(false);
    }
  };

  useEffect(() => {
    // Fetch ads from API
    const fetchAds = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/ads");
        const data = await response.json();
        setAds(data);
      } catch (error) {
        console.error("Error fetching ads:", error);
      }
    };

    fetchAds();
  }, []);

  useEffect(() => {
    // Rotate through ads every few seconds if there are multiple
    if (ads.length > 1) {
      const interval = setInterval(() => {
        setCurrentAdIndex((prevIndex) => (prevIndex + 1) % ads.length);
      }, 5000); // Change ad every 5 seconds

      return () => clearInterval(interval);
    }
  }, [ads]);

  if (ads.length === 0) {
    // Fallback if no ads are loaded
    return (
      <section className="py-3 bg-[#F0BB78] text-black text-center px-10">
        <p className="text-sm">Get free delivery for first order over 100 JD</p>
      </section>
    );
  }

  return (
    <>
      <section className="py-3 bg-[#F0BB78] text-black text-center px-10">
        <p className="text-sm">{ads[currentAdIndex]?.description}</p>
      </section>

      <header className="shadow-lg font-[sans-serif] tracking-wide relative z-50">
        <section className="flex items-center relative py-3 lg:px-10 px-4 border-gray-200 border-b bg-white lg:min-h-[70px] max-lg:min-h-[60px]">
          <Link to="/" className="shrink-0">
            <img src={Logo} alt="EliteFit logo" className="w-[180px]" />
          </Link>

          <div className="flex flex-wrap w-full items-center">
            <div className="ml-auto">
              <ul className="flex items-center">
                {/* Search Icon */}
                <li className="max-lg:py-2 px-4 cursor-pointer relative">
                  <button
                    onClick={toggleSearchPopup}
                    className="flex items-center justify-center"
                    aria-label="Search"
                  >
                    <Search className="w-6 h-6 text-gray-800" />
                  </button>

                  {/* Search Popup */}
                  {isSearchPopupOpen && (
                    <div
                      ref={searchPopupRef}
                      className="absolute right-0 top-full mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50 p-4"
                    >
                      <div className="relative flex items-center">
                        <input
                          type="text"
                          placeholder="Search for clothes..."
                          className="w-full bg-gray-100 border px-4 pl-10 rounded h-10 outline-none text-sm transition-all"
                          value={searchQuery}
                          onChange={handleSearchChange}
                          onKeyDown={handleSearchSubmit}
                          autoFocus
                        />
                        <Search className="w-5 h-5 absolute left-3 text-gray-500" />
                        <button
                          className="absolute right-3 bg-[#F0BB78] rounded-full h-6 w-6 flex items-center justify-center hover:bg-[#e0ab68] transition-colors"
                          onClick={handleSearchSubmit}
                        >
                          <Search className="w-4 h-4 text-white" />
                        </button>
                      </div>
                    </div>
                  )}
                </li>

                <li className="max-lg:py-2 px-4 cursor-pointer">
                  <Link to="/favorite" className="relative flex items-center">
                    <Heart className="w-6 h-6 inline text-[#F0BB78]" />
                    {favoriteItemsCount > 0 && (
                      <span className="absolute left-auto -ml-1 -top-2 rounded-full bg-red-500 px-2 py-0 text-xs text-white">
                        {favoriteItemsCount}
                      </span>
                    )}
                  </Link>
                </li>

                <li className="max-lg:py-2 px-4 cursor-pointer">
                  <Link to="/cart" className="relative flex items-center">
                    <ShoppingCart className="w-6 h-6 inline" />
                    {cartItemsCount > 0 && (
                      <span className="absolute left-auto -ml-1 -top-2 rounded-full bg-red-500 px-2 py-0 text-xs text-white">
                        {cartItemsCount}
                      </span>
                    )}
                  </Link>
                </li>

                {isLoggedIn && (
                  <li className="max-lg:py-2 px-4 cursor-pointer">
                    <Link to="/profile" className="relative flex items-center">
                      <User className="w-6 h-6 inline text-gray-800" />
                    </Link>
                  </li>
                )}

                {isLoggedIn ? (
                  <button
                    onClick={handleLogout}
                    className="flex items-center px-4 py-2 text-sm font-semibold text-white bg-red-500 border border-red-600 rounded-lg hover:bg-red-600 transition-all"
                  >
                    <LogOut className="w-5 h-5 mr-2" />
                    Logout
                  </button>
                ) : (
                  <Link
                    to="/signup"
                    className="px-4 py-2 text-sm font-semibold text-gray-800 border border-[#333] bg-transparent"
                  >
                    Sign Up
                  </Link>
                )}

                <li className="lg:hidden cursor-pointer">
                  <button onClick={toggleMenu}>
                    <Menu className="w-7 h-7" />
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Mobile Menu */}
        <div
          className={`${
            isMenuOpen ? "block" : "hidden"
          } lg:!block max-lg:before:fixed max-lg:before:bg-black max-lg:before:opacity-50 max-lg:before:inset-0 max-lg:before:z-50`}
        >
          <button
            className="lg:hidden fixed top-2 right-4 z-[100] rounded-full bg-white w-9 h-9 flex items-center justify-center border cursor-pointer"
            onClick={toggleMenu}
          >
            <X className="w-5 h-5" />
          </button>

          {/* Mobile Search Bar */}
          <div className="lg:hidden px-6 py-4">
            <div className="relative flex items-center">
              <input
                type="text"
                placeholder="Search for clothes..."
                className="w-full bg-gray-100 border px-4 pl-10 rounded h-10 outline-none text-sm transition-all"
                value={searchQuery}
                onChange={handleSearchChange}
                onKeyDown={handleSearchSubmit}
              />
              <Search className="w-5 h-5 absolute left-3 text-gray-500" />
              <button
                className="absolute right-3 bg-[#F0BB78] rounded-full h-6 w-6 flex items-center justify-center"
                onClick={handleSearchSubmit}
              >
                <Search className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>

          <ul className="lg:flex lg:items-center lg:justify-center px-10 py-3 bg-[#fff] min-h-[46px] gap-4 max-lg:space-y-4 max-lg:fixed max-lg:w-1/2 max-lg:min-w-[300px] max-lg:top-0 max-lg:left-0 max-lg:p-6 max-lg:h-full max-lg:shadow-lg max-lg:overflow-auto z-50">
            <li className="max-lg:border-b max-lg:py-3 px-3">
              <Link to="/" className="text-black text-[15px] font-medium block">
                Home
              </Link>
            </li>
            <li className="max-lg:border-b max-lg:py-3 px-3">
              <Link
                to="/products"
                className="text-black text-[15px] font-medium block"
              >
                All Products
              </Link>
            </li>
            <li className="max-lg:border-b max-lg:py-3 px-3">
              <Link
                to="/new"
                className="text-black text-[15px] font-medium block"
              >
                New Arrivals
              </Link>
            </li>
            <li className="max-lg:border-b max-lg:py-3 px-3">
              <Link
                to="/men"
                className="text-black text-[15px] font-medium block"
              >
                Men
              </Link>
            </li>
            <li className="max-lg:border-b max-lg:py-3 px-3">
              <Link
                to="/women"
                className="text-black text-[15px] font-medium block"
              >
                Women
              </Link>
            </li>
            <li className="max-lg:border-b max-lg:py-3 px-3">
              <Link
                to="/kids"
                className="text-black text-[15px] font-medium block"
              >
                Kids
              </Link>
            </li>
            <li className="max-lg:border-b max-lg:py-3 px-3">
              <Link
                to="/sale"
                className="text-black text-[15px] font-medium block"
              >
                Sale
              </Link>
            </li>
            <li className="max-lg:border-b max-lg:py-3 px-3">
              <Link
                to="/contact"
                className="text-black text-[15px] font-medium block"
              >
                Contact
              </Link>
            </li>
            <li className="max-lg:border-b max-lg:py-3 px-3">
              <Link
                to="/about"
                className="text-black text-[15px] font-medium block"
              >
                About
              </Link>
            </li>
          </ul>
        </div>
      </header>
    </>
  );
};

export default NavBar;
