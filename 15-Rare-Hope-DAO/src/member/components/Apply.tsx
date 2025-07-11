import { useState } from 'react';
import { BaseError } from 'viem';
import { useWaitForTransactionReceipt } from 'wagmi';
import {
  useSimulateDaoContractApplyForMember,
  useWriteDaoContractApplyForMember,
} from '../../hooks/contractHooks';
import ButtonLayout from '../../components/ButtonLayout';
import LoadingInfo from '../../components/LoadingInfo';
import ErrorInfo from '../../components/ErrorInfo';
import SuccessInfo from '../../components/SuccessInfo';

export default function Apply() {
  // const [isProceed, setIsProceed] = useState(false);
  const [name, setName] = useState('');
  const [info, setInfo] = useState('');

  let isProceed = true;
  const { data, error: prepareError } = useSimulateDaoContractApplyForMember({
    args: name && info ? [name, info] : undefined,
    query: {
      enabled: isProceed,
    },
  });

  const {
    data: hash,
    isPending,
    error,
    writeContract,
  } = useWriteDaoContractApplyForMember();

  const {
    isLoading,
    isSuccess,
    error: txError,
  } = useWaitForTransactionReceipt({
    confirmations: 1,
    hash,
  });

  const handleSubmission = () => {
    // setIsProceed(true);
    writeContract(data!.request);
  };

  return (
    <div className="mt-4 rounded border p-4">
      <h3 className="mb-2 text-lg font-medium">申请成为新成员</h3>
      <form>
        <div className="mb-2">
          <label className="block text-sm font-medium text-gray-700">
            称呼
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded border p-2"
            required
          />
        </div>
        <div className="mb-2">
          <label className="block text-sm font-medium text-gray-700">
            更多信息
          </label>
          <input
            type="text"
            value={info}
            onChange={(e) => setInfo(e.target.value)}
            className="w-full rounded border p-2"
            required
          />
        </div>
        <span className="flex min-h-[40px] items-center">
          <ButtonLayout
            isProceed={isProceed}
            isPending={isPending}
            isLoading={isLoading}
            onClick={handleSubmission} // Pass handleSubmission as the click handler
            label="提交"
            loadingLabel="提交中"
          />
        </span>
      </form>

      {isLoading && (
        <div className="mt-6 grid grid-cols-[100px,700px]">
          <span></span>
          <LoadingInfo hash={hash} />
        </div>
      )}

      {(error || txError) && (
        <div className="mt-6 grid grid-cols-[100px,700px]">
          <span></span>
          <ErrorInfo
            prepareError={prepareError as BaseError}
            error={error as BaseError}
            txError={txError as BaseError}
          />
        </div>
      )}

      {isSuccess && (
        <div className="mt-6 grid grid-cols-[100px,700px]">
          <span></span>
          <SuccessInfo message={'申请'} hash={hash} />
        </div>
      )}
    </div>
  );
}
