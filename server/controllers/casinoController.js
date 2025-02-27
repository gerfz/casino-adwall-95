const Casino = require('../models/Casino');
const fs = require('fs');
const path = require('path');

// @desc    Get all casinos
// @route   GET /api/casinos
// @access  Public
exports.getCasinos = async (req, res) => {
  try {
    const { category } = req.query;
    let query = { isActive: true };

    // Filter by category if provided
    if (category) {
      query.categories = category;
    }

    // Sort by category order if category is provided, otherwise sort by createdAt
    let casinos;
    if (category) {
      // Create a dynamic sort object based on the category
      const sortField = `categoryOrder.${category}`;
      casinos = await Casino.find(query).sort({ [sortField]: 1, createdAt: -1 });
    } else {
      casinos = await Casino.find(query).sort({ createdAt: -1 });
    }

    res.json(casinos);
  } catch (error) {
    console.error('Get casinos error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get casino by ID
// @route   GET /api/casinos/:id
// @access  Public
exports.getCasinoById = async (req, res) => {
  try {
    const casino = await Casino.findById(req.params.id);
    
    if (casino) {
      res.json(casino);
    } else {
      res.status(404).json({ message: 'Casino not found' });
    }
  } catch (error) {
    console.error('Get casino by ID error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create a new casino
// @route   POST /api/casinos
// @access  Private/Admin
exports.createCasino = async (req, res) => {
  try {
    const { 
      name, 
      rating, 
      depositBonus, 
      freeSpins, 
      signupSpins, 
      playNowUrl, 
      features, 
      categories 
    } = req.body;

    // Check if logo file was uploaded
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a logo image' });
    }

    // Create new casino
    const casino = await Casino.create({
      name,
      logo: `/uploads/${req.file.filename}`,
      rating: rating || 0,
      depositBonus,
      freeSpins: freeSpins || 0,
      signupSpins: signupSpins || 0,
      playNowUrl,
      features: features ? JSON.parse(features) : [],
      categories: categories ? JSON.parse(categories) : []
    });

    res.status(201).json(casino);
  } catch (error) {
    console.error('Create casino error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update a casino
// @route   PUT /api/casinos/:id
// @access  Private/Admin
exports.updateCasino = async (req, res) => {
  try {
    const { 
      name, 
      rating, 
      depositBonus, 
      freeSpins, 
      signupSpins, 
      playNowUrl, 
      features, 
      categories,
      isActive
    } = req.body;

    const casino = await Casino.findById(req.params.id);
    
    if (!casino) {
      return res.status(404).json({ message: 'Casino not found' });
    }

    // Update casino data
    casino.name = name || casino.name;
    casino.rating = rating !== undefined ? rating : casino.rating;
    casino.depositBonus = depositBonus || casino.depositBonus;
    casino.freeSpins = freeSpins !== undefined ? freeSpins : casino.freeSpins;
    casino.signupSpins = signupSpins !== undefined ? signupSpins : casino.signupSpins;
    casino.playNowUrl = playNowUrl || casino.playNowUrl;
    casino.features = features ? JSON.parse(features) : casino.features;
    casino.categories = categories ? JSON.parse(categories) : casino.categories;
    casino.isActive = isActive !== undefined ? isActive : casino.isActive;

    // Update logo if new file was uploaded
    if (req.file) {
      // Delete old logo file if it exists
      const oldLogoPath = path.join(__dirname, '..', casino.logo);
      if (fs.existsSync(oldLogoPath)) {
        fs.unlinkSync(oldLogoPath);
      }
      
      // Set new logo path
      casino.logo = `/uploads/${req.file.filename}`;
    }

    const updatedCasino = await casino.save();
    res.json(updatedCasino);
  } catch (error) {
    console.error('Update casino error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete a casino
// @route   DELETE /api/casinos/:id
// @access  Private/Admin
exports.deleteCasino = async (req, res) => {
  try {
    const casino = await Casino.findById(req.params.id);
    
    if (!casino) {
      return res.status(404).json({ message: 'Casino not found' });
    }

    // Delete logo file if it exists
    const logoPath = path.join(__dirname, '..', casino.logo);
    if (fs.existsSync(logoPath)) {
      fs.unlinkSync(logoPath);
    }

    await casino.remove();
    res.json({ message: 'Casino removed' });
  } catch (error) {
    console.error('Delete casino error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Reorder casinos for a specific category
// @route   PUT /api/casinos/reorder
// @access  Private/Admin
exports.reorderCasinos = async (req, res) => {
  try {
    const { category, casinoIds } = req.body;

    if (!category || !casinoIds || !Array.isArray(casinoIds)) {
      return res.status(400).json({ message: 'Category and ordered casino IDs array are required' });
    }

    // Validate category
    const validCategories = ['Top-rated', 'New', 'Top P&P', 'Featured'];
    if (!validCategories.includes(category)) {
      return res.status(400).json({ message: 'Invalid category' });
    }

    // Update the order for each casino
    const updatePromises = casinoIds.map((id, index) => {
      // Create a dynamic update object based on the category
      const updateField = `categoryOrder.${category}`;
      return Casino.findByIdAndUpdate(
        id,
        { [updateField]: index },
        { new: true }
      );
    });

    await Promise.all(updatePromises);

    // Get the updated casinos
    const updatedCasinos = await Casino.find({
      categories: category,
      isActive: true
    }).sort({ [`categoryOrder.${category}`]: 1 });

    res.json(updatedCasinos);
  } catch (error) {
    console.error('Reorder casinos error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
