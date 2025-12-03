const express = require('express');
const router = express.Router();
const { checkGrammar } = require('../services/openaiService');
const History = require('../models/History');

router.post('/check', async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || text.trim() === '') {
      return res.status(400).json({ error: 'Text is required' });
    }

    const result = await checkGrammar(text);

    // Save to history
    const historyEntry = new History({
      type: 'grammar-check',
      input: { text },
      output: result
    });
    await historyEntry.save();

    res.json({ result });
  } catch (error) {
    console.error('Error checking grammar:', error);
    res.status(500).json({ error: 'Failed to check grammar' });
  }
});

module.exports = router;

