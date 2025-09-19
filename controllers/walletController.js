
const Wallet = require('../models/Wallet');
const Transaction = require('../models/Transaction');
const paystackService = require('../services/paystackService');
const { generateReference } = require('../utils/helpers');
const ApiResponse = require('../utils/ApiResponse');
const { TRANSACTION_TYPES, TRANSACTION_STATUS } = require('../utils/constants');

exports.initializeFundWallet = async (req, res) => {
  try {
    const { email, amount } = req.body;
    console.log(email, amount);
    const userId = req.user?.userId;

    // Basic validation
    if (!userId) {
      return ApiResponse.error(res, 'User authentication required', 401);
    }

    if (!email || !amount || amount <= 0) {
      return ApiResponse.error(res, 'Valid email and amount are required', 400);
    }

    const reference = generateReference();
    console.log('Generated Reference:', reference);

    // Save pending transaction
    const transaction = new Transaction({
      userId,
      type: TRANSACTION_TYPES.FUND_WALLET,
      amount: parseFloat(amount),
      reference,
      status: TRANSACTION_STATUS.PENDING,
      metadata: { email }
    });
    
    await transaction.save();
    console.log('Transaction saved:', transaction._id);

    // Initialize Paystack payment
    const paystackResponse = await paystackService.initializePayment(
      email,
      parseFloat(amount),
      reference,
      // `${process.env.REACT_APP_API_URL || 'http://localhost:5173'}/fund-wallet`
    );


    return ApiResponse.success(res, {
      authorization_url: paystackResponse.data.authorization_url,
      access_code: paystackResponse.data.access_code,
      reference,
      amount: parseFloat(amount),
      instructions: {
        step1: "Visit the authorization_url to complete payment",
        step2: "After successful payment, call the verify endpoint",
        step3: "Only then will the wallet be credited"
      }
    }, 'Payment initialization successful');

  } catch (error) {
    console.error('Initialize fund wallet error:', error);
    return ApiResponse.error(res, error.message || 'Failed to initialize payment', 500);
  }
};

exports.verifyAndCreditWallet = async (req, res) => {
  try {
    const { reference } = req.query.reference ? req.query : req.body;

    console.log('=== PAYMENT VERIFICATION DEBUG ===');
    console.log('Reference:', reference);

    if (!reference) {
      return ApiResponse.error(res, 'Payment reference is required', 400);
    }

    // Find the transaction first
    const transaction = await Transaction.findOne({ reference });
    console.log('Transaction found:', transaction ? 'YES' : 'NO');
    
    if (!transaction) {
      return ApiResponse.error(res, 'Transaction not found', 404);
    }

    // Check if already processed
    if (transaction.status === TRANSACTION_STATUS.SUCCESS) {
      console.log('Transaction already processed successfully');
      const wallet = await Wallet.findOne({ userId: transaction.userId });
      return ApiResponse.success(res, { 
        balance: wallet?.balance || 0,
        message: 'Transaction already processed'
      });
    }

    // Verify with Paystack
    console.log('Calling Paystack verification...');
    const paystackData = await paystackService.verifyPayment(reference);

    const { status, amount, gateway_response } = paystackData.data;

    if (status === 'success') {
      console.log('=== PAYMENT SUCCESSFUL - CREDITING WALLET ===');
      
      const amountInNaira = amount / 100; // Convert kobo to naira
      console.log('Amount to credit:', amountInNaira);
      
      // Verify amount matches
      if (Math.abs(amountInNaira - transaction.amount) > 0.01) {
        console.error('Amount mismatch!', { 
          expected: transaction.amount, 
          received: amountInNaira 
        });
        return ApiResponse.error(res, 'Payment amount verification failed', 400);
      }

      // Find or create wallet
      let wallet = await Wallet.findOne({ userId: transaction.userId });
      const previousBalance = wallet?.balance || 0;
      
      if (!wallet) {
        console.log('Creating new wallet for user:', transaction.userId);
        wallet = new Wallet({ 
          userId: transaction.userId, 
          balance: 0 
        });
      }

      wallet.balance += amountInNaira;
      await wallet.save();

      // Update transaction
      transaction.status = TRANSACTION_STATUS.SUCCESS;
      transaction.completedAt = new Date();
      await transaction.save();

      console.log('Wallet credited successfully:', {
        userId: transaction.userId,
        previousBalance,
        newBalance: wallet.balance,
        creditedAmount: amountInNaira
      });

      return ApiResponse.success(res, { 
        balance: wallet.balance,
        amount: transaction.amount,
        status: TRANSACTION_STATUS.SUCCESS,
        previousBalance,
        creditedAmount: amountInNaira
      }, 'Wallet funded successfully');

    } else {
      console.log('=== PAYMENT FAILED ===');
      console.log('Gateway response:', gateway_response);
      
      // Update transaction to failed
      transaction.status = TRANSACTION_STATUS.FAILED;
      transaction.failureReason = gateway_response;
      await transaction.save();

      return ApiResponse.success(res, { 
        balance: 0,
        amount: transaction.amount,
        status: TRANSACTION_STATUS.FAILED,
        reason: gateway_response || 'Payment was not successful'
      }, 'Payment verification completed - Payment failed');
    }

  } catch (error) {
    console.error('Payment verification error:', error);
    return ApiResponse.error(res, error.message || 'Payment verification failed', 500);
  }
};

