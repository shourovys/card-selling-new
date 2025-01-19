import { ReactNode } from 'react';

interface IProps {
  className?: string;
  children: ReactNode;
}

function TableData({ className, children }: IProps) {
  return (
    <td
      className={`font-normal px-1 whitespace-nowrap text-sm text-muted-foreground  ${className}`}
    >
      {children}
    </td>
  );
}

export default TableData;
