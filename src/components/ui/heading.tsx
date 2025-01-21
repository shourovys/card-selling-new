interface HeadingProps {
  title: string;
  description?: string;
}

export function Heading({ title, description }: HeadingProps) {
  return (
    <div>
      <h2 className='text-xl font-bold tracking-tight text-secondary'>
        {title}
      </h2>
      {description && (
        <p className='text-sm text-muted-foreground'>{description}</p>
      )}
    </div>
  );
}
