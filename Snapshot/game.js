function createStar(){ /* פונקציית יצירת כוכב */ }
function createBomb(){ /* פונקציית יצירת פצצה */ }
function createBlackhole(){ /* פונקציית יצירת חור שחור */ }
function createLightning(){ /* פונקציית יצירת ברק */ }
function createPowerup(){ /* פונקציית יצירת פאוור-אפ */ }

function isColliding(el1,el2){
  const r1 = el1.getBoundingClientRect();
  const r2 = el2.getBoundingClientRect();
  return !(r1.right < r2.left || r1.left > r2.right || r1.bottom < r2.top || r1.top > r2.bottom);
}

function moveObjects(){ /* עדכון מיקום כל האובייקטים במשחק */ }

function saveGameState(reason='', stageCompleted=false){ /* שמירה ל-localStorage */ }
function loadGameState(){ /* טעינה מ-localStorage */ }

function gameLoop(timestamp){ /* לולאת המשחק */ }

function initStage(){ /* אתחול שלב */ }
function endStage(success){ /* סיום שלב */ }
function retryStage(){ initStage(); }
function nextStage(){ initStage(); }
function nextLevel(){ initStage(); }

window.addEventListener('load', ()=>{
  if(!loadGameState()) initStage();
  setInterval(()=>{ if(gameRunning) saveGameState("autosave"); },30000);
});
