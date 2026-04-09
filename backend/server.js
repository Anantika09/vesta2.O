require('dotenv').config();

const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const app = express();
// Middleware
// ==================== CORS FIX ====================
// Allow all origins - TEMPORARY for testing
app.use((req, res, next) => {
  const allowedOrigins = [
    'http://localhost:3000',
    'https://vesta-gold.vercel.app',
    'https://vesta.vercel.app',
    'https://vesta-wfcf.onrender.com'
  ];
  
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Max-Age', '86400'); // 24 hours
  
  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  next();
});
// This MUST be before any route declarations
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
// Handle preflight requests
app.options('*', cors());

// Create uploads directory
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('Only image files are allowed'));
  }
});

// Email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'your-email@gmail.com',
    pass: process.env.EMAIL_PASS || 'your-app-password',
  },
});

// MongoDB Connection
const mongoURI = process.env.MONGO_URI;
let db, client;

async function connectToMongoDB() {
  try {
    client = new MongoClient(mongoURI);
    await client.connect();
    db = client.db('vestaDB');
    console.log('✅ MongoDB Connected Successfully!');
    
    const collections = await db.listCollections().toArray();
    if (!collections.find(c => c.name === 'users')) {
      await db.createCollection('users');
      await db.collection('users').createIndex({ email: 1 }, { unique: true });
      console.log('📁 Created "users" collection');
    }
    if (!collections.find(c => c.name === 'wardrobe')) {
      await db.createCollection('wardrobe');
      console.log('📁 Created "wardrobe" collection');
    }
    if (!collections.find(c => c.name === 'contacts')) {
      await db.createCollection('contacts');
      console.log('📁 Created "contacts" collection');
    }
    return true;
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    console.log('⚠️  Running in fallback mode (in-memory database)');
    return false;
  }
}
connectToMongoDB();

// In-memory fallback
const memoryDB = { users: [], wardrobe: [], contacts: [] };
const resetTokens = {};

async function dbOperation(operation) {
  if (db) {
    try { return await operation(db); }
    catch (e) { return operation(memoryDB, true); }
  }
  return operation(memoryDB, true);
}

const JWT_SECRET = process.env.JWT_SECRET || 'vesta_super_secret_key_2024';

// ==================== HEALTH CHECK ====================
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Vesta API is running',
    database: db ? 'MongoDB Atlas' : 'In-memory',
    timestamp: new Date().toISOString()
  });
});

// ==================== AUTH ENDPOINTS ====================

// Register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ status: 'error', message: 'All fields required' });
    }

    const result = await dbOperation(async (database, isMemory) => {
      const existing = isMemory ? memoryDB.users.find(u => u.email === email) : await database.collection('users').findOne({ email });
      if (existing) throw new Error('User already exists');

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = { name, email, password: hashedPassword, createdAt: new Date() };

      if (isMemory) {
        newUser.id = Date.now().toString();
        memoryDB.users.push(newUser);
        return { insertedId: newUser.id, user: newUser };
      }
      const result = await database.collection('users').insertOne(newUser);
      return { insertedId: result.insertedId, user: newUser };
    });

    const token = jwt.sign({ id: result.insertedId.toString(), email }, JWT_SECRET, { expiresIn: '7d' });
    delete result.user.password;
    res.status(201).json({ status: 'success', token, data: { user: result.user } });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await dbOperation(async (database, isMemory) => {
      const u = isMemory ? memoryDB.users.find(u => u.email === email) : await database.collection('users').findOne({ email });
      if (!u) throw new Error('Invalid credentials');
      const valid = await bcrypt.compare(password, u.password);
      if (!valid) throw new Error('Invalid credentials');
      return u;
    });

    const token = jwt.sign({ id: user._id?.toString() || user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
    delete user.password;
    res.json({ status: 'success', token, data: { user } });
  } catch (error) {
    res.status(401).json({ status: 'error', message: error.message });
  }
});

// Get current user
app.get('/api/auth/me', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ status: 'error', message: 'No token' });
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await dbOperation(async (database, isMemory) => {
      if (isMemory) return memoryDB.users.find(u => u.id === decoded.id);
      return await database.collection('users').findOne({ _id: new ObjectId(decoded.id) });
    });
    if (!user) throw new Error('User not found');
    delete user.password;
    res.json({ status: 'success', data: { user } });
  } catch (error) {
    res.status(401).json({ status: 'error', message: 'Invalid token' });
  }
});

