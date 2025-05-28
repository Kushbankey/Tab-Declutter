import { useState, useCallback } from "react";

// "all" or a stringified windowId
export type SessionSaveScope = "all" | string;

export interface WindowForSaveOption {
  id: number;
  name: string; // e.g., "Window 1 (10 tabs)"
  tabCount: number;
}

interface SessionNamingModalState {
  isOpen: boolean;
  sessionNameInput: string;
  initialInputText: string;
  saveScope: SessionSaveScope; // Can be "all" or a window ID as string
  availableWindowsForSave: WindowForSaveOption[];
}

export const useSessionNamingModal = (initialSessionName: string = "") => {
  const [modalState, setModalState] = useState<SessionNamingModalState>({
    isOpen: false,
    sessionNameInput: initialSessionName,
    initialInputText: "",
    saveScope: "all", // Default to saving all windows
    availableWindowsForSave: [],
  });

  const openModal = useCallback(
    (details?: {
      suggestedName?: string;
      availableWindows?: WindowForSaveOption[];
      activeWindowId?: number | null; // To pre-select if only one window or current is preferred initially
    }) => {
      const defaultSuggestedName = `My Session - ${new Date().toLocaleString()}`;
      const nameToUse = details?.suggestedName || defaultSuggestedName;
      let initialSaveScope: SessionSaveScope = "all";
      if (details?.availableWindows && details.availableWindows.length === 1) {
        // If only one window available (excluding extension), pre-select it.
        initialSaveScope = details.availableWindows[0].id.toString();
      } else if (
        details?.activeWindowId &&
        details?.availableWindows?.some((w) => w.id === details.activeWindowId)
      ) {
        // If an active window is provided and it's in the list, pre-select it.
        initialSaveScope = details.activeWindowId.toString();
      }
      // Else, default to "all"

      setModalState({
        isOpen: true,
        sessionNameInput: nameToUse,
        initialInputText: nameToUse,
        saveScope: initialSaveScope,
        availableWindowsForSave: details?.availableWindows || [],
      });
    },
    []
  );

  const closeModal = useCallback(() => {
    setModalState((prev) => ({
      ...prev,
      isOpen: false,
      availableWindowsForSave: [], // Clear list on close
    }));
  }, []);

  const setSessionNameInput = useCallback((name: string) => {
    setModalState((prev) => ({ ...prev, sessionNameInput: name }));
  }, []);

  const setSaveScope = useCallback((scope: SessionSaveScope) => {
    setModalState((prev) => ({ ...prev, saveScope: scope }));
  }, []);

  return {
    isSessionNamingModalOpen: modalState.isOpen,
    sessionNameInput: modalState.sessionNameInput,
    initialInputTextForSessionModal: modalState.initialInputText,
    saveScope: modalState.saveScope,
    availableWindowsForSaveModal: modalState.availableWindowsForSave,
    openSessionNamingModal: openModal,
    closeSessionNamingModal: closeModal,
    setSessionNameInput,
    setSaveScope,
  };
};
