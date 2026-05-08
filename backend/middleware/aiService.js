const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function callGemini(prompt) {
    try {
        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash"
        });

        const result = await model.generateContent(prompt);

        return result.response.text();

    } catch (error) {
        console.error("Gemini Error:", error.message);
        return "AI analysis failed.";
    }
}

module.exports = callGemini;