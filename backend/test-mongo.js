// backend/test-mongo.js
require('dotenv').config();
const mongoose = require('mongoose');

console.log('🔍 Testing MongoDB Connection...');
console.log('Connection String:', process.env.MONGO_URI?.replace(/:[^:@]*@/, ':****@'));

// Test with timeout
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB Connected Successfully!');
    console.log('Database:', mongoose.connection.name);
    console.log('Host:', mongoose.connection.host);
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ MongoDB Connection Failed:');
    console.error('Error Message:', err.message);
    console.error('\nCommon Solutions:');
    console.log('1. Check if your IP is whitelisted in MongoDB Atlas');
    console.log('2. Verify your password is correct');
    console.log('3. Check if your cluster is running');
    console.log('4. Make sure network allows outbound connections on port 27017');
    process.exit(1);
  });

// Timeout after 10 seconds
setTimeout(() => {
  console.log('⏰ Connection timeout after 10 seconds');
  process.exit(1);
}, 10000);