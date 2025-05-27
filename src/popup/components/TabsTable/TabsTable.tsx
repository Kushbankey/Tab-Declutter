import React, { useState } from "react";
import {
  TableWrapper,
  StyledTable,
  THead,
  TBody,
  TR,
  TH,
  TD,
  CheckboxInput,
  CategoryBadge,
  StatusBadge,
  ActionButton,
  ActionMenu,
  ActionMenuItem,
  FaviconImage,
} from "./TabsTable.styles";
import { DisplayTab } from "../../types"; // Corrected import path for DisplayTab

// --- Component Props ---

interface TabsTableProps {
  tabs: DisplayTab[];
  selectedTabIds: Set<number>;
  onToggleSelectTab: (tabId: number) => void;
  onSelectAllTabs: (selectAll: boolean) => void;
  onCloseTab: (tabId: number) => void;
  onPinTab: (tabId: number, currentPinnedState: boolean) => void;
  onSwitchToTab: (tabId: number, windowId: number) => void;
}

// --- Component ---

const TabsTable: React.FC<TabsTableProps> = ({
  tabs,
  selectedTabIds,
  onToggleSelectTab,
  onSelectAllTabs,
  onCloseTab,
  onPinTab,
  onSwitchToTab,
}) => {
  const [activeActionMenu, setActiveActionMenu] = useState<number | null>(null);

  const handleToggleActionMenu = (tabId: number) => {
    setActiveActionMenu((prev) => (prev === tabId ? null : tabId));
  };

  const isAllSelected =
    tabs.length > 0 && tabs.every((tab) => selectedTabIds.has(tab.id));

  return (
    <TableWrapper>
      <StyledTable>
        <THead>
          <TR>
            <TH className="checkbox-header">
              <CheckboxInput
                checked={isAllSelected}
                onChange={() => onSelectAllTabs(!isAllSelected)}
                title={isAllSelected ? "Deselect all" : "Select all"}
                aria-label={
                  isAllSelected
                    ? "Deselect all tabs in current view"
                    : "Select all tabs in current view"
                }
              />
            </TH>
            <TH className="icon-header">Icon</TH>
            <TH>Category</TH>
            <TH>Title</TH>
            <TH>Status</TH>
            <TH>Actions</TH>
          </TR>
        </THead>
        <TBody>
          {tabs.map((tab) => (
            <TR
              key={tab.id}
              groupColor={tab.groupColor}
              isSelected={selectedTabIds.has(tab.id)}
              onDoubleClick={() => {
                onSwitchToTab(tab.id, tab.originalTab.windowId);
              }}
              aria-selected={selectedTabIds.has(tab.id)}
              title={
                tab.groupName
                  ? `Group: ${tab.groupName}\n${tab.title}`
                  : tab.title
              }
            >
              <TD>
                <CheckboxInput
                  checked={selectedTabIds.has(tab.id)}
                  onChange={() => onToggleSelectTab(tab.id)}
                  aria-label={`Select tab: ${tab.title}`}
                />
              </TD>
              <TD className="icon-cell">
                {(() => {
                  const isChromeInternalPage =
                    tab.originalTab.url?.startsWith("chrome://") ||
                    tab.originalTab.url?.startsWith("chrome-extension://");
                  const isProperFavicon =
                    tab.favIconUrl &&
                    (tab.favIconUrl.startsWith("http://") ||
                      tab.favIconUrl.startsWith("https://") ||
                      tab.favIconUrl.startsWith("data:"));

                  if (isProperFavicon && !isChromeInternalPage) {
                    return (
                      <FaviconImage
                        src={tab.favIconUrl}
                        alt={`${tab.title} favicon`}
                        onError={(
                          e: React.SyntheticEvent<HTMLImageElement, Event>
                        ) => {
                          (e.target as HTMLImageElement).src =
                            chrome.runtime.getURL("globe-solid.svg");
                          (e.target as HTMLImageElement).alt =
                            "Default globe icon";
                        }}
                      />
                    );
                  } else {
                    return (
                      <FaviconImage
                        src={chrome.runtime.getURL("globe-solid.svg")}
                        alt="Default globe icon"
                      />
                    );
                  }
                })()}
              </TD>
              <TD>
                <CategoryBadge>{tab.category}</CategoryBadge>
              </TD>
              <TD title={tab.title}>{tab.title}</TD>
              <TD>
                <StatusBadge isActive={tab.status === "Active"}>
                  {tab.status}
                </StatusBadge>
              </TD>
              <TD className="actions-cell" style={{ position: "relative" }}>
                <ActionButton
                  onClick={() => handleToggleActionMenu(tab.id)}
                  aria-haspopup="true"
                  aria-expanded={activeActionMenu === tab.id}
                  aria-label={`Actions for tab: ${tab.title}`}
                />
                {activeActionMenu === tab.id && (
                  <ActionMenu role="menu">
                    <ActionMenuItem
                      role="menuitem"
                      onClick={() => {
                        onSwitchToTab(tab.id, tab.originalTab.windowId);
                        setActiveActionMenu(null);
                      }}
                    >
                      Switch to Tab
                    </ActionMenuItem>
                    <ActionMenuItem
                      role="menuitem"
                      onClick={() => {
                        onPinTab(tab.id, tab.originalTab.pinned);
                        setActiveActionMenu(null);
                      }}
                    >
                      {tab.originalTab.pinned ? "Unpin Tab" : "Pin Tab"}
                    </ActionMenuItem>
                    <ActionMenuItem
                      role="menuitem"
                      onClick={() => {
                        onCloseTab(tab.id);
                        setActiveActionMenu(null);
                      }}
                    >
                      Close Tab
                    </ActionMenuItem>
                  </ActionMenu>
                )}
              </TD>
            </TR>
          ))}
        </TBody>
      </StyledTable>
    </TableWrapper>
  );
};

export default TabsTable;
