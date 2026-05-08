const express = require('express');
const router = express.Router();
const Problem = require('../models/Problem');
const { analyzeWithAI } = require('../middleware/aiEngine');

// POST /api/problems - Create new problem
router.post('/', async (req, res) => {
  try {
    const { name, difficulty, approach, mistakes, solution, timeSpent } = req.body;

    if (!name || !approach) {
      return res.status(400).json({ error: 'Problem name and approach are required' });
    }

    // Run AI analysis
    let aiData = {};
    try {
      aiData = await analyzeWithAI(approach, mistakes, solution, name);
    } catch (aiErr) {
      console.warn('AI analysis failed, saving without AI data:', aiErr.message);
    }

    const problem = new Problem({
      name,
      difficulty: aiData.difficulty || difficulty || 'Medium',
      approach,
      mistakes,
      solution,
      timeSpent: timeSpent || 0,
      topics: aiData.topics || [],
      pattern: aiData.pattern || '',
      mistakeTypes: aiData.mistakeTypes || [],
      aiAnalysis: aiData.analysis || '',
      hint: aiData.hint || ''
    });

    await problem.save();
    res.status(201).json({ success: true, problem });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error: ' + err.message });
  }
});

// GET /api/problems - Get all problems
router.get('/', async (req, res) => {
  try {
    const problems = await Problem.find().sort({ createdAt: -1 });
    res.json(problems);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/problems/:id - Get single problem
router.get('/:id', async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.id);
    if (!problem) return res.status(404).json({ error: 'Problem not found' });
    res.json(problem);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/problems/:id
router.delete('/:id', async (req, res) => {
  try {
    await Problem.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Problem deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
