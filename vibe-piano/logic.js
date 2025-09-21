// JavaScript code for the digital piano functionality

// Constants to handle keybinds and store key data
const KEYS_PER_OCTAVE = 12;
const WHITE_KEYS_PER_OCTAVE = 7;
const BASE_NOTE_SEMITONE = KEYS_PER_OCTAVE * 3;
let semitoneIndexToKeyMap;
let keyMapName;

let mode = -1;
let modes = [
  {
    name: "Piano",
    keymap: "q2w3er5t6y7ui9o0pzsxdcfvbhnjm,l.;/'".split("").concat(["shift"]),
  },
  {
    name: "Grid",
    keymap: "1qaz2wsx3edc4rfv5tgb6yhn7ujm8ik,9ol.0p;/-['"
      .split("")
      .concat(["shift"]),
  },
];

function cycleMode() {
  mode++;
  mode %= modes.length;
  semitoneIndexToKeyMap = modes[mode].keymap;
  keyMapName = modes[mode].name;
  initKeyMap();
  preloadAudio();
  createPianoKeys();
}

// semitoneIndexToKeyMap.push("Shift");
let semitoneToKeyMap = {};
let keyToSemitoneMap = {};

// Fills up the other maps and arrays. Called at the end of the file.
function initKeyMap() {
  semitoneToKeyMap = {};
  keyToSemitoneMap = {};
  for (let i = 0; i < semitoneIndexToKeyMap.length; i++) {
    const semitone = i + BASE_NOTE_SEMITONE;
    const char = semitoneIndexToKeyMap[i];
    const keyData = getKeyData(semitone, char);
    semitoneToKeyMap[semitone] = keyData;
    keyToSemitoneMap[char] = semitone;
  }
}

// The note names for the 12 chromatic semitones, starting from C.
const semitoneToNoteName = [
  "C",
  "Db",
  "D",
  "Eb",
  "E",
  "F",
  "Gb",
  "G",
  "Ab",
  "A",
  "Bb",
  "B",
];

// An array to quickly determine the number of white keys that are to the left of this note.
const whiteKeyIndices = [0, null, 1, null, 2, 3, null, 4, null, 5, null, 6];

/**
 * Function to generate data for a single key based on semitone value
 * @param {number} semitone
 * @param {string} char
 * @returns {{
 *  semitone: number,
 *  char: string,
 *  note: typeof semitoneToNoteName[number],
 *  kind: "white" | "black",
 *  left: number,
 *  width: number,
 * }}
 */
function getKeyData(semitone, char) {
  // Constants for key generation
  const TOTAL_SEMITONES = semitoneIndexToKeyMap.length;
  const TOTAL_OCTAVES = TOTAL_SEMITONES / 12;
  const OCTAVE_WIDTH_PERCENT = 100 / TOTAL_OCTAVES;
  const WHITE_KEY_WIDTH_PERCENT = OCTAVE_WIDTH_PERCENT / WHITE_KEYS_PER_OCTAVE;
  const KEY_WIDTH_PERCENT = OCTAVE_WIDTH_PERCENT / KEYS_PER_OCTAVE;

  const octave = Math.floor(semitone / 12);
  const octaveNoteIndex = semitone % 12;
  const whiteKeyIndex = whiteKeyIndices[octaveNoteIndex];
  const note = `${semitoneToNoteName[octaveNoteIndex]}${octave}`;
  const offset =
    (octave * KEYS_PER_OCTAVE - BASE_NOTE_SEMITONE) * KEY_WIDTH_PERCENT;

  if (whiteKeyIndex !== null) {
    return {
      semitone,
      char,
      note,
      kind: "white",
      left: offset + whiteKeyIndex * WHITE_KEY_WIDTH_PERCENT,
      width: WHITE_KEY_WIDTH_PERCENT,
    };
  } else {
    return {
      semitone,
      char,
      note,
      kind: "black",
      left: offset + octaveNoteIndex * KEY_WIDTH_PERCENT,
      width: KEY_WIDTH_PERCENT,
    };
  }
}
