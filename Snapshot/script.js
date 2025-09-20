// מייבא את כל המודולים
import './globals-and-data.js';
import './ui-and-player.js';
import './game.js';

// אתחול המשחק בעת טעינת הדף
window.addEventListener('load', () => {
    // עדכון UI ראשוני
    updateScore();
    updateLives();
    updateCombo();
    updateGlobalLevel();
    updateStageInfo();

    // אם יש שמירה, נטען אותה (אם לא, אתחול שלב חדש)
    if (!loadGameState()) {
        initStage();
    }

    // שמירה אוטומטית כל 30 שניות
    setInterval(() => {
        if (gameRunning) saveGameState("autosave");
    }, 30000);
});
