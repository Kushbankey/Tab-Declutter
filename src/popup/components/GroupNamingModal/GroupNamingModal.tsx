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
  modalTitle: string;
  initialInputText: string;
  confirmButtonText: string;
  customName: string;
  onCustomNameChange: (name: string) => void;
  onConfirm: () => void;
  onCancel: () => void;
  showSuggestedText?: boolean;
}

const GroupNamingModal: React.FC<GroupNamingModalProps> = ({
  isOpen,
  modalTitle,
  initialInputText,
  confirmButtonText,
  customName,
  onCustomNameChange,
  onConfirm,
  onCancel,
  showSuggestedText = true,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      onCustomNameChange(initialInputText);
      if (inputRef.current) {
        inputRef.current.focus();
        inputRef.current.select();
      }
    }
  }, [isOpen, initialInputText, onCustomNameChange]);

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
        <ModalTitle id="group-name-dialog-title">{modalTitle}</ModalTitle>
        {showSuggestedText && (
          <SuggestedNameText>
            Suggested:{" "}
            <span style={{ fontWeight: "bold" }}>{initialInputText}</span>
          </SuggestedNameText>
        )}
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
            {confirmButtonText}
          </ModalButton>
        </ModalActions>
      </ModalDialog>
    </ModalOverlay>
  );
};

export default GroupNamingModal;
