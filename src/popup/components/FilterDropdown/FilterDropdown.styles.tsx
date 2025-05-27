import styled from "styled-components";

export const DropdownContainer = styled.div`
  position: relative;
`;

export const FilterButton = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  font-size: 14px;
  font-weight: 500; // Medium weight
  border: 1px solid #d1d5db; // Gray-300
  border-radius: 6px;
  background-color: #ffffff; // White background
  color: #111827; // Gray-900 text
  cursor: pointer;
  user-select: none; // Prevent text selection on click

  &:hover {
    background-color: #f9fafb; // Gray-50 on hover
  }

  &.active {
    // Style for when the dropdown is open or button is active
    background-color: #f3f4f6; // Gray-100
    border-color: #9ca3af; // Gray-400
  }
`;

export const ChevronIcon = styled.img`
  width: 20px;
  height: 20px;
`;

export const DropdownMenu = styled.div`
  position: absolute;
  top: 100%; // Below the button
  left: 0;
  background-color: white;
  border: 1px solid #d1d5db; // Gray-300
  border-radius: 8px; // Match image
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
  z-index: 20;
  margin-top: 4px;
  min-width: 150px; // Adjusted min-width for better layout
  padding: 8px; // Internal padding
`;

export const DropdownMenuItem = styled.button`
  display: flex; // For aligning radio and text
  align-items: center;
  gap: 10px; // Space between radio and text
  width: 100%;
  text-align: left;
  padding: 10px 12px; // Adjusted padding
  font-size: 14px;
  background: none;
  border: none;
  border-radius: 4px; // Slightly rounded corners for items
  cursor: pointer;
  color: #374151; // Gray-700
  margin-bottom: 2px; // Space between items

  &:hover {
    background-color: #f3f4f6; // Gray-100
  }

  &.active {
    // Active state styling will be handled by the radio circle mostly
  }
`;

export const RadioCircleOuter = styled.span`
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: 2px solid #adb5bd; // Gray-400
  display: flex;
  align-items: center;
  justify-content: center;
  transition: border-color 0.2s ease-in-out;

  ${DropdownMenuItem}.active & {
    border-color: #4f46e5; // Indigo-600
  }
`;

export const RadioCircleInner = styled.span`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: transparent;
  transition: background-color 0.2s ease-in-out;

  ${DropdownMenuItem}.active & {
    background-color: #4f46e5; // Indigo-600
  }
`;

export const ClearIndividualFilterButton = styled.button`
  display: block;
  width: calc(100% - 16px); // Account for DropdownMenu padding
  margin: 8px auto 0; // Margin top and center
  text-align: left;
  padding: 10px 12px;
  font-size: 14px;
  font-weight: 500;
  background: none;
  border: none;
  border-top: 1px solid #e5e7eb; // Separator line
  cursor: pointer;
  color: #4f46e5; // Indigo-600
  border-radius: 4px;

  &:hover {
    background-color: #f3f4f6; // Gray-100
  }
`;

export const FilterOptionLabel = styled.span`
  // For the main label part of the option
`;

export const FilterOptionDescription = styled.span`
  color: #6b7280; // Medium gray
  margin-left: 6px;
  font-size: 0.9em;
`;
