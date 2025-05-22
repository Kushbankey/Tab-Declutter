import { useState, useCallback } from "react";

/**
 * Custom hook to manage the active accordion item state.
 * @param initialActiveId The initially active accordion ID, or null if none.
 * @returns An object containing the active accordion ID, a setter for it, and a toggle handler.
 */
export const useAccordion = (initialActiveId: number | null = null) => {
  const [activeWindowAccordionId, setActiveWindowAccordionId] = useState<
    number | null
  >(initialActiveId);

  /**
   * Toggles the specified accordion item. If it's already active, it deactivates it.
   * Optionally clears selected tab IDs if a setter function is provided.
   * @param windowId The ID of the window accordion item to toggle.
   * @param setSelectedTabIds Optional callback to clear selected tab IDs.
   */
  const handleToggleAccordion = useCallback(
    (windowId: number, setSelectedTabIds?: (ids: Set<number>) => void) => {
      setActiveWindowAccordionId((prevActiveId) => {
        const newActiveId = prevActiveId === windowId ? null : windowId;
        // Clear selection when accordion changes to avoid confusion
        if (setSelectedTabIds) {
          setSelectedTabIds(new Set());
        }
        return newActiveId;
      });
    },
    []
  ); // Dependencies are empty because setActiveWindowAccordionId is stable and setSelectedTabIds is an optional, stable callback.

  return {
    activeWindowAccordionId,
    setActiveWindowAccordionId, // Expose for direct setting, e.g., by useTabManagement during initial load
    handleToggleAccordion,
  };
};
