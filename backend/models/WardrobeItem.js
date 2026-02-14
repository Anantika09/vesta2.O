const mongoose = require("mongoose");

const wardrobeItemSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    imageUrl: {
      type: String,
      required: true
    },
    category: {
      type: String,
      enum: ["top", "bottom", "dress", "shoes", "accessory"],
      required: true
    },
    color: String,
    occasion: String,
    season: String
  },
  { timestamps: true }
);

module.exports = mongoose.model("WardrobeItem", wardrobeItemSchema);
