import { formatEther } from 'viem';
import { RoleStatus } from '../hooks/constants';
import { useReadDaoContractGetSponsors } from '../hooks/contractHooks';

export default function Sponsor() {
  const { data, isLoading, error } = useReadDaoContractGetSponsors({
    args: [RoleStatus.Active],
  });

  if (isLoading) return <div>更新赞助者信息...</div>;
  if (error) return <div>Error: {error.message}</div>;

  // Destructure the tuple with default empty arrays
  const [
    addresses = [],
    names = [],
    infos = [],
    isDelegated = [],
    totalAmounts = [],
    // Skip availableBalances and exitNotes
  ] = data || [];

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              称呼
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              钱包地址
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              更多信息
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              是否托管资金
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              总额
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {addresses.length === 0 ? (
            <tr>
              <td
                colSpan={5}
                className="px-6 py-4 text-center text-sm text-gray-500"
              >
                未找到赞助者
              </td>
            </tr>
          ) : (
            addresses.map((address, index) => (
              <tr key={address} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-mono text-sm text-gray-500">
                  {names[index] || '-'}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                  {address}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {infos[index] || '-'}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm">
                  <span
                    className={`rounded-full px-2 py-1 text-xs font-medium ${
                      isDelegated[index]
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {isDelegated[index] ? 'Delegated' : 'Not Delegated'}
                  </span>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                  {formatBalance(totalAmounts[index])}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

// Format token balance
function formatBalance(balance: bigint): string {
  const ethValue = formatEther(balance);
  const numericValue = parseFloat(ethValue);

  return (
    numericValue.toLocaleString('en-US', {
      minimumFractionDigits: 4,
      maximumFractionDigits: 4,
    }) + ' ETH'
  );
}
