import React from "react";
import {
  GuideContainer,
  GuideTitle,
  GuideSection,
  SectionTitle,
  Paragraph,
  StrongText,
  CodeText,
  FeatureList,
  FeatureListItem,
  Tip,
  IconImage,
} from "./HelpGuide.styles";

const HelpGuideComponent: React.FC = () => {
  return (
    <GuideContainer>
      <GuideTitle>
        <IconImage
          src={chrome.runtime.getURL("broom64.png")}
          alt="TabDeclutter Icon"
        />
        TabDeclutter Help Guide
      </GuideTitle>

      <GuideSection>
        <SectionTitle>👋 Welcome!</SectionTitle>
        <Paragraph>
          Welcome to TabDeclutter! This guide will help you understand and
          utilize all the features to manage your browser tabs efficiently.
        </Paragraph>
      </GuideSection>

      <GuideSection>
        <SectionTitle>⚙️ Core Features</SectionTitle>
        <FeatureList>
          <FeatureListItem>
            <StrongText>Search Tabs:</StrongText> Quickly find any open tab by
            its title, URL, or assigned category using the search bar at the
            top.
          </FeatureListItem>
          <FeatureListItem>
            <StrongText>Filter Tabs:</StrongText> Use the dropdown filters for
            "Tab Status" (Active/Inactive), "Pinned Status", and "Tab Group" to
            narrow down your view.
          </FeatureListItem>
          <FeatureListItem>
            <StrongText>Window Accordions:</StrongText> Tabs are organized by
            the window they belong to. Click on a window header to expand or
            collapse its tab list.
          </FeatureListItem>
          <FeatureListItem>
            <StrongText>Tab Actions (in table):</StrongText>
            <FeatureList style={{ marginTop: "8px", paddingLeft: "20px" }}>
              <FeatureListItem>
                Double-click a row to switch to that tab.
              </FeatureListItem>
              <FeatureListItem>
                Use the checkbox to select tabs for bulk actions.
              </FeatureListItem>
              <FeatureListItem>
                Click the action menu (...) on a tab row to Pin/Unpin, or Close
                the tab.
              </FeatureListItem>
            </FeatureList>
          </FeatureListItem>
        </FeatureList>
      </GuideSection>

      <GuideSection>
        <SectionTitle>🗂️ Grouping Tabs</SectionTitle>
        <Paragraph>
          You can organize related tabs into Chrome Tab Groups directly from
          this extension.
        </Paragraph>
        <FeatureList>
          <FeatureListItem>
            <StrongText>Create a New Group:</StrongText> Select one or more tabs
            in the table and click the <CodeText>Group Selected (...)</CodeText>{" "}
            button. You'll be prompted to name your new group.
          </FeatureListItem>
          <FeatureListItem>
            <StrongText>Filter by Group:</StrongText> Once groups are created,
            use the "Tab Group" filter to see only tabs from a specific group,
            all grouped tabs, or only ungrouped tabs.
          </FeatureListItem>
          <FeatureListItem>
            <StrongText>Manage Existing Groups:</StrongText> When a specific tab
            group is selected in the filter, a{" "}
            <CodeText>Manage "[Group Name]"</CodeText> button will appear.
            Clicking this opens a dropdown to:
            <FeatureList style={{ marginTop: "8px", paddingLeft: "20px" }}>
              <FeatureListItem>
                <StrongText>Rename Group:</StrongText> Opens a dialog to change
                the group's name.
              </FeatureListItem>
              <FeatureListItem>
                <StrongText>Ungroup Tabs:</StrongText> Removes all tabs from the
                selected Chrome group, but keeps them open.
              </FeatureListItem>
              <FeatureListItem>
                <StrongText>Delete Group & Close Tabs:</StrongText> Closes all
                tabs within the group and deletes the group.
              </FeatureListItem>
            </FeatureList>
          </FeatureListItem>
        </FeatureList>
        <Tip>
          <StrongText>Tip:</StrongText> Active filters (like selected group) are
          shown as pills. You can click the 'x' on a pill or "Clear All" to
          reset your view.
        </Tip>
      </GuideSection>

      <GuideSection>
        <SectionTitle>🖼️ Detached View</SectionTitle>
        <Paragraph>
          For a more spacious and persistent interface, you can detach the
          extension into its own window.
        </Paragraph>
        <FeatureList>
          <FeatureListItem>
            <StrongText>How to Detach:</StrongText> If you open TabDeclutter as
            a standard popup, click the <CodeText>Detach View</CodeText> button
            in the header.
          </FeatureListItem>
          <FeatureListItem>
            <StrongText>Benefits:</StrongText> The detached view provides more
            screen real estate. This help guide, for example, is only visible in
            the detached view!
          </FeatureListItem>
        </FeatureList>
      </GuideSection>

      <GuideSection>
        <SectionTitle>💾 Saving and Restoring Sessions</SectionTitle>
        <Paragraph>
          Preserve your browsing sessions for later or transfer them to another
          setup easily.
        </Paragraph>
        <FeatureList>
          <FeatureListItem>
            <StrongText>Save a Session:</StrongText> Click the{" "}
            <CodeText>Save Session</CodeText> button located in the top-right
            controls. A modal will appear allowing you to:
            <FeatureList style={{ marginTop: "8px", paddingLeft: "20px" }}>
              <FeatureListItem>
                <StrongText>Name Your Session:</StrongText> Provide a
                descriptive name for easy identification (e.g., "Work Projects
                Q3", "Holiday Planning").
              </FeatureListItem>
              <FeatureListItem>
                <StrongText>Choose Save Scope:</StrongText> Select whether to
                save tabs from <CodeText>All open windows</CodeText> or only
                from a <CodeText>Specific window</CodeText> using the radio
                buttons.
              </FeatureListItem>
            </FeatureList>
          </FeatureListItem>
          <FeatureListItem>
            <StrongText>View Saved Sessions:</StrongText> Click the{" "}
            <CodeText>View Saved Sessions</CodeText> button (it might initially
            say <CodeText>View Current Tabs</CodeText> if you are in the tab
            view). This will switch the display to show a list of all your saved
            sessions.
          </FeatureListItem>
          <FeatureListItem>
            <StrongText>Restore a Session:</StrongText> In the saved sessions
            view, each session card will have a <CodeText>Restore</CodeText>{" "}
            button. Clicking it will:
            <FeatureList style={{ marginTop: "8px", paddingLeft: "20px" }}>
              <FeatureListItem>
                Open the saved tabs in new Chrome window(s).
              </FeatureListItem>
              <FeatureListItem>
                If the session was saved with multiple window contexts (i.e.,
                from "All open windows" or if a multi-window session was saved),
                each context will be restored into its own new window,
                preserving that structure.
              </FeatureListItem>
            </FeatureList>
          </FeatureListItem>
          <FeatureListItem>
            <StrongText>Delete a Session:</StrongText> Each session card also
            has a <CodeText>Delete</CodeText> button to permanently remove the
            saved session from storage.
          </FeatureListItem>
        </FeatureList>
        <Tip>
          <StrongText>Note:</StrongText> When viewing saved sessions, the tab
          search and filtering controls are hidden as they only apply to live
          tabs.
        </Tip>
      </GuideSection>

      <GuideSection>
        <SectionTitle>✨ Tips for Efficient Tab Management</SectionTitle>
        <FeatureList>
          <FeatureListItem>
            Regularly review and close unneeded tabs. Use the "Close Tab"
            action.
          </FeatureListItem>
          <FeatureListItem>
            Pin frequently used tabs so they are always easy to find and don't
            get accidentally closed.
          </FeatureListItem>
          <FeatureListItem>
            Use tab groups to categorize your work or browsing sessions.
          </FeatureListItem>
          <FeatureListItem>
            Leverage the search and filters to quickly locate specific tabs in
            crowded browser windows.
          </FeatureListItem>
        </FeatureList>
      </GuideSection>

      <Paragraph
        style={{
          marginTop: "30px",
          textAlign: "center",
          fontSize: "13px",
          color: "#6b7280",
        }}
      >
        Happy Decluttering!
      </Paragraph>
    </GuideContainer>
  );
};

export default HelpGuideComponent;
