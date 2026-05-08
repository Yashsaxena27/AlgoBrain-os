const Problem = require('../models/Problem');
const { analyzeWithAI } = require('./aiController');

// POST /api/problems — log a new problem
const createProblem = async (req, res) => {
  try {
    const { name, platform, difficulty, approach, mistakes, solution, timeTaken } = req.body;

    if (!name || !approach) {
      return res.status(400).json({ error: 'Problem name and approach are required.' });
    }

    // Run AI analysis
    console.log('🤖 Running AI analysis...');
    const aiTags = await analyzeWithAI({ name, approach, mistakes, solution, difficulty });

    const problem = new Problem({
      name, platform, difficulty, approach, mistakes, solution, timeTaken, aiTags
    });

    await problem.save();

    res.status(201).json({
      message: 'Problem logged successfully!',
      problem
    });

  } catch (err) {
    console.error('createProblem error:', err.message);
    res.status(500).json({ error: 'Server error: ' + err.message });
  }
};

// GET /api/problems — get all problems
const getAllProblems = async (req, res) => {
  try {
    const problems = await Problem.find().sort({ createdAt: -1 });
    res.json(problems);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/problems/:id — get one problem
const getProblemById = async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.id);
    if (!problem) return res.status(404).json({ error: 'Problem not found' });
    res.json(problem);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE /api/problems/:id
const deleteProblem = async (req, res) => {
  try {
    await Problem.findByIdAndDelete(req.params.id);
    res.json({ message: 'Problem deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { createProblem, getAllProblems, getProblemById, deleteProblem };
