
const Wallet = require('../models/Wallet');
const Transaction = require('../models/Transaction');
const vtpassService = require('../services/vtpassService');
const { generateReference } = require('../utils/helpers');
const ApiResponse = require('../utils/ApiResponse');
const { TRANSACTION_TYPES, TRANSACTION_STATUS, NETWORKS } = require('../utils/constants');

exports.buyData = async (req, res) => {
  const { phone, planId, network, amount } = req.body;
  const userId = req.user.userId;
  

  if (!phone || !planId || !NETWORKS[network]) {
    return ApiResponse.error(res, 'Invalid input', 400);
  }

  try {
    // Get plan details to know amount
    const plans = await vtpassService.getDataPlans(network);
    const selectedPlan = plans.content.variations.find(p => p.variation_code === planId);
    if (!selectedPlan) {
      return ApiResponse.error(res, 'Invalid data plan');
    }

    const amount = parseFloat(selectedPlan.variation_amount);

    // Check wallet
    const wallet = await Wallet.findOne({ userId });
    console.log('User wallet:', wallet);
    if (!wallet || wallet.balance < amount) {
      return ApiResponse.error(res, 'Insufficient wallet balance', 400);
    }

    const reference = generateReference();

    wallet.balance -= amount;
    await wallet.save();

    const transaction = new Transaction({
      userId,
      type: TRANSACTION_TYPES.BUY_DATA,
      amount,
      reference,
      status: TRANSACTION_STATUS.PENDING,
      details: { phone, network, planId, planName: selectedPlan.name }
    });
    await transaction.save();

    // Call VTPass
    const vtpassResponse = await vtpassService.buyData(phone, planId, network, amount);

    if (vtpassResponse.code !== '000') {
      // Refund
      wallet.balance += amount;
      await wallet.save();
      transaction.status = TRANSACTION_STATUS.FAILED;
      await transaction.save();
      return ApiResponse.error(res, vtpassResponse.content || 'Data purchase failed');
    }

    transaction.status = TRANSACTION_STATUS.SUCCESS;
    await transaction.save();

    ApiResponse.success(res, vtpassResponse, 'Data purchased successfully');
  } catch (error) {
    ApiResponse.error(res, error.message);
  }
};

exports.getDataPlans = async (req, res) => {
  const { network } = req.params;

  if (!NETWORKS[network]) {
    return ApiResponse.error(res, 'Invalid network', 400);
  }

  try {
    const plans = await vtpassService.getDataPlans(network);
    ApiResponse.success(res, plans.content.variations);
  } catch (error) {
    ApiResponse.error(res, error.message);
  }
};