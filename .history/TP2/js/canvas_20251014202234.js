'use strict';
let canvas = document.getElementById('MyCanvas')
let ctx = canvas.getContext('2d')
let width = 500;
let height = 500;
let imageData = ctx.createImageData(width, height)


let r = 255;
let g = 0;
let b = 255;
let a = 255;

function drawRect(imageData, r, g, b, a) {
    for (let x = 0; x < width; x++) {
        let r;
        let g;
        let b;
        for (let y = 0; y < width; y++) {
            setPixel(imageData, x, y, r, g, b, a);

        }
    }
}


function setPixel(imageData, x, y, r, g, b, a) {
    let index = (x + y * imageData.width) * 4;
    imageData.data[index + 0] = r;
    imageData.data[index + 1] = g;
    imageData.data[index + 2] =b;
    imageData.data[index + 3] = r;

}