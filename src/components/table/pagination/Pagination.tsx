// Pagination.tsx
import DisplayComponent from './DisplayComponent';
import PageNumberButton from './PageNumberButton';
import PaginationControls from './PaginationControls';
import PaginationPrevNextControls from './PaginationPrevNextControlsProps ';

export type TDirection = 1 | -1;

interface IPaginationProps {
  totalRows: number;
  currentPage: number;
  rowsPerPage: number;
  onPageChange: (page: number) => void;
  onRowsPerPageChange?: (rowsPerPage: number) => void;
  rowsPerPageDisabled?: boolean;
}

export default function Pagination({
  totalRows,
  currentPage,
  rowsPerPage,
  onPageChange,
}: IPaginationProps) {
  const totalPages = Math.ceil(totalRows / rowsPerPage);
  const pageNumbers = Array.from(Array(totalPages).keys(), (x) => x + 1);

  // Determine which pages to display
  const startIndex =
    totalPages <= 5
      ? 0
      : currentPage <= 3
      ? 0
      : currentPage >= totalPages - 2
      ? totalPages - 5
      : currentPage - 3;

  const endIndex =
    totalPages <= 5
      ? totalPages - 1
      : currentPage <= 3
      ? 4
      : currentPage >= totalPages - 2
      ? totalPages - 1
      : currentPage + 1;

  const displayedPages = pageNumbers.slice(startIndex, endIndex + 1);

  // Pagination state checks
  const isPrevDisabled = currentPage <= 1;
  const isNextDisabled = currentPage >= totalPages;

  // Pagination handlers
  const handlePrevNextPaginate = (direction: TDirection) => {
    if (
      (direction === -1 && isPrevDisabled) ||
      (direction === 1 && isNextDisabled)
    ) {
      return;
    }
    onPageChange(currentPage + direction);
  };

  const handleNumberPaginate = (page: number) => {
    onPageChange(page);
  };

  // Range of rows displayed
  const from = (currentPage - 1) * rowsPerPage + 1;
  const to = Math.min(currentPage * rowsPerPage, totalRows);

  return (
    <div className='flex justify-between items-center p-3 pb-1 mb-5 text-sm font-medium md:p-5 sm:px-6'>
      {/* Mobile view controls */}
      <div className='flex flex-1 justify-between sm:hidden'>
        <PaginationPrevNextControls
          onClick={() => handlePrevNextPaginate(-1)}
          direction={-1}
          disabled={isPrevDisabled}
          currentPage={currentPage}
          totalPages={totalPages}
        />
        <PaginationPrevNextControls
          onClick={() => handlePrevNextPaginate(1)}
          direction={1}
          disabled={isNextDisabled}
          currentPage={currentPage}
          totalPages={totalPages}
        />
      </div>

      {/* Desktop view controls */}
      <div className='hidden sm:flex sm:flex-1 sm:items-center sm:justify-between'>
        <DisplayComponent from={from} to={to} totalRows={totalRows} />

        <nav
          className='inline-flex relative z-0 gap-x-1 rounded-md'
          aria-label='Pagination'
        >
          <PaginationControls
            onClick={() => handlePrevNextPaginate(-1)}
            direction={-1}
            disabled={isPrevDisabled}
          />
          {totalPages > 5 && currentPage > 3 && (
            <>
              <PageNumberButton
                pageNumber={1}
                currentPage={currentPage}
                onClick={handleNumberPaginate}
              />
              {currentPage > 4 && (
                <span className='relative inline-flex items-center p-1 min-w-[30px] h-[30px] justify-center cursor-default'>
                  ...
                </span>
              )}
            </>
          )}
          {displayedPages.map((page) => (
            <PageNumberButton
              key={page}
              pageNumber={page}
              currentPage={currentPage}
              onClick={handleNumberPaginate}
            />
          ))}
          {totalPages > 5 && currentPage < totalPages - 2 && (
            <>
              {currentPage < totalPages - 3 && (
                <span className='relative inline-flex items-center p-1 min-w-[30px] h-[30px] justify-center cursor-default'>
                  ...
                </span>
              )}
              <PageNumberButton
                pageNumber={totalPages}
                currentPage={currentPage}
                onClick={handleNumberPaginate}
              />
            </>
          )}
          <PaginationControls
            onClick={() => handlePrevNextPaginate(1)}
            direction={1}
            disabled={isNextDisabled}
          />
        </nav>
        {/* {onRowsPerPageChange && (
          <RowsPerPageSelector
            totalRows={totalRows}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={onRowsPerPageChange}
            disabled={rowsPerPageDisabled}
          />
        )} */}
      </div>
    </div>
  );
}
