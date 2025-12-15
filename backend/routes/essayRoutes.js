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

    // Try to save to history (don't block if MongoDB fails)
    try {
      const historyEntry = new History({
        type: 'essay',
        input: { keyword },
        output: topics
      });
      await historyEntry.save();
    } catch (dbError) {
      console.log('Could not save to history:', dbError.message);
    }

    res.json({ topics });
  } catch (error) {
    console.error('Error generating essay topics:', error);
    res.status(500).json({ error: 'Failed to generate essay topics' });
  }
});

module.exports = router;

