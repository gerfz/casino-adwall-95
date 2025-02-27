const mongoose = require('mongoose');

const GiveawaySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  casino: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Casino',
    required: true
  },
  image: {
    type: String
  },
  backgroundColor: {
    type: String,
    default: '#1a1e2c'
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  depositRequirements: {
    type: String,
    required: true,
    default: 'Every 25€ deposit gives you 1 ticket, no max tickets.'
  },
  prizePool: {
    type: String,
    required: true,
    default: '2000€'
  },
  prizeDistribution: {
    type: String,
    required: true,
    default: '1st place - 750€\n2nd-3rd place - 500€\n4th place - 250€\n5th-9th place - 50€'
  },
  additionalNotes: {
    type: String,
    default: 'Prize cash will be added to your player account'
  },
  customLink: {
    type: String,
    trim: true
  },
  buttonText: {
    type: String,
    default: 'Join Giveaway',
    trim: true
  },
  requirements: {
    type: String
  },
  bonusDetails: {
    type: String,
    required: true
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

module.exports = mongoose.model('Giveaway', GiveawaySchema);
