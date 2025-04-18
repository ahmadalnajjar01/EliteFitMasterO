import React from "react";
import { Link } from "react-router-dom";
import {
  FaFacebook,
  FaInstagram,
  FaTwitter,
  FaTiktok,
  FaCcVisa,
  FaCcMastercard,
  FaCcPaypal,
} from "react-icons/fa";
import Logo from "../assets/elitefit-logo.svg"; // Updated logo import

const Footer = () => {
  return (
    <footer className="bg-black text-white py-12 px-6 font-sans">
      <div className="max-w-screen-xl mx-auto">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Logo & Brand Message */}
          <div>
            <Link to="/">
              <img src={Logo} alt="EliteFit Logo" className="w-40 mb-4" />
            </Link>
            <p className="text-gray-400 text-sm">
              Elevate your style with EliteFit – premium fashion for modern
              trendsetters.
            </p>
            <p className="text-gray-400 text-sm mt-2">#StayElite</p>
          </div>

          {/* Shop Categories */}
          <div className="flex flex-col space-y-3">
            <h3 className="text-lg font-semibold text-gray-200">Shop</h3>
            <Link to="/shop/men" className="hover:text-gray-400 transition">
              Men's Collection
            </Link>
            <Link to="/shop/women" className="hover:text-gray-400 transition">
              Women's Collection
            </Link>
            <Link
              to="/shop/accessories"
              className="hover:text-gray-400 transition"
            >
              Accessories
            </Link>
            <Link
              to="/shop/new-arrivals"
              className="hover:text-gray-400 transition"
            >
              New Arrivals
            </Link>
            <Link to="/shop/sale" className="hover:text-gray-400 transition">
              Sale
            </Link>
          </div>

          {/* Customer Support */}
          <div className="flex flex-col space-y-3">
            <h3 className="text-lg font-semibold text-gray-200">
              Customer Service
            </h3>
            <Link to="/help" className="hover:text-gray-400 transition">
              Help Center
            </Link>
            <Link to="/returns" className="hover:text-gray-400 transition">
              Returns & Exchanges
            </Link>
            <Link to="/shipping" className="hover:text-gray-400 transition">
              Shipping Info
            </Link>
            <Link to="/track-order" className="hover:text-gray-400 transition">
              Track Order
            </Link>
            <Link to="/contact" className="hover:text-gray-400 transition">
              Contact Us
            </Link>
          </div>

          {/* Newsletter Signup */}
          <div>
            <h3 className="text-lg font-semibold text-gray-200 mb-3">
              Stay Updated
            </h3>
            <p className="text-gray-400 text-sm mb-4">
              Subscribe for exclusive deals, early access to new collections,
              and special offers.
            </p>
            <form className="flex">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full p-2 text-black rounded-l-md focus:outline-none"
              />
              <button className="bg-[#F0BB78] px-4 text-white rounded-r-md hover:bg-[#F0BB60] transition">
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <hr className="border-gray-700 mb-6" />

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
          {/* Copyright */}
          <p>© {new Date().getFullYear()} EliteFit. All rights reserved.</p>

          {/* Payment Methods */}
          <div className="flex space-x-4 mt-4 md:mt-0">
            <FaCcVisa className="text-2xl hover:text-gray-200 transition" />
            <FaCcMastercard className="text-2xl hover:text-gray-200 transition" />
            <FaCcPaypal className="text-2xl hover:text-gray-200 transition" />
          </div>

          {/* Social Media */}
          <div className="flex space-x-5 mt-4 md:mt-0">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaFacebook className="text-lg hover:text-gray-200 transition" />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaInstagram className="text-lg hover:text-gray-200 transition" />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaTwitter className="text-lg hover:text-gray-200 transition" />
            </a>
            <a
              href="https://tiktok.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaTiktok className="text-lg hover:text-gray-200 transition" />
            </a>
          </div>
        </div>

        {/* Policies */}
        <div className="text-center text-gray-500 text-xs mt-6">
          <Link
            to="/privacy-policy"
            className="hover:text-gray-400 transition mx-2"
          >
            Privacy Policy
          </Link>{" "}
          |
          <Link
            to="/terms-of-service"
            className="hover:text-gray-400 transition mx-2"
          >
            Terms of Service
          </Link>{" "}
          |
          <Link to="/cookies" className="hover:text-gray-400 transition mx-2">
            Cookies Policy
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;























