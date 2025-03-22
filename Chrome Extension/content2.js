(function () {
  // Check if the popup already exists
  if (document.getElementById("hello-world-extension-popup")) {
    console.log("Popup already exists.");
    return;
  }

  // Send a message to the background script to fetch the HTML content
  chrome.runtime.sendMessage({ action: "getPopupHtml" }, (response) => {
    if (response && response.html) {
      console.log("Popup HTML loaded successfully");

      // Create a div and set its innerHTML to the loaded HTML
      const popup = document.createElement("div");
      popup.innerHTML = response.html;

      // Append the popup to the body
      document.body.appendChild(popup);

      // Add event listener to close button
      document
        .getElementById("close-popup")
        .addEventListener("click", function () {
          const popup = document.getElementById("hello-world-extension-popup");
          popup.style.opacity = "0";

          setTimeout(() => {
            document.body.removeChild(popup);
          }, 300);
        });
    } else {
      console.error(
        "Failed to load popup HTML:",
        response ? response.error : "Unknown error"
      );
    }
  });
})();
