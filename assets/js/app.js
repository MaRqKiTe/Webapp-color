"use strict";

const rRange = document.getElementById("rRange");
const gRange = document.getElementById("gRange");
const bRange = document.getElementById("bRange");

const rVal = document.getElementById("rVal");
const gVal = document.getElementById("gVal");
const bVal = document.getElementById("bVal");

const colorPreview = document.getElementById("colorPreview");
const rgbText = document.getElementById("rgbText");
const hexText = document.getElementById("hexText");

const copyBtn = document.getElementById("copyBtn");
const copyStatus = document.getElementById("copyStatus");

// Inputs decimales
const rInput = document.getElementById("rInput");
const gInput = document.getElementById("gInput");
const bInput = document.getElementById("bInput");

// NUEVO: color picker
const colorPicker = document.getElementById("colorPicker");

function clampByte(n) {
  const x = Number(n);
  if (Number.isNaN(x)) return 0;
  return Math.min(255, Math.max(0, Math.round(x)));
}

function toHex2(n) {
  return clampByte(n).toString(16).padStart(2, "0").toUpperCase();
}

function rgbToHex(r, g, b) {
  return `#${toHex2(r)}${toHex2(g)}${toHex2(b)}`;
}

// Acepta #RGB o #RRGGBB (el picker usa #RRGGBB, pero así queda robusto)
function hexToRgb(hex) {
  if (typeof hex !== "string") return { r: 0, g: 0, b: 0 };
  let h = hex.trim();
  if (!h.startsWith("#")) return { r: 0, g: 0, b: 0 };

  h = h.slice(1);

  if (h.length === 3) {
    // #RGB -> #RRGGBB
    h = h.split("").map(ch => ch + ch).join("");
  }

  if (h.length !== 6 || /[^0-9a-fA-F]/.test(h)) {
    return { r: 0, g: 0, b: 0 };
  }

  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return { r, g, b };
}

// Set centralizado: sincroniza sliders, inputs numéricos, picker y UI
function setRGB(r, g, b, source = "range") {
  const rr = clampByte(r);
  const gg = clampByte(g);
  const bb = clampByte(b);

  // sliders
  rRange.value = String(rr);
  gRange.value = String(gg);
  bRange.value = String(bb);

  // inputs numéricos
  rInput.value = String(rr);
  gInput.value = String(gg);
  bInput.value = String(bb);

  // picker
  const hex = rgbToHex(rr, gg, bb);
  colorPicker.value = hex;

  updateUI();

  if (source !== "copy") {
    copyStatus.textContent = "";
  }
}

function updateUI() {
  const r = clampByte(rRange.value);
  const g = clampByte(gRange.value);
  const b = clampByte(bRange.value);

  rVal.textContent = String(r);
  gVal.textContent = String(g);
  bVal.textContent = String(b);

  const rgb = `rgb(${r}, ${g}, ${b})`;
  const hex = rgbToHex(r, g, b);

  colorPreview.style.backgroundColor = rgb;
  rgbText.textContent = rgb;
  hexText.textContent = hex;
}

function onSliderInput() {
  setRGB(rRange.value, gRange.value, bRange.value, "range");
}

function onNumberInputCommit() {
  setRGB(rInput.value, gInput.value, bInput.value, "number");
}

function onNumberKeydown(e) {
  if (e.key === "Enter") onNumberInputCommit();
}

// NUEVO: cuando eliges un color en el picker
function onPickerInput() {
  const { r, g, b } = hexToRgb(colorPicker.value);
  setRGB(r, g, b, "picker");
}

async function copyHex() {
  const hex = hexText.textContent.trim();
  try {
    await navigator.clipboard.writeText(hex);
    copyStatus.textContent = `Copiado: ${hex}`;
  } catch {
    const temp = document.createElement("input");
    temp.value = hex;
    document.body.appendChild(temp);
    temp.select();
    document.execCommand("copy");
    document.body.removeChild(temp);
    copyStatus.textContent = `Copiado: ${hex}`;
  }
}

rRange.addEventListener("input", onSliderInput);
gRange.addEventListener("input", onSliderInput);
bRange.addEventListener("input", onSliderInput);

rInput.addEventListener("blur", onNumberInputCommit);
gInput.addEventListener("blur", onNumberInputCommit);
bInput.addEventListener("blur", onNumberInputCommit);

rInput.addEventListener("keydown", onNumberKeydown);
gInput.addEventListener("keydown", onNumberKeydown);
bInput.addEventListener("keydown", onNumberKeydown);

colorPicker.addEventListener("input", onPickerInput);

copyBtn.addEventListener("click", copyHex);

// Inicializa todo sincronizado
setRGB(0, 0, 0, "init");
