// i.e. all in JS not ported to an HTML file
// directly from the repo from the iamOmarFaruk
// Background script for Hello World Extension

// Listen for the extension icon to be clicked
chrome.action.onClicked.addListener((tab) => {
  // Get the current tab ID
  const tabId = tab.id;

  // Inject the content script into the current tab
  chrome.scripting.executeScript({
    target: { tabId: tabId },
    files: ["content2.js"],
    world: "MAIN",
  });

  console.log(`Content script injected into tab ${tabId}`);
});
