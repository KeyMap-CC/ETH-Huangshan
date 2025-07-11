import { ReactNode } from 'react';
import { useAccount } from 'wagmi';
import Warning from './Warning';

export default function ConnectionWrapper({
  children,
}: {
  children: ReactNode;
}) {
  const { isConnected } = useAccount();
  const message = 'Please connect wallet first.';

  return <div>{isConnected ? children : <Warning message={message} />}</div>;
}
