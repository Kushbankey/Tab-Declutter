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
import SessionNamingModal from "./components/SessionNamingModal/SessionNamingModal";
import HelpGuideComponent from "./components/HelpGuide/HelpGuide";
import SavedSessionsDisplay from "./components/SavedSessionsDisplay/SavedSessionsDisplay";
import {
  AppContainer,
  MainContent,
  WindowAccordionListContainer,
  DetachedViewWrapper,
  HelpGuideWrapper,
} from "./App.styles";
import {
  DisplayTab,
  GroupFilterValue,
  TabGroupForFilter,
  SavedSession,
  SavedWindowContext,
} from "./types";
import { useTabManagement } from "./hooks/useTabManagement";
import { useAccordion } from "./hooks/useAccordion";
import { useTabSelection } from "./hooks/useTabSelection";
import { useGroupNamingModal } from "./hooks/useGroupNamingModal";
import {
  useSessionNamingModal,
  SessionSaveScope,
  WindowForSaveOption,
} from "./hooks/useSessionNamingModal";
import { useToast } from "./hooks/useToast";
import ToastNotification from "./components/ToastNotification/ToastNotification";
import { ToastsContainer } from "./components/ToastNotification/ToastNotification.styles";

function App() {
  const {
    groupedTabsByWindow,
    isLoading,
    error,
    fetchAndProcessTabs,
    availableTabGroups,
  } = useTabManagement();

  const {
    selectedTabIds,
    setSelectedTabIds,
    handleToggleSelectTab,
    handleSelectAllTabsInActiveWindow,
  } = useTabSelection();

  const {
    activeWindowAccordionId,
    setActiveWindowAccordionId,
    handleToggleAccordion,
  } = useAccordion();

  const {
    isGroupNamingModalOpen,
    tabIdsToGroupForNaming,
    customGroupNameInput,
    modalMode,
    groupForRename,
    initialInputTextForModal,
    openGroupNamingModal,
    closeGroupNamingModal,
    setCustomGroupNameInput,
  } = useGroupNamingModal();

  const {
    isSessionNamingModalOpen,
    sessionNameInput,
    initialInputTextForSessionModal,
    saveScope,
    availableWindowsForSaveModal,
    openSessionNamingModal,
    closeSessionNamingModal,
    setSessionNameInput,
    setSaveScope,
  } = useSessionNamingModal();

  const currentSaveScope: SessionSaveScope = saveScope;

  const { toasts, addToast, removeToast } = useToast();

  const [activeSearchQuery, setActiveSearchQuery] = useState<string>("");
  const [activeStatusFilter, setActiveStatusFilter] =
    useState<StatusFilterType>("all");
  const [activePinnedFilter, setActivePinnedFilter] =
    useState<PinnedFilterType>("all");
  const [activeGroupFilter, setActiveGroupFilter] =
    useState<GroupFilterValue>("all");
  const [isDetachedView, setIsDetachedView] = useState<boolean>(false);
  const [currentView, setCurrentView] = useState<"tabs" | "sessions">("tabs");
  const [savedSessionsList, setSavedSessionsList] = useState<SavedSession[]>(
    []
  );

  useEffect(() => {
    if (chrome.windows && chrome.windows.getCurrent) {
      chrome.windows.getCurrent({}, (currentWindow) => {
        if (currentWindow && currentWindow.type !== "popup") {
          setIsDetachedView(true);
        } else {
          setIsDetachedView(false);
        }
      });
    }
  }, []);

  useEffect(() => {
    // Fetch saved sessions on mount
    const loadSavedSessions = async () => {
      try {
        const result = await chrome.storage.local.get(["savedSessions"]);
        setSavedSessionsList(result.savedSessions || []);
      } catch (e) {
        console.error("[App] Error loading saved sessions:", e);
        addToast({
          title: "Error Loading Sessions",
          message: "Could not load saved sessions from storage.",
        });
      }
    };
    loadSavedSessions();
  }, [addToast]);

  const resetAllFilters = useCallback(() => {
    setActiveSearchQuery("");
    setActiveStatusFilter("all");
    setActivePinnedFilter("all");
    setActiveGroupFilter("all");
  }, []);

  const handleRequestRenameGroup = (group: TabGroupForFilter) => {
    if (!group.numericId || !group.name) {
      console.error("[App] Invalid group data for rename:", group);
      addToast({
        title: "Error",
        message: "Cannot rename group due to missing information.",
      });
      return;
    }
    openGroupNamingModal("rename", { groupToRename: group });
  };

  const handleRequestUngroupTabs = async (group: TabGroupForFilter) => {
    if (!group.numericId) {
      console.error("[App] Invalid group data for ungroup:", group);
      addToast({
        title: "Error",
        message: "Cannot ungroup tabs due to missing group ID.",
      });
      return;
    }
    try {
      const tabsInGroup = await chrome.tabs.query({ groupId: group.numericId });
      if (tabsInGroup.length > 0) {
        const tabIdsToUngroup = tabsInGroup.map((t) => t.id!);
        await chrome.tabs.ungroup(tabIdsToUngroup);
        addToast({
          title: "Tabs Ungrouped",
          message: `Tabs from group "${group.name}" have been ungrouped.`,
          groupColor: group.color,
        });
        resetAllFilters();
        fetchAndProcessTabs(setActiveWindowAccordionId, setSelectedTabIds);
      } else {
        addToast({
          title: "No Tabs to Ungroup",
          message: `Group "${group.name}" has no tabs to ungroup.`,
          groupColor: group.color,
        });
      }
    } catch (e) {
      console.error("[App] Error ungrouping tabs:", e);
      addToast({
        title: "Error Ungrouping",
        message: `Failed to ungroup tabs: ${
          e instanceof Error ? e.message : String(e)
        }`,
      });
    }
  };

  const handleRequestDeleteGroupAndTabs = async (group: TabGroupForFilter) => {
    if (!group.numericId) {
      console.error("[App] Invalid group data for delete:", group);
      addToast({
        title: "Error",
        message: "Cannot delete group due to missing group ID.",
      });
      return;
    }
    try {
      const tabsInGroup = await chrome.tabs.query({ groupId: group.numericId });
      if (tabsInGroup.length > 0) {
        const tabIdsToDelete = tabsInGroup.map((t) => t.id!);
        await chrome.tabs.remove(tabIdsToDelete);
        addToast({
          title: "Group Deleted",
          message: `Group "${group.name}" and its tabs have been deleted.`,
          groupColor: group.color,
        });
        resetAllFilters();
        fetchAndProcessTabs(setActiveWindowAccordionId, setSelectedTabIds);
      } else {
        addToast({
          title: "Group Empty",
          message: `Group "${group.name}" was already empty or could not be deleted directly. It might be removed automatically.`,
          groupColor: group.color,
        });
        resetAllFilters();
        fetchAndProcessTabs(setActiveWindowAccordionId, setSelectedTabIds);
      }
    } catch (e) {
      console.error("[App] Error deleting group and tabs:", e);
      addToast({
        title: "Error Deleting Group",
        message: `Failed to delete group: ${
          e instanceof Error ? e.message : String(e)
        }`,
      });
    }
  };

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

          if (activeGroupFilter === "none") {
            if (tab.groupId !== undefined) return false;
          } else if (activeGroupFilter !== "all") {
            if (tab.groupName !== activeGroupFilter) return false;
          }

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

  useEffect(() => {
    fetchAndProcessTabs(setActiveWindowAccordionId, setSelectedTabIds);
  }, [fetchAndProcessTabs, setActiveWindowAccordionId, setSelectedTabIds]);

  useEffect(() => {
    if (groupedTabsByWindow.length === 0) {
      setActiveWindowAccordionId(null);
      setSelectedTabIds(new Set());
      return;
    }

    const isFiltering =
      activeSearchQuery !== "" ||
      activeStatusFilter !== "all" ||
      activePinnedFilter !== "all" ||
      activeGroupFilter !== "all";

    if (!isFiltering) {
      return;
    }

    let bestWindowId: number | null = null;

    if (activeGroupFilter !== "all" && activeGroupFilter !== "none") {
      for (const windowGroup of groupedTabsByWindow) {
        const filteredTabs = getFilteredTabsForWindow(windowGroup.tabs);
        if (filteredTabs.length > 0) {
          bestWindowId = windowGroup.windowId;
          break;
        }
      }
    }

    if (bestWindowId === null) {
      for (const windowGroup of groupedTabsByWindow) {
        const filteredTabs = getFilteredTabsForWindow(windowGroup.tabs);
        if (filteredTabs.length > 0) {
          bestWindowId = windowGroup.windowId;
          break;
        }
      }
    }

    setActiveWindowAccordionId(bestWindowId);
    setSelectedTabIds(new Set());
  }, [
    activeSearchQuery,
    activeStatusFilter,
    activePinnedFilter,
    activeGroupFilter,
    groupedTabsByWindow,
    setActiveWindowAccordionId,
    setSelectedTabIds,
    getFilteredTabsForWindow,
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
    } catch (e) {
      console.error(`Error closing tab ${tabId}:`, e);
    }
  }, []);

  const handlePinTab = async (tabId: number, pinned: boolean) => {
    if (!chrome.tabs || !chrome.tabs.update) return;
    try {
      await chrome.tabs.update(tabId, { pinned: !pinned });
    } catch (e) {
      console.error(`Error pinning tab ${tabId}:`, e);
    }
  };

  const tabsForActiveWindow =
    activeWindowAccordionId !== null
      ? groupedTabsByWindow.find((w) => w.windowId === activeWindowAccordionId)
          ?.tabs || []
      : [];

  const handleBulkGroupSelectedTabs = () => {
    if (selectedTabIds.size === 0) {
      console.error("No tabs selected to group.");
      addToast({
        title: "No Tabs Selected",
        message: "Please select tabs to group.",
      });
      return;
    }
    if (activeWindowAccordionId === null) {
      console.error("No active window to group tabs in.");
      addToast({
        title: "No Active Window",
        message: "Please open a window section to group tabs.",
      });
      return;
    }
    const selectedTabsInActiveWindow = Array.from(selectedTabIds).filter((id) =>
      tabsForActiveWindow.some((tab) => tab.id === id)
    );
    if (selectedTabsInActiveWindow.length === 0) {
      console.error("No selected tabs are in the current active window.");
      addToast({
        title: "No Tabs in Window",
        message: "Selected tabs are not in the active window.",
      });
      return;
    }
    openGroupNamingModal("create", {
      tabIds: selectedTabsInActiveWindow,
      suggestedName: "New Group",
    });
  };

  const handleConfirmModalAction = async () => {
    const finalGroupName = customGroupNameInput.trim();
    if (finalGroupName === "") {
      console.error("Group name cannot be empty.");
      addToast({
        title: "Invalid Name",
        message: "Group name cannot be empty.",
      });
      return;
    }

    if (modalMode === "create") {
      if (tabIdsToGroupForNaming.length === 0) {
        console.error("No tabs to group for 'create' mode.");
        addToast({
          title: "No Tabs",
          message: "No tabs specified for the new group.",
        });
        closeGroupNamingModal();
        return;
      }
      if (activeWindowAccordionId === null) {
        console.error("[App] Cannot create group: No active window context.");
        addToast({
          title: "Error",
          message: "Cannot create group: No active window.",
        });
        closeGroupNamingModal();
        return;
      }
      if (!chrome.tabs?.group || !chrome.tabGroups?.update) {
        console.error("[App] Tab grouping API is not available.");
        addToast({
          title: "API Error",
          message: "Tab grouping API not available.",
        });
        closeGroupNamingModal();
        return;
      }

      try {
        const newChromeGroupId = await chrome.tabs.group({
          tabIds: tabIdsToGroupForNaming,
          createProperties: { windowId: activeWindowAccordionId },
        });
        await chrome.tabGroups.update(newChromeGroupId, {
          title: finalGroupName,
        });

        let groupColorForToast: chrome.tabGroups.ColorEnum | undefined;
        try {
          const groupDetails = await chrome.tabGroups.get(newChromeGroupId);
          groupColorForToast = groupDetails.color;
        } catch (getGroupError) {
          console.warn(
            `[App] Could not fetch details for new group ${newChromeGroupId}:`,
            getGroupError
          );
        }

        addToast({
          title: "Group Created!",
          message: `Group "${finalGroupName}" with ${tabIdsToGroupForNaming.length} tab(s) successfully created.`,
          groupColor: groupColorForToast,
          duration: 5000,
        });

        setSelectedTabIds((prevSelected) => {
          const newSelection = new Set(prevSelected);
          tabIdsToGroupForNaming.forEach((id) => newSelection.delete(id));
          return newSelection;
        });
        resetAllFilters();
        fetchAndProcessTabs(setActiveWindowAccordionId, setSelectedTabIds);
      } catch (e) {
        console.error("[App] Error creating/updating Chrome group:", e);
        addToast({
          title: "Error Creating Group",
          message: `Failed to create group: ${
            e instanceof Error ? e.message : String(e)
          }`,
        });
      }
    } else if (modalMode === "rename") {
      if (!groupForRename || !groupForRename.numericId) {
        console.error("Group details for rename are missing.");
        addToast({
          title: "Error",
          message: "Cannot rename: Group details missing.",
        });
        closeGroupNamingModal();
        return;
      }
      if (!chrome.tabGroups?.update) {
        console.error("[App] Tab group update API is not available.");
        addToast({
          title: "API Error",
          message: "Tab group update API not available.",
        });
        closeGroupNamingModal();
        return;
      }

      try {
        await chrome.tabGroups.update(groupForRename.numericId, {
          title: finalGroupName,
        });
        addToast({
          title: "Group Renamed!",
          message: `Group "${groupForRename.name}" successfully renamed to "${finalGroupName}".`,
          groupColor: groupForRename.color,
        });
        resetAllFilters();
        fetchAndProcessTabs(setActiveWindowAccordionId, setSelectedTabIds);
      } catch (e) {
        console.error("[App] Error renaming Chrome group:", e);
        addToast({
          title: "Error Renaming Group",
          message: `Failed to rename group: ${
            e instanceof Error ? e.message : String(e)
          }`,
        });
      }
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

  const activeWindowDetails =
    activeWindowAccordionId !== null
      ? groupedTabsByWindow.find((w) => w.windowId === activeWindowAccordionId)
      : null;
  const activeWindowNameForDisplay = activeWindowDetails
    ? activeWindowDetails.windowName.replace(" (Current)", "")
    : undefined;

  const handleSaveSessionRequest = () => {
    const windowsForOptions: WindowForSaveOption[] = groupedTabsByWindow.map(
      (win) => ({
        id: win.windowId,
        name: `${win.windowName.replace(" (Current)", "")} (${
          win.originalTotalTabs
        } tab${win.originalTotalTabs !== 1 ? "s" : ""})`,
        tabCount: win.originalTotalTabs,
      })
    );
    openSessionNamingModal({
      availableWindows: windowsForOptions,
      activeWindowId: activeWindowAccordionId,
    });
  };

  const handleConfirmSaveSession = async () => {
    const finalSessionName = sessionNameInput.trim();
    if (finalSessionName === "") {
      addToast({
        title: "Invalid Name",
        message: "Session name cannot be empty.",
      });
      return;
    }

    let windowContextsToSave: SavedWindowContext[] = [];

    if (currentSaveScope === "all") {
      if (groupedTabsByWindow.length === 0) {
        addToast({
          title: "No Windows",
          message: "There are no open windows to save in a session.",
        });
        closeSessionNamingModal();
        return;
      }
      windowContextsToSave = groupedTabsByWindow.map((windowGroup) => ({
        name: windowGroup.windowName.replace(" (Current)", ""),
        tabs: windowGroup.tabs.map((displayTab) => ({
          url: displayTab.originalTab.url || "",
          title: displayTab.originalTab.title || "Untitled Tab",
          pinned: displayTab.originalTab.pinned,
          favIconUrl: displayTab.favIconUrl,
        })),
      }));
    } else {
      const selectedWindowId = parseInt(currentSaveScope, 10);
      const windowToSave = groupedTabsByWindow.find(
        (w) => w.windowId === selectedWindowId
      );
      if (!windowToSave) {
        addToast({
          title: "Selected Window Not Found",
          message:
            "The selected window to save was not found. Please try again.",
        });
        closeSessionNamingModal();
        return;
      }
      windowContextsToSave = [
        {
          name: windowToSave.windowName.replace(" (Current)", ""),
          tabs: windowToSave.tabs.map((displayTab) => ({
            url: displayTab.originalTab.url || "",
            title: displayTab.originalTab.title || "Untitled Tab",
            pinned: displayTab.originalTab.pinned,
            favIconUrl: displayTab.favIconUrl,
          })),
        },
      ];
    }

    if (windowContextsToSave.every((ctx) => ctx.tabs.length === 0)) {
      addToast({
        title: "No Tabs",
        message: "The selected scope has no tabs to save in a session.",
      });
      closeSessionNamingModal();
      return;
    }

    const totalTabsSaved = windowContextsToSave.reduce(
      (sum, ctx) => sum + ctx.tabs.length,
      0
    );

    const newSession: SavedSession = {
      id: Date.now().toString(),
      name: finalSessionName,
      savedAt: new Date().toISOString(),
      windowContexts: windowContextsToSave,
    };

    try {
      const result = await chrome.storage.local.get(["savedSessions"]);
      const existingSessions: SavedSession[] = result.savedSessions || [];
      const updatedSessions = [...existingSessions, newSession];
      await chrome.storage.local.set({
        savedSessions: updatedSessions,
      });
      setSavedSessionsList(updatedSessions);
      addToast({
        title: "Session Saved!",
        message: `Session "${finalSessionName}" with ${totalTabsSaved} tab(s) across ${windowContextsToSave.length} window context(s) saved.`,
      });
    } catch (e) {
      console.error("[App] Error saving session to storage:", e);
      addToast({
        title: "Error Saving Session",
        message: `Failed to save session: ${
          e instanceof Error ? e.message : String(e)
        }`,
      });
    }

    closeSessionNamingModal();
  };

  const handleCancelSaveSession = () => {
    closeSessionNamingModal();
  };

  const handleToggleView = () => {
    setCurrentView((prev) => (prev === "tabs" ? "sessions" : "tabs"));
  };

  const handleRestoreSession = async (sessionId: string) => {
    const sessionToRestore = savedSessionsList.find((s) => s.id === sessionId);
    if (!sessionToRestore || !sessionToRestore.windowContexts) {
      addToast({
        title: "Error",
        message: "Session data is invalid or not found.",
      });
      return;
    }

    if (sessionToRestore.windowContexts.length === 0) {
      addToast({
        title: "Empty Session",
        message: `Session "${sessionToRestore.name}" has no windows/tabs to restore.`,
      });
      return;
    }

    try {
      for (const windowContext of sessionToRestore.windowContexts) {
        if (windowContext.tabs.length === 0) continue;

        const newWindow = await chrome.windows.create({
          focused: false,
        });

        if (newWindow && newWindow.id) {
          for (const tab of windowContext.tabs) {
            await chrome.tabs.create({
              windowId: newWindow.id,
              url: tab.url,
              pinned: tab.pinned,
              active: false,
            });
          }
        } else {
          console.warn(
            "[App] Could not create a new window for session restore. Opening tabs in default window."
          );
          for (const tab of windowContext.tabs) {
            await chrome.tabs.create({
              url: tab.url,
              pinned: tab.pinned,
              active: false,
            });
          }
        }
      }
      addToast({
        title: "Session Restored",
        message: `Session "${sessionToRestore.name}" has been restored. New windows were created for its contents.`,
      });
      setCurrentView("tabs");
      fetchAndProcessTabs(setActiveWindowAccordionId, setSelectedTabIds);
    } catch (e) {
      console.error("[App] Error restoring session:", e);
      addToast({
        title: "Error Restoring Session",
        message: `Failed to restore session: ${
          e instanceof Error ? e.message : String(e)
        }`,
      });
    }
  };

  const handleDeleteSession = async (sessionId: string) => {
    const sessionToDelete = savedSessionsList.find((s) => s.id === sessionId);
    if (!sessionToDelete) {
      addToast({ title: "Error", message: "Session not found for deletion." });
      return;
    }

    const updatedSessions = savedSessionsList.filter((s) => s.id !== sessionId);
    try {
      await chrome.storage.local.set({ savedSessions: updatedSessions });
      setSavedSessionsList(updatedSessions);
      addToast({
        title: "Session Deleted",
        message: `Session "${sessionToDelete.name}" has been deleted.`,
      });
    } catch (e) {
      console.error("[App] Error deleting session from storage:", e);
      addToast({
        title: "Error Deleting Session",
        message: `Failed to delete session: ${
          e instanceof Error ? e.message : String(e)
        }`,
      });
    }
  };

  const filteredAndSortedTabsForActiveWindow =
    getFilteredTabsForWindow(tabsForActiveWindow);

  const totalSelectedTabsAcrossAllWindows = selectedTabIds.size;
  const totalTabsInActiveWindowForDisplay = activeWindowDetails
    ? activeWindowDetails.originalTotalTabs
    : 0;

  const appContent = (
    <AppContainer $isDetachedView={isDetachedView}>
      <HeaderComponent onOpenInNewTab={handleOpenInNewTab} />
      <MainContent>
        <HeaderControls
          searchQuery={activeSearchQuery}
          onSearchChange={setActiveSearchQuery}
          statusFilter={activeStatusFilter}
          onStatusFilterChange={setActiveStatusFilter}
          pinnedFilter={activePinnedFilter}
          onPinnedFilterChange={setActivePinnedFilter}
          onClearAllFilters={resetAllFilters}
          availableTabGroups={availableTabGroups || []}
          groupFilter={activeGroupFilter}
          onGroupFilterChange={setActiveGroupFilter}
          onViewGroupTabs={handleBulkGroupSelectedTabs}
          selectedTabsCount={selectedTabIds.size}
          totalResultsCount={filteredAndSortedTabsForActiveWindow.length}
          onRequestRenameGroup={handleRequestRenameGroup}
          onRequestUngroupTabs={handleRequestUngroupTabs}
          onRequestDeleteGroupAndTabs={handleRequestDeleteGroupAndTabs}
          onSaveSessionRequest={handleSaveSessionRequest}
          currentView={currentView}
          onToggleView={handleToggleView}
        />
        {isLoading && <p>Loading tabs...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}
        {!isLoading &&
          !error &&
          currentView === "tabs" &&
          groupedTabsByWindow.length === 0 && (
            <p>
              No open windows found (excluding this extension popup if it's in a
              separate window).
            </p>
          )}
        {!isLoading &&
          !error &&
          currentView === "tabs" &&
          groupedTabsByWindow.length > 0 && (
            <WindowAccordionListContainer>
              {groupedTabsByWindow.map((windowGroup) => {
                const filteredTabsInThisWindow = getFilteredTabsForWindow(
                  windowGroup.tabs
                );
                const windowDisplayName = `${windowGroup.windowName} (${
                  filteredTabsInThisWindow.length
                } tab${
                  filteredTabsInThisWindow.length !== 1 ? "s" : ""
                } found)`;
                return (
                  <WindowAccordionItem
                    key={windowGroup.windowId}
                    windowId={windowGroup.windowId}
                    windowName={windowDisplayName}
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
                );
              })}
            </WindowAccordionListContainer>
          )}
        {!isLoading && !error && currentView === "sessions" && (
          <SavedSessionsDisplay
            savedSessions={savedSessionsList}
            onRestoreSession={handleRestoreSession}
            onDeleteSession={handleDeleteSession}
          />
        )}
      </MainContent>
      <FooterComponent
        totalSelectedTabs={totalSelectedTabsAcrossAllWindows}
        activeWindowName={
          activeWindowAccordionId !== null && activeWindowNameForDisplay
            ? activeWindowNameForDisplay
            : null
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
        modalTitle={
          modalMode === "rename"
            ? `Rename Group "${groupForRename?.name || ""}"`
            : "Name Your Chrome Group"
        }
        initialInputText={initialInputTextForModal}
        confirmButtonText={
          modalMode === "rename" ? "Confirm Rename" : "Confirm & Create Group"
        }
        customName={customGroupNameInput}
        onCustomNameChange={setCustomGroupNameInput}
        onConfirm={handleConfirmModalAction}
        onCancel={handleCancelGroupName}
        showSuggestedText={modalMode === "create"}
      />
      <SessionNamingModal
        isOpen={isSessionNamingModalOpen}
        initialInputText={initialInputTextForSessionModal}
        sessionName={sessionNameInput}
        onSessionNameChange={setSessionNameInput}
        onConfirm={handleConfirmSaveSession}
        onCancel={handleCancelSaveSession}
        saveScope={currentSaveScope}
        onSaveScopeChange={setSaveScope}
        availableWindows={availableWindowsForSaveModal}
      />
      <ToastsContainer>
        {toasts.map((toast) => (
          <ToastNotification
            key={toast.id}
            id={toast.id}
            title={toast.title}
            message={toast.message}
            groupColor={toast.groupColor}
            duration={toast.duration}
            onDismiss={removeToast}
          />
        ))}
      </ToastsContainer>
    </AppContainer>
  );

  if (!isDetachedView) {
    return (
      <DetachedViewWrapper>
        {appContent}
        <HelpGuideWrapper>
          <HelpGuideComponent />
        </HelpGuideWrapper>
      </DetachedViewWrapper>
    );
  }

  return appContent;
}

export default App;
