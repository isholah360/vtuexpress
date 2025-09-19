
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginSuccess, logout } from './redux/authSlice';
import Signup from './components/Signup';
import Signin from './components/signin';
import Dashboard from './components/dashboard';
import FundWallet from './components/wallet';
import BuyAirtime from './components/buyAirtime';
import BuyData from './buyData';
import Transaction from './components/transaction';
import Navigation from './components/navigation';

const App = () => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  // Fetch user profile on app load to verify session via cookie
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await fetch('/api/auth/profile', {
          method: 'GET',
          credentials: 'include', // Send cookie
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success && data.user) {
            localStorage.setItem('user', JSON.stringify(data.user));
            dispatch(loginSuccess({ token: 'cookie-based', user: data.user }));
          } else {
            // Invalid session (no user)
            handleLogout();
          }
        } else {
          // Cookie missing or expired
          handleLogout();
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        handleLogout();
      } finally {
        setIsAuthChecked(true);
      }
    };

    checkAuthStatus();
  }, [dispatch]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    dispatch(logout());
  };

  const ProtectedRoute = ({ children }) => {
    if (!isAuthChecked) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Checking authentication...</p>
          </div>
        </div>
      );
    }

    if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
    }

    return children;
  };

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/register" element={<Signup />} />
        <Route path="/login" element={<Signin />} />

        {/* Protected Routes */}
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <>
                <Navigation />
                <div className="main-content">
                  <Routes>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/fund-wallet" element={<FundWallet />} />
                    <Route path="/buy-airtime" element={<BuyAirtime />} />
                    <Route path="/buy-data" element={<BuyData />} />
                    <Route path="/history" element={<Transaction />} />
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                  </Routes>
                </div>
              </>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
