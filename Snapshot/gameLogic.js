// ----------------------------
// מיקום העכבר / שחקן
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

gameContainer.addEventListener('mousemove', e => updatePlayerPosition(e.clientX, e.clientY));
gameContainer.addEventListener('touchmove', e => {
    e.preventDefault();
    if (e.touches.length > 0) updatePlayerPosition(e.touches[0].clientX, e.touches[0].clientY);
});
gameContainer.addEventListener('touchstart', e => {
    e.preventDefault();
    if (e.touches.length > 0) updatePlayerPosition(e.touches[0].clientX, e.touches[0].clientY);
});

// ----------------------------
// יצירת אובייקטים במשחק
// ----------------------------
function createStar() {
    let rand = Math.random();
    let cumulative = 0;
    let chosen = baseStarTypes[0];
    for (let type of baseStarTypes) {
        cumulative += type.chance;
        if (rand <= cumulative) { chosen = type; break; }
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
        if (rand <= cumulative) { chosen = p; break; }
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
// בדיקת התנגשות
// ----------------------------
function isColliding(el1, el2) {
    const r1 = el1.getBoundingClientRect();
    const r2 = el2.getBoundingClientRect();
    return !(r1.right < r2.left || r1.left > r2.right || r1.bottom < r2.top || r1.top > r2.bottom);
}

// ----------------------------
// עדכון מיקום אובייקטים
// ----------------------------
function moveObjects() {
    const objs = Array.from(gameContainer.querySelectorAll('.star, .bomb, .blackhole, .lightning, .powerup'));
    for (let obj of objs) {
        let top = parseFloat(obj.style.top);
        let speed = starSpeed;

        if (obj.classList.contains('bomb')) speed *= 1.2;
        if (obj.classList.contains('blackhole')) speed *= 0.8;
        if (obj.classList.contains('lightning')) speed *= 1.5;

        if (freezeTime > 0 && !obj.classList.contains('powerup')) speed *= 0.3;
        if (speedBoostTime > 0 && obj.classList.contains('star')) speed *= 1.3;

        obj.style.top = (top + speed) + 'px';

        // אם עבר את התחתית
        if (top > gameContainer.clientHeight) {
            if (obj.classList.contains('star')) { combo = 1; updateCombo(); }
            if (obj.classList.contains('bomb')) bombsAvoided++;
            if (obj.classList.contains('blackhole')) blackholesAvoided++;
            if (obj.classList.contains('lightning')) lightningAvoided++;
            obj.remove();
            continue;
        }

        // בדיקת התנגשות עם השחקן
        if (isColliding(player, obj)) {
            if (obj.classList.contains('star')) {
                let pts = parseInt(obj.dataset.points);
                if (doublePointsTime > 0) pts *= 2;
                score += pts * combo;
                levelScore += pts * combo;
                starsCaught++; levelStarsCaught++; comboCount++;
                if (comboCount % 5 === 0) combo++;
                if (combo > maxCombo) maxCombo = combo;
                updateScore(); updateCombo(); updateProgress();
                showFloatingText("+" + pts, obj, "points-text");
                obj.remove();
            } else if (obj.classList.contains('bomb') || obj.classList.contains('blackhole') || obj.classList.contains('lightning')) {
                if (shieldTime > 0) { shieldTime -= 60; updateSpecialEffects(); obj.remove(); }
                else {
                    lives--; updateLives(); combo = 1; updateCombo();
                    if (lives <= 0) endStage(false);
                    obj.remove();
                }
            } else if (obj.classList.contains('powerup')) {
                const type = obj.dataset.type;
                if (type === 'shield') shieldTime = 600;
                if (type === 'life') lives++;
                if (type === 'speed') speedBoostTime = 600;
                if (type === 'freeze') freezeTime = 300;
                if (type === 'magnet') magnetTime = 300;
                if (type === 'double') doublePointsTime = 300;
                updateLives(); updateSpecialEffects();
                obj.remove();
            }
        } else if (magnetTime > 0 && obj.classList.contains('star')) {
            const px = player.offsetLeft + player.offsetWidth/2;
            const py = player.offsetTop + player.offsetHeight/2;
            const ox = obj.offsetLeft + obj.offsetWidth/2;
            const oy = obj.offsetTop + obj.offsetHeight/2;
            const dx = px - ox;
            const dy = py - oy;
            const dist = Math.sqrt(dx*dx + dy*dy);
            if (dist < 150) { obj.style.left = (obj.offsetLeft + dx*0.05) + 'px'; obj.style.top = (obj.offsetTop + dy*0.05) + 'px'; }
        }
    }
}

// ----------------------------
// טקסט צף לניקוד/קומבו
// ----------------------------
function showFloatingText(text, baseElement, className) {
    const txt = document.createElement('div');
    txt.className = className;
    txt.textContent = text;
    txt.style.left = baseElement.style.left;
    txt.style.top = baseElement.style.top;
    gameContainer.appendChild(txt);
    setTimeout(() => txt.remove(), 1000);
}

// ----------------------------
// לולאת המשחק
// ----------------------------
function gameLoop(timestamp) {
    if (!gameRunning) return;
    if (!lastTimestamp) lastTimestamp = timestamp;
    const delta = timestamp - lastTimestamp;
    lastTimestamp = timestamp;

    if (Math.random() < spawnRate) createStar();
    if (Math.random() < 0.003 * globalLevel) createBomb();
    if (Math.random() < 0.0015 * globalLevel) createBlackhole();
    if (Math.random() < 0.001 * globalLevel) createLightning();
    if (Math.random() < 0.002) createPowerup();

    moveObjects();

    if (shieldTime > 0) shieldTime--;
    if (speedBoostTime > 0) speedBoostTime--;
    if (freezeTime > 0) freezeTime--;
    if (magnetTime > 0) magnetTime--;
    if (doublePointsTime > 0) doublePointsTime--;
    updateSpecialEffects();

    const target = Math.floor(baseStageTargets[currentStage - 1] * globalLevel);
    if (score >= target) { endStage(true); return; }

    requestAnimationFrame(gameLoop);
}

// ----------------------------
// סיום שלב
// ----------------------------
function endStage(success) {
    gameRunning = false;
    if (success) {
        completedStages++;
        document.getElementById('completedStage').textContent = currentStage;
        document.getElementById('completedStageName').textContent = stageNames[currentStage - 1];
        document.getElementById('stageScore').textContent = score;
        document.getElementById('stageTime').textContent = Math.floor((Date.now() - stageStartTime)/1000);
        document.getElementById('stageMaxCombo').textContent = maxCombo;
        document.getElementById('stageStarsCaught').textContent = starsCaught;
        document.getElementById('stageBombsAvoided').textContent = bombsAvoided;
        document.getElementById('stageBlackholesAvoided').textContent = blackholesAvoided;
        document.getElementById('stageLightningAvoided').textContent = lightningAvoided;
        updateLevelProgressUI();

        if (completedStages >= 20) {
            globalLevel++; completedStages = 0; score = 0; levelScore = 0;
            document.getElementById('completedLevel').textContent = globalLevel - 1;
            document.getElementById('newLevel').textContent = globalLevel;
            document.getElementById('newMultiplier').textContent = globalLevel;
            updateGlobalLevel(); updateLegend();
            document.getElementById('levelComplete').style.display = 'block';
        } else { document.getElementById('stageComplete').style.display = 'block'; }

        saveGameState("stageComplete", true);
    } else {
        document.getElementById('failScore').textContent = score;
        document.getElementById('failTarget').textContent = Math.floor(baseStageTargets[currentStage - 1] * globalLevel);
        document.getElementById('finalStats').textContent =
            `קומבו מקסימלי: ${maxCombo}, כוכבים: ${starsCaught}, פצצות שנמנעו: ${bombsAvoided}`;
        document.getElementById('gameOver').style.display = 'block';
        saveGameState("stageFailed", false);
    }
}

// ----------------------------
// שליטה במשחק
// ----------------------------
function retryStage() {
    score = 0; combo = 1; lives = 3;
    shieldTime = speedBoostTime = freezeTime = magnetTime = doublePointsTime = 0;
    starsCaught = bombsAvoided = blackholesAvoided = lightningAvoided = 0;
    maxCombo = 1;
    gameContainer.querySelectorAll('.star, .bomb, .blackhole, .lightning, .powerup').forEach(el => el.remove());
    document.getElementById('gameOver').style.display = 'none';
    document.getElementById('stageComplete').style.display = 'none';
    document.getElementById('levelComplete').style.display = 'none';
    stageStartTime = Date.now();
    gameRunning = true;
    lastTimestamp = null;
    requestAnimationFrame(gameLoop);
}

// ----------------------------
// שמירת מצב המשחק
// ----------------------------
function saveGameState(status, success) {
    const state = {
        globalLevel, currentStage, score, levelScore, lives,
        completedStages, status, success, timestamp: Date.now()
    };
    setCookie(SAVE_KEY, state, 365);
}

// ----------------------------
// התחלת משחק
// ----------------------------
function startGame(stage = 1) {
    currentStage = stage;
    stageStartTime = Date.now();
    gameRunning = true;
    lastTimestamp = null;
    requestAnimationFrame(gameLoop);
}
