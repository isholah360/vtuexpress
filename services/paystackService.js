
const axios = require('axios');
const { formatAmount } = require('../utils/helpers');

const PAYSTACK_BASE_URL = 'https://api.paystack.co';

// Create axios instance with default config
const paystackAxios = axios.create({
  baseURL: PAYSTACK_BASE_URL,
  timeout: 10000, // 10 seconds timeout
  headers: {
    'Authorization': `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
    'Content-Type': 'application/json'
  }
});


paystackAxios.interceptors.request.use(
  (config) => {
    console.log(`Paystack API Call: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('Paystack request error:', error);
    return Promise.reject(error);
  }
);


paystackAxios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('Paystack API Error:', {
      status: error.response?.status,
      message: error.response?.data?.message,
      url: error.config?.url
    });
    return Promise.reject(error);
  }
);

const paystackService = {
  initializePayment: async (email, amount, reference, callback_url, metadata = {}) => {
    try {
      // Input validation
      if (!email || !amount || !reference) {
        throw new Error('Email, amount, and reference are required');
      }

      if (amount <= 0) {
        throw new Error('Amount must be greater than 0');
      }

      const payload = {
        email,
        amount: Math.round(amount * 100), // Convert to kobo and ensure integer
        reference,
        callback_url,
        metadata: {
          ...metadata,
          custom_fields: [
            {
              display_name: "Transaction Reference",
              variable_name: "transaction_reference",
              value: reference
            }
          ]
        },
        channels: ['card', 'bank', 'ussd', 'qr', 'mobile_money', 'bank_transfer']
      };

      console.log('Paystack payment initialization:', { 
        email, 
        amount: payload.amount, 
        reference 
      });

      const response = await paystackAxios.post('/transaction/initialize', payload);

      if (!response.data.status) {
        throw new Error(response.data.message || 'Payment initialization failed');
      }

      return response.data;
    } catch (error) {
      console.error('Paystack initialization error:', error);
      
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      
      throw new Error('Payment initialization failed. Please try again.');
    }
  },

  verifyPayment: async (reference) => {
    try {
      if (!reference) {
        throw new Error('Payment reference is required');
      }

      console.log('Verifying payment with reference:', reference);

      const response = await paystackAxios.get(`/transaction/verify/${encodeURIComponent(reference)}`);

      if (!response.data.status) {
        throw new Error(response.data.message || 'Payment verification failed');
      }

      return response.data;
    } catch (error) {
      console.error('Paystack verification error:', error);
      
      if (error.response?.status === 404) {
        throw new Error('Transaction not found');
      }
      
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      
      throw new Error('Payment verification failed. Please try again.');
    }
  },

  getTransaction: async (transactionId) => {
    try {
      const response = await paystackAxios.get(`/transaction/${transactionId}`);
      
      if (!response.data.status) {
        throw new Error(response.data.message || 'Failed to get transaction');
      }

      return response.data;
    } catch (error) {
      console.error('Get transaction error:', error);
      throw new Error(error.response?.data?.message || 'Failed to get transaction details');
    }
  },

  /**
   * List transactions
   */
  listTransactions: async (params = {}) => {
    try {
      const response = await paystackAxios.get('/transaction', { params });
      
      if (!response.data.status) {
        throw new Error(response.data.message || 'Failed to list transactions');
      }

      return response.data;
    } catch (error) {
      console.error('List transactions error:', error);
      throw new Error(error.response?.data?.message || 'Failed to list transactions');
    }
  }
};

module.exports = paystackService;