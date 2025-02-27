const mongoose = require('mongoose');

const BannerSchema = new mongoose.Schema({
  pageType: {
    type: String,
    enum: ['home', 'allCasinos', 'newCasinos', 'topPayment'],
    default: 'home'
  },
  image: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  welcomeBonus: {
    type: String,
    required: true
  },
  freeSpinsText: {
    type: String,
    default: ''
  },
  rtp: {
    type: String,
    default: '95.0%'
  },
  payoutTime: {
    type: String,
    default: 'Instant'
  },
  paymentMethods: {
    bitcoin: {
      type: Boolean,
      default: true
    },
    visa: {
      type: Boolean,
      default: true
    },
    mastercard: {
      type: Boolean,
      default: true
    },
    ethereum: {
      type: Boolean,
      default: true
    }
  },
  playNowUrl: {
    type: String,
    default: '#'
  },
  backgroundColor: {
    type: String,
    default: '#1a1e2c' // Default dark blue background
  },
  position: {
    type: Number,
    required: true,
    enum: [1, 2, 3] // Only allow positions 1, 2, or 3
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

module.exports = mongoose.model('Banner', BannerSchema);
