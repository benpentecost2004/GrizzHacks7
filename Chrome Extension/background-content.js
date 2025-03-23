function mainFunction() {
  // variables
  let diddyCoins = parseInt(localStorage.getItem("diddyCoins")) || 0; // Default to 0 minutes
  let secondsWatched = parseInt(localStorage.getItem("secondsWatched")) || 0;
  let BrainAuraAmount =
    parseInt(localStorage.getItem("AuraAmount")) || 0; // Default to 0
  let video = document.querySelector("video");
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
      
      BrainAuraAmount = data.brain_coins || 0;
      console.log("Updated AuraAmount to:", BrainAuraAmount);
      localStorage.setItem("AuraAmount", BrainAuraAmount);
    } catch (error) {
      console.error('Error fetching coins:', error);
    }
    
    // Get current time remaining
    const currentTime = parseInt(localStorage.getItem("diddyCoins")) || 0;

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
      .aura-amount,
      .min {
        height: 33px;
        text-align: center;
        line-height: 33px;
        vertical-align: center;
      }

      .aura,
      .time-left {
        display: flex;
        flex-direction: row;
        margin-right: 0px;
        height: 33px;
        margin: auto 0;
      }

      .aura-icon {
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
    brbBody.style.position = "relative"; // For absolute positioning of close button

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

    // time display
    const timeLeft = document.createElement("div");
    timeLeft.className = "time-left";
    const timeAmount = document.createElement("p");
    timeAmount.className = "time-amount";
    timeAmount.textContent = diddyCoins;
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

    // aura
    const brainCoin = document.createElement("div");
    brainCoin.className = "aura";
    const auraAmount = document.createElement("p");
    auraAmount.className = "aura-amount";
    auraAmount.id = "aura-display"; // Add ID for easier updating
    auraAmount.textContent = BrainAuraAmount;
    auraAmount.style.fontSize = "28px";
    auraAmount.style.fontWeight = "bold";
    auraAmount.style.color = "hsl(210 40% 98%)"; // White text
    const brainAuraIcon = document.createElement("i");
    brainAuraIcon.className = "aura-icon bx bx-brain";
    brainAuraIcon.style.color = "hsl(221.2 83.2% 53.3%)"; // Primary color from theme
    brainCoin.appendChild(auraAmount);
    brainCoin.appendChild(brainAuraIcon);

    // buy button
    const buyButton = document.createElement("button");
    buyButton.className = "buy";
    buyButton.textContent = "BUY MORE TIME";
    buyButton.style.padding = "10px 20px";
    buyButton.style.fontSize = "18px";
    buyButton.style.backgroundColor = "hsl(221.2 83.2% 53.3%)"; // Primary color from theme
    buyButton.style.color = "white";
    buyButton.style.border = "none";
    buyButton.style.borderRadius = "5px";
    buyButton.style.cursor = "pointer";
    buyButton.style.margin = "15px auto 5px auto";
    buyButton.style.display = "block";
    buyButton.onclick = async function () {
      try {
        // Make POST request to remove coins
        const response = await fetch("http://127.0.0.1:5000/remove_coins", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            amount: 100
          })
        });
        
        if (!response.ok) {
          throw new Error("Failed to purchase time");
        }
        
        const data = await response.json();
        console.log("Purchase response:", data);
        
        // Log full response for debugging
        console.log("Full response data:", JSON.stringify(data));
        
        // If local BrainAuraAmount is at least 100, proceed with purchase
        if (BrainAuraAmount >= 100) {
          // Subtract coins
          BrainAuraAmount = Math.max(0, BrainAuraAmount - 100);
          
          // Add one minute of time
          diddyCoins += 1;
          
          // Update localStorage
          localStorage.setItem("AuraAmount", BrainAuraAmount);
          localStorage.setItem("diddyCoins", diddyCoins);
          
          // Update displays
          const auraAmountElement = document.querySelector("#aura-display");
          if (auraAmountElement) {
            auraAmountElement.textContent = BrainAuraAmount;
          }
          
          // Update time display
          const timeAmountElement = document.querySelector(".time-amount");
          if (timeAmountElement) {
            timeAmountElement.textContent = diddyCoins;
          }
          
          // Purchase successful (no alert)
          console.log("Successfully purchased 1 minute of time!");
        } else {
          console.log("Not enough aura to make this purchase! You need 100 aura, but have " + BrainAuraAmount);
        }
      } catch (error) {
        console.error("Error purchasing time:", error);
        // Error logged to console instead of alert
      }
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
    
    // Label for aura
    const auraLabel = document.createElement("p");
    auraLabel.textContent = "Aura:";
    auraLabel.style.fontWeight = "bold";
    auraLabel.style.margin = "15px 0 0 0";
    auraLabel.style.color = "hsl(210 40% 98%)"; // White text
    
    // Container for aura
    const auraContainer = document.createElement("div");
    auraContainer.style.display = "flex";
    auraContainer.style.justifyContent = "center";
    auraContainer.style.alignItems = "center";
    auraContainer.style.margin = "0";
    auraContainer.appendChild(brainCoin);
    
    // Label for time remaining
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
    
    stackContainer.appendChild(auraLabel);
    stackContainer.appendChild(auraContainer);
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
    mainVisitLink.href = "https://brain-rot-blocker-web-t5i2-git-main-travisboyd884s-projects.vercel.app/dashboard";
    mainVisitLink.textContent = "Earn More Aura";
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

    // Create close button (only visible if time > 0)
    if (currentTime > 0) {
      const closeButtonContainer = document.createElement("div");
      closeButtonContainer.style.position = "absolute";
      closeButtonContainer.style.top = "10px";
      closeButtonContainer.style.right = "10px";
      
      // Create close button
      const closeButton = document.createElement("button");
      closeButton.textContent = "✕";
      closeButton.style.backgroundColor = "transparent";
      closeButton.style.border = "none";
      closeButton.style.color = "hsl(210 40% 98%)";
      closeButton.style.fontSize = "24px";
      closeButton.style.cursor = "pointer";
      closeButton.style.padding = "5px 10px";
      closeButton.style.borderRadius = "5px";
      closeButton.title = "Close popup and continue watching";
      
      // Add hover effect
      closeButton.onmouseover = function() {
        this.style.backgroundColor = "hsla(217.2 91.2% 59.8%, 0.2)";
      };
      closeButton.onmouseout = function() {
        this.style.backgroundColor = "transparent";
      };
      
      // Add click handler to remove popup and blur
      closeButton.onclick = function() {
        const popup = document.getElementById("logo-popup");
        if (popup) {
          popup.remove();
          
          // Remove blur from body elements
          const styleTag = document.createElement('style');
          styleTag.textContent = 'body > * { filter: blur(0px) !important; }';
          document.head.appendChild(styleTag);
          
          // Resume video if it exists
          const video = document.querySelector('video');
          if (video) {
            video.play().catch(e => console.error("Error playing video:", e));
          }
        }
      };
      
      closeButtonContainer.appendChild(closeButton);
      brbBody.appendChild(closeButtonContainer);
    }
    
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
    
    // Track accumulated seconds for diddy coin consumption
    let accumulatedSeconds = 0;
    
    setInterval(() => {
      if (!video.paused) {
        let timeB = Math.floor(video.currentTime);
        let elapsedSeconds = timeB - timeA;
        if (elapsedSeconds < 0 || 2 < elapsedSeconds) {
          elapsedSeconds = 1;
        }
        
        secondsWatched += elapsedSeconds;
        accumulatedSeconds += elapsedSeconds;
        timeA = timeB;

        if (diddyCoins == 0) {
          video.pause();
          console.log("Video paused - out of time");
          showPopup().catch(err => console.error("Error showing popup:", err));
        }
        
        // Every 60 seconds (1 minute) of watching, consume 1 minute of time
        if (accumulatedSeconds >= 60) {
          if (diddyCoins > 0) {
            diddyCoins -= 1;
            localStorage.setItem("diddyCoins", diddyCoins);
          }
          accumulatedSeconds = 0; // Reset accumulated seconds
        }

        console.log(`minutes remaining: ${diddyCoins}`);
        console.log(`secondsWatched: ${secondsWatched} seconds`);
        console.log(`minutesWatched: ${minutesWatched} minutes`);
        console.log(`accumulatedSeconds: ${accumulatedSeconds}`);

        localStorage.setItem("secondsWatched", secondsWatched);
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
  console.log(`minutes remaining: ${diddyCoins}`);
  console.log(`secondsWatched: ${secondsWatched} seconds`);
  console.log(`minutesWatched: ${minutesWatched} minutes`);

  trackYouTubeWatchTime();

  if (diddyCoins == 0) {
    video.pause();
    console.log("Video paused - out of time");
    showPopup().catch(err => console.error("Error showing popup:", err));
  }

  // debug
  video.pause();
  console.log("Video paused");
  showPopup().catch(err => console.error("Error showing popup:", err));
}

setTimeout(mainFunction, 2000); // Delay of 2000 milliseconds (2 seconds)
