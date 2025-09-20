// ----------------------------
// משתנים גלובליים והגדרות
// ----------------------------
let globalLevel = 1;
let currentStage = 1;
let score = 0;
let levelScore = 0;
let lives = 3;
let gameRunning = false;
let starSpeed = 2;
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

// ----------------------------
// אלמנטים DOM
// ----------------------------
const gameContainer = document.getElementById('gameContainer');
const player = document.getElementById('player');

// ----------------------------
// פונקציות עזר ל-UI
// ----------------------------
function updateScore() { document.getElementById('score').textContent = score; }
function updateLives() { document.getElementById('lives').textContent = lives; }
function updateCombo() {
    document.getElementById('combo').textContent = 'x' + combo;
    if(combo > maxCombo) maxCombo = combo;
}
function updateStageInfo() {
    document.getElementById('stageNum').textContent = currentStage;
}
function updateGlobalLevel() {
    document.getElementById('globalLevel').textContent = `רמה גלובלית: ${globalLevel} (מכפיל נקודות: x${globalLevel})`;
}
