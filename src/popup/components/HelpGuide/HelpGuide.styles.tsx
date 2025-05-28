import styled from "styled-components";

export const GuideContainer = styled.div`
  font-family: "Inter", sans-serif;
  color: #333;
  line-height: 1.6;
  padding: 0;
`;

export const GuideTitle = styled.h1`
  font-size: 28px;
  color: #1f2937; // Tailwind Gray-800
  border-bottom: 2px solid #4f46e5; // Indigo-600
  padding-bottom: 10px;
  margin-top: 0;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const GuideSection = styled.section`
  margin-bottom: 30px;
`;

export const SectionTitle = styled.h2`
  font-size: 22px;
  color: #374151; // Tailwind Gray-700
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid #d1d5db; // Tailwind Gray-300
`;

export const Paragraph = styled.p`
  font-size: 15px;
  color: #4b5563; // Tailwind Gray-600
  margin-bottom: 12px;
`;

export const StrongText = styled.strong`
  font-weight: 600;
  color: #111827; // Tailwind Gray-900
`;

export const CodeText = styled.code`
  background-color: #e5e7eb; // Tailwind Gray-200
  padding: 2px 6px;
  border-radius: 4px;
  font-family: "Menlo", "Monaco", "Consolas", "Liberation Mono", "Courier New",
    monospace;
  font-size: 0.9em;
  color: #1f2937;
`;

export const FeatureList = styled.ul`
  list-style-type: none;
  padding-left: 0;
  margin-top: 0;
`;

export const FeatureListItem = styled.li`
  margin-bottom: 10px;
  display: flex;
  align-items: flex-start;
  font-size: 15px;
  color: #4b5563;

  &::before {
    content: "\2713"; // Checkmark
    color: #4f46e5; // Indigo-600
    font-weight: bold;
    display: inline-block;
    width: 20px;
    margin-right: 8px;
    flex-shrink: 0;
  }
`;

export const Tip = styled.div`
  background-color: #e0e7ff; // Indigo-100
  border-left: 4px solid #4f46e5; // Indigo-600
  padding: 12px 16px;
  margin: 16px 0;
  border-radius: 4px;
  font-size: 14px;
  color: #3730a3; // Indigo-800

  ${StrongText} {
    color: #3730a3;
  }
`;

export const IconImage = styled.img`
  width: 24px;
  height: 24px;
  vertical-align: middle;
`;
