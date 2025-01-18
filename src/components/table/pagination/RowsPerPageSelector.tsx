import { cn } from '@/lib/utils';
import { TSelectValue } from '@/types/components/common';
import Select from 'react-tailwindcss-select';

interface IProps {
  totalRows: number;
  rowsPerPage: number;
  onRowsPerPageChange?: (_rowsPerPage: number) => void;
  disabled?: boolean;
}

const RowsPerPageSelector: React.FC<IProps> = ({
  totalRows,
  rowsPerPage,
  onRowsPerPageChange,
  disabled,
}) => {
  const handleRowsPerPageChange = (selected: TSelectValue) => {
    if (onRowsPerPageChange && selected && !Array.isArray(selected)) {
      onRowsPerPageChange(Number(selected.value));
    }
  };

  return (
    <div className='items-center hidden gap-2 md:flex'>
      <h6 className='text-sm whitespace-nowrap text-[#667085]'>
        Rows Per Page:
      </h6>
      <Select
        primaryColor='#2166f0'
        value={{ label: rowsPerPage.toString(), value: rowsPerPage.toString() }}
        onChange={!disabled ? handleRowsPerPageChange : () => {}}
        isMultiple={false}
        isDisabled={!totalRows || disabled}
        classNames={{
          menuButton: (arg) =>
            cn(
              'flex items-center justify-center text-sm font-normal text-[#667085] border border-solid border-gray-300 h-[33px] w-[70px] pl-4 rounded-md focus:text-gray-700',
              !arg?.isDisabled &&
                'focus:bg-white focus:border-primary focus:outline-none ',
              arg?.isDisabled && 'important_disable_bg'
            ),
        }}
        options={[
          { value: '10', label: `10` },
          { value: '20', label: `20` },
          { value: '50', label: `50` },
          { value: '100', label: `100` },
        ]}
        formatOptionLabel={(data) => (
          <li
            className={`block transition duration-200 px-1 py-1 my-0.5 mx-2 cursor-pointer select-none rounded text-center ${
              !data.isSelected
                ? `text-[#667085] bg-primaryLight`
                : `bg-primary text-white`
            }`}
          >
            {data.label}
          </li>
        )}
        isClearable={false}
      />
    </div>
  );
};

export default RowsPerPageSelector;
