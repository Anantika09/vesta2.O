// backend/test-server.js
require('dotenv').config();

console.log('Testing environment variables...');
console.log('PORT:', process.env.PORT);
console.log('MONGO_URI:', process.env.MONGO_URI ? '✓ Set' : '✗ Not set');
console.log('JWT_SECRET:', process.env.JWT_SECRET ? '✓ Set' : '✗ Not set');
console.log('CLOUDINARY_NAME:', process.env.CLOUDINARY_CLOUD_NAME ? '✓ Set' : '✗ Not set');

// Test JWT signing
const jwt = require('jsonwebtoken');
try {
  const token = jwt.sign({ id: 'test' }, process.env.JWT_SECRET || 'test');
  console.log('JWT Test:', token ? '✓ Working' : '✗ Failed');
} catch (err) {
  console.log('JWT Test: ✗ Failed -', err.message);
}

console.log('\n✅ Environment test completed!');