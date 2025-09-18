// Navigation.jsx
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Smartphone, Menu, X } from 'lucide-react';

const Navigation = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', path: '/dashboard' },
    { id: 'fund-wallet', label: 'Fund Wallet', path: '/fund-wallet' },
    { id: 'buy-airtime', label: 'Buy Airtime', path: '/buy-airtime' },
    { id: 'buy-data', label: 'Buy Data', path: '/buy-data' },
    { id: 'transactions', label: 'History', path: '/history' }
  ];

  const getActiveTab = () => {
    const current = menuItems.find(item => location.pathname.startsWith(item.path));
    return current?.id;
  };

  const activeTab = getActiveTab();

  return (
    <nav className="fixed top-0 left-0 w-full bg-blue-600 text-white shadow-lg z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-2">
            <Smartphone className="h-8 w-8" />
            <span className="text-xl font-bold">VTU Express</span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-6">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => navigate(item.path)}
                className={`px-3 py-2 rounded transition-colors ${
                  activeTab === item.id ? 'bg-blue-700' : 'hover:bg-blue-500'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden"
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4">
            <div className="flex flex-col space-y-2">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    navigate(item.path);
                    setMobileMenuOpen(false);
                  }}
                  className="text-left px-3 py-2 rounded hover:bg-blue-500 transition-colors"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
