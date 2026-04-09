require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { MongoClient } = require('mongodb');
const app = express();

// Middleware
app.use(cors({ origin: '*', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
const mongoURI = process.env.MONGO_URI;
let db;

async function connectToMongoDB() {
  try {
    const client = new MongoClient(mongoURI);
    await client.connect();
    db = client.db('vestaDB');
    console.log('✅ MongoDB Connected');
    
    // Create users collection if not exists
    const collections = await db.listCollections().toArray();
    if (!collections.find(c => c.name === 'users')) {
      await db.createCollection('users');
      await db.collection('users').createIndex({ email: 1 }, { unique: true });
    }
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
  }
}
connectToMongoDB();

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Vesta API is running' });
});

// Register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    if (!name || !email || !password) {
      return res.status(400).json({ status: 'error', message: 'All fields required' });
    }
    
    // Check if user exists
    const existingUser = await db.collection('users').findOne({ email });
    if (existingUser) {
      return res.status(400).json({ status: 'error', message: 'User already exists' });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create user
    const newUser = {
      name,
      email,
      password: hashedPassword,
      createdAt: new Date()
    };
    
    const result = await db.collection('users').insertOne(newUser);
    
    // Create token
    const token = jwt.sign(
      { id: result.insertedId.toString(), email },
      process.env.JWT_SECRET || 'secret123',
      { expiresIn: '7d' }
    );
    
    const { password: _, ...userWithoutPassword } = newUser;
    
    res.status(201).json({
      status: 'success',
      token,
      data: { user: userWithoutPassword }
    });
    
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await db.collection('users').findOne({ email });
    if (!user) {
      return res.status(401).json({ status: 'error', message: 'Invalid credentials' });
    }
    
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ status: 'error', message: 'Invalid credentials' });
    }
    
    const token = jwt.sign(
      { id: user._id.toString(), email: user.email },
      process.env.JWT_SECRET || 'secret123',
      { expiresIn: '7d' }
    );
    
    const { password: _, ...userWithoutPassword } = user;
    
    res.json({
      status: 'success',
      token,
      data: { user: userWithoutPassword }
    });
    
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server running on port ${PORT}`);
});