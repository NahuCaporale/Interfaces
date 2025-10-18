const canvas = document.getElementById("MyCanvas");
const ctx = canvas.getContext("2d");

const img = new Image();
img.src = "./assets/imgs/avatar.jpg";

const partes = [
    { x: 0, y: 0, w: 0, h: 0, angle: 0 },   // Parte 1
    { x: 0, y: 0, w: 0, h: 0, angle: 0 },   // Parte 2
    { x: 0, y: 0, w: 0, h: 0, angle: 0 },   // Parte 3
    { x: 0, y: 0, w: 0, h: 0, angle: 0 },   // Parte 4
];

img.onload = () => {
    // Calculamos las posiciones y tamaños de cada parte
    const canvasW = canvas.width / 2;
    const canvasH = canvas.height / 2;

    partes[0].x = 0; partes[0].y = 0; partes[0].w = canvasW; partes[0].h = canvasH;
    partes[1].x = canvasW; partes[1].y = 0; partes[1].w = canvasW; partes[1].h = canvasH;
    partes[2].x = 0; partes[2].y = canvasH; partes[2].w = canvasW; partes[2].h = canvasH;
    partes[3].x = canvasW; partes[3].y = canvasH; partes[3].w = canvasW; partes[3].h = canvasH;

    dibujarPartes();
};

// Función para dibujar todas las partes
function dibujarPartes() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const imgW = img.width / 2;
    const imgH = img.height / 2;

    partes.forEach((parte, i) => {
        ctx.save();

        // Centro de la subimagen
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

// Detectamos clic para rotar
canvas.addEventListener("mousedown", (e) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Revisamos en qué subimagen se hizo clic
    partes.forEach(parte => {
        if (
            mouseX > parte.x && mouseX < parte.x + parte.w &&
            mouseY > parte.y && mouseY < parte.y + parte.h
        ) {
            if (e.button === 0) parte.angle -= 90; // Clic izquierdo
            else if (e.button === 2) parte.angle += 90; // Clic derecho
            dibujarPartes();
        }
    });
});

// Evita menú del clic derecho
canvas.addEventListener("contextmenu", (e) => e.preventDefault());










//INICIALIZAR IMG DESORDENADA 
img.onload = () => {
    const canvasW = canvas.width / 2;
    const canvasH = canvas.height / 2;

    partes[0].x = 0; partes[0].y = 0; partes[0].w = canvasW; partes[0].h = canvasH;
    partes[1].x = canvasW; partes[1].y = 0; partes[1].w = canvasW; partes[1].h = canvasH;
    partes[2].x = 0; partes[2].y = canvasH; partes[2].w = canvasW; partes[2].h = canvasH;
    partes[3].x = canvasW; partes[3].y = canvasH; partes[3].w = canvasW; partes[3].h = canvasH;

    // ✅ Rotacion aleatorias iniciales
    partes.forEach(parte => {
        const opciones = [0, 90, 180, 270];
        parte.angle = opciones[Math.floor(Math.random() * opciones.length)];
    });

    dibujarPartes();
};
