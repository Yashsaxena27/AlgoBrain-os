const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Helper function to safely parse JSON
function safeJSONParse(text) {
  try {
    const clean = text.replace(/```json|```/g, "").trim();
    return JSON.parse(clean);
  } catch (err) {
    console.error("JSON Parse Error:", err.message);
    return null;
  }
}

// Generic Gemini caller
async function callGemini(prompt) {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash"
    });

    const result = await model.generateContent(prompt);

    const text = result.response.text();

    return safeJSONParse(text);

  } catch (error) {
    console.error("Gemini API Error:", error.message);
    return null;
  }
}

// Core: Analyze a problem submission
async function analyzeWithAI(approach, mistakes, solution, problemName) {

  const prompt = `
Analyze this DSA problem submission and return ONLY a valid JSON object.

Problem Name: ${problemName}
User's Approach: ${approach}
Mistakes Made: ${mistakes || 'None mentioned'}
Solution Notes: ${solution || 'Not provided'}

Return this exact JSON structure:

{
  "topics": ["array of DSA topics like Binary Search, DP, Graph, etc"],
  "pattern": "one pattern like Sliding Window, Two Pointers, etc",
  "difficulty": "Easy or Medium or Hard",
  "mistakeTypes": ["array of mistake types like Off-by-one, Logic gap, Edge case missed, etc"],
  "analysis": "2-3 sentence analysis of what the user did well and where they struggled",
  "hint": "one actionable tip to improve for next time"
}
`;

  return await callGemini(prompt);
}

// Get personalized recommendations
async function getRecommendations(problems) {

  const summary = problems.map(p => ({
    name: p.name,
    topics: p.topics,
    mistakes: p.mistakeTypes,
    difficulty: p.difficulty
  }));

  const prompt = `
Based on this user's DSA problem history, recommend 5 problems to practice next.

History:
${JSON.stringify(summary)}

Return ONLY this JSON:

{
  "recommendations": [
    {
      "name": "Problem Name",
      "why": "Why this problem is recommended",
      "topic": "Main topic",
      "difficulty": "Easy/Medium/Hard",
      "platform": "LeetCode/GFG"
    }
  ]
}
`;

  const result = await callGemini(prompt);

  return result?.recommendations || [];
}

// AI Mentor Hint
async function getMentorHint(problemName, approach) {

  const prompt = `
You are a strict but helpful DSA interviewer.

The user is stuck on:
"${problemName}"

Their current approach:
"${approach}"

Give ONE guiding hint WITHOUT giving the full answer.

Return ONLY JSON:

{
  "hint": "your hint here"
}
`;

  const result = await callGemini(prompt);

  return result?.hint || "Think about optimizing your current approach.";
}

module.exports = {
  analyzeWithAI,
  getRecommendations,
  getMentorHint
};
