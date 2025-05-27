import React, { useState, useRef, useEffect } from "react";
import {
  DropdownContainer,
  FilterButton,
  ChevronIcon,
  DropdownMenu,
  DropdownMenuItem,
  RadioCircleOuter,
  RadioCircleInner,
  ClearIndividualFilterButton,
  FilterOptionLabel,
  FilterOptionDescription,
} from "./FilterDropdown.styles";

// --- Component Props ---
export interface FilterOption<T extends string> {
  value: T;
  label: string;
  description?: string;
  pillLabel?: string;
}

interface FilterDropdownProps<T extends string> {
  filterKey: string; // e.g., "status", "type" - used for ARIA labels
  buttonLabelPrefix: string; // e.g., "Tab Status", "Category"
  options: FilterOption<T>[];
  selectedValue: T;
  defaultValue: T; // The value that means "no filter applied" or "all"
  onSelectionChange: (value: T) => void;
  onClearFilter: () => void;
}

// --- Component ---

const FilterDropdown = <T extends string>({
  filterKey,
  buttonLabelPrefix,
  options,
  selectedValue,
  defaultValue,
  onSelectionChange,
  onClearFilter,
}: FilterDropdownProps<T>) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleToggleDropdown = () => setIsOpen(!isOpen);

  const handleOptionClick = (value: T) => {
    onSelectionChange(value);
    setIsOpen(false);
  };

  const handleClearClick = () => {
    onClearFilter();
    setIsOpen(false);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const selectedOption = options.find((opt) => opt.value === selectedValue);
  const isFilterActive = selectedValue !== defaultValue;
  const buttonLabel = isFilterActive
    ? selectedOption?.label || buttonLabelPrefix
    : buttonLabelPrefix;

  return (
    <DropdownContainer ref={dropdownRef}>
      <FilterButton
        onClick={handleToggleDropdown}
        aria-haspopup="listbox"
        aria-expanded={isOpen || isFilterActive}
        className={isOpen || isFilterActive ? "active" : ""}
        tabIndex={0}
        onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => {
          if (e.key === "Enter" || e.key === " ") handleToggleDropdown();
          if (e.key === "Escape") setIsOpen(false);
        }}
        role="button"
        aria-label={`${buttonLabelPrefix}: ${buttonLabel}`}
      >
        {buttonLabel}
        <ChevronIcon
          src={chrome.runtime.getURL(
            isOpen ? "chevron-up.svg" : "chevron-down.svg"
          )}
          alt={isOpen ? "Collapse" : "Expand"}
        />
      </FilterButton>
      {isOpen && (
        <DropdownMenu role="listbox" aria-label={`${filterKey} filter options`}>
          {options.map((opt) => (
            <DropdownMenuItem
              key={opt.value}
              onClick={() => handleOptionClick(opt.value)}
              className={selectedValue === opt.value ? "active" : ""}
              role="option"
              aria-selected={selectedValue === opt.value}
              tabIndex={0}
              onKeyDown={(e: React.KeyboardEvent<HTMLButtonElement>) => {
                if (e.key === "Enter" || e.key === " ")
                  handleOptionClick(opt.value);
                if (e.key === "Escape") setIsOpen(false);
              }}
            >
              <RadioCircleOuter>
                {selectedValue === opt.value && <RadioCircleInner />}
              </RadioCircleOuter>
              <span>
                <FilterOptionLabel>{opt.label}</FilterOptionLabel>
                {opt.description && (
                  <FilterOptionDescription>
                    {opt.description}
                  </FilterOptionDescription>
                )}
              </span>
            </DropdownMenuItem>
          ))}
          {isFilterActive && (
            <ClearIndividualFilterButton onClick={handleClearClick}>
              Clear Filter
            </ClearIndividualFilterButton>
          )}
        </DropdownMenu>
      )}
    </DropdownContainer>
  );
};

export default FilterDropdown;
