import { useState, useEffect, useCallback } from "react";
import TabsTable from "./components/TabsTable/TabsTable";
import HeaderControls, {
  StatusFilterType,
  PinnedFilterType,
} from "./components/HeaderControls/HeaderControls";
import HeaderComponent from "./components/HeaderComponent/HeaderComponent";
import WindowAccordionItem from "./components/WindowAccordionItem/WindowAccordionItem";
import FooterComponent from "./components/FooterComponent/FooterComponent";
import GroupNamingModal from "./components/GroupNamingModal/GroupNamingModal";
import {
  AppContainer,
  MainContent,
  WindowAccordionListContainer,
} from "./App.styles";
import { DisplayTab, GroupFilterValue } from "./types"; // Removed TabGroupForFilter
import { useTabManagement } from "./hooks/useTabManagement"; // Import the hook
import { useAccordion } from "./hooks/useAccordion"; // Import useAccordion
import { useTabSelection } from "./hooks/useTabSelection"; // Import useTabSelection
import { useGroupNamingModal } from "./hooks/useGroupNamingModal"; // Import hook

function App() {
  // State and logic from useTabManagement
  const {
    groupedTabsByWindow,
    isLoading,
    error,
    fetchAndProcessTabs,
    availableTabGroups, // Destructure new state
  } = useTabManagement();

  // Tab Selection state and logic
  const {
    selectedTabIds,
    setSelectedTabIds, // Needed by useAccordion and useTabManagement
    handleToggleSelectTab,
    handleSelectAllTabsInActiveWindow,
  } = useTabSelection();

  // Accordion state and logic, pass setSelectedTabIds to it
  const {
    activeWindowAccordionId,
    setActiveWindowAccordionId,
    handleToggleAccordion,
  } = useAccordion();

  // Group Naming Modal state and logic from hook
  const {
    isGroupNamingModalOpen,
    tabIdsToGroupForNaming,
    suggestedGroupName,
    customGroupNameInput,
    openGroupNamingModal,
    closeGroupNamingModal,
    setCustomGroupNameInput,
  } = useGroupNamingModal();

  // Remaining state for App.tsx
  const [activeSearchQuery, setActiveSearchQuery] = useState<string>("");
  const [activeStatusFilter, setActiveStatusFilter] =
    useState<StatusFilterType>("all");
  const [activePinnedFilter, setActivePinnedFilter] =
    useState<PinnedFilterType>("all");
  const [activeGroupFilter, setActiveGroupFilter] =
    useState<GroupFilterValue>("all"); // New state for group filter

  // Helper function to filter tabs for a specific window
  const getFilteredTabsForWindow = useCallback(
    (windowTabs: DisplayTab[]) => {
      return windowTabs
        .filter((tab: DisplayTab) => {
          const searchLower = activeSearchQuery.toLowerCase();
          const matchesSearch =
            !searchLower ||
            tab.title.toLowerCase().includes(searchLower) ||
            tab.category.toLowerCase().includes(searchLower) ||
            tab.originalTab.url?.toLowerCase().includes(searchLower);
          if (!matchesSearch) return false;

          if (activeStatusFilter === "active" && tab.status !== "Active")
            return false;
          if (activeStatusFilter === "inactive" && tab.status !== "Inactive")
            return false;

          if (activePinnedFilter === "pinned" && !tab.originalTab.pinned)
            return false;
          if (activePinnedFilter === "unpinned" && tab.originalTab.pinned)
            return false;

          // Updated Group filter logic to use group names
          if (activeGroupFilter === "none") {
            if (tab.groupId !== undefined) return false; // Show only ungrouped (groupId is undefined)
          } else if (activeGroupFilter !== "all") {
            // If a specific group name is selected
            if (tab.groupName !== activeGroupFilter) return false; // Show only tabs from the selected group NAME
          }
          // If activeGroupFilter is "all", no group-specific filtering is applied here.

          return true;
        })
        .sort(
          (a: DisplayTab, b: DisplayTab) =>
            a.originalTab.index - b.originalTab.index
        );
    },
    [
      activeSearchQuery,
      activeStatusFilter,
      activePinnedFilter,
      activeGroupFilter,
    ]
  );

  // Effect to call fetchAndProcessTabs with setters once App has them
  useEffect(() => {
    fetchAndProcessTabs(setActiveWindowAccordionId, setSelectedTabIds);
  }, [fetchAndProcessTabs, setActiveWindowAccordionId, setSelectedTabIds]);

  // Effect to open the most relevant window accordion when filters change
  useEffect(() => {
    if (groupedTabsByWindow.length === 0) {
      setActiveWindowAccordionId(null); // No windows, no accordion to open
      setSelectedTabIds(new Set());
      return;
    }

    const isFiltering =
      activeSearchQuery !== "" ||
      activeStatusFilter !== "all" ||
      activePinnedFilter !== "all" ||
      activeGroupFilter !== "all";

    if (!isFiltering) {
      // If no filters are active, try to keep the current accordion open or open the first focused one.
      // This part can be enhanced further if needed, but for now, let's ensure it doesn't close unnecessarily.
      // Example: if an accordion is already open, don't change it unless filters force a change.
      // For simplicity, if no filter is active, we don't auto-change the accordion here.
      // The initial load logic in useTabManagement handles setting an initial active accordion.
      return;
    }

    let bestWindowId: number | null = null;

    // 1. Priority for specific group filter
    if (activeGroupFilter !== "all" && activeGroupFilter !== "none") {
      for (const windowGroup of groupedTabsByWindow) {
        const filteredTabs = getFilteredTabsForWindow(windowGroup.tabs);
        if (filteredTabs.length > 0) {
          bestWindowId = windowGroup.windowId;
          break; // Found a window with the selected group and other filters applied
        }
      }
    }

    // 2. Fallback for general filtering or if specific group not found prominently
    if (bestWindowId === null) {
      for (const windowGroup of groupedTabsByWindow) {
        const filteredTabs = getFilteredTabsForWindow(windowGroup.tabs);
        if (filteredTabs.length > 0) {
          bestWindowId = windowGroup.windowId;
          break; // Found the first window that has any results for the current filters
        }
      }
    }

    // 3. Apply the found best window ID or null if no window has matching tabs
    setActiveWindowAccordionId(bestWindowId);
    setSelectedTabIds(new Set()); // Always reset selection when filters cause accordion change
  }, [
    activeSearchQuery,
    activeStatusFilter,
    activePinnedFilter,
    activeGroupFilter,
    groupedTabsByWindow, // Important: ensure this is stable or memoized if it causes re-runs
    setActiveWindowAccordionId,
    setSelectedTabIds,
    getFilteredTabsForWindow, // Added as it's used in the effect now
  ]);

  const handleOpenInNewTab = () => {
    if (chrome.runtime && chrome.runtime.sendMessage) {
      try {
        chrome.runtime.sendMessage({ action: "openInNewTab" });
      } catch (e) {
        console.error(
          "[TabDeclutter Popup] Error sending openInNewTab message:",
          e
        );
        // setError from hook might not be appropriate here
        // Consider a local error state for this or a more generic notification system
      }
    } else {
      console.error(
        "[TabDeclutter Popup] chrome.runtime.sendMessage is not available."
      );
    }
  };

  const handleCloseTab = useCallback(async (tabId: number | undefined) => {
    if (tabId === undefined || !chrome.tabs || !chrome.tabs.remove) return;
    try {
      await chrome.tabs.remove(tabId);
      // fetchAndProcessTabs will be called by listeners in the hook
    } catch (e) {
      console.error(`Error closing tab ${tabId}:`, e);
      // setError from hook might not be appropriate here
    }
  }, []);

  const handlePinTab = async (tabId: number, pinned: boolean) => {
    if (!chrome.tabs || !chrome.tabs.update) return;
    try {
      await chrome.tabs.update(tabId, { pinned: !pinned });
      // fetchAndProcessTabs will be called by listeners in the hook
    } catch (e) {
      console.error(`Error pinning tab ${tabId}:`, e);
      // setError from hook might not be appropriate here
    }
  };

  const tabsForActiveWindow = // This logic remains as it depends on App's activeWindowAccordionId and hook's groupedTabsByWindow
    activeWindowAccordionId !== null
      ? groupedTabsByWindow.find((w) => w.windowId === activeWindowAccordionId)
          ?.tabs || []
      : [];

  const handleBulkGroupSelectedTabs = () => {
    if (selectedTabIds.size === 0) {
      console.error("No tabs selected to group.");
      return;
    }
    if (activeWindowAccordionId === null) {
      console.error("No active window to group tabs in.");
      return;
    }
    const selectedTabsInActiveWindow = Array.from(selectedTabIds).filter((id) =>
      tabsForActiveWindow.some((tab) => tab.id === id)
    );
    if (selectedTabsInActiveWindow.length === 0) {
      console.error("No selected tabs are in the current active window.");
      return;
    }
    openGroupNamingModal(selectedTabsInActiveWindow, "New Group");
  };

  const handleConfirmAndCreateGroup = async () => {
    if (
      tabIdsToGroupForNaming.length === 0 ||
      customGroupNameInput.trim() === ""
    ) {
      console.error("Group name cannot be empty or no tabs to group.");
      return;
    }
    if (activeWindowAccordionId === null) {
      console.error(
        "[TabDeclutter] Cannot create group: No active window context."
      );
      // This case should ideally not be reached if UI prevents grouping without an active window.
      return;
    }

    const finalGroupName = customGroupNameInput.trim();
    if (!chrome.tabs?.group || !chrome.tabGroups?.update) {
      console.error("[TabDeclutter] Tab grouping API is not available.");
      return;
    }

    try {
      const newChromeGroupId = await chrome.tabs.group({
        tabIds: tabIdsToGroupForNaming,
        createProperties: { windowId: activeWindowAccordionId }, // Explicitly set the windowId
      });
      await chrome.tabGroups.update(newChromeGroupId, {
        title: finalGroupName,
      });
      setSelectedTabIds((prevSelected) => {
        const newSelection = new Set(prevSelected);
        tabIdsToGroupForNaming.forEach((id) => newSelection.delete(id));
        return newSelection;
      });
      // fetchAndProcessTabs will be called by listeners in the hook
    } catch (e) {
      console.error("[TabDeclutter] Error creating/updating Chrome group:", e);
    }
    closeGroupNamingModal();
  };

  const handleCancelGroupName = () => {
    closeGroupNamingModal();
  };

  const handleSwitchToTab = async (tabId: number, windowId: number) => {
    if (!chrome.tabs || !chrome.windows) return;
    try {
      await chrome.windows.update(windowId, { focused: true });
      await chrome.tabs.update(tabId, { active: true });
    } catch (e) {
      console.error(`Error switching to tab ${tabId}:`, e);
    }
  };

  // This is for the currently OPENED accordion's TabsTable
  const filteredAndSortedTabsForActiveWindow =
    getFilteredTabsForWindow(tabsForActiveWindow);

  const totalSelectedTabsAcrossAllWindows = selectedTabIds.size;
  const activeWindowDetails =
    activeWindowAccordionId !== null
      ? groupedTabsByWindow.find((w) => w.windowId === activeWindowAccordionId)
      : null;
  const totalTabsInActiveWindowForDisplay = activeWindowDetails
    ? activeWindowDetails.originalTotalTabs
    : 0;
  const activeWindowNameForDisplay = activeWindowDetails
    ? activeWindowDetails.windowName.replace(" (Current)", "")
    : "N/A";

  return (
    <AppContainer>
      <HeaderComponent onOpenInNewTab={handleOpenInNewTab} />

      <MainContent>
        <HeaderControls
          searchQuery={activeSearchQuery}
          onSearchChange={setActiveSearchQuery}
          statusFilter={activeStatusFilter}
          onStatusFilterChange={setActiveStatusFilter}
          pinnedFilter={activePinnedFilter}
          onPinnedFilterChange={setActivePinnedFilter}
          onViewGroupTabs={handleBulkGroupSelectedTabs}
          selectedTabsCount={selectedTabIds.size}
          totalResultsCount={filteredAndSortedTabsForActiveWindow.length}
          // Pass group filter related props
          availableTabGroups={availableTabGroups || []} // Ensure it's an array
          groupFilter={activeGroupFilter}
          onGroupFilterChange={setActiveGroupFilter}
        />
        {isLoading && <p>Loading tabs...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}

        {!isLoading && !error && groupedTabsByWindow.length === 0 && (
          <p>
            No open windows found (excluding this extension popup if it's in a
            separate window).
          </p>
        )}

        {!isLoading && !error && groupedTabsByWindow.length > 0 && (
          <WindowAccordionListContainer>
            {groupedTabsByWindow.map((windowGroup) => {
              // Filter tabs for *this specific* windowGroup to get its count
              const filteredTabsInThisWindow = getFilteredTabsForWindow(
                windowGroup.tabs
              );
              const windowDisplayName = `${windowGroup.windowName} (${
                filteredTabsInThisWindow.length
              } tab${filteredTabsInThisWindow.length !== 1 ? "s" : ""} found)`;

              return (
                <WindowAccordionItem
                  key={windowGroup.windowId}
                  windowId={windowGroup.windowId}
                  windowName={windowDisplayName} // Pass the dynamic name
                  isActive={activeWindowAccordionId === windowGroup.windowId}
                  onToggle={() =>
                    handleToggleAccordion(
                      windowGroup.windowId,
                      setSelectedTabIds
                    )
                  }
                >
                  {activeWindowAccordionId === windowGroup.windowId && (
                    <TabsTable
                      tabs={filteredAndSortedTabsForActiveWindow} // This remains for the open accordion
                      selectedTabIds={selectedTabIds}
                      onToggleSelectTab={handleToggleSelectTab}
                      onSelectAllTabs={(selectAll) =>
                        handleSelectAllTabsInActiveWindow(
                          selectAll,
                          tabsForActiveWindow
                        )
                      }
                      onCloseTab={handleCloseTab}
                      onPinTab={handlePinTab}
                      onSwitchToTab={handleSwitchToTab}
                    />
                  )}
                </WindowAccordionItem>
              );
            })}
          </WindowAccordionListContainer>
        )}
      </MainContent>

      <FooterComponent
        totalSelectedTabs={totalSelectedTabsAcrossAllWindows}
        activeWindowName={
          activeWindowAccordionId !== null ? activeWindowNameForDisplay : null
        }
        totalTabsInActiveWindow={
          activeWindowAccordionId !== null
            ? totalTabsInActiveWindowForDisplay
            : null
        }
        isActiveWindowAvailable={activeWindowAccordionId !== null}
      />

      <GroupNamingModal
        isOpen={isGroupNamingModalOpen}
        suggestedName={suggestedGroupName}
        customName={customGroupNameInput}
        onCustomNameChange={setCustomGroupNameInput}
        onConfirm={handleConfirmAndCreateGroup}
        onCancel={handleCancelGroupName}
      />
    </AppContainer>
  );
}

export default App;
