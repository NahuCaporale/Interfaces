const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Configuración del juego
const BOARD_SIZE = 7;
const CELL_SIZE = 80;
const PADDING = 120;
const PEG_RADIUS = 30;
const GAME_TIME = 600; // 10 minutos

// Tablero inicial del Peg Solitaire (Cruz europea)
const INITIAL_BOARD = [
    [-1, -1,  1,  1,  1, -1, -1],
    [-1, -1,  1,  1,  1, -1, -1],
    [ 1,  1,  1,  1,  1,  1,  1],
    [ 1,  1,  1,  0,  1,  1,  1],
    [ 1,  1,  1,  1,  1,  1,  1],
    [-1, -1,  1,  1,  1, -1, -1],
    [-1, -1,  1,  1,  1, -1, -1]
];

// Estado del juego
let board = [];
let selectedPeg = null;
let draggingPeg = null;
let mouseX = 0;
let mouseY = 0;
let moveCount = 0; // renombrado desde 'moves' a 'moveCount' para evitar colisiones
let timeRemaining = GAME_TIME;
let timerInterval = null;
let gameOver = false;
let bestScore = 32;
let validMoves = [];

// Tipos de planetas (4 colores diferentes)
const pegTypes = ['blue', 'red', 'gold', 'purple'];
let pegColors = [];

// Imágenes
const images = {
    background: null,
    blue: null,
    red: null,
    gold: null,
    purple: null
};

let imagesLoaded = 0;
const totalImages = 5;

// Cargar imágenes
function loadImages() {
    // Fondo espacial
    images.background = new Image();
    images.background.onload = imageLoaded;
    images.background.src = 'data:image/svg+xml,' + encodeURIComponent(`
        <svg width="800" height="800" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <radialGradient id="spaceGrad" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" style="stop-color:#1a1f3a;stop-opacity:1" />
                    <stop offset="100%" style="stop-color:#0a0e27;stop-opacity:1" />
                </radialGradient>
            </defs>
            <rect width="800" height="800" fill="url(#spaceGrad)"/>
            ${Array.from({length: 150}, () => {
                const x = Math.random() * 800;
                const y = Math.random() * 800;
                const r = Math.random() * 2;
                return `<circle cx="${x}" cy="${y}" r="${r}" fill="white" opacity="${Math.random()}"/>`;
            }).join('')}
        </svg>
    `);

    // Planeta azul (Neptuno)
    images.blue = new Image();
    images.blue.onload = imageLoaded;
    images.blue.src = 'data:image/svg+xml,' + encodeURIComponent(`
        <svg width="80" height="80" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <radialGradient id="blueGrad" cx="35%" cy="35%">
                    <stop offset="0%" style="stop-color:#6bb6ff;stop-opacity:1" />
                    <stop offset="50%" style="stop-color:#4a90e2;stop-opacity:1" />
                    <stop offset="100%" style="stop-color:#2e5c8a;stop-opacity:1" />
                </radialGradient>
            </defs>
            <circle cx="40" cy="40" r="35" fill="url(#blueGrad)"/>
            <ellipse cx="30" cy="30" rx="12" ry="8" fill="#a8d5ff" opacity="0.6"/>
            <path d="M 15 40 Q 40 35 65 40" stroke="#2e5c8a" stroke-width="2" fill="none" opacity="0.5"/>
        </svg>
    `);

    // Planeta rojo (Marte)
    images.red = new Image();
    images.red.onload = imageLoaded;
    images.red.src = 'data:image/svg+xml,' + encodeURIComponent(`
        <svg width="80" height="80" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <radialGradient id="redGrad" cx="35%" cy="35%">
                    <stop offset="0%" style="stop-color:#ff6b6b;stop-opacity:1" />
                    <stop offset="50%" style="stop-color:#e74c3c;stop-opacity:1" />
                    <stop offset="100%" style="stop-color:#8a2e2e;stop-opacity:1" />
                </radialGradient>
            </defs>
            <circle cx="40" cy="40" r="35" fill="url(#redGrad)"/>
            <ellipse cx="30" cy="30" rx="12" ry="8" fill="#ffa8a8" opacity="0.6"/>
            <circle cx="48" cy="35" r="6" fill="#8a2e2e" opacity="0.5"/>
            <circle cx="28" cy="48" r="9" fill="#8a2e2e" opacity="0.4"/>
        </svg>
    `);

    // Planeta dorado (Venus)
    images.gold = new Image();
    images.gold.onload = imageLoaded;
    images.gold.src = 'data:image/svg+xml,' + encodeURIComponent(`
        <svg width="80" height="80" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <radialGradient id="goldGrad" cx="35%" cy="35%">
                    <stop offset="0%" style="stop-color:#ffd700;stop-opacity:1" />
                    <stop offset="50%" style="stop-color:#f39c12;stop-opacity:1" />
                    <stop offset="100%" style="stop-color:#d68910;stop-opacity:1" />
                </radialGradient>
            </defs>
            <circle cx="40" cy="40" r="35" fill="url(#goldGrad)"/>
            <ellipse cx="30" cy="30" rx="12" ry="8" fill="#ffe066" opacity="0.7"/>
            <circle cx="50" cy="45" r="7" fill="#d68910" opacity="0.4"/>
        </svg>
    `);

    // Planeta morado (Júpiter)
    images.purple = new Image();
    images.purple.onload = imageLoaded;
    images.purple.src = 'data:image/svg+xml,' + encodeURIComponent(`
        <svg width="80" height="80" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <radialGradient id="purpleGrad" cx="35%" cy="35%">
                    <stop offset="0%" style="stop-color:#bb6bff;stop-opacity:1" />
                    <stop offset="50%" style="stop-color:#9b59b6;stop-opacity:1" />
                    <stop offset="100%" style="stop-color:#6c3483;stop-opacity:1" />
                </radialGradient>
            </defs>
            <circle cx="40" cy="40" r="35" fill="url(#purpleGrad)"/>
            <ellipse cx="30" cy="30" rx="12" ry="8" fill="#d7b3ff" opacity="0.6"/>
            <path d="M 15 35 Q 40 33 65 35" stroke="#6c3483" stroke-width="2" fill="none" opacity="0.5"/>
            <path d="M 15 50 Q 40 48 65 50" stroke="#6c3483" stroke-width="2" fill="none" opacity="0.5"/>
        </svg>
    `);
}

