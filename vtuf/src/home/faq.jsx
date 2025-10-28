import React, { useState } from 'react';

const FAq = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const faqs = [
    {
      question: "What is VTU?",
      answer: "VTU stands for 'Virtual Top-Up'. It’s a digital service that allows you to recharge airtime, buy data bundles, pay for cable TV subscriptions (like DSTV, GOTV), and settle electricity bills instantly online."
    },
    {
      question: "How fast are VTU transactions processed?",
      answer: "Most transactions (airtime, data, cable TV) are processed instantly—within seconds. Electricity bill payments may take up to 5 minutes depending on the distribution company."
    },
    {
      question: "Which networks do you support?",
      answer: "We support all major Nigerian networks: MTN, Airtel, Glo, and 9mobile. You can buy airtime and data for any of these providers."
    },
    {
      question: "Can I recharge someone else’s phone or TV?",
      answer: "Yes! Just enter the recipient’s phone number or smart card number during checkout. You’ll receive a confirmation once the transaction is successful."
    },
    {
      question: "Is my payment information secure?",
      answer: "Absolutely. We use bank-grade SSL encryption and comply with PCI-DSS standards. We never store your card details—payments are processed securely through trusted payment gateways."
    },
    {
      question: "What if my recharge fails but my account is debited?",
      answer: "Don’t worry! Failed transactions are automatically reversed within 24 hours. If it takes longer, contact our support team with your transaction reference—we’ll resolve it immediately."
    }
  ];

  return (
    <div className="bg-gray-50 font-sans px-[5%]">
      
      <section className="container mx-auto px-4 py-12 md:py-16">
        <div className="flex flex-col lg:flex-row gap-12 items-start">

          {/* Left Column - FAQ List */}
          <div className="lg:w-1/2 space-y-4">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
              Customer Questions: Expressed in the voice of our customers.
            </h1>

            {faqs.map((faq, index) => (
              <div 
                key={index} 
                className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm"
              >
                <button
                  className="flex justify-between items-center w-full p-5 text-left hover:bg-gray-50 transition"
                  onClick={() => toggleAccordion(index)}
                  aria-expanded={activeIndex === index}
                >
                  <span className="font-medium text-gray-800">{faq.question}</span>
                  <svg
                    className={`w-5 h-5 text-gray-500 transform transition-transform ${
                      activeIndex === index ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div
                  className={`transition-all duration-300 ease-in-out overflow-hidden ${
                    activeIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="px-5 pb-5 text-gray-600">
                    {faq.answer}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right Column - Description + Image */}
          <div className="lg:w-1/2 space-y-6">
            <p className="text-gray-700 leading-relaxed">
              VTU Hub provides seamless virtual top-up services, including airtime, data bundles, cable TV subscriptions, and electricity bill payments — all in one place.
            </p>

            {/* Placeholder Image (Replace with real image URL) */}
            <div className="rounded-xl overflow-hidden shadow-lg">
              <img 
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                alt="Customer using VTU service" 
                className="w-full h-auto object-cover"
              />
            </div>
          </div>

        </div>
      </section>
    </div>
  );
};

export default FAq;