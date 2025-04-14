// @ts-check

const editorElem =
    /** @type {HTMLDivElement} */
    (document.getElementById('editor'));

/** @type {string} */
let buffer = '';

/** @type {number} */
let cursor = 0;

/** @type {Set} */
const held = new Set();


/**
 * @param {KeyboardEvent} e 
 */
function down(e) {
    e.preventDefault();
    buffer = buffer.slice(0, cursor) + e.key + buffer.slice(cursor);
    editorElem.innerText = buffer;
    cursor++;
};

document.onkeydown = down;
