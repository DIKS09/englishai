const express = require('express');
const router = express.Router();
const { generateFillBlanks } = require('../services/openaiService');
const History = require('../models/History');

router.post('/generate', async (req, res) => {
  try {
    const { grammar, count } = req.body;

    if (!grammar || grammar.trim() === '') {
      return res.status(400).json({ error: 'Grammar topic is required' });
    }

    const exerciseCount = count || 5;
    const exercises = await generateFillBlanks(grammar, exerciseCount);

    // Try to save to history (don't block if MongoDB fails)
    try {
      const historyEntry = new History({
        type: 'fill-blank',
        input: { grammar, count: exerciseCount },
        output: exercises
      });
      await historyEntry.save();
    } catch (dbError) {
      console.log('Could not save to history:', dbError.message);
    }

    res.json({ exercises });
  } catch (error) {
    console.error('Error generating fill-blank exercises:', error);
    res.status(500).json({ error: 'Failed to generate exercises' });
  }
});

module.exports = router;

