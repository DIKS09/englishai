const mongoose = require('mongoose');

const historySchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['essay', 'dialogue', 'fill-blank']
  },
  input: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  output: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('History', historySchema);

