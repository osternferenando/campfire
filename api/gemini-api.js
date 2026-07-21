/**
 * Campfire AI — Frontend Client
 * Calls your Vercel proxy endpoint. NEVER calls Gemini directly.
 */

class CampfireAI {
  constructor() {
    this.history = [];
    this.currentAdventure = null;
  }

  getProxyUrl() {
    return CONFIG.PROXY_URL || '';
  }

  isLive() {
    return CONFIG.MODE === 'LIVE' && this.getProxyUrl();
  }

  setAdventureContext(category, title) {
    this.currentAdventure = { category, title };
    this.history = [];
  }

  async startAdventure(category, style, difficulty) {
    if (!this.isLive()) {
      return this.mockStartAdventure(category);
    }

    try {
      const response = await fetch(this.getProxyUrl() + '/api/proxy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `Begin a ${difficulty} ${style} ${category} adventure.`,
          category,
          style,
          difficulty
        })
      });

      if (!response.ok) throw new Error('Proxy error');
      const data = await response.json();
      this.addToHistory('narrator', data.narration);
      return data;

    } catch (err) {
      console.error('[AI] Start failed:', err);
      return this.mockStartAdventure(category);
    }
  }

  async continueStory(playerChoice) {
    if (!this.isLive()) {
      return this.mockContinueStory(playerChoice);
    }

    try {
      const history = this.history.slice(-5).map(h => h.content).join('\n\n');

      const response = await fetch(this.getProxyUrl() + '/api/proxy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: playerChoice,
          history,
          category: this.currentAdventure?.category,
          style: 'cinematic'
        })
      });

      if (!response.ok) throw new Error('Proxy error');
      const data = await response.json();
      this.addToHistory('narrator', data.narration);
      return data;

    } catch (err) {
      console.error('[AI] Continue failed:', err);
      return this.mockContinueStory(playerChoice);
    }
  }

  addToHistory(role, content) {
    this.history.push({ role, content });
    if (this.history.length > CONFIG.SETTINGS.maxMessageHistory) {
      this.history.shift();
    }
  }

  // ============================================
  // MOCK RESPONSES (DEMO MODE)
  // ============================================
  mockStartAdventure(category) {
    const openings = {
      fantasy: "The desert wind howls through ancient canyons as you stand before the sandstone archway. Golden light spills from within, casting long shadows across the red sand. This is the entrance to Ember — a city lost to time, spoken of only in whispers around campfires.",
      scifi: "The airlock hisses open, revealing the derelict station's command deck. Emergency lights pulse red across consoles covered in decades of dust. Through the viewport, a nebula swirls in impossible colors — and something massive moves within it.",
      mystery: "Rain drums against the conservatory glass as you examine the crime scene. The detective's notes are scattered across the mahogany desk, but one page is missing. Outside, lightning reveals a figure watching from the garden — then darkness swallows them again.",
      horror: "The manor's front door slams shut behind you with a sound like a coffin lid. Dust motes dance in the candlelight. From somewhere above, a child's laughter echoes — followed by the slow, deliberate scrape of something being dragged across floorboards.",
      pirate: "The Crimson Tide rises through turquoise depths, her sails tattered but her flag still flying. As your diving bell descends, you see movement on her deck — shadows that walk like men but cast no shadow of their own.",
      survival: "The evacuation siren fades, leaving only the wind and the distant groan of collapsing infrastructure. Your breath fogs the visor as you check supplies: three days of oxygen, one flare, and a radio that receives only static — except for the voice that whispered your name.",
      romance: "The train to Vienna departs in five minutes, and there they are — standing beneath the station clock just as the letter promised. The rain has turned their coat collar dark, but their eyes hold the same light you remember from that summer in Montmartre.",
      magic: "The Sorting Flame dances before you in the Great Hall, its colors shifting between emerald and amber. Four hundred students hold their breath. The Headmaster's voice rings out: 'Remember — the Flame chooses not who you are, but who you must become.'",
      historical: "The clockwork crown sits in the display case, its gears still turning after three centuries. As the museum's lights flicker, you notice something new — a fresh scratch on the glass, and a single drop of mercury rolling across the velvet."
    };

    return {
      narration: openings[category] || openings.fantasy,
      choices: [
        "Step forward boldly",
        "Observe carefully before acting",
        "Call out to announce your presence"
      ]
    };
  }

  mockContinueStory(playerChoice) {
    const continuations = [
      {
        narration: "The world shifts around you as you act. Shadows lengthen, and somewhere in the distance, a bell tolls — though no church has stood here for a thousand years. The path ahead splits into three, each corridor breathing with a different temperature.",
        choices: ["Take the warm corridor", "Take the cold corridor", "Take the corridor that smells of rain"]
      },
      {
        narration: "Your choice echoes through the halls of this place. The walls themselves seem to listen, to remember. A door materializes where none existed before, carved with symbols that match the ones in your dreams from the night before.",
        choices: ["Open the door slowly", "Knock three times first", "Search for another way"]
      },
      {
        narration: "Something stirs in response to your actions. The air grows thick with anticipation — or warning. You feel the weight of countless eyes upon you, though the room appears empty. A whisper threads through the silence, speaking your true name.",
        choices: ["Answer the whisper", "Remain silent", "Demand to know who speaks"]
      }
    ];

    return continuations[Math.floor(Math.random() * continuations.length)];
  }
}

const campfireAI = new CampfireAI();
