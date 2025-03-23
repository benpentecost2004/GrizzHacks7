document.addEventListener("DOMContentLoaded", function () {
  // Get DOM elements directly using document.getElementById to avoid any selector issues
  const timeDisplay = document.getElementById("time-amount");
  const auraDisplay = document.getElementById("aura-amount");
  const buyButton = document.querySelector(".buy");
  const visitButton = document.querySelector(".visit-website");

  // Load values from localStorage
  let secondsLeft = parseInt(localStorage.getItem("secondsLeft")) || 1200;
  let auraAmount = parseInt(localStorage.getItem("AuraAmount")) || 340;

  // Immediately update displays on page load
  updateDisplays();

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

  // Function to handle buying time
  async function handleBuyTime() {
    console.log("Buy time button clicked");
    
    // Check if user has enough aura
    if (auraAmount < 100) {
      alert("Not enough aura! You need 100 aura, but have " + auraAmount);
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
      secondsLeft += 60;
      
      // Save to localStorage
      localStorage.setItem("AuraAmount", auraAmount);
      localStorage.setItem("secondsLeft", secondsLeft);
      
      // Force DOM update
      updateDisplays();
      
      // Confirm purchase
      alert("Successfully purchased 1 minute of time!");
    } catch (error) {
      console.error("Error:", error);
      alert("Error purchasing time. Please try again.");
    }
  }

  // Function to update displays
  function updateDisplays() {
    console.log("Updating displays with: secondsLeft =", secondsLeft, "auraAmount =", auraAmount);
    
    // Calculate minutes
    const minutesLeft = Math.ceil(secondsLeft / 60);
    
    // Update time display using direct DOM manipulation
    if (timeDisplay) {
      timeDisplay.innerHTML = minutesLeft;
      console.log("Time display updated to:", minutesLeft);
    } else {
      console.error("Time display element not found");
      // Try direct DOM access as fallback
      const fallbackTimeElement = document.getElementById("time-amount");
      if (fallbackTimeElement) {
        fallbackTimeElement.innerHTML = minutesLeft;
        console.log("Fallback time display updated to:", minutesLeft);
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