import React, { useState, useEffect } from "react";
import { Wifi, Loader2 } from "lucide-react";

const BuyData = ({ user, updateUserBalance, addTransaction }) => {
  const [network, setNetwork] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [dataPlans, setDataPlans] = useState([]);
  const [isLoadingPlans, setIsLoadingPlans] = useState(false);
  const [plansError, setPlansError] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [walletBalance, setWalletBalance] = React.useState(0);
  const [success, setSuccess] = React.useState(0);
  console.log(selectedPlan?.variation_code);

  console.log(selectedPlan?.variation_amount);
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
      id: "etisalat",
      name: "9mobile",
      color: "bg-green-600",
      logo: "https://logosandtypes.com/wp-content/uploads/2020/10/9mobile-1.svg",
    },
  ];

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
        } else {
          console.error("Failed to fetch balance:", data.message);
          setError(data.message || "Failed to fetch balance");
        }
      } catch (err) {
        console.error("Error fetching balance:", err.message);
        setError(err.message || "Failed to fetch balance");
      }
    };

    fetchBalance();
  }, []);

  const fetchPlans = async (network) => {
    setIsLoadingPlans(true);
    setPlansError("");
    setDataPlans([]);
    setSelectedPlan(null);

    try {
      const res = await fetch(
        `http://localhost:5000/api/data/plans/${network}`
      );
      const data = await res.json();

      if (res.ok && data.success) {
        setDataPlans(data.data || []);
        console.log("Data plans set:", data.data || []);
      } else {
        throw new Error(data.message || "Failed to load data plans");
      }
    } catch (err) {
      console.error("Error fetching plans:", err);
      setPlansError("Could not load data plans. Please try again.");
    } finally {
      setIsLoadingPlans(false);
    }
  };

  const handlePurchase = async () => {
    if (!network || !phoneNumber || !selectedPlan) {
      alert("Please fill all fields");
      return;
    }

    if (selectedPlan?.variation_amount > (walletBalance || 0)) {
      alert("Insufficient wallet balance");
      return;
    }

    setIsProcessing(true);

    try {
      const response = await fetch("http://localhost:5000/api/data/buy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          network,
          phone: phoneNumber,
          planId: selectedPlan?.variation_code,
          amount: selectedPlan?.variation_amount,
        }),
        credentials: "include", // Include cookies for authentication
      });

      const data = await response.json();

      if (data.success) {
        setSuccess("Data purchase successful!");
        updateUserBalance(
          (walletBalance || 0) - selectedPlan?.variation_amount
        );
        addTransaction({
          _id: Date.now().toString(),
          type: "data_purchase",
          amount: selectedPlan?.variation_amount,
          status: "completed",
          description: `${network.toUpperCase()} ${
            selectedPlan.name
          } Data - ${phoneNumber}`,
          createdAt: new Date().toISOString(),
        });

        // Reset form
        setPhoneNumber("");
        setNetwork("");
        setSelectedPlan(null);
        setDataPlans([]);
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
       success ? alert("Purchase failed. Please try again.") : "";
      console.error("Purchase error:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <div className="w-full bg-white rounded-lg shadow p-6 mt-[5rem] ">
        <h2 className="text-2xl font-semibold mb-6 text-center">Buy Data</h2>
        {network && (
          <div className="flex justify-center mb-4">
            <img
              src={networks.find((n) => n.id === network)?.logo}
              alt={`${network} logo`}
              className="h-16 object-contain"
            />
          </div>
        )}
        <div className="space-y-4">
          {/* Network Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Network
            </label>
            <div className="grid grid-cols-2 gap-2">
              {networks.map((net) => (
                <button
                  key={net.id}
                  onClick={() => {
                    setNetwork(net.id);
                    fetchPlans(net.id);
                  }}
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

          {/* Phone Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="08012345678"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Data Plans */}
          {network && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Data Plan
              </label>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {isLoadingPlans ? (
                  <div className="text-center text-sm text-gray-500">
                    Loading plans...
                  </div>
                ) : plansError ? (
                  <div className="text-center text-red-500 text-sm">
                    {plansError}
                  </div>
                ) : dataPlans.length > 0 ? (
                  dataPlans.map((plan) => (
                    <button
                      key={plan.variation_code}
                      onClick={() => setSelectedPlan(plan)}
                      className={`w-full p-3 border rounded-lg text-left transition-colors ${
                        selectedPlan?.variation_code === plan?.variation_code
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-300 hover:border-gray-400"
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">{plan.name}</p>
                          <p className="text-sm text-gray-500 ml-[5rem]">
                            {plan.validity}
                          </p>
                        </div>
                        {/* <p className="font-semibold text-blue-600">₦{plan.amount}</p> */}
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="text-center text-sm text-gray-500">
                    No data plans available
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Wallet Info */}
          {selectedPlan && (
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="flex justify-between text-sm">
                <span>Wallet Balance:</span>
                <span className="font-semibold">
                  ₦{(walletBalance || 0).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-sm mt-1">
                <span>After Purchase:</span>
                <span className="font-semibold">
                  ₦
                  {(
                    (walletBalance || 0) - selectedPlan.variation_amount
                  ).toLocaleString()}
                </span>
              </div>
            </div>
          )}

          {/* Purchase Button */}
          <button
            onClick={handlePurchase}
            disabled={
              isProcessing ||
              !network ||
              !phoneNumber ||
              !selectedPlan ||
              isLoadingPlans
            }
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Processing...</span>
               
              </>
            ) : (
              <>
                <Wifi className="h-5 w-5" />
                <span>Purchase Data</span>
              </>
            )}
          </button>
          {success && (
            <div className="text-green-600 mt-3 text-center font-medium">
              ✅ Data Successfully Purchased!
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default BuyData;
