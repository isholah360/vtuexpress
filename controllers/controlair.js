const vtpassService = require('../services/vtpassService');

exports.testVTPass = async (req, res) => {
  const { phone, amount, network, request_id } = req.body;
  
  try {
    console.log('🧪 Testing VTPass directly...');
    const vtpassResponse = await vtpassService.buyAirtime(phone, amount, network, request_id);
    
    console.log('🧪 Direct VTPass response:', JSON.stringify(vtpassResponse, null, 2));
    
    res.json({
      success: true,
      vtpassResponse,
      message: `VTPass returned code: ${vtpassResponse.code}`
    });
    
  } catch (error) {
    console.error('🧪 Direct VTPass error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      stack: error.stack
    });
  }
};