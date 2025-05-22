import React from "react";
import {
  AccordionItemWrapper,
  AccordionHeader,
  AccordionContent,
} from "./WindowAccordionItem.styles";

interface WindowAccordionItemProps {
  windowId: number;
  windowName: string;
  isActive: boolean;
  onToggle: () => void;
  children: React.ReactNode; // For TabsTable or other content
}

const WindowAccordionItem: React.FC<WindowAccordionItemProps> = ({
  windowId,
  windowName,
  isActive,
  onToggle,
  children,
}) => {
  return (
    <AccordionItemWrapper>
      <AccordionHeader
        className={isActive ? "active" : ""}
        onClick={onToggle}
        aria-expanded={isActive}
        aria-controls={`accordion-content-${windowId}`}
      >
        <span>{windowName}</span>
        <span>{isActive ? "▲" : "▼"}</span>
      </AccordionHeader>
      {isActive && (
        <AccordionContent id={`accordion-content-${windowId}`}>
          {children}
        </AccordionContent>
      )}
    </AccordionItemWrapper>
  );
};

export default WindowAccordionItem;
