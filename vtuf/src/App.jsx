
// import React, { useEffect, useState } from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import { useDispatch, useSelector } from 'react-redux';
// import { loginSuccess, logout } from './redux/authSlice';
// import Signup from './components/Signup';
// import Signin from './components/signin';
// import Dashboard from './components/dashboard';
// import FundWallet from './components/wallet';
// import BuyAirtime from './components/buyAirtime';
// import BuyData from './buyData';
// import Transaction from './components/transaction';
// import Navigation from './components/navigation';

// const App = () => {
//   const dispatch = useDispatch();
//   const { isAuthenticated } = useSelector((state) => state.auth);
//   const [isAuthChecked, setIsAuthChecked] = useState(false);

//   // Fetch user profile on app load to verify session via cookie
//   useEffect(() => {
//     const checkAuthStatus = async () => {
//       try {
//         const response = await fetch('/api/wallet/transactions', {
//           method: 'GET',
//           credentials: 'include', // Send cookie
//         });

//         if (response.ok) {
//           const data = await response.json();
//           if (data.success && data.user) {
//             localStorage.setItem('user', JSON.stringify(data.user));
//             dispatch(loginSuccess({ token: 'cookie-based', user: data.user }));
//           } else {
//             // Invalid session (no user)
//             handleLogout();
//           }
//         } else {
//           // Cookie missing or expired
//           handleLogout();
//         }
//       } catch (error) {
//         console.error('Auth check failed:', error);
//         handleLogout();
//       } finally {
//         setIsAuthChecked(true);
//       }
//     };

//     checkAuthStatus();
//   }, [dispatch]);

//   const handleLogout = () => {
//     localStorage.removeItem('user');
//     dispatch(logout());
//   };

//   const ProtectedRoute = ({ children }) => {
//     if (!isAuthChecked) {
//       return (
//         <div className="min-h-screen flex items-center justify-center">
//           <div className="text-center">
//             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
//             <p className="mt-4 text-gray-600">Checking authentication...</p>
//           </div>
//         </div>
//       );
//     }

//     if (!isAuthenticated) {
//       return <Navigate to="/login" replace />;
//     }

//     return children;
//   };

//   return (
//     <Router>
//       <Routes>
//         {/* Public Routes */}
//         <Route path="/register" element={<Signup />} />
//         <Route path="/login" element={<Signin />} />

//         {/* Protected Routes */}
//         <Route
//           path="/*"
//           element={
//             <ProtectedRoute>
//               <>
//                 <Navigation />
//                 <div className="main-content">
//                   <Routes>
//                     <Route path="/dashboard" element={<Dashboard />} />
//                     <Route path="/fund-wallet" element={<FundWallet />} />
//                     <Route path="/buy-airtime" element={<BuyAirtime />} />
//                     <Route path="/buy-data" element={<BuyData />} />
//                     <Route path="/history" element={<Transaction />} />
//                     <Route path="/" element={<Navigate to="/dashboard" replace />} />
//                   </Routes>
//                 </div>
//               </>
//             </ProtectedRoute>
//           }
//         />
//       </Routes>
//     </Router>
//   );
// };

// export default App;


import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginSuccess } from './redux/authSlice';
// ... your other imports

const App = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector(state => state.auth);
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  // Check if we have authentication cookies/tokens
  const hasAuthCookie = () => {
    return document.cookie
      .split(';')
      .some(cookie => cookie.trim().startsWith('token=') || cookie.trim().startsWith('jwt='));
  };

  // Preserve payment callback URL if user isn't authenticated YET
  const preservePaymentCallback = () => {
    const currentUrl = window.location.href;
    const isPaymentCallback = currentUrl.includes('trxref=') || currentUrl.includes('reference=');
    
    if (isPaymentCallback) {
      console.log('Payment callback detected, preserving URL:', currentUrl);
      localStorage.setItem('paymentCallbackUrl', currentUrl);
      return true;
    }
    return false;
  };

  // Check authentication on app load
  useEffect(() => {
    const initializeAuth = async () => {
      console.log('=== INITIALIZING AUTH ===');
      
      // First, check if this is a payment callback and preserve it
      const isPaymentCallback = preservePaymentCallback();
      
      // Get stored user data
      const userString = localStorage.getItem('user');
      const hasAuth = hasAuthCookie();
      
      console.log('User in localStorage:', !!userString);
      console.log('Auth cookie exists:', hasAuth);
      console.log('Is payment callback:', isPaymentCallback);

      try {
        const storedUser = userString ? JSON.parse(userString) : null;

        if (hasAuth && storedUser) {
          console.log('Auth found, logging in user');
          dispatch(loginSuccess({ 
            token: 'cookie-based',
            user: storedUser 
          }));
        } else if (hasAuth && !storedUser) {
          console.log('Cookie found but no user data, fetching profile...');
          await fetchUserProfile();
        } else if (isPaymentCallback) {
          // Special case: payment callback but no auth - try to fetch profile anyway
          console.log('Payment callback without auth, attempting to fetch profile...');
          await fetchUserProfile();
        } else {
          console.log('No authentication found');
        }
      } catch (error) {
        console.error("Failed to parse user from localStorage", error);
        localStorage.removeItem('user');
      } finally {
        setIsAuthChecked(true);
      }
    };

    initializeAuth();
  }, [dispatch]);

  // Restore payment callback after authentication
  useEffect(() => {
    if (isAuthenticated && isAuthChecked) {
      const savedUrl = localStorage.getItem('paymentCallbackUrl');
      if (savedUrl) {
        console.log('Restoring payment callback URL:', savedUrl);
        localStorage.removeItem('paymentCallbackUrl');
        
        // Extract just the path and query params
        try {
          const url = new URL(savedUrl);
          const pathWithQuery = url.pathname + url.search;
          window.history.replaceState({}, '', pathWithQuery);
          
          // Force a re-render to trigger the dashboard payment detection
          window.location.reload();
        } catch (error) {
          console.error('Error parsing saved URL:', error);
          window.location.href = savedUrl;
        }
      }
    }
  }, [isAuthenticated, isAuthChecked]);

  const fetchUserProfile = async () => {
    try {
      const response = await fetch('https://vtuexpress.onrender.com/api/auth/profile', {
        method: 'GET',
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.user) {
          localStorage.setItem('user', JSON.stringify(data.user));
          dispatch(loginSuccess({ 
            token: 'cookie-based',
            user: data.user 
          }));
          return true;
        }
      } else {
        console.log('Failed to fetch user profile');
        return false;
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return false;
    }
  };

  // Enhanced Protected Route
  const ProtectedRoute = ({ children }) => {
    // Show loading while checking auth
    if (!isAuthChecked) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
            {localStorage.getItem('paymentCallbackUrl') && (
              <p className="text-sm text-blue-600 mt-2">Restoring your payment session...</p>
            )}
          </div>
        </div>
      );
    }
    
    if (!isAuthenticated) {
      console.log('Not authenticated, redirecting to signin');
      return <Navigate to="/signin" replace />;
    }
    
    return children;
  };

  return (
    <Router>
      <div className="app">
        <Routes>
          {/* Public Routes */}
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<Signin />} />
          
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
      </div>
    </Router>
  );
};

export default App;
