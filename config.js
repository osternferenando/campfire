/**
 * Campfire Configuration
 * MODE: 'DEMO' = mock stories, works offline
 * MODE: 'LIVE' = real AI via Vercel proxy
 */

const CONFIG = {
  // ============================================
  // SWITCH: 'DEMO' or 'LIVE'
  // ============================================
  MODE: 'LIVE',

  // ============================================
  // VERCEL PROXY URL
  // After you deploy to Vercel, paste your URL here
  // Example: 'https://campfire-backend.vercel.app'
  // ============================================
  PROXY_URL: 'campfire-backend-cq63ecw0r-feraz.vercel.app',

  // ============================================
  // FIREBASE CONFIG (public — safe to expose)
  // Add this later when you set up Firebase Auth
  // ============================================
  FIREBASE_CONFIG: {
    // apiKey: "AIzaSyAB_fZa8AWajzmQwZGkE7EDkwcx67x_Ojo",
    // authDomain: "campfire-app-14ea3.firebaseapp.com",
    // projectId: "campfire-app-14ea3",
    // storageBucket: "campfire-app-14ea3.firebasestorage.app",
    // messagingSenderId: "95995169528",
    // appId: "1:95995169528:web:f7222b9dba46ff31e2490d"
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
