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
// cookie helpers (optional)
// ----------------------------
function setCookie(name, value, days) {
    const d = new Date();
    d.setTime(d.getTime() + (days*24*60*60*1000));
    document.cookie = name + "=" + encodeURIComponent(JSON.stringify(value)) + ";expires=" + d.toUTCString() + ";path=/";
}

function getCookie(name) {
    const cname = name + "=";
    const decodedCookie = decodeURIComponent(document.cookie || "");
    const ca = decodedCookie.split(';');
    for(let c of ca) {
        c = c.trim();
        if (c.indexOf(cname) === 0) {
            try { return JSON.parse(c.substring(cname.length, c.length)); } 
            catch { return null; }
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

// ----------------------------
// עדכון UI
// ----------------------------
function updateScore() {
    document.getElementById('score').textContent = score;
}
function updateLives() {
    document.getElementById('lives').textContent = lives;
}
function updateCombo() {
    document.getElementById('combo').textContent = 'x' + combo;
    document.getElementById('combo').style.color = combo > 1 ? '#4caf50' : '#fff';
}
function updateGlobalLevel() {
    document.getElementById('globalLevel').textContent = 
        `רמה גלובלית: ${globalLevel} (מכפיל נקודות: x${globalLevel})`;
}
function updateLegend() {
    const freezeLegend = document.getElementById('freezeLegend');
    const magnetLegend = document.getElementById('magnetLegend');
    const doubleLegend = document.getElementById('doubleLegend');
    
    if (freezeLegend && globalLevel >= 2) {
        freezeLegend.style.opacity = '1';
        freezeLegend.style.color = '#00bcd4';
    }
    
    if (magnetLegend && globalLevel >= 3) {
        magnetLegend.style.opacity = '1';
        magnetLegend.style.color = '#9c27b0';
    }
    
    if (doubleLegend && globalLevel >= 4) {
        doubleLegend.style.opacity = '1';
        doubleLegend.style.color = '#e91e63';
    }
}
function updateSpecialEffects() {
    let special = 'אין';
    
    if (doublePointsTime > 0) {
        special = `כפול: ${Math.ceil(doublePointsTime/60)}`;
        document.getElementById('special').style.color = '#e91e63';
    } else if (magnetTime > 0) {
        special = `מגנט: ${Math.ceil(magnetTime/60)}`;
        document.getElementById('special').style.color = '#9c27b0';
    } else if (freezeTime > 0) {
        special = `הקפאה: ${Math.ceil(freezeTime/60)}`;
        document.getElementById('special').style.color = '#00bcd4';
    } else if (speedBoostTime > 0) {
        special = `מהירות: ${Math.ceil(speedBoostTime/60)}`;
        document.getElementById('special').style.color = '#ff9800';
    } else {
        document.getElementById('special').style.color = '#666';
    }
    
    document.getElementById('special').textContent = special;
    
    if (shieldTime > 0) {
        document.getElementById('shield').textContent = Math.ceil(shieldTime/60);
        document.getElementById('shield').style.color = '#2196f3';
        player.classList.add('player-shield');
    } else {
        document.getElementById('shield').textContent = '0';
        document.getElementById('shield').style.color = '#666';
        player.classList.remove('player-shield');
    }
}

function updateStageInfo() {
    const target = Math.floor(baseStageTargets[currentStage - 1] * globalLevel);
    const stageName = stageNames[currentStage - 1];
    document.getElementById('stageTitle').textContent = `שלב ${currentStage}: ${stageName}`;
    document.getElementById('stageGoal').textContent = `יעד: ${target} נקודות`;
    document.getElementById('stageNum').textContent = currentStage;
    updateProgress();
}

function updateProgress() {
    const target = Math.floor(baseStageTargets[currentStage - 1] * globalLevel);
    const progress = Math.min((score / target) * 100, 100);
    document.getElementById('progressFill').style.width = progress + '%';
    document.getElementById('progressText').textContent = `${score} / ${target}`;
}

function updateLevelProgressUI() {
    document.getElementById('levelScore').textContent = levelScore;
    document.getElementById('completedStages').textContent = completedStages;
    const pct = Math.min(100, (completedStages / 20) * 100);
    document.getElementById('levelProgressFill').style.width = pct + '%';
    document.getElementById('levelProgressText').textContent = `${completedStages}/20`;
}
