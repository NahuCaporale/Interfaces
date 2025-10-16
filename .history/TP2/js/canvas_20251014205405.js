const canvas = document.getElementById("MyCanvas");
const ctx = canvas.getContext("2d");

const img = new Image();
img.src = "./assets/imgs/avatar.jpg"; // La imagen que subiste

let angles = [0, 0, 0, 0];

img.onload = () => {
    dibujarPartes();
};

function dibujarPartes() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const imgW = img.width / 2;  // Mitad del ancho
    const imgH = img.height / 2; // Mitad del altoconst canvasW = canvas.width / 2; 
    const canvasW = canvas.width / 2; 
    const canvasH = canvas.height / 2;
    console.log("Canvas dividido en", canvasW, canvasH);

    // Parte 1 (arriba izquierda)
    ctx.drawImage(img,
        0, 0, imgW, imgH,      // origen y tamaño recorte
        0, 0, canvasW, canvasH // destino en canvas
    );

    // Parte 2 (arriba derecha)
    ctx.drawImage(img,
        imgW, 0, imgW, imgH,
        canvasW, 0, canvasW, canvasH
    );

    // Parte 3 (abajo izquierda)
    ctx.drawImage(img,
        0, imgH, imgW, imgH,
        0, canvasH, canvasW, canvasH
    );

    // Parte 4 (abajo derecha)
    ctx.drawImage(img,
        imgW, imgH, imgW, imgH,
        canvasW, canvasH, canvasW, canvasH
    );
}