function imageLoaded() {
    imagesLoaded++;
    if (imagesLoaded === totalImages) {
        initGame();
    }
}

// Inicializar juego
function initGame() {
    board = INITIAL_BOARD.map(row => [...row]);
    selectedPeg = null;
    draggingPeg = null;
    moveCount = 0;
    timeRemaining = GAME_TIME;
    gameOver = false;
    validMoves = [];

    // Asignar colores aleatorios a cada planeta
    pegColors = [];
    for (let row = 0; row < BOARD_SIZE; row++) {
        pegColors[row] = [];
        for (let col = 0; col < BOARD_SIZE; col++) {
            if (board[row][col] === 1) {
                pegColors[row][col] = pegTypes[Math.floor(Math.random() * pegTypes.length)];
            } else {
                pegColors[row][col] = null;
            }
        }
    }

    updateUI();
    startTimer();
    draw();
    animate();
}

// Timer
function startTimer() {
    if (timerInterval) clearInterval(timerInterval);

    timerInterval = setInterval(() => {
        if (!gameOver) {
            timeRemaining--;
            updateTimer();

            if (timeRemaining <= 0) {
                endGame('timeout');
            }
        }
    }, 1000);
}

function updateTimer() {
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    const timerEl = document.getElementById('timer');
    timerEl.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;

    timerEl.classList.remove('warning', 'danger');
    if (timeRemaining <= 60) {
        timerEl.classList.add('danger');
    } else if (timeRemaining <= 180) {
        timerEl.classList.add('warning');
    }
}

