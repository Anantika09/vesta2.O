// backend/controllers/styleController.js
const Inspiration = require('../models/Inspiration');
const Wardrobe = require('../models/Wardrobe');
const User = require('../models/User');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

// Color harmony mapping for different skin tones
const COLOR_HARMONY_MAP = {
  fair: {
    primary: ['pastel blue', 'lavender', 'mint', 'soft pink', 'cream'],
    secondary: ['navy', 'burgundy', 'forest green', 'charcoal'],
    avoid: ['neon colors', 'bright yellow', 'orange'],
    metals: ['silver', 'white gold', 'platinum'],
  },
  light: {
    primary: ['royal blue', 'emerald', 'wine', 'rose gold'],
    secondary: ['teal', 'mustard', 'coral', 'taupe'],
    avoid: ['pale yellow', 'beige'],
    metals: ['rose gold', 'yellow gold'],
  },
  medium: {
    primary: ['cobalt blue', 'fuchsia', 'turquoise', 'amber'],
    secondary: ['olive', 'rust', 'maroon', 'khaki'],
    avoid: ['black', 'navy', 'pastels'],
    metals: ['gold', 'bronze', 'copper'],
  },
  olive: {
    primary: ['jewel tones', 'deep purple', 'rich green', 'burgundy'],
    secondary: ['earth tones', 'mustard', 'terracotta', 'camel'],
    avoid: ['neon colors', 'pastels'],
    metals: ['gold', 'brass', 'antique silver'],
  },
  tan: {
    primary: ['white', 'bright yellow', 'orange', 'hot pink'],
    secondary: ['teal', 'coral', 'lime green', 'turquoise'],
    avoid: ['brown', 'beige', 'muted colors'],
    metals: ['gold', 'brass'],
  },
  deep: {
    primary: ['white', 'bright colors', 'pastels', 'metallics'],
    secondary: ['royal blue', 'purple', 'emerald', 'ruby red'],
    avoid: ['dark brown', 'black', 'navy'],
    metals: ['gold', 'silver', 'platinum'],
  },
  dark: {
    primary: ['white', 'bright colors', 'pastels', 'neon colors'],
    secondary: ['jewel tones', 'metallics', 'bold prints'],
    avoid: ['dark colors', 'muted tones'],
    metals: ['gold', 'silver', 'diamonds'],
  },
};

// Fashion rules for different occasions
const OCCASION_RULES = {
  wedding: {
    colors: ['gold', 'silver', 'pastels', 'jewel tones'],
    styles: ['elegant', 'formal', 'traditional', 'modern'],
    avoid: ['black', 'white', 'red'],
    categories: ['ethnic', 'formal', 'semi-formal'],
  },
  party: {
    colors: ['bold', 'metallics', 'sequins', 'black'],
    styles: ['glam', 'trendy', 'sexy', 'edgy'],
    avoid: ['casual', 'office wear'],
    categories: ['cocktail', 'evening', 'club'],
  },
  casual: {
    colors: ['neutrals', 'denim', 'pastels', 'earth tones'],
    styles: ['comfortable', 'relaxed', 'minimalist', 'bohemian'],
    avoid: ['formal', 'overly dressy'],
    categories: ['everyday', 'streetwear', 'athleisure'],
  },
  office: {
    colors: ['neutrals', 'navy', 'white', 'pastels'],
    styles: ['professional', 'tailored', 'minimalist', 'classic'],
    avoid: ['casual', 'revealing', 'loud prints'],
    categories: ['business', 'smart casual', 'formal'],
  },
  fest: {
    colors: ['bright colors', 'metallics', 'prints', 'patterns'],
    styles: ['boho', 'fusion', 'trendy', 'experimental'],
    avoid: ['formal', 'conservative'],
    categories: ['festival', 'cultural', 'trendy'],
  },
};

