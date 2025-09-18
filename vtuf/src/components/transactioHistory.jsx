import React, { useEffect, useState } from 'react';
import { History, Plus, Smartphone, Wifi } from 'lucide-react';

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch transactions on mount
  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      setError('');
      try {
        const token = localStorage.getItem('jwt');
        const res = await fetch('http://localhost:5000/api/wallet/transaction', {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || 'Failed to fetch transactions');
        }

        setTransactions(data.transactions || []);
      } catch (err) {
        setError(err.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  // Render UI
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-semibold mb-6">Transaction History</h2>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <div className="text-red-500 text-center">{error}</div>
      ) : transactions.length === 0 ? (
        <div className="text-center py-8">
          <History className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No transactions yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {transactions.map((transaction) => (
            <div
              key={transaction._id}
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center space-x-4">
                <div
                  className={`p-2 rounded-full ${
                    transaction.type === 'wallet_funding'
                      ? 'bg-green-100'
                      : transaction.type === 'airtime_purchase'
                      ? 'bg-blue-100'
                      : 'bg-purple-100'
                  }`}
                >
                  {transaction.type === 'wallet_funding' && (
                    <Plus className="h-5 w-5 text-green-600" />
                  )}
                  {transaction.type === 'airtime_purchase' && (
                    <Smartphone className="h-5 w-5 text-blue-600" />
                  )}
                  {transaction.type === 'data_purchase' && (
                    <Wifi className="h-5 w-5 text-purple-600" />
                  )}
                </div>

                <div>
                  <h3 className="font-medium">{transaction.description}</h3>
                  <p className="text-sm text-gray-500">
                    {new Date(transaction.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <p
                  className={`font-semibold ${
                    transaction.type === 'wallet_funding'
                      ? 'text-green-600'
                      : 'text-red-600'
                  }`}
                >
                  {transaction.type === 'wallet_funding' ? '+' : '-'}₦
                  {transaction.amount.toLocaleString()}
                </p>

                <span
                  className={`inline-flex px-2 py-1 text-xs rounded-full ${
                    transaction.status === 'completed' || "success"
                      ? 'bg-green-100 text-green-800'
                      : transaction.status === 'failed'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {transaction.status}
                </span>
              </div>
            </div>
          ))}

          <div className="text-center pt-4">
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              Load More Transactions
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionHistory;
