const express = require('express');
const router = express.Router();
const Problem = require('../models/Problem');

// GET /api/dashboard - Full dashboard stats
router.get('/', async (req, res) => {
  try {
    const problems = await Problem.find();
    const total = problems.length;

    // Topic distribution
    const topicMap = {};
    problems.forEach(p => {
      (p.topics || []).forEach(t => {
        topicMap[t] = (topicMap[t] || 0) + 1;
      });
    });

    // Mistake DNA
    const mistakeMap = {};
    problems.forEach(p => {
      (p.mistakeTypes || []).forEach(m => {
        mistakeMap[m] = (mistakeMap[m] || 0) + 1;
      });
    });

    // Difficulty breakdown
    const diffMap = { Easy: 0, Medium: 0, Hard: 0 };
    problems.forEach(p => {
      if (diffMap[p.difficulty] !== undefined) diffMap[p.difficulty]++;
    });

    // Pattern frequency
    const patternMap = {};
    problems.forEach(p => {
      if (p.pattern) patternMap[p.pattern] = (patternMap[p.pattern] || 0) + 1;
    });

    // Recent 5 problems
    const recent = problems.slice(-5).reverse();

    // Mistake DNA percentages
    const totalMistakes = Object.values(mistakeMap).reduce((a, b) => a + b, 0);
    const mistakeDNA = Object.entries(mistakeMap).map(([type, count]) => ({
      type,
      count,
      percent: totalMistakes > 0 ? Math.round((count / totalMistakes) * 100) : 0
    })).sort((a, b) => b.count - a.count);

    // Top weak topics (least solved / most mistakes)
    const topTopics = Object.entries(topicMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([topic, count]) => ({ topic, count }));

    res.json({
      total,
      topicDistribution: topTopics,
      mistakeDNA,
      difficultyBreakdown: diffMap,
      patternFrequency: Object.entries(patternMap).map(([p, c]) => ({ pattern: p, count: c })),
      recentProblems: recent
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
