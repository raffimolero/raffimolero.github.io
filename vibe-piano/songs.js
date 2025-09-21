// Define the song as a single array of objects, where each object contains
// the note's semitone and its duration in milliseconds.
const happyBirthdaySong = [
  // "Happy"
  { semitone: 0, duration: 250 }, // C4
  { semitone: 0, duration: 250 }, // C4
  // "birth-day"
  { semitone: 2, duration: 500 }, // D4
  { semitone: 0, duration: 500 }, // C4
  { semitone: 5, duration: 500 }, // F4
  { semitone: 4, duration: 1000 }, // E4
  // "to"
  { semitone: 0, duration: 250 }, // C4
  { semitone: 0, duration: 250 }, // C4
  // "you"
  { semitone: 2, duration: 500 }, // D4
  { semitone: 0, duration: 500 }, // C4
  { semitone: 7, duration: 500 }, // G4
  { semitone: 5, duration: 1000 }, // F4
  // "Happy"
  { semitone: 0, duration: 250 }, // C4
  { semitone: 0, duration: 250 }, // C4
  // "birth-day"
  { semitone: 12, duration: 500 }, // C5
  { semitone: 9, duration: 500 }, // A4
  { semitone: 5, duration: 500 }, // F4
  { semitone: 4, duration: 500 }, // E4
  { semitone: 2, duration: 500 }, // D4
  // "to"
  { semitone: 10, duration: 250 }, // Bb4
  { semitone: 10, duration: 250 }, // Bb4
  // "you"
  { semitone: 9, duration: 500 }, // A4
  { semitone: 5, duration: 500 }, // F4
  { semitone: 7, duration: 500 }, // G4
  { semitone: 5, duration: 1000 }, // F4
].map((note) => ({
  semitone: note.semitone + KEYS_PER_OCTAVE * 3,
  duration: note.duration,
}));

const noteNameToSemitone = {
  C: 0,
  "C#": 1,
  D: 2,
  "D#": 3,
  E: 4,
  F: 5,
  "F#": 6,
  G: 7,
  "G#": 8,
  A: 9,
  "A#": 10,
  B: 11,
};

/**
 *
 * @param {{
 *  bpm: number,
 *  pitch: number,
 *  midi: string,
 * }} data
 * @returns {{
 *  start: number,
 *  semitone: number,
 *  duration: number,
 *  instrument: number,
 * }[]}
 */
