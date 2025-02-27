const express = require('express');
const router = express.Router();
const { 
  getBanners, 
  getBannerById, 
  createBanner, 
  updateBanner, 
  deleteBanner 
} = require('../controllers/bannerController');
const { protect, admin } = require('../middleware/auth');
const upload = require('../middleware/upload');

// @route   GET /api/banners
// @access  Public
router.get('/', getBanners);

// @route   GET /api/banners/:id
// @access  Public
router.get('/:id', getBannerById);

// @route   POST /api/banners
// @access  Private/Admin
router.post('/', protect, admin, upload.single('image'), createBanner);

// @route   PUT /api/banners/:id
// @access  Private/Admin
router.put('/:id', protect, admin, upload.single('image'), updateBanner);

// @route   DELETE /api/banners/:id
// @access  Private/Admin
router.delete('/:id', protect, admin, deleteBanner);

module.exports = router;
