"use client";

import { EmailCategory } from "@/enums/email-category";
import { debounce, isEqual } from "lodash";
import { useCallback, useEffect, useMemo, useState } from "react";

export interface EmailTableFilters {
  search: string;
  category: EmailCategory | undefined;
  starred: boolean;
}

export const defaultEmailTableFilters: EmailTableFilters = {
  search: "",
  category: undefined,
  starred: false,
};

export function useEmailTableFilters(
  initialFilters: EmailTableFilters = defaultEmailTableFilters
) {
  const [filters, setFilters] = useState<EmailTableFilters>(initialFilters);
  const [searchInputValue, setSearchInputValue] = useState(
    initialFilters.search
  );

  const updateFilter = useCallback((values: Partial<EmailTableFilters>) => {
    setFilters((prev) => {
      const newFilters = { ...prev, ...values };

      return newFilters;
    });
  }, []);

  // Debounce para pesquisa
  const debouncedUpdateFilter = useMemo(
    () => debounce((search: string) => updateFilter({ search }), 500),
    [updateFilter]
  );

  // Limpa debounce ao desmontar
  useEffect(() => {
    return () => {
      debouncedUpdateFilter.cancel();
    };
  }, [debouncedUpdateFilter]);

  // Lida com alteração do input de pesquisa
  const handleSearchChange = useCallback(
    (value: string) => {
      const trimmed = value.trim();
      setSearchInputValue(value); // Mantém o valor original para UX

      if (trimmed === "") {
        debouncedUpdateFilter.cancel();
        updateFilter({ search: "" });
      } else {
        debouncedUpdateFilter(trimmed);
      }
    },
    [debouncedUpdateFilter, updateFilter]
  );

  const handleClearFilters = useCallback(async () => {
    setFilters(defaultEmailTableFilters);
    setSearchInputValue(defaultEmailTableFilters.search);
  }, []);

  const isFiltered = useMemo(
    () => !isEqual(filters, defaultEmailTableFilters),
    [filters]
  );

  return {
    tableFilters: {
      filters,
      isFiltered,
      searchInputValue,
      updateFilter,
      handleSearchChange,
      handleClearFilters,
    },
  };
}
