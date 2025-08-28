// Web Audio API setup
const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const audioBufferCache = {};
const baseUrl =
  "https://raw.githubusercontent.com/fuhton/piano-mp3/master/piano-mp3/";

// Keep active sources and their gain nodes
const activeVoices = {};

// Release envelope in seconds
const RELEASE = 0.3;

async function loadKeyNote(note) {
  if (audioBufferCache[note] !== undefined) {
    return;
  }
  try {
    const response = await fetch(baseUrl + note + ".mp3");
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    audioBufferCache[note] = audioBuffer;
    console.log(`Loaded: ${note}`);
  } catch (e) {
    return console.error(
      `Failed to load and decode audio for note: ${note}`,
      e
    );
  }
}

// Function to pre-load and decode audio files into AudioBuffers
async function preloadAudio() {
  console.log("Pre-loading audio files...");
  const promises = [0,1,2,3,4,5,6,7].flatMap(octave => semitoneToNoteName.map(note => loadKeyNote(`${note}${octave}`)));

  try {
    await Promise.allSettled(promises);
    console.log("Audio pre-loading complete.");
  } catch (e) {
    console.error("Some audio files failed to load.");
  }
}

function playNote(semitone) {
  const keyData = semitoneToKeyMap[semitone];
  if (!keyData) return;

  const note = keyData.note;
  const audioBuffer = audioBufferCache[note];
  if (!audioBuffer) return;

  // Retrigger if already playing
  if (activeVoices[semitone]) stopNote(semitone);

  // Create source + gain node
  const source = audioContext.createBufferSource();
  source.buffer = audioBuffer;

  const gainNode = audioContext.createGain();
  gainNode.gain.setValueAtTime(1, audioContext.currentTime); // full volume

  source.connect(gainNode);
  gainNode.connect(audioContext.destination);

  source.start();

  activeVoices[semitone] = { source, gainNode };
  liveIdentifyChords(Object.keys(activeVoices));

  // Visual feedback
  document
    .querySelectorAll(`[data-semitone="${semitone}"]`)
    .forEach((el) => el.classList.add("active"));
}

function stopNote(semitone) {
  const voice = activeVoices[semitone];
  if (!voice) return;

  const { source, gainNode } = voice;
  const now = audioContext.currentTime;

  gainNode.gain.cancelScheduledValues(now);
  gainNode.gain.setValueAtTime(gainNode.gain.value, now); // current level
  gainNode.gain.linearRampToValueAtTime(0, now + RELEASE);

  // Stop source after release finishes
  source.stop(now + RELEASE);

  delete activeVoices[semitone];
  liveIdentifyChords(Object.keys(activeVoices));

  // Remove visual feedback
  document
    .querySelectorAll(`[data-semitone="${semitone}"]`)
    .forEach((el) => el.classList.remove("active"));
}