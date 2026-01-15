// Randomizers

function rand(min, max, inclusive=true) {
  const range = max + inclusive - min;
  return Math.floor(min + Math.random() * range);
}

// range of random number generation
let difficulty = {
  min: 1,
  max: 10,
};

function randWithDifficulty() {
  return rand(difficulty.min, difficulty.max);
}

function randFrac() {
  return {
    num: randWithDifficulty(),
    den: randWithDifficulty(),
  };
}

// Countdown logic

const countdownEl = document.getElementById('countdown');
let countdown = 0;
let interval;

function updateCountdown() {
  countdown = Math.max(1, countdown);
  countdownEl.innerText = `+ ${countdown} if answered correctly`;
}

function tick() {
  countdown--;
  updateCountdown();
}

function resetCountdown() {
  countdown = 10;
  updateCountdown();
  clearInterval(interval);
  interval = setInterval(tick, 1000);
}

// Score logic

const scoreEl = document.getElementById('score');
let score = 0;

function updateScore() {
  const plural = score === 1 ? '' : 's';
  scoreEl.innerText = `${score} Point${plural}`;
}

// Problem logic

let checkAnswer;

const DIVIDE = 0;
const SIMPLIFY = 1;
const OPERATE = 2;

let problemEl = document.getElementById('problem');

// TODO: initialize problem kind based on radio buttons
let problemKind = DIVIDE;

function newProblem() {
  // call the corresponding function based on type
  problemEl.outerHTML = [
    renderDivide,
    renderSimplify,
    renderOperate,
  ][problemKind]();
  problemEl = document.getElementById('problem');

  // focus first input
  document.getElementsByTagName('input')[0].focus();
  score += countdown;
  updateScore();
  resetCountdown();
}
newProblem();

function renderDivide() {
  const quo = randWithDifficulty();
  const den = randWithDifficulty();
  const num = quo * den;

  checkAnswer = () => document.getElementById('quotient').value == quo;

  return `
    <div id="problem" class="division bubble">
      <div class="slot fraction">
        <h2 class="numerator">${num}</h2>
        <div class="bar"></div>
        <h2 class="denominator">${den}</h2>
      </div>

      <h1 class="slot operation">=</h1>

      <input id="quotient" type="text" class="whole slot" />
    </div>
  `;
}

function renderSimplify() {
  alert('todo');
  let quo = randWithDifficulty();
  let den = randWithDifficulty();
  const factor = rand(1, 3);
}

function renderOperate() {
  alert('todo');
}

function flashRed(el) {
  el.classList.remove('flash-green');
  el.classList.add('flash-red');

  // restart animations
  el.getAnimations().forEach(anim => {
    anim.cancel();
    anim.play();
  });
}

function flashGreen(el) {
  el.classList.remove('flash-red');
  el.classList.add('flash-green');
}

function enter() {
  if (checkAnswer()) {
    newProblem();
    flashGreen(problemEl);
  } else {
    flashRed(problemEl);
    countdown--;
    updateCountdown();
    flashRed(countdownEl);
  }
}

document.onkeydown = e => {
  if (e.key === 'Enter' || e.key === ' ') enter();
};

