import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface IProps {
  selected?: boolean;
  children: ReactNode;
}

function TableDataAction({ selected, children }: IProps) {
  return (
    <td
      className={cn(
        'custom_transition sticky pl-3 md:pl-5 left-0 bg-white text-sm text-center text-gray-700 whitespace-nowrap group-hover:bg-[#F9FAFB]',
        selected && 'bg-[#F9FAFB]'
      )}
    >
      <div className='flex items-center justify-start'>
        <button
          onClick={(event) => {
            event.stopPropagation();
          }}
        >
          {children}
        </button>
      </div>
    </td>
  );
}

export default TableDataAction;
