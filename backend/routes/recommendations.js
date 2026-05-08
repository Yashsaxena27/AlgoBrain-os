const express = require('express');
const router = express.Router();
const Problem = require('../models/Problem');

// GET /api/recommendations — Smart next problem suggestions
router.get('/', async (req, res) => {
  try {
    const problems = await Problem.find();

    if (problems.length === 0) {
      return res.json({
        success: true,
        recommendations: [],
        message: 'Log your first problem to get AI recommendations!'
      });
    }

    // Find weak topics
    const topicMistakeMap = {};
    problems.forEach(p => {
      (p.aiTags?.topics || []).forEach(topic => {
        if (!topicMistakeMap[topic]) topicMistakeMap[topic] = { total: 0, mistakes: 0 };
        topicMistakeMap[topic].total++;
        if (p.aiTags?.mistakeTypes?.length > 0) topicMistakeMap[topic].mistakes++;
      });
    });

    const weakTopics = Object.entries(topicMistakeMap)
      .map(([topic, data]) => ({
        topic,
        weaknessScore: data.total > 0 ? (data.mistakes / data.total) : 0
      }))
      .sort((a, b) => b.weaknessScore - a.weaknessScore)
      .slice(0, 3)
      .map(t => t.topic);

    // Build recommendations
    const recommendations = [
      {
        type: 'Weak Topic Practice',
        reason: `You struggle most with: ${weakTopics.join(', ')}`,
        topics: weakTopics,
        suggestedProblems: getSuggestedProblems(weakTopics)
      },
      {
        type: 'Revision Needed',
        reason: 'Problems you marked for revision',
        problems: problems
          .filter(p => p.status === 'Need Revision')
          .slice(0, 3)
          .map(p => ({ title: p.title, id: p._id }))
      },
      {
        type: 'Pattern Mastery',
        reason: 'Build pattern recognition with these next steps',
        nextPatterns: getNextPatterns(problems)
      }
    ];

    res.json({ success: true, weakTopics, recommendations });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

function getSuggestedProblems(topics) {
  const suggestions = {
    'Array': ['Two Sum', 'Best Time to Buy Stock', 'Maximum Subarray'],
    'Binary Search': ['Search in Rotated Array', 'Find Minimum in Rotated Array', 'Koko Eating Bananas'],
    'Dynamic Programming': ['Climbing Stairs', 'House Robber', 'Coin Change'],
    'Graph': ['Number of Islands', 'Clone Graph', 'Course Schedule'],
    'Tree': ['Maximum Depth of Binary Tree', 'Invert Binary Tree', 'LCA of BST'],
    'Two Pointers': ['Valid Palindrome', '3Sum', 'Container With Most Water'],
    'Sliding Window': ['Longest Substring Without Repeating', 'Minimum Window Substring'],
    'Stack': ['Valid Parentheses', 'Min Stack', 'Daily Temperatures'],
    'Heap': ['Kth Largest Element', 'Top K Frequent', 'Find Median from Data Stream']
  };
  const result = [];
  topics.forEach(t => {
    if (suggestions[t]) result.push(...suggestions[t].slice(0, 2));
  });
  return [...new Set(result)].slice(0, 5);
}

function getNextPatterns(problems) {
  const seenPatterns = new Set(problems.map(p => p.aiTags?.pattern).filter(Boolean));
  const allPatterns = ['Two Pointers', 'Sliding Window', 'Binary Search', 'BFS', 'DFS', 'Dynamic Programming', 'Backtracking', 'Greedy', 'Divide and Conquer'];
  return allPatterns.filter(p => !seenPatterns.has(p)).slice(0, 3);
}

module.exports = router;
