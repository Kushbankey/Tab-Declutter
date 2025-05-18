// This is the service worker script.

chrome.runtime.onInstalled.addListener(() => {
  console.log("Tab Declutter Tool installed.");
  // You can set up initial storage values here if needed
});

// Listen for messages from the popup or content scripts (if any)
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("Message received in background.js:", request);

  if (request.action === "getTabs") {
    chrome.tabs.query({}, (tabs) => {
      sendResponse({ tabs: tabs });
    });
    return true; // Indicates you wish to send a response asynchronously
  }

  // Add more message handlers as needed
});

// Example: Listen for tab updates to potentially refresh popup data
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" || changeInfo.url) {
    // console.log(`Tab ${tabId} was updated`, tab);
    // You might want to send a message to the popup if it's open
  }
});

chrome.tabs.onRemoved.addListener((tabId, removeInfo) => {
  // console.log(`Tab ${tabId} was removed`);
  // You might want to send a message to the popup if it's open
});

console.log("Background service worker started.");
