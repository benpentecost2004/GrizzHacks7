// directly from the repo from iamOmarFaruk

// Content script for Hello World Extension

(function () {
  // Check if the popup already exists
  if (document.getElementById("hello-world-extension-popup")) {
    return;
  }

  // Layout containing styles and HTML template for the popup
  const layout = {
    styles: `
            .hello-world-popup {
                position: fixed;
                top: 0px;
                right: 0px;
                height: 100vh;
                width: 100vw;
                justify-content: center;
                background-color: rgba(0, 0, 0, .5);
                color: #333333;
                padding: 15px 25px;
                border-radius: 20px;
                box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
                z-index: 10000;
                font-family: Arial, sans-serif;
                font-size: 16px;
                text-align: center;
                transition: opacity 0.3s ease-in-out;
            }

            .hello-world-popup h2 {
                margin: 0 0 10px;
                font-size: 22px;
                color: #4285f4;
            }

            .hello-world-popup p {
                margin: 0;
            }

            .hello-world-popup button {
                background-color: #4285f4;
                color: white;
                border: none;
                border-radius: 10px;
                padding: 8px 16px;
                margin-top: 15px;
                cursor: pointer;
                font-weight: bold;
            }
        `,
  };

  // Add styles to the document
  const styleSheet = document.createElement("style");
  styleSheet.textContent = layout.styles;
  document.head.appendChild(styleSheet);

  // Create the popup element using DOM manipulation
  const popup = document.createElement("div");
  popup.className = "hello-world-popup";
  popup.id = "hello-world-extension-popup";

  // Create the content inside the popup
  const h2 = document.createElement("h2");
  h2.textContent = "Hello World!";
  popup.appendChild(h2);

  const p = document.createElement("p");
  p.textContent = "This popup was created by the Chrome extension";
  popup.appendChild(p);

  // Create the close button
  const button = document.createElement("button");
  button.id = "close-popup";
  button.textContent = "Close";
  popup.appendChild(button);

  // Add the popup to the body
  document.body.appendChild(popup);

  // Add event listener to close button
  document.getElementById("close-popup").addEventListener("click", function () {
    const popup = document.getElementById("hello-world-extension-popup");
    popup.style.opacity = "0";

    setTimeout(() => {
      document.body.removeChild(popup);
      document.head.removeChild(styleSheet);
    }, 300);
  });
})();

// "default_popup": "popup.html",
//   "js": ["content.js"]
