import EmptyImage from '@/assets/images/empty-folder.png';
interface IProps {
  title: string;
  description?: string;
  img?: string;
}
export default function EmptyContent({ title, description, img }: IProps) {
  return (
    <div className='flex flex-1 justify-center items-center'>
      <div className='pt-1 space-y-2 text-center'>
        <img
          className='mx-auto w-40 h-full'
          alt='empty content'
          src={img || EmptyImage}
          width={200}
          height={200}
        />

        <h2 className='font-medium text-gray-500'>{title}</h2>

        {description && <p className='text-sm text-gray-500'>{description}</p>}
      </div>
    </div>
  );
}
