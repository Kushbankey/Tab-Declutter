import styled from "styled-components";

export const DropdownMenuContainer = styled.div`
  position: absolute;
  background-color: white;
  border: 1px solid #d1d5db; // Gray-300
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 100; // Ensure it's above other controls but below modals/toasts
  min-width: 150px;
  padding: 8px;
  margin-top: 4px; // Space from the anchor button
`;

export const MenuItem = styled.button`
  display: block;
  width: 100%;
  text-align: left;
  padding: 10px 12px;
  font-size: 14px;
  background: none;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  color: #374151; // Gray-700
  margin-bottom: 2px;

  &:hover {
    background-color: #f3f4f6; // Gray-100
  }

  &:disabled {
    color: #9ca3af; // Gray-400
    cursor: not-allowed;
    background-color: transparent;
  }
`;
