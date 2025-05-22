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
  width: 350px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

export const ModalTitle = styled.h2`
  margin-top: 0;
  margin-bottom: 16px;
  font-size: 20px;
  color: #111827;
`;

export const SuggestedNameText = styled.p`
  font-size: 14px;
  color: #4b5563;
  margin-bottom: 8px;
`;

export const GroupNameInput = styled.input`
  width: 100%;
  padding: 10px;
  box-sizing: border-box;
  margin-bottom: 20px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: #2563eb;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.4);
  }
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
    background-color: #2563eb; // Blue-600
    color: white;
    border: 1px solid #2563eb;

    &:hover {
      background-color: #1d4ed8; // Blue-700
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
