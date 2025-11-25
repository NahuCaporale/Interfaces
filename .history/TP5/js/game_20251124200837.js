
const game = document.querySelector('.game-area');
let pipes = [];
let planets = [];
let score = 0;
let highScore = 0; // Variable para guardar el mejor puntaje
let gameOver = false;
let holdingMouse = false;
let gameStarted = false;
let gameSpeed = 3; // Velocidad inicial
const SPEED_INCREMENT = 0.0005;
const PIPE_SPACING = 500;
const GAME_WIDTH = 1300;
const GAME_HEIGHT = 640;
const PIPE_WIDTH = 90;
const MAX_SPEED = 6.5;
/* Tamaño de la nave */
const SPRITE_FRAMES = 6;
const DISPLAY_WIDTH = 100;
const SPRITE_FRAME_W = 320;
const SPRITE_FRAME_H = 150;
const SCALE = DISPLAY_WIDTH / SPRITE_FRAME_W;
const DISPLAY_HEIGHT = Math.round(SPRITE_FRAME_H * SCALE);

/* Físicas */
const HOLD_FORCE = -0.25;
const GRAVITY = 0.12;
let velocity = 0;

/* ============================================================
   CARGAR Y MOSTRAR MEJOR PUNTAJE
============================================================ */
function loadHighScore() {
    const storedHighScore = localStorage.getItem('flappyShipHighScore');
    if (storedHighScore) {
        highScore = parseInt(storedHighScore, 10);
    } else {
        highScore = 0; // Si no existe, iniciamos en 0
    }
    
    // AHORA ESTO SÍ FUNCIONARÁ PORQUE LOS IDs YA EXISTEN EN EL HTML
    const startDisplay = document.getElementById('best-score-start');
    const endDisplay = document.getElementById('best-score-gameover');

    if (startDisplay) startDisplay.innerText = `Mejor: ${highScore}`;
    if (endDisplay) endDisplay.innerText = `Mejor: ${highScore}`;
}
/* ============================================================
   CREAR PIPES + PLANETA
============================================================ */
function createPipe() {
    if (!gameStarted || gameOver) return;

    const gap = 170;
    const minHeight = 50;
    const maxHeight = GAME_HEIGHT - gap - 80;

    const topHeight = Math.floor(Math.random() * (maxHeight - minHeight) + minHeight);
    const bottomHeight = GAME_HEIGHT - topHeight - gap;
    const pipeX = GAME_WIDTH;

    const topPipe = document.createElement('div');
    topPipe.className = 'pipe top';
    topPipe.style.height = topHeight + 'px';
    topPipe.style.left = pipeX + 'px';
    
    const bottomPipe = document.createElement('div');
    bottomPipe.className = 'pipe bottom';
    bottomPipe.style.height = bottomHeight + 'px';
    bottomPipe.style.left = pipeX + 'px';
    
    game.appendChild(topPipe);
    game.appendChild(bottomPipe);

    // Math.random() da un número entre 0 y 1. 
    // Si ponemos < 0.3, significa que hay un 30% de probabilidad de que salga un planeta.
    if (Math.random() < 0.3) {

        const planet = document.createElement('div');
        planet.className = 'planet';

        const planetSize = 70;
        const gapCenter = topHeight + gap / 2 - planetSize / 2;
        const planetLeft = pipeX + PIPE_WIDTH / 2 - planetSize / 2;

        planet.style.left = planetLeft + "px";
        planet.style.top = gapCenter + "px";
        planet.style.width = planetSize + "px";
        planet.style.height = planetSize + "px";

        game.appendChild(planet);

        pipes.push({
            topPipe,
            bottomPipe,
            x: pipeX,
            scored: false,
            planet
        });

    } else {
        pipes.push({
            topPipe,
            bottomPipe,
            x: pipeX,
            scored: false,
            planet: null
        });
    }
}

/* ============================================================
   START / GAME OVER
============================================================ */
const startScreen = document.getElementById('start-screen');
const gameoverScreen = document.getElementById('gameover-screen');
const finalScore = document.getElementById('final-score');

document.getElementById('start-btn').addEventListener('click', () => {
  startScreen.style.display = 'none';
  score = 0;
  
  gameSpeed = 3;
  
  document.getElementById('score').innerText = score;
  gameOver = false;
  gameStarted = true;
  loop();
});

document.addEventListener('mousedown', () => {
    if (!gameStarted || gameOver) return;
    holdingMouse = true;
});
document.addEventListener('mouseup', () => holdingMouse = false);

document.addEventListener('touchstart', (e) => {
    if (!gameStarted || gameOver) return;
    e.preventDefault();
    holdingMouse = true;
}, { passive: false });
document.addEventListener('touchend', () => holdingMouse = false);

/* ============================================================
   UPDATE PIPES + PLANETAS
============================================================ */
function updatePipes() {
    pipes.forEach(pipe => {
        pipe.x -= gameSpeed; 
        pipe.topPipe.style.left = pipe.x + "px";
        pipe.bottomPipe.style.left = pipe.x + "px";

        if (pipe.planet) {
            pipe.planet.style.left = (pipe.x + PIPE_WIDTH / 2 - 35) + "px";
        }
    });

    pipes = pipes.filter(pipe => {
        if (pipe.x < -PIPE_WIDTH - 200) {
            pipe.topPipe.remove();
            pipe.bottomPipe.remove();
            if (pipe.planet) pipe.planet.remove();
            return false; 
        }
        return true; 
    });
}
/* ============================================================
   SCORE
============================================================ */
function updateScore(naveRect) {
    pipes.forEach(pipe => {
        if (!pipe.scored && pipe.x + PIPE_WIDTH < naveRect.left) {
            score++;
            pipe.scored = true;
            document.getElementById('score').innerText = score;
        }
    });
}

