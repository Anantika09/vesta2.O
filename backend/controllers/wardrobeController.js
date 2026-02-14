const WardrobeItem = require("../models/WardrobeItem");
const cloudinary = require("../config/cloudinary");

exports.addItem = async (req, res) => {
  try {
    const { category, color, occasion, season } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Image required" });
    }

    const uploadRes = await cloudinary.uploader.upload(req.file.path, {
      folder: "vesta/wardrobe"
    });

    const item = await WardrobeItem.create({
      user: req.user._id,
      imageUrl: uploadRes.secure_url,
      category,
      color,
      occasion,
      season
    });

    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getItems = async (req, res) => {
  try {
    const items = await WardrobeItem.find({ user: req.user._id });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
