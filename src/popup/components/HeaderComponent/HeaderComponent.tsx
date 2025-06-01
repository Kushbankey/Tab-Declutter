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
  const [isDetachedView, setIsDetachedView] = useState(true);

  useEffect(() => {
    if (chrome.windows && chrome.windows.getCurrent) {
      chrome.windows.getCurrent({}, (currentWindow) => {
        if (currentWindow && currentWindow.type === "popup") {
          setIsDetachedView(false);
        } else {
          setIsDetachedView(true);
        }
      });
    } else {
      setIsDetachedView(true);
    }
  }, []);

  return (
    <Header>
      <HeaderTextContainer>
        <HeaderTopLine>
          <Icon
            src={chrome.runtime.getURL("broom64.png")}
            alt="Declutter Icon"
          />
          <WelcomeMessage>Your Windows & Tabs</WelcomeMessage>
        </HeaderTopLine>
        <SubMessage>Manage your browser sessions.</SubMessage>
      </HeaderTextContainer>
      {isDetachedView && (
        <DetachButton
          onClick={onOpenInNewTab}
          onKeyDown={(e: React.KeyboardEvent<HTMLButtonElement>) => {
            if (e.key === "Enter" || e.key === " ") onOpenInNewTab();
          }}
          tabIndex={0}
          aria-label="Detach extension into a new window"
        >
          Detach View
        </DetachButton>
      )}
    </Header>
  );
};

export default HeaderComponent;
