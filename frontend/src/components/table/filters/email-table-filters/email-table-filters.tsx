"use client";

import { FunnelX, RefreshCw } from "lucide-react";
// import { SearchInput } from "@/components/search-input";
import { DataTableFilter, useDataTable } from "@/components/table/data-table";
import { Button } from "@/components/ui/button";
import { emailCategoryFilterOptions } from "@/constants/email-category-filter-options";
import { cn } from "@/lib/utils";
import { useEmailTableFilters } from "./email-table-filters.hook";
import { SearchInput } from "@/components/search-input";

interface EmailTableFiltersProps {
  tableFilters: ReturnType<typeof useEmailTableFilters>["tableFilters"];
  isLoading: boolean;
  isRefetching: boolean;
  onRefresh: () => void;
}

export function EmailTableFilters({
  tableFilters,
  isRefetching,
  isLoading,
  onRefresh,
}: EmailTableFiltersProps) {
  const {
    filters,
    isFiltered,
    handleSearchChange,
    searchInputValue,
    updateFilter,
    handleClearFilters,
  } = tableFilters;

  const disabled = isLoading || isRefetching;

  return (
    <>
      <div>
        <SearchInput
          disabled={disabled}
          value={searchInputValue}
          onChange={handleSearchChange}
          handleClear={() => handleSearchChange("")}
        />
      </div>

      <div className="flex gap-2 items-center">
        <DataTableFilter
          disabled={disabled}
          label="Categoria"
          options={emailCategoryFilterOptions}
          allowMultiSelect={false}
          selectedValues={filters.category ? [filters.category] : []}
          onSelectionChange={(category) => {
            updateFilter({
              category: category.length ? (category[0] as any) : undefined,
            });
          }}
        />

        {isFiltered && (
          <Button
            type="button"
            onClick={handleClearFilters}
            size="sm"
            variant="secondary"
          >
            <FunnelX />
            Limpar
          </Button>
        )}

        <Button
          type="button"
          size="icon"
          variant="secondary"
          className="h-8"
          disabled={isLoading}
          onClick={onRefresh}
        >
          <RefreshCw className={cn(isRefetching && "animate-spin")} />
        </Button>
      </div>
    </>
  );
}
