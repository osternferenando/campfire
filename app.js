// Campfire App State
const App = {
  currentScreen: 'splash',
  onboardingStep: 1,
  createFlowStep: 1,
  adventureState: {
    category: null,
    style: null,
    difficulty: null,
    inviteMethod: null
  },
  currentAdventure: null,
  messages: [],
  isTyping: false
};

// Screen Navigation
function showScreen(screenId, hideNav = false) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(screenId).classList.add('active');
  
  const mainApp = document.getElementById('main-app');
  const bottomNav = document.getElementById('bottom-nav');
  
  if (screenId === 'splash-screen' || screenId === 'onboarding-screen' || 
      screenId === 'create-flow-screen' || screenId === 'character-screen' ||
      screenId === 'adventure-room-screen' || screenId === 'complete-screen') {
    mainApp.classList.add('hidden');
    bottomNav.style.display = 'none';
  } else {
    mainApp.classList.remove('hidden');
    bottomNav.style.display = 'flex';
  }
  
  App.currentScreen = screenId;
}

function showMainScreen(screenName) {
  document.querySelectorAll('#main-app .screen').forEach(s => s.classList.remove('active'));
  document.getElementById(`${screenName}-screen`).classList.add('active');
  
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  document.querySelector(`.nav-item[data-screen="${screenName}"]`).classList.add('active');
  
  App.currentScreen = screenName;
}

// Splash Screen
function initSplash() {
  setTimeout(() => {
    showScreen('onboarding-screen');
  }, 3000);
}

// Onboarding
function initOnboarding() {
  const nextBtn = document.getElementById('onboarding-next');
  const dots = document.querySelectorAll('.onboarding-dots .dot');
  const steps = document.querySelectorAll('.onboarding-step');
  
  function showStep(step) {
    steps.forEach(s => s.classList.remove('active'));
    dots.forEach(d => d.classList.remove('active'));
    document.querySelector(`.onboarding-step[data-step="${step}"]`).classList.add('active');
    document.querySelector(`.dot[data-step="${step}"]`).classList.add('active');
    
    if (step === 3) {
      nextBtn.textContent = 'Begin Your Journey';
    } else {
      nextBtn.textContent = 'Next';
    }
  }
  
  nextBtn.addEventListener('click', () => {
    if (App.onboardingStep < 3) {
      App.onboardingStep++;
      showStep(App.onboardingStep);
    } else {
      showMainScreen('home');
    }
  });
  
  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      App.onboardingStep = parseInt(dot.dataset.step);
      showStep(App.onboardingStep);
    });
  });
}

// Bottom Navigation
function initNavigation() {
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => {
      const screen = item.dataset.screen;
      showMainScreen(screen);
    });
  });
}

// Home Screen
function initHome() {
  document.getElementById('create-adventure-btn').addEventListener('click', () => {
    App.createFlowStep = 1;
    App.adventureState = { category: null, style: null, difficulty: null, inviteMethod: null };
    updateFlowUI();
    showScreen('create-flow-screen');
  });
  
  document.getElementById('enter-adventure-btn').addEventListener('click', () => {
    startAdventure('The Lost City of Ember', 'fantasy');
  });
  
  document.querySelectorAll('.adventure-card').forEach(card => {
    card.addEventListener('click', () => {
      const adventure = card.dataset.adventure;
      if (adventure === 'blackwood') {
        startAdventure('Escape From Blackwood Manor', 'horror');
      } else if (adventure === 'station') {
        startAdventure('The Haunted Station', 'mystery');
      }
    });
  });
}

