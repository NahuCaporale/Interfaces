const canvas = document.getElementById("canvas");
const scores = localStorage.getItem("pegScores");

let jugar = document.getElementById("jugar");

jugar.addEventListener("click", () => {
  iniciarJuego();

  let imgCont = document.querySelector(".img-container");

  if (imgCont) {
    imgCont.classList.add("juego-iniciado");
  }
});
let jugarAgain = document.getElementById("jugarAgain");
jugarAgain.addEventListener("click", () => {
  iniciarJuego();

  let imgCont = document.querySelector(".img-container");

  if (imgCont) {
    imgCont.classList.add("juego-iniciado");
  }
});

const rutasImagenes = {
  fichaNormal: "assets/imgs/peg/fichanormal.png",
  fichaEspecial: "assets/imgs/peg/fichaespecial.png",
  fondoTablero: "assets/imgs/peg/fondocometa.jpg",
  celda: "assets/imgs/peg/celda2.jpg",
};

const assets = {};
function cargarImagen(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = src;
    img.onload = () => resolve(img);
    img.onerror = (err) => reject(new Error(`Error cargando imagen: ${src}`));
  });
}
document.addEventListener("DOMContentLoaded", () => {
  cargarHighScores();
});

async function iniciarJuego() {
  try {
    document.querySelector(".img-container").classList.remove("terminado");
    // 1. Mostrar un "cargando..." (opcional)
    const ctx = canvas.getContext("2d");
    ctx.font = "30px Arial";
    ctx.fillStyle = "white";
    ctx.fillText("Cargando...", canvas.width / 2 - 50, canvas.height / 2);

    //array para esperar que carguen las imagenes
    const promesas = [
      cargarImagen(rutasImagenes.fichaNormal),
      cargarImagen(rutasImagenes.fichaEspecial),
      cargarImagen(rutasImagenes.fondoTablero),
      cargarImagen(rutasImagenes.celda),
    ];

    const [imgNormal, imgEspecial, imgFondo, imgCelda] =
      await Promise.all(promesas);

    assets.fichaNormal = imgNormal;
    assets.fichaEspecial = imgEspecial;
    assets.fondoTablero = imgFondo;
    assets.celda = imgCelda;
    console.log("assets cargados");

    // 5. empezamos el juego

    const board = new Tablero();

    const vista = new Vista(canvas);
    vista.esconderMenuInicio();
    vista.esconderMenuFinal();
    const gameController = new GameController(canvas, board, vista);
    board.generarPiezas(vista.tamanioCelda, vista.offsetX, vista.offsetY);

    let inicio = (gameController.tiempoInicio = Date.now());
    gameController.juegoTerminado = false; // El juego (re)inicia

    vista.mejorTiempo(formatearTiempo(parseInt(scores)));
    function gameLoop() {
      if (!gameController.juegoTerminado) {
        let segundosActuales = Math.floor((Date.now() - inicio) / 1000);
        vista.actualizarTiempo(segundosActuales);
      }

      vista.clear();
      vista.dibujarFondo(assets);
      vista.dibujarTablero(board, assets);
      vista.dibujarPiezas(board.pieces, assets);
      vista.renderizarHints();
      requestAnimationFrame(gameLoop);
    }

    gameLoop();
  } catch (error) {
    console.error("No se pudieron cargar las imágenes:", error);
  }
}

function cargarHighScores() {
  document.getElementById("score-1").textContent = scores
    ? `1. ${formatearTiempo(parseInt(scores))}`
    : "1. --:--";
}
function formatearTiempo(totalSegundos) {
  const minutos = Math.floor(totalSegundos / 60)
    .toString()
    .padStart(2, "0");
  const segundos = (totalSegundos % 60).toString().padStart(2, "0");
  return `${minutos}:${segundos}`;
}