function parseOnlineSequencerMidi(data) {
  const MS_PER_SECOND = 1000;
  const SECONDS_PER_MINUTE = 60;
  const TICKS_PER_BEAT = 4;
  const msPerTick =
    (MS_PER_SECOND * SECONDS_PER_MINUTE) / (TICKS_PER_BEAT * data.bpm);
  const parseNote = (noteText) => {
    const parts = noteText.split(" ");
    const match = /([A-G]#?)(\d+)/.exec(parts[1]);
    let start = parseFloat(parts[0]) * msPerTick;
    let duration = parseFloat(parts[2]) * msPerTick;
    const noteSemitone = noteNameToSemitone[match[1]];
    const noteOctave = parseInt(match[2]);
    let semitone = noteOctave * 12 + noteSemitone + data.pitch;
    const instrument = parseInt(parts[3]);

    const XYLOPHONE = 19;
    const BASS = 5;
    const PIANO = 43;
    if (instrument === XYLOPHONE) {
      semitone += 12;
      duration *= 4;
    } else if (instrument === BASS) {
      semitone += 12;
      duration *= 4;
    } else if (instrument === PIANO) {
      return null;
    } else {
      return null;
    }

    return {
      start,
      semitone,
      duration,
      instrument,
    };
  };
  const midi = data.midi.split(":")[2];
  return midi
    .substring(0, midi.length - 1)
    .split(";")
    .map(parseNote);
}

const spiral = parseOnlineSequencerMidi({
  bpm: 200,
  pitch: -24,
  // midi: "6 F#4 1 5;44 B4 1 5;48 A#4 1 5;52 F4 1 5;56 G#4 1 5;60 D4 1 5;2 A#4 1 5;0 D#4 1 5;16 D4 1 5;38 A#4 1 5;18 F4 1 5;64 F#4 1 5;76 D#4 1 5;74 G#4 1 5;86 G#4 1 5;90 F#4 1 5;92 F4 1 5;96 F4 1 5;8 F4 1 5;24 D4 1 5;26 D#4 1 5;22 D#4 1 5;70 F4 1 5;4 A#3 1 5;20 A4 1 5;80 A#4 1 5;36 D#4 1 5;32 F#4 1 5;30 G#4 1 5;28 F4 1 5"
  // + ";48 G#3 8 43;56 F3 8 43;46 A#3 2 43;64 F#3 6 43;70 F3 6 43;76 D#3 4 43;80 B3 6 43;86 A#3 6 43;92 G#3 4 43;96 A#3 8 43;120 D#4 8 43;104 G#3 4 43;108 A#3 4 43;32 F#3 4 43;24 F3 8 43;16 D3 8 43;12 A#2 4 43;0 D#3 12 43;36 A#2 2 43;44 G#3 2 43;112 D4 8 43;38 A#3 6 43",
  midi: "Online Sequencer:621457:10 F#4 1 5;48 B4 1 5;52 A#4 1 5;56 F4 1 5;60 G#4 1 5;64 D4 1 5;52 G#3 8 43;60 F3 8 43;50 A#3 2 43;6 A#4 1 5;4 D#4 1 5;20 D4 1 5;42 A#4 1 5;22 F4 1 5;40 D#4 2 45;44 D#4 4 45;48 F4 2 45;50 E4 2 45;52 F4 4 45;56 A#4 4 45;60 G#4 4 45;64 B4 4 45;260 B6 1 46 3.3999998569488525;260 F#7 1 46 3.3999998569488525;68 F#3 6 43;74 F3 6 43;80 D#3 4 43;84 B3 6 43;90 A#3 6 43;96 G#3 4 43;100 A#3 8 43;124 D#4 8 43;108 G#3 4 43;112 A#3 4 43;68 F#4 1 5;80 D#4 1 5;78 G#4 1 5;90 G#4 1 5;94 F#4 1 5;96 F4 1 5;100 F4 1 5;212 B2 12 43;226 B2 2 43;228 A#2 28 43;252 C#4 4 43;248 A3 4 43;256 F#4 4 43;196 F#3 10 43;196 D#4 6 43;202 G#3 6 43;202 F4 6 43;208 A#3 4 43;224 F4 2 43;228 D4 24 43;228 F3 6 43;212 F#4 12 43;212 A#3 12 43;226 D#4 2 43;224 A#3 1 5;226 B3 1 5;228 A#3 1 5;256 A#2 4 43;202 G#6 4 46;206 F#6 1 46;208 F6 4 46;212 F6 16 46;220 D#6 4 46;224 G#6 4 46;234 G#6 6 46;248 A#7 11 46 0.7000000476837158;240 A#6 19 46;196 A#6 6 46;132 D#3 12 43;148 D3 8 43;144 A#2 4 43;156 F3 8 43;164 D#3 4 43;170 A#3 6 43;180 G#3 8 43;188 F3 8 43;168 B2 2 43;176 G#3 2 43;178 A#3 2 43;228 G6 6 46;68 A#4 32 45;100 F4 32 45;136 F#4 1 5;176 A#4 1 5;180 G#4 1 5;184 F4 1 5;138 A#4 1 5;134 D#4 1 5;148 D4 1 5;170 B4 1 5;168 D#4 1 5;160 F4 1 5;162 G#4 1 5;152 A4 1 5;244 A#3 1 5;202 D#4 1 5;196 F4 1 5;158 D4 1 5;236 F3 1 5;252 F4 1 5;156 A#3 1 5;192 D4 1 5;140 F4 1 5;164 F#4 1 5;154 F4 1 5;12 F4 1 5;28 D4 1 5;30 D#4 1 5;26 D#4 1 5;74 F4 1 5;28 F#6 1 19;32 B5 1 19;34 C#6 1 19;0 F#5 1 19;42 B5 1 19;44 G#6 1 19;46 F#6 1 19;48 F6 1 19;52 F6 1 19;50 D#6 1 19;56 G#5 1 19;64 A5 1 19;26 D#5 1 19;30 F6 1 19;68 A#5 1 19;74 G#5 1 19;80 D#5 1 19;84 A#5 1 19;96 B5 1 19;104 B5 1 19;108 A#5 1 19;112 B5 1 19;116 D6 1 19;100 C#6 1 19;124 F6 1 19;102 G#5 1 19;110 F5 1 19;114 G#6 1 19;90 F#5 1 19;128 D#5 1 19;144 F5 1 19;148 G#5 1 19;132 F#5 1 19;138 A#5 1 19;156 G#5 1 19;160 D6 1 19;162 D#6 1 19;164 D6 1 19;178 C#6 1 19;180 A#5 1 19;184 F5 1 19;186 F#5 1 19;188 G#5 1 19;190 B5 1 19;192 F#6 1 19;194 C#7 1 19;194 A#6 1 19;188 F5 1 19;192 D6 1 19;236 F#6 1 19;244 F6 1 19;252 D6 1 19;197 G#6 1 19 0.4000000059604645;199 G#6 1 19 0.4000000059604645;201 G#6 1 19 0.4000000059604645;213 C#7 1 19 0.4000000059604645;215 C#7 1 19 0.4000000059604645;203 G#6 1 19 0.4000000059604645;205 F#6 1 19 0.4000000059604645;207 F#6 1 19 0.4000000059604645;209 F#6 1 19 0.4000000059604645;217 B6 1 19 0.4000000059604645;221 A#6 1 19 0.4000000059604645;223 G#6 1 19 0.4000000059604645;225 F#6 1 19 0.4000000059604645;227 D#6 1 19 0.4000000059604645;236 A5 1 19;228 B5 1 19;196 A#6 1 19;198 B6 1 19;200 A#6 1 19;202 B6 1 19;204 A#6 1 19;206 C#7 1 19;210 F7 1 19;212 D#7 1 19;214 F7 1 19;216 D#7 1 19;218 D7 1 19;220 D#7 1 19;222 C#7 1 19;224 B6 1 19;226 A#6 1 19;228 G#6 1 19;176 F5 1 19;174 F#5 1 19;182 G#5 1 19;183 F#5 1 19;172 A#4 1 19;16 G#5 1 19;27 F#5 1 19;195 D#7 1 19;193 C#6 1 19;193 F6 1 19;191 D5 1 19;189 F5 1 19;155 F#5 1 19;43 D#6 1 19;170 B4 1 19;171 C#5 1 19;60 A#5 1 19;62 F#5 1 19;66 F5 1 19;8 A#3 1 5;10 A#4 1 19;4 D#5 1 19;20 F5 1 19;24 A4 1 5;36 A#5 1 19;54 D6 1 19;58 B5 1 19;106 F#5 1 19;154 D5 1 19;158 A#5 1 19;189 D5 1 19;190 F#5 1 19;191 F5 1 19;195 B6 1 19;208 A#6 1 19;211 A#6 1 19 0.4000000059604645;219 B6 1 19 0.4000000059604645;244 F#5 1 19;260 G#6 1 19;260 D#6 1 19;260 G#5 1 19;240 G#3 8 43;234 D3 22 43;236 F3 20 43;224 A#2 2 43;226 G#3 2 43;224 A3 2 43;208 F#4 4 43;206 F3 6 43;36 F#3 4 43;28 F3 8 43;20 D3 8 43;16 A#2 4 43;4 D#3 12 43;208 B3 1 5;188 F#4 1 5;150 F4 1 5;132 A#3 1 5;84 A#4 1 5;40 D#4 1 5;36 F#4 1 5;34 G#4 1 5;32 F4 1 5;40 A#2 2 43;48 G#3 2 43;196 A#4 32 45;228 D5 32 45;260 D#5 1 19;252 D5 1 19;116 D4 8 43;42 A#3 6 43;42 D4 2 45;:",
});

/**
 * Plays the song by sequentially triggering notes with appropriate delays.
 */
function playSong() {
  const statusMessage = document.getElementById("statusMessage");
  const playButton = document.getElementById("playSongButton");

  const [song, songName] =
    dbg(Math.random()) > 0.2
      ? [happyBirthdaySong, "Happy Birthday"]
      : [spiral, "Spiral"];
  if (songName === "Spiral" && modes[mode].name !== "Grid") {
    cycleMode();
  }
  playButton.disabled = true;
  statusMessage.textContent = `Playing "${songName}"...`;

  let delay = 0;
  song.forEach((noteData) => {
    if (noteData === null) {
      return;
    }
    let semitone = noteData.semitone;
    noteData.start = noteData.start ?? delay;

    for (let i = 0; i < 5 && semitoneToKeyMap[semitone] === undefined; i++) {
      if (semitone < BASE_NOTE_SEMITONE) semitone += 12;
      else semitone -= 12;
    }

    setTimeout(() => playNote(semitone), noteData.start);
    delay = noteData.start + noteData.duration;
    setTimeout(() => stopNote(semitone), delay);
  });

  // Re-enable the button and clear the message when the song is finished
  setTimeout(() => {
    playButton.disabled = false;
    statusMessage.textContent = "";
  }, delay + 500); // Add a small buffer after the song
}

function highlightNote(semitone) {
  // Visual feedback
  document
    .querySelectorAll(`[data-semitone="${semitone}"]`)
    .forEach((el) => el.classList.add("active"));
}

function unhighlightNote(semitone) {
  // Visual feedback
  document
    .querySelectorAll(`[data-semitone="${semitone}"]`)
    .forEach((el) => el.classList.remove("active"));
}