// Get personalized style recommendations
exports.getPersonalizedRecommendations = catchAsync(async (req, res, next) => {
  const { skinTone, bodyType, occasion, gender, stylePreferences } = req.query;
  
  // Validate input
  if (!skinTone || !occasion) {
    return next(new AppError('Please provide skin tone and occasion', 400));
  }
  
  // Get color recommendations based on skin tone
  const colorRecommendations = COLOR_HARMONY_MAP[skinTone] || COLOR_HARMONY_MAP.medium;
  
  // Get occasion rules
  const occasionRules = OCCASION_RULES[occasion.toLowerCase()] || OCCASION_RULES.casual;
  
  // Build query
  let query = {};
  
  // Filter by occasion
  query.tags = { $in: occasionRules.categories };
  
  // Filter by gender if specified
  if (gender && gender !== 'all') {
    query.genderTarget = { $in: [gender, 'unisex'] };
  }
  
  // Filter by body type if specified
  if (bodyType) {
    query['bodyTypeRecommendations.type'] = bodyType;
  }
  
  // Filter by style preferences if specified
  if (stylePreferences) {
    const styles = stylePreferences.split(',');
    query.style = { $in: styles };
  }
  
  // Get inspirations from database
  let inspirations = await Inspiration.find(query)
    .limit(20)
    .sort({ 'metadata.engagementScore': -1 });
  
  // Score and sort by relevance
  const scoredInspirations = inspirations.map(inspiration => {
    let score = 0;
    const inspirationObj = inspiration.toObject();
    
    // Color matching score
    const colorTags = inspirationObj.tags.filter(tag => 
      colorRecommendations.primary.concat(colorRecommendations.secondary)
        .some(color => tag.toLowerCase().includes(color))
    );
    score += colorTags.length * 10;
    
    // Skin tone match score
    const skinToneMatch = inspirationObj.skinToneRecommendations?.find(
      rec => rec.tone === skinTone
    );
    if (skinToneMatch) {
      score += skinToneMatch.confidence || 20;
    }
    
    // Body type match score
    const bodyTypeMatch = inspirationObj.bodyTypeRecommendations?.find(
      rec => rec.type === bodyType
    );
    if (bodyTypeMatch) {
      score += bodyTypeMatch.confidence || 15;
    }
    
    // Occasion relevance score
    const occasionMatch = inspirationObj.occasion?.includes(occasion);
    if (occasionMatch) score += 25;
    
    // Engagement score bonus
    score += (inspirationObj.metadata.engagementScore || 0) / 10;
    
    return {
      ...inspirationObj,
      relevanceScore: Math.min(score, 100),
      perfectMatch: score > 80,
      colorRecommendation: colorTags.length > 0 ? 'Matches your color palette' : 'Consider alternative colors',
    };
  });
  
  // Sort by relevance score
  scoredInspirations.sort((a, b) => b.relevanceScore - a.relevanceScore);
  
  // Add metadata
  const metadata = {
    skinTone,
    occasion,
    recommendedColors: colorRecommendations.primary.slice(0, 3),
    colorWarnings: colorRecommendations.avoid.slice(0, 2),
    metalRecommendations: colorRecommendations.metals,
    occasionRules: {
      recommendedColors: occasionRules.colors.slice(0, 3),
      recommendedStyles: occasionRules.styles.slice(0, 3),
      thingsToAvoid: occasionRules.avoid,
    },
  };
  
  res.status(200).json({
    status: 'success',
    results: scoredInspirations.length,
    metadata,
    data: scoredInspirations,
  });
});

// Visual search for inspiration
exports.visualSearch = catchAsync(async (req, res, next) => {
  const { query, category, color, style, occasion, page = 1, limit = 20 } = req.query;
  
  // Build search query
  const searchQuery = {};
  
  // Text search
  if (query) {
    searchQuery.$text = { $search: query };
  }
  
  // Category filter
  if (category && category !== 'all') {
    searchQuery.category = category;
  }
  
  // Color filter
  if (color && color !== 'all') {
    searchQuery['colorPalette.color'] = { $regex: color, $options: 'i' };
  }
  
  // Style filter
  if (style && style !== 'all') {
    searchQuery.style = style;
  }
  
  // Occasion filter
  if (occasion && occasion !== 'all') {
    searchQuery.occasion = occasion;
  }
  
  // Pagination
  const skip = (page - 1) * limit;
  
  // Execute query
  const inspirations = await Inspiration.find(searchQuery)
    .skip(skip)
    .limit(parseInt(limit))
    .sort({ 'metadata.engagementScore': -1, createdAt: -1 });
  
  const total = await Inspiration.countDocuments(searchQuery);
  
  res.status(200).json({
    status: 'success',
    page: parseInt(page),
    limit: parseInt(limit),
    total,
    pages: Math.ceil(total / limit),
    data: inspirations,
  });
});

