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
  id: GroupFilterValue; // "all", "none", or groupId (string) - often the group name for dynamic groups
  name: string; // "All Groups", "Ungrouped", or actual group name
  color?: chrome.tabGroups.ColorEnum;
  numericId?: number; // The actual chrome.tabGroups.TabGroup.id for real groups
}

// --- Types for Saved Sessions ---
export interface SavedTabForSession {
  url: string;
  title: string;
  pinned: boolean;
  favIconUrl?: string;
  // We might add group info here in a later version if feasible
}

export interface SavedWindowContext {
  // Name of the window if available at save time, primarily for user reference if we display it.
  // For restoration, its main purpose is to group tabs that were together.
  name?: string;
  tabs: SavedTabForSession[];
}

export interface SavedSession {
  id: string; // Unique ID for the session (e.g., timestamp or UUID)
  name: string; // User-defined name
  savedAt: string; // ISO string date of when it was saved
  windowContexts: SavedWindowContext[]; // Replaces 'tabs: SavedTabForSession[]'
  // Could add overall session metadata like total windows/tabs if useful for display
}
