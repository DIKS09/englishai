const express = require('express');
const router = express.Router();
const { generateLevelTest } = require('../services/openaiService');
const History = require('../models/History');

router.post('/generate', async (req, res) => {
  try {
    console.log('Level Test request received');
    
    const test = await generateLevelTest();
    console.log('Level Test result:', test.questions ? test.questions.length + ' questions' : 'failed');

    // Save to history (don't fail if this fails)
    try {
      const historyEntry = new History({
        type: 'level-test',
        input: {},
        output: test
      });
      await historyEntry.save();
    } catch (historyError) {
      console.error('Failed to save history:', historyError.message);
    }

    res.json({ test });
  } catch (error) {
    console.error('Error generating level test:', error.message);
    res.status(500).json({ 
      error: 'Failed to generate level test',
      details: error.message 
    });
  }
});

router.post('/result', async (req, res) => {
  try {
    const { answers, questions } = req.body;
    
    let totalPoints = 0;
    let maxPoints = 0;
    const results = [];

    questions.forEach((q, index) => {
      const userAnswer = answers[index];
      const isCorrect = userAnswer === q.correctAnswer;
      maxPoints += q.points;
      if (isCorrect) totalPoints += q.points;
      
      results.push({
        question: q.question,
        userAnswer,
        correctAnswer: q.correctAnswer,
        isCorrect,
        level: q.level
      });
    });

    const percentage = Math.round((totalPoints / maxPoints) * 100);
    let estimatedLevel = 'A1';
    
    if (percentage >= 90) estimatedLevel = 'C1';
    else if (percentage >= 75) estimatedLevel = 'B2';
    else if (percentage >= 60) estimatedLevel = 'B1';
    else if (percentage >= 40) estimatedLevel = 'A2';
    else estimatedLevel = 'A1';

    res.json({
      totalPoints,
      maxPoints,
      percentage,
      estimatedLevel,
      results
    });
  } catch (error) {
    console.error('Error calculating result:', error);
    res.status(500).json({ error: 'Failed to calculate result' });
  }
});

module.exports = router;

