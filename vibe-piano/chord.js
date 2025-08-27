// Map semitone numbers to note names (C=0)
const NOTE_NAMES = [
  ["C"],
  ["C#", "Db"],
  ["D"],
  ["D#", "Eb"],
  ["E"],
  ["F"],
  ["F#", "Gb"],
  ["G"],
  ["G#", "Ab"],
  ["A"],
  ["A#", "Bb"],
  ["B"],
];

// Common chord formulas (intervals from root)
const CHORD_FORMULAS = {
  major: [0, 4, 7],
  minor: [0, 3, 7],
  diminished: [0, 3, 6],
  augmented: [0, 4, 8],
  major7: [0, 4, 7, 11],
  minor7: [0, 3, 7, 10],
  dominant7: [0, 4, 7, 10],
  diminished7: [0, 3, 6, 9],
  halfdiminished7: [0, 3, 6, 10],
};

function identifyChords(semitones) {
  let results = [];
  let set = new Set(semitones.map((n) => n % 12));

  // Try each note as potential root
  for (let root = 0; root < 12; root++) {
    for (let [name, formula] of Object.entries(CHORD_FORMULAS)) {
      let expected = new Set(formula.map((interval) => (root + interval) % 12));
      if (
        [...expected].every((note) => set.has(note)) &&
        set.size === expected.size
      ) {
        // Found a matching chord
        for (let noteName of NOTE_NAMES[root]) {
          results.push(noteName + " " + name);
        }
      }
    }
  }

  return results.length ? results.join("/") : ["Unknown chord"];
}

function liveIdentifyChords(semitones) {
  document.getElementById('chord-name').innerText = identifyChords(semitones);
}
