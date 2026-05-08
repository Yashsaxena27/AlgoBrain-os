const Problem = require('../models/Problem');

const getDashboardStats = async (req, res) => {
  try {
    const problems = await Problem.find();

    const total = problems.length;

    // Difficulty distribution
    const difficultyCount = { Easy: 0, Medium: 0, Hard: 0 };
    problems.forEach(p => {
      if (difficultyCount[p.difficulty] !== undefined) {
        difficultyCount[p.difficulty]++;
      }
    });

    // Topic frequency
    const topicMap = {};
    problems.forEach(p => {
      (p.aiTags?.topics || []).forEach(topic => {
        topicMap[topic] = (topicMap[topic] || 0) + 1;
      });
    });
    const topTopics = Object.entries(topicMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([topic, count]) => ({ topic, count }));

    // Mistake DNA
    const mistakeMap = {};
    problems.forEach(p => {
      (p.aiTags?.mistakeTypes || []).forEach(m => {
        mistakeMap[m] = (mistakeMap[m] || 0) + 1;
      });
    });
    const totalMistakes = Object.values(mistakeMap).reduce((a, b) => a + b, 0);
    const mistakeDNA = Object.entries(mistakeMap)
      .sort((a, b) => b[1] - a[1])
      .map(([type, count]) => ({
        type,
        count,
        percent: totalMistakes > 0 ? Math.round((count / totalMistakes) * 100) : 0
      }));

    // Pattern frequency
    const patternMap = {};
    problems.forEach(p => {
      const pat = p.aiTags?.pattern;
      if (pat && pat !== 'Not determined') {
        patternMap[pat] = (patternMap[pat] || 0) + 1;
      }
    });
    const patterns = Object.entries(patternMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([pattern, count]) => ({ pattern, count }));

    // Recent 5 problems
    const recent = await Problem.find().sort({ createdAt: -1 }).limit(5);

    // Weekly activity (last 7 days)
    const weeklyActivity = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dayStart = new Date(date.setHours(0, 0, 0, 0));
      const dayEnd = new Date(date.setHours(23, 59, 59, 999));
      const count = problems.filter(p => {
        const d = new Date(p.createdAt);
        return d >= dayStart && d <= dayEnd;
      }).length;
      weeklyActivity.push({
        day: dayStart.toLocaleDateString('en-US', { weekday: 'short' }),
        count
      });
    }

    res.json({
      total,
      difficultyCount,
      topTopics,
      mistakeDNA,
      patterns,
      recent,
      weeklyActivity
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getDashboardStats };
