import React from "react";
import {
  ControlsContainer,
  LeftControls,
  RightControls,
  FilterLabel,
  SearchContainer,
  SearchIcon,
  SearchInputStyled,
  GroupButton,
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
import FilterDropdown, { FilterOption } from "../FilterDropdown/FilterDropdown";
import { TabGroupForFilter, GroupFilterValue } from "../../types";

// --- Component Props ---
export type StatusFilterType = "all" | "active" | "inactive";
export type PinnedFilterType = "all" | "pinned" | "unpinned";

interface HeaderControlsProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  statusFilter: StatusFilterType;
  onStatusFilterChange: (filter: StatusFilterType) => void;
  pinnedFilter: PinnedFilterType;
  onPinnedFilterChange: (filter: PinnedFilterType) => void;
  availableTabGroups: TabGroupForFilter[];
  groupFilter: GroupFilterValue;
  onGroupFilterChange: (filter: GroupFilterValue) => void;
  onViewGroupTabs: () => void;
  selectedTabsCount: number;
  totalResultsCount: number;
}

// --- Component ---

const HeaderControls: React.FC<HeaderControlsProps> = ({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  pinnedFilter,
  onPinnedFilterChange,
  availableTabGroups,
  groupFilter,
  onGroupFilterChange,
  onViewGroupTabs,
  selectedTabsCount,
  totalResultsCount,
}) => {
  const statusOptions: FilterOption<StatusFilterType>[] = [
    { value: "all", label: "All" },
    { value: "active", label: "Active", pillLabel: "Status: Active" },
    { value: "inactive", label: "Inactive", pillLabel: "Status: Inactive" },
  ];

  const pinnedOptions: FilterOption<PinnedFilterType>[] = [
    { value: "all", label: "All" },
    { value: "pinned", label: "Pinned", pillLabel: "Pinned: Yes" },
    { value: "unpinned", label: "Unpinned", pillLabel: "Pinned: No" },
  ];

  const handleClearStatusFilter = () => {
    onStatusFilterChange("all");
  };

  const handleClearPinnedFilter = () => {
    onPinnedFilterChange("all");
  };

  const handleClearGroupFilter = () => {
    onGroupFilterChange("all");
  };

  const handleClearAllFilters = () => {
    onStatusFilterChange("all");
    onPinnedFilterChange("all");
    onGroupFilterChange("all");
  };

  const activeStatusOption = statusOptions.find(
    (opt) => opt.value === statusFilter
  );
  const activePinnedOption = pinnedOptions.find(
    (opt) => opt.value === pinnedFilter
  );

  const groupFilterOptions: FilterOption<GroupFilterValue>[] =
    availableTabGroups.map((group) => ({
      value: group.id,
      label: group.name,
      pillLabel:
        group.id === "all"
          ? undefined
          : group.id === "none"
          ? "Ungrouped Tabs"
          : `Group: ${group.name}`,
    }));

  const activeGroupOption = groupFilterOptions.find(
    (opt) => opt.value === groupFilter
  );

  const isAnyFilterActive =
    statusFilter !== "all" || pinnedFilter !== "all" || groupFilter !== "all";

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
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                onSearchChange(e.target.value)
              }
              aria-label="Search tabs by title, category, or URL"
            />
          </SearchContainer>
        </LeftControls>
        <RightControls>
          {selectedTabsCount > 0 && (
            <GroupButton
              onClick={onViewGroupTabs}
              disabled={selectedTabsCount === 0}
            >
              Group Selected ({selectedTabsCount})
            </GroupButton>
          )}
        </RightControls>
      </ControlsContainer>

      <FiltersContainer>
        <FilterDropdownsRow>
          <FilterLabel>Filter by:</FilterLabel>
          <FilterDropdown
            filterKey="status"
            buttonLabelPrefix="Tab Status"
            options={statusOptions}
            selectedValue={statusFilter}
            defaultValue="all"
            onSelectionChange={onStatusFilterChange}
            onClearFilter={handleClearStatusFilter}
          />
          <FilterDropdown
            filterKey="pinned"
            buttonLabelPrefix="Pinned Status"
            options={pinnedOptions}
            selectedValue={pinnedFilter}
            defaultValue="all"
            onSelectionChange={onPinnedFilterChange}
            onClearFilter={handleClearPinnedFilter}
          />
          <FilterDropdown
            filterKey="group"
            buttonLabelPrefix="Tab Group"
            options={groupFilterOptions}
            selectedValue={groupFilter}
            defaultValue="all"
            onSelectionChange={onGroupFilterChange}
            onClearFilter={handleClearGroupFilter}
          />
        </FilterDropdownsRow>

        {isAnyFilterActive && (
          <ActiveFiltersDisplay>
            <ResultsCount>{totalResultsCount} results found</ResultsCount>
            <FilterPillsList>
              {activeStatusOption &&
                activeStatusOption.value !== "all" &&
                activeStatusOption.pillLabel && (
                  <FilterPill>
                    <FilterPillText>
                      {activeStatusOption.pillLabel}
                    </FilterPillText>
                    <FilterPillCloseIcon
                      src={chrome.runtime.getURL("cross.svg")}
                      alt={`Remove ${activeStatusOption.label} filter`}
                      onClick={handleClearStatusFilter}
                      tabIndex={0}
                      onKeyDown={(e: React.KeyboardEvent<HTMLImageElement>) => {
                        if (e.key === "Enter" || e.key === " ")
                          handleClearStatusFilter();
                      }}
                    />
                  </FilterPill>
                )}
              {activePinnedOption &&
                activePinnedOption.value !== "all" &&
                activePinnedOption.pillLabel && (
                  <FilterPill>
                    <FilterPillText>
                      {activePinnedOption.pillLabel}
                    </FilterPillText>
                    <FilterPillCloseIcon
                      src={chrome.runtime.getURL("cross.svg")}
                      alt={`Remove ${activePinnedOption.label} filter`}
                      onClick={handleClearPinnedFilter}
                      tabIndex={0}
                      onKeyDown={(e: React.KeyboardEvent<HTMLImageElement>) => {
                        if (e.key === "Enter" || e.key === " ")
                          handleClearPinnedFilter();
                      }}
                    />
                  </FilterPill>
                )}
              {activeGroupOption &&
                activeGroupOption.value !== "all" &&
                activeGroupOption.pillLabel && (
                  <FilterPill>
                    <FilterPillText>
                      {activeGroupOption.pillLabel}
                    </FilterPillText>
                    <FilterPillCloseIcon
                      src={chrome.runtime.getURL("cross.svg")}
                      alt={`Remove ${activeGroupOption.label} filter`}
                      onClick={handleClearGroupFilter}
                      tabIndex={0}
                      onKeyDown={(e: React.KeyboardEvent<HTMLImageElement>) => {
                        if (e.key === "Enter" || e.key === " ")
                          handleClearGroupFilter();
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
