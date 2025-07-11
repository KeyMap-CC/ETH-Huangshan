import { useAccount } from 'wagmi';

export default function Etherscan({ hash }: { hash?: `0x${string}` }) {
  const { chain } = useAccount();
  const etherscan = chain?.blockExplorers?.default;

  return (
    <>
      {etherscan && (
        <a
          href={`${etherscan?.url}/tx/${hash}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-700"
        >
          {etherscan?.name}
        </a>
      )}
    </>
  );
}
