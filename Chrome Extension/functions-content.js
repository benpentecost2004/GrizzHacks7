// variables
let secondsLeft = parseInt(localStorage.getItem("secondsLeft")) || 1200; // 20min
let secondsWatched = parseInt(localStorage.getItem("secondsWatched")) || 0;
const BrainCoinsAmount =
  parseInt(localStorage.getItem("BrainCoinsAmount")) || 340;
let video = document.querySelector("video");
let minutesLeft = Math.ceil(secondsLeft / 60);
let minutesWatched = Math.ceil(secondsWatched / 60);

// function definitions
export function preloadResource() {
  const resourceUrl = "https://example.com/resource.js";
  const link = document.createElement("link");
  link.rel = "preload";
  link.href = resourceUrl;
  link.as = "script";
  document.head.appendChild(link);

  // Ensure the script is executed after it's loaded
  link.onload = () => {
    const script = document.createElement("script");
    script.src = resourceUrl;
    document.body.appendChild(script);
  };
}

export function showPopup() {
  // Check if the popup already exists
  if (document.getElementById("brain-rot-blocker-popup")) {
    return;
  }

  // Layout containing styles and HTML template for the popup
  const layout = {
    styles: `
      * {
        margin: 0;
        padding: 0;
        font-family: "Courier New", Courier, monospace;
        text-decoration: none;
        font-size: 25px;
      }

      html, body {margin: 0; height: 100%; overflow: hidden}

      body > * {
        filter: blur(20px) !important;
      }

      .brain-rot-blocker-popup {
        filter: blur(0px) !important;
      }
      
      .brain-rot-blocker-popup {
        background-color: rgba(0, 0, 0, 0.5);
        height: 100vh;
        width: 100vw;
        display: flex;
        flex-direction: row;
      }

      .brb-body {
        margin: auto;
        background-color: white;
        width: 80%;
        border-radius: 10px;
        display: flex;
        flex-direction: column;
      }

      .brb-body > * {
        margin: 10px;
      }

      .topbar {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
      }

      .topbar .left {
        display: flex;
        flex-direction: row;
      }

      .topbar .right {
        display: flex;
        flex-direction: row;
      }

      .topbar .right > * {
        margin: 0 10px;
      }

      .time-amount,
      .coin-amount,
      .min {
        height: 33px;
        text-align: center;
        line-height: 33px;
        vertical-align: center;
      }

      .brain-coin,
      .time-left {
        display: flex;
        flex-direction: row;
        margin-right: 0px;
        height: 33px;
        margin: auto 0;
      }

      .brain-coin-icon {
        text-align: center;
        line-height: 20px;
        margin: auto 0;
        font-weight: bold;
        font-size: 10px;
        background-color: gold;
        height: 20px;
        width: 20px;
        border-radius: 50%;
        border-width: 10;
        border-style: solid;
        border-color: black;
      }

      .profile {
        text-align: center;
        line-height: 33px;
        font-weight: bold;
        font-size: 15px;
        background-color: gold;
        height: 33px;
        width: 33px;
        border-radius: 50%;
        border-width: 10;
        border-style: solid;
        border-color: black;
      }

      .profile i {
        line-height: 33px;
        font-size: 25px;
      }

      .main {
        display: flex;
        flex-direction: column;
      }

      .answers {
        display: flex;
        flex-direction: column;
      }

      .bottom {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
      }

      .buy:hover,
      .profile:hover,
      .visit-website:hover,
      .next:hover {
        cursor: pointer;
      }
    `,
  };

  // Add styles to the document
  const styleSheet = document.createElement("style");
  styleSheet.textContent = layout.styles;
  document.head.appendChild(styleSheet);

  // Add Boxicons stylesheet dynamically
  const boxiconsLink = document.createElement("link");
  boxiconsLink.href = "https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css";
  boxiconsLink.rel = "stylesheet";
  document.head.appendChild(boxiconsLink);

  // Create the popup element using DOM manipulation
  const popup = document.createElement("div");
  popup.className = "brain-rot-blocker-popup";
  popup.id = "brain-rot-blocker-popup";

  // Create the popup main body element
  const brbBody = document.createElement("div");
  brbBody.className = "brb-body";
  brbBody.id = "brb-body";

  // Create the top bar
  const topbar = document.createElement("div");
  topbar.className = "topbar";
  const left = document.createElement("div");
  left.className = "left";
  const h1 = document.createElement("h1");
  h1.textContent = "Brain Rot Blocker";
  left.appendChild(h1);
  const right = document.createElement("div");
  right.className = "right";

  // time left
  const timeLeft = document.createElement("div");
  timeLeft.className = "time-left";
  const timeAmount = document.createElement("p");
  timeAmount.className = "time-amount";
  timeAmount.textContent = minutesLeft;
  const min = document.createElement("p");
  min.className = "min";
  min.textContent = "min";
  timeLeft.appendChild(timeAmount);
  timeLeft.appendChild(min);

  // brain coin
  const brainCoin = document.createElement("div");
  brainCoin.className = "brain-coin";
  const coinAmount = document.createElement("p");
  coinAmount.className = "coin-amount";
  coinAmount.textContent = BrainCoinsAmount;
  const brainCoinIcon = document.createElement("div");
  brainCoinIcon.className = "brain-coin-icon";
  brainCoinIcon.textContent = "BC";
  brainCoin.appendChild(coinAmount);
  brainCoin.appendChild(brainCoinIcon);

  // buy button
  const buyButton = document.createElement("button");
  buyButton.className = "buy";
  buyButton.textContent = "buy";
  buyButton.onclick = function () {
    window.location.href = "http://localhost:3000";
  };

  // profile button
  const profile = document.createElement("div");
  profile.className = "profile";
  profile.onclick = function () {
    window.location.href = "http://localhost:3000";
  };
  const profileIcon = document.createElement("i");
  profileIcon.className = "bx bxs-user";
  profile.appendChild(profileIcon);

  right.appendChild(timeLeft);
  right.appendChild(brainCoin);
  right.appendChild(buyButton);
  right.appendChild(profile);
  topbar.appendChild(left);
  topbar.appendChild(right);

  // Create the main content
  const main = document.createElement("div");
  main.className = "main";

  // question
  const question = document.createElement("p");
  question.className = "question";
  question.textContent = "Which of the following are true?";
  const answers = document.createElement("p");
  answers.className = "answers";

  // answers
  const answerA = document.createElement("p");
  answerA.className = "answer";
  answerA.textContent = "a. NP = P";
  const answerB = document.createElement("p");
  answerB.className = "answer";
  answerB.textContent = "b. CFL require a CFG";
  const answerC = document.createElement("p");
  answerC.className = "answer";
  answerC.textContent = "c. a RL can be encoded on a TM";
  const answerD = document.createElement("p");
  answerD.className = "answer";
  answerD.textContent = "d. all RL are decidable";

  answers.appendChild(answerA);
  answers.appendChild(answerB);
  answers.appendChild(answerC);
  answers.appendChild(answerD);
  main.appendChild(question);
  main.appendChild(answers);

  // Create the bottom buttons
  const bottom = document.createElement("div");
  bottom.className = "bottom";

  // visit website button
  const visitWebsiteButton = document.createElement("button");
  visitWebsiteButton.className = "visit-website";
  visitWebsiteButton.textContent = "Visit Website";
  visitWebsiteButton.onclick = function () {
    window.location.href = "http://localhost:3000";
  };
  const externalIcon = document.createElement("i");
  externalIcon.className = "bx bx-link-external";
  visitWebsiteButton.appendChild(externalIcon);

  // next button
  const nextButton = document.createElement("button");
  nextButton.className = "next";
  nextButton.textContent = "Next";

  bottom.appendChild(visitWebsiteButton);
  bottom.appendChild(nextButton);

  // Add elements to popup
  brbBody.appendChild(topbar);
  brbBody.appendChild(main);
  brbBody.appendChild(bottom);
  popup.appendChild(brbBody);

  // Add the popup (everything) to the body
  document.body.appendChild(popup);
}

