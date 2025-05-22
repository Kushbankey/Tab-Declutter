import { useState, useCallback } from "react";

interface GroupNamingModalState {
  isOpen: boolean;
  tabIdsToGroup: number[];
  suggestedName: string;
  customName: string;
}

export const useGroupNamingModal = (initialCustomName: string = "") => {
  const [modalState, setModalState] = useState<GroupNamingModalState>({
    isOpen: false,
    tabIdsToGroup: [],
    suggestedName: "",
    customName: initialCustomName,
  });

  const openModal = useCallback((tabIds: number[], suggested: string) => {
    setModalState({
      isOpen: true,
      tabIdsToGroup: tabIds,
      suggestedName: suggested,
      customName: suggested, // Initialize customName with suggestedName
    });
  }, []);

  const closeModal = useCallback(() => {
    setModalState((prev) => ({
      ...prev,
      isOpen: false,
      // Optionally reset other fields here or let them persist until next open
      // customName: initialCustomName, // Reset if desired
    }));
  }, []);

  const setCustomName = useCallback((name: string) => {
    setModalState((prev) => ({ ...prev, customName: name }));
  }, []);

  // The actual group creation logic (chrome API calls) will remain in App.tsx
  // or be passed as a callback to a confirm handler if this hook becomes more generic.
  // For now, this hook primarily manages the modal's UI state.

  return {
    isGroupNamingModalOpen: modalState.isOpen,
    tabIdsToGroupForNaming: modalState.tabIdsToGroup,
    suggestedGroupName: modalState.suggestedName,
    customGroupNameInput: modalState.customName,
    openGroupNamingModal: openModal,
    closeGroupNamingModal: closeModal,
    setCustomGroupNameInput: setCustomName,
  };
};
