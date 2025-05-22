export interface DisplayTab {
  id: number; // Actual tab.id
  category: string; // e.g., Domain or "Pinned"
  title: string;
  status: "Active" | "Inactive"; // Derived from tab.active
  originalTab: chrome.tabs.Tab; // Keep original tab data for actions
  favIconUrl?: string; // To store the favicon URL
}

export interface WindowWithTabs {
  windowId: number;
  windowName: string; // e.g., "Window 1" or a derived name
  tabs: DisplayTab[];
  isFocused: boolean; // To know if this was the focused window
}
