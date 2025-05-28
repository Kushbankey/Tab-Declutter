import { useState, useCallback } from "react";
import { TabGroupForFilter } from "../types"; // Import TabGroupForFilter

export type GroupModalMode = "create" | "rename";

interface GroupNamingModalState {
  isOpen: boolean;
  tabIdsToGroup: number[]; // For 'create' mode
  // suggestedName: string; // Will be replaced by initialInputText logic
  customName: string;
  modalMode: GroupModalMode;
  groupForRename?: TabGroupForFilter; // Store details of group being renamed
  initialInputText: string; // Used for both suggested name in create and current name in rename
}

export const useGroupNamingModal = (initialCustomName: string = "") => {
  const [modalState, setModalState] = useState<GroupNamingModalState>({
    isOpen: false,
    tabIdsToGroup: [],
    // suggestedName: "",
    customName: initialCustomName,
    modalMode: "create",
    initialInputText: "",
  });

  const openModal = useCallback(
    (
      mode: GroupModalMode,
      details: {
        tabIds?: number[]; // Required for 'create'
        suggestedName?: string; // For 'create'
        groupToRename?: TabGroupForFilter; // Required for 'rename'
      }
    ) => {
      if (mode === "create") {
        if (!details.tabIds || details.suggestedName === undefined) {
          console.error(
            "For create mode, tabIds and suggestedName are required."
          );
          return;
        }
        setModalState({
          isOpen: true,
          tabIdsToGroup: details.tabIds,
          customName: details.suggestedName,
          modalMode: "create",
          groupForRename: undefined,
          initialInputText: details.suggestedName,
        });
      } else if (mode === "rename") {
        if (!details.groupToRename || !details.groupToRename.name) {
          console.error(
            "For rename mode, groupToRename (with name) is required."
          );
          return;
        }
        setModalState({
          isOpen: true,
          tabIdsToGroup: [], // Not used in rename mode directly via modal
          customName: details.groupToRename.name,
          modalMode: "rename",
          groupForRename: details.groupToRename,
          initialInputText: details.groupToRename.name,
        });
      }
    },
    []
  );

  const closeModal = useCallback(() => {
    setModalState((prev) => ({
      ...prev,
      isOpen: false,
      // Reset fields that should not persist, or set to defaults
      // customName: initialCustomName, // if you want to reset input on close
      // groupForRename: undefined,
      // modalMode: 'create', // reset mode
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
    tabIdsToGroupForNaming: modalState.tabIdsToGroup, // Still useful for create confirmation
    // suggestedGroupName: modalState.suggestedName, // No longer directly stored
    customGroupNameInput: modalState.customName,
    modalMode: modalState.modalMode,
    groupForRename: modalState.groupForRename,
    initialInputTextForModal: modalState.initialInputText, // New exposed value
    openGroupNamingModal: openModal,
    closeGroupNamingModal: closeModal,
    setCustomGroupNameInput: setCustomName,
  };
};
