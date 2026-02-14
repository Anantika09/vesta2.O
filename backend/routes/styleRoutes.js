const express = require('express');
const router = express.Router();
const { getSmartRecommendations } = require('../controllers/styleController');

// This matches the URL in your main.js: /api/styling/smart-recommend
router.get('/smart-recommend', getSmartRecommendations);

module.exports = router;