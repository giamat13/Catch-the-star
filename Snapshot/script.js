// ----------------------------
// script.js
// ----------------------------

// מייבא את הגדרות המשחק והלוגיקה
import './gameSetup.js';
import './gameLogic.js';

// כאן אפשר להוסיף קוד נוסף אם צריך, לדוגמה התחלה אוטומטית
window.addEventListener('load', () => {
    // אתחול המשחק או טעינת מצב שמור
    if (!loadGameState()) {
        initStage();
    }

    // כפתור שמירה ידנית
    const saveBtn = document.getElementById('saveBtn');
    if (saveBtn) {
        saveBtn.addEventListener('click', () => saveGameState("manualSave"));
    }
});