// Add this new endpoint for easier testing
exports.getTransactionStatus = async (req, res) => {
  try {
    const { reference } = req.params;
    
    const transaction = await Transaction.findOne({ reference });
    if (!transaction) {
      return ApiResponse.error(res, 'Transaction not found', 404);
    }

    const wallet = await Wallet.findOne({ userId: transaction.userId });

    return ApiResponse.success(res, {
      transaction: {
        reference: transaction.reference,
        amount: transaction.amount,
        status: transaction.status,
        createdAt: transaction.createdAt,
        completedAt: transaction.completedAt,
        failureReason: transaction.failureReason
      },
      wallet: {
        balance: wallet?.balance || 0
      }
    }, 'Transaction status retrieved');

  } catch (error) {
    console.error('Get transaction status error:', error);
    return ApiResponse.error(res, error.message, 500);
  }
};

// Get wallet balance
exports.getWalletBalance = async (req, res) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return ApiResponse.error(res, 'User authentication required', 401);
    }

    const wallet = await Wallet.findOne({ userId });
    const balance = wallet?.balance || 0;

    console.log('Wallet balance:', balance);

    return ApiResponse.success(res, { balance }, 'Wallet balance retrieved');
  } catch (error) {
    console.error('Get wallet balance error:', error);
    return ApiResponse.error(res, 'Failed to retrieve wallet balance', 500);
  }
};

// Get transaction history
exports.getTransactionHistory = async (req, res) => {
  try {
    const userId = req.user?.userId;
    const { page = 1, limit = 20, type, status } = req.query;

    console.log('=== GET TRANSACTION HISTORY ===');
    console.log('User ID:', userId);

    if (!userId) {
      return ApiResponse.error(res, 'User authentication required', 401);
    }

    const query = { userId };
    if (type) query.type = type;
    if (status) query.status = status;

    const skip = (page - 1) * limit;
    
    const [transactions, total] = await Promise.all([
      Transaction.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .select('-__v'),
      Transaction.countDocuments(query)
    ]);

    console.log('Transactions found:', transactions.length);

    return ApiResponse.success(res, {
      transactions,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalTransactions: total,
        hasNext: skip + transactions.length < total,
        hasPrev: page > 1
      }
    }, 'Transaction history retrieved');

  } catch (error) {
    console.error('Get transaction history error:', error);
    return ApiResponse.error(res, 'Failed to retrieve transaction history', 500);
  }
};

