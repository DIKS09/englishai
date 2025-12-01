const express = require('express');
const router = express.Router();
const History = require('../models/History');

// Get all history
router.get('/', async (req, res) => {
  try {
    const { type, limit = 20 } = req.query;
    
    let query = {};
    if (type) {
      query.type = type;
    }

    const history = await History.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    res.json({ history });
  } catch (error) {
    console.error('Error fetching history:', error);
    res.status(500).json({ error: 'Failed to fetch history' });
  }
});

// Delete history item
router.delete('/:id', async (req, res) => {
  try {
    await History.findByIdAndDelete(req.params.id);
    res.json({ message: 'History item deleted' });
  } catch (error) {
    console.error('Error deleting history:', error);
    res.status(500).json({ error: 'Failed to delete history item' });
  }
});

module.exports = router;

