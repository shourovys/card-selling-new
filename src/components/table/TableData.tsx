import { ReactNode } from 'react';

interface IProps {
  className?: string;
  align?: 'center' | 'left' | 'right';
  children: ReactNode;
}

function TableData({ className, align = 'left', children }: IProps) {
  return (
    <td
      className={`text-sm font-normal px-1 whitespace-nowrap text-[#667085] text-${align} ${className}`}
    >
      {children}
    </td>
  );
}

export default TableData;
