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
  q;

  /** @type {string} */
  a;

  /**
   * @param {string} q
   * @param {string} a
   */
  constructor(q, a) {
    this.q = q;
    this.a = a;
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
      console.log(line);
      if (line.startsWith("-")) {
        out.push({
          q: q.trimEnd(),
          a: line.slice(2),
        });
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
    for (const { q, a } of this.questions) {
      out += `${q}\n- ${a}\n\n`;
    }
    return out;
  }

  /**
   * @param {Questions} other
   */
  merge(other) {
    for (const item of other.questions) {
      const existing = this.questions.find((existing) => existing.q === item.q);
      if (existing !== undefined) {
        if (existing.a === item.a) {
          continue;
        } else {
          console.log(
            `UPDATED ANSWER:\n${item.q}\nX ${existing.a}\n/ ${item.a}`
          );
        }
        continue;
      }

      this.questions.push(item);
    }
  }
}

// ===================================================
// GLOBAL VARIABLES
// ===================================================

let questions = new Questions([
  {
    q: "Who was the first Democrat U.S. President?",
    a: "ANDREW JACKSON",
  },
  {
    q: "Which country has the largest oil reserves?",
    a: "VENEZUELA",
  },
]);

// ===================================================
// FUNCTIONS
// ===================================================

// ===================================================
// HTML ELEMENT FUNCTIONS
// ===================================================

/**
 * @param {MouseEvent} e
 */
function register_questions(e) {
  const new_questions = Questions.from_text(add_questions_box.value);
  questions.merge(new_questions);

  alert("Added new questions.");
  add_questions_box.value = "";
}

/**
 * @param {MouseEvent} e
 */
function view_questions(e) {
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
