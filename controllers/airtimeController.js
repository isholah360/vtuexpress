// const Wallet = require('../models/Wallet');
// const Transaction = require('../models/Transaction');
// const vtpassService = require('../services/vtpassService');
// const { generateReference } = require('../utils/helpers');
// const ApiResponse = require('../utils/ApiResponse');
// const { TRANSACTION_TYPES, TRANSACTION_STATUS, NETWORKS } = require('../utils/constants');

// exports.buyAirtime = async (req, res) => {
//   const { phone, amount, network, request_id } = req.body;

//   const userId = req.user?.userId;

//   console.log(userId);    

//   if (!phone || !amount || !NETWORKS[network]) {
//     return ApiResponse.error(res, 'Invalid input', 400);
//   }

//   // try {
//   //   // Mock wallet for testing - create a proper wallet object
//   //   const wallet = {
//   //     balance: 2000,
//   //     save: async function() {
//   //       console.log('Mock wallet saved with balance:', this.balance);
//   //       return Promise.resolve();
//   //     }
//   //   };
//   try {
//     // Check wallet balance
//     const wallet = await Wallet.findOne({ userId });
//     if (!wallet || wallet.balance < amount) {
//       return ApiResponse.error(res, 'Insufficient wallet balance', 400);
//     }

//     console.log('User wallet:', wallet);

//     console.log('Wallet balance:', wallet.balance);

//     if (!wallet || wallet.balance < amount) {
//       return ApiResponse.error(res, 'Insufficient wallet balance', 400);
//     }

//     const reference = generateReference();

//     // Deduct from wallet & create pending transaction
//     wallet.balance -= amount;
//     await wallet.save();

//     const transaction = new Transaction({
//       userId,
//       type: TRANSACTION_TYPES.BUY_AIRTIME,
//       amount,
//       reference,
//       status: TRANSACTION_STATUS.PENDING,
//       details: { phone, network }
//     });
//     await transaction.save();

//     // Call VTPass
//     const vtpassResponse = await vtpassService.buyAirtime(phone, amount, network);

//     if (vtpassResponse.code !== '000') {
//       // Refund on failure
//       wallet.balance += amount;
//       await wallet.save();
      
//       transaction.status = TRANSACTION_STATUS.FAILED;
//       await transaction.save();
      
//       return ApiResponse.error(res, vtpassResponse.content || 'Airtime purchase failed');
//     }

//     transaction.status = TRANSACTION_STATUS.SUCCESS;
//     await transaction.save();
//     console.log('Transaction successful:', wallet.balance, transaction);
//     ApiResponse.success(res, {
//       ...vtpassResponse,
//       walletBalance: wallet.balance,
//       reference
//     }, 'Airtime purchased successfully');

//   } catch (error) {
//     console.error('Airtime purchase error:', error);
//     ApiResponse.error(res, error.message);
//   }
// };

const Wallet = require('../models/Wallet');
const Transaction = require('../models/Transaction');
const vtpassService = require('../services/vtpassService');
const { generateReference } = require('../utils/helpers');
const ApiResponse = require('../utils/ApiResponse');
const { TRANSACTION_TYPES, TRANSACTION_STATUS, NETWORKS } = require('../utils/constants');

exports.buyAirtime = async (req, res) => {
  const { phone, amount, network, request_id } = req.body;
  const userId = req.user?.userId;

  console.log('🧾 userId:', userId);
  console.log('📞 phone:', phone, '💵 amount:', amount, '📡 network:', network, '🆔 request_id:', request_id);

  if (!phone || !amount || !NETWORKS[network]) {
    return ApiResponse.error(res, 'Invalid input', 400);
  }

  const numericAmount = Number(amount);
  if (isNaN(numericAmount) || numericAmount <= 0) {
    return ApiResponse.error(res, 'Invalid amount', 400);
  }

  try {
    const wallet = await Wallet.findOne({ userId });
    console.log('💰 Wallet from DB:', wallet);

    if (!wallet || wallet.balance < numericAmount) {
      return ApiResponse.error(res, 'Insufficient wallet balance', 400);
    }

    const reference = generateReference();
    wallet.balance -= numericAmount;
    await wallet.save();

    const transaction = new Transaction({
      userId,
      type: TRANSACTION_TYPES.BUY_AIRTIME,
      amount: numericAmount,
      reference,
      status: TRANSACTION_STATUS.PENDING,
      details: { phone, network }
    });
    await transaction.save();

    const vtpassResponse = await vtpassService.buyAirtime(phone, numericAmount, network);

    if (vtpassResponse.code !== '000') {
      wallet.balance += numericAmount;
      await wallet.save();

      transaction.status = TRANSACTION_STATUS.FAILED;
      await transaction.save();

      return ApiResponse.error(res, vtpassResponse.content || 'Airtime purchase failed');
    }

    transaction.status = TRANSACTION_STATUS.SUCCESS;
    await transaction.save();

    return ApiResponse.success(res, {
      ...vtpassResponse,
      walletBalance: wallet.balance,
      reference
    }, 'Airtime purchased successfully');

  } catch (error) {
    console.error('Airtime purchase error:', error);
    return ApiResponse.error(res, error.message);
  }
};
