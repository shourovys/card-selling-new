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
    <thead>
      <tr className='border-b border-gray-200'>
        {/* Checkbox for selecting all rows */}
        {selectAllRow && (
          <th scope='col' className='sticky left-0 w-1 pr-1.5 pl-3 md:pl-5'>
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
              'py-4 px-4 text-sm font-semibold text-gray-900 whitespace-nowrap',
              {
                'text-left': !item.align || item.align === 'left',
                'text-center': item.align === 'center',
                'text-right': item.align === 'right',
              },
              item.filter ? 'cursor-pointer' : 'cursor-default'
            )}
            onClick={() => {
              if (item.filter) {
                const newOrder = order === 'asc' ? 'desc' : 'asc';
                handleSort(item.id, newOrder);
              }
            }}
          >
            <span
              className={cn('flex items-center', {
                'justify-start': !item.align || item.align === 'left',
                'justify-center': item.align === 'center',
                'justify-end': item.align === 'right',
              })}
            >
              <span>{item.label}</span>
              {/* Sorting icons displayed conditionally based on sort order */}
              {item.filter && (
                <div className='flex flex-col ml-1'>
                  <ChevronUpIcon
                    className={cn(
                      'w-3 h-3',
                      orderBy === item.id && order === 'asc'
                        ? 'text-primary'
                        : 'text-gray-400'
                    )}
                  />
                  <ChevronDownIcon
                    className={cn(
                      'w-3 h-3 -mt-1',
                      orderBy === item.id && order === 'desc'
                        ? 'text-primary'
                        : 'text-gray-400'
                    )}
                  />
                </div>
              )}
            </span>
          </th>
        ))}
      </tr>
    </thead>
  );
};

export default TableHeader;
