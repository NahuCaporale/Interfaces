const canvas = document.getElementById("MyCanvas");
const ctx = canvas.getContext("2d");

document.getElementById("start-btn").addEventListener("click", iniciarJuego);

function iniciarJuego() {
    console.log("Juego iniciado");
    dibujarImagenInicial();
}

function dibujarImagen() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2); // origen al centro
    ctx.rotate(angle * Math.PI / 180); // rotamos
    ctx.drawImage(img, -img.width / 2, -img.height / 2); // dibuja centrado
    ctx.restore();
}

// Detectar clic izquierdo y derecho
canvas.addEventListener("mousedown", (evento) => {
    if (evento.button === 0) {
        // Clic izquierdo → gira a la izquierda
        angle -= 90;
    } else if (evento.button === 2) {
        // Clic derecho → gira a la derecha
        angle += 90;
    }
    dibujarImagen();
});

// Evita menú del clic derecho
canvas.addEventListener("contextmenu", (e) => e.preventDefault());
