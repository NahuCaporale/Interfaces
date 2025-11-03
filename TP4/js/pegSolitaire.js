
// Peg Solitaire Game Script
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const BOARD_SIZE = 7;
const CELL_SIZE = 80;
const PADDING = 120;
const PEG_RADIUS = 30;
const GAME_TIME = 600; 

const INITIAL_BOARD = [
    [-1, -1,  1,  1,  1, -1, -1],
    [-1, -1,  1,  1,  1, -1, -1],
    [ 1,  1,  1,  1,  1,  1,  1],
    [ 1,  1,  1,  0,  1,  1,  1],
    [ 1,  1,  1,  1,  1,  1,  1],
    [-1, -1,  1,  1,  1, -1, -1],
    [-1, -1,  1,  1,  1, -1, -1]
];

let board = [];
let selectedPeg = null;
let draggingPeg = null;
let mouseX = 0;
let mouseY = 0;
let moveCount = 0;
let timeRemaining = GAME_TIME;
let timerInterval = null;
let gameOver = false;
let bestScore = 32;
let validMoves = [];

const pegTypes = ['blue', 'red', 'gold', 'purple'];
let pegColors = [];

const images = {
    background: null,
    blue: null,
    red: null,
    gold: null,
    purple: null
};

let imagesLoaded = 0;
const totalImages = 5;

function loadImages() {
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

    const colors = ['blue', 'red', 'gold', 'purple'];
    const colorDefs = {
        blue: ['#6bb6ff', '#4a90e2', '#2e5c8a'],
        red: ['#ff6b6b', '#e74c3c', '#8a2e2e'],
        gold: ['#ffd700', '#f39c12', '#d68910'],
        purple: ['#bb6bff', '#9b59b6', '#6c3483']
    };

    colors.forEach(color => {
        const img = new Image();
        img.onload = imageLoaded;
        img.src = 'data:image/svg+xml,' + encodeURIComponent(`
            <svg width="80" height="80" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <radialGradient id="${color}Grad" cx="35%" cy="35%">
                        <stop offset="0%" style="stop-color:${colorDefs[color][0]};stop-opacity:1" />
                        <stop offset="50%" style="stop-color:${colorDefs[color][1]};stop-opacity:1" />
                        <stop offset="100%" style="stop-color:${colorDefs[color][2]};stop-opacity:1" />
                    </radialGradient>
                </defs>
                <circle cx="40" cy="40" r="35" fill="url(#${color}Grad)"/>
            </svg>
        `);
        images[color] = img;
    });
}

function imageLoaded() {
    imagesLoaded++;
    if (imagesLoaded === totalImages) {
        initGame();
    }
}

function initGame() {
    board = INITIAL_BOARD.map(row => [...row]);
    selectedPeg = null;
    draggingPeg = null;
    moveCount = 0;
    timeRemaining = GAME_TIME;
    gameOver = false;
    validMoves = [];

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

function startTimer() {
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        if (!gameOver) {
            timeRemaining--;
            updateTimer();
            if (timeRemaining <= 0) endGame('timeout');
        }
    }, 1000);
}

function updateTimer() {
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    const timerEl = document.getElementById('timer');
    if (timerEl) timerEl.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

function draw() {
    if (images.background) ctx.drawImage(images.background, 0, 0, canvas.width, canvas.height);
    else ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let row = 0; row < BOARD_SIZE; row++) {
        for (let col = 0; col < BOARD_SIZE; col++) {
            if (board[row][col] !== -1) {
                const x = PADDING + col * CELL_SIZE;
                const y = PADDING + row * CELL_SIZE;
                ctx.beginPath();
                ctx.arc(x, y, PEG_RADIUS + 5, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(0,0,0,0.5)';
                ctx.fill();
                if (board[row][col] === 1) drawPeg(x, y, pegColors[row][col]);
            }
        }
    }
}

function drawPeg(x, y, color) {
    const img = images[color];
    if (img) ctx.drawImage(img, x - PEG_RADIUS, y - PEG_RADIUS, PEG_RADIUS * 2, PEG_RADIUS * 2);
}

function animate() {
    draw();
    if (!gameOver) requestAnimationFrame(animate);
}

canvas.addEventListener('mousedown', e => {
    if (gameOver) return;
    const rect = canvas.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
    const pos = getCellFromCoords(mouseX, mouseY);
    if (pos && board[pos.row][pos.col] === 1) {
        selectedPeg = pos;
        draggingPeg = pos;
        validMoves = getValidMoves(pos.row, pos.col);
    }
});

canvas.addEventListener('mouseup', e => {
    if (!draggingPeg || gameOver) return;
    const rect = canvas.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
    const pos = getCellFromCoords(mouseX, mouseY);
    if (pos && isValidMoveTarget(selectedPeg.row, selectedPeg.col, pos.row, pos.col))
        makeMove(selectedPeg.row, selectedPeg.col, pos.row, pos.col);
    draggingPeg = null;
    selectedPeg = null;
    validMoves = [];
});

function getCellFromCoords(x, y) {
    const col = Math.round((x - PADDING) / CELL_SIZE);
    const row = Math.round((y - PADDING) / CELL_SIZE);
    if (row >= 0 && row < BOARD_SIZE && col >= 0 && col < BOARD_SIZE && board[row][col] !== -1)
        return { row, col };
    return null;
}

function getValidMoves(row, col) {
    const results = [];
    const dirs = [
        { dr: -2, dc: 0, jr: -1, jc: 0 },
        { dr: 2, dc: 0, jr: 1, jc: 0 },
        { dr: 0, dc: -2, jr: 0, jc: -1 },
        { dr: 0, dc: 2, jr: 0, jc: 1 }
    ];
    dirs.forEach(d => {
        const newRow = row + d.dr, newCol = col + d.dc, jumpRow = row + d.jr, jumpCol = col + d.jc;
        if (newRow >= 0 && newRow < BOARD_SIZE && newCol >= 0 && newCol < BOARD_SIZE &&
            board[newRow][newCol] === 0 && board[jumpRow][jumpCol] === 1)
            results.push({ toRow: newRow, toCol: newCol, jumpRow, jumpCol });
    });
    return results;
}

function isValidMoveTarget(fromRow, fromCol, toRow, toCol) {
    return getValidMoves(fromRow, fromCol).some(m => m.toRow === toRow && m.toCol === toCol);
}

function makeMove(fromRow, fromCol, toRow, toCol) {
    const move = getValidMoves(fromRow, fromCol).find(m => m.toRow === toRow && m.toCol === toCol);
    if (!move) return;
    board[toRow][toCol] = 1; board[fromRow][fromCol] = 0;
    pegColors[toRow][toCol] = pegColors[fromRow][fromCol]; pegColors[fromRow][fromCol] = null;
    board[move.jumpRow][move.jumpCol] = 0; pegColors[move.jumpRow][move.jumpCol] = null;
    moveCount++; updateUI();
}

function countPegs() {
    return board.flat().filter(v => v === 1).length;
}

function endGame(reason) {
    gameOver = true; clearInterval(timerInterval);
    const modal = document.getElementById('gameOverModal');
    if (modal) modal.classList.add('show');
}

function updateUI() {
    const pegsLeft = countPegs();
    document.getElementById('moves').textContent = moveCount;
    document.getElementById('pegsRemaining').textContent = pegsLeft;
    document.getElementById('bestScore').textContent = bestScore;
}

function restartGame() {
    const modal = document.getElementById('gameOverModal');
    if (modal) modal.classList.remove('show');
    initGame();
}

loadImages();
