const express = require('express');
const router = express.Router();
const { checkGrammar } = require('../services/openaiService');
const History = require('../models/History');

router.post('/check', async (req, res) => {
  try {
    const { text } = req.body;
    console.log('Grammar check request received for:', text?.substring(0, 30) + '...');

    if (!text || text.trim() === '') {
      return res.status(400).json({ error: 'Text is required' });
    }

    const result = await checkGrammar(text);
    console.log('Grammar check result:', result ? 'success' : 'failed');

    // Save to history (don't fail if this fails)
    try {
      const historyEntry = new History({
        type: 'grammar-check',
        input: { text },
        output: result
      });
      await historyEntry.save();
    } catch (historyError) {
      console.error('Failed to save history:', historyError.message);
    }

    res.json({ result });
  } catch (error) {
    console.error('Error checking grammar:', error.message);
    res.status(500).json({ 
      error: 'Failed to check grammar', 
      details: error.message 
    });
  }
});

module.exports = router;

