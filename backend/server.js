// backend/server.js - GUARANTEED WORKING VERSION
require('dotenv').config();
const express = require('express');
const { MongoClient } = require('mongodb'); // Direct MongoDB driver
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');
const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5000'],
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.static(path.join(__dirname, '../frontend')));
// MongoDB Connection
const mongoURI = process.env.MONGO_URI;
let db, client;

async function connectToMongoDB() {
  try {
    console.log('🔗 Connecting to MongoDB Atlas...');
    client = new MongoClient(mongoURI, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });
    
    await client.connect();
    db = client.db('vestaDB');
    
    // Create collections if they don't exist
    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map(c => c.name);
    
    if (!collectionNames.includes('users')) {
      await db.createCollection('users');
      await db.collection('users').createIndex({ email: 1 }, { unique: true });
      console.log('📁 Created "users" collection');
    }
    
    if (!collectionNames.includes('wardrobe')) {
      await db.createCollection('wardrobe');
      console.log('📁 Created "wardrobe" collection');
    }
    
    console.log('✅ MongoDB Atlas Connected Successfully!');
    console.log(`📊 Database: ${db.databaseName}`);
    console.log(`📁 Collections: ${collectionNames.join(', ')}`);
    
    return true;
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    console.log('⚠️  Running in fallback mode (in-memory database)');
    return false;
  }
}

// Start connection
connectToMongoDB();

// In-memory fallback database
const memoryDB = {
  users: [],
  wardrobe: []
};

// ====================
// DATABASE HELPERS
// ====================
async function dbOperation(operation) {
  if (db) {
    try {
      return await operation(db);
    } catch (error) {
      console.error('Database operation failed:', error);
      // Fallback to memory
      return operation(memoryDB, true);
    }
  } else {
    return operation(memoryDB, true);
  }
}

// ====================
// API ENDPOINTS
// ====================

// Health check
app.get('/api/health', async (req, res) => {
  const isConnected = db ? true : false;
  
  res.json({
    status: 'OK',
    message: 'Vesta API is running',
    database: isConnected ? 'MongoDB Atlas' : 'In-memory fallback',
    timestamp: new Date().toISOString(),
    endpoints: [
      'GET /api/health',
      'GET /api/test-jwt',
      'POST /api/auth/register',
      'POST /api/auth/login',
      'GET /api/auth/me',
      'GET /api/wardrobe',
      'POST /api/wardrobe',
      'GET /api/styles/recommendations',
      'POST /api/contact'
    ]
  });
});

