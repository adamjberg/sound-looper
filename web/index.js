const playBtn = document.getElementById("play");
const drumsBtn = document.getElementById("drums");
const guitarBtn = document.getElementById("guitar");

let drumsEnabled = true;
let guitarEnabled = false;

let guitarSource = null;
let drumSource = null;
let drumGainNode = null;

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
   
   // Create gain node for drums
   drumGainNode = audioContext.createGain();
   drumSource.connect(drumGainNode);
   drumGainNode.connect(audioContext.destination); // Connect gain node to destination

   guitarSource = audioContext.createBufferSource();
   guitarSource.buffer = guitarLoop;
   guitarSource.connect(audioContext.destination);
}

drumsBtn.addEventListener("click", () => {
  drumsEnabled = !drumsEnabled;

  console.log(drumsEnabled)
  
  // Mute or unmute the drums based on drumsEnabled
  if (drumsEnabled) {
    drumGainNode.gain.value = 1; // Unmute drums
  } else {
    drumGainNode.gain.value = 0; // Mute drums
  }
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
