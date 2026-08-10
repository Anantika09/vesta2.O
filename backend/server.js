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

// ==================== MIDDLEWARE ====================
app.use(cors({ origin: '*', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ==================== FILE UPLOAD SETUP ====================
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) return cb(null, true);
    cb(new Error('Only image files are allowed'));
  }
});

// ==================== EMAIL SETUP ====================
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  timeout: 15000,
  connectionTimeout: 15000,
});

// Store reset tokens temporarily
const resetTokens = {};

// ==================== MONGODB CONNECTION ====================
const mongoURI = process.env.MONGO_URI;
let db;

async function connectToMongoDB() {
  try {
    const client = new MongoClient(mongoURI);
    await client.connect();
    db = client.db('vestaDB');
    console.log('✅ MongoDB Connected');
    
    const collections = await db.listCollections().toArray();
    if (!collections.find(c => c.name === 'users')) {
      await db.createCollection('users');
      await db.collection('users').createIndex({ email: 1 }, { unique: true });
      console.log('✅ Users collection created');
    }
    if (!collections.find(c => c.name === 'wardrobe')) {
      await db.createCollection('wardrobe');
      console.log('✅ Wardrobe collection created');
    }
    if (!collections.find(c => c.name === 'contacts')) {
      await db.createCollection('contacts');
      console.log('✅ Contacts collection created');
    }
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
  }
}
connectToMongoDB();

// ==================== HEALTH CHECK ====================
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Vesta API is running' });
});

// ==================== AUTH ENDPOINTS ====================

// Get current user
app.get('/api/auth/me', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ status: 'error', message: 'No token' });
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret123');
    const user = await db.collection('users').findOne({ email: decoded.email });
    
    if (!user) return res.status(404).json({ status: 'error', message: 'User not found' });
    
    const { password, ...userWithoutPassword } = user;
    res.json({ status: 'success', data: { user: userWithoutPassword } });
  } catch (error) {
    res.status(401).json({ status: 'error', message: 'Invalid token' });
  }
});

// Register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ status: 'error', message: 'All fields required' });
    }
    
    const existingUser = await db.collection('users').findOne({ email });
    if (existingUser) {
      return res.status(400).json({ status: 'error', message: 'User already exists' });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = { name, email, password: hashedPassword, createdAt: new Date() };
    const result = await db.collection('users').insertOne(newUser);
    
    const token = jwt.sign(
      { id: result.insertedId.toString(), email },
      process.env.JWT_SECRET || 'secret123',
      { expiresIn: '7d' }
    );
    
    const { password: _, ...userWithoutPassword } = newUser;
    res.status(201).json({ status: 'success', token, data: { user: userWithoutPassword } });
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
    if (!user) return res.status(401).json({ status: 'error', message: 'Invalid credentials' });
    
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(401).json({ status: 'error', message: 'Invalid credentials' });
    
    const token = jwt.sign(
      { id: user._id.toString(), email: user.email },
      process.env.JWT_SECRET || 'secret123',
      { expiresIn: '7d' }
    );
    
    const { password: _, ...userWithoutPassword } = user;
    res.json({ status: 'success', token, data: { user: userWithoutPassword } });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// Forgot Password - SINGLE CORRECT VERSION
app.post('/api/auth/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ status: 'error', message: 'Email is required' });
    
    const user = await db.collection('users').findOne({ email });
    if (!user) {
      return res.status(200).json({ status: 'success', message: 'If an account exists, a reset link has been sent.' });
    }
    
    const resetToken = crypto.randomBytes(32).toString('hex');
    resetTokens[resetToken] = { email, expires: Date.now() + 3600000 };
    
    const resetUrl = `${process.env.FRONTEND_URL || 'https://vesta-gold.vercel.app'}/reset-password/${resetToken}`;
    
    console.log('=========================================');
    console.log('🔐 PASSWORD RESET LINK:');
    console.log(resetUrl);
    console.log('=========================================');
    
    try {
      await transporter.sendMail({
        from: '"Vesta" <noreply@vesta.style>',
        to: email,
        subject: 'Reset Your Vesta Password',
        html: `
          <div style="font-family: Arial; max-width: 500px; margin: 0 auto; padding: 30px; background: #f9f9f9;">
            <h2 style="color: #CD2C58;">Reset Your Password</h2>
            <p>Click the button below to reset your password:</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" style="background: #CD2C58; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px;">Reset Password</a>
            </div>
            <p>This link expires in 1 hour.</p>
            <p>If you didn't request this, ignore this email.</p>
          </div>
        `,
      });
      console.log('✅ Email sent successfully');
    } catch (emailError) {
      console.log('⚠️ Email not sent, but link is available in console:', emailError.message);
    }
    
    res.json({ 
      status: 'success', 
      message: 'Password reset link sent to your email.' 
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ status: 'error', message: 'Server error' });
  }
});

