import { useState, useEffect, useCallback, useRef } from "react";
import { DisplayTab, WindowWithTabs } from "../types";

export const useTabManagement = () => {
  const [groupedTabsByWindow, setGroupedTabsByWindow] = useState<
    WindowWithTabs[]
  >([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true); // Start with loading true
  const isFetchingRef = useRef<boolean>(false);
  const extensionWindowIdRef = useRef<number | null>(null);

  const getDomain = useCallback((url: string | undefined): string => {
    if (!url) return "Other";
    try {
      const parsedUrl = new URL(url);
      if (parsedUrl.protocol === "file:") return "Local Files";
      if (parsedUrl.protocol === "chrome:") return "Chrome Internal";
      if (parsedUrl.hostname === "newtab") return "New Tab";
      return parsedUrl.hostname.replace(/^www\./, "");
    } catch (_e) {
      return "Other";
    }
  }, []);

  const transformTabsForDisplay = useCallback(
    (tabs: chrome.tabs.Tab[]): DisplayTab[] => {
      return tabs.map((tab) => ({
        id: tab.id!,
        favIconUrl: tab.favIconUrl,
        category: getDomain(tab.url),
        title: `${tab.pinned ? "📌 " : ""}${tab.title || "Untitled Tab"}`,
        status: tab.active ? "Active" : "Inactive",
        originalTab: tab,
      }));
    },
    [getDomain]
  );

  const fetchAndProcessTabs = useCallback(
    async (
      setActiveWindowAccordionId?: (id: number | null) => void,
      setSelectedTabIds?: (ids: Set<number>) => void
    ) => {
      if (isFetchingRef.current) return;
      isFetchingRef.current = true;
      setIsLoading(true);
      setError(null);
      if (setActiveWindowAccordionId) setActiveWindowAccordionId(null);
      if (setSelectedTabIds) setSelectedTabIds(new Set());

      let currentPopupExtensionWindowId: number | undefined = undefined;
      try {
        if (chrome.windows && typeof chrome.windows.getCurrent === "function") {
          const currentExtensionWindow = await chrome.windows.getCurrent();
          if (currentExtensionWindow?.id) {
            currentPopupExtensionWindowId = currentExtensionWindow.id;
            extensionWindowIdRef.current = currentExtensionWindow.id;
          }
        }

        // Assuming chrome APIs are available
        if (!(chrome.tabs && chrome.windows && chrome.tabGroups)) {
          console.warn(
            "[TabDeclutter Popup] Chrome API not available. Cannot fetch tabs."
          );
          setError("Chrome API not available. Cannot fetch tabs.");
          setIsLoading(false);
          isFetchingRef.current = false;
          setGroupedTabsByWindow([]); // Ensure it's an empty array
          return;
        }

        const allNormalWindows = await chrome.windows.getAll({
          populate: true,
          windowTypes: ["normal"],
        });

        const processedWindows: WindowWithTabs[] = allNormalWindows
          .filter((win) => win.id !== currentPopupExtensionWindowId)
          .map((win, index) => {
            const tabs = win.tabs ? transformTabsForDisplay(win.tabs) : [];
            let windowName = `Window ${index + 1}`;
            if (win.focused && win.tabs && win.tabs.length > 0) {
              const activeTabInWindow = win.tabs.find((t) => t.active);
              if (activeTabInWindow && activeTabInWindow.title) {
                windowName = `${activeTabInWindow.title.substring(0, 30)}... (${
                  tabs.length
                } tabs)`;
              } else {
                windowName = `Window ${index + 1} (${tabs.length} tabs)`;
              }
            } else if (win.tabs && win.tabs.length > 0) {
              windowName = `Window ${index + 1} (${tabs.length} tabs)`;
            } else {
              windowName = `Window ${index + 1} (Empty)`;
            }
            return {
              windowId: win.id!,
              windowName: windowName,
              tabs: tabs,
              isFocused: win.focused || false,
            };
          });

        setGroupedTabsByWindow(processedWindows);
        if (setActiveWindowAccordionId && processedWindows.length > 0) {
          const focusedWindow = processedWindows.find((w) => w.isFocused);
          setActiveWindowAccordionId(
            focusedWindow
              ? focusedWindow.windowId
              : processedWindows[0].windowId
          );
        }
      } catch (e) {
        console.error(
          "[TabDeclutter Popup] Error fetching/processing tabs:",
          e
        );
        setError(`Error: ${e instanceof Error ? e.message : String(e)}`);
        setGroupedTabsByWindow([]); // Ensure it's an empty array on error
      } finally {
        setIsLoading(false);
        isFetchingRef.current = false;
      }
    },
    [getDomain, transformTabsForDisplay]
  );

  useEffect(() => {
    // Initial fetch. Pass null for setters as they are not available here yet,
    // App.tsx will call fetchAndProcessTabs again with setters once it has them.
    fetchAndProcessTabs();
  }, [fetchAndProcessTabs]); // fetchAndProcessTabs is stable due to useCallback

  useEffect(() => {
    if (!chrome.tabs || !chrome.runtime || !chrome.tabGroups) return;

    const commonListenerLogic = () => fetchAndProcessTabs(); // App will manage active accordion and selection state

    const tabUpdateListener = (
      _tabId: number,
      changeInfo: chrome.tabs.TabChangeInfo,
      tab: chrome.tabs.Tab
    ) => {
      if (
        changeInfo.pinned !== undefined ||
        changeInfo.groupId !== undefined ||
        changeInfo.url ||
        (changeInfo.status === "complete" && tab.title)
      ) {
        fetchAndProcessTabs();
      }
    };

    chrome.tabs.onUpdated.addListener(tabUpdateListener);
    chrome.tabs.onRemoved.addListener(commonListenerLogic);
    chrome.tabs.onCreated.addListener(commonListenerLogic);
    chrome.tabs.onMoved.addListener(commonListenerLogic);
    chrome.tabs.onAttached.addListener(commonListenerLogic);
    chrome.tabs.onDetached.addListener(commonListenerLogic);
    chrome.tabGroups.onCreated.addListener(commonListenerLogic);
    chrome.tabGroups.onRemoved.addListener(commonListenerLogic);
    chrome.tabGroups.onUpdated.addListener(commonListenerLogic);
    chrome.windows.onFocusChanged.addListener(commonListenerLogic); // Potentially refresh to update focused window style
    chrome.windows.onRemoved.addListener(commonListenerLogic);
    chrome.windows.onCreated.addListener(commonListenerLogic);

    return () => {
      chrome.tabs.onUpdated.removeListener(tabUpdateListener);
      chrome.tabs.onRemoved.removeListener(commonListenerLogic);
      chrome.tabs.onCreated.removeListener(commonListenerLogic);
      chrome.tabs.onMoved.removeListener(commonListenerLogic);
      chrome.tabs.onAttached.removeListener(commonListenerLogic);
      chrome.tabs.onDetached.removeListener(commonListenerLogic);
      chrome.tabGroups.onCreated.removeListener(commonListenerLogic);
      chrome.tabGroups.onRemoved.removeListener(commonListenerLogic);
      chrome.tabGroups.onUpdated.removeListener(commonListenerLogic);
      chrome.windows.onFocusChanged.removeListener(commonListenerLogic);
      chrome.windows.onRemoved.removeListener(commonListenerLogic);
      chrome.windows.onCreated.removeListener(commonListenerLogic);
    };
  }, [fetchAndProcessTabs]);

  return {
    groupedTabsByWindow,
    isLoading,
    error,
    fetchAndProcessTabs,
    extensionWindowIdRef,
  };
};
