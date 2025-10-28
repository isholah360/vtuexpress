import React from 'react';

const Security = () => {
  return (
    <div className="bg-gray-50 py-12 px-[5%] md:py-16">
      <div className="container bg-white rounded-xl p-8 md:p-12 shadow-sm relative overflow-hidden">
        
        {/* Background decorative curves */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-50 rounded-full opacity-30 -z-10"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-50 rounded-full opacity-30 -z-10"></div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-12 items-start">

          {/* Left Column: Headline & CTA */}
          <div className="lg:w-1/2 space-y-6">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
              We are a <br />
              <span className="text-green-600">strategic choice</span>
            </h1>
            <p className="text-gray-600 leading-relaxed w-3/4">
              We’re on a mission to bring transparency to VTU services — airtime, data, electricity, and cable TV payments — and show you upfront what you’re getting.
            </p>
            <button className="mt-[35%] px-6 py-3 bg-green-700 text-white rounded-full hover:bg-green-800 transition flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A6 6 0 007 12v1a2 2 0 002 2h6a2 2 0 002-2V9a5.002 5.002 0 00-10.001 0z" clipRule="evenodd" />
              </svg>
              Watch Video Guide
            </button>
          </div>

          {/* Right Column: Feature Grid */}
          <div className="lg:w-1/2 grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Feature 1: Security Teams */}
            <div className="flex flex-col items-start gap-4 p-10 rounded-lg bg-gray-50 hover:bg-gray-100 transition">
              <div className="p-3 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v3m-6-6h12a2 2 0 002-2V7a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Security Teams</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Our security team monitors every VTU transaction to keep your money safe — 24/7.
                </p>
              </div>
            </div>

            {/* Feature 2: Authentication */}
            <div className="flex flex-col items-start gap-4 p-10 rounded-lg bg-gray-50 hover:bg-gray-100 transition">
              <div className="p-3 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v3m-6-6h12a2 2 0 002-2V7a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Authentication</h3>
                <p className="text-sm text-gray-600 mt-1">
                  We use OTP + biometric authentication to protect your account from unauthorized access.
                </p>
              </div>
            </div>

            {/* Feature 3: Safety Funds */}
            <div className="flex flex-col items-start gap-4 p-10 rounded-lg bg-gray-50 hover:bg-gray-100 transition">
              <div className="p-3 bg-purple-100 rounded-full flex items-center justify-center">
                <svg className="w-7 h-7 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m-2 13l-4-4m4 4l4-4" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Safety Funds</h3>
                <p className="text-sm text-gray-600 mt-1">
                  All customer funds are held in trusted financial institutions — never mixed with operational cash.
                </p>
              </div>
            </div>

            {/* Feature 4: Account Place */}
            <div className="flex flex-col items-start gap-4 p-10 rounded-lg bg-gray-50 hover:bg-gray-100 transition">
              <div className="p-3 bg-orange-100 rounded-full flex items-center justify-center">
                <svg className="w-7 h-7 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h-2v-2a6 6 0 00-5.356-5.356L9 12H7v2H5v2h2v2H9v2h2v-2h2v-2h2v-2h2v2h2v2z" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Account Place</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Manage all your VTU services — airtime, data, bills — in one secure, unified dashboard.
                </p>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

export default Security;