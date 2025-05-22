import styled from "styled-components";

// --- Styled Components ---

export const ControlsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 16px; // Space below the controls, before the table
  gap: 12px; // Gap between control groups
`;

export const LeftControls = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 20%;
`;

export const RightControls = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const FilterControlWrapper = styled.div`
  position: relative; // For the dropdown positioning
  display: flex;
  align-items: center;
  gap: 10px; // Space between label and button
`;

export const FilterLabel = styled.span`
  font-size: 14px;
  color: #4b5563; // Gray-600
  font-weight: 500;
`;

export const SearchContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

export const SearchIcon = styled.img`
  position: absolute;
  left: 8px;
  width: 20px;
  height: 20px;
  pointer-events: none; // So it doesn't interfere with input focus
`;

export const SearchInputStyled = styled.input`
  padding: 8px 12px 8px 35px; // Added left padding for the icon
  font-size: 14px;
  border: 1px solid #d1d5db; // Gray-300
  border-radius: 6px;
  min-width: 160px;
  background-color: #ffffff;
  color: #111827;

  &:focus {
    outline: none;
    border-color: #2563eb; // Blue-600
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.4); // Blue focus ring
  }
`;

export const FilterButton = styled.div`
  display: inline-flex;
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

  &:hover {
    background-color: #f9fafb; // Gray-50 on hover
  }

  &.active {
    // Style for when the dropdown is open or button is active
    background-color: #f3f4f6; // Gray-100
    border-color: #9ca3af; // Gray-400
  }

  &.view-icon::before {
    content: "\2630"; /* Hamburger/list icon placeholder */
    font-size: 12px;
  }
`;

export const ChevronIcon = styled.img`
  width: 16px;
  height: 16px;
  // margin-left: 4px; // Remove, gap in FilterButton is enough
`;

export const GroupButton = styled(FilterButton)`
  background-color: #2563eb; // Blue-600
  color: white;
  border-color: #2563eb;

  &:hover {
    background-color: #1d4ed8; // Blue-700
  }

  &:disabled {
    background-color: #9ca3af; // Gray-400
    border-color: #9ca3af;
    cursor: not-allowed;
  }
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
  min-width: 150px; // Match image
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
    // Optionally, slight background change or font weight if needed
    // background-color: #eff6ff; // Light blue for active item
    // font-weight: 500;
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

export const ClearFilterButton = styled.button`
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

// --- New Styled Components for Advanced Filter UI ---

export const FiltersContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px; // Space between dropdowns row and active filters display
  margin-bottom: 16px; // Space below the entire filter section
`;

export const FilterDropdownsRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px; // Gap between "Filter by:" and first dropdown, and between dropdowns
`;

export const ActiveFiltersDisplay = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 0; // Some vertical padding
  flex-wrap: wrap; // Allow pills to wrap
`;

export const ResultsCount = styled.span`
  font-size: 14px;
  color: #4b5563; // Gray-600
`;

export const FilterPillsList = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
`;

export const FilterPill = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  background-color: #eef2ff; // Indigo-50 (light purple/blue)
  color: #4338ca; // Indigo-700
  padding: 4px 8px;
  border-radius: 16px; // Fully rounded
  font-size: 13px;
  font-weight: 500;
`;

export const FilterPillText = styled.span``; // Basic span, styling mostly from FilterPill

export const FilterPillCloseIcon = styled.img`
  width: 14px;
  height: 14px;
  cursor: pointer;
  opacity: 0.7;
  &:hover {
    opacity: 1;
  }
`;

export const ClearAllButton = styled.button`
  background: none;
  border: none;
  color: #4f46e5; // Indigo-600
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  padding: 4px;

  &:hover {
    text-decoration: underline;
  }
`;