// Get outfit recommendations from wardrobe
exports.getWardrobeRecommendations = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const { occasion, weather, mood } = req.query;
  
  // Get user profile
  const user = await User.findById(userId);
  if (!user) {
    return next(new AppError('User not found', 404));
  }
  
  // Get user's wardrobe items
  const wardrobeItems = await Wardrobe.find({ 
    user: userId,
    status: 'active',
  });
  
  if (wardrobeItems.length === 0) {
    return res.status(200).json({
      status: 'success',
      message: 'Your wardrobe is empty. Add some items first!',
      data: [],
    });
  }
  
  // Categorize wardrobe items
  const categorizedItems = {
    tops: wardrobeItems.filter(item => item.category === 'top'),
    bottoms: wardrobeItems.filter(item => item.category === 'bottom'),
    dresses: wardrobeItems.filter(item => item.category === 'dress'),
    outerwear: wardrobeItems.filter(item => item.category === 'outerwear'),
    shoes: wardrobeItems.filter(item => item.category === 'shoes'),
    accessories: wardrobeItems.filter(item => item.category === 'accessories'),
  };
  
  // Generate outfit combinations
  const outfitCombinations = generateOutfits(categorizedItems, {
    occasion: occasion || 'casual',
    weather: weather || 'moderate',
    mood: mood || 'neutral',
    skinTone: user.profile.skinTone,
    bodyType: user.profile.bodyType,
  });
  
  // Score outfits
  const scoredOutfits = outfitCombinations.map(outfit => {
    const score = calculateOutfitScore(outfit, {
      skinTone: user.profile.skinTone,
      bodyType: user.profile.bodyType,
      occasion: occasion || 'casual',
    });
    
    return {
      ...outfit,
      score,
      rating: score > 80 ? 'Excellent' : score > 60 ? 'Good' : 'Average',
    };
  });
  
  // Sort by score
  scoredOutfits.sort((a, b) => b.score - a.score);
  
  res.status(200).json({
    status: 'success',
    results: scoredOutfits.length,
    data: scoredOutfits.slice(0, 10), // Return top 10
  });
});

// Helper function to generate outfits
function generateOutfits(categorizedItems, params) {
  const outfits = [];
  const { occasion, weather } = params;
  
  // Generate different combinations based on occasion
  switch (occasion) {
    case 'casual':
      // Casual outfits: top + bottom + shoes
      for (const top of categorizedItems.tops.slice(0, 5)) {
        for (const bottom of categorizedItems.bottoms.slice(0, 5)) {
          for (const shoes of categorizedItems.shoes.slice(0, 3)) {
            outfits.push({
              type: 'casual',
              items: [top, bottom, shoes],
              description: `Casual ${top.color.primary} ${top.category} with ${bottom.color.primary} ${bottom.category}`,
            });
          }
        }
      }
      break;
      
    case 'office':
      // Office outfits: more formal combinations
      const formalTops = categorizedItems.tops.filter(top => 
        top.tags && top.tags.some(tag => ['formal', 'office', 'professional'].includes(tag))
      );
      const formalBottoms = categorizedItems.bottoms.filter(bottom => 
        bottom.tags && bottom.tags.some(tag => ['formal', 'office', 'professional'].includes(tag))
      );
      
      for (const top of formalTops.slice(0, 3)) {
        for (const bottom of formalBottoms.slice(0, 3)) {
          outfits.push({
            type: 'office',
            items: [top, bottom],
            description: `Professional ${top.category} outfit`,
          });
        }
      }
      break;
      
    case 'party':
      // Party outfits: dresses or glamorous combinations
      for (const dress of categorizedItems.dresses.slice(0, 5)) {
        for (const accessory of categorizedItems.accessories.slice(0, 2)) {
          for (const shoes of categorizedItems.shoes.slice(0, 2)) {
            outfits.push({
              type: 'party',
              items: [dress, accessory, shoes],
              description: `Party ready ${dress.color.primary} dress`,
            });
          }
        }
      }
      break;
      
    default:
      // Default: mix and match
      for (const top of categorizedItems.tops.slice(0, 3)) {
        for (const bottom of categorizedItems.bottoms.slice(0, 3)) {
          outfits.push({
            type: 'mixed',
            items: [top, bottom],
            description: `${top.color.primary} ${top.category} with ${bottom.color.primary} ${bottom.category}`,
          });
        }
      }
  }
  
  // Filter by weather if specified
  if (weather === 'cold') {
    return outfits.filter(outfit => 
      outfit.items.some(item => 
        item.tags && item.tags.some(tag => ['warm', 'winter', 'layered'].includes(tag))
      )
    );
  }
  
  if (weather === 'hot') {
    return outfits.filter(outfit => 
      outfit.items.some(item => 
        item.tags && item.tags.some(tag => ['summer', 'lightweight', 'breathable'].includes(tag))
      )
    );
  }
  
  return outfits.slice(0, 20); // Limit to 20 combinations
}

