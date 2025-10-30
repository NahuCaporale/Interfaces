let canvas = document.querySelector('#gameCanvas');
let ctx = canvas.getContext('2d');
let canvasWidth = canvas.width;
let canvasHeight = canvas.height;

const CANT_FICHAS= 32;

let fichas = [];
let lastClickedFicha = null;
let isMouseDown = false;

function addFichas(){
    addFicha();
    drawFigure();
}

function drawFigure(){
    clearCanvas();
    for (let i = 0 ; i<fichas.length; i++){
        fichas[i].draw();
    }
}

function addFicha() {
    let posX = Math.random() * canvasWidth;
    let posY = Math.random() * canvasHeight;
    let color = randomRGBA();

    let ficha = new Ficha(posX, posY, color, ctx);
    fichas.push(ficha);
}

function randomRGBA() { 
    let r = Math.round(Math.random() * 255);
    let g = Math.round(Math.random() * 255);
    let b = Math.round(Math.random() * 255);
    let a = 255;
    return `rgba(${r},${g},${b},${a})`;
 }

 function clearCanvas() {
ctx.fillStyle = '';}  