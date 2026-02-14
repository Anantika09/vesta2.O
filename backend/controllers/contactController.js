const Contact = require('../models/Contact');

exports.submitMessage = async (req, res) => {
    try {
        const { name, email, message } = req.body;
        
        const newMessage = new Contact({ name, email, message });
        await newMessage.save();

        console.log(`📩 New Contact from ${name}: ${message}`);
        
        res.status(200).json({ 
            success: true, 
            message: "Thanks! Our style consultants will reach out soon." 
        });
    } catch (err) {
        res.status(500).json({ error: "Failed to send message" });
    }
};