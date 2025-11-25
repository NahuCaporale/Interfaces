// =========================
// VARIABLES PRINCIPALES
// =========================
const juego = document.querySelector('.game-area');
const nave = document.getElementById('nave');

let tubos = [];
let puntaje = 0;
let mejorPuntaje = 0;

let juegoIniciado = false;
let juegoTerminado = false;

let velocidad = 0;
let posNaveY = 0;

// Dimensiones
const ANCHO_JUEGO = 1300;
const ALTO_JUEGO = 640;

const ANCHO_TUBO = 90;
const DISTANCIA_TUBO = 450;

// Velocidad general
let velocidadJuego = 3;
const ACELERACION = 0.004;
const VELOCIDAD_MAX = 6.5;

// Tamaño sprite nave
const SPRITE_W = 320;
const SPRITE_H = 150;
const DISPLAY_W = 100;
const ESCALA = DISPLAY_W / SPRITE_W;
const DISPLAY_H = Math.round(SPRITE_H * ESCALA);

// Física
const GRAVEDAD = 0.08;

// =========================
// CARGAR MEJOR PUNTAJE
// =========================
function cargarMejorPuntaje() {
    const guardado = localStorage.getItem('mejorPuntajeNave');
    mejorPuntaje = guardado ? parseInt(guardado, 10) : 0;

    const inicio = document.getElementById('best-score-start');
    const fin = document.getElementById('best-score-gameover');

    if (inicio) inicio.innerText = `Mejor: ${mejorPuntaje}`;
    if (fin) fin.innerText = `Mejor: ${mejorPuntaje}`;
}

// =========================
// CREAR TUBOS Y PLANETAS
// =========================
function crearTubo() {
    if (!juegoIniciado || juegoTerminado) return;

    const HUECO = 170;
    const MARGEN_SUP = 50;
    const maxAltoSup = ALTO_JUEGO - HUECO - 80;

    const altoSup = Math.floor(Math.random() * (maxAltoSup - MARGEN_SUP) + MARGEN_SUP);
    const altoInf = ALTO_JUEGO - altoSup - HUECO;

    const xInicial = ANCHO_JUEGO;

    const tuboSup = document.createElement('div');
    tuboSup.className = 'pipe top';
    tuboSup.style.height = altoSup + 'px';
    tuboSup.style.left = xInicial + 'px';

    const tuboInf = document.createElement('div');
    tuboInf.className = 'pipe bottom';
    tuboInf.style.height = altoInf + 'px';
    tuboInf.style.left = xInicial + 'px';

    juego.appendChild(tuboSup);
    juego.appendChild(tuboInf);

    let planeta = null;

    if (Math.random() < 0.3) {
        planeta = document.createElement('div');
        planeta.className = 'planet';

        const size = 70;
        const posY = altoSup + HUECO / 2 - size / 2;

        planeta.style.left = (xInicial + ANCHO_TUBO / 2 - size / 2) + "px";
        planeta.style.top = posY + "px";
        planeta.style.width = size + "px";
        planeta.style.height = size + "px";

        juego.appendChild(planeta);
    }

    tubos.push({
        x: xInicial,
        sup: tuboSup,
        inf: tuboInf,
        planeta,
        sumado: false
    });
}

// =========================
// INICIO DEL JUEGO
// =========================
const pantallaInicio = document.getElementById('start-screen');
const pantallaFinal = document.getElementById('gameover-screen');
const puntajeFinalTxt = document.getElementById('final-score');

document.getElementById('start-btn').addEventListener('click', () => {
    pantallaInicio.style.display = 'none';
    puntaje = 0;
    velocidadJuego = 3;
    document.getElementById('score').innerText = puntaje;

    juegoTerminado = false;
    juegoIniciado = true;

    loop();
});

// =========================
// CONTROLES: SALTO
// =========================
document.addEventListener('mousedown', salto);
document.addEventListener('touchstart', e => { e.preventDefault(); salto(); }, { passive: false });

document.addEventListener('keydown', e => {
    if (e.code === 'Space') salto();
});

function salto() {
    if (!juegoIniciado || juegoTerminado) return;
    velocidad = -4.5; // IMPULSO FUERTE
}

// =========================
// MOVER TUBOS
// =========================
function moverTubos() {
    tubos.forEach(t => {
        t.x -= velocidadJuego;
        t.sup.style.left = t.x + "px";
        t.inf.style.left = t.x + "px";
        if (t.planeta) t.planeta.style.left = (t.x + ANCHO_TUBO / 2 - 35) + "px";
    });

    tubos = tubos.filter(t => {
        if (t.x < -ANCHO_TUBO - 200) {
            t.sup.remove();
            t.inf.remove();
            if (t.planeta) t.planeta.remove();
            return false;
        }
        return true;
    });
}

