let hexagons = [];
let mandalas = [];
let triangles = [];
let mandalaSpinning = false;
let mandalaRotation = 0;
const sideLength = 100;
const triS = 140; // triangle side length
const triH = (triS * Math.sqrt(3)) / 2; // triangle height
const hexSpacingX = sideLength * 3; // horizontal spacing between hexagon centers
const hexSpacingY = sideLength * 0.866; // vertical spacing between rows (sqrt(3)/2)

// colors
let grape = "#594157";
let rose = "#a87a82";
let powder = "#F7B2AD";
let almond = "#CEB7B3";
let stormy = "#00798C";
let muted = "#9abca7";

function setup() {
  let addHexButton = createButton("Add Hexagon");
  addHexButton.mousePressed(addHexagon);
  addHexButton.parent("button-container"); // Parent to the button container

  let addTriButton = createButton("Add Triangle");
  addTriButton.mousePressed(addTriangle);
  addTriButton.parent("button-container");

  let addMandalaButton = createButton("Add Mandala");
  addMandalaButton.mousePressed(addMandala);
  addMandalaButton.parent("button-container");

  let spinButton = createButton("Spin Mandalas");
  spinButton.mousePressed(() => {
    mandalaSpinning = !mandalaSpinning;
    spinButton.html(mandalaSpinning ? "Stop Spinning" : "Spin Mandalas");
  });
  spinButton.parent("button-container");

  let clearButton = createButton("Clear All");
  clearButton.mousePressed(() => {
    hexagons = [];
    triangles = [];
    mandalas = [];
  });
  clearButton.parent("button-container");



  // Change to full screen canvas
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent("sketch-container"); // Parent to the sketch container
}

function draw() {
  background(230);
  if (mandalaSpinning) mandalaRotation += 0.015;

  // Draw all hexagons
  hexagons.forEach(({ centerX, centerY, fillColor }) => {
    drawHexagon({ centerX, centerY, fillColor });
  });

  // Draw all triangles
  triangles.forEach((tri) => drawTriangle(tri));

  // Draw all mandalas
  mandalas.forEach((mandala) => {
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
  const x = k * triS + (isUp ? 0 : triS / 2) + (band % 2 === 0 ? triS / 2 : 0);
  const y = band * triH + (isUp ? (2 * triH) / 3 : triH / 3);

  const fillColor = isUp ? almond : powder; // Up triangles are almond, down are powder
  triangles.push({ x, y, isUp, fillColor });
}

function removeTriangle() {
  if (triangles.length > 0) {
    triangles.pop();
  }
}

function drawTriangle({ x, y, isUp, fillColor }) {
  beginShape();
  stroke(0);
  strokeWeight(2);
  fill(fillColor);

  if (isUp) {
    vertex(x, y - (2 * triH) / 3);
    vertex(x - triS / 2, y + triH / 3);
    vertex(x + triS / 2, y + triH / 3);
  } else {
    vertex(x - triS / 2, y - triH / 3);
    vertex(x + triS / 2, y - triH / 3);
    vertex(x, y + (2 * triH) / 3);
  }

  endShape(CLOSE);
}

function addHexagon() {
  // Calculate grid position for honeycomb arrangement
  // const row = Math.floor(hexagons.length / 4);
  var row, col;
  if (windowWidth > 1200) {
    row = Math.floor(hexagons.length / 6);
    col = hexagons.length % 6;
  } else if (windowWidth > 800) {
    row = Math.floor(hexagons.length / 4);
    col = hexagons.length % 4;
  } else if (windowWidth > 600) {
    row = Math.floor(hexagons.length / 3);
    col = hexagons.length % 3;
  } else {
    row = Math.floor(hexagons.length / 2);
    col = hexagons.length % 2;
  }

  // col = hexagons.length % (windowWidth > 800 ? 4 : windowWidth > 600 ? 2 : 1);
  // Honeycomb pattern with proper spacing
  const centerX = col * hexSpacingX + ((row % 2) * hexSpacingX) / 2;
  const centerY = row * hexSpacingY;

  let rand = Math.ceil(Math.random() * 10);

  let fillColor = stormy;
  if (rand > 8) {
    fillColor = muted;
  }

  hexagons.push({ centerX, centerY, fillColor });
}

function removeHexagon() {
  if (hexagons.length > 0) {
    hexagons.pop();
  }
}

function getMandalaCols() {
  if (windowWidth > 1600) return 12;
  if (windowWidth > 1200) return 10;
  if (windowWidth > 800) return 6;
  return 3;
}

function addMandala() {
  // Calculate grid position for mandala arrangement
  const row = Math.floor(mandalas.length / getMandalaCols());
  const col = mandalas.length % getMandalaCols();

  // Space mandalas horizontally and vertically
  const x = col * 180;
  const y = row * 180;

  mandalas.push({ x, y });
}

function removeMandala() {
  if (mandalas.length > 0) {
    mandalas.pop();
  }
}

function drawHexagon({ centerX, centerY, fillColor }) {
  beginShape();
  stroke(0);
  strokeWeight(2);
  fill(fillColor);

  // Draw 6 vertices of the hexagon
  for (let i = 0; i < 6; i++) {
    const angle = (TWO_PI / 6) * i;
    const x = centerX + sideLength * cos(angle);
    const y = centerY + sideLength * sin(angle);
    vertex(x, y);
  }

  endShape(CLOSE);
}

function drawMandala(centerX, centerY) {
  const maxRadius = 90;
  let numberOfPoints = 24;

  push();
  translate(centerX, centerY);
  rotate(mandalaRotation);

  stroke(0);
  strokeWeight(1.5);
  fill(grape);

  beginShape();
  for (let i = 0; i < numberOfPoints; i++) {
    const angle = (TWO_PI / numberOfPoints) * i;
    const r = i % 2 === 0 ? maxRadius : maxRadius * 0.72;
    vertex(r * cos(angle), r * sin(angle));
  }
  endShape(CLOSE);

  // Draw radial lines to create segments
  stroke(rose);
  strokeWeight(1.5);
  for (let i = 0; i < numberOfPoints; i++) {
    if (i % 2 === 1) continue;
    const angle = (TWO_PI / numberOfPoints) * i;
    line(
      30 * cos(angle),
      30 * sin(angle),
      (maxRadius - 30) * cos(angle),
      (maxRadius - 30) * sin(angle),
    );
  }

  // Draw inner geometric pattern with small circles
  fill(rose);
  noStroke();
  for (let i = 0; i < numberOfPoints / 2; i++) {
    const angle = (TWO_PI / (numberOfPoints / 2)) * i;
    circle(25 * cos(angle), 25 * sin(angle), 8);
  }

  // Draw center circle
  fill(rose);
  noStroke();
  circle(0, 0, 15);

  pop();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
