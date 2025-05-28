import styled from "styled-components";

export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

export const ModalDialog = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  width: 400px; // Slightly wider for potentially longer session names
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

export const ModalTitle = styled.h2`
  margin-top: 0;
  margin-bottom: 16px;
  font-size: 20px;
  color: #111827;
`;

export const InfoText = styled.p`
  // Renamed from SuggestedNameText for more general use
  font-size: 14px;
  color: #4b5563;
  margin-bottom: 8px;
`;

export const SessionNameInput = styled.input`
  // Renamed from GroupNameInput
  width: 100%;
  padding: 10px;
  box-sizing: border-box;
  margin-bottom: 20px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: #16a34a; // Green to match save button theme
    box-shadow: 0 0 0 2px rgba(22, 163, 74, 0.4); // Green focus ring
  }
`;

export const SaveScopeGroup = styled.div`
  margin-bottom: 20px;
  border: 1px solid #e5e7eb; // Light border for the group
  border-radius: 6px;
  padding: 12px;
`;

export const SaveScopeLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 0;
  font-size: 14px;
  color: #374151; // Gray-700
  cursor: pointer;

  input[type="radio"] {
    accent-color: #16a34a; // Green theme for radio button
    width: 16px; // Custom size
    height: 16px;
  }

  &:not(:last-child) {
    border-bottom: 1px dashed #e5e7eb; // Dashed separator between options
  }
`;

export const ScopeOptionTitle = styled.span`
  font-weight: 500;
`;

export const ScopeOptionDescription = styled.span`
  color: #6b7280; // Gray-500
  font-size: 0.9em;
`;

export const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
`;

export const ModalButton = styled.button`
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 500;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out, border-color 0.2s ease-in-out;

  &.confirm-button {
    background-color: #16a34a; // Green-600
    color: white;
    border: 1px solid #16a34a;

    &:hover {
      background-color: #15803d; // Green-700
    }

    &:disabled {
      background-color: #9ca3af; // Gray-400
      border-color: #9ca3af;
      cursor: not-allowed;
    }
  }

  &.cancel-button {
    background-color: #ffffff;
    color: #374151; // Gray-700
    border: 1px solid #d1d5db; // Gray-300

    &:hover {
      background-color: #f9fafb; // Gray-50
    }
  }
`;
