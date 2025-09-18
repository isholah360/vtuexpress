const app = require('./app');
const connectDB = require('./db/connection');
const dotenv = require('dotenv');
const path = require('path');
const Port = process.env.PORT || 5000;
const cookieParser = require('cookie-parser');
app.use(cookieParser());

// Connect to DB
connectDB();

// Start server
const server = app.listen( Port, () => {
  console.log(`🚀 Server running on port ${Port}`);
});


process.on('unhandledRejection', (err, promise) => {
  console.log(`❌ Unhandled Rejection: ${err.message}`);
  server.close(() => process.exit(1));
});