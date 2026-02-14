const Inspiration = require("../models/Inspiration");
const WardrobeItem = require("../models/WardrobeItem");

// ACCESSORY MATCHING
exports.matchAccessories = async (req, res) => {
  const { wardrobeItemId } = req.params;

  const item = await WardrobeItem.findById(wardrobeItemId);

  if (!item) {
    return res.status(404).json({ message: "Item not found" });
  }

  const matches = await Inspiration.find({
    type: "accessory",
    tags: { $in: [item.color, item.occasion] }
  }).limit(12);

  res.json(matches);
};

// EVENT-BASED LOOKS
exports.eventLooks = async (req, res) => {
  const { event, season } = req.query;

  const looks = await Inspiration.find({
    type: "outfit",
    tags: { $in: [event] },
    season
  }).limit(20);

  res.json(looks);
};
