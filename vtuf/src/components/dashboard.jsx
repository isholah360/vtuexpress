// import React from 'react';
// import { CreditCard, History, Smartphone, Plus, Wifi } from 'lucide-react';
// import { useNavigate } from 'react-router-dom';
// import { useEffect, useState} from 'react';


// const Dashboard = ({ user, transactions = [], setActiveTab }) => {
//   const [walletBalance, setWalletBalance] = React.useState(0);
//   const [transaction, setTransaction] = useState([]);
//   const [loading, setLoading] = useState(true);
// const [error, setError] = useState('');
//   const token = localStorage.getItem('jwt'); 
//   console.log('User data in Dashboard:', token);

//   useEffect(() => {
//   const fetchBalance = async () => {
//     try {
//       const res = await fetch('https://vtuexpress.onrender.com/api/wallet/balance', {
//         headers: {
//           'Content-Type': 'application/json', 
//           'Authorization': `Bearer ${token}`
//         },
//         credentials: 'include'
//       });
//       const data = await res.json();
//       if (res.ok && data.success) {
//         setWalletBalance(data.data?.balance);
//       } else {
//         console.error('Failed to fetch balance:', data.message);
//         setError(data.message || 'Failed to fetch balance');
//       }
//     } catch (err) {
//       console.error('Error fetching balance:', err.message);
//       setError(err.message || 'Failed to fetch balance');
//     }
//   };

//   fetchBalance();
// }, []);

//    useEffect(() => {
//   const fetchTransactions = async () => {
//     setLoading(true);
//     try {
//       const res = await fetch('https://vtuexpress.onrender.com/api/wallet/transactions', {
//         headers: {
//           'Content-Type': 'application/json'
//         },
//         credentials: 'include'
//       });

//       const data = await res.json();

//       if (!res.ok) throw new Error(data.message || 'Fetch failed');

//       setTransaction(data.data?.transactions || []);
//     } catch (err) {
//       console.error(err.message);
//       setError(err.message || 'Something went wrong');
//     } finally {
//       setLoading(false);
//     }
//   };

//   fetchTransactions();
// }, []);

  
//   // Safe calculation with fallback to empty array
//   const totalSpent = transactions.reduce(
//     (sum, t) => sum + (t.type !== 'wallet_funding' ? t.amount : 0),
//     0
//   );
//  const navigate = useNavigate(); 
//   return (
    
//     <div className="space-y-6 relative top-0">
//       {/* Welcome Section */}
//       <div className="bg-white rounded-lg shadow p-6 mt-6 mb-3">
//         <h2 className="text-2xl font-bold mb-4 mt-10">
//           Welcome back, {user?.firstName || 'User'}!
//         </h2>
        
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//           <div className="bg-gradient-to-r from-green-400 to-green-600 rounded-lg p-6 text-white">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-green-100">Wallet Balance</p>
//                 <p className="text-2xl font-bold">
//                   ₦{(walletBalance || 0).toLocaleString()}
//                 </p>
//               </div>
//               <CreditCard className="h-8 w-8 text-green-200" />
//             </div>
//           </div>

//           <div className="bg-gradient-to-r from-blue-400 to-blue-600 rounded-lg p-6 text-white">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-blue-100">Total Transactions</p>
//                 <p className="text-2xl font-bold">{transaction.length}</p>
//               </div>
//               <History className="h-8 w-8 text-blue-200" />
//             </div>
//           </div>

//           <div className="bg-gradient-to-r from-purple-400 to-purple-600 rounded-lg p-6 text-white">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-purple-100">This Month</p>
//                 <p className="text-2xl font-bold">₦{totalSpent.toLocaleString()}</p>
//               </div>
//               <Smartphone className="h-8 w-8 text-purple-200" />
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Quick Actions */}
//       <div className="bg-white rounded-lg shadow p-6 ">
//         <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
//         <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//           <button 
//             onClick={() => navigate('/fund-wallet')}
//             className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-lg text-center transition-colors"
//           >
//             <Plus className="h-6 w-6 mx-auto mb-2" />
//             Fund Wallet
//           </button>
//           <button 
//             onClick={() => navigate('/buy-airtime')}
//             className="bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-lg text-center transition-colors"
//           >
//             <Smartphone className="h-6 w-6 mx-auto mb-2" />
//             Buy Airtime
//           </button>
//           <button 
//             onClick={() => navigate('/buy-data')}
//             className="bg-purple-500 hover:bg-purple-600 text-white p-4 rounded-lg text-center transition-colors"
//           >
//             <Wifi className="h-6 w-6 mx-auto mb-2" />
//             Buy Data
//           </button>
//           <button 
//             onClick={() => navigate('/history')}
//             className="bg-gray-500 hover:bg-gray-600 text-white p-4 rounded-lg text-center transition-colors"
//           >
//             <History className="h-6 w-6 mx-auto mb-2" />
//             History
//           </button>
//         </div>
//       </div>