// Create Flow
function initCreateFlow() {
  // Category selection
  document.querySelectorAll('.category-card').forEach(card => {
    card.addEventListener('click', () => {
      document.querySelectorAll('.category-card').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      App.adventureState.category = card.dataset.category;
      setTimeout(() => nextFlowStep(), 300);
    });
  });
  
  // Style selection
  document.querySelectorAll('.style-card').forEach(card => {
    card.addEventListener('click', () => {
      document.querySelectorAll('.style-card').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      App.adventureState.style = card.dataset.style;
      setTimeout(() => nextFlowStep(), 300);
    });
  });
  
  // Difficulty selection
  document.querySelectorAll('.difficulty-card').forEach(card => {
    card.addEventListener('click', () => {
      document.querySelectorAll('.difficulty-card').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      App.adventureState.difficulty = card.dataset.difficulty;
      setTimeout(() => nextFlowStep(), 300);
    });
  });
  
  // Invite selection
  document.querySelectorAll('.invite-card').forEach(card => {
    card.addEventListener('click', () => {
      document.querySelectorAll('.invite-card').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      App.adventureState.inviteMethod = card.dataset.invite;
      
      if (card.dataset.invite === 'code') {
        document.getElementById('invite-code-section').classList.remove('hidden');
        document.getElementById('room-code').textContent = 'CAMP-' + Math.floor(1000 + Math.random() * 9000);
      } else {
        document.getElementById('invite-code-section').classList.add('hidden');
      }
    });
  });
  
  document.getElementById('flow-back').addEventListener('click', () => {
    if (App.createFlowStep > 1) {
      App.createFlowStep--;
      updateFlowUI();
    } else {
      showMainScreen('home');
    }
  });
  
  document.getElementById('start-adventure-btn').addEventListener('click', () => {
    const titles = {
      fantasy: 'The Lost City of Ember',
      scifi: 'Deep Space Echo',
      mystery: 'The Vanishing Heirloom',
      horror: 'Escape From Blackwood Manor',
      pirate: 'Curse of the Crimson Tide',
      survival: 'Last Stand',
      romance: 'Starlit Promises',
      magic: 'Magic Academy',
      historical: 'The Clockwork Crown'
    };
    const title = titles[App.adventureState.category] || 'New Adventure';
    showScreen('character-screen');
  });
  
  document.getElementById('copy-code').addEventListener('click', function() {
    const code = document.getElementById('room-code').textContent;
    navigator.clipboard?.writeText(code);
    this.textContent = 'Copied!';
    setTimeout(() => this.textContent = 'Copy', 2000);
  });
}

function nextFlowStep() {
  if (App.createFlowStep < 4) {
    App.createFlowStep++;
    updateFlowUI();
  }
}

function updateFlowUI() {
  document.querySelectorAll('.flow-step-content').forEach(s => s.classList.remove('active'));
  document.querySelector(`.flow-step-content[data-step="${App.createFlowStep}"]`).classList.add('active');
  
  document.querySelectorAll('.flow-progress .flow-step').forEach((step, idx) => {
    step.classList.toggle('active', idx < App.createFlowStep);
  });
}

// Character Creation
function initCharacter() {
  document.getElementById('char-back').addEventListener('click', () => {
    showScreen('create-flow-screen');
  });
  
  document.getElementById('generate-portrait').addEventListener('click', () => {
    const avatar = document.getElementById('char-avatar');
    avatar.innerHTML = '<img src="https://api.dicebear.com/7.x/avataaars/svg?seed=' + Date.now() + '" alt="Character">';
  });
  
  document.getElementById('save-character-btn').addEventListener('click', () => {
    const name = document.getElementById('char-name').value || 'Adventurer';
    const titles = {
      fantasy: 'The Lost City of Ember',
      scifi: 'Deep Space Echo',
      mystery: 'The Vanishing Heirloom',
      horror: 'Escape From Blackwood Manor',
      pirate: 'Curse of the Crimson Tide',
      survival: 'Last Stand',
      romance: 'Starlit Promises',
      magic: 'Magic Academy',
      historical: 'The Clockwork Crown'
    };
    startAdventure(titles[App.adventureState.category] || 'New Adventure', App.adventureState.category);
  });
}

