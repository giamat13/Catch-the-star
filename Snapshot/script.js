// -----------------------------
// script.js – טוען את כל החלקים ומפעיל את המשחק
// -----------------------------

// פונקציה שמטענת קובץ סקריפט דינמית
function loadScript(src) {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.onload = () => {
            console.log(`הסקריפט ${src} נטען בהצלחה`);
            resolve();
        };
        script.onerror = () => reject(new Error(`שגיאה בטעינת ${src}`));
        document.head.appendChild(script);
    });
}

// טען את קבצי ה-data וה-logic לפי הסדר, ואז התחלת המשחק
async function startGame() {
    try {
        await loadScript('game-data.js');
        await loadScript('game-logic.js');

        // ודא שהמשתנה spawnInterval מוגדר ב-game-data.js
        if (typeof spawnInterval === 'undefined') {
            throw new Error("spawnInterval לא מוגדר ב-game-data.js");
        }

        // אתחול ראשוני של המשתמש
        updateScore();
        updateLives();
        updateCombo();
        updateStageInfo();
        updateGlobalLevel();
        updateLegend();
        updateSpecialEffects();
        updateLevelProgressUI();

        // הפעלת לולאת המשחק
        gameRunning = true;
        gameLoopRunning = true;

        // התחלה של מחזור יצירת עצמים
        setInterval(() => {
            if (!gameRunning) return;
            const rand = Math.random();
            if (rand < 0.65) {
                createStar();
            } else if (rand < 0.75) {
                createBomb();
            } else if (rand < 0.82) {
                createPowerup();
            } else if (rand < 0.88) {
                createBlackhole();
            } else {
                createLightning();
            }
        }, spawnInterval);

        // לולאת עדכון עצמים, אפקטים וסטטיסטיקות
        function gameLoop() {
            if (!gameLoopRunning) return;
            moveObjects();

            // עדכון זמנים לאפקטים
            if (freezeTime > 0) freezeTime--;
            if (magnetTime > 0) magnetTime--;
            if (doublePointsTime > 0) doublePointsTime--;
            if (speedBoostTime > 0) speedBoostTime--;
            if (shieldTime > 0) shieldTime--;

            updateSpecialEffects();

            // בדיקת מעבר שלבים
            const target = Math.floor(baseStageTargets[currentStage - 1] * globalLevel);
            if (score >= target) {
                currentStage++;
                if (currentStage > stageNames.length) {
                    // סיום מחזור שלבים
                    globalLevel++;
                    completedStages++;
                    currentStage = 1;
                    levelScore = 0;
                    starSpeed += 0.2;
                }
                updateStageInfo();
                updateGlobalLevel();
                updateLegend();
                updateLevelProgressUI();
            }

            requestAnimationFrame(gameLoop);
        }

        requestAnimationFrame(gameLoop);

    } catch (error) {
        console.error("בעיה בטעינת קבצי המשחק:", error);
        alert("אירעה שגיאה בטעינת המשחק. ראה את הקונסול.");
    }
}

// התחלת המשחק לאחר טעינת הדף
window.addEventListener('DOMContentLoaded', startGame);
