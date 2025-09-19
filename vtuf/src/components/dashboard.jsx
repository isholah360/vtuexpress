import React from 'react';
import { CreditCard, History, Smartphone, Plus, Wifi } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState} from 'react';

const Dashboard = ({ user, transactions = [], setActiveTab }) => {
  const [walletBalance, setWalletBalance] = React.useState(0);
  const [transaction, setTransaction] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  
  // Helper function to get fresh token and create headers
  const createAuthHeaders = () => {
    const token = localStorage.getItem('jwt');
    console.log('Current token:', token ? 'exists' : 'missing');
    console.log('Token preview:', token ? token.substring(0, 20) + '...' : 'none');
    
    if (!token) {
      throw new Error('No authentication token found');
    }
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  };

  // Handle authentication errors
  const handleAuthError = () => {
    console.log('Authentication error - clearing storage and redirecting');
    localStorage.removeItem('jwt');
    localStorage.removeItem('user'); // Clear user data too if you store it
    setError('Session expired. Please login again.');
    // Uncomment to auto-redirect
    // setTimeout(() => navigate('/login'), 2000);
  };

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const headers = createAuthHeaders();
        console.log('Fetching balance with headers:', Object.keys(headers));

        const res = await fetch('https://vtuexpress.onrender.com/api/wallet/balance', {
          method: 'GET',
          headers,
          credentials: 'include'
        });
        
        console.log('Balance fetch response status:', res.status);
        const data = await res.json();
        console.log('Balance fetch response:', data);
        
        if (res.status === 401) {
          console.log('401 error on balance fetch');
          handleAuthError();
          return;
        }
        
        if (res.ok && data.success) {
          setWalletBalance(data.data?.balance || 0);
          setError(''); // Clear any previous errors
        } else {
          console.error('Failed to fetch balance:', data.message);
          setError(data.message || 'Failed to fetch balance');
        }
      } catch (err) {
        console.error('Error fetching balance:', err.message);
        if (err.message.includes('token')) {
          handleAuthError();
        } else {
          setError(err.message || 'Failed to fetch balance');
        }
      }
    };

    // Only fetch if we have a token
    const currentToken = localStorage.getItem('jwt');
    if (currentToken) {
      fetchBalance();
    } else {
      setError('Authentication required. Please login again.');
    }
  }, []); // Remove token dependency to avoid re-fetching

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      try {
        const headers = createAuthHeaders();
        console.log('Fetching transactions with headers:', Object.keys(headers));

        const res = await fetch('https://vtuexpress.onrender.com/api/wallet/transactions', {
          method: 'GET',
          headers,
          credentials: 'include'
        });

        console.log('Transactions fetch response status:', res.status);
        const data = await res.json();
        console.log('Transactions fetch response:', data);

        if (res.status === 401) {
          console.log('401 error on transactions fetch');
          handleAuthError();
          setLoading(false);
          return;
        }

        if (!res.ok) throw new Error(data.message || 'Fetch failed');

        setTransaction(data.data?.transactions || []);
        setError(''); // Clear any previous errors
      } catch (err) {
        console.error('Error fetching transactions:', err.message);
        if (err.message.includes('token')) {
          handleAuthError();
        } else {
          setError(err.message || 'Something went wrong');
        }
      } finally {
        setLoading(false);
      }
    };

    // Only fetch if we have a token
    const currentToken = localStorage.getItem('jwt');
    if (currentToken) {
      fetchTransactions();
    } else {
      setError('Authentication required. Please login again.');
      setLoading(false);
    }
  }, []); // Remove token dependency

  
  // Safe calculation with fallback to empty array
  const totalSpent = transactions.reduce(
    (sum, t) => sum + (t.type !== 'wallet_funding' ? t.amount : 0),
    0
  );
  
 
  
  // Show error message if there's an authentication issue
  if (error && (error.includes('Authentication') || error.includes('Session'))) {
    return (
      <div className="space-y-6 relative top-0">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 mt-6">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-red-800 mb-2">Authentication Required</h2>
            <p className="text-red-600 mb-4">{error}</p>
            <button 
              onClick={() => navigate('/login')}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Login Again
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6 relative top-0">
      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-6">
          <p className="text-red-600">{error}</p>
        </div>
      )}

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
      <div className="bg-white rounded-lg shadow p-6 ">
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
        {loading ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Loading transactions...</p>
          </div>
        ) : (
          <div className="space-y-3">
            {transaction.length > 0 ? (
              transaction.slice(0, 3).map((trans) => (
                <div key={trans._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    {trans.type === 'wallet_funding' && <Plus className="h-5 w-5 text-green-500" />}
                    {trans.type === 'airtime_purchase' && <Smartphone className="h-5 w-5 text-blue-500" />}
                    {trans.type === 'data_purchase' && <Wifi className="h-5 w-5 text-purple-500" />}
                    <div>
                      <p className="font-medium">{trans.description}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(trans.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold ${trans.type === 'wallet_funding' ? 'text-green-600' : 'text-red-600'}`}>
                      {trans.type === 'wallet_funding' ? '+' : '-'}₦{trans.amount.toLocaleString()}
                    </p>
                    <span className={`inline-flex px-2 py-1 text-xs rounded-full ${
                      trans.status === 'completed' ? 'bg-green-100 text-green-800' : 
                      trans.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-red-100 text-red-800'
                    }`}>
                      {trans.status}
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
        )}
      </div>
    </div>
  );
};

export default Dashboard;