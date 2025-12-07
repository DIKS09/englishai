const express = require('express');
const router = express.Router();
const { paraphrase } = require('../services/openaiService');
const History = require('../models/History');

router.post('/generate', async (req, res) => {
  try {
    const { sentence } = req.body;
    console.log('Paraphrase request:', sentence?.substring(0, 30) + '...');

    if (!sentence || sentence.trim() === '') {
      return res.status(400).json({ error: 'Sentence is required' });
    }

    const result = await paraphrase(sentence);
    console.log('Paraphrase result:', result ? 'success' : 'failed');

    // Save to history (don't fail if this fails)
    try {
      const historyEntry = new History({
        type: 'paraphrase',
        input: { sentence },
        output: result
      });
      await historyEntry.save();
    } catch (historyError) {
      console.error('Failed to save history:', historyError.message);
    }

    res.json({ result });
  } catch (error) {
    console.error('Error paraphrasing:', error.message);
    res.status(500).json({ 
      error: 'Failed to paraphrase',
      details: error.message 
    });
  }
});

module.exports = router;

