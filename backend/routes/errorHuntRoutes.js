const express = require('express');
const router = express.Router();
const { generateErrorHunt } = require('../services/openaiService');
const History = require('../models/History');

router.post('/generate', async (req, res) => {
  try {
    const { grammar, count } = req.body;

    if (!grammar || grammar.trim() === '') {
      return res.status(400).json({ error: 'Grammar topic is required' });
    }

    const exercises = await generateErrorHunt(grammar, count || 5);

    // Save to history
    const historyEntry = new History({
      type: 'error-hunt',
      input: { grammar, count },
      output: exercises
    });
    await historyEntry.save();

    res.json({ exercises });
  } catch (error) {
    console.error('Error generating error hunt:', error);
    res.status(500).json({ error: 'Failed to generate exercises' });
  }
});

module.exports = router;

