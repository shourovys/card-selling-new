// hooks/useFilter.ts
import { THandleFilterInputChange } from '@/types/components/common';
import { useState } from 'react';

// Generic hook to manage filter state and handlers
export const useFilter = <T>(initialFilterState: T) => {
  // State to store the filter values
  const [filterState, setFilterState] = useState<T>(initialFilterState);

  // Handler to update filter state on input change
  const handleFilterInputChange: THandleFilterInputChange = (name, value) => {
    // Reset apply to false on every filter state change if "apply" exists
    setFilterState((state) => ({
      ...state,
      apply: false, // You may want to conditionally handle `apply` based on your specific use case
      [name]: value,
    }));
  };

  // Handler to reset the filter state to the initial values
  const handleFilterStateReset = () => {
    setFilterState(initialFilterState);
  };

  return {
    filterState,
    setFilterState,
    handleFilterInputChange,
    handleFilterStateReset,
  };
};
