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
];

/**
 * Plays the song by sequentially triggering notes with appropriate delays.
 */
function playSong() {
  const statusMessage = document.getElementById("statusMessage");
  const playButton = document.getElementById("playSongButton");

  playButton.disabled = true;
  statusMessage.textContent = 'Playing "Happy Birthday"...';

  let delay = 0;
  happyBirthdaySong.forEach((noteData) => {
    const semitone = noteData.semitone + KEYS_PER_OCTAVE * 3;
    setTimeout(() => playNote(semitone), delay);
    delay += noteData.duration;
    setTimeout(() => stopNote(semitone), delay);
  });

  // Re-enable the button and clear the message when the song is finished
  setTimeout(() => {
    playButton.disabled = false;
    statusMessage.textContent = "";
  }, delay + 500); // Add a small buffer after the song
}
