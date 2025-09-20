const gameContainer = document.getElementById('gameContainer');
const player = document.getElementById('player');

function updateScore() { document.getElementById('score').textContent = score; }
function updateLives() { document.getElementById('lives').textContent = lives; }
function updateCombo() { 
  document.getElementById('combo').textContent = 'x' + combo;
  document.getElementById('combo').style.color = combo>1 ? '#4caf50':'#fff';
}
function updateGlobalLevel() { 
  document.getElementById('globalLevel').textContent = `רמה גלובלית: ${globalLevel} (x${globalLevel})`;
}
function updateStageInfo() {
  const target = Math.floor(baseStageTargets[currentStage-1]*globalLevel);
  document.getElementById('stageTitle').textContent = `שלב ${currentStage}: ${stageNames[currentStage-1]}`;
  document.getElementById('stageGoal').textContent = `יעד: ${target} נקודות`;
}

// מיקום השחקן לפי עכבר / מגע
function updatePlayerPosition(clientX, clientY){
  const rect = gameContainer.getBoundingClientRect();
  mouseX = Math.max(20, Math.min(rect.width-20, clientX-rect.left));
  mouseY = Math.max(20, Math.min(rect.height-20, clientY-rect.top));
  player.style.left = (mouseX-20)+'px';
  player.style.top = (mouseY-20)+'px';
}
gameContainer.addEventListener('mousemove', (e)=>updatePlayerPosition(e.clientX,e.clientY));
gameContainer.addEventListener('touchmove', (e)=>{ e.preventDefault(); if(e.touches[0]) updatePlayerPosition(e.touches[0].clientX,e.touches[0].clientY);});
gameContainer.addEventListener('touchstart', (e)=>{ e.preventDefault(); if(e.touches[0]) updatePlayerPosition(e.touches[0].clientX,e.touches[0].clientY);});
