// hooks/useFilter.ts
import { THandleFilterInputChange } from '@/types/components/common';
import { debounce } from 'lodash';
import { useCallback, useEffect, useState } from 'react';

// Generic hook to manage filter state and handlers
export const useFilter = <T>(
  initialFilterState: T,
  onFilterChange?: (filters: T) => void,
  debounceTime: number = 800
) => {
  // State to store the filter values
  const [filterState, setFilterState] = useState<T>(initialFilterState);
  const [debouncedFilterState, setDebouncedFilterState] =
    useState<T>(initialFilterState);

  // Create a debounced version of setDebouncedFilterState
  const debouncedSetFilter = useCallback(
    debounce((newState: T) => {
      setDebouncedFilterState(newState);
      onFilterChange?.(newState);
    }, debounceTime),
    [debounceTime, onFilterChange]
  );

  // Handler to update filter state on input change
  const handleFilterInputChange: THandleFilterInputChange = (name, value) => {
    const newState = {
      ...filterState,
      [name]: value,
    };
    setFilterState(newState);
    debouncedSetFilter(newState);
  };

  // Handler to reset the filter state to the initial values
  const handleFilterStateReset = () => {
    setFilterState(initialFilterState);
    setDebouncedFilterState(initialFilterState);
    onFilterChange?.(initialFilterState);
  };

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      debouncedSetFilter.cancel();
    };
  }, [debouncedSetFilter]);

  return {
    filterState,
    debouncedFilterState,
    setFilterState,
    handleFilterInputChange,
    handleFilterStateReset,
  };
};
