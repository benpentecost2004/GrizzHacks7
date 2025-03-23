function mainFunction() {
  // variables
  let secondsLeft = parseInt(localStorage.getItem("secondsLeft")) || 1200; // 20min
  let secondsWatched = parseInt(localStorage.getItem("secondsWatched")) || 0;
  let BrainCoinsAmount =
    parseInt(localStorage.getItem("CoinsAmount")) || 0; // Default to 0
  let video = document.querySelector("video");
  let minutesLeft = Math.ceil(secondsLeft / 60);
  let minutesWatched = Math.ceil(secondsWatched / 60);

  async function showPopup() {
    // Check if the popup already exists
    if (document.getElementById("logo-popup")) {
      return;
    }
    
    // Fetch coins from API
    try {
      console.log("Fetching coins from API...");
      const response = await fetch("http://127.0.0.1:5000/get_coins");
      if (!response.ok) {
        throw new Error('Failed to fetch coins');
      }
      const data = await response.json();
      console.log("API response:", data);
      
      BrainCoinsAmount = data.brain_coins || 0;
      console.log("Updated CoinsAmount to:", BrainCoinsAmount);
      localStorage.setItem("CoinsAmount", BrainCoinsAmount);
    } catch (error) {
      console.error('Error fetching coins:', error);
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

      #logo-popup {
        filter: blur(0px) !important;
      }
      
      .logo-popup {
        background-color: rgba(0, 0, 0, 0.5);
        height: 100vh;
        width: 100vw;
        display: flex;
        flex-direction: row;
      }

      .popup-body {
        margin: auto;
        background-color: white;
        width: 80%;
        border-radius: 10px;
        display: flex;
        flex-direction: column;
      }

      .popup-body > * {
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

      .coin,
      .time-left {
        display: flex;
        flex-direction: row;
        margin-right: 0px;
        height: 33px;
        margin: auto 0;
      }

      .coin-icon {
        text-align: center;
        line-height: 20px;
        margin: auto 0;
        font-size: 24px;
        padding: 0 5px;
        color: #ff69b4; /* Hot pink */
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
    popup.className = "logo-popup";
    popup.id = "logo-popup";

    // Create the popup main body element
    const brbBody = document.createElement("div");
    brbBody.className = "popup-body";
    brbBody.id = "popup-body";
    brbBody.style.width = "60%";
    brbBody.style.maxWidth = "500px";
    brbBody.style.backgroundColor = "hsl(222.2 84% 4.9%)"; // Dark background from theme
    brbBody.style.color = "hsl(210 40% 98%)"; // White text from theme

    // Create the top bar
    const topbar = document.createElement("div");
    topbar.className = "topbar";
    topbar.style.display = "flex";
    topbar.style.flexDirection = "column";
    topbar.style.alignItems = "center";
    topbar.style.justifyContent = "center";
    
    const title = document.createElement("div");
    title.className = "title";
    const logoImg = document.createElement("img");
    logoImg.src = chrome.runtime.getURL("Logo.png");
    logoImg.alt = "Logo";
    logoImg.style.maxWidth = "250px";
    logoImg.style.height = "auto";
    logoImg.style.display = "block";
    logoImg.style.margin = "10px auto 20px auto";
    
    // Add error handling for the image
    logoImg.onerror = function() {
      console.error("Failed to load logo image");
      const h1 = document.createElement("h1");
      h1.textContent = "Logo.png";
      h1.style.textAlign = "center";
      h1.style.margin = "10px 0 20px 0";
      h1.style.color = "hsl(210 40% 98%)"; // White text
      title.appendChild(h1);
    };
    
    title.appendChild(logoImg);
    
    const controls = document.createElement("div");
    controls.className = "controls";
    controls.style.display = "flex";
    controls.style.alignItems = "center";
    controls.style.justifyContent = "center";
    controls.style.gap = "20px";
    controls.style.flexWrap = "wrap";
    controls.style.margin = "0 auto";
    controls.style.padding = "10px 0";

    // time left
    const timeLeft = document.createElement("div");
    timeLeft.className = "time-left";
    const timeAmount = document.createElement("p");
    timeAmount.className = "time-amount";
    timeAmount.textContent = minutesLeft;
    timeAmount.style.fontSize = "24px";
    timeAmount.style.fontWeight = "bold";
    timeAmount.style.color = "hsl(210 40% 98%)"; // White text
    const min = document.createElement("p");
    min.className = "min";
    min.textContent = "min";
    min.style.fontSize = "24px";
    min.style.fontWeight = "bold";
    min.style.color = "hsl(210 40% 98%)"; // White text
    timeLeft.appendChild(timeAmount);
    timeLeft.appendChild(min);

    // coins
    const brainCoin = document.createElement("div");
    brainCoin.className = "coin";
    const coinAmount = document.createElement("p");
    coinAmount.className = "coin-amount";
    coinAmount.id = "coins-display"; // Add ID for easier updating
    coinAmount.textContent = BrainCoinsAmount;
    coinAmount.style.fontSize = "28px";
    coinAmount.style.fontWeight = "bold";
    coinAmount.style.color = "hsl(210 40% 98%)"; // White text
    const brainCoinIcon = document.createElement("i");
    brainCoinIcon.className = "coin-icon bx bx-coin";
    brainCoinIcon.style.color = "hsl(221.2 83.2% 53.3%)"; // Primary color from theme
    brainCoin.appendChild(coinAmount);
    brainCoin.appendChild(brainCoinIcon);

    // buy button
    const buyButton = document.createElement("button");
    buyButton.className = "buy";
    buyButton.textContent = "BUY MORE COINS";
    buyButton.style.padding = "10px 20px";
    buyButton.style.fontSize = "18px";
    buyButton.style.backgroundColor = "hsl(221.2 83.2% 53.3%)"; // Primary color from theme
    buyButton.style.color = "white";
    buyButton.style.border = "none";
    buyButton.style.borderRadius = "5px";
    buyButton.style.cursor = "pointer";
    buyButton.style.margin = "15px auto 5px auto";
    buyButton.style.display = "block";
    buyButton.onclick = function () {
      window.location.href = "http://localhost:3000";
    };
    buyButton.onmouseover = function() {
      this.style.backgroundColor = "hsl(224.3 76.3% 48%)"; // Ring color from theme (darker)
    };
    buyButton.onmouseout = function() {
      this.style.backgroundColor = "hsl(221.2 83.2% 53.3%)"; // Primary color from theme
    };

    // Create a single vertical stack for everything
    const stackContainer = document.createElement("div");
    stackContainer.style.display = "flex";
    stackContainer.style.flexDirection = "column";
    stackContainer.style.alignItems = "center";
    stackContainer.style.gap = "10px";
    
    // Label for coins
    const coinsLabel = document.createElement("p");
    coinsLabel.textContent = "Coins:";
    coinsLabel.style.fontWeight = "bold";
    coinsLabel.style.margin = "15px 0 0 0";
    coinsLabel.style.color = "hsl(210 40% 98%)"; // White text
    
    // Container for coins
    const coinsContainer = document.createElement("div");
    coinsContainer.style.display = "flex";
    coinsContainer.style.justifyContent = "center";
    coinsContainer.style.alignItems = "center";
    coinsContainer.style.margin = "0";
    coinsContainer.appendChild(brainCoin);
    
    // Label for time
    const timeLabel = document.createElement("p");
    timeLabel.textContent = "Time Remaining:";
    timeLabel.style.fontWeight = "bold";
    timeLabel.style.margin = "10px 0 0 0";
    timeLabel.style.color = "hsl(210 40% 98%)"; // White text
    
    // Container for time
    const timeContainer = document.createElement("div");
    timeContainer.style.display = "flex";
    timeContainer.style.justifyContent = "center";
    timeContainer.style.alignItems = "center";
    timeContainer.style.margin = "0";
    timeContainer.appendChild(timeLeft);
    
    // Spacing before button
    const spacer = document.createElement("div");
    spacer.style.height = "15px";
    
    stackContainer.appendChild(coinsLabel);
    stackContainer.appendChild(coinsContainer);
    stackContainer.appendChild(timeLabel);
    stackContainer.appendChild(timeContainer);
    stackContainer.appendChild(spacer);
    stackContainer.appendChild(buyButton);
    
    controls.appendChild(stackContainer);
    topbar.appendChild(title);
    topbar.appendChild(controls);

    // Create the main content
    const main = document.createElement("div");
    main.className = "main";
    
    // Visit website link in main area
    const mainVisitLink = document.createElement("a");
    mainVisitLink.href = "http://localhost:3000";
    mainVisitLink.textContent = "Visit Website";
    mainVisitLink.style.textAlign = "center";
    mainVisitLink.style.display = "block";
    mainVisitLink.style.margin = "20px auto";
    mainVisitLink.style.fontSize = "28px";
    mainVisitLink.style.textDecoration = "none";
    mainVisitLink.style.color = "hsl(217.2 91.2% 59.8%)"; // Primary color (brighter blue) from dark theme
    
    const linkIcon = document.createElement("i");
    linkIcon.className = "bx bx-link-external";
    linkIcon.style.marginLeft = "10px";
    mainVisitLink.appendChild(linkIcon);
    
    main.appendChild(mainVisitLink);

    // Add elements to popup
    brbBody.appendChild(topbar);
    brbBody.appendChild(main);
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
    showPopup().catch(err => console.error("Error showing popup:", err));
  }

  // debug
  video.pause();
  console.log("Video paused");
  showPopup().catch(err => console.error("Error showing popup:", err));
}

setTimeout(mainFunction, 2000); // Delay of 2000 milliseconds (2 seconds)
