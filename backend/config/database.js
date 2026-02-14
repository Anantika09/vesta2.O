// backend/config/database.js
const mongoose = require('mongoose');
const config = require('./env');

const connectDB = async () => {
  try {
    const options = {
      ...config.mongo.options,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };

    const conn = await mongoose.connect(config.mongo.uri, options);
    
    console.log(`✅ MongoDB Atlas Connected: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
    console.log(`🔗 Connection State: ${conn.connection.readyState === 1 ? 'Connected' : 'Disconnected'}`);
    
    // Connection events
    mongoose.connection.on('error', (err) => {
      console.error(`❌ MongoDB connection error: ${err}`);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.log('⚠️  MongoDB disconnected');
    });
    
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('📴 MongoDB connection closed due to app termination');
      process.exit(0);
    });
    
  } catch (error) {
    console.error(`❌ MongoDB connection failed: ${error.message}`);
    console.error(`🔍 Connection URI: ${config.mongo.uri.replace(/:[^:@]*@/, ':****@')}`);
    
    // Retry logic for production
    if (config.isProduction) {
      console.log('🔄 Retrying connection in 5 seconds...');
      setTimeout(connectDB, 5000);
    } else {
      process.exit(1);
    }
  }
};

module.exports = connectDB;