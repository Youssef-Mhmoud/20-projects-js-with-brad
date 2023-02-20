const playerContainer = document.getElementById("player-container");
const playBtn = document.getElementById("play");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");

const audio = document.getElementById("audio");
const progress = document.getElementById("progress");
const progressContainer = document.getElementById("progress-container");
const title = document.getElementById("title");
const cover = document.getElementById("cover");

// Title
const sura = ["alakhlas", "alflaq", "alnas"];

// Keep track
let playerIndex = 2;

// Initially load details into DOM
loadPlayer(sura[playerIndex]);

// Update player details
function loadPlayer(sura) {
  title.innerText = sura;
  audio.src = `quran/${sura}.mp3`;
  cover.src = `images/${sura}.png`;
}

// Play
function playSura() {
  playerContainer.classList.add("play");
  playBtn.querySelector("i.fas").classList.remove("fa-play");
  playBtn.querySelector("i.fas").classList.add("fa-pause");

  audio.play();
}

// Pause
function pausePlayer() {
  playerContainer.classList.remove("play");
  playBtn.querySelector("i.fas").classList.add("fa-play");
  playBtn.querySelector("i.fas").classList.remove("fa-pause");

  audio.pause();
}

// Previous
function prevPlayer() {
  playerIndex--;

  if (playerIndex < 0) {
    playerIndex = sura.length - 1;
  }

  loadPlayer(sura[playerIndex]);

  playSura();
}

// Next
function nextPlayer() {
  playerIndex++;

  if (playerIndex > sura.length - 1) {
    playerIndex = 0;
  }

  loadPlayer(sura[playerIndex]);

  playSura();
}

// Update progress bar
function updateProgress(e) {
  const { duration, currentTime } = e.srcElement;
  const progressPercent = (currentTime / duration) * 100;

  progress.style.width = `${progressPercent}%`;
}

// Set progress bar
function setProgress(e) {
  const width = this.clientWidth;
  const clickX = e.offsetX;
  const duration = audio.duration;

  audio.currentTime = (clickX / width) * duration;
}

// Event listeners
playBtn.addEventListener("click", () => {
  const isPlaying = playerContainer.classList.contains("play");

  if (isPlaying) {
    pausePlayer();
  } else {
    playSura();
  }
});

// Change
prevBtn.addEventListener("click", prevPlayer);
nextBtn.addEventListener("click", nextPlayer);

// Time update
audio.addEventListener("timeupdate", updateProgress);

// Click on progress bar
progressContainer.addEventListener("click", setProgress);

// Ends
audio.addEventListener("ended", nextPlayer);
