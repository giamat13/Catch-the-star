// ----------------------------
// לולאת המשחק ותזוזת שחקן
// ----------------------------
gameContainer.addEventListener('mousemove', e => {
    mouseX = e.clientX - gameContainer.offsetLeft;
    mouseY = e.clientY - gameContainer.offsetTop;
    player.style.left = (mouseX - player.offsetWidth/2) + 'px';
    player.style.top = (mouseY - player.offsetHeight/2) + 'px';
});

// ----------------------------
// התחלת שלב
// ----------------------------
function startStage() {
    gameRunning = true;
    stageStartTime = Date.now();
    score = 0;
    combo = 1;
    updateScore();
    updateCombo();
    updateStageInfo();
    // כאן אפשר לקרוא לפונקציות ליצירת כוכבים
}

// ----------------------------
// Retry / Next
// ----------------------------
function retryStage() { startStage(); document.getElementById('gameOver').style.display='none'; }
function nextStage() { currentStage++; startStage(); document.getElementById('stageComplete').style.display='none'; }
function nextLevel() { globalLevel++; updateGlobalLevel(); document.getElementById('levelComplete').style.display='none'; }

// ----------------------------
// עדכון מצב המשחק
// ----------------------------
function gameLoop() {
    if(!gameRunning) return;
    // כאן מוסיפים כוכבים, פאוור-אפים, בדיקות התנגשות וכו'
    requestAnimationFrame(gameLoop);
}

// התחלת המשחק
startStage();
gameLoop();
