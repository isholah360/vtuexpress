import React, { useState } from "react";
import { Link } from "react-router-dom";

const HeroSection = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="bg-white font-sans px-[5%]">
      {/* Header */}
      <header className="container mx-auto px-4 py-6 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center">
          <div className="w-8 h-8 bg-purple-600 rounded-full mr-2"></div>
          <h1 className="text-xl font-bold text-gray-800">VTUExpress</h1>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-8">
          <a
            href="#"
            className="text-gray-700 hover:text-purple-600 font-medium"
          >
            Home
          </a>
          <a
            href="#"
            className="text-gray-700 hover:text-purple-600 font-medium"
          >
            Features
          </a>
          <a
            href="#"
            className="text-gray-700 hover:text-purple-600 font-medium"
          >
            About us
          </a>
          <a
            href="#"
            className="text-gray-700 hover:text-purple-600 font-medium"
          >
            Contact
          </a>
        </nav>

        {/* CTA Buttons */}
        <div className="hidden md:flex space-x-4">
          <button className="px-6 py-2 border border-gray-300 rounded-full text-gray-700 hover:bg-gray-50 transition">
            <Link to="/signin">Sign in</Link>
          </button>
          <button
            className="px-6 py-2 bg-black text-white rounded-full hover:bg-gray-800 transition"
            onClick={"/signup"}
          >
            <Link to="/register">Sign Up</Link>
          </button>
        </div>

        {/* Mobile Hamburger Menu */}
        <div className="md:hidden">
          <button
            onClick={toggleMenu}
            className="flex flex-col space-y-1 p-2"
            aria-label="Toggle menu"
          >
            <span
              className={`block w-6 h-0.5 bg-gray-700 transition-transform ${
                isMenuOpen ? "rotate-45 translate-y-1.5" : ""
              }`}
            ></span>
            <span
              className={`block w-6 h-0.5 bg-gray-700 transition-opacity ${
                isMenuOpen ? "opacity-0" : "opacity-100"
              }`}
            ></span>
            <span
              className={`block w-6 h-0.5 bg-gray-700 transition-transform ${
                isMenuOpen ? "-rotate-45 -translate-y-1.5" : ""
              }`}
            ></span>
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-white pt-20 pb-6 px-6">
          <div className="flex flex-col space-y-6">
            <a
              href="#"
              className="text-gray-700 hover:text-purple-600 font-medium text-lg"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </a>
            <a
              href="#"
              className="text-gray-700 hover:text-purple-600 font-medium text-lg"
              onClick={() => setIsMenuOpen(false)}
            >
              Features
            </a>
            <a
              href="#"
              className="text-gray-700 hover:text-purple-600 font-medium text-lg"
              onClick={() => setIsMenuOpen(false)}
            >
              About us
            </a>
            <a
              href="#"
              className="text-gray-700 hover:text-purple-600 font-medium text-lg"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </a>
            <div className="flex flex-col space-y-4 pt-4">
              <button className="px-6 py-2 border border-gray-300 rounded-full text-gray-700 hover:bg-gray-50 transition">
                <Link to="/signin">Sign in</Link>
              </button>
              <button className="px-6 py-2 bg-black text-white rounded-full hover:bg-gray-800 transition">
                <Link to="/register">Sign Up</Link>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hero Content */}
      <main className="container justify-between mx-auto px-4 py-12 md:py-20 flex flex-col md:flex-row items-center gap-12">
        {/* Left Column - Text Content */}
        <div className="md:w-1/2 space-y-8">
          {/* Badge */}
          <div className="inline-block px-4 py-2 bg-white border border-gray-200 rounded-full text-sm font-medium text-gray-700">
            #1 VTUExpress APP IN APP STORE
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-gray-900 leading-tight">
            Manage your finance easily with{" "}
            <span className="text-purple-600">VTUExpress</span>
          </h1>

          {/* Subheading */}
          <p className="text-gray-600 text-lg md:text-xl">
            With VTUExpress, you can recharge airtime, buy data bundles, pay for
            cable TV and electricity bills all instantly, securely, and in one
            place.
          </p>

          {/* Stats Counter Block - Full Width on Mobile, Half Width on Desktop */}
          <div className="w-full bg-gray-600 text-white py-8 px-6 rounded-xl">
            <div className="flex flex-row flex-wrap gap-6 justify-around items-center">
              {/* Stat 1 */}
              <div className="text-center">
                <div className="text-2xl sm:text-3xl md:text-5xl font-bold">
                  3m
                </div>
                <div className="text-xs sm:text-sm font-semibold text-white mt-1">
                  Total Users
                </div>
              </div>

              {/* Stat 2 */}
              <div className="text-center">
                <div className="text-2xl sm:text-3xl md:text-5xl font-bold">
                  25+
                </div>
                <div className="text-xs sm:text-sm font-semibold text-white mt-1">
                  Total Features
                </div>
              </div>

              {/* Stat 3 */}
              <div className="text-center">
                <div className="text-2xl sm:text-3xl md:text-5xl font-bold">
                  50k
                </div>
                <div className="text-xs sm:text-sm font-semibold text-white mt-1">
                  Total Co-Creators
                </div>
              </div>
            </div>
          </div>

          {/* Global Partners */}
          <div className="pt-8">
            <h3 className="text-sm font-medium text-gray-600 mb-4">
              Global Partner:
            </h3>
            <div className="flex space-x-6">
              <div className="w-[8rem] h-8 bg-gray-100 rounded-full flex items-center justify-center">
                <img className=" text-gray-600 p-3" src="/pay.png" />
              </div>
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-gray-600"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-2-2 1-1 2 2 4-4 1 1-5 5z" />
                </svg>
              </div>
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-gray-600"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-2-2 1-1 2 2 4-4 1 1-5 5z" />
                </svg>
              </div>
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-gray-600"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-2-2 1-1 2 2 4-4 1 1-5 5z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Image */}
        <div className="md:w-1/2 relative justify-end">
          <img src="/later.png" alt="Description of the image" />
        </div>
      </main>
    </div>
  );
};

export default HeroSection;
