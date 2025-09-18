const axios = require("axios");

const vtpassService = {
  generateRequestId: () => {
  const now = new Date();
  const timestamp = now.getTime(); // milliseconds since epoch
  const randomStr = Math.random().toString(36).substring(2, 10); // 8 characters
  return `${timestamp}-${randomStr}`;
},
  // Buy Airtime
  buyAirtime: async (phone, amount, network, customRequestId = null) => {
    try {
      const requestId = customRequestId || vtpassService.generateRequestId();
      const payload = {
        request_id: requestId,
        serviceID: network,
        phone: phone,
        amount: amount.toString(),
      };

      const headers = {
        "api-key": process.env.VTPASS_API_KEY,
        "secret-key": process.env.VTPASS_SECRET_KEY,
        "public-key": process.env.VTPASS_PUBLIC_KEY,
      };
      console.log("🔑 Headers:", JSON.stringify(headers, null, 2));

      const response = await axios.post(
        `${process.env.VTPASS_BASE_URL}/pay`,
        payload,
        { headers }
      );

      console.log(
        "✅ VTPass Response:",
        JSON.stringify(response.data, null, 2)
      );
      return response.data;
    } catch (error) {
      console.error("❌ VTPass Airtime Error:", error.response?.data);

      // Return the actual error response from VTPass
      if (error.response?.data) {
        return error.response.data;
      }

      throw new Error(
        error.response?.data?.response_description ||
          error.message ||
          "VTPass airtime failed"
      );
    }
  },

  // Buy Data
  buyData: async (phone, planId, network, amount, customRequestId = null) => {
    try {
      const requestId = customRequestId || vtpassService.generateRequestId();
      
      console.log('🚀 VTPass Data Request:');
      console.log('📞 Phone:', phone);
      console.log('📊 Plan ID:', planId);
      console.log('🌐 Network:', network);
      console.log('🌐 amount:', amount);


      const payload = {
        request_id: requestId,
        serviceID: `${network}-data`, // e.g., 'mtn-data'
        phone: phone, // FIXED: was 'billersCode'
        variation_code: planId, // e.g., '1000mb'
        amount: amount // FIXED: VTPass requires amount > 0, even for data
      };

      const headers = {
        'api-key': process.env.VTPASS_API_KEY, // FIXED
        'secret-key': process.env.VTPASS_SECRET_KEY, // ADDED
        'public-key': process.env.VTPASS_PUBLIC_KEY, // FIXED
        'Content-Type': 'application/json'
      };

      const response = await axios.post(
        `${process.env.VTPASS_BASE_URL}/pay`,
        payload,
        { headers }
      );

      console.log('✅ VTPass Data Response:', JSON.stringify(response.data, null, 2));
      return response.data;

    } catch (error) {
      console.error('❌ VTPass Data Error:', error.response?.data);
      
      if (error.response?.data) {
        return error.response.data;
      }
      
      throw new Error(error.response?.data?.response_description || error.message || "VTPass data failed");
    }
  },

  // Query available data plans
  getDataPlans: async (network) => {
    try {
      const response = await axios.get(
        `${process.env.VTPASS_BASE_URL}/service-variations?serviceID=${network}-data`,
        {
          headers: {
            "api-key": process.env.VTPASS_API_KEY,
            "secret-key": process.env.VTPASS_SECRET_KEY,
            "public-key": process.env.VTPASS_PUBLIC_KEY,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      throw new Error("Failed to fetch data plans");
    }
  },
};

module.exports = vtpassService;
