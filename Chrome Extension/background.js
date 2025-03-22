
// stuff for content2.js
// chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//   if (request.action === "getPopupHtml") {
//     fetch(chrome.runtime.getURL("popup.html"))
//       .then((response) => response.text())
//       .then((html) => {
//         sendResponse({ html: html });
//       })
//       .catch((err) => {
//         sendResponse({ error: err.message });
//       });
//     return true; // Keep the message channel open until sendResponse is called
//   }
// });

chrome.action.onClicked.addListener((tab) => {
  // Get the current tab ID
  const tabId = tab.id;

  // Inject the content script into the current tab
  chrome.scripting.executeScript({
    target: { tabId: tabId },
    files: ["content1.js"],
    world: "MAIN",
  });

  console.log(`Content script injected into tab ${tabId}`);
});
