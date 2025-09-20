// משתנים גלובליים
let globalLevel = 1, currentStage = 1, score = 0, levelScore = 0, lives = 3;
let gameRunning = false, starSpeed = 2, spawnRate = 0.025, combo = 1, comboCount = 0, maxCombo = 1;
let shieldTime = 0, speedBoostTime = 0, freezeTime = 0, magnetTime = 0, doublePointsTime = 0;
let stageStartTime = Date.now(), levelStartTime = Date.now();
let starsCaught = 0, bombsAvoided = 0, blackholesAvoided = 0, lightningAvoided = 0;
let completedStages = 0, mouseX = 0, mouseY = 0;
let lastTimestamp = null;
const SAVE_KEY = "catchStarsSave_v1";

// נתוני שלבים, כוכבים ופאוור-אפים
const baseStageTargets = [100,150,200,280,370,480,600,750,920,1120,1350,1620,1930,2280,2670,3100,3570,4080,4630,5220];
const stageNames = ["התחלה","צעדים ראשונים","מתרגל","מבין","מתמיד","מתחמם","מתקדם","מאתגר","קשה","מורכב",
                    "מקצועי","מומחה","אמן","וירטואוז","גאון","מדהים","אגדי","בלתי יתואר","על אנושי","מושלם"];
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
