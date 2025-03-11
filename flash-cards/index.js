// @ts-check

// ===================================================
// HTML ELEMENTS
// ===================================================

const add_questions_box =
  /** @type {HTMLTextAreaElement} */
  (document.getElementById("add_questions_box"));

const question_box =
  /** @type {HTMLTextAreaElement} */
  (document.getElementById("question_box"));

const score_msg =
  /** @type {HTMLHeadingElement} */
  (document.getElementById("score_msg"));

const answer_box =
  /** @type {HTMLInputElement} */
  (document.getElementById("answer_box"));

const answer_msg =
  /** @type {HTMLHeadingElement} */
  (document.getElementById("answer_msg"));

const restart_button =
  /** @type {HTMLButtonElement} */
  (document.getElementById("restart_button"));

// ===================================================
// FUNCTIONS
// ===================================================

/**
 * @param {number} n
 * @returns {number}
 */
function rand(n) {
  return Math.random() * n;
}

/**
 * @param {number} n
 * @returns {number}
 */
function rand_int(n) {
  return Math.floor(rand(n));
}

/**
 * Shuffles an array in-place.
 * @template T
 * @param {T[]} arr
 */
function shuffle(arr) {
  for (let i = 0; i < arr.length; i++) {
    let choice = i + rand_int(arr.length - i);
    [arr[i], arr[choice]] = [arr[choice], arr[i]];
  }
}

// ===================================================
// CLASSES
// ===================================================

class Question {
  /** @type {string} */
  question;

  /** @type {string[]} */
  answers;

  /** @type {number} */
  correct;

  /** @type {number} */
  wrong;

  /**
   * @param {string} q
   * @param {string[]} a
   * @param {number} c
   * @param {number} w
   */
  constructor(q, a, c, w) {
    this.question = q;
    this.answers = a;
    this.correct = c;
    this.wrong = w;
  }

  /**
   * @returns {number}
   */
  weight() {
    const diff = this.wrong - this.correct;
    const sum = this.wrong + this.correct;
    const score = ((diff + 1) * 10) / (sum + 1);
    return Math.max(1.0, score);
  }
}

class Questions {
  static REGEX_FOR_SCORE = /\+(\d+) -(\d+)/;

  /** @type {Question[]} */
  question_list;

  /**
   * @param {Question[]} questions
   */
  constructor(questions) {
    this.question_list = questions;
  }

  /**
   * @param {string} text
   * @returns {Questions}
   */
  static from_text(text) {
    const out = [];

    let question = "";
    let answers = [];
    let correct = 0;
    let wrong = 0;
    for (const line of text.split(/\n/)) {
      if (line.trim().length === 0 || line.startsWith("#")) {
        if (answers.length > 0) {
          out.push(new Question(question.trimEnd(), answers, correct, wrong));
          question = "";
          answers = [];
          correct = 0;
          wrong = 0;
        }
        continue;
      }

      let score = line.match(this.REGEX_FOR_SCORE);
      if (score !== null) {
        correct = parseInt(score[1]);
        wrong = parseInt(score[2]);
        continue;
      }

      if (line.startsWith("-")) {
        answers.push(line.slice(2));
        continue;
      }
      question += line + "\n";
    }

    return new Questions(out);
  }

  /**
   * @returns {string}
   */
  to_text() {
    let out = "";
    for (const { question, answers, correct, wrong } of this.question_list) {
      out += `${question}\n+${correct} -${wrong}\n`;
      for (const answer of answers) {
        out += `- ${answer}\n`;
      }
      out += "\n";
    }
    return out;
  }

  shuffle() {
    shuffle(this.question_list);
  }

  /**
   * @param {Questions} other
   * @returns {number} How many questions were added/changed.
   */
  merge(other) {
    let changed = 0;
    for (const item of other.question_list) {
      const existing = this.question_list.find(
        (existing) => existing.question === item.question
      );
      if (existing === undefined) {
        this.question_list.push(item);
        changed++;
        continue;
      }

      let is_changed = false;

      if (existing.correct !== item.correct) {
        existing.correct = item.correct;
        is_changed = true;
      }
      if (existing.wrong !== item.wrong) {
        existing.wrong = item.wrong;
        is_changed = true;
      }
      if (existing.answer !== item.answer) {
        console.log(
          `UPDATED ANSWER:\n${item.question}\nX ${existing.answer}\n/ ${item.answer}`
        );
        existing.answer = item.answer;
        is_changed = true;
      }

      if (is_changed) {
        changed++;
      }
    }
    return changed;
  }
}

