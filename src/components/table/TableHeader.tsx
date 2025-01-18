// TableHeader.tsx
import { cn } from '@/lib/utils';
import { ITableHead } from '@/types/components/table';
import { ChevronDownIcon, ChevronUpIcon } from '@radix-ui/react-icons';
import { Checkbox } from '../ui/checkbox';

interface IProps {
  order: 'asc' | 'desc';
  orderBy: string;
  numSelected?: number;
  rowCount?: number;
  handleSort: (orderBy: string, order: 'asc' | 'desc') => void;
  selectAllRow?: (selected: boolean) => void;
  headerData: ITableHead[];
}

const TableHeader: React.FC<IProps> = ({
  order,
  orderBy,
  numSelected,
  rowCount,
  handleSort,
  selectAllRow,
  headerData,
}) => {
  return (
    <thead className='bg-[#F9FAFB] border-y border-primaryBorder'>
      <tr className='text-left'>
        {/* Checkbox for selecting all rows */}
        {selectAllRow && (
          <th
            scope='col'
            className='sticky left-0 w-1 pr-1.5 pl-3 md:pl-5 bg-[#F9FAFB]'
          >
            <Checkbox
              value='select-all-row'
              checked={rowCount !== 0 && rowCount === numSelected}
              onChange={() => {
                selectAllRow(true);
              }}
              disabled={rowCount === 0}
            />
          </th>
        )}

        {/* Table header columns with sorting functionality */}
        {headerData.map((item) => (
          <th
            key={item.id}
            scope='col'
            className={cn(
              'px-1 py-3 text-bwTableHeaderBgText whitespace-nowrap font-medium text-xs text-[#05060F99] min-w-20 2xl:min-w-28',
              item.filter ? 'cursor-pointer' : 'cursor-default'
            )}
            onClick={() => {
              if (item.filter) {
                const newOrder = order === 'asc' ? 'desc' : 'asc';
                handleSort(item.id, newOrder);
              }
            }}
          >
            <span className='flex items-center'>
              <span className='mt-0.5'>{item.label}</span>
              {/* Sorting icons displayed conditionally based on sort order */}
              {item.filter && (
                <>
                  <ChevronUpIcon
                    className={cn(
                      'w-2 ml-1',
                      orderBy === item.id && order === 'asc' && 'text-primary'
                    )}
                  />
                  <ChevronDownIcon
                    className={cn(
                      'w-2',
                      orderBy === item.id && order === 'desc' && 'text-primary'
                    )}
                  />
                </>
              )}
            </span>
          </th>
        ))}
      </tr>
    </thead>
  );
};

export default TableHeader;
