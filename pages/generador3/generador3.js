/*
Using https://github.com/bit101/quicksettings for the GUI 
Using https://github.com/zenozeng/p5.js-svg   for SVG export
*/

var canvas;
var panel, settings;


var margenExterior = 0;
var margenInterior = 0;
var gridSize, strokeW;

var customColor1 = '#FFE600'
var customColor2 = '#0086FF'
var customColor3 = '#FF0086'

var s;

var tittle = "Moire";


var gridMin, gridMax, strokeMin, strokeMax, offsetXMin, offsetXMax, offsetYMin, offsetYMax, rotationMin, rotationMax, scaleMin, scaleMax;

gridMin = 2;
gridMax = 40;

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


var offsetX, offsetY, layerRotation, layerScale;

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
        .addText("Título", "Moire 1", refresh)
        .addButton("Aleatorio", randomize) // refresh
        .addButton("Descargar .svg", downloadSVG) // download button
        .addButton("Descargar .png", downloadPNG) // download button

    panel1 = QuickSettings.create(10, 250, "Patrón")
        .addRange("Densidad", gridMin, gridMax, 10, 1, refresh)
        .addRange("Grosor", strokeMin, strokeMax, 1, 1, refresh)
        
    panel2 = QuickSettings.create(10, 450, "Transformar")
        .addNumber("Offset eje X", offsetXMin, offsetXMax, 0, 0.1, refresh)
        .addNumber("Offset eje Y", offsetYMin, offsetYMax, 0, 0.1, refresh)
        .addNumber("Rotación", rotationMin, rotationMax, 1.1, 0.001, refresh)
        .addNumber("Escala", scaleMin, scaleMax, 1, 0.01, refresh)

        

    //panel.saveInLocalStorage("panel");
    //settings.saveInLocalStorage("settings");

    settings.setDraggable(true);
    panel1.setDraggable(true);
    panel2.setDraggable(true);


   

    function reposition(x) {
        if (x.matches) { // If media query matches
            settings.setPosition(20, 600);
            panel1.setPosition(20, 840);
            panel2.setPosition(20, 995);
        } else {
            settings.setPosition(10, 10);
            panel1.setPosition(10, 250);
            panel2.setPosition(10, 405);
        }
      }
      
      var x = window.matchMedia("(max-width: 700px)")
      reposition(x) // Call listener function at run time
      x.addListener(reposition) // Attach listener function on state changes

}

function draw() {
    clear();
    background(255);

    gridSize = panel1.getValue("Densidad");
    strokeW = panel1.getValue("Grosor");

    title = settings.getValue("Título");

    offsetX = panel2.getValue("Offset eje X");
    offsetY = panel2.getValue("Offset eje Y");
    layerRotation = panel2.getValue("Rotación");
    layerScale = panel2.getValue("Escala");


    translate(s / 2, s / 2);

    var responsiveStroke = strokeW/gridSize*5
    strokeWeight(responsiveStroke);
    strokeJoin(ROUND)
    strokeCap(ROUND)

    paintLayer(customColor1);

    push()
         rotate((layerRotation*PI)/180);
        translate(offsetX, offsetY);
        scale(layerScale);
    paintLayer(customColor2);
     pop()
     push()
         rotate(((layerRotation*-1)*PI)/180)
        translate(offsetY, offsetX);
        scale((layerScale*-1)+2);
    paintLayer(customColor3);
     pop()
   // downloadSVG()
}

//************************************************
//art functions

function paintLayer(c) {
    push()
        rotate(HALF_PI)
    concentricDraw(gridSize, s/1.5, c, 6)
    pop()
}


function concentricDraw(gs, w, c, d) {
    margenExterior = (w*20)/100;
    var inc = (((w / 2) - margenInterior) / gs)
    stroke(c);
    for (var i = 1; i <= gs; i++) {
        var r = (i * inc)
        polygon(0, 0, (i * inc), 0, d);
        //ellipse(0, 0, r * 2, r * 2);
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
    panel1.setValue("Densidad", myRandomGrid)
    var myRandomStroke = int(random(strokeMin,strokeMax));
    panel1.setValue("Grosor", myRandomStroke);
    var myRandomOffsetX = int(random(offsetXMin*100, offsetXMax*100))/100;
    panel2.setValue("Offset eje X", myRandomOffsetX);
    var myRandomOffsetY = int(random(offsetYMin*100,offsetYMax*100))/100;
    panel2.setValue("Offset eje Y", myRandomOffsetY);
    var myRandomRotation = int(random(rotationMin*100,rotationMax*100))/100;
    panel2.setValue("Rotación", myRandomRotation);
    var myRandomScale = int(random(scaleMin*100 ,scaleMax*100))/100;
    panel2.setValue("Escala", myRandomScale);

}
