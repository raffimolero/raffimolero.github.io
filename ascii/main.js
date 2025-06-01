const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// Draw text on the canvas
ctx.font = "24px Comic Sans MS";
ctx.fillStyle = "white";
ctx.fillText("drag a picture here", 50, 60);
ctx.fillText("or click me idk", 50, 100);

const output = document.getElementById("output");
const outputColors = document.getElementById("output-colors");
const outputPreview = document.getElementById("output-preview");
const colorCountInput = document.getElementById("color-count");
const colorPickers = document.getElementById("color-pickers");

let colors = [
  { name: "black", color: hexToRgb("#3d4b8f") },
  { name: "red", color: hexToRgb("#ff3232") },
  { name: "green", color: hexToRgb("#32ff60") },
  { name: "yellow", color: hexToRgb("#ffdc30") },
  { name: "blue", color: hexToRgb("#6096ff") },
  { name: "magenta", color: hexToRgb("#9660ff") },
  { name: "cyan", color: hexToRgb("#cde6ff") },
  { name: "white", color: hexToRgb("#ffffff") },
];
let bgCol = colors[0]; // Remove first color (background)
colorCountInput.value = colors.length; // Set initial color count
function updateColorCount() {
  let count = parseInt(colorCountInput.value, 10);
  if (isNaN(count) || count < 1) {
    count = 1;
  }

  if (count < colors.length) {
    colors = colors.slice(0, count);
  } else {
    while (colors.length < count) {
      colors.push([255, 255, 255, 255]); // Default color white
    }
  }

  colorPickers.innerHTML = "";
  colors.forEach((color, index) => {
    const colorDiv = document.createElement("div");
    colorDiv.className = "hbox color-picker";

    const hex = rgbToHex(color.color.slice(0, 3)); // Convert RGB to Hex
    colorDiv.innerHTML = `
      <input class="color-input" type="color" value="${hex}" onchange="updateColor(event, ${index})">
      <input class="text-input" type="text" value="${color.name}" onkeyup="updateColorName(event, ${index})"></input>
    `;
    colorPickers.appendChild(colorDiv);
  });
  processImage(); // Reprocess image with updated colors
}
updateColorCount(); // Default to 16 colors

function changeSize() {
  const asciiWidth = document.getElementById("ascii-width").value;
  const asciiHeight = document.getElementById("ascii-height").value;

  if (asciiWidth < 1 || asciiHeight < 1) {
    alert("Width and height must be at least 1.");
    return;
  }

  output.cols = parseInt(asciiWidth) + 16;
  output.rows = parseInt(asciiHeight) + 4;
  processImage();
}
changeSize();

/**
 * Converts a hex color string to an RGB array.
 * @param {string} hex - Hex color string (e.g., "#ffffff").
 * @returns {[number, number, number]} RGB array [R, G, B].
 */