// Adventure Room
const storyScenes = {
  'The Lost City of Ember': [
    {
      narrator: "The desert wind howls through ancient canyons as you stand before the sandstone archway. Golden light spills from within, casting long shadows across the red sand. This is the entrance to Ember — a city lost to time, spoken of only in whispers around campfires.",
      choices: [
        "Step through the archway into the golden light",
        "Examine the strange symbols carved into the stone",
        "Call out to see if anyone is inside"
      ]
    },
    {
      narrator: "The moment you cross the threshold, the temperature shifts. Cool air, scented with cinnamon and old parchment, wraps around you. Torches ignite along the walls in sequence, revealing a grand hall lined with statues of flame-winged guardians. At the far end, a pedestal holds a crystalline orb pulsing with inner fire.",
      choices: [
        "Approach the orb cautiously",
        "Inspect the guardian statues first",
        "Search for hidden passages along the walls"
      ]
    },
    {
      narrator: "Your companion's voice echoes from behind: 'The legends say the Guardian of Flames still watches over this place.' As if summoned by the words, the temperature rises. The statues' eyes begin to glow with ember light. A voice, ancient and crackling like burning wood, fills the chamber: 'Who seeks the heart of Ember?'",
      choices: [
        "Declare yourself as a seeker of truth",
        "Ask the Guardian about the city's history",
        "Ready yourself for combat"
      ]
    },
    {
      narrator: "The Guardian's form materializes — a towering figure of living flame and molten gold. Yet its eyes hold wisdom, not wrath. 'Many have come seeking power,' it rumbles. 'Few have come seeking understanding. The city offers both, but demands a choice in return.' The orb flares, showing visions of two paths.",
      choices: [
        "Choose to share Ember's power with the world",
        "Choose to protect Ember by keeping it hidden",
        "Ask for more time to consider"
      ]
    }
  ],
  'Escape From Blackwood Manor': [
    {
      narrator: "Rain lashes against the windows of Blackwood Manor as the heavy oak door slams shut behind you. The air smells of dust and decay. A single candle flickers on the mantelpiece, casting dancing shadows across portraits of stern-faced ancestors who seem to watch your every move.",
      choices: [
        "Light additional candles to see better",
        "Investigate the portraits on the walls",
        "Call out to see if anyone else is here"
      ]
    },
    {
      narrator: "A floorboard creaks overhead. Then another. Footsteps — slow, deliberate — cross the ceiling above the grand foyer. The candle flame gutters. From somewhere deep in the manor, a clock begins to chime midnight, though its hands stopped decades ago.",
      choices: [
        "Quietly climb the main staircase",
        "Search for a weapon or tool",
        "Try to find a back exit"
      ]
    }
  ],
  'The Haunted Station': [
    {
      narrator: "The train stopped at midnight, but nobody was inside. The station platform stretches into fog, its gas lamps flickering with sickly green light. A timetable on the wall shows the last train departed in 1923. Your breath clouds in the unnatural cold.",
      choices: [
        "Board the empty train to investigate",
        "Search the station office for records",
        "Wait on the platform for someone to arrive"
      ]
    },
    {
      narrator: "The train whistle screams — a sound that seems to come from everywhere at once. The carriages rock gently, though no wind blows. Through the fog, you glimpse a figure in a conductor's uniform standing at the far end of the platform. It doesn't move. It doesn't breathe. It waits.",
      choices: [
        "Approach the conductor",
        "Hide behind a pillar",
        "Shout to the figure"
      ]
    }
  ]
};

function startAdventure(title, category) {
  App.currentAdventure = { title, category, sceneIndex: 0 };
  App.messages = [];
  
  document.getElementById('room-title').textContent = title;
  document.getElementById('room-chapter').textContent = 'Chapter 1';
  
  const content = document.getElementById('room-content');
  content.innerHTML = '';
  
  showScreen('adventure-room-screen');
  
  // Initial narrator message
  setTimeout(() => {
    addNarratorMessage("Welcome to your adventure. The story awaits your choices...");
    setTimeout(() => showScene(0), 1500);
  }, 500);
}

function showScene(index) {
  const scenes = storyScenes[App.currentAdventure.title];
  if (!scenes || index >= scenes.length) {
    completeAdventure();
    return;
  }
  
  App.currentAdventure.sceneIndex = index;
  const scene = scenes[index];
  
  setTimeout(() => {
    addNarratorMessage(scene.narrator);
    showChoices(scene.choices);
    document.getElementById('room-chapter').textContent = `Chapter ${index + 1}`;
  }, 1000);
}

function addNarratorMessage(text) {
  const content = document.getElementById('room-content');
  const bubble = document.createElement('div');
  bubble.className = 'story-bubble narrator-bubble';
  bubble.innerHTML = `
    <div class="narrator-label">Campfire Narrator</div>
    <div class="narrator-text">${text}</div>
  `;
  content.appendChild(bubble);
  content.scrollTop = content.scrollHeight;
}

function addPlayerMessage(text) {
  const content = document.getElementById('room-content');
  const bubble = document.createElement('div');
  bubble.className = 'story-bubble player-bubble';
  bubble.innerHTML = `
    <div class="player-name">You</div>
    <div class="player-text">${text}</div>
  `;
  content.appendChild(bubble);
  content.scrollTop = content.scrollHeight;
}

