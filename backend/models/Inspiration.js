const mongoose = require("mongoose");

const inspirationSchema = new mongoose.Schema(
  {
    imageUrl: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: [
        "outfit",
        "makeup",
        "hairstyle",
        "accessory",
        "nails"
      ],
      required: true
    },
    tags: [String],        // e.g. ["party", "black", "soft-glam"]
    gender: String,
    season: String
  },
  { timestamps: true }
);

module.exports = mongoose.model("Inspiration", inspirationSchema);
