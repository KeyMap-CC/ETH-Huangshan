import { RoleStatus } from '../hooks/constants';
import { useReadDaoContractGetReviewers } from '../hooks/contractHooks';

export default function Reviewer() {
  const { data, isLoading, error } = useReadDaoContractGetReviewers({
    args: [RoleStatus.Active],
  });

  if (isLoading) return <div>更新审核员信息...</div>;
  if (error) return <div>Error: {error.message}</div>;

  // Destructure the tuple or use fallbacks
  const [addresses = [], names = [], infos = []] = data || [];

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
                未找到审核员
              </td>
            </tr>
          ) : (
            addresses.map((address, index) => (
              <tr key={`${address}-${index}`} className="hover:bg-gray-50">
                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-500">
                  {names[index] || '-'}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                  {address}
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
