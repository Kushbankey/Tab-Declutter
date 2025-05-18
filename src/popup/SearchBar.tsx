import React from "react";

interface SearchBarProps {
  onSearch?: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (onSearch) {
      onSearch(event.target.value);
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Search tabs..."
        onChange={handleInputChange}
        style={{ padding: "8px", margin: "5px 0", width: "calc(100% - 16px)" }}
      />
    </div>
  );
};

export default SearchBar;
