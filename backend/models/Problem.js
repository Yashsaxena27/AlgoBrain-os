const mongoose = require('mongoose');

const problemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  platform: {
    type: String,
    enum: ['LeetCode', 'CodeForces', 'GeeksForGeeks', 'HackerRank', 'Other'],
    default: 'LeetCode'
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    default: 'Medium'
  },
  approach: {
    type: String,
    required: true
  },
  mistakes: {
    type: String,
    default: ''
  },
  solution: {
    type: String,
    default: ''
  },
  timeTaken: {
    type: Number, // in minutes
    default: 0
  },
  // AI-generated fields
  aiTags: {
    topics: [String],
    pattern: String,
    aiDifficulty: String,
    mistakeTypes: [String],
    analysis: String,
    recommendation: String
  },
  solvedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

module.exports = mongoose.model('Problem', problemSchema);
