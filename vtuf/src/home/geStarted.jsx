import React from 'react';
import { Link } from 'react-router-dom'; // ← Use this if you're using React Router

// If you're NOT using React Router, replace <Link> with <a href="/signup">

const GetStarted = () => {
  return (
    <section className="bg-gradient-to-br from-gray-600 via-gray-500 to-gray-600 py-16 px-4 md:py-24">
      <div className="max-w-3xl mx-auto text-center">
        {/* Headline */}
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Ready to Get Started?
        </h2>

        {/* Subtitle */}
        <p className="text-white/80 text-lg md:text-xl mb-8 leading-relaxed">
          Take control of your financial transactions with VTU Express. Our intuitive platform makes it easy to manage payments, track spending, and ensure secure transactions.
        </p>

        {/* CTA Button - Links to Signup */}
        <Link
          to="/register" // 👈 Change this if your signup route is different
          className="inline-block px-6 py-3 bg-white text-emerald-900 font-medium rounded-full hover:bg-gray-100 transition shadow-lg"
        >
          Get Started
        </Link>
      </div>
    </section>
  );
};

export default GetStarted;