// Dibujar
function draw() {
    // Fondo
    if (images.background) {
        ctx.drawImage(images.background, 0, 0, canvas.width, canvas.height);
    } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    // Dibujar tablero
    for (let row = 0; row < BOARD_SIZE; row++) {
        for (let col = 0; col < BOARD_SIZE; col++) {
            if (board[row][col] !== -1) {
                const x = PADDING + col * CELL_SIZE;
                const y = PADDING + row * CELL_SIZE;

                // Espacio para planeta
                ctx.beginPath();
                ctx.arc(x, y, PEG_RADIUS + 5, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
                ctx.fill();
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
                ctx.lineWidth = 2;
                ctx.stroke();

                // Dibujar planeta si existe
                if (board[row][col] === 1) {
                    drawPeg(x, y, pegColors[row][col], false);

                    // Highlight si está seleccionado
                    if (selectedPeg && selectedPeg.row === row && selectedPeg.col === col && !draggingPeg) {
                        ctx.beginPath();
                        ctx.arc(x, y, PEG_RADIUS + 10, 0, Math.PI * 2);
                        ctx.strokeStyle = '#00ffff';
                        ctx.lineWidth = 3;
                        ctx.setLineDash([5, 5]);
                        ctx.stroke();
                        ctx.setLineDash([]);
                    }
                }
            }
        }
    }

    // Dibujar hints animados
    if (selectedPeg && !draggingPeg && validMoves.length > 0) {
        drawAnimatedHints();
    }

    // Planeta siendo arrastrado
    if (draggingPeg) {
        drawPeg(mouseX, mouseY, pegColors[draggingPeg.row][draggingPeg.col], true);
        drawDropPreview();
    }
}

function drawPeg(x, y, color, dragging) {
    const img = images[color];
    if (img) {
        ctx.save();
        if (dragging) {
            ctx.shadowColor = getColorFromType(color);
            ctx.shadowBlur = 20;
        }
        ctx.drawImage(img, x - PEG_RADIUS, y - PEG_RADIUS, PEG_RADIUS * 2, PEG_RADIUS * 2);
        ctx.restore();
    } else {
        // fallback simple circle if imagen no lista
        ctx.save();
        if (dragging) {
            ctx.shadowColor = getColorFromType(color);
            ctx.shadowBlur = 20;
        }
        ctx.beginPath();
        ctx.arc(x, y, PEG_RADIUS, 0, Math.PI * 2);
        ctx.fillStyle = getColorFromType(color);
        ctx.fill();
        ctx.restore();
    }
}

function getColorFromType(type) {
    const colors = {
        blue: '#4a90e2',
        red: '#e74c3c',
        gold: '#f39c12',
        purple: '#9b59b6'
    };
    return colors[type] || '#ffffff';
}

function drawAnimatedHints() {
    const time = Date.now() / 1000;

    validMoves.forEach((move, index) => {
        const targetX = PADDING + move.toCol * CELL_SIZE;
        const targetY = PADDING + move.toRow * CELL_SIZE;
        const fromX = PADDING + selectedPeg.col * CELL_SIZE;
        const fromY = PADDING + selectedPeg.row * CELL_SIZE;

        // Calcular dirección de la flecha
        const dx = targetX - fromX;
        const dy = targetY - fromY;
        const angle = Math.atan2(dy, dx);

        // Posición de la flecha (entre origen y destino)
        const midX = (fromX + targetX) / 2;
        const midY = (fromY + targetY) / 2;

        // Animación de rebote
        const bounce = Math.sin(time * 3 + index * 0.3) * 10;
        const arrowX = midX + Math.cos(angle) * bounce;
        const arrowY = midY + Math.sin(angle) * bounce;

        ctx.save();
        ctx.translate(arrowX, arrowY);
        ctx.rotate(angle);

        // Sombra brillante
        ctx.shadowColor = getColorFromType(pegColors[selectedPeg.row][selectedPeg.col]);
        ctx.shadowBlur = 20;

        // Dibujar flecha
        ctx.beginPath();
        ctx.moveTo(20, 0);
        ctx.lineTo(-10, -15);
        ctx.lineTo(-10, -7);
        ctx.lineTo(-20, -7);
        ctx.lineTo(-20, 7);
        ctx.lineTo(-10, 7);
        ctx.lineTo(-10, 15);
        ctx.closePath();

        const gradient = ctx.createLinearGradient(-20, 0, 20, 0);
        gradient.addColorStop(0, getColorFromType(pegColors[selectedPeg.row][selectedPeg.col]));
        gradient.addColorStop(1, '#ffffff');
        ctx.fillStyle = gradient;
        ctx.fill();

        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.restore();

        // Círculo brillante en el destino
        const pulseScale = 1 + Math.sin(time * 4 + index * 0.5) * 0.2;
        ctx.save();
        ctx.beginPath();
        ctx.arc(targetX, targetY, (PEG_RADIUS + 10) * pulseScale, 0, Math.PI * 2);
        ctx.strokeStyle = getColorFromType(pegColors[selectedPeg.row][selectedPeg.col]);
        ctx.lineWidth = 3;
        ctx.globalAlpha = 0.6;
        ctx.stroke();
        ctx.restore();
    });
}

function drawDropPreview() {
    const pos = getCellFromCoords(mouseX, mouseY);
    if (pos && isValidMoveTarget(selectedPeg.row, selectedPeg.col, pos.row, pos.col)) {
        const x = PADDING + pos.col * CELL_SIZE;
        const y = PADDING + pos.row * CELL_SIZE;

        ctx.beginPath();
        ctx.arc(x, y, PEG_RADIUS + 8, 0, Math.PI * 2);
        ctx.strokeStyle = '#00ff00';
        ctx.lineWidth = 4;
        ctx.setLineDash([5, 5]);
        ctx.stroke();
        ctx.setLineDash([]);
    }
}

// Animación
function animate() {
    draw();
    if (!gameOver) {
        requestAnimationFrame(animate);
    }
}

// Eventos del mouse
canvas.addEventListener('mousedown', (e) => {
    if (gameOver) return;

    const rect = canvas.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;

    const pos = getCellFromCoords(mouseX, mouseY);
    if (pos && board[pos.row][pos.col] === 1) {
        selectedPeg = { row: pos.row, col: pos.col };
        draggingPeg = { row: pos.row, col: pos.col };
        validMoves = getValidMoves(pos.row, pos.col);
    }
});

canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;

    if (draggingPeg) {
        canvas.style.cursor = 'grabbing';
    } else {
        const pos = getCellFromCoords(mouseX, mouseY);
        if (pos && board[pos.row][pos.col] === 1) {
            canvas.style.cursor = 'pointer';
        } else {
            canvas.style.cursor = 'default';
        }
    }
});

