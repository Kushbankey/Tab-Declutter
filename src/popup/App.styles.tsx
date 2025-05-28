import styled from "styled-components";

export const DetachedViewWrapper = styled.div`
  display: flex;
  width: 100vw;
  height: 100vh;
  overflow: hidden; // Prevent double scrollbars if content overflows
`;

export const AppContainer = styled.div<{
  $isDetachedView?: boolean;
}>`
  background-color: #f9fafb;
  width: ${({ $isDetachedView }) => (!$isDetachedView ? "50vw" : "800px")};
  height: ${({ $isDetachedView }) => (!$isDetachedView ? "100vh" : "auto")};
  min-width: ${({ $isDetachedView }) =>
    !$isDetachedView
      ? "400px"
      : "800px"}; // Sensible min for detached, popup is fixed
  max-width: ${({ $isDetachedView }) =>
    !$isDetachedView ? "none" : "800px"}; // No max for 50vw, cap popup width
  min-height: ${({ $isDetachedView }) =>
    !$isDetachedView ? "100vh" : "600px"};
  display: flex;
  flex-direction: column;
  font-family: "Inter", sans-serif;
  /* margin: ${({ $isDetachedView }) =>
    $isDetachedView
      ? "0"
      : "0 auto"}; // Centering for popup if its width is < max-width */
  overflow: hidden; // AppContainer itself might need to manage its internal scroll
`;

export const HelpGuideWrapper = styled.aside`
  width: 50vw;
  height: 100vh;
  padding: 24px;
  overflow-y: auto;
  background-color: #eef2f9; // A slightly different, calm background
  border-left: 1px solid #d1d5db; // Separator line
  box-sizing: border-box;
`;

export const MainContent = styled.main`
  flex-grow: 1;
  padding: 24px;
  overflow-y: auto; // For scrolling the table content
  /* height: 80vh; // This might need adjustment if AppContainer is 100vh */
  // If AppContainer is flex-column and MainContent is flex-grow:1, height constraint might not be needed here
  // or should be relative to AppContainer's flex layout.
`;

export const WindowAccordionListContainer = styled.div`
  width: 100%;
`;
