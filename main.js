var angle = null;
var primary = null;
var secondary = null;

var ticks = null;
var scale = null;
var distance = null;

const DIRECTIONS = ['North', 'West', 'South', 'East'];

const message = document.getElementById('message');
const scaling = document.getElementById('scaling');
const canvas = document.getElementById('canvas');
const csz = canvas.width = canvas.height = 300;
const cc = csz / 2;
const ctx = canvas.getContext("2d");
const cm = canvas.width / 22;

function randInt(min, max, inclusive=true) {
  let range = max + inclusive - min;
  let randFloat = Math.random() * range + min;
  return Math.floor(randFloat);
}

/* function dbg(x) {
  console.log(x);
  return x;
} */

function clearSolution() {
  ctx.clearRect(0, 0, csz, csz);
  scaling.innerText = 'Scale: -';
  drawCartesianPlane();
}

function newProblem() {
  angle = 5 * randInt(0, 360 / 5);
  ticks = randInt(5, 10);
  scale = ticks + randInt(0, 5)
  distance = ticks * scale;
  primary = randInt(0, 4);
  secondary = primary
    ? randInt(0, 1) * 2 - 1
    : null;

  let msg = `${distance}km, ${angle} degrees`;
  if (secondary) {
    let p = DIRECTIONS[primary - 1];
    let s = DIRECTIONS[(primary + secondary + 3) % 4];
    msg += ` ${s} of ${p}`;
  }

  message.innerText = msg;
  clearSolution();
}

function drawCartesianPlane() {
  ctx.beginPath();
  ctx.moveTo(cc, 0);
  ctx.lineTo(cc, csz);
  ctx.moveTo(0, cc);
  ctx.lineTo(csz, cc);

  let tickLen = csz / 32;
  for (let i = -10; i <= 10; i++) {
    let len = i * cm + cc;
    let span = tickLen / 2;
    ctx.moveTo(len, cc - span);
    ctx.lineTo(len, cc + span);
    ctx.moveTo(cc - span, len);
    ctx.lineTo(cc + span, len);
  }
  ctx.strokeStyle = 'black';
  ctx.lineWidth = csz / 256;
  ctx.stroke();
}

function drawVec(rad) {
  const x = Math.cos(rad);
  const y = -Math.sin(rad);
  const scale = ticks * cm;
  const sz = csz / 32;
  const span = sz / 2;
  const cx = cc + x * scale;
  const cy = cc + y * scale;

  ctx.beginPath();
  ctx.moveTo(cc, cc);
  ctx.lineTo(cc + x * csz, cc + y * csz);
  ctx.strokeStyle = 'red';
  ctx.lineWidth = csz / 128;
  ctx.stroke();
  ctx.fillStyle = 'blue';
  ctx.fillRect(cx - span, cy - span, sz, sz);
}

function drawArc(len, base, rotation, color) {
  const degToRad = Math.PI / 180;
  let rad = base * degToRad;

   let rotScale = degToRad;
  if (rotation < 0) {
    rotation *= -1;
    rotScale *= -1;
  }
  const rot = rotation * rotScale;

  ctx.beginPath();
  ctx.moveTo(cc, cc);
  for (let i = 0; i < rotation; i++) {
    rad += rotScale
    const x = Math.cos(rad);
    const y = -Math.sin(rad);
    ctx.lineTo(cc + x * len, cc + y * len);
  }
  ctx.strokeStyle = color;
  ctx.lineWidth = csz / 64
  ctx.stroke();
}

function showScaling() {
  scaling.innerText = `Scale: 1cm = ${scale}km`;
}

function showSolution() {
  if (!angle) return;
  clearSolution();
  showScaling();
  const base = 90 * primary;
  const rotation = angle * (secondary ? secondary : 1);
  const arc = rotation + base;
  const rad = arc * Math.PI / 180;
  const closest = Math.round(arc / 90) * 90;
  drawArc(ticks * cm, closest, arc - closest, 'purple');
  drawArc(2 * cm, base, rotation, 'green');
  drawVec(rad);
}