//       {/* Recent Transactions */}
//       <div className="bg-white rounded-lg shadow p-6">
//         <h3 className="text-lg font-semibold mb-4">Recent Transactions</h3>
//         <div className="space-y-3">
//           {transactions.length > 0 ? (
//             transactions.slice(0, 3).map((transaction) => (
//               <div key={transaction._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
//                 <div className="flex items-center space-x-3">
//                   {transaction.type === 'wallet_funding' && <Plus className="h-5 w-5 text-green-500" />}
//                   {transaction.type === 'airtime_purchase' && <Smartphone className="h-5 w-5 text-blue-500" />}
//                   {transaction.type === 'data_purchase' && <Wifi className="h-5 w-5 text-purple-500" />}
//                   <div>
//                     <p className="font-medium">{transaction.description}</p>
//                     <p className="text-sm text-gray-500">
//                       {new Date(transaction.createdAt).toLocaleDateString()}
//                     </p>
//                   </div>
//                 </div>
//                 <div className="text-right">
//                   <p className={`font-semibold ${transaction.type === 'wallet_funding' ? 'text-green-600' : 'text-red-600'}`}>
//                     {transaction.type === 'wallet_funding' ? '+' : '-'}₦{transaction.amount.toLocaleString()}
//                   </p>
//                   <span className={`inline-flex px-2 py-1 text-xs rounded-full ${
//                     transaction.status === 'completed' ? 'bg-green-100 text-green-800' : 
//                     transaction.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
//                     'bg-red-100 text-red-800'
//                   }`}>
//                     {transaction.status}
//                   </span>
//                 </div>
//               </div>
//             ))
//           ) : (
//             <div className="text-center py-8 text-gray-500">
//               <History className="h-12 w-12 mx-auto mb-4 text-gray-300" />
//               <p>No transactions yet</p>
//               <p className="text-sm">Your recent transactions will appear here</p>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;


