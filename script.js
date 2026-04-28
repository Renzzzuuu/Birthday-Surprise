const PASSWORD = "010523";
const HEARTS_TO_CATCH = 5;

const passwordScreen = document.getElementById("passwordScreen");
const gameScreen = document.getElementById("gameScreen");
const envelopeScreen = document.getElementById("envelopeScreen");

const pinSlots = Array.from(document.querySelectorAll("[data-pin-slot]"));
const keypadButtons = Array.from(document.querySelectorAll("[data-digit]"));
const clearButton = document.getElementById("clearButton");
const deleteButton = document.getElementById("deleteButton");
const passwordHint = document.getElementById("passwordHint");

const gameBoard = document.getElementById("gameBoard");
const scoreText = document.getElementById("scoreText");
const gameStatus = document.getElementById("gameStatus");

const envelopeWrap = document.getElementById("envelopeWrap");
const music = document.getElementById("music");
const musicButton = document.getElementById("musicButton");
const surpriseButton = document.getElementById("surpriseButton");
const surpriseNote = document.getElementById("surpriseNote");
const letterPaper = envelopeWrap.querySelector(".letter-paper");
const finalMessage = document.getElementById("finalMessage");
const floatingHearts = document.getElementById("floatingHearts");

let caughtHearts = 0;
let gameInterval = null;
let envelopeOpened = false;
let musicPlaying = false;
let musicAttempted = false;
let enteredPin = "";

function syncMusicButton() {
  musicButton.textContent = musicPlaying ? "Pause Music" : "Play Music";
}

function showScreen(screenToShow) {
  [passwordScreen, gameScreen, envelopeScreen].forEach((screen) => {
    screen.classList.toggle("active", screen === screenToShow);
  });
}

function updatePinDisplay() {
  pinSlots.forEach((slot, index) => {
    slot.classList.toggle("filled", index < enteredPin.length);
  });
}

function resetPin(clearHint = false) {
  enteredPin = "";
  updatePinDisplay();
  if (clearHint) {
    passwordHint.textContent = "";
  }
}

function checkPassword() {
  if (enteredPin === PASSWORD) {
    tryAutoPlayMusic();
    passwordHint.textContent = "Correct password. Let the game begin.";
    showScreen(gameScreen);
    startGame();
    return;
  }

  passwordHint.textContent = "Wrong password. Try again.";
  resetPin();
}

function handleDigitInput(digit) {
  if (enteredPin.length >= PASSWORD.length) {
    return;
  }

  enteredPin += digit;
  updatePinDisplay();

  if (enteredPin.length === PASSWORD.length) {
    checkPassword();
  }
}

function startGame() {
  caughtHearts = 0;
  scoreText.textContent = "Hearts caught: 0 / 5";
  gameStatus.textContent = "";
  gameBoard.innerHTML = "";

  clearInterval(gameInterval);
  gameInterval = setInterval(spawnHeart, 850);
  spawnHeart();
}

function spawnHeart() {
  if (caughtHearts >= HEARTS_TO_CATCH) {
    return;
  }

  const heart = document.createElement("div");
  heart.className = "tap-heart";
  heart.textContent = "❤";

  const heartSize = heart.offsetWidth || 60;

const maxX = Math.max(gameBoard.clientWidth - heartSize, 20);
const maxY = Math.max(gameBoard.clientHeight - heartSize, 20);

  heart.style.left = Math.random() * maxX + "px";
  heart.style.top = Math.random() * maxY + "px";

  heart.addEventListener("click", () => {
    heart.remove();
    caughtHearts += 1;
    scoreText.textContent = "Hearts caught: " + caughtHearts + " / " + HEARTS_TO_CATCH;

    if (caughtHearts >= HEARTS_TO_CATCH) {
      winGame();
    }
  });

  gameBoard.appendChild(heart);
  setTimeout(() => heart.remove(), 1800);
}

