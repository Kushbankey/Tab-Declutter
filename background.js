// const TAB_DECLUTTER_WINDOW_URL = chrome.runtime.getURL("index.html"); // No longer needed
// let tabDeclutterWindowId = null; // No longer needed

// Optional: Listener for when the extension is installed/updated
chrome.runtime.onInstalled.addListener(() => {
  console.log(
    "[TabDeclutter] Extension installed/updated. UI will open as standard popup."
  );
  // You can add any first-time setup logic here if needed
});

// The chrome.action.onClicked listener that created a separate window has been removed.
// When default_popup is set in manifest.json, the onClicked event does not fire.
