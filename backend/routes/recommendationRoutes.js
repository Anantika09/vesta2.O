const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  matchAccessories,
  eventLooks
} = require("../controllers/recommendationController");

router.get("/accessories/:wardrobeItemId", protect, matchAccessories);
router.get("/event", protect, eventLooks);

module.exports = router;
