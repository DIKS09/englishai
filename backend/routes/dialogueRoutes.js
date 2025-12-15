const express = require('express');
const router = express.Router();
const { generateDialogue } = require('../services/openaiService');
const History = require('../models/History');

router.post('/generate', async (req, res) => {
  try {
    const { topic, level } = req.body;

    if (!topic || !level) {
      return res.status(400).json({ error: 'Topic and level are required' });
    }

    if (!['easy', 'medium', 'hard'].includes(level)) {
      return res.status(400).json({ error: 'Invalid level. Must be easy, medium, or hard' });
    }

    const dialogue = await generateDialogue(topic, level);

    // Try to save to history (don't block if MongoDB fails)
    try {
      const historyEntry = new History({
        type: 'dialogue',
        input: { topic, level },
        output: dialogue
      });
      await historyEntry.save();
    } catch (dbError) {
      console.log('Could not save to history:', dbError.message);
    }

    res.json({ dialogue });
  } catch (error) {
    console.error('Error generating dialogue:', error);
    res.status(500).json({ error: 'Failed to generate dialogue' });
  }
});

module.exports = router;

