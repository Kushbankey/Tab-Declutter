import { useState, useEffect, useCallback, useRef } from "react";
import { DisplayTab, WindowWithTabs, TabGroupForFilter } from "../types";

export const useTabManagement = () => {
  const [groupedTabsByWindow, setGroupedTabsByWindow] = useState<
    WindowWithTabs[]
  >([]);
  const [availableTabGroups, setAvailableTabGroups] = useState<
    TabGroupForFilter[]
  >([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const isFetchingRef = useRef<boolean>(false);
  const extensionWindowIdRef = useRef<number | null>(null);

  const getDomain = useCallback((url: string | undefined): string => {
    if (!url) return "Other";
    try {
      const parsedUrl = new URL(url);
      if (parsedUrl.protocol === "file:") return "Local Files";
      if (parsedUrl.protocol === "chrome:") {
        if (parsedUrl.hostname === "newtab") return "New Tab";
        return "Chrome Internal"; // More specific for other chrome:// pages
      }
      return parsedUrl.hostname.replace(/^www\./, "");
    } catch (_e) {
      return "Other";
    }
  }, []);

  // This is now a synchronous transformation of basic tab data.
  // Group details will be added in a subsequent step.
  const transformBasicTabInfo = useCallback(
    (tabs: chrome.tabs.Tab[]): DisplayTab[] => {
      return tabs.map((tab) => ({
        id: tab.id!,
        favIconUrl: tab.favIconUrl,
        category: getDomain(tab.url),
        title: `${tab.pinned ? "📌 " : ""}${tab.title || "Untitled Tab"}`,
        status: tab.discarded ? "Inactive" : "Active",
        originalTab: tab,
        groupId: tab.groupId === -1 ? undefined : tab.groupId, // Store groupId, undefined if -1
        // groupName and groupColor will be populated later
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

        if (!(chrome.tabs && chrome.windows && chrome.tabGroups)) {
          console.warn(
            "[TabDeclutter Popup] Chrome API not available. Cannot fetch tabs."
          );
          setError("Chrome API not available. Cannot fetch tabs.");
          setIsLoading(false);
          isFetchingRef.current = false;
          setGroupedTabsByWindow([]);
          return;
        }

        const allNormalWindows = await chrome.windows.getAll({
          populate: true,
          windowTypes: ["normal"],
        });

        // Step 1: Collect all tabs and their basic info, identify all unique group IDs
        let allDisplayTabs: DisplayTab[] = [];
        const uniqueGroupIds = new Set<number>();

        const preliminaryWindowsData = allNormalWindows
          .filter((win) => win.id !== currentPopupExtensionWindowId)
          .map((win) => {
            const tabs = win.tabs ? transformBasicTabInfo(win.tabs) : [];
            tabs.forEach((tab) => {
              if (tab.groupId) {
                uniqueGroupIds.add(tab.groupId);
              }
            });
            allDisplayTabs = allDisplayTabs.concat(tabs); // Collect all tabs for group info enrichment
            return {
              windowId: win.id!,
              windowName: "", // Will be set later
              tabs: tabs, // These are preliminary tabs
              isFocused: win.focused || false,
              originalTotalTabs: tabs.length,
            };
          });

        // Step 2: Fetch details for all unique tab groups
        const tabGroupsMap = new Map<number, chrome.tabGroups.TabGroup>();
        if (chrome.tabGroups && uniqueGroupIds.size > 0) {
          const groupPromises: Promise<chrome.tabGroups.TabGroup | null>[] = [];
          uniqueGroupIds.forEach((groupId) => {
            groupPromises.push(
              chrome.tabGroups.get(groupId).catch((err) => {
                console.warn(
                  `[TabDeclutter] Could not fetch group info for ID ${groupId}:`,
                  err
                );
                return null; // Return null on error to not break Promise.all
              })
            );
          });
          const resolvedGroups = await Promise.all(groupPromises);
          resolvedGroups.forEach((group) => {
            if (group) {
              tabGroupsMap.set(group.id, group);
            }
          });
        }

        // Step 3.A: Prepare availableTabGroups for filtering dropdown
        // Use a Map to collect unique group names and their first encountered color
        const uniqueNamedGroups = new Map<string, TabGroupForFilter>();
        tabGroupsMap.forEach((group) => {
          if (group.title && !uniqueNamedGroups.has(group.title)) {
            uniqueNamedGroups.set(group.title, {
              id: group.title, // Use the group NAME as the ID for filtering purposes
              name: group.title,
              color: group.color,
            });
          }
        });

        const dynamicGroupFilters: TabGroupForFilter[] = Array.from(
          uniqueNamedGroups.values()
        );
        // Sort dynamic groups alphabetically by name
        dynamicGroupFilters.sort((a, b) => a.name.localeCompare(b.name));

        setAvailableTabGroups([
          { id: "all", name: "All Groups" },
          { id: "none", name: "Ungrouped Tabs" },
          ...dynamicGroupFilters,
        ]);

        // Step 3.B: Enrich tabs with group details and finalize window names
        let windowCounter = 1;
        const processedWindows: WindowWithTabs[] = preliminaryWindowsData.map(
          (winData) => {
            const enrichedTabs = winData.tabs.map((tab) => {
              if (tab.groupId && tabGroupsMap.has(tab.groupId)) {
                const groupInfo = tabGroupsMap.get(tab.groupId)!;
                return {
                  ...tab,
                  groupName: groupInfo.title,
                  groupColor: groupInfo.color,
                };
              }
              return tab;
            });

            let windowName = `Window ${windowCounter++}`;
            if (winData.isFocused) {
              windowName += " (Current)";
            }

            return {
              ...winData,
              windowName: windowName,
              tabs: enrichedTabs,
            };
          }
        );

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
        setGroupedTabsByWindow([]);
      } finally {
        setIsLoading(false);
        isFetchingRef.current = false;
      }
    },
    [getDomain, transformBasicTabInfo] // transformBasicTabInfo is now a dependency
  );

  useEffect(() => {
    fetchAndProcessTabs();
  }, [fetchAndProcessTabs]);

  useEffect(() => {
    if (!chrome.tabs || !chrome.runtime || !chrome.tabGroups) return;

    // Common listener logic now simply refetches all data
    // The App.tsx will manage active accordion and selection state based on the new data.
    const commonListenerLogic = () => fetchAndProcessTabs();

    const tabUpdateListener = (
      _tabId: number,
      changeInfo: chrome.tabs.TabChangeInfo,
      tab: chrome.tabs.Tab // The tab object is provided here by the event
    ) => {
      // More specific checks: title, pinned, groupId, status (for loading complete), or URL changes
      if (
        changeInfo.pinned !== undefined ||
        changeInfo.groupId !== undefined ||
        changeInfo.url ||
        (changeInfo.status === "complete" && tab.title) || // Ensure title is also present for status complete
        changeInfo.title !== undefined || // Explicitly check for title changes
        changeInfo.discarded !== undefined || // Check for discarded changes
        changeInfo.favIconUrl !== undefined // Check for favicon changes
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
    chrome.windows.onFocusChanged.addListener(commonListenerLogic);
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
  }, [fetchAndProcessTabs]); // fetchAndProcessTabs is stable

  return {
    groupedTabsByWindow,
    isLoading,
    error,
    fetchAndProcessTabs,
    extensionWindowIdRef,
    availableTabGroups,
  };
};