canvas.addEventListener('mouseup', (e) => {
    if (!draggingPeg || gameOver) {
        draggingPeg = null;
        selectedPeg = null; // limpiar selección también si no hay drag activo
        return;
    }

    const rect = canvas.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;

    const pos = getCellFromCoords(mouseX, mouseY);

    if (pos && isValidMoveTarget(selectedPeg.row, selectedPeg.col, pos.row, pos.col)) {
        makeMove(selectedPeg.row, selectedPeg.col, pos.row, pos.col);
    }

    draggingPeg = null;
    selectedPeg = null;
    validMoves = [];
    canvas.style.cursor = 'default';
});

// Funciones del juego
function getCellFromCoords(x, y) {
    const col = Math.round((x - PADDING) / CELL_SIZE);
    const row = Math.round((y - PADDING) / CELL_SIZE);

    if (row >= 0 && row < BOARD_SIZE && col >= 0 && col < BOARD_SIZE && board[row][col] !== -1) {
        const cellX = PADDING + col * CELL_SIZE;
        const cellY = PADDING + row * CELL_SIZE;
        const distance = Math.sqrt((x - cellX) ** 2 + (y - cellY) ** 2);

        if (distance <= PEG_RADIUS + 10) {
            return { row, col };
        }
    }
    return null;
}

function getValidMoves(row, col) {
    const results = [];
    const directions = [
        { dr: -2, dc: 0, jr: -1, jc: 0 },  // Arriba
        { dr: 2, dc: 0, jr: 1, jc: 0 },    // Abajo
        { dr: 0, dc: -2, jr: 0, jc: -1 },  // Izquierda
        { dr: 0, dc: 2, jr: 0, jc: 1 }     // Derecha
    ];

    directions.forEach(dir => {
        const newRow = row + dir.dr;
        const newCol = col + dir.dc;
        const jumpRow = row + dir.jr;
        const jumpCol = col + dir.jc;

        if (newRow >= 0 && newRow < BOARD_SIZE && newCol >= 0 && newCol < BOARD_SIZE &&
            board[newRow][newCol] === 0 && board[jumpRow][jumpCol] === 1) {
            results.push({ toRow: newRow, toCol: newCol, jumpRow, jumpCol });
        }
    });

    return results;
}

function isValidMoveTarget(fromRow, fromCol, toRow, toCol) {
    const possible = getValidMoves(fromRow, fromCol);
    return possible.some(move => move.toRow === toRow && move.toCol === toCol);
}

function makeMove(fromRow, fromCol, toRow, toCol) {
    const possibleMoves = getValidMoves(fromRow, fromCol);
    const move = possibleMoves.find(m => m.toRow === toRow && m.toCol === toCol);

    if (move) {
        // Mover planeta
        board[toRow][toCol] = 1;
        board[fromRow][fromCol] = 0;
        // Transferir color y limpiar origen
        pegColors[toRow][toCol] = pegColors[fromRow][fromCol];
        pegColors[fromRow][fromCol] = null;

        // Eliminar planeta saltado y limpiar color
        board[move.jumpRow][move.jumpCol] = 0;
        pegColors[move.jumpRow][move.jumpCol] = null;

        // Incrementar contador global de movimientos
        moveCount++;
        updateUI();

        // Verificar condiciones de fin
        const pegsLeft = countPegs();
        if (pegsLeft === 1) {
            if (toRow === 3 && toCol === 3) {
                endGame('perfect');
            } else {
                endGame('win');
            }
        } else if (!hasAnyValidMoves()) {
            if (pegsLeft <= 3) {
                endGame('good');
            } else {
                endGame('lose');
            }
        }
    }
}

