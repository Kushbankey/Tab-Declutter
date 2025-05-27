import React, { useEffect, useRef } from "react";
import {
  ModalOverlay,
  ModalDialog,
  ModalTitle,
  SuggestedNameText,
  GroupNameInput,
  ModalActions,
  ModalButton,
} from "./GroupNamingModal.styles";

interface GroupNamingModalProps {
  isOpen: boolean;
  suggestedName: string;
  customName: string;
  onCustomNameChange: (name: string) => void;
  onConfirm: () => void;
  onCancel: () => void;
}

const GroupNamingModal: React.FC<GroupNamingModalProps> = ({
  isOpen,
  suggestedName,
  customName,
  onCustomNameChange,
  onConfirm,
  onCancel,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
      // Select the text in the input field for easy editing
      inputRef.current.select();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleOverlayClick = () => {
    onCancel(); // Call the onCancel prop when overlay is clicked
  };

  const handleDialogClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent click from bubbling to the overlay
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && customName.trim() !== "") {
      onConfirm();
    }
    if (e.key === "Escape") {
      onCancel();
    }
  };

  return (
    <ModalOverlay
      onClick={handleOverlayClick} // Use the handler here
      role="dialog"
      aria-modal="true"
      aria-labelledby="group-name-dialog-title"
    >
      <ModalDialog onClick={handleDialogClick}>
        <ModalTitle id="group-name-dialog-title">
          Name Your Chrome Group
        </ModalTitle>
        <SuggestedNameText>
          Suggested: <span style={{ fontWeight: "bold" }}>{suggestedName}</span>
        </SuggestedNameText>
        <GroupNameInput
          ref={inputRef}
          type="text"
          value={customName}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            onCustomNameChange(e.target.value)
          }
          onKeyDown={handleKeyDown}
          placeholder="Enter group name"
          aria-label="Custom group name"
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
            disabled={customName.trim() === ""}
          >
            Confirm & Create Group
          </ModalButton>
        </ModalActions>
      </ModalDialog>
    </ModalOverlay>
  );
};

export default GroupNamingModal;
