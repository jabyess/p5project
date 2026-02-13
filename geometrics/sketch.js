let hexagons = [];
let mandalas = [];
const sideLength = 100;
const hexSpacingX = sideLength * 3; // horizontal spacing between hexagon centers
const hexSpacingY = sideLength * 0.866; // vertical spacing between rows (sqrt(3)/2)

function setup() {
  let addHexButton = createButton("Add Hexagon");
  addHexButton.mousePressed(addHexagon);
  
  let removeHexButton = createButton("Remove Hexagon");
  removeHexButton.mousePressed(removeHexagon);
  
  let addMandalaButton = createButton("Add Mandala");
  addMandalaButton.mousePressed(addMandala);
  
  let removeMandalaButton = createButton("Remove Mandala");
  removeMandalaButton.mousePressed(removeMandala);
  
  createCanvas(800, 600);
}

function draw() {
  background(220);
  
  // Draw all hexagons
  hexagons.forEach(hexagon => {
    drawHexagon(hexagon.x, hexagon.y);
  });
  
  // Draw all mandalas
  mandalas.forEach(mandala => {
    drawMandala(mandala.x, mandala.y);
  });
}

function addHexagon() {
  // Calculate grid position for honeycomb arrangement
  const row = Math.floor(hexagons.length / 3);
  const col = hexagons.length % 3;
  
  // Honeycomb pattern with proper spacing
  const x = 50 + col * hexSpacingX + (row % 2) * hexSpacingX / 2;
  const y = 50 + row * hexSpacingY;
  
  hexagons.push({ x, y });
}

function removeHexagon() {
  if (hexagons.length > 0) {
    hexagons.pop();
  }
}

function addMandala() {
  // Calculate grid position for mandala arrangement
  const row = Math.floor(mandalas.length / 2);
  const col = mandalas.length % 2;
  
  // Space mandalas horizontally and vertically
  const x = 150 + col * 400;
  const y = 150 + row * 300;
  
  mandalas.push({ x, y });
}

function removeMandala() {
  if (mandalas.length > 0) {
    mandalas.pop();
  }
}

function drawHexagon(centerX, centerY) {
  beginShape();
  stroke(0);
  strokeWeight(2);
  fill(200, 150, 255);
  
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
  
  // Draw concentric circles
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