function winGame() {
  clearInterval(gameInterval);
  gameStatus.textContent = "You did it. The envelope is ready.";

  setTimeout(() => {
    showScreen(envelopeScreen);
  }, 900);
}

function openEnvelope() {
  tryAutoPlayMusic();

  if (envelopeOpened) {
    return;
  }

  updateEnvelopeHeight();
  envelopeOpened = true;
  envelopeWrap.classList.add("open");
  envelopeScreen.classList.add("envelope-screen-open");
  setTimeout(() => {
    finalMessage.textContent = "Happy birthday, my love. This letter is for you.";
  }, 420);
}

function updateEnvelopeHeight() {
  const paperHeight = letterPaper.scrollHeight;
  const surpriseHeight = surpriseNote.classList.contains("show")
    ? surpriseNote.scrollHeight
    : 0;

  const totalHeight = Math.max(560, paperHeight + surpriseHeight + 320);

  envelopeWrap.style.setProperty("--open-letter-height", totalHeight + "px");
}

async function toggleMusic() {
  const hasSource = music.querySelector("source")?.getAttribute("src");

  if (!hasSource || hasSource === "your-music.mp3") {
    musicButton.textContent = "Add Music File First";
    return;
  }

  if (musicPlaying) {
    music.pause();
    musicPlaying = false;
    syncMusicButton();
    return;
  }

  try {
    await music.play();
    musicPlaying = true;
    syncMusicButton();
  } catch (error) {
    musicButton.textContent = "Music Unavailable";
  }
}

async function tryAutoPlayMusic() {
  if (musicAttempted) {
    return;
  }

  musicAttempted = true;
  const hasSource = music.querySelector("source")?.getAttribute("src");

  if (!hasSource || hasSource === "your-music.mp3") {
    musicButton.textContent = "Add Music File First";
    return;
  }

  try {
    await music.play();
    musicPlaying = true;
    syncMusicButton();
  } catch (error) {
    musicPlaying = false;
    musicButton.textContent = "Tap To Play Music";
  }
}

function toggleSurprise() {
  surpriseNote.classList.toggle("show");

  surpriseButton.textContent = surpriseNote.classList.contains("show")
    ? "A Little Extra Love"
    : "One More Surprise";

  const paper = letterPaper;

  const resize = () => {
    const paperHeight = paper.scrollHeight;
    const totalHeight = Math.max(560, paperHeight + 320);
    envelopeWrap.style.setProperty("--open-letter-height", totalHeight + "px");
  };

  requestAnimationFrame(resize);
}

function createFloatingHeart() {
  const heart = document.createElement("div");
  heart.className = "floating-heart";
  heart.textContent = "❤";
  heart.style.left = Math.random() * 100 + "vw";
  heart.style.fontSize = 14 + Math.random() * 20 + "px";
  heart.style.animationDuration = 4 + Math.random() * 4 + "s";
  floatingHearts.appendChild(heart);

  setTimeout(() => {
    heart.remove();
  }, 8500);
}

keypadButtons.forEach((button) => {
  button.addEventListener("click", () => {
    handleDigitInput(button.dataset.digit);
  });
});

clearButton.addEventListener("click", () => {
  resetPin(true);
});

deleteButton.addEventListener("click", () => {
  enteredPin = enteredPin.slice(0, -1);
  updatePinDisplay();
});

envelopeWrap.addEventListener("click", openEnvelope);
musicButton.addEventListener("click", toggleMusic);
surpriseButton.addEventListener("click", toggleSurprise);
window.addEventListener("resize", updateEnvelopeHeight);
updateEnvelopeHeight();
updatePinDisplay();
setInterval(createFloatingHeart, 380);

surpriseNote.addEventListener("transitionend", () => {
  const paperHeight = letterPaper.scrollHeight;
  const totalHeight = Math.max(560, paperHeight + 320);
  envelopeWrap.style.setProperty("--open-letter-height", totalHeight + "px");
});

