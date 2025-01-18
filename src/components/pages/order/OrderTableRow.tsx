// OrderTableRow.tsx
import Checkbox from '@/components/atomic/Checkbox';
import TableData from '@/components/table/TableData';
import TableDataAction from '@/components/table/TableDataAction';
import TableRow from '@/components/table/TableRow';
import { cn } from '@/lib/utils';
import { IOrder } from '@/types/features/order';
import Icon, { checkIcon, copyIcon, threeDotsIcon } from '@/utils/icons';
import { format } from 'date-fns';
import { useState } from 'react';

interface IProps {
  row: IOrder;
  selected: string[];
  handleSelectRow: (selectedId: string) => void;
}

const OrderTableRow: React.FC<IProps> = ({
  row,
  selected,
  handleSelectRow,
}) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Copy text to clipboard with feedback for the copied field
  const handleCopyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    });
  };

  // Determine styles for payment status based on predefined mappings
  const getPaymentStatusStyles = (status: string) => {
    const styles: Record<string, string> = {
      Paid: 'text-[#0D894F] bg-[#E5F5EB]',
      Cancelled: 'text-[#FC0000] bg-[#F9F0F0]',
      Unpaid: 'text-[#FC0000] bg-[#F9F0F0]',
      Inprogress: 'text-[#DF9934] bg-[#FFF6EA]',
      Refunded: 'text-[#4698AF] bg-[#E2F9FF]',
    };
    return styles[status] || '';
  };

  // Determine styles for order status based on predefined mappings
  const getOrderStatusStyles = (status: string) => {
    const styles: Record<string, string> = {
      Processing: 'bg-[#E5EFFF]',
    };
    return styles[status] || 'bg-[#F3F8FC]';
  };

  // Format the date string into a readable date and time format
  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "PP 'at' p");
  };

  return (
    <TableRow key={row._id.$oid} selected={selected.includes(row._id.$oid)}>
      {/* Checkbox for row selection */}
      <TableDataAction selected={selected.includes(row._id.$oid)}>
        <Checkbox
          value={`select-row-${row._id.$oid}`}
          checked={selected.includes(row._id.$oid.toString())}
          onChange={() => handleSelectRow(row._id.$oid.toString())}
        />
      </TableDataAction>

      {/* Order ID with copy functionality */}
      <TableData>
        {row._id.$oid}
        <Icon
          icon={copiedField === 'id' ? checkIcon : copyIcon}
          className='text-primary text-base ml-1.5 cursor-pointer'
          onClick={() => handleCopyToClipboard(row._id.$oid, 'id')}
        />
      </TableData>

      {/* Order creation date */}
      <TableData>{formatDateTime(row.createdAt.$date)}</TableData>

      {/* Shipping information */}
      <TableData>
        <p>{row.shipping.name}</p>
        <div className='flex gap-2 items-center'>
          <p className='text-[#E46A11]'>{row.shipping.phone}</p>
          <Icon
            icon={copiedField === 'phone' ? checkIcon : copyIcon}
            className='text-base cursor-pointer text-primary'
            onClick={() => handleCopyToClipboard(row.shipping.phone, 'phone')}
          />
        </div>
        <p>
          {row.shipping.address}, {row.shipping.city}
        </p>
      </TableData>

      {/* Total order amount */}
      <TableData>৳ {row.totalAmount.grandTotal}</TableData>

      {/* Total quantity of items */}
      <TableData>
        {row.products.reduce((acc, product) => acc + product.quantity, 0)} items
      </TableData>

      {/* Payment status with styled badge */}
      <TableData>
        <span
          className={cn(
            getPaymentStatusStyles(row.payment.status),
            'px-3 py-[5px] rounded-full'
          )}
        >
          {row.payment.status}
        </span>
      </TableData>

      {/* Delivery partner */}
      <TableData>
        <img
          src='/pathao.png'
          alt='Pathao Logo'
          height={32}
          width={32}
          className='bg-[#F7F7F7] rounded-full mb-1 p-0.5'
        />
        Pathao
      </TableData>

      {/* Order status with styled badge */}
      <TableData>
        <span
          className={cn(
            getOrderStatusStyles(row.status),
            'px-3 py-[5px] rounded-full'
          )}
        >
          {row.status}
        </span>
      </TableData>

      {/* Action buttons */}
      <TableData className='pr-3 md:pr-5'>
        <div className='flex justify-end'>
          <div className='flex justify-center items-center w-9 text-base rounded-full aspect-square bg-primaryLight text-primary'>
            <Icon icon={threeDotsIcon} />
          </div>
        </div>
      </TableData>
    </TableRow>
  );
};

export default OrderTableRow;
