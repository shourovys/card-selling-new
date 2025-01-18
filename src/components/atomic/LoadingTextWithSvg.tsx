import { TButtonSize } from './Button';
import LoadingSvg from './LoadingSvg';

interface IProps {
  size?: TButtonSize;
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
