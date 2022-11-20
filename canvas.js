let canvas = document.querySelector("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let pencilColor  = document.querySelectorAll(".pencil-color");
let pencilWidthElem  = document.querySelector(".pencil-width");
let eraserWidthElem  = document.querySelector(".eraser-width");
let download = document.querySelector(".download");
let undo = document.querySelector(".undo");
let redo = document.querySelector(".redo");

let penColor = "red";
let eraserColor = "White";
let penWidth = pencilWidthElem.value;
let eraserWidth = eraserWidthElem.value;
let mouseDown = false;

let undoRedoTracker = [];
let track = 0;

let tool = canvas.getContext('2d');
tool.strokeStyle = penColor;
tool.lineWidth = penWidth;

function beginPath(eventObj)
{
    tool.beginPath();
    tool.moveTo(eventObj.x,eventObj.y);
}

function drawStroke(eventObj)
{
    tool.strokeStyle = eventObj.color;
    tool.lineWidth = eventObj.width;
    tool.lineTo(eventObj.x,eventObj.y);
    tool.stroke();
}

canvas.addEventListener("mousedown",function(e){
    mouseDown = true;
    beginPath({
        x:e.clientX,
        y:e.clientY
    });
});

canvas.addEventListener("mousemove",function(e){
    if(mouseDown)
    {
        drawStroke({
            x:e.clientX,
            y:e.clientY,
            color: eraserFlag ? eraserColor : penColor,
            width: eraserFlag ? eraserWidth : penWidth
        });
    }
});

canvas.addEventListener("mouseup",function(e){
    mouseDown = false;
    let url = canvas.toDataURL();
    undoRedoTracker.push(url);
    track = undoRedoTracker.length - 1;
});

undo.addEventListener("click",function(e)
{
    if(track > 0)
        track--;
    let trackObj = {
        trackValue: track,
        undoRedoTracker
    }
    undoRedoTrack(trackObj);
});

redo.addEventListener("click",function(e)
{
    if(track < undoRedoTracker.length - 1)
        track++;
    let trackObj = {
        trackValue: track,
        undoRedoTracker
    }
    undoRedoTrack(trackObj);
});

function undoRedoTrack(trackObj)
{
    track = trackObj.trackValue;
    undoRedoTracker = trackObj.undoRedoTracker;
    let url = undoRedoTracker[track];
    let img = new Image();
    tool.clearRect(0, 0, canvas.width, canvas.height);  //Clears previous drawings
    img.src = url;
    img.onload = (e) => {
        tool.drawImage(img,0,0,canvas.width,canvas.height);
    }
}

pencilColor.forEach((colorElem) => {
    colorElem.addEventListener("click", (e) => {
        let color = colorElem.classList[0]; 
        penColor = color;
        tool.strokeStyle = penColor;
    });
});

pencilWidthElem.addEventListener("change",function(e)
{
    penWidth = pencilWidthElem.value;
    tool.lineWidth = penWidth;
});

eraserWidthElem.addEventListener("change",function(e)
{
    eraserWidth = eraserWidthElem.value;
    tool.lineWidth = eraserWidth;
});

eraser.addEventListener("click", function(e){
    if (eraserFlag) {
        tool.strokeStyle = eraserColor;
        tool.lineWidth = eraserWidth;
    } else {
        tool.strokeStyle = penColor;
        tool.lineWidth = penWidth;
    }
});

download.addEventListener("click",function(e)
{
    let url = canvas.toDataURL();
    let a = document.createElement("a");
    a.href = url;
    a.download = "board.jpg";
    a.click();
});