// Forgot Password
app.post('/api/auth/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ status: 'error', message: 'Email is required' });
    }

    const user = await dbOperation(async (database, isMemory) => {
      if (isMemory) return memoryDB.users.find(u => u.email === email);
      return await database.collection('users').findOne({ email });
    });

    if (!user) {
      return res.status(200).json({
        status: 'success',
        message: 'If an account exists, a reset link has been sent.'
      });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetExpires = Date.now() + 3600000; // 1 hour

    resetTokens[resetToken] = {
      email,
      expires: resetExpires,
      userId: user._id?.toString() || user.id
    };

    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password/${resetToken}`;

    const mailOptions = {
      from: '"Vesta" <noreply@vesta.style>',
      to: email,
      subject: 'Reset Your Vesta Password',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f9f9f9;">
          <h2 style="color: #CD2C58;">Reset Your Password</h2>
          <p>You requested to reset your password for your Vesta account.</p>
          <p>Click the button below to reset your password:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background: #CD2C58; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block;">Reset Password</a>
          </div>
          <p>This link will expire in 1 hour.</p>
          <p>If you didn't request this, please ignore this email.</p>
          <hr style="margin: 20px 0;" />
          <p style="font-size: 12px; color: #666;">Vesta - Your Digital Wardrobe Assistant</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    res.json({ status: 'success', message: 'Password reset link sent to your email.' });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ status: 'error', message: 'Server error. Please try again.' });
  }
});

// Reset Password
app.post('/api/auth/reset-password/:token', async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ status: 'error', message: 'Password is required' });
    }

    const resetData = resetTokens[token];
    if (!resetData || resetData.expires < Date.now()) {
      return res.status(400).json({ status: 'error', message: 'Invalid or expired reset token' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await dbOperation(async (database, isMemory) => {
      if (isMemory) {
        const userIndex = memoryDB.users.findIndex(u => u.email === resetData.email);
        if (userIndex !== -1) {
          memoryDB.users[userIndex].password = hashedPassword;
        }
      } else {
        await database.collection('users').updateOne(
          { email: resetData.email },
          { $set: { password: hashedPassword } }
        );
      }
    });

    delete resetTokens[token];
    res.json({ status: 'success', message: 'Password reset successful. You can now login.' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ status: 'error', message: 'Server error. Please try again.' });
  }
});

// ==================== WARDROBE ENDPOINTS ====================

app.get('/api/wardrobe', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ status: 'error', message: 'Authentication required' });
    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.id;

    const items = await dbOperation(async (database, isMemory) => {
      if (isMemory) return memoryDB.wardrobe.filter(item => item.userId === userId);
      return await database.collection('wardrobe').find({ userId }).sort({ createdAt: -1 }).toArray();
    });

    const itemsWithFullUrl = items.map(item => ({
      ...item,
      imageUrl: item.imageUrl?.startsWith('http') ? item.imageUrl : `http://localhost:5000${item.imageUrl}`
    }));

    res.json({ status: 'success', results: itemsWithFullUrl.length, data: itemsWithFullUrl });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

app.post('/api/wardrobe', upload.single('image'), async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ status: 'error', message: 'Authentication required' });
    const decoded = jwt.verify(token, JWT_SECRET);
    const { name, category, subCategory, occasion, season, color, brand, size } = req.body;

    if (!name || !category) {
      return res.status(400).json({ status: 'error', message: 'Name and category are required' });
    }

    let imageUrl = '';
    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
    } else {
      return res.status(400).json({ status: 'error', message: 'Image is required' });
    }

    const newItem = {
      userId: decoded.id,
      name,
      category,
      subCategory: subCategory || '',
      occasion: occasion || 'casual',
      season: season || 'all',
      color: color || '',
      brand: brand || '',
      size: size || '',
      imageUrl,
      createdAt: new Date()
    };

    const result = await dbOperation(async (database, isMemory) => {
      if (isMemory) {
        newItem.id = Date.now().toString();
        memoryDB.wardrobe.push(newItem);
        return { insertedId: newItem.id };
      }
      return await database.collection('wardrobe').insertOne(newItem);
    });

    const fullImageUrl = `http://localhost:5000${imageUrl}`;
    res.status(201).json({ status: 'success', data: { item: { ...newItem, _id: result.insertedId, imageUrl: fullImageUrl } } });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
});

