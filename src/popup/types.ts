export interface DisplayTab {
  id: number; // Actual tab.id
  category: string; // e.g., Domain or "Pinned"
  title: string;
  status: "Active" | "Inactive"; // Derived from tab.discarded
  originalTab: chrome.tabs.Tab; // Keep original tab data for actions
  favIconUrl?: string; // To store the favicon URL
  groupId?: number; // From originalTab.groupId, will be -1 if not in a group
  groupName?: string; // User-defined or auto-generated name for the tab group
  groupColor?: chrome.tabGroups.ColorEnum; // Color of the tab group
}

export interface WindowWithTabs {
  windowId: number;
  windowName: string; // e.g., "Window 1" or a derived name
  tabs: DisplayTab[];
  isFocused: boolean; // To know if this was the focused window
  originalTotalTabs: number; // Original number of tabs before any filtering
}

// New types for Tab Group Filtering
export type GroupFilterValue = string; // "all", "none", or a groupId as string

export interface TabGroupForFilter {
  id: GroupFilterValue; // "all", "none", or groupId (string)
  name: string; // "All Groups", "Ungrouped", or actual group name
  color?: chrome.tabGroups.ColorEnum;
}
