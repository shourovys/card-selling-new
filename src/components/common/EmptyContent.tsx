import Image from 'next/image';

interface IProps {
  title: string;
  description?: string;
  img?: string;
}
export default function EmptyContent({ title, description, img }: IProps) {
  return (
    <div className='flex items-center justify-center flex-1'>
      <div className='space-y-2 text-center pt-1'>
        <Image
          className='w-40 h-full mx-auto'
          alt='empty content'
          src={img || '/empty-folder.png'}
          width={200}
          height={200}
        />

        <h2 className='font-medium text-gray-500'>{title}</h2>

        {description && <p className='text-sm text-gray-500'>{description}</p>}
      </div>
    </div>
  );
}
