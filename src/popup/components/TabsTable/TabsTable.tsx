import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
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
  const [menuPosition, setMenuPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);
  const actionMenuRef = useRef<HTMLDivElement>(null);
  const actionButtonRefs = useRef<Record<number, HTMLButtonElement | null>>({});

  const handleToggleActionMenu = (tabId: number) => {
    setActiveActionMenu((prev) => {
      const newActiveId = prev === tabId ? null : tabId;
      if (newActiveId !== null) {
        const buttonElement = actionButtonRefs.current[tabId];
        if (buttonElement) {
          const rect = buttonElement.getBoundingClientRect();
          setMenuPosition({
            top: rect.bottom + window.scrollY,
            left: rect.left + window.scrollX - 100,
          });
        }
      } else {
        setMenuPosition(null);
      }
      return newActiveId;
    });
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (activeActionMenu === null) return;

      const menuNode = actionMenuRef.current;
      const buttonNode = actionButtonRefs.current[activeActionMenu];

      if (
        menuNode &&
        !menuNode.contains(event.target as Node) &&
        buttonNode &&
        !buttonNode.contains(event.target as Node)
      ) {
        setActiveActionMenu(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [activeActionMenu]);

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
              <TD
                className="actions-cell"
                style={{
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <ActionButton
                  ref={(el) => (actionButtonRefs.current[tab.id] = el)}
                  onClick={() => handleToggleActionMenu(tab.id)}
                  aria-haspopup="true"
                  aria-expanded={activeActionMenu === tab.id}
                  aria-label={`Actions for tab: ${tab.title}`}
                >
                  <img
                    src={chrome.runtime.getURL("ellipsis-vertical.svg")}
                    alt="Actions"
                    style={{ width: "16px", height: "16px" }}
                  />
                </ActionButton>
              </TD>
            </TR>
          ))}
        </TBody>
      </StyledTable>
      {activeActionMenu !== null &&
        menuPosition &&
        actionButtonRefs.current[activeActionMenu] &&
        createPortal(
          <ActionMenu
            ref={actionMenuRef}
            role="menu"
            style={{
              top: `${menuPosition.top}px`,
              left: `${menuPosition.left}px`,
            }}
          >
            <ActionMenuItem
              role="menuitem"
              onClick={() => {
                if (activeActionMenu === null) return;
                onSwitchToTab(
                  activeActionMenu,
                  tabs.find((t) => t.id === activeActionMenu)!.originalTab
                    .windowId
                );
                setActiveActionMenu(null);
              }}
            >
              Switch to Tab
            </ActionMenuItem>
            <ActionMenuItem
              role="menuitem"
              onClick={() => {
                if (activeActionMenu === null) return;
                const currentTab = tabs.find((t) => t.id === activeActionMenu);
                if (currentTab)
                  onPinTab(activeActionMenu, currentTab.originalTab.pinned);
                setActiveActionMenu(null);
              }}
            >
              {tabs.find((t) => t.id === activeActionMenu)?.originalTab.pinned
                ? "Unpin Tab"
                : "Pin Tab"}
            </ActionMenuItem>
            <ActionMenuItem
              role="menuitem"
              onClick={() => {
                if (activeActionMenu === null) return;
                onCloseTab(activeActionMenu);
                setActiveActionMenu(null);
              }}
            >
              Close Tab
            </ActionMenuItem>
          </ActionMenu>,
          document.body
        )}
    </TableWrapper>
  );
};

export default TabsTable;
