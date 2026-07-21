/**
 * Campfire Configuration
 * MODE: 'DEMO' = mock stories, works offline
 * MODE: 'LIVE' = real AI via Vercel proxy
 */

const CONFIG = {
  // ============================================
  // SWITCH: 'DEMO' or 'LIVE'
  // ============================================
  MODE: 'DEMO',

  // ============================================
  // VERCEL PROXY URL
  // After you deploy to Vercel, paste your URL here
  // Example: 'https://campfire-backend.vercel.app'
  // ============================================
  PROXY_URL: '',

  // ============================================
  // FIREBASE CONFIG (public — safe to expose)
  // Add this later when you set up Firebase Auth
  // ============================================
  FIREBASE_CONFIG: {
    // apiKey: "your-firebase-api-key",
    // authDomain: "your-project.firebaseapp.com",
    // projectId: "your-project",
    // storageBucket: "your-project.appspot.com",
    // messagingSenderId: "123456789",
    // appId: "your-app-id"
  },

  // ============================================
  // APP SETTINGS
  // ============================================
  SETTINGS: {
    maxPlayers: 4,
    maxMessageHistory: 50,
    typingIndicatorDelay: 1500,
    narratorDelay: 800
  }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = CONFIG;
}
