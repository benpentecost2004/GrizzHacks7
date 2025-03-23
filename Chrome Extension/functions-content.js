// variables
let secondsLeft = parseInt(localStorage.getItem("secondsLeft")) || 1200; // 20min
let secondsWatched = parseInt(localStorage.getItem("secondsWatched")) || 0;
let BrainAuraAmount = parseInt(localStorage.getItem("AuraAmount")) || 0;
let video = document.querySelector("video");
let minutesLeft = Math.ceil(secondsLeft / 60);
let minutesWatched = Math.ceil(secondsWatched / 60);

// Base64 encoded logo image for direct use
const LOGO_BASE64_DIRECT = 'iVBORw0KGgoAAAANSUhEUgAAAMgAAABkCAYAAADDhn8LAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAEy2lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSfvu78nIGlkPSdXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQnPz4KPHg6eG1wbWV0YSB4bWxuczp4PSdhZG9iZTpuczptZXRhLyc+CjxyZGY6UkRGIHhtbG5zOnJkZj0naHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyc+CgogPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9JycKICB4bWxuczpBdHRyaWI9J2h0dHA6Ly9ucy5hdHRyaWJ1dGlvbi5jb20vYWRzLzEuMC8nPgogIDxBdHRyaWI6QWRzPgogICA8cmRmOlNlcT4KICAgIDxyZGY6bGkgcmRmOnBhcnNlVHlwZT0nUmVzb3VyY2UnPgogICAgIDxBdHRyaWI6Q3JlYXRlZD4yMDI1LTAzLTIyPC9BdHRyaWI6Q3JlYXRlZD4KICAgICA8QXR0cmliOkV4dElkPjgxZWY2ZDVkLTRjNzAtNDExMC1hNDA2LTNmNGY5MWJmYmZkOTwvQXR0cmliOkV4dElkPgogICAgIDxBdHRyaWI6RmJJZD41MjUyNjU5MTQxNzk1ODA8L0F0dHJpYjpGYklkPgogICAgIDxBdHRyaWI6VG91Y2hUeXBlPjI8L0F0dHJpYjpUb3VjaFR5cGU+CiAgICA8L3JkZjpsaT4KICAgPC9yZGY6U2VxPgogIDwvQXR0cmliOkFkcz4KIDwvcmRmOkRlc2NyaXB0aW9uPgoKIDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PScnCiAgeG1sbnM6ZGM9J2h0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvJz4KICA8ZGM6dGl0bGU+CiAgIDxyZGY6QWx0PgogICAgPHJkZjpsaSB4bWw6bGFuZz0neC1kZWZhdWx0Jz5CcmFpbiBSb3QgQmxvY2tlciAoMjAwIHggMTAwIHB4KSAtIDE8L3JkZjpsaT4KICAgPC9yZGY6QWx0PgogIDwvZGM6dGl0bGU+CiA8L3JkZjpEZXNjcmlwdGlvbj4KCiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0nJwogIHhtbG5zOnBkZj0naHR0cDovL25zLmFkb2JlLmNvbS9wZGYvMS4zLyc+CiAgPHBkZjpBdXRob3I+VHJhdmlzIEJveWQ8L3BkZjpBdXRob3I+CiA8L3JkZjpEZXNjcmlwdGlvbj4=';

// Function to fetch the coins from the API
export async function fetchCoinsFromAPI() {
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
    
    // Update the display if popup already exists
    const auraAmountElement = document.querySelector(".aura-amount");
    if (auraAmountElement) {
      auraAmountElement.textContent = BrainAuraAmount;
      console.log("Updated aura display to:", BrainAuraAmount);
    }
    
    return BrainAuraAmount;
  } catch (error) {
    console.error('Error fetching aura:', error);
    return BrainAuraAmount;
  }
}

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

export async function showPopup() {
  // Check if the popup already exists
  if (document.getElementById("logo-popup")) {
    return;
  }
  
  // Fetch coins from API
  await fetchCoinsFromAPI();

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

  // Create the top bar
  const topbar = document.createElement("div");
  topbar.className = "topbar";
  topbar.style.display = "flex";
  topbar.style.flexDirection = "column";
  topbar.style.alignItems = "center";
  topbar.style.justifyContent = "center";
  
  // Create the title container
  const title = document.createElement("div");
  title.className = "title";
  
  // Function to create a fallback text heading
  function createFallbackHeading() {
    const h1 = document.createElement("h1");
    h1.textContent = "Logo.png";
    h1.style.textAlign = "center";
    h1.style.margin = "10px 0 20px 0";
    return h1;
  }
  
  // Create the logo directly using the base64 data
  try {
    // Create the image element
    const logoImg = document.createElement("img");
    
    // Set image properties
    logoImg.alt = "Logo";
    logoImg.style.maxWidth = "250px";
    logoImg.style.height = "auto";
    logoImg.style.display = "block";
    logoImg.style.margin = "10px auto 20px auto";
    
    // Set the src to the data URL directly
    logoImg.src = 'data:image/png;base64,' + LOGO_BASE64_DIRECT;
    console.log("Using base64 encoded logo data");
    
    // Add image to title container
    title.appendChild(logoImg);
    
    // Log success
    logoImg.onload = function() {
      console.log("Logo image loaded successfully from base64 data");
    };
    
    // Add error handling for the image
    logoImg.onerror = function() {
      console.error("Failed to load logo image from base64 data, trying URL...");
      
      try {
        // Try using chrome.runtime.getURL as backup
        const logoUrl = chrome.runtime.getURL("Logo.png");
        console.log("Trying logo URL:", logoUrl);
        logoImg.src = logoUrl;
      } catch (e) {
        console.error("All image loading methods failed:", e);
        title.innerHTML = ""; // Clear any previous content
        title.appendChild(createFallbackHeading());
      }
    };
  } catch (error) {
    console.error("Error setting up logo image:", error);
    title.appendChild(createFallbackHeading());
  }
  
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

  // aura
  const brainCoin = document.createElement("div");
  brainCoin.className = "aura";
  const auraAmount = document.createElement("p");
  auraAmount.className = "aura-amount";
  auraAmount.textContent = BrainAuraAmount; // This will now use the fetched amount
  auraAmount.id = "aura-display"; // Add ID for easier updating
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
        
        // Add time (1 minute = 60 seconds)
        secondsLeft += 60;
        
        // Update localStorage
        localStorage.setItem("AuraAmount", BrainAuraAmount);
        localStorage.setItem("secondsLeft", secondsLeft);
        
        // Update display if element exists
        const auraAmountElement = document.querySelector(".aura-amount");
        if (auraAmountElement) {
          auraAmountElement.textContent = BrainAuraAmount;
        }
        
        // Show confirmation
        alert("Successfully purchased 1 minute of time!");
      } else {
        alert("Not enough aura to make this purchase! You need 100 aura, but have " + BrainAuraAmount);
      }
    } catch (error) {
      console.error("Error purchasing time:", error);
      alert("Error purchasing time. Please try again later.");
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
  
  // Container for aura
  const auraContainer = document.createElement("div");
  auraContainer.style.display = "flex";
  auraContainer.style.justifyContent = "center";
  auraContainer.style.alignItems = "center";
  auraContainer.style.margin = "0";
  auraContainer.appendChild(brainCoin);
  
  // Label for time
  const timeLabel = document.createElement("p");
  timeLabel.textContent = "Time Remaining:";
  timeLabel.style.fontWeight = "bold";
  timeLabel.style.margin = "10px 0 0 0";
  
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

  // Add elements to popup
  brbBody.appendChild(topbar);
  brbBody.appendChild(main);
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
