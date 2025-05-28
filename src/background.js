// This is the service worker script.

let extensionTabId = null;
let extensionWindowId = null; // To store the ID of the dedicated window
// const extensionPageUrl = chrome.runtime.getURL("index.html"); // Original URL
const detachedExtensionPageUrl = chrome.runtime.getURL(
  "index.html?view=detached"
); // URL for detached view
const popupExtensionPageUrl = chrome.runtime.getURL("index.html"); // Standard URL for focusing existing tab if not detached initially

const DETACHED_WINDOW_WIDTH = 1000; // Increased width to accommodate help panel
const DETACHED_WINDOW_HEIGHT = 700;

// Optional: Listener for when the extension is installed/updated
chrome.runtime.onInstalled.addListener(() => {});

function openExtensionInNewWindow() {
  chrome.windows.create(
    {
      url: detachedExtensionPageUrl, // Use the URL with query param
      type: "popup", // This type is fine, our logic will differentiate via URL query
      focused: true,
      width: DETACHED_WINDOW_WIDTH,
      height: DETACHED_WINDOW_HEIGHT,
    },
    (newWindow) => {
      if (
        newWindow &&
        newWindow.tabs &&
        newWindow.tabs[0] &&
        newWindow.tabs[0].id
      ) {
        extensionWindowId = newWindow.id;
        extensionTabId = newWindow.tabs[0].id;
      } else if (chrome.runtime.lastError) {
        console.error(
          "[TabDeclutter] Error creating new window:",
          chrome.runtime.lastError.message
        );
        // Reset IDs if creation failed
        extensionWindowId = null;
        extensionTabId = null;
      }
    }
  );
}

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "openInNewTab") {
    // Action name kept for consistency with popup

    if (extensionWindowId !== null) {
      chrome.windows.get(
        extensionWindowId,
        { populate: true },
        (existingWindow) => {
          if (chrome.runtime.lastError || !existingWindow) {
            extensionWindowId = null;
            extensionTabId = null;
            openExtensionInNewWindow(); // Create a new one
          } else {
            chrome.windows.update(extensionWindowId, { focused: true });
            // Also ensure the specific tab is active and has the correct URL
            if (extensionTabId) {
              chrome.tabs.update(
                extensionTabId,
                { active: true, url: detachedExtensionPageUrl }, // Ensure it focuses/reopens the detached view URL
                (tab) => {
                  if (chrome.runtime.lastError) {
                    console.warn(
                      `[TabDeclutter] Could not update tab ${extensionTabId} in existing window: ${chrome.runtime.lastError.message}. It might have been closed.`
                    );
                    // If the specific tab is gone, we might want to open a new one in this window or just focus the window.
                    // For now, just focusing the window is handled above.
                  }
                }
              );
            } else {
              // If extensionTabId was somehow lost, try to open it again in the existing window
              console.warn(
                `[TabDeclutter] extensionTabId was null for existing window ${extensionWindowId}. Attempting to open page in it.`
              );
              chrome.tabs.create(
                {
                  windowId: extensionWindowId,
                  url: detachedExtensionPageUrl, // Open with detached view URL if tab was lost
                  active: true,
                },
                (newTabInExistingWindow) => {
                  if (newTabInExistingWindow && newTabInExistingWindow.id) {
                    extensionTabId = newTabInExistingWindow.id;
                  } else if (chrome.runtime.lastError) {
                    console.error(
                      `[TabDeclutter] Failed to create new tab in existing window ${extensionWindowId}: ${chrome.runtime.lastError.message}`
                    );
                  }
                }
              );
            }
          }
        }
      );
    } else {
      openExtensionInNewWindow();
    }
    return false; // Not sending an async response
  } else if (request.action === "getDetachedWindowState") {
    sendResponse({ detachedWindowId: extensionWindowId });
    return false; // Synchronous response
  }
});

chrome.tabs.onRemoved.addListener((tabId, removeInfo) => {
  if (tabId === extensionTabId) {
    // If the specific tab is closed, we consider the detached state ended.
    // The window might still be open with other tabs.
    extensionTabId = null;
    // extensionWindowId = null; // Optional: Uncomment if closing the main tab should forget the window too.
    // Leaving it commented means if user opens another tab in that window, then closes our main tab,
    // clicking detach again would re-open our page in THAT window, not a new one.
    // If the whole window is closed, windows.onRemoved will handle clearing extensionWindowId.
  }
});

// Listener for when a window is closed
chrome.windows.onRemoved.addListener((closedWindowId) => {
  if (closedWindowId === extensionWindowId) {
    extensionWindowId = null;
    extensionTabId = null; // Ensure tabId is also cleared
  }
});
