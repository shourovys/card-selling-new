import { cn } from '@/lib/utils';
import React from 'react';

interface PageNumberButtonProps {
  pageNumber: number;
  currentPage: number;
  onClick: (pageNumber: number) => void;
}

const PageNumberButton: React.FC<PageNumberButtonProps> = ({
  pageNumber,
  currentPage,
  onClick,
}) => {
  return (
    <button
      onClick={() => onClick(pageNumber)}
      className={cn(
        'relative inline-flex items-center p-1 min-w-[30px] h-[30px] justify-center text-sm font-medium text-[#0E1521] rounded-md',
        currentPage === pageNumber
          ? 'text-white bg-primary'
          : 'hover:text-primary hover:bg-primaryLight border border-transparent hover:border-primary'
      )}
    >
      {pageNumber}
    </button>
  );
};

export default PageNumberButton;
