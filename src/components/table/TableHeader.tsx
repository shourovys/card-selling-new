// TableHeader.tsx
import Checkbox from '@/components/atomic/Checkbox';
import { cn } from '@/lib/utils';
import { ITableHead } from '@/types/components/table';
import Icon, { downArrowIcon, upArrowIcon } from '@/utils/icons';
import { PlusIcon } from '@radix-ui/react-icons';
import {
  Tooltip,
  TooltipArrow,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../common/Tooltip';

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
              onChange={(checked) => {
                selectAllRow(checked);
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
                  <Icon
                    icon={upArrowIcon}
                    className={cn(
                      'w-2 ml-1',
                      orderBy === item.id && order === 'asc' && 'text-primary'
                    )}
                  />
                  <Icon
                    icon={downArrowIcon}
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

        {/* Action column with a tooltip for adding a field */}
        <th scope='col' className='pr-3 md:pr-5 w-[70px]'>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <PlusIcon className='text-[#0E1521] h-4 w-4 mt-[5px]' />
              </TooltipTrigger>
              <TooltipContent>
                <p>Add field</p>
                <TooltipArrow />
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </th>
      </tr>
    </thead>
  );
};

export default TableHeader;
