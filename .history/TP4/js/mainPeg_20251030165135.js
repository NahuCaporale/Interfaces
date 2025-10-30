import Tablero from "./model-peg/Tablero.js";
import JuegoVista from "./view-peg/JuegoVista.js";
import JuegoControlador from "./controller-peg/JuegoController.js";

const canvas = document.querySelector('#gameCanvas');
const ctx = canvas.getContext('2d');

// El tablero ahora genera las fichas internamente
const tablero = new Tablero(ctx, canvas);
const vista = new JuegoVista(canvas, tablero);
const controlador = new JuegoControlador(tablero, vista);

vista.drawFigure();
