const Giveaway = require('../models/Giveaway');
const Casino = require('../models/Casino');
const fs = require('fs');
const path = require('path');

// @desc    Get all giveaways
// @route   GET /api/giveaways
// @access  Public
exports.getGiveaways = async (req, res) => {
  try {
    const giveaways = await Giveaway.find({ isActive: true })
      .populate('casino', 'name logo')
      .sort({ createdAt: -1 });
    
    res.json(giveaways);
  } catch (error) {
    console.error('Get giveaways error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get giveaway by ID
// @route   GET /api/giveaways/:id
// @access  Public
exports.getGiveawayById = async (req, res) => {
  try {
    const giveaway = await Giveaway.findById(req.params.id)
      .populate('casino', 'name logo');
    
    if (giveaway) {
      res.json(giveaway);
    } else {
      res.status(404).json({ message: 'Giveaway not found' });
    }
  } catch (error) {
    console.error('Get giveaway by ID error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create a new giveaway
// @route   POST /api/giveaways
// @access  Private/Admin
exports.createGiveaway = async (req, res) => {
  try {
    const { 
      title, 
      description, 
      casino, 
      startDate, 
      endDate, 
      requirements, 
      bonusDetails,
      depositRequirements,
      prizePool,
      prizeDistribution,
      additionalNotes,
      customLink,
      buttonText,
      backgroundColor
    } = req.body;

    // Check if casino exists
    const casinoExists = await Casino.findById(casino);
    if (!casinoExists) {
      return res.status(400).json({ message: 'Casino not found' });
    }

    // Create new giveaway
    const giveaway = await Giveaway.create({
      title,
      description,
      casino,
      image: req.file ? `/uploads/${req.file.filename}` : null,
      backgroundColor: backgroundColor || '#1a1e2c',
      startDate,
      endDate,
      requirements,
      bonusDetails,
      depositRequirements,
      prizePool,
      prizeDistribution,
      additionalNotes,
      customLink,
      buttonText
    });

    const populatedGiveaway = await Giveaway.findById(giveaway._id)
      .populate('casino', 'name logo');

    res.status(201).json(populatedGiveaway);
  } catch (error) {
    console.error('Create giveaway error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update a giveaway
// @route   PUT /api/giveaways/:id
// @access  Private/Admin
exports.updateGiveaway = async (req, res) => {
  try {
    const { 
      title, 
      description, 
      casino, 
      startDate, 
      endDate, 
      requirements, 
      bonusDetails,
      depositRequirements,
      prizePool,
      prizeDistribution,
      additionalNotes,
      customLink,
      buttonText,
      isActive,
      backgroundColor
    } = req.body;

    const giveaway = await Giveaway.findById(req.params.id);
    
    if (!giveaway) {
      return res.status(404).json({ message: 'Giveaway not found' });
    }

    // Check if casino exists if provided
    if (casino) {
      const casinoExists = await Casino.findById(casino);
      if (!casinoExists) {
        return res.status(400).json({ message: 'Casino not found' });
      }
      giveaway.casino = casino;
    }

    // Update giveaway data
    giveaway.title = title || giveaway.title;
    giveaway.description = description || giveaway.description;
    giveaway.startDate = startDate || giveaway.startDate;
    giveaway.endDate = endDate || giveaway.endDate;
    giveaway.requirements = requirements !== undefined ? requirements : giveaway.requirements;
    giveaway.bonusDetails = bonusDetails || giveaway.bonusDetails;
    giveaway.depositRequirements = depositRequirements || giveaway.depositRequirements;
    giveaway.prizePool = prizePool || giveaway.prizePool;
    giveaway.prizeDistribution = prizeDistribution || giveaway.prizeDistribution;
    giveaway.additionalNotes = additionalNotes !== undefined ? additionalNotes : giveaway.additionalNotes;
    giveaway.customLink = customLink !== undefined ? customLink : giveaway.customLink;
    giveaway.buttonText = buttonText || giveaway.buttonText;
    giveaway.isActive = isActive !== undefined ? isActive : giveaway.isActive;
    giveaway.backgroundColor = backgroundColor || giveaway.backgroundColor;

    // Update image if new file was uploaded
    if (req.file) {
      // Delete old image file if it exists and is not null
      if (giveaway.image) {
        const oldImagePath = path.join(__dirname, '..', giveaway.image);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      
      // Set new image path
      giveaway.image = `/uploads/${req.file.filename}`;
    }

    const updatedGiveaway = await giveaway.save();
    const populatedGiveaway = await Giveaway.findById(updatedGiveaway._id)
      .populate('casino', 'name logo');
      
    res.json(populatedGiveaway);
  } catch (error) {
    console.error('Update giveaway error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete a giveaway
// @route   DELETE /api/giveaways/:id
// @access  Private/Admin
exports.deleteGiveaway = async (req, res) => {
  try {
    const giveaway = await Giveaway.findById(req.params.id);
    
    if (!giveaway) {
      return res.status(404).json({ message: 'Giveaway not found' });
    }

    // Delete image file if it exists and is not null
    if (giveaway.image) {
      const imagePath = path.join(__dirname, '..', giveaway.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await giveaway.remove();
    res.json({ message: 'Giveaway removed' });
  } catch (error) {
    console.error('Delete giveaway error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
