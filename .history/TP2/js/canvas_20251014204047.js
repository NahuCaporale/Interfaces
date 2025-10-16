const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

document.getElementById("start-btn").addEventListener("click", iniciarJuego);

function iniciarJuego() {
    console.log("Juego iniciado");
    dibujarImagenInicial();
}

function dibujarImagenInicial() {
    const img = new Image();
    img.src = "./assets/imgs.jpg"; // después lo vamos a cambiar por una aleatoria
    
    img.onload = () => {
        // Dividimos en 4 partes (2x2)
        const w = canvas.width / 2;
        const h = canvas.height / 2;
        
        ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, w, h);
        ctx.drawImage(img, 0, 0, img.width, img.height, w, 0, w, h);
        ctx.drawImage(img, 0, 0, img.width, img.height, 0, h, w, h);
        ctx.drawImage(img, 0, 0, img.width, img.height, w, h, w, h);
    };
}