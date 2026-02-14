const Inspiration = require("../models/Inspiration");

exports.searchImages = async (req, res) => {
  const { q } = req.query;

  const results = await Inspiration.find({
    tags: { $regex: q, $options: "i" }
  }).limit(30);

  res.json(results);
};
