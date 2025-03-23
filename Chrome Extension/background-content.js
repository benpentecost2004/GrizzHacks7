// import {
//   preloadResource,
//   showPopup,
//   trackYouTubeWatchTime,
// } from "functions-content.js";

function mainFunction() {
  // variables
  let secondsLeft = parseInt(localStorage.getItem("secondsLeft")) || 1200; // 20min
  let secondsWatched = parseInt(localStorage.getItem("secondsWatched")) || 0;
  let BrainCoinsAmount =
    parseInt(localStorage.getItem("BrainCoinsAmount")) || 340;
  let video = document.querySelector("video");
  let minutesLeft = Math.ceil(secondsLeft / 60);
  let minutesWatched = Math.ceil(secondsWatched / 60);

  function showPopup() {
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

  function trackYouTubeWatchTime() {
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
        secondsLeft -= elapsedSeconds;
        timeA = timeB;

        console.log(`secondsLeft: ${secondsLeft} seconds`);
        console.log(`secondsWatched: ${secondsWatched} seconds`);
        console.log(`minutesLeft: ${minutesLeft} minutes`);
        console.log(`minutesWatched: ${minutesWatched} minutes`);

        localStorage.setItem("secondsWatched", secondsWatched);
        localStorage.setItem("secondsLeft", secondsLeft);
      }
    }, 1000);

    // // Restore watch time when the page loads
    // window.addEventListener("load", () => {
    //   let secondsWatched = localStorage.getItem("secondsWatched");
    //   if (secondsWatched) {
    //     secondsWatched = parseInt(secondsWatched);
    //     console.log(
    //       `Restored watchTime from localStorage: ${secondsWatched} seconds`
    //     );
    //   }
    // });
  }

  // log everything just to see
  console.log(`secondsLeft: ${secondsLeft} seconds`);
  console.log(`secondsWatched: ${secondsWatched} seconds`);
  console.log(`minutesLeft: ${minutesLeft} minutes`);
  console.log(`minutesWatched: ${minutesWatched} minutes`);

  trackYouTubeWatchTime();

  if (secondsLeft == 0) {
    video.pause();
    console.log("Video paused");
    showPopup();
  }

  // debug
  video.pause();
  console.log("Video paused");
  showPopup();
}

setTimeout(mainFunction, 2000); // Delay of 2000 milliseconds (2 seconds)
