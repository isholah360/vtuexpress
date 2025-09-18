// Test your VTPass service directly
const vtpassService = require('./controlair');

async function testVTPass() {
  try {
    const response = await vtpassService.buyAirtime('08011111111', 100, 'glo', '20250909162122xlzo');
    console.log('VTPass test response:', response);
  } catch (error) {
    console.error('VTPass test error:', error);
  }
}

testVTPass();