class Game {
  /** @type {number} */
  cur_max_question_index;

  /** @type {number} */
  cur_question_index;

  constructor() {
    this.reset();
  }

  /**
   * @returns {Question[]}
   */
  available_questions() {
    return questions.question_list.slice(0, this.cur_max_question_index);
  }

  /**
   * @returns {Question}
   */
  current_question() {
    return questions.question_list[this.cur_question_index];
  }

  /**
   * @returns {{
   *   weights: number[],
   *   sum: number,
   * }}
   */
  weights() {
    const weights = this.available_questions().map((q) => q.weight());
    return {
      weights,
      sum: weights.reduce((a, b) => a + b),
    };
  }

  /**
   * @returns {boolean}
   */
  can_move_on() {
    for (const question of this.available_questions()) {
      if (question.wrong > question.correct) {
        return false;
      }
      if (question.correct === 0) {
        return false;
      }
    }
    return true;
  }

  reset() {
    this.cur_question_index = 0;
    this.cur_max_question_index = 1;
    questions.shuffle();
  }

  /**
   * @param {string} guess
   * @returns {boolean}
   */
  check(guess) {
    const question = questions.question_list[this.cur_question_index];
    const is_correct = question.answer === guess;
    if (is_correct) {
      question.correct++;
      if (
        this.can_move_on() &&
        this.cur_max_question_index < questions.question_list.length
      ) {
        this.cur_max_question_index++;
      }
    } else {
      // HACK: check caps here
      if (question.answer === guess.toUpperCase()) {
        alert("Don't forget CAPS LOCK!");
      }
      question.wrong++;
    }

    return is_correct;
  }

  /**
   * @returns {Question}
   */
  next() {
    const { weights, sum } = this.weights();

    let choice = rand(sum);
    for (let i = 0; i < weights.length; i++) {
      choice -= weights[i];
      if (choice < 0.0) {
        this.cur_question_index = i;
        break;
      }
    }

    return questions.question_list[this.cur_question_index];
  }
}

// ===================================================
// GLOBAL VARIABLES
// ===================================================

let questions = Questions.from_text(`
What is the atomic number of oxygen?
- 8
- EIGHT

What is the smallest prime number?
- 2
- TWO

What is the SI unit for electric current?
- AMPERE

What is the hardest naturally occurring mineral on Earth? 
- DIAMOND

In what sport would you perform a slam dunk?
- BASKETBALL

What is the economic term for a prolonged period of high unemployment and low economic activity?
- RECESSION
`);

let game = new Game();

// ===================================================
// HTML ELEMENT FUNCTIONS
// ===================================================

function register_questions() {
  const new_questions = Questions.from_text(add_questions_box.value);
  const changed = questions.merge(new_questions);

  let message = "No questions added/changed.";
  if (changed > 0) {
    message = `Added/Changed ${changed} question${changed === 1 ? "" : "s"}.`;
  }
  add_questions_box.value = `# ${message}`;
}

function view_questions() {
  add_questions_box.value = questions.to_text();
}

function next_question() {
  question_box.value = game.next().question;
  answer_box.value = "";
  update_score();
}

/**
 * @param {KeyboardEvent} e
 */
function input_answer_on_enter(e) {
  if (e.key !== "Enter") {
    return;
  }
  input_answer();
}

function input_answer() {
  const is_correct = game.check(answer_box.value);
  if (is_correct) {
    answer_msg.innerText = "Answer: Correct :)";
  } else {
    answer_msg.innerText = `Answer: ${
      game.current_question().answers[0]
    } Incorrect :(`;
  }
  next_question();
}

function restart() {
  game.reset();
  restart_button.innerText = "Restart Game";
  add_questions_box.value = "# Add more questions here :)";
  next_question();
}

function update_score() {
  let correct = 0;
  let wrong = 0;
  for (const question of questions.question_list) {
    correct += question.correct;
    wrong += question.wrong;
  }
  score_msg.innerText = `Correct: ${correct}, Wrong: ${wrong}`;
}

// ===================================================
// MAIN
// ===================================================
view_questions();