// Helper function to calculate outfit score
function calculateOutfitScore(outfit, params) {
  let score = 0;
  const { skinTone, bodyType, occasion } = params;
  
  // Color harmony score (40%)
  const colors = outfit.items.map(item => item.color.primary);
  const uniqueColors = [...new Set(colors)];
  const colorHarmony = uniqueColors.length <= 3 ? 40 : 40 - ((uniqueColors.length - 3) * 10);
  score += Math.max(colorHarmony, 10);
  
  // Occasion appropriateness (30%)
  const occasionTags = OCCASION_RULES[occasion]?.categories || [];
  const occasionMatch = outfit.items.some(item => 
    item.tags && item.tags.some(tag => occasionTags.includes(tag))
  );
  score += occasionMatch ? 30 : 15;
  
  // Completeness score (20%)
  const hasTop = outfit.items.some(item => ['top', 'dress'].includes(item.category));
  const hasBottom = outfit.items.some(item => ['bottom', 'dress'].includes(item.category));
  const hasShoes = outfit.items.some(item => item.category === 'shoes');
  score += (hasTop ? 10 : 0) + (hasBottom ? 10 : 0) + (hasShoes ? 10 : 0);
  
  // Recent wear bonus (10%)
  const recentWearBonus = outfit.items.some(item => {
    if (!item.lastWorn) return false;
    const daysSinceLastWorn = (new Date() - new Date(item.lastWorn)) / (1000 * 60 * 60 * 24);
    return daysSinceLastWorn > 7; // Bonus if not worn in the last week
  }) ? 10 : 5;
  score += recentWearBonus;
  
  return Math.min(score, 100);
}

// Get trending styles
exports.getTrendingStyles = catchAsync(async (req, res, next) => {
  const { category, location } = req.query;
  
  let query = { 'metadata.isFeatured': true };
  
  if (category && category !== 'all') {
    query.category = category;
  }
  
  // If location is provided, you could filter by regional trends
  // For now, we'll just return featured items
  
  const trending = await Inspiration.find(query)
    .limit(12)
    .sort({ 'metadata.engagementScore': -1, createdAt: -1 });
  
  res.status(200).json({
    status: 'success',
    results: trending.length,
    data: trending,
  });
});

// Save favorite outfit
exports.saveOutfit = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const { items, name, description, tags, occasion, season } = req.body;
  
  // Validate items
  if (!items || !Array.isArray(items) || items.length === 0) {
    return next(new AppError('Please provide at least one item for the outfit', 400));
  }
  
  // Verify all items belong to the user
  const itemIds = items.map(item => item._id || item);
  const userItems = await Wardrobe.find({
    _id: { $in: itemIds },
    user: userId,
  });
  
  if (userItems.length !== items.length) {
    return next(new AppError('Some items do not belong to you', 400));
  }
  
  // Create outfit document (you might want to create an Outfit model)
  // For now, we'll return a success response
  const savedOutfit = {
    userId,
    items: itemIds,
    name: name || `Outfit ${new Date().toLocaleDateString()}`,
    description,
    tags: tags || [],
    occasion: occasion || 'casual',
    season: season || 'all-season',
    createdAt: new Date(),
  };
  
  // In a real implementation, you would save this to a database
  // await Outfit.create(savedOutfit);
  
  res.status(201).json({
    status: 'success',
    message: 'Outfit saved successfully',
    data: {
      outfit: savedOutfit,
    },
  });
});