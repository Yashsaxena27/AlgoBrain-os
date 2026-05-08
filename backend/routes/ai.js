const express = require('express');
const router = express.Router();
const Problem = require('../models/Problem');
const { getRecommendations, getMentorHint } = require('../middleware/aiEngine');

// POST /api/ai/recommend - Get next problem recommendations
router.post('/recommend', async (req, res) => {
  try {
    const problems = await Problem.find().sort({ createdAt: -1 }).limit(20);
    const recs = await getRecommendations(problems);
    res.json({ recommendations: recs });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/ai/mentor - Get a hint for a problem
router.post('/mentor', async (req, res) => {
  try {
    const { problemName, approach } = req.body;
    const hint = await getMentorHint(problemName, approach);
    res.json({ hint });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