/* ============================================================
   COLISIONES
============================================================ */
function detectCollision(naveRect) {
    const PAD_L = 15, PAD_R = 15, PAD_T = 10, PAD_B = 10;

    const hitbox = {
        left: naveRect.left + PAD_L,
        right: naveRect.right - PAD_R,
        top: naveRect.top + PAD_T,
        bottom: naveRect.bottom - PAD_B
    };

    for (let pipe of pipes) {
        const topRect = pipe.topPipe.getBoundingClientRect();
        const bottomRect = pipe.bottomPipe.getBoundingClientRect();

        if (hitbox.right > topRect.left && hitbox.left < topRect.right && hitbox.top < topRect.bottom) {
            return true;
        }
        if (hitbox.right > bottomRect.left && hitbox.left < bottomRect.right && hitbox.bottom > bottomRect.top) {
            return true;
        }
    }
    return false;
}

/* ============================================================
   NAVE
============================================================ */
const nave = document.getElementById('nave');
nave.style.width = DISPLAY_WIDTH + 'px';
nave.style.height = DISPLAY_HEIGHT + 'px';
nave.style.left = '150px';

let y = (GAME_HEIGHT - DISPLAY_HEIGHT) / 2;
nave.style.top = y + 'px';

/* ============================================================
   GAME OVER
============================================================ */
function endGame() {
    gameOver = true;
    gameStarted = false;

    nave.style.animation = 'none';
    nave.style.filter = 'grayscale(1) brightness(0.6)';
    nave.style.transform = 'rotate(90deg)';

    // Comprobamos si el puntaje actual es un nuevo récord
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('flappyShipHighScore', highScore);
        
        // Actualizamos el texto. Si no existe el elemento, evitamos el error con un 'if'
        const endDisplay = document.getElementById('best-score-gameover');
        if (endDisplay) {
            endDisplay.innerText = `¡NUEVO RÉCORD!: ${highScore}`;
            endDisplay.style.color = '#00ff00'; // Truco visual: ponerlo verde si es récord
        }
    } else {
        // Si no es récord, mostramos el récord actual normal
        const endDisplay = document.getElementById('best-score-gameover');
        if (endDisplay) {
            endDisplay.innerText = `Mejor: ${highScore}`;
            endDisplay.style.color = '#ffc107'; // Volver a dorado
        }
    }

    finalScore.innerText = score;
    // Usamos setTimeout para asegurar que la pantalla se muestre de forma fiable
    setTimeout(() => {
        gameoverScreen.style.display = 'flex';
    }, 0);
}
function loop() {
    if (!gameStarted || gameOver) return;

  if (pipes.length === 0) {
      createPipe();
  } 
  else {
      const lastPipe = pipes[pipes.length - 1];
      
      const distanceTravelled = GAME_WIDTH - lastPipe.x;
      
      if (distanceTravelled >= PIPE_SPACING) {
          createPipe();
      }
  }

 if (gameSpeed < MAX_SPEED) {
      gameSpeed += SPEED_INCREMENT; 
  }
  updatePipes();

    velocity += GRAVITY;
    if (holdingMouse) velocity += HOLD_FORCE;

    velocity *= 0.98;
    y += velocity;

    if (y < 0) { y = 0; velocity = 0; }
    if (y > GAME_HEIGHT - DISPLAY_HEIGHT) { y = GAME_HEIGHT - DISPLAY_HEIGHT; velocity = 0; }

    nave.style.top = y + 'px';

    const naveRect = nave.getBoundingClientRect();

    updateScore(naveRect);

    checkPlanetCollection(naveRect);

    if (detectCollision(naveRect)) {
        endGame();
        return;
    }

    requestAnimationFrame(loop);
}


/* ============================================================
   REINICIAR
============================================================ */
document.getElementById('restart-btn').addEventListener('click', () => {
    location.reload();
});

/* ============================================================
   RECOLECCIÓN DE PLANETAS (Activa la animación CSS)
============================================================ */
function checkPlanetCollection(naveRect) {
    pipes.forEach(pipe => {
        if (pipe.planet && !pipe.planet.isCollected) {
            const planetRect = pipe.planet.getBoundingClientRect();

            if (
                naveRect.right > planetRect.left + 10 &&
                naveRect.left < planetRect.right - 10 &&
                naveRect.bottom > planetRect.top + 10 &&
                naveRect.top < planetRect.bottom - 10
            ) {
                pipe.planet.isCollected = true;

                pipe.planet.classList.add('collected');

                score += 3;
                document.getElementById('score').innerText = score;

                const pX = parseFloat(pipe.planet.style.left);
                const pY = parseFloat(pipe.planet.style.top);

                showFloatingScore(pX, pY);

                const planetElement = pipe.planet;
                setTimeout(() => {
                    if (planetElement && planetElement.parentNode) {
                        planetElement.remove();
                    }
                }, 500);
                pipe.planet = null;
            }
        }
    });
}



function showFloatingScore(x, y) {
    const popup = document.createElement('div');
    popup.innerText = "+3";
    popup.className = 'score-popup';

    popup.style.left = (x + 20) + 'px';
    popup.style.top = (y - 20) + 'px';

    game.appendChild(popup);

    setTimeout(() => {
        popup.remove();
    }, 1000);
}

// Llamamos a la función una vez al cargar la página para mostrar el récord guardado.
loadHighScore();