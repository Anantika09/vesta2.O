// backend/models/Wardrobe.js
const mongoose = require('mongoose');

const wardrobeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  category: {
    type: String,
    enum: ['top', 'bottom', 'dress', 'outerwear', 'shoes', 'accessories'],
    required: true,
  },
  color: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  tags: [String],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Wardrobe = mongoose.model('Wardrobe', wardrobeSchema);
module.exports = Wardrobe;