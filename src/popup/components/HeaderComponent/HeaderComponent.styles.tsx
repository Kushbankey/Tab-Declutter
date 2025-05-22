import styled from "styled-components";

export const Header = styled.header`
  padding: 24px;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const HeaderTextContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

export const HeaderTopLine = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 4px;
  gap: 10px;
`;

export const WelcomeMessage = styled.h1`
  font-size: 24px;
  font-weight: 600;
  color: #111827; // Dark gray text
  margin: 0;
`;

export const SubMessage = styled.p`
  font-size: 14px;
  color: #6b7280; // Medium gray text
  margin-top: 4px;
  margin-bottom: 0;
`;

export const Icon = styled.img<{ size?: number }>`
  width: ${(props) => props.size || 24}px;
  height: ${(props) => props.size || 24}px;
`;

export const DetachButton = styled.button`
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: white;
  background-color: #4f46e5;
  border: 1px solid transparent;
  border-radius: 0.375rem;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;

  &:hover {
    background-color: #4338ca;
  }

  &:focus,
  &:focus-visible {
    outline: 2px solid transparent;
    outline-offset: 2px;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.5);
  }
`;
