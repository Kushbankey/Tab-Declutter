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
  width: 200px; // Keep this to ensure search bar doesn't take full width initially
`;

export const RightControls = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const FilterLabel = styled.span`
  font-size: 14px;
  color: #4b5563; // Gray-600
  font-weight: 500;
  margin-right: 4px; // Add a small margin if it's directly next to a dropdown
`;

export const SearchContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  flex-grow: 1; // Allow search to take available space in LeftControls
`;

export const SearchIcon = styled.img`
  position: absolute;
  left: 10px; // Adjusted for better padding
  width: 18px; // Slightly smaller to fit well
  height: 18px;
  pointer-events: none; // So it doesn't interfere with input focus
  opacity: 0.7; // Slightly less prominent
`;

export const SearchInputStyled = styled.input`
  padding: 8px 12px 8px 36px; // Adjusted left padding for the icon
  font-size: 14px;
  border: 1px solid #d1d5db; // Gray-300
  border-radius: 6px;
  width: 100%; // Take full width of its container (SearchContainer)
  background-color: #ffffff;
  color: #111827;

  &:focus {
    outline: none;
    border-color: #2563eb; // Blue-600
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.4); // Blue focus ring
  }
`;

export const GroupButton = styled.button`
  // Changed to button for semantics
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  font-size: 14px;
  font-weight: 500;
  border: 1px solid #2563eb;
  border-radius: 6px;
  background-color: #2563eb; // Blue-600
  color: white;
  cursor: pointer;

  &:hover {
    background-color: #1d4ed8; // Blue-700
  }

  &:disabled {
    background-color: #9ca3af; // Gray-400
    border-color: #9ca3af;
    color: #e5e7eb; // Lighter text for disabled state
    cursor: not-allowed;
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
  gap: 12px; // Increased gap between "Filter by:" and first dropdown, and between dropdowns
`;

export const ActiveFiltersDisplay = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 0; // Some vertical padding
  flex-wrap: wrap; // Allow pills to wrap
  min-height: 30px; // Ensure it takes up space even when empty, prevents layout shifts
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
  flex-grow: 1; // Allow pill list to take available space
`;

export const FilterPill = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  background-color: #eef2ff; // Indigo-50 (light purple/blue)
  color: #4338ca; // Indigo-700
  padding: 4px 10px; // Slightly more horizontal padding
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
  transition: opacity 0.2s ease;
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
  padding: 4px 8px; // Add some padding
  border-radius: 4px;
  margin-left: auto; // Push to the right if space allows

  &:hover {
    text-decoration: underline;
    background-color: #f3f4f6; // Slight hover background
  }
`;
