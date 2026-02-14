const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },
    password: {
      type: String,
      required: true
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
      required: true
    },
    skinTone: {
      type: String,
      required: true
    },
    bodyType: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
