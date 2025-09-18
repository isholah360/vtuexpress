import React, { useState, useEffect } from "react";
import { Smartphone, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const BuyAirtime = ({ updateUserBalance, addTransaction }) => {
  const [network, setNetwork] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [walletBalance, setWalletBalance] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const networks = [
    {
      id: "mtn",
      name: "MTN",
      color: "bg-yellow-500",
      logo: "https://images.seeklogo.com/logo-png/43/1/mtn-logo-png_seeklogo-431589.png",
    },
    {
      id: "glo",
      name: "Glo",
      color: "bg-green-500",
      logo: "https://images.seeklogo.com/logo-png/49/1/glo-limited-logo-png_seeklogo-491131.png",
    },
    {
      id: "airtel",
      name: "Airtel",
      color: "bg-red-500",
      logo: "https://images.seeklogo.com/logo-png/30/1/airtel-logo-png_seeklogo-305383.png",
    },
    {
      id: "9mobile",
      name: "9mobile",
      color: "bg-green-600",
      logo: "https://logosandtypes.com/wp-content/uploads/2020/10/9mobile-1.svg",
    },
  ];

  const quickAmounts = [100, 200, 500, 1000, 2000];

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/wallet/balance", {
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        const data = await res.json();

        if (res.ok && data.success) {
          setWalletBalance(data.data.balance);
          setError("");
        } else {
          console.error("Failed to fetch balance:", data.message);
          setError(data.message || "Failed to fetch balance");
        }
      } catch (err) {
        console.error("Error fetching balance:", err.message);
        setError("Network error. Please check your connection.");
      }
    };

    fetchBalance();
  }, []);

  const handlePurchase = async () => {
    if (!network || !phoneNumber || !amount) {
      alert("Please fill all fields");
      return;
    }

    if (parseFloat(amount) > walletBalance) {
      alert("Insufficient wallet balance");
      return;
    }

    setIsProcessing(true);

    try {
      const response = await fetch("http://localhost:5000/api/airtime/buy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          network,
          phone: phoneNumber,
          amount: parseFloat(amount),
        }),
        credentials: "include",
      });

      const data = await response.json();

      if (data.success) {
        setSuccessMessage("✅ Airtime purchase successful!");
        console.log(successMessage)

        const newBalance = walletBalance - parseFloat(amount);
        setWalletBalance(newBalance); // 🔁 Update local balance
        updateUserBalance?.(newBalance); // Optional external update if needed

        addTransaction?.({
          _id: Date.now().toString(),
          type: "airtime_purchase",
          amount: parseFloat(amount),
          status: "completed",
          description: `${network.toUpperCase()} Airtime - ${phoneNumber}`,
          createdAt: new Date().toISOString(),
        });

        // Reset form
        setAmount("");
        setPhoneNumber("");
        setNetwork("");

        // Delay navigation to show success message
        setTimeout(() => {
          navigate("/dashboard");
        }, 5000); // ⏱️ 2 second delay
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      alert("Purchase failed. Please try again.");
      console.error("Purchase error:", error);
    } finally {
      setIsProcessing(false);
    }
  };
  useEffect(() => {
    if (successMessage) setSuccessMessage("");
  }, [network, phoneNumber, amount]);

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow p-6 mt-[7rem] ">
      <h2 className="text-2xl font-semibold mb-6 text-center">Buy Airtime</h2>

      {error && (
        <div className="bg-red-100 text-red-700 p-2 mb-4 rounded text-sm">
          {error}
        </div>
      )}

      <div className="space-y-4">
        {/* Network Selection */}
        <div>
          {network && (
            <div className="flex justify-center mb-4">
              <img
                src={networks.find((n) => n.id === network)?.logo}
                alt={`${network} logo`}
                className="h-16 object-contain"
              />
            </div>
          )}

          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Network
          </label>
          <div className="grid grid-cols-2 gap-2">
            {networks.map((net) => (
              <button
                key={net.id}
                onClick={() => setNetwork(net.id)}
                className={`p-3 rounded-lg border-2 transition-colors ${
                  network === net.id
                    ? `${net.color} text-white border-transparent`
                    : "border-gray-300 hover:border-gray-400"
                }`}
              >
                {net.name}
              </button>
            ))}
          </div>
        </div>

        {/* Phone Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number
          </label>
          <input
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="08012345678"
            className="w-full px-3 py-2 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Amount Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Amount
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
            className="w-full px-3 py-2 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            min="50"
          />
          <div className="grid grid-cols-5 gap-1 mt-2">
            {quickAmounts.map((quickAmount) => (
              <button
                key={quickAmount}
                onClick={() => setAmount(quickAmount.toString())}
                className="px-2 py-1 text-xs border border-gray-300 rounded hover:bg-gray-50"
              >
                ₦{quickAmount}
              </button>
            ))}
          </div>
        </div>

        {/* Wallet Summary */}
        <div className="bg-gray-200 p-3 rounded-lg">
          <div className="flex justify-between text-sm">
            <span className="text-gray-700">Wallet Balance:</span>
            <span className="font-semibold text-green-600">
              ₦{walletBalance.toLocaleString()}
            </span>
          </div>

          {amount && !isNaN(parseFloat(amount)) && (
            <div className="flex justify-between text-sm mt-1">
              <span>After Purchase:</span>
              <span className="font-semibold text-green-600">
                ₦{(walletBalance - parseFloat(amount)).toLocaleString()}
              </span>
            </div>
          )}
        </div>

        {/* Purchase Button */}
        <button
          onClick={handlePurchase}
          disabled={isProcessing || !network || !phoneNumber || !amount}
          className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
        >
          {isProcessing ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Processing...</span>
            </>
          ) : (
            <>
              <Smartphone className="h-5 w-5" />
              <span>Purchase Airtime</span>
            </>
          )}
        </button>
           {successMessage && (
          <div className="text-green-600 text-sm mt-3 text-center">
            {successMessage}
          </div>
        )}
       
      </div>
    </div>
  );
};

export default BuyAirtime;
