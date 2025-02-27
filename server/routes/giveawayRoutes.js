const express = require('express');
const router = express.Router();
const { 
  getGiveaways, 
  getGiveawayById, 
  createGiveaway, 
  updateGiveaway, 
  deleteGiveaway 
} = require('../controllers/giveawayController');
const { protect, admin } = require('../middleware/auth');
const upload = require('../middleware/upload');

// @route   GET /api/giveaways
// @access  Public
router.get('/', getGiveaways);

// @route   GET /api/giveaways/:id
// @access  Public
router.get('/:id', getGiveawayById);

// @route   POST /api/giveaways
// @access  Private/Admin
router.post('/', protect, admin, upload.single('image'), createGiveaway);

// @route   PUT /api/giveaways/:id
// @access  Private/Admin
router.put('/:id', protect, admin, upload.single('image'), updateGiveaway);

// @route   DELETE /api/giveaways/:id
// @access  Private/Admin
router.delete('/:id', protect, admin, deleteGiveaway);

module.exports = router;
