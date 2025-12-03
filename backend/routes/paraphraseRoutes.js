const express = require('express');
const router = express.Router();
const { paraphrase } = require('../services/openaiService');
const History = require('../models/History');

router.post('/generate', async (req, res) => {
  try {
    const { sentence } = req.body;

    if (!sentence || sentence.trim() === '') {
      return res.status(400).json({ error: 'Sentence is required' });
    }

    const result = await paraphrase(sentence);

    // Save to history
    const historyEntry = new History({
      type: 'paraphrase',
      input: { sentence },
      output: result
    });
    await historyEntry.save();

    res.json({ result });
  } catch (error) {
    console.error('Error paraphrasing:', error);
    res.status(500).json({ error: 'Failed to paraphrase' });
  }
});

module.exports = router;

