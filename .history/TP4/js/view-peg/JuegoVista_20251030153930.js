let canvas = document.querySelector('#gameCanvas');
let ctx = canvas.getContext('2d');
let canvasWidth = canvas.width;
let canvasHeight = canvas.height;

const CANT_FICHAS= 32;

let fichas = [];
let lastClickedFicha = null;
let isMouseDown = false;

function addFichas(){
    addCircle();
    drawFigure();
}