export function trackYouTubeWatchTime() {
  video = document.querySelector("video"); // Ensure it's selected again each time
  if (!video) {
    console.log("No video found on the page.");
    return;
  }
  let timeA = video.currentTime;
  console.log(`timeA: ${timeA}`);
  console.log("YouTube video found. Starting watch tracking...");
  setInterval(() => {
    if (!video.paused) {
      let timeB = Math.floor(video.currentTime);
      let elapsedSeconds = timeB - timeA;
      if (elapsedSeconds < 0 || 2 < elapsedSeconds) {
        elapsedSeconds = 1;
      }
      secondsWatched += elapsedSeconds;
      timeA = timeB;
      console.log(`watchTime: ${secondsWatched} seconds`);
      localStorage.setItem("secondsWatched", secondsWatched);
    }
  }, 1000);

  // Restore watch time when the page loads
  window.addEventListener("load", () => {
    let secondsWatched = localStorage.getItem("secondsWatched");
    if (secondsWatched) {
      secondsWatched = parseInt(secondsWatched);
      console.log(
        `Restored watchTime from localStorage: ${secondsWatched} seconds`
      );
    }
  });
}

// mainFunction();

// <button class="ytp-play-button ytp-button" aria-keyshortcuts="k" data-title-no-tooltip="Replay" aria-label="Pause keyboard shortcut k" title="Replay"><svg height="100%" version="1.1" viewBox="0 0 36 36" width="100%"><use class="ytp-svg-shadow" xlink:href="#ytp-id-105"></use><path class="ytp-svg-fill" d="M 18,11 V 7 l -5,5 5,5 v -4 c 3.3,0 6,2.7 6,6 0,3.3 -2.7,6 -6,6 -3.3,0 -6,-2.7 -6,-6 h -2 c 0,4.4 3.6,8 8,8 4.4,0 8,-3.6 8,-8 0,-4.4 -3.6,-8 -8,-8 z" id="ytp-id-105"></path></svg></button>
// <button class="ytp-play-button ytp-button" aria-keyshortcuts="k" data-title-no-tooltip="Pause" aria-label="Pause keyboard shortcut k" title="Pause (k)"><svg height="100%" version="1.1" viewBox="0 0 36 36" width="100%"><use class="ytp-svg-shadow" xlink:href="#ytp-id-74"></use><path class="ytp-svg-fill" d="M 12,26 16,26 16,10 12,10 z M 21,26 25,26 25,10 21,10 z" id="ytp-id-74"></path></svg></button>
// <button class="ytp-play-button ytp-button" aria-keyshortcuts="k" data-title-no-tooltip="Play" aria-label="Play keyboard shortcut k" title="Play (k)"><svg height="100%" version="1.1" viewBox="0 0 36 36" width="100%"><use class="ytp-svg-shadow" xlink:href="#ytp-id-72"></use><path class="ytp-svg-fill" d="M 12,26 18.5,22 18.5,14 12,10 z M 18.5,22 25,18 25,18 18.5,14 z" id="ytp-id-72"></path></svg></button>
//                                                                   ^                      ^^^
// "play" when the video is currently paused
// "pause" when the video is currently playing
// "Replay" when the video is at the end just idle
// class="ytp-play-button ytp-button"
// data-title-no-tooltip="Play"

// const button = document.getElementsByClassName("ytp-button")[1]; // Get the first matching button
// if (button) {
//   const buttonMode = button.getAttribute("data-title-no-tooltip");
//   console.log(buttonMode); // Output: "Play"
// }

// <div class="html5-video-container" data-layer="0" draggable="true">
// <video tabindex="-1" class="video-stream html5-main-video" controlslist="nodownload" style="width: 685px; height: 385px; left: 0px; top: 0px;" src="blob:https://www.youtube.com/9b533ffd-fbfa-44fd-9aa4-1f34be1f8274"></video>
// </div>

// ,
//       "js": ["content2.js"]
