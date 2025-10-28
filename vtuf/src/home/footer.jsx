import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 py-8 px-4 md:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-12">

          {/* Left: Logo + Tagline + App Badges */}
          <div className="lg:w-1/3 space-y-6">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-black rounded-full mr-2"></div>
              <h2 className="text-xl font-bold text-gray-900">VTU Hub</h2>
            </div>
            <p className="text-gray-600 leading-relaxed">
              VTUExpress is Nigeria’s fastest and most secure virtual top-up platform for airtime, data, cable TV, and electricity payments.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              {/* Google Play */}
              <a href="#" className="block w-32">
                <img
                  src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png"
                  alt="Get it on Google Play"
                  className="w-full h-auto"
                />
              </a>
              {/* App Store */}
              <a href="#" className="block w-32">
                <img
                  src="https://tools.applemediaservices.com/api/badges/download-on-the-app-store/black/en-us?size=250x83"
                  alt="Download on the App Store"
                  className="w-full h-auto"
                />
              </a>
            </div>
          </div>

          {/* Middle: Navigation Links */}
          <div className="lg:w-1/3 grid grid-cols-2 gap-x-8 gap-y-6">
            {/* Our Service */}
            <div>
              <h3 className="font-bold text-gray-900 mb-4">Our Service</h3>
              <ul className="space-y-2 text-gray-600">
                <li><a href="#" className="hover:text-black transition">Airtime Recharge</a></li>
                <li><a href="#" className="hover:text-black transition">Data Bundles</a></li>
                <li><a href="#" className="hover:text-black transition">DSTV / GOTV</a></li>
                <li><a href="#" className="hover:text-black transition">Electricity Bill</a></li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h3 className="font-bold text-gray-900 mb-4">Company</h3>
              <ul className="space-y-2 text-gray-600">
                <li><a href="#" className="hover:text-black transition">About Us</a></li>
                <li><a href="#" className="hover:text-black transition">Contact</a></li>
                <li><a href="#" className="hover:text-black transition">FAQ</a></li>
                <li><a href="#" className="hover:text-black transition">Blog</a></li>
              </ul>
            </div>
          </div>

          {/* Right: Subscribe + Social */}
          <div className="lg:w-1/3 space-y-6">
            <h3 className="font-bold text-gray-900 mb-4">Get the latest updates</h3>
            <form className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 px-4 py-2.5 border border-gray-300 rounded-full outline-none text-gray-700"
              />
              <button
                type="submit"
                className="px-5 py-2.5 bg-black text-white rounded-full hover:bg-gray-800 transition whitespace-nowrap"
              >
                Subscribe
              </button>
            </form>

            <div className="pt-6">
              <p className="text-gray-600 mb-3">Follow us:</p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-600 hover:text-black transition">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.666.076 2.539 1.05 2.539 2.54v.167c0 1.49-.873 2.464-2.539 2.54-.897.04-1.251.053-3.808.053-2.557 0-2.911-.013-3.808-.053-1.666-.076-2.539-1.05-2.539-2.54V4.54c0-1.49.873-2.464 2.539-2.54.897-.04 1.251-.053 3.808-.053zM12 9.5a3 3 0 100 6 3 3 0 000-6z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-gray-600 hover:text-black transition">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879v-6.667H7.875v-2.563h2.563V12c0-2.54 1.518-3.938 3.844-3.938.563 0 1.125.063 1.625.188v2.313h-1.375c-1.375 0-1.625.813-1.625 1.625v1.875h2.938l-.438 2.563H12.313V21.88C17.1 21.128 21 16.99 21 12h1z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-gray-600 hover:text-black transition">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="text-gray-600 hover:text-black transition">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M19.812 5.418c.439-.439.439-1.15 0-1.588-.439-.439-1.15-.439-1.588 0l-7.071 7.07-3.536-3.535a1.125 1.125 0 00-1.588 0c-.439.439-.439 1.15 0 1.588l4.33 4.33a1.125 1.125 0 001.588 0l8.071-8.071zm-12.22 10.242a1.125 1.125 0 00-1.588 0c-.439.439-.439 1.15 0 1.588l2.12 2.121a1.125 1.125 0 001.588 0c.439-.439.439-1.15 0-1.588l-2.12-2.121z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom: Copyright */}
        <div className="border-t border-gray-200 mt-12 pt-4 text-center">
          <p className="text-gray-600 text-sm">
            &copy; {new Date().getFullYear()} Isholah360. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;