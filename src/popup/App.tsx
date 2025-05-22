import { useState, useEffect, useCallback } from "react";
import TabsTable from "./components/TabsTable/TabsTable";
import HeaderControls, {
  StatusFilterType,
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
import { DisplayTab } from "./types"; // Removed WindowWithTabs
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
    // extensionWindowIdRef, // Not explicitly used by App after this refactor, managed within useTabManagement
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

  // Effect to call fetchAndProcessTabs with setters once App has them
  useEffect(() => {
    fetchAndProcessTabs(setActiveWindowAccordionId, setSelectedTabIds);
  }, [fetchAndProcessTabs, setActiveWindowAccordionId, setSelectedTabIds]); // Add setSelectedTabIds

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
    const finalGroupName = customGroupNameInput.trim();
    if (!chrome.tabs?.group || !chrome.tabGroups?.update) {
      console.error("Tab grouping API is not available.");
      return;
    }

    try {
      const newChromeGroupId = await chrome.tabs.group({
        tabIds: tabIdsToGroupForNaming,
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
      // setError from hook might not be appropriate here
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
      // Consider if focusing a window/tab should also make its accordion active
      // setActiveWindowAccordionId(windowId); // This could be a new behavior
    } catch (e) {
      console.error(`Error switching to tab ${tabId}:`, e);
      // setError from hook might not be appropriate here
    }
  };

  const filteredAndSortedTabsForActiveWindow = tabsForActiveWindow
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
      return true;
    })
    .sort(
      (a: DisplayTab, b: DisplayTab) =>
        a.originalTab.index - b.originalTab.index
    );

  const totalSelectedTabsAcrossAllWindows = selectedTabIds.size;
  const activeWindowDetails =
    activeWindowAccordionId !== null
      ? groupedTabsByWindow.find((w) => w.windowId === activeWindowAccordionId)
      : null;
  const totalTabsInActiveWindowForDisplay = activeWindowDetails
    ? activeWindowDetails.tabs.length
    : 0;
  const activeWindowNameForDisplay = activeWindowDetails
    ? activeWindowDetails.windowName
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
          onViewGroupTabs={handleBulkGroupSelectedTabs}
          selectedTabsCount={selectedTabIds.size}
          totalResultsCount={filteredAndSortedTabsForActiveWindow.length}
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
            {groupedTabsByWindow.map((windowGroup) => (
              <WindowAccordionItem
                key={windowGroup.windowId}
                windowId={windowGroup.windowId}
                windowName={windowGroup.windowName}
                isActive={activeWindowAccordionId === windowGroup.windowId}
                onToggle={() =>
                  handleToggleAccordion(windowGroup.windowId, setSelectedTabIds)
                }
              >
                {activeWindowAccordionId === windowGroup.windowId && (
                  <TabsTable
                    tabs={filteredAndSortedTabsForActiveWindow}
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
            ))}
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