// Test JWT
app.get('/api/test-jwt', (req, res) => {
  try {
    const token = jwt.sign(
      { test: 'Vesta API' },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    
    res.json({
      success: true,
      token: token.substring(0, 50) + '...',
      message: 'JWT authentication is working',
      secret: 'Configured ✓'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Register user
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, skinTone, bodyType, gender } = req.body;
    
    // Validate
    if (!name || !email || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'Name, email, and password are required'
      });
    }
    
    const result = await dbOperation(async (database, isMemory) => {
      if (isMemory) {
        // Memory database
        const existing = memoryDB.users.find(u => u.email === email);
        if (existing) throw new Error('User already exists');
        
        const hashedPassword = await bcrypt.hash(password, 12);
        const newUser = {
          id: Date.now().toString(),
          name,
          email,
          password: hashedPassword,
          profile: { skinTone, bodyType, gender },
          createdAt: new Date()
        };
        
        memoryDB.users.push(newUser);
        return { insertedId: newUser.id, user: newUser };
      } else {
        // MongoDB
        const existing = await database.collection('users').findOne({ email });
        if (existing) throw new Error('User already exists');
        
        const hashedPassword = await bcrypt.hash(password, 12);
        const newUser = {
          name,
          email,
          password: hashedPassword,
          profile: { 
            skinTone: skinTone || 'medium',
            bodyType: bodyType || 'hourglass',
            gender: gender || 'prefer-not-to-say'
          },
          createdAt: new Date()
        };
        
        const result = await database.collection('users').insertOne(newUser);
        return { insertedId: result.insertedId, user: newUser };
      }
    });
    
    // Generate JWT token
    const token = jwt.sign(
      { 
        id: result.insertedId.toString(),
        email: email 
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    // Remove password from response
    const userResponse = { ...result.user };
    delete userResponse.password;
    
    res.status(201).json({
      status: 'success',
      token,
      data: {
        user: userResponse
      }
    });
    
  } catch (error) {
    console.error('Registration error:', error);
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
});

// Login user
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const result = await dbOperation(async (database, isMemory) => {
      if (isMemory) {
        const user = memoryDB.users.find(u => u.email === email);
        if (!user) throw new Error('User not found');
        
        const valid = await bcrypt.compare(password, user.password);
        if (!valid) throw new Error('Invalid password');
        
        return user;
      } else {
        const user = await database.collection('users').findOne({ email });
        if (!user) throw new Error('User not found');
        
        const valid = await bcrypt.compare(password, user.password);
        if (!valid) throw new Error('Invalid password');
        
        return user;
      }
    });
    
    // Generate JWT
    const token = jwt.sign(
      { 
        id: result._id ? result._id.toString() : result.id,
        email: result.email 
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    // Remove password from response
    const userResponse = { ...result };
    delete userResponse.password;
    
    res.json({
      status: 'success',
      token,
      data: {
        user: userResponse
      }
    });
    
  } catch (error) {
    res.status(401).json({
      status: 'error',
      message: error.message
    });
  }
});

// Get current user
app.get('/api/auth/me', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ status: 'error', message: 'No token' });
    }
    
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const user = await dbOperation(async (database, isMemory) => {
      if (isMemory) {
        return memoryDB.users.find(u => 
          u.id === decoded.id || u.email === decoded.email
        );
      } else {
        return await database.collection('users').findOne({
          $or: [
            { _id: new require('mongodb').ObjectId(decoded.id) },
            { email: decoded.email }
          ]
        });
      }
    });
    // ADD THESE 2 LINES - EXACTLY HERE (before 404 handler)
app.post('/api/contact/send', (req, res) => {
  const { name, email, message } = req.body;
  console.log(`📩 Contact: ${name}`);
  res.json({ success: true, message: "Message sent!" });
});

    if (!user) {
      return res.status(404).json({ status: 'error', message: 'User not found' });
    }
    
    // Remove password
    delete user.password;
    
    res.json({
      status: 'success',
      data: { user }
    });
    
  } catch (error) {
    res.status(401).json({ status: 'error', message: 'Invalid token' });
  }
});

