require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const app = express();

// MIDDLEWARE - ORDER MATTERS!
app.use(cors({
  origin: '*',
  credentials: true
}));
app.use(express.json());  // This MUST be here
app.use(express.urlencoded({ extended: true }));

// Simple test endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Register endpoint - Simplified
app.post('/api/auth/register', async (req, res) => {
  console.log('=== REGISTER REQUEST ===');
  console.log('Body:', req.body);
  console.log('Content-Type:', req.headers['content-type']);
  
  try {
    const { name, email, password } = req.body;
    
    if (!name || !email || !password) {
      console.log('Missing fields');
      return res.status(400).json({ 
        status: 'error', 
        message: 'Name, email, and password are required' 
      });
    }
    
    // Simple success response for testing
    res.json({ 
      status: 'success', 
      message: 'Registration successful!',
      data: { name, email }
    });
    
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// Login endpoint - Simplified
app.post('/api/auth/login', async (req, res) => {
  console.log('=== LOGIN REQUEST ===');
  console.log('Body:', req.body);
  
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ 
        status: 'error', 
        message: 'Email and password are required' 
      });
    }
    
    res.json({ 
      status: 'success', 
      message: 'Login successful!',
      token: 'test-token-123'
    });
    
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`📍 Health: http://localhost:${PORT}/api/health`);
});
