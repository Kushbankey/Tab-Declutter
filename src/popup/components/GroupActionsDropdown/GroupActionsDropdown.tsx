import React, { useEffect, useRef } from "react";
import { DropdownMenuContainer, MenuItem } from "./GroupActionsDropdown.styles";

interface GroupActionsDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  onRename: () => void;
  onUngroup: () => void;
  onDeleteAndClose: () => void;
  anchorElement: HTMLElement | null;
}

const GroupActionsDropdown: React.FC<GroupActionsDropdownProps> = ({
  isOpen,
  onClose,
  onRename,
  onUngroup,
  onDeleteAndClose,
  anchorElement,
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        anchorElement &&
        !anchorElement.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose, anchorElement]);

  if (!isOpen || !anchorElement) return null;

  const rect = anchorElement.getBoundingClientRect();
  const style: React.CSSProperties = {
    top: rect.bottom + window.scrollY, // Position below the anchor
    left: rect.left + window.scrollX, // Align left with the anchor
  };

  // A more robust positioning might use a library like Popper.js if complex scenarios arise,
  // but for now, this direct positioning should work for a simple dropdown.

  return (
    <DropdownMenuContainer ref={dropdownRef} style={style} role="menu">
      <MenuItem onClick={onRename} role="menuitem">
        Rename Group
      </MenuItem>
      <MenuItem onClick={onUngroup} role="menuitem">
        Ungroup Tabs
      </MenuItem>
      <MenuItem onClick={onDeleteAndClose} role="menuitem">
        Delete Group
      </MenuItem>
    </DropdownMenuContainer>
  );
};

export default GroupActionsDropdown;