function showChoices(choices) {
  const panel = document.getElementById('choice-panel');
  const buttons = document.getElementById('choice-buttons');
  buttons.innerHTML = '';
  
  choices.forEach((choice, idx) => {
    const btn = document.createElement('button');
    btn.className = 'choice-btn';
    btn.innerHTML = `
      <span class="choice-letter">${String.fromCharCode(65 + idx)}</span>
      <span>${choice}</span>
    `;
    btn.addEventListener('click', () => {
      panel.classList.add('hidden');
      addPlayerMessage(choice);
      showScene(App.currentAdventure.sceneIndex + 1);
    });
    buttons.appendChild(btn);
  });
  
  panel.classList.remove('hidden');
}

function initAdventureRoom() {
  document.getElementById('room-back').addEventListener('click', () => {
    showMainScreen('home');
  });
  
  document.getElementById('send-btn').addEventListener('click', () => {
    const input = document.getElementById('message-input');
    const text = input.value.trim();
    if (text) {
      addPlayerMessage(text);
      input.value = '';
      
      // Simulate AI response
      setTimeout(() => {
        const responses = [
          "The world shifts around you as you act...",
          "Your choice echoes through the halls of this place.",
          "Something stirs in response to your actions.",
          "The story bends to your will."
        ];
        addNarratorMessage(responses[Math.floor(Math.random() * responses.length)]);
      }, 800);
    }
  });
  
  document.getElementById('message-input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      document.getElementById('send-btn').click();
    }
  });
}

function completeAdventure() {
  setTimeout(() => {
    showScreen('complete-screen');
  }, 1500);
}

function initComplete() {
  document.getElementById('return-home-btn').addEventListener('click', () => {
    showMainScreen('home');
  });
  
  document.getElementById('share-story-btn').addEventListener('click', () => {
    alert('Story book feature coming soon! Your adventure has been saved to Memories.');
  });
}

// Adventures List
function initAdventuresList() {
  const adventures = [
    { title: 'The Lost City of Ember', category: 'fantasy', emoji: '🏰', time: '45 min', color: 'linear-gradient(135deg, #2d1810 0%, #1a0f0a 100%)' },
    { title: 'Deep Space Echo', category: 'scifi', emoji: '🚀', time: '50 min', color: 'linear-gradient(135deg, #1a1a2e 0%, #0f0f23 100%)' },
    { title: 'The Haunted Station', category: 'mystery', emoji: '🚂', time: '40 min', color: 'linear-gradient(135deg, #0f2027 0%, #203a43 100%)' },
    { title: 'Escape From Blackwood Manor', category: 'horror', emoji: '🏚️', time: '55 min', color: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)' },
    { title: 'Curse of the Crimson Tide', category: 'pirate', emoji: '🏴‍☠️', time: '60 min', color: 'linear-gradient(135deg, #2c1810 0%, #1a0f0a 100%)' },
    { title: 'Last Stand', category: 'survival', emoji: '🧟', time: '55 min', color: 'linear-gradient(135deg, #1e3a28 0%, #0f1f14 100%)' }
  ];
  
  const list = document.getElementById('adventures-list');
  list.innerHTML = adventures.map(a => `
    <div class="adventure-list-item" data-title="${a.title}">
      <div class="adventure-list-image" style="background: ${a.color};">
        <span>${a.emoji}</span>
      </div>
      <div class="adventure-list-info">
        <h4>${a.title}</h4>
        <p>${a.category.charAt(0).toUpperCase() + a.category.slice(1)} • ${a.time}</p>
      </div>
    </div>
  `).join('');
  
  document.querySelectorAll('.adventure-list-item').forEach(item => {
    item.addEventListener('click', () => {
      const title = item.dataset.title;
      const adv = adventures.find(a => a.title === title);
      if (adv) startAdventure(adv.title, adv.category);
    });
  });
  
  // Category tabs
  document.querySelectorAll('.category-tabs .tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.category-tabs .tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      
      const category = tab.dataset.category;
      document.querySelectorAll('.adventure-list-item').forEach(item => {
        const itemCat = adventures.find(a => a.title === item.dataset.title)?.category;
        item.style.display = (category === 'all' || itemCat === category) ? 'flex' : 'none';
      });
    });
  });
}

// Theme Toggle
function initTheme() {
  const toggle = document.getElementById('theme-toggle');
  toggle.addEventListener('change', () => {
    // Light mode implementation would go here
    console.log('Theme toggle:', toggle.checked ? 'dark' : 'light');
  });
}

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
  initSplash();
  initOnboarding();
  initNavigation();
  initHome();
  initCreateFlow();
  initCharacter();
  initAdventureRoom();
  initComplete();
  initAdventuresList();
  initTheme();
});
