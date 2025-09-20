// ----------------------------
// UI Updates
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
    document.getElementById('globalLevel').textContent = `רמה גלובלית: ${globalLevel} (מכפיל נקודות: x${globalLevel})`;
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
        special = `כפול: ${Math.ceil(doublePointsTime / 60)}`;
        document.getElementById('special').style.color = '#e91e63';
    } else if (magnetTime > 0) {
        special = `מגנט: ${Math.ceil(magnetTime / 60)}`;
        document.getElementById('special').style.color = '#9c27b0';
    } else if (freezeTime > 0) {
        special = `הקפאה: ${Math.ceil(freezeTime / 60)}`;
        document.getElementById('special').style.color = '#00bcd4';
    } else if (speedBoostTime > 0) {
        special = `מהירות: ${Math.ceil(speedBoostTime / 60)}`;
        document.getElementById('special').style.color = '#ff9800';
    } else {
        document.getElementById('special').style.color = '#666';
    }

    document.getElementById('special').textContent = special;

    if (shieldTime > 0) {
        document.getElementById('shield').textContent = Math.ceil(shieldTime / 60);
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

// ----------------------------
// Mouse / Touch Controls
// ----------------------------
function updatePlayerPosition(clientX, clientY) {
    const rect = gameContainer.getBoundingClientRect();
    mouseX = clientX - rect.left;
    mouseY = clientY - rect.top;
    mouseX = Math.max(20, Math.min(rect.width - 20, mouseX));
    mouseY = Math.max(20, Math.min(rect.height - 20, mouseY));
    player.style.left = (mouseX - 20) + 'px';
    player.style.top = (mouseY - 20) + 'px';
}

gameContainer.addEventListener('mousemove', (e) => updatePlayerPosition(e.clientX, e.clientY));
gameContainer.addEventListener('touchmove', (e) => {
    e.preventDefault();
    if (e.touches.length > 0) updatePlayerPosition(e.touches[0].clientX, e.touches[0].clientY);
});
gameContainer.addEventListener('touchstart', (e) => {
    e.preventDefault();
    if (e.touches.length > 0) updatePlayerPosition(e.touches[0].clientX, e.touches[0].clientY);
});

// ----------------------------
// Object Creation
// ----------------------------
function createStar() {
    let rand = Math.random();
    let cumulative = 0;
    let chosen = baseStarTypes[0];
    for (let type of baseStarTypes) {
        cumulative += type.chance;
        if (rand <= cumulative) {
            chosen = type;
            break;
        }
    }

    const star = document.createElement('div');
    star.className = 'star ' + chosen.class;
    star.textContent = chosen.emoji;
    star.dataset.points = chosen.basePoints * globalLevel;

    star.style.left = Math.random() * (gameContainer.clientWidth - 30) + 'px';
    star.style.top = '-30px';

    gameContainer.appendChild(star);
}

function createBomb() {
    const bomb = document.createElement('div');
    bomb.className = 'bomb';
    bomb.textContent = '💥';
    bomb.style.left = Math.random() * (gameContainer.clientWidth - 30) + 'px';
    bomb.style.top = '-30px';
    gameContainer.appendChild(bomb);
}

function createBlackhole() {
    const bh = document.createElement('div');
    bh.className = 'blackhole';
    bh.textContent = '🕳️';
    bh.style.left = Math.random() * (gameContainer.clientWidth - 30) + 'px';
    bh.style.top = '-30px';
    gameContainer.appendChild(bh);
}

function createLightning() {
    const l = document.createElement('div');
    l.className = 'lightning';
    l.textContent = '⛈️';
    l.style.left = Math.random() * (gameContainer.clientWidth - 30) + 'px';
    l.style.top = '-30px';
    gameContainer.appendChild(l);
}

function createPowerup() {
    const avail = powerupTypes.filter(p => {
        if (p.type === 'freeze' && globalLevel < 2) return false;
        if (p.type === 'magnet' && globalLevel < 3) return false;
        if (p.type === 'double' && globalLevel < 4) return false;
        return true;
    });
    let rand = Math.random();
    let cumulative = 0;
    let chosen = avail[0];
    for (let p of avail) {
        cumulative += p.chance;
        if (rand <= cumulative) {
            chosen = p;
            break;
        }
    }
    const pu = document.createElement('div');
    pu.className = 'powerup';
    pu.textContent = chosen.emoji;
    pu.dataset.type = chosen.type;
    pu.style.left = Math.random() * (gameContainer.clientWidth - 30) + 'px';
    pu.style.top = '-30px';
    gameContainer.appendChild(pu);
}

// ----------------------------
// Collision Check
// ----------------------------
function isColliding(el1, el2) {
    const r1 = el1.getBoundingClientRect();
    const r2 = el2.getBoundingClientRect();
    return !(r1.right < r2.left || r1.left > r2.right || r1.bottom < r2.top || r1.top > r2.bottom);
}

// ----------------------------
// Object Movement & Collision Logic
// ----------------------------
function moveObjects() {
    const objs = Array.from(gameContainer.querySelectorAll('.star, .bomb, .blackhole, .lightning, .powerup'));
    for (let obj of objs) {
        let top = parseFloat(obj.style.top);
        let speed = starSpeed;

        if (obj.classList.contains('bomb')) speed *= 1.2;
        if (obj.classList.contains('blackhole')) speed *= 0.8;
        if (obj.classList.contains('lightning')) speed *= 2;

        if (freezeTime > 0) speed *= 0.2;
        if (obj.classList.contains('powerup')) speed *= 0.8;
        if (magnetTime > 0 && (obj.classList.contains('star') || obj.classList.contains('powerup'))) {
            const objRect = obj.getBoundingClientRect();
            const playerRect = player.getBoundingClientRect();
            const dx = (playerRect.left + 20) - (objRect.left + 15);
            const dy = (playerRect.top + 20) - (objRect.top + 15);
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 150) {
                obj.style.left = (parseFloat(obj.style.left) + dx * 0.1) + 'px';
                obj.style.top = (parseFloat(obj.style.top) + dy * 0.1) + 'px';
            }
        }

        obj.style.top = (top + speed) + 'px';

        if (isColliding(obj, player)) {
            if (obj.classList.contains('star')) {
                const pts = parseInt(obj.dataset.points || 0);
                const earned = pts * combo * (doublePointsTime > 0 ? 2 : 1);
                score += earned;
                levelScore += earned;
                levelStarsCaught++;
                starsCaught++;
                comboCount++;
                if (comboCount >= 5) {
                    combo++;
                    comboCount = 0;
                    maxCombo = Math.max(combo, maxCombo);
                }
                updateScore();
                updateCombo();
                updateProgress();
                updateLevelProgressUI();
            } else if (obj.classList.contains('bomb')) {
                if (shieldTime > 0) {
                    shieldTime -= 60;
                } else {
                    lives--;
                    updateLives();
                    combo = 1;
                    comboCount = 0;
                    updateCombo();
                    if (lives <= 0) {
                        endGame();
                        return;
                    }
                }
            } else if (obj.classList.contains('blackhole')) {
                if (shieldTime > 0) {
                    shieldTime -= 60;
                } else {
                    score = Math.floor(score * 0.9);
                    updateScore();
                    combo = 1;
                    comboCount = 0;
                    updateCombo();
                }
            } else if (obj.classList.contains('lightning')) {
                if (shieldTime > 0) {
                    shieldTime -= 60;
                } else {
                    starSpeed += 0.5;
                }
            } else if (obj.classList.contains('powerup')) {
                const type = obj.dataset.type;
                switch (type) {
                    case 'shield': shieldTime = 300; break;
                    case 'life': lives++; updateLives(); break;
                    case 'speed': speedBoostTime = 300; break;
                    case 'freeze': freezeTime = 300; break;
                    case 'magnet': magnetTime = 300; break;
                    case 'double': doublePointsTime = 300; break;
                }
            }
            obj.remove();
        } else if (top > gameContainer.clientHeight) {
            obj.remove();
        }
    }
}

// ----------------------------
// Game End
// ----------------------------
function endGame() {
    gameRunning = false;
    gameLoopRunning = false;
    alert("המשחק נגמר!");
}
