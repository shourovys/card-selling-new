import { TABLE_ROW_HEIGHT } from '@/config/config';

interface IProps {
  emptyRows: number;
}

export default function TableEmptyRows({ emptyRows }: IProps) {
  if (!emptyRows) {
    return null;
  }

  return (
    <tr
      style={{
        height: TABLE_ROW_HEIGHT * emptyRows,
      }}
    />
  );
}
