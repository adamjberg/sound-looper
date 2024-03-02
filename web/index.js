const playBtn = document.getElementById("play");
const drumsBtn = document.getElementById("drums");
const guitarBtn = document.getElementById("guitar");

let drumsEnabled = true;
let guitarEnabled = false;

let guitarSource = null;
let drumSource = null;

async function run() {
   // Create an AudioContext instance
   const audioContext = new AudioContext();

   const drumLoopResponse = await fetch("/drum-loop.mp3");
   const drumLoopBuffer = await drumLoopResponse.arrayBuffer();
   const guitarLoopResponse = await fetch("/guitar-loop.mp3");
   const guitarLoopBuffer = await guitarLoopResponse.arrayBuffer();

   const drumLoop = await audioContext.decodeAudioData(drumLoopBuffer);
   const guitarLoop = await audioContext.decodeAudioData(guitarLoopBuffer);

   drumSource = audioContext.createBufferSource();
   drumSource.buffer = drumLoop;
   drumSource.connect(audioContext.destination);

   guitarSource = audioContext.createBufferSource();
   guitarSource.buffer = guitarLoop;
   guitarSource.connect(audioContext.destination);
}

drumsBtn.addEventListener("click", () => {
  drumsEnabled = !drumsEnabled;
});

guitarBtn.addEventListener("click", () => {
  guitarEnabled = !guitarEnabled;
});

playBtn.addEventListener("click", async () => {
  try {
    drumSource.start();
    guitarSource.start();
  } catch (error) {
    console.error("Error loading or playing audio:", error);
  }
});

run();