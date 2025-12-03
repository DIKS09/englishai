const express = require('express');
const router = express.Router();
const { generateStory } = require('../services/openaiService');
const History = require('../models/History');

router.post('/generate', async (req, res) => {
  try {
    const { topic, level } = req.body;

    if (!topic || !level) {
      return res.status(400).json({ error: 'Topic and level are required' });
    }

    const story = await generateStory(topic, level);

    // Save to history
    const historyEntry = new History({
      type: 'story',
      input: { topic, level },
      output: story
    });
    await historyEntry.save();

    res.json({ story });
  } catch (error) {
    console.error('Error generating story:', error);
    res.status(500).json({ error: 'Failed to generate story' });
  }
});

module.exports = router;

