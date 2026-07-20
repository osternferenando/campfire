// api/narrate.js — Vercel Serverless Function
// This file NEVER reaches the browser. It runs on Vercel's server only.

export default async function handler(req, res) {
  // Only accept POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { prompt, history, category, style, difficulty } = req.body;

  // Build the prompt for Gemini
  const systemPrompt = `You are Campfire Narrator, a master storyteller. 
Create immersive ${style || 'cinematic'} ${category || 'fantasy'} story content.
Never break character. Never mention you are AI. Write 2-3 paragraphs.
End with exactly 3 choices labeled A), B), C).`;

  const fullPrompt = history 
    ? `${systemPrompt}\n\nStory so far:\n${history}\n\nPlayer chooses: ${prompt}\n\nContinue the story:`
    : `${systemPrompt}\n\nBegin the adventure:\n${prompt}`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: fullPrompt }] }],
          generationConfig: {
            temperature: 0.9,
            maxOutputTokens: 800,
            topP: 0.95
          }
        })
      }
    );

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || 'The story continues...';

    // Parse choices from AI response
    const choiceMatches = text.match(/[A-C]\)\s*(.+)/g) || [];
    const choices = choiceMatches.map(c => c.replace(/^[A-C]\)\s*/, '').trim());
    
    // Clean narration (remove choice lines)
    let narration = text;
    choiceMatches.forEach(c => narration = narration.replace(c, ''));
    narration = narration.replace(/[A-C]\)/g, '').trim();

    res.status(200).json({ 
      success: true,
      narration, 
      choices,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('[API Error]', error);
    res.status(500).json({ 
      error: 'Story generation failed',
      fallback: true,
      narration: "The path ahead shimmers with possibility, though the ancient voices remain silent for now. What do you do?",
      choices: ["Press forward", "Wait and listen", "Try a different approach"]
    });
  }
}
