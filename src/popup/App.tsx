import { useState, useEffect, useCallback, useRef } from "react";
import TabCard from "./TabCard.tsx";
import SearchBar from "./SearchBar";
import GroupTabs from "./GroupTabs";
import "./index.css";

export interface TabGroup {
  id: string;
  title: string;
  tabs: chrome.tabs.Tab[];
  chromeGroupId?: number;
  collapsed?: boolean;
}

type TabViewMode = "currentWindow" | "allWindows";

function App() {
  const [allTabs, setAllTabs] = useState<chrome.tabs.Tab[]>([]); // Stores all tabs based on current view mode query
  const [groupedTabs, setGroupedTabs] = useState<TabGroup[]>([]);
  const [searchFilteredTabs, setSearchFilteredTabs] = useState<
    chrome.tabs.Tab[]
  >([]);
  const [error, setError] = useState<string | null>(null);
  const [activeSearchQuery, setActiveSearchQuery] = useState<string>("");
  const [tabViewMode, setTabViewMode] = useState<TabViewMode>("currentWindow");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const isFetchingRef = useRef<boolean>(false);

  // State for managing the group naming input - RESTORED
  const [groupToNameDetails, setGroupToNameDetails] = useState<{
    originalName: string;
    tabIds: number[];
  } | null>(null);
  const [customGroupNameInput, setCustomGroupNameInput] = useState<string>("");

  const getDomain = useCallback((url: string | undefined): string => {
    if (!url) return "Other";
    try {
      const parsedUrl = new URL(url);
      if (parsedUrl.protocol === "file:") return "Local Files";
      if (parsedUrl.protocol === "chrome:") return "Chrome Internal";
      if (parsedUrl.hostname === "newtab") return "New Tab";
      return parsedUrl.hostname.replace(/^www\./, "");
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_e) {
      return "Other";
    }
  }, []); // Empty dependency array to stabilize the function reference

  const groupTabsByDomain = useCallback(
    (
      tabsToGroup: chrome.tabs.Tab[],
      currentChromeGroups: chrome.tabGroups.TabGroup[] = []
    ): TabGroup[] => {
      const logicalGroups: {
        [key: string]: {
          tabs: chrome.tabs.Tab[];
          chromeGroupId?: number;
          title?: string;
        };
      } = {};

      // First, populate groups based on existing Chrome tab groups
      currentChromeGroups.forEach((cg) => {
        const groupIdStr = `chrome-group-${cg.id}`;
        logicalGroups[groupIdStr] = {
          tabs: [],
          chromeGroupId: cg.id,
          title: cg.title || `Group ${cg.id}`, // Use Chrome group title or a default
        };
      });

      tabsToGroup.forEach((tab) => {
        if (tab.groupId !== -1) {
          // Tab is already in a Chrome group
          const groupIdStr = `chrome-group-${tab.groupId}`;
          if (logicalGroups[groupIdStr]) {
            logicalGroups[groupIdStr].tabs.push(tab);
          } else {
            // This case might happen if a tab is in a group not returned by chrome.tabGroups.query (unlikely but good to be aware)
            // Or if our initial currentChromeGroups fetch was incomplete.
            // For now, we'll create a placeholder if it doesn't exist, though ideally it should.
            const unknownGroupTitle = `Chrome Group ${tab.groupId}`;
            if (!logicalGroups[groupIdStr]) {
              logicalGroups[groupIdStr] = {
                tabs: [],
                chromeGroupId: tab.groupId,
                title: unknownGroupTitle,
              };
            }
            logicalGroups[groupIdStr].tabs.push(tab);
          }
        } else if (tab.pinned) {
          const pinnedGroupName = `📌 Pinned`;
          if (!logicalGroups[pinnedGroupName]) {
            logicalGroups[pinnedGroupName] = {
              tabs: [],
              title: pinnedGroupName,
            };
          }
          logicalGroups[pinnedGroupName].tabs.push(tab);
        } else {
          // Ungrouped and not pinned, group by domain
          const domain = getDomain(tab.url);
          if (!logicalGroups[domain]) {
            logicalGroups[domain] = { tabs: [], title: domain };
          }
          logicalGroups[domain].tabs.push(tab);
        }
      });

      return Object.entries(logicalGroups)
        .map(([id, groupData]) => ({
          id: id, // This could be domain or `chrome-group-${id}`
          title: groupData.title || id, // Use existing title or default to id
          tabs: groupData.tabs,
          chromeGroupId: groupData.chromeGroupId,
          collapsed: groupData.chromeGroupId !== undefined, // Collapse existing Chrome groups by default
        }))
        .filter((group) => group.tabs.length > 0) // Only keep groups that have tabs
        .sort((a, b) => {
          if (a.title === "📌 Pinned") return -1;
          if (b.title === "📌 Pinned") return 1;
          if (a.chromeGroupId && !b.chromeGroupId) return -1; // Existing chrome groups first
          if (!a.chromeGroupId && b.chromeGroupId) return 1;
          return a.title.localeCompare(b.title); // Then sort by title
        });
    },
    [getDomain]
  );

  const fetchAndProcessTabs = useCallback(
    async (mode: TabViewMode) => {
      if (isFetchingRef.current) {
        console.warn(
          `[TabDeclutter] fetchAndProcessTabs called with mode: ${mode} while already fetching. Skipping.`
        );
        return;
      }

      console.log(
        `[TabDeclutter] fetchAndProcessTabs PROCEEDING with mode: ${mode}. Setting isLoading=true.`
      );
      isFetchingRef.current = true;
      setIsLoading(true);
      setError(null);

      try {
        if (!(chrome.tabs && chrome.tabs.query)) {
          console.warn(
            "[TabDeclutter] Chrome API not available. Using mock data."
          );
          const mockTabs: chrome.tabs.Tab[] = [
            {
              id: 1,
              index: 0,
              windowId: 1,
              title: "Mock Example 1 (current window)",
              url: "https://example.com/page1",
              favIconUrl: "icon.png",
              pinned: false,
              active: true,
              highlighted: true,
              selected: true,
              incognito: false,
              discarded: false,
              autoDiscardable: true,
              groupId: -1,
            },
            {
              id: 2,
              index: 1,
              windowId: 1,
              title: "Mock Example 2 (current window)",
              url: "https://example.com/page2",
              favIconUrl: "icon.png",
              pinned: false,
              active: false,
              highlighted: false,
              selected: false,
              incognito: false,
              discarded: false,
              autoDiscardable: true,
              groupId: -1,
            },
            {
              id: 3,
              index: 2,
              windowId: 1,
              title: "Mock Google (pinned, current window)",
              url: "https://google.com",
              favIconUrl: "icon.png",
              pinned: true,
              active: false,
              highlighted: false,
              selected: false,
              incognito: false,
              discarded: false,
              autoDiscardable: true,
              groupId: -1,
            },
            ...(mode === "allWindows"
              ? [
                  {
                    id: 4,
                    index: 0,
                    windowId: 2,
                    title: "Mock Other Window Tab",
                    url: "https://otherwindow.com",
                    favIconUrl: "icon.png",
                    pinned: false,
                    active: true,
                    highlighted: true,
                    selected: true,
                    incognito: false,
                    discarded: false,
                    autoDiscardable: true,
                    groupId: -1,
                  },
                  {
                    id: 5,
                    index: 0,
                    windowId: 1,
                    title: "Mock Tab in Chrome Group",
                    url: "https://ingroup.com",
                    favIconUrl: "icon.png",
                    pinned: false,
                    active: false,
                    highlighted: false,
                    selected: false,
                    incognito: false,
                    discarded: false,
                    autoDiscardable: true,
                    groupId: 123,
                  },
                ]
              : []),
          ];
          const mockChromeGroups: chrome.tabGroups.TabGroup[] =
            mode === "allWindows" && chrome.tabGroups
              ? [
                  {
                    id: 123,
                    collapsed: false,
                    color: "blue",
                    title: "My Mock Group",
                    windowId: 1,
                  },
                ]
              : [];

          setAllTabs(mockTabs);
          setGroupedTabs(groupTabsByDomain(mockTabs, mockChromeGroups));
          setSearchFilteredTabs(mockTabs);
          console.log("[TabDeclutter] Mock data loaded.");
          return; // Return early after mock data is processed
        }

        console.log("[TabDeclutter] Querying Chrome tabs...");
        const queryOptions =
          mode === "currentWindow" ? { currentWindow: true } : {};
        const tabsFromApi = await chrome.tabs.query(queryOptions);
        console.log("[TabDeclutter] Tabs received:", tabsFromApi.length);

        const chromeGroupsFromApi = chrome.tabGroups
          ? await chrome.tabGroups.query({})
          : [];
        console.log(
          "[TabDeclutter] Chrome groups received:",
          chromeGroupsFromApi.length
        );

        setAllTabs(tabsFromApi);
        setGroupedTabs(
          groupTabsByDomain(
            tabsFromApi,
            chromeGroupsFromApi.filter(
              (g) =>
                mode === "allWindows" ||
                (tabsFromApi.length > 0 &&
                  g.windowId === tabsFromApi[0].windowId)
            )
          )
        );
        setSearchFilteredTabs(tabsFromApi);
        console.log("[TabDeclutter] State updated with API data.");
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        console.error("[TabDeclutter] Error fetching data:", errorMessage);
        setError(`Error fetching data: ${errorMessage}`);
        setAllTabs([]);
        setGroupedTabs([]);
        setSearchFilteredTabs([]);
      } finally {
        setIsLoading(false);
        isFetchingRef.current = false;
        console.log(
          `[TabDeclutter] fetchAndProcessTabs finished. isLoading set to false (in finally block). isFetchingRef set to false.`
        );
      }
    },
    [groupTabsByDomain]
  );

  useEffect(() => {
    console.log(
      `[TabDeclutter] useEffect (mount/tabViewMode change) triggered. Mode: ${tabViewMode}. Calling fetchAndProcessTabs.`
    );
    fetchAndProcessTabs(tabViewMode);
  }, [fetchAndProcessTabs, tabViewMode]);

  useEffect(() => {
    console.log(
      `[TabDeclutter] useEffect (listeners setup) triggered. Attaching listeners with current mode: ${tabViewMode}.`
    );
    const commonListenerLogic = () => {
      console.log(
        `[TabDeclutter] Listener triggered. Will call fetchAndProcessTabs with mode: ${tabViewMode}.`
      );
      fetchAndProcessTabs(tabViewMode);
    };

    const tabUpdatedListener = (
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      _tabId: number,
      changeInfo: chrome.tabs.TabChangeInfo,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      _tab: chrome.tabs.Tab // Ensure this is also disabled if unused
    ) => {
      // Log the raw changeInfo to see everything that's coming through
      console.log(
        `[TabDeclutter] tabUpdatedListener received changeInfo: ${JSON.stringify(
          changeInfo
        )}, for tabId: ${_tabId}`
      );

      // Refetch only on significant changes:
      // - Tab loading is complete
      // - Pinned state changes
      // - Group ID changes
      const shouldRefetch =
        changeInfo.status === "complete" ||
        changeInfo.pinned !== undefined ||
        changeInfo.groupId !== undefined;

      if (shouldRefetch) {
        console.log(
          `[TabDeclutter] tabUpdatedListener WILL call commonListenerLogic. Triggering conditions: status=${
            changeInfo.status
          }, pinnedChanged=${changeInfo.pinned !== undefined}, groupIdChanged=${
            changeInfo.groupId !== undefined
          }`
        );
        commonListenerLogic();
      } else {
        console.log(
          `[TabDeclutter] tabUpdatedListener decided NOT to refetch. changeInfo: ${JSON.stringify(
            changeInfo
          )}`
        );
      }
    };
    const tabRemovedListener = () => commonListenerLogic();
    const tabCreatedListener = () => commonListenerLogic();
    const tabGroupUpdatedListener = () => commonListenerLogic();
    const tabMovedListener = () => commonListenerLogic();

    if (chrome.tabs) {
      chrome.tabs.onUpdated.addListener(tabUpdatedListener);
      chrome.tabs.onRemoved.addListener(tabRemovedListener);
      chrome.tabs.onCreated.addListener(tabCreatedListener);
      chrome.tabs.onMoved.addListener(tabMovedListener); // Added listener for tab moves
    }
    if (chrome.tabGroups) {
      chrome.tabGroups.onUpdated.addListener(tabGroupUpdatedListener);
      chrome.tabGroups.onCreated.addListener(tabGroupUpdatedListener);
      chrome.tabGroups.onRemoved.addListener(tabGroupUpdatedListener);
    }

    return () => {
      console.log(
        `[TabDeclutter] Cleaning up listeners (useEffect for listeners).`
      );
      if (chrome.tabs) {
        chrome.tabs.onUpdated.removeListener(tabUpdatedListener);
        chrome.tabs.onRemoved.removeListener(tabRemovedListener);
        chrome.tabs.onCreated.removeListener(tabCreatedListener);
        chrome.tabs.onMoved.removeListener(tabMovedListener);
      }
      if (chrome.tabGroups) {
        chrome.tabGroups.onUpdated.removeListener(tabGroupUpdatedListener);
        chrome.tabGroups.onCreated.removeListener(tabGroupUpdatedListener);
        chrome.tabGroups.onRemoved.removeListener(tabGroupUpdatedListener);
      }
    };
  }, [fetchAndProcessTabs, tabViewMode]);

  const handleCloseTab = useCallback(async (tabId: number | undefined) => {
    if (tabId === undefined || !chrome.tabs || !chrome.tabs.remove) return;
    try {
      await chrome.tabs.remove(tabId);
      // Listeners will handle UI update
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      console.error("Error closing tab:", errorMessage);
      setError(`Error closing tab: ${errorMessage}`);
    }
  }, []);

  const handlePinTab = useCallback(
    async (tabId: number | undefined, pinned: boolean) => {
      if (tabId === undefined || !chrome.tabs || !chrome.tabs.update) return;
      try {
        await chrome.tabs.update(tabId, { pinned });
        // Listeners will handle UI update
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        console.error("Error pinning tab:", errorMessage);
        setError(`Error pinning tab: ${errorMessage}`);
      }
    },
    []
  );

  const handleSearch = useCallback(
    (query: string) => {
      setActiveSearchQuery(query);
      const lowerCaseQuery = query.toLowerCase();
      if (!query.trim()) {
        setSearchFilteredTabs(allTabs);
        return;
      }
      const filtered = allTabs.filter(
        (tab) =>
          (tab.title && tab.title.toLowerCase().includes(lowerCaseQuery)) ||
          (tab.url && tab.url.toLowerCase().includes(lowerCaseQuery))
      );
      setSearchFilteredTabs(filtered);
    },
    [allTabs]
  );

  const toggleGroupCollapse = useCallback((groupId: string) => {
    setGroupedTabs((prevGroups) =>
      prevGroups.map((group) =>
        group.id === groupId ? { ...group, collapsed: !group.collapsed } : group
      )
    );
  }, []);

  // UPDATED to initiate naming
  const handleCreateChromeTabGroup = useCallback(
    async (originalGroupName: string, tabIdsToGroup: number[]) => {
      console.log(
        `[TabDeclutter] Initiating naming for Chrome group. Original name: "${originalGroupName}", tabs:`,
        tabIdsToGroup
      );
      if (tabIdsToGroup.length === 0) {
        setError("No tabs provided to group.");
        return;
      }
      setGroupToNameDetails({
        originalName: originalGroupName,
        tabIds: tabIdsToGroup,
      });
      setCustomGroupNameInput(originalGroupName); // Pre-fill with original name
    },
    [] // No complex dependencies, only setters
  );

  // RESTORED: handleConfirmAndCreateGroup
  const handleConfirmAndCreateGroup = useCallback(async () => {
    if (!groupToNameDetails || customGroupNameInput.trim() === "") {
      setError("Group name cannot be empty.");
      return;
    }
    const { tabIds } = groupToNameDetails;
    const finalGroupName = customGroupNameInput.trim();

    console.log(
      `[TabDeclutter] Confirming group creation with name: "${finalGroupName}" for tabs:`,
      tabIds
    );

    if (
      !chrome.tabs ||
      !chrome.tabs.group ||
      !chrome.tabGroups ||
      !chrome.tabGroups.update
    ) {
      console.error(
        "[TabDeclutter] Grouping API not available for confirmation."
      );
      setError("Tab grouping API is not available.");
      setGroupToNameDetails(null);
      return;
    }

    try {
      const newChromeGroupId = await chrome.tabs.group({
        tabIds: tabIds,
      });
      await chrome.tabGroups.update(newChromeGroupId, {
        title: finalGroupName,
      });
      console.log(
        `[TabDeclutter] Chrome group created/updated: ID ${newChromeGroupId}, Title: "${finalGroupName}"`
      );
      await fetchAndProcessTabs(tabViewMode);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      console.error(
        "[TabDeclutter] Error creating/updating Chrome group:",
        errorMessage
      );
      setError(`Error creating group: ${errorMessage}`);
    }
    setGroupToNameDetails(null);
    setCustomGroupNameInput("");
  }, [
    groupToNameDetails,
    customGroupNameInput,
    fetchAndProcessTabs,
    tabViewMode,
  ]);

  // RESTORED: handleCancelGroupName
  const handleCancelGroupName = useCallback(() => {
    setGroupToNameDetails(null);
    setCustomGroupNameInput("");
    console.log("[TabDeclutter] Group naming cancelled.");
  }, []);

  const renderTabs = () => {
    if (isLoading) {
      console.log("[TabDeclutter] Rendering: Loading tabs...");
      return (
        <div className="p-4 text-lg font-semibold text-gray-700 dark:text-gray-200">
          Loading tabs...
        </div>
      );
    }
    console.log("[TabDeclutter] Rendering: Main content (isLoading is false)");

    if (activeSearchQuery) {
      if (searchFilteredTabs.length === 0)
        return <p>No tabs match your search.</p>;
      return searchFilteredTabs.map((tab) => (
        <TabCard
          key={tab.id}
          tab={tab}
          onClose={handleCloseTab}
          onPin={handlePinTab}
        />
      ));
    }

    if (groupedTabs.length === 0 && !error) return <p>No tabs to display.</p>;

    return (
      <GroupTabs
        groups={groupedTabs}
        onToggleCollapse={toggleGroupCollapse}
        onCloseTab={handleCloseTab}
        onPinTab={handlePinTab}
        onCreateChromeGroup={handleCreateChromeTabGroup} // This now expects (originalName, tabIds)
      />
    );
  };

  return (
    <div
      className="app-container"
      style={{ minHeight: "400px", maxHeight: "600px", overflowY: "auto" }}
    >
      {/* RESTORED: Group Naming Input Modal/Section (basic structure, needs styling if not using Tailwind) */}
      {groupToNameDetails && (
        <div
          style={{
            /* Basic modal styling - non-Tailwind */ position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
          onClick={handleCancelGroupName} // Click outside to cancel
        >
          <div
            onClick={(e) => e.stopPropagation()} // Prevent click inside from closing modal
            style={{
              backgroundColor: "white",
              padding: "20px",
              borderRadius: "5px",
              width: "300px",
            }}
          >
            <h2 style={{ marginTop: 0, marginBottom: "15px" }}>
              Name Your Chrome Group
            </h2>
            <p
              style={{ fontSize: "0.9em", color: "#555", marginBottom: "5px" }}
            >
              Original group:{" "}
              <span style={{ fontWeight: "bold" }}>
                {groupToNameDetails.originalName}
              </span>
            </p>
            <input
              type="text"
              value={customGroupNameInput}
              onChange={(e) => setCustomGroupNameInput(e.target.value)}
              placeholder="Enter group name"
              style={{
                width: "100%",
                padding: "8px",
                boxSizing: "border-box",
                marginBottom: "15px",
              }}
              autoFocus
            />
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button
                onClick={handleCancelGroupName}
                type="button"
                style={{ marginRight: "10px" }}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmAndCreateGroup}
                disabled={customGroupNameInput.trim() === ""}
                type="button"
              >
                Confirm & Create Group
              </button>
            </div>
          </div>
        </div>
      )}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h1>Tab Declutter</h1>
        <div className="view-mode-toggle" style={{ marginBottom: "10px" }}>
          <button
            onClick={() => setTabViewMode("currentWindow")}
            disabled={tabViewMode === "currentWindow" || isLoading}
          >
            Current Window
          </button>
          <button
            onClick={() => setTabViewMode("allWindows")}
            disabled={tabViewMode === "allWindows" || isLoading}
          >
            All Windows
          </button>
        </div>
      </div>

      {error && (
        <p
          style={{
            color: "red",
            backgroundColor: "#ffe0e0",
            padding: "5px",
            borderRadius: "4px",
          }}
        >
          {error}
        </p>
      )}
      <SearchBar onSearch={handleSearch} />
      <div className="tab-list" style={{ marginTop: "10px" }}>
        {renderTabs()}
      </div>
    </div>
  );
}

export default App;