function countPegs() {
    let count = 0;
    for (let row = 0; row < BOARD_SIZE; row++) {
        for (let col = 0; col < BOARD_SIZE; col++) {
            if (board[row][col] === 1) count++;
        }
    }
    return count;
}

function hasAnyValidMoves() {
    for (let row = 0; row < BOARD_SIZE; row++) {
        for (let col = 0; col < BOARD_SIZE; col++) {
            if (board[row][col] === 1) {
                if (getValidMoves(row, col).length > 0) {
                    return true;
                }
            }
        }
    }
    return false;
}

function endGame(reason) {
    gameOver = true;
    clearInterval(timerInterval);

    const modal = document.getElementById('gameOverModal');
    const modalContent = document.getElementById('modalContent');
    const modalTitle = document.getElementById('modalTitle');
    const modalMessage = document.getElementById('modalMessage');
    const modalPegs = document.getElementById('modalPegs');
    const modalTime = document.getElementById('modalTime');
    const modalMoves = document.getElementById('modalMoves');

    modalContent.classList.remove('win', 'lose');

    const pegsLeft = countPegs();
    const elapsedTime = GAME_TIME - timeRemaining;
    const minutes = Math.floor(elapsedTime / 60);
    const seconds = elapsedTime % 60;

    if (reason === 'perfect') {
        modalContent.classList.add('win');
        modalTitle.textContent = '🏆 ¡VICTORIA PERFECTA! 🏆';
        modalTitle.style.color = '#00ff00';
        modalMessage.textContent = '¡Increíble! ¡Solo queda 1 planeta en el centro!';
        if (pegsLeft < bestScore) {
            bestScore = pegsLeft;
        }
    } else if (reason === 'win') {
        modalContent.classList.add('win');
        modalTitle.textContent = '🎉 ¡VICTORIA! 🎉';
        modalTitle.style.color = '#00ffff';
        modalMessage.textContent = '¡Excelente! ¡Solo queda 1 planeta!';
        if (pegsLeft < bestScore) {
            bestScore = pegsLeft;
        }
    } else if (reason === 'good') {
        modalContent.classList.add('win');
        modalTitle.textContent = '👍 ¡BUEN TRABAJO! 👍';
        modalTitle.style.color = '#ffaa00';
        modalMessage.textContent = `¡Bien! Quedan ${pegsLeft} planetas.`;
        if (pegsLeft < bestScore) {
            bestScore = pegsLeft;
        }
    } else if (reason === 'timeout') {
        modalContent.classList.add('lose');
        modalTitle.textContent = '⏰ ¡TIEMPO AGOTADO! ⏰';
        modalTitle.style.color = '#ff0000';
        modalMessage.textContent = '¡Se acabó el tiempo!';
    } else if (reason === 'lose') {
        modalContent.classList.add('lose');
        modalTitle.textContent = '❌ JUEGO TERMINADO ❌';
        modalTitle.style.color = '#ff0000';
        modalMessage.textContent = `Sin movimientos válidos. Quedan ${pegsLeft} planetas.`;
    }

    modalPegs.textContent = `🪐 Planetas restantes: ${pegsLeft}`;
    modalTime.textContent = `⏱️ Tiempo: ${minutes}:${seconds.toString().padStart(2, '0')}`;
    modalMoves.textContent = `🎮 Movimientos: ${moveCount}`;

    modal.classList.add('show');
    updateUI();
}

function updateUI() {
    const pegsLeft = countPegs();
    document.getElementById('moves').textContent = moveCount;
    document.getElementById('pegsRemaining').textContent = pegsLeft;
    document.getElementById('bestScore').textContent = bestScore;
}

function restartGame() {
    const modal = document.getElementById('gameOverModal');
    modal.classList.remove('show');
    initGame();
}

function toggleInstructions() {
    const instructions = document.getElementById('instructions');
    if (instructions.style.display === 'none') {
        instructions.style.display = 'block';
        instructions.scrollIntoView({ behavior: 'smooth' });
    } else {
        instructions.style.display = 'none';
    }
}

// Iniciar carga de imágenes
loadImages();
