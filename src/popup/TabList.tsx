import React from "react";

interface TabListProps {
  placeholder?: string; // Added to avoid empty interface error for now
}

const TabList: React.FC<TabListProps> = (props) => {
  return (
    <div>
      <h2>Open Tabs {props.placeholder}</h2>
      {/* Logic to fetch and display tabs will go here */}
      <p>Tab list will appear here.</p>
    </div>
  );
};

export default TabList;
