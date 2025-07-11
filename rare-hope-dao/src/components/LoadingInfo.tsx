import { type Address } from 'viem';
import Etherscan from './Etherscan';

export default function LoadingInfo({
  hash,
  className = 'space-y-6',
}: {
  hash: Address | undefined;
  className?: string;
}) {
  return (
    <div className={className}>
      <div>处理交易中。。。</div>
      <div>
        <Etherscan hash={hash} />
      </div>
    </div>
  );
}
