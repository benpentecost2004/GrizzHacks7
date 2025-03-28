// i.e. all in JS not ported to an HTML file
// directly from the repo from the iamOmarFaruk
// Background script for Hello World Extension

// Listen for the extension icon to be clicked
chrome.action.onClicked.addListener((tab) => {
  const tabId = tab.id;
  console.log(`Clicked on the icon in tab ${tabId}`);

  chrome.scripting.executeScript({
    target: { tabId: tabId },
    files: ["background-content.js"],
    world: "MAIN",
  });

  console.log(`Content script injected into tab ${tabId}`);
});
