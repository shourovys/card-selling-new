// OrderTableToolbar.tsx
import useDebounce from '@/hooks/useDebounce';
import { THandleFilterInputChange } from '@/types/components/common';
import { IOrderFilter, IOrderResponse } from '@/types/pages/order';
import Icon, { searchIcon } from '@/utils/icons';
import React, { useEffect, useState } from 'react';

interface IProps {
  data?: IOrderResponse;
  filterState: IOrderFilter;
  handleFilterStateReset: () => void;
  handleFilterInputChange: THandleFilterInputChange;
  setFilterState: React.Dispatch<React.SetStateAction<IOrderFilter>>;
}

const OrderTableToolbar: React.FC<IProps> = ({
  data,
  filterState,
  handleFilterStateReset,
  handleFilterInputChange,
  setFilterState,
}) => {
  // State for managing search input
  const [searchQuery, setSearchQuery] = useState<string>('');
  // Debounced search input to reduce the number of filter updates
  const debouncedSearchQuery = useDebounce(searchQuery, 200);

  // Sync debounced search query with the filter state
  useEffect(() => {
    handleFilterInputChange('search', debouncedSearchQuery);
  }, [debouncedSearchQuery]);

  // Clear the search input when the filter state's search value changes
  useEffect(() => {
    if (!filterState.search) setSearchQuery('');
  }, [filterState.search]);

  // Handles search input change
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  return (
    <div className='flex flex-col md:flex-row items-start lg:items-center justify-between w-full px-3 md:px-5 pt-3 md:pt-4 pb-3 md:pb-5 gap-3 md:gap-6'>
      <div className='flex items-center gap-2 sm:gap-3 flex-1 md:max-w-96 w-full'>
        {/* Search input */}
        <div className='flex items-center border border-primaryBorder py-2 px-3 rounded-md flex-1 w-full xl:max-w-72 2xl:max-w-80'>
          <Icon
            icon={searchIcon}
            className='w-3.5 h-3.5 text-[#05060F99]'
            aria-hidden='true'
          />
          <input
            type='text'
            value={searchQuery}
            onChange={handleSearchChange}
            className='w-full ml-2 outline-none text-sm placeholder:text-[#05060F99]'
            placeholder='Searching order by id...'
            aria-label='Search orders'
          />
        </div>
      </div>
    </div>
  );
};

export default OrderTableToolbar;
