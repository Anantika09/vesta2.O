// backend/test-connection.js
const { MongoClient } = require('mongodb');

const uri = "mongodb+srv://agarwalanantika9_db_user:Ec6jQzAQ6sz70jMj@cluster0.5u3xzlz.mongodb.net/vestaDB?retryWrites=true&w=majority&appName=Cluster0";

async function testConnection() {
  console.log('🔗 Testing direct MongoDB connection...');
  
  const client = new MongoClient(uri, {
    serverSelectionTimeoutMS: 5000, // 5 second timeout
  });
  
  try {
    await client.connect();
    console.log('✅ Connected successfully to MongoDB Atlas!');
    
    const db = client.db('vestaDB');
    const collections = await db.listCollections().toArray();
    console.log(`📁 Database has ${collections.length} collection(s)`);
    
    await client.close();
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    
    if (error.message.includes('ENOTFOUND')) {
      console.log('\n🔍 DNS Resolution failed. Possible issues:');
      console.log('1. Internet connection problem');
      console.log('2. Firewall blocking MongoDB (port 27017)');
      console.log('3. Corporate/college network restrictions');
    } else if (error.message.includes('timeout')) {
      console.log('\n⏱️  Connection timeout. Possible issues:');
      console.log('1. IP not whitelisted in Atlas');
      console.log('2. Network firewall blocking connection');
      console.log('3. MongoDB cluster is paused');
    }
  }
}

testConnection();