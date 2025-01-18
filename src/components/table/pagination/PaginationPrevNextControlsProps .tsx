import { cn } from '@/lib/utils';
import React from 'react';
import { TDirection } from './Pagination';

interface PaginationPrevNextControlsProps {
  onClick: (direction: TDirection) => void;
  direction: TDirection;
  disabled: boolean;
  currentPage: number;
  totalPages: number;
}

const PaginationPrevNextControls: React.FC<PaginationPrevNextControlsProps> = ({
  onClick,
  direction,
  disabled,
  currentPage,
  totalPages,
}) => {
  return (
    <button
      onClick={() => onClick(direction)}
      className={cn(
        'relative inline-flex items-center px-4 py-2 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50',
        { 'opacity-50 cursor-not-allowed': disabled },
        {
          'bg-gray-100 hover:bg-gray-100':
            (direction === -1 && currentPage === 1) ||
            (direction === 1 && currentPage === totalPages),
        },
        {
          'bg-white hover:bg-gray-50':
            (direction === -1 && currentPage !== 1) ||
            (direction === 1 && currentPage !== totalPages),
        }
      )}
      disabled={disabled}
    >
      {direction === -1 ? 'Previous' : 'Next'}
    </button>
  );
};

export default PaginationPrevNextControls;
