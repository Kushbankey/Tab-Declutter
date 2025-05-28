import { useState, useCallback } from "react";

export interface ToastData {
  id: string;
  title: string;
  message: string;
  groupColor?: chrome.tabGroups.ColorEnum;
  duration?: number;
}

let toastIdCounter = 0;

export const useToast = () => {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const addToast = useCallback(
    (toastInfo: Omit<ToastData, "id"> & { id?: string }) => {
      const id = toastInfo.id || `toast-${toastIdCounter++}`;
      setToasts((prevToasts) => [...prevToasts, { ...toastInfo, id }]);
    },
    []
  );

  const removeToast = useCallback((id: string) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  }, []);

  return { toasts, addToast, removeToast };
};