function hexToRgb(hex) {
  hex = hex.replace(/^#/, ""); // Remove #
  let r = parseInt(hex.substring(0, 2), 16);
  let g = parseInt(hex.substring(2, 4), 16);
  let b = parseInt(hex.substring(4, 6), 16);
  return [r, g, b];
}

/**
 * Converts an RGB array to a hex color string.
 * @param {number[]} rgb - RGB array [R, G, B].
 * @returns {string} Hex color string (e.g., "#ffffff").
 */
function rgbToHex(rgb) {
  return (
    "#" + rgb.map((c) => Math.floor(c).toString(16).padStart(2, "0")).join("")
  );
}

function updateColor(event, index) {
  const colorValue = event.target.value;
  const rgb = hexToRgb(colorValue);
  if (rgb.length === 3) {
    rgb.push(255); // Default alpha to 255
  }
  colors[index].color = rgb;
  processImage();
}

function updateColorName(event, index) {
  const name = event.target.value.trim();
  colors[index].name = name;
  processColorTable();
}

async function sleep(ms = 1000) {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

async function copyText(id) {
  const value = document.getElementById(id).value;
  await navigator.clipboard.writeText(value);
  const label = document.getElementById(id + "-label");
  const oldText = label.textContent;
  const copyMessage = "Copied!";
  if (oldText === copyMessage) {
    return; // Don't change the label if it was already copied
  }
  label.textContent = copyMessage;
  await sleep();
  label.textContent = oldText;
}

function handleFile(files) {
  let file = files[0];

  if (!file || !file.type.startsWith("image/")) {
    alert(`Please select a valid image file. got ${file}`);
    return;
  }

  let reader = new FileReader();
  reader.onload = function (e) {
    let img = new Image();
    img.src = e.target.result;

    img.onload = function () {
      // Set canvas size dynamically
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      // Read pixel data
      processImage();
    };
  };

  reader.readAsDataURL(file);
}

function flattenAlpha(rgba) {
  const [r, g, b, a] = rgba;
  return mixColors([r, g, b], bgCol.color, a / 255);
}

function getAverageColor(x, y, w, h) {
  const chunk = ctx.getImageData(x, y, w, h).data;
  let sum = [0, 0, 0];
  // iterate over all pixels in chunk and average them
  for (let i = 0; i < chunk.length; i += 4) {
    const rgba = chunk.slice(i, i + 4);
    const [r, g, b] = flattenAlpha(rgba);
    sum[0] += r;
    sum[1] += g;
    sum[2] += b;
  }
  return sum.map((value) => value / (chunk.length / 4));
}

/**
 * Mixes two RGB colors by averaging their values.
 * @param {number[]} rgb1 - First color [R, G, B]
 * @param {number[]} rgb2 - Second color [R, G, B]
 * @param {number} ratio - Weight of the first color (0 to 1)
 * @returns {[number, number, number]} Mixed RGB color
 */
function mixColors(rgb1, rgb2, ratio = 0.5) {
  let r = Math.round(rgb1[0] * ratio + rgb2[0] * (1 - ratio));
  let g = Math.round(rgb1[1] * ratio + rgb2[1] * (1 - ratio));
  let b = Math.round(rgb1[2] * ratio + rgb2[2] * (1 - ratio));

  return [r, g, b];
}

function posterize(rgb) {
  let closestColor = colors[1];
  let minDistance = getColorDistance(rgb, closestColor.color);
  let index = 0;
  for (let i = 2; i < colors.length; i++) {
    let distance = getColorDistance(rgb, colors[i].color);

    if (distance < minDistance) {
      minDistance = distance;
      closestColor = colors[i];
      index = i;
    }
  }
  return {
    color: closestColor,
    distance: minDistance,
    index,
  };
}

function processImage() {
  const asciiWidth = parseInt(document.getElementById("ascii-width").value);
  const asciiHeight = parseInt(document.getElementById("ascii-height").value);
  const chunkWidth = canvas.width / asciiWidth;
  const chunkHeight = canvas.height / asciiHeight;

  let asciiOutput = "";
  let previewOutput = "";
  let prevIndex = 0;
  let width = asciiWidth;
  for (let y = 0; y < asciiHeight; y++) {
    for (let x = 0; x < asciiWidth; x++) {
      const avgColor = getAverageColor(
        Math.floor(x * chunkWidth),
        Math.floor(y * chunkHeight),
        Math.floor(chunkWidth),
        Math.floor(chunkHeight)
      );
      const {
        char,
        color: { index, color },
      } = rgbToAscii(avgColor);
      let next = "";
      if (prevIndex !== index && char !== " ") {
        prevIndex = index;
        next += "$" + index + "";
      }
      next += char;
      asciiOutput += next;
      const style = `
        color: ${rgbToHex(colors[index].color)};
      `;
      previewOutput += `<span style="${style}">${
        char === " " ? "&nbsp;" : char
      }</span>`;
    }
    asciiOutput += "\n"; // New line for each row
    previewOutput += "<br>"; // New line for each row in preview
  }
  width = Math.max(...asciiOutput.split("\n").map((line) => line.length));
  height = asciiOutput.split("\n").length - 1;
  output.cols = width + 4;
  output.rows = height + 4;
  output.value = asciiOutput;
  outputPreview.innerHTML = `<p style="background-color: ${rgbToHex(
    bgCol.color
  )};">${previewOutput}</p>`;

  // update the color table
  processColorTable();
}

function processColorTable() {
  outputColors.value = colors
    .map((color, i) => `"${i + 1}": "${color.name}"`)
    .join(",\n");
  // outputPreview.style = ;
}

function rgbToAscii(rgb) {
  const [r, g, b] = rgb;
  const [h, s, v] = rgbToHsv(r, g, b, 255);
  const textGradient = " .:-=+*%@#"; // ASCII characters from dark to light
  const color = posterize([r, g, b]);
  const char = textGradient[Math.floor((v * textGradient.length) / 100)] || "#";
  return {
    char,
    color,
  };
}

function handleDrop(event) {
  event.preventDefault();

  handleFile(event.dataTransfer.files);
  event.target.classList.remove("dragging");
}

function handleDragOver(event) {
  event.preventDefault();
  event.target.classList.add("dragging");
}

function handleDragLeave(event) {
  event.target.classList.remove("dragging");
}

/**
 * Converts RGB to HSV color space.
 * @param {number} r - Red (0-255)
 * @param {number} g - Green (0-255)
 * @param {number} b - Blue (0-255)
 * @param {number} a - Alpha (0-255)
 * @returns {[number, number, number]} HSV values [Hue (0-360), Saturation (0-100), Value (0-100)]
 */
function rgbToHsv(r, g, b, a = 255) {
  [r, g, b] = flattenAlpha([r, g, b, a]).map((x) => x / 255);
  let cmax = Math.max(r, g, b),
    cmin = Math.min(r, g, b);
  let diff = cmax - cmin;
  let h = 0,
    s = 0,
    v = cmax * 100;

  if (diff !== 0) {
    if (cmax === r) h = (60 * ((g - b) / diff) + 360) % 360;
    else if (cmax === g) h = (60 * ((b - r) / diff) + 120) % 360;
    else h = (60 * ((r - g) / diff) + 240) % 360;

    s = cmax === 0 ? 0 : (diff / cmax) * 100;
  }

  return [h, s, v];
}

/**
 * Calculates the visual distance between two colors using HSV hue difference.
 * @param {number[]} rgba1 - First color [R, G, B, A]
 * @param {number[]} rgba2 - Second color [R, G, B, A]
 * @returns {number} Hue-based visual distance
 */
function getColorDistance(rgba1, rgba2) {
  let [h1, s1, v1] = rgbToHsv(...rgba1);
  let [h2, s2, v2] = rgbToHsv(...rgba2);

  // Hue difference (circular scale)
  let hueDist = Math.min(Math.abs(h1 - h2), 360 - Math.abs(h1 - h2));

  // Saturation & Value differences (linear scale)
  let satDist = Math.abs(s1 - s2);
  let valDist = Math.abs(v1 - v2) * 0; // HACK: value difference does not matter for ASCII art

  // Weighted sum (adjust weight factors if needed)
  return hueDist * 0.5 + satDist * 0.3 + valDist * 0.2;
}