// Reset Password
app.post('/api/auth/reset-password/:token', async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;
    
    const resetData = resetTokens[token];
    if (!resetData || resetData.expires < Date.now()) {
      return res.status(400).json({ status: 'error', message: 'Invalid or expired reset token' });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    await db.collection('users').updateOne(
      { email: resetData.email },
      { $set: { password: hashedPassword } }
    );
    
    delete resetTokens[token];
    res.json({ status: 'success', message: 'Password reset successful. You can now login.' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// ==================== WARDROBE ENDPOINTS ====================

app.get('/api/wardrobe', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ status: 'error', message: 'Authentication required' });
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret123');
    const items = await db.collection('wardrobe').find({ userId: decoded.id }).sort({ createdAt: -1 }).toArray();
    
    const itemsWithFullUrl = items.map(item => ({
      ...item,
      imageUrl: item.imageUrl?.startsWith('http') ? item.imageUrl : `https://vesta-wfcf.onrender.com${item.imageUrl}`
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
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret123');
    const { name, category, occasion, color } = req.body;
    
    if (!name || !category) {
      return res.status(400).json({ status: 'error', message: 'Name and category are required' });
    }
    
    if (!req.file) {
      return res.status(400).json({ status: 'error', message: 'Image is required' });
    }
    
    const imageUrl = `/uploads/${req.file.filename}`;
    const newItem = {
      userId: decoded.id,
      name,
      category,
      occasion: occasion || 'casual',
      color: color || '',
      imageUrl,
      createdAt: new Date()
    };
    
    const result = await db.collection('wardrobe').insertOne(newItem);
    const fullImageUrl = `https://vesta-wfcf.onrender.com${imageUrl}`;
    
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
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret123');
    const result = await db.collection('wardrobe').deleteOne({ _id: new ObjectId(req.params.id), userId: decoded.id });
    
    if (result.deletedCount === 0) return res.status(404).json({ status: 'error', message: 'Item not found' });
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
      return res.status(400).json({ status: 'error', message: 'All fields required' });
    }
    
    await db.collection('contacts').insertOne({ name, email, message, createdAt: new Date(), status: 'unread' });
    console.log(`📧 Contact from: ${name} (${email})`);
    res.json({ status: 'success', message: 'Message sent successfully!' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// ==================== STYLE RECOMMENDATIONS ====================
app.get('/api/styles/recommendations', (req, res) => {
  const { skinTone = 'medium', occasion = 'casual' } = req.query;
  const recommendations = {
    fair: {
      casual: [{ id: 1, title: 'Pastel Perfection', image: 'https://images.unsplash.com/photo-1529139574466-a303027c1d30?w=400&h=600&fit=crop', description: 'Soft colors that complement fair skin' }],
      party: [{ id: 2, title: 'Silver Elegance', image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=600&fit=crop', description: 'Metallics that make fair skin glow' }]
    },
    medium: {
      casual: [{ id: 3, title: 'Earth Tone Comfort', image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400&h=600&fit=crop', description: 'Warm colors for medium skin tones' }],
      party: [{ id: 4, title: 'Golden Glamour', image: 'https://images.unsplash.com/photo-1581044777550-4cfa60707c03?w=400&h=600&fit=crop', description: 'Gold accents enhance medium skin' }]
    },
    dark: {
      casual: [{ id: 5, title: 'Bold & Beautiful', image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&h=600&fit=crop', description: 'Vibrant colors that pop on dark skin' }],
      party: [{ id: 6, title: 'Jewel Tone Majesty', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=600&fit=crop', description: 'Rich jewel tones for elegance' }]
    }
  };
  
  const skinData = recommendations[skinTone] || recommendations.medium;
  const occasionData = skinData[occasion] || skinData.casual;
  res.json({ status: 'success', skinTone, occasion, results: occasionData.length, data: occasionData });
});

// ==================== SERVE UPLOADS ====================
app.use('/uploads', express.static(uploadDir));

// ==================== START SERVER ====================
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`📍 Health: https://vesta-wfcf.onrender.com/api/health`);
});