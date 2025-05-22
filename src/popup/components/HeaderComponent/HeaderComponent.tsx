import React, { useState, useEffect } from "react";
import {
  Header,
  HeaderTextContainer,
  HeaderTopLine,
  WelcomeMessage,
  SubMessage,
  Icon,
  DetachButton,
} from "./HeaderComponent.styles";

interface HeaderComponentProps {
  onOpenInNewTab: () => void;
}

const HeaderComponent: React.FC<HeaderComponentProps> = ({
  onOpenInNewTab,
}) => {
  const [isDetachedView, setIsDetachedView] = useState(false);

  useEffect(() => {
    if (chrome.windows && chrome.windows.getCurrent) {
      chrome.windows.getCurrent({}, (currentWindow) => {
        if (currentWindow.type !== "popup") {
          setIsDetachedView(true);
        }
      });
    }
  }, []);

  return (
    <Header>
      <HeaderTextContainer>
        <HeaderTopLine>
          <Icon src={chrome.runtime.getURL("broom.svg")} alt="Declutter Icon" />
          <WelcomeMessage>Your Windows & Tabs</WelcomeMessage>
        </HeaderTopLine>
        <SubMessage>Manage your browser sessions.</SubMessage>
      </HeaderTextContainer>
      {isDetachedView && (
        <DetachButton
          onClick={onOpenInNewTab}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") onOpenInNewTab();
          }}
          tabIndex={0}
          aria-label="Open extension in a new window"
        >
          Detach View
        </DetachButton>
      )}
    </Header>
  );
};

export default HeaderComponent;
