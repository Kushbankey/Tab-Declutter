import React, { useEffect, useRef } from "react";
import {
  SessionSaveScope,
  WindowForSaveOption,
} from "../../hooks/useSessionNamingModal";
import {
  ModalOverlay,
  ModalDialog,
  ModalTitle,
  InfoText,
  SessionNameInput,
  ModalActions,
  ModalButton,
  SaveScopeGroup,
  SaveScopeLabel,
  ScopeOptionTitle,
} from "./SessionNamingModal.styles";

interface SessionNamingModalProps {
  isOpen: boolean;
  initialInputText: string;
  sessionName: string;
  onSessionNameChange: (name: string) => void;
  onConfirm: () => void;
  onCancel: () => void;
  saveScope: SessionSaveScope;
  onSaveScopeChange: (scope: SessionSaveScope) => void;
  availableWindows: WindowForSaveOption[];
}

const SessionNamingModal: React.FC<SessionNamingModalProps> = ({
  isOpen,
  initialInputText,
  sessionName,
  onSessionNameChange,
  onConfirm,
  onCancel,
  saveScope,
  onSaveScopeChange,
  availableWindows,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      onSessionNameChange(initialInputText);
      if (
        saveScope !== "all" &&
        !availableWindows.some((w) => w.id.toString() === saveScope)
      ) {
        onSaveScopeChange("all");
      }
      if (inputRef.current) {
        inputRef.current.focus();
        inputRef.current.select();
      }
    }
  }, [
    isOpen,
    initialInputText,
    onSessionNameChange,
    availableWindows,
    saveScope,
    onSaveScopeChange,
  ]);

  if (!isOpen) return null;

  const handleOverlayClick = () => {
    onCancel();
  };

  const handleDialogClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && sessionName.trim() !== "") {
      onConfirm();
    }
    if (e.key === "Escape") {
      onCancel();
    }
  };

  return (
    <ModalOverlay
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="session-name-dialog-title"
    >
      <ModalDialog onClick={handleDialogClick}>
        <ModalTitle id="session-name-dialog-title">Save Session</ModalTitle>

        <SaveScopeGroup>
          <SaveScopeLabel>
            <input
              type="radio"
              name="saveScope"
              value="all"
              checked={saveScope === "all"}
              onChange={() => onSaveScopeChange("all")}
            />
            <div>
              <ScopeOptionTitle>All open windows</ScopeOptionTitle>
            </div>
          </SaveScopeLabel>

          {availableWindows.map((windowOption) => (
            <SaveScopeLabel key={windowOption.id}>
              <input
                type="radio"
                name="saveScope"
                value={windowOption.id.toString()}
                checked={saveScope === windowOption.id.toString()}
                onChange={() => onSaveScopeChange(windowOption.id.toString())}
              />
              <div>
                <ScopeOptionTitle>{windowOption.name}</ScopeOptionTitle>
              </div>
            </SaveScopeLabel>
          ))}
        </SaveScopeGroup>

        <InfoText>Please enter a name for this session.</InfoText>
        <SessionNameInput
          ref={inputRef}
          type="text"
          value={sessionName}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            onSessionNameChange(e.target.value)
          }
          onKeyDown={handleKeyDown}
          placeholder="Enter session name"
          aria-label="Session name"
        />
        <ModalActions>
          <ModalButton
            type="button"
            className="cancel-button"
            onClick={onCancel}
          >
            Cancel
          </ModalButton>
          <ModalButton
            type="button"
            className="confirm-button"
            onClick={onConfirm}
            disabled={sessionName.trim() === ""}
          >
            Save Session
          </ModalButton>
        </ModalActions>
      </ModalDialog>
    </ModalOverlay>
  );
};

export default SessionNamingModal;
