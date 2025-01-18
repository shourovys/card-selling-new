import { cn } from '@/lib/utils';
import { ChevronLeftIcon, ChevronRightIcon } from '@radix-ui/react-icons';
import React from 'react';

interface PaginationControlsProps {
  onClick: () => void;
  direction: 1 | -1;
  disabled?: boolean;
}

const PaginationControls: React.FC<PaginationControlsProps> = ({
  onClick,
  direction,
  disabled,
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'relative inline-flex items-center justify-center gap-1.5 text-sm font-medium text-[#667085] bg-white border border-primaryBorder px-3 py-1 h-[33px] rounded-md',
        disabled
          ? 'opacity-50'
          : 'hover:bg-primaryLight hover:text-primary hover:border-primary'
      )}
    >
      {direction === -1 ? (
        <>
          <ChevronLeftIcon
            className='w-3.5 h-3.5 font-light'
            aria-hidden='true'
          />
          <span>Previous</span>
        </>
      ) : (
        <>
          <span>Next</span>
          <ChevronRightIcon
            className='w-3.5 h-3.5 font-light'
            aria-hidden='true'
          />
        </>
      )}
    </button>
  );
};

export default PaginationControls;
