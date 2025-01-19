import LoadingSvg from './LoadingSvg';

interface IProps {
  size?: 'sm' | 'default' | 'lg';
}

function LoadingTextWithSvg({ size }: IProps) {
  return (
    <>
      <LoadingSvg size={size} />
      Loading...
    </>
  );
}

export default LoadingTextWithSvg;
