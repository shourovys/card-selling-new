import { TABLE_ROW_HEIGHT } from '@/config/config';
import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface IProps {
  selected?: boolean;
  children: ReactNode;
}

function TableRow({ selected, children }: IProps) {
  return (
    <tr
      className={cn(
        'custom_transition bg-white group hover:bg-[#F9FAFB] group',
        selected && 'bg-[#F9FAFB]'
      )}
      style={{ height: TABLE_ROW_HEIGHT }}
    >
      {children}
    </tr>
  );
}

export default TableRow;
