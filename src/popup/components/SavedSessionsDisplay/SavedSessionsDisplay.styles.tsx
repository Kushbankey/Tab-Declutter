import styled from "styled-components";

export const SessionsListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding-top: 16px; // Add some space from controls if any, or from top
`;

export const SessionCard = styled.div`
  background-color: #ffffff;
  border: 1px solid #e5e7eb; // Gray-200
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
`;

export const SessionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`;

export const SessionName = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #1f2937; // Gray-800
  margin: 0;
`;

export const SessionInfo = styled.p`
  font-size: 13px;
  color: #6b7280; // Gray-500
  margin: 4px 0;
`;

export const SessionActions = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 16px;
`;

const ActionButtonBase = styled.button`
  padding: 8px 12px;
  font-size: 14px;
  font-weight: 500;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;
`;

export const RestoreButton = styled(ActionButtonBase)`
  background-color: #3b82f6; // Blue-500
  color: white;
  border: 1px solid #3b82f6;

  &:hover {
    background-color: #2563eb; // Blue-600
  }
`;

export const DeleteButton = styled(ActionButtonBase)`
  background-color: #ef4444; // Red-500
  color: white;
  border: 1px solid #ef4444;

  &:hover {
    background-color: #dc2626; // Red-600
  }
`;

export const NoSessionsMessage = styled.p`
  font-size: 16px;
  color: #6b7280; // Gray-500
  text-align: center;
  padding: 32px 0;
`;
