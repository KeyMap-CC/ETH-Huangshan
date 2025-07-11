import { useAccount } from 'wagmi';
import Warning from './Warning';

export default function ConnectionInfo() {
  const { address, isConnected } = useAccount();

  const message = 'Please connect wallet first.';

  return (
    <div>
      {isConnected ? (
        <div className="flex w-full flex-col items-center justify-center text-customFontColor">
          <div className="grid grid-cols-[200px,auto]">
            <span className="text-lg">Wallet address</span>
            <span className="text-md">{address}</span>
          </div>
        </div>
      ) : (
        <Warning message={message} />
      )}
    </div>
  );
}