// =========================
// PUNTAJE
// =========================
function sumarPuntos(nRect) {
    tubos.forEach(t => {
        if (!t.sumado && t.x + ANCHO_TUBO < nRect.left) {
            t.sumado = true;
            puntaje++;
            document.getElementById('score').innerText = puntaje;
        }
    });
}

// =========================
// COLISIÓN
// =========================
function hayColision(nRect) {
    const margen = { l: 15, r: 15, t: 10, b: 10 };

    const caja = {
        izq: nRect.left + margen.l,
        der: nRect.right - margen.r,
        sup: nRect.top + margen.t,
        inf: nRect.bottom - margen.b
    };

    for (let t of tubos) {
        const sup = t.sup.getBoundingClientRect();
        const inf = t.inf.getBoundingClientRect();

        if (caja.der > sup.left && caja.izq < sup.right && caja.sup < sup.bottom) return true;
        if (caja.der > inf.left && caja.izq < inf.right && caja.inf > inf.top) return true;
    }
    return false;
}

// =========================
// CONFIGURAR NAVE
// =========================
nave.style.width = DISPLAY_W + 'px';
nave.style.height = DISPLAY_H + 'px';
nave.style.left = '150px';

posNaveY = (ALTO_JUEGO - DISPLAY_H) / 2;
nave.style.top = posNaveY + 'px';

// =========================
// FIN DEL JUEGO
// =========================
function terminarJuego() {
    juegoTerminado = true;
    juegoIniciado = false;

    nave.style.filter = 'grayscale(1) brightness(0.6)';
    nave.style.transform = 'rotate(90deg)';

    const mejorTxt = document.getElementById('best-score-gameover');

    if (puntaje > mejorPuntaje) {
        mejorPuntaje = puntaje;
        localStorage.setItem('mejorPuntajeNave', mejorPuntaje);

        mejorTxt.innerText = `¡NUEVO RÉCORD!: ${mejorPuntaje}`;
        mejorTxt.style.color = '#00ff00';
    } else {
        mejorTxt.innerText = `Mejor: ${mejorPuntaje}`;
        mejorTxt.style.color = '#ffc107';
    }

    puntajeFinalTxt.innerText = puntaje;
    pantallaFinal.style.display = 'flex';
}

// =========================
// BUCLE PRINCIPAL
// =========================
function loop() {
    if (!juegoIniciado || juegoTerminado) return;

    if (tubos.length === 0 || (ANCHO_JUEGO - tubos[tubos.length - 1].x) >= DISTANCIA_TUBO) {
        crearTubo();
    }

    if (velocidadJuego < VELOCIDAD_MAX) velocidadJuego += ACELERACION;

    moverTubos();

    // Física de la nave
    velocidad += GRAVEDAD;
    velocidad *= 0.98;
    posNaveY += velocidad;

    if (posNaveY < 0) posNaveY = 0;
    if (posNaveY > ALTO_JUEGO - DISPLAY_H) posNaveY = ALTO_JUEGO - DISPLAY_H;

    nave.style.top = posNaveY + 'px';

    const nRect = nave.getBoundingClientRect();

    sumarPuntos(nRect);
    detectarPlanetas(nRect);

    if (hayColision(nRect)) {
        terminarJuego();
        return;
    }

    requestAnimationFrame(loop);
}

// =========================
// PLANETAS (BONO +3)
// =========================
function detectarPlanetas(nRect) {
    tubos.forEach(t => {
        if (!t.planeta || t.planeta.tocado) return;

        const pRect = t.planeta.getBoundingClientRect();

        const colision =
            nRect.right > pRect.left + 10 &&
            nRect.left < pRect.right - 10 &&
            nRect.bottom > pRect.top + 10 &&
            nRect.top < pRect.bottom - 10;

        if (!colision) return;

        t.planeta.tocado = true;
        t.planeta.classList.add('collected');

        puntaje += 3;
        document.getElementById('score').innerText = puntaje;

        mostrarPopup(
            parseFloat(t.planeta.style.left),
            parseFloat(t.planeta.style.top)
        );

        const ref = t.planeta;
        setTimeout(() => ref?.remove(), 500);

        t.planeta = null;
    });
}

function mostrarPopup(x, y) {
    const pop = document.createElement('div');
    pop.className = 'score-popup';
    pop.innerText = "+3";
    pop.style.left = (x + 20) + 'px';
    pop.style.top = (y - 20) + 'px';
    juego.appendChild(pop);
    setTimeout(() => pop.remove(), 1000);
}

// =========================
// REINICIAR
// =========================
document.getElementById('restart-btn').addEventListener('click', () => {
    location.reload();
});

// Cargar mejores puntajes
cargarMejorPuntaje();
