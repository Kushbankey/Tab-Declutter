import React from "react";
import { TabGroup } from "./App"; // Import the TabGroup interface
import TabCard from "./TabCard.tsx";

interface GroupTabsProps {
  groups: TabGroup[];
  onToggleCollapse: (groupId: string) => void;
  onCloseTab: (tabId: number | undefined) => void;
  onPinTab: (tabId: number | undefined, pinned: boolean) => void;
  onCreateChromeGroup: (groupName: string, tabIds: number[]) => void;
}

const GroupTabs: React.FC<GroupTabsProps> = ({
  groups,
  onToggleCollapse,
  onCloseTab,
  onPinTab,
  onCreateChromeGroup,
}) => {
  if (!groups || groups.length === 0) {
    // This case should ideally be handled by the App component before rendering GroupTabs
    // but as a fallback:
    // return <p>No groups to display.</p>;
    // App.tsx now handles this, so GroupTabs can assume groups exist if it's rendered.
  }

  return (
    <div className="groups-container">
      {groups.map((group) => (
        <div
          key={group.id}
          className="tab-group"
          style={{
            marginBottom: "15px",
            border: "1px solid #ddd",
            borderRadius: "4px",
            padding: "10px",
          }}
        >
          <div
            className="group-header"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "5px",
            }}
          >
            <h3
              style={{ margin: 0, cursor: "pointer" }}
              onClick={() => onToggleCollapse(group.id)}
            >
              {group.collapsed ? "▶" : "▼"} {group.title} ({group.tabs.length})
            </h3>
            {!group.chromeGroupId && group.tabs.length > 0 && (
              <button
                onClick={() => {
                  const unGroupedTabIds = group.tabs
                    .filter((t) => t.id !== undefined && t.groupId === -1) // Only tabs not already in a Chrome group
                    .map((t) => t.id as number);
                  if (unGroupedTabIds.length > 0) {
                    onCreateChromeGroup(group.title, unGroupedTabIds);
                  } else {
                    alert(
                      "All tabs in this logical group are already in other Chrome groups or there are no tabs to group."
                    );
                  }
                }}
                style={{
                  marginLeft: "10px",
                  padding: "2px 5px",
                  fontSize: "0.8em",
                }}
              >
                Group in Chrome
              </button>
            )}
            {group.chromeGroupId && (
              <span style={{ fontSize: "0.8em", color: "green" }}>
                (Managed by Chrome)
              </span>
            )}
          </div>
          {!group.collapsed && (
            <div className="group-tabs-list">
              {group.tabs.map((tab) => (
                <TabCard
                  key={tab.id}
                  tab={tab}
                  onClose={onCloseTab}
                  onPin={onPinTab}
                />
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default GroupTabs;
