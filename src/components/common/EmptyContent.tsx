import { cn } from '@/lib/utils';
interface IProps {
  title: string;
  description?: string;
  img?: string;
  className?: string;
  imageClassName?: string;
}
export default function EmptyContent({
  title,
  description,
  img,
  className,
  imageClassName,
}: IProps) {
  return (
    <div className={cn('flex flex-1 justify-center items-center', className)}>
      <div className='pt-1 space-y-2 text-center'>
        <img
          className={cn('mx-auto w-40 h-full', imageClassName)}
          alt='empty content'
          src={img || '/images/empty-folder.png'}
          width={200}
          height={200}
        />

        <h2 className='font-medium text-gray-500'>{title}</h2>

        {description && <p className='text-sm text-gray-500'>{description}</p>}
      </div>
    </div>
  );
}
