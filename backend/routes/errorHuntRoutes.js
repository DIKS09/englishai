const express = require('express');
const router = express.Router();
const { generateErrorHunt } = require('../services/openaiService');
const History = require('../models/History');

router.post('/generate', async (req, res) => {
  try {
    const { grammar, count } = req.body;
    console.log('Error Hunt request:', grammar, count);

    if (!grammar || grammar.trim() === '') {
      return res.status(400).json({ error: 'Grammar topic is required' });
    }

    const exercises = await generateErrorHunt(grammar, count || 5);
    console.log('Error Hunt result:', exercises ? exercises.length + ' exercises' : 'failed');

    // Save to history (don't fail if this fails)
    try {
      const historyEntry = new History({
        type: 'error-hunt',
        input: { grammar, count },
        output: exercises
      });
      await historyEntry.save();
    } catch (historyError) {
      console.error('Failed to save history:', historyError.message);
    }

    res.json({ exercises });
  } catch (error) {
    console.error('Error generating error hunt:', error.message);
    res.status(500).json({ 
      error: 'Failed to generate exercises',
      details: error.message 
    });
  }
});

module.exports = router;

