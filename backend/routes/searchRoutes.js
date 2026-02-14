const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { searchImages } = require("../controllers/searchController");

router.get("/", protect, searchImages);

module.exports = router;
