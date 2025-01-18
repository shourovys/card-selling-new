import React from 'react';

interface DisplayComponentProps {
  from: number;
  to: number;
  totalRows: number;
}

const DisplayComponent: React.FC<DisplayComponentProps> = ({
  from,
  to,
  totalRows,
}) => {
  return (
    <div>
      <p className='text-sm text-[#667085]'>
        Showing <span className='font-medium'>{from}</span> to{' '}
        <span className='font-medium'>{to}</span> of{' '}
        <span className='font-medium'>{totalRows}</span> results
      </p>
    </div>
  );
};

export default DisplayComponent;
