import React from "react";

interface SavedSessionsProps {
  placeholder?: string;
}

const SavedSessions: React.FC<SavedSessionsProps> = (props) => {
  return (
    <div>
      <h3>Saved Sessions {props.placeholder}</h3>
      <p>Session saving/loading will be here.</p>
    </div>
  );
};

export default SavedSessions;
