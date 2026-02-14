require('dotenv').config();
const mongoose = require('mongoose');
const Inspiration = require('./models/Inspiration');

const styles = [
    {
        imageUrl: "https://images.unsplash.com/photo-1581044777550-4cfa60707c03?auto=format&fit=crop&w=800&q=80",
        category: "Ethnic",
        tags: ["Wedding", "Gold", "Silk", "Premium", "Olive", "Mustard"],
        metadata: { skinTone: ["Olive", "Medium"], bodyType: ["Hourglass", "Pear"] }
    },
    {
        imageUrl: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80",
        category: "Casual",
        tags: ["College Fest", "Pastel Blue", "Silver", "Denim", "Fair"],
        metadata: { skinTone: ["Fair"], bodyType: ["Rectangle"] }
    },
    {
        imageUrl: "https://images.unsplash.com/photo-1621184455862-c163dfb30e0f?auto=format&fit=crop&w=800&q=80",
        category: "Party",
        tags: ["Soft Glam", "Wine", "Velvet", "Deep", "Royal"],
        metadata: { skinTone: ["Deep", "Medium"], bodyType: ["Apple"] }
    },
    {
        imageUrl: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=800&q=80",
        category: "Ethnic",
        tags: ["November", "Winter Wedding", "Emerald", "Full Sleeves"],
        metadata: { skinTone: ["Olive", "Fair"], bodyType: ["Hourglass"] }
    },
    {
        imageUrl: "https://images.unsplash.com/photo-1529139513055-07f9127e6183?auto=format&fit=crop&w=800&q=80",
        category: "Office",
        tags: ["Formal", "Nude", "Beige", "Professional", "Fair"],
        metadata: { skinTone: ["Fair", "Medium"], bodyType: ["Inverted Triangle"] }
    }
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to Atlas for seeding...");
        
        await Inspiration.deleteMany({}); // Clears existing data so you don't have duplicates
        await Inspiration.insertMany(styles);
        
        console.log("✅ Vesta Database Seeded Successfully!");
        process.exit();
    } catch (err) {
        console.error("❌ Seeding Error:", err);
        process.exit(1);
    }
};

seedDB();