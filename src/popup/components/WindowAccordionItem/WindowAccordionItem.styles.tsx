import styled from "styled-components";

export const AccordionItemWrapper = styled.div`
  /* Styles for the div wrapping each accordion item, if needed */
  /* For now, it might not need specific styles if it's just a logical wrapper */
`;

export const AccordionHeader = styled.button`
  background-color: #e9ecef;
  color: #495057;
  cursor: pointer;
  padding: 12px 18px;
  width: 100%;
  text-align: left;
  border: none;
  outline: none;
  transition: background-color 0.2s ease;
  border-bottom: 1px solid #dee2e6;
  font-size: 16px;
  font-weight: 500;
  display: flex;
  justify-content: space-between;
  align-items: center;

  &:hover {
    background-color: #ced4da;
  }

  &.active {
    background-color: #dee2e6;
  }
`;

export const AccordionContent = styled.div`
  padding: 0;
  background-color: white;
  overflow: hidden;
  border-left: 1px solid #dee2e6;
  border-right: 1px solid #dee2e6;
  border-bottom: 1px solid #dee2e6;
`;
