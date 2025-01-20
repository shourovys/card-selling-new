const Logo = ({ className }: { className?: string }) => {
  return (
    <svg
      width='32'
      height='32'
      viewBox='0 0 32 32'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      className={className}
    >
      <path
        d='M16 0C7.163 0 0 7.163 0 16s7.163 16 16 16 16-7.163 16-16S24.837 0 16 0z'
        fill='#FF0066'
      />
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M23.5 12.5v7c0 1.1-.9 2-2 2h-11c-1.1 0-2-.9-2-2v-7c0-1.1.9-2 2-2h11c1.1 0 2 .9 2 2zm-2 0h-11v7h11v-7z'
        fill='#FFFFFF'
      />
    </svg>
  );
};

export default Logo;
