import styled, { keyframes } from "styled-components";
// import { ColorEnum } from "../../types"; // Not exported directly

// Animation for fade in and slide in
const fadeInSlideUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

// Animation for fade out
const fadeOut = keyframes`
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
`;

interface ToastWrapperProps {
  $groupColor?: chrome.tabGroups.ColorEnum; // Use direct chrome type
  $isExiting: boolean;
}

// Helper to map Chrome's group colors to CSS-friendly values for the toast
const getToastGroupColorStyles = (
  color?: chrome.tabGroups.ColorEnum
): { backgroundColor: string; borderColor: string; textColor: string } => {
  // Darker text for lighter backgrounds, Lighter text for darker backgrounds
  // Ensuring good contrast.
  switch (color) {
    case "grey":
      return {
        backgroundColor: "#f3f4f6", // Tailwind Gray-100
        borderColor: "#d1d5db", // Tailwind Gray-300
        textColor: "#1f2937",
      }; // Tailwind Gray-800
    case "blue":
      return {
        backgroundColor: "#dbeafe", // Tailwind Blue-100
        borderColor: "#93c5fd", // Tailwind Blue-300
        textColor: "#1e40af",
      }; // Tailwind Blue-800
    case "red":
      return {
        backgroundColor: "#fee2e2", // Tailwind Red-100
        borderColor: "#fca5a5", // Tailwind Red-300
        textColor: "#991b1b",
      }; // Tailwind Red-700
    case "yellow":
      return {
        backgroundColor: "#fef9c3", // Tailwind Yellow-100
        borderColor: "#fde047", // Tailwind Yellow-400
        textColor: "#854d0e",
      }; // Tailwind Amber-700
    case "green":
      return {
        backgroundColor: "#dcfce7", // Tailwind Green-100
        borderColor: "#86efac", // Tailwind Green-300
        textColor: "#15803d",
      }; // Tailwind Green-700
    case "pink":
      return {
        backgroundColor: "#fce7f3", // Tailwind Pink-100
        borderColor: "#f9a8d4", // Tailwind Pink-300
        textColor: "#9d174d",
      }; // Tailwind Pink-700
    case "purple":
      return {
        backgroundColor: "#ede9fe", // Tailwind Violet-100
        borderColor: "#c4b5fd", // Tailwind Violet-300
        textColor: "#5b21b6",
      }; // Tailwind Violet-700
    case "cyan":
      return {
        backgroundColor: "#cffafe", // Tailwind Cyan-100
        borderColor: "#67e8f9", // Tailwind Cyan-300
        textColor: "#0e7490",
      }; // Tailwind Cyan-700
    case "orange":
      return {
        backgroundColor: "#ffedd5", // Tailwind Orange-100
        borderColor: "#fdba74", // Tailwind Orange-300
        textColor: "#9a3412",
      }; // Tailwind Orange-700
    default: // Default/Info style
      return {
        backgroundColor: "#e0e7ff", // Tailwind Indigo-100
        borderColor: "#a5b4fc", // Tailwind Indigo-300
        textColor: "#3730a3",
      }; // Tailwind Indigo-700
  }
};

export const ToastWrapper = styled.div<ToastWrapperProps>`
  ${({ $groupColor }) => {
    const colors = getToastGroupColorStyles($groupColor);
    return `
      background-color: ${colors.backgroundColor};
      border-left: 5px solid ${colors.borderColor};
      color: ${colors.textColor};
    `;
  }}
  padding: 12px 16px;
  margin-bottom: 10px;
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 320px; // Standard toast width
  animation: ${({ $isExiting }) => ($isExiting ? fadeOut : fadeInSlideUp)} 0.3s
    ease-out forwards;
  transition: transform 0.3s ease-out, opacity 0.3s ease-out;
  z-index: 2000; // Ensure toasts are on top

  &:last-child {
    margin-bottom: 0;
  }
`;

export const ToastContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const ToastTitle = styled.strong`
  font-size: 15px;
  font-weight: 600;
`;

export const ToastMessage = styled.p`
  font-size: 13px;
  margin: 0;
  line-height: 1.4;
`;

export const ToastCloseButton = styled.button`
  background: transparent;
  border: none;
  color: inherit; // Inherits color from ToastWrapper for good contrast
  opacity: 0.7;
  cursor: pointer;
  padding: 4px;
  margin-left: 12px;
  font-size: 18px; // Make close icon slightly larger
  line-height: 1;

  &:hover {
    opacity: 1;
  }
`;

// Container for all toasts, usually fixed to a corner of the screen
export const ToastsContainer = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  display: flex;
  flex-direction: column;
  align-items: flex-end; // Toasts align to the right if container is wider
  z-index: 1999; // Just below individual toasts if needed, but usually fine
`;
