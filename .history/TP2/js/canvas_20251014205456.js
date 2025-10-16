const canvas = document.getElementById("MyCanvas");
const ctx = canvas.getContext("2d");

const img = new Image();
img.src = "https://i.imgur.com/z4d4kWk.jpeg"; // Verifica que esta ruta es correcta

let angles = [0, 0, 0, 0];

img.onload = () => {
    dibujarPartes();
};

function dibujarPartes() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const imgW = img.width / 2;
    const imgH = img.height / 2;

    const canvasW = canvas.width / 2;
    const canvasH = canvas.height / 2;

    console.log("Tamaño imagen:", img.width, img.height);

    // Parte 1 (arriba izquierda)
    ctx.drawImage(
        img,
        0, 0, imgW, imgH,  // recorte del origen
        0, 0, canvasW, canvasH // destino en canvas
    );

    // Parte 2 (arriba derecha)
    ctx.drawImage(
        img,
        imgW, 0, imgW, imgH,
        canvasW, 0, canvasW, canvasH
    );

    // Parte 3 (abajo izquierda)
    ctx.drawImage(
        img,
        0, imgH, imgW, imgH,
        0, canvasH, canvasW, canvasH
    );

    // Parte 4 (abajo derecha)
    ctx.drawImage(
        img,
        imgW, imgH, imgW, imgH,
        canvasW, canvasH, canvasW, canvasH
    );
}
