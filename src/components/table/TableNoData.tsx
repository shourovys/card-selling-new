import { TABLE_ROW_HEIGHT } from '@/config/config';
import EmptyContent from '../common/EmptyContent';

interface IProps {
  isNotFound: boolean;
  tableRowPerPage?: number;
  tableRowHeight?: number;
}

export default function TableNoData({
  isNotFound,
  // tableRowPerPage = TABLE_ROW_PER_PAGE,
  tableRowHeight = TABLE_ROW_HEIGHT,
}: IProps) {
  if (isNotFound) {
    return (
      <div
        className='flex w-full min-w-max'
        style={{ height: 5 * tableRowHeight }}
      >
        <EmptyContent title='No Data Found!' />
      </div>
    );
  }
  return null;
}
