import { BaseError } from 'viem';

export default function ErrorInfo({
  prepareError,
  error,
  txError,
}: {
  prepareError: BaseError | null;
  error: BaseError | null;
  txError: BaseError | null;
}) {
  return (
    <>
      {txError && 'Transaction '}
      Error{prepareError && ' preparing'}:{' '}
      {(prepareError || error || txError)?.shortMessage || 'An error occurred'}
    </>
  );
}
