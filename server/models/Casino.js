const mongoose = require('mongoose');

const CasinoSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  logo: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  depositBonus: {
    type: String,
    required: true
  },
  freeSpins: {
    type: Number,
    default: 0
  },
  signupSpins: {
    type: Number,
    default: 0
  },
  playNowUrl: {
    type: String,
    required: true
  },
  features: [{
    type: String,
    trim: true
  }],
  categories: [{
    type: String,
    enum: ['Top-rated', 'New', 'Top P&P', 'Featured'],
    default: []
  }],
  // Order fields for each category
  categoryOrder: {
    'Top-rated': {
      type: Number,
      default: 0
    },
    'New': {
      type: Number,
      default: 0
    },
    'Top P&P': {
      type: Number,
      default: 0
    },
    'Featured': {
      type: Number,
      default: 0
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Casino', CasinoSchema);
