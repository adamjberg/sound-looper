const playBtn = document.getElementById("play");
const drumsBtn = document.getElementById("drums");
const guitarBtn = document.getElementById("guitar");

let drumsEnabled = true;
let guitarEnabled = true;

let guitarSource = null;
let drumSource = null;
let drumGainNode = null;
let guitarGainNode = null; 

async function run() {
   const audioContext = new AudioContext();

   const drumLoopResponse = await fetch("/drum-loop.mp3");
   const drumLoopBuffer = await drumLoopResponse.arrayBuffer();
   const guitarLoopResponse = await fetch("/guitar-loop.mp3");
   const guitarLoopBuffer = await guitarLoopResponse.arrayBuffer();

   const drumLoop = await audioContext.decodeAudioData(drumLoopBuffer);
   const guitarLoop = await audioContext.decodeAudioData(guitarLoopBuffer);

   drumSource = audioContext.createBufferSource();
   drumSource.buffer = drumLoop;
   drumSource.loop = true;
   
   // Create gain node for drums
   drumGainNode = audioContext.createGain();
   drumGainNode.gain.value = 0;
   drumSource.connect(drumGainNode);
   drumGainNode.connect(audioContext.destination);

   guitarSource = audioContext.createBufferSource();
   guitarSource.buffer = guitarLoop;
   guitarSource.loop = true;
   
   // Create gain node for guitar
   guitarGainNode = audioContext.createGain();
   guitarGainNode.gain.value = 0;
   guitarSource.connect(guitarGainNode);
   guitarGainNode.connect(audioContext.destination); // Connect gain node to destination
}

function activateDrums(e) {
  e.preventDefault();
  drumsEnabled = true;
  drumGainNode.gain.value = 1;
  toggleButtonColor(drumsBtn, drumsEnabled);
}

function deactivateDrums(e) {
  e.preventDefault();
  drumsEnabled = false;
  drumGainNode.gain.value = 0;
  toggleButtonColor(drumsBtn, drumsEnabled);
}

function activateGuitar(e) {
  e.preventDefault();
  guitarEnabled = true;
  guitarGainNode.gain.value = 1;
  toggleButtonColor(guitarBtn, guitarEnabled);
}

function deactivateGuitar(e) {
  e.preventDefault();
  guitarEnabled = false;
  guitarGainNode.gain.value = 0;
  toggleButtonColor(guitarBtn, guitarEnabled);
}

drumsBtn.addEventListener("mousedown", activateDrums);
drumsBtn.addEventListener("touchstart", activateDrums);
drumsBtn.addEventListener("mouseup", deactivateDrums);
drumsBtn.addEventListener("touchend", deactivateDrums);

guitarBtn.addEventListener("mousedown", activateGuitar);
guitarBtn.addEventListener("touchstart", activateGuitar);
guitarBtn.addEventListener("mouseup", deactivateGuitar);
guitarBtn.addEventListener("touchend", deactivateGuitar);

playBtn.addEventListener("click", async () => {
  try {
    drumSource.start();
    guitarSource.start();
  } catch (error) {
    console.error("Error loading or playing audio:", error);
  }
});

function toggleButtonColor(button, isEnabled) {
  if (isEnabled) {
    button.classList.add('active');
  } else {
    button.classList.remove('active');
  }
}

run();