import React from 'react';
import { CreditCard, History, Smartphone, Plus, Wifi, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';

const Dashboard = ({ user, transactions = [], setActiveTab }) => {
  const [walletBalance, setWalletBalance] = React.useState(0);
  const [transaction, setTransaction] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Payment verification states
  const [paymentNotification, setPaymentNotification] = useState(null);
  const [isVerifyingPayment, setIsVerifyingPayment] = useState(false);
  
  const token = localStorage.getItem('jwt');
  const navigate = useNavigate();
  const location = useLocation();
  
  console.log('User data in Dashboard:', token);

  // Payment verification on dashboard load
  useEffect(() => {
    const checkForPaymentCallback = () => {
      console.log('=== CHECKING FOR PAYMENT CALLBACK ON DASHBOARD ===');
      console.log('Current URL:', window.location.href);
      console.log('Location search:', location.search);
      
      // Check URL parameters for payment callback
      const urlParams = new URLSearchParams(location.search);
      const reference = urlParams.get("reference") || urlParams.get("trxref");
      const status = urlParams.get("status");
      
      console.log('Payment params found:', { reference, status });
      
      if (reference) {
        console.log("Payment callback detected on dashboard, verifying...");
        verifyPayment(reference);
        
        // Clean up URL parameters
        navigate('/dashboard', { replace: true });
      } else {
        // Also check localStorage for any pending payments (fallback)
        const pendingRef = localStorage.getItem("pendingPaymentReference");
        if (pendingRef) {
          console.log("Found pending payment in storage, verifying...");
          verifyPayment(pendingRef);
        }
      }
    };

    // Check for payment callback when dashboard loads
    checkForPaymentCallback();
  }, [location.search, navigate]);

  // Verify payment function
  const verifyPayment = async (reference) => {
    if (isVerifyingPayment) return; // Prevent duplicate calls
    
    setIsVerifyingPayment(true);
    
    try {
      console.log("Verifying payment with reference:", reference);

      const response = await fetch('https://vtuexpress.onrender.com/api/wallet/verify', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ reference }),
        credentials: "include",
      });

      const data = await response.json();
      console.log("Verification response:", data);

      if (data.success) {
        if (data.data.status === "success") {
          // Show success notification
          setPaymentNotification({
            type: 'success',
            title: 'Payment Successful!',
            message: `Your wallet has been funded with ₦${data.data.amount?.toLocaleString()}`,
            amount: data.data.amount,
            newBalance: data.data.balance
          });
          
          // Update wallet balance immediately
          setWalletBalance(data.data.balance);
          
          // Refresh transactions to show the new one
          fetchTransactions();
          
          // Clean up stored payment data
          localStorage.removeItem("pendingPaymentReference");
          localStorage.removeItem("pendingPaymentAmount");
          localStorage.removeItem("pendingPaymentTime");
          
        } else {
          // Show failure notification
          setPaymentNotification({
            type: 'error',
            title: 'Payment Failed',
            message: data.data.reason || "Transaction was not successful",
            amount: data.data.amount
          });
          
          // Clean up stored payment data
          localStorage.removeItem("pendingPaymentReference");
          localStorage.removeItem("pendingPaymentAmount");
          localStorage.removeItem("pendingPaymentTime");
        }
      } else {
        throw new Error(data.message || "Verification failed");
      }

    } catch (error) {
      console.error("Payment verification error:", error);
      setPaymentNotification({
        type: 'error',
        title: 'Verification Error',
        message: "Failed to verify payment. Please contact support.",
        error: error.message
      });
    } finally {
      setIsVerifyingPayment(false);
    }
  };

  // Close payment notification
  const closePaymentNotification = () => {
    setPaymentNotification(null);
  };

  // Fetch wallet balance
  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const res = await fetch('https://vtuexpress.onrender.com/api/wallet/balance', {
          headers: {
            'Content-Type': 'application/json', 
            'Authorization': `Bearer ${token}`
          },
          credentials: 'include'
        });
        const data = await res.json();
        if (res.ok && data.success) {
          setWalletBalance(data.data?.balance);
        } else {
          console.error('Failed to fetch balance:', data.message);
          setError(data.message || 'Failed to fetch balance');
        }
      } catch (err) {
        console.error('Error fetching balance:', err.message);
        setError(err.message || 'Failed to fetch balance');
      }
    };

    fetchBalance();
  }, [token]);

  // Fetch transactions - moved to separate function for reuse
  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const res = await fetch('https://vtuexpress.onrender.com/api/wallet/transactions', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include'
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || 'Fetch failed');

      setTransaction(data.data?.transactions || []);
    } catch (err) {
      console.error(err.message);
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [token]);
  
  // Safe calculation with fallback to empty array
  const totalSpent = transaction.reduce(
    (sum, t) => sum + (t.type !== 'FUND_WALLET' && t.type !== 'wallet_funding' ? t.amount : 0),
    0
  );

  return (
    <>
      {/* Payment Verification Loading Overlay */}
      {isVerifyingPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-500" />
            <p className="text-gray-600">Verifying your payment...</p>
          </div>
        </div>
      )}

      {/* Payment Notification */}
      {paymentNotification && (
        <div className={`fixed top-4 right-4 max-w-md bg-white rounded-lg shadow-lg border-l-4 p-4 z-50 ${
          paymentNotification.type === 'success' ? 'border-l-green-500' : 'border-l-red-500'
        }`}>
          <div className="flex items-start">
            <div className="flex-shrink-0">
              {paymentNotification.type === 'success' ? (
                <CheckCircle className="h-6 w-6 text-green-500" />
              ) : (
                <XCircle className="h-6 w-6 text-red-500" />
              )}
            </div>
            <div className="ml-3 flex-1">
              <h3 className={`text-sm font-semibold ${
                paymentNotification.type === 'success' ? 'text-green-800' : 'text-red-800'
              }`}>
                {paymentNotification.title}
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                {paymentNotification.message}
              </p>
              {paymentNotification.newBalance && (
                <p className="text-xs text-green-600 mt-1 font-semibold">
                  New Balance: ₦{paymentNotification.newBalance.toLocaleString()}
                </p>
              )}
            </div>
            <button
              onClick={closePaymentNotification}
              className="ml-4 text-gray-400 hover:text-gray-600 text-xl"
            >
              ×
            </button>
          </div>
        </div>
      )}

      <div className="space-y-6 relative top-0">
        {/* Welcome Section */}
        <div className="bg-white rounded-lg shadow p-6 mt-6 mb-3">
          <h2 className="text-2xl font-bold mb-4 mt-10">
            Welcome back, {user?.firstName || 'User'}!
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-r from-green-400 to-green-600 rounded-lg p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100">Wallet Balance</p>
                  <p className="text-2xl font-bold">
                    ₦{(walletBalance || 0).toLocaleString()}
                  </p>
                </div>
                <CreditCard className="h-8 w-8 text-green-200" />
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-400 to-blue-600 rounded-lg p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100">Total Transactions</p>
                  <p className="text-2xl font-bold">{transaction.length}</p>
                </div>
                <History className="h-8 w-8 text-blue-200" />
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-400 to-purple-600 rounded-lg p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100">This Month</p>
                  <p className="text-2xl font-bold">₦{totalSpent.toLocaleString()}</p>
                </div>
                <Smartphone className="h-8 w-8 text-purple-200" />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button 
              onClick={() => navigate('/fund-wallet')}
              className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-lg text-center transition-colors"
            >
              <Plus className="h-6 w-6 mx-auto mb-2" />
              Fund Wallet
            </button>
            <button 
              onClick={() => navigate('/buy-airtime')}
              className="bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-lg text-center transition-colors"
            >
              <Smartphone className="h-6 w-6 mx-auto mb-2" />
              Buy Airtime
            </button>
            <button 
              onClick={() => navigate('/buy-data')}
              className="bg-purple-500 hover:bg-purple-600 text-white p-4 rounded-lg text-center transition-colors"
            >
              <Wifi className="h-6 w-6 mx-auto mb-2" />
              Buy Data
            </button>
            <button 
              onClick={() => navigate('/history')}
              className="bg-gray-500 hover:bg-gray-600 text-white p-4 rounded-lg text-center transition-colors"
            >
              <History className="h-6 w-6 mx-auto mb-2" />
              History
            </button>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Transactions</h3>
          <div className="space-y-3">
            {loading ? (
              <div className="text-center py-8">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-500" />
                <p className="text-gray-500">Loading transactions...</p>
              </div>
            ) : transaction.length > 0 ? (
              transaction.slice(0, 3).map((trans) => (
                <div key={trans._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    {(trans.type === 'FUND_WALLET' || trans.type === 'wallet_funding') && <Plus className="h-5 w-5 text-green-500" />}
                    {trans.type === 'airtime_purchase' && <Smartphone className="h-5 w-5 text-blue-500" />}
                    {trans.type === 'data_purchase' && <Wifi className="h-5 w-5 text-purple-500" />}
                    <div>
                      <p className="font-medium">{trans.description || `${trans.type} transaction`}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(trans.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold ${
                      (trans.type === 'FUND_WALLET' || trans.type === 'wallet_funding') ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {(trans.type === 'FUND_WALLET' || trans.type === 'wallet_funding') ? '+' : '-'}₦{trans.amount.toLocaleString()}
                    </p>
                    <span className={`inline-flex px-2 py-1 text-xs rounded-full ${
                      trans.status === 'SUCCESS' || trans.status === 'completed' ? 'bg-green-100 text-green-800' : 
                      trans.status === 'PENDING' || trans.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-red-100 text-red-800'
                    }`}>
                      {trans.status.toLowerCase()}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <History className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No transactions yet</p>
                <p className="text-sm">Your recent transactions will appear here</p>
              </div>
            )}
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}
      </div>
    </>
  );
};

export default Dashboard;