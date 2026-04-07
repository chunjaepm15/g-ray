/**
 * GEMINI API INTEGRATION for GRAMMAR VIEWER
 */

const GEMINI_CONFIG = {
  API_KEY: "", // Should be populated from server or environment
  ENDPOINT: "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent"
};

/**
 * Generate a rich example sentence using Gemini
 */
async function generateAIGrammarSentence(concept, level = 'mid') {
  if (!GEMINI_CONFIG.API_KEY) {
    console.error("Gemini API Key is missing.");
    return null;
  }

  const prompt = `
    You are an English teacher. Create a sample sentence for Grade 3 Middle School students in Korea based on the following grammar:
    Grammar: ${concept}
    Difficulty: ${level}
    Constraint: Use vocabulary from "2022 MOE Basic Vocabulary 3000".
    Format: JSON { "en": "sentence", "ko": "translation" }
  `;

  try {
    const response = await fetch(`${GEMINI_CONFIG.ENDPOINT}?key=${GEMINI_CONFIG.API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });
    const data = await response.json();
    const resultText = data.candidates[0].content.parts[0].text;
    const cleanJson = resultText.match(/\{.*\}/s)[0];
    return JSON.parse(cleanJson);
  } catch (err) {
    console.error("AI Generation failed:", err);
    return null;
  }
}