app.delete('/api/wardrobe/:id', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ status: 'error', message: 'Authentication required' });
    const decoded = jwt.verify(token, JWT_SECRET);
    const itemId = req.params.id;

    const result = await dbOperation(async (database, isMemory) => {
      if (isMemory) {
        const index = memoryDB.wardrobe.findIndex(item => item.id === itemId && item.userId === decoded.id);
        if (index !== -1) {
          memoryDB.wardrobe.splice(index, 1);
          return { deletedCount: 1 };
        }
        return { deletedCount: 0 };
      }
      return await database.collection('wardrobe').deleteOne({ _id: new ObjectId(itemId), userId: decoded.id });
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({ status: 'error', message: 'Item not found' });
    }

    res.json({ status: 'success', message: 'Item deleted successfully' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// ==================== CONTACT ENDPOINT ====================
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    
    if (!name || !email || !message) {
      return res.status(400).json({ status: 'error', message: 'Name, email, and message are required' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ status: 'error', message: 'Please enter a valid email address' });
    }

    const contactData = {
      name,
      email,
      message,
      createdAt: new Date(),
      status: 'unread'
    };

    await dbOperation(async (database, isMemory) => {
      if (isMemory) {
        contactData.id = Date.now().toString();
        if (!memoryDB.contacts) memoryDB.contacts = [];
        memoryDB.contacts.push(contactData);
        return { insertedId: contactData.id };
      }
      return await database.collection('contacts').insertOne(contactData);
    });

    console.log(`📧 New contact message from: ${name} (${email})`);

    res.json({ 
      status: 'success', 
      message: 'Message sent successfully! We\'ll get back to you soon.' 
    });

  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({ status: 'error', message: 'Failed to send message. Please try again.' });
  }
});

// ==================== STYLE RECOMMENDATIONS ====================
app.get('/api/styles/recommendations', (req, res) => {
  const { skinTone = 'medium', occasion = 'casual' } = req.query;

  const recommendations = {
    fair: {
      casual: [{ id: 1, title: 'Pastel Perfection', image: 'https://images.unsplash.com/photo-1529139574466-a303027c1d30?w=400&h=600&fit=crop', description: 'Soft colors that complement fair skin', colors: ['pastel blue', 'lavender', 'cream'] }],
      party: [{ id: 2, title: 'Silver Elegance', image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=600&fit=crop', description: 'Metallics that make fair skin glow', colors: ['navy', 'silver', 'burgundy'] }]
    },
    medium: {
      casual: [{ id: 3, title: 'Earth Tone Comfort', image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400&h=600&fit=crop', description: 'Warm colors for medium skin tones', colors: ['olive', 'rust', 'khaki'] }],
      party: [{ id: 4, title: 'Golden Glamour', image: 'https://images.unsplash.com/photo-1581044777550-4cfa60707c03?w=400&h=600&fit=crop', description: 'Gold accents enhance medium skin', colors: ['gold', 'emerald', 'burgundy'] }]
    },
    dark: {
      casual: [{ id: 5, title: 'Bold & Beautiful', image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&h=600&fit=crop', description: 'Vibrant colors that pop on dark skin', colors: ['white', 'bright yellow', 'coral'] }],
      party: [{ id: 6, title: 'Jewel Tone Majesty', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=600&fit=crop', description: 'Rich jewel tones for elegance', colors: ['purple', 'ruby red', 'emerald'] }]
    }
  };

  const skinData = recommendations[skinTone] || recommendations.medium;
  const occasionData = skinData[occasion] || skinData.casual;

  res.json({ status: 'success', skinTone, occasion, results: occasionData.length, data: occasionData });
});

// Serve static files
app.use('/uploads', express.static(uploadDir));

// ==================== START SERVER ====================
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`
  ╔══════════════════════════════════════════╗
  ║         VESTA BACKEND v3.0              ║
  ╠══════════════════════════════════════════╣
  ║  🌐 Server: http://localhost:${PORT}      ║
  ║  🔐 JWT: ✓ Configured                   ║
  ║  📸 Upload: ✓ Configured                ║
  ║  📧 Email: ✓ Configured                 ║
  ╚══════════════════════════════════════════╝
  `);
});