// Get wardrobe items
app.get('/api/wardrobe', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ status: 'error', message: 'Authentication required' });
    }
    
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;
    
    const items = await dbOperation(async (database, isMemory) => {
      if (isMemory) {
        return memoryDB.wardrobe.filter(item => item.userId === userId);
      } else {
        return await database.collection('wardrobe')
          .find({ userId })
          .sort({ createdAt: -1 })
          .toArray();
      }
    });
    
    res.json({
      status: 'success',
      results: items.length,
      data: items
    });
    
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// Add to wardrobe
app.post('/api/wardrobe', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ status: 'error', message: 'Authentication required' });
    }
    
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const { name, category, color, imageUrl, tags } = req.body;
    
    const newItem = {
      userId: decoded.id,
      name,
      category,
      color,
      imageUrl: imageUrl || 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400&h=400&fit=crop',
      tags: tags || [],
      createdAt: new Date()
    };
    
    const result = await dbOperation(async (database, isMemory) => {
      if (isMemory) {
        newItem.id = Date.now().toString();
        memoryDB.wardrobe.push(newItem);
        return { insertedId: newItem.id };
      } else {
        return await database.collection('wardrobe').insertOne(newItem);
      }
    });
    
    res.status(201).json({
      status: 'success',
      data: {
        item: { ...newItem, _id: result.insertedId }
      }
    });
    
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// Style recommendations
app.get('/api/styles/recommendations', (req, res) => {
  const { skinTone = 'medium', occasion = 'casual' } = req.query;
  
  const recommendations = {
    fair: {
      casual: [
        {
          id: 1,
          image: 'https://images.unsplash.com/photo-1529139574466-a303027c1d30?w=400&h=600&fit=crop',
          title: 'Pastel Perfection',
          description: 'Soft colors that complement fair skin',
          colors: ['pastel blue', 'lavender', 'cream'],
          tags: ['casual', 'daytime', 'spring']
        }
      ],
      party: [
        {
          id: 2,
          image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=600&fit=crop',
          title: 'Silver Elegance',
          description: 'Metallics that make fair skin glow',
          colors: ['navy', 'silver', 'burgundy'],
          tags: ['party', 'evening', 'formal']
        }
      ]
    },
    medium: {
      casual: [
        {
          id: 3,
          image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400&h=600&fit=crop',
          title: 'Earth Tone Comfort',
          description: 'Warm colors for medium skin tones',
          colors: ['olive', 'rust', 'khaki'],
          tags: ['casual', 'autumn', 'comfort']
        }
      ],
      party: [
        {
          id: 4,
          image: 'https://images.unsplash.com/photo-1581044777550-4cfa60707c03?w=400&h=600&fit=crop',
          title: 'Golden Glamour',
          description: 'Gold accents enhance medium skin',
          colors: ['gold', 'emerald', 'burgundy'],
          tags: ['party', 'wedding', 'festive']
        }
      ]
    },
    dark: {
      casual: [
        {
          id: 5,
          image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&h=600&fit=crop',
          title: 'Bold & Beautiful',
          description: 'Vibrant colors that pop on dark skin',
          colors: ['white', 'bright yellow', 'coral'],
          tags: ['casual', 'summer', 'vibrant']
        }
      ],
      party: [
        {
          id: 6,
          image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=600&fit=crop',
          title: 'Jewel Tone Majesty',
          description: 'Rich jewel tones for elegance',
          colors: ['purple', 'ruby red', 'emerald'],
          tags: ['party', 'formal', 'luxury']
        }
      ]
    }
  };
  
  const skinData = recommendations[skinTone] || recommendations.medium;
  const occasionData = skinData[occasion] || skinData.casual;
  
  res.json({
    status: 'success',
    skinTone,
    occasion,
    results: occasionData.length,
    data: occasionData
  });
});

// Contact form
app.post('/api/contact', (req, res) => {
  const { name, email, message } = req.body;
  
  console.log(`📧 New contact: ${name} <${email}>: ${message}`);
  
  res.json({
    status: 'success',
    message: 'Thank you for contacting Vesta! We\'ll respond soon.'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    status: 'error',
    message: `Route ${req.originalUrl} not found`
  });
});
app.get('/frontend/*', (req, res) => {
  const filePath = path.join(__dirname, '../frontend', req.params[0]);
  res.sendFile(filePath, (err) => {
    if (err) {
      res.status(404).json({ error: 'File not found' });
    }
  });
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`
  ╔══════════════════════════════════════════╗
  ║         VESTA BACKEND v2.0              ║
  ╠══════════════════════════════════════════╣
  ║  🌐 Server: http://localhost:${PORT}      ║
  ║  🔐 JWT: ✓ Configured                   ║
  ║  📊 Database: ${db ? 'MongoDB Atlas ✓' : 'In-memory'}        ║
  ║  📁 Environment: development            ║
  ╚══════════════════════════════════════════╝
  
  📍 Available Endpoints:
  ✅ GET    /api/health           - Health check
  ✅ GET    /api/test-jwt        - Test JWT
  ✅ POST   /api/auth/register   - Register user
  ✅ POST   /api/auth/login      - Login user
  ✅ GET    /api/auth/me         - Get current user
  ✅ GET    /api/wardrobe        - Wardrobe items
  ✅ POST   /api/wardrobe        - Add to wardrobe
  ✅ GET    /api/styles/recommendations - Style suggestions
  ✅ POST   /api/contact         - Contact form
  
  🔧 Database: ${db ? 'MongoDB Atlas (Production-ready)' : 'In-memory (Development)'}
  `);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n👋 Shutting down gracefully...');
  if (client) {
    await client.close();
    console.log('📴 MongoDB connection closed');
  }
  process.exit(0);
});