const express = require('express');
const router = express.Router();
const { generateEssayTopics } = require('../services/openaiService');
const History = require('../models/History');

router.post('/generate', async (req, res) => {
  try {
    const { keyword } = req.body;

    if (!keyword || keyword.trim() === '') {
      return res.status(400).json({ error: 'Keyword is required' });
    }

    const topics = await generateEssayTopics(keyword);

    // Save to history
    const historyEntry = new History({
      type: 'essay',
      input: { keyword },
      output: topics
    });
    await historyEntry.save();

    res.json({ topics });
  } catch (error) {
    console.error('Error generating essay topics:', error);
    res.status(500).json({ error: 'Failed to generate essay topics' });
  }
});

module.exports = router;

