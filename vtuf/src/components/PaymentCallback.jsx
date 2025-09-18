// components/PaymentCallback.js
import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { updateWalletBalance } from '../redux/authSlice'; // You may need to create this action

const PaymentCallback = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const { token } = useSelector(state => state.auth);
  
console.log("PaymentCallback loaded. Token:", searchParams);

  const [status, setStatus] = useState("verifying");
  const [message, setMessage] = useState("Verifying your payment...");
  const [paymentDetails, setPaymentDetails] = useState(null);

  useEffect(() => {
    if (token) {
      verifyPayment();
    }
  }, [token]);

  const verifyPayment = async () => {
    try {
      // Get reference from URL params or localStorage
      const reference = searchParams.get("reference") || 
                       searchParams.get("trxref") || 
                       localStorage.getItem("pendingPaymentReference");

      if (!reference) {
        setStatus("error");
        setMessage("Payment reference not found");
        return;
      }

      console.log("Verifying payment with reference:", reference);

      // Call your backend verification endpoint
      const response = await fetch("/api/wallet/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ reference }),
      });

      const data = await response.json();
      console.log("Verification response:", data);

      if (data.success) {
        setPaymentDetails({
          amount: data.data.amount,
          balance: data.data.balance,
          status: data.data.status
        });

        if (data.data.status === "success") {
          setStatus("success");
          setMessage("Payment successful! Your wallet has been funded.");
          
          // Update wallet balance in Redux store
          dispatch(updateWalletBalance(data.data.balance));

          // Clean up stored data
          localStorage.removeItem("pendingPaymentReference");
          localStorage.removeItem("pendingPaymentAmount");

          // Auto-redirect after 3 seconds
          setTimeout(() => {
            navigate("/dashboard");
          }, 3000);

        } else {
          setStatus("failed");
          setMessage(`Payment failed: ${data.data.reason || "Transaction was not successful"}`);
          
          // Clean up stored data
          localStorage.removeItem("pendingPaymentReference");
          localStorage.removeItem("pendingPaymentAmount");
        }
      } else {
        throw new Error(data.message || "Verification failed");
      }

    } catch (error) {
      console.error("Payment verification error:", error);
      setStatus("error");
      setMessage("Failed to verify payment. Please contact support.");
      
      // Clean up stored data
      localStorage.removeItem("pendingPaymentReference");
      localStorage.removeItem("pendingPaymentAmount");
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case "verifying":
        return <Loader2 className="h-16 w-16 text-blue-500 animate-spin" />;
      case "success":
        return <CheckCircle className="h-16 w-16 text-green-500" />;
      case "failed":
      case "error":
        return <XCircle className="h-16 w-16 text-red-500" />;
      default:
        return <Loader2 className="h-16 w-16 text-blue-500 animate-spin" />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case "success":
        return "text-green-600";
      case "failed":
      case "error":
        return "text-red-600";
      default:
        return "text-blue-600";
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="mb-6 flex justify-center">
          {getStatusIcon()}
        </div>

        <h2 className={`text-2xl font-semibold mb-4 ${getStatusColor()}`}>
          {status === "verifying" && "Verifying Payment"}
          {status === "success" && "Payment Successful!"}
          {status === "failed" && "Payment Failed"}
          {status === "error" && "Verification Error"}
        </h2>

        <p className="text-gray-600 mb-6">{message}</p>

        {paymentDetails && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Amount</p>
                <p className="font-semibold">₦{paymentDetails.amount?.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-gray-500">New Balance</p>
                <p className="font-semibold text-green-600">₦{paymentDetails.balance?.toLocaleString()}</p>
              </div>
            </div>
          </div>
        )}

        {status !== "verifying" && (
          <div className="space-y-3">
            <button
              onClick={() => navigate("/dashboard")}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
            >
              Go to Dashboard
            </button>
            
            <button
              onClick={() => navigate("/fund-wallet")}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
            >
              Go to Wallet
            </button>
            
            {status === "failed" && (
              <button
                onClick={() => navigate("/fund-wallet")}
                className="w-full bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
              >
                Try Again
              </button>
            )}
          </div>
        )}

        {status === "success" && (
          <p className="text-sm text-gray-500 mt-4">
            Redirecting to dashboard in 3 seconds...
          </p>
        )}
      </div>
    </div>
  );
};

export default PaymentCallback;