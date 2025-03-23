document.addEventListener("DOMContentLoaded", function () {
  // Get DOM elements directly using document.getElementById to avoid any selector issues
  const timeDisplay = document.getElementById("time-amount");
  const auraDisplay = document.getElementById("aura-amount");
  const buyButton = document.querySelector(".buy");
  const visitButton = document.querySelector(".visit-website");

  // Load aura and minutes from localStorage
  let diddyCoins = parseInt(localStorage.getItem("diddyCoins")) || 0;
  let auraAmount = parseInt(localStorage.getItem("AuraAmount")) || 340;

  // Immediately update displays on page load
  updateDisplays();

  // Set up continuous time tracking
  setupTimeTracker();

  // Buy button click handler
  if (buyButton) {
    buyButton.onclick = function() {
      handleBuyTime();
    };
  }

  // Visit website button click handler
  if (visitButton) {
    visitButton.onclick = function() {
      window.open("https://brain-rot-blocker-web-t5i2-git-main-travisboyd884s-projects.vercel.app/dashboard", "_blank");
    };
  }
  
  // Setup a timer to continuously check for time and aura changes in localStorage
  function setupTimeTracker() {
    console.log("Setting up continuous tracker for time and aura");
    
    // Check every 500ms for changes
    setInterval(() => {
      const currentStoredDiddyCoins = parseInt(localStorage.getItem("diddyCoins")) || 0;
      const currentStoredAura = parseInt(localStorage.getItem("AuraAmount")) || 0;
      
      // If values have changed in localStorage, update our local variables and display
      if (currentStoredDiddyCoins !== diddyCoins || currentStoredAura !== auraAmount) {
        console.log("Diddy coins or aura changed in localStorage:", 
          diddyCoins, "->", currentStoredDiddyCoins, 
          auraAmount, "->", currentStoredAura);
        
        diddyCoins = currentStoredDiddyCoins;
        auraAmount = currentStoredAura;
        updateDisplays();
      }
    }, 500);
  }

  // Function to handle buying more time
  async function handleBuyTime() {
    console.log("Buy more time button clicked");
    
    // Check if user has enough aura
    if (auraAmount < 100) {
      console.log("Not enough aura! You need 100 aura, but have " + auraAmount);
      return;
    }
    
    try {
      // Make API request
      const response = await fetch("http://127.0.0.1:5000/remove_coins", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          amount: 100
        })
      });
      
      // Handle API response
      if (!response.ok) {
        throw new Error("API request failed");
      }
      
      const data = await response.json();
      console.log("API response:", data);
      
      // Update values
      auraAmount -= 100;
      diddyCoins += 1; // Increment time by 1 minute (each worth 100 aura)
      
      // Save to localStorage
      localStorage.setItem("AuraAmount", auraAmount);
      localStorage.setItem("diddyCoins", diddyCoins);
      localStorage.removeItem("secondsLeft"); // Remove old time format
      
      // Update displays
      updateDisplays();
      
      // Force the DOM to update and log the current display state
      console.log("After updateDisplays - timeDisplay:", timeDisplay ? timeDisplay.innerHTML : "not available");
      console.log("After updateDisplays - time-amount element:", document.getElementById("time-amount").innerHTML);
      
      // Add a small delay before closing to ensure the DOM updates are applied and localStorage is written
      setTimeout(() => {
        window.close();
      }, 100);
    } catch (error) {
      console.error("Error:", error);
      // Error logged to console instead of alert
    }
  }

  // Function to update displays
  function updateDisplays() {
    console.log("Updating displays with: minutes =", diddyCoins, "auraAmount =", auraAmount);
    
    // Update time display using direct DOM manipulation
    if (timeDisplay) {
      timeDisplay.innerHTML = diddyCoins;
      console.log("Time display updated to:", diddyCoins);
    } else {
      console.error("Time display element not found");
      // Try direct DOM access as fallback
      const fallbackTimeElement = document.getElementById("time-amount");
      if (fallbackTimeElement) {
        fallbackTimeElement.innerHTML = diddyCoins;
        console.log("Fallback time display updated to:", diddyCoins);
      }
    }
    
    // Update aura display using direct DOM manipulation
    if (auraDisplay) {
      auraDisplay.innerHTML = auraAmount;
      console.log("Aura display updated to:", auraAmount);
    } else {
      console.error("Aura display element not found");
      // Try direct DOM access as fallback
      const fallbackAuraElement = document.getElementById("aura-amount");
      if (fallbackAuraElement) {
        fallbackAuraElement.innerHTML = auraAmount;
        console.log("Fallback aura display updated to:", auraAmount);
      }
    }
  }
});