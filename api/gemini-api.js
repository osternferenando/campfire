/**
 * Campfire AI — Frontend Client
 * Calls /api/narrate (your serverless route) — NEVER calls Gemini directly
 */

class CampfireAI {
  constructor() {
    this.history = [];
    this.currentAdventure = null;
    this.apiUrl = '/api/narrate'; // Your own endpoint, not Google's
  }

  setAdventureContext(category, title) {
    this.currentAdventure = { category, title };
    this.history = [];
  }

  async startAdventure(category, style, difficulty) {
    if (CONFIG.MODE === 'DEMO') {
      return this.mockStartAdventure(category);
    }

    const response = await fetch(this.apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt: `Begin a ${difficulty} ${style} ${category} adventure.`,
        category,
        style,
        difficulty
      })
    });

    const data = await response.json();
    this.addToHistory('narrator', data.narration);
    return data;
  }

  async continueStory(playerChoice) {
    if (CONFIG.MODE === 'DEMO') {
      return this.mockContinueStory(playerChoice);
    }

    const history = this.history.slice(-5).map(h => h.content).join('\n\n');

    const response = await fetch(this.apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt: playerChoice,
        history,
        category: this.currentAdventure?.category,
        style: 'cinematic'
      })
    });

    const data = await response.json();
    this.addToHistory('narrator', data.narration);
    return data;
  }

  addToHistory(role, content) {
    this.history.push({ role, content });
    if (this.history.length > 50) this.history.shift();
  }

  // Mock responses remain the same for DEMO mode...
  mockStartAdventure(category) { /* ... same as before ... */ }
  mockContinueStory(playerChoice) { /* ... same as before ... */ }
}

const campfireAI = new CampfireAI();
