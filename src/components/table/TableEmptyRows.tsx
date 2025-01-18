import { TABLE_ROW_HEIGHT } from '../../utils/config';

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
