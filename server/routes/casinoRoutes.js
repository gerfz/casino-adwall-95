const express = require('express');
const router = express.Router();
const { 
  getCasinos, 
  getCasinoById, 
  createCasino, 
  updateCasino, 
  deleteCasino,
  reorderCasinos
} = require('../controllers/casinoController');
const { protect, admin } = require('../middleware/auth');
const upload = require('../middleware/upload');

// @route   GET /api/casinos
// @access  Public
router.get('/', getCasinos);

// @route   POST /api/casinos
// @access  Private/Admin
router.post('/', protect, admin, upload.single('logo'), createCasino);

// @route   PUT /api/casinos/reorder
// @access  Private/Admin
router.put('/reorder', protect, admin, reorderCasinos);

// @route   GET /api/casinos/:id
// @access  Public
router.get('/:id', getCasinoById);

// @route   PUT /api/casinos/:id
// @access  Private/Admin
router.put('/:id', protect, admin, upload.single('logo'), updateCasino);

// @route   DELETE /api/casinos/:id
// @access  Private/Admin
router.delete('/:id', protect, admin, deleteCasino);

module.exports = router;
