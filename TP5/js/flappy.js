// Elementos
const juego = document.querySelector('.game-area');
const nave = document.getElementById('nave');

// Estado
let tubos = [];
let puntos = 0;
let record = 0;
let jugando = false;
let fin = false;

// Medidas
const ANCHO_JUEGO = 1300;
const ALTO_JUEGO = 640;

const ANCHO_NAVE = 100;
const ALTO_NAVE = 47;

nave.style.width = ANCHO_NAVE + "px";
nave.style.height = ALTO_NAVE + "px";
nave.style.left = "150px";

let naveY = (ALTO_JUEGO - ALTO_NAVE) / 2;
nave.style.top = naveY + "px";

// Física
let vel = 0;
const GRAVEDAD = 0.20;
const IMPULSO = -5;

// Juego
let velocidad = 3;
const MAX_VELOCIDAD = 6;
const ESPACIO_TUBO = 170;
const DISTANCIA_TUBOS = 450;

/* ============================================================
   Cargar récord
============================================================ */
function cargarRecord() {
    record = parseInt(localStorage.getItem("recordNave")) || 0;
    const a = document.getElementById("best-score-start");
    const b = document.getElementById("best-score-gameover");

    if (a) a.innerText = "Mejor: " + record;
    if (b) b.innerText = "Mejor: " + record;
}

/* ============================================================
   Crear tubo
============================================================ */
function crearTubo() {
    if (!jugando) return;

    const altoArriba = Math.floor(Math.random() * 320 + 80);
    const altoAbajo = ALTO_JUEGO - altoArriba - ESPACIO_TUBO;
    const x = ANCHO_JUEGO;

    const arriba = document.createElement("div");
    arriba.className = "pipe top";
    arriba.style.height = altoArriba + "px";
    arriba.style.left = x + "px";

    const abajo = document.createElement("div");
    abajo.className = "pipe bottom";
    abajo.style.height = altoAbajo + "px";
    abajo.style.left = x + "px";

    juego.appendChild(arriba);
    juego.appendChild(abajo);

    tubos.push({
        x,
        arriba,
        abajo,
        ancho: 90,
        altoArriba,
        altoAbajo,
        marcado: false
    });
}

/* ============================================================
   Mover tubos
============================================================ */
function moverTubos() {
    tubos.forEach(t => {
        t.x -= velocidad;
        t.arriba.style.left = t.x + "px";
        t.abajo.style.left = t.x + "px";
    });

    tubos = tubos.filter(t => {
        if (t.x < -100) {
            t.arriba.remove();
            t.abajo.remove();
            return false;
        }
        return true;
    });
}

/* ============================================================
   Colisiones
============================================================ */
function hayColision() {
    const naveX = 150;
    const naveDer = naveX + ANCHO_NAVE;
    const naveArriba = naveY;
    const naveAbajo = naveY + ALTO_NAVE;

    for (let t of tubos) {
        const tuboIzq = t.x;
        const tuboDer = t.x + t.ancho;

        if (naveDer > tuboIzq && naveX < tuboDer) {
            if (naveArriba < t.altoArriba) return true;
            if (naveAbajo > (ALTO_JUEGO - t.altoAbajo)) return true;
        }
    }
    return false;
}

/* ============================================================
   Puntaje
============================================================ */
function sumarPuntos() {
    tubos.forEach(t => {
        if (!t.marcado && t.x + t.ancho < 150) {
            t.marcado = true;
            puntos++;
            document.getElementById("score").innerText = puntos;
        }
    });
}

/* ============================================================
   Fin del juego
============================================================ */
function terminar() {
    fin = true;
    jugando = false;

    nave.style.filter = "grayscale(1)";
    nave.style.transform = "rotate(90deg)";

    if (puntos > record) {
        record = puntos;
        localStorage.setItem("recordNave", record);
        document.getElementById("best-score-gameover").innerText = "Nuevo récord: " + record;
    }

    document.getElementById("final-score").innerText = puntos;
    document.getElementById("gameover-screen").style.display = "flex";
}

/* ============================================================
   Reiniciar sin recargar
============================================================ */
function reiniciar() {
    jugando = true;
    fin = false;
    puntos = 0;
    velocidad = 3;

    vel = 0;
    naveY = (ALTO_JUEGO - ALTO_NAVE) / 2;
    nave.style.top = naveY + "px";
    nave.style.filter = "none";
    nave.style.transform = "none";

    tubos.forEach(t => {
        t.arriba.remove();
        t.abajo.remove();
    });
    tubos = [];

    document.getElementById("score").innerText = 0;
    document.getElementById("gameover-screen").style.display = "none";

    loop();
}

/* ============================================================
   Loop
============================================================ */
function loop() {
    if (!jugando || fin) return;

    if (tubos.length === 0 || ANCHO_JUEGO - tubos[tubos.length - 1].x > DISTANCIA_TUBOS) {
        crearTubo();
    }

    if (velocidad < MAX_VELOCIDAD) velocidad += 0.0007;

    moverTubos();

    vel += GRAVEDAD;
    naveY += vel;

    if (naveY < 0) naveY = 0;
    if (naveY > ALTO_JUEGO - ALTO_NAVE) naveY = ALTO_JUEGO - ALTO_NAVE;

    nave.style.top = naveY + "px";

    sumarPuntos();

    if (hayColision()) {
        terminar();
        return;
    }

    requestAnimationFrame(loop);
}

/* ============================================================
   Controles
============================================================ */
function saltar() {
    if (!jugando || fin) return;
    vel = IMPULSO;
}

document.addEventListener("keydown", e => {
    if (e.code === "Space") saltar();
});

document.addEventListener("mousedown", () => saltar());
document.addEventListener("touchstart", () => saltar(), { passive: false });

/* ============================================================
   Inicio
============================================================ */
document.getElementById("start-btn").addEventListener("click", () => {
    document.getElementById("start-screen").style.display = "none";

    puntos = 0;
    velocidad = 3;
    fin = false;
    jugando = true;

    document.getElementById("score").innerText = 0;

    loop();
});

// Reinicio sin recargar s
document.getElementById("restart-btn").addEventListener("click", reiniciar);

cargarRecord();