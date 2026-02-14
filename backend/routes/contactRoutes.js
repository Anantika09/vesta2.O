const express = require('express');
const router = express.Router();

router.post('/send', (req, res) => {
    const { name, email, message } = req.body;
    // In a real app, you'd use Nodemailer here. 
    // For the demo, we log it and send success.
    console.log(`📩 Message from ${name}: ${message}`);
    res.status(200).json({ message: "Message received! We will get back to you soon." });
});

module.exports = router;