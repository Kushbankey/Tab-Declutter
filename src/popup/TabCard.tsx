import React from "react";

interface TabCardProps {
  tab: chrome.tabs.Tab;
  onClose?: (tabId: number | undefined) => void;
  onPin?: (tabId: number | undefined, pinned: boolean) => void;
}

const TabCard: React.FC<TabCardProps> = ({ tab, onClose, onPin }) => {
  const handleClose = () => {
    if (onClose) {
      onClose(tab.id);
    }
  };

  const handlePin = () => {
    if (onPin && tab.id !== undefined) {
      onPin(tab.id, !tab.pinned);
    }
  };

  const handleDoubleClick = async () => {
    if (tab.id === undefined) return;
    try {
      // Activate the tab
      await chrome.tabs.update(tab.id, { active: true });
      // Focus the window the tab is in
      if (tab.windowId !== undefined) {
        await chrome.windows.update(tab.windowId, { focused: true });
      }
    } catch (error) {
      console.error("[TabDeclutter] Error switching to tab:", error);
      // Optionally, set an error state to inform the user if the App component has error handling capabilities passed down
    }
  };

  return (
    <div
      className="tab-card"
      style={{
        border: "1px solid #ccc",
        padding: "10px",
        margin: "5px",
        borderRadius: "4px",
        display: "flex",
        alignItems: "center",
        cursor: "pointer",
      }}
      onDoubleClick={handleDoubleClick}
      title={`${tab.title}\n${tab.url}`}
    >
      <img
        src={tab.favIconUrl || "icon.png"}
        alt="favicon"
        style={{ width: "16px", height: "16px", marginRight: "8px" }}
      />
      <span
        style={{
          flexGrow: 1,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {tab.title}
      </span>
      <button
        onClick={(e) => {
          e.stopPropagation();
          handlePin();
        }}
        style={{ marginLeft: "8px" }}
      >
        {tab.pinned ? "Unpin" : "Pin"}
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleClose();
        }}
        style={{ marginLeft: "8px" }}
      >
        X
      </button>
    </div>
  );
};

export default TabCard;
