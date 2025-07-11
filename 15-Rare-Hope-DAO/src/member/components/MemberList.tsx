import { useAccount } from 'wagmi';
import { RoleStatus } from '../../hooks/constants';
import { useReadDaoContractGetMembers } from '../../hooks/contractHooks';

export default function MemberList() {
  // Wallet connection status and address
  const { address, isConnected } = useAccount();

  const {
    data: membersData,
    isLoading,
    error,
  } = useReadDaoContractGetMembers({
    args: [RoleStatus.Active], // Only fetch Active members
  });

  const [addresses = [], names = [], infos = []] = membersData || [];

  if (isLoading) return <div>更新成员信息...</div>;
  if (error) return <div>错误: {error.message}</div>;

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
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {addresses.length === 0 ? (
            <tr>
              <td
                colSpan={3}
                className="px-6 py-4 text-center text-sm text-gray-500"
              >
                未找到成员
              </td>
            </tr>
          ) : (
            addresses.map((addr, index) => (
              <tr
                key={`${addr}-${index}`}
                className={`hover:bg-gray-50 ${
                  isConnected && addr.toLowerCase() === address?.toLowerCase()
                    ? 'bg-yellow-100'
                    : ''
                }`}
              >
                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-500">
                  {names[index] || '-'}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                  {addr}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                  {infos[index] || '-'}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
