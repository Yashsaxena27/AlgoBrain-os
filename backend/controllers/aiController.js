const fetch = require('node-fetch');

async function analyzeWithAI(problemData) {
  const { name, approach, mistakes, solution, difficulty } = problemData;

  const prompt = `You are an expert DSA coach and analyst.

Analyze this problem-solving session and return ONLY a JSON object. No markdown, no text outside the JSON.

Problem: ${name}
Difficulty: ${difficulty}
Approach Used: ${approach}
Mistakes Made: ${mistakes || 'None mentioned'}
Solution Notes: ${solution || 'Not provided'}

Return exactly this JSON structure:
{
  "topics": ["array of DSA topics, e.g. Binary Search, Arrays, DP, Graph"],
  "pattern": "main algorithmic pattern e.g. Sliding Window, Two Pointer, BFS",
  "aiDifficulty": "Easy or Medium or Hard",
  "mistakeTypes": ["Off-by-one", "Logic gap", etc - only if mistakes exist],
  "analysis": "2-3 sentences on what the user understood and struggled with",
  "recommendation": "1-2 sentences on what to practice next"
}`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        messages: [{ role: 'user', content: prompt }]
      })
    });

    const data = await response.json();

    if (data.error) throw new Error(data.error.message);

    const rawText = data.content[0].text.trim();
    const clean = rawText.replace(/```json|```/g, '').trim();
    return JSON.parse(clean);

  } catch (err) {
    console.error('AI Analysis error:', err.message);
    return {
      topics: ['Unknown'],
      pattern: 'Not determined',
      aiDifficulty: difficulty || 'Medium',
      mistakeTypes: mistakes ? ['Unclassified'] : [],
      analysis: 'AI analysis unavailable. Check your API key in .env file.',
      recommendation: 'Continue practicing similar problems.'
    };
  }
}

module.exports = { analyzeWithAI };
