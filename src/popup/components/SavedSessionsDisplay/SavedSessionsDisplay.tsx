import React from "react";
// import { SavedSession } from "../../types"; // No longer directly used for prop typing
import {
  SessionsListContainer,
  SessionCard,
  SessionHeader,
  SessionName,
  SessionInfo,
  SessionActions,
  RestoreButton,
  DeleteButton,
  NoSessionsMessage,
} from "./SavedSessionsDisplay.styles";

interface SavedSessionsDisplayProps {
  savedSessions: any[];
  onRestoreSession: (sessionId: string) => void;
  onDeleteSession: (sessionId: string) => void;
}

const SavedSessionsDisplay: React.FC<SavedSessionsDisplayProps> = ({
  savedSessions,
  onRestoreSession,
  onDeleteSession,
}) => {
  if (savedSessions.length === 0) {
    return <NoSessionsMessage>No sessions saved yet.</NoSessionsMessage>;
  }

  return (
    <SessionsListContainer>
      {savedSessions.map((session: any) => {
        let totalTabsInSession = 0;
        let windowCount = 0;
        let isOldFormat = false;

        if (session.windowContexts && Array.isArray(session.windowContexts)) {
          totalTabsInSession = session.windowContexts.reduce(
            (sum: number, context: { tabs: any[] }) =>
              sum + context.tabs.length,
            0
          );
          windowCount = session.windowContexts.length;
        } else if (session.tabs && Array.isArray(session.tabs)) {
          totalTabsInSession = session.tabs.length;
          windowCount = 1;
          isOldFormat = true;
        } else {
          totalTabsInSession = 0;
          windowCount = 0;
        }

        return (
          <SessionCard key={session.id}>
            <SessionHeader>
              <SessionName>{session.name}</SessionName>
            </SessionHeader>
            <SessionInfo>
              Saved: {new Date(session.savedAt).toLocaleString()}
            </SessionInfo>
            <SessionInfo>
              Tabs: {totalTabsInSession}
              {isOldFormat
                ? " (Old format - single window)"
                : ` (across ${windowCount} window(s))`}
            </SessionInfo>
            <SessionActions>
              <RestoreButton onClick={() => onRestoreSession(session.id)}>
                Restore
              </RestoreButton>
              <DeleteButton onClick={() => onDeleteSession(session.id)}>
                Delete
              </DeleteButton>
            </SessionActions>
          </SessionCard>
        );
      })}
    </SessionsListContainer>
  );
};

export default SavedSessionsDisplay;
