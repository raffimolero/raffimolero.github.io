const PianoKey = (keyData) => {
  const isWhite = keyData.kind === "white";
  return `
    <div
      class="
        ${keyData.kind} piano key
        absolute cursor-pointer transition-all duration-100 ease-in-out rounded-lg
        ${
          isWhite
            ? "h-full bg-white border border-gray-300 z-10 shadow-[inset_0_-4px_0_rgba(0,0,0,0.1),0_2px_2px_rgba(0,0,0,0.2)] text-gray-600"
            : "h-[60%] bg-black z-20 shadow-[inset_0_-4px_0_rgba(0,0,0,0.2),0_2px_2px_rgba(0,0,0,0.3)] text-white"
        }
      "
      data-note="${keyData.note}"
      data-semitone="${keyData.semitone}"
      style="left: ${keyData.left}%; width: ${keyData.width}%"
    >
      <span class="
        absolute left-1/2 -translate-x-1/2 text-sm font-bold 
        pointer-events-none select-none
        ${isWhite ? "bottom-4 text-gray-600" : "bottom-2 text-white"}
      ">
        ${keyData.note}
      </span>
    </div>
  `;
};

// --- 🎹 UI Generation & Event Handlers ---
// UI function
const GridKey = (char) => {
  const keyData = semitoneToKeyMap[keyToSemitoneMap[char]];
  const disabled = keyData === undefined;
  const isWhite = keyData?.kind === "white";

  const baseClasses = `
    flex items-center justify-center
    transition-all duration-100 ease-in-out
    rounded-lg font-bold uppercase
  `;

  const disabledClasses = `
    bg-gray-800 text-gray-500
    border-2 border-gray-600
    cursor-not-allowed opacity-70
  `;

  const whiteKeyClasses = `
    bg-white text-gray-800
    border border-gray-300
    cursor-pointer
    shadow-[inset_0_-4px_0_rgba(0,0,0,0.1),0_2px_2px_rgba(0,0,0,0.2)]
  `;

  const blackKeyClasses = `
    bg-black text-white
    border-2 border-white
    cursor-pointer z-20
    shadow-[inset_0_-4px_0_rgba(0,0,0,0.15),0_2px_2px_rgba(0,0,0,0.25)]
  `;

  return `
    <div
      class="
        ${keyData?.kind} grid key
        ${baseClasses}
        ${disabled ? disabledClasses : isWhite ? whiteKeyClasses : blackKeyClasses}
      "
      data-semitone="${keyData?.semitone}"
    >
      <span class="pointer-events-none select-none">
        ${char}
      </span>
    </div>
  `;
};

// Function to create and append key elements dynamically.
function createPianoKeys() {
  const pianoKeys = document.getElementById("piano-keys");
  pianoKeys.innerHTML = `
    <div style="position: relative; width: 100%; height: 100%;">
      ${Object.values(semitoneToKeyMap).map(PianoKey).join("")}
    </div>
  `;

  const GRID = [
    "1234567890-".split(""),
    "qwertyuiop[".split(""),
    "asdfghjkl;'".split(""),
    "zxcvbnm,./".split("").concat("shift"),
  ];
  const gridKeys = document.getElementById("grid-keys");
  gridKeys.innerHTML = GRID.map((row) => row.map(GridKey).join("")).join("");
  gridKeys.style.gridTemplateColumns = `repeat(${GRID[0].length}, 1fr)`;
  gridKeys.style.gridTemplateRows = `repeat(${GRID.length}, 1fr)`;

  setupEventListeners();
}

// Function to set up event listeners for both keyboard and mouse
function setupEventListeners() {
  // Event listener for keyboard presses.
  document.addEventListener("keydown", (event) => {
    // Prevent continuous sound if the key is held down.
    if (event.repeat) return;
    const semitone = keyToSemitoneMap[event.key.toLowerCase()];
    if (semitone !== undefined) {
      playNote(semitone);
    }
  });

  document.addEventListener("keyup", (event) => {
    const semitone = keyToSemitoneMap[event.key.toLowerCase()];
    if (semitone !== undefined) {
      stopNote(semitone);
    }
  });

  // Event listener for mouse clicks.
  const keyElements = document.querySelectorAll(".key");
  keyElements.forEach((key) => {
    key.addEventListener("mousedown", () => {
      const semitone = parseInt(key.getAttribute("data-semitone"), 10);
      playNote(semitone);
    });
    // Add to document itself to account for mouseup outside of element
    document.addEventListener("mouseup", () => {
      const semitone = parseInt(key.getAttribute("data-semitone"), 10);
      stopNote(semitone);
    });
  });
}
