/*
Using https://github.com/bit101/quicksettings for the GUI 
Using https://github.com/zenozeng/p5.js-svg   for SVG export
*/

var canvas;
var panel, settings;


var margenExterior = 0;
var margenInterior = 0;
var gridSize, gap, strokeW;

var customColor = '#000'

var s;

var tittle = "Moire";


var gridMin, gridMax, gapMin, gapMax, strokeMin, strokeMax, offsetXMin, offsetXMax, offsetYMin, offsetYMax, rotationMin, rotationMax, scaleMin, scaleMax;

gridMin = 2;
gridMax = 40;

gapMin = -50;
gapMax = 50;

strokeMin = 1;
strokeMax = 10;

offsetXMin = -50; 
offsetXMax = 50;
offsetYMin = -50;
offsetYMax = 50;

rotationMin = -360;
rotationMax = 360;

scaleMin = 0.9;
scaleMax = 1.1;

function setup() {
    //create canvas using SVG library 

    margenExterior = (window.innerHeight*10)/100;
    s = min(window.innerWidth, window.innerHeight)-margenExterior;
    canvas = createCanvas(s , s, SVG);
    //canvas.parent("mainCanvas");

    noLoop();

    angleMode(RADIANS);
    noFill();

    //Panel de control (QuickSettings.js)
    settings = QuickSettings.create(10, 10, "Ajustes")
        .addText("Title", "Moire 1", refresh)
        .addButton("Aleatorio", randomize) // refresh
        .addButton("Download svg", downloadSVG) // download button
        .addButton("Download png", downloadPNG) // download button

    panel1 = QuickSettings.create(10, 250, "Pattern")
        .addRange("Grid", gridMin, gridMax, 10, 1, refresh)
        .addRange("Gap", gapMin, gapMax, 0, 1, refresh)
        .addRange("Stroke", strokeMin, strokeMax, 1, 1, refresh)
        
    panel2 = QuickSettings.create(10, 450, "Transform")
        .addNumber("Offset x", offsetXMin, offsetXMax, 0, 0.1, refresh)
        .addNumber("Offset y", offsetYMin, offsetYMax, 0, 0.1, refresh)
        .addNumber("Rotation", rotationMin, rotationMax, 1.1, 0.001, refresh)
        .addNumber("Scale", scaleMin, scaleMax, 1, 0.01, refresh)

        

    //panel.saveInLocalStorage("panel");
    //settings.saveInLocalStorage("settings");

}

function draw() {
    clear();
    background(255);

    gridSize = panel1.getValue("Grid");
    gap = panel1.getValue("Gap");
    strokeW = panel1.getValue("Stroke");

    title = settings.getValue("Title");

    var offsetX = panel2.getValue("Offset x");
    var offsetY = panel2.getValue("Offset y");
    var layerRotation = panel2.getValue("Rotation");
    var layerScale = panel2.getValue("Scale");

    gap = gap / gridSize

    translate(s / 2, s / 2);

    var responsiveStroke = strokeW/gridSize*5
    strokeWeight(responsiveStroke);
    strokeJoin(ROUND)
    strokeCap(ROUND)

    paintLayer(customColor);

    push()
         rotate((layerRotation*PI)/180)
        translate(offsetX, offsetY);
        scale(layerScale);
    paintLayer(customColor);
     pop()
   // downloadSVG()
}

//************************************************
//art functions

function paintLayer(c) {
    createHexGrid(gridSize, s, gap, c);
    push()
        //  rotate(HALF_PI)
    //concentricDraw(gridSize, s/1.5, c, 6)
    pop()
}


function concentricDraw(gs, w, c, d) {
    var inc = (((w / 2) - margin) / gs)
    stroke(c);
    for (var i = 1; i <= gs; i++) {
        var r = (i * inc)
        polygon(0, 0, (i * inc), 0, d);
        //ellipse(0, 0, r * 2, r * 2);
    }
}


function createHexGrid(gs, w, m, c) {
    stroke(c);
    margenExterior = (w*20)/100;
    var r = ((w - margenExterior) / (gs * 3 - 1));
    var hexW = sqrt(3) * r;
    var hexH = (2 * r);
    var rowAdd = 0;
    let start = createVector(
        (hexW / 2) * (gs - 1),
        (-hexH * 0.75) * (gs - 1)
    );
    for (let i = 0; i < (gs * 2) - 1; i++) {
        for (let y = 0; y < gs + rowAdd; y++) {
            polygon(start.x - ((hexW) * y), start.y, r, m, 6);
           // ellipse(start.x - ((hexW) * y), start.y, r, r)
        }
        if (i >= gs - 1) {
            rowAdd -= 1;
            start.x -= hexW / 2;
        } else {
            rowAdd += 1;
            start.x += hexW / 2;
        }
        start.y += hexH * 0.75;
    }
}

function polygon(x, y, r, m, n) {
    
    let a = TWO_PI / n;
    beginShape();
    beginShape(CLOSE);
    
    r = r - m;
    for (let i = 0; i < TWO_PI; i += a) {
        let sx = x + sin(i) * r;
        let sy = y + cos(i) * r;
       // point(sx, sy);
       vertex(sx, sy)
    }
    endShape(CLOSE);

}

//************************************************
function downloadSVG() {
    save(title + '.svg');
}

function downloadPNG() {
    saveSVG(title + '.png');
}

function refresh() {
    redraw();
}

function randomize(){

    var myRandomGrid = int(random(gridMin,gridMax));
    panel1.setValue("Grid", myRandomGrid);
    var myRandomGap = int(random(gapMin,gapMax));
    panel1.setValue("Gap", myRandomGap);
    var myRandomStroke = int(random(strokeMin,strokeMax));
    panel1.setValue("Stroke", myRandomStroke);    
    var myRandomOffsetX = round(random(offsetXMin, offsetXMax),4);
    panel2.setValue("Offset x", myRandomOffsetX);
    var myRandomOffsetY = round(random(offsetYMin,offsetYMax),4);
    panel2.setValue("Offset y", myRandomOffsetY);
    var myRandomRotation = round(random(rotationMin,rotationMax),4);
    panel2.setValue("Rotation", myRandomRotation);
    var myRandomScale = round(random(scaleMin ,scaleMax),4);
    panel2.setValue("Scale", myRandomScale);

}