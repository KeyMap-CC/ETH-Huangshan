import { useAccount } from 'wagmi';
import { RoleStatus } from '../../hooks/constants';

interface MemberDetailsProps {
  memberData: { name: string; info: string; exitNote: string };
  memberStatus: RoleStatus;
}

export default function MemberDetails({
  memberData,
  memberStatus,
}: MemberDetailsProps) {
  // Wallet connection status and address
  const { address } = useAccount();

  return (
    <div className="mt-4 rounded border p-4">
      <h3 className="mb-2 text-lg font-medium">您的成员信息</h3>
      <p>
        <strong>称呼:</strong> {memberData.name || '-'}
      </p>
      <p>
        <strong>钱包地址:</strong> {address}
      </p>
      <p>
        <strong>更多信息:</strong> {memberData.info || '-'}
      </p>
      <p>
        <strong>状态:</strong> {memberStatus}
      </p>
      <p>
        <strong>退出备注:</strong> {memberData.exitNote || '-'}
      </p>
    </div>
  );
}
