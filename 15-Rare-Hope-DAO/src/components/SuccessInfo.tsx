import { type Address, type TransactionReceipt } from 'viem';
import Etherscan from './Etherscan';

export default function SuccessInfo({
  message,
  hash,
  className = 'space-y-6',
}: {
  message: string;
  hash: Address | undefined;
  receipt?: TransactionReceipt | undefined;
  className?: string;
}) {
  return (
    <div className={className}>
      <div>已{message}!</div>
      <div>
        <Etherscan hash={hash} />
      </div>
    </div>
  );
}
