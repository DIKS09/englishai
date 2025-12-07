const express = require('express');
const router = express.Router();
const { generateStory } = require('../services/openaiService');
const History = require('../models/History');

router.post('/generate', async (req, res) => {
  try {
    const { topic, level } = req.body;
    console.log('Story generation request:', topic, level);

    if (!topic) {
      return res.status(400).json({ error: 'Topic is required' });
    }

    const storyLevel = level || 'medium';
    const story = await generateStory(topic, storyLevel);
    console.log('Story generated:', story.title);

    // Save to history (don't fail if this fails)
    try {
      const historyEntry = new History({
        type: 'story',
        input: { topic, level: storyLevel },
        output: story
      });
      await historyEntry.save();
    } catch (historyError) {
      console.error('Failed to save history:', historyError.message);
    }

    res.json({ story });
  } catch (error) {
    console.error('Error generating story:', error.message);
    res.status(500).json({ 
      error: 'Failed to generate story',
      details: error.message 
    });
  }
});

module.exports = router;

