const canvas = document.getElementById("MyCanvas");
const ctx = canvas.getContext("2d");

const img = new Image();
img.src = "./assets/imgs/avatar.jpg";

const partes = [
    { x: 0, y: 0, w: 0, h: 0, angle: 0 },
    { x: 0, y: 0, w: 0, h: 0, angle: 0 },
    { x: 0, y: 0, w: 0, h: 0, angle: 0 },
    { x: 0, y: 0, w: 0, h: 0, angle: 0 },
];
const imagenes = [
    "./assets/imgs/avatar.jpg",
    "./assets/imgs/blocka2.jpg",
    "./assets/imgs/blocka3.jpg",
    "./assets/imgs/blocka4.jpg",
    "./assets/imgs/blocka5.jpg",
    "./assets/imgs/blocka6.jpg"
];

let juegoIniciado = false;
let timerInterval;
let segundos = 0;

const timerDisplay = document.getElementById("timer");
const startBtn = document.getElementById("start-btn");

// Calcula posiciones y tamaños de las partes
function inicializarPartes() {
    const canvasW = canvas.width / 2;
    const canvasH = canvas.height / 2;

    partes[0].x = 0; partes[0].y = 0; partes[0].w = canvasW; partes[0].h = canvasH;
    partes[1].x = canvasW; partes[1].y = 0; partes[1].w = canvasW; partes[1].h = canvasH;
    partes[2].x = 0; partes[2].y = canvasH; partes[2].w = canvasW; partes[2].h = canvasH;
    partes[3].x = canvasW; partes[3].y = canvasH; partes[3].w = canvasW; partes[3].h = canvasH;
}

// Rotación aleatoria de las piezas
function desordenarPartes() {
    const opciones = [0, 90, 180, 270];
    partes.forEach(parte => {
        parte.angle = opciones[Math.floor(Math.random() * opciones.length)];
    });
}

// Dibuja todas las partes
function dibujarPartes() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const imgW = img.width / 2;
    const imgH = img.height / 2;

    partes.forEach((parte, i) => {
        ctx.save();
        const cx = parte.x + parte.w / 2;
        const cy = parte.y + parte.h / 2;
        ctx.translate(cx, cy);
        ctx.rotate(parte.angle * Math.PI / 180);
        ctx.drawImage(
            img,
            (i % 2) * imgW, Math.floor(i / 2) * imgH, imgW, imgH,
            -parte.w / 2, -parte.h / 2, parte.w, parte.h
        );
        ctx.restore();
    });
}

// Función de tiempo
function formatearTiempo(segundos) {
    const min = Math.floor(segundos / 60).toString().padStart(2, "0");
    const sec = (segundos % 60).toString().padStart(2, "0");
    return `${min}:${sec}`;
}

// Detecta clic en canvas
canvas.addEventListener("mousedown", e => {
    if (!juegoIniciado) return;

    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    partes.forEach(parte => {
        if (
            mouseX > parte.x && mouseX < parte.x + parte.w &&
            mouseY > parte.y && mouseY < parte.y + parte.h
        ) {
            parte.angle += (e.button === 0 ? -90 : 90);
            dibujarPartes();
            if (esVictoria()) mostrarModal();
        }
    });
});

canvas.addEventListener("contextmenu", e => e.preventDefault());

function esVictoria() {
    return partes.every(parte => parte.angle % 360 === 0);
}

function mostrarModal() {
    juegoIniciado = false;
    clearInterval(timerInterval);
    const modal = document.getElementById("victoryModal");
    modal.style.display = "flex";
    const tiempoFinal = document.getElementById("tiempoFinal");
    tiempoFinal.textContent = `Tiempo: ${formatearTiempo(segundos)}`;
}

// Botón reiniciar
document.getElementById("restartBtn").addEventListener("click", () => {
    const modal = document.getElementById("victoryModal");
    modal.style.display = "none";

    juegoIniciado = false;
    startBtn.disabled = false;

    desordenarPartes();
    dibujarPartes();

    clearInterval(timerInterval);
    segundos = 0;
    timerDisplay.textContent = formatearTiempo(segundos);
});

// Inicio del juego
startBtn.addEventListener("click", () => {
    juegoIniciado = true;
    startBtn.disabled = true;

    desordenarPartes();
    dibujarPartes();

    clearInterval(timerInterval);
    segundos = 0;
    timerDisplay.textContent = formatearTiempo(segundos);

    timerInterval = setInterval(() => {
        segundos++;
        timerDisplay.textContent = formatearTiempo(segundos);
    }, 1000);
});

// Carga de imagen
img.onload = () => {
    inicializarPartes();
    desordenarPartes();
    dibujarPartes();
};
