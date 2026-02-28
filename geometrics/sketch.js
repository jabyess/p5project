let hexagons = [];
let mandalas = [];
let triangles = [];
const sideLength = 100;
const triS = 140; // triangle side length
const triH = triS * Math.sqrt(3) / 2; // triangle height
const hexSpacingX = sideLength * 3; // horizontal spacing between hexagon centers
const hexSpacingY = sideLength * 0.866; // vertical spacing between rows (sqrt(3)/2)


function setup() {
  let addHexButton = createButton("Add Hexagon");
  addHexButton.mousePressed(addHexagon);
  addHexButton.parent('button-container'); // Parent to the button container
  
  let removeHexButton = createButton("Remove Hexagon");
  removeHexButton.mousePressed(removeHexagon);
  removeHexButton.parent('button-container');
  
  let addTriButton = createButton("Add Triangle");
  addTriButton.mousePressed(addTriangle);
  addTriButton.parent('button-container');

  let removeTriButton = createButton("Remove Triangle");
  removeTriButton.mousePressed(removeTriangle);
  removeTriButton.parent('button-container');

  let addMandalaButton = createButton("Add Mandala");
  addMandalaButton.mousePressed(addMandala);
  addMandalaButton.parent('button-container');
  
  let removeMandalaButton = createButton("Remove Mandala");
  removeMandalaButton.mousePressed(removeMandala);
  removeMandalaButton.parent('button-container');
  
  // Change to full screen canvas
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent('sketch-container'); // Parent to the sketch container
}

function draw() {
  background(220);
  
  // Draw all hexagons
  hexagons.forEach(({centerX, centerY, fillColors}) => {
    drawHexagon({centerX, centerY, fillColors});
  });
  
  // Draw all triangles
  triangles.forEach(tri => drawTriangle(tri));

  // Draw all mandalas
  mandalas.forEach(mandala => {
    drawMandala(mandala.x, mandala.y);
  });
}

function getTriCols() {
  if (windowWidth > 1200) return 10;
  if (windowWidth > 800) return 8;
  if (windowWidth > 600) return 5;
  return 4;
}

function addTriangle() {
  const nCols = getTriCols();
  const totalPerBand = 2 * nCols;
  const band = Math.floor(triangles.length / totalPerBand);
  const local = triangles.length % totalPerBand;
  const isUp = local % 2 === 0;
  const k = Math.floor(local / 2);

  // Each band is triH tall; within a band, up centroids sit at 2/3 and down at 1/3 from the top.
  // Odd bands shift x by -triS/2 so triangles interlock across band boundaries.
  const x = k * triS + (isUp ? 0 : triS / 2) + (band % 2 === 0 ? triS / 2 : 0) ;
  const y = band * triH + (isUp ? 2 * triH / 3 : triH / 3);

  const fillColors = isUp ? [255, 179, 160] : [160, 200, 255];
  triangles.push({ x, y, isUp, fillColors });
}

function removeTriangle() {
  if (triangles.length > 0) {
    triangles.pop();
  }
}

function drawTriangle({ x, y, isUp, fillColors }) {
  beginShape();
  stroke(0);
  strokeWeight(2);
  fill(fillColors[0], fillColors[1], fillColors[2]);

  if (isUp) {
    vertex(x,             y - 2 * triH / 3);
    vertex(x - triS / 2, y + triH / 3);
    vertex(x + triS / 2, y + triH / 3);
  } else {
    vertex(x - triS / 2, y - triH / 3);
    vertex(x + triS / 2, y - triH / 3);
    vertex(x,             y + 2 * triH / 3);
  }

  endShape(CLOSE);
}

function addHexagon() {

  // Calculate grid position for honeycomb arrangement
  // const row = Math.floor(hexagons.length / 4);
  var row, col;
  if(windowWidth > 1200) {
    row = Math.floor(hexagons.length / 6);
    col = hexagons.length % 6;
  }
  else if(windowWidth > 800) {
    row = Math.floor(hexagons.length / 4);
    col = hexagons.length % 4;
  }
  else if (windowWidth > 600) {
    row = Math.floor(hexagons.length / 3);
    col = hexagons.length % 3;
  }
  else {
    row = Math.floor(hexagons.length / 2);
    col = hexagons.length % 2;
  }
  
  // col = hexagons.length % (windowWidth > 800 ? 4 : windowWidth > 600 ? 2 : 1);
  // Honeycomb pattern with proper spacing
  const centerX =  col * hexSpacingX + (row % 2) * hexSpacingX / 2;
  const centerY =  row * hexSpacingY; 
  
  let rand = Math.ceil(Math.random() * 10);
  
  let fillColors = [219, 124, 38] //orange
  if(rand > 8) {
    fillColors = [38, 50, 100]; //blue
  }
  
  hexagons.push({ centerX, centerY, fillColors });
}

function removeHexagon() {
  if (hexagons.length > 0) {
    hexagons.pop();
  }
}

function addMandala() {
  // Calculate grid position for mandala arrangement
  const row = Math.floor(mandalas.length / 3);
  const col = mandalas.length % 3;
  
  // Space mandalas horizontally and vertically
  const x = col * 175;
  const y = row * 175;

  mandalas.push({ x, y });
}

function removeMandala() {
  if (mandalas.length > 0) {
    mandalas.pop();
  }
}

function drawHexagon({centerX, centerY, fillColors}) {

  beginShape();
  stroke(0);
  strokeWeight(2);
  fill(fillColors[0], fillColors[1], fillColors[2]);
  
  // Draw 6 vertices of the hexagon
  for (let i = 0; i < 6; i++) {
    const angle = TWO_PI / 6 * i;
    const x = centerX + sideLength * cos(angle);
    const y = centerY + sideLength * sin(angle);
    vertex(x, y);
  }
  
  endShape(CLOSE);
}

function drawMandala(centerX, centerY) {
  const maxRadius = 80;
  
  // Draw outer 16-point star
  stroke(100);
  strokeWeight(1.5);
  noFill();
  
  beginShape();
  for (let i = 0; i < 16; i++) {
    const angle = TWO_PI / 16 * i;
    const r = i % 2 === 0 ? maxRadius : maxRadius * 0.7; // alternate between outer and inner points
    const x = centerX + r * cos(angle);
    const y = centerY + r * sin(angle);
    vertex(x, y);
  }
  endShape(CLOSE);
  
  // // Draw concentric circles
  for (let r = 20; r < maxRadius; r += 20) {
    noFill();
    stroke(100);
    strokeWeight(1);
    circle(centerX, centerY, r * 2);
  }
  
  // Draw radial lines to create segments
  stroke(120);
  strokeWeight(1);
  for (let i = 0; i < 16; i++) {
    const angle = TWO_PI / 16 * i;
    const x1 = centerX + 15 * cos(angle);
    const y1 = centerY + 15 * sin(angle);
    const x2 = centerX + maxRadius * cos(angle);
    const y2 = centerY + maxRadius * sin(angle);
    line(x1, y1, x2, y2);
  }
  
  // Draw inner geometric pattern with small circles
  fill(200, 150, 255, 150);
  noStroke();
  for (let i = 0; i < 16; i++) {
    const angle = TWO_PI / 16 * i;
    const x = centerX + 40 * cos(angle);
    const y = centerY + 40 * sin(angle);
    circle(x, y, 8);
  }
  
  // Draw center circle
  fill(150, 100, 200);
  stroke(0);
  strokeWeight(2);
  circle(centerX, centerY, 15);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}