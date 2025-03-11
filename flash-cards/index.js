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

const answer_box =
  /** @type {HTMLInputElement} */
  (document.getElementById("answer_box"));

// ===================================================
// CLASSES
// ===================================================

class Question {
  /** @type {string} */
  question;

  /** @type {string} */
  answer;

  /** @type {number} */
  correct;

  /** @type {number} */
  wrong;

  /**
   * @param {string} q
   * @param {string} a
   */
  constructor(q, a) {
    this.question = q;
    this.answer = a;
    this.correct = 0;
    this.wrong = 0;
  }

  /**
   * @returns {number}
   */
  weight() {
    return Math.max(1, this.wrong - this.correct);
  }
}

class Questions {
  /** @type {Question[]} */
  questions;

  /**
   * @param {Question[]} questions
   */
  constructor(questions) {
    this.questions = questions;
  }

  /**
   * @param {string} text
   * @returns {Questions}
   */
  static from_text(text) {
    const out = [];

    let q = "";
    for (const line of text.split(/\n+/)) {
      if (line.trim().length === 0 || line.startsWith("#")) {
        continue;
      }

      if (line.startsWith("-")) {
        out.push(new Question(q.trimEnd(), line.slice(2)));
        q = "";
        continue;
      }
      q += line + "\n";
    }

    return new Questions(out);
  }

  /**
   * @returns {string}
   */
  to_text() {
    let out = "";
    for (const { question: q, answer: a } of this.questions) {
      out += `${q}\n- ${a}\n\n`;
    }
    return out;
  }

  /**
   * @param {Questions} other
   * @returns {number} How many questions were added/changed.
   */
  merge(other) {
    let changed = 0;
    for (const item of other.questions) {
      const existing = this.questions.find(
        (existing) => existing.question === item.question
      );
      if (existing === undefined) {
        this.questions.push(item);
        changed++;
        continue;
      }
      if (existing.answer === item.answer) {
        continue;
      }
      console.log(
        `UPDATED ANSWER:\n${item.question}\nX ${existing.answer}\n/ ${item.answer}`
      );
      existing.answer = item.answer;
      changed++;
    }
    return changed;
  }
}

// ===================================================
// GLOBAL VARIABLES
// ===================================================

let questions = Questions.from_text(`
Who was the first Democrat U.S. President?
- ANDREW JACKSON
Which country has the largest oil reserves?
- VENEZUELA
`);

// ===================================================
// FUNCTIONS
// ===================================================

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

/**
 * @param {KeyboardEvent} e
 */
function input_answer(e) {
  if (e.key === "Enter") {
    alert(answer_box.value);
  }
}

// ===================================================
// MAIN
// ===================================================
view_questions();