// Handle Paystack webhook
exports.handlePaystackWebhook = async (req, res) => {
  try {
    console.log('=== PAYSTACK WEBHOOK RECEIVED ===');
    console.log('Headers:', req.headers);
    console.log('Body:', req.body);

    const hash = req.headers['x-paystack-signature'];
    const body = JSON.stringify(req.body);
    
    // Verify webhook signature
    const crypto = require('crypto');
    const expectedHash = crypto
      .createHmac('sha512', process.env.PAYSTACK_SECRET_KEY)
      .update(body)
      .digest('hex');

    if (hash !== expectedHash) {
      console.error('Invalid webhook signature');
      return res.status(400).send('Invalid signature');
    }

    const event = req.body;
    console.log('Webhook event:', event.event);
    
    if (event.event === 'charge.success') {
      await this.processWebhookPayment(event.data);
      console.log('Processed successful payment webhook');
    }

    res.status(200).send('OK');
  } catch (error) {
    console.error('Webhook processing error:', error);
    res.status(500).send('Webhook processing failed');
  }
};

// Process webhook payment
exports.processWebhookPayment = async (paymentData) => {
  try {
    const { reference, amount, status } = paymentData;
    
    console.log('=== PROCESSING WEBHOOK PAYMENT ===');
    console.log('Reference:', reference);
    console.log('Amount:', amount);
    console.log('Status:', status);
    
    if (status !== 'success') return;

    const transaction = await Transaction.findOne({ reference });
    if (!transaction || transaction.status === TRANSACTION_STATUS.SUCCESS) {
      console.log('Transaction not found or already processed');
      return;
    }

    // Credit wallet
    let wallet = await Wallet.findOne({ userId: transaction.userId });
    if (!wallet) {
      wallet = new Wallet({ userId: transaction.userId, balance: 0 });
    }

    const previousBalance = wallet.balance;
    const amountInNaira = amount / 100;
    wallet.balance += amountInNaira;
    await wallet.save();

    // Update transaction
    transaction.status = TRANSACTION_STATUS.SUCCESS;
    transaction.completedAt = new Date();
    await transaction.save();

    console.log('Webhook payment processed:', {
      reference,
      previousBalance,
      newBalance: wallet.balance,
      creditedAmount: amountInNaira
    });

  } catch (error) {
    console.error('Process webhook payment error:', error);
  }
};

// Add this test endpoint to simulate successful payment (ONLY FOR TESTING)
exports.simulatePaymentSuccess = async (req, res) => {
  try {
    const { reference } = req.body;
    
    console.log('=== SIMULATING SUCCESSFUL PAYMENT (TEST ONLY) ===');
    console.log('Reference:', reference);

    const transaction = await Transaction.findOne({ reference });
    if (!transaction) {
      return ApiResponse.error(res, 'Transaction not found', 404);
    }

    if (transaction.status === TRANSACTION_STATUS.SUCCESS) {
      return ApiResponse.error(res, 'Transaction already processed', 400);
    }

    // Find or create wallet
    let wallet = await Wallet.findOne({ userId: transaction.userId });
    if (!wallet) {
      wallet = new Wallet({ userId: transaction.userId, balance: 0 });
    }

    const previousBalance = wallet.balance;
    wallet.balance += transaction.amount;
    await wallet.save();

    // Update transaction
    transaction.status = TRANSACTION_STATUS.SUCCESS;
    transaction.completedAt = new Date();
    await transaction.save();

    console.log('Simulated payment completed:', {
      reference,
      amount: transaction.amount,
      previousBalance,
      newBalance: wallet.balance
    });

    return ApiResponse.success(res, {
      message: 'Payment simulated successfully',
      balance: wallet.balance,
      amount: transaction.amount,
      previousBalance
    });

  } catch (error) {
    console.error('Simulate payment error:', error);
    return ApiResponse.error(res, error.message, 500);
  }
};

