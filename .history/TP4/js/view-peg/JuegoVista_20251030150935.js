let canvas = document.querySelector('#gameCanvas');
let ctx = canvas.getContext('2d');
let canvasWidth = canvas.width;
let canvasHeight = canvas.height;

for (let i = 0; i < 50; i++) 
{
 ctx.fillStyle = randomRGBA();
 ctx.beginPath();
 ctx.arc(Math.random() * canvasWidth, Math.random() * canvasHeight, Math.random() * 50, 0, Math.PI * 2, true);
 ctx.fill();
 ctx.closePath();
}

function randomRGBA() {
    let r = Math.round(Math.random() * 255);
    let g = Math.round(Math.random() * 255);
    let b = Math.round(Math.random() * 255);
    let a =255;
    return `rgba(${r},${g},${b},${a})`;
  }
