const Transaction = require('../models/Transaction');
const ApiResponse = require('../utils/ApiResponse');

exports.getTransactionHistory = async (req, res) => {
  const userId = req.user?.id;
  const { page = 1, limit = 10 } = req.query;

  try {
    const transactions = await Transaction.find({ userId })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Transaction.countDocuments({ userId });

    ApiResponse.success(res, {
      transactions,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    ApiResponse.error(res, error.message);
  }
};