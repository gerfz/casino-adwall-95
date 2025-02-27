const Banner = require('../models/Banner');
const Casino = require('../models/Casino');
const fs = require('fs');
const path = require('path');

// @desc    Get all banners
// @route   GET /api/banners
// @access  Public
exports.getBanners = async (req, res) => {
  try {
    const { pageType } = req.query;
    const filter = { isActive: true };
    
    // If pageType is provided, filter by it
    if (pageType) {
      filter.pageType = pageType;
    }
    
    const banners = await Banner.find(filter)
      .sort({ position: 1 });
    
    res.json(banners);
  } catch (error) {
    console.error('Get banners error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get banner by ID
// @route   GET /api/banners/:id
// @access  Public
exports.getBannerById = async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);
    
    if (banner) {
      res.json(banner);
    } else {
      res.status(404).json({ message: 'Banner not found' });
    }
  } catch (error) {
    console.error('Get banner by ID error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create a new banner
// @route   POST /api/banners
// @access  Private/Admin
exports.createBanner = async (req, res) => {
  try {
    const { 
      title, 
      welcomeBonus, 
      freeSpinsText, 
      rtp,
      payoutTime,
      playNowUrl,
      paymentMethods,
      backgroundColor,
      position,
      pageType
    } = req.body;

    // Check if image file was uploaded
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a banner image' });
    }

    // Check if position is valid (1, 2, or 3)
    if (![1, 2, 3].includes(Number(position))) {
      return res.status(400).json({ message: 'Position must be 1, 2, or 3' });
    }

    // Check if position is already taken for the same page type
    const existingBanner = await Banner.findOne({ 
      position: Number(position),
      pageType: pageType || 'home'
    });
    if (existingBanner) {
      return res.status(400).json({ message: `Position ${position} is already taken for this page type` });
    }

    // Parse payment methods if provided as string
    let parsedPaymentMethods = {
      bitcoin: true,
      visa: true,
      mastercard: true,
      ethereum: true
    };
    
    if (paymentMethods) {
      try {
        parsedPaymentMethods = JSON.parse(paymentMethods);
      } catch (err) {
        console.error('Error parsing payment methods:', err);
      }
    }

    // Create new banner
    const banner = await Banner.create({
      image: `/uploads/${req.file.filename}`,
      title,
      welcomeBonus,
      freeSpinsText,
      rtp: rtp || '95.0%',
      payoutTime: payoutTime || 'Instant',
      playNowUrl: playNowUrl || '#',
      paymentMethods: parsedPaymentMethods,
      backgroundColor: backgroundColor || '#1a1e2c',
      position: Number(position),
      pageType: pageType || 'home'
    });

    res.status(201).json(banner);
  } catch (error) {
    console.error('Create banner error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update a banner
// @route   PUT /api/banners/:id
// @access  Private/Admin
exports.updateBanner = async (req, res) => {
  try {
    const { 
      title, 
      welcomeBonus, 
      freeSpinsText, 
      rtp,
      payoutTime,
      playNowUrl,
      paymentMethods,
      backgroundColor,
      position,
      isActive,
      pageType
    } = req.body;

    const banner = await Banner.findById(req.params.id);
    
    if (!banner) {
      return res.status(404).json({ message: 'Banner not found' });
    }

    // Check if position is valid (1, 2, or 3)
    if (position !== undefined && ![1, 2, 3].includes(Number(position))) {
      return res.status(400).json({ message: 'Position must be 1, 2, or 3' });
    }

    // Check if new position is already taken by another banner of the same page type
    if (position !== undefined && Number(position) !== banner.position) {
      const newPageType = pageType || banner.pageType;
      const existingBanner = await Banner.findOne({ 
        position: Number(position),
        pageType: newPageType,
        _id: { $ne: banner._id } // Exclude the current banner
      });
      if (existingBanner) {
        return res.status(400).json({ message: `Position ${position} is already taken for this page type` });
      }
    }

    // Parse payment methods if provided as string
    let parsedPaymentMethods = banner.paymentMethods;
    
    if (paymentMethods) {
      try {
        parsedPaymentMethods = JSON.parse(paymentMethods);
      } catch (err) {
        console.error('Error parsing payment methods:', err);
      }
    }

    // Update banner data
    banner.title = title || banner.title;
    banner.welcomeBonus = welcomeBonus || banner.welcomeBonus;
    banner.freeSpinsText = freeSpinsText !== undefined ? freeSpinsText : banner.freeSpinsText;
    banner.rtp = rtp || banner.rtp;
    banner.payoutTime = payoutTime || banner.payoutTime;
    banner.playNowUrl = playNowUrl || banner.playNowUrl;
    banner.paymentMethods = parsedPaymentMethods;
    banner.backgroundColor = backgroundColor || banner.backgroundColor;
    banner.position = position !== undefined ? Number(position) : banner.position;
    banner.isActive = isActive !== undefined ? isActive : banner.isActive;
    banner.pageType = pageType || banner.pageType;

    // Update image if new file was uploaded
    if (req.file) {
      // Delete old image file if it exists
      const oldImagePath = path.join(__dirname, '..', banner.image);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
      
      // Set new image path
      banner.image = `/uploads/${req.file.filename}`;
    }

    const updatedBanner = await banner.save();
    res.json(updatedBanner);
  } catch (error) {
    console.error('Update banner error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete a banner
// @route   DELETE /api/banners/:id
// @access  Private/Admin
exports.deleteBanner = async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);
    
    if (!banner) {
      return res.status(404).json({ message: 'Banner not found' });
    }

    // Delete image file if it exists
    const imagePath = path.join(__dirname, '..', banner.image);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    await banner.remove();
    res.json({ message: 'Banner removed' });
  } catch (error) {
    console.error('Delete banner error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
