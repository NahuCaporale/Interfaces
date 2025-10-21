const IMAGE_BANK = [
    "./assets/imgs/avatar.jpg",
    "./assets/imgs/avatar1.png",
    "./assets/imgs/avatar2.jpg",
    "./assets/imgs/avatar3.png",
    "./assets/imgs/peg11.jpg",
    "./assets/imgs/logo_perfil.png"
];

class PuzzleGame {
    constructor(canvasId, timerId, nivelDisplayId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext("2d");
        this.timerDisplay = document.getElementById(timerId);
        this.nivelDisplay = document.getElementById(nivelDisplayId);
        this.partes = [
            { x: 0, y: 0, w: 0, h: 0, angle: 0 },
            { x: 0, y: 0, w: 0, h: 0, angle: 0 },
            { x: 0, y: 0, w: 0, h: 0, angle: 0 },
            { x: 0, y: 0, w: 0, h: 0, angle: 0 },
        ];
        this.img = new Image();
        this.nivelActual = 1;
        this.totalNiveles = 3;
        this.segundos = 0;
        this.timerInterval = null;
        this.juegoIniciado = false;
        this.imagenActualIndex = 0;

        this.startBtn = document.getElementById("start-btn");
        this.nextLevelBtn = document.getElementById("nextLevelBtn");
        this.victoryModal = document.getElementById("victoryModal");

        this.initEvents();
        this.loadImage(this.imagenActualIndex);
    }

    iinitEvents() {
    this.startBtn.addEventListener("click", () => {
        this.startBtn.disabled = true;
        this.playRandomFromGallery();
    });

    this.nextLevelBtn.addEventListener("click", () => {
        this.victoryModal.style.display = "none";
        this.siguienteNivel();
    });

    this.canvas.addEventListener("mousedown", (e) => this.rotarParte(e));
    this.canvas.addEventListener("contextmenu", (e) => e.preventDefault());
}

    loadImage(index) {
        this.img.src = IMAGE_BANK[index];
        this.img.onload = () => {
            this.inicializarPartes();
            this.desordenarPartes();
            this.dibujarPartes();
        };
    }

    inicializarPartes() {
        const w = this.canvas.width / 2;
        const h = this.canvas.height / 2;
        this.partes[0] = { x: 0, y: 0, w, h, angle: 0 };
        this.partes[1] = { x: w, y: 0, w, h, angle: 0 };
        this.partes[2] = { x: 0, y: h, w, h, angle: 0 };
        this.partes[3] = { x: w, y: h, w, h, angle: 0 };
    }

    desordenarPartes() {
        const opciones = [0, 90, 180, 270];
        this.partes.forEach(p => p.angle = opciones[Math.floor(Math.random() * opciones.length)]);
    }

    dibujarPartes() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        const imgW = this.img.width / 2;
        const imgH = this.img.height / 2;

        this.partes.forEach((parte, i) => {
            this.ctx.save();
            const cx = parte.x + parte.w / 2;
            const cy = parte.y + parte.h / 2;
            this.ctx.translate(cx, cy);
            this.ctx.rotate(parte.angle * Math.PI / 180);
            this.ctx.drawImage(
                this.img,
                (i % 2) * imgW,
                Math.floor(i / 2) * imgH,
                imgW,
                imgH,
                -parte.w / 2,
                -parte.h / 2,
                parte.w,
                parte.h
            );
            this.ctx.restore();
        });
    }

    rotarParte(e) {
        if (!this.juegoIniciado) return;

        const rect = this.canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        this.partes.forEach(parte => {
            if (
                mouseX > parte.x && mouseX < parte.x + parte.w &&
                mouseY > parte.y && mouseY < parte.y + parte.h
            ) {
                parte.angle += (e.button === 0 ? -90 : 90);
                this.dibujarPartes();
                if (this.esVictoria()) this.mostrarModal();
            }
        });
    }

    esVictoria() {
        return this.partes.every(parte => parte.angle % 360 === 0);
    }

    mostrarModal() {
        this.juegoIniciado = false;
        clearInterval(this.timerInterval);
        this.victoryModal.style.display = "flex";
        const tiempoFinal = document.getElementById("tiempoFinal");
        tiempoFinal.textContent = `Tiempo: ${this.formatearTiempo(this.segundos)}`;
    }

    iniciarJuego() {
        this.juegoIniciado = true;
        this.segundos = 0;
        this.timerDisplay.textContent = this.formatearTiempo(this.segundos);
        this.timerInterval = setInterval(() => {
            this.segundos++;
            this.timerDisplay.textContent = this.formatearTiempo(this.segundos);
        }, 1000);
        this.desordenarPartes();
        this.dibujarPartes();
        this.actualizarNivelDisplay();
    }

    siguienteNivel() {
        if (this.nivelActual < this.totalNiveles) {
            this.nivelActual++;
            this.imagenActualIndex = (this.imagenActualIndex + 1) % IMAGE_BANK.length;
            this.loadImage(this.imagenActualIndex);
            this.iniciarJuego();
        } else {
            alert("¡Completaste todos los niveles!");
        }
    }

    actualizarNivelDisplay() {
        this.nivelDisplay.textContent = `Nivel: ${this.nivelActual}`;
    }

    formatearTiempo(seg) {
        const min = Math.floor(seg / 60).toString().padStart(2, "0");
        const sec = (seg % 60).toString().padStart(2, "0");
        return `${min}:${sec}`;
    }
}
// Función para animación de selección de imagen
playRandomFromGallery() {
    const images = Array.from(this.galeria.querySelectorAll(".galeria-img"));
    let currentIndex = 0;
    const animationDuration = 200; // ms por imagen
    const totalCycles = 2;         // cuántas vueltas completas
    let cycleCount = 0;

    const interval = setInterval(() => {
        // Remover clase animación de todas
        images.forEach(img => img.classList.remove("animating"));
        // Agregar clase animación a la actual
        images[currentIndex].classList.add("animating");

        currentIndex++;

        if (currentIndex >= images.length) {
            currentIndex = 0;
            cycleCount++;
        }

        if (cycleCount >= totalCycles) {
            clearInterval(interval);
            // Selecciona aleatoria final
            const randomIndex = Math.floor(Math.random() * images.length);
            images.forEach(img => img.classList.remove("animating"));
            images[randomIndex].classList.add("selected");

            setTimeout(() => {
                this.imagenActualIndex = randomIndex;
                this.loadImage(this.imagenActualIndex);
                images[randomIndex].classList.remove("selected");
                this.iniciarJuego();
            }, 500);
        }
    }, animationDuration);
}

// Inicializar el juego
const puzzle = new PuzzleGame("MyCanvas", "timer", "nivelDisplay");
