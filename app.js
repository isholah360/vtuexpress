// src/app.js
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');
dotenv.config();
const cookieParser = require('cookie-parser');
const path = require('path');


const walletRoutes = require('./routes/walletRoutes');
const airtimeRoutes = require('./routes/airtimeRoutes');
const dataRoutes = require('./routes/dataRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const authRoutes = require('./routes/authRoutes');



const app = express();


// Middleware
app.use(helmet());
app.use(cors({
  origin: 'http://localhost:5173', // Your React frontend URL
  credentials: true,           // <-- This is important
}));
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());



app.use(express.static(path.join(__dirname, '/vtuf/dist')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'vtuf', 'dist', 'index.html'));
});
app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'vtuf', 'dist', 'index.html'));
});

// Routes
app.post('/api/wallet/webhook/paystack', 
  express.raw({ type: 'application/json' }), 
  require('./controllers/walletController').handlePaystackWebhook
);
app.get("/", (req, res) => {
   res.send("API is running...");
})
 
app.use('/api/wallet', walletRoutes);
app.use('/api/airtime', airtimeRoutes);
app.use('/api/data', dataRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/auth', authRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// 404 handler - remove the '*' pattern
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

module.exports = app;