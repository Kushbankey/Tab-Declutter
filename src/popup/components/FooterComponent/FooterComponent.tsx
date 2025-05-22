import React from "react";
import { Footer } from "./FooterComponent.styles";

interface FooterComponentProps {
  totalSelectedTabs: number;
  activeWindowName: string | null;
  totalTabsInActiveWindow: number | null;
  isActiveWindowAvailable: boolean;
}

const FooterComponent: React.FC<FooterComponentProps> = ({
  totalSelectedTabs,
  activeWindowName,
  totalTabsInActiveWindow,
  isActiveWindowAvailable,
}) => {
  return (
    <Footer>
      <div>{totalSelectedTabs} tab(s) selected</div>
      {isActiveWindowAvailable &&
        activeWindowName &&
        totalTabsInActiveWindow !== null && (
          <div>
            Context: {activeWindowName} ({totalTabsInActiveWindow} tabs in view)
          </div>
        )}
      <div>Rows per page: N/A</div>
    </Footer>
  );
};

export default FooterComponent;
