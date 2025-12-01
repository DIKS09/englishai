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

    // Save to history
    const historyEntry = new History({
      type: 'fill-blank',
      input: { grammar, count: exerciseCount },
      output: exercises
    });
    await historyEntry.save();

    res.json({ exercises });
  } catch (error) {
    console.error('Error generating fill-blank exercises:', error);
    res.status(500).json({ error: 'Failed to generate exercises' });
  }
});

module.exports = router;

