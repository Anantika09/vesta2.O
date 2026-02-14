const express = require("express");
const router = express.Router();
const { addItem, getItems } = require("../controllers/wardrobeController");
const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

router.post("/", protect, upload.single("image"), addItem);
router.get("/", protect, getItems);

module.exports = router;
