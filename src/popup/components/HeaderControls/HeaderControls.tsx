import React, { useState } from "react";
import {
  ControlsContainer,
  LeftControls,
  RightControls,
  FilterLabel,
  SearchContainer,
  SearchIcon,
  SearchInputStyled,
  FilterButton,
  ChevronIcon,
  GroupButton,
  DropdownMenu,
  DropdownMenuItem,
  RadioCircleOuter,
  RadioCircleInner,
  ClearFilterButton as ClearIndividualFilterButton,
  FiltersContainer,
  FilterDropdownsRow,
  ActiveFiltersDisplay,
  ResultsCount,
  FilterPillsList,
  FilterPill,
  FilterPillText,
  FilterPillCloseIcon,
  ClearAllButton,
} from "./HeaderControls.styles";

// --- Component Props ---
export type StatusFilterType = "all" | "active" | "inactive";

interface HeaderControlsProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  statusFilter: StatusFilterType;
  onStatusFilterChange: (filter: StatusFilterType) => void;
  onViewGroupTabs: () => void;
  selectedTabsCount: number;
  totalResultsCount: number;
  // onViewChange: () => void; // For future View button
}

// --- Component ---

const HeaderControls: React.FC<HeaderControlsProps> = ({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  onViewGroupTabs,
  selectedTabsCount,
  totalResultsCount,
  // onViewChange,
}) => {
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);

  const statusOptions: {
    value: StatusFilterType;
    label: string;
    pillLabel?: string;
    description?: string;
  }[] = [
    { value: "all", label: "All" },
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
  ];

  const handleClearIndividualFilter = (filterType: "status") => {
    if (filterType === "status") {
      onStatusFilterChange("all");
    }
    setStatusDropdownOpen(false);
  };

  const handleClearAllFilters = () => {
    onStatusFilterChange("all");
  };

  const activeStatusOption = statusOptions.find(
    (opt) => opt.value === statusFilter
  );

  const isAnyFilterActive = statusFilter !== "all";

  return (
    <>
      <ControlsContainer>
        <LeftControls>
          <SearchContainer>
            <SearchIcon
              src={chrome.runtime.getURL("magnifying-glass-light.svg")}
              alt="Search"
            />
            <SearchInputStyled
              type="text"
              placeholder="Search tabs..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              aria-label="Search tabs by title, category, or URL"
            />
          </SearchContainer>
        </LeftControls>
        <RightControls>
          {selectedTabsCount > 0 && (
            <GroupButton onClick={onViewGroupTabs}>
              Group Selected ({selectedTabsCount})
            </GroupButton>
          )}
          <FilterButton className="view-icon">View</FilterButton>
        </RightControls>
      </ControlsContainer>

      <FiltersContainer>
        <FilterDropdownsRow>
          <FilterLabel>Filter by :</FilterLabel>
          <div style={{ position: "relative" }}>
            <FilterButton
              onClick={() => setStatusDropdownOpen(!statusDropdownOpen)}
              aria-haspopup="true"
              aria-expanded={statusDropdownOpen || statusFilter !== "all"}
              className={
                statusDropdownOpen || statusFilter !== "all" ? "active" : ""
              }
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ")
                  setStatusDropdownOpen(!statusDropdownOpen);
              }}
            >
              {statusFilter !== "all"
                ? statusOptions.find((opt) => opt.value === statusFilter)
                    ?.label || "Tab Status"
                : "Tab Status"}
              <ChevronIcon
                src={chrome.runtime.getURL(
                  statusDropdownOpen ? "chevron-up.svg" : "chevron-down.svg"
                )}
                alt={statusDropdownOpen ? "Collapse" : "Expand"}
              />
            </FilterButton>
            {statusDropdownOpen && (
              <DropdownMenu role="listbox" aria-label="Status filter options">
                {statusOptions.map((opt) => (
                  <DropdownMenuItem
                    key={opt.value}
                    onClick={() => {
                      onStatusFilterChange(opt.value);
                      setStatusDropdownOpen(false);
                    }}
                    className={statusFilter === opt.value ? "active" : ""}
                    role="option"
                    aria-selected={statusFilter === opt.value}
                    tabIndex={0}
                  >
                    <RadioCircleOuter>
                      <RadioCircleInner />
                    </RadioCircleOuter>
                    <span>
                      {opt.label}
                      {opt.description && (
                        <span style={{ color: "#6b7280", marginLeft: "4px" }}>
                          {opt.description}
                        </span>
                      )}
                    </span>
                  </DropdownMenuItem>
                ))}
                {statusFilter !== "all" && (
                  <ClearIndividualFilterButton
                    onClick={() => handleClearIndividualFilter("status")}
                  >
                    Clear Filter
                  </ClearIndividualFilterButton>
                )}
              </DropdownMenu>
            )}
          </div>
        </FilterDropdownsRow>

        {isAnyFilterActive && (
          <ActiveFiltersDisplay>
            <ResultsCount>{totalResultsCount} results found</ResultsCount>
            <FilterPillsList>
              {activeStatusOption && activeStatusOption.pillLabel && (
                <FilterPill>
                  <FilterPillText>
                    {activeStatusOption.pillLabel}
                  </FilterPillText>
                  <FilterPillCloseIcon
                    src={chrome.runtime.getURL("close-icon.svg")}
                    alt="Remove status filter"
                    onClick={() => onStatusFilterChange("all")}
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ")
                        onStatusFilterChange("all");
                    }}
                  />
                </FilterPill>
              )}
            </FilterPillsList>
            <ClearAllButton onClick={handleClearAllFilters}>
              Clear All
            </ClearAllButton>
          </ActiveFiltersDisplay>
        )}
      </FiltersContainer>
    </>
  );
};

export default HeaderControls;
