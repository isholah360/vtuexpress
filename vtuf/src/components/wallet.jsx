import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { CreditCard, Loader2, CheckCircle, XCircle } from "lucide-react";
import { updateWalletBalance } from '../redux/authSlice';

const FundWallet = () => {
  const dispatch = useDispatch();
  const { user, token } = useSelector(state => state.auth);
  const [searchParams, setSearchParams] = useSearchParams();
   const [walletBalance, setWalletBalance] = React.useState(0);
  
  const [amount, setAmount] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Payment verification states
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null);
  const [showVerificationModal, setShowVerificationModal] = useState(false);

    useEffect(() => {
    const fetchBalance = async () => {
      try {
        const res = await fetch('https://vtuexpress.onrender.com/api/wallet/balance', {
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include'
        });
        const data = await res.json();
        if (res.ok && data.success) {
          setWalletBalance(data.data.balance);
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
  }, []);

  // Check for payment callback on component mount
  useEffect(() => {
    const reference = searchParams.get("reference") || searchParams.get("trxref");
    const status = searchParams.get("status");
    
    if (reference && token) {
      console.log("Payment callback detected:", { reference, status });
      verifyPayment(reference);
      
      // Clean up URL parameters
      setSearchParams({});
    }
  }, [searchParams, token, setSearchParams]);

  const verifyPayment = async (reference) => {
    setIsVerifying(true);
    setShowVerificationModal(true);
    
    try {
      console.log("Verifying payment with reference:", reference);

      const response = await fetch("https://vtuexpress.onrender.com/api/wallet/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ reference }),
        credentials: "include",
      });

      const data = await response.json();
      console.log("Verification response:", data);

      if (data.success) {
        if (data.data.status === "success") {
          setVerificationResult({
            success: true,
            message: "Payment successful! Your wallet has been funded.",
            amount: data.data?.amount,
            newBalance: data.data?.balance
          });
          
          // Update wallet balance in Redux store
          dispatch(updateWalletBalance(data.data.balance));
          
          // Clean up stored payment data
          localStorage.removeItem("pendingPaymentReference");
          localStorage.removeItem("pendingPaymentAmount");
          
        } else {
          setVerificationResult({
            success: false,
            message: `Payment failed: ${data.data.reason || "Transaction was not successful"}`,
            amount: data.data.amount
          });
          
          // Clean up stored payment data
          localStorage.removeItem("pendingPaymentReference");
          localStorage.removeItem("pendingPaymentAmount");
        }
      } else {
        throw new Error(data.message || "Verification failed");
      }

    } catch (error) {
      console.error("Payment verification error:", error);
      setVerificationResult({
        success: false,
        message: "Failed to verify payment. Please contact support.",
        error: error.message
      });
      
      // Clean up stored payment data
      localStorage.removeItem("pendingPaymentReference");
      localStorage.removeItem("pendingPaymentAmount");
    } finally {
      setIsVerifying(false);
    }
  };

  const handlePaystackPayment = async () => {
    if (!user?.email) {
      alert("User email not found. Please try logging in again.");
      return;
    }

    console.log("Funding wallet for user:", user.email);
    
    if (!amount || parseFloat(amount) < 100) {
      alert("Minimum funding amount is ₦100");
      return;
    }

    setIsProcessing(true);

    try {
      const response = await fetch("https://vtuexpress.onrender.com/api/wallet/fund", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          amount: parseFloat(amount),
          email: user.email // Use email from Redux store
        }),
        credentials: "include",
      });

      const data = await response.json();

      if (data.success) {
        // Store payment reference for verification
        localStorage.setItem("pendingPaymentReference", data.data.reference);
        localStorage.setItem("pendingPaymentAmount", amount);

        console.log("Redirecting to Paystack:", data.data.authorization_url);
        
        // Redirect to Paystack payment page
        window.location.href = data.data.authorization_url;
      } else {
        throw new Error(data.message || "Payment initialization failed");
      }
    } catch (error) {
      alert("Payment initialization failed. Please try again.");
      console.error("Payment error:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const closeVerificationModal = () => {
    setShowVerificationModal(false);
    setVerificationResult(null);
  };

  const quickAmounts = [500, 1000, 2000, 5000, 10000];

  // If showing verification modal, render it
  if (showVerificationModal) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="max-w-md mx-4 bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="mb-6 flex justify-center">
            {isVerifying ? (
              <Loader2 className="h-16 w-16 text-blue-500 animate-spin" />
            ) : verificationResult?.success ? (
              <CheckCircle className="h-16 w-16 text-green-500" />
            ) : (
              <XCircle className="h-16 w-16 text-red-500" />
            )}
          </div>

          <h2 className={`text-2xl font-semibold mb-4 ${
            isVerifying ? 'text-blue-600' : 
            verificationResult?.success ? 'text-green-600' : 'text-red-600'
          }`}>
            {isVerifying ? "Verifying Payment" : 
             verificationResult?.success ? "Payment Successful!" : "Payment Failed"}
          </h2>

          <p className="text-gray-600 mb-6">
            {isVerifying ? "Please wait while we verify your payment..." : verificationResult?.message}
          </p>

          {!isVerifying && verificationResult && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Amount</p>
                  <p className="font-semibold">₦{verificationResult.amount?.toLocaleString()}</p>
                </div>
                {verificationResult.success && (
                  <div>
                    <p className="text-gray-500">New Balance</p>
                    <p className="font-semibold text-green-600">₦{verificationResult.newBalance?.toLocaleString()}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {!isVerifying && (
            <button
              onClick={closeVerificationModal}
              className={`w-full py-2 px-4 rounded-lg font-medium transition-colors text-white ${
                verificationResult?.success 
                  ? 'bg-green-600 hover:bg-green-700' 
                  : 'bg-red-600 hover:bg-red-700'
              }`}
            >
              {verificationResult?.success ? "Continue" : "Close"}
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-[7rem] bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-semibold mb-6 text-center">
        Fund Your Wallet
      </h2>

      <div className="mb-6">
        <p className="text-gray-600 mb-2">Current Balance</p>
        <p className="text-3xl font-bold text-green-600">
          ₦{(walletBalance || 0).toLocaleString()}
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Amount to Fund
          </label>
          <input
            type="text"
            value={amount}
            onChange={(e) => {
              const val = e.target.value;
              // Allow only numbers
              if (/^\d*$/.test(val)) {
                setAmount(val);
              }
            }}
            placeholder="Enter amount (min ₦100)"
            className="w-full px-3 py-2 border text-gray-700 font-extrabold border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <p className="text-sm text-gray-600 mb-2">Quick Select:</p>
          <div className="grid grid-cols-3 gap-2">
            {quickAmounts.map((quickAmount) => (
              <button
                key={quickAmount}
                onClick={() => setAmount(quickAmount.toString())}
                className="px-3 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50 transition-colors"
              >
                ₦{quickAmount.toLocaleString()}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handlePaystackPayment}
          disabled={isProcessing || !amount}
          className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
        >
          {isProcessing ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Processing...</span>
            </>
          ) : (
            <>
              <CreditCard className="h-5 w-5" />
              <span>Pay with Paystack</span>
            </>
          )}
        </button>

        <div className="text-xs text-gray-500 text-center">
          <p>Secured by Paystack. You can pay with:</p>
          <p className="mt-1">• Debit/Credit Cards • Bank Transfer • USSD</p>
        </div>
      </div>
    </div>
  );
};

export default FundWallet;