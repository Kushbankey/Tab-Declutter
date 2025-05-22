import styled from "styled-components";

export const AppContainer = styled.div`
  background-color: #f9fafb;
  width: 800px;
  display: flex;
  flex-direction: column;
  font-family: "Inter", sans-serif;
`;

export const MainContent = styled.main`
  flex-grow: 1;
  padding: 24px;
  overflow-y: auto; // For scrolling the table content
  height: 80vh;
`;

export const WindowAccordionListContainer = styled.div`
  width: 100%;
`;
