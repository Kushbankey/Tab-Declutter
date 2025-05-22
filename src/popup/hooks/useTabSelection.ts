import { useState, useCallback } from "react";
import { DisplayTab } from "../types"; // Needed for tabsForActiveWindow argument type

export const useTabSelection = (
  initialSelectedIds: Set<number> = new Set()
) => {
  const [selectedTabIds, setSelectedTabIds] =
    useState<Set<number>>(initialSelectedIds);

  const handleToggleSelectTab = useCallback((tabId: number) => {
    setSelectedTabIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(tabId)) {
        newSet.delete(tabId);
      } else {
        newSet.add(tabId);
      }
      return newSet;
    });
  }, []);

  // tabsForActiveWindow needs to be passed in as it's derived from other states (groupedTabsByWindow and activeWindowAccordionId)
  const handleSelectAllTabsInActiveWindow = useCallback(
    (selectAll: boolean, tabsInCurrentWindow: DisplayTab[]) => {
      const tabIdsInWindow = tabsInCurrentWindow.map((t) => t.id);
      if (selectAll) {
        setSelectedTabIds((prev) => new Set([...prev, ...tabIdsInWindow]));
      } else {
        setSelectedTabIds(
          (prev) =>
            new Set([...prev].filter((id) => !tabIdsInWindow.includes(id)))
        );
      }
    },
    []
  );

  return {
    selectedTabIds,
    setSelectedTabIds, // Expose setter for useAccordion and useTabManagement to clear selection
    handleToggleSelectTab,
    handleSelectAllTabsInActiveWindow,
  };
};
