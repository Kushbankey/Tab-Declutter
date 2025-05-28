import React, { useEffect, useState } from "react";
import {
  ToastWrapper,
  ToastContent,
  ToastTitle,
  ToastMessage,
  ToastCloseButton,
} from "./ToastNotification.styles";

export interface ToastProps {
  id: string;
  title: string;
  message: string;
  groupColor?: chrome.tabGroups.ColorEnum;
  duration?: number; // Duration in milliseconds
  onDismiss: (id: string) => void;
}

const ToastNotification: React.FC<ToastProps> = ({
  id,
  title,
  message,
  groupColor,
  duration = 5000, // Default duration 5 seconds
  onDismiss,
}) => {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true);
      // Allow time for fade-out animation before actually dismissing
      setTimeout(() => onDismiss(id), 300); // Corresponds to animation duration
    }, duration);

    return () => {
      clearTimeout(timer);
    };
  }, [id, duration, onDismiss]);

  const handleDismiss = () => {
    setIsExiting(true);
    setTimeout(() => onDismiss(id), 300); // Corresponds to animation duration
  };

  return (
    <ToastWrapper
      $groupColor={groupColor}
      $isExiting={isExiting}
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
    >
      <ToastContent>
        <ToastTitle>{title}</ToastTitle>
        <ToastMessage>{message}</ToastMessage>
      </ToastContent>
      <ToastCloseButton onClick={handleDismiss} aria-label="Close notification">
        &times;
      </ToastCloseButton>
    </ToastWrapper>
  );
};

export default ToastNotification;
