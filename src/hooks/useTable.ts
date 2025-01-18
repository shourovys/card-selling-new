import { TABLE_ROW_PER_PAGE } from '@/config/config';
import { useState } from 'react';

interface IProps {
  pageSize?: number;
  defaultOrderBy?: string;
  defaultOrder?: 'asc' | 'desc';
  defaultPage?: number;
  defaultRowsPerPage?: number;
  defaultSelected?: string[];
  onSort?: (orderBy: string, order: 'asc' | 'desc') => void;
  onSelectRow?: (selected: string[]) => void;
  onChangePage?: (page: number) => void;
  onChangeRowsPerPage?: (rowsPerPage: number) => void;
  onChangeDense?: (dense: boolean) => void;
}

const useTable = (props: IProps) => {
  const {
    pageSize = TABLE_ROW_PER_PAGE,
    defaultOrderBy = '',
    defaultOrder = 'desc',
    defaultPage = 1,
    defaultRowsPerPage = pageSize,
    defaultSelected = [],
    onSort,
    onSelectRow,
    onChangePage,
    onChangeRowsPerPage,
    onChangeDense,
  } = props;

  const [orderBy, setOrderBy] = useState(defaultOrderBy);
  const [order, setOrder] = useState<'asc' | 'desc'>(defaultOrder);
  const [page, setPage] = useState(defaultPage);
  const [rowsPerPage, setRowsPerPage] = useState(defaultRowsPerPage);
  const [selected, setSelected] = useState<string[]>(defaultSelected);
  const [dense, setDense] = useState(false);

  const handleSort = (newOrderBy: string, newOrder: 'asc' | 'desc') => {
    setOrderBy(newOrderBy);
    setOrder(newOrder);
    if (onSort) {
      onSort(newOrderBy, newOrder);
    }
  };

  const handleOrder = (newOrder: 'asc' | 'desc') => {
    setOrder(newOrder);
    if (onSort) {
      onSort(orderBy, newOrder);
    }
  };

  const handleSelectRow = (rowId: string) => {
    setSelected((prevSelected) => {
      const isSelected = prevSelected.includes(rowId);
      const newSelected = isSelected
        ? prevSelected.filter((id) => id !== rowId)
        : [...prevSelected, rowId];
      if (onSelectRow) {
        onSelectRow(newSelected);
      }
      return newSelected;
    });
  };

  const handleSelectAllRows = (selectAll: boolean, rowIds: string[]) => {
    const newSelected = selectAll ? rowIds : [];
    setSelected(newSelected);
    if (onSelectRow) {
      onSelectRow(newSelected);
    }
  };

  const handleChangePage = (newPage: number) => {
    setPage(newPage);
    if (onChangePage) {
      onChangePage(newPage);
    }
  };

  const handleChangeRowsPerPage = (newRowsPerPage: number) => {
    setRowsPerPage(newRowsPerPage);
    handleChangePage(1);
    if (onChangeRowsPerPage) {
      onChangeRowsPerPage(newRowsPerPage);
    }
  };

  const handleChangeDense = (isDense: boolean) => {
    setDense(isDense);
    if (onChangeDense) {
      onChangeDense(isDense);
    }
  };

  return {
    orderBy,
    order,
    page,
    rowsPerPage,
    selected,
    dense,
    handleSort,
    handleOrder,
    handleSelectRow,
    handleSelectAllRows,
    handleChangePage,
    handleChangeRowsPerPage,
    handleChangeDense,
  };
};

export default useTable;

export function emptyRows(
  page: number,
  rowsPerPage: number,
  arrayLength: number
): number {
  return page > 1 ? Math.max(0, page * rowsPerPage - arrayLength) : 0;
}
