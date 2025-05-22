import styled from "styled-components";

export const TableWrapper = styled.div`
  overflow-x: auto; // In case content is wider than container
  border: 1px solid #e5e7eb; // Border like in the image
  border-radius: 8px; // Rounded corners for the table container
  background-color: #ffffff; // White background for the table area
`;

export const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse; // Cleaner lines
  font-size: 14px;
  color: #374151; // Default text color for table
`;

export const THead = styled.thead`
  background-color: #f9fafb; // Very light gray for header row
  border-bottom: 1px solid #e5e7eb;
`;

export const TBody = styled.tbody`
  // No specific styles needed for tbody usually, inherits from table
  // but good to have for consistency or future styling.
`;

export const TR = styled.tr`
  &:not(:last-child) {
    border-bottom: 1px solid #e5e7eb; // Border between rows
  }

  &.selected-row {
    background-color: #eff6ff; // Light blue for selected rows (optional)
  }

  &:hover {
    background-color: #f9fafb; // Slight hover effect
  }
`;

export const TH = styled.th`
  padding: 12px 16px;
  text-align: left;
  font-weight: 600;
  color: #4b5563; // Header text color
  text-transform: capitalize; // "Status", "Priority" look capitalized

  &.checkbox-header {
    width: 40px; // For checkbox
    padding-right: 0;
  }
  &.icon-header {
    width: 40px; // For icon
    text-align: center;
  }
`;

export const TD = styled.td`
  padding: 12px 16px;
  vertical-align: middle;

  &.actions-cell {
    text-align: right;
  }
  &.icon-cell {
    width: 40px;
    text-align: center;
  }
`;

export const CheckboxInput = styled.input.attrs({ type: "checkbox" })`
  width: 16px;
  height: 16px;
  cursor: pointer;
  accent-color: #2563eb; // Tailwind's blue-600 for checkbox color
`;

export const CategoryBadge = styled.span`
  display: inline-block;
  padding: 2px 8px;
  font-size: 12px;
  font-weight: 500;
  border-radius: 12px;
  background-color: #e0e7ff; // Example: Indigo-100
  color: #4338ca; // Example: Indigo-700
  border: 1px solid #c7d2fe; // Example: Indigo-200
`;

export const StatusBadge = styled.span<{ isActive: boolean }>`
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  font-size: 12px;
  font-weight: 500;
  border-radius: 12px;

  background-color: ${(props) =>
    props.isActive
      ? "#d1fae5"
      : "#fee2e2"}; // Green-100 for active, Red-100 for inactive
  color: ${(props) =>
    props.isActive
      ? "#065f46"
      : "#991b1b"}; // Green-700 for active, Red-700 for inactive
  border: 1px solid ${(props) => (props.isActive ? "#a7f3d0" : "#fecaca")}; // Green-200 for active, Red-200 for inactive

  &::before {
    content: "";
    display: inline-block;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: ${(props) =>
      props.isActive ? "#10b981" : "#ef4444"}; // Green-500, Red-500
    margin-right: 6px;
  }
`;

export const ActionButton = styled.button`
  background: none;
  border: none;
  padding: 4px;
  cursor: pointer;
  color: #6b7280; // Medium gray
  border-radius: 4px;

  &:hover {
    background-color: #f3f4f6; // Light gray hover
    color: #1f2937; // Darker gray text on hover
  }

  &::after {
    content: "...";
    font-size: 18px;
    font-weight: bold;
    line-height: 1;
  }
`;

export const ActionMenu = styled.div`
  position: absolute;
  right: 16px;
  top: 40px;
  background-color: white;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
  z-index: 10;
  min-width: 120px;
`;

export const ActionMenuItem = styled.button`
  display: block;
  width: 100%;
  text-align: left;
  padding: 8px 12px;
  font-size: 14px;
  background: none;
  border: none;
  cursor: pointer;
  color: #374151;

  &:hover {
    background-color: #f9fafb;
  }
`;

export const FaviconImage = styled.img`
  width: 16px;
  height: 16px;
  vertical-align: middle;
`;
