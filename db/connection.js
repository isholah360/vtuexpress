
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const coon= await mongoose.connect(process.env.DB_Connection, {});
    console.log(`✅database is connected to ${coon.connection.host}`);
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }}


module.exports = connectDB;

// "mongodb://127.0.0.1:27017/test"