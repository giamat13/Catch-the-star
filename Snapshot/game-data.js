// ----------------------------
// משתנים גלובליים
// ----------------------------
let globalLevel = 1;
let currentStage = 1;
let score = 0;
let levelScore = 0;
let lives = 3;
let gameRunning = false;
let starSpeed = 2;
let spawnInterval = 1000; // מילישניות, משך זמן בין יצירת עצמים
let spawnRate = 0.025;
let bombChance = 0.1;
let combo = 1;
let comboCount = 0;
let maxCombo = 1;
let shieldTime = 0;
let speedBoostTime = 0;
let freezeTime = 0;
let magnetTime = 0;
let doublePointsTime = 0;
let lastStarType = null;
let stageStartTime = Date.now();
let levelStartTime = Date.now();
let starsCaught = 0;
let bombsAvoided = 0;
let blackholesAvoided = 0;
let lightningAvoided = 0;
let levelStarsCaught = 0;
let completedStages = 0;
let powerups = {};
let mouseX = 0;
let mouseY = 0;

// game-loop control
let gameLoopRunning = false;
let lastTimestamp = null;
let autoSaveIntervalId = null;
const SAVE_KEY = "catchStarsSave_v1";

// ----------------------------
// ארגז כלים: cookie helpers
// ----------------------------
function setCookie(name, value, days) {
  const d = new Date();
  d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000));
  document.cookie = name + "=" + encodeURIComponent(JSON.stringify(value)) + ";expires=" + d.toUTCString() + ";path=/";
}

function getCookie(name) {
  const cname = name + "=";
  const decodedCookie = decodeURIComponent(document.cookie || "");
  const ca = decodedCookie.split(';');
  for (let c of ca) {
    c = c.trim();
    if (c.indexOf(cname) === 0) {
      try {
        return JSON.parse(c.substring(cname.length, c.length));
      } catch {
        return null;
      }
    }
  }
  return null;
}

// ----------------------------
// תבניות שלבים, סוגי כוכבים ופאוור-אפים
// ----------------------------
const baseStageTargets = [
  100, 150, 200, 280, 370, 480, 600, 750, 920, 1120,
  1350, 1620, 1930, 2280, 2670, 3100, 3570, 4080, 4630, 5220
];

const stageNames = [
  "התחלה", "צעדים ראשונים", "מתרגל", "מבין", "מתמיד",
  "מתחמם", "מתקדם", "מאתגר", "קשה", "מורכב",
  "מקצועי", "מומחה", "אמן", "וירטואוז", "גאון",
  "מדהים", "אגדי", "בלתי יתואר", "על אנושי", "מושלם"
];

const baseStarTypes = [
  { emoji: '⭐', basePoints: 5, chance: 0.4, class: 'star-regular' },
  { emoji: '🌟', basePoints: 10, chance: 0.3, class: 'star-blue' },
  { emoji: '💫', basePoints: 20, chance: 0.15, class: 'star-silver' },
  { emoji: '🌠', basePoints: 50, chance: 0.08, class: 'star-gold' },
  { emoji: '🎆', basePoints: 100, chance: 0.02, class: 'star-rainbow' }
];

const powerupTypes = [
  { emoji: '🛡️', type: 'shield', chance: 0.04 },
  { emoji: '❤️', type: 'life', chance: 0.03 },
  { emoji: '⚡', type: 'speed', chance: 0.04 },
  { emoji: '❄️', type: 'freeze', chance: 0.02 },
  { emoji: '🧲', type: 'magnet', chance: 0.02 },
  { emoji: '💎', type: 'double', chance: 0.02 }
];

// ----------------------------
// אלמנטים DOM
// ----------------------------
const gameContainer = document.getElementById('gameContainer');
const player = document.getElementById('player');
