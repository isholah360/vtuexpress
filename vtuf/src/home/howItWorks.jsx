import React from "react";

const HowItWorks = () => {
  return (
    <div className="bg-white py-12 px-[5%] md:py-16">
      <div className="container ">
        {/* Heading */}
        <h1 className="text-3xl pb-8 md:text-4xl font-bold text-gray-900 text-center mb-8">
          3 Simple Steps to Use Our VTU Payment System
        </h1>

        {/* Main Content - Flex for Desktop, Stack for Mobile */}
        <div className="flex flex-col pt-5 lg:flex-row gap-12 items-start">
          {/* Left Column: Steps */}
          <div className="lg:w-1/2 space-y-8">
            {/* Step 1 */}
            <div className="flex items-start gap-4">
              <div className="p-3 bg-green-100 rounded-full flex items-center justify-center text-green-700 font-bold">
                1
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  Create Your Account
                </h3>
                <p className="text-gray-600 mt-2">
                  Enter your basic details, verify your phone number, and
                  securely link your bank account or card. Set up is fast —
                  you’ll be ready to transact within minutes.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex items-start gap-4">
              <div className="p-3 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold">
                2
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  Fund Your Account
                </h3>
                <p className="text-gray-600 mt-2">
                  Safely fund your account using any ATM card of your choice.
                  All transactions are encrypted and processed through trusted
                  payment gateways for your peace of mind.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex items-start gap-4">
              <div className="p-3 bg-purple-100 rounded-full flex items-center justify-center text-purple-700 font-bold">
                3
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  Start Your Transaction
                </h3>
                <p className="text-gray-600 mt-2">
                  With everything set, you’re ready to make secure payments —
                  recharge airtime, buy data bundles, pay DSTV/GOTV, or settle
                  electricity bills — with just a few taps.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Image (Hidden on Mobile) */}
          <div className="lg:w-1/2 hidden lg:block">
            <div className="rounded-xl overflow-hidden shadow-lg">
              <img
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="VTU App Interface"
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
