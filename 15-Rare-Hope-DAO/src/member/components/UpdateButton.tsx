import { RoleStatus } from '../../hooks/constants';

interface UpdateButtonProps {
  memberStatus: RoleStatus;
  onClick: () => void;
}

export default function UpdateButton({
  memberStatus,
  onClick,
}: UpdateButtonProps) {
  if (memberStatus !== RoleStatus.Active) return null;

  return (
    <button
      onClick={onClick}
      className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
    >
      更新
    </button>
  );
}
